import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { UserPlus } from '@phosphor-icons/react'
import { InviteModal } from '../../features/workspaces/components/InviteModal'
import { workspaceService } from '../../features/workspaces/services/workspace.service'
import { Member, WorkspaceRole } from '../../features/workspaces/types/workspace.type'
import Avatar from '../../assets/avatar.png';
import { useWorkspaceDetail } from '../../features/workspaces/hooks/useWorkspaceDetail'
import { DeleteConfirmModal } from '../../shared/components/ui/DeleteConfirmModal'
import { can } from '../../helper/can-permission'
import { errorToast, successDeleteToast, successToast } from '../../shared/components/ui/Toast';
import { MembersTable, MembersTableColumn, RoleCell, RemoveButton } from '../../shared/components/ui/Table';
import { useAuthStore } from '../../shared/hooks/useAuthStore'

// ─── Main Page ────────────────────────────────────────────────────────────────

export function WorkspaceMembersPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { workspace } = useWorkspaceDetail(workspaceId)
  const permissions  = workspace?.currentUserAccess?.permissions ?? [];
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?._id;



  const canInvite     = can(permissions, 'workspace:invite_member')
  const canChangeRole = can(permissions, 'workspace:change_member_role')
  const canRemove     = can(permissions, 'workspace:remove_member')

  const [members, setMembers]               = useState<Member[]>([])
  const [isLoading, setIsLoading]           = useState(true)
  const [showInvite, setShowInvite]         = useState(false)
  const [roleMenuId, setRoleMenuId]         = useState<string | null>(null)
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting]         = useState(false)

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return
    setIsLoading(true)
    try {
      const data = await workspaceService.getMembers(workspaceId)
      setMembers(data)
    } finally {
      setIsLoading(false)
    }
  }, [workspaceId])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const handleRoleChange = async (userId: string, role: WorkspaceRole) => {
    if (!workspaceId) return
    try {
      await workspaceService.changeMemberRole(workspaceId, userId, role)
      await fetchMembers()
      successToast('Role updated successfully')
    } catch {
      errorToast('Failed to update role')
    }
    setRoleMenuId(null)
  }

  const handleRemove = async () => {
    if (!workspaceId || !pendingRemoveId) return
    setIsDeleting(true)
    try {
      await workspaceService.removeMember(workspaceId, pendingRemoveId)
      await fetchMembers()
      successDeleteToast('Member removed')
    } catch {
      errorToast('Failed to remove member')
    } finally {
      setIsDeleting(false)
      setPendingRemoveId(null)
    }
  }

  // ─── Column definitions ───────────────────────────────────────────────────

  const columns: MembersTableColumn<Member>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '1fr',
      render: (member) => {
        const user = member.userId
        const isSelf = user?._id === currentUserId
        return (
          <div className="flex items-center gap-3 min-w-0">
            <img
              className={`w-9 h-9 text-xs rounded-full flex items-center justify-center font-semibold shrink-0`}
              src={Avatar}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {user?.fullName ?? user?.email}
                {isSelf && (
                  <span className="ml-1.5 text-xs font-normal text-stone-400">(You)</span>
                )}
              </p>
              {user?.fullName && (
                <p className="text-xs text-stone-400 truncate">{user.email}</p>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: 'owner',
      header: 'Owner',
      width: '180px',
      render: (member) => {
        const user = member.userId
        const role = member.roleId?.name
        return (
          <RoleCell
            role={role}
            memberId={member._id}
            userId={user?._id}
            canChange={canChangeRole}
            isOpen={roleMenuId === member._id}
            onToggle={() => setRoleMenuId(roleMenuId === member._id ? null : member._id)}
            onClose={() => setRoleMenuId(null)}
            onSelect={(r) => handleRoleChange(user?._id, r)}
          />
        )
      },
    },
    ...(canRemove
      ? [{
          key: 'actions',
          header: 'Actions',
          width: '80px',
          render: (member: Member) => {
            const user = member.userId
            const isSelf = user?._id === currentUserId
            return (
              <RemoveButton
                show={!isSelf}
                onClick={() => setPendingRemoveId(user?._id)}
              />
            )
          },
        }]
      : []),
  ]

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center justify-center gap-3 ">
          <h1 className="text-[29px] text-2xl font-semi-bold text-stone-900">Members</h1>
          <span className="h-5 w-px bg-stone-200" />
          <span className="text-[20px] text-sm text-stone-400 font-semi-bold">Total {members.length}</span>
        </div>
        {canInvite && (
          <button
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-semi-bold rounded-xl hover:bg-stone-700 transition-colors"
          >
            <UserPlus size={16} weight="bold" />
            Invite member
          </button>
        )}
      </div>

      {/* Table */}
      <MembersTable
        rows={members}
        columns={columns}
        getRowKey={(m) => m._id}
        empty="No members yet"
      />

      {/* Overlay to close role dropdown */}
      {roleMenuId && (
        <div className="fixed inset-0 z-[5]" onClick={() => setRoleMenuId(null)} />
      )}

      {/* Invite modal */}
      {showInvite && workspaceId && (
        <InviteModal
          workspaceId={workspaceId}
          onClose={() => setShowInvite(false)}
          onInvited={fetchMembers}
        />
      )}

      {/* Delete confirmation */}
      <DeleteConfirmModal
        open={!!pendingRemoveId}
        loading={isDeleting}
        title="Remove member?"
        description="This will remove the member from this workspace and revoke their workspace access."
        onClose={() => setPendingRemoveId(null)}
        onConfirm={handleRemove}
      />
    </div>
  )
}

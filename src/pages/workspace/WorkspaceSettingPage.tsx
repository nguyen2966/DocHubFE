import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash } from '@phosphor-icons/react';
import { Button } from '../../shared/components/ui/Button';
import { useWorkspaceDetail } from '../../features/workspaces/hooks/useWorkspaceDetail';
import { workspaceService } from '../../features/workspaces/services/workspace.service';
import { CheckCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { DeleteWorkspaceModal } from '../../features/workspaces/components/DeleteWorkspaceModal';
import { successDeleteToast, successToast } from '../../shared/components/ui/Toast';

export function WorkspaceSettingsPage() {
  const { workspaceId } = useParams()
  const { workspace } = useWorkspaceDetail(workspaceId)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [initialName, setInitialName] = useState('');
  const [initialDescription, setInitialDescription] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const handleDeleteWorkspace = async () => {
    if (!workspaceId || isDeleting) return

    setIsDeleting(true);

    try {
      await workspaceService.deleteWorkspace(workspaceId);

      navigate('/')

      successDeleteToast("Delete workspace successfully");
    } catch {
      toast.error('Failed to delete workspace')
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    if (!workspace) return

    setName(workspace.name ?? '');
    setDescription(workspace.description ?? '');

    setInitialName(workspace.name ?? '');
    setInitialDescription(workspace.description ?? '');
  }, [workspace])

  const isNameTooLong = name.length > 60;
  const isNameEmpty = name.trim().length === 0;

  const isChanged =
    name !== initialName || description !== initialDescription

  const canSave =
    isChanged && !isNameTooLong && !isNameEmpty && !isSaving

  const handleSave = async () => {
    if (!workspaceId || !canSave) return;

    setIsSaving(true);

    try {
      const result = await workspaceService.updateWorkspace(workspaceId, {
        name: name.trim(),
        description,
      })

      setName(result.data.name);
      setDescription(result.data.description ?? '');
      setInitialName(result.data.name);
      setInitialDescription(result.data.description);

      successToast("Update workspace successfully");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="relative max-w-6xl">

      <h1 className="text-2xl font-semibold text-stone-950">
        Workspace settings
      </h1>

      <section className="mt-7 rounded-xl border border-stone-200 bg-white px-5 py-5">
        <h2 className="text-base font-medium text-stone-950">General</h2>
        <p className="mt-1 text-sm text-stone-500">
          Manage your workspace name, domains, and more
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium text-stone-950">
            Workspace name <span className="text-red-500">*</span>
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={[
              'mt-2 h-9 w-full rounded-lg border px-3 text-sm text-stone-900 outline-none',
              isNameTooLong
                ? 'border-red-500 focus:border-red-500'
                : 'border-stone-200 focus:border-stone-400',
            ].join(' ')}
          />

          {isNameTooLong && (
            <p className="mt-1 text-xs text-red-500">
              Workspace name must be 60 characters or fewer
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-stone-950">
            Description{' '}
            <span className="font-normal italic text-stone-500">
              (Optional)
            </span>
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this Workspace for?"
            className="mt-2 h-14 w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-400"
          />
        </div>

        <div className="mt-5">
          <Button onClick={handleSave} disabled={!canSave}>
            <span className="leading-none">
              {isSaving ? 'Saving...' : 'Save changes'}
            </span>
          </Button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-stone-200 bg-white px-5 py-5">
        <h2 className="text-base font-medium text-stone-950">Danger zone</h2>

        <p className="mt-1 text-sm text-stone-500">
          Deleting this workspace will permanently remove all documents,
          settings, and member access. This action cannot be undone.
        </p>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          <Trash size={16} weight="bold" />
          Delete Workspace
        </button>

        <DeleteWorkspaceModal
          open={isDeleteModalOpen}
          isDeleting={isDeleting}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteWorkspace}
        />
      </section>
    </div>
  )
}
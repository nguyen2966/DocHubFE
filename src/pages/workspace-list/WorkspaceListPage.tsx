import { useState } from 'react';
import { Header } from '../../shared/components/Header';
import { useWorkspaces } from '../../features/workspaces/hooks/useWorkspace';
import { WorkspaceGrid } from '../../features/workspaces/components/WorkspaceGrid';
import { CreateWorkspaceModal } from '../../features/workspaces/components/CreateWorkspaceModal';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '../../shared/components/ui/Button';
import { InviteModal } from '../../features/workspaces/components/InviteModal'; // Đảm bảo đúng đường dẫn import InviteModal của bạn

export function WorkspaceListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // State quản lý việc mở InviteModal cho workspace cụ thể
  const [activeInviteWorkspaceId, setActiveInviteWorkspaceId] = useState<string | null>(null);
  const { workspaces, isLoading, error } = useWorkspaces();

  return (
    <div className="min-h-screen w-full max-w-[1440px] mx-auto bg-white flex flex-col">
      <Header showFunctions />

      <main className="flex w-full flex-col items-start p-0 min-h-[704px] grow">

        <div className="flex w-full flex-row items-end justify-between px-14 pt-10 pb-6 self-stretch">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight leading-none">
              Workspace
            </h1>
            <p className="text-sm text-stone-500 mt-1.5">
              Create and manage your Workspaces
            </p>
          </div>

          <Button className='flex items-center gap-2'
            onClick={() => setIsCreateOpen(true)}
            disabled={false}
          >
            <PlusIcon className="w-5 h-5 shrink-0 align-middle" aria-hidden="true" />
            <span className="leading-none">Create Workspace</span>
          </Button>
        </div>

        <div className="w-full px-14 py-2">
          {isLoading && (
            <p className="text-sm text-stone-500">Loading workspaces...</p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {!isLoading && !error && (
            <WorkspaceGrid
              workspaces={workspaces}
              onCreateClick={() => setIsCreateOpen(true)}
              // Truyền hàm callback tiếp nhận sự kiện nhấn nút + xuống Grid
              onInviteClick={(id) => setActiveInviteWorkspaceId(id)}
            />
          )}
        </div>
      </main>

      <CreateWorkspaceModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Hiển thị InviteModal khi có một workspaceId được lựa chọn */}
      {activeInviteWorkspaceId && (
        <InviteModal
          workspaceId={activeInviteWorkspaceId}
          onClose={() => setActiveInviteWorkspaceId(null)}
          onInvited={() => {
            // Callback sau khi invite thành công (ví dụ: thông báo hoặc reload nếu cần)
            setActiveInviteWorkspaceId(null);
          }}
        />
      )}
    </div>
  );
}
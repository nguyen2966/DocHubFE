import { Navigate, Outlet, useParams } from 'react-router-dom'
import { Header } from '../shared/components/Header'
import { useWorkspaceDetail } from '../features/workspaces/hooks/useWorkspaceDetail'
import { WorkspaceSidebar } from '../shared/components/SideBar'

export function WorkspaceLayout() {
  const { workspaceId } = useParams();
  const { workspace, isLoading, error, status } = useWorkspaceDetail(workspaceId);
  const permissions = workspace?.currentUserAccess?.permissions ?? [];

  if (isLoading) return null
  if (status === 401) return <Navigate to="/401" replace />
  if (status === 400 || status === 404) return <Navigate to="/404" replace />
  if (error) return <Navigate to="/403" replace />

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Top Header luôn tràn màn hình (hoặc theo cấu trúc chung của Header) */}
      <Header showFunctions />

      {/* 2. Khung dưới: Để w-full flex để đường kẻ dọc Sidebar khớp 100% với Header */}
      <div className="flex flex-1 w-full">
        
        {/* Sidebar */}
        <WorkspaceSidebar 
          workspace={workspace} 
          permissions={permissions} 
          workspaceId={workspaceId} 
        />

        {/* Dynamic Route Content - Chỉnh lại padding gọn gàng, thoáng đãng */}
        <main className="flex-1 px-10 py-8 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

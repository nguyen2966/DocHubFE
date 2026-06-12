import { Navigate, useParams } from 'react-router-dom';
import { useWorkspaceDetail } from '../../../features/workspaces/hooks/useWorkspaceDetail';
import { can } from '../../../helper/can-permission';

export function RequireWorkspacePermission({
  permission,
  children,
}: Omit<Props, 'workspaceId'>) {
  const { workspaceId } = useParams();
  const { workspace, isLoading, error } = useWorkspaceDetail(workspaceId);

  if (isLoading) return null
  if (error) return <Navigate to="/403" replace />

  const permissions = workspace?.currentUserAccess?.permissions ?? [];
 // console.log(workspace);

  if (!can(permissions, permission)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
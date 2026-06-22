import api from '../../../shared/lib/axios';
import {
  Workspace,
  WorkspaceListResponse,
  Member,
  UserSearchResult,
  InviteResult,
  WorkspaceRole
} from '../types/workspace.type';

export const workspaceService = {
  getWorkspaces(params?: { page?: number; limit?: number }) {
    return api.get<WorkspaceListResponse>('/workspaces', {
      params,
    }).then((res) => res.data)
  },

  getWorkspace(workspaceId: string) {
    return api
      .get<Workspace>(`/workspaces/${workspaceId}`)
      .then((res) => res.data)
  },
  createWorkspace(payload: CreateWorkspacePayload) {
    return api.post<Workspace>('/workspaces', payload)
  },

  updateWorkspace(workspaceId: string, payload: UpdateWorkspacePayload) {
    return api.patch<Workspace>(`/workspaces/${workspaceId}`, payload)
  },

  deleteWorkspace(workspaceId: string) {
    return api.delete(`/workspaces/${workspaceId}`)
  },
  getMembers(workspaceId: string) {
    return api.get<Member[]>(`/workspaces/${workspaceId}/members`).then(r =>r.data)
  },

  searchUsers(email: string, workspaceId: string) {
    return api.get<UserSearchResult[]>('/search/search', { params: { email, workspaceId } }).then(r => r.data);
  },

  inviteMembers(workspaceId: string, emails: string[], role: 'admin' | 'member') {
    return api.post<InviteResult[]>(`/workspaces/${workspaceId}/invitations`, { emails, role }).then(r => r.data)
  },

  changeMemberRole(workspaceId: string, targetUserId: string, role: WorkspaceRole){
    return api
    .patch<Member>(`/workspaces/${workspaceId}/members/${targetUserId}/role`,{ role },).then(r => r.data);
  },
  
  removeMember(workspaceId: string, targetUserId: string){
    return api.delete(`/workspaces/${workspaceId}/members/${targetUserId}`).then(r => r.data);
  }

}

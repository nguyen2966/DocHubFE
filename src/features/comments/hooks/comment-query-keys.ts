export const commentThreadKeys = {
  all: ['comment-threads'] as const,

  list: (workspaceId: string, documentId: string) =>
    ['comment-threads', workspaceId, documentId] as const,
}
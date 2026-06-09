import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(60, 'Workspace name must be less than 60 characters'),
  description: z.string().optional(),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>
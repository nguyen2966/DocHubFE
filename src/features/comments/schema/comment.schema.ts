import { z } from 'zod'

export const commentContentSchema = z
  .string()
  .trim()
  .min(1, 'Comment is required')
  .max(5000, 'Comment must be 5000 characters or fewer')

export const commentFormSchema = z.object({
  content: commentContentSchema,
})

export type CommentFormValues = z.infer<typeof commentFormSchema>

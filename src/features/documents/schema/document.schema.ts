import { z } from 'zod'

const documentTitleSchema = z
  .string()
  .trim()
  .min(1, 'Document name is required')
  .max(255, 'Document name must be 255 characters or fewer')

export const createMarkdownDocumentSchema = z.object({
  title: documentTitleSchema,

  markdownContent: z
    .string()
    .max(50000, 'Markdown content must be 50,000 characters or fewer'),
})

export const uploadPdfDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .max(255, 'Document name must be 255 characters or fewer')
    .optional(),

  file: z
    .instanceof(File, { message: 'Please select a PDF file' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Only PDF files are supported',
    })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: 'PDF file must be 20MB or smaller',
    }),
})

export const renameDocumentSchema = z.object({
  title: documentTitleSchema,
})

export const shareDocumentSchema = z.object({
  userId: z.string().min(1, 'Please select a user'),

  role: z.enum(['editor', 'commenter', 'viewer'], {
    message: 'Role is invalid',
  }),
})

export type CreateMarkdownDocumentFormValues = z.infer<
  typeof createMarkdownDocumentSchema
>

export type UploadPdfDocumentFormValues = z.infer<
  typeof uploadPdfDocumentSchema
>

export type RenameDocumentFormValues = z.infer<typeof renameDocumentSchema>

export type ShareDocumentFormValues = z.infer<typeof shareDocumentSchema>

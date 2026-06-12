import { z } from 'zod'

export const createMarkdownDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên tài liệu')
    .max(100, 'Tên tài liệu tối đa 100 ký tự'),

  markdownContent: z
    .string()
    .max(50000, 'Nội dung Markdown tối đa 50,000 ký tự'),
})

export const uploadPdfDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .max(60, 'Tên tài liệu tối đa 60 ký tự')
    .optional(),

  file: z
    .instanceof(File, { message: 'Vui lòng chọn file PDF' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Chỉ hỗ trợ file PDF',
    })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: 'File PDF tối đa 20MB',
    }),
})

export const renameDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên tài liệu')
    .max(100, 'Tên tài liệu tối đa 60 ký tự'),
})

export const shareDocumentSchema = z.object({
  userId: z.string().min(1, 'Vui lòng chọn người dùng'),

  role: z.enum(['editor', 'commenter', 'viewer'], {
    message: 'Role không hợp lệ',
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
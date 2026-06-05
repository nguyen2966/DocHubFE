import { z } from 'zod'

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên ít nhất 2 ký tự").max(100),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu ít nhất 8 ký tự"),
    confirmPassword: z.string(),
    agreed: z.boolean().refine((value) => value === true, {
      message: "Vui lòng đồng ý với điều khoản",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
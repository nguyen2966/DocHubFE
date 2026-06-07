import { z } from 'zod'

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Must be at least 2 characters long").max(100),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters long"),
    confirmPassword: z.string(),
    agreed: z.boolean().refine((value) => value === true, {
      message: "Please agree with Terms of Service and Privacy Policy ",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
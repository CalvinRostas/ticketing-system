import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("error.invalidLogin"),
  password: z.string("error.invalidLogin").min(4, "error.invalidLogin"),
})

export const registerSchema = z.object({
  email: z.email("error.noValidEmail"),
  password: z.string().min(8, "error.noValidPassword"),
  firstname: z.string().optional(),
  lastname: z.string().optional()
})
import * as z from "zod";

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Name must be more than two characters" }),
  username: z
    .string()
    .min(2, { message: "Username must be more than two characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

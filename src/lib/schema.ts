import z from "zod";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];


// ----------------------------------------
// REGISTER SCHEMA
// ----------------------------------------
export const registerFormSchema = z
  .object({
    username: z
      .string()
      .trim() // ✅ automatically removes spaces at start and end
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .regex(/^[A-Za-z_]/, "Username cannot start with a number"),

    full_name: z
      .string()
      .min(3, "Full name must be at least 3 characters long")
      .regex(/^[A-Za-z ]+$/, "Full name can only contain letters and spaces"),

    email: z
    .email("Please enter a valid email address")
    .min(8, "Email is too short"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
      .regex(/[0-9]/, "Password must include at least one number (0-9)")
      .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),

    confirm_password: z.string(),
    avatar: z.any().optional(),
    // avatar: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password Mismatch",
    path: ["confirm_password"],
  })

.superRefine((data, ctx) => {
  const files = data.avatar as FileList | undefined;
  if (files && files.length > 0 && files instanceof FileList) {
    const file = files[0];

    if (file.size > MAX_IMAGE_SIZE) {
      ctx.addIssue({
        code: "custom",
        path: ["avatar"],
        message: `Avatar size must be less than ${
          MAX_IMAGE_SIZE / 1024 / 1024
        } MB`,
      });
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: "custom",
        path: ["avatar"],
        message: "Invalid image type",
      });
    }
  }
});

export type RegisterSchema = z.infer<typeof registerFormSchema>;

export const registerVendorShema = z.object({
  brand_email: z.email().min(3),
  brand_name: z.string().min(3),
  avatar: z.any().optional(),
});

export type RegisterVendorSchema = z.infer<typeof registerVendorShema>;


// ----------------------------------------
// LOGIN SCHEMA
// ----------------------------------------
export const loginSchema = z.object({
  email: z
    .string()
    .min(3, "Username or email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;


// ----------------------------------------
// USER SETTINGS SCHEMA
// ----------------------------------------
export const userSettingsSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .regex(/^[A-Za-z_]/, "Username cannot start with a number"),

    full_name: z
      .string()
      .min(3, "Full name must be at least 3 characters long")
      .regex(/^[A-Za-z ]+$/, "Full name can only contain letters and spaces"),

    email: z
      .string()
      .email("Please enter a valid email address")
      .min(8, "Email is too short"),

    /**
     * Optional password
     * BUT if provided → must meet full security rules
     */
    password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 8,
        "Password must be at least 8 characters long"
      )
      .refine(
        (val) => !val || /[A-Z]/.test(val),
        "Password must contain at least one uppercase letter (A-Z)"
      )
      .refine(
        (val) => !val || /[a-z]/.test(val),
        "Password must contain at least one lowercase letter (a-z)"
      )
      .refine(
        (val) => !val || /[0-9]/.test(val),
        "Password must include at least one number (0-9)"
      )
      .refine(
        (val) => !val || /[^A-Za-z0-9]/.test(val),
        "Password must include at least one special character"
      ),

    avatar: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    const file = data.avatar;

    if (file instanceof File) {
      if (file.size > MAX_IMAGE_SIZE) {
        ctx.addIssue({
          code: "custom",
          path: ["avatar"],
          message: `Avatar size must be less than ${
            MAX_IMAGE_SIZE / 1024 / 1024
          } MB`,
        });
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: "custom",
          path: ["avatar"],
          message: "Invalid image type",
        });
      }
    }
  });

export type UserSettingsSchema = z.infer<typeof userSettingsSchema>;


// ----------------------------------------
// CREATE COURSE SCHEMA
// ----------------------------------------
export const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description must not exceed 1000 characters"),

  category_id: z
    .string()
    .nonempty("Category is required")
    .uuid("Invalid category selected"),

  level: z
    .enum(["Beginner", "Intermediate", "Advanced"])
    .refine((val) => val !== undefined, {
      message: "Please select a course level",
  }),

  duration: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[0-9]+\s?(weeks|week|months|month)$/i.test(v),
      { message: "Duration must be like '12 weeks' or '3 months'" }
    ),

  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => /^\d{1,9}$/.test(v.replace(/,/g, "")), {
      message:
        "Enter a valid price (numbers only, up to 9 digits)",
    }),

  image: z
    .instanceof(File, {
      message: "Please upload a course image",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message:
        "Image format must be JPEG, JPG, PNG, or WEBP",
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image size must not exceed 2MB",
    }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;


// ----------------------------------------
// FORGOT PASSWORD SCHEMA
// ----------------------------------------
export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address").min(8, "Email is too short"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// -----------------------------------------
// RESET PASSWORD SCHEMA
// -----------------------------------------
export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
      .regex(/[0-9]/, "Password must include at least one number (0-9)")
      .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password Mismatch",
    path: ["confirm_password"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
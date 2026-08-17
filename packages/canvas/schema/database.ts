import { z } from 'zod';

/**
 * Canvas LMS entity shapes for Corsair DB cache (`ctx.db.*`).
 * Field names match Canvas REST API docs: https://canvas.instructure.com/doc/api/
 * Loose + catchall — API responses often include extra fields.
 */
const idSchema = z.union([z.string(), z.number()]);

export const CanvasCourse = z
	.object({
		id: idSchema.optional(),
		name: z.string().optional(),
		course_code: z.string().optional(),
		uuid: z.string().optional(),
		sis_course_id: z.string().nullable().optional(),
		account_id: idSchema.optional(),
		root_account_id: idSchema.optional(),
		workflow_state: z.string().optional(),
	})
	.catchall(z.unknown());
export type CanvasCourse = z.infer<typeof CanvasCourse>;

export const CanvasAccount = z
	.object({
		id: idSchema.optional(),
		name: z.string().optional(),
		uuid: z.string().optional(),
		parent_account_id: idSchema.nullable().optional(),
		root_account_id: idSchema.optional(),
		sis_account_id: z.string().nullable().optional(),
		workflow_state: z.string().optional(),
	})
	.catchall(z.unknown());
export type CanvasAccount = z.infer<typeof CanvasAccount>;

export const CanvasUser = z
	.object({
		id: idSchema.optional(),
		name: z.string().optional(),
		sortable_name: z.string().optional(),
		short_name: z.string().optional(),
		sis_user_id: z.string().nullable().optional(),
		login_id: z.string().optional(),
		email: z.string().optional(),
	})
	.catchall(z.unknown());
export type CanvasUser = z.infer<typeof CanvasUser>;

export const CanvasAssignment = z
	.object({
		id: idSchema.optional(),
		name: z.string().optional(),
		course_id: idSchema.optional(),
		due_at: z.string().nullable().optional(),
		points_possible: z.number().nullable().optional(),
		published: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type CanvasAssignment = z.infer<typeof CanvasAssignment>;

export const CanvasEnrollment = z
	.object({
		id: idSchema.optional(),
		user_id: idSchema.optional(),
		course_id: idSchema.optional(),
		type: z.string().optional(),
		enrollment_state: z.string().optional(),
		role: z.string().optional(),
	})
	.catchall(z.unknown());
export type CanvasEnrollment = z.infer<typeof CanvasEnrollment>;

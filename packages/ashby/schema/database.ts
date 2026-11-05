import { z } from 'zod';

/**
 * Locally persisted Ashby entities.
 *
 * Slow-changing structural records are mirrored: candidates, applications, jobs,
 * job postings, offers, departments, locations, and users.
 */

const S = z.string().nullable().optional();
const B = z.boolean().nullable().optional();
const N = z.number().nullable().optional();

export const AshbyCandidateEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		primary_email_address: S,
		primary_phone_number: S,
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		application_ids: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type AshbyCandidateEntity = z.infer<typeof AshbyCandidateEntity>;

export const AshbyApplicationEntity = z
	.object({
		id: z.string(),
		candidate_id: z.string(),
		job_id: z.string(),
		status: S,
		current_interview_stage_id: S,
		archive_reason_id: S,
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();
export type AshbyApplicationEntity = z.infer<typeof AshbyApplicationEntity>;

export const AshbyJobEntity = z
	.object({
		id: z.string(),
		title: z.string(),
		status: S,
		department_id: S,
		location_id: S,
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();
export type AshbyJobEntity = z.infer<typeof AshbyJobEntity>;

export const AshbyJobPostingEntity = z
	.object({
		id: z.string(),
		title: z.string(),
		job_id: z.string(),
		department_id: S,
		location_id: S,
		is_listed: B,
		published_date: z.coerce.date().nullable().optional(),
	})
	.loose();
export type AshbyJobPostingEntity = z.infer<typeof AshbyJobPostingEntity>;

export const AshbyOfferEntity = z
	.object({
		id: z.string(),
		application_id: z.string(),
		status: S,
		salary: N,
		currency: S,
		start_date: z.coerce.date().nullable().optional(),
		created_at: z.coerce.date().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();
export type AshbyOfferEntity = z.infer<typeof AshbyOfferEntity>;

export const AshbyDepartmentEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		parent_id: S,
		is_archived: B,
	})
	.loose();
export type AshbyDepartmentEntity = z.infer<typeof AshbyDepartmentEntity>;

export const AshbyLocationEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		parent_id: S,
		is_archived: B,
	})
	.loose();
export type AshbyLocationEntity = z.infer<typeof AshbyLocationEntity>;

export const AshbyUserEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		global_role: S,
		is_enabled: B,
	})
	.loose();
export type AshbyUserEntity = z.infer<typeof AshbyUserEntity>;

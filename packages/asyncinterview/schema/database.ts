import { z } from 'zod';
import { Id, N, S } from './primitives';

/**
 * Field names match official JSON keys.
 *
 * Live Laravel API (Bearer token, captured 2026-08-19):
 *   GET  https://app.asyncinterview.ai/api/jobs
 *   GET  https://app.asyncinterview.ai/api/interviews
 *   GET  https://app.asyncinterview.ai/api/interviews?job_id={id}
 *   PUT  https://app.asyncinterview.ai/api/jobs/{id}
 *   DELETE https://app.asyncinterview.ai/api/jobs/{id}
 *
 * GET /jobs/{id} is 405 — supported methods are PUT and DELETE only.
 * GET /jobs/{id}/responses is 404; responses live on GET /interviews.
 *
 * Agent docs (input field names for write ops):
 *   https://app.asyncinterview.ai/docs
 *
 * Jobs and interviews are the slow-changing hiring records this plugin
 * mirrors. GET /me is the current team and includes payment/webhook
 * secrets — it is not persisted.
 */

/**
 * GET /api/jobs item, plus fields from PUT /api/jobs/{id}.
 * List payloads omit team/slug/timestamps; PUT returns them.
 * `is_public` is a 0/1 flag, not a JSON boolean.
 *
 * Write-only input names from ASYNC_INTERVIEW_UPDATE_JOB
 * (`description`, `sub_title`) are accepted on PUT; the live PUT
 * response still returns them as null when unset.
 */
export const AsyncInterviewJobEntity = z
	.object({
		id: Id,
		title: S,
		date: S,
		time: S,
		datetime: S,
		team_id: N,
		sub_title: S,
		description: S,
		is_public: z
			.union([z.literal(0), z.literal(1), z.boolean()])
			.nullable()
			.optional(),
		created_at: S,
		updated_at: S,
		slug: S,
		public_job_url: S,
	})
	.loose();
export type AsyncInterviewJobEntity = z.infer<typeof AsyncInterviewJobEntity>;

/**
 * Nested `questions[]` on GET /api/interviews.
 * `stage_id` is the parent interview id.
 */
export const AsyncInterviewQuestionEntity = z
	.object({
		id: Id,
		stage_id: N,
		title: S,
		created_at: S,
		updated_at: S,
		order: N,
	})
	.loose();
export type AsyncInterviewQuestionEntity = z.infer<
	typeof AsyncInterviewQuestionEntity
>;

/**
 * Nested `contacts[]` on GET /api/interviews — candidate details.
 * The live tenant had an empty array; extra keys stay via .loose().
 */
export const AsyncInterviewContactEntity = z
	.object({
		id: N,
		name: S,
		email: S,
		first_name: S,
		last_name: S,
		phone: S,
	})
	.loose();
export type AsyncInterviewContactEntity = z.infer<
	typeof AsyncInterviewContactEntity
>;

/** GET /api/interviews item — interview response with candidate details. */
export const AsyncInterviewInterviewEntity = z
	.object({
		id: Id,
		title: S,
		url: S,
		job_id: N,
		job: S,
		date: S,
		time: S,
		datetime: S,
		questions: z.array(AsyncInterviewQuestionEntity).nullable().optional(),
		contacts: z.array(AsyncInterviewContactEntity).nullable().optional(),
	})
	.loose();
export type AsyncInterviewInterviewEntity = z.infer<
	typeof AsyncInterviewInterviewEntity
>;

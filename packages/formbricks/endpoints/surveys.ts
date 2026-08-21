import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { FormbricksSurveyEntity } from '../schema/database';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { compactBody, formbricksCall, listParams, withQuery } from './shared';
import type { FormbricksEndpointOutputs } from './types';

const LABEL = 'survey';

/**
 * Surveys - the anchor of the whole API. Responses, displays and webhooks all reference a survey
 * id.
 *
 * Mirrored because it is configuration that changes rarely and is the lookup everything else
 * needs. A survey's *content* - questions, endings, styling - is carried through unmodelled: it
 * is authored in the Formbricks editor and its shape depends on each question's type.
 *
 * All four operations are v1; v2 has no survey CRUD.
 */

/** Lists the surveys in the workspace the API key can reach. */
export const list: FormbricksEndpoints['surveysList'] = async (ctx, input) => {
	const result = await formbricksCall<FormbricksEndpointOutputs['surveysList']>(
		ctx,
		'v1',
		// The only route in the API that pages by `offset` - see `PageStyle` in `shared.ts`.
		withQuery('management/surveys', listParams('offset', input)),
	);

	await cacheEntities(ctx.db.surveys, FormbricksSurveyEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.surveys.list',
		{
			...auditPayload(input, ['limit', 'offset']),
			survey_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Creates a survey.
 *
 * `workspaceId` is required **in the body** - a 400 `"workspaceId must be provided"` without it,
 * even though the API key is already scoped to that workspace.
 *
 * Answers **200, not 201**. Worth stating because the contact create on the same API answers 201,
 * so a caller cannot assume either.
 *
 * Non-idempotent: survey names are not unique, so a replay creates a second survey rather than
 * returning the first.
 */
export const create: FormbricksEndpoints['surveysCreate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['surveysCreate']
	>(ctx, 'v1', 'management/surveys', {
		method: 'POST',
		body: compactBody({
			workspaceId: input.workspaceId,
			name: input.name,
			type: input.type,
			questions: input.questions,
			welcomeCard: input.welcomeCard,
			endings: input.endings,
			status: input.status,
			triggers: input.triggers,
		}),
	});

	await cacheEntity(ctx.db.surveys, FormbricksSurveyEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.surveys.create',
		{
			...auditPayload(input, ['workspaceId']),
			survey_id: result.id,
			// The name is caller-authored, so the count of questions is recorded instead of the
			// content.
			question_count: countOf(input.questions),
		},
		'completed',
	);
	return result;
};

/**
 * Updates a survey.
 *
 * **PUT, not POST.** The v1 documentation says POST for update; `POST` on the item route answers
 * **405 with an empty body**. Verified both ways.
 *
 * Safe to replay - applying the same body twice leaves the same state - so it is absent from the
 * non-idempotent set.
 */
export const update: FormbricksEndpoints['surveysUpdate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['surveysUpdate']
	>(ctx, 'v1', `management/surveys/${input.surveyId}`, {
		method: 'PUT',
		body: compactBody({
			name: input.name,
			status: input.status,
			questions: input.questions,
			welcomeCard: input.welcomeCard,
			endings: input.endings,
			triggers: input.triggers,
		}),
	});

	await cacheEntity(ctx.db.surveys, FormbricksSurveyEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'formbricks.surveys.update',
		auditPayload(input, ['surveyId']),
		'completed',
	);
	return result;
};

/**
 * Deletes a survey.
 *
 * Irreversible, and it takes the survey's responses with it - which is why it is marked
 * `destructive` rather than merely a write. Answers **200 with the deleted record**, not 204.
 *
 * The mirrored row is evicted best-effort: a survey holds no personal data of its own, so a stale
 * row is untidy rather than a disclosure. Contrast webhooks, where a surviving row describes an
 * integration the account believes it removed.
 */
export const remove: FormbricksEndpoints['surveysDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		version: 'v1',
		path: `management/surveys/${input.surveyId}`,
		event: 'formbricks.surveys.delete',
		input,
		identifierKeys: ['surveyId'],
		resultId: input.surveyId,
		mirror: {
			store: ctx.db.surveys,
			entityId: input.surveyId,
			label: LABEL,
		},
	});

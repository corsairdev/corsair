import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { deleteAndEvict } from './delete-flow';
import { auditPayload, countOf, keyNamesOf } from './logging';
import { compactBody, formbricksCall, listParams, withQuery } from './shared';
import type { FormbricksEndpointOutputs } from './types';

/**
 * Responses - the answers real people gave to a survey.
 *
 * **Not mirrored, and this is the most important of those decisions in the plugin.** Two reasons,
 * either of which would be sufficient:
 *
 * - They are a firehose. A survey exists to collect them continuously, so a local copy is stale
 *   between the write and the next read.
 * - They are **other people's personal data**. `data` holds the answers, `meta` carries the
 *   respondent's URL, user agent and country, and `contactAttributes` can carry their email
 *   address. Caching that would put survey respondents' information into local storage for no
 *   lookup benefit.
 *
 * **Nothing from a response body is logged.** A read is recorded as a count; a write records which
 * question ids were answered, never the answers. `endpoints.test.ts` sweeps every operation
 * against a poisoned response to prove it.
 */

/**
 * Lists responses, optionally for one survey.
 *
 * `surveyId` is a query parameter rather than a path segment, so the unfiltered list spans every
 * survey in the workspace - which on a busy workspace is a lot of personal data. Callers should
 * filter.
 */
export const list: FormbricksEndpoints['responsesList'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['responsesList']
	>(
		ctx,
		'v1',
		withQuery('management/responses', {
			// `skip`, not `offset` - this route accepts `offset` and discards it.
			...listParams('skip', input),
			surveyId: input.surveyId,
		}),
	);

	await logEventFromContext(
		ctx,
		'formbricks.responses.list',
		{
			...auditPayload(input, ['surveyId', 'limit', 'offset']),
			// The count, never the rows.
			response_count: countOf(result),
		},
		'completed',
	);
	return result;
};

/**
 * Records a response.
 *
 * `workspaceId` and `surveyId` are both required, and `data` carries the answers.
 *
 * Non-idempotent: there is no idempotency key, so a replay records a second response and inflates
 * the survey's results. That makes this one of the operations where a retry is actively harmful
 * rather than merely wasteful.
 */
export const create: FormbricksEndpoints['responsesCreate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['responsesCreate']
	>(ctx, 'v1', 'management/responses', {
		method: 'POST',
		body: compactBody({
			workspaceId: input.workspaceId,
			surveyId: input.surveyId,
			data: input.data,
			finished: input.finished,
			meta: input.meta,
			ttc: input.ttc,
			language: input.language,
		}),
	});

	await logEventFromContext(
		ctx,
		'formbricks.responses.create',
		{
			...auditPayload(input, ['workspaceId', 'surveyId']),
			response_id: result.id,
			// Which questions were answered, never what was answered.
			answered_question_ids: keyNamesOf(input.data),
			finished: input.finished ?? false,
		},
		'completed',
	);
	return result;
};

/**
 * Updates a response.
 *
 * **`data` is required to work around a server bug**, and this is the only input in the plugin
 * required for that reason rather than a documented rule:
 *
 * ```
 * PUT management/responses/{id}  {finished: true}              -> 500 internal_server_error
 * PUT management/responses/{id}  {data: {}, finished: true}    -> 200
 * ```
 *
 * A missing required field should be a 422 and every sibling endpoint gives one. Requiring `data`
 * in the input schema turns that 500 into a local validation error, so a caller finds out before a
 * request is sent. An empty object satisfies it, which is the escape hatch for a caller who only
 * wants to set `finished`.
 *
 * Also note `workspaceId` is **not** required here, unlike the creates - a body without it answers
 * 200. Verified rather than assumed, because four other writes do require it.
 */
export const update: FormbricksEndpoints['responsesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['responsesUpdate']
	>(ctx, 'v1', `management/responses/${input.responseId}`, {
		method: 'PUT',
		body: compactBody({
			data: input.data,
			finished: input.finished,
			variables: input.variables,
			language: input.language,
		}),
	});

	await logEventFromContext(
		ctx,
		'formbricks.responses.update',
		{
			...auditPayload(input, ['responseId']),
			answered_question_ids: keyNamesOf(input.data),
		},
		'completed',
	);
	return result;
};

/**
 * Deletes a response.
 *
 * Marked `destructive`: it removes a respondent's submitted answers irreversibly. Nothing is
 * evicted because responses are not mirrored.
 *
 * This is also the operation a workspace owner would use to honour an erasure request, so
 * reporting it accurately matters - see the delete flow for why a replayed 404 is reported as
 * `already_absent` rather than as a failure.
 */
export const remove: FormbricksEndpoints['responsesDelete'] = async (
	ctx,
	input,
) =>
	await deleteAndEvict(ctx, {
		version: 'v1',
		path: `management/responses/${input.responseId}`,
		event: 'formbricks.responses.delete',
		input,
		identifierKeys: ['responseId'],
		resultId: input.responseId,
		// No mirror: responses are never cached.
	});

import type { EventbriteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	EventbriteEndpointInputSchemas as Inputs,
	EventbriteEndpointOutputSchemas as Outputs,
} from './types';

export const list: EventbriteEndpoints['questionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.list',
			input: Inputs.questionsList,
			output: Outputs.questionsList,
		},
		input,
		({ event_id, as_owner, page_size, continuation, page }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/questions/`,
			query: { as_owner, page_size, continuation, page },
		}),
		{
			log: ({ event_id }, result) => ({
				eventId: event_id,
				count: result.questions.length,
			}),
		},
	);

export const get: EventbriteEndpoints['questionGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'question.get',
			input: Inputs.questionGet,
			output: Outputs.questionGet,
		},
		input,
		({ event_id, question_id }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/questions/${segment(question_id)}/`,
		}),
		{
			log: ({ event_id, question_id }) => ({
				eventId: event_id,
				questionId: question_id,
			}),
		},
	);

export const create: EventbriteEndpoints['questionCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'question.create',
			input: Inputs.questionCreate,
			output: Outputs.questionCreate,
		},
		input,
		({ event_id, question }) => ({
			method: 'POST',
			path: `/events/${segment(event_id)}/questions/`,
			body: { question },
		}),
		{
			log: ({ event_id }, result) => ({
				eventId: event_id,
				questionId: result.id ?? undefined,
			}),
		},
	);

export const remove: EventbriteEndpoints['questionDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'question.delete',
			input: Inputs.questionDelete,
			output: Outputs.questionDelete,
		},
		input,
		({ event_id, question_id }) => ({
			method: 'DELETE',
			path: `/events/${segment(event_id)}/questions/${segment(question_id)}/`,
		}),
		{
			log: ({ event_id, question_id }) => ({
				eventId: event_id,
				questionId: question_id,
			}),
		},
	);

/**
 * These are the questions Eventbrite asks on every event unless an organizer
 * removes them; the route is not paginated in practice but answers in the same
 * `{ pagination, questions }` envelope.
 */
export const listCanned: EventbriteEndpoints['cannedQuestionsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'questions.listCanned',
			input: Inputs.cannedQuestionsList,
			output: Outputs.cannedQuestionsList,
		},
		input,
		({ event_id, include_all }) => ({
			method: 'GET',
			path: `/events/${segment(event_id)}/canned_questions/`,
			query: { include_all },
		}),
		{
			log: ({ event_id }, result) => ({
				eventId: event_id,
				count: result.questions.length,
			}),
		},
	);

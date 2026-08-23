import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest, redactEmail, UnioneAPIError } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

type MessageInput = {
	recipients: unknown;
	body?: { html?: string; plaintext?: string; amp?: string };
	template_id?: string;
};

/**
 * UniOne rejects a message that carries neither a body nor a template. Failing
 * here keeps the error actionable instead of surfacing as a generic API 400.
 */
function buildMessage<T extends MessageInput>(
	input: T,
	extra?: Record<string, unknown>,
): Record<string, unknown> {
	if (!input.body && !input.template_id) {
		throw new UnioneAPIError(
			'Provide body (html, plaintext or amp) or template_id: UniOne cannot send an empty message.',
		);
	}
	return extra ? { ...input, ...extra } : { ...input };
}

export const send: UnioneEndpoints['email']['send'] = async (ctx, input) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['emailSend']>(
		'email/send.json',
		ctx.key,
		{ body: { message: buildMessage(input) } },
	);

	await logEventFromContext(
		ctx,
		'unione.email.send',
		{ recipients: input.recipients.length },
		'completed',
	);
	return response;
};

export const schedule: UnioneEndpoints['email']['schedule'] = async (
	ctx,
	input,
) => {
	const { send_at, ...message } = input;
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['emailSchedule']
	>('email/send.json', ctx.key, {
		body: { message: buildMessage(message, { options: { send_at } }) },
	});

	await logEventFromContext(
		ctx,
		'unione.email.schedule',
		{ recipients: input.recipients.length, send_at },
		'completed',
	);
	return response;
};

export const list: UnioneEndpoints['email']['list'] = async (ctx, input) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['emailList']>(
		'event-dump/create.json',
		ctx.key,
		{
			body: {
				start_time: input.start_time,
				end_time: input.end_time,
				limit: input.limit,
				all_projects: input.all_projects,
				filter: input.filter,
				dump_fields: input.dump_fields,
				format: input.format,
			},
		},
	);

	if (response.dump_id) {
		await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
			dump_id: response.dump_id,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.email.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const statistics: UnioneEndpoints['email']['statistics'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['emailStatistics']
	>('event-dump/create.json', ctx.key, {
		body: {
			start_time: input.start_time,
			end_time: input.end_time,
			aggregate: 'day_status',
		},
	});

	if (response.dump_id) {
		await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
			dump_id: response.dump_id,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.email.statistics',
		{ ...input },
		'completed',
	);
	return response;
};

export const subscribe: UnioneEndpoints['email']['subscribe'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['emailSubscribe']
	>('email/subscribe.json', ctx.key, { body: { ...input } });

	// Allowlisted rather than spread: `from_name` is a person's name and has no
	// place in a persisted audit row, and spreading would carry along any field
	// added to EmailSubscribeInputSchema later without review.
	await logEventFromContext(
		ctx,
		'unione.email.subscribe',
		{
			to_email: redactEmail(input.to_email),
			from_email: redactEmail(input.from_email),
		},
		'completed',
	);
	return response;
};

export const unsubscribe: UnioneEndpoints['email']['unsubscribe'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['emailUnsubscribe']
	>('suppression/set.json', ctx.key, {
		body: {
			email: input.email,
			cause: 'unsubscribed',
			created: input.created,
		},
	});

	await maybeUpsert(ctx.db.suppressions, input.email, {
		email: input.email,
		cause: 'unsubscribed',
		source: 'user',
		created: input.created,
		created_at: input.created,
	});
	await logEventFromContext(
		ctx,
		'unione.email.unsubscribe',
		{ ...input, email: redactEmail(input.email) },
		'completed',
	);
	return response;
};

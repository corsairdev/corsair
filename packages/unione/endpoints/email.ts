import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import {
	makeUnioneRequest,
	UNSUPPORTED_JOB_CONTROL_MESSAGE,
	UnioneAPIError,
} from '../client';
import { maybeUpsert } from '../db';
import { defaultEventDumpStartTime } from './time';
import type { UnioneEndpointOutputs } from './types';

function throwUnsupported(jobId: string): never {
	throw new UnioneAPIError(
		`${UNSUPPORTED_JOB_CONTROL_MESSAGE} job_id=${jobId}`,
	);
}

export const schedule: UnioneEndpoints['email']['schedule'] = async (
	ctx,
	input,
) => {
	const { send_at, recipients, body, ...rest } = input;
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['emailSchedule']
	>('email/send.json', ctx.key, {
		body: {
			message: {
				...rest,
				recipients,
				body: body ?? { plaintext: ' ' },
				options: { send_at },
			},
		},
	});

	await logEventFromContext(
		ctx,
		'unione.email.schedule',
		{ ...input },
		'completed',
	);
	return response;
};

async function createJobDump(
	ctx: Parameters<UnioneEndpoints['email']['get']>[0],
	input: {
		job_id: string;
		start_time?: string;
		end_time?: string;
		email?: string;
		status?: string;
	},
): Promise<UnioneEndpointOutputs['emailGet']> {
	const filter: Record<string, string> = { job_id: input.job_id };
	if (input.email) filter.email = input.email;
	if (input.status) filter.status = input.status;

	const response = await makeUnioneRequest<UnioneEndpointOutputs['emailGet']>(
		'event-dump/create.json',
		ctx.key,
		{
			body: {
				start_time: input.start_time ?? defaultEventDumpStartTime(),
				end_time: input.end_time,
				filter,
			},
		},
	);

	await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
		dump_id: response.dump_id ?? input.job_id,
		dump_status: 'queued',
	});
	return response;
}

export const get: UnioneEndpoints['email']['get'] = async (ctx, input) => {
	const response = await createJobDump(ctx, input);
	await logEventFromContext(ctx, 'unione.email.get', { ...input }, 'completed');
	return response;
};

export const eventGet: UnioneEndpoints['email']['eventGet'] = async (
	ctx,
	input,
) => {
	const response = await createJobDump(ctx, input);
	await logEventFromContext(
		ctx,
		'unione.email.eventGet',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: UnioneEndpoints['email']['cancel'] = async (
	_ctx,
	input,
) => {
	throwUnsupported(input.job_id);
};

export const resume: UnioneEndpoints['email']['resume'] = async (
	_ctx,
	input,
) => {
	throwUnsupported(input.job_id);
};

export const resend: UnioneEndpoints['email']['resend'] = async (
	_ctx,
	input,
) => {
	throwUnsupported(input.job_id);
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

	await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
		dump_id: response.dump_id ?? '',
		dump_status: 'queued',
	});
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

	await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
		dump_id: response.dump_id ?? '',
		dump_status: 'queued',
	});
	await logEventFromContext(
		ctx,
		'unione.email.statistics',
		{ ...input },
		'completed',
	);
	return response;
};

export const smtp: UnioneEndpoints['email']['smtp'] = async (ctx, input) => {
	const info = await makeUnioneRequest<UnioneEndpointOutputs['systemInfo']>(
		'system/info.json',
		ctx.key,
		{ body: {} },
	);

	const region = input.region ?? 'eu1';
	const response: UnioneEndpointOutputs['emailSmtp'] = {
		hosts: [`smtp.${region}.unione.io`],
		ports: [587, 465, 25],
		encryption: 'TLS 1.2+',
		login: info.project_id ?? info.user_id,
		project_id: info.project_id,
		password_hint:
			'Use your UniOne API key as the SMTP password. It is not returned here.',
		notes:
			'Only encrypted TLS connections are supported. Port 25 unencrypted and SSL are not supported.',
	};

	await logEventFromContext(
		ctx,
		'unione.email.smtp',
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

	await logEventFromContext(
		ctx,
		'unione.email.subscribe',
		{ ...input },
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
	});
	await logEventFromContext(
		ctx,
		'unione.email.unsubscribe',
		{ ...input },
		'completed',
	);
	return response;
};

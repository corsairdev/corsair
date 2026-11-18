import { logEventFromContext } from 'corsair/core';
import { makeSanityRequest, SanityError } from '../client';
import type { SanityEndpoints } from '../index';
import { resolveDataset, resolveProjectId } from './shared';
import {
	SanityEndpointInputSchemas as Inputs,
	SanityEndpointOutputSchemas as Outputs,
} from './types';

/** The API version deliveries are rendered with (projections, perspectives). */
const DELIVERY_API_VERSION = 'v2025-02-19';

const WEBHOOK_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

function webhookPath(projectId: string, id?: string) {
	if (id !== undefined && !WEBHOOK_ID_RE.test(id)) {
		throw new SanityError(
			'The webhook id must be the id webhooks.list returned.',
			'invalid_input',
		);
	}
	return `/hooks/projects/${projectId}${id ? `/${id}` : ''}`;
}

/**
 * Sanity returns each webhook's signing secret in the clear. It is dropped here
 * so it never reaches an agent's context or a log; `hasSecret` says whether one is set.
 */
// unknown: a webhook object as Sanity returns it.
export function withoutSecret(webhook: unknown) {
	if (!webhook || typeof webhook !== 'object') return webhook;
	const { secret, ...rest } = webhook as Record<string, unknown>;
	return {
		...rest,
		hasSecret: typeof secret === 'string' && secret.length > 0,
	};
}

type WebhookFields = {
	name?: string;
	url?: string;
	dataset?: string;
	on?: string[];
	filter?: string;
	projection?: string;
	includeDrafts?: boolean;
	secret?: string;
	description?: string;
};

function ruleOf(input: WebhookFields) {
	if (
		input.on === undefined &&
		input.filter === undefined &&
		input.projection === undefined
	) {
		return undefined;
	}
	return { on: input.on, filter: input.filter, projection: input.projection };
}

export const list: SanityEndpoints['webhooksList'] = async (ctx, rawInput) => {
	Inputs.webhooksList.parse(rawInput ?? {});
	const projectId = await resolveProjectId(ctx);
	// unknown: webhook objects; the secret is dropped and the output schema validates the rest.
	const hooks = await makeSanityRequest<unknown[]>(
		ctx.key,
		{ projectId },
		webhookPath(projectId),
	);
	const response = Outputs.webhooksList.parse({
		webhooks: (Array.isArray(hooks) ? hooks : []).map(withoutSecret),
	});
	await logEventFromContext(
		ctx,
		'sanity.webhooks.list',
		{ count: response.webhooks.length },
		'completed',
	);
	return response;
};

export const create: SanityEndpoints['webhooksCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.webhooksCreate.parse(rawInput);
	const projectId = await resolveProjectId(ctx);
	const dataset =
		input.dataset === '*' ? '*' : await resolveDataset(ctx, input.dataset);
	const hook = await makeSanityRequest(
		ctx.key,
		{ projectId },
		webhookPath(projectId),
		{
			method: 'POST',
			body: {
				type: 'document',
				name: input.name,
				url: input.url,
				dataset,
				apiVersion: DELIVERY_API_VERSION,
				httpMethod: 'POST',
				rule: ruleOf(input),
				includeDrafts: input.includeDrafts ?? false,
				secret: input.secret,
				description: input.description,
			},
		},
	);
	const response = Outputs.webhooksCreate.parse({
		webhook: withoutSecret(hook),
	});
	await logEventFromContext(
		ctx,
		'sanity.webhooks.create',
		{ id: response.webhook.id, dataset },
		'completed',
	);
	return response;
};

export const update: SanityEndpoints['webhooksUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.webhooksUpdate.parse(rawInput);
	const projectId = await resolveProjectId(ctx);
	const dataset =
		input.dataset === undefined || input.dataset === '*'
			? input.dataset
			: await resolveDataset(ctx, input.dataset);
	let rule = ruleOf(input);
	if (rule) {
		// A PATCH replaces the whole rule, so the parts not given are kept.
		// unknown: the webhook's rule object (on, filter, projection), merged as Sanity returns it.
		const current = await makeSanityRequest<{ rule?: Record<string, unknown> }>(
			ctx.key,
			{ projectId },
			webhookPath(projectId, input.id),
		);
		rule = {
			...(current?.rule ?? {}),
			...Object.fromEntries(
				Object.entries(rule).filter(([, value]) => value !== undefined),
			),
		} as typeof rule;
	}
	const body = Object.fromEntries(
		Object.entries({
			name: input.name,
			url: input.url,
			dataset,
			rule,
			includeDrafts: input.includeDrafts,
			secret: input.secret,
			description: input.description,
			isDisabledByUser: input.disabled,
		}).filter(([, value]) => value !== undefined),
	);
	if (Object.keys(body).length === 0) {
		throw new SanityError(
			'Give at least one field to change.',
			'invalid_input',
		);
	}
	const hook = await makeSanityRequest(
		ctx.key,
		{ projectId },
		webhookPath(projectId, input.id),
		{ method: 'PATCH', body },
	);
	const response = Outputs.webhooksUpdate.parse({
		webhook: withoutSecret(hook),
	});
	await logEventFromContext(
		ctx,
		'sanity.webhooks.update',
		{ id: input.id, fields: Object.keys(body) },
		'completed',
	);
	return response;
};

export const deleteWebhook: SanityEndpoints['webhooksDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.webhooksDelete.parse(rawInput);
	const projectId = await resolveProjectId(ctx);
	const response = Outputs.webhooksDelete.parse(
		await makeSanityRequest(
			ctx.key,
			{ projectId },
			webhookPath(projectId, input.id),
			{ method: 'DELETE' },
		),
	);
	await logEventFromContext(
		ctx,
		'sanity.webhooks.delete',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const attempts: SanityEndpoints['webhooksAttempts'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.webhooksAttempts.parse(rawInput);
	const projectId = await resolveProjectId(ctx);
	// unknown: delivery attempts, validated by the output schema below.
	const result = await makeSanityRequest<unknown[]>(
		ctx.key,
		{ projectId },
		`${webhookPath(projectId, input.id)}/attempts`,
		{
			query: {
				state: input.state,
				limit: input.limit ?? 25,
				offset: input.offset,
			},
		},
	);
	const response = Outputs.webhooksAttempts.parse({
		attempts: Array.isArray(result) ? result : [],
	});
	await logEventFromContext(
		ctx,
		'sanity.webhooks.attempts',
		{ id: input.id, count: response.attempts.length },
		'completed',
	);
	return response;
};

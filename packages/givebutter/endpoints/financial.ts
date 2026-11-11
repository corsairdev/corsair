import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { GivebutterContext } from '..';
import { makeGivebutterRequest } from '../client';
import type {
	GivebutterFinancialEndpointInputs,
	GivebutterFinancialEndpointOutputs,
} from './financial-types';
import {
	GivebutterFinancialEndpointInputSchemas,
	GivebutterFinancialEndpointOutputSchemas,
} from './financial-types';

type EndpointName = keyof GivebutterFinancialEndpointInputs;
type Operation<T extends EndpointName> = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: (input: GivebutterFinancialEndpointInputs[T]) => string;
	query?: (
		input: GivebutterFinancialEndpointInputs[T],
	) => Record<string, string | number | boolean | undefined>;
	// Bodies vary by endpoint; each concrete input schema validates its known provider fields.
	body?: (
		input: GivebutterFinancialEndpointInputs[T],
	) => Record<string, unknown>;
	void?: boolean;
};

const pathValue = (value: string | number) => encodeURIComponent(String(value));
const omit = <T extends Record<string, unknown>>(
	input: T,
	keys: readonly string[],
) =>
	Object.fromEntries(
		Object.entries(input).filter(([key]) => !keys.includes(key)),
	) as Record<string, unknown>; // Removing path fields leaves the schema-validated JSON request body.
const toQuery = <T extends object>(input: T) =>
	Object.fromEntries(
		Object.entries(input).map(([key, value]) => [key, value ?? undefined]),
		// Object.entries loses property value unions; the schema-limited inputs guarantee query scalars.
	) as Record<string, string | number | boolean | undefined>;

function define<T extends EndpointName>(
	name: T,
	operation: Operation<T>,
): CorsairEndpoint<
	GivebutterContext,
	GivebutterFinancialEndpointInputs[T],
	GivebutterFinancialEndpointOutputs[T]
> {
	return async (ctx, rawInput) => {
		// TypeScript cannot retain the generic key/schema correlation across this indexed lookup.
		const input = GivebutterFinancialEndpointInputSchemas[name].parse(
			rawInput,
		) as GivebutterFinancialEndpointInputs[T];
		const response = await makeGivebutterRequest<
			GivebutterFinancialEndpointOutputs[T]
		>(operation.path(input), ctx.key, {
			method: operation.method,
			query: operation.query?.(input),
			body: operation.body?.(input),
		});
		const result = operation.void
			? undefined
			: GivebutterFinancialEndpointOutputSchemas[name].parse(response);
		await logEventFromContext(
			ctx,
			`givebutter.${name}`,
			{ operation: name },
			'completed',
		);
		// The parsed output has the matching runtime schema; this assertion restores that key relation.
		return result as GivebutterFinancialEndpointOutputs[T];
	};
}

export const Messages = {
	list: define('listMessages', { method: 'GET', path: () => '/v1/messages' }),
	get: define('getMessage', {
		method: 'GET',
		path: ({ message }) => `/v1/messages/${pathValue(message)}`,
	}),
} as const;

export const Payouts = {
	list: define('listPayouts', { method: 'GET', path: () => '/v1/payouts' }),
	get: define('getPayout', {
		method: 'GET',
		path: ({ payout }) => `/v1/payouts/${pathValue(payout)}`,
	}),
} as const;

export const Pledges = {
	list: define('listPledges', { method: 'GET', path: () => '/v1/pledges' }),
	get: define('getPledge', {
		method: 'GET',
		path: ({ pledge }) => `/v1/pledges/${pathValue(pledge)}`,
	}),
} as const;

export const Plans = {
	list: define('listPlans', {
		method: 'GET',
		path: () => '/v1/plans',
		query: ({ contacts }) => toQuery({ contacts }),
	}),
	get: define('getPlan', {
		method: 'GET',
		path: ({ plan }) => `/v1/plans/${pathValue(plan)}`,
		query: ({ first_name, last_name, email, amount }) => ({
			first_name,
			last_name,
			email,
			amount,
		}),
	}),
} as const;

export const Transactions = {
	list: define('listTransactions', {
		method: 'GET',
		path: () => '/v1/transactions',
		query: (input) => toQuery(input),
	}),
	create: define('createTransaction', {
		method: 'POST',
		path: () => '/v1/transactions',
		body: (input) => input,
	}),
	get: define('getTransaction', {
		method: 'GET',
		path: ({ transaction }) => `/v1/transactions/${pathValue(transaction)}`,
	}),
	update: define('updateTransaction', {
		method: 'PUT',
		path: ({ transaction }) => `/v1/transactions/${pathValue(transaction)}`,
		body: (input) => omit(input, ['transaction']),
	}),
} as const;

export const Webhooks = {
	list: define('listWebhooks', { method: 'GET', path: () => '/v1/webhooks' }),
	create: define('createWebhook', {
		method: 'POST',
		path: () => '/v1/webhooks',
		body: (input) => input,
	}),
	get: define('getWebhook', {
		method: 'GET',
		path: ({ webhook }) => `/v1/webhooks/${pathValue(webhook)}`,
	}),
	update: define('updateWebhook', {
		method: 'PUT',
		path: ({ webhook }) => `/v1/webhooks/${pathValue(webhook)}`,
		body: (input) => omit(input, ['webhook']),
	}),
	delete: define('deleteWebhook', {
		method: 'DELETE',
		path: ({ webhook }) => `/v1/webhooks/${pathValue(webhook)}`,
		void: true,
	}),
} as const;

export const WebhookActivities = {
	list: define('listWebhookActivities', {
		method: 'GET',
		path: ({ webhook }) => `/v1/webhooks/${pathValue(webhook)}/activities`,
	}),
	get: define('getWebhookActivity', {
		method: 'GET',
		path: ({ webhook, activity }) =>
			`/v1/webhooks/${pathValue(webhook)}/activities/${pathValue(activity)}`,
	}),
} as const;

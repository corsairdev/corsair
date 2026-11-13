import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { GivebutterContext } from '..';
import { makeGivebutterRequest } from '../client';
import type {
	GivebutterEndpointInputs,
	GivebutterEndpointOutputs,
} from './types';
import {
	GivebutterEndpointInputSchemas,
	GivebutterEndpointOutputSchemas,
} from './types';

type EndpointName = keyof GivebutterEndpointInputs;
type Operation<T extends EndpointName> = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: (input: GivebutterEndpointInputs[T]) => string;
	query?: (
		input: GivebutterEndpointInputs[T],
	) => Record<string, string | number | boolean | undefined>;
	// Bodies vary by endpoint; each concrete input schema validates its known provider fields.
	body?: (input: GivebutterEndpointInputs[T]) => Record<string, unknown>;
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

function define<T extends EndpointName>(
	name: T,
	operation: Operation<T>,
): CorsairEndpoint<
	GivebutterContext,
	GivebutterEndpointInputs[T],
	GivebutterEndpointOutputs[T]
> {
	return async (ctx, rawInput) => {
		// The indexed schema and indexed endpoint input are correlated by `name`, but TypeScript
		// cannot preserve that relationship through a generic indexed lookup.
		const input = GivebutterEndpointInputSchemas[name].parse(
			rawInput,
		) as GivebutterEndpointInputs[T];
		const response = await makeGivebutterRequest<GivebutterEndpointOutputs[T]>(
			operation.path(input),
			ctx.key,
			{
				method: operation.method,
				query: operation.query?.(input),
				body: operation.body?.(input),
			},
		);
		const result = operation.void
			? undefined
			: GivebutterEndpointOutputSchemas[name].parse(response);
		await logEventFromContext(
			ctx,
			`givebutter.${name}`,
			{ operation: name },
			'completed',
		);
		// The same indexed-schema limitation applies after the output schema has parsed the response.
		return result as GivebutterEndpointOutputs[T];
	};
}

export const Campaigns = {
	list: define('listCampaigns', {
		method: 'GET',
		path: () => '/v1/campaigns',
		query: ({ scope, page }) => ({ scope, page }),
	}),
	create: define('createCampaign', {
		method: 'POST',
		path: () => '/v1/campaigns',
		body: (input) => input,
	}),
	get: define('getCampaign', {
		method: 'GET',
		path: ({ campaign }) => `/v1/campaigns/${pathValue(campaign)}`,
	}),
	update: define('updateCampaign', {
		method: 'PUT',
		path: ({ campaign }) => `/v1/campaigns/${pathValue(campaign)}`,
		body: (input) => omit(input, ['campaign']),
	}),
	delete: define('deleteCampaign', {
		method: 'DELETE',
		path: ({ campaign }) => `/v1/campaigns/${pathValue(campaign)}`,
		void: true,
	}),
} as const;

export const DiscountCodes = {
	list: define('listDiscountCodes', {
		method: 'GET',
		path: ({ campaign }) =>
			`/v1/campaigns/${pathValue(campaign)}/discount-codes`,
		query: ({ page }) => ({ page }),
	}),
	create: define('createDiscountCode', {
		method: 'POST',
		path: ({ campaign }) =>
			`/v1/campaigns/${pathValue(campaign)}/discount-codes`,
		body: (input) => omit(input, ['campaign']),
	}),
	get: define('getDiscountCode', {
		method: 'GET',
		path: ({ campaign, discountCode }) =>
			`/v1/campaigns/${pathValue(campaign)}/discount-codes/${pathValue(discountCode)}`,
	}),
	update: define('updateDiscountCode', {
		method: 'PUT',
		path: ({ campaign, discountCode }) =>
			`/v1/campaigns/${pathValue(campaign)}/discount-codes/${pathValue(discountCode)}`,
		body: (input) => omit(input, ['campaign', 'discountCode']),
	}),
	delete: define('deleteDiscountCode', {
		method: 'DELETE',
		path: ({ campaign, discountCode }) =>
			`/v1/campaigns/${pathValue(campaign)}/discount-codes/${pathValue(discountCode)}`,
		void: true,
	}),
} as const;

export const Members = {
	list: define('listMembers', {
		method: 'GET',
		path: ({ campaign }) => `/v1/campaigns/${pathValue(campaign)}/members`,
		query: ({ page }) => ({ page }),
	}),
	get: define('getMember', {
		method: 'GET',
		path: ({ campaign, member }) =>
			`/v1/campaigns/${pathValue(campaign)}/members/${pathValue(member)}`,
	}),
	delete: define('deleteMember', {
		method: 'DELETE',
		path: ({ campaign, member }) =>
			`/v1/campaigns/${pathValue(campaign)}/members/${pathValue(member)}`,
		void: true,
	}),
} as const;

export const Teams = {
	list: define('listTeams', {
		method: 'GET',
		path: ({ campaign }) => `/v1/campaigns/${pathValue(campaign)}/teams`,
		query: ({ page }) => ({ page }),
	}),
	get: define('getTeam', {
		method: 'GET',
		path: ({ campaign, team }) =>
			`/v1/campaigns/${pathValue(campaign)}/teams/${pathValue(team)}`,
	}),
	delete: define('deleteTeam', {
		method: 'DELETE',
		path: ({ campaign, team }) =>
			`/v1/campaigns/${pathValue(campaign)}/teams/${pathValue(team)}`,
		void: true,
	}),
} as const;

export const TicketItems = {
	list: define('listTicketItems', {
		method: 'GET',
		path: ({ campaign }) =>
			`/v1/campaigns/${pathValue(campaign)}/items/tickets`,
		query: ({ page }) => ({ page }),
	}),
	create: define('createTicketItem', {
		method: 'POST',
		path: ({ campaign }) =>
			`/v1/campaigns/${pathValue(campaign)}/items/tickets`,
		body: (input) => omit(input, ['campaign']),
	}),
	get: define('getTicketItem', {
		method: 'GET',
		path: ({ campaign, ticketId }) =>
			`/v1/campaigns/${pathValue(campaign)}/items/tickets/${pathValue(ticketId)}`,
	}),
} as const;

export const Tickets = {
	list: define('listTickets', {
		method: 'GET',
		path: () => '/v1/tickets',
		query: ({ page }) => ({ page }),
	}),
	get: define('getTicket', {
		method: 'GET',
		path: ({ ticket }) => `/v1/tickets/${pathValue(ticket)}`,
	}),
} as const;

export const Sso = {
	account: define('getSsoAccount', {
		method: 'GET',
		path: () => '/sso/v1/account',
	}),
	campaign: define('getSsoCampaign', {
		method: 'GET',
		path: ({ campaign }) => `/sso/v1/campaigns/${pathValue(campaign)}`,
	}),
} as const;

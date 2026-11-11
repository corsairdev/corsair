import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { GivebutterContext } from '..';
import { makeGivebutterRequest } from '../client';
import type {
	GivebutterCrmEndpointInputs,
	GivebutterCrmEndpointOutputs,
} from './crm-types';
import {
	GivebutterCrmEndpointInputSchemas,
	GivebutterCrmEndpointOutputSchemas,
} from './crm-types';

type EndpointName = keyof GivebutterCrmEndpointInputs;
type Operation<T extends EndpointName> = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: (input: GivebutterCrmEndpointInputs[T]) => string;
	query?: (
		input: GivebutterCrmEndpointInputs[T],
	) => Record<string, string | number | boolean | undefined>;
	// Bodies vary by endpoint; each concrete input schema validates its known provider fields.
	body?: (input: GivebutterCrmEndpointInputs[T]) => Record<string, unknown>;
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
	GivebutterCrmEndpointInputs[T],
	GivebutterCrmEndpointOutputs[T]
> {
	return async (ctx, rawInput) => {
		// TypeScript cannot retain the generic key/schema correlation across this indexed lookup.
		const input = GivebutterCrmEndpointInputSchemas[name].parse(
			rawInput,
		) as GivebutterCrmEndpointInputs[T];
		const response = await makeGivebutterRequest<
			GivebutterCrmEndpointOutputs[T]
		>(operation.path(input), ctx.key, {
			method: operation.method,
			query: operation.query?.(input),
			body: operation.body?.(input),
		});
		const result = operation.void
			? undefined
			: GivebutterCrmEndpointOutputSchemas[name].parse(response);
		await logEventFromContext(
			ctx,
			`givebutter.${name}`,
			{ operation: name },
			'completed',
		);
		// The parsed output has the matching runtime schema; this assertion restores that key relation.
		return result as GivebutterCrmEndpointOutputs[T];
	};
}

export const Contacts = {
	list: define('listContacts', {
		method: 'GET',
		path: () => '/v1/contacts',
		query: (input) => input,
	}),
	create: define('createContact', {
		method: 'POST',
		path: () => '/v1/contacts',
		body: (input) => input,
	}),
	get: define('getContact', {
		method: 'GET',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}`,
	}),
	update: define('updateContact', {
		method: 'PUT',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}`,
		body: (input) => omit(input, ['contact']),
	}),
	delete: define('deleteContact', {
		method: 'DELETE',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}`,
		void: true,
	}),
	restore: define('restoreContact', {
		method: 'POST',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}/restore`,
	}),
} as const;

export const Activities = {
	list: define('listActivities', {
		method: 'GET',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}/activities`,
		query: ({ type }) => ({ type }),
	}),
	create: define('createActivity', {
		method: 'POST',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}/activities`,
		body: (input) => omit(input, ['contact']),
	}),
	get: define('getActivity', {
		method: 'GET',
		path: ({ contact, activity }) =>
			`/v1/contacts/${pathValue(contact)}/activities/${pathValue(activity)}`,
	}),
	// Givebutter documents this PUT without a request body; preserve that contract.
	update: define('updateActivity', {
		method: 'PUT',
		path: ({ contact, activity }) =>
			`/v1/contacts/${pathValue(contact)}/activities/${pathValue(activity)}`,
	}),
	delete: define('deleteActivity', {
		method: 'DELETE',
		path: ({ contact, activity }) =>
			`/v1/contacts/${pathValue(contact)}/activities/${pathValue(activity)}`,
		void: true,
	}),
} as const;

export const ContactTags = {
	add: define('addTags', {
		method: 'POST',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}/tags/add`,
		body: (input) => omit(input, ['contact']),
	}),
	remove: define('removeTags', {
		method: 'POST',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}/tags/remove`,
		body: (input) => omit(input, ['contact']),
	}),
	sync: define('syncTags', {
		method: 'POST',
		path: ({ contact }) => `/v1/contacts/${pathValue(contact)}/tags/sync`,
		body: (input) => omit(input, ['contact']),
	}),
} as const;

export const Funds = {
	list: define('listFunds', { method: 'GET', path: () => '/v1/funds' }),
	create: define('createFund', {
		method: 'POST',
		path: () => '/v1/funds',
		body: (input) => input,
	}),
	get: define('getFund', {
		method: 'GET',
		path: ({ fund }) => `/v1/funds/${pathValue(fund)}`,
	}),
	update: define('updateFund', {
		method: 'PUT',
		path: ({ fund }) => `/v1/funds/${pathValue(fund)}`,
		body: (input) => omit(input, ['fund']),
	}),
	delete: define('deleteFund', {
		method: 'DELETE',
		path: ({ fund }) => `/v1/funds/${pathValue(fund)}`,
		void: true,
	}),
} as const;

export const Households = {
	list: define('listHouseholds', {
		method: 'GET',
		path: () => '/v1/households',
		query: (input) => input,
	}),
	create: define('createHousehold', {
		method: 'POST',
		path: () => '/v1/households',
		body: (input) => input,
	}),
	get: define('getHousehold', {
		method: 'GET',
		path: ({ household }) => `/v1/households/${pathValue(household)}`,
	}),
	update: define('updateHousehold', {
		method: 'PUT',
		path: ({ household }) => `/v1/households/${pathValue(household)}`,
		body: (input) => omit(input, ['household']),
	}),
	delete: define('deleteHousehold', {
		method: 'DELETE',
		path: ({ household }) => `/v1/households/${pathValue(household)}`,
		void: true,
	}),
} as const;

export const HouseholdContacts = {
	list: define('listHouseholdContacts', {
		method: 'GET',
		path: ({ household }) => `/v1/households/${pathValue(household)}/contacts`,
	}),
	add: define('addHouseholdContact', {
		method: 'POST',
		path: ({ household }) => `/v1/households/${pathValue(household)}/contacts`,
		body: (input) => omit(input, ['household']),
	}),
	get: define('getHouseholdContact', {
		method: 'GET',
		path: ({ household, contact }) =>
			`/v1/households/${pathValue(household)}/contacts/${pathValue(contact)}`,
	}),
	remove: define('removeHouseholdContact', {
		method: 'DELETE',
		path: ({ household, contact }) =>
			`/v1/households/${pathValue(household)}/contacts/${pathValue(contact)}`,
	}),
} as const;

import { z } from 'zod';
import { defineOperation, encodePathSegment, tenantPlan } from './runtime';
import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './types';

const list = defineOperation(
	'visitorsList',
	FormdeskEndpointInputSchemas.visitorsList,
	FormdeskEndpointOutputSchemas.visitorsList,
	(input) => tenantPlan(input, 'GET', '/visitors'),
);

const get = defineOperation(
	'visitorsGet',
	FormdeskEndpointInputSchemas.visitorsGet,
	FormdeskEndpointOutputSchemas.visitorsGet,
	(input) =>
		tenantPlan(input, 'GET', `/visitors/${encodePathSegment(input.visitorId)}`),
);

const getExternal = defineOperation(
	'visitorsGetExternal',
	FormdeskEndpointInputSchemas.visitorsGetExternal,
	FormdeskEndpointOutputSchemas.visitorsGetExternal,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/visitors/external/${encodePathSegment(input.externalUserId)}`,
		),
);

const results = defineOperation(
	'visitorsResults',
	FormdeskEndpointInputSchemas.visitorsResults,
	FormdeskEndpointOutputSchemas.visitorsResults,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/visitors/${encodePathSegment(input.visitorId)}/formresults`,
		),
);

const add = defineOperation(
	'visitorsAdd',
	FormdeskEndpointInputSchemas.visitorsAdd,
	FormdeskEndpointOutputSchemas.visitorsAdd,
	(input) =>
		tenantPlan(input, 'POST', '/visitors', {
			body: z.json().parse(input.visitor),
			retryable: false,
		}),
);

const update = defineOperation(
	'visitorsUpdate',
	FormdeskEndpointInputSchemas.visitorsUpdate,
	FormdeskEndpointOutputSchemas.visitorsUpdate,
	(input) =>
		tenantPlan(
			input,
			'PUT',
			`/visitors/${encodePathSegment(input.visitorId)}`,
			{
				body: z.json().parse(input.visitor),
				retryable: false,
			},
		),
);

const remove = defineOperation(
	'visitorsRemove',
	FormdeskEndpointInputSchemas.visitorsRemove,
	FormdeskEndpointOutputSchemas.visitorsRemove,
	(input) =>
		tenantPlan(
			input,
			'DELETE',
			`/visitors/${encodePathSegment(input.visitorId)}`,
			{
				retryable: false,
			},
		),
);

const signOn = defineOperation(
	'visitorsSignOn',
	FormdeskEndpointInputSchemas.visitorsSignOn,
	FormdeskEndpointOutputSchemas.visitorsSignOn,
	(input) =>
		tenantPlan(
			input,
			'POST',
			`/forms/${encodePathSegment(input.form)}/signon`,
			{
				body: z.json().parse(input.credentials),
				retryable: false,
			},
		),
);

export const Visitors = {
	list,
	get,
	getExternal,
	results,
	add,
	update,
	remove,
	signOn,
};

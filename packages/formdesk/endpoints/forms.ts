import { defineOperation, encodePathSegment, tenantPlan } from './runtime';
import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './types';

const list = defineOperation(
	'formsList',
	FormdeskEndpointInputSchemas.formsList,
	FormdeskEndpointOutputSchemas.formsList,
	(input) => tenantPlan(input, 'GET', '/forms'),
);

const park = defineOperation(
	'formsPark',
	FormdeskEndpointInputSchemas.formsPark,
	FormdeskEndpointOutputSchemas.formsPark,
	(input) =>
		tenantPlan(input, 'POST', '/park', {
			body: {
				data: input.data,
				expires: input.expires,
				...(input.reuse === undefined ? {} : { reuse: input.reuse }),
				...(input.preventchange === undefined
					? {}
					: { preventchange: input.preventchange }),
			},
			retryable: false,
		}),
);

const items = defineOperation(
	'formsItems',
	FormdeskEndpointInputSchemas.formsItems,
	FormdeskEndpointOutputSchemas.formsItems,
	(input) =>
		tenantPlan(input, 'GET', `/forms/${encodePathSegment(input.form)}/items`),
);

const filters = defineOperation(
	'formsFilters',
	FormdeskEndpointInputSchemas.formsFilters,
	FormdeskEndpointOutputSchemas.formsFilters,
	(input) =>
		tenantPlan(input, 'GET', `/forms/${encodePathSegment(input.form)}/filters`),
);

export const Forms = { list, park, items, filters };

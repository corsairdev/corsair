import { defineOperation, encodePathSegment, tenantPlan } from './runtime';
import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './types';

const list = defineOperation(
	'filesList',
	FormdeskEndpointInputSchemas.filesList,
	FormdeskEndpointOutputSchemas.filesList,
	(input) =>
		tenantPlan(input, 'GET', '/files', { query: { type: input.type } }),
);

const get = defineOperation(
	'filesGet',
	FormdeskEndpointInputSchemas.filesGet,
	FormdeskEndpointOutputSchemas.filesGet,
	(input) =>
		tenantPlan(input, 'GET', `/files/${encodePathSegment(input.fileId)}`),
);

const content = defineOperation(
	'filesContent',
	FormdeskEndpointInputSchemas.filesContent,
	FormdeskEndpointOutputSchemas.filesContent,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/files/${encodePathSegment(input.fileId)}/content`,
			{ binary: true },
		),
);

const remove = defineOperation(
	'filesRemove',
	FormdeskEndpointInputSchemas.filesRemove,
	FormdeskEndpointOutputSchemas.filesRemove,
	(input) =>
		tenantPlan(input, 'DELETE', `/files/${encodePathSegment(input.fileId)}`, {
			retryable: false,
		}),
);

export const Files = { list, get, content, remove };

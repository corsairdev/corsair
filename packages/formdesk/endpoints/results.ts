import {
	defineOperation,
	encodePathSegment,
	jsonBody,
	tenantPlan,
} from './runtime';
import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './types';

const exportResults = defineOperation(
	'resultsExport',
	FormdeskEndpointInputSchemas.resultsExport,
	FormdeskEndpointOutputSchemas.resultsExport,
	(input) =>
		tenantPlan(
			input,
			'POST',
			`/forms/${encodePathSegment(input.form)}/results/export`,
			{
				body: { format: input.format },
				query: input.query,
				retryable: false,
			},
		),
);

const list = defineOperation(
	'resultsList',
	FormdeskEndpointInputSchemas.resultsList,
	FormdeskEndpointOutputSchemas.resultsList,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/forms/${encodePathSegment(input.form)}/results`,
			{
				query: input.query,
			},
		),
);

const get = defineOperation(
	'resultsGet',
	FormdeskEndpointInputSchemas.resultsGet,
	FormdeskEndpointOutputSchemas.resultsGet,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/formresults/${encodePathSegment(input.entryId)}`,
		),
);

const add = defineOperation(
	'resultsAdd',
	FormdeskEndpointInputSchemas.resultsAdd,
	FormdeskEndpointOutputSchemas.resultsAdd,
	(input) =>
		tenantPlan(
			input,
			'POST',
			`/forms/${encodePathSegment(input.form)}/results/`,
			{
				body: input.data,
				query: { process_messages: input.process_messages },
				retryable: false,
			},
		),
);

const update = defineOperation(
	'resultsUpdate',
	FormdeskEndpointInputSchemas.resultsUpdate,
	FormdeskEndpointOutputSchemas.resultsUpdate,
	(input) =>
		tenantPlan(
			input,
			'PUT',
			`/formresults/${encodePathSegment(input.entryId)}`,
			{
				body: input.data,
				query: { process_messages: input.process_messages },
				retryable: false,
			},
		),
);

const remove = defineOperation(
	'resultsRemove',
	FormdeskEndpointInputSchemas.resultsRemove,
	FormdeskEndpointOutputSchemas.resultsRemove,
	(input) =>
		tenantPlan(
			input,
			'DELETE',
			`/formresults/${encodePathSegment(input.entryId)}`,
			{
				retryable: false,
			},
		),
);

const increment = defineOperation(
	'resultsIncrement',
	FormdeskEndpointInputSchemas.resultsIncrement,
	FormdeskEndpointOutputSchemas.resultsIncrement,
	(input) =>
		tenantPlan(
			input,
			'PUT',
			`/formresults/${encodePathSegment(input.entryId)}/increment`,
			{
				body: { identifier: input.identifier, count: input.count },
				retryable: false,
			},
		),
);

const markProcessed = defineOperation(
	'resultsMarkProcessed',
	FormdeskEndpointInputSchemas.resultsMarkProcessed,
	FormdeskEndpointOutputSchemas.resultsMarkProcessed,
	(input) =>
		tenantPlan(
			input,
			'PUT',
			`/formresults/${encodePathSegment(input.entryId)}/processed`,
			{ retryable: false },
		),
);

const pdf = defineOperation(
	'resultsPdf',
	FormdeskEndpointInputSchemas.resultsPdf,
	FormdeskEndpointOutputSchemas.resultsPdf,
	(input) =>
		tenantPlan(
			input,
			'POST',
			`/formresults/${encodePathSegment(input.entryId)}/pdf`,
			{
				body: jsonBody(input.settings ?? {}),
				binary: true,
				retryable: false,
			},
		),
);

const workflows = defineOperation(
	'resultsWorkflows',
	FormdeskEndpointInputSchemas.resultsWorkflows,
	FormdeskEndpointOutputSchemas.resultsWorkflows,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/formresults/${encodePathSegment(input.entryId)}/workflow`,
		),
);

const files = defineOperation(
	'resultsFiles',
	FormdeskEndpointInputSchemas.resultsFiles,
	FormdeskEndpointOutputSchemas.resultsFiles,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/formresults/${encodePathSegment(input.entryId)}/files`,
		),
);

const allFiles = defineOperation(
	'resultsAllFiles',
	FormdeskEndpointInputSchemas.resultsAllFiles,
	FormdeskEndpointOutputSchemas.resultsAllFiles,
	(input) =>
		tenantPlan(input, 'GET', `/forms/${encodePathSegment(input.form)}/files`),
);

const deleteFiles = defineOperation(
	'resultsDeleteFiles',
	FormdeskEndpointInputSchemas.resultsDeleteFiles,
	FormdeskEndpointOutputSchemas.resultsDeleteFiles,
	(input) =>
		tenantPlan(
			input,
			'DELETE',
			`/formresults/${encodePathSegment(input.entryId)}/files`,
			{ retryable: false },
		),
);

const deleteAllFiles = defineOperation(
	'resultsDeleteAllFiles',
	FormdeskEndpointInputSchemas.resultsDeleteAllFiles,
	FormdeskEndpointOutputSchemas.resultsDeleteAllFiles,
	(input) =>
		tenantPlan(
			input,
			'DELETE',
			`/forms/${encodePathSegment(input.form)}/files`,
			{ retryable: false },
		),
);

export const Results = {
	export: exportResults,
	list,
	get,
	add,
	update,
	remove,
	increment,
	markProcessed,
	pdf,
	workflows,
	files,
	allFiles,
	deleteFiles,
	deleteAllFiles,
};

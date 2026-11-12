import { defineApiEndpoint, PROJECT, pathId } from './api';

export const batchExportsList = defineApiEndpoint<'batchExportsList'>(
	'posthog.batchExports.list',
	(input) => ({ path: `${PROJECT}/batch_exports/`, query: input, log: input }),
);

export const hogFunctionsList = defineApiEndpoint<'hogFunctionsList'>(
	'posthog.hogFunctions.list',
	(input) => ({ path: `${PROJECT}/hog_functions/`, query: input, log: input }),
);

export const hogFunctionsGet = defineApiEndpoint<'hogFunctionsGet'>(
	'posthog.hogFunctions.get',
	(input) => ({
		path: `${PROJECT}/hog_functions/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

export const warehouseTablesList = defineApiEndpoint<'warehouseTablesList'>(
	'posthog.warehouseTables.list',
	(input) => ({
		path: `${PROJECT}/warehouse_tables/`,
		query: input,
		log: input,
	}),
);

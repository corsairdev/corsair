import type { ApiLabzEndpoints } from '..';
import { executeApiLabzModule } from './shared';
import {
	ApiLabzEndpointInputSchemas,
	ApiLabzEndpointOutputSchemas,
} from './types';

/** Lists Airtable tables for a base (API_LABZ_LIST_TABLES). */
export const listTables: ApiLabzEndpoints['airtableListTables'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ApiLabzEndpointInputSchemas.airtableListTables.parse(input);
	return executeApiLabzModule(
		ctx,
		'apilabz.airtable.listTables',
		'airtableListTables',
		parsedInput,
		ApiLabzEndpointOutputSchemas.airtableListTables,
	);
};

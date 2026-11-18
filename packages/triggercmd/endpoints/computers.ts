import type { TriggerCmdEndpoints } from '..';
import { call } from './call';
import {
	TriggerCmdEndpointInputSchemas,
	TriggerCmdEndpointOutputSchemas,
} from './types';

/**
 * The provider's own docs use this route as the credentials test, and its Go CLI
 * calls the same path with the token in the query. A GET is used here.
 */
export const list: TriggerCmdEndpoints['computersList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'computers.list',
			input: TriggerCmdEndpointInputSchemas.listComputers,
			output: TriggerCmdEndpointOutputSchemas.listComputers,
		},
		input,
		() => ({ method: 'GET', path: 'api/computer/list' }),
		{ log: (_parsed, result) => ({ computers: result.records.length }) },
	);

import type { TriggerCmdEndpoints } from '..';
import { call } from './call';
import {
	TriggerCmdEndpointInputSchemas,
	TriggerCmdEndpointOutputSchemas,
} from './types';

/**
 * The provider documents this route as a POST, and its own Python example calls
 * it with no body and only the Authorization header.
 */
export const list: TriggerCmdEndpoints['commandsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'commands.list',
			input: TriggerCmdEndpointInputSchemas.listCommands,
			output: TriggerCmdEndpointOutputSchemas.listCommands,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'api/command/list',
			query: { computer_id: parsed.computer_id },
		}),
		{ log: (_parsed, result) => ({ commands: result.records.length }) },
	);

/**
 * The provider documents `/api/run/trigger` as a POST with a JSON body of
 * `computer`, `trigger` and optional `params`. That is the current route; its
 * own CLI still calls the older `/api/run/triggersave` GET form.
 */
export const run: TriggerCmdEndpoints['commandsRun'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'commands.run',
			input: TriggerCmdEndpointInputSchemas.runCommand,
			output: TriggerCmdEndpointOutputSchemas.runCommand,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'api/run/trigger',
			body: {
				computer: parsed.computer,
				trigger: parsed.trigger,
				...(parsed.params === undefined ? {} : { params: parsed.params }),
			},
		}),
		{
			log: (parsed) => ({
				computer: parsed.computer,
				trigger: parsed.trigger,
				// The parameters are not logged: they are free text the caller
				// controls and can hold a path or a secret.
				has_params: parsed.params !== undefined,
			}),
		},
	);

export const history: TriggerCmdEndpoints['commandsHistory'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'commands.history',
			input: TriggerCmdEndpointInputSchemas.runHistory,
			output: TriggerCmdEndpointOutputSchemas.runHistory,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'api/run/list',
			query: { command_id: parsed.command_id },
		}),
		{
			log: (parsed, result) => ({
				command_id: parsed.command_id,
				runs: result.records.length,
			}),
		},
	);

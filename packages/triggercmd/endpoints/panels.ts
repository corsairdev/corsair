import type { TriggerCmdEndpoints } from '..';
import { call } from './call';
import {
	TriggerCmdEndpointInputSchemas,
	TriggerCmdEndpointOutputSchemas,
} from './types';

/**
 * Panel buttons are a dashboard feature: each button runs a command the user
 * configured, with the parameters the button carries.
 */
export const listButtons: TriggerCmdEndpoints['panelsList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'panels.list',
			input: TriggerCmdEndpointInputSchemas.listPanelButtons,
			output: TriggerCmdEndpointOutputSchemas.listPanelButtons,
		},
		input,
		() => ({ method: 'GET', path: 'api/panelbutton/list' }),
		{ log: (_parsed, result) => ({ buttons: result.records.length }) },
	);

export const trigger: TriggerCmdEndpoints['panelsTrigger'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'panels.trigger',
			input: TriggerCmdEndpointInputSchemas.triggerPanelButton,
			output: TriggerCmdEndpointOutputSchemas.triggerPanelButton,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'api/panel/trigger',
			query: {
				panel: parsed.panel,
				button: parsed.button,
				params: parsed.params,
			},
		}),
		{
			log: (parsed) => ({
				panel: parsed.panel,
				button: parsed.button,
				has_params: parsed.params !== undefined,
			}),
		},
	);

import type { CodereadrEndpoints } from '..';
import { call, idList } from './call';
import { shapeDevices } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './types';

export const list: CodereadrEndpoints['devicesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'devices.list',
			input: Inputs.devicesList,
			output: Outputs.devicesList,
		},
		input,
		(parsed) => ({
			section: 'devices',
			action: 'retrieve',
			device_id: idList(parsed.device_id),
		}),
		{
			shape: (root) => shapeDevices(root),
			log: (_, result) => ({ count: result.devices.length }),
			replaySafe: true,
		},
	);

export const update: CodereadrEndpoints['devicesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'devices.update',
			input: Inputs.devicesUpdate,
			output: Outputs.devicesUpdate,
		},
		input,
		(parsed) => ({
			section: 'devices',
			action: 'update',
			device_id: parsed.device_id,
			device_name: parsed.device_name,
		}),
		{
			shape: (_, parsed) => ({
				success: true,
				device_id: parsed.device_id,
			}),
			log: ({ device_id }) => ({ deviceId: device_id }),
		},
	);

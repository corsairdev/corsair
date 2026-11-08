import type { CodereadrEndpoints } from '..';
import { call, idList } from './call';
import { readCount, shapeUploads } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './types';

export const list: CodereadrEndpoints['uploadsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'uploads.list',
			input: Inputs.uploadsList,
			output: Outputs.uploadsList,
		},
		input,
		(parsed) => ({
			section: 'uploads',
			action: 'retrieve',
			service_id: idList(parsed.service_id),
			device_id: idList(parsed.device_id),
			user_id: idList(parsed.user_id),
			limit: parsed.limit,
			offset: parsed.offset,
		}),
		{
			shape: (root, parsed) => {
				const offset = parsed.offset ?? 0;
				return {
					...shapeUploads(root),
					next_offset:
						parsed.limit !== undefined && (readCount(root) ?? 0) >= parsed.limit
							? offset + parsed.limit
							: undefined,
				};
			},
			log: (_, result) => ({ count: result.uploads.length }),
			replaySafe: true,
		},
	);

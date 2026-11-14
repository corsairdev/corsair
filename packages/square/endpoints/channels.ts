import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/channels/bulk-retrieve (BulkRetrieveChannels). */
export const bulkGet: SquareEndpoints['channelsBulkGet'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.channelsBulkGet.parse(rawInput);
	return callSquare(ctx, '/v2/channels/bulk-retrieve', {
		method: 'POST',
		readOnly: true,
		body: input,
		output: SquareEndpointOutputSchemas.channelsBulkGet,
		event: 'channels.bulkGet',
	});
};

/** GET /v2/channels (ListChannels). */
export const list: SquareEndpoints['channelsList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.channelsList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/channels', {
		query: input,
		output: SquareEndpointOutputSchemas.channelsList,
		event: 'channels.list',
	});
};

/** GET /v2/channels/{channel_id} (RetrieveChannel). */
export const get: SquareEndpoints['channelsGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.channelsGet.parse(rawInput);
	return callSquare(ctx, '/v2/channels/{channel_id}', {
		path: { channel_id: input.channel_id },
		output: SquareEndpointOutputSchemas.channelsGet,
		event: 'channels.get',
		logged: { channel_id: input.channel_id },
	});
};

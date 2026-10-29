import type { JigsawstackEndpoints } from '../index';
import { jigsawCall } from './call';

export const vocr: JigsawstackEndpoints['vocr'] = async (ctx, input) =>
	jigsawCall(ctx, 'jigsawstack.vision.vocr', '/v1/vocr', 'POST', input, {
		body: input,
	});

export const detectObjects: JigsawstackEndpoints['detectObjects'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.vision.detectObjects',
		'/v1/object_detection',
		'POST',
		input,
		{ body: input },
	);

import type { JigsawstackEndpoints } from '../index';
import { jigsawCall } from './call';

export const classify: JigsawstackEndpoints['classify'] = async (ctx, input) =>
	jigsawCall(
		ctx,
		'jigsawstack.classification.classify',
		'/v1/classification',
		'POST',
		input,
		{ body: input },
	);

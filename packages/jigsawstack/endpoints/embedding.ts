import type { JigsawstackEndpoints } from '../index';
import { jigsawCall } from './call';

export const createEmbeddingV2: JigsawstackEndpoints['createEmbeddingV2'] =
	async (ctx, input) =>
		jigsawCall(
			ctx,
			'jigsawstack.embedding.createV2',
			'/v2/embedding',
			'POST',
			input,
			{ body: input },
		);

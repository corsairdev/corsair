import type { CanvaEndpoints } from '../index';
import { loggable } from './mappers';
import { callCanva, defined, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

export const create: CanvaEndpoints['imageTransformationsCreate'] = async (
	ctx,
	input,
) =>
	callCanva<CanvaEndpointOutputs['imageTransformationsCreate']>(
		ctx,
		'imageTransformations.create',
		loggable(input),
		'v1/image-transformations',
		{ method: 'POST', body: defined({ ...input }) },
	);

export const get: CanvaEndpoints['imageTransformationsGet'] = async (
	ctx,
	input,
) =>
	callCanva<CanvaEndpointOutputs['imageTransformationsGet']>(
		ctx,
		'imageTransformations.get',
		loggable(input),
		`v1/image-transformations/${seg(input.jobId)}`,
	);

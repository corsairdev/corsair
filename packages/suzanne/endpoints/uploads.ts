import type { SuzanneEndpoints } from '../index';
import { callSuzanne } from './call';
import { CreateUploadInputSchema, UploadSchema } from './types';

export const create: SuzanneEndpoints['createUpload'] = async (ctx, input) => {
	return callSuzanne(
		ctx,
		'suzanne.uploads.create',
		CreateUploadInputSchema,
		UploadSchema,
		input,
		() => ({ method: 'POST', url: '/v1/uploads' }),
		(_input, upload) => ({ uploadId: upload.upload_id }),
	);
};

import type { SuzanneEndpoints } from '../index';
import { callSuzanneDownload } from './call';
import { DownloadInputSchema, DownloadSchema } from './types';

export const download: SuzanneEndpoints['downloadModel'] = async (
	ctx,
	input,
) => {
	return callSuzanneDownload(
		ctx,
		'suzanne.models.download',
		DownloadInputSchema,
		DownloadSchema,
		input,
		(body) => ({ jobId: body.job_id, format: body.format }),
		(body) => ({ jobId: body.job_id, format: body.format }),
	);
};

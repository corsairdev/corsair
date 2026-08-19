import { logEventFromContext } from 'corsair/core';
import {
	GoogleDriveAPIError,
	makeAuthenticatedGoogleDriveRequest,
} from '../client';
import type { GoogleDriveEndpoints } from '../index';
import type { About } from '../types';

const STORAGE_QUOTA_FIELDS = 'storageQuota';

export const getQuota: GoogleDriveEndpoints['storageGetQuota'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleDriveRequest<About>(
		'/about',
		ctx,
		{
			method: 'GET',
			query: {
				fields: STORAGE_QUOTA_FIELDS,
			},
		},
	);

	const quota = result.storageQuota;
	if (!quota || Object.keys(quota).length === 0) {
		throw new GoogleDriveAPIError(
			'Google Drive about.get returned no storageQuota',
			502,
		);
	}

	await logEventFromContext(
		ctx,
		'googledrive.storage.getQuota',
		{ ...input },
		'completed',
	);
	return quota;
};

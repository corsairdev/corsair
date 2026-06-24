'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';
import { integrationCacheTag } from '@/server/integration-cache';
import { revalidateOssWriteSurface } from '@/server/oss-public-cache';

export async function markIntegrationFinished(integrationId: string) {
	try {
		const api = await getApi();
		const result = await api.integrations.markFinished({ integrationId });
		revalidatePath('/oss');
		revalidatePath(`/oss/${result.slug}`);
		revalidateOssWriteSurface();
		revalidateTag(integrationCacheTag(result.slug));
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to mark integration as finished'),
		);
	}
}

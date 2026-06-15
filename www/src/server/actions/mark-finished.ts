'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';

export async function markIntegrationFinished(integrationId: string) {
	try {
		const api = await getApi();
		const result = await api.integrations.markFinished({ integrationId });
		revalidatePath('/oss');
		revalidatePath(`/oss/${result.slug}`);
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to mark integration as finished'),
		);
	}
}

'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';

export async function unclaimIntegration(integrationId: string) {
	try {
		const api = await getApi();
		const result = await api.integrations.unclaim({ integrationId });
		revalidatePath('/oss');
		revalidatePath(`/oss/${result.slug}`);
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to unclaim integration'),
		);
	}
}

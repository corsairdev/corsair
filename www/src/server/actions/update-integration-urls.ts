'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';

export async function updateIntegrationUrls(formData: FormData) {
	const integrationId = String(formData.get('integrationId') ?? '').trim();
	const urls = {
		issueUrl: String(formData.get('issueUrl') ?? ''),
		prUrl: String(formData.get('prUrl') ?? ''),
		docsUrl: String(formData.get('docsUrl') ?? ''),
	};

	if (!integrationId) {
		throw new Error('Integration ID is required');
	}

	try {
		const api = await getApi();
		const result = await api.integrations.updateUrls({ integrationId, urls });
		revalidatePath(`/oss/${result.slug}`);
		revalidatePath('/oss');
		return result;
	} catch (error) {
		throw new Error(getActionErrorMessage(error, 'Failed to save URLs'));
	}
}

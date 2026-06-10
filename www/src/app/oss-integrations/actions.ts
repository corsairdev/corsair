'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';

export async function setGithubUsername(username: string) {
	try {
		const api = await getApi();
		const result = await api.account.setGithubUsername({ username });
		revalidatePath('/oss-integrations');
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to save GitHub username'),
		);
	}
}

export async function claimIntegration(integrationId: string) {
	try {
		const api = await getApi();
		const result = await api.integrations.claim({ integrationId });
		revalidatePath('/oss-integrations');
		revalidatePath(`/integrations/${result.slug}`);
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to claim integration'),
		);
	}
}

export async function unclaimIntegration(integrationId: string) {
	try {
		const api = await getApi();
		const result = await api.integrations.unclaim({ integrationId });
		revalidatePath('/oss-integrations');
		revalidatePath(`/integrations/${result.slug}`);
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to unclaim integration'),
		);
	}
}

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
		revalidatePath(`/integrations/${result.slug}`);
		revalidatePath('/oss-integrations');
		return result;
	} catch (error) {
		throw new Error(getActionErrorMessage(error, 'Failed to save URLs'));
	}
}

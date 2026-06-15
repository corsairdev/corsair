'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';

export async function setGithubUsername(username: string) {
	try {
		const api = await getApi();
		const result = await api.account.setGithubUsername({ username });
		revalidatePath('/oss');
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to save GitHub username'),
		);
	}
}

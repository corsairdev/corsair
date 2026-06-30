'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';
import { OSS_CACHE_TAGS } from '@/server/oss-public-cache';

export async function setGithubUsername(username: string) {
	try {
		const api = await getApi();
		const result = await api.account.setGithubUsername({ username });
		revalidatePath('/oss');
		revalidateTag(OSS_CACHE_TAGS.activity);
		revalidateTag(OSS_CACHE_TAGS.leaderboard);
		return result;
	} catch (error) {
		throw new Error(
			getActionErrorMessage(error, 'Failed to save GitHub username'),
		);
	}
}

'use server';

import { revalidatePath } from 'next/cache';

import { getActionErrorMessage } from '@/lib/action-errors';
import { getApi } from '@/server/api/caller';

export async function joinWaitlist(input: {
	discordUsername: string;
	githubUsername: string;
}) {
	try {
		const api = await getApi();
		const result = await api.account.joinWaitlist(input);
		revalidatePath('/oss/waitlist');
		return result;
	} catch (error) {
		throw new Error(getActionErrorMessage(error, 'Failed to join waitlist'));
	}
}

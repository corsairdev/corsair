import 'server-only';

import { cache } from 'react';

import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';

export const getCurrentProfile = cache(async () => {
	const session = await getSession();
	if (!session) return null;
	const api = await getApi();
	return api.account.getProfile();
});

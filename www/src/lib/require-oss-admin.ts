import 'server-only';

import { TRPCError } from '@trpc/server';

import { getSession } from '@/lib/auth-server';
import { isOssAdminEmail } from '@/lib/oss-admin';

export async function requireOssAdminSession() {
	const session = await getSession();

	if (!session?.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Sign in required',
		});
	}

	if (!isOssAdminEmail(session.user.email)) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'Admin access required',
		});
	}

	return session;
}

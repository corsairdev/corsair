import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth-server';
import { isOssAdminEmail } from '@/lib/oss-admin';

export default async function OssAdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await getSession();

	if (!session || !isOssAdminEmail(session.user.email)) {
		redirect('/oss');
	}

	return children;
}

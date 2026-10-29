import type { ReactNode } from 'react';

import { LegalSiteLayout } from '@/components/legal/legal-site-layout';

export default function PrivacyPolicyLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <LegalSiteLayout>{children}</LegalSiteLayout>;
}

import type { ReactNode } from 'react';

import { LegalSiteLayout } from '@/components/legal/legal-site-layout';

export default function TermsOfServiceLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <LegalSiteLayout>{children}</LegalSiteLayout>;
}

import type { ReactNode } from 'react';

import { IntegrationsLayout } from '@/components/integrations/integrations-layout';

export default function IntegrationsPagesLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <IntegrationsLayout>{children}</IntegrationsLayout>;
}

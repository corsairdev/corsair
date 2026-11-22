import type { ReactNode } from 'react';

import { IntegrationsLayout } from '@/components/integrations/integrations-layout';

export default function BuiltWithLayout({ children }: { children: ReactNode }) {
	return <IntegrationsLayout>{children}</IntegrationsLayout>;
}

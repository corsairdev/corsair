import type { ReactNode } from 'react';

import { IntegrationsTopFade } from '@/components/integrations/integrations-top-fade';
import { SiteFooter } from '@/components/landing/footer/site-footer';
import { SiteMenu } from '@/components/landing/menu/site-menu';
import '@/components/landing/theme.css';

export function IntegrationsLayout({ children }: { children: ReactNode }) {
	return (
		<div className="landing min-h-screen overflow-x-clip bg-[#f4f4f4]">
			<IntegrationsTopFade />
			<SiteMenu />
			{children}
			<SiteFooter />
		</div>
	);
}

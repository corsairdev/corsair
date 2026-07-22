import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/landing/footer/site-footer';
import { SiteMenu } from '@/components/landing/menu/site-menu';
import '@/components/landing/theme.css';

export function LegalSiteLayout({ children }: { children: ReactNode }) {
	return (
		<div className="landing min-h-screen overflow-x-clip bg-[#f4f4f4]">
			<SiteMenu />
			{children}
			<SiteFooter />
		</div>
	);
}

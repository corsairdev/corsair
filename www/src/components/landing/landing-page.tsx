import { AgentRolesSection } from './agent-roles/agent-roles-section';
import { BuiltInsSection } from './built-ins/built-ins-section';
import { DevelopersSection } from './developers/developers-section';
import { FaqSection } from './faq/faq-section';
import { SiteFooter } from './footer/site-footer';
import { LandingHero } from './hero/landing-hero';
import { buildHomeMarkdown } from './home-markdown';
import { ManagedToolsSection } from './managed-tools/managed-tools-section';
import { SiteMenu } from './menu/site-menu';
import { PillarsSection } from './pillars/pillars-section';
import { GatewayPricingSection } from './pricing/gateway-pricing-section';
import { ViewSwitch } from './view-switch/view-switch';

export const LANDING_BACKGROUND = {
	backgroundImage:
		'radial-gradient(circle at 2px 2px, rgba(74, 56, 245, 0.12) 1px, transparent 0)',
	backgroundSize: '12px 12px',
};

export function LandingPage({ starCount }: { starCount?: number | null }) {
	return (
		<div
			className="landing min-h-screen overflow-x-clip bg-[#f4f4f4]"
			style={LANDING_BACKGROUND}
		>
			<SiteMenu />
			<ViewSwitch markdown={buildHomeMarkdown()} footer={<SiteFooter />}>
				<>
					<LandingHero />
					<AgentRolesSection />
					<PillarsSection />
					<BuiltInsSection />
					<ManagedToolsSection />
					<DevelopersSection starCount={starCount} />
					<GatewayPricingSection />
					<FaqSection />
				</>
			</ViewSwitch>
		</div>
	);
}

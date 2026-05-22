import { EngineersSection } from './engineers/engineers-section';
import { FaqSection } from './faq/faq-section';
import { SiteFooter } from './footer/site-footer';
import { LandingHero } from './hero/landing-hero';
import { SiteMenu } from './menu/site-menu';
import { ProblemStatementSection } from './problem-statement/problem-statement-section';
import { SolutionFramingSection } from './solution-framing/solution-framing-section';

export function LandingPage() {
	return (
		<div className="landing min-h-screen overflow-x-hidden bg-[#f4f4f4]">
			<SiteMenu />
			<LandingHero />
			<ProblemStatementSection />
			<SolutionFramingSection />
			<EngineersSection />
			<FaqSection />
			<SiteFooter />
		</div>
	);
}

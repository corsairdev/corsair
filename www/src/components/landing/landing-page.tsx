import { EngineersSection } from './engineers/engineers-section';
import { FaqSection } from './faq/faq-section';
import { LandingHero } from './hero/landing-hero';
import { SiteMenu } from './menu/site-menu';
import { ProblemStatementSection } from './problem-statement/problem-statement-section';
import { SolutionFramingSection } from './solution-framing/solution-framing-section';
import { YcBackedLink } from './yc-backed-link';

export function LandingPage() {
	return (
		<div className="landing min-h-screen overflow-x-hidden bg-[#f4f4f4]">
			<SiteMenu />
			<LandingHero />
			<div className="flex justify-center bg-[#f4f4f4] px-4 -mt-6 py-5 md:-mt-8 md:py-6">
				<YcBackedLink height={56} className="opacity-95 transition-opacity hover:opacity-100" />
			</div>
			<ProblemStatementSection />
			<SolutionFramingSection />
			<EngineersSection />
			<FaqSection />
		</div>
	);
}

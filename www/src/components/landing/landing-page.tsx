import { ChooseYourPathSection } from './choose-your-path/choose-your-path-section';
import { FaqSection } from './faq/faq-section';
import { SiteFooter } from './footer/site-footer';
import { LandingHero } from './hero/landing-hero';
import { SiteMenu } from './menu/site-menu';
import { ProblemStatementSection } from './problem-statement/problem-statement-section';
import { SolutionFramingSection } from './solution-framing/solution-framing-section';
import { TerminalTrioSection } from './terminal-trio/terminal-trio-section';

export function LandingPage() {
	return (
		<div
			className="landing min-h-screen overflow-x-hidden bg-[#f4f4f4]"
			style={{
				backgroundImage:
					'radial-gradient(circle at 2px 2px, rgba(74, 56, 245, 0.12) 1px, transparent 0)',
				backgroundSize: '12px 12px',
			}}
		>
			<SiteMenu />
			<LandingHero />
			<TerminalTrioSection />
			<ProblemStatementSection />
			<SolutionFramingSection />
			<ChooseYourPathSection />
			{/* <UseCasesSection /> */}
			<FaqSection />
			<SiteFooter />
		</div>
	);
}

import { EngineersSection } from './engineers/engineers-section';
import { FaqSection } from './faq/faq-section';
import { TwentyHero } from './hero/twenty-hero';
import { TwentyMenu } from './menu/twenty-menu';
import { ProblemStatementSection } from './problem-statement/problem-statement-section';
import { SolutionFramingSection } from './solution-framing/solution-framing-section';

export function TwentyLandingPage() {
	return (
		<div className="twenty-landing min-h-screen bg-[#f4f4f4]">
			<TwentyMenu />
			<TwentyHero />
			<ProblemStatementSection />
			<SolutionFramingSection />
			<EngineersSection />
			<FaqSection />
		</div>
	);
}

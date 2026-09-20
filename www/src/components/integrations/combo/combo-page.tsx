import { IntegrationFaqAccordion } from '@/components/integrations/detail/integration-faq-accordion';
import { getComboCanonical } from '@/lib/combined-integrations';
import type { ComboData } from '@/lib/combo-types';
import { ComboHero } from './combo-hero';
import { AppDetails } from './combo-sections';
import { ComboWorkflows } from './combo-workflows';
import { HowToConnect } from './how-to-connect';
import { KbDemo } from './kb-demo';
import { WorkflowBuilder } from './workflow-builder';

function escapeJsonLd(value: string) {
	return value
		.replace(/&/g, '\\u0026')
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e');
}

function plainText(value: string) {
	return value.replace(/`/g, '');
}

function ComboJsonLd({ combo }: { combo: ComboData }) {
	const canonical = getComboCanonical(combo.slugA, combo.slugB);
	const json = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'FAQPage',
				mainEntity: combo.faqs.map((f) => ({
					'@type': 'Question',
					name: plainText(f.question),
					acceptedAnswer: { '@type': 'Answer', text: plainText(f.answer) },
				})),
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Integrations',
						item: 'https://corsair.dev/integrations',
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: combo.displayA,
						item: `https://corsair.dev/integrations/${combo.slugA}`,
					},
					{
						'@type': 'ListItem',
						position: 3,
						name: combo.title,
						item: `https://corsair.dev${canonical}`,
					},
				],
			},
			{
				'@type': 'HowTo',
				name: `How to connect ${combo.displayA} and ${combo.displayB}`,
				step: combo.connectSteps.map((step) => ({
					'@type': 'HowToStep',
					name: step.title,
					text: step.description,
				})),
			},
		],
	};
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(json)) }}
		/>
	);
}

export function ComboPage({ combo }: { combo: ComboData }) {
	const key = `${combo.slugA}-and-${combo.slugB}`;
	return (
		<main className="pb-16">
			<ComboJsonLd combo={combo} />
			<ComboHero combo={combo} />
			<WorkflowBuilder key={`builder-${key}`} combo={combo} />
			<ComboWorkflows combo={combo} />
			<HowToConnect combo={combo} />
			<KbDemo key={`kb-${key}`} combo={combo} />
			<AppDetails combo={combo} />
			<IntegrationFaqAccordion
				faqs={combo.faqs}
				heading={`${combo.displayA} and ${combo.displayB} FAQ`}
				variant="combo"
			/>
			<section className="py-10 md:py-12">
				<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
					<div className="rounded-md bg-[#1c1c1c] px-4 py-10 text-center sm:px-8 sm:py-12">
						<h2 className="font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-white">
							Connect {combo.displayA} and {combo.displayB}
						</h2>
						<p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-white/55">
							Install both plugins, pick a trigger and an action above, then run
							it.
						</p>
						<div className="mt-6 flex flex-wrap justify-center gap-3">
							<a
								href="#builder"
								className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-[#4a38f5] hover:text-white"
							>
								Build a workflow
							</a>
							<a
								href="https://docs.corsair.dev"
								className="rounded-sm border border-white/20 px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:border-white/45"
							>
								Read the docs
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

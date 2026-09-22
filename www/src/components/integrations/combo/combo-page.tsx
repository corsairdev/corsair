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
		</main>
	);
}

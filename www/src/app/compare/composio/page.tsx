import type { Metadata } from 'next';

import { CompareCta } from '@/components/compare/compare-cta';
import { CompareFeatureTable } from '@/components/compare/compare-feature-table';
import { CompareHero } from '@/components/compare/compare-hero';
import { CompareHtmlContent } from '@/components/compare/compare-html-content';
import { CompareReasonSection } from '@/components/compare/compare-reason-section';
import content from '@/content/compare/composio.json';
import type { ComparePageContent } from '@/content/compare/types';

const composioContent = content as ComparePageContent;

export const metadata: Metadata = {
	title: composioContent.meta.title,
	description: composioContent.meta.description,
	alternates: {
		canonical: '/compare/composio',
	},
};

export default function CompareComposioPage() {
	return (
		<main>
			<CompareHero
				competitor={composioContent.hero.competitor}
				title={composioContent.hero.title}
				description={composioContent.hero.description}
			/>

			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				{composioContent.sections.map((section, index) => (
					<div key={section.title}>
						{index > 0 ? <hr className="border-[#1c1c1c1a]" /> : null}
						<CompareReasonSection
							index={index + 1}
							title={section.title}
							description={<CompareHtmlContent html={section.body} />}
						/>
					</div>
				))}

				<CompareFeatureTable {...composioContent.recap} />
			</div>

			<CompareCta />
		</main>
	);
}

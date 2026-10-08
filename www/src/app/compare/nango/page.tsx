import type { Metadata } from 'next';

import { CompareCta } from '@/components/compare/compare-cta';
import { CompareFeatureTable } from '@/components/compare/compare-feature-table';
import { CompareHero } from '@/components/compare/compare-hero';
import { CompareHtmlContent } from '@/components/compare/compare-html-content';
import { CompareReasonSection } from '@/components/compare/compare-reason-section';
import { NangoLimitedApiOperationsSection } from '@/components/compare/nango-limited-api-operations-section';
import content from '@/content/compare/nango.json';
import type { ComparePageContent } from '@/content/compare/types';

const nangoContent = content as ComparePageContent;

export const metadata: Metadata = {
	title: nangoContent.meta.title,
	description: nangoContent.meta.description,
	alternates: {
		canonical: '/compare/nango',
	},
};

export default function CompareNangoPage() {
	return (
		<main>
			<CompareHero
				competitor={nangoContent.hero.competitor}
				title={nangoContent.hero.title}
				description={nangoContent.hero.description}
			/>

			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				{nangoContent.sections.map((section, index) => (
					<div key={section.title}>
						{index > 0 ? <hr className="border-[#1c1c1c1a]" /> : null}
						<CompareReasonSection
							index={index + 1}
							title={section.title}
							description={
								section.title === 'Limited API Operations' ? (
									<NangoLimitedApiOperationsSection bodyHtml={section.body} />
								) : (
									<CompareHtmlContent html={section.body} />
								)
							}
						/>
					</div>
				))}

				<CompareFeatureTable {...nangoContent.recap} />
			</div>

			<CompareCta />
		</main>
	);
}

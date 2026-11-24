import { CompareFeatureTable } from '@/components/compare/compare-feature-table';
import { CompareHtmlContent } from '@/components/compare/compare-html-content';
import {
	comparisonMetadata,
	GatewayComparisonPage,
} from '@/components/compare/gateway-comparison';
import { H3, Section, textLink } from '@/components/gateway/gateway-ui';
import content from '@/content/compare/composio.json';
import type { ComparePageContent } from '@/content/compare/types';
import { CLAIM_HREF, DOCS_URL } from '@/lib/site-links';

/**
 * One page for both Composio comparisons: the MCP gateway against Composio
 * For You first (from lug.dev/compare/composio, facts in
 * content/compare/gateway.ts), then the SDK against Composio's developer
 * platform (the page that was here before, content/compare/composio.json).
 */

const sdk = content as ComparePageContent;

export const metadata = comparisonMetadata('composio');

export default function CompareComposioPage() {
	return (
		<GatewayComparisonPage
			slug="composio"
			heroNote={
				<p className="text-sm text-[#1c1c1c99]">
					Adding integrations to your own product?{' '}
					<a href="#sdk" className={textLink}>
						Compare the SDKs
					</a>
				</p>
			}
			endCtas={[
				{ label: 'Claim your URL', href: CLAIM_HREF },
				{ label: 'Read the SDK docs', href: DOCS_URL, external: true },
			]}
		>
			<Section
				id="sdk"
				title="Building on the SDK instead?"
				lede={`Everything above is about using your own apps through one URL. If you're building integrations into your own product, compare the open-source Corsair SDK with Composio. ${sdk.hero.description}`}
				width="wide"
			>
				<div className="grid gap-8 md:grid-cols-3">
					{sdk.sections.map((section) => (
						<div key={section.title} className="flex flex-col gap-3">
							<H3>{section.title}</H3>
							<div className="text-[15px] leading-[1.65] text-[#1c1c1c99] md:text-base">
								<CompareHtmlContent html={section.body} />
							</div>
						</div>
					))}
				</div>
				<div className="mt-14">
					<CompareFeatureTable {...sdk.recap} title="Recap: the SDKs" />
				</div>
			</Section>
		</GatewayComparisonPage>
	);
}

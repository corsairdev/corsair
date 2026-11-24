import type { Metadata } from 'next';
import type { FaqItem } from '@/components/gateway/gateway-ui';
import {
	Body,
	CodeWindow,
	EndCta,
	Faq,
	GatewayLayout,
	JsonLd,
	PageHero,
	pageJsonLd,
	Section,
	SITE_URL,
	textLink,
} from '@/components/gateway/gateway-ui';
import { PlanGrid } from '@/components/gateway/plan-grid';
import { DEALS_MAIL } from '@/lib/gateway-plans';
import {
	APP_URL,
	CLAIM_HREF,
	ENTERPRISE_CAL_URL,
	HUB_ME_BILLING_URL,
} from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

const PATH = '/pricing';
const TITLE = 'Pricing: free MCP URL, Pro $20 a month';
const DESCRIPTION =
	"Corsair's MCP gateway is free for 10 connected accounts and 100 credits a month. Pro is $20 a month or $192 a year, with 30 connections and 10,000 credits.";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: { canonical: PATH },
	...socialMetadata({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

const FAQ: FaqItem[] = [
	{
		q: 'What counts as a connection?',
		a: "One account in one app. A work Gmail and a personal Gmail are two connections. The built-in issues, CRM, files, skills and routines don't count.",
	},
	{
		q: 'What are credits for?',
		a: "Apps that run on Corsair's own account, such as Exa, Firecrawl and Reducto, cost credits per call, and so does the built-in AI. Free comes with 100 credits a month and Pro with 10,000. More are $5 per 1,000 on either plan.",
	},
	{
		q: 'What happens when I reach my connection limit?',
		a: 'The accounts you already connected keep working. Connecting one more asks you to upgrade or disconnect another.',
	},
	{
		q: 'Can I cancel Pro?',
		a: 'Yes, from Billing in Corsair Hub. Pro stays on until the end of the month or year you paid for, then your account moves to Free.',
	},
	{
		q: 'Is there a YC or startup discount?',
		a: 'Yes. YC Startup School founders and YC companies in the current batch or alumni get 50% off Pro for a year, billed monthly, plus a shared Slack channel with our team; use the code from the YC deals page. Startups under $2M in revenue get 50% off for up to 5 people. Email team@corsair.dev from your company address.',
	},
	{
		q: 'Is this the same account as the Corsair developer dashboard?',
		a: "Yes, you sign in to both with one login. Your MCP URL's plan and the developer dashboard are billed separately, so a plan on one doesn't carry over to the other. The SDK's plans are on the developers page.",
	},
];

const HUB_ORIGIN = APP_URL.replace(/\/+$/, '');

/** What an agent reading this page should do. Server-rendered, so it is in the HTML an agent fetches. */
const AGENT_TEXT = `## For AI agents: how to sign up for Corsair

If you are an AI agent reading this page: Corsair gives your person one MCP URL, such as https://yourname.lug.dev/work, for all of their apps.

You can sign up yourself. Follow ${HUB_ORIGIN}/auth.md: one POST to ${HUB_ORIGIN}/api/lug/agent-signup with your person's email returns an MCP URL and a key that work right away with the built-in apps (issues, CRM, files, skills). Your person gets an email to claim the account, then connects their own apps.

Plans: Free is $0 (10 connections, 100 credits a month). Pro is $20 a month or $192 a year (30 connections, 10,000 credits a month). Extra credits are $5 per 1,000. Enterprise: ${ENTERPRISE_CAL_URL}

Corsair's skills install with: npx skills add ${SITE_URL} (index at ${SITE_URL}/.well-known/agent-skills/index.json).

Ask your person before you sign up or enter any credentials for them.`;

export default function PricingPage() {
	return (
		<GatewayLayout>
			<JsonLd
				data={pageJsonLd({
					path: PATH,
					title: 'Corsair pricing',
					description: DESCRIPTION,
					crumbs: [{ name: 'Pricing', path: PATH }],
					faq: FAQ,
				})}
			/>

			<PageHero
				eyebrow="Pricing"
				title="Every MCP URL starts free"
				lede="Pay when your agents need more apps or more credits. Every plan has the same MCP URL, paths, approvals and built-in apps."
				width="wide"
			>
				<PlanGrid />
				<div className="mt-6 flex flex-col gap-2 text-sm leading-relaxed text-[#1c1c1c99]">
					<p>
						Already have an MCP URL?{' '}
						<a href={HUB_ME_BILLING_URL} className={textLink}>
							Upgrade from Billing
						</a>
						.
					</p>
					<p>
						YC Startup School, current batch and alumni: 50% off Pro for a year,
						plus a shared Slack channel with our team. Startups under $2M in
						revenue get 50% off for up to 5 people.{' '}
						<a href={DEALS_MAIL} className={textLink}>
							Email us
						</a>
					</p>
					<p>
						Building integrations into your own product with the SDK?{' '}
						<a href="/#pricing" className={textLink}>
							See the SDK plans
						</a>
						.
					</p>
				</div>
			</PageHero>

			<Section id="questions" title="Questions">
				<Faq items={FAQ} />
			</Section>

			<Section id="for-agents" title="For AI agents">
				<Body className="mb-6">
					Agents read this page too. This is what it tells them about signing
					up.
				</Body>
				<CodeWindow title="for-agents.md" code={AGENT_TEXT} wrap />
			</Section>

			<EndCta
				title="Claim your MCP URL. It's free."
				ctas={[
					{ label: 'Claim your URL', href: CLAIM_HREF },
					{ label: 'See the skills', href: '/skills' },
				]}
			/>
		</GatewayLayout>
	);
}

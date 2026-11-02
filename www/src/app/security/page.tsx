import type { Metadata } from 'next';
import Link from 'next/link';

import {
	LegalDivider,
	LegalDocument,
	LegalSection,
	legalLinkClassName,
} from '@/components/legal/legal-document';
import { APP_URL, GITHUB_URL } from '@/lib/site-links';
import { socialMetadata } from '@/lib/social-metadata';

const TITLE = 'Security';
const DESCRIPTION =
	'How Corsair protects the credentials and data your agents use: per-account encryption, keys in AWS KMS, sandboxed scripts, approvals, deletion, and how to report a vulnerability.';

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	alternates: {
		canonical: '/security',
	},
	...socialMetadata({
		title: TITLE,
		description: DESCRIPTION,
		path: '/security',
	}),
};

const SECURITY_CONTACT_EMAIL = 'team@corsair.dev';
const LAST_UPDATED = 'November 2, 2026';
const ENCRYPTION_SOURCE_URL = `${GITHUB_URL}/blob/main/packages/corsair/core/auth/encryption.ts`;

const MODES = [
	{ mode: 'Read', allows: 'Reads only. Writes are refused.' },
	{
		mode: 'Cautious (default)',
		allows:
			'Writes go through. Destructive actions, such as a delete, need your approval.',
	},
	{
		mode: 'Strict',
		allows: 'Every write needs your approval. Destructive actions are refused.',
	},
	{ mode: 'Open', allows: 'Everything, without asking.' },
] as const;

const strong = 'font-medium text-[#1c1c1c]';

export default function SecurityPage() {
	return (
		<LegalDocument
			eyebrow="Trust"
			title={TITLE}
			lastUpdated={LAST_UPDATED}
			relatedLink={{ href: '/privacy-policy', label: 'Privacy Policy' }}
		>
			<section className="space-y-4">
				<p>
					Corsair holds the keys to your apps so your agent doesn&apos;t have
					to. This page explains how we protect them. For what we collect and
					how long we keep it, see the{' '}
					<Link href="/privacy-policy" className={legalLinkClassName}>
						Privacy Policy
					</Link>
					.
				</p>
				<p>
					There are two ways to run Corsair, and they differ in who holds the
					keys:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className={strong}>The SDK in your own app.</strong>{' '}
						Credentials live in your database, encrypted with a key (
						<code className="text-sm">CORSAIR_KEK</code>) that only you hold.
						Corsair never has it.
					</li>
					<li>
						<strong className={strong}>Corsair Cloud</strong>, which includes
						your links at {APP_URL.replace('https://', '')}/me and your
						yourname.lug.dev address. We store your credentials and the data
						synced from your apps, encrypted, and run your tools for you. Most
						of this page is about this case.
					</li>
				</ul>
			</section>

			<LegalDivider />

			<LegalSection title="Your agent never sees your credentials">
				<p>
					An agent works with tool names, arguments and results. Corsair
					attaches the credential when it calls the app, so the token or API key
					never appears in a tool result or in the model&apos;s context.
				</p>
				<p>
					Scripts an agent writes (<code className="text-sm">run_script</code>{' '}
					and <code className="text-sm">read_data</code>) run in an isolated
					sandbox with no network, filesystem or process access. The only thing
					a script can reach is the person&apos;s own connected apps, through
					Corsair.
				</p>
			</LegalSection>

			<LegalSection title="How credentials and data are stored">
				<p>
					Every connected account has its own data key. Its OAuth tokens and API
					keys, and the records we sync from it (messages, issues, events), are
					encrypted with that key using AES-256-GCM.
				</p>
				<p>
					Data keys are encrypted in turn by a workspace key. On Corsair Cloud,
					workspace keys are held in AWS Key Management Service. The servers
					that run your tools can&apos;t decrypt them on their own: each request
					carries a short-lived grant that Corsair issues for that one
					workspace, and the key service checks it before it unlocks anything.
				</p>
				<p>
					With the SDK, the workspace key is your{' '}
					<code className="text-sm">CORSAIR_KEK</code>. The{' '}
					<a
						href={ENCRYPTION_SOURCE_URL}
						className={legalLinkClassName}
						target="_blank"
						rel="noopener noreferrer"
					>
						encryption code
					</a>{' '}
					is open source, so you can read exactly how it works.
				</p>
			</LegalSection>

			<LegalSection title="Can another customer reach your data?">
				<p>
					Every request is tied to one project and one person before anything
					runs.
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						The tokens Corsair issues to MCP clients are signed, expire, and
						name the one person and link they belong to.
					</li>
					<li>
						A grant unlocks one workspace, so a request for one customer
						can&apos;t open another customer&apos;s keys.
					</li>
					<li>
						Inside a project, each person&apos;s connections and synced records
						are kept apart by their tenant ID.
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="What an agent is allowed to do">
				<p>
					Every link has a mode. Corsair checks each action against it on our
					side, whatever the client allows.
				</p>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-[#1c1c1c1a]">
								<th
									scope="col"
									className="py-2 pr-4 font-medium text-[#1c1c1c]"
								>
									Mode
								</th>
								<th scope="col" className="py-2 font-medium text-[#1c1c1c]">
									What it allows
								</th>
							</tr>
						</thead>
						<tbody>
							{MODES.map((row) => (
								<tr key={row.mode} className="border-b border-[#1c1c1c0d]">
									<td className="whitespace-nowrap py-2 pr-4 text-[#1c1c1c]">
										{row.mode}
									</td>
									<td className="py-2">{row.allows}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p>
					When an action needs approval, you get a link that shows exactly what
					will run and with which arguments. One approval covers that action
					once.
				</p>
				<p>
					This is also the defense against prompt injection. An email or a web
					page can carry instructions, and a model may follow them. Corsair
					doesn&apos;t rely on the model to refuse: a read-only link can&apos;t
					write and a strict link can&apos;t delete, whatever the prompt says.
				</p>
			</LegalSection>

			<LegalSection title="Signing in">
				<p>
					MCP clients connect with OAuth and PKCE. Corsair stores sign-in codes
					and refresh tokens only as hashes, so the stored values can&apos;t be
					used to sign in. You can sign any client out of a link at{' '}
					<a href={`${APP_URL}/me`} className={legalLinkClassName}>
						{APP_URL.replace('https://', '')}/me
					</a>
					.
				</p>
			</LegalSection>

			<LegalSection title="Deleting your data">
				<p>
					Remove an app, a connection or a person from a project, and Corsair
					deletes that account&apos;s credentials and everything synced from it.
					Adding it back means connecting again.
				</p>
				<p>
					Workflow run records are deleted 30 days after the run. The{' '}
					<Link href="/privacy-policy" className={legalLinkClassName}>
						Privacy Policy
					</Link>{' '}
					lists every retention period.
				</p>
			</LegalSection>

			<LegalSection title="AI and your data">
				<p>
					We don&apos;t train models on your data or on data from your apps.
					Optional AI steps in workflows go through a gateway we run to
					Microsoft Azure OpenAI Service, under terms that don&apos;t allow it
					to train on the data either.
				</p>
			</LegalSection>

			<LegalSection title="Open source">
				<p>
					The SDK, every integration and the encryption code are open source
					under the Apache 2.0 license on{' '}
					<a
						href={GITHUB_URL}
						className={legalLinkClassName}
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
					. You can read how credentials are stored, or run all of it in your
					own infrastructure.
				</p>
			</LegalSection>

			<LegalSection title="Report a vulnerability">
				<p>
					Email{' '}
					<a
						href={`mailto:${SECURITY_CONTACT_EMAIL}`}
						className={legalLinkClassName}
					>
						{SECURITY_CONTACT_EMAIL}
					</a>{' '}
					with what you found, where you found it, and the steps that show it.
					The same address takes security questionnaires and review requests.
				</p>
				<p>While you test:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Use only accounts and data that are yours.</li>
					<li>
						Don&apos;t make the service slow or unavailable, send spam, or use
						social engineering.
					</li>
					<li>Stop once you can show the issue, and don&apos;t keep access.</li>
					<li>
						Give us reasonable time to fix it before you tell anyone else.
					</li>
				</ul>
				<p>
					If you act in good faith and follow these rules, we won&apos;t take
					legal action against you for your research. Our{' '}
					<a href="/.well-known/security.txt" className={legalLinkClassName}>
						security.txt
					</a>{' '}
					gives the same address.
				</p>
			</LegalSection>
		</LegalDocument>
	);
}

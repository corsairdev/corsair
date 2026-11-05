import { ArrowDown } from '@phosphor-icons/react/dist/ssr';
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
	'How Corsair keeps your API keys, tokens and app data safe: envelope encryption for every account, keys held in AWS KMS that rotate automatically, no cross-tenant access, sandboxed scripts and approvals.';

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
const LAST_UPDATED = 'November 3, 2026';
const ENVELOPE_ENCRYPTION_URL =
	'https://en.wikipedia.org/wiki/Hybrid_cryptosystem#Envelope_encryption';
const ENCRYPTION_SOURCE_URL = `${GITHUB_URL}/blob/main/packages/corsair/core/auth/encryption.ts`;

const SUMMARY = [
	'Corsair Cloud encrypts every API key, OAuth token and record it syncs, and each account has its own key.',
	'The keys that unlock them are held in AWS Key Management Service and rotate automatically. Our database only ever stores them encrypted.',
	'If our database were copied tomorrow, your API keys and app data would stay unreadable.',
	'No cross-tenant contamination: one customer’s requests can’t open another customer’s data.',
] as const;

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
const code = 'text-sm';

export default function SecurityPage() {
	return (
		<LegalDocument
			eyebrow="Trust"
			title={TITLE}
			lastUpdated={LAST_UPDATED}
			relatedLink={{ href: '/privacy-policy', label: 'Privacy Policy' }}
		>
			<section className="space-y-5">
				<p>
					Corsair holds the keys to your apps so your agent doesn&apos;t have
					to. Here is how we keep them, and the data that comes with them, safe.
				</p>
				<div className="rounded-xl border border-[#1c1c1c]/10 bg-white p-5 sm:p-6">
					<ul className="space-y-3">
						{SUMMARY.map((line) => (
							<li key={line} className="flex gap-3 text-[#1c1c1c]">
								<span
									aria-hidden
									className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#4a38f5]"
								/>
								<span>{line}</span>
							</li>
						))}
					</ul>
					<a
						href="#corsair-cloud"
						className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#1c1c1c] px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-[#1c1c1c]/85"
					>
						Learn more
						<ArrowDown size={14} weight="bold" aria-hidden />
					</a>
				</div>
			</section>

			<LegalDivider />

			<div id="corsair-cloud" className="scroll-mt-24">
				<LegalSection title="How Corsair Cloud protects your data">
					<p>
						Corsair Cloud, including your links at{' '}
						{APP_URL.replace('https://', '')}/me and your yourname.lug.dev
						address, runs on the open-source Corsair SDK. Everything the SDK
						does to protect data, Cloud does too, and adds the layers below.
					</p>
					<p>
						The SDK uses{' '}
						<a
							href={ENVELOPE_ENCRYPTION_URL}
							className={legalLinkClassName}
							target="_blank"
							rel="noopener noreferrer"
						>
							envelope encryption
						</a>
						. Your data is encrypted with a data key, and that data key is only
						ever stored encrypted, locked by a separate key kept somewhere else.
						A copy of the database holds the data and its locked keys, but not
						the key that unlocks them.
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className={strong}>Encrypted at rest.</strong> OAuth
							tokens, API keys, and the records we sync from your apps
							(messages, issues, events) are stored encrypted with AES-256-GCM.
							Every connected account has its own data key.
						</li>
						<li>
							<strong className={strong}>
								Keys held outside the database.
							</strong>{' '}
							The keys that unlock your workspace live in AWS Key Management
							Service and rotate automatically. Only an encrypted copy is stored
							with your data.
						</li>
						<li>
							<strong className={strong}>
								Zero trust inside our own system.
							</strong>{' '}
							The servers that run your tools have no standing permission to
							decrypt anything. Each request carries a short-lived grant that
							Corsair issues for one workspace, and the key service checks it
							before it unlocks that workspace and nothing else.
						</li>
					</ul>
					<p>
						That is why a leak of our database wouldn&apos;t expose you. A copy
						would hold encrypted values only, and the keys to read your API
						keys, tokens and app data are not in it.
					</p>
				</LegalSection>
			</div>

			<LegalSection title="No cross-tenant contamination">
				<p>
					Every person and every customer is walled off from every other. Each
					connected account&apos;s data is encrypted with its own key, each
					person&apos;s records are kept apart by their tenant ID, and every
					request is tied to one project and one person before anything runs.
				</p>
				<p>
					The access tokens Corsair issues to MCP clients are signed, name the
					one person and link they belong to, and expire after 15 minutes. A
					grant opens one workspace, so a request for one customer can&apos;t
					reach another customer&apos;s keys.
				</p>
			</LegalSection>

			<LegalSection title="Under the hood: the SDK">
				<p>
					For more detail, here is what the SDK does, whether you run it in your
					own app or use it through Corsair Cloud.
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						It stores everything in your database: connected accounts,
						credentials, and the records it syncs from each app.
					</li>
					<li>
						Every credential is encrypted with that account&apos;s data key, and
						data keys are wrapped by your key-encryption key,{' '}
						<code className={code}>CORSAIR_KEK</code>. Run the SDK yourself and
						that key lives in your environment; Corsair never has it.
					</li>
					<li>
						Synced records are sealed with the same per-account keys when{' '}
						<code className={code}>encryptDataAtRest</code> is on. It&apos;s off
						by default in the SDK: set{' '}
						<code className={code}>encryptDataAtRest: true</code> in your
						Corsair config before the first sync, because it seals records as
						they&apos;re written and leaves records already stored as they were.
						Corsair Cloud turns it on for every workspace.
					</li>
					<li>
						The{' '}
						<a
							href={ENCRYPTION_SOURCE_URL}
							className={legalLinkClassName}
							target="_blank"
							rel="noopener noreferrer"
						>
							encryption code
						</a>{' '}
						is open source under the Apache 2.0 license on{' '}
						<a
							href={GITHUB_URL}
							className={legalLinkClassName}
							target="_blank"
							rel="noopener noreferrer"
						>
							GitHub
						</a>
						, so you can read exactly how it works.
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="Your agent never sees your credentials">
				<p>
					On Corsair Cloud, an agent works with tool names, arguments and
					results. Corsair attaches the credential when it calls the app, so a
					token or API key never appears in a tool result or in the model&apos;s
					context.
				</p>
				<p>
					Scripts the agent writes there (
					<code className={code}>run_script</code> and{' '}
					<code className={code}>read_data</code>) run in an isolated sandbox
					with no network, filesystem or process access. The only thing a script
					can reach is the person&apos;s own connected apps, through Corsair.
				</p>
				<p>
					The SDK&apos;s MCP adapter works differently. When you host it in your
					own app, <code className={code}>run_script</code> runs the
					agent&apos;s code in your process with the full{' '}
					<code className={code}>corsair</code> instance, including the methods
					that read and set an account&apos;s credentials. It isn&apos;t a
					sandbox, and a script there can read a token, so connect only agents
					you trust. <code className={code}>readonly: true</code> blocks write
					and destructive Corsair calls, not credential methods or other side
					effects of the script.
				</p>
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

import type { Metadata } from 'next';

import {
	LegalDivider,
	LegalDocument,
	LegalSection,
	LegalSubsection,
	legalLinkClassName,
} from '@/components/legal/legal-document';

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description:
		'How Corsair handles information for hub.corsair.dev, Hub account sign-in, and the Corsair SDK.',
	alternates: {
		canonical: '/privacy-policy',
	},
};

const CONTACT_EMAIL = 'dev@corsair.dev';
const LAST_UPDATED = 'July 21, 2026';
const LOG_RETENTION_PERIOD = '90 days';

export default function PrivacyPolicyPage() {
	return (
		<LegalDocument
			title="Privacy Policy"
			lastUpdated={LAST_UPDATED}
			relatedLink={{ href: '/terms-of-service', label: 'Terms of Service' }}
		>
			<section className="space-y-4">
				<p>
					This Privacy Policy describes how Corsair (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Corsair</strong>
					,&rdquo; &ldquo;
					<strong className="font-medium text-[#1c1c1c]">we</strong>,&rdquo;
					&ldquo;
					<strong className="font-medium text-[#1c1c1c]">us</strong>,&rdquo; or
					&ldquo;
					<strong className="font-medium text-[#1c1c1c]">our</strong>
					&rdquo;) handles information in connection with our managed OAuth
					infrastructure and developer SDK (collectively, the &ldquo;
					<strong className="font-medium text-[#1c1c1c]">Service</strong>
					&rdquo;), including our hosted platform at hub.corsair.dev and the
					Corsair SDK (<code className="text-sm">corsair</code> and associated
					plugin packages such as{' '}
					<code className="text-sm">@corsair-dev/gmail</code>,{' '}
					<code className="text-sm">@corsair-dev/googlecalendar</code>, and{' '}
					<code className="text-sm">@corsair-dev/googlesheets</code>).
				</p>
				<p>
					Please read this policy carefully. If you have questions, contact us
					at{' '}
					<a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClassName}>
						{CONTACT_EMAIL}
					</a>
					.
				</p>
			</section>

			<LegalDivider />

			<LegalSection title="1. Who This Policy Applies To">
				<p>
					Corsair is developer infrastructure. Our direct customers are
					developers and companies (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Customers</strong>
					&rdquo;) who integrate the Corsair SDK into their own applications
					(&ldquo;
					<strong className="font-medium text-[#1c1c1c]">
						Customer Applications
					</strong>
					&rdquo;) to connect their own end users&apos; (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">End Users</strong>
					&rdquo;) Google Accounts. This policy explains:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						What information Corsair itself collects and processes as the
						operator of hub.corsair.dev, and
					</li>
					<li>
						What our architecture is designed to ensure Corsair does{' '}
						<strong className="font-medium text-[#1c1c1c]">not</strong> access,
						regardless of which Customer Application an End User is using.
					</li>
				</ul>
				<p>
					Customers are independently responsible for their own privacy
					disclosures to their End Users. This policy does not govern how a
					Customer Application uses End User data once obtained — that is
					between the Customer and their End Users, and Customers must
					independently comply with Google&apos;s API Services User Data Policy
					for their own use of that data.
				</p>
			</LegalSection>

			<LegalSection title="2. End User Consent Screen">
				<p>
					When an End User connects a Google Account to a Customer Application
					through Corsair, they first see a Corsair Hub connect screen before
					being redirected to Google&apos;s OAuth consent screen. That connect
					screen explicitly identifies the Customer Application by name and
					states that the application is{' '}
					<strong className="font-medium text-[#1c1c1c]">
						powered by Corsair
					</strong>
					.
				</p>
				<p>
					The connect screen explains that the named Customer Application will
					receive access to the Google data and permissions the End User
					approves on Google&apos;s consent screen. Corsair manages the OAuth
					authentication flow on the Customer Application&apos;s behalf but does
					not access the substantive content of the End User&apos;s Google
					Account (such as email body text, calendar event details, file
					contents, or spreadsheet data).
				</p>
				<p>
					Corsair Hub supports OAuth connections to Google services including
					Gmail, Google Calendar, Google Drive, and Google Sheets. The specific
					scopes requested depend on the Customer Application&apos;s implemented
					features and appear on Google&apos;s consent screen before the End
					User approves access.
				</p>
			</LegalSection>

			<LegalSection title="3. How Our Architecture Handles Google Account Data">
				<p>
					Corsair&apos;s system is deliberately structured to minimize what our
					infrastructure can see:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Tokens are stored by the Customer, not by Corsair.
						</strong>{' '}
						When an End User authorizes a Customer Application to access their
						Google Account, the resulting OAuth access token and refresh token
						are stored exclusively within the Customer&apos;s own database,
						encrypted at rest using envelope encryption. Corsair does not
						maintain a copy of these tokens.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Corsair&apos;s hub is invoked only to refresh expired access
							tokens.
						</strong>{' '}
						When an access token expires, the Customer&apos;s application (via
						the Corsair SDK) sends the refresh token to hub.corsair.dev over an
						encrypted, signed channel. The hub exchanges that refresh token,
						together with Corsair&apos;s registered OAuth client ID and secret,
						for a new access token from Google, and returns the new access token
						to the Customer&apos;s application. The hub does not initiate this
						process independently and cannot do so without the Customer&apos;s
						application first contacting it.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Corsair never makes API calls on any End User&apos;s behalf.
						</strong>{' '}
						All calls to Google APIs (Gmail, Calendar, Drive, Sheets, etc.) are
						made directly from the Customer&apos;s own infrastructure to Google,
						using the SDK. Corsair&apos;s servers are not in this request path
						and do not receive, log, or store the content of these requests or
						their responses.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Corsair does not access Google Account content.
						</strong>{' '}
						Because of the above, Corsair does not see, store, or process the
						substantive content of any End User&apos;s emails, calendar events,
						files, or spreadsheets accessed through the Service.
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="4. Information Corsair Does Collect">
				<p>
					In operating hub.corsair.dev, we collect and process the following
					limited categories of information:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Token refresh metadata.
						</strong>{' '}
						When a refresh request is made, we necessarily process the refresh
						token (transiently, to complete the exchange with Google) and the
						resulting access token before returning it to the Customer&apos;s
						application. We do not persist tokens after the refresh operation
						completes.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Operational and diagnostic logs.
						</strong>{' '}
						We may log metadata about refresh requests (e.g., timestamps,
						response codes, project/API key identifiers) for the purpose of
						operating, securing, debugging, and improving the Service. These
						logs do not contain Google Account content.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Customer account information.
						</strong>{' '}
						We collect information necessary to administer Customer accounts,
						such as project API keys, signing secrets, billing information, and
						developer contact details.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Hub account profile information.
						</strong>{' '}
						When you sign in to Corsair Hub using Google or GitHub, we receive
						basic profile information from that provider as described in
						Sections 5 and 6 below.
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="5. Google Sign-In (Corsair Hub)">
				<p>
					When you sign in to Corsair Hub using your Google account, we receive
					the following information from Google, with your permission:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Your name</li>
					<li>Your email address</li>
					<li>Your profile picture (if available)</li>
					<li>A unique Google account identifier</li>
				</ul>
				<p>
					We do <strong className="font-medium text-[#1c1c1c]">not</strong>{' '}
					request or receive access to your Gmail, Google Drive, Google
					Calendar, or any other Google data beyond your basic profile
					information through Hub sign-in.
				</p>

				<LegalSubsection title="How we use Google sign-in data">
					<p>We use this information solely to:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>Create and maintain your Corsair Hub account</li>
						<li>Authenticate you when you sign in</li>
						<li>
							Identify you within our service (for example, displaying your name
							or profile picture)
						</li>
						<li>Communicate with you about your account, if necessary</li>
					</ul>
					<p>
						We do not use your information for advertising, and we do not sell,
						rent, or trade your information to third parties.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Revoking Google access">
					<p>
						You can revoke Corsair Hub&apos;s access to your Google account at
						any time via your{' '}
						<a
							href="https://myaccount.google.com/permissions"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							Google Account permissions page
						</a>
						.
					</p>
				</LegalSubsection>
			</LegalSection>

			<LegalSection title="6. GitHub Sign-In (Corsair Hub)">
				<p>
					When you sign in to Corsair Hub using your GitHub account, we receive
					the following information from GitHub, with your permission:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Your name or username</li>
					<li>Your email address</li>
					<li>Your profile picture (if available)</li>
					<li>A unique GitHub account identifier</li>
				</ul>
				<p>
					We do <strong className="font-medium text-[#1c1c1c]">not</strong>{' '}
					request or receive access to your repositories, organizations, gists,
					or any other GitHub data beyond your basic profile information.
				</p>

				<LegalSubsection title="How we use GitHub sign-in data">
					<p>We use this information solely to:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>Create and maintain your Corsair Hub account</li>
						<li>Authenticate you when you sign in</li>
						<li>
							Identify you within our service (for example, displaying your name
							or profile picture)
						</li>
						<li>Communicate with you about your account, if necessary</li>
					</ul>
					<p>
						We do not use your information for advertising, and we do not sell,
						rent, or trade your information to third parties.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Revoking GitHub access">
					<p>
						You can revoke Corsair Hub&apos;s access to your GitHub account at
						any time via your{' '}
						<a
							href="https://github.com/settings/applications"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							GitHub authorized applications settings
						</a>
						.
					</p>
				</LegalSubsection>
			</LegalSection>

			<LegalSection title="7. Compliance with Google API Services User Data Policy">
				<p>
					Corsair&apos;s use of information received from Google APIs will
					adhere to the Google API Services User Data Policy, including the
					Limited Use requirements. In accordance with that policy, we do not:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Use or transfer Google user data for serving advertisements;</li>
					<li>
						Sell or share Google user data with third parties, except as
						strictly necessary to provide the core functionality of the Service
						(e.g., completing a token refresh with Google);
					</li>
					<li>
						Use Google user data to train or improve any machine learning or
						artificial intelligence model, whether foundational, frontier, or
						otherwise;
					</li>
					<li>
						Allow human review of Google user data, except where necessary for
						security purposes (e.g., investigating suspected abuse), to comply
						with applicable law, or where an End User has separately and
						affirmatively consented.
					</li>
				</ul>
				<p>
					We limit our use of any Google-derived data we do process (per Section
					4) to operating, securing, and improving the token-refresh
					functionality of the Service.
				</p>
			</LegalSection>

			<LegalSection title="8. How We Protect Information">
				<ul className="list-disc space-y-2 pl-6">
					<li>
						All data in transit between the Corsair SDK and hub.corsair.dev is
						encrypted and authenticated using a pre-shared signing secret unique
						to each Customer project.
					</li>
					<li>
						Any credentials or tokens transiently handled by our infrastructure
						are encrypted in transit using industry-standard protocols (TLS).
					</li>
					<li>
						We require Customers to encrypt tokens at rest in their own
						databases using envelope encryption, and our SDK is designed to
						facilitate this by default.
					</li>
					<li>
						We maintain internal access controls limiting employee access to
						production systems and logs.
					</li>
					<li>
						Account information received through Google or GitHub sign-in is
						stored securely and protected using industry-standard security
						measures. We retain it only for as long as your account remains
						active, or as needed to provide Corsair Hub to you.
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="9. Data Retention">
				<p>
					We do not retain access or refresh tokens beyond the duration of a
					single refresh operation. Operational logs described in Section 4 are
					retained for {LOG_RETENTION_PERIOD} for security and diagnostic
					purposes, after which they are deleted or anonymized.
				</p>
			</LegalSection>

			<LegalSection title="10. Data Sharing">
				<p>
					We do not sell Google user data. We may share the limited operational
					information described in Section 4 with:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Infrastructure and hosting subprocessors who help us operate the
						Service, bound by confidentiality and data protection obligations;
					</li>
					<li>Government or regulatory authorities where required by law;</li>
					<li>
						A successor entity in connection with a merger, acquisition, or sale
						of assets, subject to this policy continuing to apply or the End
						User being notified and given the opportunity to consent to any
						change.
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="11. Your Rights">
				<p>
					If you are an End User of a Customer Application built on Corsair, you
					should direct requests regarding your personal data (access, deletion,
					correction) to the Customer Application you interacted with directly,
					as they control that data. You may revoke Corsair&apos;s (or any
					Customer Application&apos;s) access to your Google Account at any time
					via your{' '}
					<a
						href="https://myaccount.google.com/permissions"
						target="_blank"
						rel="noopener noreferrer"
						className={legalLinkClassName}
					>
						Google Account permissions page
					</a>
					.
				</p>
				<p>If you are a Corsair Customer or Hub account holder, you can:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Revoke Google or GitHub access using the links in Sections 5 and 6
					</li>
					<li>
						Request that we delete your account and associated data by
						contacting us at{' '}
						<a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClassName}>
							{CONTACT_EMAIL}
						</a>
					</li>
					<li>
						Request a copy of the data we hold about you by contacting us at{' '}
						<a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClassName}>
							{CONTACT_EMAIL}
						</a>
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="12. Children's Privacy">
				<p>
					The Service is not directed to children under 13 (or the relevant age
					of digital consent in your jurisdiction), and we do not knowingly
					collect data from children.
				</p>
			</LegalSection>

			<LegalSection title="13. Changes to This Policy">
				<p>
					We may update this Privacy Policy from time to time. If we make
					material changes to how we handle Google user data, we will update
					this page and, where required, seek renewed consent before making use
					of data in a new way.
				</p>
			</LegalSection>

			<LegalSection title="14. Contact Us">
				<p>Corsair</p>
				<p>
					<a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClassName}>
						{CONTACT_EMAIL}
					</a>
				</p>
			</LegalSection>
		</LegalDocument>
	);
}

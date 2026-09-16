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
		'How Corsair handles information for hub.corsair.dev, the Corsair SDK, Corsair Cloud, and related services.',
	alternates: {
		canonical: '/privacy-policy',
	},
};

const CONTACT_EMAIL = 'team@corsair.dev';
const LAST_UPDATED = 'September 16, 2026';
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
					&rdquo;) handles information in connection with our integration
					infrastructure, hosted platform at hub.corsair.dev, open-source SDK (
					<code className="text-sm">corsair</code> and plugin packages), and
					hosted runtime offering (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Corsair Cloud</strong>
					&rdquo;) (collectively, the &ldquo;
					<strong className="font-medium text-[#1c1c1c]">Service</strong>
					&rdquo;).
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
					&rdquo;) so those applications can connect to third-party services on
					behalf of the Customer&apos;s own end users (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">End Users</strong>
					&rdquo;).
				</p>
				<p>This policy explains:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						What information Corsair collects as the operator of Hub accounts,
						billing, and the control plane;
					</li>
					<li>
						How Corsair handles{' '}
						<strong className="font-medium text-[#1c1c1c]">
							third-party integration data
						</strong>{' '}
						(including credentials and data obtained through integrated APIs)
						under each deployment option described in Section 2; and
					</li>
					<li>
						Your choices and rights with respect to information for which
						Corsair acts as a controller.
					</li>
				</ul>
				<p>
					Customers are independently responsible for their own privacy
					disclosures to their End Users. This policy does not govern how a
					Customer Application uses third-party integration data once obtained —
					that is between the Customer and their End Users. If you are an End
					User of a Customer Application and have questions about your personal
					data, contact that Customer Application directly.
				</p>
			</LegalSection>

			<LegalSection title="2. Deployment Options">
				<p>
					Customers may use Corsair in one of two primary configurations. The
					option you choose determines where integration credentials and related
					data are stored and whether Corsair processes integration payloads in
					the course of providing the Service.
				</p>

				<LegalSubsection title="SDK with Corsair Hub">
					<p>
						In this configuration, you run the Corsair SDK in your own
						application infrastructure and use Corsair Hub (hub.corsair.dev) for
						managed OAuth connect flows, token refresh, webhooks, and related
						control-plane features.{' '}
						<strong className="font-medium text-[#1c1c1c]">
							OAuth tokens, API keys, and other integration credentials are
							stored in a database you operate
						</strong>{' '}
						(not in Corsair&apos;s integration datastore). The SDK encrypts
						stored credentials at rest using envelope encryption; the encryption
						key (<code className="text-sm">CORSAIR_KEK</code>) is held and
						managed in your application environment.
					</p>
					<p>
						Calls from your application to third-party APIs are made from your
						infrastructure using the SDK. Corsair does not receive, log, or
						store the substantive content of those API requests or responses as
						part of this path, except as described in Section 4 (Hub control
						plane and operational metadata).
					</p>
				</LegalSubsection>

				<LegalSubsection title="Corsair Cloud">
					<p>
						In this configuration, Corsair hosts a managed SDK runtime for your
						project.{' '}
						<strong className="font-medium text-[#1c1c1c]">
							Third-party integration data flows through Corsair-operated
							servers
						</strong>{' '}
						when your Customer Application invokes integrations through the
						hosted runtime. Corsair processes that data only to provide the
						Service — to execute the integrations you configure and to maintain
						connections on your and your End Users&apos; behalf — and{' '}
						<strong className="font-medium text-[#1c1c1c]">not</strong> for
						advertising, selling or licensing data to third parties, training or
						improving machine learning or AI models, analytics unrelated to
						operating the Service, or building Corsair product features outside
						your intended use case.
					</p>
					<p>
						You may configure Corsair Cloud to persist integration credentials
						and SDK-stored data either in{' '}
						<strong className="font-medium text-[#1c1c1c]">
							Corsair-operated storage
						</strong>{' '}
						(associated with your Cloud project) or in a{' '}
						<strong className="font-medium text-[#1c1c1c]">
							database you provide
						</strong>{' '}
						(for example, via a connection URL you supply). In both cases,
						credentials and keys are{' '}
						<strong className="font-medium text-[#1c1c1c]">
							encrypted at rest
						</strong>
						. For Corsair Cloud, Corsair manages the encryption keys for data
						stored through the hosted runtime; for SDK with Hub, you manage{' '}
						<code className="text-sm">CORSAIR_KEK</code> in your environment as
						described above.
					</p>
					<p>
						Integration-related data that must remain available for your
						Customer Application to function is{' '}
						<strong className="font-medium text-[#1c1c1c]">
							retained until you delete the applicable Hub project or Cloud
							environment
						</strong>{' '}
						(or as otherwise described in Section 9). When integration calls
						pass through the hosted runtime, Corsair retains{' '}
						<strong className="font-medium text-[#1c1c1c]">metadata</strong>{' '}
						about those calls (such as timestamps, tenant and plugin
						identifiers, operation names, and success or error signals), not the
						substantive payloads of third-party API requests or responses.
					</p>
					<p>
						Corsair Cloud is designed so that one Customer&apos;s data is not
						accessible to other Customers: hosted environments and stored
						credentials are isolated by project and organization, and End Users
						within a Customer Application are isolated logically by tenant
						identifiers in the SDK — not on separate physical hosts per End
						User.
					</p>
				</LegalSubsection>
			</LegalSection>

			<LegalSection title="3. End User Connect Experience">
				<p>
					When an End User connects a third-party account to a Customer
					Application through Corsair Hub, they see a Corsair connect screen
					that identifies the Customer Application by name and states that the
					application is{' '}
					<strong className="font-medium text-[#1c1c1c]">
						powered by Corsair
					</strong>{' '}
					before being redirected to the third party&apos;s authorization flow.
					The connect screen explains that the named Customer Application will
					receive access to the data and permissions the End User approves with
					that third party. The specific scopes or permissions depend on the
					Customer Application&apos;s implemented features.
				</p>
			</LegalSection>

			<LegalSection title="4. Information Corsair Collects and Processes">
				<LegalSubsection title="Hub control plane (all Customers)">
					<p>
						To operate hub.corsair.dev, we collect and process limited
						categories of information, including:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							<strong className="font-medium text-[#1c1c1c]">
								Customer account and project information
							</strong>{' '}
							— such as organization and project names, API keys, signing
							secrets, billing and contact details, and team membership;
						</li>
						<li>
							<strong className="font-medium text-[#1c1c1c]">
								Encrypted OAuth application credentials
							</strong>{' '}
							— when you use managed or bring-your-own OAuth applications,
							client identifiers and secrets may be stored encrypted in
							Corsair&apos;s control-plane database to facilitate connect and
							token refresh;
						</li>
						<li>
							<strong className="font-medium text-[#1c1c1c]">
								Webhook and connection metadata
							</strong>{' '}
							— routing identifiers, delivery status, and similar operational
							data needed to forward provider webhooks to your registered
							endpoints;
						</li>
						<li>
							<strong className="font-medium text-[#1c1c1c]">
								Operational and diagnostic logs
							</strong>{' '}
							— metadata about Service operations (for example, timestamps,
							response codes, and project or environment identifiers). For
							Customers{' '}
							<strong className="font-medium text-[#1c1c1c]">not</strong> using
							Corsair Cloud, these logs are retained for {LOG_RETENTION_PERIOD}{' '}
							and then deleted or anonymized, as described in Section 9.
						</li>
					</ul>
				</LegalSubsection>

				<LegalSubsection title="Token refresh (SDK with Hub)">
					<p>
						When your application refreshes an OAuth access token through Hub,
						we transiently process the refresh token and new access token to
						complete the exchange with the third-party provider. We do not
						persist end-user OAuth tokens in the Hub control plane after the
						refresh operation completes when credentials are stored in your
						database.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Third-party integration data we process on your behalf">
					<p>
						Depending on your deployment option, Corsair may process third-party
						integration data (including personal data contained in credentials
						or API payloads) as a{' '}
						<strong className="font-medium text-[#1c1c1c]">
							processor or service provider
						</strong>{' '}
						on your instructions — principally when you use Corsair Cloud, or
						when Hub handles OAuth or webhooks on your behalf. We process that
						data only to provide the Service. We do not have a direct
						relationship with End Users; if you are an End User, contact the
						Customer Application you used to exercise privacy rights regarding
						data processed through Corsair on that Customer&apos;s behalf.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Hub account sign-in">
					<p>
						When you sign in to Corsair Hub with Google or GitHub, we receive
						basic profile information from that provider (such as name, email
						address, profile picture if available, and a unique account
						identifier). We use this information only to create and maintain
						your Hub account, authenticate you, display your identity in the
						dashboard, and communicate with you about your account. We do not
						use it for advertising, and we do not sell, rent, or trade it to
						third parties. You can revoke Hub&apos;s access through your{' '}
						<a
							href="https://myaccount.google.com/permissions"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							Google Account permissions
						</a>{' '}
						or{' '}
						<a
							href="https://github.com/settings/applications"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							GitHub authorized applications
						</a>{' '}
						settings, as applicable.
					</p>
				</LegalSubsection>
			</LegalSection>

			<LegalSection title="5. Google API Services User Data Policy">
				<p>
					When Customer Applications connect to Google services through Corsair,
					Corsair&apos;s use of information received from Google APIs will
					adhere to the{' '}
					<a
						href="https://developers.google.com/terms/api-services-user-data-policy"
						target="_blank"
						rel="noopener noreferrer"
						className={legalLinkClassName}
					>
						Google API Services User Data Policy
					</a>
					, including the Limited Use requirements. In accordance with that
					policy, we do not:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Use or transfer Google user data for serving advertisements;</li>
					<li>
						Sell or share Google user data with third parties, except as
						strictly necessary to provide the core functionality of the Service
						(for example, completing OAuth or token refresh with Google);
					</li>
					<li>
						Use Google user data to train or improve any machine learning or
						artificial intelligence model; or
					</li>
					<li>
						Allow human review of Google user data, except where necessary for
						security purposes (such as investigating suspected abuse), to comply
						with applicable law, or where an End User has separately and
						affirmatively consented.
					</li>
				</ul>
				<p>
					Customers who access Google user data through their own Customer
					Applications remain independently responsible for complying with
					Google&apos;s policies for their use of that data.
				</p>
			</LegalSection>

			<LegalSection title="6. How We Use Information">
				<p>We use information we collect to:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Provide, operate, maintain, and secure the Service;</li>
					<li>
						Authenticate Hub users and administer Customer accounts, projects,
						and billing;
					</li>
					<li>
						Execute integrations and related features you configure (including
						through Corsair Cloud);
					</li>
					<li>
						Provide support, troubleshoot issues, and protect against abuse or
						security incidents; and
					</li>
					<li>Comply with applicable law and enforce our terms.</li>
				</ul>
				<p>
					We do not use third-party integration data or End User data processed
					through the Service for advertising, model training, or analytics
					unrelated to operating and securing the Service, as described in
					Section 2.
				</p>
			</LegalSection>

			<LegalSection title="7. How We Protect Information">
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Communication between the Corsair SDK and Hub is encrypted and
						authenticated using project-specific signing secrets.
					</li>
					<li>
						Credentials and keys stored through the Service are encrypted at
						rest; encryption keys for Corsair Cloud are managed by Corsair, and
						for SDK with Hub are managed in your application environment.
					</li>
					<li>
						We maintain access controls limiting employee access to production
						systems and logs.
					</li>
					<li>
						Corsair Cloud environments are isolated so that one Customer cannot
						access another Customer&apos;s stored integration data.
					</li>
				</ul>
			</LegalSection>

			<LegalSection title="8. Data Sharing and Subprocessors">
				<p>
					We do not sell third-party integration data or Hub account
					information. We may share information with:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Amazon Web Services (AWS)
						</strong>{' '}
						— our infrastructure subprocessor for hosting Corsair Cloud and
						related production systems, bound by contractual confidentiality and
						security obligations;
					</li>
					<li>
						Government or regulatory authorities where required by law; and
					</li>
					<li>
						A successor entity in connection with a merger, acquisition, or sale
						of assets, subject to this policy continuing to apply or you being
						notified of material changes.
					</li>
				</ul>
				<p>
					Integration API calls are made to third-party providers (such as
					Google, Slack, or other services you connect) according to your
					configuration; those providers handle data under their own policies.
				</p>
			</LegalSection>

			<LegalSection title="9. Data Retention">
				<p>
					<strong className="font-medium text-[#1c1c1c]">
						Corsair Cloud and project data:
					</strong>{' '}
					Integration credentials, SDK-persisted data, and hosted-runtime call
					metadata needed for your Customer Application to operate are retained
					until you delete the relevant Hub project or Cloud environment (or we
					delete them following account termination, subject to any legal
					retention requirements).
				</p>
				<p>
					<strong className="font-medium text-[#1c1c1c]">
						Operational logs (SDK with Hub, without Corsair Cloud):
					</strong>{' '}
					Control-plane and diagnostic logs described in Section 4 are retained
					for {LOG_RETENTION_PERIOD} for security and diagnostic purposes, after
					which they are deleted or anonymized.
				</p>
				<p>
					<strong className="font-medium text-[#1c1c1c]">Webhooks:</strong>{' '}
					Webhook notification payloads are deleted upon successful delivery to
					your registered endpoint when possible. If delivery fails, we may
					retain the notification for up to 7 days to allow redelivery, after
					which it is deleted.
				</p>
				<p>
					Hub account profile information from Google or GitHub sign-in is
					retained while your account remains active, or as needed to provide
					the Service.
				</p>
			</LegalSection>

			<LegalSection title="10. Your Rights">
				<p>
					If you are an End User of a Customer Application, direct requests
					regarding personal data (access, deletion, correction) to the Customer
					Application you interacted with. You may also revoke a third
					party&apos;s access to your account through that provider&apos;s
					settings (for Google, your{' '}
					<a
						href="https://myaccount.google.com/permissions"
						target="_blank"
						rel="noopener noreferrer"
						className={legalLinkClassName}
					>
						Google Account permissions page
					</a>
					).
				</p>
				<p>If you are a Corsair Customer or Hub account holder, you can:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						Revoke Google or GitHub Hub sign-in access using the links in
						Section 4;
					</li>
					<li>
						Request deletion of your Hub account and associated control-plane
						data by contacting{' '}
						<a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClassName}>
							{CONTACT_EMAIL}
						</a>
						;
					</li>
					<li>
						Request a copy of Hub account data we hold as controller by
						contacting{' '}
						<a href={`mailto:${CONTACT_EMAIL}`} className={legalLinkClassName}>
							{CONTACT_EMAIL}
						</a>
						.
					</li>
				</ul>
				<p>
					Where Corsair processes personal data on your behalf through Corsair
					Cloud or related features, you are the controller (or equivalent) for
					that data and Corsair acts as processor — End User requests should be
					handled by you, with our assistance as required by applicable law and
					our agreement with you.
				</p>
			</LegalSection>

			<LegalSection title="11. Children's Privacy">
				<p>
					The Service is not directed to children under 13 (or the relevant age
					of digital consent in your jurisdiction), and we do not knowingly
					collect data from children.
				</p>
			</LegalSection>

			<LegalSection title="12. Changes to This Policy">
				<p>
					We may update this Privacy Policy from time to time. If we make
					material changes to how we handle personal information or third-party
					integration data, we will update this page and, where required, seek
					renewed consent before making use of data in a new way.
				</p>
			</LegalSection>

			<LegalSection title="13. Contact Us">
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

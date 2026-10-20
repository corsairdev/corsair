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
const LAST_UPDATED = 'October 21, 2026';
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
						part of this path, except as described in Section 4: Hub control
						plane and operational metadata, webhook notifications Hub delivers
						to you, workflow run records if you use Workflows, and data your
						workflows send to Corsair&apos;s optional AI features.
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
						Service: to run the integrations you configure and to maintain
						connections on your and your End Users&apos; behalf. We do{' '}
						<strong className="font-medium text-[#1c1c1c]">not</strong> use it
						for advertising, sell or license it, use it to train or improve
						machine learning or AI models, analyze its content, or use it to
						develop other products or features.
					</p>
					<p>
						Corsair Cloud{' '}
						<strong className="font-medium text-[#1c1c1c]">
							retains and stores
						</strong>{' '}
						the integration credentials and SDK database contents your project
						needs to operate — including OAuth access and refresh tokens, API
						keys, connection and tenant records, and related metadata — in
						either:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							a{' '}
							<strong className="font-medium text-[#1c1c1c]">
								Corsair-managed database
							</strong>{' '}
							on infrastructure Corsair operates (the default for many Cloud
							projects), or
						</li>
						<li>
							a{' '}
							<strong className="font-medium text-[#1c1c1c]">
								database you choose and provide
							</strong>{' '}
							(for example, via a connection URL you supply), where the hosted
							runtime writes the same encrypted SDK data to your database.
						</li>
					</ul>
					<p>
						In both cases, credentials and keys are{' '}
						<strong className="font-medium text-[#1c1c1c]">
							encrypted at rest
						</strong>
						. For Corsair Cloud, Corsair manages the encryption keys for data
						held in the hosted runtime (including Corsair-managed databases);
						for SDK with Hub, you manage{' '}
						<code className="text-sm">CORSAIR_KEK</code> in your environment as
						described above.
					</p>
					<p>
						A connection&apos;s credentials (such as an End User&apos;s OAuth
						tokens) and the data the SDK stores for that connection are{' '}
						<strong className="font-medium text-[#1c1c1c]">
							retained until you remove the connection or delete the applicable
							Hub project or Cloud environment
						</strong>
						. Integration-level settings, such as your OAuth application&apos;s
						client ID and client secret, and approval requests are retained
						until you delete the applicable Hub project or Cloud environment (or
						as otherwise described in Section 9). This is separate from
						operational logging: when integration calls pass through the hosted
						runtime, Corsair also retains call{' '}
						<strong className="font-medium text-[#1c1c1c]">metadata</strong>{' '}
						(such as timestamps, tenant and plugin identifiers, operation names,
						and success or error signals) but does not log the substantive
						payloads of third-party API requests or responses for diagnostic
						retention.
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
								Webhook notifications and delivery history
							</strong>{' '}
							— the notifications providers send to Hub (including their
							contents), routing identifiers, and delivery status, kept so Hub
							can deliver, retry, and replay notifications to your registered
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
						complete the exchange with the third-party provider. For SDK with
						Hub, we do not persist end-user OAuth tokens in the{' '}
						<strong className="font-medium text-[#1c1c1c]">
							Hub control plane
						</strong>{' '}
						after the refresh completes; tokens remain in your SDK database (or,
						for Corsair Cloud, in the Corsair-managed or customer-provided
						database configured for that project, as described in Section 2).
					</p>
				</LegalSubsection>

				<LegalSubsection title="Corsair Cloud — stored credentials and SDK data">
					<p>
						For Corsair Cloud projects, end-user and application integration
						credentials, tenant connection state, and other data the SDK
						persists to serve your Customer Application are{' '}
						<strong className="font-medium text-[#1c1c1c]">
							stored and retained
						</strong>{' '}
						in your project&apos;s database — either Corsair&apos;s managed
						database or one you provide. Corsair processes and stores this data
						only to operate your hosted runtime, and never for the purposes
						excluded in Section 2.
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

				<LegalSubsection title="Workflows">
					<p>
						If you use Corsair Workflows, Hub stores a record of each run so
						that runs can resume after a failure and so you can see their
						history: the event that started the run, and each step&apos;s output
						and any error. These records can contain third-party integration
						data. They are deleted 30 days after the run finishes, as described
						in Section 9.
					</p>
				</LegalSubsection>

				<LegalSubsection title="AI features">
					<p>
						Corsair offers optional AI features in Workflows: AI steps that
						summarize, classify, or extract information from data a workflow
						passes to them, and AI conditions that decide whether an incoming
						event should start a workflow. When a workflow run fails, Corsair
						may also send the workflow&apos;s code and error message to an AI
						model to suggest a fix. Corsair&apos;s assistant for writing
						workflows sends the chat messages it receives, along with the list
						of the Customer&apos;s connected integrations and our public catalog
						of operations, to an AI model. These requests go through a model
						gateway that Corsair operates and are sent to an AI model provider
						under terms that prohibit it from using the data to train or improve
						its models. Section 5 describes how this applies to Google user
						data.
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

			<LegalSection title="5. Google User Data">
				<p>
					This section applies to data Corsair receives from Google APIs when an
					End User connects a Google account (Gmail, Google Calendar, Google
					Drive, Google Docs, or Google Sheets) to a Customer Application
					through Corsair. For that data, it takes precedence over any other
					part of this policy.
				</p>

				<LegalSubsection title="What we access">
					<p>
						The End User chooses which Google account to connect and sees the
						requested permissions on Google&apos;s consent screen. Depending on
						what the Customer Application does, these can include reading,
						drafting, sending, labeling, and deleting email; viewing and editing
						calendar events and free/busy information; and viewing, creating,
						editing, sharing, and deleting files in Google Drive, Docs, and
						Sheets.
					</p>
				</LegalSubsection>

				<LegalSubsection title="How we use it">
					<p>
						We use Google user data only to provide the features the End User
						authorized: running the Customer Application&apos;s requests to
						Google, keeping the connection active, delivering Google&apos;s
						notifications to the Customer Application, and running the workflows
						the Customer has set up. We do not use Google user data for
						advertising, analytics, or market research, to build user profiles,
						or to develop other products or features.
					</p>
				</LegalSubsection>

				<LegalSubsection title="AI features">
					<p>
						If a Customer uses Corsair&apos;s optional AI features (described in
						Section 4) with Google user data, that data is sent to an AI model
						only to produce the result the workflow asks for. If a workflow run
						fails, the error message sent for an automatic fix can contain parts
						of the data being processed. These requests go through a model
						gateway that Corsair operates and are sent to an AI model provider
						under terms that prohibit it from using the data to train or improve
						its models. The provider may keep the data for a limited time only
						to monitor for abuse. Corsair&apos;s assistant for writing workflows
						does not fetch Google user data itself. It receives the chat
						messages sent to it, the list of a Customer&apos;s connected
						integrations, and our public catalog of operations; if a message
						contains Google user data, that message is handled under the same
						terms as the AI requests above.
					</p>
				</LegalSubsection>

				<LegalSubsection title="No AI or machine learning training">
					<p>
						We do not use Google user data, raw or derived, to develop, train,
						or improve any artificial intelligence or machine learning model,
						and we do not transfer it to any AI provider that would use it for
						that purpose. The use of raw or derived user data received from
						Google Workspace APIs will adhere to the{' '}
						<a
							href="https://developers.google.com/terms/api-services-user-data-policy"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							Google API Services User Data Policy
						</a>{' '}
						and the{' '}
						<a
							href="https://developers.google.com/workspace/workspace-api-user-data-developer-policy"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							Google Workspace User Data and Developer Policy
						</a>
						, including the Limited Use requirements.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Who receives it">
					<p>We transfer Google user data only:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							to the Customer Application the End User connected, because the
							End User authorized that application on Corsair&apos;s connect
							screen and Google&apos;s consent screen;
						</li>
						<li>
							to the service providers described in Section 8 that host and run
							the Service, under contracts that let them use the data only to
							provide their services to Corsair;
						</li>
						<li>
							to the AI model provider described above, only when a Customer
							uses an AI feature;
						</li>
						<li>
							when required by law, or to protect against security incidents and
							abuse; and
						</li>
						<li>
							as part of a merger, acquisition, or sale of assets, only after
							obtaining the End User&apos;s explicit prior consent.
						</li>
					</ul>
					<p>
						We do not sell Google user data. Our Terms of Service require every
						Customer to comply with the Google API Services User Data Policy,
						including the Limited Use requirements, for Google user data its
						Customer Application receives through Corsair.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Human access">
					<p>
						No one at Corsair reads Google user data unless the End User agrees
						to it for specific data (for example, in a support request), it is
						needed for security purposes such as investigating abuse, or it is
						required by law.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Storage, retention, and deletion">
					<p>
						With the Corsair SDK and Hub, Google OAuth tokens are stored in the
						Customer&apos;s own database, encrypted with a key the Customer
						holds; Hub handles them only briefly to complete the connection and
						refresh tokens. With Corsair Cloud, OAuth tokens and data the
						integrations save are stored encrypted at rest with keys Corsair
						manages, and Google user data passes through Corsair&apos;s servers
						while an integration runs. Data is encrypted in transit.
					</p>
					<p>
						Corsair Cloud keeps Google OAuth tokens until the Customer removes
						the connection or deletes the project or environment, and keeps
						approval requests, which can include the details of an action
						waiting for approval, until the project or environment is deleted.
						Google notifications delivered through Hub are deleted after 14
						days, and workflow run records 30 days after the run finishes. Chats
						with the workflow assistant are kept until the project or
						environment is deleted. An End User can revoke access at any time on
						their{' '}
						<a
							href="https://myaccount.google.com/permissions"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							Google Account permissions page
						</a>{' '}
						and can ask for their data to be deleted by contacting the Customer
						Application or {CONTACT_EMAIL}.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Limited Use">
					<p>
						Corsair&apos;s use and transfer to any other app of information
						received from Google APIs will adhere to the{' '}
						<a
							href="https://developers.google.com/terms/api-services-user-data-policy"
							target="_blank"
							rel="noopener noreferrer"
							className={legalLinkClassName}
						>
							Google API Services User Data Policy
						</a>
						, including the Limited Use requirements.
					</p>
				</LegalSubsection>
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
					through the Service for advertising, model training, analytics, or
					developing other products. Google user data is also covered by Section
					5.
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
						Cloud hosting providers that run Hub, Corsair Cloud, and our AI
						model gateway, and store Service data;
					</li>
					<li>
						AI model providers, only for the optional AI features described in
						Section 4, under terms that prohibit them from training on the data;
					</li>
					<li>
						Government or regulatory authorities where required by law; and
					</li>
					<li>
						A successor entity in connection with a merger, acquisition, or sale
						of assets, subject to this policy continuing to apply or you being
						notified of material changes, and after obtaining End Users&apos;
						explicit prior consent where required.
					</li>
				</ul>
				<p>
					Each service provider is bound by contractual confidentiality and
					security obligations and may use the data only to provide its services
					to Corsair.
				</p>
				<p>
					Integration API calls are made to third-party providers (such as
					Google, Slack, or other services you connect) according to your
					configuration; those providers handle data under their own policies.
				</p>
			</LegalSection>

			<LegalSection title="9. Data Retention">
				<p>
					<strong className="font-medium text-[#1c1c1c]">
						Corsair Cloud — credentials and SDK database:
					</strong>{' '}
					A connection&apos;s OAuth tokens, API keys, and the data the SDK
					stores for it (in a Corsair-managed database or a database you
					provide) are retained until you remove the connection or delete the
					relevant Hub project or Cloud environment. Integration-level OAuth
					application credentials (client ID and client secret), approval
					requests, and other SDK-persisted data are retained until you delete
					the relevant Hub project or Cloud environment (or we delete them
					following account termination, subject to any legal retention
					requirements).
				</p>
				<p>
					<strong className="font-medium text-[#1c1c1c]">
						Corsair Cloud — call metadata:
					</strong>{' '}
					Hosted-runtime call metadata described in Section 2 is retained with
					the project for as long as the project remains active, unless a
					shorter period applies under your agreement.
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
					Webhook notifications and their delivery history are kept for 14 days
					so that failed deliveries can be retried and replayed, and are then
					deleted.
				</p>
				<p>
					<strong className="font-medium text-[#1c1c1c]">Workflows:</strong>{' '}
					Workflow run records, including the triggering event and each
					step&apos;s output and errors, are deleted 30 days after the run
					finishes. Chats with the workflow assistant are kept until you delete
					the relevant Hub project or environment.
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

import type { Metadata } from 'next';
import Link from 'next/link';

import {
	LegalDivider,
	LegalDocument,
	LegalSection,
	LegalSubsection,
	legalLinkClassName,
} from '@/components/legal/legal-document';

export const metadata: Metadata = {
	title: 'Terms of Service',
	description:
		'Terms governing access to and use of Corsair Hub, the Corsair SDK, Corsair Cloud, and related services.',
	alternates: {
		canonical: '/terms-of-service',
	},
};

const CONTACT_EMAIL = 'team@corsair.dev';
const LAST_UPDATED = 'September 16, 2026';
const LIABILITY_LOOKBACK_MONTHS = 12;

export default function TermsOfServicePage() {
	return (
		<LegalDocument
			title="Terms of Service"
			lastUpdated={LAST_UPDATED}
			relatedLink={{ href: '/privacy-policy', label: 'Privacy Policy' }}
		>
			<section className="space-y-4">
				<p>
					These Terms of Service (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Terms</strong>&rdquo;)
					govern access to and use of Corsair&apos;s integration infrastructure,
					hosted platform at hub.corsair.dev, open-source SDK, hosted runtime
					(&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Corsair Cloud</strong>
					&rdquo;), and related services (collectively, the &ldquo;
					<strong className="font-medium text-[#1c1c1c]">Service</strong>
					&rdquo;), provided by Corsair (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Corsair</strong>
					,&rdquo; &ldquo;
					<strong className="font-medium text-[#1c1c1c]">we</strong>,&rdquo;
					&ldquo;
					<strong className="font-medium text-[#1c1c1c]">us</strong>&rdquo;). By
					creating an account, integrating the Corsair SDK, using Corsair Cloud,
					or otherwise using the Service, you (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Customer</strong>
					,&rdquo; &ldquo;
					<strong className="font-medium text-[#1c1c1c]">you</strong>&rdquo;)
					agree to these Terms.
				</p>
				<p>If you do not agree, do not use the Service.</p>
			</section>

			<LegalDivider />

			<LegalSection title="1. The Service">
				<p>
					Corsair provides infrastructure that allows Customers to build
					applications (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">
						Customer Applications
					</strong>
					&rdquo;) which connect to third-party APIs and services on behalf of
					Customer&apos;s own end users (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">End Users</strong>
					&rdquo;). The Service includes:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">Corsair Hub</strong>{' '}
						(hub.corsair.dev): account management, OAuth connect and refresh,
						webhooks, permissions, and related control-plane features;
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">The SDK</strong>:
						developer libraries (including{' '}
						<code className="text-sm">corsair</code> and plugin packages) that
						Customer integrates to store encrypted credentials and call
						third-party APIs; and
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Corsair Cloud
						</strong>
						: an optional hosted SDK runtime that executes integrations on
						Corsair-operated infrastructure.
					</li>
				</ul>

				<LegalSubsection title="SDK with Corsair Hub">
					<p>
						When you use the SDK with Hub, you run the SDK in your own
						infrastructure. Integration credentials and SDK-stored data reside
						in a database you operate. The SDK encrypts credentials at rest; you
						manage the encryption key in your environment. Third-party API calls
						are made from your infrastructure unless you elect Corsair Cloud.
					</p>
				</LegalSubsection>

				<LegalSubsection title="Corsair Cloud">
					<p>
						When you use Corsair Cloud, third-party integration data flows
						through Corsair-operated servers to execute the integrations you
						configure. Corsair Cloud{' '}
						<strong className="font-medium text-[#1c1c1c]">
							retains and stores
						</strong>{' '}
						integration credentials and SDK database contents (including OAuth
						tokens, API keys, and connection records) in either a{' '}
						<strong className="font-medium text-[#1c1c1c]">
							Corsair-managed database
						</strong>{' '}
						or a{' '}
						<strong className="font-medium text-[#1c1c1c]">
							database you provide
						</strong>{' '}
						via connection settings. Corsair encrypts stored keys and
						credentials at rest and manages encryption keys for the hosted
						runtime. Corsair processes integration data only to provide the
						Service for your and your End Users&apos; intended use — not for
						advertising, model training, analytics unrelated to operating the
						Service, or Corsair product features outside that use case, as
						further described in our{' '}
						<Link href="/privacy-policy" className={legalLinkClassName}>
							Privacy Policy
						</Link>
						.
					</p>
				</LegalSubsection>
			</LegalSection>

			<LegalSection title="2. Eligibility and Accounts">
				<p>
					You must be at least 18 years old and capable of forming a binding
					contract to use the Service. You are responsible for maintaining the
					confidentiality of your API keys, signing secrets, and Cloud runtime
					keys, and for all activity that occurs under your Customer account.
				</p>
			</LegalSection>

			<LegalSection title="3. Customer Data and Third-Party Integration Data">
				<p>
					Excluding account registration information, Customer owns the data and
					information its Customer Application integrates or stores through the
					Service (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Customer Data</strong>
					&rdquo;), including third-party integration data and any personal
					information contained therein. Customer grants Corsair a
					non-exclusive, worldwide, royalty-free license during the term of
					these Terms to use, store, and process Customer Data solely as
					necessary to provide and secure the Service in accordance with these
					Terms and our{' '}
					<Link href="/privacy-policy" className={legalLinkClassName}>
						Privacy Policy
					</Link>
					.
				</p>
				<p>
					To the extent Customer Data includes personal information relating to
					End Users, Customer is the controller (or equivalent) and Corsair acts
					as a processor or service provider when processing that data through
					Corsair Cloud or related hosted features, processing only on
					Customer&apos;s instructions as reflected in Customer&apos;s use of
					the Service and these Terms.
				</p>
				<p>
					Customer is solely responsible for obtaining all rights, consents, and
					permissions necessary for Corsair to process Customer Data to provide
					the Service, and for providing End Users with privacy disclosures that
					accurately describe how the Customer Application accesses, uses,
					stores, and shares third-party integration data — in addition to
					Corsair&apos;s Privacy Policy.
				</p>
			</LegalSection>

			<LegalSection title="4. Customer Obligations">
				<p>Customer agrees that it is responsible for:</p>
				<ol className="list-[lower-alpha] space-y-3 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Compliance with third-party provider policies.
						</strong>{' '}
						Complying with the terms, API policies, and data-use restrictions of
						each third-party service Customer connects through the Service
						(including, where applicable, the Google API Services User Data
						Policy and Limited Use requirements), with respect to any data
						obtained through the Customer Application;
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Appropriate use.
						</strong>{' '}
						Using third-party integration data obtained via the Service only for
						purposes disclosed to End Users, and not for advertising, sale to
						third parties, or training machine learning or AI models, except to
						the extent expressly permitted by the applicable provider&apos;s
						policies;
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Scope minimization.
						</strong>{' '}
						Requesting only the permissions and OAuth scopes reasonably
						necessary for the Customer Application&apos;s implemented features;
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Security of Customer systems.
						</strong>{' '}
						Maintaining reasonable safeguards for Customer Application
						infrastructure, API keys, and — when using SDK with Hub — the
						encryption key and database that store integration credentials; and
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Own OAuth verification, where applicable.
						</strong>{' '}
						If Customer uses its own OAuth client credentials rather than
						Corsair&apos;s managed applications, Customer is solely responsible
						for any required provider verification or security assessments for
						those credentials.
					</li>
				</ol>
				<p>
					Corsair may suspend or terminate access if we reasonably believe
					Customer&apos;s use violates these Terms, applicable third-party
					policies, or creates security or compliance risk to Corsair or other
					Customers.
				</p>
			</LegalSection>

			<LegalSection title="5. Corsair's Obligations">
				<p>Corsair will:</p>
				<ol className="list-[lower-alpha] space-y-3 pl-6">
					<li>
						Provide the Service in accordance with these Terms and our Privacy
						Policy;
					</li>
					<li>
						Not use Customer Data for advertising, model training, or analytics
						unrelated to operating and securing the Service;
					</li>
					<li>
						Encrypt stored credentials and keys at rest and maintain reasonable
						security measures for data in transit and at rest within the
						Service, including isolation between Customers&apos; hosted
						environments; and
					</li>
					<li>
						Provide reasonable notice of material changes to the Service that
						could affect Customer&apos;s compliance obligations.
					</li>
				</ol>
			</LegalSection>

			<LegalSection title="6. Restrictions">
				<p>
					You will not, and will not permit any Customer Application or End User
					to, use the Service to:
				</p>
				<ol className="list-[lower-alpha] space-y-3 pl-6">
					<li>
						Violate applicable law or any third-party provider&apos;s API or
						data policies;
					</li>
					<li>
						Use multiple accounts or credentials to circumvent provider usage
						limits, abuse restrictions, or anti-spam protections;
					</li>
					<li>
						Distribute spam or unsolicited commercial messages through
						integrated services;
					</li>
					<li>
						Use the Service to exfiltrate, back up, or replicate third-party
						data at scale outside the context of a legitimate, disclosed
						user-facing feature;
					</li>
					<li>
						Reverse engineer, decompile, or attempt to derive source code from
						the Service, except as permitted by applicable law;
					</li>
					<li>
						Attempt to access another Customer&apos;s data or bypass tenant or
						project isolation; or
					</li>
					<li>
						Use the Service in any manner that could disable, overburden, or
						impair Corsair&apos;s standing with third-party providers or OAuth
						programs.
					</li>
				</ol>
			</LegalSection>

			<LegalSection title="7. Intellectual Property">
				<p>
					Corsair retains all right, title, and interest in the Service,
					including Hub, Corsair Cloud, the SDK, and associated software,
					excluding Customer Data and Customer Application code. Customer
					retains all rights to its Customer Applications and Customer Data.
				</p>
			</LegalSection>

			<LegalSection title="8. Fees">
				<p>
					Use of the Service may be subject to fees as described on our{' '}
					<Link href="/#pricing" className={legalLinkClassName}>
						pricing page
					</Link>
					, in your applicable order form, or subscription agreement. Current
					plans include:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">Hobby</strong> —
						$0/month for small projects, including unlimited tool calls, up to
						50 connections, up to 100k webhook events, unlimited managed
						permissions and auth pages, up to 3 team members, Corsair-branded
						consent screen, Discord community support, and community custom
						integrations.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">Pro</strong> —
						$200/month for teams in production, including unlimited tool calls,
						unlimited connections, unlimited webhooks, unlimited managed
						permissions and auth pages, unlimited team members, custom consent
						screen branding, Slack support, and custom integrations built by the
						Corsair team.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">Enterprise</strong> —
						custom pricing for organizations with custom needs, including custom
						limits and support arrangements as agreed in an order form.
					</li>
				</ul>
				<p>
					We may change pricing with reasonable notice. Continued use of paid
					features after a price change takes effect constitutes acceptance of
					the updated fees, unless otherwise required by your order form or
					applicable law.
				</p>
			</LegalSection>

			<LegalSection title="9. Termination">
				<p>
					Either party may terminate these Terms at any time with notice as
					described in your order form or account settings. Corsair may suspend
					or terminate access immediately if Customer&apos;s use violates these
					Terms or creates security or compliance risk.
				</p>
				<p>
					Upon termination, Customer&apos;s access to Hub and Corsair Cloud will
					cease. Customer Data stored in a Corsair-managed database for Cloud
					may be deleted in accordance with our Privacy Policy. Customer remains
					responsible for Customer Data in databases Customer operates or
					provides (including when Cloud is configured to use a
					customer-provided database), and for winding down use of third-party
					APIs in compliance with applicable provider policies.
				</p>
			</LegalSection>

			<LegalSection title="10. Disclaimers">
				<p className="uppercase">
					The service is provided &ldquo;as is&rdquo; without warranties of any
					kind, express or implied, including warranties of merchantability,
					fitness for a particular purpose, or non-infringement. Corsair does
					not warrant that the service will be uninterrupted, error-free, or
					that third-party providers will continue to make their APIs available
					on current terms.
				</p>
			</LegalSection>

			<LegalSection title="11. Limitation of Liability">
				<p className="uppercase">
					To the maximum extent permitted by law, Corsair will not be liable for
					any indirect, incidental, special, consequential, or punitive damages,
					or any loss of data, revenue, or profits, arising from Customer&apos;s
					use of the Service, including any consequences of Customer&apos;s
					failure to comply with third-party provider policies. Corsair&apos;s
					total liability arising out of these Terms will not exceed the amounts
					paid by Customer to Corsair in the {LIABILITY_LOOKBACK_MONTHS} months
					preceding the claim.
				</p>
			</LegalSection>

			<LegalSection title="12. Indemnification">
				<p>
					Customer will indemnify and hold Corsair harmless from any claims,
					damages, or expenses (including reasonable attorneys&apos; fees)
					arising from: (a) Customer Application&apos;s use of third-party
					integration data in violation of applicable provider policies or law;
					(b) Customer&apos;s breach of Section 4 of these Terms; or (c) any
					dispute between Customer and its End Users.
				</p>
			</LegalSection>

			<LegalSection title="13. Changes to the Service or Terms">
				<p>
					We may modify the Service or these Terms from time to time. We will
					provide reasonable notice of material changes. Continued use of the
					Service after changes take effect constitutes acceptance of the
					revised Terms.
				</p>
			</LegalSection>

			<LegalSection title="14. Contact">
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

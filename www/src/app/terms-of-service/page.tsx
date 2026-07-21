import type { Metadata } from 'next';
import Link from 'next/link';

import {
	LegalDivider,
	LegalDocument,
	LegalSection,
	legalLinkClassName,
} from '@/components/legal/legal-document';

export const metadata: Metadata = {
	title: 'Terms of Service',
	description:
		'Terms governing access to and use of Corsair hub.corsair.dev, the Corsair SDK, and related services.',
	alternates: {
		canonical: '/terms-of-service',
	},
};

const CONTACT_EMAIL = 'dev@corsair.dev';
const LAST_UPDATED = 'July 21, 2026';
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
					govern access to and use of Corsair&apos;s managed OAuth
					infrastructure, hosted platform at hub.corsair.dev, SDK, and related
					services (collectively, the &ldquo;
					<strong className="font-medium text-[#1c1c1c]">Service</strong>
					&rdquo;), provided by Corsair (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">Corsair</strong>
					,&rdquo; &ldquo;
					<strong className="font-medium text-[#1c1c1c]">we</strong>,&rdquo;
					&ldquo;
					<strong className="font-medium text-[#1c1c1c]">us</strong>&rdquo;). By
					creating an account, integrating the Corsair SDK, or otherwise using
					the Service, you (&ldquo;
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
					&rdquo;) which connect to Google APIs (including Gmail, Google
					Calendar, Google Drive, Google Sheets, and related Google services) on
					behalf of Customer&apos;s own end users (&ldquo;
					<strong className="font-medium text-[#1c1c1c]">End Users</strong>
					&rdquo;). The Service consists of:
				</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">The Hub</strong>{' '}
						(hub.corsair.dev): a hosted service that facilitates OAuth token
						refresh operations using Corsair&apos;s registered Google OAuth
						client credentials.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">The SDK</strong>:
						developer libraries (including{' '}
						<code className="text-sm">corsair</code> and plugin packages such as{' '}
						<code className="text-sm">@corsair-dev/gmail</code>) that Customer
						integrates into its own application to store, manage, and use OAuth
						credentials, and to make direct calls to Google APIs.
					</li>
				</ul>
				<p>
					Corsair does not access, store, or process the substantive content of
					End User Google Account data (e.g., email content, calendar event
					details, file contents, or spreadsheet data). Access tokens and
					refresh tokens are stored solely within Customer&apos;s own
					infrastructure. Corsair&apos;s role is limited to facilitating token
					refresh via the Hub and presenting a connect screen that identifies
					the Customer Application by name as &ldquo;powered by Corsair&rdquo;
					before End Users authorize access on Google&apos;s consent screen, as
					further described in our{' '}
					<Link href="/privacy-policy" className={legalLinkClassName}>
						Privacy Policy
					</Link>
					.
				</p>
			</LegalSection>

			<LegalSection title="2. Eligibility and Accounts">
				<p>
					You must be at least 18 years old and capable of forming a binding
					contract to use the Service. You are responsible for maintaining the
					confidentiality of your API keys and signing secrets, and for all
					activity that occurs under your Customer account.
				</p>
			</LegalSection>

			<LegalSection title="3. Customer Obligations Regarding Google User Data">
				<p>
					Because Customer Applications, not Corsair, directly access End User
					Google Account data, Customer agrees that it is independently
					responsible for:
				</p>
				<ol className="list-[lower-alpha] space-y-3 pl-6">
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Independent compliance with Google&apos;s policies.
						</strong>{' '}
						Complying with the Google API Services User Data Policy, the Google
						Workspace User Data and Developer Policy, and all other applicable
						Google terms and policies, including the Limited Use requirements,
						with respect to any Google user data obtained through the Customer
						Application.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Its own disclosures to End Users.
						</strong>{' '}
						Providing End Users with a privacy policy and in-product disclosures
						that accurately describe how the Customer Application accesses,
						uses, stores, and shares Google user data, independent of and in
						addition to Corsair&apos;s own Privacy Policy.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Appropriate use.
						</strong>{' '}
						Using Google user data obtained via the Service only for the
						purposes disclosed to End Users, and not for advertising, sale to
						third parties, or training machine learning or AI models, except to
						the extent expressly permitted by Google&apos;s policies.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Scope minimization.
						</strong>{' '}
						Requesting only the OAuth scopes reasonably necessary for the
						Customer Application&apos;s actual, implemented features, and not
						&ldquo;future-proofing&rdquo; scope requests for unimplemented
						functionality.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Security of stored credentials.
						</strong>{' '}
						Maintaining reasonable administrative, technical, and physical
						safeguards for any OAuth tokens or Google user data stored within
						Customer&apos;s own infrastructure, including encryption at rest.
					</li>
					<li>
						<strong className="font-medium text-[#1c1c1c]">
							Own OAuth verification, where applicable.
						</strong>{' '}
						If Customer elects to use its own Google OAuth client credentials (a
						&ldquo;white-labeled&rdquo; configuration) rather than
						Corsair&apos;s shared managed application, Customer is solely
						responsible for obtaining and maintaining any required Google
						verification, including CASA or other security assessments, for that
						OAuth client.
					</li>
				</ol>
				<p>
					Corsair may suspend or terminate a Customer&apos;s access to the
					Service if we reasonably believe Customer&apos;s use violates
					Google&apos;s policies, this Section, or creates risk to
					Corsair&apos;s own standing with Google.
				</p>
			</LegalSection>

			<LegalSection title="4. Corsair's Obligations">
				<p>Corsair will:</p>
				<ol className="list-[lower-alpha] space-y-3 pl-6">
					<li>
						Maintain the Hub&apos;s token-refresh functionality in accordance
						with our Privacy Policy;
					</li>
					<li>
						Not access, use, or retain the substantive content of Google user
						data obtained through Customer Applications;
					</li>
					<li>
						Maintain reasonable security measures for any data transiently
						processed by the Hub, including encryption in transit and
						authenticated communication between the Hub and the SDK;
					</li>
					<li>
						Provide reasonable notice of material changes to the Service that
						could affect Customer&apos;s own compliance obligations.
					</li>
				</ol>
			</LegalSection>

			<LegalSection title="5. Restrictions">
				<p>
					You will not, and will not permit any Customer Application or End User
					to, use the Service to:
				</p>
				<ol className="list-[lower-alpha] space-y-3 pl-6">
					<li>
						Violate Google&apos;s API Services User Data Policy or any Google
						product-specific policy;
					</li>
					<li>
						Use multiple accounts or credentials to circumvent Google&apos;s
						usage limits, abuse restrictions, or spam/filter protections;
					</li>
					<li>
						Distribute spam or unsolicited commercial messages via Gmail,
						Calendar, Drive, or other integrated Google services;
					</li>
					<li>
						Use the Service to exfiltrate, back up, or replicate Google user
						data at scale outside the context of a legitimate, disclosed
						user-facing feature;
					</li>
					<li>
						Reverse engineer, decompile, or attempt to derive source code from
						the Service, except as permitted by applicable law;
					</li>
					<li>
						Use the Service in any manner that could disable, overburden, or
						impair Corsair&apos;s own standing, verification status, or OAuth
						client credentials with Google.
					</li>
				</ol>
			</LegalSection>

			<LegalSection title="6. Intellectual Property">
				<p>
					Corsair retains all right, title, and interest in the Service,
					including the Hub, SDK, and all associated software, excluding any
					Customer data or Customer Application code. Customer retains all
					rights to its own Customer Applications and data.
				</p>
			</LegalSection>

			<LegalSection title="7. Fees">
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

			<LegalSection title="8. Termination">
				<p>
					Either party may terminate these Terms at any time with notice as
					described in your order form or account settings. Corsair may suspend
					or terminate access immediately if Customer&apos;s use of the Service
					violates these Terms, creates security risk, or violates Google&apos;s
					policies in a manner that could jeopardize Corsair&apos;s own OAuth
					verification status.
				</p>
				<p>
					Upon termination, Customer&apos;s access to the Hub will cease;
					Customer remains responsible for any tokens or Google user data
					already stored within its own infrastructure and for winding down its
					own use of Google APIs in compliance with Google&apos;s policies.
				</p>
			</LegalSection>

			<LegalSection title="9. Disclaimers">
				<p className="uppercase">
					The service is provided &ldquo;as is&rdquo; without warranties of any
					kind, express or implied, including warranties of merchantability,
					fitness for a particular purpose, or non-infringement. Corsair does
					not warrant that the service will be uninterrupted, error-free, or
					that Google will continue to make its APIs available on current terms.
				</p>
			</LegalSection>

			<LegalSection title="10. Limitation of Liability">
				<p className="uppercase">
					To the maximum extent permitted by law, Corsair will not be liable for
					any indirect, incidental, special, consequential, or punitive damages,
					or any loss of data, revenue, or profits, arising from Customer&apos;s
					use of the Service, including any consequences of Customer&apos;s
					failure to comply with Google&apos;s policies. Corsair&apos;s total
					liability arising out of these Terms will not exceed the amounts paid
					by Customer to Corsair in the {LIABILITY_LOOKBACK_MONTHS} months
					preceding the claim.
				</p>
			</LegalSection>

			<LegalSection title="11. Indemnification">
				<p>
					Customer will indemnify and hold Corsair harmless from any claims,
					damages, or expenses (including reasonable attorneys&apos; fees)
					arising from: (a) Customer Application&apos;s use of Google user data
					in violation of Google&apos;s policies or applicable law; (b)
					Customer&apos;s breach of Section 3 of these Terms; or (c) any dispute
					between Customer and its End Users.
				</p>
			</LegalSection>

			<LegalSection title="12. Changes to the Service or Terms">
				<p>
					We may modify the Service or these Terms from time to time. We will
					provide reasonable notice of material changes. Continued use of the
					Service after changes take effect constitutes acceptance of the
					revised Terms.
				</p>
			</LegalSection>

			<LegalSection title="13. Contact">
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

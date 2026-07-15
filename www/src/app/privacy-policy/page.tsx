import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description:
		'How Corsair handles your information, including Google and GitHub sign-in for Corsair Hub.',
	alternates: {
		canonical: '/privacy-policy',
	},
};

const CONTACT_EMAIL = 'dev@corsair.dev';
const SITE_URL = 'https://corsair.dev';

export default function PrivacyPolicyPage() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
			<div className="mb-10">
				<p className="mb-2 font-[family-name:var(--landing-font-mono)] text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
					Legal
				</p>
				<h1 className="mb-3 text-3xl font-semibold tracking-tight text-[#1c1c1c] md:text-4xl">
					Privacy Policy
				</h1>
				<p className="text-sm text-[#1c1c1c66]">Last updated: July 15, 2026</p>
			</div>

			<article className="space-y-10 text-base leading-relaxed text-[#1c1c1c99]">
				<section className="space-y-4">
					<p>
						This Privacy Policy explains how Corsair (&ldquo;we,&rdquo;
						&ldquo;our,&rdquo; or &ldquo;us&rdquo;) collects, uses, and protects
						your information when you use{' '}
						<Link
							href="/"
							className="text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]"
						>
							corsair.dev
						</Link>
						, Corsair Hub, and related services.
					</p>
					<p>
						Corsair is an open-source integration layer. We do{' '}
						<strong className="font-medium text-[#1c1c1c]">
							not collect sensitive authorization tokens
						</strong>{' '}
						for third-party services such as Gmail, Slack, or GitHub
						integrations, and we do{' '}
						<strong className="font-medium text-[#1c1c1c]">
							not hold your integration or application data
						</strong>
						. Integration credentials and synced data remain under your control
						in your own deployment or, when using Corsair Hub, are stored only
						to operate the service you explicitly configure.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						Google Sign-In
					</h2>
					<p>
						When you sign in to Corsair Hub using your Google account, we
						receive the following information from Google, with your permission:
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
						information.
					</p>

					<h3 className="text-lg font-semibold text-[#1c1c1c]">
						How we use Google sign-in data
					</h3>
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

					<h3 className="text-lg font-semibold text-[#1c1c1c]">
						Revoking Google access
					</h3>
					<p>
						You can revoke Corsair Hub&apos;s access to your Google account at
						any time via your{' '}
						<a
							href="https://myaccount.google.com/permissions"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]"
						>
							Google Account permissions page
						</a>
						.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						GitHub Sign-In
					</h2>
					<p>
						When you sign in to Corsair Hub using your GitHub account, we
						receive the following information from GitHub, with your permission:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>Your name or username</li>
						<li>Your email address</li>
						<li>Your profile picture (if available)</li>
						<li>A unique GitHub account identifier</li>
					</ul>
					<p>
						We do <strong className="font-medium text-[#1c1c1c]">not</strong>{' '}
						request or receive access to your repositories, organizations,
						gists, or any other GitHub data beyond your basic profile
						information.
					</p>

					<h3 className="text-lg font-semibold text-[#1c1c1c]">
						How we use GitHub sign-in data
					</h3>
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

					<h3 className="text-lg font-semibold text-[#1c1c1c]">
						Revoking GitHub access
					</h3>
					<p>
						You can revoke Corsair Hub&apos;s access to your GitHub account at
						any time via your{' '}
						<a
							href="https://github.com/settings/applications"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]"
						>
							GitHub authorized applications settings
						</a>
						.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						How we store and protect your information
					</h2>
					<p>
						Account information received through Google or GitHub sign-in is
						stored securely and protected using industry-standard security
						measures. We retain it only for as long as your account remains
						active, or as needed to provide Corsair Hub to you.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						Sharing of information
					</h2>
					<p>
						We do not share your personal information with third parties,
						except:
					</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>When required by law or legal process</li>
						<li>
							To protect the rights, property, or safety of Corsair, our users,
							or others
						</li>
						<li>
							With service providers who help us operate our service (for
							example, hosting providers), under confidentiality obligations
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						Your rights and choices
					</h2>
					<p>You can:</p>
					<ul className="list-disc space-y-2 pl-6">
						<li>
							Revoke Google or GitHub access using the links in the sections
							above
						</li>
						<li>
							Request that we delete your account and associated data by
							contacting us at{' '}
							<a
								href={`mailto:${CONTACT_EMAIL}`}
								className="text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]"
							>
								{CONTACT_EMAIL}
							</a>
						</li>
						<li>
							Request a copy of the data we hold about you by contacting us at{' '}
							<a
								href={`mailto:${CONTACT_EMAIL}`}
								className="text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]"
							>
								{CONTACT_EMAIL}
							</a>
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						Children&apos;s privacy
					</h2>
					<p>
						Corsair is not intended for use by children under the age of 13 (or
						the applicable age in your jurisdiction). We do not knowingly
						collect personal information from children.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						Changes to this policy
					</h2>
					<p>
						We may update this Privacy Policy from time to time. Any changes
						will be posted on this page with an updated &ldquo;Last
						updated&rdquo; date.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight text-[#1c1c1c]">
						Contact us
					</h2>
					<p>
						If you have any questions about this Privacy Policy, please contact
						us at:
					</p>
					<ul className="list-none space-y-1 pl-0">
						<li>
							<strong className="font-medium text-[#1c1c1c]">Email:</strong>{' '}
							<a
								href={`mailto:${CONTACT_EMAIL}`}
								className="text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]"
							>
								{CONTACT_EMAIL}
							</a>
						</li>
						<li>
							<strong className="font-medium text-[#1c1c1c]">Website:</strong>{' '}
							<a
								href={SITE_URL}
								className="text-[#1c1c1c] underline decoration-[#1c1c1c33] underline-offset-2 transition-colors hover:decoration-[#1c1c1c]"
							>
								{SITE_URL}
							</a>
						</li>
					</ul>
				</section>
			</article>
		</main>
	);
}

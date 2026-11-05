import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth-server';
import { enabledConnectProviders } from '@/server/oss-connect/linked-account';

import { signInErrorMessage } from '../oauth-error-messages';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
	title: 'Sign in',
	robots: { index: false, follow: false },
};

type PageProps = {
	searchParams: Promise<{ error?: string; switched?: string }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
	const session = await getSession();

	if (session) {
		redirect('/oss');
	}

	const { error, switched } = await searchParams;

	return (
		<main className="px-6 py-8">
			<SignInForm
				github={enabledConnectProviders().includes('github')}
				githubError={signInErrorMessage(error)}
				switchedFromGithub={switched === 'github'}
			/>
		</main>
	);
}

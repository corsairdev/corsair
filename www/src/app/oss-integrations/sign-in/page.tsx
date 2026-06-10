import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth-server';

import { SignInForm } from './sign-in-form';

export const metadata: Metadata = {
	title: 'Sign in',
};

export default async function SignInPage() {
	const session = await getSession();

	if (session) {
		redirect('/oss-integrations');
	}

	return (
		<main className="px-6 py-8">
			<SignInForm />
		</main>
	);
}

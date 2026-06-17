'use client';

import { EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';

import { FramedPanel } from '../framed-panel';

const inputClassName =
	'w-full rounded-lg border border-[#1c1c1c1a] bg-white px-3 py-2.5 text-sm text-[#1c1c1c] shadow-sm transition-all focus:border-[#1c1c1c66] focus:ring-2 focus:ring-[#4a38f514] focus:outline-none';

const labelClassName =
	'font-[family-name:var(--font-landing-mono)] text-[11px] font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase';

export function WaitlistEmailForm() {
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError('');

		await authClient.signIn.magicLink(
			{
				email,
				callbackURL: '/oss/waitlist',
			},
			{
				onSuccess: () => setSent(true),
				onError: (ctx) => {
					setError(ctx.error.message ?? 'Failed to send confirmation email');
				},
				onResponse: () => setLoading(false),
			},
		);
	};

	if (sent) {
		return (
			<FramedPanel>
				<div className="px-6 py-10 text-center sm:px-10 sm:py-12">
					<span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#4a38f50d] text-[#4a38f5]">
						<EnvelopeSimpleIcon size={28} weight="fill" aria-hidden />
					</span>
					<h2 className="mt-5 text-[clamp(1.35rem,2.5vw,1.75rem)] font-light tracking-[-0.01em] text-[#1c1c1c]">
						Check your email
					</h2>
					<p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.65] text-[#1c1c1c99]">
						We sent a confirmation link to{' '}
						<span className="font-medium text-[#1c1c1c]">{email}</span>. Click
						it to finish signing up — you&apos;ll land back here to complete
						your waitlist profile.
					</p>
					<button
						type="button"
						onClick={() => setSent(false)}
						className="mt-5 text-[13px] font-medium text-[#4a38f5] underline underline-offset-2 hover:text-[#1c1c1c]"
					>
						Send a new link
					</button>
				</div>
			</FramedPanel>
		);
	}

	return (
		<FramedPanel>
			<form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
				<h2 className="text-[15px] font-medium text-[#1c1c1c]">
					Join the waitlist
				</h2>
				<p className="mt-2 text-[13px] leading-[1.65] text-[#1c1c1c99]">
					Enter your email and we&apos;ll send a confirmation link. Once
					verified, you can add your GitHub and Discord handles.
				</p>

				<div className="mt-6">
					<label
						htmlFor="waitlist-email"
						className={`${labelClassName} flex items-center gap-2`}
					>
						<EnvelopeSimpleIcon size={14} aria-hidden />
						Email
					</label>
					<input
						id="waitlist-email"
						name="email"
						type="email"
						required
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="you@example.com"
						className={`mt-2 ${inputClassName}`}
					/>
				</div>

				{error ? (
					<p className="mt-4 text-[13px] text-red-600">{error}</p>
				) : null}

				<button
					type="submit"
					disabled={loading || !email}
					className="mt-6 inline-flex items-center justify-center rounded-lg border border-[#1c1c1c] bg-[#1c1c1c] px-5 py-2.5 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-40"
				>
					{loading ? 'Sending...' : 'Confirm email'}
				</button>
			</form>
		</FramedPanel>
	);
}

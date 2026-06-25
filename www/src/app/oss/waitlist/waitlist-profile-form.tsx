'use client';

import {
	CheckCircleIcon,
	DiscordLogo,
	GithubLogo,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { DISCORD_URL } from '@/lib/site-links';
import { cn } from '@/lib/utils';
import { joinWaitlist } from '@/server/actions/join-waitlist';

import { FramedPanel } from '../framed-panel';
import { HACKATHON_DATE_RANGE } from './waitlist-constants';

type WaitlistProfileFormProps = {
	email: string;
	githubUsername: string | null;
	discordUsername: string | null;
	hasJoined: boolean;
};

const inputClassName =
	'w-full rounded-lg border border-[#1c1c1c1a] bg-white px-3 py-2.5 text-sm text-[#1c1c1c] shadow-sm transition-all focus:border-[#1c1c1c66] focus:ring-2 focus:ring-[#4a38f514] focus:outline-none';

const labelClassName =
	'font-[family-name:var(--font-landing-mono)] text-[11px] font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase';

function DiscordJoinCallout() {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(DISCORD_URL);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard unavailable; the link remains clickable below.
		}
	};

	return (
		<div className="rounded-lg border border-[#5865F233] bg-[#5865F20d] px-4 py-4">
			<div className="flex items-start gap-3">
				<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#5865F233] bg-white text-[#5865F2]">
					<DiscordLogo size={20} weight="fill" aria-hidden />
				</span>
				<div className="min-w-0 flex-1">
					<p className="text-[14px] font-medium text-[#1c1c1c]">
						Join our Discord
					</p>
					<p className="mt-1 text-[13px] leading-[1.65] text-[#1c1c1c99]">
						Join the server before submitting — we use it for updates, help, and
						coordination during the hackathon.
					</p>
					<div className="mt-3 flex flex-wrap items-center gap-2">
						<a
							href={DISCORD_URL}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center justify-center rounded-lg border border-[#5865F2] bg-[#5865F2] px-3.5 py-2 text-[12px] font-medium text-white no-underline transition-colors hover:bg-[#4752c4]"
						>
							Open Discord invite
						</a>
						<button
							type="button"
							onClick={handleCopy}
							className={cn(
								'inline-flex items-center justify-center rounded-lg border px-3.5 py-2 text-[12px] font-medium transition-all duration-200',
								copied
									? 'border-[#1c1c1c] bg-[#1c1c1c] text-white'
									: 'border-[#1c1c1c1a] bg-white text-[#1c1c1c] hover:border-[#1c1c1c66]',
							)}
						>
							{copied ? 'Copied!' : 'Copy link'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function WaitlistProfileForm({
	email,
	githubUsername: initialGithubUsername,
	discordUsername: initialDiscordUsername,
	hasJoined: initialHasJoined,
}: WaitlistProfileFormProps) {
	const router = useRouter();
	const [githubUsername, setGithubUsername] = useState(
		initialGithubUsername ?? '',
	);
	const [discordUsername, setDiscordUsername] = useState(
		initialDiscordUsername ?? '',
	);
	const [hasJoined, setHasJoined] = useState(initialHasJoined);
	const [error, setError] = useState('');
	const [submitLoading, setSubmitLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitLoading(true);
		setError('');

		try {
			await joinWaitlist({
				discordUsername,
				githubUsername,
			});
			setHasJoined(true);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to join waitlist');
		} finally {
			setSubmitLoading(false);
		}
	};

	if (hasJoined) {
		return (
			<FramedPanel>
				<div className="px-6 py-10 text-center sm:px-10 sm:py-12">
					<span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#4a38f50d] text-[#4a38f5]">
						<CheckCircleIcon size={28} weight="fill" aria-hidden />
					</span>
					<h2 className="mt-5 text-[clamp(1.35rem,2.5vw,1.75rem)] font-light tracking-[-0.01em] text-[#1c1c1c]">
						You&apos;re on the list
					</h2>
					<p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.65] text-[#1c1c1c99]">
						We&apos;ll email you at{' '}
						<span className="font-medium text-[#1c1c1c]">{email}</span> before
						the sprint ({HACKATHON_DATE_RANGE}).
					</p>
					<dl className="mx-auto mt-6 max-w-sm space-y-3 border-t border-[#1c1c1c1a] pt-6 text-left">
						<div className="flex items-center justify-between gap-4 text-[13px]">
							<dt className="text-[#1c1c1c66]">GitHub</dt>
							<dd className="font-[family-name:var(--font-landing-mono)] text-[#1c1c1c]">
								@{githubUsername}
							</dd>
						</div>
						<div className="flex items-center justify-between gap-4 text-[13px]">
							<dt className="text-[#1c1c1c66]">Discord</dt>
							<dd className="font-[family-name:var(--font-landing-mono)] text-[#1c1c1c]">
								@{discordUsername}
							</dd>
						</div>
					</dl>
				</div>
			</FramedPanel>
		);
	}

	return (
		<FramedPanel>
			<form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
				<h2 className="text-[15px] font-medium text-[#1c1c1c]">
					Finish joining the waitlist
				</h2>
				<p className="mt-2 text-[13px] leading-[1.65] text-[#1c1c1c99]">
					Signed in as{' '}
					<span className="font-medium text-[#1c1c1c]">{email}</span>. Add your
					GitHub handle, join Discord, then enter your Discord username.
				</p>

				<div className="mt-6 space-y-5">
					<div>
						<label
							htmlFor="github-username"
							className={`${labelClassName} flex items-center gap-2`}
						>
							<GithubLogo size={14} aria-hidden />
							GitHub username
						</label>
						<input
							id="github-username"
							name="githubUsername"
							type="text"
							required
							value={githubUsername}
							onChange={(event) => setGithubUsername(event.target.value)}
							placeholder="octocat"
							autoComplete="username"
							className={`mt-2 ${inputClassName}`}
						/>
					</div>

					<DiscordJoinCallout />

					<div>
						<label
							htmlFor="discord-username"
							className={`${labelClassName} flex items-center gap-2`}
						>
							<DiscordLogo size={14} weight="fill" aria-hidden />
							Discord username
						</label>
						<input
							id="discord-username"
							name="discordUsername"
							type="text"
							required
							value={discordUsername}
							onChange={(event) => setDiscordUsername(event.target.value)}
							placeholder="yourname"
							autoComplete="username"
							className={`mt-2 ${inputClassName}`}
						/>
						<p className="mt-2 text-[12px] leading-[1.6] text-[#1c1c1c66]">
							Use the username shown on your Discord profile after joining the
							server.
						</p>
					</div>
				</div>

				{error ? (
					<p className="mt-4 text-[13px] text-red-600">{error}</p>
				) : null}

				<button
					type="submit"
					disabled={submitLoading}
					className="mt-6 inline-flex items-center justify-center rounded-lg border border-[#4a38f5] bg-[#4a38f5] px-5 py-2.5 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-[#3d2ed4] disabled:cursor-not-allowed disabled:opacity-40"
				>
					{submitLoading ? 'Joining...' : 'Join waitlist'}
				</button>
			</form>
		</FramedPanel>
	);
}

import type { Metadata } from 'next';

import { getSession } from '@/lib/auth-server';
import { getApi } from '@/server/api/caller';
import {
	HACKATHON_DATE_RANGE,
	HACKATHON_DATE_RANGE_FULL,
} from './waitlist-constants';
import { WaitlistEmailForm } from './waitlist-email-form';
import { WaitlistPrizes } from './waitlist-prizes';
import { WaitlistProfileForm } from './waitlist-profile-form';

export const metadata: Metadata = {
	title: 'OSS Hackathon Waitlist',
	description: `Join the waitlist for the Corsair integrations hackathon — a two-week sprint (${HACKATHON_DATE_RANGE_FULL}) to build open source integrations and compete for prizes.`,
};

export default async function OssWaitlistPage() {
	const session = await getSession();
	const profile = session ? await (await getApi()).account.getProfile() : null;

	const hasJoined = Boolean(
		profile?.discordUsername && profile?.githubUsername,
	);

	return (
		<main className="pb-16">
			<section className="grid gap-10 pt-12 pb-10 sm:pt-16 sm:pb-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] lg:items-start lg:gap-12 xl:gap-16">
				<div>
					<p className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
						Corsair integrations hackathon
					</p>
					<p className="mt-3 font-[family-name:var(--font-landing-mono)] text-[12px] font-medium tracking-[0.04em] text-[#4a38f5] uppercase">
						{HACKATHON_DATE_RANGE}
					</p>
					<h1 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]">
						<span className="font-[family-name:var(--landing-font-serif)] italic">
							2 weeks.
						</span>{' '}
						<span className="font-[family-name:var(--landing-font-sans)] tracking-[-0.04em]">
							1,000 integrations.
						</span>
					</h1>
					<div className="mt-5 max-w-[560px] space-y-4 text-[15px] leading-[1.65] text-[#1c1c1c99]">
						<p>
							A two-week sprint from {HACKATHON_DATE_RANGE_FULL} to build open
							source integrations. Corsair supplies the specs and scaffolding —
							you write, test, and ship code that thousands of developers will
							use in production.
						</p>
						<p>
							Gain TypeScript expertise, grow your open source footprint, and
							compete for prizes as you merge PRs and climb the leaderboard.
						</p>
						{session ? (
							<p className="text-[14px] text-[#1c1c1c]">
								Almost there — add your GitHub handle, join Discord, and enter
								your Discord username to secure your spot.
							</p>
						) : (
							<p className="text-[14px] text-[#1c1c1c]">
								Join the waitlist to get notified before the sprint (
								{HACKATHON_DATE_RANGE}).
							</p>
						)}
					</div>
				</div>

				<div className="w-full lg:max-w-md lg:justify-self-end xl:max-w-lg">
					{session ? (
						<WaitlistProfileForm
							email={session.user.email}
							githubUsername={profile?.githubUsername ?? null}
							discordUsername={profile?.discordUsername ?? null}
							hasJoined={hasJoined}
						/>
					) : (
						<WaitlistEmailForm />
					)}
				</div>
			</section>

			<section className="border-t border-[#1c1c1c1a] pt-12 sm:pt-14">
				<WaitlistPrizes />
			</section>
		</main>
	);
}

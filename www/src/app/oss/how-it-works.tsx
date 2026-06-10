import Link from 'next/link';

export function HowItWorks({ signedIn }: { signedIn: boolean }) {
	return (
		<section className="mb-6 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
			<h2 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
				How it works
			</h2>
			<p className="text-sm leading-relaxed text-muted-foreground">
				This page tracks integrations the community is building and shipping.
				See what&apos;s available, who&apos;s working on what, and follow work
				as it moves from claim to merge.
			</p>
			<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
				{signedIn ? (
					<>Claim an integration to see next steps. </>
				) : (
					<>Sign in and claim an integration to see next steps. </>
				)}
				Browse the{' '}
				<Link
					href="/oss?view=leaderboard"
					className="font-medium text-foreground underline-offset-2 hover:underline"
				>
					leaderboard
				</Link>{' '}
				for contributors who have shipped integrations.
			</p>
		</section>
	);
}

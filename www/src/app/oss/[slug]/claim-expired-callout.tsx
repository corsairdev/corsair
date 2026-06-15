import { ClockCountdown } from '@phosphor-icons/react/dist/ssr';

import { formatRelativeTime } from '../relative-time';

function expiredMessage(
	integrationName: string,
	reason: 'issue_timeout' | 'pr_timeout',
) {
	if (reason === 'issue_timeout') {
		return (
			<>
				Your claim on{' '}
				<span className="font-medium text-[#1c1c1c]">{integrationName}</span>{' '}
				expired because you didn&apos;t link an issue within 1 hour. Any saved
				links were cleared and the integration is available again.
			</>
		);
	}

	return (
		<>
			Your claim on{' '}
			<span className="font-medium text-[#1c1c1c]">{integrationName}</span>{' '}
			expired because you didn&apos;t link a PR within 3 hours. Any saved links
			were cleared and the integration is available again.
		</>
	);
}

export function ClaimExpiredCallout({
	integrationName,
	reason,
	expiredAt,
}: {
	integrationName: string;
	reason: 'issue_timeout' | 'pr_timeout';
	expiredAt: string;
}) {
	return (
		<section
			role="alert"
			className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4"
		>
			<div className="flex gap-3">
				<ClockCountdown
					size={20}
					className="mt-0.5 shrink-0 text-amber-900"
					aria-hidden
				/>
				<div className="min-w-0 space-y-1">
					<p className="font-[family-name:var(--font-landing-mono)] text-xs font-medium tracking-[0.02em] text-amber-950 uppercase">
						Claim expired
					</p>
					<p className="text-[14px] leading-relaxed text-amber-950/90">
						{expiredMessage(integrationName, reason)}
					</p>
					<p className="font-[family-name:var(--font-landing-mono)] text-[11px] text-amber-900/70">
						Expired {formatRelativeTime(expiredAt)}
					</p>
				</div>
			</div>
		</section>
	);
}

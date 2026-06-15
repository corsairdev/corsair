'use client';

import { useEffect, useState } from 'react';

import type { IntegrationPhase } from '@/db/schema';
import { phaseLabel } from '@/lib/integration-phases';

import { formatRelativeTime } from '../relative-time';

type TimelineEvent = {
	id: string;
	phase: IntegrationPhase;
	createdAt: string;
	githubUsername: string | null;
	avatarUrl: string | null;
	releaseReason?: string | null;
};

export function ClaimTimeline({ events }: { events: TimelineEvent[] }) {
	if (events.length === 0) {
		return (
			<p className="text-[13px] leading-relaxed text-[#1c1c1c66]">
				No claim activity yet.
			</p>
		);
	}

	return (
		<ol className="divide-y divide-[#1c1c1c0d]">
			{events.map((event) => (
				<ClaimTimelineItem key={event.id} event={event} />
			))}
		</ol>
	);
}

function ClaimTimelineItem({ event }: { event: TimelineEvent }) {
	const [relativeTime, setRelativeTime] = useState('');

	useEffect(() => {
		setRelativeTime(formatRelativeTime(event.createdAt));
	}, [event.createdAt]);

	return (
		<li className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 py-2.5">
			<span className="pt-px font-[family-name:var(--font-landing-mono)] text-[11px] whitespace-nowrap tabular-nums text-[#1c1c1c40]">
				{relativeTime || '\u00A0'}
			</span>
			<p className="min-w-0 text-[13px] leading-snug text-[#1c1c1c99]">
				{event.githubUsername ? (
					<a
						href={`https://github.com/${event.githubUsername}`}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1.5 font-medium text-[#1c1c1c] no-underline hover:underline"
					>
						{event.avatarUrl ? (
							<img
								src={event.avatarUrl}
								alt=""
								width={14}
								height={14}
								className="size-3.5 rounded-full"
							/>
						) : null}
						{event.githubUsername}
					</a>
				) : (
					<span className="font-medium text-[#1c1c1c]">someone</span>
				)}{' '}
				<span className="text-[#1c1c1c66]">{phaseLabel(event.phase)}</span>
				{event.releaseReason ? (
					<span className="text-[#1c1c1c40]">
						{' '}
						({event.releaseReason.replaceAll('_', ' ')})
					</span>
				) : null}
			</p>
		</li>
	);
}

import Link from 'next/link';

import { ContributorLink } from './contributor-link';
import { FramedPanel } from './framed-panel';
import { formatPoints } from './integration-reward';

type TableEntry = {
	rank: number;
	userId: string;
	githubUsername: string | null;
	avatarUrl: string | null;
	totalPoints: number;
	integrations: Array<{
		id: string;
		slug: string;
		name: string;
		points: number;
	}>;
};

export function LeaderboardTable({ entries }: { entries: TableEntry[] }) {
	if (entries.length === 0) return null;

	return (
		<FramedPanel corners={false}>
			<table className="w-full text-left text-sm">
				<thead>
					<tr className="border-b border-[#1c1c1c1a] font-[family-name:var(--font-landing-mono)] text-[10px] font-medium tracking-[0.08em] text-[#1c1c1c99] uppercase">
						<th className="w-12 px-4 py-2.5 font-medium sm:px-6">#</th>
						<th className="px-2 py-2.5 font-medium">Contributor</th>
						<th className="hidden px-2 py-2.5 font-medium md:table-cell">
							Integrations
						</th>
						<th className="w-24 px-4 py-2.5 text-right font-medium sm:px-6">
							Points
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[#1c1c1c0d]">
					{entries.map((entry) => (
						<tr
							key={entry.userId}
							className="transition-colors hover:bg-[#1c1c1c]/[0.02]"
						>
							<td className="px-4 py-3 font-[family-name:var(--font-landing-mono)] text-[12px] tabular-nums text-[#1c1c1c40] sm:px-6">
								{String(entry.rank).padStart(2, '0')}
							</td>
							<td className="px-2 py-3">
								<span className="flex items-center gap-2.5">
									{entry.avatarUrl ? (
										<img
											src={entry.avatarUrl}
											alt=""
											width={20}
											height={20}
											className="size-5 shrink-0 rounded-full"
										/>
									) : (
										<span className="size-5 shrink-0 rounded-full border border-[#1c1c1c1a] bg-[#1c1c1c0d]" />
									)}
									{entry.githubUsername ? (
										<ContributorLink
											githubUsername={entry.githubUsername}
											className="truncate font-medium text-[#1c1c1c] hover:text-[#4a38f5]"
										/>
									) : (
										<span className="truncate text-[#1c1c1c66]">unknown</span>
									)}
								</span>
							</td>
							<td className="hidden max-w-md px-2 py-3 md:table-cell">
								<span className="flex flex-wrap gap-x-3 gap-y-1 font-[family-name:var(--font-landing-mono)] text-[11px]">
									{entry.integrations.slice(0, 4).map((integration) => (
										<Link
											key={integration.id}
											href={`/oss/${integration.slug}`}
											className="text-[#1c1c1c99] no-underline hover:text-[#1c1c1c] hover:underline"
										>
											{integration.slug}
										</Link>
									))}
									{entry.integrations.length > 4 ? (
										<span className="text-[#1c1c1c40]">
											+{entry.integrations.length - 4}
										</span>
									) : null}
								</span>
							</td>
							<td className="px-4 py-3 text-right sm:px-6">
								<span className="font-[family-name:var(--font-landing-mono)] text-[13px] font-medium tabular-nums text-[#1c1c1c]">
									{formatPoints(entry.totalPoints)}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</FramedPanel>
	);
}

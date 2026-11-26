'use client';

import { CLAIM_CLIENTS } from '@/lib/claim-clients';
import { cn } from '@/lib/utils';

import { Check } from './pick-panel';
import { ClientIcon } from './start-icons';
import type { PassageApi } from './use-passage';

/** Step 3: the agents this URL goes into (as many as they use), and what the URL above is. */
export function ReviewPanel({ api }: { api: PassageApi }) {
	const { p, send } = api;
	return (
		<div className="border-t border-[#1c1c1c1a] px-5 pt-4 pb-5 text-[13px] text-[#1c1c1c99] sm:px-6">
			<div className="mb-3 flex items-baseline justify-between gap-3">
				<h2 className="text-[15px] font-medium text-[#1c1c1c]">
					Which agents will use it?
				</h2>
				<span className="shrink-0 text-[12px] text-[#1c1c1c66]">
					Pick all you use
				</span>
			</div>
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
				{CLAIM_CLIENTS.map((c) => {
					const on = p.clients.includes(c.id);
					return (
						<button
							key={c.id}
							type="button"
							aria-pressed={on}
							onClick={() => send({ type: 'toggleClient', id: c.id })}
							className={cn(
								'flex h-11 items-center gap-2 rounded-lg border px-3 text-left text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a38f5]',
								on
									? 'border-[#4a38f5] bg-[#4a38f5]/[0.05] text-[#1c1c1c]'
									: 'border-[#1c1c1c1a] bg-white text-[#1c1c1cb3] hover:border-[#1c1c1c33]',
							)}
						>
							<ClientIcon domain={c.domain} size={16} />
							<span className="min-w-0 flex-1 truncate">{c.name}</span>
							{on ? (
								<Check />
							) : (
								<span
									aria-hidden
									className="size-4 shrink-0 rounded-[5px] border-[1.5px] border-[#1c1c1c33]"
								/>
							)}
						</button>
					);
				})}
			</div>
			<div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1.5">
				<p>
					That&apos;s your MCP URL. Rename{' '}
					<span className="ph-no-capture text-[#4a38f5]">
						/{p.link || 'work'}
					</span>{' '}
					if you like, such as /claude or /personal.
				</p>
				<button
					type="button"
					onClick={() => send({ type: 'goto', step: 'pick' })}
					className="ml-auto font-medium text-[#1c1c1c] underline-offset-4 hover:underline"
				>
					Change apps
				</button>
				<p className="w-full text-[#1c1c1c66]">
					You&apos;ll sign in once. Then you connect each app with your own
					account.
				</p>
			</div>
		</div>
	);
}

import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

import { hubMcpConnectUrl, hubWwwPluginLoginUrl } from '@/lib/site-links';

export function IntegrationHubCta({
	pluginId,
	displayName,
}: {
	pluginId: string;
	displayName: string;
}) {
	return (
		<section className="pb-4 md:pb-5">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<a
					href={hubMcpConnectUrl(pluginId)}
					target="_blank"
					rel="noopener noreferrer"
					className="group flex flex-col gap-4 rounded-lg border border-[#1c1c1c]/10 bg-white px-6 py-6 no-underline shadow-[0_8px_32px_rgba(28,28,28,0.06)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[#4a38f5]/25 hover:shadow-[0_12px_40px_rgba(74,56,245,0.12)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-7"
				>
					<div className="min-w-0">
						<p className="text-balance text-xl font-medium tracking-[-0.02em] text-[#1c1c1c] sm:text-2xl">
							Use {displayName} in Claude, ChatGPT, Cursor or another MCP client
						</p>
						<p className="mt-2 text-base leading-relaxed text-[#1c1c1c99]">
							Connect {displayName} once in Corsair, then add one MCP address to
							your agent.
						</p>
					</div>
					<span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4a38f5] px-6 py-3.5 text-sm font-medium text-white transition-colors group-hover:bg-[#3d2ee0] sm:px-7 sm:py-4 sm:text-base">
						Connect {displayName}
						<ArrowRight size={18} weight="bold" aria-hidden />
					</span>
				</a>
				<div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-sm text-[#1c1c1c99]">
					<a
						href="#connect"
						className="font-medium text-[#4a38f5] no-underline hover:underline"
					>
						Setup steps for Claude, ChatGPT, Cursor and Claude Code
					</a>
					<p>
						Building your own app on the Corsair SDK?{' '}
						<a
							href={hubWwwPluginLoginUrl(pluginId)}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-[#4a38f5] no-underline hover:underline"
						>
							Get API keys
						</a>
					</p>
				</div>
			</div>
		</section>
	);
}

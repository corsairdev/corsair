import { BUILT_INS } from '@/lib/home-content';
import { PlusCorner } from '../icons';

/** Issues, CRM, files and Postgres: apps every MCP URL comes with (lug.dev's "Built-in apps"). */
export function BuiltInsSection() {
	return (
		<section
			id="built-in"
			className="relative w-full scroll-mt-16 py-16 sm:py-20 md:py-24"
			aria-labelledby="built-in-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
				<div className="mx-auto mb-10 flex max-w-[720px] flex-col items-center gap-4 text-center md:mb-14">
					<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
						Built in
					</p>
					<h2
						id="built-in-heading"
						className="text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Issues, a CRM and files,
						</span>{' '}
						<span className="text-[#4a38f5]">no extra seats</span>
					</h2>
					<p className="max-w-[560px] text-base leading-relaxed text-[#1c1c1c99] md:text-[17px]">
						Every MCP URL comes with them, and your agents keep them up to date.
						Add your own Postgres and files too.
					</p>
				</div>

				<div className="relative mx-auto grid max-w-[1100px] border border-[#1c1c1c1a] bg-white sm:grid-cols-2 lg:grid-cols-4">
					{(
						[
							'-left-[7px] -top-[7px]',
							'-right-[7px] -top-[7px]',
							'-bottom-[7px] -left-[7px]',
							'-bottom-[7px] -right-[7px]',
						] as const
					).map((pos) => (
						<span key={pos} className={`pointer-events-none absolute ${pos}`}>
							<PlusCorner />
						</span>
					))}
					{BUILT_INS.map((item, i) => (
						<div
							key={item.id}
							className={`flex flex-col gap-2 p-6 ${i > 0 ? 'border-t border-[#1c1c1c1a] sm:border-t-0 sm:border-l' : ''} ${i === 2 ? 'sm:border-l-0 sm:border-t lg:border-t-0 lg:border-l' : ''} ${i === 3 ? 'sm:border-t lg:border-t-0' : ''}`}
						>
							<p className="font-[family-name:var(--landing-font-mono)] text-[11px] font-medium uppercase tracking-[0.06em] text-[#4a38f5]">
								{item.name}
							</p>
							<p className="text-[15px] leading-[1.6] text-[#1c1c1c99]">
								{item.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

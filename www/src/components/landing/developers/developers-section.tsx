import { ArrowRight, Star } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { formatStarCount } from '@/lib/format-star-count';
import { DEVELOPER_POINTS } from '@/lib/home-content';
import { DOCS_URL, GITHUB_URL } from '@/lib/site-links';
import { CopyableCodeSnippet } from '../copyable-code-snippet';

/** The homepage's one block for people building their own product. */
export function DevelopersSection({
	starCount,
}: {
	starCount?: number | null;
}) {
	return (
		<section
			id="developers"
			aria-labelledby="developers-heading"
			className="relative w-full scroll-mt-16 py-14 sm:py-20"
		>
			<div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-10">
				<div className="grid grid-cols-1 gap-8 rounded-xl border border-[#1c1c1c]/10 bg-[#1c1c1c] px-6 py-8 text-white sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
					<div className="min-w-0">
						<p className="font-[family-name:var(--landing-font-mono)] text-[11px] font-medium uppercase tracking-[0.06em] text-[#a99ffb]">
							For developers
						</p>
						<h2
							id="developers-heading"
							className="mt-3 font-[family-name:var(--landing-font-serif)] text-[clamp(1.75rem,3.4vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em]"
						>
							Building your own product? Put the same layer inside it.
						</h2>
						<ul className="mt-5 space-y-2">
							{DEVELOPER_POINTS.map((point) => (
								<li
									key={point}
									className="flex items-start gap-2.5 text-[14px] leading-snug text-white/80"
								>
									<span
										aria-hidden
										className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#a99ffb]"
									/>
									{point}
								</li>
							))}
						</ul>
					</div>

					<div className="min-w-0 space-y-4">
						<div className="space-y-2 rounded-lg bg-white p-3 text-[#1c1c1c]">
							<CopyableCodeSnippet code="npm install corsair" />
							<CopyableCodeSnippet code="npx skills add corsairdev/corsair" />
							<p className="px-1 text-[12px] text-[#1c1c1c99]">
								The second line gives your coding agent the setup skill.
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
							<a
								href={GITHUB_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-medium text-[#1c1c1c] no-underline transition-colors hover:bg-white/90"
							>
								<Star
									size={16}
									weight="fill"
									className="text-amber-500"
									aria-hidden
								/>
								Star on GitHub
								{starCount != null ? (
									<span className="font-[family-name:var(--landing-font-mono)] text-[13px] text-amber-600 tabular-nums">
										{formatStarCount(starCount)}
									</span>
								) : null}
							</a>
							<a
								href={DOCS_URL}
								className="text-[14px] font-medium text-white no-underline hover:underline"
							>
								Read the docs
							</a>
							<Link
								href="/developers"
								className="inline-flex items-center gap-1 text-[14px] font-medium text-[#a99ffb] no-underline hover:underline"
							>
								More for developers
								<ArrowRight size={14} weight="bold" aria-hidden />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

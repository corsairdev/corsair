import { CompareHtmlContent } from '@/components/compare/compare-html-content';
import type { CompareFeatureRow } from '@/content/compare/types';

function StatusIcon({ supported }: { supported: boolean }) {
	if (supported) {
		return (
			<span
				className="inline-flex size-6 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#166534]"
				aria-label="Yes"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M2 6l2.5 2.5L10 3"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
		);
	}

	return (
		<span
			className="inline-flex size-6 items-center justify-center rounded-full bg-[#fef2f2] text-[#991b1b]"
			aria-label="No"
		>
			<svg
				width="10"
				height="10"
				viewBox="0 0 10 10"
				fill="none"
				aria-hidden="true"
			>
				<path
					d="M2 2l6 6M8 2L2 8"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		</span>
	);
}

export function CompareFeatureTable({
	title,
	columns,
	rows,
	footer,
}: {
	title: string;
	columns: {
		feature: string;
		corsair: string;
		competitor: string;
	};
	rows: CompareFeatureRow[];
	footer: string;
}) {
	return (
		<section className="border-t border-[#1c1c1c1a] py-14 md:py-16">
			<h2 className="mb-8 text-2xl font-medium tracking-[-0.02em] text-[#1c1c1c]">
				{title}
			</h2>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[480px] text-left">
					<thead>
						<tr className="border-b border-[#1c1c1c1a]">
							<th className="pb-3 pr-6 font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
								{columns.feature}
							</th>
							<th className="pb-3 pr-6 text-center font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#4a38f5]">
								{columns.corsair}
							</th>
							<th className="pb-3 text-center font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
								{columns.competitor}
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.feature} className="border-b border-[#1c1c1c0d]">
								<td className="py-3.5 pr-6 text-sm text-[#1c1c1c99]">
									{row.feature}
								</td>
								<td className="py-3.5 pr-6 text-center">
									<StatusIcon supported={row.corsair} />
								</td>
								<td className="py-3.5 text-center">
									<StatusIcon supported={row.competitor} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-10 border-t border-[#1c1c1c1a] pt-10 md:mt-12 md:pt-12">
				<div className="max-w-2xl text-[clamp(1.0625rem,2.25vw,1.375rem)] font-medium leading-[1.4] tracking-[-0.02em] text-[#1c1c1c] [&_p+p]:mt-4">
					<CompareHtmlContent html={footer} />
				</div>
			</div>
		</section>
	);
}

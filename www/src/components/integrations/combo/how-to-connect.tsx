import { TextWithInlineCode } from '@/components/integrations/detail/text-with-inline-code';
import type { ComboData } from '@/lib/combo-types';

export function HowToConnect({ combo }: { combo: ComboData }) {
	return (
		<section id="connect" className="py-10 md:py-12">
			<div className="mx-auto max-w-[960px] px-4 sm:px-6 md:px-10">
				<h2 className="text-center font-[family-name:var(--landing-font-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light tracking-[-0.03em] text-[#1c1c1c]">
					How to connect {combo.displayA} and {combo.displayB}
				</h2>
				<ol className="relative mt-7 before:absolute before:top-5 before:bottom-5 before:left-[19px] before:w-px before:bg-[#1c1c1c]/10">
					{combo.connectSteps.map((step, i) => (
						<li key={step.title} className="relative flex gap-4 pb-3 last:pb-0">
							<span className="relative z-[1] mt-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1c1c1c]/10 bg-white font-[family-name:var(--landing-font-mono)] text-[13px] text-[#4a38f5]">
								{i + 1}
							</span>
							<div className="min-w-0 flex-1 rounded-md border border-[#1c1c1c]/10 bg-white px-4 py-4 sm:px-5">
								<h3 className="text-[15px] font-semibold text-[#1c1c1c]">
									{step.title}
								</h3>
								<p className="mt-1 text-[13px] leading-relaxed text-[#1c1c1c66]">
									<TextWithInlineCode text={step.description} />
								</p>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

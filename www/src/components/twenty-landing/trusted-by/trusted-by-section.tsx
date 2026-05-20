import Image from 'next/image';
import { TRUSTED_BY_LOGOS } from '../data/trusted-by-data';

function PlusCorner() {
	return (
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
			<path d="M7 0v14M0 7h14" stroke="#4a38f5" strokeWidth="1" />
		</svg>
	);
}

export function TrustedBySection() {
	return (
		<section
			className="relative w-full bg-[#f4f4f4] py-12 md:py-16"
			aria-label="Trusted by leading organizations"
		>
			<div className="mx-auto max-w-[1440px] px-4 md:px-10">
				<div className="relative flex flex-col items-center gap-5 rounded-sm border border-[#1c1c1c1a] bg-white p-5 md:flex-row md:gap-0 md:px-8 md:py-0">
					<span className="pointer-events-none absolute -left-[7px] -top-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -right-[7px] -top-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -bottom-[7px] -left-[7px]">
						<PlusCorner />
					</span>
					<span className="pointer-events-none absolute -bottom-[7px] -right-[7px]">
						<PlusCorner />
					</span>

					<div className="flex items-center justify-center md:py-5 md:pr-6">
						<p className="font-[family-name:var(--twenty-font-mono)] text-xs font-medium uppercase leading-4 tracking-normal text-[#1c1c1c99]">
							trusted by
						</p>
					</div>

					<div className="flex flex-1 flex-wrap items-center justify-center gap-4 py-2 md:gap-8 md:border-l md:border-[#1c1c1c1a] md:px-6 md:py-5">
						{TRUSTED_BY_LOGOS.map((logo, index) => (
							<div
								key={`${logo.src}-${index}`}
								className="relative h-7 w-14 shrink-0 overflow-hidden md:h-8 md:w-16"
								aria-hidden
							>
								<Image
									src={logo.src}
									alt=""
									fill
									unoptimized
									sizes="64px"
									className="object-contain object-center"
									style={{
										filter: `grayscale(1) brightness(${logo.grayBrightness ?? 1})`,
										opacity: logo.grayOpacity ?? 0.72,
										objectFit: logo.fit ?? 'contain',
									}}
								/>
							</div>
						))}
					</div>

					<div className="flex items-center justify-center md:border-l md:border-[#1c1c1c1a] md:py-5 md:pl-6">
						<span className="inline-flex items-center gap-2">
							<Image
								src="/twenty/logo-bar/others-icon.svg"
								alt=""
								width={14}
								height={14}
								unoptimized
								className="grayscale opacity-70"
							/>
							<span className="font-[family-name:var(--twenty-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1ccc]">
								+10k others
							</span>
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}

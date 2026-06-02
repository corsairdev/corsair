import { CorsairLogo } from '../icons/window-chrome';
import { CORSAIR_CAPABILITIES } from './use-cases-data';

export function CorsairInfrastructureLayer() {
	return (
		<div className="absolute inset-x-0 bottom-0 z-20 border-t border-[#4a38f533] bg-[linear-gradient(180deg,#1a1638_0%,#12101f_100%)] px-4 py-3 md:px-6 md:py-4">
			<div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between md:gap-4">
				<div className="flex items-center gap-2.5">
					<CorsairLogo
						size={28}
						fillColor="#ffffff"
						backgroundColor="#4a38f5"
					/>
					<div>
						<p className="text-[11px] font-medium leading-tight text-white md:text-xs">
							Corsair integration layer
						</p>
						<p className="text-[10px] leading-snug text-[#ffffff99] md:text-[11px]">
							The infrastructure every product above relies on
						</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{CORSAIR_CAPABILITIES.map((capability) => (
						<span
							key={capability}
							className="rounded-sm border border-[#ffffff1a] bg-[#ffffff0d] px-2 py-0.5 font-[family-name:var(--landing-font-mono)] text-[9px] font-medium uppercase tracking-[0.04em] text-[#ffffffcc] md:text-[10px]"
						>
							{capability}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

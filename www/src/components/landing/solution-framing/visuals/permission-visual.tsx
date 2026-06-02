'use client';

import { EnvelopeSimple } from '@phosphor-icons/react';
import { FeatureScene, PreviewPanel } from './feature-scene';
import { MiniWindowChrome } from './mini-window-chrome';

export function PermissionVisual() {
	return (
		<FeatureScene align="left">
			<PreviewPanel align="left">
				<MiniWindowChrome title="Gmail" slice="left" className="h-full min-h-0">
					<div className="relative h-full min-h-0">
						<div className="px-4 pb-4 pt-3.5 transition-[filter,opacity] duration-200 group-hover/scene:opacity-40 group-hover/scene:brightness-[0.85]">
							<div className="mb-3 flex items-center gap-2 border-b border-[#f4f4f4] pb-3">
								<span className="flex size-7 items-center justify-center rounded-md bg-[#ea4335]/10">
									<EnvelopeSimple
										size={16}
										weight="fill"
										className="text-[#ea4335]"
									/>
								</span>
								<p className="min-w-0 text-[13px] text-[#1c1c1c]">
									<span className="text-[#1c1c1c66]">To </span>
									<span className="font-medium">dev@corsair.dev</span>
								</p>
							</div>
							<p className="mb-3 text-[14px] font-medium leading-snug text-[#1c1c1c]">
								Sales Call at 9 AM Thursday
							</p>
							<p className="text-[13px] leading-relaxed text-[#1c1c1c99]">
								Hi Dev — we&apos;d love to connect on a quick sales call this
								Thursday at 9 AM. Looking forward to chatting!
							</p>
						</div>

						<div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/scene:opacity-100">
							<div className="absolute inset-0 bg-[#1c1c1c]/25" />
							<div className="pointer-events-auto relative z-10 mx-4 w-full max-w-[260px] scale-[0.97] rounded-lg border border-[#ebebeb] bg-white px-4 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-transform duration-200 group-hover/scene:scale-100">
								<p className="mb-2.5 text-center text-[12px] text-[#1c1c1c99]">
									Send via Gmail?
								</p>
								<div className="flex justify-center gap-2">
									<button
										type="button"
										tabIndex={-1}
										className="rounded-md border border-[#1c1c1c1a] bg-white px-4 py-1.5 text-[13px] font-medium text-[#1c1c1c99] transition-colors hover:bg-[#f4f4f4]"
									>
										Deny
									</button>
									<button
										type="button"
										tabIndex={-1}
										className="landing-cta-pulse relative cursor-pointer rounded-md bg-[#4a38f5] px-4 py-1.5 text-[13px] font-medium text-white transition-colors group-hover/scene:bg-[#3d2ee0]"
									>
										Approve
									</button>
								</div>
							</div>
						</div>
					</div>
				</MiniWindowChrome>
			</PreviewPanel>
		</FeatureScene>
	);
}

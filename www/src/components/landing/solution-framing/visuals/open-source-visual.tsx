'use client';

import { CaretDown, GitFork, Star } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { FeatureScene, PreviewPanel, WINDOW_SLICE_FRAME } from './feature-scene';
import { SkeletonLine } from './skeleton-line';

const DIM_ON_HOVER =
	'transition-[filter,opacity] duration-200 group-hover/scene:opacity-45 group-hover/scene:brightness-[0.88]';

export function OpenSourceVisual() {
	return (
		<FeatureScene align="right">
			<PreviewPanel align="right">
				<div
					className={`flex h-full w-full flex-col overflow-hidden bg-white ${WINDOW_SLICE_FRAME.right.github}`}
				>
					<div className="flex items-center justify-end gap-1.5 border-b border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-2">
						<div className={DIM_ON_HOVER}>
							<GhButton skeleton className="min-w-[56px]" />
						</div>
						<GhButton
							icon={<GitFork size={14} weight="bold" />}
							label="Fork"
							pulse
							focused
						/>
						<div className={DIM_ON_HOVER}>
							<GhButton
								icon={
									<Star size={14} weight="fill" className="text-[#9a6700]" />
								}
								skeleton
							/>
						</div>
					</div>

					<div className={`grid min-h-0 flex-1 grid-cols-[1fr_72px] ${DIM_ON_HOVER}`}>
						<div className="border-r border-[#d0d7de] p-2.5">
							<button
								type="button"
								tabIndex={-1}
								className="mb-2.5 flex w-full items-center justify-center gap-1 rounded-md border border-[#1f883d] bg-[#1f883d] px-2.5 py-1.5 text-[13px] font-medium text-white"
							>
								Code
								<CaretDown size={12} weight="bold" />
							</button>
							<div className="space-y-2">
								<SkeletonLine className="h-2.5 w-full" />
								<SkeletonLine className="h-2.5 w-[85%]" />
								<SkeletonLine className="h-2.5 w-[68%]" />
							</div>
						</div>

						<div className="p-2.5">
							<div className="mb-2.5 flex items-center justify-between">
								<SkeletonLine className="h-2.5 w-12" />
								<span className="size-3 rounded bg-[#1c1c1c0d]" aria-hidden />
							</div>
							<div className="space-y-2">
								<SkeletonLine className="h-2 w-full" />
								<SkeletonLine className="h-2 w-[75%]" />
								<SkeletonLine className="h-2 w-[55%]" />
							</div>
						</div>
					</div>
				</div>
			</PreviewPanel>
		</FeatureScene>
	);
}

function GhButton({
	icon,
	label,
	pulse = false,
	skeleton = false,
	focused = false,
	className = '',
}: {
	icon?: ReactNode;
	label?: string;
	pulse?: boolean;
	skeleton?: boolean;
	focused?: boolean;
	className?: string;
}) {
	return (
		<button
			type="button"
			tabIndex={-1}
			className={`flex items-center gap-1 rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-2 py-1 text-[13px] font-medium text-[#1f2328] transition-all duration-200 hover:bg-[#eaeef2] ${
				focused
					? 'relative z-10 group-hover/scene:border-[#4a38f5]/35 group-hover/scene:bg-white'
					: ''
			} ${pulse ? 'landing-fork-pulse' : ''} ${className}`}
		>
			{icon}
			{label ? (
				<span>{label}</span>
			) : skeleton ? (
				<SkeletonLine className="h-2.5 w-9" />
			) : null}
			<span className="mx-0.5 h-3.5 w-px bg-[#d0d7de]" aria-hidden />
			<CaretDown size={10} weight="bold" className="text-[#656d76]" />
		</button>
	);
}

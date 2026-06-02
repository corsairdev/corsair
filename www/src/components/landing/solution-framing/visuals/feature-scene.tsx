import type { ReactNode } from 'react';

export type PreviewAlign = 'left' | 'center' | 'right';

export const PREVIEW_SCENE_TOP_CLASS = 'top-4';

const SCENE_SLOT_CLASS: Record<PreviewAlign, string> = {
	left: 'left-4 right-0 bottom-0',
	center: 'left-0 right-0 bottom-0',
	right: 'left-0 right-4 bottom-0',
};

const PANEL_ORIGIN_CLASS: Record<PreviewAlign, string> = {
	left: 'origin-top-left',
	center: 'origin-top',
	right: 'origin-top-right',
};

export const WINDOW_SLICE_FRAME: Record<
	PreviewAlign,
	{ default: string; github: string }
> = {
	left: {
		default: 'rounded-tl-[6px] border border-[#ebebeb] border-b-0 border-r-0',
		github: 'rounded-tl-[6px] border border-[#d0d7de] border-b-0 border-r-0',
	},
	center: {
		default: 'rounded-none border border-[#ebebeb] border-b-0 border-x-0',
		github: 'rounded-none border border-[#d0d7de] border-b-0 border-x-0',
	},
	right: {
		default: 'rounded-tr-[6px] border border-[#ebebeb] border-b-0 border-l-0',
		github: 'rounded-tr-[6px] border border-[#d0d7de] border-b-0 border-l-0',
	},
};

export const FEATURE_SCENE_CLASS =
	'group/scene relative h-[320px] w-full shrink-0 overflow-hidden rounded-sm border border-[#1c1c1c1a] bg-[#111111]';

export function FeatureScene({
	children,
	align = 'center',
}: {
	children: ReactNode;
	align?: PreviewAlign;
}) {
	return (
		<div className={FEATURE_SCENE_CLASS} aria-hidden>
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,#1a1a1a_0%,#111111_45%,#0a0a0a_100%)]" />
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.35]"
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg,transparent,transparent 7px,rgba(255,255,255,0.03)_7px,rgba(255,255,255,0.03)_8px)',
				}}
			/>
			<div
				className={`absolute ${PREVIEW_SCENE_TOP_CLASS} ${SCENE_SLOT_CLASS[align]} overflow-hidden`}
			>
				{children}
			</div>
		</div>
	);
}

export function PreviewPanel({
	children,
	align = 'center',
	className = '',
}: {
	children: ReactNode;
	align?: PreviewAlign;
	className?: string;
}) {
	return (
		<div
			className={`relative flex h-full w-full flex-col ${PANEL_ORIGIN_CLASS[align]} transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/scene:scale-[1.04] ${className}`}
			style={{
				boxShadow: '0 20px 48px rgba(0,0,0,0.32)',
			}}
		>
			{children}
		</div>
	);
}

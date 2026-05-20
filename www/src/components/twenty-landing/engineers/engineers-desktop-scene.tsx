'use client';

import {
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import type { CSSProperties, PointerEvent, ReactNode, RefObject } from 'react';
import { CopyableCodeSnippet } from '../copyable-code-snippet';
import { useWindowOrder, WindowOrderProvider } from '../hooks/use-window-order';
import { useWindowPointerInteractions } from '../hooks/use-window-pointer-interactions';
import type { WindowPosition, WindowSize } from '../hooks/window-geometry';

const SDK_INSTALL_COMMAND = 'npm install corsair';

const ENGINEER_OPTIONS = [
	{
		id: 'sdk',
		title: 'The SDK',
		installCommand: SDK_INSTALL_COMMAND,
		body: 'Strongly typed. One credential model. One webhook pattern. Deeply integrated and custom-built to your stack.',
		bestFor: 'teams who want to own the stack',
	},
	{
		id: 'hosted',
		title: 'The hosted version',
		body: 'Drop in a Corsair MCP URL and any agent has access to Corsair immediately. Permission gates, approval flows, and secure auth links out of the box.',
		bestFor: 'teams who want to be live in minutes',
	},
	{
		id: 'cloud-sdk',
		title: 'The Cloud SDK',
		body: 'Use hosted and stay code-first. Provision instances, create tenants, configure plugins, and set permissions programmatically via API.',
		bestFor: 'teams building multi-tenant products',
	},
] as const;

type EngineerOption = (typeof ENGINEER_OPTIONS)[number];

const CHALK_TEXT_SHADOW =
	'0 0 1px rgba(255,255,255,0.85), 0 0 10px rgba(255,255,255,0.12), 1px 2px 1px rgba(0,0,0,0.35)';

const NOTE_THEME: Record<
	EngineerOption['id'],
	{
		background: string;
		fold: string;
		labelLeftPct: number;
		labelRotate: number;
		labelTopPct: number;
		leftPct: number;
		rotate: number;
		topPct: number;
	}
> = {
	sdk: {
		background: 'linear-gradient(168deg, #fff9b1 0%, #fff176 52%, #ffee58 100%)',
		fold: '#f9e547',
		labelLeftPct: 0.05,
		labelTopPct: 0.04,
		labelRotate: -1,
		leftPct: 0.05,
		topPct: 0.14,
		rotate: -2.5,
	},
	hosted: {
		background: 'linear-gradient(168deg, #ffe0b2 0%, #ffcc80 52%, #ffb74d 100%)',
		fold: '#f5b866',
		labelLeftPct: 0.56,
		labelTopPct: 0.1,
		labelRotate: 1.5,
		leftPct: 0.56,
		topPct: 0.2,
		rotate: 2.25,
	},
	'cloud-sdk': {
		background: 'linear-gradient(168deg, #f8bbd0 0%, #f48fb1 52%, #f06292 100%)',
		fold: '#e889a8',
		labelLeftPct: 0.12,
		labelTopPct: 0.48,
		labelRotate: -0.75,
		leftPct: 0.12,
		topPct: 0.58,
		rotate: -1.25,
	},
};

const DEFAULT_NOTE_SIZE: WindowSize = { width: 280, height: 180 };

function ChalkboardSurface({ children }: { children: ReactNode }) {
	return (
		<div className="relative overflow-visible rounded-sm border-[10px] border-[#6b4c35] bg-[#2a4538] shadow-[inset_0_0_60px_rgba(0,0,0,0.45),0_12px_40px_rgba(0,0,0,0.18)] md:border-[12px]">
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1px] opacity-[0.14]"
				style={{
					backgroundImage:
						'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25) 0%, transparent 45%), radial-gradient(circle at 78% 68%, rgba(255,255,255,0.12) 0%, transparent 40%)',
				}}
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1px] opacity-[0.07]"
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
				}}
				aria-hidden
			/>
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1px] mix-blend-overlay opacity-30"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
				}}
				aria-hidden
			/>
			<div className="relative">{children}</div>
		</div>
	);
}

function ChalkLabel({
	option,
	className = '',
	style,
}: {
	option: EngineerOption;
	className?: string;
	style?: CSSProperties;
}) {
	const theme = NOTE_THEME[option.id];

	return (
		<div
			className={className}
			style={{
				textShadow: CHALK_TEXT_SHADOW,
				transform: `rotate(${theme.labelRotate}deg)`,
				...style,
			}}
		>
			<p className="font-[family-name:var(--twenty-font-serif)] text-[1.35rem] font-normal leading-tight tracking-[0.01em] text-[#f5f5f0]/92 md:text-[1.5rem]">
				{option.title}
			</p>
			{'installCommand' in option ? (
				<div className="pointer-events-auto mt-1.5">
					<CopyableCodeSnippet
						inline
						code={option.installCommand}
						className="border-[#ffffff22] bg-[#ffffff12] text-[#f5f5f0]"
					/>
				</div>
			) : null}
		</div>
	);
}

function StickyNoteContent({ option }: { option: EngineerOption }) {
	return (
		<>
			<h3 className="sr-only">{option.title}</h3>
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_100%)]"
				aria-hidden
			/>
			<p className="relative text-[14px] leading-[1.6] text-[#1c1c1cbb] md:text-[15px] md:leading-[1.65]">
				{option.body}
			</p>
			<p className="relative mt-3 text-[13px] leading-[1.6] text-[#1c1c1c99] md:text-[14px]">
				<span className="font-medium text-[#1c1c1c]">Best for: </span>
				{option.bestFor}
			</p>
		</>
	);
}

function StickyNoteFace({
	isDragging,
	option,
}: {
	isDragging: boolean;
	option: EngineerOption;
}) {
	const theme = NOTE_THEME[option.id];

	return (
		<div
			className="relative w-[280px] max-w-full overflow-hidden p-4 md:p-5"
			style={{
				background: theme.background,
				transform: `rotate(${theme.rotate}deg)`,
				boxShadow: isDragging
					? '2px 8px 0 rgba(0,0,0,0.08), 4px 24px 32px rgba(0,0,0,0.18), inset 0 -1px 0 rgba(0,0,0,0.05)'
					: '1px 2px 0 rgba(0,0,0,0.06), 2px 8px 20px rgba(0,0,0,0.14), inset 0 -1px 0 rgba(0,0,0,0.04)',
			}}
		>
			<div
				className="pointer-events-none absolute bottom-0 right-0 size-6"
				style={{
					background: `linear-gradient(315deg, transparent 50%, ${theme.fold} 50%)`,
					boxShadow: '-1px 1px 2px rgba(0,0,0,0.08)',
				}}
				aria-hidden
			/>
			<StickyNoteContent option={option} />
		</div>
	);
}

function BoardChalkLabel({
	option,
}: {
	option: EngineerOption;
}) {
	const theme = NOTE_THEME[option.id];

	return (
		<div
			className="pointer-events-none absolute z-[1] max-w-[min(340px,44%)]"
			style={{
				left: `${theme.labelLeftPct * 100}%`,
				top: `${theme.labelTopPct * 100}%`,
			}}
		>
			<ChalkLabel option={option} />
		</div>
	);
}

function MobileChalkEntry({ option }: { option: EngineerOption }) {
	const theme = NOTE_THEME[option.id];

	return (
		<li className="flex w-full max-w-[360px] flex-col gap-3">
			<ChalkLabel option={option} style={{ transform: 'none' }} />
			<div
				className="relative w-full overflow-hidden p-4"
				style={{
					background: theme.background,
					boxShadow:
						'1px 2px 0 rgba(0,0,0,0.06), 2px 6px 16px rgba(0,0,0,0.12), inset 0 -1px 0 rgba(0,0,0,0.04)',
					transform: `rotate(${theme.rotate * 0.5}deg)`,
				}}
			>
				<StickyNoteContent option={option} />
			</div>
		</li>
	);
}

function DraggableStickyNote({
	boardRef,
	option,
}: {
	boardRef: RefObject<HTMLDivElement | null>;
	option: EngineerOption;
}) {
	const shellRef = useRef<HTMLLIElement>(null);
	const hasInitializedRef = useRef(false);
	const theme = NOTE_THEME[option.id];
	const [position, setPosition] = useState<WindowPosition | null>(null);
	const [size, setSize] = useState<WindowSize>(DEFAULT_NOTE_SIZE);
	const { activate, zIndex } = useWindowOrder(option.id);

	const getBounds = useCallback(() => {
		const board = boardRef.current;
		if (!board) return null;
		return {
			width: board.clientWidth,
			height: board.clientHeight,
		};
	}, [boardRef]);

	useLayoutEffect(() => {
		const board = boardRef.current;
		const shell = shellRef.current;
		if (!board || !shell) return;

		const measure = () => {
			const { width, height } = board.getBoundingClientRect();
			const shellRect = shell.getBoundingClientRect();

			if (shellRect.width > 0 && shellRect.height > 0) {
				setSize({ width: shellRect.width, height: shellRect.height });
			}

			if (!hasInitializedRef.current && width > 0 && height > 0) {
				setPosition({
					left: width * theme.leftPct,
					top: height * theme.topPct,
				});
				hasInitializedRef.current = true;
			}
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(board);
		observer.observe(shell);
		return () => observer.disconnect();
	}, [boardRef, theme.leftPct, theme.topPct]);

	const { handleDragStart, isDragging, latestPositionRef } =
		useWindowPointerInteractions({
			activate,
			blockedDragTargetSelector: 'button, a',
			edgeGap: 8,
			getBounds,
			minSize: { width: 200, height: 120 },
			position,
			setPosition,
			setSize,
			shellRef,
			size,
		});

	const renderPosition =
		position === null
			? null
			: isDragging
				? (latestPositionRef.current ?? position)
				: position;

	const handlePointerDown = (event: PointerEvent<HTMLLIElement>) => {
		activate();
		handleDragStart(event);
	};

	return (
		<li
			ref={shellRef}
			onPointerDown={handlePointerDown}
			className={
				renderPosition === null
					? 'absolute touch-none select-none'
					: 'absolute left-0 top-0 touch-none select-none'
			}
			style={
				renderPosition === null
					? {
							left: `${theme.leftPct * 100}%`,
							top: `${theme.topPct * 100}%`,
							zIndex: zIndex + 5,
							cursor: 'grab',
						}
					: {
							zIndex: isDragging ? 50 : zIndex + 5,
							cursor: isDragging ? 'grabbing' : 'grab',
							transform: `translate3d(${renderPosition.left}px, ${renderPosition.top}px, 0)`,
						}
			}
		>
			<StickyNoteFace isDragging={isDragging} option={option} />
		</li>
	);
}

function ChalkboardScene() {
	const boardRef = useRef<HTMLDivElement>(null);

	return (
		<ChalkboardSurface>
			<div
				ref={boardRef}
				className="relative hidden min-h-[600px] w-full p-6 lg:min-h-[660px] md:block md:p-8"
			>
				{ENGINEER_OPTIONS.map((option) => (
					<BoardChalkLabel key={`label-${option.id}`} option={option} />
				))}

				<WindowOrderProvider>
					<ul className="absolute inset-0 list-none" aria-label="Engineering options">
						{ENGINEER_OPTIONS.map((option) => (
							<DraggableStickyNote
								key={option.id}
								boardRef={boardRef}
								option={option}
							/>
						))}
					</ul>
				</WindowOrderProvider>
			</div>

			<ul
				className="flex list-none flex-col items-center gap-8 p-6 md:hidden"
				aria-label="Engineering options"
			>
				{ENGINEER_OPTIONS.map((option) => (
					<MobileChalkEntry key={option.id} option={option} />
				))}
			</ul>
		</ChalkboardSurface>
	);
}

export function EngineersDesktopScene() {
	return (
		<div className="relative mx-auto w-full max-w-[1100px]">
			<ChalkboardScene />
		</div>
	);
}

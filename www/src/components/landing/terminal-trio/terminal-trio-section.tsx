'use client';

import type { ComponentType } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { WindowOrderProvider } from '../hooks/use-window-order';
import {
	DESKTOP_HEIGHT,
	getTrioContainerHeight,
} from './draggable-chat-window';
import { OAuthDemoWindow } from './oauth-demo-window';
import { PermissionDemoWindow } from './permission-demo-window';
import { TriggersDemoWindow } from './triggers-demo-window';
import { TrioModalProvider, useTrioModal } from './trio-modal-context';

const MOBILE_BREAKPOINT = 768;

const TRIO_COLUMNS = [
	{
		id: 'auth',
		title: 'Auth in chat',
		Window: OAuthDemoWindow,
	},
	{
		id: 'permissions',
		title: 'Permissions for sensitive actions',
		Window: PermissionDemoWindow,
	},
	{
		id: 'triggers',
		title: 'Triggers & workflows',
		Window: TriggersDemoWindow,
	},
] as const;

function TerminalTrioColumn({
	title,
	Window,
	dimmed,
}: {
	title: string;
	Window: ComponentType<{ index: number; total: number }>;
	dimmed: boolean;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(() => getTrioContainerHeight(1, false));

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const update = () => {
			const { width } = el.getBoundingClientRect();
			const isMobile = width < MOBILE_BREAKPOINT;
			setHeight(getTrioContainerHeight(1, isMobile));
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div className="flex flex-col items-center gap-3 md:gap-4">
			<h3 className="text-center font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
				{title}
			</h3>
			<div
				ref={containerRef}
				className={`relative w-full max-w-[360px] transition-[opacity,filter,transform] duration-300 ${
					dimmed ? 'pointer-events-none scale-[0.98] opacity-45 blur-[1px]' : ''
				}`}
				style={{ height: `${height}px`, minHeight: `${DESKTOP_HEIGHT}px` }}
			>
				<Window index={0} total={1} />
			</div>
		</div>
	);
}

function TerminalTrioGrid() {
	const { isOpen } = useTrioModal();

	return (
		<div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-10 md:[&>div:nth-child(3)]:col-span-2 lg:grid-cols-3 lg:gap-8 lg:[&>div:nth-child(3)]:col-span-1">
			{TRIO_COLUMNS.map(({ id, title, Window }) => (
				<TerminalTrioColumn
					key={id}
					title={title}
					Window={Window}
					dimmed={isOpen}
				/>
			))}
		</div>
	);
}

export function TerminalTrioSection() {
	return (
		<section
			id="terminal-trio"
			className="relative w-full scroll-mt-16 bg-[#f4f4f4] py-16 sm:py-20 md:py-28 lg:py-32"
			aria-labelledby="terminal-trio-heading"
		>
			<div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
				<div className="mx-auto mb-14 flex max-w-[720px] flex-col items-center gap-6 text-center md:mb-20 md:max-w-[800px] md:gap-8">
					<h2
						id="terminal-trio-heading"
						className="w-full text-[clamp(1.75rem,3.8vw,2.75rem)] font-light leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]"
					>
						<span className="font-[family-name:var(--landing-font-serif)]">
							Built to handle real-world requests
						</span>
					</h2>
				</div>

				<TrioModalProvider>
					<WindowOrderProvider>
						<TerminalTrioGrid />
					</WindowOrderProvider>
				</TrioModalProvider>
			</div>
		</section>
	);
}

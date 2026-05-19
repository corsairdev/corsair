'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export function ScrollStorySection({
	children,
	className,
	sectionClassName,
	index,
}: {
	children: ReactNode;
	/** Extra classes on the animated inner wrapper */
	className?: string;
	/** Extra classes on the outer `<section>` */
	sectionClassName?: string;
	/** Shown as a faint index (01, 02, …) */
	index: number;
}) {
	const ref = useRef<HTMLElement>(null);
	const [active, setActive] = useState(false);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setActive(true);
			return;
		}

		const el = ref.current;
		if (!el) {
			return;
		}

		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setActive(true);
				}
			},
			{ rootMargin: '0px 0px -12% 0px', threshold: [0, 0.2, 0.35] },
		);

		io.observe(el);
		return () => io.disconnect();
	}, []);

	const label = String(index + 1).padStart(2, '0');

	return (
		<section
			ref={ref}
			className={cn(
				'relative flex min-h-screen flex-col justify-center border-t border-border/50 py-20 md:py-28',
				sectionClassName,
			)}
			aria-label={`Section ${label}`}
		>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
			<div
				className={cn(
					'mx-auto w-full max-w-3xl px-6 transition-[transform,opacity,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:duration-0',
					active
						? 'translate-y-0 opacity-100 blur-0'
						: 'translate-y-14 opacity-0 blur-[2px]',
					className,
				)}
			>
				<p className="mb-6 font-mono text-[0.65rem] font-medium tracking-[0.35em] text-muted-foreground">
					{label}
				</p>
				{children}
			</div>
		</section>
	);
}

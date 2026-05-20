'use client';

import {
	createContext,
	useContext,
	useLayoutEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react';

/** Match Tailwind `md` — preview stacks below this width. */
export const PREVIEW_MOBILE_BREAKPOINT = 768;

export type PreviewLayout = {
	isMobile: boolean;
	width: number;
	height: number;
	/** Vertical gap between stacked windows on mobile. */
	stackGap: number;
	/** App (CRM) window height when stacked on mobile. */
	mobileAppHeight: number;
};

const defaultLayout: PreviewLayout = {
	isMobile: false,
	width: 0,
	height: 0,
	stackGap: 12,
	mobileAppHeight: 0,
};

const PreviewLayoutContext = createContext<PreviewLayout>(defaultLayout);

export function usePreviewLayout() {
	return useContext(PreviewLayoutContext);
}

export function PreviewLayoutProvider({ children }: { children: ReactNode }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [layout, setLayout] = useState<PreviewLayout>(defaultLayout);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const update = () => {
			const { width, height } = el.getBoundingClientRect();
			const isMobile = width < PREVIEW_MOBILE_BREAKPOINT;
			const stackGap = 12;
			const mobileAppHeight = isMobile
				? Math.round(Math.max(260, height * 0.52))
				: 0;

			setLayout({
				isMobile,
				width,
				height,
				stackGap,
				mobileAppHeight,
			});
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<PreviewLayoutContext.Provider value={layout}>
			<div ref={containerRef} className="relative h-full w-full">
				{children}
			</div>
		</PreviewLayoutContext.Provider>
	);
}

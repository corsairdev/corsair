'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

type TrioModalApi = {
	open: (content: ReactNode) => void;
	close: () => void;
	isOpen: boolean;
};

const TrioModalContext = createContext<TrioModalApi | null>(null);

export function TrioModalProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const close = useCallback(() => setContent(null), []);
	const open = useCallback((node: ReactNode) => setContent(node), []);

	const api = useMemo(
		() => ({
			open,
			close,
			isOpen: content !== null,
		}),
		[open, close, content],
	);

	useEffect(() => {
		if (!content) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	}, [content]);

	return (
		<TrioModalContext.Provider value={api}>
			{children}
			{mounted && content
				? createPortal(
						<div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
							<button
								type="button"
								className="absolute inset-0 bg-[#1c1c1c]/50 backdrop-blur-[3px] transition-opacity"
								onClick={close}
								aria-label="Close dialog"
							/>
							<div className="relative z-10 w-full max-w-[560px] animate-[landing-modal-in_220ms_ease-out]">
								{content}
							</div>
						</div>,
						document.body,
					)
				: null}
		</TrioModalContext.Provider>
	);
}

export function useTrioModal() {
	const api = useContext(TrioModalContext);
	if (!api) {
		throw new Error('useTrioModal must be used within TrioModalProvider');
	}
	return api;
}

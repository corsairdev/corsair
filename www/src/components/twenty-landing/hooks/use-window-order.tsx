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

type WindowOrderApi = {
	register: (id: string) => void;
	unregister: (id: string) => void;
	activate: (id: string) => void;
};

const ApiContext = createContext<WindowOrderApi | null>(null);
const StackContext = createContext<readonly string[]>([]);

export function WindowOrderProvider({ children }: { children: ReactNode }) {
	const [stack, setStack] = useState<string[]>([]);

	const api = useMemo<WindowOrderApi>(
		() => ({
			register: (id) =>
				setStack((prev) => (prev.includes(id) ? prev : [...prev, id])),
			unregister: (id) => setStack((prev) => prev.filter((item) => item !== id)),
			activate: (id) =>
				setStack((prev) => {
					if (prev[prev.length - 1] === id) return prev;
					return [...prev.filter((item) => item !== id), id];
				}),
		}),
		[],
	);

	return (
		<ApiContext.Provider value={api}>
			<StackContext.Provider value={stack}>{children}</StackContext.Provider>
		</ApiContext.Provider>
	);
}

export function useWindowOrder(id: string) {
	const api = useContext(ApiContext);
	const stack = useContext(StackContext);

	useEffect(() => {
		if (!api) return;
		api.register(id);
		return () => api.unregister(id);
	}, [api, id]);

	const zIndex = useMemo(() => {
		const index = stack.indexOf(id);
		return index === -1 ? 1 : index + 2;
	}, [stack, id]);

	const activate = useCallback(() => {
		api?.activate(id);
	}, [api, id]);

	return { activate, zIndex };
}

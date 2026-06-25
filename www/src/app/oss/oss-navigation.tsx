'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useTransition } from 'react';

type OssNavigationContextValue = {
	isPending: boolean;
	navigate: (href: string) => void;
};

const OssNavigationContext = createContext<OssNavigationContextValue | null>(
	null,
);

export function OssNavigationProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const navigate = (href: string) => {
		startTransition(() => {
			router.replace(href);
		});
	};

	return (
		<OssNavigationContext.Provider value={{ isPending, navigate }}>
			{children}
		</OssNavigationContext.Provider>
	);
}

export function useOssNavigation() {
	const context = useContext(OssNavigationContext);

	if (!context) {
		throw new Error(
			'useOssNavigation must be used within OssNavigationProvider',
		);
	}

	return context;
}

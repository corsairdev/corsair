'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { OAuthProvider as OAuthProviderType } from './types';
import { useOAuth, type UseOAuthReturn } from './useOAuth';

export interface OAuthContextValue extends UseOAuthReturn {
	provider: OAuthProviderType;
	companyName: string;
}

const OAuthContext = createContext<OAuthContextValue | null>(null);

export interface OAuthProviderProps {
	provider: OAuthProviderType;
	companyName: string;
	scopes?: string[];
	onSuccess?: (integrationId: string) => void;
	onError?: (error: string) => void;
	apiEndpoint?: string;
	children: ReactNode;
}

/**
 * Context provider for OAuth state management
 * Provides OAuth operations and state to child components
 */
export function OAuthProvider({
	provider,
	companyName,
	scopes,
	onSuccess,
	onError,
	apiEndpoint,
	children,
}: OAuthProviderProps) {
	const oauth = useOAuth({
		provider,
		companyName,
		scopes,
		onSuccess,
		onError,
		apiEndpoint,
	});

	const value: OAuthContextValue = {
		...oauth,
		provider,
		companyName,
	};

	return <OAuthContext.Provider value={value}>{children}</OAuthContext.Provider>;
}

/**
 * Hook to access OAuth context
 */
export function useOAuthContext(): OAuthContextValue {
	const context = useContext(OAuthContext);
	if (!context) {
		throw new Error('useOAuthContext must be used within OAuthProvider');
	}
	return context;
}


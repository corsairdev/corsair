'use client';

import { useState, useCallback, useEffect } from 'react';
import type { OAuthProvider } from './types';

export type OAuthStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface UseOAuthOptions {
	provider: OAuthProvider;
	companyName: string;
	scopes?: string[];
	onSuccess?: (integrationId: string) => void;
	onError?: (error: string) => void;
	apiEndpoint?: string;
}

export interface UseOAuthReturn {
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	status: OAuthStatus;
	isConnected: boolean;
	error: string | null;
}

/**
 * React hook for OAuth operations
 * Handles OAuth flow initiation, popup management, and status tracking
 */
export function useOAuth(options: UseOAuthOptions): UseOAuthReturn {
	const {
		provider,
		companyName,
		scopes,
		onSuccess,
		onError,
		apiEndpoint = '/api/corsair',
	} = options;

	const [status, setStatus] = useState<OAuthStatus>('idle');
	const [error, setError] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	// Listen for OAuth callback messages from popup
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			// Verify origin for security
			if (event.origin !== window.location.origin) {
				return;
			}

			if (event.data.type === 'oauth-success') {
				setStatus('connected');
				setIsConnected(true);
				setError(null);
				if (onSuccess) {
					onSuccess(event.data.integrationId);
				}
			} else if (event.data.type === 'oauth-error') {
				setStatus('error');
				setError(event.data.error);
				if (onError) {
					onError(event.data.error);
				}
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, [onSuccess, onError]);

	const connect = useCallback(async () => {
		setStatus('connecting');
		setError(null);

		try {
			// Call initiate OAuth mutation
			const response = await fetch(`${apiEndpoint}/initiateOAuth`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					provider,
					accountId: 'default', // TODO: Get from user context
					scopes,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to initiate OAuth flow');
			}

			const data = await response.json();
			const { authorizationUrl, state } = data;

			// Open OAuth popup
			const width = 600;
			const height = 700;
			const left = window.screenX + (window.outerWidth - width) / 2;
			const top = window.screenY + (window.outerHeight - height) / 2;

			const popup = window.open(
				authorizationUrl,
				'oauth',
				`width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
			);

			if (!popup) {
				throw new Error('Popup blocked. Please allow popups for this site.');
			}

			// Monitor popup for closure
			const checkClosed = setInterval(() => {
				if (popup.closed) {
					clearInterval(checkClosed);
					if (status !== 'connected') {
						setStatus('idle');
					}
				}
			}, 1000);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to connect';
			setError(errorMessage);
			setStatus('error');
			if (onError) {
				onError(errorMessage);
			}
		}
	}, [provider, scopes, apiEndpoint, status, onError]);

	const disconnect = useCallback(async () => {
		// TODO: Implement disconnect logic
		setIsConnected(false);
		setStatus('idle');
	}, []);

	return {
		connect,
		disconnect,
		status,
		isConnected,
		error,
	};
}


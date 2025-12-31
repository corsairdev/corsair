'use client';

import type { OAuthProvider } from './types';
import { useOAuth } from './useOAuth';
import type { ComponentProps } from 'react';

export interface OAuthConnectButtonProps
	extends Omit<ComponentProps<'button'>, 'onClick' | 'onError'> {
	provider: OAuthProvider;
	companyName: string;
	scopes?: string[];
	onSuccess?: (integrationId: string) => void;
	onError?: (error: string) => void;
	apiEndpoint?: string;
	children?: React.ReactNode;
}

/**
 * Button component that initiates OAuth flow
 * Handles opening OAuth popup and managing connection state
 */
export function OAuthConnectButton({
	provider,
	companyName,
	scopes,
	onSuccess,
	onError,
	apiEndpoint,
	children,
	...buttonProps
}: OAuthConnectButtonProps) {
	const { connect, status, error } = useOAuth({
		provider,
		companyName,
		scopes,
		onSuccess,
		onError,
		apiEndpoint,
	});

	const isLoading = status === 'connecting';

	return (
		<button
			{...buttonProps}
			onClick={connect}
			disabled={isLoading || buttonProps.disabled}
			aria-busy={isLoading}
		>
			{isLoading ? (
				<>
					<svg
						className="animate-spin -ml-1 mr-2 h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Connecting...
				</>
			) : (
				children || `Connect ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
			)}
			{error && (
				<span className="ml-2 text-red-500 text-sm" role="alert">
					{error}
				</span>
			)}
		</button>
	);
}


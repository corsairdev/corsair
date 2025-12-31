'use client';

import type { OAuthProvider } from './types';

export interface OAuthConsentScreenProps {
	companyName: string;
	provider: OAuthProvider;
	scopes: string[];
	userInfo?: {
		name?: string;
		email?: string;
		image?: string;
	};
	onAuthorize: () => void;
	onCancel: () => void;
}

/**
 * Full-page consent screen component
 * Displays company name, provider logo, requested scopes, and user info
 */
export function OAuthConsentScreen({
	companyName,
	provider,
	scopes,
	userInfo,
	onAuthorize,
	onCancel,
}: OAuthConsentScreenProps) {
	const providerLogos: Record<OAuthProvider, string> = {
		slack: '💬',
		github: '🐙',
		gmail: '📧',
		linear: '📊',
	};

	const scopeDescriptions: Record<string, string> = {
		'channels:read': 'Read your Slack channels',
		'users:read': 'Read your Slack user information',
		'chat:write': 'Send messages on your behalf',
		'files:read': 'Read your Slack files',
		'files:write': 'Upload files to Slack',
		'repo': 'Access your GitHub repositories',
		'user': 'Read your GitHub user information',
		'read:org': 'Read your GitHub organization information',
		'https://www.googleapis.com/auth/gmail.readonly': 'Read your Gmail messages',
		'https://www.googleapis.com/auth/gmail.send': 'Send emails on your behalf',
		'https://www.googleapis.com/auth/gmail.modify': 'Modify your Gmail messages',
		'read': 'Read your Linear data',
		'write': 'Write to your Linear workspace',
	};

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
			<div className="max-w-2xl w-full">
				{/* Header with logos */}
				<div className="flex items-center justify-center gap-8 mb-8">
					<div className="w-16 h-16 border rounded-full flex items-center justify-center text-4xl">
						{providerLogos[provider]}
					</div>
					<div className="text-2xl">→</div>
					<div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
						{userInfo?.image ? (
							<img
								src={userInfo.image}
								alt={userInfo.name || 'User'}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-2xl">
								{userInfo?.name?.charAt(0).toUpperCase() || 'U'}
							</div>
						)}
					</div>
				</div>

				{/* Title */}
				<h1 className="text-3xl font-semibold text-center mb-8">
					{companyName} wants to access your {provider.charAt(0).toUpperCase() + provider.slice(1)}{' '}
					{provider === 'slack' ? 'workspace' : provider === 'gmail' ? 'account' : 'account'}
				</h1>

				{/* User info card */}
				<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-lg">{userInfo?.name || 'User'}</div>
							<div className="text-zinc-400">{userInfo?.email || 'No email provided'}</div>
						</div>
					</div>
				</div>

				{/* Permissions card */}
				<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
					<div className="text-lg mb-4">
						Continuing will allow {companyName} to:
					</div>
					<div className="flex flex-col gap-3">
						{scopes.map((scope) => (
							<div key={scope} className="flex items-center gap-3 text-zinc-300">
								<svg
									className="h-5 w-5 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span>{scopeDescriptions[scope] || scope}</span>
							</div>
						))}
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex items-center gap-4">
					<button
						onClick={onCancel}
						className="flex-1 px-6 py-3 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onAuthorize}
						className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
					>
						Authorize
					</button>
				</div>
			</div>
		</div>
	);
}


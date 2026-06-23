'use client';

import { useState } from 'react';

function HubConnectButton({
	plugin,
	label,
	oauthMode,
	source = 'client',
	buttonColor = '#4285F4',
}: {
	plugin: string;
	label: string;
	oauthMode?: 'byo' | 'managed';
	source?: 'client' | 'server';
	buttonColor?: string;
}) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleClick = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/hub/create-link', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					plugin,
					tenantId: 'default',
					source,
					oauthMode,
				}),
			});
			const data = await response.json();

			if (!response.ok || !data.connectUrl) {
				throw new Error(data.error ?? 'Failed to create connect link');
			}

			window.open(data.connectUrl, '_blank', 'noopener,noreferrer');
		} catch (connectError) {
			setError(
				connectError instanceof Error
					? connectError.message
					: 'Failed to create connect link',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button
				type="button"
				onClick={handleClick}
				disabled={loading}
				style={{
					padding: '0.75rem 1.5rem',
					backgroundColor: buttonColor,
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					fontSize: '1rem',
					cursor: loading ? 'not-allowed' : 'pointer',
					opacity: loading ? 0.6 : 1,
				}}
			>
				{loading ? 'Creating link…' : label}
			</button>
			{error ? (
				<p style={{ color: '#721c24', marginTop: '0.75rem' }}>{error}</p>
			) : null}
		</div>
	);
}

export default function Home() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await fetch('/api/issues', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, description }),
			});

			const data = await response.json();

			if (data.success) {
				setMessage({ type: 'success', text: 'Issue reported successfully!' });
				setTitle('');
				setDescription('');
			} else {
				setMessage({
					type: 'error',
					text: data.error || 'Failed to report issue',
				});
			}
		} catch (error) {
			setMessage({ type: 'error', text: 'Failed to report issue' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<main
			style={{
				padding: '2rem',
				fontFamily: 'system-ui, sans-serif',
				maxWidth: '800px',
				margin: '0 auto',
			}}
		>
			<h1>Corsair Demo</h1>
			<p>Next.js + tRPC + Inngest Integration Platform</p>

			<div
				style={{
					marginTop: '2rem',
					padding: '1.5rem',
					border: '1px solid #e0e0e0',
					borderRadius: '8px',
				}}
			>
				<h2>Report an Issue</h2>
				<p style={{ color: '#666', marginBottom: '1rem' }}>
					Submit an issue and it will be automatically created in Linear
				</p>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: '1rem' }}>
						<label
							htmlFor="title"
							style={{
								display: 'block',
								marginBottom: '0.5rem',
								fontWeight: '500',
							}}
						>
							Title *
						</label>
						<input
							id="title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							style={{
								width: '100%',
								padding: '0.5rem',
								border: '1px solid #ccc',
								borderRadius: '4px',
								fontSize: '1rem',
							}}
						/>
					</div>
					<div style={{ marginBottom: '1rem' }}>
						<label
							htmlFor="description"
							style={{
								display: 'block',
								marginBottom: '0.5rem',
								fontWeight: '500',
							}}
						>
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={4}
							style={{
								width: '100%',
								padding: '0.5rem',
								border: '1px solid #ccc',
								borderRadius: '4px',
								fontSize: '1rem',
								resize: 'vertical',
							}}
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						style={{
							padding: '0.75rem 1.5rem',
							backgroundColor: '#0070f3',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							fontSize: '1rem',
							cursor: loading ? 'not-allowed' : 'pointer',
							opacity: loading ? 0.6 : 1,
						}}
					>
						{loading ? 'Submitting...' : 'Submit Issue'}
					</button>
				</form>
				{message && (
					<div
						style={{
							marginTop: '1rem',
							padding: '0.75rem',
							backgroundColor:
								message.type === 'success' ? '#d4edda' : '#f8d7da',
							color: message.type === 'success' ? '#155724' : '#721c24',
							borderRadius: '4px',
							border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
						}}
					>
						{message.text}
					</div>
				)}
			</div>

			<div
				style={{
					marginTop: '2rem',
					padding: '1.5rem',
					border: '1px solid #e0e0e0',
					borderRadius: '8px',
				}}
			>
				<h2>Connect Integrations</h2>
				<p style={{ color: '#666', marginBottom: '1rem' }}>
					Connect via the Corsair Hub. Google Calendar uses BYO OAuth (your app
					stores client credentials). GitHub uses managed OAuth (Corsair-owned
					app, tokens refreshed via the hub).
				</p>
				<HubConnectButton
					plugin="googlecalendar"
					label="Connect Google Calendar via Hub"
					oauthMode="byo"
					source="client"
				/>
				<div style={{ marginTop: '1rem' }}>
					<HubConnectButton
						plugin="github"
						label="Connect GitHub via Hub (Managed OAuth)"
						oauthMode="managed"
						source="client"
						buttonColor="#24292f"
					/>
				</div>
			</div>

			<div style={{ marginTop: '2rem' }}>
				<h2>API Endpoints</h2>
				<ul>
					<li>
						<code>/api/webhook</code> - Webhook handler for
						Slack/Linear/GitHub/Resend events
					</li>
					<li>
						<code>/api/issues</code> - Report an issue (creates Linear issue)
					</li>
					<li>
						<code>/api/trpc</code> - tRPC API endpoints
					</li>
					<li>
						<code>/api/inngest</code> - Inngest event processing
					</li>
				</ul>
			</div>

			<div style={{ marginTop: '2rem' }}>
				<h2>Services</h2>
				<ul>
					<li>
						Inngest Dashboard:{' '}
						<a href="http://localhost:8288" target="_blank">
							http://localhost:8288
						</a>
					</li>
					<li>
						Drizzle Studio: Run <code>pnpm db:studio</code>
					</li>
				</ul>
			</div>

			<div
				style={{
					marginTop: '2rem',
					padding: '1rem',
					backgroundColor: '#f5f5f5',
					borderRadius: '8px',
				}}
			>
				<h2>Workflows</h2>
				<ul>
					<li>⭐ GitHub star → Slack notification with email and name</li>
					<li>📝 Issue reported → Linear issue creation</li>
					<li>
						📋 Linear events (issue/comment created/updated) → Slack
						notifications
					</li>
					<li>📧 Resend email → Slack notification + Linear issue</li>
				</ul>
			</div>
		</main>
	);
}

export default function Home() {
	return (
		<main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
			<h1>Corsair Demo</h1>
			<p>Next.js + tRPC + Inngest Integration Platform</p>

			<div style={{ marginTop: '2rem' }}>
				<h2>API Endpoints</h2>
				<ul>
					<li>
						<code>/api/webhook</code> - Webhook handler for Slack/Linear events
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
		</main>
	);
}

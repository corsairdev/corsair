export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
				<h1 className="text-4xl font-bold mb-8 text-center">
					Corsair Fly.io Demo
				</h1>

				<div className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
					<ul className="space-y-2">
						<li>
							<a
								href="/api/health"
								className="text-blue-600 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Health Check
							</a>
						</li>
						<li>
							<a
								href="/api/inngest"
								className="text-blue-600 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Inngest Endpoint
							</a>
						</li>
					</ul>
				</div>

				<div className="mb-8">
					<h2 className="text-2xl font-semibold mb-4">Features</h2>
					<ul className="list-disc list-inside space-y-2">
						<li>Next.js 14 with App Router</li>
						<li>Inngest for background jobs</li>
						<li>Drizzle ORM with PostgreSQL</li>
						<li>Corsair (Slack, Linear, Resend)</li>
						<li>tRPC for type-safe APIs</li>
						<li>Fly.io deployment ready</li>
					</ul>
				</div>

				<div className="text-center text-gray-600">
					<p>Check the README.md for setup instructions</p>
				</div>
			</div>
		</main>
	);
}

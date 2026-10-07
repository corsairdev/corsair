const REPO = 'corsairdev/corsair';

/**
 * fumadocs' own GithubInfo throws when the API call fails, and the call is
 * unauthenticated: 60 requests an hour per IP, shared across everything else
 * egressing from the same host. A rate-limited render must still produce a
 * GitHub link, so the count is the optional part.
 */
async function fetchStars(): Promise<number | null> {
	try {
		const res = await fetch(`https://api.github.com/repos/${REPO}`, {
			headers: {
				Accept: 'application/vnd.github+json',
				...(process.env.GITHUB_TOKEN
					? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
					: {}),
			},
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		const data = (await res.json()) as { stargazers_count?: number };
		return typeof data.stargazers_count === 'number'
			? data.stargazers_count
			: null;
	} catch {
		return null;
	}
}

export async function GithubStars() {
	const stars = await fetchStars();

	return (
		<a
			href={`https://github.com/${REPO}`}
			rel="noreferrer noopener"
			target="_blank"
			className="inline-flex items-center gap-1.5 self-center text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
		>
			<svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
				<title>GitHub</title>
				<path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
			</svg>
			{stars !== null && (
				<span className="inline-flex items-center gap-1 tabular-nums">
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="size-3.5"
					>
						<path d="m12 17.3-6.18 3.25 1.18-6.88L2 8.79l6.91-1L12 1.5l3.09 6.29 6.91 1-5 4.88 1.18 6.88z" />
					</svg>
					{new Intl.NumberFormat('en', {
						notation: 'compact',
						maximumFractionDigits: 1,
					}).format(stars)}
				</span>
			)}
		</a>
	);
}

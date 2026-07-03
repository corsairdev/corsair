export async function getGithubStarCount(): Promise<number | null> {
	try {
		const res = await fetch('https://api.github.com/repos/corsairdev/corsair', {
			next: { revalidate: 3600 },
			headers: process.env.GITHUB_TOKEN
				? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
				: {},
		});
		if (!res.ok) return null;
		const data = (await res.json()) as { stargazers_count?: number };
		return data.stargazers_count ?? null;
	} catch {
		return null;
	}
}

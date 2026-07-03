import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const main = async () => {
	if (!process.env.APIFY_API_KEY) {
		console.log('Skipping Apify demo test: APIFY_API_KEY is not set.');
		return;
	}

	const { corsair } = await import('@/server/corsair');
	const result = await corsair.apify.api.users.meGet({});
	const data = result.data as { id?: string; username?: string };

	console.log('Apify user lookup succeeded', {
		id: data.id,
		username: data.username,
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

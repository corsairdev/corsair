import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setBoxheroCredentials() {
	const { BOXHERO_API_KEY } = process.env;

	if (BOXHERO_API_KEY) {
		await corsair.keys.boxhero.set_api_key(BOXHERO_API_KEY);
	}
}

async function read(label: string, operation: () => Promise<unknown>) {
	try {
		const result = await operation();
		console.log(`${label}:`, JSON.stringify(result, null, 2));
		return result;
	} catch (error) {
		console.error(`${label} error:`, error);
		return undefined;
	}
}

const main = async () => {
	await setBoxheroCredentials();

	if (!process.env.BOXHERO_API_KEY) {
		console.log('Skipping BoxHero API tests: BOXHERO_API_KEY is not set');
		return;
	}

	await read('Team', () => corsair.boxhero.api.teams.getInfo({}));
	const locations = await read('Locations', () =>
		corsair.boxhero.api.locations.list({}),
	);
	const locationId = (
		locations as { items?: Array<{ id: number }> } | undefined
	)?.items?.[0]?.id;
	if (locationId !== undefined) {
		await read('Location', () =>
			corsair.boxhero.api.locations.get({ location_id: locationId }),
		);
	}

	await read('Partners', () =>
		corsair.boxhero.api.partners.list({ limit: 10 }),
	);

	const items = await read('Items', () =>
		corsair.boxhero.api.items.list({ limit: 10 }),
	);
	const itemId = (items as { items?: Array<{ id: number }> } | undefined)
		?.items?.[0]?.id;
	if (itemId !== undefined) {
		await read('Item', () =>
			corsair.boxhero.api.items.get({ item_id: itemId }),
		);
	}

	const attributes = await read('Item attributes', () =>
		corsair.boxhero.api.itemAttributes.list({}),
	);
	const attributeId = (
		attributes as { items?: Array<{ id: number }> } | undefined
	)?.items?.[0]?.id;
	if (attributeId !== undefined) {
		await read('Item attribute', () =>
			corsair.boxhero.api.itemAttributes.get({ attr_id: attributeId }),
		);
	}

	const members = await read('Members', () =>
		corsair.boxhero.api.members.list({}),
	);
	const memberId = (members as { items?: Array<{ id: number }> } | undefined)
		?.items?.[0]?.id;
	if (memberId !== undefined) {
		await read('Member', () =>
			corsair.boxhero.api.members.get({ member_id: memberId }),
		);
	}

	await read('Basic transactions', () =>
		corsair.boxhero.api.transactions.listBasic({ limit: 10 }),
	);
	await read('Location transactions', () =>
		corsair.boxhero.api.transactions.listLocation({ limit: 10 }),
	);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

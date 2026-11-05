import type { CoinmarketcalContext } from '..';
import type {
	CategoriesResponse,
	CoinGetResponse,
	EventGetResponse,
} from './types';

async function safeUpsert<T>(
	label: string,
	upsert: () => Promise<T>,
): Promise<void> {
	try {
		await upsert();
	} catch (error) {
		console.warn(`Failed to save CoinMarketCal ${label} to database:`, error);
	}
}

export async function persistCoins(
	ctx: CoinmarketcalContext,
	coins: CoinGetResponse[] | undefined,
): Promise<void> {
	const table = ctx.db.coins;
	if (!table || !coins) return;
	for (const coin of coins) {
		await safeUpsert('coin', () => table.upsertByEntityId(coin.slug, coin));
	}
}

export async function persistEvents(
	ctx: CoinmarketcalContext,
	events: EventGetResponse[] | undefined,
): Promise<void> {
	const table = ctx.db.events;
	if (!table || !events) return;
	for (const event of events) {
		await safeUpsert('event', () => table.upsertByEntityId(event.id, event));
	}
}

export async function persistCategories(
	ctx: CoinmarketcalContext,
	categories: CategoriesResponse['data'],
): Promise<void> {
	const table = ctx.db.categories;
	if (!table || !categories) return;
	for (const category of categories) {
		const id = String(category.id);
		await safeUpsert('category', () =>
			table.upsertByEntityId(id, { ...category, id }),
		);
	}
}

import {
	polymarketEndpointMeta,
	polymarketEndpointSchemas,
} from './endpoints/catalog';
import {
	PolymarketManifestSchema,
	polymarketManifest,
	polymarketOperations,
} from './endpoints/manifest';
import {
	getPolymarketInputSchema,
	getPolymarketOutputSchema,
	polymarketInputFields,
} from './endpoints/openapi-schema';
import { POLYMARKET_OPERATION_IDS } from './endpoints/operation-types';

const ids = polymarketOperations.map((operation) => operation.id);
const risk = (id: string) =>
	polymarketEndpointMeta[id as keyof typeof polymarketEndpointMeta].riskLevel;

describe('polymarket-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			PolymarketManifestSchema.safeParse(polymarketManifest).error?.issues ??
				[],
		).toEqual([]);
	});

	it('has 276 operations across the eight APIs, each named for its API', () => {
		expect(ids).toHaveLength(276);
		expect(new Set(ids).size).toBe(276);
		expect([...POLYMARKET_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const count = (host: string) =>
			polymarketOperations.filter((o) => o.host === host).length;
		expect({
			gamma: count('gamma'),
			data: count('data'),
			clob: count('clob'),
			bridge: count('bridge'),
			relayer: count('relayer'),
			rfq: count('rfq'),
			combos: count('combos'),
			perps: count('perps'),
		}).toEqual({
			gamma: 86,
			data: 22,
			clob: 69,
			bridge: 5,
			relayer: 7,
			rfq: 8,
			combos: 4,
			perps: 75,
		});
		for (const o of polymarketOperations) {
			expect(o.id.startsWith(`${o.host}.`)).toBe(true);
		}
	});
});

describe('schemas', () => {
	it('builds every input, output and webhook schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getPolymarketInputSchema(id);
				getPolymarketOutputSchema(id);
			} catch {
				failed.push(id);
			}
		}
		expect(failed).toEqual([]);
		expect(Object.keys(polymarketEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(polymarketEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('checks inputs and keeps outputs lenient', () => {
		const book = getPolymarketInputSchema('clob.books.get');
		expect(book.safeParse({}).success).toBe(false);
		expect(book.safeParse({ token_id: '123' }).success).toBe(true);
		expect(
			getPolymarketInputSchema('bridge.status').safeParse({ address: '' })
				.success,
		).toBe(false);
		const markets = getPolymarketOutputSchema('gamma.markets.list');
		expect(
			markets.safeParse([{ id: '1', question: 'Q?', unknownField: 1 }]).success,
		).toBe(true);
		expect(markets.safeParse({ id: '1' }).success).toBe(false);
	});

	it('routes path, query, header and raw-body fields', () => {
		const where = (id: string) =>
			Object.fromEntries(
				polymarketInputFields(id).map((f) => [f.name, `${f.in}:${f.wire}`]),
			);
		expect(where('gamma.markets.get')).toMatchObject({ id: 'path:id' });
		expect(where('clob.books.get')).toMatchObject({
			token_id: 'query:token_id',
		});
		expect(where('clob.apiKeys.derive')).toMatchObject({
			poly_address: 'header:POLY_ADDRESS',
			poly_signature: 'header:POLY_SIGNATURE',
			poly_timestamp: 'header:POLY_TIMESTAMP',
			poly_nonce: 'header:POLY_NONCE',
		});
		expect(where('clob.books.listByBody')).toMatchObject({
			body: 'body-raw:body',
		});
	});
});

describe('risk levels', () => {
	it('keeps lookups read and marks trading, money and credentials destructive', () => {
		for (const id of [
			'gamma.markets.list',
			'data.positions.list',
			'clob.books.listByBody',
			'clob.prices.listByBody',
			'bridge.quote',
			'perps.public.positionSnapshots',
		]) {
			expect(risk(id)).toBe('read');
		}
		for (const id of [
			'clob.orders.create',
			'clob.orders.cancelAll',
			'clob.apiKeys.create',
			'bridge.withdraw',
			'relayer.transactions.submit',
			'perps.orders.create',
			'perps.account.withdraw',
			'perps.leverage.update',
			'combos.quotes.submit',
		]) {
			expect(risk(id)).toBe('destructive');
		}
		expect(risk('perps.orders.setAutoCancel')).toBe('destructive');
		expect(risk('bridge.deposit')).toBe('write');
		expect(risk('clob.heartbeats.send')).toBe('write');
	});
});

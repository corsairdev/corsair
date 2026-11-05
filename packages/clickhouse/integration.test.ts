import { fetchPlayHtml, query } from './client';
import {
	ClickhouseColumn,
	ClickhouseDatabase,
	ClickhouseQueryResult,
	ClickhouseTable,
} from './schema/database';

const PLAY_URL = 'https://play.clickhouse.com/?user=play';
// Public playground user (`?user=play`). No tenant secret.
const PLAY_BASIC = `Basic ${Buffer.from('play:').toString('base64')}`;

const describeLive = process.env.CLICKHOUSE_SKIP_LIVE
	? describe.skip
	: describe;

describeLive('ClickHouse HTTP live (play.clickhouse.com)', () => {
	it('execute: SELECT 1 as JSONEachRow', async () => {
		const rows = await query(PLAY_URL, PLAY_BASIC, 'SELECT 1 AS x');
		expect(ClickhouseQueryResult.parse(rows[0])).toEqual({ x: 1 });
	});

	it('list databases from system.databases', async () => {
		const rows = await query(
			PLAY_URL,
			PLAY_BASIC,
			'SELECT name, engine FROM system.databases ORDER BY name LIMIT 5',
		);
		expect(rows.length).toBeGreaterThan(0);
		const parsed = ClickhouseDatabase.pick({ name: true, engine: true }).parse(
			rows[0],
		);
		expect(parsed.name.length).toBeGreaterThan(0);
		expect(parsed.engine.length).toBeGreaterThan(0);
	});

	it('list tables with param_ placeholders', async () => {
		const rows = await query(
			PLAY_URL,
			PLAY_BASIC,
			'SELECT name, engine, total_rows AS totalRows, total_bytes AS totalBytes FROM system.tables WHERE database = {database:String} ORDER BY name LIMIT {limit:UInt32} OFFSET {offset:UInt32}',
			{ params: { database: 'default', limit: 3, offset: 0 } },
		);
		expect(rows.length).toBeGreaterThan(0);
		ClickhouseTable.pick({
			name: true,
			engine: true,
			totalRows: true,
			totalBytes: true,
		}).parse(rows[0]);
	});

	it('table schema from system.columns', async () => {
		const rows = await query(
			PLAY_URL,
			PLAY_BASIC,
			'SELECT name, type, position, comment, default_expression AS defaultExpression FROM system.columns WHERE database = {database:String} AND table = {table:String} ORDER BY position LIMIT 3',
			{ params: { database: 'default', table: 'actors' } },
		);
		expect(rows.length).toBeGreaterThan(0);
		const col = ClickhouseColumn.pick({
			name: true,
			type: true,
			position: true,
			comment: true,
			defaultExpression: true,
		}).parse(rows[0]);
		expect(col.name).toBe('login');
		expect(col.type).toBe('String');
	});

	it('GET /play returns HTML', async () => {
		const html = await fetchPlayHtml(PLAY_URL, PLAY_BASIC);
		expect(html).toContain('<!DOCTYPE html>');
		expect(html.length).toBeGreaterThan(1000);
	});
});

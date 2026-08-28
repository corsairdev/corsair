import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { query } from '../client';
import type { ClickhouseEndpoints } from '../index';
import {
	ClickhouseEndpointInputSchemas,
	ClickhouseEndpointOutputSchemas,
} from './types';

const LIST_DATABASES_SQL =
	'SELECT name, engine FROM system.databases ORDER BY name';

export const listDatabases: ClickhouseEndpoints['listDatabases'] = async (
	ctx,
	rawInput,
) => {
	ClickhouseEndpointInputSchemas.listDatabases.parse(rawInput);
	const baseUrl = ctx.options.baseUrl;
	if (!baseUrl) throw new AuthMissingError('clickhouse', 'baseUrl');

	const rows = await query(baseUrl, ctx.key, LIST_DATABASES_SQL);
	const databases = rows.map((row) => ({
		name: String(row.name ?? ''),
		engine: String(row.engine ?? ''),
	}));

	await logEventFromContext(
		ctx,
		'clickhouse.query.listDatabases',
		{ count: databases.length },
		'completed',
	);

	return ClickhouseEndpointOutputSchemas.listDatabases.parse({ databases });
};

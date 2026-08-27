/**
 * ClickHouse HTTP client.
 *
 * ClickHouse is not a REST API — its HTTP interface accepts a raw SQL query
 * as the request body and returns rows in a chosen output format. We POST
 * the SQL with `FORMAT JSONEachRow` so each line is a JSON object.
 *
 * Auth is HTTP Basic. Credentials are passed in via the caller (see
 * `index.ts` keyBuilder) as the `Basic <base64>` header value.
 */

export class ClickhouseAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'ClickhouseAPIError';
	}
}

export type QueryRow = Record<string, unknown>;

/**
 * Execute a SQL query against a ClickHouse HTTP endpoint and return the
 * rows as plain objects.
 *
 * @param baseUrl  Per-tenant ClickHouse HTTP endpoint, e.g. `https://ch.example.com:8443`.
 *                 No trailing slash.
 * @param basicAuthHeader  Full `Authorization` header value, e.g. `Basic dXNlcjpwYXNz`.
 * @param sql  SQL to run. Caller is responsible for query safety.
 */
export async function query(
	baseUrl: string,
	basicAuthHeader: string,
	sql: string,
): Promise<QueryRow[]> {
	const url = baseUrl.replace(/\/+$/, '');
	const body = `${sql.trimEnd()}\nFORMAT JSONEachRow`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: basicAuthHeader,
			'Content-Type': 'text/plain; charset=utf-8',
		},
		body,
	});

	if (!response.ok) {
		const errBody = await response.text();
		throw new ClickhouseAPIError(
			errBody || response.statusText,
			response.status,
		);
	}

	const text = await response.text();
	if (!text.trim()) return [];

	const rows: QueryRow[] = [];
	for (const line of text.split('\n')) {
		if (!line) continue;
		try {
			rows.push(JSON.parse(line) as QueryRow);
		} catch (cause) {
			throw new ClickhouseAPIError(
				`Failed to parse ClickHouse response line: ${line}`,
			);
		}
	}
	return rows;
}

/**
 * Fetch the ClickHouse Play web UI HTML. The Play UI is a static page
 * served at `/play` on the same HTTP endpoint.
 */
export async function fetchPlayHtml(
	baseUrl: string,
	basicAuthHeader: string,
): Promise<string> {
	const url = `${baseUrl.replace(/\/+$/, '')}/play`;
	const response = await fetch(url, {
		method: 'GET',
		headers: { Authorization: basicAuthHeader },
	});

	if (!response.ok) {
		throw new ClickhouseAPIError(response.statusText, response.status);
	}
	return response.text();
}

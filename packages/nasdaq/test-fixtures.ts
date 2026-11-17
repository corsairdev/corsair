/**
 * Responses captured from data.nasdaq.com while writing this package. The
 * shapes matter more than usual here: rows are positional arrays, paging is a
 * signed cursor, and the two error envelopes look nothing alike.
 */

/** `GET /datatables/NDAQ/RTAT10/metadata.json`, the only full one. */
export const tableMetadata = {
	datatable: {
		vendor_code: 'NDAQ',
		datatable_code: 'RTAT10',
		name: 'Retail Trading Activity Tracker - Daily Top 10 (Free)',
		description: null,
		columns: [
			{ name: 'date', type: 'Date' },
			{ name: 'ticker', type: 'String' },
			{ name: 'activity', type: 'double' },
			{ name: 'sentiment', type: 'Integer' },
		],
		filters: ['date', 'ticker', 'activity', 'sentiment'],
		primary_key: [],
		premium: false,
		status: {
			refreshed_at: '2026-11-14T03:33:13.000Z',
			status: 'ON TIME',
			expected_at: '*',
			update_frequency: 'CONTINUOUS',
		},
		data_version: { code: '1', default: true, description: null },
	},
};

/**
 * `GET /datatables/NDAQ/RTAT10.json?qopts.per_page=2`. `data` is a list of
 * arrays aligned to `columns`, and `meta.next_cursor_id` is an opaque blob.
 */
export const tableRows = {
	datatable: {
		data: [
			['2021-11-01', 'TSLA', 0.0986, 3],
			['2021-11-01', 'AMD', 0.0286, 1],
		],
		columns: [
			{ name: 'date', type: 'Date' },
			{ name: 'ticker', type: 'String' },
			{ name: 'activity', type: 'BigDecimal(34,12)' },
			{ name: 'sentiment', type: 'Integer' },
		],
	},
	meta: {
		next_cursor_id:
			'eyJuZXh0X3VyaSI6Imh0dHA6Ly90cmluby1nYXRld2F5LnRyaW5vLnN2Yy5jbHVzdGVyLmxvY2FsOjgwODAvdjEvc3RhdGVtZW50L2V4ZWN1dGluZy8yMDI2MTExNl8xMTA3MDZfNTIwODNfZ3hoOWEveTgyNjY2NmVmM2EwYTY1NTg0ZDVhMjUxNzBhNmQ5Njg5ZWQzZDhiNTkvMSIsIm9mZnNldCI6Mn0=',
	},
};

/** The last page: `next_cursor_id` is null, which is the only end signal. */
export const tableRowsLastPage = {
	datatable: {
		data: [['2021-11-01', 'AAPL', 0.0274, -1]],
		columns: [
			{ name: 'date', type: 'Date' },
			{ name: 'ticker', type: 'String' },
			{ name: 'activity', type: 'BigDecimal(34,12)' },
			{ name: 'sentiment', type: 'Integer' },
		],
	},
	meta: { next_cursor_id: null },
};

/** `GET /datatables/NDAQ/RTAT10.json?qopts.export=true`, first poll. */
export const tableExportBuilding = {
	datatable_bulk_download: {
		file: {
			link: null,
			status: 'Creating',
			data_snapshot_time: null,
		},
		datatable: { last_refreshed_time: '2026-11-14 03:33:13 UTC' },
	},
};

/** The same call once Nasdaq has built the zip. */
export const tableExportFresh = {
	datatable_bulk_download: {
		file: {
			link: 'https://aws-gis-link-pro-us-east-1-datahub.s3.amazonaws.com/export/NDAQ/RTAT10/NDAQ_RTAT10_b8923648.zip?X-Amz-Expires=1800',
			status: 'Fresh',
			data_snapshot_time: '2026-11-16 11:36:32 UTC',
		},
		datatable: { last_refreshed_time: '2026-11-14 03:33:13 UTC' },
	},
};

/** The `quandl_error` envelope, used for both a bad key and a bad query. */
export const unknownKey = {
	quandl_error: {
		code: 'QEAx01',
		message:
			'We could not recognize your API key: bogus. Please check your API key and try again. You can find your API key under your account settings.',
	},
};

export const missingKey = {
	quandl_error: {
		code: 'QEPx04',
		message:
			'A valid API key is required to retrieve data. Please check your API key and try again. You can find your API key under your account settings.',
	},
};

export const expiredCursor = {
	quandl_error: {
		code: 'QESx06',
		message:
			'You have submitted an invalid cursor. Please request another one.',
	},
};

export const dailyLimit = {
	quandl_error: {
		code: 'QEAx06',
		message: 'You have exceeded your daily call limit as a subscriber',
	},
};

/** The gateway's page: HTML, a 403, and no `quandl_error` anywhere. */
export const gatewayBlockPage =
	'<html style="height:100%"><head><META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW"></head><body><iframe src="/_Incapsula_Resource?...">Request unsuccessful. Incapsula incident ID: 176000380008543024</iframe></body></html>';

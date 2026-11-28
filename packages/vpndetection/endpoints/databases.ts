import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { resolveVpndetectionDownload } from '../client';
import type { VpndetectionContext } from '../context';
import { endpoint } from './call';
import type {
	DatabasesDownloadInput,
	DatabasesDownloadResponse,
} from './types';
import {
	DatabasesChecksumInputSchema,
	DatabasesChecksumResponseSchema,
	DatabasesDownloadInputSchema,
	DatabasesDownloadResponseSchema,
	DatabasesDownloadsInputSchema,
	DatabasesDownloadsResponseSchema,
	DatabasesListInputSchema,
	DatabasesListResponseSchema,
	DatabasesMetadataInputSchema,
	DatabasesMetadataResponseSchema,
} from './types';

// Every /api/v1/database route needs a key with the `db.download` scope.

export const list = endpoint({
	event: 'vpndetection.databases.list',
	input: DatabasesListInputSchema,
	output: DatabasesListResponseSchema,
	request: () => ({ method: 'GET', path: '/api/v1/database/list' }),
	log: (_, result) => ({ count: result.databases.length }),
});

/** Returns the time-limited link the API redirects to, without downloading the file. */
export const download: CorsairEndpoint<
	VpndetectionContext,
	DatabasesDownloadInput,
	DatabasesDownloadResponse
> = async (ctx, input) => {
	const parsed = DatabasesDownloadInputSchema.parse(input);
	const url = await resolveVpndetectionDownload(ctx.key ?? '', {
		id: parsed.id,
		format: parsed.format,
		build: parsed.build,
	});
	const result = DatabasesDownloadResponseSchema.parse({ url });
	// The link is signed: only the database and format go to the log.
	await logEventFromContext(
		ctx,
		'vpndetection.databases.download',
		{ id: parsed.id, format: parsed.format },
		'completed',
	);
	return result;
};

export const metadata = endpoint({
	event: 'vpndetection.databases.metadata',
	input: DatabasesMetadataInputSchema,
	output: DatabasesMetadataResponseSchema,
	request: ({ id }) => ({
		method: 'GET',
		path: '/api/v1/database/metadata',
		query: { id },
	}),
	log: ({ id }) => ({ id }),
});

export const checksum = endpoint({
	event: 'vpndetection.databases.checksum',
	input: DatabasesChecksumInputSchema,
	output: DatabasesChecksumResponseSchema,
	request: ({ id, format }) => ({
		method: 'GET',
		path: '/api/v1/database/checksum',
		query: { id, format },
	}),
	log: ({ id, format }) => ({ id, format }),
});

export const downloads = endpoint({
	event: 'vpndetection.databases.downloads',
	input: DatabasesDownloadsInputSchema,
	output: DatabasesDownloadsResponseSchema,
	request: ({ limit }) => ({
		method: 'GET',
		path: '/api/v1/database/downloads',
		query: { limit },
	}),
	log: (_, result) => ({ count: result.downloads.length }),
});

export const Databases = { list, download, metadata, checksum, downloads };

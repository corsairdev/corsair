import type { GumroadEndpoints } from '..';
import type { GumroadForm } from '../client';
import { formEntries } from '../client';
import { call } from './call';

// Only the REST half of the documented upload flow lives here: presign,
// complete and abort. The S3 binary upload (PUT each part to its presigned
// URL) is client-side work the docs leave to the caller; see README.
export const presign: GumroadEndpoints['filesPresign'] = (ctx, input) =>
	call(ctx, 'filesPresign', 'files.presign', '/files/presign', input, {
		method: 'POST',
		toForm: (parsed) =>
			formEntries({ filename: parsed.filename, file_size: parsed.file_size }),
	});

export const complete: GumroadEndpoints['filesComplete'] = (ctx, input) =>
	call(ctx, 'filesComplete', 'files.complete', '/files/complete', input, {
		method: 'POST',
		toForm: (parsed) => {
			const entries: GumroadForm = [
				...formEntries({ upload_id: parsed.upload_id, key: parsed.key }),
			];
			for (const part of parsed.parts) {
				entries.push(['parts[][part_number]', part.part_number]);
				entries.push(['parts[][etag]', part.etag]);
			}
			return entries;
		},
	});

export const abort: GumroadEndpoints['filesAbort'] = (ctx, input) =>
	call(ctx, 'filesAbort', 'files.abort', '/files/abort', input, {
		method: 'POST',
		toForm: (parsed) =>
			formEntries({ upload_id: parsed.upload_id, key: parsed.key }),
	});

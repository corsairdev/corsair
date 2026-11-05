import type { PlacidEndpoints } from '..';
import { call } from './call';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export function filenameFromUrl(fileUrl: string, fallback: string): string {
	try {
		const last = new URL(fileUrl).pathname.split('/').pop();
		return last && last.includes('.') ? last : fallback;
	} catch {
		return fallback;
	}
}

/**
 * Downloads a file the caller pointed at and wraps it as a multipart part.
 *
 * Placid takes uploads as multipart, and a caller holding only a public URL
 * cannot build a Blob itself, so the bytes are fetched here and forwarded.
 */
export async function downloadAsFile(
	fileUrl: string,
	filename: string | undefined,
	fallbackName: string,
): Promise<File> {
	const downloaded = await fetch(fileUrl);
	if (!downloaded.ok) {
		throw new Error(
			`Could not download file_url (${downloaded.status}). It must be publicly reachable.`,
		);
	}
	const bytes = await downloaded.arrayBuffer();
	const mime =
		downloaded.headers.get('content-type')?.split(';')[0] ||
		'application/octet-stream';
	return new File(
		[new Uint8Array(bytes)],
		filename ?? filenameFromUrl(fileUrl, fallbackName),
		{
			type: mime,
		},
	);
}

export const upload: PlacidEndpoints['mediaUpload'] = async (ctx, rawInput) => {
	const parsed = Inputs.mediaUpload.parse(rawInput ?? {});
	// Placid files each part under the key the caller chose; `file` is its own
	// example, and the reply repeats that key back.
	const key = parsed.file_key ?? 'file';
	const file = await downloadAsFile(parsed.file_url, parsed.filename, 'upload');

	return await call(
		ctx,
		{
			event: 'media.upload',
			input: Inputs.mediaUpload,
			output: Outputs.mediaUpload,
		},
		parsed,
		() => ({ method: 'POST', path: '/media', formData: { [key]: file } }),
		{
			log: (_, result) => ({ count: result.media.length }),
		},
	);
};

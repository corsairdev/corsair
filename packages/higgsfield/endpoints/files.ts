import { lookup } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';
import { logEventFromContext } from 'corsair/core';
import {
	HiggsfieldError,
	makeHiggsfieldRequest,
	putToPresignedUrl,
} from '../client';
import type { HiggsfieldEndpoints } from '../index';
import type { FilesCreateUploadUrlResponse } from './types';
import {
	HiggsfieldEndpointInputSchemas,
	HiggsfieldEndpointOutputSchemas,
	UPLOAD_CONTENT_TYPES,
} from './types';

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const SOURCE_TIMEOUT_MS = 60_000;
const MAX_SOURCE_REDIRECTS = 3;

/**
 * Decodes standard or URL-safe base64, padded or not, after checking the
 * decoded size. Node's decoder silently drops an incomplete last group
 * (`YWJjA` decodes to `abc`), so a length that leaves one spare character, or
 * padding that does not complete the last group, is refused.
 */
function decodeBase64(content: string): Buffer {
	const data = content
		.replace(/^data:[^,]*;base64,/, '')
		.replace(/\s+/g, '')
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const unpadded = data.replace(/={1,2}$/, '');
	const padded = data.length !== unpadded.length;
	if (
		!/^[A-Za-z0-9+/]*$/.test(unpadded) ||
		unpadded.length % 4 === 1 ||
		(padded && data.length % 4 !== 0)
	) {
		throw new HiggsfieldError(
			'contentBase64 is not valid base64.',
			'invalid_input',
		);
	}
	const size = Math.floor((unpadded.length * 3) / 4);
	if (size === 0) {
		throw new HiggsfieldError(
			'contentBase64 decodes to an empty file.',
			'invalid_input',
		);
	}
	if (size > MAX_UPLOAD_BYTES) {
		throw new HiggsfieldError(
			`The file is ${size} bytes; files.upload takes up to ${MAX_UPLOAD_BYTES}.`,
			'invalid_input',
		);
	}
	return Buffer.from(unpadded, 'base64');
}

// Addresses a server-side fetch must not reach on a caller's say-so: loopback,
// private networks, link-local (cloud metadata lives there), multicast, reserved.
const PRIVATE_ADDRESSES = new BlockList();
for (const [network, prefix] of [
	['0.0.0.0', 8],
	['10.0.0.0', 8],
	['100.64.0.0', 10],
	['127.0.0.0', 8],
	['169.254.0.0', 16],
	['172.16.0.0', 12],
	['192.0.0.0', 24],
	['192.168.0.0', 16],
	['198.18.0.0', 15],
	['224.0.0.0', 4],
	['240.0.0.0', 4],
] as const) {
	PRIVATE_ADDRESSES.addSubnet(network, prefix, 'ipv4');
}
for (const [network, prefix] of [
	['::', 128],
	['::1', 128],
	['64:ff9b::', 96],
	['fc00::', 7],
	['fe80::', 10],
	['ff00::', 8],
] as const) {
	PRIVATE_ADDRESSES.addSubnet(network, prefix, 'ipv6');
}

const isPrivateAddress = (address: string) =>
	PRIVATE_ADDRESSES.check(address, isIP(address) === 6 ? 'ipv6' : 'ipv4');

const refuseSource = (reason: string) =>
	new HiggsfieldError(`sourceUrl was refused: ${reason}`, 'invalid_input');

/**
 * Checks a URL before fetching it, redirects included. The host is resolved
 * here and again by fetch, so a host that changes its answer between the two
 * could still get through; fetch offers no way to pin the address without a
 * dependency.
 */
async function assertPublicSource(url: URL): Promise<void> {
	if (url.protocol !== 'https:') throw refuseSource('it must be https.');
	if (url.username || url.password) {
		throw refuseSource('it must not carry credentials.');
	}
	const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
	if (host === 'localhost' || host.endsWith('.localhost')) {
		throw refuseSource('it points at this machine.');
	}
	let addresses: string[];
	if (isIP(host)) {
		addresses = [host];
	} else {
		try {
			addresses = (await lookup(host, { all: true })).map(
				(entry) => entry.address,
			);
		} catch {
			throw refuseSource('its host name does not resolve.');
		}
	}
	if (addresses.length === 0 || addresses.some(isPrivateAddress)) {
		throw refuseSource('it points at a private address.');
	}
}

async function readCapped(response: Response): Promise<Buffer> {
	const tooBig = () =>
		refuseSource(`the file is over ${MAX_UPLOAD_BYTES} bytes.`);
	const declared = Number(response.headers.get('content-length') ?? 0);
	if (declared > MAX_UPLOAD_BYTES) {
		await response.body?.cancel().catch(() => undefined);
		throw tooBig();
	}
	const chunks: Uint8Array[] = [];
	let size = 0;
	if (response.body) {
		const reader = response.body.getReader();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > MAX_UPLOAD_BYTES) {
				await reader.cancel().catch(() => undefined);
				throw tooBig();
			}
			chunks.push(value);
		}
	}
	if (size === 0) throw refuseSource('the file is empty.');
	return Buffer.concat(chunks);
}

async function fetchSource(
	sourceUrl: string,
): Promise<{ bytes: Buffer; contentType: string | null }> {
	const signal = AbortSignal.timeout(SOURCE_TIMEOUT_MS);
	let url = new URL(sourceUrl);
	try {
		for (let hop = 0; hop <= MAX_SOURCE_REDIRECTS; hop++) {
			await assertPublicSource(url);
			const response = await fetch(url, { redirect: 'manual', signal });
			if (response.status >= 300 && response.status < 400) {
				await response.body?.cancel().catch(() => undefined);
				const location = response.headers.get('location');
				if (!location) throw refuseSource('it redirects nowhere.');
				url = new URL(location, url);
				continue;
			}
			if (!response.ok) {
				await response.body?.cancel().catch(() => undefined);
				throw refuseSource(`it answered HTTP ${response.status}.`);
			}
			return {
				bytes: await readCapped(response),
				contentType: response.headers.get('content-type'),
			};
		}
	} catch (error) {
		if (error instanceof HiggsfieldError) throw error;
		throw refuseSource(
			error instanceof Error && error.name === 'TimeoutError'
				? 'it did not finish in time.'
				: 'it could not be read.',
		);
	}
	throw refuseSource('it redirects too many times.');
}

const isAllowedType = (
	value: string,
): value is (typeof UPLOAD_CONTENT_TYPES)[number] =>
	(UPLOAD_CONTENT_TYPES as readonly string[]).includes(value);

async function createUploadUrlFor(
	apiKey: string,
	contentType: string,
): Promise<FilesCreateUploadUrlResponse> {
	return HiggsfieldEndpointOutputSchemas.filesCreateUploadUrl.parse(
		await makeHiggsfieldRequest(apiKey, '/files/generate-upload-url', {
			method: 'POST',
			body: { content_type: contentType },
		}),
	);
}

export const createUploadUrl: HiggsfieldEndpoints['filesCreateUploadUrl'] =
	async (ctx, rawInput) => {
		const input =
			HiggsfieldEndpointInputSchemas.filesCreateUploadUrl.parse(rawInput);
		const response = await createUploadUrlFor(ctx.key, input.contentType);
		await logEventFromContext(
			ctx,
			'higgsfield.files.createUploadUrl',
			{ contentType: input.contentType },
			'completed',
		);
		return response;
	};

export const upload: HiggsfieldEndpoints['filesUpload'] = async (
	ctx,
	rawInput,
) => {
	const input = HiggsfieldEndpointInputSchemas.filesUpload.parse(rawInput);

	let bytes: Buffer;
	let contentType: string | null | undefined = input.contentType;
	if (input.contentBase64) {
		bytes = decodeBase64(input.contentBase64);
	} else {
		// The schema has already required one of the two.
		const source = await fetchSource(input.sourceUrl ?? '');
		bytes = source.bytes;
		contentType ??= source.contentType?.split(';')[0]?.trim().toLowerCase();
	}
	if (!contentType || !isAllowedType(contentType)) {
		throw new HiggsfieldError(
			`Higgsfield does not take ${contentType ?? 'that file type'}. Allowed: ${UPLOAD_CONTENT_TYPES.join(', ')}. Pass contentType if the source reports it wrongly.`,
			'invalid_input',
		);
	}

	const created = await createUploadUrlFor(ctx.key, contentType);
	await putToPresignedUrl(created.upload_url, bytes, {
		'Content-Type': contentType,
		...created.upload_headers,
	});

	const response = HiggsfieldEndpointOutputSchemas.filesUpload.parse({
		public_url: created.public_url,
		content_type: contentType,
		size: bytes.byteLength,
	});
	await logEventFromContext(
		ctx,
		'higgsfield.files.upload',
		{ contentType, size: bytes.byteLength },
		'completed',
	);
	return response;
};

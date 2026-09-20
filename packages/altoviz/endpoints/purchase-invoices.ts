import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import type { AltovizEndpointOutputs } from './types';

const MAX_PURCHASE_INVOICE_BYTES = 10 * 1024 * 1024;

function decodeFileBase64(raw: string): Buffer {
	const compact = raw.replace(/\s/g, '');
	const pad = (4 - (compact.length % 4)) % 4;
	const normalized = compact + '='.repeat(pad);
	const bytes = Buffer.from(normalized, 'base64');
	if (bytes.toString('base64') !== normalized) {
		throw new Error('fileBase64 is not valid Base64');
	}
	if (bytes.length > MAX_PURCHASE_INVOICE_BYTES) {
		throw new Error(
			`Purchase invoice exceeds ${MAX_PURCHASE_INVOICE_BYTES} bytes`,
		);
	}
	return bytes;
}

/**
 * The only multipart operation in the surface, and the only create with NO
 * delete anywhere in the API - not in the catalog and not in the OpenAPI
 * document. An uploaded document can only be removed in the Altoviz UI.
 * `fileBase64` is decoded to a `File` here because JSON-RPC-style plugin
 * inputs cannot carry a raw binary value; the shared transport's `formData`
 * option accepts string or Blob field values and builds the actual
 * `multipart/form-data` body. `File` (not `Blob`) keeps `fileName` on
 * Content-Disposition.
 */
export const upload: AltovizEndpoints['purchaseInvoices']['upload'] = async (
	ctx,
	input,
) => {
	const bytes = decodeFileBase64(input.fileBase64);
	const file = new File([bytes], input.fileName, { type: input.mimeType });

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['purchaseInvoicesUpload']
	>('v1/purchaseinvoices/file', ctx.key, {
		method: 'POST',
		formData: { file },
	});

	await logEventFromContext(
		ctx,
		'altoviz.purchaseInvoices.upload',
		auditPayload({}, { fileSizeBytes: bytes.length }),
		'completed',
	);
	return result;
};

/**
 * Returns `application/pdf` despite the spec declaring `application/json` on
 * this route's 200 - confirmed live, and it round-tripped an uploaded file
 * exactly. Same core text-decoding limitation as the sale document downloads.
 */
export const download: AltovizEndpoints['purchaseInvoices']['download'] =
	async (ctx, input) => {
		const body = await makeAltovizRequest<string>(
			'v1/purchaseinvoices/download/{id}',
			ctx.key,
			{ path: { id: input.purchaseInvoiceId } },
		);

		await logEventFromContext(
			ctx,
			'altoviz.purchaseInvoices.download',
			auditPayload(input),
			'completed',
		);
		return { contentType: 'application/pdf', body };
	};

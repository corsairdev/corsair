import { fetchErpnextBinary } from '../client';
import type { ErpnextHandlerContext } from './factory';
import { resolveErpnextBaseUrl } from './factory';
import type { ErpnextEndpointInputs, ErpnextEndpointOutputs } from './registry';

/**
 * The `files` family downloads raw bytes: PDF renders and stored files answer
 * with a binary body instead of the JSON envelope frappe/handler.py builds
 * for method calls, so the shared factory's defineEndpoint (JSON transport
 * plus output-envelope schemas) does not apply. The handlers are typed
 * directly against the registry maps and fetch through fetchErpnextBinary,
 * which returns the payload base64-encoded. The site origin resolves per
 * calling tenant exactly as the JSON endpoints resolve it.
 */
export type ErpnextFilesHandlerContext = ErpnextHandlerContext;

// GET /api/method/frappe.utils.print_format.download_pdf — Frappe renders the
// document print format server-side and answers the PDF bytes (print_format.py:
// frappe.local.response.type = "pdf"). Optional query keys are appended only
// when set so the wire request carries exactly the caller's input.
export const downloadPdf = async (
	ctx: ErpnextFilesHandlerContext,
	input: ErpnextEndpointInputs['files.downloadPdf'],
): Promise<ErpnextEndpointOutputs['files.downloadPdf']> => {
	const baseUrl = await resolveErpnextBaseUrl(ctx);
	const query = new URLSearchParams({
		doctype: input.doctype,
		name: input.name,
	});
	if (input.format !== undefined) query.set('format', input.format);
	if (input.no_letterhead !== undefined) {
		// Frappe converts the string to int with cint() (printview.py), where
		// "true"/"false" both convert to 0; the provider-usable wire form is
		// 1/0 so the caller's boolean is honoured in both directions.
		query.set('no_letterhead', input.no_letterhead ? '1' : '0');
	}
	if (input.letterhead !== undefined) query.set('letterhead', input.letterhead);
	const base64 = await fetchErpnextBinary(
		`/api/method/frappe.utils.print_format.download_pdf?${query.toString()}`,
		baseUrl,
		ctx.key,
	);
	return { base64 };
};

// GET /api/method/download_file — download_file is whitelisted at the top
// level of frappe/handler.py, so the shorthand path resolves it (its docstring
// also names the full dotted frappe.core.doctype.file.file.download_file).
// The single required query key is file_url; the bytes of the stored file come
// back as a download body.
export const downloadFile = async (
	ctx: ErpnextFilesHandlerContext,
	input: ErpnextEndpointInputs['files.downloadFile'],
): Promise<ErpnextEndpointOutputs['files.downloadFile']> => {
	const baseUrl = await resolveErpnextBaseUrl(ctx);
	const query = new URLSearchParams({ file_url: input.file_url });
	const base64 = await fetchErpnextBinary(
		`/api/method/download_file?${query.toString()}`,
		baseUrl,
		ctx.key,
	);
	return { base64 };
};

export const endpoints = {
	downloadPdf,
	downloadFile,
} as const;

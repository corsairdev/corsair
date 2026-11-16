import { z } from 'zod';

// ── Schemas for the `files` family ────────────────────────────────────────────
// Wire mappings verified against the frappe@develop sources:
// frappe/utils/print_format.py (whitelisted download_pdf — the /api/method
// path is the dotted module plus the function name, so it is
// frappe.utils.print_format.download_pdf; there is no `download` submodule)
// and frappe/handler.py (whitelisted top-level download_file, addressed by the
// shorthand /api/method/download_file path). Both handlers answer raw bytes,
// not the JSON envelope frappe/handler.py builds for method calls
// (download_pdf sets frappe.local.response.type = "pdf" and download_file
// type = "download"), so they go through fetchErpnextBinary and the plugin
// returns the payload base64-encoded. Input objects are .strict() so typos
// fail at the boundary, and query names stay provider-verbatim (file_url,
// no_letterhead), exactly as the Python signatures declare them.

// GET /api/method/frappe.utils.print_format.download_pdf — the develop
// signature is download_pdf(doctype, name, format=None, doc=None,
// no_letterhead=0, language=None, letterhead=None, ...) (print_format.py);
// the doc, language, pdf_generator, style, and settings parameters stay out
// rather than being invented. no_letterhead is sent on the wire as 1/0: the
// handler serializes the boolean through cint() semantics (printview.py),
// where "true"/"false" strings would both convert to 0.
const FilesDownloadPdfInputSchema = z
	.object({
		doctype: z.string().min(1),
		name: z.string().min(1),
		format: z.string().optional(),
		no_letterhead: z.boolean().optional(),
		letterhead: z.string().optional(),
	})
	.strict();

// GET /api/method/download_file — the whitelisted handler takes a single
// file_url parameter (frappe/handler.py: download_file(file_url)), the path
// to the stored file relative to the site.
const FilesDownloadFileInputSchema = z
	.object({
		file_url: z.string().min(1),
	})
	.strict();

// Both downloads return the binary payload base64-encoded, so the output is
// exactly one base64 string; the shape is closed because the plugin itself
// produces it, not the provider. Zero-byte files are a legitimate success
// (an empty stored file downloads as an empty string), so the empty string
// is accepted.
const FilesBinaryOutputSchema = z
	.object({
		base64: z.string(),
	})
	.strict();

// ── Registry ──────────────────────────────────────────────────────────────────

export const FilesInputSchemas = {
	'files.downloadPdf': FilesDownloadPdfInputSchema,
	'files.downloadFile': FilesDownloadFileInputSchema,
} as const;

export const FilesOutputSchemas = {
	'files.downloadPdf': FilesBinaryOutputSchema,
	'files.downloadFile': FilesBinaryOutputSchema,
} as const;

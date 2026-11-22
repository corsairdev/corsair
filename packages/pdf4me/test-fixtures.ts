/**
 * Response fixtures shaped after the examples in the PDF4me API docs
 * (docs.pdf4me.com/pdf4me-api).
 */

export const mergedPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF

/** GetPdfMetadata's answer (live, 2026-11-21, a generated 3-page PDF). */
export const pdfInfo = {
	title: 'corsair-plugin-test',
	subject: null,
	pageCount: 12,
	author: 'Jane Roe',
	creator: null,
	producer: null,
	creationDate: '0001-01-01T00:00:00+00:00',
	modDate: '0001-01-01T00:00:00+00:00',
	size: 1267,
	isEncrypted: false,
	isLinearized: false,
	pdfCompliance: null,
	isSigned: false,
	documentId: '00000000-0000-0000-0000-000000000000',
	pdfVersion: '1.4',
	keywords: null,
	pageHeightInMM: 279,
	pageWidthInMM: 216,
	orientation: 'Potrait',
};

/** The 202 answer to isAsync, PDF-to-Word and OCR (live). */
export const jobAccepted = {
	jobId: 'fa72af5e-02ee-4c58-b069-94587e740758',
	status: 'Accepted',
	statusUrl:
		'https://api.pdf4me.com/api/v2/GetActionStatus?id=fa72af5e-02ee-4c58-b069-94587e740758',
	message:
		'Your request has been accepted for asynchronous processing. Use (StatusUrl or Get Action Status with the Job Id provided) to check the status.',
};

/** A running job's status, as the docs describe it (a live job finished before the first poll). */
export const jobPending = {
	jobId: 'job-1',
	status: 'Running',
};

/** SplitPDF's answer (live, content trimmed). */
export const splitAnswer = {
	documents: null,
	splitedDocuments: [
		{ fileName: 'three 1.pdf', streamFile: 'JVBERi0xLjc=' },
		{ fileName: 'three 2-3.pdf', streamFile: 'JVBERi0xLjc=' },
	],
	traceId: '7d3c2c55-0000-0000-0000-000000000000',
	jobId: '7d3c2c55-0000-0000-0000-000000000000',
	statusUrl: null,
	subscriptionUsage: null,
};

/** ExtractTableFromPdf's answer (live shape; rows made up). */
export const tableResult = {
	tableList: [
		{
			pageNumber: 1,
			table: [
				['a', 'b'],
				['1', '2'],
			],
		},
	],
	traceId: null,
	jobId: '7d3c2c55-0000-0000-0000-000000000000',
	statusUrl: null,
	subscriptionUsage: null,
};

/** ExtractPdfFormData's answer (live shape; the field made up). */
export const formFields = {
	formData: { email: 'jane@example.com' },
	ipAddress: null,
	jobId: null,
	jobIdExt: null,
	integrations: null,
	isAsync: false,
	CustomisationNote: null,
};

export const fileAnswer = {
	'File Content': 'JVBERi0=',
	'File Name': 'output.pdf',
};

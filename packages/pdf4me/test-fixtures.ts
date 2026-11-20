/**
 * Response fixtures shaped after the examples in the PDF4me API docs
 * (docs.pdf4me.com/pdf4me-api).
 */

export const mergedPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF

export const pdfInfo = {
	pageCount: 12,
	width: 612,
	height: 792,
	author: 'Jane Roe',
	creator: 'Word',
	production: false,
};

export const jobPending = {
	jobId: 'job-1',
	isSuccess: null,
	isWorking: true,
	isFinished: false,
	hasFailed: false,
	jobStatusText: 'Working',
	blobId: null,
};

export const jobDone = {
	jobId: 'job-1',
	isSuccess: true,
	isWorking: false,
	isFinished: true,
	hasFailed: false,
	jobStatusText: 'Completed',
	blobId: 'pdf4meblobid://abc',
};

export const jobFailed = {
	jobId: 'job-1',
	isSuccess: false,
	isWorking: false,
	isFinished: true,
	hasFailed: true,
	jobStatusText: 'Failed',
	blobId: null,
};

export const tableResult = {
	tables: [
		{
			rows: [
				['a', 'b'],
				['1', '2'],
			],
		},
	],
};

export const formFields = {
	fields: [{ name: 'email', value: 'jane@example.com' }],
};

export const fileAnswer = {
	'File Content': 'JVBERi0=',
	'File Name': 'output.pdf',
};

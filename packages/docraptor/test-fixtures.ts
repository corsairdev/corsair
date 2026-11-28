import type { DocStatus, IpsListResponse } from './endpoints/types';

// Shapes the API actually sent, from /tmp/corsair-work/docraptor/probes and
// the documentation examples at https://docraptor.com/documentation/api.

export const STATUS_ID = '7d8551b2-6c2d-448f-94e7-51f65a58dd3b';

// Probe 16: POST /async_docs with the documented test key.
export const asyncCreated = { status_id: STATUS_ID };

// Probe 17: GET /status/{id} after the async document completed. message and
// validation_errors are absent, as the research predicted.
export const completedStatus: DocStatus = {
	status: 'completed',
	download_id: STATUS_ID,
	download_url: `https://api.docraptor.com/download/${STATUS_ID}`,
	number_of_pages: 1,
};

// The docs' failed example: validation_errors carries the reasons.
export const failedStatus = {
	status: 'failed',
	validation_errors:
		"Name can't be blank\nName is too long (maximum is 200 characters)",
};

// queued and working are the documented in-progress values; the docs'
// completed example carries a message, the live probe did not.
export const workingStatus = { status: 'working' };
export const completedStatusWithMessage = {
	status: 'completed',
	download_url: 'https://docraptor.com/download/12345asdf',
	message: 'Completed at Mon Jun 06 18:33:17 +0000 2011',
	number_of_pages: 2,
};

// The docs' synchronous hosted example; the unbranded.example.com domain
// stands in for the host DocRaptor serves hosted downloads from.
export const hostedDoc = {
	download_id: '123-456-abc',
	download_url: 'https://unbranded.example.com/download/123-456-abc',
	number_of_pages: 1,
};

// Probe 12 returned bare IP strings; row fields for the document listing are
// unverified (a test-mode key is denied the listing), so a listing row here
// stands in for whatever shape a real account gets.
export const ips = [
	'18.208.30.169',
	'3.229.181.99',
] satisfies IpsListResponse['ips'];
export const documentListRow = { id: 1, name: 'probe' };

// Probe 11: the XML error envelope, also used on JSON requests.
export const xmlError =
	'<?xml version="1.0" encoding="UTF-8"?>\n<errors>\n  <error>Please provide a valid API key.</error>\n</errors>';

// The status-codes page's throttle wording for the 403 concurrency limit.
export const throttleError =
	'You are making too many simultaneous document generation requests';

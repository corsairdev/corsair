import { FILE_OUTPUT_MAX_BYTES, setFileSink } from 'corsair/http';
import { makeSalesforceRequest } from './client';
import { getFileContent } from './endpoints/files';
import { SalesforceEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	SALESFORCE_API_VERSION: '60.0',
	SALESFORCE_LOGIN_HOST: 'https://login.salesforce.com',
	discoverSalesforceInstanceUrl: jest.fn(
		async () => 'https://example.my.salesforce.com',
	),
	makeSalesforceRequest: jest.fn(),
}));

const PDF = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0xff, 0xfe, 0x00]);
const request = makeSalesforceRequest as jest.Mock;

/** VersionData answers with `bytes`; the version record with `meta`, or fails when it is null. */
function serve(bytes: Buffer, meta: Record<string, string> | null) {
	request.mockImplementation(async (endpoint: string) => {
		if (endpoint.endsWith('/VersionData')) return bytes;
		if (meta === null) throw new Error('INSUFFICIENT_ACCESS');
		return meta;
	});
}

const ctx = {
	key: 'test_token',
	authType: 'api_key' as const,
	options: {
		key: 'test_token',
		instanceUrl: 'https://example.my.salesforce.com',
	},
	$getAccountId: () => 'acc_test',
} as unknown as Parameters<typeof getFileContent>[0];

afterEach(() => {
	request.mockReset();
	setFileSink(() => undefined);
});

describe('salesforce files.getFileContent', () => {
	it('keeps content and adds the type and size, named by the version', async () => {
		serve(PDF, { Title: 'Q3 report', FileExtension: 'pdf', PathOnClient: '' });
		const out = await getFileContent(ctx, { fileId: '068xx' });
		expect(out).toEqual({
			contentType: 'application/pdf',
			byteLength: PDF.byteLength,
			filename: 'Q3 report.pdf',
			content: PDF.toString('base64'),
		});
		expect(SalesforceEndpointOutputSchemas.getFileContent.parse(out)).toEqual(
			out,
		);
		expect(request.mock.calls.map(([endpoint]) => endpoint)).toEqual(
			expect.arrayContaining([
				'sobjects/ContentVersion/068xx/VersionData',
				'sobjects/ContentVersion/068xx',
			]),
		);
	});

	it('still returns the content when the version record cannot be read', async () => {
		serve(PDF, null);
		const out = await getFileContent(ctx, { fileId: '068xx' });
		expect(out).toEqual({
			contentType: 'application/octet-stream',
			byteLength: PDF.byteLength,
			content: PDF.toString('base64'),
		});
	});

	it('hands a host that keeps files a large file, which comes back as its fileId', async () => {
		const big = Buffer.alloc(FILE_OUTPUT_MAX_BYTES + 1, 7);
		serve(big, { Title: 'Board deck', FileExtension: 'PPTX' });
		setFileSink(() => () => 'held_1');
		const out = await getFileContent(ctx, { fileId: '068xx' });
		expect(out).toEqual({
			contentType:
				'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			byteLength: big.byteLength,
			filename: 'Board deck.pptx',
			fileId: 'held_1',
		});
	});
});

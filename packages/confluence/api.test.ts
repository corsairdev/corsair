import 'dotenv/config';
import { Pages, Spaces } from './endpoints';
import { ConfluenceEndpointOutputSchemas } from './endpoints/types';
import type { ConfluenceContext } from './index';

const API_KEY = process.env.CONFLUENCE_API_KEY!;
const CLOUD_URL = process.env.CONFLUENCE_CLOUD_URL!;

const mockCtx = {
	key: API_KEY,
	$getAccountId: () => Promise.resolve('test-account-id'),
	options: { cloudUrl: CLOUD_URL },
	logEvent: jest.fn(),
} as unknown as ConfluenceContext;

describe('Confluence API Type Tests', () => {
	it('spaces.list returns correct type', async () => {
		const result = await Spaces.list(mockCtx, { limit: 10 });
		ConfluenceEndpointOutputSchemas.spacesList.parse(result);
	});

	it('pages.get returns correct type', async () => {
		const result = await Pages.get(mockCtx, { limit: 10 });
		ConfluenceEndpointOutputSchemas.pagesGet.parse(result);
	});

	it('pages.search returns correct type', async () => {
		const result = await Pages.search(mockCtx, {
			cql: 'type = "page" AND space = "SD"',
			limit: 10,
		});
		ConfluenceEndpointOutputSchemas.pagesSearch.parse(result);
	});
});

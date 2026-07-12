import 'dotenv/config';
import { makeConfluenceRequest } from './client';
import type { PagesListResponse, SpacesListResponse } from './endpoints/types';
import { ConfluenceEndpointOutputSchemas } from './endpoints/types';

const API_KEY = process.env.CONFLUENCE_API_KEY!;
const CLOUD_URL = process.env.CONFLUENCE_CLOUD_URL!;

describe('Confluence API Type Tests', () => {
	it('spaces.list returns correct type', async () => {
		const result = await makeConfluenceRequest<SpacesListResponse>(
			'space',
			API_KEY,
			CLOUD_URL,
			{
				method: 'GET',
				query: { limit: 10 },
			},
		);

		ConfluenceEndpointOutputSchemas.spacesList.parse(result);
	});

	it('pages.list returns correct type', async () => {
		const result = await makeConfluenceRequest<PagesListResponse>(
			'../../api/v2/pages',
			API_KEY,
			CLOUD_URL,
			{
				method: 'GET',
				query: { limit: 10 },
			},
		);

		ConfluenceEndpointOutputSchemas.pagesList.parse(result);
	});
});

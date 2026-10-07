import * as client from '../client';
import type { IntercomContext } from '../index';
import { attachToCompany } from './contacts';

jest.mock('corsair/core', () => ({
	...jest.requireActual<typeof import('corsair/core')>('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

jest.mock('../client', () => ({
	makeIntercomRequest: jest.fn(),
}));

const mockedRequest = client.makeIntercomRequest as jest.MockedFunction<
	typeof client.makeIntercomRequest
>;

// This endpoint only reads the API key and the optional company database service.
const ctx = {
	key: 'test-api-key',
	db: {},
} as IntercomContext;

describe('Intercom contact endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({ id: 'company-1' });
	});

	it("attaches a contact with Intercom's required company id field", async () => {
		await attachToCompany(ctx, {
			contact_id: 'contact-1',
			company_id: 'company-1',
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'contacts/contact-1/companies',
			'test-api-key',
			{
				method: 'POST',
				body: { id: 'company-1' },
			},
		);
	});
});

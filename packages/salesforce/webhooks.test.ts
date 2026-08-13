import { flattenFields } from './endpoints/shared';
import {
	createSalesforceChangeMatch,
	recordIdFromPayload,
} from './webhooks/types';

describe('flattenFields', () => {
	it('spreads CustomFields onto the Salesforce body', () => {
		expect(
			flattenFields({
				Name: 'Acme',
				CustomFields: { Region__c: 'West' },
			}),
		).toEqual({ Name: 'Acme', Region__c: 'West' });
	});
});

describe('Salesforce webhook matchers', () => {
	it('matches Account CREATE CDC payloads', () => {
		const match = createSalesforceChangeMatch({
			entityName: 'Account',
			changeTypes: ['CREATE', 'CREATED'],
		});
		expect(
			match({
				headers: {},
				body: {
					ChangeEventHeader: {
						entityName: 'Account',
						changeType: 'CREATE',
						recordIds: ['001xx000003DGb2AAG'],
					},
				},
			}),
		).toBe(true);
		expect(
			match({
				headers: {},
				body: {
					ChangeEventHeader: {
						entityName: 'Contact',
						changeType: 'CREATE',
					},
				},
			}),
		).toBe(false);
	});

	it('reads the record id from ChangeEventHeader', () => {
		expect(
			recordIdFromPayload({
				ChangeEventHeader: { recordIds: ['001xx'] },
			}),
		).toBe('001xx');
	});
});

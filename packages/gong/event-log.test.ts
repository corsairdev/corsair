import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { addCall, getCall } from './endpoints/calls';
import { registerCrmIntegration } from './endpoints/crm';
import {
	assignProspects,
	listFlows,
	submitFlowProspectsBulkAssignment,
	unassignFlows,
} from './endpoints/engage-flows';
import { gongEventPayload } from './endpoints/family-context';
import {
	addDigitalInteraction,
	askEntity,
	contactsEnrich,
	findAllReferencesToEmailAddress,
	findAllReferencesToPhoneNumber,
	purgeEmailAddress,
	purgePhoneNumber,
} from './endpoints/other';
import {
	addUsersAccessToCalls,
	getPermissionProfile,
} from './endpoints/permissions';
import { updateReminder } from './endpoints/tasks';
import { getUser, listMultipleUsers } from './endpoints/users';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockedRequest = jest.mocked(request);
const mockedLog = jest.mocked(logEventFromContext);
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
	},
	$getAccountId: async () => 'account',
} as never;

const PERSONAL = [
	'jane@example.com',
	'owner@example.com',
	'+14255552671',
	'Jane',
	'Doe',
	'linkedin.com',
	'What did Jane say about pricing?',
	'VP Sales',
	'Acme Corp',
];

function logged(): { type: string; payload: string }[] {
	return mockedLog.mock.calls.map(([, type, payload]) => ({
		type,
		payload: JSON.stringify(payload),
	}));
}

describe('Gong event log', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedLog.mockReset();
		mockedRequest.mockResolvedValue({ requestId: 'r' });
	});

	it('keeps identifiers, request descriptors and list sizes only', () => {
		expect(
			gongEventPayload({
				flowId: 'flow-1',
				flowInstanceOwnerEmail: 'owner@example.com',
				prospects: [{ email: 'jane@example.com' }, { email: 'x@example.com' }],
				filter: {
					fromDateTime: '2025-01-01T00:00:00Z',
					callIds: ['1', '2', '3'],
					note: 'Jane',
					deeper: { userId: '9' },
				},
				mediaFile: new Blob(['audio']),
				question: 'What did Jane say about pricing?',
				'workspace-id': '77',
			}),
		).toEqual({
			flowId: 'flow-1',
			prospectsCount: 2,
			filter: { fromDateTime: '2025-01-01T00:00:00Z', callIdsCount: 3 },
			'workspace-id': '77',
		});
	});

	it('does not write personal data from any request to the event log', async () => {
		await purgeEmailAddress(ctx, { emailAddress: 'jane@example.com' });
		await purgePhoneNumber(ctx, { phoneNumber: '+14255552671' });
		await findAllReferencesToEmailAddress(ctx, {
			emailAddress: 'jane@example.com',
		});
		await findAllReferencesToPhoneNumber(ctx, { phoneNumber: '+14255552671' });
		await contactsEnrich(ctx, {
			dataCategories: ['contactData'],
			contacts: [
				{
					id: 'c1',
					firstName: 'Jane',
					lastName: 'Doe',
					email: 'jane@example.com',
					linkedinUrl: 'https://linkedin.com/in/jane',
				},
			],
		});
		await addDigitalInteraction(ctx, {
			eventId: 'e1',
			timestamp: '2025-01-01T00:00:00Z',
			eventType: 'page viewed',
			content: { contentTitle: 'Acme Corp pricing' },
			person: { name: 'Jane Doe', email: 'jane@example.com' },
		});
		await askEntity(ctx, {
			workspaceId: 1,
			crmEntityType: 'ACCOUNT',
			crmEntityId: 'a1',
			timePeriod: 'LAST_30DAYS',
			question: 'What did Jane say about pricing?',
		});
		await submitFlowProspectsBulkAssignment(ctx, {
			flowInstanceOwnerEmail: 'owner@example.com',
			flowId: 'flow-1',
			prospects: [
				{
					firstName: 'Jane',
					lastName: 'Doe',
					email: 'jane@example.com',
					jobTitle: 'VP Sales',
					companyName: 'Acme Corp',
				},
			],
		});
		await assignProspects(ctx, {
			crmProspectsIds: ['p1', 'p2'],
			flowId: 'flow-1',
			flowInstanceOwnerEmail: 'owner@example.com',
		});
		await unassignFlows(ctx, {
			flowInstanceIds: ['i1'],
			unassignedByUserEmail: 'owner@example.com',
		});
		await listFlows(ctx, { flowOwnerEmail: 'owner@example.com' });
		await addCall(ctx, {
			clientUniqueId: 'call-1',
			actualStart: '2025-01-01T00:00:00Z',
			parties: [
				{
					name: 'Jane Doe',
					emailAddress: 'jane@example.com',
					phoneNumber: '+14255552671',
				},
			],
			direction: 'Outbound',
			primaryUser: '123',
			title: 'Acme Corp renewal',
		});
		await listMultipleUsers(ctx, { filter: { userIds: ['1'] } });
		await registerCrmIntegration(ctx, {
			name: 'Acme Corp',
			ownerEmail: 'owner@example.com',
		});
		await addUsersAccessToCalls(ctx, {
			callAccessList: [{ callId: '1', userIds: ['2'] }],
		});

		const events = logged();
		expect(events).toHaveLength(15);
		for (const event of events)
			for (const value of PERSONAL) expect(event.payload).not.toContain(value);
		expect(events.map((event) => event.payload)).toEqual(
			expect.arrayContaining([
				JSON.stringify({ flowId: 'flow-1', prospectsCount: 1 }),
				JSON.stringify({ crmProspectsIdsCount: 2, flowId: 'flow-1' }),
				JSON.stringify({ clientUniqueId: 'call-1', partiesCount: 1 }),
				JSON.stringify({ callAccessListCount: 1 }),
			]),
		);
	});

	it('names events after the operation, never after a record id', async () => {
		await getCall(ctx, { id: '7782342274025937895' });
		await getUser(ctx, { id: '234599484848423' });
		await updateReminder(ctx, { taskId: '555', userId: '234599484848423' });
		await getPermissionProfile(ctx, { profileId: '3843152912968920037' });

		expect(logged().map((event) => event.type)).toEqual([
			'gong.calls.getCall',
			'gong.users.getUser',
			'gong.tasks.updateReminder',
			'gong.permissions.getPermissionProfile',
		]);
	});
});

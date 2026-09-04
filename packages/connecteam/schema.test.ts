import {
	ConnecteamEndpointInputSchemas,
	ConnecteamEndpointOutputSchemas,
} from './endpoints/types';
import { ConnecteamSchema } from './schema';
import {
	ConnecteamConversationEntity,
	ConnecteamPolicyTypeEntity,
	ConnecteamTaskBoardEntity,
	ConnecteamUserEntity,
} from './schema/database';

describe('Connecteam schema', () => {
	it('declares a semver version', () => {
		expect(ConnecteamSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official reference entities', () => {
		expect(Object.keys(ConnecteamSchema.entities)).toEqual(
			expect.arrayContaining([
				'users',
				'customFields',
				'customFieldCategories',
				'smartGroups',
				'forms',
				'jobs',
				'schedulers',
				'taskBoards',
				'publishers',
				'conversations',
				'policyTypes',
				'performanceIndicators',
				'account',
			]),
		);
	});
});

describe('User entity (official OpenAPI User)', () => {
	it('accepts the documented required keys', () => {
		const result = ConnecteamUserEntity.safeParse({
			userId: 8015532,
			firstName: 'Omer',
			lastName: 'Vered',
			phoneNumber: '+1(212) 4567890',
			userType: 'user',
		});
		expect(result.success).toBe(true);
	});

	it('declares every key from the official User object', () => {
		const keys = Object.keys(ConnecteamUserEntity.shape);
		for (const key of [
			'userId',
			'firstName',
			'lastName',
			'phoneNumber',
			'userType',
			'email',
			'customFields',
			'isArchived',
			'kioskCode',
			'createdAt',
			'modifiedAt',
			'archivedAt',
			'lastLogin',
			'smartGroupsIds',
			'invitedToBeManager',
			'profilePictureUrl',
			'mobileDevice',
			'osVersion',
			'appVersion',
			'mobileDeviceId',
		]) {
			expect(keys).toContain(key);
		}
	});
});

describe('Endpoint input schemas', () => {
	it('getUsers rejects limit out of official 1–500 range', () => {
		expect(
			ConnecteamEndpointInputSchemas.getUsers.safeParse({ limit: 0 }).success,
		).toBe(false);
		expect(
			ConnecteamEndpointInputSchemas.getUsers.safeParse({ limit: 501 }).success,
		).toBe(false);
		expect(
			ConnecteamEndpointInputSchemas.getUsers.safeParse({ limit: 10 }).success,
		).toBe(true);
	});

	it('createUsers requires phoneNumber', () => {
		expect(
			ConnecteamEndpointInputSchemas.createUsers.safeParse({
				users: [{ firstName: 'Ada' }],
			}).success,
		).toBe(false);
		expect(
			ConnecteamEndpointInputSchemas.createUsers.safeParse({
				users: [{ firstName: 'Ada', phoneNumber: '+15550001' }],
			}).success,
		).toBe(true);
	});

	it('createUsers rejects manager, owner, and admin userType', () => {
		const base = { firstName: 'Ada', phoneNumber: '+15550001' };
		expect(
			ConnecteamEndpointInputSchemas.createUsers.safeParse({
				users: [{ ...base, userType: 'user' }],
			}).success,
		).toBe(true);
		for (const userType of ['manager', 'owner', 'admin']) {
			expect(
				ConnecteamEndpointInputSchemas.createUsers.safeParse({
					users: [{ ...base, userType }],
				}).success,
			).toBe(false);
		}
	});

	it('getChat limit max is 100 and has no type filter', () => {
		expect(
			ConnecteamEndpointInputSchemas.getChat.safeParse({ limit: 100 }).success,
		).toBe(true);
		expect(
			ConnecteamEndpointInputSchemas.getChat.safeParse({ limit: 101 }).success,
		).toBe(false);
		expect('type' in ConnecteamEndpointInputSchemas.getChat.shape).toBe(false);
	});

	it('getForms limit max is 300 and dates must be YYYY-MM-DD', () => {
		expect(
			ConnecteamEndpointInputSchemas.getForms.safeParse({ limit: 300 }).success,
		).toBe(true);
		expect(
			ConnecteamEndpointInputSchemas.getForms.safeParse({ limit: 301 }).success,
		).toBe(false);
		expect(
			ConnecteamEndpointInputSchemas.getForms.safeParse({
				startDate: '2026-01-01',
				endDate: '2026-01-31',
			}).success,
		).toBe(true);
		expect(
			ConnecteamEndpointInputSchemas.getForms.safeParse({
				startDate: '01/01/2026',
			}).success,
		).toBe(false);
	});

	it('archiveUsers requires at least one userId and has no delete flag', () => {
		expect(
			ConnecteamEndpointInputSchemas.archiveUsers.safeParse({ userIds: [] })
				.success,
		).toBe(false);
		expect(
			ConnecteamEndpointInputSchemas.archiveUsers.safeParse({ userIds: [1] })
				.success,
		).toBe(true);
		expect(
			'deletionType' in ConnecteamEndpointInputSchemas.archiveUsers.shape,
		).toBe(false);
	});

	it('generateUploadUrl requires fileName and official featureType', () => {
		expect(
			ConnecteamEndpointInputSchemas.generateUploadUrl.safeParse({
				fileName: 'a.pdf',
			}).success,
		).toBe(false);
		expect(
			ConnecteamEndpointInputSchemas.generateUploadUrl.safeParse({
				fileName: 'a.pdf',
				featureType: 'chat',
			}).success,
		).toBe(true);
	});
});

describe('Endpoint output schemas', () => {
	it('getUsers parses official UsersResponse envelope', () => {
		const result = ConnecteamEndpointOutputSchemas.getUsers.safeParse({
			requestId: 'fb34fb64-9c445-48ba-9be0-97e7d453f534',
			data: {
				users: [
					{
						userId: 1,
						firstName: 'Omer',
						lastName: 'Vered',
						phoneNumber: '+1',
						userType: 'user',
					},
				],
			},
			paging: { offset: 1 },
		});
		expect(result.success).toBe(true);
	});

	it('listMe parses official MeResponse', () => {
		const result = ConnecteamEndpointOutputSchemas.listMe.safeParse({
			requestId: 'r1',
			data: { companyName: 'Acme', companyId: '123' },
		});
		expect(result.success).toBe(true);
	});

	it('getForms parses official form list fields', () => {
		const result = ConnecteamEndpointOutputSchemas.getForms.safeParse({
			data: {
				forms: [
					{
						formId: 1,
						formName: 'Safety',
						createdAt: 1,
						lastUpdatedAt: 2,
					},
				],
			},
		});
		expect(result.success).toBe(true);
	});

	it('parses a task board with isArchived', () => {
		const result = ConnecteamTaskBoardEntity.safeParse({
			id: 10,
			name: 'Ops',
			isArchived: false,
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.isArchived).toBe(false);
		}
	});

	it('parses a conversation title', () => {
		const result = ConnecteamConversationEntity.safeParse({
			id: 1,
			type: 'team',
			title: 'Shift chat',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.title).toBe('Shift chat');
		}
	});

	it('parses nested time-off policies', () => {
		const result = ConnecteamPolicyTypeEntity.safeParse({
			id: 'pto',
			name: 'Time off',
			policies: [
				{ id: '1', name: 'Vacation', unit: 'days', accrualType: 'yearly' },
			],
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.policies?.[0]?.accrualType).toBe('yearly');
		}
	});
});

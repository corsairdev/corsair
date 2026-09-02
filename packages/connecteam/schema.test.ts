import {
	ConnecteamEndpointInputSchemas,
	ConnecteamEndpointOutputSchemas,
} from './endpoints/types';
import { ConnecteamSchema } from './schema';
import { ConnecteamUserEntity } from './schema/database';

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
});

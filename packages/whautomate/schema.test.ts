import type {
	WhautomateEndpointInputs,
	WhautomateEndpointOutputs,
} from './endpoints/types';
import {
	WhautomateEndpointInputSchemas,
	WhautomateEndpointOutputSchemas,
} from './endpoints/types';
import { WhautomateSchema } from './schema';

describe('Whautomate schema', () => {
	it('declares a semver version', () => {
		expect(WhautomateSchema.version).toBeDefined();
		expect(WhautomateSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WhautomateSchema.entities).toBe('object');
		expect(WhautomateSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WhautomateSchema.entities))).toBe(true);
		for (const entity of Object.values(WhautomateSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Whautomate endpoint schemas', () => {
	const endpoints = [
		'addContact',
		'deleteSegment',
		'deleteServiceCategory',
		'getAccountInfo',
		'getAllWebhooks',
		'getBroadcastById',
		'getBroadcasts',
		'getContacts',
		'getMessagesOfContact',
		'getSegments',
		'getServiceById',
		'getServiceCategories',
		'getServices',
		'getStaffAvailabilityBlocks',
		'getStaffById',
		'getStaffs',
		'updateService',
	] as const;

	// Trigger CI re-run

	describe('input schemas', () => {
		for (const endpoint of endpoints) {
			it(`has input schema for ${endpoint}`, () => {
				const schema = WhautomateEndpointInputSchemas[endpoint];
				expect(schema).toBeDefined();
				expect(typeof schema.parse).toBe('function');
			});
		}

		it('addContact accepts valid input', () => {
			const input = {
				name: 'John Doe',
				phone: '+1234567890',
				email: 'john@example.com',
				avatar: 'https://example.com/avatar.png',
				segmentId: 'seg_123',
				customFields: { source: 'web' },
			};
			const result = WhautomateEndpointInputSchemas.addContact.parse(input);
			expect(result.name).toBe('John Doe');
			expect(result.phone).toBe('+1234567890');
		});

		it('addContact requires name', () => {
			expect(() =>
				WhautomateEndpointInputSchemas.addContact.parse({
					phone: '+1234567890',
				}),
			).toThrow();
		});

		it('getContacts accepts pagination params', () => {
			const input = {
				page: 1,
				limit: 20,
				search: 'John',
				segmentId: 'seg_123',
			};
			const result = WhautomateEndpointInputSchemas.getContacts.parse(input);
			expect(result.page).toBe(1);
			expect(result.limit).toBe(20);
			expect(result.search).toBe('John');
		});

		it('getMessagesOfContact requires contactId', () => {
			expect(() =>
				WhautomateEndpointInputSchemas.getMessagesOfContact.parse({ page: 1 }),
			).toThrow();
		});

		it('deleteSegment requires id', () => {
			expect(() =>
				WhautomateEndpointInputSchemas.deleteSegment.parse({}),
			).toThrow();
		});

		it('getBroadcasts accepts status filter', () => {
			const input = { status: 'sent', page: 1, limit: 10 };
			const result = WhautomateEndpointInputSchemas.getBroadcasts.parse(input);
			expect(result.status).toBe('sent');
		});

		it('getServices accepts filters', () => {
			const input = {
				categoryId: 'cat_123',
				isActive: true,
				search: 'haircut',
			};
			const result = WhautomateEndpointInputSchemas.getServices.parse(input);
			expect(result.categoryId).toBe('cat_123');
			expect(result.isActive).toBe(true);
		});

		it('updateService requires id', () => {
			expect(() =>
				WhautomateEndpointInputSchemas.updateService.parse({}),
			).toThrow();
		});

		it('getStaffAvailabilityBlocks requires staffId', () => {
			expect(() =>
				WhautomateEndpointInputSchemas.getStaffAvailabilityBlocks.parse({
					startDate: '2024-01-01',
				}),
			).toThrow();
		});
	});

	describe('output schemas', () => {
		for (const endpoint of endpoints) {
			it(`has output schema for ${endpoint}`, () => {
				const schema = WhautomateEndpointOutputSchemas[endpoint];
				expect(schema).toBeDefined();
				expect(typeof schema.parse).toBe('function');
			});
		}

		it('getContacts output parses array with pagination', () => {
			const output = {
				data: [
					{
						id: 'contact_1',
						name: 'John Doe',
						phone: '+1234567890',
						email: 'john@example.com',
						avatar: null,
						segmentId: 'seg_1',
						customFields: null,
						createdAt: '2024-01-01T00:00:00Z',
						updatedAt: '2024-01-01T00:00:00Z',
					},
				],
				pagination: {
					page: 1,
					limit: 20,
					total: 1,
					totalPages: 1,
				},
			};
			const result = WhautomateEndpointOutputSchemas.getContacts.parse(output);
			expect(result.data).toHaveLength(1);
			expect(result.data[0]!.name).toBe('John Doe');
			expect(result.pagination?.total).toBe(1);
		});

		it('getAccountInfo output parses bare object', () => {
			const output = {
				name: 'My Business',
				ownerEmail: 'owner@example.com',
				apiHost: 'https://api.whautomate.com/account/123',
			};
			const result =
				WhautomateEndpointOutputSchemas.getAccountInfo.parse(output);
			expect(result.name).toBe('My Business');
			expect(result.ownerEmail).toBe('owner@example.com');
		});

		it('getAllWebhooks output parses bare array', () => {
			const output = [
				{
					id: 'webhook_1',
					url: 'https://example.com/webhook',
					events: ['message.received'],
					isActive: true,
					createdAt: '2024-01-01T00:00:00Z',
				},
			];
			const result =
				WhautomateEndpointOutputSchemas.getAllWebhooks.parse(output);
			expect(result).toHaveLength(1);
			expect(result[0]!.url).toBe('https://example.com/webhook');
		});

		it('getBroadcastById output parses bare object', () => {
			const output = {
				id: 'broadcast_1',
				name: 'Welcome Campaign',
				status: 'sent',
				segmentId: 'seg_1',
				messageTemplate: 'Hello {{name}}!',
				scheduledAt: '2024-01-01T10:00:00Z',
				sentAt: '2024-01-01T10:00:00Z',
				stats: { total: 100, sent: 95, delivered: 90, read: 50, failed: 5 },
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T10:00:00Z',
			};
			const result =
				WhautomateEndpointOutputSchemas.getBroadcastById.parse(output);
			expect(result.id).toBe('broadcast_1');
			expect(result.stats?.sent).toBe(95);
		});

		it('getSegments output parses array with pagination', () => {
			const output = {
				data: [
					{
						id: 'seg_1',
						name: 'VIP Customers',
						contactCount: 50,
						createdAt: '2024-01-01T00:00:00Z',
						updatedAt: '2024-01-01T00:00:00Z',
					},
				],
				pagination: {
					page: 1,
					limit: 20,
					total: 1,
					totalPages: 1,
				},
			};
			const result = WhautomateEndpointOutputSchemas.getSegments.parse(output);
			expect(result.data).toHaveLength(1);
			expect(result.data[0]!.name).toBe('VIP Customers');
		});

		it('getServiceCategories output parses array with pagination', () => {
			const output = {
				data: [
					{
						id: 'cat_1',
						name: 'Hair Services',
						description: 'Haircuts and styling',
						createdAt: '2024-01-01T00:00:00Z',
						updatedAt: '2024-01-01T00:00:00Z',
					},
				],
				pagination: {
					page: 1,
					limit: 20,
					total: 1,
					totalPages: 1,
				},
			};
			const result =
				WhautomateEndpointOutputSchemas.getServiceCategories.parse(output);
			expect(result.data).toHaveLength(1);
			expect(result.data[0]!.name).toBe('Hair Services');
		});

		it('getServices output parses array with pagination', () => {
			const output = {
				data: [
					{
						id: 'svc_1',
						name: 'Haircut',
						description: 'Basic haircut',
						price: 25,
						duration: 30,
						categoryId: 'cat_1',
						isActive: true,
						createdAt: '2024-01-01T00:00:00Z',
						updatedAt: '2024-01-01T00:00:00Z',
					},
				],
				pagination: {
					page: 1,
					limit: 20,
					total: 1,
					totalPages: 1,
				},
			};
			const result = WhautomateEndpointOutputSchemas.getServices.parse(output);
			expect(result.data).toHaveLength(1);
			expect(result.data[0]!.price).toBe(25);
		});

		it('getStaffAvailabilityBlocks output parses bare array', () => {
			const output = [
				{
					id: 'block_1',
					staffId: 'staff_1',
					startTime: '2024-01-01T09:00:00Z',
					endTime: '2024-01-01T10:00:00Z',
					reason: 'Break',
					recurring: true,
					createdAt: '2024-01-01T00:00:00Z',
					updatedAt: '2024-01-01T00:00:00Z',
				},
			];
			const result =
				WhautomateEndpointOutputSchemas.getStaffAvailabilityBlocks.parse(
					output,
				);
			expect(result).toHaveLength(1);
			expect(result[0]!.staffId).toBe('staff_1');
		});

		it('addContact output parses bare object', () => {
			const output = {
				id: 'contact_new',
				name: 'Jane Doe',
				phone: '+1987654321',
				email: 'jane@example.com',
				avatar: 'https://example.com/jane.png',
				segmentId: 'seg_1',
				customFields: { source: 'api' },
				createdAt: '2024-01-01T12:00:00Z',
				updatedAt: '2024-01-01T12:00:00Z',
			};
			const result = WhautomateEndpointOutputSchemas.addContact.parse(output);
			expect(result.id).toBe('contact_new');
			expect(result.name).toBe('Jane Doe');
		});

		it('updateService output parses bare object', () => {
			const output = {
				id: 'svc_1',
				name: 'Premium Haircut',
				description: 'Premium haircut with styling',
				price: 40,
				duration: 45,
				categoryId: 'cat_1',
				isActive: true,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T12:00:00Z',
			};
			const result =
				WhautomateEndpointOutputSchemas.updateService.parse(output);
			expect(result.name).toBe('Premium Haircut');
			expect(result.price).toBe(40);
		});

		it('deleteSegment output parses id object', () => {
			const output = { id: 'seg_1' };
			const result =
				WhautomateEndpointOutputSchemas.deleteSegment.parse(output);
			expect(result.id).toBe('seg_1');
		});
	});

	describe('type inference', () => {
		it('infers correct input types', () => {
			type AddContactInput = WhautomateEndpointInputs['addContact'];
			type GetContactsInput = WhautomateEndpointInputs['getContacts'];

			const addInput: AddContactInput = { name: 'Test' };
			const getInput: GetContactsInput = { page: 1, limit: 10 };

			expect(addInput.name).toBe('Test');
			expect(getInput.page).toBe(1);
		});

		it('infers correct output types', () => {
			type GetContactsOutput = WhautomateEndpointOutputs['getContacts'];
			type AddContactOutput = WhautomateEndpointOutputs['addContact'];

			const getOutput: GetContactsOutput = {
				data: [],
				pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
			};
			const addOutput: AddContactOutput = {
				id: 'c1',
				name: 'Test',
				phone: null,
				email: null,
				avatar: null,
				segmentId: null,
				customFields: null,
				createdAt: '',
				updatedAt: '',
			};

			expect(getOutput.data).toEqual([]);
			expect(addOutput.name).toBe('Test');
		});
	});
});

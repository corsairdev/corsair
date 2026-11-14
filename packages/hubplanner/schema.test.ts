import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './endpoints/types';
import { HubPlannerSchema } from './schema';

describe('HubPlanner schema', () => {
	it('declares a semver version', () => {
		expect(HubPlannerSchema.version).toBeDefined();
		expect(HubPlannerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HubPlannerSchema.entities).toBe('object');
		expect(HubPlannerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HubPlannerSchema.entities))).toBe(true);
	});
});

describe('Projects schemas', () => {
	it('validates projects.list inputs and outputs', () => {
		expect(
			HubPlannerEndpointInputSchemas['projects.list'].parse({
				page: 0,
				limit: 50,
				sort: 'name',
			}),
		).toEqual({
			page: 0,
			limit: 50,
			sort: 'name',
		});
		expect(HubPlannerEndpointInputSchemas['projects.list'].parse({})).toEqual(
			{},
		);
		expect(() =>
			HubPlannerEndpointInputSchemas['projects.list'].parse({ limit: 0 }),
		).toThrow();
		expect(() =>
			HubPlannerEndpointInputSchemas['projects.list'].parse({ limit: 1001 }),
		).toThrow();

		const validProject = {
			_id: 'proj-123',
			name: 'Website Redesign',
			status: 'STATUS_ACTIVE',
			budgetHours: 120,
		};
		expect(
			HubPlannerEndpointOutputSchemas['projects.list'].parse([validProject]),
		).toHaveLength(1);
	});

	it('validates projects.get inputs and outputs', () => {
		expect(
			HubPlannerEndpointInputSchemas['projects.get'].parse({ projectId: 'p1' }),
		).toEqual({ projectId: 'p1' });
		expect(() =>
			HubPlannerEndpointInputSchemas['projects.get'].parse({ projectId: '' }),
		).toThrow();

		const validProject = {
			_id: 'p1',
			name: 'Project Alpha',
		};
		expect(
			HubPlannerEndpointOutputSchemas['projects.get'].parse(validProject).name,
		).toBe('Project Alpha');
	});

	it('validates projects.create inputs and outputs', () => {
		const input = {
			name: 'New Mobile App',
			note: 'Initial build',
			budgetHours: 200,
			status: 'STATUS_ACTIVE',
		};
		expect(
			HubPlannerEndpointInputSchemas['projects.create'].parse(input),
		).toEqual(input);
		expect(() =>
			HubPlannerEndpointInputSchemas['projects.create'].parse({}),
		).toThrow();
	});

	it('validates projects.update inputs and outputs', () => {
		const input = {
			projects: [
				{ _id: 'p1', name: 'Updated Name' },
				{ _id: 'p2', status: 'STATUS_ARCHIVED' },
			],
		};
		expect(
			HubPlannerEndpointInputSchemas['projects.update'].parse(input),
		).toEqual(input);
		expect(() =>
			HubPlannerEndpointInputSchemas['projects.update'].parse({ projects: [] }),
		).toThrow();
	});

	it('validates projects.delete and deleteBulk inputs', () => {
		expect(
			HubPlannerEndpointInputSchemas['projects.delete'].parse({
				projectId: 'p1',
			}),
		).toEqual({ projectId: 'p1' });
		expect(() =>
			HubPlannerEndpointInputSchemas['projects.delete'].parse({
				projectId: '',
			}),
		).toThrow();

		expect(
			HubPlannerEndpointInputSchemas['projects.deleteBulk'].parse({
				projectIds: ['p1', 'p2'],
			}),
		).toEqual({
			projectIds: ['p1', 'p2'],
		});
		expect(() =>
			HubPlannerEndpointInputSchemas['projects.deleteBulk'].parse({
				projectIds: [],
			}),
		).toThrow();
	});

	it('validates project association operations', () => {
		expect(
			HubPlannerEndpointInputSchemas['projects.addResources'].parse({
				projectId: 'p1',
				resourceIds: ['r1'],
			}),
		).toEqual({
			projectId: 'p1',
			resourceIds: ['r1'],
		});
		expect(
			HubPlannerEndpointInputSchemas['projects.removeResource'].parse({
				resourceId: 'r1',
				projectIds: ['p1'],
			}),
		).toEqual({
			resourceId: 'r1',
			projectIds: ['p1'],
		});
		expect(
			HubPlannerEndpointInputSchemas['projects.addClients'].parse({
				projectId: 'p1',
				clientIds: ['c1'],
			}),
		).toEqual({
			projectId: 'p1',
			clientIds: ['c1'],
		});
		expect(
			HubPlannerEndpointInputSchemas['projects.removeClient'].parse({
				clientId: 'c1',
				projectIds: ['p1'],
			}),
		).toEqual({
			clientId: 'c1',
			projectIds: ['p1'],
		});
		expect(
			HubPlannerEndpointInputSchemas['projects.setProjectManagers'].parse({
				projectId: 'p1',
				managerIds: ['m1'],
			}),
		).toEqual({
			projectId: 'p1',
			managerIds: ['m1'],
		});
		expect(
			HubPlannerEndpointInputSchemas['projects.addTags'].parse({
				projectId: 'p1',
				tags: ['t1'],
			}),
		).toEqual({
			projectId: 'p1',
			tags: ['t1'],
		});
		expect(
			HubPlannerEndpointInputSchemas['projects.removeTag'].parse({
				projectId: 'p1',
				tagId: 't1',
			}),
		).toEqual({
			projectId: 'p1',
			tagId: 't1',
		});
	});
});

describe('Resources schemas', () => {
	it('validates resources.list and resources.get', () => {
		expect(
			HubPlannerEndpointInputSchemas['resources.list'].parse({
				page: 1,
				limit: 20,
			}),
		).toEqual({ page: 1, limit: 20 });
		expect(
			HubPlannerEndpointInputSchemas['resources.get'].parse({
				resourceId: 'r1',
			}),
		).toEqual({ resourceId: 'r1' });
		expect(() =>
			HubPlannerEndpointInputSchemas['resources.get'].parse({ resourceId: '' }),
		).toThrow();

		const validResource = {
			_id: 'r1',
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
		};
		expect(
			HubPlannerEndpointOutputSchemas['resources.get'].parse(validResource)
				.firstName,
		).toBe('Jane');
		expect(
			HubPlannerEndpointOutputSchemas['resources.list'].parse([validResource]),
		).toHaveLength(1);
	});

	it('validates resources.create and update', () => {
		const createInput = {
			firstName: 'John',
			lastName: 'Smith',
			email: 'john@example.com',
			role: 'Developer',
		};
		expect(
			HubPlannerEndpointInputSchemas['resources.create'].parse(createInput),
		).toEqual(createInput);
		expect(() =>
			HubPlannerEndpointInputSchemas['resources.create'].parse({
				firstName: 'John',
			}),
		).toThrow();

		const updateInput = {
			resources: [{ _id: 'r1', firstName: 'Johnny' }],
		};
		expect(
			HubPlannerEndpointInputSchemas['resources.update'].parse(updateInput),
		).toEqual(updateInput);
	});

	it('validates resources.delete and deleteBulk', () => {
		expect(
			HubPlannerEndpointInputSchemas['resources.delete'].parse({
				resourceId: 'r1',
			}),
		).toEqual({ resourceId: 'r1' });
		expect(
			HubPlannerEndpointInputSchemas['resources.deleteBulk'].parse({
				resourceIds: ['r1', 'r2'],
			}),
		).toEqual({
			resourceIds: ['r1', 'r2'],
		});
	});

	it('validates resources tags operations', () => {
		expect(
			HubPlannerEndpointInputSchemas['resources.getTags'].parse({
				resourceId: 'r1',
			}),
		).toEqual({ resourceId: 'r1' });
		expect(
			HubPlannerEndpointInputSchemas['resources.addTags'].parse({
				resourceId: 'r1',
				tags: ['tag1'],
			}),
		).toEqual({
			resourceId: 'r1',
			tags: ['tag1'],
		});
		expect(
			HubPlannerEndpointInputSchemas['resources.removeTag'].parse({
				resourceId: 'r1',
				tagId: 't1',
			}),
		).toEqual({
			resourceId: 'r1',
			tagId: 't1',
		});
	});
});

describe('Bookings schemas', () => {
	it('validates bookings.list input and output', () => {
		const input = {
			page: 0,
			limit: 100,
			skip: 50,
			cursor: 'cur-1',
			deleted: false,
			dependencies: true,
		};
		expect(
			HubPlannerEndpointInputSchemas['bookings.list'].parse(input),
		).toEqual(input);

		const validBooking = {
			_id: 'b1',
			resource: 'r1',
			project: 'p1',
			start: '2026-12-01',
			end: '2026-12-05',
			stateValue: 480,
		};
		expect(
			HubPlannerEndpointOutputSchemas['bookings.list'].parse([validBooking]),
		).toHaveLength(1);
	});

	it('validates bookings.create, update, and patch', () => {
		const createInput = {
			resource: 'r1',
			project: 'p1',
			start: '2026-12-01',
			end: '2026-12-05',
			title: 'Sprint Work',
		};
		expect(
			HubPlannerEndpointInputSchemas['bookings.create'].parse(createInput),
		).toEqual(createInput);

		const updateInput = {
			bookingId: 'b1',
			resource: 'r1',
			project: 'p1',
			start: '2026-12-01',
			end: '2026-12-06',
		};
		expect(
			HubPlannerEndpointInputSchemas['bookings.update'].parse(updateInput),
		).toEqual(updateInput);

		const patchInput = {
			bookingId: 'b1',
			type: 'APPROVED',
			approvalInfo: { approverNote: 'Approved by lead' },
		};
		expect(
			HubPlannerEndpointInputSchemas['bookings.patch'].parse(patchInput),
		).toEqual(patchInput);
	});

	it('validates bookings.delete and deleteBulk', () => {
		expect(
			HubPlannerEndpointInputSchemas['bookings.delete'].parse({
				bookingId: 'b1',
			}),
		).toEqual({ bookingId: 'b1' });
		expect(
			HubPlannerEndpointInputSchemas['bookings.deleteBulk'].parse({
				ids: ['b1', 'b2'],
			}),
		).toEqual({ ids: ['b1', 'b2'] });
		expect(
			HubPlannerEndpointInputSchemas['bookings.deleteBulk'].parse({
				resourceId: 'r1',
			}),
		).toEqual({ resourceId: 'r1' });
	});
});

describe('TimeEntries schemas', () => {
	it('validates timeEntries.list, get, and search', () => {
		expect(
			HubPlannerEndpointInputSchemas['timeEntries.list'].parse({
				project: 'p1',
				start: '2026-11-01',
				end: '2026-11-07',
			}),
		).toEqual({
			project: 'p1',
			start: '2026-11-01',
			end: '2026-11-07',
		});
		expect(
			HubPlannerEndpointInputSchemas['timeEntries.get'].parse({
				timeEntryId: 'te1',
			}),
		).toEqual({ timeEntryId: 'te1' });

		const validEntry = {
			_id: 'te1',
			resource: 'r1',
			project: 'p1',
			date: '2026-11-05',
			minutes: 240,
		};
		expect(
			HubPlannerEndpointOutputSchemas['timeEntries.get'].parse(validEntry)
				.minutes,
		).toBe(240);
	});

	it('validates timeEntries.create and update', () => {
		const createInput = {
			resource: 'r1',
			project: 'p1',
			date: '2026-11-05',
			minutes: 480,
			note: 'Design meeting',
		};
		expect(
			HubPlannerEndpointInputSchemas['timeEntries.create'].parse(createInput),
		).toEqual(createInput);

		const updateInput = {
			timeEntryId: 'te1',
			resource: 'r1',
			project: 'p1',
			date: '2026-11-05',
			minutes: 360,
			status: 'SUBMITTED',
		};
		expect(
			HubPlannerEndpointInputSchemas['timeEntries.update'].parse(updateInput),
		).toEqual(updateInput);
	});

	it('validates timeEntries.delete and deleteBulk', () => {
		expect(
			HubPlannerEndpointInputSchemas['timeEntries.delete'].parse({
				timeEntryId: 'te1',
			}),
		).toEqual({ timeEntryId: 'te1' });
		expect(
			HubPlannerEndpointInputSchemas['timeEntries.deleteBulk'].parse({
				ids: ['te1', 'te2'],
			}),
		).toEqual({ ids: ['te1', 'te2'] });
	});
});

describe('Categories schemas', () => {
	it('validates booking categories operations', () => {
		expect(HubPlannerEndpointInputSchemas['categories.list'].parse({})).toEqual(
			{},
		);
		expect(
			HubPlannerEndpointInputSchemas['categories.get'].parse({
				categoryId: 'cat1',
			}),
		).toEqual({ categoryId: 'cat1' });

		const createInput = {
			groupId: 'grp1',
			name: 'Client Meeting',
			gridColor: '#FF0000',
			type: 'CUSTOM' as const,
		};
		expect(
			HubPlannerEndpointInputSchemas['categories.create'].parse(createInput),
		).toEqual(createInput);

		const validCategory = {
			_id: 'cat1',
			name: 'Client Meeting',
			type: 'CUSTOM',
		};
		expect(
			HubPlannerEndpointOutputSchemas['categories.get'].parse(validCategory)
				.name,
		).toBe('Client Meeting');
	});

	it('validates cost categories operations', () => {
		expect(
			HubPlannerEndpointInputSchemas['categories.listCostCategories'].parse({}),
		).toEqual({});
		expect(
			HubPlannerEndpointInputSchemas['categories.createCostCategory'].parse({
				name: 'Travel',
			}),
		).toEqual({ name: 'Travel' });
		expect(
			HubPlannerEndpointInputSchemas['categories.deleteCostCategory'].parse({
				costCategoryId: 'cc1',
			}),
		).toEqual({ costCategoryId: 'cc1' });

		const validCostCat = {
			_id: 'cc1',
			name: 'Travel',
		};
		expect(
			HubPlannerEndpointOutputSchemas['categories.getCostCategory'].parse(
				validCostCat,
			).name,
		).toBe('Travel');
	});
});

describe('CustomFields schemas', () => {
	it('validates custom fields operations', () => {
		expect(
			HubPlannerEndpointInputSchemas['customFields.list'].parse({
				entityType: 'project',
			}),
		).toEqual({ entityType: 'project' });
		expect(
			HubPlannerEndpointInputSchemas['customFields.get'].parse({
				entityType: 'resource',
				id: 'cf1',
			}),
		).toEqual({
			entityType: 'resource',
			id: 'cf1',
		});

		const createInput = {
			entityType: 'project' as const,
			type: 'TEXT',
			label: 'Client PO Number',
			isRequired: false,
		};
		expect(
			HubPlannerEndpointInputSchemas['customFields.create'].parse(createInput),
		).toEqual(createInput);

		const addChoicesInput = {
			entityType: 'resource' as const,
			id: 'cf2',
			choices: [{ value: 'Tier 1' }, { value: 'Tier 2' }],
		};
		expect(
			HubPlannerEndpointInputSchemas['customFields.addChoices'].parse(
				addChoicesInput,
			),
		).toEqual(addChoicesInput);
	});
});

describe('Milestones schemas', () => {
	it('validates milestones operations', () => {
		expect(
			HubPlannerEndpointInputSchemas['milestones.list'].parse({
				page: 0,
				limit: 10,
			}),
		).toEqual({ page: 0, limit: 10 });
		expect(
			HubPlannerEndpointInputSchemas['milestones.get'].parse({
				milestoneId: 'm1',
			}),
		).toEqual({ milestoneId: 'm1' });

		const createInput = {
			name: 'Phase 1 Delivery',
			date: '2026-12-15',
			project: 'p1',
		};
		expect(
			HubPlannerEndpointInputSchemas['milestones.create'].parse(createInput),
		).toEqual(createInput);
		expect(
			HubPlannerEndpointInputSchemas['milestones.delete'].parse({
				milestoneId: 'm1',
			}),
		).toEqual({ milestoneId: 'm1' });
	});
});

describe('Events schemas', () => {
	it('validates events operations', () => {
		expect(
			HubPlannerEndpointInputSchemas['events.list'].parse({
				page: 0,
				limit: 10,
			}),
		).toEqual({ page: 0, limit: 10 });
		expect(
			HubPlannerEndpointInputSchemas['events.get'].parse({ eventId: 'e1' }),
		).toEqual({ eventId: 'e1' });

		const createInput = {
			name: 'All-Hands Conference',
			eventCode: 'CONF2026',
		};
		expect(
			HubPlannerEndpointInputSchemas['events.create'].parse(createInput),
		).toEqual(createInput);
		expect(
			HubPlannerEndpointInputSchemas['events.delete'].parse({ eventId: 'e1' }),
		).toEqual({ eventId: 'e1' });
	});
});

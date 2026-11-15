// Response shapes taken from the live Hub Planner API (trial account, demo data), trimmed to the
// fields that broke the original schemas. Ids are replaced with placeholders.
import {
	BookingsListResponseSchema,
	CustomFieldTemplateSchema,
	EventsListResponseSchema,
	ProjectsListResponseSchema,
	ResourcesListResponseSchema,
} from './endpoints/types';

describe('live response shapes', () => {
	it('accepts the null timestamps and ids projects come back with', () => {
		const projects = [
			{
				_id: 'p1',
				name: 'Aether Dynamics',
				createdDate: '2026-11-15T00:06:41.086Z',
				updatedDate: null,
				start: null,
				end: null,
				companyBillingRateId: null,
				status: 'STATUS_ACTIVE',
				budgetHours: 0,
			},
		];
		expect(
			ProjectsListResponseSchema.parse(projects)[0]?.updatedDate,
		).toBeNull();
	});

	it('accepts resources with a null updatedDate', () => {
		const resources = [
			{
				_id: 'r1',
				firstName: 'Abigail',
				lastName: 'Hall',
				createdDate: '2026-11-15T00:06:41.041Z',
				updatedDate: null,
				status: 'STATUS_ACTIVE',
				toilPolicyId: null,
			},
		];
		expect(ResourcesListResponseSchema.parse(resources)).toHaveLength(1);
	});

	it('accepts bookings with a null updatedDate', () => {
		const bookings = [
			{
				_id: 'b1',
				title: '',
				start: '2026-11-09T09:00',
				end: '2026-11-13T18:00',
				resource: 'r1',
				project: 'p1',
				state: 'STATE_PERCENTAGE',
				stateValue: 100,
				createdDate: '2026-11-15T00:06:41.089Z',
				updatedDate: null,
				deadlineName: null,
				billable: null,
				categoryTemplateId: 'c1',
			},
		];
		expect(BookingsListResponseSchema.parse(bookings)).toHaveLength(1);
	});

	it('accepts events with null createdDate and updatedDate', () => {
		const events = [
			{
				_id: 'e1',
				name: 'Not Available',
				eventCode: '',
				status: 'STATUS_ACTIVE',
				createdDate: null,
				updatedDate: null,
			},
		];
		expect(EventsListResponseSchema.parse(events)).toHaveLength(1);
	});

	it('accepts a numeric characterLimit on custom field templates', () => {
		const template = {
			_id: 'cf1',
			type: 'TEXT',
			label: 'Code',
			characterLimit: 0,
		};
		expect(CustomFieldTemplateSchema.parse(template).characterLimit).toBe(0);
	});
});

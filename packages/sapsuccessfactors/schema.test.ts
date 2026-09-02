import { sapRoutes } from './endpoints/routes';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './endpoints/types';
import { SapsuccessfactorsSchema } from './schema';
import { SapsuccessfactorsUserEntity } from './schema/database';

describe('sapsuccessfactors schemas', () => {
	it('declares labeled User fields from the OData dictionary', () => {
		const user = SapsuccessfactorsUserEntity.parse({
			userId: 'cgrant',
			username: 'cgrant',
			firstName: 'Carla',
			lastName: 'Grant',
			email: 'cgrant@example.com',
			status: 't',
			custom01: 'tenant-extra',
		});
		expect(user.userId).toBe('cgrant');
		expect(SapsuccessfactorsSchema.entities.user).toBeDefined();
		expect(SapsuccessfactorsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('covers every registered operation with input and output schemas', () => {
		for (const route of sapRoutes) {
			expect(
				SapsuccessfactorsEndpointInputSchemas[
					route.name as keyof typeof SapsuccessfactorsEndpointInputSchemas
				],
			).toBeDefined();
			expect(
				SapsuccessfactorsEndpointOutputSchemas[
					route.name as keyof typeof SapsuccessfactorsEndpointOutputSchemas
				],
			).toBeDefined();
		}
		expect(sapRoutes).toHaveLength(64);
	});

	it('rejects invalid paging and missing keys', () => {
		expect(
			SapsuccessfactorsEndpointInputSchemas.listUsers.safeParse({
				top: 'nope',
			}).success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointInputSchemas.approveCalibrationSession.safeParse(
				{},
			).success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointInputSchemas.getPerPersonById.safeParse({})
				.success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointInputSchemas.getCustomMdfObject.safeParse({
				custom_object: 'User',
			}).success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointInputSchemas.createAFeedbackRequest.safeParse({})
				.success,
		).toBe(false);
	});

	it('accepts OData v2, v4, and metadata payloads', () => {
		expect(
			SapsuccessfactorsEndpointOutputSchemas.listUsers.parse({
				d: { results: [{ userId: 'cgrant' }] },
			}),
		).toBeDefined();
		expect(
			SapsuccessfactorsEndpointOutputSchemas.getFeedbackRecordsServiceAvailable.parse(
				{ value: [{ id: '1' }] },
			),
		).toBeDefined();
		expect(
			SapsuccessfactorsEndpointOutputSchemas.getOdataUserMetadata.parse(
				'<?xml version="1.0"?>',
			),
		).toBeDefined();
		expect(
			SapsuccessfactorsEndpointOutputSchemas.listUsers.safeParse(null).success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointOutputSchemas.listUsers.safeParse('oops')
				.success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointOutputSchemas.listUsers.safeParse({ foo: 1 })
				.success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointOutputSchemas.listUsers.safeParse({
				d: { results: [{ jobReqId: 1 }] },
			}).success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointOutputSchemas.getPerPersonById.safeParse({
				d: { userId: 'cgrant' },
			}).success,
		).toBe(false);
		expect(
			SapsuccessfactorsEndpointOutputSchemas.updateCalibrationSubjectRatings.safeParse(
				undefined,
			).success,
		).toBe(true);
		expect(
			SapsuccessfactorsEndpointOutputSchemas.listUsers.safeParse(undefined)
				.success,
		).toBe(false);
	});
});

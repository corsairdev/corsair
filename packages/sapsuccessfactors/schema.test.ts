import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './endpoints/types';
import { SapsuccessfactorsSchema } from './schema';

describe('Sapsuccessfactors schema and validation', () => {
	it('declares a semver version', () => {
		expect(SapsuccessfactorsSchema.version).toBeDefined();
		expect(SapsuccessfactorsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares comprehensive entity schemas', () => {
		expect(typeof SapsuccessfactorsSchema.entities).toBe('object');
		expect(SapsuccessfactorsSchema.entities.user).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.person).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.personal).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.employment).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.calibrationSession).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.goalPlan).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.jobRequisition).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.candidate).toBeDefined();
		expect(SapsuccessfactorsSchema.entities.position).toBeDefined();
	});

	it('validates approveCalibrationSession input schema positive and negative cases', () => {
		const valid = { session_id: 'session-123' };
		expect(
			SapsuccessfactorsEndpointInputSchemas.approveCalibrationSession.parse(
				valid,
			),
		).toEqual(valid);
		expect(
			SapsuccessfactorsEndpointInputSchemas.approveCalibrationSession.safeParse(
				{},
			).success,
		).toBe(false);
	});

	it('validates getPersonById input schema positive and negative cases', () => {
		const valid = { person_id_external: 'emp-456' };
		expect(
			SapsuccessfactorsEndpointInputSchemas.getPerPersonById.parse(valid),
		).toEqual(valid);
		expect(
			SapsuccessfactorsEndpointInputSchemas.getPerPersonById.safeParse({})
				.success,
		).toBe(false);
	});

	it('validates listUsers input schema with pagination', () => {
		const valid = { top: 10, skip: 0, filter: "status eq 'ACTIVE'" };
		expect(
			SapsuccessfactorsEndpointInputSchemas.listUsers.parse(valid),
		).toEqual(valid);
		expect(
			SapsuccessfactorsEndpointInputSchemas.listUsers.safeParse({
				top: 'invalid_number',
			}).success,
		).toBe(false);
	});

	it('validates standard response output schema', () => {
		const validResponse = {
			d: {
				results: [{ id: '1', name: 'Test' }],
				id: '1',
				status: 'OK',
			},
		};
		expect(
			SapsuccessfactorsEndpointOutputSchemas.listUsers.parse(validResponse),
		).toBeDefined();
	});
});

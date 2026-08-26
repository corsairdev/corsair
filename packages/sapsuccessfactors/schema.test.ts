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

	it('declares an entities map', () => {
		expect(typeof SapsuccessfactorsSchema.entities).toBe('object');
		expect(SapsuccessfactorsSchema.entities).not.toBeNull();
	});

	it('validates approveCalibrationSession input schema', () => {
		const valid = { session_id: 'session-123' };
		expect(
			SapsuccessfactorsEndpointInputSchemas.approveCalibrationSession.parse(
				valid,
			),
		).toEqual(valid);
	});

	it('validates getPersonById input schema', () => {
		const valid = { person_id_external: 'emp-456' };
		expect(
			SapsuccessfactorsEndpointInputSchemas.getPerPersonById.parse(valid),
		).toEqual(valid);
	});

	it('validates listUsers input schema with pagination', () => {
		const valid = { top: 10, skip: 0, filter: "status eq 'ACTIVE'" };
		expect(
			SapsuccessfactorsEndpointInputSchemas.listUsers.parse(valid),
		).toEqual(valid);
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

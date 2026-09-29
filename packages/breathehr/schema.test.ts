import { BreatheHrSchema } from './schema';
import { BreatheHrEmployee } from './schema/database';

describe('Breathe HR schema', () => {
	it('declares a semver version', () => {
		expect(BreatheHrSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Breathe HR entities', () => {
		expect(Object.keys(BreatheHrSchema.entities).sort()).toEqual([
			'absences',
			'accounts',
			'departments',
			'employeeExpenses',
			'employees',
			'leaveRequests',
			'sicknesses',
		]);
	});

	it('accepts official employee fields from GET /employees', () => {
		const parsed = BreatheHrEmployee.parse({
			id: 5,
			first_name: 'foo',
			last_name: 'bar',
			email: 'foo@bar.com',
			job_title: 'Director',
			join_date: '2014-10-01',
		});
		expect(parsed.id).toBe(5);
		expect(parsed.join_date).toBe('2014-10-01');
	});
});

import { confirmDeleted } from './endpoints/call';

describe('confirmDeleted', () => {
	it('reports a bodyless 204 as deleted', () => {
		expect(confirmDeleted(undefined, { project_id: 'Xk9mZp' })).toEqual({
			project_id: 'Xk9mZp',
			deleted: true,
		});
	});

	it('refuses a JSON null, which only a 200 with a body can produce', () => {
		expect(() => confirmDeleted(null, { project_id: 'Xk9mZp' })).toThrow(
			'Expected an empty 204',
		);
	});
});

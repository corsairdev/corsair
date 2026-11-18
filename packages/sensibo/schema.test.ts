import { SensiboSchema } from './schema';
import { SensiboPodEntity } from './schema/database';

describe('Sensibo schema', () => {
	it('declares a semver version and the pods entity', () => {
		expect(SensiboSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(SensiboSchema.entities)).toEqual(['pods']);
	});

	it('accepts a pod row and rejects one with no id', () => {
		const parsed = SensiboPodEntity.parse({ id: 'pod-1', roomName: 'Kitchen' });
		expect(parsed).toEqual({ id: 'pod-1', roomName: 'Kitchen' });
		expect(SensiboPodEntity.safeParse({ roomName: 'Kitchen' }).success).toBe(
			false,
		);
		expect(SensiboPodEntity.safeParse({ id: '' }).success).toBe(false);
	});
});

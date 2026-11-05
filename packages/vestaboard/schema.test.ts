import {
	VestaboardCharacters,
	VestaboardMessage,
	VestaboardSchema,
	VestaboardSubscription,
} from './schema';

const blankRow = Array.from({ length: 22 }, () => 0);

describe('Vestaboard schema', () => {
	it('declares a semver version', () => {
		expect(VestaboardSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official Subscription API entities', () => {
		expect(VestaboardSchema.entities.subscriptions).toBe(
			VestaboardSubscription,
		);
		expect(VestaboardSchema.entities.messages).toBe(VestaboardMessage);
	});

	it('parses official list-subscription items', () => {
		expect(
			VestaboardSubscription.parse({
				id: 'e599aa61-8e3d-4f90-a5f1-826983a3d67a',
				boardId: '46c06290-7961-49e0-a6fd-7874bb40a0de',
			}).boardId,
		).toBe('46c06290-7961-49e0-a6fd-7874bb40a0de');
	});

	it('parses official send-message responses', () => {
		expect(
			VestaboardMessage.parse({
				id: '1125e36d-4e3a-40fb-a87b-1aa90f0997a1',
				text: 'Test',
				created: '1577839720478',
				muted: false,
			}).created,
		).toBe('1577839720478');
	});

	it('requires a 6x22 grid of codes 0-71', () => {
		expect(
			VestaboardCharacters.parse(Array.from({ length: 6 }, () => [...blankRow]))
				.length,
		).toBe(6);
		expect(() => VestaboardCharacters.parse([[0]])).toThrow();
		expect(() =>
			VestaboardCharacters.parse(
				Array.from({ length: 6 }, () => Array.from({ length: 22 }, () => 72)),
			),
		).toThrow();
	});
});

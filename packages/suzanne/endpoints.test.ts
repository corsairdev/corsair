import {
	CreateUploadInputSchema,
	PhotoTo3dInputSchema,
	TextTo3dInputSchema,
} from './endpoints/types';

const photo = {
	model: 'sculptor' as const,
	images_upload_ids: { front: 'upl_front' },
};

describe('suzanne input bounds', () => {
	it('accepts a 4000 character prompt and rejects 4001', () => {
		expect(
			TextTo3dInputSchema.safeParse({
				model: 'sculptor',
				prompt: 'a'.repeat(4000),
			}).success,
		).toBe(true);
		expect(
			TextTo3dInputSchema.safeParse({
				model: 'sculptor',
				prompt: 'a'.repeat(4001),
			}).success,
		).toBe(false);
	});

	it('accepts the largest face count and rejects the next integer', () => {
		expect(
			TextTo3dInputSchema.safeParse({
				model: 'atelier',
				prompt: 'fox',
				params: { faces: 2_000_000 },
			}).success,
		).toBe(true);
		expect(
			TextTo3dInputSchema.safeParse({
				model: 'atelier',
				prompt: 'fox',
				params: { faces: 2_000_001 },
			}).success,
		).toBe(false);
	});

	it('rejects capture on text-to-3d and extra photo fields', () => {
		expect(
			TextTo3dInputSchema.safeParse({
				model: 'capture',
				prompt: 'fox',
			}).success,
		).toBe(false);
		expect(
			PhotoTo3dInputSchema.safeParse({
				...photo,
				images_inline: { front: 'aaaa' },
			}).success,
		).toBe(false);
		expect(PhotoTo3dInputSchema.safeParse({ model: 'sculptor' }).success).toBe(
			false,
		);
	});

	it('requires all four views for capture and only front for atelier', () => {
		expect(
			PhotoTo3dInputSchema.safeParse({
				model: 'capture',
				images_upload_ids: { front: 'upl_front' },
			}).success,
		).toBe(false);
		expect(
			PhotoTo3dInputSchema.safeParse({
				model: 'capture',
				images_upload_ids: {
					front: 'upl_f',
					back: 'upl_b',
					left: 'upl_l',
					right: 'upl_r',
				},
			}).success,
		).toBe(true);
		expect(
			PhotoTo3dInputSchema.safeParse({
				model: 'atelier',
				images_upload_ids: { front: 'upl_f', back: 'upl_b' },
			}).success,
		).toBe(false);
		expect(PhotoTo3dInputSchema.safeParse(photo).success).toBe(true);
	});

	it('strips extra keys on the empty upload input', () => {
		expect(CreateUploadInputSchema.parse({ refresh: true })).toEqual({});
	});
});

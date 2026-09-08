import {
	DreamstudioAccount,
	DreamstudioBalance,
	DreamstudioEngine,
	DreamstudioImage,
	DreamstudioOrganizationMembership,
	DreamstudioSchema,
} from './schema';

describe('Dreamstudio schema', () => {
	it('declares a semver version', () => {
		expect(DreamstudioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official REST v1 entities', () => {
		expect(DreamstudioSchema.entities.accounts).toBe(DreamstudioAccount);
		expect(DreamstudioSchema.entities.balances).toBe(DreamstudioBalance);
		expect(DreamstudioSchema.entities.engines).toBe(DreamstudioEngine);
		expect(DreamstudioSchema.entities.images).toBe(DreamstudioImage);
		expect(DreamstudioSchema.entities.organizations).toBe(
			DreamstudioOrganizationMembership,
		);
	});

	it('parses official AccountResponseBody examples', () => {
		expect(
			DreamstudioAccount.parse({
				id: 'user-1234',
				email: 'example@stability.ai',
				organizations: [
					{
						id: 'org-1234',
						name: 'My Organization',
						role: 'MEMBER',
						is_default: false,
					},
				],
				profile_picture: 'https://api.stability.ai/example.png',
			}).email,
		).toBe('example@stability.ai');
	});

	it('parses official BalanceResponseBody examples', () => {
		expect(
			DreamstudioBalance.parse({ credits: 0.07903292496944721 }).credits,
		).toBe(0.07903292496944721);
	});

	it('parses official Engine list items', () => {
		expect(
			DreamstudioEngine.parse({
				id: 'stable-diffusion-v1-6',
				name: 'Stable Diffusion v1.6',
				description: 'Stability-AI Stable Diffusion v1.6',
				type: 'PICTURE',
			}).type,
		).toBe('PICTURE');
	});
});

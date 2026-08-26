/// <reference types="jest" />
import { DocusignSchema } from './schema';

describe('DocusignSchema', () => {
	it('should define envelope and template schemas', () => {
		expect(DocusignSchema).toBeDefined();
		expect(DocusignSchema.envelope).toBeDefined();
		expect(DocusignSchema.template).toBeDefined();

		const sampleEnvelope = {
			envelopeId: 'env_123',
			status: 'sent',
		};
		const result = DocusignSchema.envelope.safeParse(sampleEnvelope);
		expect(result.success).toBe(true);
	});
});

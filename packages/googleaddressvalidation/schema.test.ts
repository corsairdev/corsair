import {
	GoogleAddressValidationEndpointInputSchemas,
	GoogleAddressValidationEndpointOutputSchemas,
} from './endpoints/types';
import { GoogleAddressValidationSchema } from './schema';

const validAddress = {
	regionCode: 'US',
	addressLines: ['1600 Amphitheatre Pkwy'],
};

describe('GoogleAddressValidation schema', () => {
	it('declares a semver version', () => {
		expect(GoogleAddressValidationSchema.version).toBeDefined();
		expect(GoogleAddressValidationSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoogleAddressValidationSchema.entities).toBe('object');
		expect(GoogleAddressValidationSchema.entities).not.toBeNull();
		expect(
			Array.isArray(Object.keys(GoogleAddressValidationSchema.entities)),
		).toBe(true);
		for (const entity of Object.values(
			GoogleAddressValidationSchema.entities,
		)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('validateAddress input', () => {
	it('requires at least one non-empty address line', () => {
		expect(
			GoogleAddressValidationEndpointInputSchemas.validateAddress.safeParse({
				address: { regionCode: 'US' },
			}).success,
		).toBe(false);
		expect(
			GoogleAddressValidationEndpointInputSchemas.validateAddress.safeParse({
				address: { regionCode: 'US', addressLines: [] },
			}).success,
		).toBe(false);
		expect(
			GoogleAddressValidationEndpointInputSchemas.validateAddress.safeParse({
				address: { regionCode: 'US', addressLines: [''] },
			}).success,
		).toBe(false);
		expect(
			GoogleAddressValidationEndpointInputSchemas.validateAddress.parse({
				address: validAddress,
			}),
		).toEqual({ address: validAddress });
	});

	it('rejects sessionToken values Google would INVALID_ARGUMENT', () => {
		expect(
			GoogleAddressValidationEndpointInputSchemas.validateAddress.safeParse({
				address: validAddress,
				sessionToken: 'a'.repeat(37),
			}).success,
		).toBe(false);
		expect(
			GoogleAddressValidationEndpointInputSchemas.validateAddress.safeParse({
				address: validAddress,
				sessionToken: 'not safe/base64+',
			}).success,
		).toBe(false);
		expect(
			GoogleAddressValidationEndpointInputSchemas.validateAddress.parse({
				address: validAddress,
				sessionToken: 'AbC_-0123456789',
			}),
		).toEqual({
			address: validAddress,
			sessionToken: 'AbC_-0123456789',
		});
	});
});

describe('provideValidationFeedback input', () => {
	it('rejects VALIDATION_CONCLUSION_UNSPECIFIED and empty responseId', () => {
		expect(
			GoogleAddressValidationEndpointInputSchemas.provideValidationFeedback.safeParse(
				{
					conclusion: 'VALIDATION_CONCLUSION_UNSPECIFIED',
					responseId: 'response-id-1',
				},
			).success,
		).toBe(false);
		expect(
			GoogleAddressValidationEndpointInputSchemas.provideValidationFeedback.safeParse(
				{
					conclusion: 'VALIDATED_VERSION_USED',
					responseId: '',
				},
			).success,
		).toBe(false);
		expect(
			GoogleAddressValidationEndpointInputSchemas.provideValidationFeedback.parse(
				{
					conclusion: 'VALIDATED_VERSION_USED',
					responseId: 'response-id-1',
				},
			),
		).toEqual({
			conclusion: 'VALIDATED_VERSION_USED',
			responseId: 'response-id-1',
		});
	});
});

describe('validateAddress output', () => {
	it('keeps unknown fields on verdict, geocode, and metadata', () => {
		const parsed =
			GoogleAddressValidationEndpointOutputSchemas.validateAddress.parse({
				result: {
					verdict: { addressComplete: true, extraSignal: 'keep-me' },
					geocode: {
						placeId: 'ChIJd8BlQ2BZwokRAFUEcm_qrcA',
						locationType: 'ROOFTOP',
					},
					metadata: { business: true, unknownFlag: true },
				},
				responseId: 'response-id-1',
			});

		expect(parsed.result.verdict).toMatchObject({ extraSignal: 'keep-me' });
		expect(parsed.result.geocode).toMatchObject({ locationType: 'ROOFTOP' });
		expect(parsed.result.metadata).toMatchObject({ unknownFlag: true });
	});
});

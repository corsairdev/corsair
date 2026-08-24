import { logEventFromContext } from 'corsair/core';
import { makeGoogleAddressValidationRequest } from './client';
import { Address } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	makeGoogleAddressValidationRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeGoogleAddressValidationRequest);
const mockLog = jest.mocked(logEventFromContext);

type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

const validate = Address.validate as AnyEndpoint;
const provideFeedback = Address.provideFeedback as AnyEndpoint;

function createContext() {
	return {
		key: 'test-key',
		options: { authType: 'api_key' as const },
	};
}

const validateAddressInput = {
	address: {
		regionCode: 'US',
		addressLines: ['1600 Amphitheatre Pkwy'],
		locality: 'Mountain View',
		administrativeArea: 'CA',
	},
};

const validateAddressResponse = {
	result: {
		verdict: {
			addressComplete: true,
			validationGranularity: 'PREMISE',
		},
		address: {
			formattedAddress: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
		},
		geocode: {
			location: { latitude: 37.4224764, longitude: -122.0842499 },
		},
	},
	responseId: 'response-id-1',
};

const provideFeedbackInput = {
	conclusion: 'VALIDATED_VERSION_USED' as const,
	responseId: 'response-id-1',
};

describe('GoogleAddressValidation endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('address.validate calls the validateAddress RPC and validates output', async () => {
		mockRequest.mockResolvedValueOnce(validateAddressResponse);
		const ctx = createContext();

		const result = await validate(ctx, validateAddressInput);

		expect(mockRequest).toHaveBeenCalledWith(
			'v1:validateAddress',
			ctx.key,
			expect.objectContaining({ method: 'POST', body: validateAddressInput }),
		);
		expect(result).toEqual(validateAddressResponse);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'googleaddressvalidation.address.validate',
			{},
			'completed',
		);
	});

	it('address.provideFeedback calls the provideValidationFeedback RPC and validates output', async () => {
		mockRequest.mockResolvedValueOnce({});
		const ctx = createContext();

		const result = await provideFeedback(ctx, provideFeedbackInput);

		expect(mockRequest).toHaveBeenCalledWith(
			'v1:provideValidationFeedback',
			ctx.key,
			expect.objectContaining({ method: 'POST', body: provideFeedbackInput }),
		);
		expect(result).toEqual({});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'googleaddressvalidation.address.provideFeedback',
			{},
			'completed',
		);
	});

	it('address.validate rejects a response missing the required responseId', async () => {
		mockRequest.mockResolvedValueOnce({ result: {} });
		const ctx = createContext();

		await expect(validate(ctx, validateAddressInput)).rejects.toThrow();
	});

	it('address.provideFeedback rejects a non-object response', async () => {
		mockRequest.mockResolvedValueOnce(null);
		const ctx = createContext();

		await expect(provideFeedback(ctx, provideFeedbackInput)).rejects.toThrow();
	});

	it('address.validate rejects an unsupported PostalAddress revision before calling the RPC', async () => {
		const ctx = createContext();

		await expect(
			validate(ctx, {
				address: { ...validateAddressInput.address, revision: 1 },
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('address.validate rejects a missing addressLines before calling the RPC', async () => {
		const ctx = createContext();

		await expect(
			validate(ctx, { address: { regionCode: 'US' } }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('address.provideFeedback rejects VALIDATION_CONCLUSION_UNSPECIFIED before calling the RPC', async () => {
		const ctx = createContext();

		await expect(
			provideFeedback(ctx, {
				conclusion: 'VALIDATION_CONCLUSION_UNSPECIFIED',
				responseId: 'response-id-1',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('address.provideFeedback treats an empty 200 body as {}', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		const ctx = createContext();

		await expect(provideFeedback(ctx, provideFeedbackInput)).resolves.toEqual(
			{},
		);
	});
});

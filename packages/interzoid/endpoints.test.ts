import { logEventFromContext } from 'corsair/core';
import { makeInterzoidRequest } from './client';
import {
	Intelligence,
	Matching,
	Standardization,
	Utilities,
	Validation,
} from './endpoints';
import type { InterzoidContext } from './index';

/** A `then` handler for calls that must reject: a resolved call fails the test. */
const expectedRejection = (): never => {
	throw new Error('expected the call to reject');
};

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeInterzoidRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockedMakeRequest = jest.mocked(makeInterzoidRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

// This narrow assertion is safe because these endpoint functions only read `key` from context.
const mockContext = {
	key: 'test-api-license-key',
} as InterzoidContext;

beforeEach(() => {
	mockedMakeRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Interzoid Endpoints', () => {
	describe('matching.getCompanyMatchAdvanced', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getCompanyMatchAdvanced(mockContext, {
				company: 'IBM Corporation',
				algorithm: 'model-v4-wide',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcompanymatchadvanced',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						company: 'IBM Corporation',
						algorithm: 'model-v4-wide',
					}),
				}),
			);
			expect(result).toMatchObject({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCompanyMatchAdvanced',
				expect.objectContaining({
					endpoint: '/getcompanymatchadvanced',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getCompanyMatchAdvanced(
				mockContext,
				{ company: '', algorithm: 'test' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getFullNameMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getFullNameMatch(mockContext, {
				fullname: 'James Kelly',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getfullnamematch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ fullname: 'James Kelly' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getFullNameMatch',
				expect.objectContaining({
					endpoint: '/getfullnamematch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getFullNameMatch(mockContext, {
				fullname: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getAddressMatchAdvanced', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getAddressMatchAdvanced(mockContext, {
				address: '400 East Broadway',
				algorithm: 'model-v3-narrow',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getaddressmatchadvanced',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						address: '400 East Broadway',
						algorithm: 'model-v3-narrow',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getAddressMatchAdvanced',
				expect.objectContaining({
					endpoint: '/getaddressmatchadvanced',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getAddressMatchAdvanced(
				mockContext,
				{ address: '', algorithm: 'test' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getAddressAndFullNameMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getAddressAndFullNameMatch(mockContext, {
				address: '100 Main St',
				fullname: 'James Kelly',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getaddressandfullnamematch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						address: '100 Main St',
						fullname: 'James Kelly',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getAddressAndFullNameMatch',
				expect.objectContaining({
					endpoint: '/getaddressandfullnamematch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getAddressAndFullNameMatch(
				mockContext,
				{ address: '', fullname: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getCompanyAndAddressMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getCompanyAndAddressMatch(mockContext, {
				company: 'IBM Corp',
				address: '1 New Orchard Road',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcompanyandaddressmatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						company: 'IBM Corp',
						address: '1 New Orchard Road',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCompanyAndAddressMatch',
				expect.objectContaining({
					endpoint: '/getcompanyandaddressmatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getCompanyAndAddressMatch(
				mockContext,
				{ company: '', address: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getCompanyAndFullNameMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getCompanyAndFullNameMatch(mockContext, {
				company: 'IBM Corp',
				fullname: 'James Kelly',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcompanyandfullnamematch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						company: 'IBM Corp',
						fullname: 'James Kelly',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCompanyAndFullNameMatch',
				expect.objectContaining({
					endpoint: '/getcompanyandfullnamematch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getCompanyAndFullNameMatch(
				mockContext,
				{ company: '', fullname: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getGlobalAddressMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getGlobalAddressMatch(mockContext, {
				address: 'Piazza del Colosseo, 1, Rome, Italy',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getglobaladdressmatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						address: 'Piazza del Colosseo, 1, Rome, Italy',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGlobalAddressMatch',
				expect.objectContaining({
					endpoint: '/getglobaladdressmatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getGlobalAddressMatch(
				mockContext,
				{ address: '', algorithm: 'test' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getProductMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getProductMatch(mockContext, {
				product: 'Dell OptiPlex 7020 Desktop Computer',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getproductmatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						product: 'Dell OptiPlex 7020 Desktop Computer',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getProductMatch',
				expect.objectContaining({
					endpoint: '/getproductmatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getProductMatch(mockContext, {
				product: '',
				algorithm: 'test',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getOrgMatchScore', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Score: '95',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getOrgMatchScore(mockContext, {
				org1: 'Amazon.com',
				org2: 'Amazon Inc.',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getorgmatchscore',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						org1: 'Amazon.com',
						org2: 'Amazon Inc.',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getOrgMatchScore',
				expect.objectContaining({
					endpoint: '/getorgmatchscore',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getOrgMatchScore(mockContext, {
				org1: '',
				org2: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getFullNameMatchScore', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Score: '95',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getFullNameMatchScore(mockContext, {
				fullname1: 'James Kelly',
				fullname2: 'Jim Kelly',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getfullnamematchscore',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						fullname1: 'James Kelly',
						fullname2: 'Jim Kelly',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getFullNameMatchScore',
				expect.objectContaining({
					endpoint: '/getfullnamematchscore',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getFullNameMatchScore(
				mockContext,
				{ fullname1: '', fullname2: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getCompanyMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getCompanyMatch(mockContext, {
				company: 'International Business Machines',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcompanymatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						company: 'International Business Machines',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCompanyMatch',
				expect.objectContaining({
					endpoint: '/getcompanymatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getCompanyMatch(mockContext, {
				company: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getAddressMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getAddressMatch(mockContext, {
				address: '500 Oak Drive',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getaddressmatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ address: '500 Oak Drive' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getAddressMatch',
				expect.objectContaining({
					endpoint: '/getaddressmatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getAddressMatch(mockContext, {
				address: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getFullNameParsedMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getFullNameParsedMatch(mockContext, {
				firstname: 'James',
				lastname: 'Kelly',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getfullnameparsedmatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						firstname: 'James',
						lastname: 'Kelly',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getFullNameParsedMatch',
				expect.objectContaining({
					endpoint: '/getfullnameparsedmatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getFullNameParsedMatch(
				mockContext,
				{ firstname: '', lastname: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getCityMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getCityMatch(mockContext, {
				city: 'San Francisco',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcitymatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ city: 'San Francisco' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCityMatch',
				expect.objectContaining({
					endpoint: '/getcitymatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getCityMatch(mockContext, {
				city: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('matching.getCountryMatch', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Matching.getCountryMatch(mockContext, {
				country: 'United States',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcountrymatch',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ country: 'United States' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCountryMatch',
				expect.objectContaining({
					endpoint: '/getcountrymatch',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Matching.getCountryMatch(mockContext, {
				country: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('standardization.getOrgStandard', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Standard: 'Standard Name',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Standardization.getOrgStandard(mockContext, {
				org: 'b.o.a.',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getorgstandard',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ org: 'b.o.a.' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getOrgStandard',
				expect.objectContaining({
					endpoint: '/getorgstandard',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Standardization.getOrgStandard(
				mockContext,
				{ org: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('standardization.getCountryStandard', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				CountryStandard: 'Germany',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Standardization.getCountryStandard(mockContext, {
				country: 'Deutschland',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcountrystandard',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ country: 'Deutschland' }),
				}),
			);
			expect(result).toMatchObject({
				CountryStandard: 'Germany',
				Code: 'Success',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCountryStandard',
				expect.objectContaining({
					endpoint: '/getcountrystandard',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Standardization.getCountryStandard(
				mockContext,
				{ country: '', algorithm: 'test' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('standardization.getCountryInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				CountryStandard: 'France',
				TwoLetterCode: 'FR',
				ThreeLetterCode: 'FRA',
				ThreeDigitCode: '250',
				CurrencyCode: 'EUR',
				CurrencyName: 'Euro',
				CurrencySymbol: '€',
				CallingCode: '33',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Standardization.getCountryInfo(mockContext, {
				country: 'France',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcountryinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ country: 'France' }),
				}),
			);
			expect(result).toMatchObject({
				CountryStandard: 'France',
				TwoLetterCode: 'FR',
				ThreeLetterCode: 'FRA',
				CurrencyCode: 'EUR',
				CallingCode: '33',
				Code: 'Success',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCountryInfo',
				expect.objectContaining({
					endpoint: '/getcountryinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Standardization.getCountryInfo(
				mockContext,
				{ country: '', algorithm: 'test' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('standardization.getStateAbbreviation', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				State: 'California',
				Abbreviation: 'CA',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Standardization.getStateAbbreviation(mockContext, {
				state: 'California',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getstateabbreviation',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ state: 'California' }),
				}),
			);
			expect(result).toMatchObject({
				State: 'California',
				Abbreviation: 'CA',
				Code: 'Success',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getStateAbbreviation',
				expect.objectContaining({
					endpoint: '/getstateabbreviation',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Standardization.getStateAbbreviation(
				mockContext,
				{ state: '', algorithm: 'test' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('standardization.getCityStandard', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				CityStandard: 'New York',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Standardization.getCityStandard(mockContext, {
				city: 'NYC',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcitystandard',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ city: 'NYC' }),
				}),
			);
			expect(result).toMatchObject({
				CityStandard: 'New York',
				Code: 'Success',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCityStandard',
				expect.objectContaining({
					endpoint: '/getcitystandard',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Standardization.getCityStandard(
				mockContext,
				{ city: '', algorithm: 'test' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('standardization.getOfficialName', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Standardization.getOfficialName(mockContext, {
				lookup: 'Apple',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getofficialname',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Apple' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getOfficialName',
				expect.objectContaining({
					endpoint: '/getofficialname',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Standardization.getOfficialName(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getBusinessInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				CompanyName: 'Cisco Systems, Inc.',
				CompanyURL: 'https://www.cisco.com',
				CompanyLocation: 'San Jose, California',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getBusinessInfo(mockContext, {
				lookup: 'Cisco',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getbusinessinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Cisco' }),
				}),
			);
			expect(result).toMatchObject({
				CompanyName: 'Cisco Systems, Inc.',
				CompanyURL: 'https://www.cisco.com',
				CompanyLocation: 'San Jose, California',
				Code: 'Success',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getBusinessInfo',
				expect.objectContaining({
					endpoint: '/getbusinessinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getBusinessInfo(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getParentCompanyInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getParentCompanyInfo(mockContext, {
				lookup: 'Informatica',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getparentcompanyinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Informatica' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getParentCompanyInfo',
				expect.objectContaining({
					endpoint: '/getparentcompanyinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getParentCompanyInfo(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getExecutiveProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getExecutiveProfile(mockContext, {
				lookup: 'Amazon Web Services CEO',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getexecutiveprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Amazon Web Services CEO' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getExecutiveProfile',
				expect.objectContaining({
					endpoint: '/getexecutiveprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getExecutiveProfile(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getBusinessInfoDomain', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getBusinessInfoDomain(mockContext, {
				lookup: 'Microsoft',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getbusinessinfodomain',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Microsoft' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getBusinessInfoDomain',
				expect.objectContaining({
					endpoint: '/getbusinessinfodomain',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getBusinessInfoDomain(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getBusinessInfoName', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getBusinessInfoName(mockContext, {
				lookup: 'Microsoft',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getbusinessinfoname',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Microsoft' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getBusinessInfoName',
				expect.objectContaining({
					endpoint: '/getbusinessinfoname',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getBusinessInfoName(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getCompanyVerification', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Score: '95',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getCompanyVerification(mockContext, {
				lookup: 'Microsoft Corporation',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcompanyverification',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Microsoft Corporation' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCompanyVerification',
				expect.objectContaining({
					endpoint: '/getcompanyverification',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getCompanyVerification(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getStockInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getStockInfo(mockContext, {
				lookup: 'NVDA',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getstockinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'NVDA' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getStockInfo',
				expect.objectContaining({
					endpoint: '/getstockinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getStockInfo(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getIndustryCodes', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getIndustryCodes(mockContext, {
				lookup: 'Oracle Corporation',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getindustrycodes',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Oracle Corporation' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getIndustryCodes',
				expect.objectContaining({
					endpoint: '/getindustrycodes',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getIndustryCodes(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getSicCodes', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getSicCodes(mockContext, {
				lookup: 'Safeway Inc.',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getsiccodes',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Safeway Inc.' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getSicCodes',
				expect.objectContaining({
					endpoint: '/getsiccodes',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getSicCodes(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getUniversityInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getUniversityInfo(mockContext, {
				lookup: 'The Ohio State University',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getuniversityinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						lookup: 'The Ohio State University',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getUniversityInfo',
				expect.objectContaining({
					endpoint: '/getuniversityinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getUniversityInfo(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getProductRecallInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getProductRecallInfo(mockContext, {
				lookup: 'Kirkland Signature Prosecco',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getproductrecallinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						lookup: 'Kirkland Signature Prosecco',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getProductRecallInfo',
				expect.objectContaining({
					endpoint: '/getproductrecallinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getProductRecallInfo(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getTechStack', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getTechStack(mockContext, {
				lookup: 'shopify.com',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/gettechstack',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'shopify.com' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getTechStack',
				expect.objectContaining({
					endpoint: '/gettechstack',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getTechStack(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getCompetitorAnalysis', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getCompetitorAnalysis(mockContext, {
				lookup: 'Databricks',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcompetitoranalysis',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Databricks' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCompetitorAnalysis',
				expect.objectContaining({
					endpoint: '/getcompetitoranalysis',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getCompetitorAnalysis(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getBuyingSignals', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getBuyingSignals(mockContext, {
				lookup: 'SpaceX',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getbuyingsignals',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'SpaceX' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getBuyingSignals',
				expect.objectContaining({
					endpoint: '/getbuyingsignals',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getBuyingSignals(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getPrivateCompanyDealIntel', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getPrivateCompanyDealIntel(
				mockContext,
				{ lookup: 'Anthropic' },
			);
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getprivatecompanydealintel',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Anthropic' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getPrivateCompanyDealIntel',
				expect.objectContaining({
					endpoint: '/getprivatecompanydealintel',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getPrivateCompanyDealIntel(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getNearestCoffeeShops', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getNearestCoffeeShops(mockContext, {
				lookup: 'Union Square, San Francisco',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getnearestcoffeeshops',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						lookup: 'Union Square, San Francisco',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getNearestCoffeeShops',
				expect.objectContaining({
					endpoint: '/getnearestcoffeeshops',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getNearestCoffeeShops(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getUserXHandle', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getUserXHandle(mockContext, {
				lookup: 'San Francisco 49ers',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getuserxhandle',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'San Francisco 49ers' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getUserXHandle',
				expect.objectContaining({
					endpoint: '/getuserxhandle',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getUserXHandle(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getXUserProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getXUserProfile(mockContext, {
				handle: 'lexfridman',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getxuserprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ handle: 'lexfridman' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getXUserProfile',
				expect.objectContaining({
					endpoint: '/getxuserprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getXUserProfile(mockContext, {
				handle: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getXLast3', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getXLast3(mockContext, {
				handle: 'Google',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getxlast3',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ handle: 'Google' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getXLast3',
				expect.objectContaining({
					endpoint: '/getxlast3',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getXLast3(mockContext, {
				handle: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getEsgProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getEsgProfile(mockContext, {
				lookup: 'Microsoft',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getesgprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Microsoft' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getEsgProfile',
				expect.objectContaining({
					endpoint: '/getesgprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getEsgProfile(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getGovContracts', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getGovContracts(mockContext, {
				lookup: 'Lockheed Martin',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getgovcontracts',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Lockheed Martin' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGovContracts',
				expect.objectContaining({
					endpoint: '/getgovcontracts',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getGovContracts(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getFacilitiesProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getFacilitiesProfile(mockContext, {
				lookup: 'Amazon',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getfacilitiesprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Amazon' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getFacilitiesProfile',
				expect.objectContaining({
					endpoint: '/getfacilitiesprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getFacilitiesProfile(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getBuildingProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getBuildingProfile(mockContext, {
				address: '415 Mission St, San Francisco, CA 94105',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getbuildingprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						address: '415 Mission St, San Francisco, CA 94105',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getBuildingProfile',
				expect.objectContaining({
					endpoint: '/getbuildingprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getBuildingProfile(
				mockContext,
				{ address: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getPropertyHistory', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getPropertyHistory(mockContext, {
				address: '600 Montgomery St, San Francisco, CA 94111',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getpropertyhistory',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						address: '600 Montgomery St, San Francisco, CA 94111',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getPropertyHistory',
				expect.objectContaining({
					endpoint: '/getpropertyhistory',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getPropertyHistory(
				mockContext,
				{ address: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getSalesUseTaxRates', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getSalesUseTaxRates(mockContext, {
				lookup: 'Beverly Hills, CA',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getsalesusetaxrates',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Beverly Hills, CA' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getSalesUseTaxRates',
				expect.objectContaining({
					endpoint: '/getsalesusetaxrates',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getSalesUseTaxRates(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getIrsPerDiemRates', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getIrsPerDiemRates(mockContext, {
				lookup: 'New York, NY',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getirsperdiemrates',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'New York, NY' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getIrsPerDiemRates',
				expect.objectContaining({
					endpoint: '/getirsperdiemrates',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getIrsPerDiemRates(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getEuVatRates', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getEuVatRates(mockContext, {
				lookup: 'Germany',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/geteuvatrates',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'Germany' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getEuVatRates',
				expect.objectContaining({
					endpoint: '/geteuvatrates',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getEuVatRates(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getCustomsDutyRates', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getCustomsDutyRates(mockContext, {
				origin: 'China',
				lookup: 'United States',
				hscode: '8471.30.00',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcustomsdutyrates',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						origin: 'China',
						lookup: 'United States',
						hscode: '8471.30.00',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCustomsDutyRates',
				expect.objectContaining({
					endpoint: '/getcustomsdutyrates',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getCustomsDutyRates(
				mockContext,
				{ origin: '', lookup: '', hscode: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getMuniIssuerProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Intelligence.getMuniIssuerProfile(mockContext, {
				lookup: 'State of California',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getmuniissuerprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'State of California' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getMuniIssuerProfile',
				expect.objectContaining({
					endpoint: '/getmuniissuerprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getMuniIssuerProfile(
				mockContext,
				{ lookup: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getCustomData', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				headquarters: 'Armonk, NY',
				ceo: 'Arvind Krishna',
				Code: 'Success',
			});
			const result = await Intelligence.getCustomData(mockContext, {
				topic: 'detailed information about IBM',
				lookup: 'IBM',
				output: 'headquarters,ceo,website',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcustom',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						topic: 'detailed information about IBM',
						lookup: 'IBM',
						output: 'headquarters,ceo,website',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCustomData',
				expect.objectContaining({
					endpoint: '/getcustom',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Intelligence.getCustomData(mockContext, {
				topic: '',
				lookup: '',
				output: '',
				model: 'test',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('intelligence.getCustomData lookup', () => {
		// Interzoid answers 400 "Insufficient parameters: lookup is required"
		// without it (probed 11-20), so the schema refuses the call first.
		it('refuses a call without lookup before any request', async () => {
			const caught: unknown = await Intelligence.getCustomData(mockContext, {
				topic: 'company headquarters',
				output: 'city,country',
			} as never).then(expectedRejection, (e: unknown) => e);
			expect(String(caught)).toContain('lookup');
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getEmailInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Email: 'info@example.com',
				Response: 'Valid',
				Domain: 'example.com',
				IsDisposable: 'No',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getEmailInfo(mockContext, {
				email: 'info@example.com',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getemailinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ email: 'info@example.com' }),
				}),
			);
			expect(result).toMatchObject({
				Email: 'info@example.com',
				Response: 'Valid',
				Domain: 'example.com',
				IsDisposable: 'No',
				Code: 'Success',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getEmailInfo',
				expect.objectContaining({
					endpoint: '/getemailinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getEmailInfo(mockContext, {
				email: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getEmailTrustScore', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Score: '95',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getEmailTrustScore(mockContext, {
				lookup: 'contact@example.com',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/emailtrustscore',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: 'contact@example.com' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getEmailTrustScore',
				expect.objectContaining({
					endpoint: '/emailtrustscore',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getEmailTrustScore(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getEmailDomainType', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getEmailDomainType(mockContext, {
				email: 'user@example.com',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getemaildomaintype',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ email: 'user@example.com' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getEmailDomainType',
				expect.objectContaining({
					endpoint: '/getemaildomaintype',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getEmailDomainType(mockContext, {
				email: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getIpProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getIpProfile(mockContext, {
				lookup: '8.8.8.8',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getipprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: '8.8.8.8' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getIpProfile',
				expect.objectContaining({
					endpoint: '/getipprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getIpProfile(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getPhoneProfile', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getPhoneProfile(mockContext, {
				lookup: '+16502530000',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getphoneprofile',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ lookup: '+16502530000' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getPhoneProfile',
				expect.objectContaining({
					endpoint: '/getphoneprofile',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getPhoneProfile(mockContext, {
				lookup: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getGlobalNumberInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getGlobalNumberInfo(mockContext, {
				intlnumber: '+442071838750',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getglobalnumberinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ intlnumber: '+442071838750' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGlobalNumberInfo',
				expect.objectContaining({
					endpoint: '/getglobalnumberinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getGlobalNumberInfo(
				mockContext,
				{ intlnumber: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getAreaCodeFromNumber', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getAreaCodeFromNumber(mockContext, {
				number: '415-555-1234',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getareacodefromnumber',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ number: '415-555-1234' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getAreaCodeFromNumber',
				expect.objectContaining({
					endpoint: '/getareacodefromnumber',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getAreaCodeFromNumber(
				mockContext,
				{ number: '' },
			).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getAreaCode', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getAreaCode(mockContext, {
				areacode: '415',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getareacode',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ areacode: '415' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getAreaCode',
				expect.objectContaining({
					endpoint: '/getareacode',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getAreaCode(mockContext, {
				areacode: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.getZipCodeInfo', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.getZipCodeInfo(mockContext, {
				zip: '94105',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getzipcodeinfo',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ zip: '94105' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getZipCodeInfo',
				expect.objectContaining({
					endpoint: '/getzipcodeinfo',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.getZipCodeInfo(mockContext, {
				zip: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('validation.addressParse', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Validation.addressParse(mockContext, {
				address: '922 N 5th St Ste 100A, Phoenix, AZ 85004',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/addressparse',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						address: '922 N 5th St Ste 100A, Phoenix, AZ 85004',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_addressParse',
				expect.objectContaining({
					endpoint: '/addressparse',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Validation.addressParse(mockContext, {
				address: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getEntityType', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getEntityType(mockContext, {
				text: 'Argentina',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getentitytype',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ text: 'Argentina' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getEntityType',
				expect.objectContaining({
					endpoint: '/getentitytype',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getEntityType(mockContext, {
				text: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getGender', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getGender(mockContext, { name: 'Pierre' });
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getgender',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ name: 'Pierre' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGender',
				expect.objectContaining({
					endpoint: '/getgender',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getGender(mockContext, {
				name: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getNameOrigin', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getNameOrigin(mockContext, {
				name: 'Pierre',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getnameorigin',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ name: 'Pierre' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getNameOrigin',
				expect.objectContaining({
					endpoint: '/getnameorigin',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getNameOrigin(mockContext, {
				name: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.identifyLanguage', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Language: 'French',
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.identifyLanguage(mockContext, {
				text: 'Bonjour, comment allez-vous?',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/identifylanguage',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						text: 'Bonjour, comment allez-vous?',
					}),
				}),
			);
			expect(result).toMatchObject({
				Language: 'French',
				Code: 'Success',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_identifyLanguage',
				expect.objectContaining({
					endpoint: '/identifylanguage',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.identifyLanguage(mockContext, {
				text: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.translateToEnglish', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.translateToEnglish(mockContext, {
				text: 'Bonjour',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/translatetoenglish',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ text: 'Bonjour' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_translateToEnglish',
				expect.objectContaining({
					endpoint: '/translatetoenglish',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.translateToEnglish(mockContext, {
				text: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.translateToAny', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.translateToAny(mockContext, {
				text: 'Hello',
				to: 'French',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/translatetoany',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ text: 'Hello', to: 'French' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_translateToAny',
				expect.objectContaining({
					endpoint: '/translatetoany',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.translateToAny(mockContext, {
				text: '',
				to: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getGlobalLatency', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getGlobalLatency(mockContext, {
				origin: 'Singapore',
				url: 'https://example.com',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/globallatency',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						origin: 'Singapore',
						url: 'https://example.com',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGlobalLatency',
				expect.objectContaining({
					endpoint: '/globallatency',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getGlobalLatency(mockContext, {
				origin: '',
				url: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getGlobalPageLoad', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getGlobalPageLoad(mockContext, {
				origin: 'London',
				url: 'https://example.com',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/globalpageload',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						origin: 'London',
						url: 'https://example.com',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGlobalPageLoad',
				expect.objectContaining({
					endpoint: '/globalpageload',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getGlobalPageLoad(mockContext, {
				origin: '',
				url: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getCurrencyRate', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getCurrencyRate(mockContext, {
				symbol: 'EUR',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getcurrencyrate',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ symbol: 'EUR' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getCurrencyRate',
				expect.objectContaining({
					endpoint: '/getcurrencyrate',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getCurrencyRate(mockContext, {
				symbol: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.convertCurrency', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.convertCurrency(mockContext, {
				from: 'USD',
				to: 'EUR',
				amount: '100',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/convertcurrency',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({
						from: 'USD',
						to: 'EUR',
						amount: '100',
					}),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_convertCurrency',
				expect.objectContaining({
					endpoint: '/convertcurrency',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.convertCurrency(mockContext, {
				from: '',
				to: '',
				amount: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getWeatherZipCode', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getWeatherZipCode(mockContext, {
				zip: '94105',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getweatherzipcode',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ zip: '94105' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getWeatherZipCode',
				expect.objectContaining({
					endpoint: '/getweatherzipcode',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getWeatherZipCode(mockContext, {
				zip: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getGlobalWeather', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getGlobalWeather(mockContext, {
				location: 'Madrid',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getglobalweather',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ location: 'Madrid' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGlobalWeather',
				expect.objectContaining({
					endpoint: '/getglobalweather',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getGlobalWeather(mockContext, {
				location: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getGlobalTime', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getGlobalTime(mockContext, {
				locale: 'Tokyo',
			});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getglobaltime',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ locale: 'Tokyo' }),
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getGlobalTime',
				expect.objectContaining({
					endpoint: '/getglobaltime',
					status: expect.any(String),
				}),
			);
		});

		it('rejects invalid input before making network request', async () => {
			// `unknown` because a rejection value has no static type; assertions below narrow it.
			const caught: unknown = await Utilities.getGlobalTime(mockContext, {
				locale: '',
			}).then(expectedRejection, (e: unknown) => e);
			expect(caught).toBeDefined();
			expect(mockedMakeRequest).not.toHaveBeenCalled();
		});
	});

	describe('utilities.getRemainingCredits', () => {
		it('executes successfully and parses response', async () => {
			mockedMakeRequest.mockResolvedValueOnce({
				Code: 'Success',
				Credits: 100,
			});
			const result = await Utilities.getRemainingCredits(mockContext, {});
			expect(mockedMakeRequest).toHaveBeenCalledWith(
				'/getremainingcredits',
				'test-api-license-key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
			expect(result).toMatchObject({ Code: 'Success' });
			expect(mockedLogEvent).toHaveBeenCalledWith(
				mockContext,
				'interzoid_getRemainingCredits',
				expect.objectContaining({
					endpoint: '/getremainingcredits',
					status: expect.any(String),
				}),
			);
		});
	});
});

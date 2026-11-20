import {
	InterzoidEndpointInputSchemas,
	InterzoidEndpointOutputSchemas,
} from './endpoints/types';
import { interzoid, interzoidEndpointSchemas } from './index';

describe('Interzoid Schemas', () => {
	it('keeps registry, endpoint schemas, and endpoint metadata in sync', () => {
		const plugin = interzoid();
		const registeredKeys: string[] = [];
		// Heterogeneous endpoint signatures cannot be enumerated as a uniform map without this narrowing.
		const endpoints = plugin.endpoints as object;

		for (const [groupKey, groupEndpoints] of Object.entries(endpoints)) {
			if (typeof groupEndpoints === 'object' && groupEndpoints !== null) {
				for (const opKey of Object.keys(groupEndpoints)) {
					registeredKeys.push(`${groupKey}.${opKey}`);
				}
			}
		}

		const schemaKeys = Object.keys(interzoidEndpointSchemas);
		const metaKeys = Object.keys(plugin.endpointMeta ?? {});

		registeredKeys.sort();
		schemaKeys.sort();
		metaKeys.sort();

		expect(schemaKeys).toEqual(registeredKeys);
		expect(metaKeys).toEqual(registeredKeys);
	});

	// Metered lookups stay `read` (R8): a call spends credits but changes nothing.
	it('marks every metered lookup as read', () => {
		const plugin = interzoid();
		const endpointMeta = plugin.endpointMeta ?? {};

		for (const metadata of Object.values(endpointMeta)) {
			expect(metadata.riskLevel).toBe('read');
		}
	});

	describe('getCompanyMatchAdvanced', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getCompanyMatchAdvanced.parse({
					company: 'IBM Corporation',
					algorithm: 'model-v4-wide',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getCompanyMatchAdvanced.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCompanyMatchAdvanced.parse({
					company: 'IBM Corporation',
					algorithm: 'model-v4-wide',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getFullNameMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getFullNameMatch.parse({
				fullname: 'James Kelly',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getFullNameMatch.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getFullNameMatch.parse({
					fullname: 'James Kelly',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getAddressMatchAdvanced', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getAddressMatchAdvanced.parse({
					address: '400 East Broadway',
					algorithm: 'model-v3-narrow',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getAddressMatchAdvanced.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getAddressMatchAdvanced.parse({
					address: '400 East Broadway',
					algorithm: 'model-v3-narrow',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getAddressAndFullNameMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getAddressAndFullNameMatch.parse({
					address: '100 Main St',
					fullname: 'James Kelly',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getAddressAndFullNameMatch.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getAddressAndFullNameMatch.parse({
					address: '100 Main St',
					fullname: 'James Kelly',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCompanyAndAddressMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getCompanyAndAddressMatch.parse({
					company: 'IBM Corp',
					address: '1 New Orchard Road',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getCompanyAndAddressMatch.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCompanyAndAddressMatch.parse({
					company: 'IBM Corp',
					address: '1 New Orchard Road',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCompanyAndFullNameMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getCompanyAndFullNameMatch.parse({
					company: 'IBM Corp',
					fullname: 'James Kelly',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getCompanyAndFullNameMatch.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCompanyAndFullNameMatch.parse({
					company: 'IBM Corp',
					fullname: 'James Kelly',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGlobalAddressMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getGlobalAddressMatch.parse({
					address: 'Piazza del Colosseo, 1, Rome, Italy',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getGlobalAddressMatch.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGlobalAddressMatch.parse({
					address: 'Piazza del Colosseo, 1, Rome, Italy',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getProductMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getProductMatch.parse({
				product: 'Dell OptiPlex 7020 Desktop Computer',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getProductMatch.parse(
				{ SimKey: 'mock_simkey_123', Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getProductMatch.parse({
					product: 'Dell OptiPlex 7020 Desktop Computer',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getOrgMatchScore', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getOrgMatchScore.parse({
				org1: 'Amazon.com',
				org2: 'Amazon Inc.',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getOrgMatchScore.parse({
					Score: '95',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getOrgMatchScore.parse({
					org1: 'Amazon.com',
					org2: 'Amazon Inc.',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getFullNameMatchScore', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getFullNameMatchScore.parse({
					fullname1: 'James Kelly',
					fullname2: 'Jim Kelly',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getFullNameMatchScore.parse({
					Score: '95',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getFullNameMatchScore.parse({
					fullname1: 'James Kelly',
					fullname2: 'Jim Kelly',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCompanyMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getCompanyMatch.parse({
				company: 'International Business Machines',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getCompanyMatch.parse(
				{ SimKey: 'mock_simkey_123', Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCompanyMatch.parse({
					company: 'International Business Machines',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getAddressMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getAddressMatch.parse({
				address: '500 Oak Drive',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getAddressMatch.parse(
				{ SimKey: 'mock_simkey_123', Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getAddressMatch.parse({
					address: '500 Oak Drive',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getFullNameParsedMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getFullNameParsedMatch.parse({
					firstname: 'James',
					lastname: 'Kelly',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getFullNameParsedMatch.parse({
					SimKey: 'mock_simkey_123',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getFullNameParsedMatch.parse({
					firstname: 'James',
					lastname: 'Kelly',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCityMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getCityMatch.parse({
				city: 'San Francisco',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getCityMatch.parse({
				SimKey: 'mock_simkey_123',
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCityMatch.parse({
					city: 'San Francisco',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCountryMatch', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getCountryMatch.parse({
				country: 'United States',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getCountryMatch.parse(
				{ SimKey: 'mock_simkey_123', Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCountryMatch.parse({
					country: 'United States',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getOrgStandard', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getOrgStandard.parse({
				org: 'b.o.a.',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getOrgStandard.parse({
				Standard: 'Standard Name',
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getOrgStandard.parse({
					org: 'b.o.a.',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCountryStandard', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getCountryStandard.parse({
					country: 'Deutschland',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getCountryStandard.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCountryStandard.parse({
					country: 'Deutschland',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCountryInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getCountryInfo.parse({
				country: 'France',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getCountryInfo.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCountryInfo.parse({
					country: 'France',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getStateAbbreviation', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getStateAbbreviation.parse({
					state: 'California',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getStateAbbreviation.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getStateAbbreviation.parse({
					state: 'California',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCityStandard', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getCityStandard.parse({
				city: 'NYC',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getCityStandard.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCityStandard.parse({
					city: 'NYC',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getOfficialName', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getOfficialName.parse({
				lookup: 'Apple',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getOfficialName.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getOfficialName.parse({
					lookup: 'Apple',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getBusinessInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getBusinessInfo.parse({
				lookup: 'Cisco',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getBusinessInfo.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getBusinessInfo.parse({
					lookup: 'Cisco',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getParentCompanyInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getParentCompanyInfo.parse({
					lookup: 'Informatica',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getParentCompanyInfo.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getParentCompanyInfo.parse({
					lookup: 'Informatica',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getExecutiveProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getExecutiveProfile.parse({
					lookup: 'Amazon Web Services CEO',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getExecutiveProfile.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getExecutiveProfile.parse({
					lookup: 'Amazon Web Services CEO',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getBusinessInfoDomain', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getBusinessInfoDomain.parse({
					lookup: 'Microsoft',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getBusinessInfoDomain.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getBusinessInfoDomain.parse({
					lookup: 'Microsoft',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getBusinessInfoName', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getBusinessInfoName.parse({
					lookup: 'Microsoft',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getBusinessInfoName.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getBusinessInfoName.parse({
					lookup: 'Microsoft',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCompanyVerification', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getCompanyVerification.parse({
					lookup: 'Microsoft Corporation',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getCompanyVerification.parse({
					Score: '95',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCompanyVerification.parse({
					lookup: 'Microsoft Corporation',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getStockInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getStockInfo.parse({
				lookup: 'NVDA',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getStockInfo.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getStockInfo.parse({
					lookup: 'NVDA',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getIndustryCodes', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getIndustryCodes.parse({
				lookup: 'Oracle Corporation',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getIndustryCodes.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getIndustryCodes.parse({
					lookup: 'Oracle Corporation',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getSicCodes', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getSicCodes.parse({
				lookup: 'Safeway Inc.',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getSicCodes.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getSicCodes.parse({
					lookup: 'Safeway Inc.',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getUniversityInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getUniversityInfo.parse(
				{ lookup: 'The Ohio State University' },
			);
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getUniversityInfo.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getUniversityInfo.parse({
					lookup: 'The Ohio State University',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getProductRecallInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getProductRecallInfo.parse({
					lookup: 'Kirkland Signature Prosecco',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getProductRecallInfo.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getProductRecallInfo.parse({
					lookup: 'Kirkland Signature Prosecco',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getTechStack', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getTechStack.parse({
				lookup: 'shopify.com',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getTechStack.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getTechStack.parse({
					lookup: 'shopify.com',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCompetitorAnalysis', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getCompetitorAnalysis.parse({
					lookup: 'Databricks',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getCompetitorAnalysis.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCompetitorAnalysis.parse({
					lookup: 'Databricks',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getBuyingSignals', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getBuyingSignals.parse({
				lookup: 'SpaceX',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getBuyingSignals.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getBuyingSignals.parse({
					lookup: 'SpaceX',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getPrivateCompanyDealIntel', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getPrivateCompanyDealIntel.parse({
					lookup: 'Anthropic',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getPrivateCompanyDealIntel.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getPrivateCompanyDealIntel.parse({
					lookup: 'Anthropic',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getNearestCoffeeShops', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getNearestCoffeeShops.parse({
					lookup: 'Union Square, San Francisco',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getNearestCoffeeShops.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getNearestCoffeeShops.parse({
					lookup: 'Union Square, San Francisco',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getUserXHandle', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getUserXHandle.parse({
				lookup: 'San Francisco 49ers',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getUserXHandle.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getUserXHandle.parse({
					lookup: 'San Francisco 49ers',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getXUserProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getXUserProfile.parse({
				handle: 'lexfridman',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getXUserProfile.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getXUserProfile.parse({
					handle: 'lexfridman',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getXLast3', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getXLast3.parse({
				handle: 'Google',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getXLast3.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getXLast3.parse({
					handle: 'Google',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getEsgProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getEsgProfile.parse({
				lookup: 'Microsoft',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getEsgProfile.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getEsgProfile.parse({
					lookup: 'Microsoft',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGovContracts', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getGovContracts.parse({
				lookup: 'Lockheed Martin',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getGovContracts.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGovContracts.parse({
					lookup: 'Lockheed Martin',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getFacilitiesProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getFacilitiesProfile.parse({
					lookup: 'Amazon',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getFacilitiesProfile.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getFacilitiesProfile.parse({
					lookup: 'Amazon',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getBuildingProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getBuildingProfile.parse({
					address: '415 Mission St, San Francisco, CA 94105',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getBuildingProfile.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getBuildingProfile.parse({
					address: '415 Mission St, San Francisco, CA 94105',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getPropertyHistory', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getPropertyHistory.parse({
					address: '600 Montgomery St, San Francisco, CA 94111',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getPropertyHistory.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getPropertyHistory.parse({
					address: '600 Montgomery St, San Francisco, CA 94111',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getSalesUseTaxRates', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getSalesUseTaxRates.parse({
					lookup: 'Beverly Hills, CA',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getSalesUseTaxRates.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getSalesUseTaxRates.parse({
					lookup: 'Beverly Hills, CA',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getIrsPerDiemRates', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getIrsPerDiemRates.parse({
					lookup: 'New York, NY',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getIrsPerDiemRates.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getIrsPerDiemRates.parse({
					lookup: 'New York, NY',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getEuVatRates', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getEuVatRates.parse({
				lookup: 'Germany',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getEuVatRates.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getEuVatRates.parse({
					lookup: 'Germany',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCustomsDutyRates', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getCustomsDutyRates.parse({
					origin: 'China',
					lookup: 'United States',
					hscode: '8471.30.00',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getCustomsDutyRates.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCustomsDutyRates.parse({
					origin: 'China',
					lookup: 'United States',
					hscode: '8471.30.00',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getMuniIssuerProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getMuniIssuerProfile.parse({
					lookup: 'State of California',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getMuniIssuerProfile.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getMuniIssuerProfile.parse({
					lookup: 'State of California',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCustomData', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getCustomData.parse({
				topic: 'detailed information about IBM',
				output: 'headquarters,ceo,website',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getCustomData.parse({
				headquarters: 'Armonk, NY',
				ceo: 'Arvind Krishna',
				Code: 'Success',
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCustomData.parse({
					topic: 'detailed information about IBM',
					output: 'headquarters,ceo,website',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getEmailInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getEmailInfo.parse({
				email: 'info@example.com',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getEmailInfo.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getEmailInfo.parse({
					email: 'info@example.com',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getEmailTrustScore', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getEmailTrustScore.parse({
					lookup: 'contact@example.com',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getEmailTrustScore.parse({
					Score: '95',
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getEmailTrustScore.parse({
					lookup: 'contact@example.com',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getEmailDomainType', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getEmailDomainType.parse({
					email: 'user@example.com',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getEmailDomainType.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getEmailDomainType.parse({
					email: 'user@example.com',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getIpProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getIpProfile.parse({
				lookup: '8.8.8.8',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getIpProfile.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getIpProfile.parse({
					lookup: '8.8.8.8',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getPhoneProfile', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getPhoneProfile.parse({
				lookup: '+16502530000',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getPhoneProfile.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getPhoneProfile.parse({
					lookup: '+16502530000',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGlobalNumberInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getGlobalNumberInfo.parse({
					intlnumber: '+442071838750',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getGlobalNumberInfo.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGlobalNumberInfo.parse({
					intlnumber: '+442071838750',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getAreaCodeFromNumber', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getAreaCodeFromNumber.parse({
					number: '415-555-1234',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getAreaCodeFromNumber.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getAreaCodeFromNumber.parse({
					number: '415-555-1234',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getAreaCode', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getAreaCode.parse({
				areacode: '415',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getAreaCode.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getAreaCode.parse({
					areacode: '415',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getZipCodeInfo', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getZipCodeInfo.parse({
				zip: '94105',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getZipCodeInfo.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getZipCodeInfo.parse({
					zip: '94105',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('addressParse', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.addressParse.parse({
				address: '922 N 5th St Ste 100A, Phoenix, AZ 85004',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.addressParse.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.addressParse.parse({
					address: '922 N 5th St Ste 100A, Phoenix, AZ 85004',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getEntityType', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getEntityType.parse({
				text: 'Argentina',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getEntityType.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getEntityType.parse({
					text: 'Argentina',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGender', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getGender.parse({
				name: 'Pierre',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getGender.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGender.parse({
					name: 'Pierre',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getNameOrigin', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getNameOrigin.parse({
				name: 'Pierre',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getNameOrigin.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getNameOrigin.parse({
					name: 'Pierre',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('identifyLanguage', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.identifyLanguage.parse({
				text: 'Bonjour, comment allez-vous?',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.identifyLanguage.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.identifyLanguage.parse({
					text: 'Bonjour, comment allez-vous?',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('translateToEnglish', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.translateToEnglish.parse({
					text: 'Bonjour',
				});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.translateToEnglish.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.translateToEnglish.parse({
					text: 'Bonjour',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('translateToAny', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.translateToAny.parse({
				text: 'Hello',
				to: 'French',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.translateToAny.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.translateToAny.parse({
					text: 'Hello',
					to: 'French',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGlobalLatency', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getGlobalLatency.parse({
				origin: 'Singapore',
				url: 'https://example.com',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getGlobalLatency.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGlobalLatency.parse({
					origin: 'Singapore',
					url: 'https://example.com',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGlobalPageLoad', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getGlobalPageLoad.parse(
				{ origin: 'London', url: 'https://example.com' },
			);
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getGlobalPageLoad.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGlobalPageLoad.parse({
					origin: 'London',
					url: 'https://example.com',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getCurrencyRate', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getCurrencyRate.parse({
				symbol: 'EUR',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getCurrencyRate.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getCurrencyRate.parse({
					symbol: 'EUR',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('convertCurrency', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.convertCurrency.parse({
				from: 'USD',
				to: 'EUR',
				amount: '100',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.convertCurrency.parse(
				{ Code: 'Success', Credits: 100 },
			);
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.convertCurrency.parse({
					from: 'USD',
					to: 'EUR',
					amount: '100',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getWeatherZipCode', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getWeatherZipCode.parse(
				{ zip: '94105' },
			);
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getWeatherZipCode.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getWeatherZipCode.parse({
					zip: '94105',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGlobalWeather', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getGlobalWeather.parse({
				location: 'Madrid',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getGlobalWeather.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGlobalWeather.parse({
					location: 'Madrid',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getGlobalTime', () => {
		it('validates valid input and output', () => {
			const parsedInput = InterzoidEndpointInputSchemas.getGlobalTime.parse({
				locale: 'Tokyo',
			});
			expect(parsedInput).toBeDefined();
			const parsedOutput = InterzoidEndpointOutputSchemas.getGlobalTime.parse({
				Code: 'Success',
				Credits: 100,
			});
			expect(parsedOutput).toBeDefined();
		});
		it('rejects unknown query fields due to strict schema', () => {
			expect(() => {
				InterzoidEndpointInputSchemas.getGlobalTime.parse({
					locale: 'Tokyo',
					unexpected_field: 'disallowed',
				});
			}).toThrow();
		});
	});

	describe('getRemainingCredits', () => {
		it('validates valid input and output', () => {
			const parsedInput =
				InterzoidEndpointInputSchemas.getRemainingCredits.parse({});
			expect(parsedInput).toBeDefined();
			const parsedOutput =
				InterzoidEndpointOutputSchemas.getRemainingCredits.parse({
					Code: 'Success',
					Credits: 100,
				});
			expect(parsedOutput).toBeDefined();
		});
	});
});

// Generated from the GMI Cloud OpenAPI spec: https://docs.gmicloud.ai/api-spec/ids-public-api.yaml
import { z } from 'zod';

// Information about the IDC.
export const IdcInfo = z.object({
	idcId: z.string().describe('The unique identifier for the IDC'),
	name: z.string().describe('The IDC name.'),
	country: z
		.string()
		.describe(
			'The country where the IDC is located, represented by the ISO 3166-1 alpha-2 country code.',
		),
	countrySubdivision: z
		.string()
		.describe(
			'The subdivision of the country where the IDC is located, represented by the ISO 3166-2 code.',
		),
	status: z
		.enum(['available', 'full', 'maintenance'])
		.describe('The IDC status.'),
});

export const ListIDCsResponse = z.object({
	idcs: z.array(IdcInfo).describe('A list of IDCs.'),
});

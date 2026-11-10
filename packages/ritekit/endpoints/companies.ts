import type { RiteKitEndpoints } from '..';
import { call } from './call';
import {
	RiteKitEndpointInputSchemas as Inputs,
	RiteKitEndpointOutputSchemas as Outputs,
} from './types';

export const logo: RiteKitEndpoints['companiesLogo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'companies.logo',
			input: Inputs.companiesLogo,
			output: Outputs.companiesLogo,
		},
		input,
		({
			domain,
			generateFallbackLogo,
			squareLogoSize,
			squareLogoBackground,
		}) => ({
			method: 'GET',
			path: '/v2/company-insights/logo',
			query: {
				domain,
				generateFallbackLogo:
					generateFallbackLogo === undefined
						? undefined
						: generateFallbackLogo
							? 1
							: 0,
				squareLogoSize,
				squareLogoBackground,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				generated: result.isGenerated ?? undefined,
				found: result.url !== undefined && result.url !== null,
			}),
		},
	);

export const nameToDomain: RiteKitEndpoints['companiesNameToDomain'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.nameToDomain',
			input: Inputs.companiesNameToDomain,
			output: Outputs.companiesNameToDomain,
		},
		input,
		({ name }) => ({
			method: 'GET',
			path: '/v2/company-insights/name-to-domain',
			query: { name },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.domains?.length ?? 0 }),
		},
	);

export const brandColors: RiteKitEndpoints['companiesBrandColors'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'companies.brandColors',
			input: Inputs.companiesBrandColors,
			output: Outputs.companiesBrandColors,
		},
		input,
		// The route takes the domain or name under the parameter `name`.
		({ name }) => ({
			method: 'GET',
			path: '/v2/company-insights/brand-colors',
			query: { name },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.data?.length ?? 0 }),
		},
	);

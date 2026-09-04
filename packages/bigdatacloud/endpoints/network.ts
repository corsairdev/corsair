import { logEventFromContext } from 'corsair/core';
import { makeBigDataCloudRequest } from '../client';
import type { BigDataCloudEndpoints } from '../index';
import { safely } from './persist';
import {
	BigDataCloudEndpointInputSchemas,
	BigDataCloudEndpointOutputSchemas,
} from './types';

export const networkByIpAddress: BigDataCloudEndpoints['networkByIpAddress'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.networkByIpAddress.parse(input);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['networkByIpAddress']>>
		>('network-by-ip', ctx.key, {
			method: 'GET',
			query: {
				ip: parsed.ip,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.networkByIpAddress,
		});

		if (response && ctx.db?.networks) {
			await safely(`network ${parsed.ip}`, () =>
				ctx.db.networks.upsertByEntityId(parsed.ip, {
					id: parsed.ip,
					ip: response.ip,
					registry: response.registry,
					registryStatus: response.registryStatus,
					registeredCountry: response.registeredCountry,
					registeredCountryName: response.registeredCountryName,
					organisation: response.organisation,
					isReachableGlobally: response.isReachableGlobally,
					isBogon: response.isBogon,
					bgpPrefix: response.bgpPrefix,
					bgpPrefixNetworkAddress: response.bgpPrefixNetworkAddress,
					bgpPrefixLastAddress: response.bgpPrefixLastAddress,
					totalAddresses: response.totalAddresses,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.network.networkByIpAddress',
			{ ip: parsed.ip },
			'completed',
		);

		return response;
	};

export const networksByCidr: BigDataCloudEndpoints['networksByCidr'] = async (
	ctx,
	input,
) => {
	const parsed = BigDataCloudEndpointInputSchemas.networksByCidr.parse(input);

	const response = await makeBigDataCloudRequest<
		Awaited<ReturnType<BigDataCloudEndpoints['networksByCidr']>>
	>('network-by-cidr', ctx.key, {
		method: 'GET',
		query: {
			cidr: parsed.cidr,
			localityLanguage: parsed.localityLanguage,
		},
		schema: BigDataCloudEndpointOutputSchemas.networksByCidr,
	});

	if (response && ctx.db?.networks) {
		await safely(`network cidr ${parsed.cidr}`, () =>
			ctx.db.networks.upsertByEntityId(parsed.cidr, {
				id: parsed.cidr,
				cidr: response.cidr,
				bgpPrefix: response.cidr,
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'bigdatacloud.network.networksByCidr',
		{ cidr: parsed.cidr },
		'completed',
	);

	return response;
};

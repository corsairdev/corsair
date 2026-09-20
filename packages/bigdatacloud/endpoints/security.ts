import { logEventFromContext } from 'corsair/core';
import { makeBigDataCloudRequest } from '../client';
import type { BigDataCloudEndpoints } from '../index';
import { safely } from './persist';
import {
	BigDataCloudEndpointInputSchemas,
	BigDataCloudEndpointOutputSchemas,
} from './types';

export const hazardReport: BigDataCloudEndpoints['hazardReport'] = async (
	ctx,
	input,
) => {
	const parsed = BigDataCloudEndpointInputSchemas.hazardReport.parse(input);

	const response = await makeBigDataCloudRequest<
		Awaited<ReturnType<BigDataCloudEndpoints['hazardReport']>>
	>('hazard-report', ctx.key, {
		method: 'GET',
		query: {
			ip: parsed.ip,
		},
		schema: BigDataCloudEndpointOutputSchemas.hazardReport,
	});

	if (response && ctx.db?.hazardReports) {
		await safely(`hazardReport ${parsed.ip}`, () =>
			ctx.db.hazardReports.upsertByEntityId(parsed.ip, {
				id: parsed.ip,
				ip: parsed.ip,
				isKnownAsTorServer: response.isKnownAsTorServer,
				isKnownAsVpn: response.isKnownAsVpn,
				isKnownAsProxy: response.isKnownAsProxy,
				isSpamhausDrop: response.isSpamhausDrop,
				isSpamhausEdrop: response.isSpamhausEdrop,
				isSpamhausAsnDrop: response.isSpamhausAsnDrop,
				isBlacklistedUceprotect: response.isBlacklistedUceprotect,
				isBlacklistedBlocklistDe: response.isBlacklistedBlocklistDe,
				isKnownAsMailServer: response.isKnownAsMailServer,
				isKnownAsPublicRouter: response.isKnownAsPublicRouter,
				isBogon: response.isBogon,
				isUnreachable: response.isUnreachable,
				hostingLikelihood: response.hostingLikelihood,
				isHostingAsn: response.isHostingAsn,
				isCellular: response.isCellular,
				iCloudPrivateRelay: response.iCloudPrivateRelay,
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'bigdatacloud.security.hazardReport',
		{ ip: parsed.ip },
		'completed',
	);

	return response;
};

export const torExitNodesGeolocated: BigDataCloudEndpoints['torExitNodesGeolocated'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.torExitNodesGeolocated.parse(input);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['torExitNodesGeolocated']>>
		>('tor-exit-nodes-list', ctx.key, {
			method: 'GET',
			query: {
				batchSize: parsed.batchSize,
				offset: parsed.offset,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.torExitNodesGeolocated,
		});

		if (response?.nodes && ctx.db?.torExitNodes) {
			for (const node of response.nodes) {
				if (node.ip) {
					await safely(`torExitNode ${node.ip}`, () =>
						ctx.db.torExitNodes.upsertByEntityId(node.ip, {
							id: node.ip,
							ip: node.ip,
							countryName: node.countryName,
							countryCode: node.countryCode,
							asn: node.carriers?.[0]?.asn,
							organisation: node.carriers?.[0]?.organisation,
						}),
					);
				}
			}
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.security.torExitNodesGeolocated',
			{ batchSize: parsed.batchSize, offset: parsed.offset },
			'completed',
		);

		return response;
	};

export const userRisk: BigDataCloudEndpoints['userRisk'] = async (
	ctx,
	input,
) => {
	const parsed = BigDataCloudEndpointInputSchemas.userRisk.parse(input);

	const response = await makeBigDataCloudRequest<
		Awaited<ReturnType<BigDataCloudEndpoints['userRisk']>>
	>('user-risk', ctx.key, {
		method: 'GET',
		query: {
			ip: parsed.ip,
		},
		schema: BigDataCloudEndpointOutputSchemas.userRisk,
	});

	if (response && ctx.db?.userRisks) {
		await safely(`userRisk ${parsed.ip}`, () =>
			ctx.db.userRisks.upsertByEntityId(parsed.ip, {
				id: parsed.ip,
				ip: parsed.ip,
				risk: response.risk,
				description: response.description,
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'bigdatacloud.security.userRisk',
		{ ip: parsed.ip },
		'completed',
	);

	return response;
};

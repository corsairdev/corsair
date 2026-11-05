import { logEventFromContext } from 'corsair/core';
import { makeBigDataCloudRequest } from '../client';
import type { BigDataCloudEndpoints } from '../index';
import { safely } from './persist';
import {
	BigDataCloudEndpointInputSchemas,
	BigDataCloudEndpointOutputSchemas,
} from './types';

export const asnExtendedReceivingFromInfo: BigDataCloudEndpoints['asnExtendedReceivingFromInfo'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.asnExtendedReceivingFromInfo.parse(
				input,
			);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['asnExtendedReceivingFromInfo']>>
		>('asn-info-receiving-from', ctx.key, {
			method: 'GET',
			query: {
				asn: parsed.asn,
				batchSize: parsed.batchSize,
				offset: parsed.offset,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.asnExtendedReceivingFromInfo,
		});

		if (response && ctx.db?.asns) {
			await safely(`asn ${response.asn}`, () =>
				ctx.db.asns.upsertByEntityId(response.asn, {
					id: response.asn,
					asn: response.asn,
					asnNumeric: response.asnNumeric,
					name: response.name,
					organisation: response.organisation,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.asn.asnExtendedReceivingFromInfo',
			{ asn: parsed.asn },
			'completed',
		);

		return response;
	};

export const asnExtendedTransitToInfo: BigDataCloudEndpoints['asnExtendedTransitToInfo'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.asnExtendedTransitToInfo.parse(input);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['asnExtendedTransitToInfo']>>
		>('asn-info-transit-to', ctx.key, {
			method: 'GET',
			query: {
				asn: parsed.asn,
				batchSize: parsed.batchSize,
				offset: parsed.offset,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.asnExtendedTransitToInfo,
		});

		if (response && ctx.db?.asns) {
			await safely(`asn ${response.asn}`, () =>
				ctx.db.asns.upsertByEntityId(response.asn, {
					id: response.asn,
					asn: response.asn,
					asnNumeric: response.asnNumeric,
					name: response.name,
					organisation: response.organisation,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.asn.asnExtendedTransitToInfo',
			{ asn: parsed.asn },
			'completed',
		);

		return response;
	};

export const asnRankList: BigDataCloudEndpoints['asnRankList'] = async (
	ctx,
	input,
) => {
	const parsed = BigDataCloudEndpointInputSchemas.asnRankList.parse(input);

	const response = await makeBigDataCloudRequest<
		Awaited<ReturnType<BigDataCloudEndpoints['asnRankList']>>
	>('asn-rank-list', ctx.key, {
		method: 'GET',
		query: {
			batchSize: parsed.batchSize,
			offset: parsed.offset,
			sort: parsed.sort,
			order: parsed.order,
			localityLanguage: parsed.localityLanguage,
		},
		schema: BigDataCloudEndpointOutputSchemas.asnRankList,
	});

	if (response?.asns && ctx.db?.asns) {
		for (const asn of response.asns) {
			if (asn.asn && asn.asnNumeric !== undefined) {
				await safely(`asn ${asn.asn}`, () =>
					ctx.db.asns.upsertByEntityId(asn.asn!, {
						id: asn.asn!,
						asn: asn.asn!,
						asnNumeric: asn.asnNumeric!,
						name: asn.name,
						organisation: asn.organisation,
						registry: asn.registry,
						registeredCountry: asn.registeredCountry,
						registeredCountryName: asn.registeredCountryName,
						totalIpv4Addresses: asn.totalIpv4Addresses,
						rank: asn.rank,
						rankText: asn.rankText,
					}),
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'bigdatacloud.asn.asnRankList',
		{ batchSize: parsed.batchSize, offset: parsed.offset },
		'completed',
	);

	return response;
};

export const bgpActivePrefixes: BigDataCloudEndpoints['bgpActivePrefixes'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.bgpActivePrefixes.parse(input);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['bgpActivePrefixes']>>
		>('prefixes-list', ctx.key, {
			method: 'GET',
			query: {
				asn: parsed.asn,
				isv4: parsed.isv4,
				bogonsOnly: parsed.bogonsOnly,
				batchSize: parsed.batchSize,
				offset: parsed.offset,
				sort: parsed.sort,
				order: parsed.order,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.bgpActivePrefixes,
		});

		if (response?.prefixes && ctx.db?.bgpPrefixes) {
			for (const prefix of response.prefixes) {
				if (prefix.bgpPrefix) {
					await safely(`bgpPrefix ${prefix.bgpPrefix}`, () =>
						ctx.db.bgpPrefixes.upsertByEntityId(prefix.bgpPrefix, {
							id: prefix.bgpPrefix,
							bgpPrefix: prefix.bgpPrefix,
							bgpPrefixNetworkAddress: prefix.bgpPrefixNetworkAddress,
							bgpPrefixLastAddress: prefix.bgpPrefixLastAddress,
							registryStatus: prefix.registryStatus,
							isBogon: prefix.isBogon,
							isAnnounced: prefix.isAnnounced,
							asn: parsed.asn,
						}),
					);
				}
			}
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.asn.bgpActivePrefixes',
			{ asn: parsed.asn },
			'completed',
		);

		return response;
	};

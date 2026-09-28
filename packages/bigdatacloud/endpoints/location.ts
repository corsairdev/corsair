import { logEventFromContext } from 'corsair/core';
import { makeBigDataCloudRequest } from '../client';
import type { BigDataCloudEndpoints } from '../index';
import { safely } from './persist';
import {
	BigDataCloudEndpointInputSchemas,
	BigDataCloudEndpointOutputSchemas,
} from './types';

export const countryInfo: BigDataCloudEndpoints['countryInfo'] = async (
	ctx,
	input,
) => {
	const parsed = BigDataCloudEndpointInputSchemas.countryInfo.parse(input);

	const response = await makeBigDataCloudRequest<
		Awaited<ReturnType<BigDataCloudEndpoints['countryInfo']>>
	>('country-info', ctx.key, {
		method: 'GET',
		query: {
			code: parsed.code,
			localityLanguage: parsed.localityLanguage,
		},
		schema: BigDataCloudEndpointOutputSchemas.countryInfo,
	});

	if (response && ctx.db?.countries) {
		await safely(`country ${response.isoAlpha2}`, () =>
			ctx.db.countries.upsertByEntityId(response.isoAlpha2, {
				id: response.isoAlpha2,
				isoAlpha2: response.isoAlpha2,
				isoAlpha3: response.isoAlpha3,
				m49Code: response.m49Code,
				name: response.name,
				isoName: response.isoName,
				isoNameFull: response.isoNameFull,
				isoAdminLanguages: response.isoAdminLanguages,
				unRegion: response.unRegion,
				currency: response.currency,
				wbRegion: response.wbRegion,
				wbIncomeLevel: response.wbIncomeLevel,
				callingCode: response.callingCode,
				countryFlagEmoji: response.countryFlagEmoji,
				wikidataId: response.wikidataId,
				geonameId: response.geonameId,
				isIndependent: response.isIndependent,
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'bigdatacloud.location.countryInfo',
		{ code: parsed.code },
		'completed',
	);

	return response;
};

export const countryByIpAddress: BigDataCloudEndpoints['countryByIpAddress'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.countryByIpAddress.parse(input);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['countryByIpAddress']>>
		>('country-by-ip', ctx.key, {
			method: 'GET',
			query: {
				ip: parsed.ip,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.countryByIpAddress,
		});

		if (response?.country && ctx.db?.countries) {
			await safely(`country by ip ${parsed.ip}`, () =>
				ctx.db.countries.upsertByEntityId(response.country!.isoAlpha2, {
					id: response.country!.isoAlpha2,
					isoAlpha2: response.country!.isoAlpha2,
					isoAlpha3: response.country!.isoAlpha3,
					m49Code: response.country!.m49Code,
					name: response.country!.name,
					isoName: response.country!.isoName,
					isoNameFull: response.country!.isoNameFull,
					isoAdminLanguages: response.country!.isoAdminLanguages,
					unRegion: response.country!.unRegion,
					currency: response.country!.currency,
					wbRegion: response.country!.wbRegion,
					wbIncomeLevel: response.country!.wbIncomeLevel,
					callingCode: response.country!.callingCode,
					countryFlagEmoji: response.country!.countryFlagEmoji,
					wikidataId: response.country!.wikidataId,
					geonameId: response.country!.geonameId,
					isIndependent: response.country!.isIndependent,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.location.countryByIpAddress',
			{ ip: parsed.ip },
			'completed',
		);

		return response;
	};

export const reverseGeocodingWithTimezone: BigDataCloudEndpoints['reverseGeocodingWithTimezone'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.reverseGeocodingWithTimezone.parse(
				input,
			);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['reverseGeocodingWithTimezone']>>
		>('reverse-geocode-with-timezone', ctx.key, {
			method: 'GET',
			query: {
				latitude: parsed.latitude,
				longitude: parsed.longitude,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.reverseGeocodingWithTimezone,
		});

		const entityId = `${parsed.latitude},${parsed.longitude}`;
		if (response && ctx.db?.reverseGeocodes) {
			await safely(`reverseGeocode ${entityId}`, () =>
				ctx.db.reverseGeocodes.upsertByEntityId(entityId, {
					id: entityId,
					latitude: response.latitude,
					longitude: response.longitude,
					continent: response.continent,
					continentCode: response.continentCode,
					countryName: response.countryName,
					countryCode: response.countryCode,
					principalSubdivision: response.principalSubdivision,
					principalSubdivisionCode: response.principalSubdivisionCode,
					city: response.city,
					locality: response.locality,
					postcode: response.postcode,
					plusCode: response.plusCode,
				}),
			);
		}

		if (response?.timeZone && ctx.db?.timezones) {
			await safely(`timezone ${response.timeZone.ianaTimeId}`, () =>
				ctx.db.timezones.upsertByEntityId(response.timeZone!.ianaTimeId, {
					id: response.timeZone!.ianaTimeId,
					ianaTimeId: response.timeZone!.ianaTimeId,
					displayName: response.timeZone!.displayName,
					effectiveTimeZoneFull: response.timeZone!.effectiveTimeZoneFull,
					effectiveTimeZoneShort: response.timeZone!.effectiveTimeZoneShort,
					utcOffsetSeconds: response.timeZone!.utcOffsetSeconds,
					utcOffset: response.timeZone!.utcOffset,
					isDaylightSavingTime: response.timeZone!.isDaylightSavingTime,
					localTime: response.timeZone!.localTime,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.location.reverseGeocodingWithTimezone',
			{ latitude: parsed.latitude, longitude: parsed.longitude },
			'completed',
		);

		return response;
	};

export const timeZoneByIpAddress: BigDataCloudEndpoints['timeZoneByIpAddress'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.timeZoneByIpAddress.parse(input);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['timeZoneByIpAddress']>>
		>('timezone-by-ip', ctx.key, {
			method: 'GET',
			query: {
				ip: parsed.ip,
				utcReference: parsed.utcReference,
			},
			schema: BigDataCloudEndpointOutputSchemas.timeZoneByIpAddress,
		});

		if (response && ctx.db?.timezones) {
			await safely(`timezone ${response.ianaTimeId}`, () =>
				ctx.db.timezones.upsertByEntityId(response.ianaTimeId, {
					id: response.ianaTimeId,
					ianaTimeId: response.ianaTimeId,
					displayName: response.displayName,
					effectiveTimeZoneFull: response.effectiveTimeZoneFull,
					effectiveTimeZoneShort: response.effectiveTimeZoneShort,
					utcOffsetSeconds: response.utcOffsetSeconds,
					utcOffset: response.utcOffset,
					isDaylightSavingTime: response.isDaylightSavingTime,
					localTime: response.localTime,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.location.timeZoneByIpAddress',
			{ ip: parsed.ip },
			'completed',
		);

		return response;
	};

export const amIRoaming: BigDataCloudEndpoints['amIRoaming'] = async (
	ctx,
	input,
) => {
	const parsed = BigDataCloudEndpointInputSchemas.amIRoaming.parse(input);

	const response = await makeBigDataCloudRequest<
		Awaited<ReturnType<BigDataCloudEndpoints['amIRoaming']>>
	>('am-i-roaming', ctx.key, {
		method: 'GET',
		query: {
			latitude: parsed.latitude,
			longitude: parsed.longitude,
			ip: parsed.ip,
			localityLanguage: parsed.localityLanguage,
		},
		schema: BigDataCloudEndpointOutputSchemas.amIRoaming,
	});

	const entityId = `${parsed.ip}:${parsed.latitude},${parsed.longitude}`;
	if (response && ctx.db?.roamingStatuses) {
		await safely(`roaming ${entityId}`, () =>
			ctx.db.roamingStatuses.upsertByEntityId(entityId, {
				id: entityId,
				ip: parsed.ip,
				latitude: parsed.latitude,
				longitude: parsed.longitude,
				isRoaming: response.isRoaming,
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'bigdatacloud.location.amIRoaming',
		{ ip: parsed.ip, latitude: parsed.latitude, longitude: parsed.longitude },
		'completed',
	);

	return response;
};

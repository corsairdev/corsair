import { logEventFromContext } from 'corsair/core';
import { makeBigDataCloudRequest } from '../client';
import type { BigDataCloudEndpoints } from '../index';
import { safely } from './persist';
import {
	BigDataCloudEndpointInputSchemas,
	BigDataCloudEndpointOutputSchemas,
} from './types';

export const emailAddressVerification: BigDataCloudEndpoints['emailAddressVerification'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.emailAddressVerification.parse(input);

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['emailAddressVerification']>>
		>('email-verify', ctx.key, {
			method: 'GET',
			query: {
				emailAddress: parsed.emailAddress,
			},
			schema: BigDataCloudEndpointOutputSchemas.emailAddressVerification,
		});

		if (response && ctx.db?.emailValidations) {
			await safely(`emailValidation ${parsed.emailAddress}`, () =>
				ctx.db.emailValidations.upsertByEntityId(parsed.emailAddress, {
					id: parsed.emailAddress,
					emailAddress: response.inputData ?? parsed.emailAddress,
					isValid: response.isValid,
					isSyntaxValid: response.isSyntaxValid,
					isMailServerDefined: response.isMailServerDefined,
					isKnownSpammerDomain: response.isKnownSpammerDomain,
					isDisposable: response.isDisposable,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.validation.emailAddressVerification',
			{ emailAddress: parsed.emailAddress },
			'completed',
		);

		return response;
	};

export const phoneNumberValidationByIp: BigDataCloudEndpoints['phoneNumberValidationByIp'] =
	async (ctx, input) => {
		const parsed =
			BigDataCloudEndpointInputSchemas.phoneNumberValidationByIp.parse(input);

		const phoneNumber =
			(parsed.number?.trim() || parsed.phoneNumber?.trim()) ?? '';

		const response = await makeBigDataCloudRequest<
			Awaited<ReturnType<BigDataCloudEndpoints['phoneNumberValidationByIp']>>
		>('phone-number-validate-by-ip', ctx.key, {
			method: 'GET',
			query: {
				number: phoneNumber,
				ip: parsed.ip,
				localityLanguage: parsed.localityLanguage,
			},
			schema: BigDataCloudEndpointOutputSchemas.phoneNumberValidationByIp,
		});

		const entityId = response.e164Format ?? phoneNumber;
		if (response && entityId && ctx.db?.phoneValidations) {
			await safely(`phoneValidation ${entityId}`, () =>
				ctx.db.phoneValidations.upsertByEntityId(entityId, {
					id: entityId,
					number: phoneNumber,
					isValid: response.isValid,
					e164Format: response.e164Format,
					internationalFormat: response.internationalFormat,
					nationalFormat: response.nationalFormat,
					location: response.location,
					lineType: response.lineType,
					countryCode: response.country?.isoAlpha2,
				}),
			);
		}

		await logEventFromContext(
			ctx,
			'bigdatacloud.validation.phoneNumberValidationByIp',
			{ number: phoneNumber },
			'completed',
		);

		return response;
	};

export const userAgentParser: BigDataCloudEndpoints['userAgentParser'] = async (
	ctx,
	input,
) => {
	const parsed = BigDataCloudEndpointInputSchemas.userAgentParser.parse(input);

	const rawUa = (parsed.userAgentRaw?.trim() || parsed.userAgent?.trim()) ?? '';

	const response = await makeBigDataCloudRequest<
		Awaited<ReturnType<BigDataCloudEndpoints['userAgentParser']>>
	>('user-agent-info', ctx.key, {
		method: 'GET',
		query: {
			userAgentRaw: rawUa,
		},
		schema: BigDataCloudEndpointOutputSchemas.userAgentParser,
	});

	if (response && rawUa && ctx.db?.userAgents) {
		await safely(`userAgent ${rawUa}`, () =>
			ctx.db.userAgents.upsertByEntityId(rawUa, {
				id: rawUa,
				userAgentRaw: rawUa,
				device: response.device,
				os: response.os,
				userAgent: response.userAgent,
				family: response.family,
				isSpider: response.isSpider,
				isMobile: response.isMobile,
				userAgentDisplay: response.userAgentDisplay,
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'bigdatacloud.validation.userAgentParser',
		{ userAgentRaw: rawUa },
		'completed',
	);

	return response;
};

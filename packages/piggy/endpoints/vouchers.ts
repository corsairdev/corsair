import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const list: PiggyEndpoints['vouchersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.list',
			input: Inputs.vouchersList,
			output: Outputs.vouchersList,
		},
		input,
		({ promotionUuid, contactUuid, status, limit, page }) => ({
			method: 'GET',
			path: `${CLIENT}/vouchers`,
			query: {
				promotion_uuid: promotionUuid,
				contact_uuid: contactUuid,
				status,
				limit,
				page,
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const create: PiggyEndpoints['vouchersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.create',
			input: Inputs.vouchersCreate,
			output: Outputs.vouchersCreate,
		},
		input,
		({
			promotionUuid,
			code,
			contactUuid,
			expirationDate,
			activationDate,
			totalRedemptionsAllowed,
			customAttributes,
		}) => ({
			method: 'POST',
			path: `${CLIENT}/vouchers`,
			body: {
				promotion_uuid: promotionUuid,
				code,
				contact_uuid: contactUuid,
				expiration_date: expirationDate,
				activation_date: activationDate,
				total_redemptions_allowed: totalRedemptionsAllowed,
				custom_attributes: customAttributes,
			},
		}),
		{ log: (_, voucher) => ({ voucherUuid: voucher.data.uuid ?? undefined }) },
	);

export const find: PiggyEndpoints['vouchersFind'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.find',
			input: Inputs.vouchersFind,
			output: Outputs.vouchersFind,
		},
		input,
		({ code }) => ({
			method: 'GET',
			path: `${CLIENT}/vouchers/find`,
			query: { code },
		}),
		{ log: (_, voucher) => ({ voucherUuid: voucher.data.uuid ?? undefined }) },
	);

export const update: PiggyEndpoints['vouchersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.update',
			input: Inputs.vouchersUpdate,
			output: Outputs.vouchersUpdate,
		},
		input,
		({ voucherUuid, status, customAttributes, expirationDate }) => ({
			method: 'PUT',
			path: `${CLIENT}/vouchers/${encodeURIComponent(voucherUuid)}`,
			body: {
				status,
				custom_attributes: customAttributes,
				expiration_date: expirationDate,
			},
		}),
		{ log: (_, voucher) => ({ voucherUuid: voucher.data.uuid ?? undefined }) },
	);

export const validate: PiggyEndpoints['vouchersValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.validate',
			input: Inputs.vouchersValidate,
			output: Outputs.vouchersValidate,
		},
		input,
		({ voucherUuid, contactUuid, shopUuid }) => ({
			method: 'POST',
			path: `${CLIENT}/vouchers/${encodeURIComponent(voucherUuid)}/validate`,
			body: { contact_uuid: contactUuid, shop_uuid: shopUuid },
		}),
		{ log: ({ voucherUuid }) => ({ voucherUuid }) },
	);

export const redeem: PiggyEndpoints['vouchersRedeem'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.redeem',
			input: Inputs.vouchersRedeem,
			output: Outputs.vouchersRedeem,
		},
		input,
		({ code, shopUuid, contactUuid, releaseKey }) => ({
			method: 'POST',
			path: `${CLIENT}/vouchers/redeem`,
			body: {
				code,
				shop_uuid: shopUuid,
				contact_uuid: contactUuid,
				release_key: releaseKey,
			},
		}),
		{ log: (_, voucher) => ({ voucherUuid: voucher.data.uuid ?? undefined }) },
	);

export const lock: PiggyEndpoints['vouchersLock'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.lock',
			input: Inputs.vouchersLock,
			output: Outputs.vouchersLock,
		},
		input,
		({ voucherUuid }) => ({
			method: 'POST',
			path: `${CLIENT}/vouchers/${encodeURIComponent(voucherUuid)}/lock`,
		}),
		{
			// The release key lets anyone release or redeem the locked voucher,
			// so the event log records only that a key was issued.
			log: (_, lock) => ({
				locked: Boolean(lock.data.lock?.release_key),
			}),
		},
	);

export const release: PiggyEndpoints['vouchersRelease'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vouchers.release',
			input: Inputs.vouchersRelease,
			output: Outputs.vouchersRelease,
		},
		input,
		({ voucherUuid, releaseKey }) => ({
			method: 'POST',
			path: `${CLIENT}/vouchers/${encodeURIComponent(voucherUuid)}/release`,
			body: { release_key: releaseKey },
		}),
		{ log: ({ voucherUuid }) => ({ voucherUuid }) },
	);

export const reverseRedemption: PiggyEndpoints['vouchersReverseRedemption'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'vouchers.reverseRedemption',
			input: Inputs.vouchersReverseRedemption,
			output: Outputs.vouchersReverseRedemption,
		},
		input,
		({ voucherUuid }) => ({
			method: 'POST',
			path: `${CLIENT}/vouchers/${encodeURIComponent(voucherUuid)}/reverse`,
		}),
		{ log: ({ voucherUuid }) => ({ voucherUuid }) },
	);

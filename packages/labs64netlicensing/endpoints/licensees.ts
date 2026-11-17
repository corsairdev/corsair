import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { itemsOf, netlicensingSend } from '../client';
import type { NetLicensingContext } from '../context';
import type {
	LicenseeTransferInputSchema,
	LicenseeValidateInputSchema,
} from './types';
import {
	LicenseeTransferInputSchema as TransferInput,
	TransferOutputSchema,
	LicenseeValidateInputSchema as ValidateInput,
	ValidateOutputSchema,
} from './types';

/**
 * POST /licensee/{licenseeNumber}/validate: for each product module, whether
 * the licensee's licenses are valid. Floating checkouts and pay-per-use
 * quantities change state unless `dryRun` is true.
 * https://netlicensing.io/wiki/licensee-services
 */
export const validate: CorsairEndpoint<
	NetLicensingContext,
	z.input<typeof LicenseeValidateInputSchema>,
	z.infer<typeof ValidateOutputSchema>
> = async (ctx, input) => {
	const { licenseeNumber, parameters, ...fields } = ValidateInput.parse(input);
	const body = await netlicensingSend<unknown>(
		ctx.key,
		'POST',
		`/licensee/${encodeURIComponent(licenseeNumber)}/validate`,
		{ form: { ...parameters, ...fields } },
	);
	const { items, ttl } = itemsOf(body);
	await logEventFromContext(
		ctx,
		'labs64netlicensing.licensees.validate',
		{ modules: items.length },
		'completed',
	);
	return ValidateOutputSchema.parse({
		...(ttl ? { ttl } : {}),
		validations: items,
	});
};

/**
 * POST /licensee/{licenseeNumber}/transfer: moves every license of the source
 * licensee to this one. Answers 204.
 */
export const transfer: CorsairEndpoint<
	NetLicensingContext,
	z.input<typeof LicenseeTransferInputSchema>,
	z.infer<typeof TransferOutputSchema>
> = async (ctx, input) => {
	const parsed = TransferInput.parse(input);
	await netlicensingSend<unknown>(
		ctx.key,
		'POST',
		`/licensee/${encodeURIComponent(parsed.licenseeNumber)}/transfer`,
		{ form: { sourceLicenseeNumber: parsed.sourceLicenseeNumber } },
	);
	await logEventFromContext(
		ctx,
		'labs64netlicensing.licensees.transfer',
		{},
		'completed',
	);
	return TransferOutputSchema.parse({
		transferred: true,
		licenseeNumber: parsed.licenseeNumber,
		sourceLicenseeNumber: parsed.sourceLicenseeNumber,
	});
};

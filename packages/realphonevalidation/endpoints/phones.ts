import type { RealPhoneValidationEndpoints } from '..';
import { call } from './call';
import {
	RealPhoneValidationEndpointInputSchemas as Inputs,
	RealPhoneValidationEndpointOutputSchemas as Outputs,
} from './types';

/** The richest answer: connection, phone type, caller name, carrier and type. */
export const turboV3: RealPhoneValidationEndpoints['turboV3'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'turboV3',
			service: 'TurboV3.php',
			input: Inputs.turboV3,
			output: Outputs.turboV3,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			// A validation reads; the same number returns the same answer for as
			// long as the carrier data holds.
			replayable: true,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				phoneType: result.phone_type ?? undefined,
				callerType: result.caller_type ?? undefined,
			}),
		},
	);

/** Connection status and phone type only. */
export const turboStandard: RealPhoneValidationEndpoints['turboStandard'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'turboStandard',
			service: 'Turbo.php',
			input: Inputs.turboStandard,
			output: Outputs.turboStandard,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				phoneType: result.phone_type ?? undefined,
			}),
		},
	);

/** The older Turbo: connection status, `iscell` and the carrier. */
export const turbo: RealPhoneValidationEndpoints['turbo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'turbo',
			service: 'RealPhoneValidationTurbo.php',
			input: Inputs.turbo,
			output: Outputs.turbo,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				iscell: result.iscell ?? undefined,
			}),
		},
	);

/** The budget option: connection status, with `iscell` and carrier optional. */
export const scrub: RealPhoneValidationEndpoints['scrub'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scrub',
			service: 'RealPhoneValidationScrub.php',
			input: Inputs.scrub,
			output: Outputs.scrub,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({ status: result.status ?? undefined }),
		},
	);

/** Connection status and phone type, at Scrub's price. */
export const scrubPlus: RealPhoneValidationEndpoints['scrubPlus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'scrubPlus',
			service: 'ScrubPlus.php',
			input: Inputs.scrubPlus,
			output: Outputs.scrubPlus,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				phoneType: result.phone_type ?? undefined,
			}),
		},
	);

/**
 * Whether the number sits on a provider that is still in business. Not whether
 * anyone answers: that is Turbo's or Scrub's question.
 */
export const active: RealPhoneValidationEndpoints['active'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'active',
			service: 'RealPhoneValidationActive.php',
			input: Inputs.active,
			output: Outputs.active,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({ code: result.RESPONSECODE ?? undefined }),
		},
	);

/** landline or cell, for TCPA compliance. */
export const wirelessId: RealPhoneValidationEndpoints['wirelessId'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'wirelessId',
			service: 'WirelessID.php',
			input: Inputs.wirelessId,
			output: Outputs.wirelessId,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({ code: result.RESPONSECODE ?? undefined }),
		},
	);

/**
 * The four Do-Not-Call lists plus the phone type. Needs a SAN number from the
 * national registry before it can be used.
 */
export const dncLookup: RealPhoneValidationEndpoints['dncLookup'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'dncLookup',
			service: 'DNCLookup.php',
			input: Inputs.dncLookup,
			output: Outputs.dncLookup,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				national: result.national_dnc ?? undefined,
				state: result.state_dnc ?? undefined,
				litigator: result.litigator ?? undefined,
			}),
		},
	);

/** The four Do-Not-Call lists plus the connection status. */
export const dncPlus: RealPhoneValidationEndpoints['dncPlus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dncPlus',
			service: 'DNCPlus.php',
			input: Inputs.dncPlus,
			output: Outputs.dncPlus,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				national: result.national_dnc ?? undefined,
				litigator: result.litigator ?? undefined,
			}),
		},
	);

/** A 0-1000 risk score with a recommended action and the number's location. */
export const fraudCheck: RealPhoneValidationEndpoints['fraudCheck'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'fraudCheck',
			service: 'RealPhoneValidationFraudChk.php',
			input: Inputs.fraudCheck,
			output: Outputs.fraudCheck,
		},
		input,
		({ phone }) => ({
			method: 'GET',
			query: { phone },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				riskLevel: result.risk_level ?? undefined,
				score: result.score ?? undefined,
				recommendation: result.recommendation ?? undefined,
			}),
		},
	);

/**
 * Whether the number changed owner since the consent date you supply. The
 * service needs the date, because "reassigned" only means anything relative to
 * when permission was given.
 */
export const reassigned: RealPhoneValidationEndpoints['reassigned'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reassigned',
			service: 'ReassignedNumberLookup.php',
			input: Inputs.reassigned,
			output: Outputs.reassigned,
		},
		input,
		({ phone, contact_date }) => ({
			method: 'GET',
			query: { phone, contact_date },
			replayable: true,
		}),
		{
			log: (_, result) => ({ reassigned: result.reassigned ?? undefined }),
		},
	);

/** Email deliverability, from the same vendor's separate service. */
export const emailVerify: RealPhoneValidationEndpoints['emailVerify'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emailVerify',
			service: 'EmailVerify.php',
			input: Inputs.emailVerify,
			output: Outputs.emailVerify,
		},
		input,
		({ email }) => ({
			method: 'GET',
			query: { email },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				disposable: result.disposable ?? undefined,
			}),
		},
	);

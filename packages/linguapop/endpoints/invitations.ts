import type { LinguapopEndpoints } from '..';
import { call } from './call';
import {
	LinguapopEndpointInputSchemas as Inputs,
	LinguapopEndpointOutputSchemas as Outputs,
} from './types';

/**
 * POST /api/actions/sendInvitation. The client adds `apiKey` to the JSON body.
 * Not idempotent as far as the docs say, so error-handlers.ts never replays it
 * after a 5xx or a timeout.
 */
export const create: LinguapopEndpoints['invitationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invitations.create',
			input: Inputs.invitationsCreate,
			output: Outputs.invitationsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			action: 'sendInvitation',
			body: {
				email: parsed.email,
				languageCode: parsed.languageCode,
				sendEmail: parsed.sendEmail,
				name: parsed.name,
				externalIdentifier: parsed.externalIdentifier,
				generateKioskCode: parsed.generateKioskCode,
				testReading: parsed.testReading,
				testListening: parsed.testListening,
				callbackUrl: parsed.callbackUrl,
				returnUrl: parsed.returnUrl,
			},
		}),
		(parsed, result) => ({
			invitationId: result.invitationId,
			languageCode: parsed.languageCode,
			emailSent: result.emailSent ?? undefined,
		}),
	);

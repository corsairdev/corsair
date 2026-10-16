import type { PloidEndpoints } from '../index';
import type { ContactField } from '../schema/database';
import { rememberPerson } from './cache';
import { callPloid } from './call';
import type { EnrichResponse } from './types';
import { EnrichInputSchema, EnrichResponseSchema } from './types';

type WireContactField = NonNullable<EnrichResponse['data']['work_email']>;

function contactField(
	field: WireContactField | undefined,
): ContactField | undefined {
	if (field === undefined) return undefined;
	// Only a found value is a fact. not_found and unavailable mean the check
	// came back empty or could not run; writing their null values would wipe
	// a previously found contact from the cached row.
	if (field.status !== 'found') return undefined;
	return {
		value: field.value,
		status: field.status,
		confidence: field.confidence ?? null,
		source: field.source ?? null,
		lastSeen: field.last_seen ?? null,
	};
}

export const enrich: PloidEndpoints['enrich'] = async (ctx, input) => {
	return callPloid(
		ctx,
		'ploid.contacts.enrich',
		EnrichInputSchema,
		EnrichResponseSchema,
		input,
		(validated) => ({
			method: 'POST',
			url: '/v1/enrich',
			// The wire body is flat: the identifier fields sit next to fields
			// and response_format, not under an `identifier` key.
			body: {
				...validated.identifier,
				fields: validated.fields,
				response_format: validated.response_format ?? 'standard',
			},
		}),
		(validated, response) => ({
			fields: validated.fields.join(','),
			statuses: validated.fields
				.map((field) => response.data[field]?.status ?? 'absent')
				.join(','),
		}),
		async (validated, response) => {
			// The response carries no person_id; only a person_id lookup can be
			// merged into the cached person row.
			if (!('person_id' in validated.identifier)) return;
			const providerId = validated.identifier.person_id;
			await rememberPerson(ctx, {
				providerId,
				workEmail: contactField(response.data.work_email),
				personalEmail: contactField(response.data.personal_email),
				phone: contactField(response.data.phone),
			});
		},
	);
};

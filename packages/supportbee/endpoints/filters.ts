import type { SupportbeeEndpoints } from '..';
import { call } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * A filter is three records created in order: a rule decides which tickets
 * match, a consequence decides what happens to them, and the filter links the
 * two by id. The link is the only route that makes it take effect.
 */
export const createRule: SupportbeeEndpoints['filtersCreateRule'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'filters.createRule',
			input: Inputs.filtersCreateRule,
			output: Outputs.filtersCreateRule,
		},
		input,
		({ requester_email, delivered_to, subject, body }) => ({
			method: 'POST',
			path: '/rules',
			body: {
				rule: {
					...(requester_email === undefined ? {} : { requester_email }),
					...(delivered_to === undefined ? {} : { delivered_to }),
					...(subject === undefined ? {} : { subject }),
					...(body === undefined ? {} : { body }),
				},
			},
		}),
		{
			log: (_, result) => ({ ruleId: result.rule.id }),
		},
	);

export const createConsequence: SupportbeeEndpoints['filtersCreateConsequence'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'filters.createConsequence',
				input: Inputs.filtersCreateConsequence,
				output: Outputs.filtersCreateConsequence,
			},
			input,
			({ archive, spam, trash, label, assign_user, assign_team }) => ({
				method: 'POST',
				path: '/consequences',
				body: {
					consequence: {
						...(archive === undefined ? {} : { archive }),
						...(spam === undefined ? {} : { spam }),
						...(trash === undefined ? {} : { trash }),
						...(label === undefined ? {} : { label }),
						...(assign_user === undefined ? {} : { assign_user }),
						...(assign_team === undefined ? {} : { assign_team }),
					},
				},
			}),
			{
				log: (_, result) => ({ consequenceId: result.consequence.id }),
			},
		);

export const create: SupportbeeEndpoints['filtersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'filters.create',
			input: Inputs.filtersCreate,
			output: Outputs.filtersCreate,
		},
		input,
		({ rule_id, consequence_id }) => ({
			method: 'POST',
			path: '/filters',
			body: { rule_id, consequence_id },
		}),
		{
			// The route documents 201 with no body, so the ids are reported back
			// rather than read from a reply that may not carry them.
			shape: (_, parsed) => ({
				rule_id: parsed.rule_id,
				consequence_id: parsed.consequence_id,
				created: true,
			}),
			log: (parsed) => ({
				ruleId: parsed.rule_id,
				consequenceId: parsed.consequence_id,
			}),
		},
	);

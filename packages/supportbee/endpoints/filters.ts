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
			// The docs show the ids at the top level, but the live API answers 500
			// to that and creates the filter only when they sit under `filter`.
			body: { filter: { rule_id, consequence_id } },
		}),
		{
			// The ids are reported back from the input; the filter id comes from
			// the `{ filter }` body the live API answers with, when present.
			shape: (raw, parsed) => ({
				rule_id: parsed.rule_id,
				consequence_id: parsed.consequence_id,
				filter_id: filterIdOf(raw),
				created: true,
			}),
			log: (parsed) => ({
				ruleId: parsed.rule_id,
				consequenceId: parsed.consequence_id,
			}),
		},
	);

/**
 * The id from the `{ filter: { id } }` body the live API answers with, or
 * undefined for the empty 201 the docs describe. Any other body throws, so a
 * malformed answer is not reported as a created filter.
 */
function filterIdOf(
	raw: unknown, // unknown: the create body, which the docs say is empty
): string | undefined {
	if (raw === undefined || raw === null || raw === '') return undefined;
	const filter =
		typeof raw === 'object' && 'filter' in raw ? raw.filter : undefined;
	const id =
		filter && typeof filter === 'object' && 'id' in filter
			? filter.id
			: undefined;
	if (typeof id === 'string' && id.length > 0) return id;
	throw new Error(
		'SupportBee answered filters.create with a body that holds no filter id, so the filter is not confirmed. List the filters in SupportBee before retrying.',
	);
}

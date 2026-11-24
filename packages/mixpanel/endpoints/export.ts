import { z } from 'zod';
import { op } from './call';
import { checkDateRange, DateSchema, PropertiesSchema } from './common';

export const MIXPANEL_MAX_EXPORT_LIMIT = 100000;

const ExportedEventSchema = z
	.object({
		event: z.string().nullish(),
		properties: PropertiesSchema.nullish(),
	})
	.loose();

/**
 * Parses the raw export body: one JSON object per line. An empty body means
 * no events matched the range; a malformed line throws, because a silent
 * partial page would look like data. The message names the line number only:
 * the line itself can hold customer data.
 */
export function parseExportLines(
	// unknown: the raw export body is JSONL text, but a wrong route answers
	// HTML or an error object, which must fail loudly rather than parse.
	raw: unknown,
): z.infer<typeof ExportedEventSchema>[] {
	if (raw === undefined || raw === null || raw === '') return [];
	if (typeof raw !== 'string') {
		// A one-line export can arrive already parsed as JSON.
		if (typeof raw === 'object' && !Array.isArray(raw)) {
			return [raw as z.infer<typeof ExportedEventSchema>];
		}
		throw new Error(
			`Mixpanel export returned ${typeof raw}, expected newline-delimited JSON text`,
		);
	}
	const lines = raw.split('\n').filter((line) => line.trim().length > 0);
	return lines.map((line, index) => {
		try {
			return JSON.parse(line) as z.infer<typeof ExportedEventSchema>;
		} catch {
			throw new Error(`Mixpanel export line ${index} is not valid JSON`);
		}
	});
}

/**
 * Downloads raw events as newline-delimited JSON. There is no cursor: a range
 * is one request, capped by `limit`, so wide ranges are the caller's job to
 * split. Works on Mixpanel's free plan.
 */
export const events = op({
	name: 'export.events',
	input: z
		.object({
			from_date: DateSchema.describe('Inclusive, in the project timezone.'),
			to_date: DateSchema.describe('Inclusive.'),
			event_names: z
				.array(z.string().min(1))
				.min(1)
				.optional()
				.describe('Only these events; omit for all of them.'),
			where: z
				.string()
				.optional()
				.describe('An expression to filter events by.'),
			limit: z
				.number()
				.int()
				.positive()
				.max(MIXPANEL_MAX_EXPORT_LIMIT)
				.optional()
				.describe(`At most ${MIXPANEL_MAX_EXPORT_LIMIT}.`),
			time_in_ms: z
				.boolean()
				.optional()
				.describe('True for millisecond timestamps; default is seconds.'),
		})
		.superRefine(checkDateRange),
	output: z.object({ events: z.array(ExportedEventSchema) }),
	meta: {
		riskLevel: 'read',
		description:
			'Export raw events for a date range as parsed objects, with optional event-name filter, expression filter and limit',
	},
	toRequest: (input, c) => ({
		service: 'data',
		method: 'GET',
		path: '/export',
		query: {
			project_id: c.projectId,
			from_date: input.from_date,
			to_date: input.to_date,
			event: input.event_names ? JSON.stringify(input.event_names) : undefined,
			where: input.where,
			limit: input.limit,
			time_in_ms: input.time_in_ms,
		},
		responseType: 'text',
		timeoutMs: 120_000,
	}),
	shape: (raw) => ({ events: parseExportLines(raw) }),
	log: (input, result) => ({
		fromDate: input.from_date,
		toDate: input.to_date,
		events: result.events.length,
	}),
});

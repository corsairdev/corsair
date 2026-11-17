// Replaces the named fields with '[redacted]' in the copy of an input that goes
// to the event log. The request itself still sends the original values.
// Used for email filters, property values (custom user and client data, or a
// data source's connector credentials) and annotation text.
export const redactFields = <T extends object>(
	input: T,
	fields: readonly (keyof T & string)[],
) => {
	const copy: Record<string, unknown> = {
		...(input as Record<string, unknown>),
	};
	for (const field of fields) {
		if (copy[field] !== undefined) copy[field] = '[redacted]';
	}
	return copy;
};

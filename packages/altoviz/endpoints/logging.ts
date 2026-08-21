/**
 * Builds the payload recorded in `corsair_events`.
 *
 * This is an accounting system: customer and contact names, emails, phones,
 * billing and shipping addresses, company registration numbers, invoice line
 * prices, receipt amounts and payment references pass through nearly every
 * write here. `logEventFromContext` persists whatever it is handed and those
 * rows inherit the event log's retention, so spreading a raw endpoint input
 * would park that data in the log indefinitely.
 *
 * The allow-list below is therefore DENY BY DEFAULT: a field's VALUE is
 * recorded only if its name is explicitly admitted, and admission is reserved
 * for identifiers, enum values and counts - things that identify a record or
 * shape a query, never things that identify a person or carry money. Every
 * other supplied field has its NAME recorded (so an operator can see what a
 * call touched) but never its value.
 *
 * A parameter added to an operation in the future is redacted by default,
 * before anyone reviews it - the failure mode an allow-first design cannot
 * produce is "forgot to add the new field to the deny-list".
 */
const ALLOWED_FIELDS = new Set<string>([
	// ids and cross-references - identify a record, do not describe a person
	'id',
	'customerId',
	'customerId2',
	'supplierId',
	'colleagueId',
	'contactId',
	'productId',
	'familyId',
	'customerFamilyId',
	'productFamilyId',
	'invoiceId',
	'creditId',
	'quoteId',
	'receiptId',
	'webhookId',
	'purchaseInvoiceId',
	'unitId',
	'vatId',
	'classificationId',
	'cancelledInvoiceId',
	// enums and status - describe shape/state, not content
	'type',
	'status',
	'paymentMethod',
	'riskLevel',
	// paging and query shape - `query` and `orderBy` are free-text, so they
	// are recorded by NAME only, never by value.
	'pageIndex',
	'pageSize',
	'from',
	'to',
	// booleans - describe shape, never carry content
	'active',
	'isDraft',
	'isPaid',
	'includeCancelled',
	// counts
	'linesCount',
	'typesCount',
	// dates - when, not who or how much
	'date',
]);

/** Guards the allow-list itself: no admitted field name may look like it carries personal or financial content. */
const FORBIDDEN_STEMS = [
	'email',
	'phone',
	'address',
	'name',
	'note',
	'description',
	'subject',
	'amount',
	'price',
	'quantity',
	'iban',
	'siret',
	'vatnumber',
	'secret',
	'signature',
	'key',
];
for (const field of ALLOWED_FIELDS) {
	const lower = field.toLowerCase();
	if (FORBIDDEN_STEMS.some((stem) => lower.includes(stem))) {
		throw new Error(
			`[ALTOVIZ] logging allow-list admits "${field}", which looks like it could carry personal or financial content`,
		);
	}
}

export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	extra?: Record<string, unknown>,
): Record<string, unknown> {
	const payload: Record<string, unknown> = { ...extra };

	for (const [key, value] of Object.entries(input)) {
		if (value === undefined) continue;
		if (ALLOWED_FIELDS.has(key)) {
			payload[key] = value;
		}
	}

	const supplied = Object.keys(input).filter((key) => input[key] !== undefined);
	if (supplied.length > 0) {
		payload.fields = supplied;
	}

	return payload;
}

export { ALLOWED_FIELDS };

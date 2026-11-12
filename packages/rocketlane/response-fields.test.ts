import {
	BudgetFieldPublicResponseEntity,
	CompanyFieldPublicResponseAPIEntity,
	FieldUsersPublicAPIResponse,
	InvoiceFieldPublicResponseEntity,
	ProjectFieldPublicResponseAPIEntity,
	ResourceAllocationFieldPublicResponseAPIEntity,
	TaskFieldPublicResponseAPIEntity,
	TimeEntryFieldPublicResponseAPIEntity,
} from './endpoints/types';

describe('Rocketlane custom field responses', () => {
	it.each([
		InvoiceFieldPublicResponseEntity,
		CompanyFieldPublicResponseAPIEntity,
		FieldUsersPublicAPIResponse,
		ResourceAllocationFieldPublicResponseAPIEntity,
		TimeEntryFieldPublicResponseAPIEntity,
		BudgetFieldPublicResponseEntity,
		TaskFieldPublicResponseAPIEntity,
		ProjectFieldPublicResponseAPIEntity,
	])(
		'preserves each documented value shape and unspecified object keys',
		(schema) => {
			for (const fieldValue of [
				'Acme',
				42,
				true,
				[1, 2],
				{ nested: { value: 3 } },
				null,
			]) {
				const field = { fieldId: 1, fieldValue };
				expect(schema.parse(field)).toEqual(field);
			}
		},
	);
});

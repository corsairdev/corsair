import { z } from 'zod';

export const Example404 = z.lazy(() =>
	z.object({
		errorCode: z.string().optional(),
		errorMessage: z.string().optional(),
	}),
);
export const notFoundErrorlist = z.lazy(() =>
	z.object({ errors: z.array(z.lazy(() => Example404)).optional() }),
);
export const Example401 = z.lazy(() =>
	z.object({
		errorCode: z.string().optional(),
		errorMessage: z.string().optional(),
	}),
);
export const unauthorizedErrorlist = z.lazy(() =>
	z.object({ errors: z.array(z.lazy(() => Example401)).optional() }),
);
export const Example400 = z.lazy(() =>
	z.object({
		errorCode: z.string().optional(),
		errorMessage: z.string().optional(),
		field: z.string().optional(),
	}),
);
export const badRequestErrorlist = z.lazy(() =>
	z.object({ errors: z.array(z.lazy(() => Example400)).optional() }),
);
export const ExampleAPIResponseInvoicePayments = z.lazy(() =>
	z.object({
		data: z
			.array(z.lazy(() => PaymentRecordPublicAPIResponseEntity))
			.optional(),
		pagination: z.lazy(() => ExamplePaginationInvoicePayments).optional(),
	}),
);
export const ExamplePaginationInvoicePayments = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const PaymentRecordPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		paymentId: z.number().optional(),
		paymentRecordType: z.enum(['PAID', 'WRITE_OFF', 'CREDIT_NOTE']).optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		paymentDate: z.string().optional(),
		amount: z.number().optional(),
		notes: z.string().optional(),
	}),
);
export const ExampleAPIResponseInvoiceLineItems = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => InvoiceLineItemResponseEntity)).optional(),
		pagination: z.lazy(() => ExamplePaginationInvoiceLineItems).optional(),
	}),
);
export const ExamplePaginationInvoiceLineItems = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const InvoiceLineItemResponseEntity = z.lazy(() =>
	z.object({
		invoiceLineItemId: z.number().optional(),
		description: z.string().optional(),
		quantity: z.number().optional(),
		unitPrice: z.number().optional(),
		amount: z.number().optional(),
		sourceId: z.number().optional(),
		sourceType: z.enum(['PROJECT']).optional(),
		taxCode: z.lazy(() => TaxCodePublicAPIResponseEntity).optional(),
		taxComponents: z
			.array(z.lazy(() => TaxComponentPublicAPIResponseEntity))
			.optional(),
		budget: z
			.lazy(() => InvoicePublicProjectFinancialsBudgetResponse)
			.optional(),
	}),
);
export const InvoicePublicProjectFinancialsBudgetResponse = z.lazy(() =>
	z.object({
		budgetId: z.number().min(1).optional(),
		budgetName: z.string().optional(),
	}),
);
export const TaxCodePublicAPIResponseEntity = z.lazy(() =>
	z.object({
		taxCodeId: z.number().optional(),
		taxCodeName: z.string().optional(),
		taxCodeRate: z.number().optional(),
		taxCodeAmount: z.number().optional(),
	}),
);
export const TaxComponentPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		taxComponentId: z.number().optional(),
		taxComponentName: z.string().optional(),
		taxComponentRate: z.number().optional(),
		taxComponentAmount: z.number().optional(),
		taxComponentType: z.string().optional(),
	}),
);
export const CustomerCompanyProjectPublicResponse = z.lazy(() =>
	z.object({
		companyId: z.number().min(1).optional(),
		companyName: z.string().optional(),
		companyUrl: z.string().optional(),
	}),
);
export const ProjectVendorUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const InvoiceAttachmentPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		attachmentId: z.number().optional(),
		attachmentName: z.string().optional(),
		createdAt: z.number().optional(),
		location: z.string().optional(),
		thumbLocation: z.string().optional(),
		visibility: z.boolean().optional(),
	}),
);
export const InvoiceFieldPublicResponseEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.object({}).optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const InvoiceProjectPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
	}),
);
export const InvoicePublicAPIResponseEntity = z.lazy(() =>
	z.object({
		invoiceId: z.number().min(1).optional(),
		invoiceNumber: z.string().optional(),
		dateOfIssue: z.string().optional(),
		dueDate: z.string().optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		status: z.string().optional(),
		amount: z.number().optional(),
		tax: z.number().optional(),
		subTotal: z.number().optional(),
		amountOutstanding: z.number().optional(),
		amountPaid: z.number().optional(),
		amountWrittenOff: z.number().optional(),
		notes: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => ProjectVendorUserPublicAPI).optional(),
		updatedBy: z.lazy(() => ProjectVendorUserPublicAPI).optional(),
		company: z.lazy(() => CustomerCompanyProjectPublicResponse).optional(),
		projects: z
			.array(z.lazy(() => InvoiceProjectPublicAPIResponseEntity))
			.optional(),
		budgets: z
			.array(z.lazy(() => InvoicePublicProjectFinancialsBudgetResponse))
			.optional(),
		fields: z.array(z.lazy(() => InvoiceFieldPublicResponseEntity)).optional(),
		attachments: z
			.array(z.lazy(() => InvoiceAttachmentPublicAPIResponseEntity))
			.optional(),
	}),
);
export const ExampleAPIResponseInvoices = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => InvoicePublicAPIResponseEntity)).optional(),
		pagination: z.lazy(() => ExamplePaginationInvoices).optional(),
	}),
);
export const ExamplePaginationInvoices = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const Example500 = z.lazy(() =>
	z.object({
		errorCode: z.string().optional(),
		errorMessage: z.string().optional(),
	}),
);
export const serverErrorErrorlist = z.lazy(() =>
	z.object({ errors: z.array(z.lazy(() => Example500)).optional() }),
);
export const CompanyAccountOwnerPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const CompanyCreatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const CompanyFieldPublicResponseAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.string().optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const CompanyNotePublicResponseAPIEntity = z.lazy(() =>
	z.object({
		noteId: z.number().optional(),
		fieldId: z.number().optional(),
		fieldLabel: z.string().optional(),
		noteTitle: z.string().optional(),
		noteText: z.string().optional(),
		tags: z.array(z.lazy(() => CompanyNoteTagPublicResponseEntity)).optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
	}),
);
export const CompanyNoteTagPublicResponseEntity = z.lazy(() =>
	z.object({
		tagId: z.number().optional(),
		label: z.string().optional(),
		color: z.string().optional(),
	}),
);
export const CompanyUpdatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const CustomerCompanyPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		companyId: z.number().min(1).optional(),
		companyName: z.string().optional(),
		companyUrl: z.string().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS', 'GROUP']).optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => CompanyCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => CompanyUpdatedByUserPublicAPI).optional(),
		description: z.string().optional(),
		accountOwner: z.lazy(() => CompanyAccountOwnerPublicResponse).optional(),
		fields: z
			.array(z.lazy(() => CompanyFieldPublicResponseAPIEntity))
			.optional(),
		notes: z.array(z.lazy(() => CompanyNotePublicResponseAPIEntity)).optional(),
	}),
);
export const CompanyAccountOwnerPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const CompanyFieldPublicRequestAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldValue: z.union([z.string(), z.number()]).optional(),
	}),
);
export const CompanyNoteUpdateRequestAPIEntity = z.lazy(() =>
	z.object({
		noteId: z.number(),
		noteTitle: z.string().optional(),
		noteText: z.string().optional(),
		tagIds: z.array(z.number()).optional(),
	}),
);
export const CustomerCompanyPublicUpdateAPIRequestEntity = z.lazy(() =>
	z.object({
		companyName: z.string().optional(),
		companyUrl: z.string().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS']).optional(),
		description: z.string().optional(),
		accountOwner: z
			.lazy(() => CompanyAccountOwnerPublicAPIRequestEntity)
			.optional(),
		fields: z
			.array(z.lazy(() => CompanyFieldPublicRequestAPIEntity))
			.optional(),
		notes: z.array(z.lazy(() => CompanyNoteUpdateRequestAPIEntity)).optional(),
	}),
);
export const CompanyNoteCreateRequestAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number(),
		noteTitle: z.string().optional(),
		noteText: z.string(),
		tagIds: z.array(z.number()).optional(),
	}),
);
export const ExampleAPIResponseCompanies = z.lazy(() =>
	z.object({
		data: z
			.array(z.lazy(() => CustomerCompanyPublicAPIResponseEntity))
			.optional(),
		pagination: z.lazy(() => ExamplePaginationCompanies).optional(),
	}),
);
export const ExamplePaginationCompanies = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const CustomerCompanyPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		companyName: z.string(),
		companyUrl: z.string().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS']).optional(),
		description: z.string().optional(),
		accountOwner: z.lazy(() => CompanyAccountOwnerPublicAPIRequestEntity),
		fields: z
			.array(z.lazy(() => CompanyFieldPublicRequestAPIEntity))
			.optional(),
		notes: z.array(z.lazy(() => CompanyNoteCreateRequestAPIEntity)).optional(),
	}),
);
export const RoleResponsePublicAPI = z.lazy(() =>
	z.object({ roleId: z.number().optional(), roleName: z.string().optional() }),
);
export const AllocationCreatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const AllocationUpdatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const AllocationUserPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		role: z.lazy(() => RoleResponsePublicAPI).optional(),
	}),
);
export const ExampleAPIResponseResourceAllocations = z.lazy(() =>
	z.object({
		data: z
			.array(z.lazy(() => ResourceAllocationPublicAPIResponseForExample))
			.optional(),
		pagination: z.lazy(() => ExamplePaginationResourceAllocations).optional(),
	}),
);
export const ExamplePaginationResourceAllocations = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const PlaceholderResponsePublicAPI = z.lazy(() =>
	z.object({
		placeholderId: z.number().optional(),
		placeholderName: z.string().optional(),
		role: z.lazy(() => RoleResponsePublicAPI).optional(),
	}),
);
export const ProjectPublicAPIAllocationResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
	}),
);
export const ResourceAllocationFieldPublicResponseAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.object({}).optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const ResourceAllocationPublicAPIResponseForExample = z.lazy(() =>
	z.object({
		allocationId: z.number().min(1).optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		secondsPerDay: z.number().optional(),
		minutesPerDay: z.number().optional(),
		hoursPerDay: z.number().optional(),
		duration: z
			.lazy(() => ResourceAllocationTotalDurationPublicResponse)
			.optional(),
		allocationType: z.enum(['SOFT', 'HARD']).optional(),
		allocationFor: z.enum(['TEAM_MEMBER', 'PLACEHOLDER']).optional(),
		project: z.lazy(() => ProjectPublicAPIAllocationResponseEntity).optional(),
		tasks: z
			.array(z.lazy(() => ResourceAllocationTaskPublicAPIEntity))
			.optional(),
		member: z.lazy(() => AllocationUserPublicAPIResponseEntity).optional(),
		placeholder: z.lazy(() => PlaceholderResponsePublicAPI).optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => AllocationCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => AllocationUpdatedByUserPublicAPI).optional(),
		workId: z.number().optional(),
		workType: z.enum(['TASK', 'PHASE', 'MILESTONE']).optional(),
		includeSaturday: z.boolean().optional(),
		includeSunday: z.boolean().optional(),
		fields: z
			.array(z.lazy(() => ResourceAllocationFieldPublicResponseAPIEntity))
			.optional(),
		budget: z
			.lazy(() => ResourceAllocationPublicProjectFinancialsBudgetResponse)
			.optional(),
	}),
);
export const ResourceAllocationPublicProjectFinancialsBudgetResponse = z.lazy(
	() =>
		z.object({
			budgetId: z.number().min(1).optional(),
			budgetName: z.string().optional(),
		}),
);
export const ResourceAllocationTaskPublicAPIEntity = z.lazy(() =>
	z.object({ taskName: z.string().optional(), taskId: z.number().optional() }),
);
export const ResourceAllocationTotalDurationPublicResponse = z.lazy(() =>
	z.object({
		daysConsider: z.number().optional(),
		seconds: z.number().optional(),
		minutes: z.number().optional(),
		hours: z.number().optional(),
	}),
);
export const TImeOffNotifyUsersPublicAPIResponse = z.lazy(() =>
	z.object({
		projectOwners: z.boolean().optional(),
		others: z
			.array(z.lazy(() => TimeOffOtherUsersPublicAPIResponse))
			.optional(),
	}),
);
export const TimeOffCreatedByPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TimeOffOtherUsersPublicAPIResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TimeOffUserPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ExampleAPIResponseTimeOffs = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => TimeOffPublicAPIResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationTimeOffs).optional(),
	}),
);
export const ExamplePaginationTimeOffs = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const TimeOffPublicAPIResponseForExample = z.lazy(() =>
	z.object({
		timeOffId: z.number().min(1).optional(),
		user: z.lazy(() => TimeOffUserPublicAPIResponseEntity).optional(),
		note: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		durationInMinutes: z.number().optional(),
		type: z.enum(['FULL_DAY', 'HALF_DAY', 'CUSTOM']).optional(),
		notifyUsers: z.lazy(() => TImeOffNotifyUsersPublicAPIResponse).optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => TimeOffCreatedByPublicResponse).optional(),
	}),
);
export const TimeOffPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		timeOffId: z.number().min(1).optional(),
		user: z.lazy(() => TimeOffUserPublicAPIResponseEntity).optional(),
		note: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		durationInMinutes: z.number().optional(),
		type: z.enum(['FULL_DAY', 'HALF_DAY', 'CUSTOM']).optional(),
		notifyUsers: z.lazy(() => TImeOffNotifyUsersPublicAPIResponse).optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => TimeOffCreatedByPublicResponse).optional(),
	}),
);
export const TImeOffNotifyUsersPublicRequest = z.lazy(() =>
	z.object({
		projectOwners: z.boolean().optional(),
		others: z.array(z.lazy(() => TimeOffOtherUsersPublicRequest)).optional(),
	}),
);
export const TimeOffOtherUsersPublicRequest = z.lazy(() =>
	z.object({ userId: z.number().optional(), emailId: z.string().optional() }),
);
export const TimeOffPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		timeOffId: z.number().min(1).optional(),
		user: z.lazy(() => TimeOffUserPublicAPIRequestEntity),
		note: z.string().optional(),
		startDate: z.string(),
		endDate: z.string(),
		type: z.enum(['FULL_DAY', 'HALF_DAY', 'CUSTOM']),
		notifyUsers: z.lazy(() => TImeOffNotifyUsersPublicRequest).optional(),
		durationInMinutes: z.number().min(1).optional(),
	}),
);
export const TimeOffUserPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const FieldCreatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const FieldModelPublicResponseAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldDescription: z.string().optional(),
		fieldType: z
			.enum([
				'TEXT',
				'MULTI_LINE_TEXT',
				'YES_OR_NO',
				'DATE',
				'SINGLE_CHOICE',
				'MULTIPLE_CHOICE',
				'SINGLE_USER',
				'MULTIPLE_USER',
				'NUMBER',
				'NOTE',
				'RATING',
			])
			.optional(),
		objectType: z.string().optional(),
		fieldOptions: z
			.array(z.lazy(() => OptionsPublicAPIResponseEntity))
			.optional(),
		ratingScale: z.enum(['THREE', 'FIVE', 'SEVEN', 'TEN']).optional(),
		createdBy: z.lazy(() => FieldCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => FieldUpdatedByUserPublicAPI).optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		enabled: z.boolean().optional(),
		private: z.boolean().optional(),
	}),
);
export const FieldUpdatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const OptionsPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		optionValue: z.number().min(1).optional(),
		optionLabel: z.string().optional(),
		optionColor: z
			.enum([
				'RED',
				'YELLOW',
				'GREEN',
				'TEAL',
				'CYAN',
				'BLUE',
				'PURPLE',
				'MAGENTA',
				'GRAY',
				'COOL_GRAY',
			])
			.optional(),
	}),
);
export const FieldUpdatePublicRequest = z.lazy(() =>
	z.object({
		fieldLabel: z.string().optional(),
		fieldDescription: z.string().optional(),
		enabled: z.boolean().optional(),
		private: z.boolean().optional(),
	}),
);
export const FieldOptionUpdatePublicRequest = z.lazy(() =>
	z.object({
		optionValue: z.number(),
		optionColor: z
			.enum([
				'RED',
				'YELLOW',
				'GREEN',
				'TEAL',
				'CYAN',
				'BLUE',
				'PURPLE',
				'MAGENTA',
				'GRAY',
				'COOL_GRAY',
			])
			.optional(),
		optionLabel: z.string().optional(),
	}),
);
export const FieldOptionPublicRequest = z.lazy(() =>
	z.object({
		optionColor: z.enum([
			'RED',
			'YELLOW',
			'GREEN',
			'TEAL',
			'CYAN',
			'BLUE',
			'PURPLE',
			'MAGENTA',
			'GRAY',
			'COOL_GRAY',
		]),
		optionLabel: z.string(),
	}),
);
export const ExampleAPIResponseFields = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => FieldModelPublicResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationFields).optional(),
	}),
);
export const ExamplePaginationFields = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const FieldModelPublicResponseForExample = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldDescription: z.string().optional(),
		fieldType: z
			.enum([
				'TEXT',
				'MULTI_LINE_TEXT',
				'YES_OR_NO',
				'DATE',
				'SINGLE_CHOICE',
				'MULTIPLE_CHOICE',
				'SINGLE_USER',
				'MULTIPLE_USER',
				'NUMBER',
				'NOTE',
				'RATING',
			])
			.optional(),
		objectType: z.string().optional(),
		fieldOptions: z
			.array(z.lazy(() => OptionsPublicAPIResponseEntity))
			.optional(),
		ratingScale: z.enum(['THREE', 'FIVE', 'SEVEN', 'TEN']).optional(),
		createdBy: z.lazy(() => FieldCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => FieldUpdatedByUserPublicAPI).optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		enabled: z.boolean().optional(),
		private: z.boolean().optional(),
	}),
);
export const FieldPublicRequest = z.lazy(() =>
	z.object({
		fieldId: z.number().min(0).optional(),
		fieldLabel: z.string(),
		fieldDescription: z.string().optional(),
		fieldType: z.enum([
			'TEXT',
			'MULTI_LINE_TEXT',
			'YES_OR_NO',
			'DATE',
			'SINGLE_CHOICE',
			'MULTIPLE_CHOICE',
			'SINGLE_USER',
			'MULTIPLE_USER',
			'NUMBER',
			'NOTE',
			'RATING',
		]),
		objectType: z.enum(['PROJECT', 'TASK', 'USER', 'BUDGET', 'COMPANY']),
		fieldOptions: z.array(z.lazy(() => FieldOptionPublicRequest)).optional(),
		ratingScale: z.enum(['THREE', 'FIVE', 'SEVEN', 'TEN']).optional(),
		enabled: z.boolean().optional(),
		private: z.boolean().optional(),
	}),
);
export const TimeEntryApprovedByPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TimeEntryBillRatePublicAPI = z.lazy(() =>
	z.object({ rate: z.number().optional(), currency: z.string().optional() }),
);
export const TimeEntryCategoryPublicAPI = z.lazy(() =>
	z.object({
		categoryName: z.string().optional(),
		categoryId: z.number().optional(),
	}),
);
export const TimeEntryCostRatePublicAPI = z.lazy(() =>
	z.object({ rate: z.number().optional(), currency: z.string().optional() }),
);
export const TimeEntryCreatedByPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TimeEntryFieldPublicResponseAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.object({}).optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const TimeEntryPhasePublicAPIResponseEntity = z.lazy(() =>
	z.object({
		phaseId: z.number().optional(),
		phaseName: z.string().optional(),
	}),
);
export const TimeEntryProjectPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		projectName: z.string().optional(),
		projectId: z.number().optional(),
	}),
);
export const TimeEntryPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		timeEntryId: z.number().min(1).optional(),
		date: z.string().optional(),
		minutes: z.number().min(1).max(1440).optional(),
		activityName: z.string().optional(),
		project: z.lazy(() => TimeEntryProjectPublicAPIResponseEntity).optional(),
		task: z.lazy(() => TimeEntryTaskPublicAPI).optional(),
		projectPhase: z
			.lazy(() => TimeEntryPhasePublicAPIResponseEntity)
			.optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => TimeEntryCreatedByPublicResponse).optional(),
		updatedBy: z.lazy(() => TimeEntryUpdatedByPublicResponse).optional(),
		billable: z.boolean().optional(),
		user: z.lazy(() => UserPublicAPIResponseEntity).optional(),
		notes: z.string().optional(),
		category: z.lazy(() => TimeEntryCategoryPublicAPI).optional(),
		sourceType: z
			.enum([
				'GOOGLE_CALENDAR',
				'OUTLOOK_CALENDAR',
				'TASK',
				'PROJECT',
				'PHASE',
				'ADHOC',
				'MILESTONE',
			])
			.optional(),
		status: z
			.enum(['NOT_SUBMITTED', 'SUBMITTED', 'APPROVED', 'REJECTED'])
			.optional(),
		submittedBy: z.lazy(() => TimeEntrySubmittedByPublicResponse).optional(),
		submittedAt: z.number().optional(),
		approvedBy: z.lazy(() => TimeEntryApprovedByPublicResponse).optional(),
		approvedAt: z.number().optional(),
		rejectedBy: z.lazy(() => TimeEntryRejectedByPublicResponse).optional(),
		rejectedAt: z.number().optional(),
		deleted: z.boolean().optional(),
		costRate: z.lazy(() => TimeEntryCostRatePublicAPI).optional(),
		billRate: z.lazy(() => TimeEntryBillRatePublicAPI).optional(),
		budget: z
			.lazy(() => TimeEntryPublicProjectFinancialsBudgetResponse)
			.optional(),
		fields: z
			.array(z.lazy(() => TimeEntryFieldPublicResponseAPIEntity))
			.optional(),
	}),
);
export const TimeEntryPublicProjectFinancialsBudgetResponse = z.lazy(() =>
	z.object({
		budgetId: z.number().min(1).optional(),
		budgetName: z.string().optional(),
	}),
);
export const TimeEntryRejectedByPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TimeEntrySubmittedByPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TimeEntryTaskPublicAPI = z.lazy(() =>
	z.object({ taskName: z.string().optional(), taskId: z.number().optional() }),
);
export const TimeEntryUpdatedByPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const UserPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const FieldPublicRequestAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.union([z.string(), z.number()]).optional(),
	}),
);
export const TimeEntryPublicAPIUpdateRequest = z.lazy(() =>
	z.object({
		timeEntryId: z.number().min(1).optional(),
		date: z.string().optional(),
		minutes: z.number().min(1).max(1440).optional(),
		activityName: z.string().optional(),
		notes: z.string().optional(),
		category: z.lazy(() => TimeEntryCategoryPublicAPI).optional(),
		fields: z.array(z.lazy(() => FieldPublicRequestAPIEntity)).optional(),
		billable: z.boolean().optional(),
	}),
);
export const ExampleAPIResponseTimeEntries = z.lazy(() =>
	z.object({
		data: z
			.array(z.lazy(() => TimeEntryPublicAPIResponseForExample))
			.optional(),
		pagination: z.lazy(() => ExamplePaginationTimeEntries).optional(),
	}),
);
export const ExamplePaginationTimeEntries = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const TimeEntryPublicAPIResponseForExample = z.lazy(() =>
	z.object({
		timeEntryId: z.number().min(1).optional(),
		date: z.string().optional(),
		minutes: z.number().min(1).max(1440).optional(),
		activityName: z.string().optional(),
		project: z.lazy(() => TimeEntryProjectPublicAPIResponseEntity).optional(),
		task: z.lazy(() => TimeEntryTaskPublicAPI).optional(),
		projectPhase: z
			.lazy(() => TimeEntryPhasePublicAPIResponseEntity)
			.optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => TimeEntryCreatedByPublicResponse).optional(),
		updatedBy: z.lazy(() => TimeEntryUpdatedByPublicResponse).optional(),
		billable: z.boolean().optional(),
		user: z.lazy(() => UserPublicAPIResponseEntity).optional(),
		notes: z.string().optional(),
		category: z.lazy(() => TimeEntryCategoryPublicAPI).optional(),
		sourceType: z
			.enum([
				'GOOGLE_CALENDAR',
				'OUTLOOK_CALENDAR',
				'TASK',
				'PROJECT',
				'PHASE',
				'ADHOC',
				'MILESTONE',
			])
			.optional(),
		status: z
			.enum(['NOT_SUBMITTED', 'SUBMITTED', 'APPROVED', 'REJECTED'])
			.optional(),
		submittedBy: z.lazy(() => TimeEntrySubmittedByPublicResponse).optional(),
		submittedAt: z.number().optional(),
		approvedBy: z.lazy(() => TimeEntryApprovedByPublicResponse).optional(),
		approvedAt: z.number().optional(),
		rejectedBy: z.lazy(() => TimeEntryRejectedByPublicResponse).optional(),
		rejectedAt: z.number().optional(),
		deleted: z.boolean().optional(),
		costRate: z.lazy(() => TimeEntryCostRatePublicAPI).optional(),
		billRate: z.lazy(() => TimeEntryBillRatePublicAPI).optional(),
		budget: z
			.lazy(() => TimeEntryPublicProjectFinancialsBudgetResponse)
			.optional(),
		fields: z
			.array(z.lazy(() => TimeEntryFieldPublicResponseAPIEntity))
			.optional(),
	}),
);
export const TimeEntryBudgetPublicAPIRequest = z.lazy(() =>
	z.object({ budgetId: z.number().min(1).optional() }),
);
export const TimeEntryPhasePublicAPIRequestEntity = z.lazy(() =>
	z.object({
		phaseId: z.number().optional(),
		phaseName: z.string().optional(),
	}),
);
export const TimeEntryProjectPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		projectName: z.string().optional(),
		projectId: z.number().optional(),
	}),
);
export const TimeEntryPublicAPIRequest = z.lazy(() =>
	z.object({
		timeEntryId: z.number().min(1).optional(),
		date: z.string(),
		minutes: z.number().min(1).max(1440),
		activityName: z.string().optional(),
		project: z.lazy(() => TimeEntryProjectPublicAPIRequestEntity).optional(),
		task: z.lazy(() => TimeEntryTaskPublicAPI).optional(),
		projectPhase: z.lazy(() => TimeEntryPhasePublicAPIRequestEntity).optional(),
		billable: z.boolean().optional(),
		user: z.lazy(() => TimesheetsUserPublicAPI).optional(),
		notes: z.string().optional(),
		category: z.lazy(() => TimeEntryCategoryPublicAPI).optional(),
		budget: z.lazy(() => TimeEntryBudgetPublicAPIRequest).optional(),
		fields: z.array(z.lazy(() => FieldPublicRequestAPIEntity)).optional(),
	}),
);
export const TimesheetsUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ExampleAPIResponseTimeEntryCategories = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => TimeEntryCategoryPublicForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationTimeEntryCategories).optional(),
	}),
);
export const ExamplePaginationTimeEntryCategories = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const TimeEntryCategoryPublicForExample = z.lazy(() =>
	z.object({
		categoryName: z.string().optional(),
		categoryId: z.number().optional(),
	}),
);
export const SpacePublicAPISpaceTabResponseEntity = z.lazy(() =>
	z.object({
		spaceId: z.number().min(1).optional(),
		spaceName: z.string().optional(),
	}),
);
export const SpaceTabCreatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const SpaceTabPublicResponseAPIEntity = z.lazy(() =>
	z.object({
		spaceDocumentId: z.number().min(1).optional(),
		spaceDocumentName: z.string().optional(),
		space: z.lazy(() => SpacePublicAPISpaceTabResponseEntity).optional(),
		spaceDocumentType: z
			.enum(['ROCKETLANE_DOCUMENT', 'EMBEDDED_DOCUMENT'])
			.optional(),
		url: z.string().optional(),
		source: z.lazy(() => SpaceTabSourcePublicResponse).optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => SpaceTabCreatedByUserPublicAPI).optional(),
		updatedAt: z.number().optional(),
		updatedBy: z.lazy(() => SpaceTabUpdatedByUserPublicAPI).optional(),
		private: z.boolean().optional(),
	}),
);
export const SpaceTabSourcePublicResponse = z.lazy(() =>
	z.object({
		templateId: z.number().optional(),
		templateName: z.string().optional(),
	}),
);
export const SpaceTabUpdatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const SpaceTabUpdatePublicRequestAPIEntity = z.lazy(() =>
	z.object({
		spaceDocumentId: z.number().min(1).optional(),
		spaceDocumentName: z.string().optional(),
		url: z.string().optional(),
	}),
);
export const ExampleAPIResponseSpaceTabs = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => SpaceTabPublicResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationSpaceTabs).optional(),
	}),
);
export const ExamplePaginationSpaceTabs = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const SpaceTabPublicResponseForExample = z.lazy(() =>
	z.object({
		spaceDocumentId: z.number().min(1).optional(),
		spaceDocumentName: z.string().optional(),
		space: z.lazy(() => SpacePublicAPISpaceTabResponseEntity).optional(),
		spaceDocumentType: z
			.enum(['ROCKETLANE_DOCUMENT', 'EMBEDDED_DOCUMENT'])
			.optional(),
		url: z.string().optional(),
		source: z.lazy(() => SpaceTabSourcePublicResponse).optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => SpaceTabCreatedByUserPublicAPI).optional(),
		updatedAt: z.number().optional(),
		updatedBy: z.lazy(() => SpaceTabUpdatedByUserPublicAPI).optional(),
		private: z.boolean().optional(),
	}),
);
export const SpacePublicAPISpaceTabRequestEntity = z.lazy(() =>
	z.object({
		spaceId: z.number().min(1).optional(),
		spaceName: z.string().optional(),
	}),
);
export const SpaceTabImportPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		templateId: z.number().optional(),
		templateName: z.string().optional(),
	}),
);
export const SpaceTabPublicRequestAPIEntity = z.lazy(() =>
	z.object({
		spaceDocumentId: z.number().min(1).optional(),
		spaceDocumentName: z.string().optional(),
		space: z.lazy(() => SpacePublicAPISpaceTabRequestEntity),
		spaceDocumentType: z.enum(['ROCKETLANE_DOCUMENT', 'EMBEDDED_DOCUMENT']),
		url: z.string().optional(),
		source: z.lazy(() => SpaceTabImportPublicAPIRequestEntity).optional(),
	}),
);
export const ProjectRateCardPublicResponse = z.lazy(() =>
	z.object({
		rateCardId: z.number().optional(),
		rateCardName: z.string().optional(),
	}),
);
export const SubscriptionFinancialsPublicResponse = z.lazy(() =>
	z.object({
		subscriptionFrequency: z
			.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'HALF_YEARLY'])
			.optional(),
		subscriptionStartDate: z.string().optional(),
		periodMinutes: z.number().min(1).optional(),
		periodBudget: z.number().optional(),
		noOfPeriods: z.number().min(1).optional(),
	}),
);
export const BudgetFieldPublicResponseEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.object({}).optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const BudgetFinancialsMetrics = z.lazy(() =>
	z.object({
		actualRevenue: z.number().optional(),
		estimatedRevenue: z.number().optional(),
		actualRevenueInAccountCurrency: z.number().optional(),
		estimatedRevenueInAccountCurrency: z.number().optional(),
		actualTimeCost: z.number().optional(),
		estimatedTimeCost: z.number().optional(),
		actualTimeCostInAccountCurrency: z.number().optional(),
		estimatedTimeCostInAccountCurrency: z.number().optional(),
		actualExpenseCost: z.number().optional(),
		estimatedExpenseCost: z.number().optional(),
		actualExpenseCostInAccountCurrency: z.number().optional(),
		estimatedExpenseCostInAccountCurrency: z.number().optional(),
		actualCost: z.number().optional(),
		estimatedCost: z.number().optional(),
		actualCostInAccountCurrency: z.number().optional(),
		estimatedCostInAccountCurrency: z.number().optional(),
		trackedMinutes: z.number().optional(),
		remainingMinutes: z.number().optional(),
		allocatedMinutes: z.number().optional(),
		billableAllocatedMinutes: z.number().optional(),
		nonBillableAllocatedMinutes: z.number().optional(),
		billableTrackedMinutes: z.number().optional(),
		nonBillableTrackedMinutes: z.number().optional(),
		actualProfit: z.number().optional(),
		estimatedProfit: z.number().optional(),
		actualProfitInAccountCurrency: z.number().optional(),
		estimatedProfitInAccountCurrency: z.number().optional(),
		actualProfitMargin: z.number().optional(),
		estimatedProfitMargin: z.number().optional(),
		actualProfitMarginInAccountCurrency: z.number().optional(),
		estimatedProfitMarginInAccountCurrency: z.number().optional(),
		percentageBudgetedHoursConsumed: z.number().optional(),
		percentageBudgetConsumed: z.number().optional(),
		estimateAtCompletion: z.number().optional(),
		estimationToCompletionInHours: z.number().optional(),
	}),
);
export const BudgetManualRevenueRecognitionConfigPublicAPIResponseEntity =
	z.lazy(() =>
		z.object({
			manualRevenueRecognitionConfigId: z.number().optional(),
			recognitionDate: z.string().optional(),
			recognisedRevenue: z.number().optional(),
			recognisedPercentage: z.number().optional(),
		}),
	);
export const BudgetMilestoneRevenueRecognitionConfigPublicAPIResponseEntity =
	z.lazy(() =>
		z.object({
			milestoneRevenueRecognitionConfigId: z.number().optional(),
			sourceType: z.enum(['TASK']).optional(),
			sourceId: z.number().optional(),
			recognisedRevenue: z.number().optional(),
			recognisedPercentage: z.number().optional(),
		}),
	);
export const BudgetPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		budgetId: z.number().min(1).optional(),
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
		budgetName: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		status: z.lazy(() => BudgetStatusPublicResponse).optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		billingType: z
			.enum(['FIXED_FEE', 'TIME_AND_MATERIAL', 'SUBSCRIPTION', 'NON_BILLABLE'])
			.optional(),
		revenueRecognitionType: z.string().optional(),
		customRevenueRecognitionConfigId: z.number().optional(),
		budgetAmount: z.number().optional(),
		budgetHours: z.number().optional(),
		timeAndMaterialContract: z
			.lazy(() => BudgetTimeAndMaterialFinancialsPublicResponse)
			.optional(),
		subscriptionContract: z
			.lazy(() => SubscriptionFinancialsPublicResponse)
			.optional(),
		budgetFinancialsMetrics: z.lazy(() => BudgetFinancialsMetrics).optional(),
		manualRevenueRecognitionConfigs: z
			.array(
				z.lazy(
					() => BudgetManualRevenueRecognitionConfigPublicAPIResponseEntity,
				),
			)
			.optional(),
		milestoneRevenueRecognitionConfigs: z
			.array(
				z.lazy(
					() => BudgetMilestoneRevenueRecognitionConfigPublicAPIResponseEntity,
				),
			)
			.optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => ProjectVendorUserPublicAPI).optional(),
		updatedBy: z.lazy(() => ProjectVendorUserPublicAPI).optional(),
		fields: z.array(z.lazy(() => BudgetFieldPublicResponseEntity)).optional(),
		isDefault: z.boolean().optional(),
	}),
);
export const BudgetStatusPublicResponse = z.lazy(() =>
	z.object({
		value: z.number().min(1).optional(),
		label: z.string().optional(),
	}),
);
export const BudgetTimeAndMaterialFinancialsPublicResponse = z.lazy(() =>
	z.object({
		rateCard: z.lazy(() => ProjectRateCardPublicResponse).optional(),
	}),
);
export const BudgetMilestoneRevenueRecognitionConfigPublicAPIRequestEntity =
	z.lazy(() =>
		z.object({
			sourceType: z.enum(['TASK']),
			sourceId: z.number(),
			recognisedRevenue: z.number().optional(),
			recognisedPercentage: z.number().optional(),
		}),
	);
export const BudgetMilestoneRevenueRecognitionPlanPublicAPIRequestEntity =
	z.lazy(() =>
		z.object({
			milestoneRevenueRecognitionConfigs: z
				.array(
					z.lazy(
						() => BudgetMilestoneRevenueRecognitionConfigPublicAPIRequestEntity,
					),
				)
				.optional(),
		}),
	);
export const BudgetManualRevenueRecognitionConfigPublicAPIRequestEntity =
	z.lazy(() =>
		z.object({
			recognitionDate: z.string(),
			recognisedRevenue: z.number().optional(),
			recognisedPercentage: z.number().optional(),
		}),
	);
export const BudgetManualRevenueRecognitionPlanPublicAPIRequestEntity = z.lazy(
	() =>
		z.object({
			manualRevenueRecognitionConfigs: z
				.array(
					z.lazy(
						() => BudgetManualRevenueRecognitionConfigPublicAPIRequestEntity,
					),
				)
				.optional(),
		}),
);
export const BudgetFieldPublicRequestEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldValue: z.union([z.string(), z.number()]).optional(),
	}),
);
export const BudgetPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		budgetId: z.number().min(1).optional(),
		budgetName: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		status: z.lazy(() => BudgetStatusPublicRequest).optional(),
		billingType: z
			.enum(['FIXED_FEE', 'TIME_AND_MATERIAL', 'SUBSCRIPTION', 'NON_BILLABLE'])
			.optional(),
		revenueRecognitionType: z.string().optional(),
		customRevenueRecognitionConfigId: z.number().optional(),
		budgetAmount: z.number().optional(),
		budgetHours: z.number().optional(),
		timeAndMaterialContract: z
			.lazy(() => TimeAndMaterialFinancialsPublicRequest)
			.optional(),
		subscriptionContract: z
			.lazy(() => SubscriptionFinancialsPublicRequest)
			.optional(),
		fields: z.array(z.lazy(() => BudgetFieldPublicRequestEntity)).optional(),
	}),
);
export const BudgetStatusPublicRequest = z.lazy(() =>
	z.object({ value: z.number().min(1).optional() }),
);
export const ProjectRateCardPublicRequest = z.lazy(() =>
	z.object({ rateCardId: z.number().min(1).optional() }),
);
export const SubscriptionFinancialsPublicRequest = z.lazy(() =>
	z.object({
		subscriptionFrequency: z.enum([
			'MONTHLY',
			'QUARTERLY',
			'HALF_YEARLY',
			'YEARLY',
		]),
		subscriptionStartDate: z.string(),
		periodMinutes: z.number().min(1),
		periodBudget: z.number(),
		noOfPeriods: z.number().min(1),
	}),
);
export const TimeAndMaterialFinancialsPublicRequest = z.lazy(() =>
	z.object({ rateCard: z.lazy(() => ProjectRateCardPublicRequest).optional() }),
);
export const ExampleAPIResponseBudgets = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => BudgetPublicAPIResponseEntity)).optional(),
		pagination: z.lazy(() => ExamplePaginationBudgets).optional(),
	}),
);
export const ExamplePaginationBudgets = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const BudgetCreatePublicAPIRequestEntity = z.lazy(() =>
	z.object({
		projectId: z.number(),
		budgetName: z.string(),
		startDate: z.string(),
		endDate: z.string(),
		status: z.lazy(() => BudgetStatusPublicRequest).optional(),
		billingType: z.enum([
			'FIXED_FEE',
			'TIME_AND_MATERIAL',
			'SUBSCRIPTION',
			'NON_BILLABLE',
		]),
		revenueRecognitionType: z.string().optional(),
		customRevenueRecognitionConfigId: z.number().optional(),
		budgetAmount: z.number().optional(),
		budgetHours: z.number().optional(),
		timeAndMaterialContract: z
			.lazy(() => TimeAndMaterialFinancialsPublicRequest)
			.optional(),
		subscriptionContract: z
			.lazy(() => SubscriptionFinancialsPublicRequest)
			.optional(),
		fields: z.array(z.lazy(() => BudgetFieldPublicRequestEntity)).optional(),
	}),
);
export const AssigneePublicAPI = z.lazy(() =>
	z.object({
		members: z.array(z.lazy(() => TaskUserPublicAPI)).optional(),
		placeholders: z.array(z.lazy(() => TaskPlaceholderPublicAPI)).optional(),
	}),
);
export const ProjectPublicAPITaskResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
	}),
);
export const RevenueRecognitionPlanPublicResponse = z.lazy(() =>
	z.object({
		budgetId: z.number().optional(),
		budgetName: z.string().optional(),
		recognisedPercentage: z.number().optional(),
		recognisedAmount: z.number().optional(),
	}),
);
export const TaskCreatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TaskFieldPublicResponseAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.object({}).optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const TaskFollowersPublicResponse = z.lazy(() =>
	z.object({
		placeholders: z.array(z.lazy(() => TaskPlaceholderPublicAPI)).optional(),
		members: z.array(z.lazy(() => TaskUserPublicAPI)).optional(),
	}),
);
export const TaskPhasePublicLiteAPIResponseEntity = z.lazy(() =>
	z.object({
		phaseId: z.number().optional(),
		phaseName: z.string().optional(),
	}),
);
export const TaskPlaceholderPublicAPI = z.lazy(() =>
	z.object({
		placeholderId: z.number().optional(),
		placeholderName: z.string().optional(),
		role: z.lazy(() => RoleResponsePublicAPI).optional(),
	}),
);
export const TaskPriorityPublicResponse = z.lazy(() =>
	z.object({
		value: z.number().min(1).optional(),
		label: z.string().optional(),
	}),
);
export const TaskPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string().optional(),
		taskDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		archived: z.boolean().optional(),
		effortInMinutes: z.number().optional(),
		progress: z.number().optional(),
		atRisk: z.boolean().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		project: z.lazy(() => ProjectPublicAPITaskResponseEntity).optional(),
		status: z.lazy(() => TaskStatusPublicResponse).optional(),
		fields: z.array(z.lazy(() => TaskFieldPublicResponseAPIEntity)).optional(),
		revenueRecognitionTask: z.boolean().optional(),
		revenueRecognitionDetails: z
			.array(z.lazy(() => RevenueRecognitionPlanPublicResponse))
			.optional(),
		revRecRecognisedPercentage: z.number().optional(),
		revRecRecognisedAmount: z.number().optional(),
		totalAllocatedMins: z.number().optional(),
		startDateActual: z.string().optional(),
		dueDateActual: z.string().optional(),
		type: z.enum(['TASK', 'MILESTONE']).optional(),
		phase: z.lazy(() => TaskPhasePublicLiteAPIResponseEntity).optional(),
		assignees: z.lazy(() => AssigneePublicAPI).optional(),
		followers: z.lazy(() => TaskFollowersPublicResponse).optional(),
		dependencies: z
			.array(z.lazy(() => TaskPublicLiteAPIResponseEntity))
			.optional(),
		parent: z.lazy(() => TaskPublicLiteAPIResponseEntity).optional(),
		externalReferenceId: z.string().optional(),
		billable: z.boolean().optional(),
		timeEntryCategory: z
			.lazy(() => TaskPublicTimeEntryCategoryResponse)
			.optional(),
		budgets: z
			.array(z.lazy(() => TaskPublicProjectFinancialsBudgetResponse))
			.optional(),
		csatEnabled: z.boolean().optional(),
		priority: z.lazy(() => TaskPriorityPublicResponse).optional(),
		taskPrivateNote: z.string().optional(),
		private: z.boolean().optional(),
	}),
);
export const TaskPublicLiteAPIResponseEntity = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string().optional(),
	}),
);
export const TaskPublicProjectFinancialsBudgetResponse = z.lazy(() =>
	z.object({
		budgetId: z.number().min(1).optional(),
		budgetName: z.string().optional(),
	}),
);
export const TaskPublicTimeEntryCategoryResponse = z.lazy(() =>
	z.object({
		categoryId: z.number().min(1).optional(),
		categoryName: z.string().optional(),
	}),
);
export const TaskStatusPublicResponse = z.lazy(() =>
	z.object({
		value: z.number().min(1).optional(),
		label: z.string().optional(),
	}),
);
export const TaskUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TaskPublicUpdateAPIRequestEntity = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string().optional(),
		taskDescription: z.string().optional(),
		taskPrivateNote: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		effortInMinutes: z.number().optional(),
		progress: z.number().optional(),
		atRisk: z.boolean().optional(),
		type: z.enum(['TASK', 'MILESTONE']).optional(),
		fields: z.array(z.lazy(() => FieldPublicRequestAPIEntity)).optional(),
		status: z.lazy(() => TaskStatusPublicRequest).optional(),
		externalReferenceId: z.string().optional(),
		private: z.boolean().optional(),
	}),
);
export const TaskStatusPublicRequest = z.lazy(() =>
	z.object({ value: z.number().min(1).optional() }),
);
export const TaskPublicAssigneeAPIResponseEntity = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string().optional(),
		taskDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		archived: z.boolean().optional(),
		effortInMinutes: z.number().optional(),
		progress: z.number().optional(),
		atRisk: z.boolean().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		project: z.lazy(() => ProjectPublicAPITaskResponseEntity).optional(),
		status: z.lazy(() => TaskStatusPublicResponse).optional(),
		fields: z.array(z.lazy(() => TaskFieldPublicResponseAPIEntity)).optional(),
		revenueRecognitionTask: z.boolean().optional(),
		revenueRecognitionDetails: z
			.array(z.lazy(() => RevenueRecognitionPlanPublicResponse))
			.optional(),
		revRecRecognisedPercentage: z.number().optional(),
		revRecRecognisedAmount: z.number().optional(),
		totalAllocatedMins: z.number().optional(),
		assignees: z.lazy(() => AssigneePublicAPI).optional(),
		followers: z.lazy(() => TaskFollowersPublicResponse).optional(),
		private: z.boolean().optional(),
	}),
);
export const TaskAddFollowersPublicRequest = z.lazy(() =>
	z.object({
		members: z.array(z.lazy(() => TaskAssigneeUserPublicAPI)).optional(),
	}),
);
export const TaskAssigneeUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const TaskPublicDependenciesAPIResponseEntity = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string().optional(),
		taskDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		archived: z.boolean().optional(),
		effortInMinutes: z.number().optional(),
		progress: z.number().optional(),
		atRisk: z.boolean().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		project: z.lazy(() => ProjectPublicAPITaskResponseEntity).optional(),
		status: z.lazy(() => TaskStatusPublicResponse).optional(),
		fields: z.array(z.lazy(() => TaskFieldPublicResponseAPIEntity)).optional(),
		revenueRecognitionTask: z.boolean().optional(),
		revenueRecognitionDetails: z
			.array(z.lazy(() => RevenueRecognitionPlanPublicResponse))
			.optional(),
		revRecRecognisedPercentage: z.number().optional(),
		revRecRecognisedAmount: z.number().optional(),
		totalAllocatedMins: z.number().optional(),
		dependencies: z
			.array(z.lazy(() => TaskPublicLiteAPIResponseEntity))
			.optional(),
		private: z.boolean().optional(),
	}),
);
export const TaskDependencyPredecessorPublicRequest = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		dependencyType: z
			.enum([
				'FINISH_TO_START',
				'START_TO_START',
				'FINISH_TO_FINISH',
				'START_TO_FINISH',
			])
			.optional(),
		lag: z.number().optional(),
	}),
);
export const TaskDependencyPublicAPI = z.lazy(() =>
	z.object({
		dependencies: z.array(z.lazy(() => TaskDependencyPredecessorPublicRequest)),
	}),
);
export const TaskAssigneePlaceholderPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		placeholderId: z.number().optional(),
		placeholderName: z.string().optional(),
		role: z.lazy(() => RoleResponsePublicAPI).optional(),
	}),
);
export const TaskAssigneePublicRequestAPI = z.lazy(() =>
	z.object({
		members: z.array(z.lazy(() => TaskAssigneeUserPublicAPI)).optional(),
		placeholders: z
			.array(z.lazy(() => TaskAssigneePlaceholderPublicAPIRequestEntity))
			.optional(),
	}),
);
export const TaskPublicMovePhaseAPIResponseEntity = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string().optional(),
		taskDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		archived: z.boolean().optional(),
		effortInMinutes: z.number().optional(),
		progress: z.number().optional(),
		atRisk: z.boolean().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		project: z.lazy(() => ProjectPublicAPITaskResponseEntity).optional(),
		status: z.lazy(() => TaskStatusPublicResponse).optional(),
		fields: z.array(z.lazy(() => TaskFieldPublicResponseAPIEntity)).optional(),
		revenueRecognitionTask: z.boolean().optional(),
		revenueRecognitionDetails: z
			.array(z.lazy(() => RevenueRecognitionPlanPublicResponse))
			.optional(),
		revRecRecognisedPercentage: z.number().optional(),
		revRecRecognisedAmount: z.number().optional(),
		totalAllocatedMins: z.number().optional(),
		phase: z.lazy(() => TaskPhasePublicLiteAPIResponseEntity).optional(),
		private: z.boolean().optional(),
	}),
);
export const MovePhasePublicAPI = z.lazy(() =>
	z.object({ phase: z.lazy(() => MoveTaskPhasePublicAPI) }),
);
export const MoveTaskPhasePublicAPI = z.lazy(() =>
	z.object({
		phaseId: z.number().optional(),
		phaseName: z.string().optional(),
	}),
);
export const ExampleAPIResponseTasks = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => TaskPublicResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationTasks).optional(),
	}),
);
export const ExamplePaginationTasks = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const TaskPublicResponseForExample = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string().optional(),
		taskDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		archived: z.boolean().optional(),
		effortInMinutes: z.number().optional(),
		progress: z.number().optional(),
		atRisk: z.boolean().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => TaskCreatedByUserPublicAPI).optional(),
		project: z.lazy(() => ProjectPublicAPITaskResponseEntity).optional(),
		status: z.lazy(() => TaskStatusPublicResponse).optional(),
		fields: z.array(z.lazy(() => TaskFieldPublicResponseAPIEntity)).optional(),
		revenueRecognitionTask: z.boolean().optional(),
		revenueRecognitionDetails: z
			.array(z.lazy(() => RevenueRecognitionPlanPublicResponse))
			.optional(),
		revRecRecognisedPercentage: z.number().optional(),
		revRecRecognisedAmount: z.number().optional(),
		totalAllocatedMins: z.number().optional(),
		startDateActual: z.string().optional(),
		dueDateActual: z.string().optional(),
		type: z.enum(['TASK', 'MILESTONE']).optional(),
		phase: z.lazy(() => TaskPhasePublicLiteAPIResponseEntity).optional(),
		assignees: z.lazy(() => AssigneePublicAPI).optional(),
		followers: z.lazy(() => TaskFollowersPublicResponse).optional(),
		dependencies: z
			.array(z.lazy(() => TaskPublicLiteAPIResponseEntity))
			.optional(),
		parent: z.lazy(() => TaskPublicLiteAPIResponseEntity).optional(),
		externalReferenceId: z.string().optional(),
		billable: z.boolean().optional(),
		timeEntryCategory: z
			.lazy(() => TaskPublicTimeEntryCategoryResponse)
			.optional(),
		budgets: z
			.array(z.lazy(() => TaskPublicProjectFinancialsBudgetResponse))
			.optional(),
		csatEnabled: z.boolean().optional(),
		priority: z.lazy(() => TaskPriorityPublicResponse).optional(),
		taskPrivateNote: z.string().optional(),
		private: z.boolean().optional(),
	}),
);
export const ProjectPublicAPITaskRequestEntity = z.lazy(() =>
	z.object({ projectId: z.number().min(1).optional() }),
);
export const TaskFollowersPublicRequest = z.lazy(() =>
	z.object({
		members: z.array(z.lazy(() => TaskAssigneeUserPublicAPI)).optional(),
	}),
);
export const TaskImportSourcePublicRequest = z.lazy(() =>
	z.object({ templateId: z.number(), startDate: z.string() }),
);
export const TaskParentPublicRequestAPI = z.lazy(() =>
	z.object({ taskId: z.number().optional() }),
);
export const TaskPhasePublicAPIRequestEntity = z.lazy(() =>
	z.object({
		phaseId: z.number().optional(),
		phaseName: z.string().optional(),
	}),
);
export const TaskPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		taskId: z.number().min(1).optional(),
		taskName: z.string(),
		taskDescription: z.string().optional(),
		taskPrivateNote: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		effortInMinutes: z.number().optional(),
		progress: z.number().optional(),
		atRisk: z.boolean().optional(),
		type: z.enum(['TASK', 'MILESTONE']).optional(),
		project: z.lazy(() => ProjectPublicAPITaskRequestEntity),
		phase: z.lazy(() => TaskPhasePublicAPIRequestEntity).optional(),
		status: z.lazy(() => TaskStatusPublicRequest).optional(),
		fields: z.array(z.lazy(() => FieldPublicRequestAPIEntity)).optional(),
		assignees: z.lazy(() => TaskAssigneePublicRequestAPI).optional(),
		followers: z.lazy(() => TaskFollowersPublicRequest).optional(),
		parent: z.lazy(() => TaskParentPublicRequestAPI).optional(),
		externalReferenceId: z.string().optional(),
		source: z.lazy(() => TaskImportSourcePublicRequest).optional(),
		private: z.boolean().optional(),
	}),
);
export const CustomRevenueRecognitionConfigPublicAPIResponseEntity = z.lazy(
	() =>
		z.object({
			customRevenueRecognitionConfigId: z.number().optional(),
			customRevenueRecognitionConfigName: z.string().optional(),
			billingType: z.enum(['FIXED_FEE', 'TIME_AND_MATERIAL']).optional(),
		}),
);
export const ExampleAPIResponseCustomRevenueRecognitionConfigs = z.lazy(() =>
	z.object({
		data: z
			.array(
				z.lazy(() => CustomRevenueRecognitionConfigPublicAPIResponseEntity),
			)
			.optional(),
		pagination: z
			.lazy(() => ExamplePaginationCustomRevenueRecognitionConfigs)
			.optional(),
	}),
);
export const ExamplePaginationCustomRevenueRecognitionConfigs = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const FixedFeeFinancialsPublicResponse = z.lazy(() =>
	z.object({ fixedFee: z.number().optional() }),
);
export const ImportPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		prefix: z.string().optional(),
		startDate: z.string().optional(),
		templateId: z.number().optional(),
		templateName: z.string().optional(),
	}),
);
export const ProjectCustomerChampionUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectCustomerUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectFieldPublicResponseAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.string().optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const ProjectFinancialsMetrics = z.lazy(() =>
	z.object({
		actualRevenue: z.number().optional(),
		estimatedRevenue: z.number().optional(),
		actualCost: z.number().optional(),
		estimatedCost: z.number().optional(),
		actualProfit: z.number().optional(),
		estimatedProfit: z.number().optional(),
		actualProfitMargin: z.number().optional(),
		estimatedProfitMargin: z.number().optional(),
		estimateAtCompletion: z.number().optional(),
		estimationToCompletionInHours: z.number().optional(),
	}),
);
export const ProjectFinancialsPublicResponse = z.lazy(() =>
	z.object({
		contractType: z
			.enum(['FIXED_FEE', 'TIME_AND_MATERIAL', 'SUBSCRIPTION', 'NON_BILLABLE'])
			.optional(),
		revenueRecognitionType: z.string().optional(),
		fixedFeeContract: z.lazy(() => FixedFeeFinancialsPublicResponse).optional(),
		timeAndMaterialContract: z
			.lazy(() => TimeAndMaterialFinancialsPublicResponse)
			.optional(),
		subscriptionContract: z
			.lazy(() => SubscriptionFinancialsPublicResponse)
			.optional(),
		metrics: z.lazy(() => ProjectFinancialsMetrics).optional(),
	}),
);
export const ProjectOwnerUserPublicResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectPartnerCompanyPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		companyId: z.number().min(1).optional(),
		companyName: z.string().optional(),
		companyUrl: z.string().optional(),
	}),
);
export const ProjectPhasePublicLiteAPIResponseEntity = z.lazy(() =>
	z.object({
		phaseId: z.number().optional(),
		phaseName: z.string().optional(),
	}),
);
export const ProjectPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		sources: z.array(z.lazy(() => ImportPublicAPIResponseEntity)).optional(),
		dueDate: z.string().optional(),
		autoAllocation: z.boolean().optional(),
		dueDateActual: z.string().optional(),
		teamMembers: z.lazy(() => ProjectResponseMembersResponse).optional(),
		createdAt: z.number().optional(),
		archived: z.boolean().optional(),
		inferredProgress: z
			.enum(['ON_TRACK', 'AHEAD_OF_TIME', 'RUNNING_LATE', 'NONE'])
			.optional(),
		plannedDurationInDays: z.number().optional(),
		currentPhases: z
			.array(z.lazy(() => ProjectPhasePublicLiteAPIResponseEntity))
			.optional(),
		customersInvited: z.number().optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		updatedAt: z.number().optional(),
		owner: z.lazy(() => ProjectOwnerUserPublicResponse).optional(),
		budgetedHours: z.number().optional(),
		updatedBy: z.lazy(() => ProjectPublicUpdatedByResponse).optional(),
		partnerCompanies: z
			.array(z.lazy(() => ProjectPartnerCompanyPublicAPIResponseEntity))
			.optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS', 'GROUP']).optional(),
		annualizedRecurringRevenue: z.number().optional(),
		allocatedHours: z.number().optional(),
		trackedHours: z.number().optional(),
		projectAgeInDays: z.number().optional(),
		createdBy: z.lazy(() => ProjectPublicCreatedByResponse).optional(),
		projectFee: z.number().optional(),
		customersJoined: z.number().optional(),
		progressPercentage: z.number().optional(),
		projectName: z.string().optional(),
		fields: z
			.array(z.lazy(() => ProjectFieldPublicResponseAPIEntity))
			.optional(),
		projectId: z.number().min(1).optional(),
		startDate: z.string().optional(),
		customer: z.lazy(() => CustomerCompanyProjectPublicResponse).optional(),
		status: z.lazy(() => ProjectStatusPublicResponse).optional(),
		startDateActual: z.string().optional(),
		percentageBudgetedHoursConsumed: z.number().optional(),
		percentageBudgetConsumed: z.number().optional(),
		trackedMinutes: z.number().optional(),
		allocatedMinutes: z.number().optional(),
		billableHours: z.number().optional(),
		billableMinutes: z.number().optional(),
		nonBillableHours: z.number().optional(),
		nonBillableMinutes: z.number().optional(),
		remainingHours: z.number().optional(),
		remainingMinutes: z.number().optional(),
		externalReferenceId: z.string().optional(),
		financials: z.lazy(() => ProjectFinancialsPublicResponse).optional(),
	}),
);
export const ProjectPublicCreatedByResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectPublicUpdatedByResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectResponseMembersResponse = z.lazy(() =>
	z.object({
		members: z.array(z.lazy(() => ProjectVendorUserPublicAPI)).optional(),
		customers: z.array(z.lazy(() => ProjectCustomerUserPublicAPI)).optional(),
		customerChampion: z
			.lazy(() => ProjectCustomerChampionUserPublicAPI)
			.optional(),
	}),
);
export const ProjectStatusPublicResponse = z.lazy(() =>
	z.object({
		value: z.number().min(1).optional(),
		label: z.string().optional(),
	}),
);
export const TimeAndMaterialFinancialsPublicResponse = z.lazy(() =>
	z.object({
		rateCard: z.lazy(() => ProjectRateCardPublicResponse).optional(),
		projectBudget: z.number().min(1).optional(),
	}),
);
export const ProjectFieldPublicRequestAPIEntity = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldValue: z.union([z.string(), z.number()]).optional(),
	}),
);
export const ProjectOwnerCreatePublicRequest = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectPublicStatusRequest = z.lazy(() =>
	z.object({ value: z.number().min(1).optional() }),
);
export const ProjectPublicUpdateAPIRequestEntity = z.lazy(() =>
	z.object({
		projectName: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS']).optional(),
		owner: z.lazy(() => ProjectOwnerCreatePublicRequest).optional(),
		status: z.lazy(() => ProjectPublicStatusRequest).optional(),
		fields: z
			.array(z.lazy(() => ProjectFieldPublicRequestAPIEntity))
			.optional(),
		annualizedRecurringRevenue: z.number().optional(),
		projectFee: z.number().optional(),
		autoAllocation: z.boolean().optional(),
		budgetedHours: z.number().optional(),
		externalReferenceId: z.string().optional(),
	}),
);
export const PlaceholderMappingPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		placeholder: z.lazy(() => ProjectPlaceholderResponsePublicAPI).optional(),
		placeholderStatus: z.enum(['ASSIGNED', 'UNASSIGNED']).optional(),
		user: z
			.lazy(() => PlaceholderMappingUserPublicAPIResponseEntity)
			.optional(),
		hourlyCostRate: z.number().optional(),
		costRateCurrency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		hourlyBillRate: z.number().optional(),
		billRateCurrency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
	}),
);
export const PlaceholderMappingUserPublicAPIResponseEntity = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		role: z.string().optional(),
	}),
);
export const ProjectPlaceholderResponsePublicAPI = z.lazy(() =>
	z.object({
		placeholderId: z.number().optional(),
		placeholderName: z.string().optional(),
	}),
);
export const ProjectPublicPlaceholdersAPIResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		owner: z.lazy(() => ProjectOwnerUserPublicResponse).optional(),
		teamMembers: z.lazy(() => ProjectResponseMembersResponse).optional(),
		status: z.lazy(() => ProjectStatusPublicResponse).optional(),
		fields: z
			.array(z.lazy(() => ProjectFieldPublicResponseAPIEntity))
			.optional(),
		customer: z.lazy(() => CustomerCompanyProjectPublicResponse).optional(),
		partnerCompanies: z
			.array(z.lazy(() => ProjectPartnerCompanyPublicAPIResponseEntity))
			.optional(),
		archived: z.boolean().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS', 'GROUP']).optional(),
		createdBy: z.lazy(() => ProjectPublicCreatedByResponse).optional(),
		updatedBy: z.lazy(() => ProjectPublicUpdatedByResponse).optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		financials: z.lazy(() => ProjectFinancialsPublicResponse).optional(),
		placeholders: z
			.array(z.lazy(() => PlaceholderMappingPublicAPIResponseEntity))
			.optional(),
	}),
);
export const PlaceholderRemoveMappingPublicAPIRequestEntity = z.lazy(() =>
	z.object({ placeholderId: z.number() }),
);
export const ProjectPublicTeamMembersAPIResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		owner: z.lazy(() => ProjectOwnerUserPublicResponse).optional(),
		teamMembers: z.lazy(() => ProjectResponseMembersResponse).optional(),
		status: z.lazy(() => ProjectStatusPublicResponse).optional(),
		fields: z
			.array(z.lazy(() => ProjectFieldPublicResponseAPIEntity))
			.optional(),
		customer: z.lazy(() => CustomerCompanyProjectPublicResponse).optional(),
		partnerCompanies: z
			.array(z.lazy(() => ProjectPartnerCompanyPublicAPIResponseEntity))
			.optional(),
		archived: z.boolean().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS', 'GROUP']).optional(),
		createdBy: z.lazy(() => ProjectPublicCreatedByResponse).optional(),
		updatedBy: z.lazy(() => ProjectPublicUpdatedByResponse).optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		financials: z.lazy(() => ProjectFinancialsPublicResponse).optional(),
	}),
);
export const ProjectUsersPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const RemoveMembersPublicAPIRequestEntity = z.lazy(() =>
	z.object({ members: z.array(z.lazy(() => ProjectUsersPublicAPI)) }),
);
export const ProjectPublicImportTemplateAPIResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		owner: z.lazy(() => ProjectOwnerUserPublicResponse).optional(),
		teamMembers: z.lazy(() => ProjectResponseMembersResponse).optional(),
		status: z.lazy(() => ProjectStatusPublicResponse).optional(),
		fields: z
			.array(z.lazy(() => ProjectFieldPublicResponseAPIEntity))
			.optional(),
		customer: z.lazy(() => CustomerCompanyProjectPublicResponse).optional(),
		partnerCompanies: z
			.array(z.lazy(() => ProjectPartnerCompanyPublicAPIResponseEntity))
			.optional(),
		archived: z.boolean().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS', 'GROUP']).optional(),
		createdBy: z.lazy(() => ProjectPublicCreatedByResponse).optional(),
		updatedBy: z.lazy(() => ProjectPublicUpdatedByResponse).optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		financials: z.lazy(() => ProjectFinancialsPublicResponse).optional(),
		sources: z.array(z.lazy(() => ImportPublicAPIResponseEntity)).optional(),
	}),
);
export const ProjectImportPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		prefix: z.string().optional(),
		startDate: z.string(),
		templateId: z.number(),
	}),
);
export const PlaceholderMappingPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		placeholderId: z.number(),
		user: z.lazy(() => PlaceholderMappingUserPublicAPIRequestEntity),
	}),
);
export const PlaceholderMappingUserPublicAPIRequestEntity = z.lazy(() =>
	z.object({ emailId: z.string().optional(), userId: z.number().optional() }),
);
export const ProjectAddMembersPublicRequest = z.lazy(() =>
	z.object({
		members: z.array(z.lazy(() => ProjectVendorUserPublicAPI)).optional(),
		customers: z.array(z.lazy(() => ProjectCustomerUserPublicAPI)).optional(),
	}),
);
export const ExampleAPIResponseProjects = z.lazy(() =>
	z.object({
		data: z
			.array(z.lazy(() => ProjectPublicAPIResponseExampleEntity))
			.optional(),
		pagination: z.lazy(() => ExamplePaginationProjects).optional(),
	}),
);
export const ExamplePaginationProjects = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const ProjectPublicAPIResponseExampleEntity = z.lazy(() =>
	z.object({
		sources: z.array(z.lazy(() => ImportPublicAPIResponseEntity)).optional(),
		dueDate: z.string().optional(),
		autoAllocation: z.boolean().optional(),
		dueDateActual: z.string().optional(),
		teamMembers: z.lazy(() => ProjectResponseMembersResponse).optional(),
		createdAt: z.number().optional(),
		archived: z.boolean().optional(),
		inferredProgress: z
			.enum(['ON_TRACK', 'AHEAD_OF_TIME', 'RUNNING_LATE', 'NONE'])
			.optional(),
		plannedDurationInDays: z.number().optional(),
		currentPhases: z
			.array(z.lazy(() => ProjectPhasePublicLiteAPIResponseEntity))
			.optional(),
		customersInvited: z.number().optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		updatedAt: z.number().optional(),
		owner: z.lazy(() => ProjectOwnerUserPublicResponse).optional(),
		budgetedHours: z.number().optional(),
		updatedBy: z.lazy(() => ProjectPublicUpdatedByResponse).optional(),
		partnerCompanies: z
			.array(z.lazy(() => ProjectPartnerCompanyPublicAPIResponseEntity))
			.optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS', 'GROUP']).optional(),
		annualizedRecurringRevenue: z.number().optional(),
		allocatedHours: z.number().optional(),
		trackedHours: z.number().optional(),
		projectAgeInDays: z.number().optional(),
		createdBy: z.lazy(() => ProjectPublicCreatedByResponse).optional(),
		projectFee: z.number().optional(),
		customersJoined: z.number().optional(),
		progressPercentage: z.number().optional(),
		projectName: z.string().optional(),
		fields: z
			.array(z.lazy(() => ProjectFieldPublicResponseAPIEntity))
			.optional(),
		projectId: z.number().min(1).optional(),
		startDate: z.string().optional(),
		customer: z.lazy(() => CustomerCompanyProjectPublicResponse).optional(),
		status: z.lazy(() => ProjectStatusPublicResponse).optional(),
		startDateActual: z.string().optional(),
		percentageBudgetedHoursConsumed: z.number().optional(),
		percentageBudgetConsumed: z.number().optional(),
		trackedMinutes: z.number().optional(),
		allocatedMinutes: z.number().optional(),
		billableHours: z.number().optional(),
		billableMinutes: z.number().optional(),
		nonBillableHours: z.number().optional(),
		nonBillableMinutes: z.number().optional(),
		remainingHours: z.number().optional(),
		remainingMinutes: z.number().optional(),
		externalReferenceId: z.string().optional(),
		financials: z.lazy(() => ProjectFinancialsPublicResponse).optional(),
	}),
);
export const CustomerCompanyProjectPublicRequest = z.lazy(() =>
	z.object({
		companyName: z.string().optional(),
		companyId: z.number().min(1).optional(),
	}),
);
export const FixedFeeFinancialsPublicRequest = z.lazy(() =>
	z.object({ fixedFee: z.number().min(0) }),
);
export const MembersPublicAPI = z.lazy(() =>
	z.object({
		members: z.array(z.lazy(() => ProjectVendorUserPublicAPI)).optional(),
		customers: z.array(z.lazy(() => ProjectCustomerUserPublicAPI)).optional(),
		customerChampion: z
			.lazy(() => ProjectCustomerChampionUserPublicAPI)
			.optional(),
	}),
);
export const ProjectFinancialDetailsPublicRequest = z.lazy(() =>
	z.object({
		contractType: z.enum([
			'FIXED_FEE',
			'TIME_AND_MATERIAL',
			'NON_BILLABLE',
			'SUBSCRIPTION',
		]),
		fixedFeeContract: z.lazy(() => FixedFeeFinancialsPublicRequest).optional(),
		timeAndMaterialContract: z
			.lazy(() => TimeAndMaterialFinancialsPublicRequest)
			.optional(),
		subscriptionContract: z
			.lazy(() => SubscriptionFinancialsPublicRequest)
			.optional(),
	}),
);
export const ProjectOwnerUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectPartnerCompanyPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		companyName: z.string().optional(),
		companyId: z.number().optional(),
	}),
);
export const ProjectPublicAPIRequestEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		visibility: z.enum(['EVERYONE', 'MEMBERS']).optional(),
		owner: z.lazy(() => ProjectOwnerUserPublicAPI),
		teamMembers: z.lazy(() => MembersPublicAPI).optional(),
		status: z.lazy(() => ProjectPublicStatusRequest).optional(),
		fields: z
			.array(z.lazy(() => ProjectFieldPublicRequestAPIEntity))
			.optional(),
		customer: z.lazy(() => CustomerCompanyProjectPublicRequest),
		partners: z
			.array(z.lazy(() => ProjectPartnerCompanyPublicAPIRequestEntity))
			.optional(),
		sources: z
			.array(z.lazy(() => ProjectImportPublicAPIRequestEntity))
			.optional(),
		assignProjectOwner: z.boolean().optional(),
		placeholders: z
			.array(z.lazy(() => PlaceholderMappingPublicAPIRequestEntity))
			.optional(),
		annualizedRecurringRevenue: z.number().optional(),
		projectFee: z.number().optional(),
		autoAllocation: z.boolean().optional(),
		autoCreateCompany: z.boolean().optional(),
		budgetedHours: z.number().min(0).optional(),
		financials: z.lazy(() => ProjectFinancialDetailsPublicRequest).optional(),
		currency: z
			.enum([
				'AFN',
				'ALL',
				'DZD',
				'ARS',
				'AMD',
				'AUD',
				'AZN',
				'BHD',
				'BDT',
				'BYN',
				'BZD',
				'BOB',
				'BAM',
				'BWP',
				'BRL',
				'GBP',
				'BND',
				'BGN',
				'BIF',
				'KHR',
				'CAD',
				'CVE',
				'XAF',
				'CLP',
				'CNY',
				'COP',
				'KMF',
				'CDF',
				'CRC',
				'HRK',
				'CZK',
				'DKK',
				'DJF',
				'DOP',
				'EGP',
				'ERN',
				'EEK',
				'ETB',
				'EUR',
				'GEL',
				'GHS',
				'GTQ',
				'GNF',
				'HNL',
				'HKD',
				'HUF',
				'ISK',
				'INR',
				'IDR',
				'IRR',
				'IQD',
				'ILS',
				'JMD',
				'JPY',
				'JOD',
				'KZT',
				'KES',
				'KWD',
				'LVL',
				'LBP',
				'LYD',
				'LTL',
				'MOP',
				'MKD',
				'MGA',
				'MYR',
				'MUR',
				'MXN',
				'MDL',
				'MAD',
				'MZN',
				'MMK',
				'NAD',
				'NPR',
				'TWD',
				'NZD',
				'NIO',
				'NGN',
				'NOK',
				'OMR',
				'PKR',
				'PAB',
				'PYG',
				'PEN',
				'PHP',
				'PLN',
				'QAR',
				'RON',
				'RUB',
				'RWF',
				'SAR',
				'RSD',
				'SGD',
				'SOS',
				'ZAR',
				'KRW',
				'LKR',
				'SDG',
				'SEK',
				'CHF',
				'SYP',
				'TZS',
				'THB',
				'TOP',
				'TTD',
				'TND',
				'TRY',
				'USD',
				'UGX',
				'UAH',
				'AED',
				'UYU',
				'UZS',
				'VEF',
				'VND',
				'XOF',
				'YER',
				'ZMK',
				'ZWL',
			])
			.optional(),
		externalReferenceId: z.string().optional(),
	}),
);
export const ExampleAPIResponsePlaceholders = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => PlaceholderPublicResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationPlaceholders).optional(),
	}),
);
export const ExamplePaginationPlaceholders = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const PlaceholderPublicResponseForExample = z.lazy(() =>
	z.object({
		placeholderId: z.number().min(1).optional(),
		placeholderName: z.string().optional(),
		project: z.lazy(() => ProjectPublicAPIPlaceholderResponseEntity).optional(),
		role: z.lazy(() => RolePublicAPIPlaceholderResponseEntity).optional(),
		placeholderType: z.enum(['NATIVE', 'EXTERNAL']).optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
	}),
);
export const ProjectPublicAPIPlaceholderResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
	}),
);
export const RolePublicAPIPlaceholderResponseEntity = z.lazy(() =>
	z.object({
		roleId: z.number().min(1).optional(),
		roleName: z.string().optional(),
	}),
);
export const PhaseCreatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const PhasePublicAPIResponseEntity = z.lazy(() =>
	z.object({
		phaseId: z.number().min(1).optional(),
		phaseName: z.string().optional(),
		project: z.lazy(() => ProjectPublicAPIPhaseResponseEntity).optional(),
		phaseDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		startDateActual: z.string().optional(),
		dueDateActual: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => PhaseCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => PhaseUpdatedByUserPublicAPI).optional(),
		status: z.lazy(() => PhaseStatusPublicResponse).optional(),
		budgets: z
			.array(z.lazy(() => PhasePublicProjectFinancialsBudgetResponse))
			.optional(),
		private: z.boolean().optional(),
	}),
);
export const PhasePublicProjectFinancialsBudgetResponse = z.lazy(() =>
	z.object({
		budgetId: z.number().min(1).optional(),
		budgetName: z.string().optional(),
	}),
);
export const PhaseStatusPublicResponse = z.lazy(() =>
	z.object({
		value: z.number().min(1).optional(),
		label: z.string().optional(),
	}),
);
export const PhaseUpdatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const ProjectPublicAPIPhaseResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
	}),
);
export const PhasePublicUpdateAPIRequestEntity = z.lazy(() =>
	z.object({
		phaseName: z.string().optional(),
		phaseDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		status: z.lazy(() => PhaseStatusPublicRequest).optional(),
		private: z.boolean().optional(),
	}),
);
export const PhaseStatusPublicRequest = z.lazy(() =>
	z.object({ value: z.number().min(1).optional() }),
);
export const ExampleAPIResponsePhases = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => PhasePublicAPIResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationPhases).optional(),
	}),
);
export const ExamplePaginationPhases = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const PhasePublicAPIResponseForExample = z.lazy(() =>
	z.object({
		phaseId: z.number().min(1).optional(),
		phaseName: z.string().optional(),
		project: z.lazy(() => ProjectPublicAPIPhaseResponseEntity).optional(),
		phaseDescription: z.string().optional(),
		startDate: z.string().optional(),
		dueDate: z.string().optional(),
		startDateActual: z.string().optional(),
		dueDateActual: z.string().optional(),
		createdAt: z.number().optional(),
		updatedAt: z.number().optional(),
		createdBy: z.lazy(() => PhaseCreatedByUserPublicAPI).optional(),
		updatedBy: z.lazy(() => PhaseUpdatedByUserPublicAPI).optional(),
		status: z.lazy(() => PhaseStatusPublicResponse).optional(),
		budgets: z
			.array(z.lazy(() => PhasePublicProjectFinancialsBudgetResponse))
			.optional(),
		private: z.boolean().optional(),
	}),
);
export const PhasePublicAPIRequestEntity = z.lazy(() =>
	z.object({
		phaseId: z.number().min(1).optional(),
		phaseName: z.string(),
		project: z.lazy(() => ProjectPublicAPIPhaseRequestEntity),
		phaseDescription: z.string().optional(),
		startDate: z.string(),
		dueDate: z.string(),
		status: z.lazy(() => PhaseStatusPublicRequest).optional(),
		private: z.boolean().optional(),
	}),
);
export const ProjectPublicAPIPhaseRequestEntity = z.lazy(() =>
	z.object({ projectId: z.number().min(1) }),
);
export const FieldUsersPublicAPIResponse = z.lazy(() =>
	z.object({
		fieldId: z.number().min(1).optional(),
		fieldLabel: z.string().optional(),
		fieldValue: z.string().optional(),
		fieldValueLabel: z.string().optional(),
	}),
);
export const PermissionUsersPublicAPIResponse = z.lazy(() =>
	z.object({
		permissionId: z.number().min(1).optional(),
		permissionName: z.string().optional(),
	}),
);
export const RoleUsersPublicAPIResponse = z.lazy(() =>
	z.object({
		roleId: z.number().min(1).optional(),
		roleName: z.string().optional(),
	}),
);
export const UsersCompanyPublicAPIResponse = z.lazy(() =>
	z.object({
		companyId: z.number().optional(),
		companyName: z.string().optional(),
	}),
);
export const UsersCreatedByResponse = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const UsersHolidayCalendarPublicAPIResponse = z.lazy(() =>
	z.object({
		calenderId: z.number().optional(),
		calenderName: z.string().optional(),
	}),
);
export const UsersPublicAPIResponse = z.lazy(() =>
	z.object({
		userId: z.number().min(1).optional(),
		email: z.string().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		type: z
			.enum(['TEAM_MEMBER', 'PARTNER', 'CUSTOMER', 'EXTERNAL_PARTNER'])
			.optional(),
		status: z.enum(['INACTIVE', 'INVITED', 'ACTIVE', 'PASSIVE']).optional(),
		role: z.lazy(() => RoleUsersPublicAPIResponse).optional(),
		company: z.lazy(() => UsersCompanyPublicAPIResponse).optional(),
		permission: z.lazy(() => PermissionUsersPublicAPIResponse).optional(),
		fields: z.array(z.lazy(() => FieldUsersPublicAPIResponse)).optional(),
		capacityInMinutes: z.number().min(5).optional(),
		holidayCalendar: z
			.lazy(() => UsersHolidayCalendarPublicAPIResponse)
			.optional(),
		profilePictureUrl: z.string().optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => UsersCreatedByResponse).optional(),
		updatedAt: z.number().optional(),
		updatedBy: z.lazy(() => UsersCreatedByResponse).optional(),
	}),
);
export const ExampleAPIResponseUsers = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => UsersPublicResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationUsers).optional(),
	}),
);
export const ExamplePaginationUsers = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const UsersPublicResponseForExample = z.lazy(() =>
	z.object({
		userId: z.number().min(1).optional(),
		email: z.string().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		type: z
			.enum(['TEAM_MEMBER', 'PARTNER', 'CUSTOMER', 'EXTERNAL_PARTNER'])
			.optional(),
		status: z.enum(['INACTIVE', 'INVITED', 'ACTIVE', 'PASSIVE']).optional(),
		role: z.lazy(() => RoleUsersPublicAPIResponse).optional(),
		company: z.lazy(() => UsersCompanyPublicAPIResponse).optional(),
		permission: z.lazy(() => PermissionUsersPublicAPIResponse).optional(),
		fields: z.array(z.lazy(() => FieldUsersPublicAPIResponse)).optional(),
		capacityInMinutes: z.number().min(5).optional(),
		holidayCalendar: z
			.lazy(() => UsersHolidayCalendarPublicAPIResponse)
			.optional(),
		profilePictureUrl: z.string().optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => UsersCreatedByResponse).optional(),
		updatedAt: z.number().optional(),
		updatedBy: z.lazy(() => UsersCreatedByResponse).optional(),
	}),
);
export const ProjectPublicAPISpaceResponseEntity = z.lazy(() =>
	z.object({
		projectId: z.number().min(1).optional(),
		projectName: z.string().optional(),
	}),
);
export const SpaceCreatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const SpacePublicResponseEntity = z.lazy(() =>
	z.object({
		spaceId: z.number().min(1).optional(),
		spaceName: z.string().optional(),
		project: z.lazy(() => ProjectPublicAPISpaceResponseEntity).optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => SpaceCreatedByUserPublicAPI).optional(),
		updatedAt: z.number().optional(),
		updatedBy: z.lazy(() => SpaceUpdatedByUserPublicAPI).optional(),
		private: z.boolean().optional(),
	}),
);
export const SpaceUpdatedByUserPublicAPI = z.lazy(() =>
	z.object({
		emailId: z.string().optional(),
		userId: z.number().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
);
export const SpacePublicUpdateAPIRequestEntity = z.lazy(() =>
	z.object({ spaceName: z.string().optional() }),
);
export const ExampleAPIResponseSpaces = z.lazy(() =>
	z.object({
		data: z.array(z.lazy(() => SpacePublicResponseForExample)).optional(),
		pagination: z.lazy(() => ExamplePaginationSpaces).optional(),
	}),
);
export const ExamplePaginationSpaces = z.lazy(() =>
	z.object({
		pageSize: z.number().optional(),
		hasMore: z.boolean().optional(),
		totalRecordCount: z.number().optional(),
		nextPage: z.string().optional(),
		nextPageToken: z.string().optional(),
	}),
);
export const SpacePublicResponseForExample = z.lazy(() =>
	z.object({
		spaceId: z.number().min(1).optional(),
		spaceName: z.string().optional(),
		project: z.lazy(() => ProjectPublicAPISpaceResponseEntity).optional(),
		createdAt: z.number().optional(),
		createdBy: z.lazy(() => SpaceCreatedByUserPublicAPI).optional(),
		updatedAt: z.number().optional(),
		updatedBy: z.lazy(() => SpaceUpdatedByUserPublicAPI).optional(),
		private: z.boolean().optional(),
	}),
);
export const ProjectPublicAPISpaceRequestEntity = z.lazy(() =>
	z.object({ projectId: z.number().min(1) }),
);
export const SpacePublicRequestEntity = z.lazy(() =>
	z.object({
		spaceId: z.number().min(1).optional(),
		spaceName: z.string(),
		project: z.lazy(() => ProjectPublicAPISpaceRequestEntity),
		private: z.boolean().optional(),
	}),
);

export const getInvoicePaymentsInputSchema = z.object({
	invoiceId: z.number().min(0),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
});
export const getInvoicePaymentsOutputSchema = z.lazy(
	() => ExampleAPIResponseInvoicePayments,
);
export const getInvoiceLineItemsInputSchema = z.object({
	invoiceId: z.number().min(0),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
});
export const getInvoiceLineItemsOutputSchema = z.lazy(
	() => ExampleAPIResponseInvoiceLineItems,
);
export const getInvoiceInputSchema = z.object({
	invoiceId: z.number().min(0),
	includeFields: z.array(z.enum(['notes', 'attachments'])).optional(),
	includeAllFields: z.boolean().optional(),
});
export const getInvoiceOutputSchema = z.lazy(
	() => InvoicePublicAPIResponseEntity,
);
export const searchInvoicesInputSchema = z.object({
	'dateOfIssue.eq': z.string().optional(),
	'dateOfIssue.gt': z.string().optional(),
	'dateOfIssue.ge': z.string().optional(),
	'dateOfIssue.lt': z.string().optional(),
	'dateOfIssue.le': z.string().optional(),
	'dueDate.eq': z.string().optional(),
	'dueDate.gt': z.string().optional(),
	'dueDate.ge': z.string().optional(),
	'dueDate.lt': z.string().optional(),
	'dueDate.le': z.string().optional(),
	'amount.eq': z.number().optional(),
	'amount.gt': z.number().optional(),
	'amount.ge': z.number().optional(),
	'amount.lt': z.number().optional(),
	'amount.le': z.number().optional(),
	'amountOutstanding.eq': z.number().optional(),
	'amountOutstanding.gt': z.number().optional(),
	'amountOutstanding.ge': z.number().optional(),
	'amountOutstanding.lt': z.number().optional(),
	'amountOutstanding.le': z.number().optional(),
	'amountPaid.eq': z.number().optional(),
	'amountPaid.gt': z.number().optional(),
	'amountPaid.ge': z.number().optional(),
	'amountPaid.lt': z.number().optional(),
	'amountPaid.le': z.number().optional(),
	'amountWrittenOff.eq': z.number().optional(),
	'amountWrittenOff.gt': z.number().optional(),
	'amountWrittenOff.ge': z.number().optional(),
	'amountWrittenOff.lt': z.number().optional(),
	'amountWrittenOff.le': z.number().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'companyId.eq': z.string().optional(),
	'companyId.oneOf': z.string().optional(),
	'companyId.noneOf': z.string().optional(),
	'invoiceNumber.eq': z.string().optional(),
	'invoiceNumber.cn': z.string().optional(),
	'invoiceNumber.nc': z.string().optional(),
	'status.eq': z.string().optional(),
	'status.oneOf': z.string().optional(),
	'status.noneOf': z.string().optional(),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z.array(z.enum(['notes', 'attachments'])).optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z.enum(['createdAt', 'invoiceNumber']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
});
export const searchInvoicesOutputSchema = z.lazy(
	() => ExampleAPIResponseInvoices,
);
export const getCompanyInputSchema = z.object({
	companyId: z.number().min(0),
	includeFields: z.array(z.enum(['companyUrl', 'notes'])).optional(),
	includeAllFields: z.boolean().optional(),
});
export const getCompanyOutputSchema = z.lazy(
	() => CustomerCompanyPublicAPIResponseEntity,
);
export const updateCompanyInputSchema = z.object({
	companyId: z.number().min(0),
	includeFields: z.array(z.enum(['companyUrl', 'notes'])).optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => CustomerCompanyPublicUpdateAPIRequestEntity),
});
export const updateCompanyOutputSchema = z.lazy(
	() => CustomerCompanyPublicAPIResponseEntity,
);
export const deleteCompanyInputSchema = z.object({
	companyId: z.number().min(0),
});
export const deleteCompanyOutputSchema = z.void();
export const createCompanyNoteInputSchema = z.object({
	companyId: z.number().min(0),
	body: z.lazy(() => CompanyNoteCreateRequestAPIEntity),
});
export const createCompanyNoteOutputSchema = z.lazy(
	() => CompanyNotePublicResponseAPIEntity,
);
export const getAllCompaniesInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z.array(z.enum(['companyUrl', 'notes'])).optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z.enum(['companyName', 'createdAt', 'updatedAt']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'companyName.eq': z.string().optional(),
	'companyName.cn': z.string().optional(),
	'companyName.nc': z.string().optional(),
	'companyUrl.eq': z.string().optional(),
	'companyUrl.cn': z.string().optional(),
	'companyUrl.nc': z.string().optional(),
	'accountOwner.eq': z.string().optional(),
	'accountOwner.oneOf': z.string().optional(),
	'accountOwner.noneOf': z.string().optional(),
});
export const getAllCompaniesOutputSchema = z.lazy(
	() => ExampleAPIResponseCompanies,
);
export const createCompanyInputSchema = z.object({
	includeFields: z.array(z.enum(['companyUrl', 'notes'])).optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => CustomerCompanyPublicAPIRequestEntity),
});
export const createCompanyOutputSchema = z.lazy(
	() => CustomerCompanyPublicAPIResponseEntity,
);
export const getAllResourceAllocationsInputSchema = z.object({
	startDate: z.string(),
	endDate: z.string(),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z
		.array(z.enum(['member', 'task', 'placeholder', 'duration']))
		.optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z
		.enum(['startDate', 'endDate', 'allocationType', 'allocationFor'])
		.optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'memberId.eq': z.string().optional(),
	'memberId.oneOf': z.string().optional(),
	'memberId.noneOf': z.string().optional(),
	'projectId.eq': z.string().optional(),
	'projectId.oneOf': z.string().optional(),
	'projectId.noneOf': z.string().optional(),
	'placeholderId.eq': z.string().optional(),
	'placeholderId.oneOf': z.string().optional(),
	'placeholderId.noneOf': z.string().optional(),
});
export const getAllResourceAllocationsOutputSchema = z.lazy(
	() => ExampleAPIResponseResourceAllocations,
);
export const getAllTimeoffsInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z.array(z.enum(['note', 'notifyUsers'])).optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z.enum(['startDate', 'endDate', 'createdAt']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'startDate.gt': z.string().optional(),
	'startDate.eq': z.string().optional(),
	'startDate.lt': z.string().optional(),
	'startDate.ge': z.string().optional(),
	'startDate.le': z.string().optional(),
	'endDate.gt': z.string().optional(),
	'endDate.eq': z.string().optional(),
	'endDate.lt': z.string().optional(),
	'endDate.ge': z.string().optional(),
	'endDate.le': z.string().optional(),
	'type.eq': z.array(z.enum(['FULL_DAY', 'HALF_DAY', 'CUSTOM'])).optional(),
	'type.oneOf': z.array(z.enum(['FULL_DAY', 'HALF_DAY', 'CUSTOM'])).optional(),
	'type.noneOf': z.array(z.enum(['FULL_DAY', 'HALF_DAY', 'CUSTOM'])).optional(),
	'userId.eq': z.string().optional(),
	'userId.oneOf': z.string().optional(),
	'userId.noneOf': z.string().optional(),
	'emailId.eq': z.string().optional(),
	'emailId.oneOf': z.string().optional(),
	'emailId.noneOf': z.string().optional(),
});
export const getAllTimeoffsOutputSchema = z.lazy(
	() => ExampleAPIResponseTimeOffs,
);
export const createTimeoffInputSchema = z.object({
	includeFields: z.array(z.enum(['note', 'notifyUsers'])).optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => TimeOffPublicAPIRequestEntity).optional(),
});
export const createTimeoffOutputSchema = z.lazy(
	() => TimeOffPublicAPIResponseEntity,
);
export const getTimeoffInputSchema = z.object({
	timeOffId: z.number().min(0),
	includeFields: z.array(z.enum(['note', 'notifyUsers'])).optional(),
	includeAllFields: z.boolean().optional(),
});
export const getTimeoffOutputSchema = z.lazy(
	() => TimeOffPublicAPIResponseEntity,
);
export const deleteTimeoffInputSchema = z.object({
	timeOffId: z.number().min(0),
});
export const deleteTimeoffOutputSchema = z.void();
export const getFieldInputSchema = z.object({
	fieldId: z.number().min(0),
	includeFields: z.array(z.enum(['options'])).optional(),
	includeAllFields: z.boolean().optional(),
});
export const getFieldOutputSchema = z.lazy(
	() => FieldModelPublicResponseAPIEntity,
);
export const updateFieldInputSchema = z.object({
	fieldId: z.number().min(0),
	includeFields: z.array(z.enum(['options'])).optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => FieldUpdatePublicRequest).optional(),
});
export const updateFieldOutputSchema = z.lazy(
	() => FieldModelPublicResponseAPIEntity,
);
export const deleteFieldInputSchema = z.object({ fieldId: z.number().min(0) });
export const deleteFieldOutputSchema = z.void();
export const updateFieldOptionInputSchema = z.object({
	fieldId: z.number().min(0),
	body: z.lazy(() => FieldOptionUpdatePublicRequest).optional(),
});
export const updateFieldOptionOutputSchema = z.lazy(
	() => OptionsPublicAPIResponseEntity,
);
export const addFieldOptionInputSchema = z.object({
	fieldId: z.number().min(0),
	body: z.lazy(() => FieldOptionPublicRequest).optional(),
});
export const addFieldOptionOutputSchema = z.lazy(
	() => OptionsPublicAPIResponseEntity,
);
export const getAllFieldsInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z.array(z.enum(['options'])).optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z.enum(['fieldLabel']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
	'objectType.eq': z
		.enum(['PROJECT', 'TASK', 'USER', 'BUDGET', 'COMPANY'])
		.optional(),
	'fieldType.eq': z
		.enum([
			'TEXT',
			'MULTI_LINE_TEXT',
			'YES_OR_NO',
			'DATE',
			'SINGLE_CHOICE',
			'MULTIPLE_CHOICE',
			'SINGLE_USER',
			'MULTIPLE_USER',
			'NUMBER',
			'NOTE',
			'RATING',
		])
		.optional(),
	'enabled.eq': z.boolean().optional(),
	'private.eq': z.boolean().optional(),
});
export const getAllFieldsOutputSchema = z.lazy(() => ExampleAPIResponseFields);
export const createFieldInputSchema = z.object({
	includeFields: z.array(z.enum(['options'])).optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => FieldPublicRequest).optional(),
});
export const createFieldOutputSchema = z.lazy(
	() => FieldModelPublicResponseAPIEntity,
);
export const getTimeEntryInputSchema = z.object({
	timeEntryId: z.number().min(0),
	includeFields: z
		.array(
			z.enum([
				'notes',
				'sourceType',
				'deleted',
				'status',
				'submittedBy',
				'submittedAt',
				'approvedBy',
				'approvedAt',
				'rejectedBy',
				'rejectedAt',
				'costRate',
				'billRate',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
});
export const getTimeEntryOutputSchema = z.lazy(
	() => TimeEntryPublicAPIResponseEntity,
);
export const updateTimeEntryInputSchema = z.object({
	timeEntryId: z.number().min(0),
	includeFields: z
		.array(
			z.enum([
				'notes',
				'sourceType',
				'deleted',
				'status',
				'submittedBy',
				'submittedAt',
				'approvedBy',
				'approvedAt',
				'rejectedBy',
				'rejectedAt',
				'costRate',
				'billRate',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => TimeEntryPublicAPIUpdateRequest).optional(),
});
export const updateTimeEntryOutputSchema = z.lazy(
	() => TimeEntryPublicAPIResponseEntity,
);
export const deleteTimeEntryInputSchema = z.object({
	timeEntryId: z.number().min(0),
});
export const deleteTimeEntryOutputSchema = z.void();
export const getAllTimeEntriesInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z
		.array(
			z.enum([
				'notes',
				'sourceType',
				'deleted',
				'status',
				'submittedBy',
				'submittedAt',
				'approvedBy',
				'approvedAt',
				'rejectedBy',
				'rejectedAt',
				'costRate',
				'billRate',
			]),
		)
		.optional(),
	sortBy: z.enum(['minutes', 'date', 'id', 'billable']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'date.gt': z.string().optional(),
	'date.eq': z.string().optional(),
	'date.lt': z.string().optional(),
	'date.ge': z.string().optional(),
	'date.le': z.string().optional(),
	'project.eq': z.number().optional(),
	'projectId.eq': z.number().optional(),
	'task.eq': z.number().optional(),
	'taskId.eq': z.number().optional(),
	'taskId.oneOf': z.number().optional(),
	'taskId.noneOf': z.number().optional(),
	'projectPhase.eq': z.number().optional(),
	'category.eq': z.number().optional(),
	'user.eq': z.number().optional(),
	'emailId.eq': z.string().optional(),
	'emailId.cn': z.string().optional(),
	'emailId.nc': z.string().optional(),
	'sourceType.eq': z
		.enum([
			'GOOGLE_CALENDAR',
			'OUTLOOK_CALENDAR',
			'TASK',
			'PROJECT',
			'PHASE',
			'ADHOC',
			'MILESTONE',
		])
		.optional(),
	'activityName.eq': z.string().optional(),
	'activityName.cn': z.string().optional(),
	'activityName.nc': z.string().optional(),
	'approvalStatus.eq': z
		.enum(['NOT_SUBMITTED', 'SUBMITTED', 'APPROVED', 'REJECTED'])
		.optional(),
	'submittedBy.eq': z.number().optional(),
	'submittedAt.eq': z.number().optional(),
	'submittedAt.gt': z.number().optional(),
	'submittedAt.ge': z.number().optional(),
	'submittedAt.lt': z.number().optional(),
	'submittedAt.le': z.number().optional(),
	'approvedBy.eq': z.number().optional(),
	'approvedAt.eq': z.number().optional(),
	'approvedAt.gt': z.number().optional(),
	'approvedAt.ge': z.number().optional(),
	'approvedAt.lt': z.number().optional(),
	'approvedAt.le': z.number().optional(),
	'rejectedBy.eq': z.number().optional(),
	'rejectedAt.eq': z.number().optional(),
	'rejectedAt.gt': z.number().optional(),
	'rejectedAt.ge': z.number().optional(),
	'rejectedAt.lt': z.number().optional(),
	'rejectedAt.le': z.number().optional(),
	'billable.eq': z.boolean().optional(),
	'includeDeleted.eq': z.boolean().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
});
export const getAllTimeEntriesOutputSchema = z.lazy(
	() => ExampleAPIResponseTimeEntries,
);
export const createTimeEntryInputSchema = z.object({
	includeFields: z
		.array(
			z.enum([
				'notes',
				'sourceType',
				'deleted',
				'status',
				'submittedBy',
				'submittedAt',
				'approvedBy',
				'approvedAt',
				'rejectedBy',
				'rejectedAt',
				'costRate',
				'billRate',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => TimeEntryPublicAPIRequest).optional(),
});
export const createTimeEntryOutputSchema = z.lazy(
	() => TimeEntryPublicAPIResponseEntity,
);
export const searchTimeEntriesInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z.string().optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z.enum(['minutes', 'date', 'id', 'billable']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'date.gt': z.string().optional(),
	'date.eq': z.string().optional(),
	'date.lt': z.string().optional(),
	'date.ge': z.string().optional(),
	'date.le': z.string().optional(),
	'project.eq': z.number().optional(),
	'task.eq': z.number().optional(),
	'projectPhase.eq': z.number().optional(),
	'category.eq': z.number().optional(),
	'user.eq': z.number().optional(),
	'sourceType.eq': z
		.enum([
			'GOOGLE_CALENDAR',
			'OUTLOOK_CALENDAR',
			'TASK',
			'PROJECT',
			'PHASE',
			'ADHOC',
			'MILESTONE',
		])
		.optional(),
	'activityName.eq': z.string().optional(),
	'activityName.cn': z.string().optional(),
	'activityName.nc': z.string().optional(),
	'approvalStatus.eq': z
		.enum(['NOT_SUBMITTED', 'SUBMITTED', 'APPROVED', 'REJECTED'])
		.optional(),
});
export const searchTimeEntriesOutputSchema = z.lazy(
	() => ExampleAPIResponseTimeEntries,
);
export const getTimeEntryCategoriesInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
});
export const getTimeEntryCategoriesOutputSchema = z.lazy(
	() => ExampleAPIResponseTimeEntryCategories,
);
export const getSpaceDocumentInputSchema = z.object({
	spaceDocumentId: z.number().min(0),
});
export const getSpaceDocumentOutputSchema = z.lazy(
	() => SpaceTabPublicResponseAPIEntity,
);
export const updateSpaceDocumentInputSchema = z.object({
	spaceDocumentId: z.number().min(0),
	body: z.lazy(() => SpaceTabUpdatePublicRequestAPIEntity).optional(),
});
export const updateSpaceDocumentOutputSchema = z.lazy(
	() => SpaceTabPublicResponseAPIEntity,
);
export const deleteSpaceDocumentInputSchema = z.object({
	spaceDocumentId: z.number().min(0),
});
export const deleteSpaceDocumentOutputSchema = z.void();
export const getAllSpaceDocumentsInputSchema = z.object({
	projectId: z.number().min(0),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	sortBy: z.enum(['spaceTabName']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'spaceDocumentName.eq': z.string().optional(),
	'spaceDocumentName.cn': z.string().optional(),
	'spaceDocumentName.nc': z.string().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
	'spaceId.eq': z.number().optional(),
});
export const getAllSpaceDocumentsOutputSchema = z.lazy(
	() => ExampleAPIResponseSpaceTabs,
);
export const createSpaceDocumentInputSchema = z.object({
	body: z.lazy(() => SpaceTabPublicRequestAPIEntity).optional(),
});
export const createSpaceDocumentOutputSchema = z.lazy(
	() => SpaceTabPublicResponseAPIEntity,
);
export const updateBudgetMilestoneRevenueRecognitionConfigsInputSchema =
	z.object({
		budgetId: z.number().min(1),
		includeFields: z
			.array(
				z.enum([
					'manualRevenueRecognitionConfigs',
					'milestoneRevenueRecognitionConfigs',
				]),
			)
			.optional(),
		includeAllFields: z.boolean().optional(),
		body: z.lazy(
			() => BudgetMilestoneRevenueRecognitionPlanPublicAPIRequestEntity,
		),
	});
export const updateBudgetMilestoneRevenueRecognitionConfigsOutputSchema =
	z.lazy(() => BudgetPublicAPIResponseEntity);
export const updateBudgetManualRevenueRecognitionConfigsInputSchema = z.object({
	budgetId: z.number().min(1),
	includeFields: z
		.array(
			z.enum([
				'manualRevenueRecognitionConfigs',
				'milestoneRevenueRecognitionConfigs',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => BudgetManualRevenueRecognitionPlanPublicAPIRequestEntity),
});
export const updateBudgetManualRevenueRecognitionConfigsOutputSchema = z.lazy(
	() => BudgetPublicAPIResponseEntity,
);
export const getBudgetInputSchema = z.object({
	budgetId: z.number().min(1),
	includeFields: z
		.array(
			z.enum([
				'manualRevenueRecognitionConfigs',
				'milestoneRevenueRecognitionConfigs',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
});
export const getBudgetOutputSchema = z.lazy(
	() => BudgetPublicAPIResponseEntity,
);
export const updateBudgetInputSchema = z.object({
	budgetId: z.number().min(1),
	includeFields: z
		.array(
			z.enum([
				'manualRevenueRecognitionConfigs',
				'milestoneRevenueRecognitionConfigs',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => BudgetPublicAPIRequestEntity),
});
export const updateBudgetOutputSchema = z.lazy(
	() => BudgetPublicAPIResponseEntity,
);
export const deleteBudgetInputSchema = z.object({
	budgetId: z.number().min(1),
});
export const deleteBudgetOutputSchema = z.void();
export const searchBudgetsInputSchema = z.object({
	'budgetId.eq': z.string().optional(),
	'budgetId.oneOf': z.string().optional(),
	'budgetId.noneOf': z.string().optional(),
	'projectId.eq': z.string().optional(),
	'projectId.oneOf': z.string().optional(),
	'projectId.noneOf': z.string().optional(),
	'status.eq': z.string().optional(),
	'status.oneOf': z.string().optional(),
	'status.noneOf': z.string().optional(),
	'billingType.eq': z.string().optional(),
	'billingType.oneOf': z.string().optional(),
	'billingType.noneOf': z.string().optional(),
	'revenueRecognitionType.eq': z.string().optional(),
	'revenueRecognitionType.oneOf': z.string().optional(),
	'revenueRecognitionType.noneOf': z.string().optional(),
	'budgetAmount.eq': z.string().optional(),
	'budgetAmount.gt': z.string().optional(),
	'budgetAmount.ge': z.string().optional(),
	'budgetAmount.lt': z.string().optional(),
	'budgetAmount.le': z.string().optional(),
	'budgetHours.eq': z.string().optional(),
	'budgetHours.gt': z.string().optional(),
	'budgetHours.ge': z.string().optional(),
	'budgetHours.lt': z.string().optional(),
	'budgetHours.le': z.string().optional(),
	'budgetName.eq': z.string().optional(),
	'budgetName.cn': z.string().optional(),
	'budgetName.nc': z.string().optional(),
	'startDate.eq': z.string().optional(),
	'startDate.gt': z.string().optional(),
	'startDate.ge': z.string().optional(),
	'startDate.lt': z.string().optional(),
	'startDate.le': z.string().optional(),
	'endDate.eq': z.string().optional(),
	'endDate.gt': z.string().optional(),
	'endDate.ge': z.string().optional(),
	'endDate.lt': z.string().optional(),
	'endDate.le': z.string().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'companyId.eq': z.string().optional(),
	'companyId.oneOf': z.string().optional(),
	'companyId.noneOf': z.string().optional(),
	'isDefault.eq': z.string().optional(),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z
		.array(
			z.enum([
				'manualRevenueRecognitionConfigs',
				'milestoneRevenueRecognitionConfigs',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z
		.enum([
			'createdAt',
			'budgetId',
			'projectId',
			'budgetName',
			'budgetHours',
			'budgetAmount',
			'startDate',
			'endDate',
		])
		.optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
});
export const searchBudgetsOutputSchema = z.lazy(
	() => ExampleAPIResponseBudgets,
);
export const createBudgetInputSchema = z.object({
	includeFields: z
		.array(
			z.enum([
				'manualRevenueRecognitionConfigs',
				'milestoneRevenueRecognitionConfigs',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => BudgetCreatePublicAPIRequestEntity),
});
export const createBudgetOutputSchema = z.lazy(
	() => BudgetPublicAPIResponseEntity,
);
export const getTaskInputSchema = z.object({
	taskId: z.number().min(0),
	includeFields: z
		.array(
			z.enum([
				'startDateActual',
				'dueDateActual',
				'type',
				'phase',
				'assignees',
				'followers',
				'dependencies',
				'billable',
				'csatEnabled',
				'priority',
				'timeEntryCategory',
				'budgets',
				'taskPrivateNote',
				'parent',
				'externalReferenceId',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
});
export const getTaskOutputSchema = z.lazy(() => TaskPublicAPIResponseEntity);
export const updateTaskInputSchema = z.object({
	taskId: z.number().min(0),
	includeFields: z
		.array(
			z.enum([
				'startDateActual',
				'dueDateActual',
				'type',
				'phase',
				'assignees',
				'followers',
				'dependencies',
				'billable',
				'csatEnabled',
				'priority',
				'timeEntryCategory',
				'budgets',
				'taskPrivateNote',
				'parent',
				'externalReferenceId',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => TaskPublicUpdateAPIRequestEntity).optional(),
});
export const updateTaskOutputSchema = z.lazy(() => TaskPublicAPIResponseEntity);
export const deleteTaskInputSchema = z.object({ taskId: z.number().min(0) });
export const deleteTaskOutputSchema = z.void();
export const removeFollowersFromTaskInputSchema = z.object({
	taskId: z.number().min(0),
	body: z.lazy(() => TaskAddFollowersPublicRequest).optional(),
});
export const removeFollowersFromTaskOutputSchema = z.lazy(
	() => TaskPublicAssigneeAPIResponseEntity,
);
export const removeDependenciesFromTaskInputSchema = z.object({
	taskId: z.number().min(0),
	body: z.lazy(() => TaskDependencyPublicAPI).optional(),
});
export const removeDependenciesFromTaskOutputSchema = z.lazy(
	() => TaskPublicDependenciesAPIResponseEntity,
);
export const removeAssigneesFromTaskInputSchema = z.object({
	taskId: z.number().min(0),
	body: z.lazy(() => TaskAssigneePublicRequestAPI).optional(),
});
export const removeAssigneesFromTaskOutputSchema = z.lazy(
	() => TaskPublicAssigneeAPIResponseEntity,
);
export const moveTaskToGivenPhaseInputSchema = z.object({
	taskId: z.number().min(0),
	body: z.lazy(() => MovePhasePublicAPI).optional(),
});
export const moveTaskToGivenPhaseOutputSchema = z.lazy(
	() => TaskPublicMovePhaseAPIResponseEntity,
);
export const addFollowersToTaskInputSchema = z.object({
	taskId: z.number().min(0),
	body: z.lazy(() => TaskAddFollowersPublicRequest).optional(),
});
export const addFollowersToTaskOutputSchema = z.lazy(
	() => TaskPublicAssigneeAPIResponseEntity,
);
export const addDependenciesToTaskInputSchema = z.object({
	taskId: z.number().min(0),
	body: z.lazy(() => TaskDependencyPublicAPI).optional(),
});
export const addDependenciesToTaskOutputSchema = z.lazy(
	() => TaskPublicDependenciesAPIResponseEntity,
);
export const addAssigneeToTaskInputSchema = z.object({
	taskId: z.number().min(0),
	body: z.lazy(() => TaskAssigneePublicRequestAPI).optional(),
});
export const addAssigneeToTaskOutputSchema = z.lazy(
	() => TaskPublicAssigneeAPIResponseEntity,
);
export const getAllTasksInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z
		.array(
			z.enum([
				'startDateActual',
				'dueDateActual',
				'type',
				'phase',
				'assignees',
				'followers',
				'dependencies',
				'billable',
				'csatEnabled',
				'priority',
				'timeEntryCategory',
				'budgets',
				'taskPrivateNote',
				'parent',
				'externalReferenceId',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z
		.enum([
			'taskName',
			'startDate',
			'dueDate',
			'startDateActual',
			'dueDateActual',
		])
		.optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'startDate.gt': z.string().optional(),
	'startDate.eq': z.string().optional(),
	'startDate.lt': z.string().optional(),
	'startDate.ge': z.string().optional(),
	'startDate.le': z.string().optional(),
	'dueDate.gt': z.string().optional(),
	'dueDate.eq': z.string().optional(),
	'dueDate.lt': z.string().optional(),
	'dueDate.ge': z.string().optional(),
	'dueDate.le': z.string().optional(),
	'startDateActual.gt': z.string().optional(),
	'startDateActual.eq': z.string().optional(),
	'startDateActual.lt': z.string().optional(),
	'startDateActual.ge': z.string().optional(),
	'startDateActual.le': z.string().optional(),
	'dueDateActual.gt': z.string().optional(),
	'dueDateActual.eq': z.string().optional(),
	'dueDateActual.lt': z.string().optional(),
	'dueDateActual.ge': z.string().optional(),
	'dueDateActual.le': z.string().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
	'projectId.eq': z.number().optional(),
	'phaseId.eq': z.number().optional(),
	'taskName.eq': z.string().optional(),
	'taskName.cn': z.string().optional(),
	'taskName.nc': z.string().optional(),
	'effortInMinutes.eq': z.number().optional(),
	'effortInMinutes.gt': z.number().optional(),
	'effortInMinutes.lt': z.number().optional(),
	'progress.eq': z.number().min(0).max(100).optional(),
	'progress.gt': z.number().min(0).max(100).optional(),
	'progress.lt': z.number().min(0).max(100).optional(),
	'includeArchive.eq': z.boolean().optional(),
	'task.status.eq': z.string().optional(),
	'task.status.oneOf': z.string().optional(),
	'task.status.noneOf': z.string().optional(),
	'project.status.eq': z.string().optional(),
	'project.status.oneOf': z.string().optional(),
	'project.status.noneOf': z.string().optional(),
	'externalReferenceId.eq': z.string().optional(),
	'assignee.userId.eq': z.string().optional(),
	'assignee.userId.oneOf': z.string().optional(),
	'assignee.userId.noneOf': z.string().optional(),
});
export const getAllTasksOutputSchema = z.lazy(() => ExampleAPIResponseTasks);
export const createTaskInputSchema = z.object({
	includeFields: z
		.array(
			z.enum([
				'startDateActual',
				'dueDateActual',
				'type',
				'phase',
				'assignees',
				'followers',
				'dependencies',
				'billable',
				'csatEnabled',
				'priority',
				'timeEntryCategory',
				'budgets',
				'taskPrivateNote',
				'parent',
				'externalReferenceId',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => TaskPublicAPIRequestEntity).optional(),
});
export const createTaskOutputSchema = z.lazy(() => TaskPublicAPIResponseEntity);
export const getCustomRevenueRecognitionConfigInputSchema = z.object({
	customRevenueRecognitionConfigId: z.number().min(0),
});
export const getCustomRevenueRecognitionConfigOutputSchema = z.lazy(
	() => CustomRevenueRecognitionConfigPublicAPIResponseEntity,
);
export const getAllCustomRevenueRecognitionConfigsInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	sortBy: z.enum(['customRevenueRecognitionConfigName']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'customRevenueRecognitionConfigName.eq': z.string().optional(),
	'customRevenueRecognitionConfigName.cn': z.string().optional(),
	'customRevenueRecognitionConfigName.nc': z.string().optional(),
	'billingType.eq': z.enum(['FIXED_FEE', 'TIME_AND_MATERIAL']).optional(),
	'billingType.oneOf': z.string().optional(),
	'billingType.noneOf': z.string().optional(),
});
export const getAllCustomRevenueRecognitionConfigsOutputSchema = z.lazy(
	() => ExampleAPIResponseCustomRevenueRecognitionConfigs,
);
export const getProjectInputSchema = z.object({
	projectId: z.number().min(0),
	includeFields: z
		.array(
			z.enum([
				'annualizedRecurringRevenue',
				'projectFee',
				'allocatedHours',
				'allocatedMinutes',
				'budgetedHours',
				'percentageBudgetedHoursConsumed',
				'percentageBudgetConsumed',
				'billableHours',
				'billableMinutes',
				'nonBillableHours',
				'nonBillableMinutes',
				'trackedHours',
				'trackedMinutes',
				'progressPercentage',
				'startDateActual',
				'dueDateActual',
				'currentPhase',
				'autoAllocation',
				'sources',
				'inferredProgress',
				'plannedDuration',
				'projectAgeInDays',
				'customersInvited',
				'customersJoined',
				'externalReferenceId',
				'metrics',
				'remainingMinutes',
				'remainingHours',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
});
export const getProjectOutputSchema = z.lazy(
	() => ProjectPublicAPIResponseEntity,
);
export const updateProjectInputSchema = z.object({
	projectId: z.number().min(0),
	includeFields: z
		.array(
			z.enum([
				'annualizedRecurringRevenue',
				'projectFee',
				'allocatedHours',
				'allocatedMinutes',
				'budgetedHours',
				'percentageBudgetedHoursConsumed',
				'percentageBudgetConsumed',
				'billableHours',
				'billableMinutes',
				'nonBillableHours',
				'nonBillableMinutes',
				'trackedHours',
				'trackedMinutes',
				'progressPercentage',
				'startDateActual',
				'dueDateActual',
				'currentPhase',
				'autoAllocation',
				'sources',
				'inferredProgress',
				'plannedDuration',
				'projectAgeInDays',
				'customersInvited',
				'customersJoined',
				'externalReferenceId',
				'metrics',
				'remainingMinutes',
				'remainingHours',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => ProjectPublicUpdateAPIRequestEntity).optional(),
});
export const updateProjectOutputSchema = z.lazy(
	() => ProjectPublicAPIResponseEntity,
);
export const deleteProjectInputSchema = z.object({
	projectId: z.number().min(0),
});
export const deleteProjectOutputSchema = z.void();
export const unassignPlaceholdersInputSchema = z.object({
	projectId: z.number().min(0),
	body: z.array(z.lazy(() => PlaceholderRemoveMappingPublicAPIRequestEntity)),
});
export const unassignPlaceholdersOutputSchema = z.lazy(
	() => ProjectPublicPlaceholdersAPIResponseEntity,
);
export const removeMembersInputSchema = z.object({
	projectId: z.number().min(0),
	body: z.lazy(() => RemoveMembersPublicAPIRequestEntity),
});
export const removeMembersOutputSchema = z.lazy(
	() => ProjectPublicTeamMembersAPIResponseEntity,
);
export const importTemplateInputSchema = z.object({
	projectId: z.number().min(0),
	body: z.array(z.lazy(() => ProjectImportPublicAPIRequestEntity)),
});
export const importTemplateOutputSchema = z.lazy(
	() => ProjectPublicImportTemplateAPIResponseEntity,
);
export const assignPlaceholdersInputSchema = z.object({
	projectId: z.number().min(0),
	body: z.array(z.lazy(() => PlaceholderMappingPublicAPIRequestEntity)),
});
export const assignPlaceholdersOutputSchema = z.lazy(
	() => ProjectPublicPlaceholdersAPIResponseEntity,
);
export const archiveProjectInputSchema = z.object({
	projectId: z.number().min(0),
});
export const archiveProjectOutputSchema = z.void();
export const addMembersInputSchema = z.object({
	projectId: z.number().min(0),
	body: z.lazy(() => ProjectAddMembersPublicRequest),
});
export const addMembersOutputSchema = z.lazy(
	() => ProjectPublicTeamMembersAPIResponseEntity,
);
export const getAllProjectsInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z
		.array(
			z.enum([
				'annualizedRecurringRevenue',
				'projectFee',
				'allocatedHours',
				'allocatedMinutes',
				'budgetedHours',
				'percentageBudgetedHoursConsumed',
				'percentageBudgetConsumed',
				'billableHours',
				'billableMinutes',
				'nonBillableHours',
				'nonBillableMinutes',
				'trackedHours',
				'trackedMinutes',
				'progressPercentage',
				'startDateActual',
				'dueDateActual',
				'currentPhase',
				'autoAllocation',
				'sources',
				'inferredProgress',
				'plannedDuration',
				'projectAgeInDays',
				'customersInvited',
				'customersJoined',
				'externalReferenceId',
				'metrics',
				'remainingMinutes',
				'remainingHours',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z
		.enum([
			'projectName',
			'startDate',
			'dueDate',
			'startDateActual',
			'dueDateActual',
			'annualizedRecurringRevenue',
			'projectFee',
		])
		.optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'startDate.gt': z.string().optional(),
	'startDate.eq': z.string().optional(),
	'startDate.lt': z.string().optional(),
	'startDate.ge': z.string().optional(),
	'startDate.le': z.string().optional(),
	'dueDate.gt': z.string().optional(),
	'dueDate.eq': z.string().optional(),
	'dueDate.lt': z.string().optional(),
	'dueDate.ge': z.string().optional(),
	'dueDate.le': z.string().optional(),
	'startDateActual.gt': z.string().optional(),
	'startDateActual.eq': z.string().optional(),
	'startDateActual.lt': z.string().optional(),
	'startDateActual.ge': z.string().optional(),
	'startDateActual.le': z.string().optional(),
	'dueDateActual.gt': z.string().optional(),
	'dueDateActual.eq': z.string().optional(),
	'dueDateActual.lt': z.string().optional(),
	'dueDateActual.ge': z.string().optional(),
	'dueDateActual.le': z.string().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
	'annualizedRecurringRevenue.eq': z.number().optional(),
	'annualizedRecurringRevenue.gt': z.number().optional(),
	'annualizedRecurringRevenue.lt': z.number().optional(),
	'projectFee.eq': z.number().optional(),
	'projectFee.gt': z.number().optional(),
	'projectFee.lt': z.number().optional(),
	'customerId.eq': z.string().optional(),
	'customerId.oneOf': z.string().optional(),
	'customerId.noneOf': z.string().optional(),
	'teamMemberId.eq': z.string().optional(),
	'teamMemberId.oneOf': z.string().optional(),
	'teamMemberId.noneOf': z.string().optional(),
	'companyId.eq': z.string().optional(),
	'companyId.oneOf': z.string().optional(),
	'companyId.noneOf': z.string().optional(),
	'projectName.eq': z.string().optional(),
	'projectName.cn': z.string().optional(),
	'projectName.nc': z.string().optional(),
	'inferredProgress.eq': z
		.array(z.enum(['ON_TRACK', 'AHEAD_OF_TIME', 'RUNNING_LATE', 'NONE']))
		.optional(),
	'contractType.eq': z
		.array(
			z.enum([
				'FIXED_FEE',
				'TIME_AND_MATERIAL',
				'SUBSCRIPTION',
				'NON_BILLABLE',
			]),
		)
		.optional(),
	'contractType.oneOf': z
		.array(
			z.enum([
				'FIXED_FEE',
				'TIME_AND_MATERIAL',
				'SUBSCRIPTION',
				'NON_BILLABLE',
			]),
		)
		.optional(),
	'contractType.noneOf': z
		.array(
			z.enum([
				'FIXED_FEE',
				'TIME_AND_MATERIAL',
				'SUBSCRIPTION',
				'NON_BILLABLE',
			]),
		)
		.optional(),
	'budgetedHours.gt': z.string().optional(),
	'budgetedHours.eq': z.string().optional(),
	'budgetedHours.lt': z.string().optional(),
	'budgetedHours.ge': z.string().optional(),
	'allocatedHours.le': z.string().optional(),
	'allocatedHours.gt': z.string().optional(),
	'allocatedHours.eq': z.string().optional(),
	'allocatedHours.lt': z.string().optional(),
	'allocatedHours.ge': z.string().optional(),
	'customersInvited.gt': z.string().optional(),
	'customersInvited.eq': z.string().optional(),
	'customersInvited.lt': z.string().optional(),
	'customersInvited.ge': z.string().optional(),
	'customersInvited.le': z.string().optional(),
	'customersJoined.gt': z.string().optional(),
	'customersJoined.eq': z.string().optional(),
	'customersJoined.lt': z.string().optional(),
	'customersJoined.ge': z.string().optional(),
	'customersJoined.le': z.string().optional(),
	'includeArchive.eq': z.boolean().optional(),
	'status.eq': z.string().optional(),
	'status.oneOf': z.string().optional(),
	'status.noneOf': z.string().optional(),
	'externalReferenceId.eq': z.string().optional(),
});
export const getAllProjectsOutputSchema = z.lazy(
	() => ExampleAPIResponseProjects,
);
export const createProjectInputSchema = z.object({
	includeFields: z
		.array(
			z.enum([
				'annualizedRecurringRevenue',
				'projectFee',
				'allocatedHours',
				'allocatedMinutes',
				'budgetedHours',
				'percentageBudgetedHoursConsumed',
				'percentageBudgetConsumed',
				'billableHours',
				'billableMinutes',
				'nonBillableHours',
				'nonBillableMinutes',
				'trackedHours',
				'trackedMinutes',
				'progressPercentage',
				'startDateActual',
				'dueDateActual',
				'currentPhase',
				'autoAllocation',
				'sources',
				'inferredProgress',
				'plannedDuration',
				'projectAgeInDays',
				'customersInvited',
				'customersJoined',
				'externalReferenceId',
				'metrics',
				'remainingMinutes',
				'remainingHours',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => ProjectPublicAPIRequestEntity).optional(),
});
export const createProjectOutputSchema = z.lazy(
	() => ProjectPublicAPIResponseEntity,
);
export const getPlaceholdersInputSchema = z.object({ projectId: z.number() });
export const getPlaceholdersOutputSchema = z.lazy(
	() => ExampleAPIResponsePlaceholders,
);
export const getPhaseInputSchema = z.object({
	phaseId: z.number().min(0),
	includeFields: z
		.array(z.enum(['startDateActual', 'dueDateActual', 'budgets']))
		.optional(),
	includeAllFields: z.boolean().optional(),
});
export const getPhaseOutputSchema = z.lazy(() => PhasePublicAPIResponseEntity);
export const updatePhaseInputSchema = z.object({
	phaseId: z.number().min(0),
	includeFields: z
		.array(z.enum(['startDateActual', 'dueDateActual', 'budgets']))
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => PhasePublicUpdateAPIRequestEntity).optional(),
});
export const updatePhaseOutputSchema = z.lazy(
	() => PhasePublicAPIResponseEntity,
);
export const deletePhaseInputSchema = z.object({ phaseId: z.number().min(0) });
export const deletePhaseOutputSchema = z.void();
export const getAllPhasesInputSchema = z.object({
	projectId: z.number().min(0),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z
		.array(z.enum(['startDateActual', 'dueDateActual', 'budgets']))
		.optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z
		.enum([
			'phaseName',
			'startDate',
			'dueDate',
			'startDateActual',
			'dueDateActual',
		])
		.optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'startDate.gt': z.string().optional(),
	'startDate.eq': z.string().optional(),
	'startDate.lt': z.string().optional(),
	'startDate.ge': z.string().optional(),
	'startDate.le': z.string().optional(),
	'dueDate.gt': z.string().optional(),
	'dueDate.eq': z.string().optional(),
	'dueDate.lt': z.string().optional(),
	'dueDate.ge': z.string().optional(),
	'dueDate.le': z.string().optional(),
	'startDateActual.gt': z.string().optional(),
	'startDateActual.eq': z.string().optional(),
	'startDateActual.lt': z.string().optional(),
	'startDateActual.ge': z.string().optional(),
	'startDateActual.le': z.string().optional(),
	'dueDateActual.gt': z.string().optional(),
	'dueDateActual.eq': z.string().optional(),
	'dueDateActual.lt': z.string().optional(),
	'dueDateActual.ge': z.string().optional(),
	'dueDateActual.le': z.string().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
	'phaseName.eq': z.string().optional(),
	'phaseName.cn': z.string().optional(),
	'phaseName.nc': z.string().optional(),
});
export const getAllPhasesOutputSchema = z.lazy(() => ExampleAPIResponsePhases);
export const createPhaseInputSchema = z.object({
	includeFields: z
		.array(z.enum(['startDateActual', 'dueDateActual', 'budgets']))
		.optional(),
	includeAllFields: z.boolean().optional(),
	body: z.lazy(() => PhasePublicAPIRequestEntity).optional(),
});
export const createPhaseOutputSchema = z.lazy(
	() => PhasePublicAPIResponseEntity,
);
export const getUserInputSchema = z.object({
	userId: z.number().min(0),
	includeFields: z
		.array(
			z.enum([
				'role',
				'company',
				'permission',
				'holidayCalendar',
				'capacityInMinutes',
				'profilePictureUrl',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
});
export const getUserOutputSchema = z.lazy(() => UsersPublicAPIResponse);
export const getAllUsersInputSchema = z.object({
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	includeFields: z
		.array(
			z.enum([
				'role',
				'company',
				'permission',
				'holidayCalendar',
				'capacityInMinutes',
				'profilePictureUrl',
			]),
		)
		.optional(),
	includeAllFields: z.boolean().optional(),
	sortBy: z
		.enum([
			'email',
			'firstName',
			'lastName',
			'type',
			'status',
			'capacityInMinutes',
		])
		.optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'firstName.eq': z.string().optional(),
	'firstName.cn': z.string().optional(),
	'firstName.nc': z.string().optional(),
	'lastName.eq': z.string().optional(),
	'lastName.cn': z.string().optional(),
	'lastName.nc': z.string().optional(),
	'email.eq': z.string().optional(),
	'email.cn': z.string().optional(),
	'email.nc': z.string().optional(),
	'status.eq': z
		.array(z.enum(['INACTIVE', 'INVITED', 'ACTIVE', 'PASSIVE']))
		.optional(),
	'status.oneOf': z
		.array(z.enum(['INACTIVE', 'INVITED', 'ACTIVE', 'PASSIVE']))
		.optional(),
	'status.noneOf': z
		.array(z.enum(['INACTIVE', 'INVITED', 'ACTIVE', 'PASSIVE']))
		.optional(),
	'type.eq': z
		.array(z.enum(['TEAM_MEMBER', 'PARTNER', 'CUSTOMER', 'EXTERNAL_PARTNER']))
		.optional(),
	'type.oneOf': z
		.array(z.enum(['TEAM_MEMBER', 'PARTNER', 'CUSTOMER', 'EXTERNAL_PARTNER']))
		.optional(),
	'roleId.eq': z.string().optional(),
	'roleId.oneOf': z.string().optional(),
	'roleId.noneOf': z.string().optional(),
	'permissionId.eq': z.string().optional(),
	'permissionId.oneOf': z.string().optional(),
	'permissionId.noneOf': z.string().optional(),
	'capacityInMinutes.eq': z.number().optional(),
	'capacityInMinutes.gt': z.number().optional(),
	'capacityInMinutes.ge': z.number().optional(),
	'capacityInMinutes.lt': z.number().optional(),
	'capacityInMinutes.le': z.number().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
});
export const getAllUsersOutputSchema = z.lazy(() => ExampleAPIResponseUsers);
export const getSpaceInputSchema = z.object({ spaceId: z.number().min(0) });
export const getSpaceOutputSchema = z.lazy(() => SpacePublicResponseEntity);
export const updateSpaceInputSchema = z.object({
	spaceId: z.number().min(0),
	body: z.lazy(() => SpacePublicUpdateAPIRequestEntity).optional(),
});
export const updateSpaceOutputSchema = z.lazy(() => SpacePublicResponseEntity);
export const deleteSpaceInputSchema = z.object({ spaceId: z.number().min(0) });
export const deleteSpaceOutputSchema = z.void();
export const getAllSpacesInputSchema = z.object({
	projectId: z.number().min(0),
	pageSize: z.number().min(0).optional(),
	pageToken: z.string().optional(),
	sortBy: z.enum(['spaceName']).optional(),
	sortOrder: z.enum(['ASC', 'DESC']).optional(),
	match: z.enum(['all', 'any']).optional(),
	'spaceName.eq': z.string().optional(),
	'spaceName.cn': z.string().optional(),
	'spaceName.nc': z.string().optional(),
	'createdAt.gt': z.number().optional(),
	'createdAt.eq': z.number().optional(),
	'createdAt.lt': z.number().optional(),
	'createdAt.ge': z.number().optional(),
	'createdAt.le': z.number().optional(),
	'updatedAt.gt': z.number().optional(),
	'updatedAt.eq': z.number().optional(),
	'updatedAt.lt': z.number().optional(),
	'updatedAt.ge': z.number().optional(),
	'updatedAt.le': z.number().optional(),
});
export const getAllSpacesOutputSchema = z.lazy(() => ExampleAPIResponseSpaces);
export const createSpaceInputSchema = z.object({
	body: z.lazy(() => SpacePublicRequestEntity).optional(),
});
export const createSpaceOutputSchema = z.lazy(() => SpacePublicResponseEntity);
export const RocketlaneEndpointInputSchemas = {
	getInvoicePayments: getInvoicePaymentsInputSchema,
	getInvoiceLineItems: getInvoiceLineItemsInputSchema,
	getInvoice: getInvoiceInputSchema,
	searchInvoices: searchInvoicesInputSchema,
	getCompany: getCompanyInputSchema,
	updateCompany: updateCompanyInputSchema,
	deleteCompany: deleteCompanyInputSchema,
	createCompanyNote: createCompanyNoteInputSchema,
	getAllCompanies: getAllCompaniesInputSchema,
	createCompany: createCompanyInputSchema,
	getAllResourceAllocations: getAllResourceAllocationsInputSchema,
	getAllTimeoffs: getAllTimeoffsInputSchema,
	createTimeoff: createTimeoffInputSchema,
	getTimeoff: getTimeoffInputSchema,
	deleteTimeoff: deleteTimeoffInputSchema,
	getField: getFieldInputSchema,
	updateField: updateFieldInputSchema,
	deleteField: deleteFieldInputSchema,
	updateFieldOption: updateFieldOptionInputSchema,
	addFieldOption: addFieldOptionInputSchema,
	getAllFields: getAllFieldsInputSchema,
	createField: createFieldInputSchema,
	getTimeEntry: getTimeEntryInputSchema,
	updateTimeEntry: updateTimeEntryInputSchema,
	deleteTimeEntry: deleteTimeEntryInputSchema,
	getAllTimeEntries: getAllTimeEntriesInputSchema,
	createTimeEntry: createTimeEntryInputSchema,
	searchTimeEntries: searchTimeEntriesInputSchema,
	getTimeEntryCategories: getTimeEntryCategoriesInputSchema,
	getSpaceDocument: getSpaceDocumentInputSchema,
	updateSpaceDocument: updateSpaceDocumentInputSchema,
	deleteSpaceDocument: deleteSpaceDocumentInputSchema,
	getAllSpaceDocuments: getAllSpaceDocumentsInputSchema,
	createSpaceDocument: createSpaceDocumentInputSchema,
	updateBudgetMilestoneRevenueRecognitionConfigs:
		updateBudgetMilestoneRevenueRecognitionConfigsInputSchema,
	updateBudgetManualRevenueRecognitionConfigs:
		updateBudgetManualRevenueRecognitionConfigsInputSchema,
	getBudget: getBudgetInputSchema,
	updateBudget: updateBudgetInputSchema,
	deleteBudget: deleteBudgetInputSchema,
	searchBudgets: searchBudgetsInputSchema,
	createBudget: createBudgetInputSchema,
	getTask: getTaskInputSchema,
	updateTask: updateTaskInputSchema,
	deleteTask: deleteTaskInputSchema,
	removeFollowersFromTask: removeFollowersFromTaskInputSchema,
	removeDependenciesFromTask: removeDependenciesFromTaskInputSchema,
	removeAssigneesFromTask: removeAssigneesFromTaskInputSchema,
	moveTaskToGivenPhase: moveTaskToGivenPhaseInputSchema,
	addFollowersToTask: addFollowersToTaskInputSchema,
	addDependenciesToTask: addDependenciesToTaskInputSchema,
	addAssigneeToTask: addAssigneeToTaskInputSchema,
	getAllTasks: getAllTasksInputSchema,
	createTask: createTaskInputSchema,
	getCustomRevenueRecognitionConfig:
		getCustomRevenueRecognitionConfigInputSchema,
	getAllCustomRevenueRecognitionConfigs:
		getAllCustomRevenueRecognitionConfigsInputSchema,
	getProject: getProjectInputSchema,
	updateProject: updateProjectInputSchema,
	deleteProject: deleteProjectInputSchema,
	unassignPlaceholders: unassignPlaceholdersInputSchema,
	removeMembers: removeMembersInputSchema,
	importTemplate: importTemplateInputSchema,
	assignPlaceholders: assignPlaceholdersInputSchema,
	archiveProject: archiveProjectInputSchema,
	addMembers: addMembersInputSchema,
	getAllProjects: getAllProjectsInputSchema,
	createProject: createProjectInputSchema,
	getPlaceholders: getPlaceholdersInputSchema,
	getPhase: getPhaseInputSchema,
	updatePhase: updatePhaseInputSchema,
	deletePhase: deletePhaseInputSchema,
	getAllPhases: getAllPhasesInputSchema,
	createPhase: createPhaseInputSchema,
	getUser: getUserInputSchema,
	getAllUsers: getAllUsersInputSchema,
	getSpace: getSpaceInputSchema,
	updateSpace: updateSpaceInputSchema,
	deleteSpace: deleteSpaceInputSchema,
	getAllSpaces: getAllSpacesInputSchema,
	createSpace: createSpaceInputSchema,
} as const;
export const RocketlaneEndpointOutputSchemas = {
	getInvoicePayments: getInvoicePaymentsOutputSchema,
	getInvoiceLineItems: getInvoiceLineItemsOutputSchema,
	getInvoice: getInvoiceOutputSchema,
	searchInvoices: searchInvoicesOutputSchema,
	getCompany: getCompanyOutputSchema,
	updateCompany: updateCompanyOutputSchema,
	deleteCompany: deleteCompanyOutputSchema,
	createCompanyNote: createCompanyNoteOutputSchema,
	getAllCompanies: getAllCompaniesOutputSchema,
	createCompany: createCompanyOutputSchema,
	getAllResourceAllocations: getAllResourceAllocationsOutputSchema,
	getAllTimeoffs: getAllTimeoffsOutputSchema,
	createTimeoff: createTimeoffOutputSchema,
	getTimeoff: getTimeoffOutputSchema,
	deleteTimeoff: deleteTimeoffOutputSchema,
	getField: getFieldOutputSchema,
	updateField: updateFieldOutputSchema,
	deleteField: deleteFieldOutputSchema,
	updateFieldOption: updateFieldOptionOutputSchema,
	addFieldOption: addFieldOptionOutputSchema,
	getAllFields: getAllFieldsOutputSchema,
	createField: createFieldOutputSchema,
	getTimeEntry: getTimeEntryOutputSchema,
	updateTimeEntry: updateTimeEntryOutputSchema,
	deleteTimeEntry: deleteTimeEntryOutputSchema,
	getAllTimeEntries: getAllTimeEntriesOutputSchema,
	createTimeEntry: createTimeEntryOutputSchema,
	searchTimeEntries: searchTimeEntriesOutputSchema,
	getTimeEntryCategories: getTimeEntryCategoriesOutputSchema,
	getSpaceDocument: getSpaceDocumentOutputSchema,
	updateSpaceDocument: updateSpaceDocumentOutputSchema,
	deleteSpaceDocument: deleteSpaceDocumentOutputSchema,
	getAllSpaceDocuments: getAllSpaceDocumentsOutputSchema,
	createSpaceDocument: createSpaceDocumentOutputSchema,
	updateBudgetMilestoneRevenueRecognitionConfigs:
		updateBudgetMilestoneRevenueRecognitionConfigsOutputSchema,
	updateBudgetManualRevenueRecognitionConfigs:
		updateBudgetManualRevenueRecognitionConfigsOutputSchema,
	getBudget: getBudgetOutputSchema,
	updateBudget: updateBudgetOutputSchema,
	deleteBudget: deleteBudgetOutputSchema,
	searchBudgets: searchBudgetsOutputSchema,
	createBudget: createBudgetOutputSchema,
	getTask: getTaskOutputSchema,
	updateTask: updateTaskOutputSchema,
	deleteTask: deleteTaskOutputSchema,
	removeFollowersFromTask: removeFollowersFromTaskOutputSchema,
	removeDependenciesFromTask: removeDependenciesFromTaskOutputSchema,
	removeAssigneesFromTask: removeAssigneesFromTaskOutputSchema,
	moveTaskToGivenPhase: moveTaskToGivenPhaseOutputSchema,
	addFollowersToTask: addFollowersToTaskOutputSchema,
	addDependenciesToTask: addDependenciesToTaskOutputSchema,
	addAssigneeToTask: addAssigneeToTaskOutputSchema,
	getAllTasks: getAllTasksOutputSchema,
	createTask: createTaskOutputSchema,
	getCustomRevenueRecognitionConfig:
		getCustomRevenueRecognitionConfigOutputSchema,
	getAllCustomRevenueRecognitionConfigs:
		getAllCustomRevenueRecognitionConfigsOutputSchema,
	getProject: getProjectOutputSchema,
	updateProject: updateProjectOutputSchema,
	deleteProject: deleteProjectOutputSchema,
	unassignPlaceholders: unassignPlaceholdersOutputSchema,
	removeMembers: removeMembersOutputSchema,
	importTemplate: importTemplateOutputSchema,
	assignPlaceholders: assignPlaceholdersOutputSchema,
	archiveProject: archiveProjectOutputSchema,
	addMembers: addMembersOutputSchema,
	getAllProjects: getAllProjectsOutputSchema,
	createProject: createProjectOutputSchema,
	getPlaceholders: getPlaceholdersOutputSchema,
	getPhase: getPhaseOutputSchema,
	updatePhase: updatePhaseOutputSchema,
	deletePhase: deletePhaseOutputSchema,
	getAllPhases: getAllPhasesOutputSchema,
	createPhase: createPhaseOutputSchema,
	getUser: getUserOutputSchema,
	getAllUsers: getAllUsersOutputSchema,
	getSpace: getSpaceOutputSchema,
	updateSpace: updateSpaceOutputSchema,
	deleteSpace: deleteSpaceOutputSchema,
	getAllSpaces: getAllSpacesOutputSchema,
	createSpace: createSpaceOutputSchema,
} as const;
export type RocketlaneEndpointInputs = {
	[K in keyof typeof RocketlaneEndpointInputSchemas]: z.infer<
		(typeof RocketlaneEndpointInputSchemas)[K]
	>;
};
export type RocketlaneEndpointOutputs = {
	[K in keyof typeof RocketlaneEndpointOutputSchemas]: z.infer<
		(typeof RocketlaneEndpointOutputSchemas)[K]
	>;
};

import { z } from 'zod';

const RealmIdSchema = z
	.string()
	.regex(/^\d+$/)
	.describe('QuickBooks company realm ID returned in Intuit’s OAuth redirect');

const AccountTypeSchema = z.enum([
	'Bank',
	'Accounts Receivable',
	'Other Current Asset',
	'Fixed Asset',
	'Other Asset',
	'Accounts Payable',
	'Credit Card',
	'Other Current Liability',
	'Long Term Liability',
	'Equity',
	'Income',
	'Cost of Goods Sold',
	'Expense',
	'Other Income',
	'Other Expense',
]);

const AccountClassificationSchema = z.enum([
	'Asset',
	'Equity',
	'Expense',
	'Liability',
	'Revenue',
]);

const MonthSchema = z.enum([
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]);

const ReferenceSchema = z
	.object({
		name: z.string().optional(),
		type: z.string().optional(),
		value: z.string(),
	})
	.strict();

const MetadataSchema = z
	.object({
		CreatedByRef: ReferenceSchema.optional(),
		CreateTime: z.string().optional(),
		LastModifiedByRef: ReferenceSchema.optional(),
		LastUpdatedTime: z.string().optional(),
		LastChangedInQB: z.string().optional(),
		Synchronized: z.boolean().optional(),
	})
	.strict();

const AccountSchema = z
	.object({
		Id: z.string().min(1),
		SyncToken: z.string(),
		MetaData: MetadataSchema.optional(),
		Name: z.string().min(1),
		SubAccount: z.boolean().optional(),
		ParentRef: ReferenceSchema.optional(),
		Description: z.string().optional(),
		FullyQualifiedName: z.string().optional(),
		AccountAlias: z.string().optional(),
		TxnLocationType: z.string().optional(),
		Active: z.boolean().optional(),
		Classification: AccountClassificationSchema.optional(),
		AccountType: AccountTypeSchema.optional(),
		AccountSubType: z.string().optional(),
		AccountPurposes: z.array(ReferenceSchema).optional(),
		AcctNum: z.string().optional(),
		AcctNumExtn: z.string().optional(),
		BankNum: z.string().optional(),
		OpeningBalance: z.number().optional(),
		OpeningBalanceDate: z.string().optional(),
		CurrentBalance: z.number().optional(),
		CurrentBalanceWithSubAccounts: z.number().optional(),
		CurrencyRef: ReferenceSchema.optional(),
		TaxAccount: z.boolean().optional(),
		TaxCodeRef: ReferenceSchema.optional(),
		OnlineBankingEnabled: z.boolean().optional(),
		FIName: z.string().optional(),
		JournalCodeRef: ReferenceSchema.optional(),
		// unknown because the v75 XSD declares AccountEx as IntuitAnyType.
		AccountEx: z.unknown().optional(),
		domain: z.literal('QBO').optional(),
		sparse: z.boolean().optional(),
	})
	.strict()
	.refine((account) => account.AccountType || account.AccountSubType, {
		message: 'Account response must include account type or subtype',
		path: ['AccountType'],
	});

const PhysicalAddressSchema = z
	.object({
		Id: z.string().optional(),
		Line1: z.string().optional(),
		Line2: z.string().optional(),
		Line3: z.string().optional(),
		Line4: z.string().optional(),
		Line5: z.string().optional(),
		City: z.string().optional(),
		Country: z.string().optional(),
		CountryCode: z.string().optional(),
		County: z.string().optional(),
		CountrySubDivisionCode: z.string().optional(),
		PostalCode: z.string().optional(),
		PostalCodeSuffix: z.string().optional(),
		Lat: z.string().optional(),
		Long: z.string().optional(),
		Tag: z.string().optional(),
		Note: z.string().optional(),
	})
	.strict();

const EmailAddressSchema = z
	.object({
		Id: z.string().optional(),
		Address: z.string().optional(),
		Default: z.boolean().optional(),
		Tag: z.string().optional(),
	})
	.strict();

const WebSiteAddressSchema = z
	.object({
		Id: z.string().optional(),
		URI: z.string().optional(),
		Default: z.boolean().optional(),
		Tag: z.string().optional(),
	})
	.strict();

const TelephoneNumberSchema = z
	.object({
		Id: z.string().optional(),
		DeviceType: z.string().optional(),
		CountryCode: z.string().optional(),
		AreaCode: z.string().optional(),
		ExchangeCode: z.string().optional(),
		Extension: z.string().optional(),
		FreeFormNumber: z.string().optional(),
		Default: z.boolean().optional(),
		Tag: z.string().optional(),
	})
	.strict();

const ContactInfoSchema = z
	.object({
		Type: z
			.enum([
				'TelephoneNumber',
				'EmailAddress',
				'WebSiteAddress',
				'GenericContactType',
			])
			.optional(),
	})
	.strict();

const NameValueSchema = z
	.object({
		Name: z.string().optional(),
		Value: z.string().optional(),
	})
	.strict();

const FifoCalculationStatusSchema = z.enum([
	'None',
	'InProgress',
	'Completed',
	'Error',
]);

const CompanyInfoSchema = z
	.object({
		Id: z.string().min(1),
		SyncToken: z.string().optional(),
		MetaData: MetadataSchema.optional(),
		CompanyName: z.string().min(1),
		LegalName: z.string().optional(),
		CompanyAddr: PhysicalAddressSchema.optional(),
		CustomerCommunicationAddr: PhysicalAddressSchema.optional(),
		LegalAddr: PhysicalAddressSchema.optional(),
		CompanyEmailAddr: EmailAddressSchema.optional(),
		CustomerCommunicationEmailAddr: EmailAddressSchema.optional(),
		CompanyURL: WebSiteAddressSchema.optional(),
		PrimaryPhone: TelephoneNumberSchema.optional(),
		OtherContactInfo: z.array(ContactInfoSchema).optional(),
		CompanyFileName: z.string().optional(),
		FlavorStratum: z.string().optional(),
		SampleFile: z.boolean().optional(),
		CompanyUserId: z.string().optional(),
		CompanyUserAdminEmail: z.string().optional(),
		CompanyStartDate: z.string().optional(),
		EmployerId: z.string().optional(),
		FiscalYearStartMonth: MonthSchema.optional(),
		TaxYearStartMonth: MonthSchema.optional(),
		QBVersion: z.string().optional(),
		Country: z.string().optional(),
		ShipAddr: PhysicalAddressSchema.optional(),
		OtherAddr: z.array(PhysicalAddressSchema).optional(),
		Mobile: TelephoneNumberSchema.optional(),
		Fax: TelephoneNumberSchema.optional(),
		Email: EmailAddressSchema.optional(),
		WebAddr: WebSiteAddressSchema.optional(),
		LastImportedTime: z.string().optional(),
		LastSyncTime: z.string().optional(),
		SupportedLanguages: z.string().optional(),
		DefaultTimeZone: z.string().optional(),
		MultiByteCharsSupported: z.boolean().optional(),
		NameValue: z.array(NameValueSchema).optional(),
		FifoCalculationStatus: FifoCalculationStatusSchema.optional(),
		// unknown because the v75 XSD declares CompanyInfoEx as IntuitAnyType.
		CompanyInfoEx: z.unknown().optional(),
		domain: z.literal('QBO').optional(),
		sparse: z.boolean().optional(),
	})
	.strict();

const AccountCreateInputSchema = z
	.object({
		realmId: RealmIdSchema,
		name: z
			.string()
			.min(1)
			.max(100)
			.refine((value) => !/[":]/.test(value), {
				message: 'Account name cannot contain a double quote or colon',
			}),
		accountType: AccountTypeSchema.optional(),
		accountSubType: z.string().min(1).optional(),
		acctNum: z
			.string()
			.refine((value) => !value.includes(':'), {
				message: 'Account number cannot contain a colon',
			})
			.optional(),
		taxCodeRef: ReferenceSchema.optional(),
	})
	.strict()
	.refine((input) => input.accountType || input.accountSubType, {
		message: 'Provide accountType or accountSubType',
		path: ['accountType'],
	});

const AccountGetInputSchema = z
	.object({
		realmId: RealmIdSchema,
		accountId: z.string().min(1),
	})
	.strict();

const AccountListInputSchema = z
	.object({
		realmId: RealmIdSchema,
		startPosition: z.number().int().min(1).optional(),
		maxResults: z.number().int().min(1).max(1000).optional(),
	})
	.strict();

const CompanyGetInputSchema = z
	.object({
		realmId: RealmIdSchema,
	})
	.strict();

const CompanyListInputSchema = z
	.object({
		realmId: RealmIdSchema,
	})
	.strict();

const AccountCreateOutputSchema = z
	.object({ Account: AccountSchema, time: z.string() })
	.strict();

const AccountGetOutputSchema = z
	.object({ Account: AccountSchema, time: z.string() })
	.strict();

const AccountListOutputSchema = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				Account: z.array(AccountSchema).optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();

const CompanyGetOutputSchema = z
	.object({ CompanyInfo: CompanyInfoSchema, time: z.string() })
	.strict();

const CompanyListOutputSchema = z
	.object({
		QueryResponse: z
			.object({
				startPosition: z.number().optional(),
				maxResults: z.number().optional(),
				totalCount: z.number().optional(),
				CompanyInfo: z.array(CompanyInfoSchema).optional(),
			})
			.strict(),
		time: z.string(),
	})
	.strict();

export const QuickBooksEndpointInputSchemas = {
	accountsCreate: AccountCreateInputSchema,
	accountsGet: AccountGetInputSchema,
	accountsList: AccountListInputSchema,
	companyGet: CompanyGetInputSchema,
	companyList: CompanyListInputSchema,
} as const;

export const QuickBooksEndpointOutputSchemas = {
	accountsCreate: AccountCreateOutputSchema,
	accountsGet: AccountGetOutputSchema,
	accountsList: AccountListOutputSchema,
	companyGet: CompanyGetOutputSchema,
	companyList: CompanyListOutputSchema,
} as const;

export type QuickBooksEndpointInputs = {
	accountsCreate: z.infer<typeof AccountCreateInputSchema>;
	accountsGet: z.infer<typeof AccountGetInputSchema>;
	accountsList: z.infer<typeof AccountListInputSchema>;
	companyGet: z.infer<typeof CompanyGetInputSchema>;
	companyList: z.infer<typeof CompanyListInputSchema>;
};

export type QuickBooksEndpointOutputs = {
	accountsCreate: z.infer<typeof AccountCreateOutputSchema>;
	accountsGet: z.infer<typeof AccountGetOutputSchema>;
	accountsList: z.infer<typeof AccountListOutputSchema>;
	companyGet: z.infer<typeof CompanyGetOutputSchema>;
	companyList: z.infer<typeof CompanyListOutputSchema>;
};

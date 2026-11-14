import { z } from 'zod';

// Generated from the documented Sevdesk OpenAPI schemas. Requests reject undocumented fields; response objects remain extensible where the spec does not close them.
const requestComponent_Model_CheckAccountResponse = z
	.object({
		name: z.string().optional(),
		iban: z.string().nullable().optional(),
		type: z
			.union([z.literal('online'), z.literal('offline'), z.literal('register')])
			.optional(),
		importType: z
			.union([z.literal('CSV'), z.literal('MT940'), z.literal(null)])
			.optional(),
		currency: z.string().optional(),
		defaultAccount: z.string().optional(),
		baseAccount: z.string().optional(),
		priority: z.string().optional(),
		status: z.union([z.literal('0'), z.literal('100')]).optional(),
		balance: z.string().nullable().optional(),
		bankServer: z.string().nullable().optional(),
		autoMapTransactions: z.string().nullable().optional(),
		autoSyncTransactions: z.string().optional(),
		lastSync: z.string().optional(),
		accountingNumber: z.string().optional(),
		bic: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_createFileImportAccount = z
	.object({
		name: z.string().optional(),
		importType: z.union([z.literal('CSV'), z.literal('MT940')]).optional(),
		accountingNumber: z.number().int().nullable().optional(),
		iban: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_createFileImportAccountResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		name: z.string().optional(),
		iban: z.string().nullable().optional(),
		type: z.union([z.literal('online'), z.literal('offline')]).optional(),
		importType: z.union([z.literal('CSV'), z.literal('MT940')]).optional(),
		currency: z.string().optional(),
		defaultAccount: z.union([z.literal('0'), z.literal('1')]).optional(),
		status: z.union([z.literal('0'), z.literal('100')]).optional(),
		autoMapTransactions: z.union([z.literal('0'), z.literal('1')]).optional(),
		accountingNumber: z.string().optional(),
	})
	.strict();

const requestComponent_createClearingAccount = z
	.object({
		name: z.string().optional(),
		accountingNumber: z.number().int().nullable().optional(),
	})
	.strict();

const requestComponent_createClearingAccountResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		name: z.string().optional(),
		type: z.union([z.literal('online'), z.literal('offline')]).optional(),
		currency: z.string().optional(),
		defaultAccount: z.union([z.literal('0'), z.literal('1')]).optional(),
		status: z.union([z.literal('0'), z.literal('100')]).optional(),
		accountingNumber: z.string().optional(),
	})
	.strict();

const requestComponent_Model_CheckAccountUpdate = z
	.object({
		name: z.string().optional(),
		defaultAccount: z.union([z.literal(0), z.literal(1)]).optional(),
		autoMapTransactions: z.number().int().nullable().optional(),
		accountingNumber: z.string().optional(),
		iban: z.string().optional(),
		bic: z.string().optional(),
	})
	.strict();

const requestComponent_Model_CheckAccountTransactionResponse = z
	.object({
		valueDate: z.string().optional(),
		entryDate: z.string().nullable().optional(),
		paymtPurpose: z.string().nullable().optional(),
		amount: z.string().optional(),
		payeePayerName: z.string().nullable().optional(),
		payeePayerAcctNo: z.string().nullable().optional(),
		payeePayerBankCode: z.string().nullable().optional(),
		gvCode: z.string().nullable().optional(),
		entryText: z.string().nullable().optional(),
		primaNotaNo: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_CheckAccountTransaction = z
	.object({
		valueDate: z.string(),
		entryDate: z.string().nullable().optional(),
		paymtPurpose: z.string().nullable().optional(),
		amount: z.number(),
		payeePayerName: z.string().nullable(),
		payeePayerAcctNo: z.string().nullable().optional(),
		payeePayerBankCode: z.string().nullable().optional(),
		checkAccount: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		status: z.union([
			z.literal(100),
			z.literal(200),
			z.literal(300),
			z.literal(400),
		]),
		sourceTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		targetTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
	})
	.strict();

const requestComponent_Model_CheckAccountTransactionUpdate = z
	.object({
		valueDate: z.string().optional(),
		entryDate: z.string().nullable().optional(),
		paymtPurpose: z.string().optional(),
		amount: z.number().nullable().optional(),
		payeePayerName: z.string().nullable().optional(),
		checkAccount: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		status: z
			.union([z.literal(100), z.literal(200), z.literal(300), z.literal(400)])
			.optional(),
		sourceTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		targetTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
	})
	.strict();

const requestComponent_validationError = z
	.object({
		error: z
			.object({
				message: z.string().optional(),
				exceptionUUID: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_PrivateTransactionRuleResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string().optional(),
				objectName: z.string().optional(),
			})
			.strict()
			.optional(),
		paymentPurpose: z.string().nullable().optional(),
		counterpartName: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_CreatePrivateTransactionRule = z
	.object({
		objectName: z.string(),
		paymentPurpose: z.string().nullable().optional(),
		counterpartName: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_ContactResponse = z.object({}).strict();

const requestComponent_Model_Contact = z
	.object({
		name: z.string().nullable().optional(),
		status: z.number().int().nullable().optional(),
		customerNumber: z.string().nullable().optional(),
		parent: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		surename: z.string().nullable().optional(),
		familyname: z.string().nullable().optional(),
		titel: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		description: z.string().nullable().optional(),
		academicTitle: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		name2: z.string().nullable().optional(),
		birthday: z.string().nullable().optional(),
		vatNumber: z.string().nullable().optional(),
		bankAccount: z.string().nullable().optional(),
		bankNumber: z.string().nullable().optional(),
		defaultCashbackTime: z.number().int().nullable().optional(),
		defaultCashbackPercent: z.number().nullable().optional(),
		defaultTimeToPay: z.number().int().nullable().optional(),
		taxNumber: z.string().nullable().optional(),
		taxOffice: z.string().nullable().optional(),
		exemptVat: z.boolean().nullable().optional(),
		defaultDiscountAmount: z.number().nullable().optional(),
		defaultDiscountPercentage: z.boolean().nullable().optional(),
		buyerReference: z.string().nullable().optional(),
		governmentAgency: z.boolean().nullable().optional(),
	})
	.strict();

const requestComponent_Model_ContactUpdate = z
	.object({
		name: z.string().nullable().optional(),
		status: z.number().int().nullable().optional(),
		customerNumber: z.string().nullable().optional(),
		parent: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		surename: z.string().nullable().optional(),
		familyname: z.string().nullable().optional(),
		titel: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		description: z.string().nullable().optional(),
		academicTitle: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		name2: z.string().nullable().optional(),
		birthday: z.string().nullable().optional(),
		vatNumber: z.string().nullable().optional(),
		bankAccount: z.string().nullable().optional(),
		bankNumber: z.string().nullable().optional(),
		defaultCashbackTime: z.number().int().nullable().optional(),
		defaultCashbackPercent: z.number().nullable().optional(),
		defaultTimeToPay: z.number().int().nullable().optional(),
		taxNumber: z.string().nullable().optional(),
		taxOffice: z.string().nullable().optional(),
		exemptVat: z.boolean().nullable().optional(),
		defaultDiscountAmount: z.number().nullable().optional(),
		defaultDiscountPercentage: z.boolean().nullable().optional(),
		buyerReference: z.string().nullable().optional(),
		governmentAgency: z.boolean().nullable().optional(),
	})
	.strict();

const requestComponent_Model_ContactAddressResponse = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		street: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		name: z.string().nullable().optional(),
		name2: z.string().optional(),
		name3: z.string().nullable().optional(),
		name4: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_ContactAddress = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		street: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable(),
		name: z.string().nullable().optional(),
		name2: z.string().optional(),
		name3: z.string().nullable().optional(),
		name4: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_ContactAddressUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		street: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		name: z.string().nullable().optional(),
		name2: z.string().optional(),
		name3: z.string().nullable().optional(),
		name4: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_CommunicationWayResponse = z.object({}).strict();

const requestComponent_Model_CommunicationWay = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		type: z.union([
			z.literal('EMAIL'),
			z.literal('PHONE'),
			z.literal('WEB'),
			z.literal('MOBILE'),
		]),
		value: z.string(),
		key: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		main: z.boolean().nullable().optional(),
	})
	.strict();

const requestComponent_Model_CommunicationWayUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		type: z
			.union([
				z.literal('EMAIL'),
				z.literal('PHONE'),
				z.literal('WEB'),
				z.literal('MOBILE'),
			])
			.optional(),
		value: z.string().optional(),
		key: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		main: z.boolean().nullable().optional(),
	})
	.strict();

const requestComponent_Model_AccountingContactResponse = z.object({}).strict();

const requestComponent_Model_AccountingContact = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		debitorNumber: z.number().int().nullable().optional(),
		creditorNumber: z.number().int().nullable().optional(),
	})
	.strict();

const requestComponent_Model_AccountingContactUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		debitorNumber: z.number().int().nullable().optional(),
		creditorNumber: z.number().int().nullable().optional(),
	})
	.strict();

const requestComponent_Model_Textparser_fetchDictionaryEntriesByType_response =
	z
		.object({
			key: z.string().optional(),
			value: z
				.array(
					z
						.object({
							key: z.string().optional(),
							value: z.string().optional(),
						})
						.strict(),
				)
				.optional(),
		})
		.strict();

const requestComponent_Model_ContactCustomFieldSettingResponse = z
	.object({})
	.strict();

const requestComponent_Model_ContactCustomFieldResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		contactCustomFieldSetting: z
			.intersection(
				requestComponent_Model_ContactCustomFieldSettingResponse,
				z.json(),
			)
			.optional(),
		value: z.string().optional(),
	})
	.strict();

const requestComponent_Model_ContactCustomField = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		contactCustomFieldSetting: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		value: z.string(),
		objectName: z.string(),
	})
	.strict();

const requestComponent_Model_ContactCustomFieldUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		contactCustomFieldSetting: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		value: z.string().optional(),
		objectName: z.string().optional(),
	})
	.strict();

const requestComponent_Model_ContactCustomFieldSetting = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		objectName: z.string().optional(),
	})
	.strict();

const requestComponent_Model_ContactCustomFieldSettingUpdate = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		objectName: z.string().optional(),
	})
	.strict();

const requestComponent_Model_creditNoteResponse = z
	.object({
		creditNoteNumber: z.string().nullable().optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		creditNoteDate: z.string().optional(),
		status: z
			.union([
				z.literal('100'),
				z.literal('200'),
				z.literal('750'),
				z.literal('1000'),
			])
			.optional(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		deliveryDate: z.string().optional(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxRate: z.string().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict()
			.optional(),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxText: z.string().nullable().optional(),
		taxType: z.string().nullable().optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.strict();

const requestComponent_Model_creditNote = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string(),
		mapAll: z.boolean(),
		creditNoteNumber: z.string(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		creditNoteDate: z.string(),
		status: z.union([
			z.literal('100'),
			z.literal('200'),
			z.literal('300'),
			z.literal('500'),
			z.literal('750'),
			z.literal('1000'),
		]),
		header: z.string(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict(),
		taxRate: z.number(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxText: z.string(),
		taxType: z.string(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		bookingCategory: z.union([
			z.literal('PROVISION'),
			z.literal('ROYALTY_ASSIGNED'),
			z.literal('ROYALTY_UNASSIGNED'),
			z.literal('UNDERACHIEVEMENT'),
			z.literal('ACCOUNTING_TYPE'),
		]),
		currency: z.string(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.strict();

const requestComponent_Model_creditNotePos = z
	.object({
		objectName: z.string(),
		mapAll: z.boolean(),
		creditNote: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		quantity: z.number(),
		price: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.number(),
	})
	.strict();

const requestComponent_saveCreditNote = z
	.object({
		creditNote: requestComponent_Model_creditNote,
		creditNotePosSave: z.array(requestComponent_Model_creditNotePos).optional(),
		creditNotePosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		discountSave: z
			.object({
				discount: z.boolean(),
				text: z.string(),
				percentage: z.boolean(),
				value: z.number(),
				objectName: z.string(),
				mapAll: z.boolean(),
			})
			.strict()
			.optional(),
		discountDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_creditNotePosResponse = z
	.object({
		creditNote: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict(),
		part: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		quantity: z.string(),
		price: z.string().nullable().optional(),
		priceTax: z.string().nullable().optional(),
		priceGross: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict(),
		positionNumber: z.string().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.string().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.string(),
	})
	.strict();

const requestComponent_saveCreditNoteResponse = z
	.object({
		creditNote: requestComponent_Model_creditNoteResponse.optional(),
		creditNotePos: z
			.array(requestComponent_Model_creditNotePosResponse)
			.optional(),
	})
	.strict();

const requestComponent_Model_discountsResponse = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z.string().optional(),
		discount: z.string().optional(),
		text: z.string().optional(),
		percentage: z.string().optional(),
		value: z.string().optional(),
		isNet: z.string().optional(),
	})
	.strict();

const requestComponent_Model_creditNoteUpdate = z
	.object({
		creditNoteNumber: z.string().nullable().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		creditNoteDate: z.string().optional(),
		status: z
			.union([
				z.literal('100'),
				z.literal('200'),
				z.literal('750'),
				z.literal('1000'),
			])
			.optional(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		deliveryDate: z.string().optional(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxRate: z.number().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict()
			.optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxText: z.string().nullable().optional(),
		taxType: z.string().nullable().optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.strict();

const requestComponent_Model_CreditNote_sendByWithRender = z
	.object({
		pdf: z.string().optional(),
		docId: z.string().optional(),
		parameters: z
			.array(
				z
					.object({
						key: z.string().optional(),
						name: z.string().optional(),
						values: z
							.array(
								z
									.object({
										name: z.string().optional(),
										translationCade: z.string().optional(),
										value: z.string().optional(),
									})
									.strict(),
							)
							.optional(),
						visible: z.boolean().optional(),
						value: z.string().optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();

const requestComponent_Model_creditNote_mailResponse = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		additionalInformation: z.string().optional(),
		object: requestComponent_Model_creditNoteResponse.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		subject: z.string().optional(),
		text: z.string().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Export_Progress_Data = z
	.object({
		current: z.number().int().optional(),
		total: z.number().int().optional(),
	})
	.strict();

const requestComponent_Export_Job_Download_Info = z
	.object({
		filename: z.string().optional(),
		link: z.string().optional(),
		linkExpireDate: z.string().optional(),
	})
	.strict();

const requestComponent_Model_Part = z
	.object({
		name: z.string(),
		partNumber: z.string(),
		text: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		stock: z.number(),
		stockEnabled: z.boolean().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		price: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		pricePurchase: z.number().nullable().optional(),
		taxRate: z.number(),
		status: z.union([z.literal(50), z.literal(100)]).optional(),
		internalComment: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_PartUpdate = z
	.object({
		name: z.string().optional(),
		partNumber: z.string().optional(),
		text: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		stock: z.number().optional(),
		stockEnabled: z.boolean().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		price: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		pricePurchase: z.number().nullable().optional(),
		taxRate: z.number().optional(),
		status: z.union([z.literal(50), z.literal(100)]).optional(),
		internalComment: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_InvoiceResponse = z
	.object({
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_Invoice = z
	.object({
		id: z.number().int().nullable().optional(),
		objectName: z.string().optional(),
		invoiceNumber: z.string().nullable().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		invoiceDate: z.string(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		timeToPay: z.number().int().nullable().optional(),
		discount: z.number().int(),
		address: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		payDate: z.string().nullable().optional(),
		deliveryDate: z.string().nullable().optional(),
		deliveryDateUntil: z.number().int().nullable().optional(),
		status: z.union([
			z.literal('50'),
			z.literal('100'),
			z.literal('200'),
			z.literal('750'),
			z.literal('1000'),
		]),
		smallSettlement: z.boolean().nullable().optional(),
		taxRate: z.number(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict(),
		taxText: z.string(),
		taxType: z.union([
			z.literal('default'),
			z.literal('eu'),
			z.literal('noteu'),
			z.literal('custom'),
		]),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		paymentMethod: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		sendDate: z.string().nullable().optional(),
		invoiceType: z.union([
			z.literal('RE'),
			z.literal('WKR'),
			z.literal('SR'),
			z.literal('MA'),
			z.literal('TR'),
			z.literal('AR'),
			z.literal('ER'),
		]),
		currency: z.string(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
		origin: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		customerInternalNote: z.string().nullable().optional(),
		propertyIsEInvoice: z.boolean().nullable().optional(),
		mapAll: z.boolean(),
	})
	.strict();

const requestComponent_Model_InvoicePos = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string(),
		mapAll: z.boolean(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		quantity: z.number(),
		price: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		taxRate: z.number(),
		priceGross: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
	})
	.strict();

const requestComponent_saveInvoice = z
	.object({
		invoice: requestComponent_Model_Invoice,
		invoicePosSave: z.array(requestComponent_Model_InvoicePos).optional(),
		invoicePosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		filename: z.string().optional(),
		discountSave: z
			.array(
				z
					.object({
						discount: z.boolean().optional(),
						text: z.string().optional(),
						percentage: z.boolean().optional(),
						value: z.number().optional(),
						objectName: z.string().optional(),
						mapAll: z.boolean().optional(),
					})
					.strict(),
			)
			.optional(),
		discountDelete: z
			.object({
				id: z.number().int().optional(),
				objectName: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_InvoicePosResponse = z.object({}).strict();

const requestComponent_saveInvoiceResponse = z
	.object({
		invoice: requestComponent_Model_InvoiceResponse.optional(),
		invoicePos: z.array(requestComponent_Model_InvoicePosResponse).optional(),
		filename: z.string().optional(),
	})
	.strict();

const requestComponent_Model_CreateInvoiceFromOrder = z
	.object({
		order: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		type: z
			.union([z.literal('percentage'), z.literal('net'), z.literal('gross')])
			.optional(),
		amount: z.number().nullable().optional(),
		partialType: z
			.union([z.literal('RE'), z.literal('TR'), z.literal('AR')])
			.optional(),
	})
	.strict();

const requestComponent_Model_Email = z
	.object({
		object: requestComponent_Model_InvoiceResponse.optional(),
		from: z.string(),
		to: z.string(),
		subject: z.string(),
		text: z.string().nullable().optional(),
		cc: z.string().nullable().optional(),
		bcc: z.string().nullable().optional(),
		arrived: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_ChangeLayout = z
	.object({
		key: z.union([
			z.literal('language'),
			z.literal('template'),
			z.literal('letterpaper'),
			z.literal('payPal'),
		]),
		value: z.string(),
	})
	.strict();

const requestComponent_Model_ChangeLayoutResponse = z
	.object({
		result: z.string().optional(),
		metadaten: z
			.object({
				pdf: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_OrderResponse = z
	.object({
		orderNumber: z.string().optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		orderDate: z.string().optional(),
		status: z
			.union([
				z.literal('100'),
				z.literal('200'),
				z.literal('300'),
				z.literal('500'),
				z.literal('750'),
				z.literal('1000'),
			])
			.optional(),
		header: z.string().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		deliveryTerms: z.string().nullable().optional(),
		paymentTerms: z.string().nullable().optional(),
		origin: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		version: z.string().optional(),
		smallSettlement: z.boolean().optional(),
		contactPerson: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		taxRate: z.string().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict()
			.optional(),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxText: z.string().optional(),
		taxType: z.string().optional(),
		orderType: z
			.union([z.literal('AN'), z.literal('AB'), z.literal('LI')])
			.optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.strict();

const requestComponent_Model_Order = z
	.object({
		objectName: z.string().optional(),
		mapAll: z.boolean(),
		orderNumber: z.string(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		orderDate: z.string(),
		status: z.union([
			z.literal(100),
			z.literal(200),
			z.literal(300),
			z.literal(500),
			z.literal(750),
			z.literal(1000),
		]),
		header: z.string(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		deliveryTerms: z.string().nullable().optional(),
		paymentTerms: z.string().nullable().optional(),
		version: z.number().int(),
		smallSettlement: z.boolean().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		taxRate: z.number(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxText: z.string(),
		taxType: z.string(),
		orderType: z
			.union([z.literal('AN'), z.literal('AB'), z.literal('LI')])
			.optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
		origin: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
	})
	.strict();

const requestComponent_Model_OrderPos = z
	.object({
		order: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		quantity: z.number(),
		price: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.number(),
	})
	.strict();

const requestComponent_saveOrder = z
	.object({
		order: requestComponent_Model_Order,
		orderPosSave: z.array(requestComponent_Model_OrderPos).optional(),
		orderPosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_OrderPosResponse = z
	.object({
		order: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		part: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		quantity: z.string().optional(),
		price: z.string().nullable().optional(),
		priceTax: z.string().nullable().optional(),
		priceGross: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		positionNumber: z.string().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.string().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.string().optional(),
	})
	.strict();

const requestComponent_saveOrderResponse = z
	.object({
		order: requestComponent_Model_OrderResponse.optional(),
		orderPos: z.array(requestComponent_Model_OrderPosResponse).optional(),
	})
	.strict();

const requestComponent_Model_OrderUpdate = z
	.object({
		orderNumber: z.string().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		orderDate: z.string().nullable().optional(),
		status: z
			.union([
				z.literal(100),
				z.literal(200),
				z.literal(300),
				z.literal(500),
				z.literal(750),
				z.literal(1000),
			])
			.optional(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		deliveryTerms: z.string().nullable().optional(),
		paymentTerms: z.string().nullable().optional(),
		origin: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		version: z.number().int().nullable().optional(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		taxRate: z.number().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict()
			.optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		taxText: z.string().nullable().optional(),
		taxType: z.string().nullable().optional(),
		orderType: z
			.union([z.literal('AN'), z.literal('AB'), z.literal('LI')])
			.optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().nullable().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.strict();

const requestComponent_Model_Discount = z
	.object({
		percentage: z.string().optional(),
		value: z.string().optional(),
		isNet: z.string().optional(),
	})
	.strict();

const requestComponent_Model_EmailOrder = z
	.object({
		object: requestComponent_Model_OrderResponse.optional(),
		from: z.string(),
		to: z.string(),
		subject: z.string(),
		text: z.string().nullable().optional(),
		cc: z.string().nullable().optional(),
		bcc: z.string().nullable().optional(),
		arrived: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_CreatePackingListFromOrder = z
	.object({
		id: z.number().int(),
		objectName: z.string(),
	})
	.strict();

const requestComponent_Model_OrderPosUpdate = z
	.object({
		order: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		quantity: z.number().nullable().optional(),
		price: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.number().nullable().optional(),
	})
	.strict();

const requestComponent_Model_Voucher = z
	.object({
		objectName: z.string(),
		mapAll: z.boolean(),
		voucherDate: z.string().nullable().optional(),
		supplier: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		supplierName: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		payDate: z.string().nullable().optional(),
		status: z.union([z.literal(50), z.literal(100), z.literal(1000)]),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict(),
		taxType: z.string(),
		creditDebit: z.union([z.literal('C'), z.literal('D')]),
		voucherType: z.union([z.literal('VOU'), z.literal('RV')]),
		currency: z.string().nullable().optional(),
		propertyForeignCurrencyDeadline: z.string().nullable().optional(),
		propertyExchangeRate: z.number().nullable().optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		paymentDeadline: z.string().nullable().optional(),
		deliveryDate: z.string().optional(),
		deliveryDateUntil: z.string().nullable().optional(),
		document: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		costCentre: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_VoucherPos = z
	.object({
		objectName: z.string(),
		mapAll: z.boolean(),
		accountDatev: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		accountingType: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		taxRate: z.number(),
		net: z.boolean(),
		isAsset: z.boolean().optional(),
		sumNet: z.number(),
		sumGross: z.number(),
		comment: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_saveVoucher = z
	.object({
		voucher: requestComponent_Model_Voucher,
		voucherPosSave: z.array(requestComponent_Model_VoucherPos).optional(),
		voucherPosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		filename: z.string().optional(),
	})
	.strict();

const requestComponent_Model_VoucherResponse = z
	.object({
		mapAll: z.boolean().optional(),
		voucherDate: z.string().nullable().optional(),
		supplier: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		supplierName: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		document: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		payDate: z.string().nullable().optional(),
		status: z
			.union([z.literal('50'), z.literal('100'), z.literal('1000')])
			.optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict()
			.optional(),
		taxType: z.string().nullable().optional(),
		creditDebit: z.union([z.literal('C'), z.literal('D')]).optional(),
		costCentre: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		voucherType: z.union([z.literal('VOU'), z.literal('RV')]).optional(),
		currency: z.string().nullable().optional(),
		propertyForeignCurrencyDeadline: z.string().nullable().optional(),
		propertyExchangeRate: z.string().nullable().optional(),
		recurringInterval: z
			.union([
				z.literal('P0Y0M1W'),
				z.literal('P0Y0M2W'),
				z.literal('P0Y1M0W'),
				z.literal('P0Y3M0W'),
				z.literal('P0Y6M0W'),
				z.literal('P1Y0M0W'),
				z.literal('P2Y0M0W'),
				z.literal('P3Y0M0W'),
				z.literal('P4Y0M0W'),
				z.literal('P5Y0M0W'),
			])
			.optional(),
		recurringStartDate: z.string().nullable().optional(),
		recurringNextVoucher: z.string().nullable().optional(),
		recurringLastVoucher: z.string().nullable().optional(),
		recurringEndDate: z.string().nullable().optional(),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		paymentDeadline: z.string().nullable().optional(),
		deliveryDate: z.string().optional(),
		deliveryDateUntil: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_Model_VoucherPosResponse = z
	.object({
		accountDatev: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict(),
		accountingType: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict(),
		taxRate: z.string(),
		net: z.boolean(),
		isAsset: z.boolean().optional(),
		sumNet: z.string(),
		sumGross: z.string(),
		comment: z.string().nullable().optional(),
	})
	.strict();

const requestComponent_saveVoucherResponse = z
	.object({
		voucher: requestComponent_Model_VoucherResponse.optional(),
		voucherPos: z.array(requestComponent_Model_VoucherPosResponse).optional(),
		filename: z.string().optional(),
	})
	.strict();

const requestComponent_Model_VoucherUpdate = z
	.object({
		voucherDate: z.string().nullable().optional(),
		supplier: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		supplierName: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		payDate: z.string().nullable().optional(),
		status: z
			.union([z.literal(50), z.literal(100), z.literal(1000)])
			.optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.strict()
			.optional(),
		taxType: z.string().optional(),
		creditDebit: z.union([z.literal('C'), z.literal('D')]).optional(),
		voucherType: z.union([z.literal('VOU'), z.literal('RV')]).optional(),
		currency: z.string().nullable().optional(),
		propertyForeignCurrencyDeadline: z.string().nullable().optional(),
		propertyExchangeRate: z.number().nullable().optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		paymentDeadline: z.string().nullable().optional(),
		deliveryDate: z.string().optional(),
		deliveryDateUntil: z.string().nullable().optional(),
		document: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.nullable()
			.optional(),
		costCentre: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_ReceiptGuideDto = z
	.object({
		accountDatevId: z.number().int().optional(),
		accountNumber: z.string().optional(),
		accountName: z.string().optional(),
		description: z.string().optional(),
		allowedTaxRules: z
			.array(
				z
					.object({
						name: z.string().optional(),
						description: z.string().optional(),
						id: z.number().int().optional(),
						taxRates: z.array(z.string()).optional(),
					})
					.strict(),
			)
			.optional(),
		allowedReceiptTypes: z.array(z.string()).optional(),
	})
	.strict();

const requestComponent_Model_TagResponse = z
	.object({
		additionalInformation: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const requestComponent_Model_TagCreateResponse = z
	.object({
		additionalInformation: z.string().optional(),
		tag: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
		object: z
			.object({
				id: z.number().int(),
				objectName: z.union([
					z.literal('Invoice'),
					z.literal('Voucher'),
					z.literal('Order'),
					z.literal('CreditNote'),
				]),
			})
			.strict()
			.optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const responseComponent_Model_CheckAccountResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		name: z.string().optional(),
		iban: z.string().nullable().optional(),
		type: z
			.union([z.literal('online'), z.literal('offline'), z.literal('register')])
			.optional(),
		importType: z
			.union([z.literal('CSV'), z.literal('MT940'), z.literal(null)])
			.optional(),
		currency: z.string().optional(),
		defaultAccount: z.string().optional(),
		baseAccount: z.string().optional(),
		priority: z.string().optional(),
		status: z.union([z.literal('0'), z.literal('100')]).optional(),
		balance: z.string().nullable().optional(),
		bankServer: z.string().nullable().optional(),
		autoMapTransactions: z.string().nullable().optional(),
		autoSyncTransactions: z.string().optional(),
		lastSync: z.string().optional(),
		accountingNumber: z.string().optional(),
		bic: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_createFileImportAccount = z
	.object({
		name: z.string().optional(),
		importType: z.union([z.literal('CSV'), z.literal('MT940')]).optional(),
		accountingNumber: z.number().int().nullable().optional(),
		iban: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_createFileImportAccountResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		name: z.string().optional(),
		iban: z.string().nullable().optional(),
		type: z.union([z.literal('online'), z.literal('offline')]).optional(),
		importType: z.union([z.literal('CSV'), z.literal('MT940')]).optional(),
		currency: z.string().optional(),
		defaultAccount: z.union([z.literal('0'), z.literal('1')]).optional(),
		status: z.union([z.literal('0'), z.literal('100')]).optional(),
		autoMapTransactions: z.union([z.literal('0'), z.literal('1')]).optional(),
		accountingNumber: z.string().optional(),
	})
	.passthrough();

const responseComponent_createClearingAccount = z
	.object({
		name: z.string().optional(),
		accountingNumber: z.number().int().nullable().optional(),
	})
	.passthrough();

const responseComponent_createClearingAccountResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		name: z.string().optional(),
		type: z.union([z.literal('online'), z.literal('offline')]).optional(),
		currency: z.string().optional(),
		defaultAccount: z.union([z.literal('0'), z.literal('1')]).optional(),
		status: z.union([z.literal('0'), z.literal('100')]).optional(),
		accountingNumber: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_CheckAccountUpdate = z
	.object({
		name: z.string().optional(),
		defaultAccount: z.union([z.literal(0), z.literal(1)]).optional(),
		autoMapTransactions: z.number().int().nullable().optional(),
		accountingNumber: z.string().optional(),
		iban: z.string().optional(),
		bic: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_CheckAccountTransactionResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		valueDate: z.string().optional(),
		entryDate: z.string().nullable().optional(),
		paymtPurpose: z.string().nullable().optional(),
		amount: z.string().optional(),
		payeePayerName: z.string().nullable().optional(),
		payeePayerAcctNo: z.string().nullable().optional(),
		payeePayerBankCode: z.string().nullable().optional(),
		gvCode: z.string().nullable().optional(),
		entryText: z.string().nullable().optional(),
		primaNotaNo: z.string().nullable().optional(),
		checkAccount: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		status: z
			.union([
				z.literal('100'),
				z.literal('200'),
				z.literal('300'),
				z.literal('350'),
				z.literal('400'),
			])
			.optional(),
		sourceTransaction: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		targetTransaction: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		enshrined: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_CheckAccountTransaction = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		valueDate: z.string(),
		entryDate: z.string().nullable().optional(),
		paymtPurpose: z.string().nullable().optional(),
		amount: z.number(),
		payeePayerName: z.string().nullable(),
		payeePayerAcctNo: z.string().nullable().optional(),
		payeePayerBankCode: z.string().nullable().optional(),
		checkAccount: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		status: z.union([
			z.literal(100),
			z.literal(200),
			z.literal(300),
			z.literal(400),
		]),
		sourceTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		targetTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_CheckAccountTransactionUpdate = z
	.object({
		valueDate: z.string().optional(),
		entryDate: z.string().nullable().optional(),
		paymtPurpose: z.string().optional(),
		amount: z.number().nullable().optional(),
		payeePayerName: z.string().nullable().optional(),
		checkAccount: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		status: z
			.union([z.literal(100), z.literal(200), z.literal(300), z.literal(400)])
			.optional(),
		sourceTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		targetTransaction: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();

const responseComponent_validationError = z
	.object({
		error: z
			.object({
				message: z.string().optional(),
				exceptionUUID: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_PrivateTransactionRuleResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string().optional(),
				objectName: z.string().optional(),
			})
			.passthrough()
			.optional(),
		paymentPurpose: z.string().nullable().optional(),
		counterpartName: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_CreatePrivateTransactionRule = z
	.object({
		objectName: z.string(),
		paymentPurpose: z.string().nullable().optional(),
		counterpartName: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		customerNumber: z.string().optional(),
		parent: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		surename: z.string().optional(),
		familyname: z.string().optional(),
		titel: z.string().optional(),
		category: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		description: z.string().optional(),
		academicTitle: z.string().optional(),
		gender: z.string().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		name2: z.string().optional(),
		birthday: z.string().optional(),
		vatNumber: z.string().optional(),
		bankAccount: z.string().optional(),
		bankNumber: z.string().optional(),
		defaultCashbackTime: z.string().optional(),
		defaultCashbackPercent: z.string().optional(),
		defaultTimeToPay: z.string().optional(),
		taxNumber: z.string().optional(),
		taxOffice: z.string().optional(),
		exemptVat: z.string().optional(),
		defaultDiscountAmount: z.string().optional(),
		defaultDiscountPercentage: z.string().optional(),
		buyerReference: z.string().optional(),
		governmentAgency: z.string().optional(),
		additionalInformation: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_Contact = z
	.object({
		name: z.string().nullable().optional(),
		status: z.number().int().nullable().optional(),
		customerNumber: z.string().nullable().optional(),
		parent: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		surename: z.string().nullable().optional(),
		familyname: z.string().nullable().optional(),
		titel: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		description: z.string().nullable().optional(),
		academicTitle: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		name2: z.string().nullable().optional(),
		birthday: z.string().nullable().optional(),
		vatNumber: z.string().nullable().optional(),
		bankAccount: z.string().nullable().optional(),
		bankNumber: z.string().nullable().optional(),
		defaultCashbackTime: z.number().int().nullable().optional(),
		defaultCashbackPercent: z.number().nullable().optional(),
		defaultTimeToPay: z.number().int().nullable().optional(),
		taxNumber: z.string().nullable().optional(),
		taxOffice: z.string().nullable().optional(),
		exemptVat: z.boolean().nullable().optional(),
		defaultDiscountAmount: z.number().nullable().optional(),
		defaultDiscountPercentage: z.boolean().nullable().optional(),
		buyerReference: z.string().nullable().optional(),
		governmentAgency: z.boolean().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactUpdate = z
	.object({
		name: z.string().nullable().optional(),
		status: z.number().int().nullable().optional(),
		customerNumber: z.string().nullable().optional(),
		parent: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		surename: z.string().nullable().optional(),
		familyname: z.string().nullable().optional(),
		titel: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		description: z.string().nullable().optional(),
		academicTitle: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		name2: z.string().nullable().optional(),
		birthday: z.string().nullable().optional(),
		vatNumber: z.string().nullable().optional(),
		bankAccount: z.string().nullable().optional(),
		bankNumber: z.string().nullable().optional(),
		defaultCashbackTime: z.number().int().nullable().optional(),
		defaultCashbackPercent: z.number().nullable().optional(),
		defaultTimeToPay: z.number().int().nullable().optional(),
		taxNumber: z.string().nullable().optional(),
		taxOffice: z.string().nullable().optional(),
		exemptVat: z.boolean().nullable().optional(),
		defaultDiscountAmount: z.number().nullable().optional(),
		defaultDiscountPercentage: z.boolean().nullable().optional(),
		buyerReference: z.string().nullable().optional(),
		governmentAgency: z.boolean().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactAddressResponse = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		street: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		name: z.string().nullable().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		name2: z.string().optional(),
		name3: z.string().nullable().optional(),
		name4: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactAddress = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		street: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable(),
		name: z.string().nullable().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		name2: z.string().optional(),
		name3: z.string().nullable().optional(),
		name4: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactAddressUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		street: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		name: z.string().nullable().optional(),
		name2: z.string().optional(),
		name3: z.string().nullable().optional(),
		name4: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_CommunicationWayResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		type: z
			.union([
				z.literal('EMAIL'),
				z.literal('PHONE'),
				z.literal('WEB'),
				z.literal('MOBILE'),
			])
			.optional(),
		value: z.string().optional(),
		key: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		main: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_CommunicationWay = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		type: z.union([
			z.literal('EMAIL'),
			z.literal('PHONE'),
			z.literal('WEB'),
			z.literal('MOBILE'),
		]),
		value: z.string(),
		key: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		main: z.boolean().nullable().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_CommunicationWayUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		type: z
			.union([
				z.literal('EMAIL'),
				z.literal('PHONE'),
				z.literal('WEB'),
				z.literal('MOBILE'),
			])
			.optional(),
		value: z.string().optional(),
		key: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		main: z.boolean().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_AccountingContactResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		debitorNumber: z.string().optional(),
		creditorNumber: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_AccountingContact = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		debitorNumber: z.number().int().nullable().optional(),
		creditorNumber: z.number().int().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_AccountingContactUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		debitorNumber: z.number().int().nullable().optional(),
		creditorNumber: z.number().int().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_Textparser_fetchDictionaryEntriesByType_response =
	z
		.object({
			key: z.string().optional(),
			value: z
				.array(
					z
						.object({
							key: z.string().optional(),
							value: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough();

const responseComponent_Model_ContactCustomFieldSettingResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		name: z.string().optional(),
		identifier: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactCustomFieldResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		contactCustomFieldSetting: z
			.intersection(
				responseComponent_Model_ContactCustomFieldSettingResponse,
				z.json(),
			)
			.optional(),
		value: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactCustomField = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		contactCustomFieldSetting: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		value: z.string(),
		objectName: z.string(),
	})
	.passthrough();

const responseComponent_Model_ContactCustomFieldUpdate = z
	.object({
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		contactCustomFieldSetting: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		value: z.string().optional(),
		objectName: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactCustomFieldSetting = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		objectName: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_ContactCustomFieldSettingUpdate = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		objectName: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_creditNoteResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		creditNoteNumber: z.string().nullable().optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		creditNoteDate: z.string().optional(),
		status: z
			.union([
				z.literal('100'),
				z.literal('200'),
				z.literal('750'),
				z.literal('1000'),
			])
			.optional(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		createUser: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		deliveryDate: z.string().optional(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxRate: z.string().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough()
			.optional(),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxText: z.string().nullable().optional(),
		taxType: z.string().nullable().optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		sumNet: z.string().optional(),
		sumTax: z.string().optional(),
		sumGross: z.string().optional(),
		sumDiscounts: z.string().optional(),
		sumNetForeignCurrency: z.string().optional(),
		sumTaxForeignCurrency: z.string().optional(),
		sumGrossForeignCurrency: z.string().optional(),
		sumDiscountsForeignCurrency: z.string().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.passthrough();

const responseComponent_Model_creditNote = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string(),
		mapAll: z.boolean(),
		create: z.string().optional(),
		update: z.string().optional(),
		creditNoteNumber: z.string(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		creditNoteDate: z.string(),
		status: z.union([
			z.literal('100'),
			z.literal('200'),
			z.literal('300'),
			z.literal('500'),
			z.literal('750'),
			z.literal('1000'),
		]),
		header: z.string(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable(),
		createUser: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough(),
		taxRate: z.number(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxText: z.string(),
		taxType: z.string(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		bookingCategory: z.union([
			z.literal('PROVISION'),
			z.literal('ROYALTY_ASSIGNED'),
			z.literal('ROYALTY_UNASSIGNED'),
			z.literal('UNDERACHIEVEMENT'),
			z.literal('ACCOUNTING_TYPE'),
		]),
		currency: z.string(),
		sumNet: z.number().optional(),
		sumTax: z.number().optional(),
		sumGross: z.number().optional(),
		sumDiscounts: z.number().optional(),
		sumNetForeignCurrency: z.number().optional(),
		sumTaxForeignCurrency: z.number().optional(),
		sumGrossForeignCurrency: z.number().optional(),
		sumDiscountsForeignCurrency: z.number().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.passthrough();

const responseComponent_Model_creditNotePos = z
	.object({
		id: z.number().int().nullable().optional(),
		objectName: z.string(),
		mapAll: z.boolean(),
		create: z.string().optional(),
		update: z.string().optional(),
		creditNote: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		quantity: z.number(),
		price: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.number(),
		sumDiscount: z.number().nullable().optional(),
	})
	.passthrough();

const responseComponent_saveCreditNote = z
	.object({
		creditNote: responseComponent_Model_creditNote,
		creditNotePosSave: z
			.array(responseComponent_Model_creditNotePos)
			.optional(),
		creditNotePosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		discountSave: z
			.object({
				discount: z.boolean(),
				text: z.string(),
				percentage: z.boolean(),
				value: z.number(),
				objectName: z.string(),
				mapAll: z.boolean(),
			})
			.passthrough()
			.optional(),
		discountDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_creditNotePosResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		creditNote: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough(),
		part: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		quantity: z.string(),
		price: z.string().nullable().optional(),
		priceNet: z.string().nullable().optional(),
		priceTax: z.string().nullable().optional(),
		priceGross: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		positionNumber: z.string().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.string().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.string(),
		sumDiscount: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_saveCreditNoteResponse = z
	.object({
		creditNote: responseComponent_Model_creditNoteResponse.optional(),
		creditNotePos: z
			.array(responseComponent_Model_creditNotePosResponse)
			.optional(),
	})
	.passthrough();

const responseComponent_Model_discountsResponse = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z.string().optional(),
		discount: z.string().optional(),
		text: z.string().optional(),
		percentage: z.string().optional(),
		value: z.string().optional(),
		isNet: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_creditNoteUpdate = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		creditNoteNumber: z.string().nullable().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		creditNoteDate: z.string().optional(),
		status: z
			.union([
				z.literal('100'),
				z.literal('200'),
				z.literal('750'),
				z.literal('1000'),
			])
			.optional(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		createUser: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		deliveryDate: z.string().optional(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxRate: z.number().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough()
			.optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxText: z.string().nullable().optional(),
		taxType: z.string().nullable().optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		sumNet: z.number().optional(),
		sumTax: z.number().optional(),
		sumGross: z.number().optional(),
		sumDiscounts: z.number().optional(),
		sumNetForeignCurrency: z.number().optional(),
		sumTaxForeignCurrency: z.number().optional(),
		sumGrossForeignCurrency: z.number().optional(),
		sumDiscountsForeignCurrency: z.number().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.passthrough();

const responseComponent_Model_CreditNote_sendByWithRender = z
	.object({
		pdf: z.string().optional(),
		docId: z.string().optional(),
		parameters: z
			.array(
				z
					.object({
						key: z.string().optional(),
						name: z.string().optional(),
						values: z
							.array(
								z
									.object({
										name: z.string().optional(),
										translationCade: z.string().optional(),
										value: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						visible: z.boolean().optional(),
						value: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

const responseComponent_Model_creditNote_mailResponse = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		additionalInformation: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		object: responseComponent_Model_creditNoteResponse.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		subject: z.string().optional(),
		text: z.string().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Export_Progress_Data = z
	.object({
		current: z.number().int().optional(),
		total: z.number().int().optional(),
	})
	.passthrough();

const responseComponent_Export_Job_Download_Info = z
	.object({
		filename: z.string().optional(),
		link: z.string().optional(),
		linkExpireDate: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_Part = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		name: z.string(),
		partNumber: z.string(),
		text: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		stock: z.number(),
		stockEnabled: z.boolean().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		price: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		pricePurchase: z.number().nullable().optional(),
		taxRate: z.number(),
		status: z.union([z.literal(50), z.literal(100)]).optional(),
		internalComment: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_PartUpdate = z
	.object({
		id: z.number().int().nullable().optional(),
		objectName: z.string().nullable().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		name: z.string().optional(),
		partNumber: z.string().optional(),
		text: z.string().nullable().optional(),
		category: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		stock: z.number().optional(),
		stockEnabled: z.boolean().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		price: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		pricePurchase: z.number().nullable().optional(),
		taxRate: z.number().optional(),
		status: z.union([z.literal(50), z.literal(100)]).optional(),
		internalComment: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_InvoiceResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		invoiceNumber: z.string().optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		invoiceDate: z.string().optional(),
		header: z.string().optional(),
		headText: z.string().optional(),
		footText: z.string().optional(),
		timeToPay: z.string().optional(),
		discountTime: z.string().optional(),
		discount: z.string().optional(),
		addressCountry: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		payDate: z.string().optional(),
		createUser: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		deliveryDate: z.string().optional(),
		status: z
			.union([
				z.literal('50'),
				z.literal('100'),
				z.literal('200'),
				z.literal('750'),
				z.literal('1000'),
			])
			.optional(),
		smallSettlement: z.boolean().optional(),
		contactPerson: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		taxRate: z.string().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough()
			.optional(),
		taxText: z.string().optional(),
		dunningLevel: z.string().optional(),
		taxType: z
			.union([
				z.literal('default'),
				z.literal('eu'),
				z.literal('noteu'),
				z.literal('custom'),
			])
			.optional(),
		paymentMethod: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		costCentre: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sendDate: z.string().optional(),
		origin: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		invoiceType: z
			.union([
				z.literal('RE'),
				z.literal('WKR'),
				z.literal('SR'),
				z.literal('MA'),
				z.literal('TR'),
				z.literal('AR'),
				z.literal('ER'),
			])
			.optional(),
		accountIntervall: z.string().optional(),
		accountNextInvoice: z.string().optional(),
		reminderTotal: z.string().optional(),
		reminderDebit: z.string().optional(),
		reminderDeadline: z.string().optional(),
		reminderCharge: z.string().optional(),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		address: z.string().optional(),
		currency: z.string().optional(),
		sumNet: z.string().optional(),
		sumTax: z.string().optional(),
		sumGross: z.string().optional(),
		sumDiscounts: z.string().optional(),
		sumNetForeignCurrency: z.string().optional(),
		sumTaxForeignCurrency: z.string().optional(),
		sumGrossForeignCurrency: z.string().optional(),
		sumDiscountsForeignCurrency: z.string().optional(),
		sumNetAccounting: z.string().optional(),
		sumTaxAccounting: z.string().optional(),
		sumGrossAccounting: z.string().optional(),
		paidAmount: z.number().optional(),
		customerInternalNote: z.string().optional(),
		showNet: z.boolean().optional(),
		enshrined: z.string().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
		deliveryDateUntil: z.string().optional(),
		datevConnectOnline: z.record(z.string(), z.json()).optional(),
		sendPaymentReceivedNotificationDate: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_Invoice = z
	.object({
		id: z.number().int().nullable().optional(),
		objectName: z.string().optional(),
		invoiceNumber: z.string().nullable().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		invoiceDate: z.string(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		timeToPay: z.number().int().nullable().optional(),
		discount: z.number().int(),
		address: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		payDate: z.string().nullable().optional(),
		createUser: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		deliveryDate: z.string().nullable().optional(),
		deliveryDateUntil: z.number().int().nullable().optional(),
		status: z.union([
			z.literal('50'),
			z.literal('100'),
			z.literal('200'),
			z.literal('750'),
			z.literal('1000'),
		]),
		smallSettlement: z.boolean().nullable().optional(),
		taxRate: z.number(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough(),
		taxText: z.string(),
		taxType: z.union([
			z.literal('default'),
			z.literal('eu'),
			z.literal('noteu'),
			z.literal('custom'),
		]),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		dunningLevel: z.number().int().nullable().optional(),
		paymentMethod: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sendDate: z.string().nullable().optional(),
		invoiceType: z.union([
			z.literal('RE'),
			z.literal('WKR'),
			z.literal('SR'),
			z.literal('MA'),
			z.literal('TR'),
			z.literal('AR'),
			z.literal('ER'),
		]),
		accountIntervall: z.string().nullable().optional(),
		accountNextInvoice: z.number().int().nullable().optional(),
		currency: z.string(),
		sumNet: z.number().optional(),
		sumTax: z.number().optional(),
		sumGross: z.number().optional(),
		sumDiscounts: z.number().optional(),
		sumNetForeignCurrency: z.number().optional(),
		sumTaxForeignCurrency: z.number().optional(),
		sumGrossForeignCurrency: z.number().optional(),
		sumDiscountsForeignCurrency: z.number().optional(),
		sumNetAccounting: z.number().optional(),
		sumTaxAccounting: z.number().optional(),
		sumGrossAccounting: z.number().optional(),
		paidAmount: z.number().nullable().optional(),
		showNet: z.boolean().optional(),
		enshrined: z.string().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
		origin: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		customerInternalNote: z.string().nullable().optional(),
		propertyIsEInvoice: z.boolean().nullable().optional(),
		mapAll: z.boolean(),
	})
	.passthrough();

const responseComponent_Model_InvoicePos = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string(),
		mapAll: z.boolean(),
		create: z.string().optional(),
		update: z.string().optional(),
		invoice: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		quantity: z.number(),
		price: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		taxRate: z.number(),
		sumDiscount: z.number().nullable().optional(),
		sumNetAccounting: z.number().nullable().optional(),
		sumTaxAccounting: z.number().nullable().optional(),
		sumGrossAccounting: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
	})
	.passthrough();

const responseComponent_saveInvoice = z
	.object({
		invoice: responseComponent_Model_Invoice,
		invoicePosSave: z.array(responseComponent_Model_InvoicePos).optional(),
		invoicePosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		filename: z.string().optional(),
		discountSave: z
			.array(
				z
					.object({
						discount: z.boolean().optional(),
						text: z.string().optional(),
						percentage: z.boolean().optional(),
						value: z.number().optional(),
						objectName: z.string().optional(),
						mapAll: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		discountDelete: z
			.object({
				id: z.number().int().optional(),
				objectName: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_InvoicePosResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		invoice: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		part: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		quantity: z.boolean().optional(),
		price: z.string().optional(),
		name: z.string().optional(),
		unity: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		positionNumber: z.string().optional(),
		text: z.string().optional(),
		discount: z.string().optional(),
		taxRate: z.string().optional(),
		sumDiscount: z.string().optional(),
		sumNetAccounting: z.string().optional(),
		sumTaxAccounting: z.string().optional(),
		sumGrossAccounting: z.string().optional(),
		priceNet: z.string().optional(),
		priceGross: z.string().optional(),
		priceTax: z.string().optional(),
	})
	.passthrough();

const responseComponent_saveInvoiceResponse = z
	.object({
		invoice: responseComponent_Model_InvoiceResponse.optional(),
		invoicePos: z.array(responseComponent_Model_InvoicePosResponse).optional(),
		filename: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_CreateInvoiceFromOrder = z
	.object({
		order: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		type: z
			.union([z.literal('percentage'), z.literal('net'), z.literal('gross')])
			.optional(),
		amount: z.number().nullable().optional(),
		partialType: z
			.union([z.literal('RE'), z.literal('TR'), z.literal('AR')])
			.optional(),
	})
	.passthrough();

const responseComponent_Model_Email = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		object: responseComponent_Model_InvoiceResponse.optional(),
		from: z.string(),
		to: z.string(),
		subject: z.string(),
		text: z.string().nullable().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		cc: z.string().nullable().optional(),
		bcc: z.string().nullable().optional(),
		arrived: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_ChangeLayout = z
	.object({
		key: z.union([
			z.literal('language'),
			z.literal('template'),
			z.literal('letterpaper'),
			z.literal('payPal'),
		]),
		value: z.string(),
	})
	.passthrough();

const responseComponent_Model_ChangeLayoutResponse = z
	.object({
		result: z.string().optional(),
		metadaten: z
			.object({
				pdf: z.string().optional(),
				docId: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_OrderResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		orderNumber: z.string().optional(),
		contact: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		orderDate: z.string().optional(),
		status: z
			.union([
				z.literal('100'),
				z.literal('200'),
				z.literal('300'),
				z.literal('500'),
				z.literal('750'),
				z.literal('1000'),
			])
			.optional(),
		header: z.string().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		createUser: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		deliveryTerms: z.string().nullable().optional(),
		paymentTerms: z.string().nullable().optional(),
		origin: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		version: z.string().optional(),
		smallSettlement: z.boolean().optional(),
		contactPerson: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		taxRate: z.string().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough()
			.optional(),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxText: z.string().optional(),
		taxType: z.string().optional(),
		orderType: z
			.union([z.literal('AN'), z.literal('AB'), z.literal('LI')])
			.optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().optional(),
		sumNet: z.string().optional(),
		sumTax: z.string().optional(),
		sumGross: z.string().optional(),
		sumDiscounts: z.string().optional(),
		sumNetForeignCurrency: z.string().optional(),
		sumTaxForeignCurrency: z.string().optional(),
		sumGrossForeignCurrency: z.string().optional(),
		sumDiscountsForeignCurrency: z.string().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.passthrough();

const responseComponent_Model_Order = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		mapAll: z.boolean(),
		create: z.string().optional(),
		update: z.string().optional(),
		orderNumber: z.string(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		orderDate: z.string(),
		status: z.union([
			z.literal(100),
			z.literal(200),
			z.literal(300),
			z.literal(500),
			z.literal(750),
			z.literal(1000),
		]),
		header: z.string(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		deliveryTerms: z.string().nullable().optional(),
		paymentTerms: z.string().nullable().optional(),
		version: z.number().int(),
		smallSettlement: z.boolean().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		taxRate: z.number(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxText: z.string(),
		taxType: z.string(),
		orderType: z
			.union([z.literal('AN'), z.literal('AB'), z.literal('LI')])
			.optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
		origin: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_OrderPos = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		order: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		quantity: z.number(),
		price: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.number(),
		sumDiscount: z.number().nullable().optional(),
	})
	.passthrough();

const responseComponent_saveOrder = z
	.object({
		order: responseComponent_Model_Order,
		orderPosSave: z.array(responseComponent_Model_OrderPos).optional(),
		orderPosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_OrderPosResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		order: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		part: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		quantity: z.string().optional(),
		price: z.string().nullable().optional(),
		priceNet: z.string().nullable().optional(),
		priceTax: z.string().nullable().optional(),
		priceGross: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		positionNumber: z.string().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.string().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.string().optional(),
		sumDiscount: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_saveOrderResponse = z
	.object({
		order: responseComponent_Model_OrderResponse.optional(),
		orderPos: z.array(responseComponent_Model_OrderPosResponse).optional(),
	})
	.passthrough();

const responseComponent_Model_OrderUpdate = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		orderNumber: z.string().optional(),
		contact: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		orderDate: z.string().nullable().optional(),
		status: z
			.union([
				z.literal(100),
				z.literal(200),
				z.literal(300),
				z.literal(500),
				z.literal(750),
				z.literal(1000),
			])
			.optional(),
		header: z.string().nullable().optional(),
		headText: z.string().nullable().optional(),
		footText: z.string().nullable().optional(),
		addressCountry: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		createUser: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		deliveryTerms: z.string().nullable().optional(),
		paymentTerms: z.string().nullable().optional(),
		origin: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		version: z.number().int().nullable().optional(),
		smallSettlement: z.boolean().nullable().optional(),
		contactPerson: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		taxRate: z.number().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
					z.literal('17'),
					z.literal('18'),
					z.literal('19'),
					z.literal('20'),
					z.literal('21'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough()
			.optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		taxText: z.string().nullable().optional(),
		taxType: z.string().nullable().optional(),
		orderType: z
			.union([z.literal('AN'), z.literal('AB'), z.literal('LI')])
			.optional(),
		sendDate: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		sumNet: z.number().optional(),
		sumTax: z.number().optional(),
		sumGross: z.number().optional(),
		sumDiscounts: z.number().optional(),
		sumNetForeignCurrency: z.number().optional(),
		sumTaxForeignCurrency: z.number().optional(),
		sumGrossForeignCurrency: z.number().optional(),
		sumDiscountsForeignCurrency: z.number().optional(),
		customerInternalNote: z.string().nullable().optional(),
		showNet: z.boolean().nullable().optional(),
		sendType: z
			.union([
				z.literal('VPR'),
				z.literal('VPDF'),
				z.literal('VM'),
				z.literal('VP'),
			])
			.optional(),
	})
	.passthrough();

const responseComponent_Model_Discount = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		object: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z.string().optional(),
		text: z.string().optional(),
		percentage: z.string().optional(),
		value: z.string().optional(),
		isNet: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_EmailOrder = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		object: responseComponent_Model_OrderResponse.optional(),
		from: z.string(),
		to: z.string(),
		subject: z.string(),
		text: z.string().nullable().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		cc: z.string().nullable().optional(),
		bcc: z.string().nullable().optional(),
		arrived: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_CreatePackingListFromOrder = z
	.object({
		id: z.number().int(),
		objectName: z.string(),
	})
	.passthrough();

const responseComponent_Model_OrderPosUpdate = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		order: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		part: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		quantity: z.number().nullable().optional(),
		price: z.number().nullable().optional(),
		priceNet: z.number().nullable().optional(),
		priceTax: z.number().nullable().optional(),
		priceGross: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		unity: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		positionNumber: z.number().int().nullable().optional(),
		text: z.string().nullable().optional(),
		discount: z.number().nullable().optional(),
		optional: z.boolean().nullable().optional(),
		taxRate: z.number().nullable().optional(),
		sumDiscount: z.number().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_Voucher = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string(),
		mapAll: z.boolean(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		createUser: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		voucherDate: z.string().nullable().optional(),
		supplier: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		supplierName: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		payDate: z.string().nullable().optional(),
		status: z.union([z.literal(50), z.literal(100), z.literal(1000)]),
		sumNet: z.number().optional(),
		sumTax: z.number().optional(),
		sumGross: z.number().optional(),
		sumNetAccounting: z.number().optional(),
		sumTaxAccounting: z.number().optional(),
		sumGrossAccounting: z.number().optional(),
		sumDiscounts: z.number().optional(),
		sumDiscountsForeignCurrency: z.number().optional(),
		paidAmount: z.number().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough(),
		taxType: z.string(),
		creditDebit: z.union([z.literal('C'), z.literal('D')]),
		voucherType: z.union([z.literal('VOU'), z.literal('RV')]),
		currency: z.string().nullable().optional(),
		propertyForeignCurrencyDeadline: z.string().nullable().optional(),
		propertyExchangeRate: z.number().nullable().optional(),
		recurringInterval: z
			.union([
				z.literal('P0Y0M1W'),
				z.literal('P0Y0M2W'),
				z.literal('P0Y1M0W'),
				z.literal('P0Y3M0W'),
				z.literal('P0Y6M0W'),
				z.literal('P1Y0M0W'),
				z.literal('P2Y0M0W'),
				z.literal('P3Y0M0W'),
				z.literal('P4Y0M0W'),
				z.literal('P5Y0M0W'),
			])
			.optional(),
		recurringStartDate: z.string().nullable().optional(),
		recurringNextVoucher: z.string().nullable().optional(),
		recurringLastVoucher: z.string().nullable().optional(),
		recurringEndDate: z.string().nullable().optional(),
		enshrined: z.string().optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		paymentDeadline: z.string().nullable().optional(),
		deliveryDate: z.string().optional(),
		deliveryDateUntil: z.string().nullable().optional(),
		document: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		costCentre: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_VoucherPos = z
	.object({
		id: z.number().int().optional(),
		objectName: z.string(),
		mapAll: z.boolean(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		voucher: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		accountDatev: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		accountingType: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		estimatedAccountingType: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		taxRate: z.number(),
		net: z.boolean(),
		isAsset: z.boolean().optional(),
		sumNet: z.number(),
		sumTax: z.number().optional(),
		sumGross: z.number(),
		sumNetAccounting: z.number().optional(),
		sumTaxAccounting: z.number().optional(),
		sumGrossAccounting: z.number().optional(),
		comment: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_saveVoucher = z
	.object({
		voucher: responseComponent_Model_Voucher,
		voucherPosSave: z.array(responseComponent_Model_VoucherPos).optional(),
		voucherPosDelete: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		filename: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_VoucherResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		mapAll: z.boolean().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		createUser: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		voucherDate: z.string().nullable().optional(),
		supplier: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		supplierName: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		document: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		payDate: z.string().nullable().optional(),
		status: z
			.union([z.literal('50'), z.literal('100'), z.literal('1000')])
			.optional(),
		sumNet: z.string().optional(),
		sumTax: z.string().optional(),
		sumGross: z.string().optional(),
		sumNetAccounting: z.string().optional(),
		sumTaxAccounting: z.string().optional(),
		sumGrossAccounting: z.string().optional(),
		sumDiscounts: z.string().optional(),
		sumDiscountsForeignCurrency: z.string().optional(),
		paidAmount: z.number().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough()
			.optional(),
		taxType: z.string().nullable().optional(),
		creditDebit: z.union([z.literal('C'), z.literal('D')]).optional(),
		costCentre: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		voucherType: z.union([z.literal('VOU'), z.literal('RV')]).optional(),
		currency: z.string().nullable().optional(),
		propertyForeignCurrencyDeadline: z.string().nullable().optional(),
		propertyExchangeRate: z.string().nullable().optional(),
		recurringInterval: z
			.union([
				z.literal('P0Y0M1W'),
				z.literal('P0Y0M2W'),
				z.literal('P0Y1M0W'),
				z.literal('P0Y3M0W'),
				z.literal('P0Y6M0W'),
				z.literal('P1Y0M0W'),
				z.literal('P2Y0M0W'),
				z.literal('P3Y0M0W'),
				z.literal('P4Y0M0W'),
				z.literal('P5Y0M0W'),
			])
			.optional(),
		recurringStartDate: z.string().nullable().optional(),
		recurringNextVoucher: z.string().nullable().optional(),
		recurringLastVoucher: z.string().nullable().optional(),
		recurringEndDate: z.string().nullable().optional(),
		enshrined: z.string().optional(),
		taxSet: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		paymentDeadline: z.string().nullable().optional(),
		deliveryDate: z.string().optional(),
		deliveryDateUntil: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_Model_VoucherPosResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		create: z.string().optional(),
		update: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		voucher: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough(),
		accountDatev: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough(),
		accountingType: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough(),
		estimatedAccountingType: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		taxRate: z.string(),
		net: z.boolean(),
		isAsset: z.boolean().optional(),
		sumNet: z.string(),
		sumTax: z.string().optional(),
		sumGross: z.string(),
		sumNetAccounting: z.string().optional(),
		sumTaxAccounting: z.string().optional(),
		sumGrossAccounting: z.string().optional(),
		comment: z.string().nullable().optional(),
	})
	.passthrough();

const responseComponent_saveVoucherResponse = z
	.object({
		voucher: responseComponent_Model_VoucherResponse.optional(),
		voucherPos: z.array(responseComponent_Model_VoucherPosResponse).optional(),
		filename: z.string().optional(),
	})
	.passthrough();

const responseComponent_Model_VoucherUpdate = z
	.object({
		voucherDate: z.string().nullable().optional(),
		supplier: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		supplierName: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		payDate: z.string().nullable().optional(),
		status: z
			.union([z.literal(50), z.literal(100), z.literal(1000)])
			.optional(),
		paidAmount: z.number().nullable().optional(),
		taxRule: z
			.object({
				id: z.union([
					z.literal('1'),
					z.literal('2'),
					z.literal('3'),
					z.literal('4'),
					z.literal('5'),
					z.literal('11'),
				]),
				objectName: z.union([z.literal('TaxRule')]),
			})
			.passthrough()
			.optional(),
		taxType: z.string().optional(),
		creditDebit: z.union([z.literal('C'), z.literal('D')]).optional(),
		voucherType: z.union([z.literal('VOU'), z.literal('RV')]).optional(),
		currency: z.string().nullable().optional(),
		propertyForeignCurrencyDeadline: z.string().nullable().optional(),
		propertyExchangeRate: z.number().nullable().optional(),
		taxSet: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		paymentDeadline: z.string().nullable().optional(),
		deliveryDate: z.string().optional(),
		deliveryDateUntil: z.string().nullable().optional(),
		document: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.nullable()
			.optional(),
		costCentre: z
			.object({
				id: z.number().int(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_ReceiptGuideDto = z
	.object({
		accountDatevId: z.number().int().optional(),
		accountNumber: z.string().optional(),
		accountName: z.string().optional(),
		description: z.string().optional(),
		allowedTaxRules: z
			.array(
				z
					.object({
						name: z.string().optional(),
						description: z.string().optional(),
						id: z.number().int().optional(),
						taxRates: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		allowedReceiptTypes: z.array(z.string()).optional(),
	})
	.passthrough();

const responseComponent_Model_TagResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		additionalInformation: z.string().optional(),
		create: z.string().optional(),
		name: z.string().optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const responseComponent_Model_TagCreateResponse = z
	.object({
		id: z.string().optional(),
		objectName: z.string().optional(),
		additionalInformation: z.string().optional(),
		create: z.string().optional(),
		tag: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
		object: z
			.object({
				id: z.number().int(),
				objectName: z.union([
					z.literal('Invoice'),
					z.literal('Voucher'),
					z.literal('Order'),
					z.literal('CreditNote'),
				]),
			})
			.passthrough()
			.optional(),
		sevClient: z
			.object({
				id: z.string(),
				objectName: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const SevdeskRequestComponents = {
	Model_CheckAccountResponse: requestComponent_Model_CheckAccountResponse,
	createFileImportAccount: requestComponent_createFileImportAccount,
	createFileImportAccountResponse:
		requestComponent_createFileImportAccountResponse,
	createClearingAccount: requestComponent_createClearingAccount,
	createClearingAccountResponse: requestComponent_createClearingAccountResponse,
	Model_CheckAccountUpdate: requestComponent_Model_CheckAccountUpdate,
	Model_CheckAccountTransactionResponse:
		requestComponent_Model_CheckAccountTransactionResponse,
	Model_CheckAccountTransaction: requestComponent_Model_CheckAccountTransaction,
	Model_CheckAccountTransactionUpdate:
		requestComponent_Model_CheckAccountTransactionUpdate,
	validationError: requestComponent_validationError,
	Model_PrivateTransactionRuleResponse:
		requestComponent_Model_PrivateTransactionRuleResponse,
	CreatePrivateTransactionRule: requestComponent_CreatePrivateTransactionRule,
	Model_ContactResponse: requestComponent_Model_ContactResponse,
	Model_Contact: requestComponent_Model_Contact,
	Model_ContactUpdate: requestComponent_Model_ContactUpdate,
	Model_ContactAddressResponse: requestComponent_Model_ContactAddressResponse,
	Model_ContactAddress: requestComponent_Model_ContactAddress,
	Model_ContactAddressUpdate: requestComponent_Model_ContactAddressUpdate,
	Model_CommunicationWayResponse:
		requestComponent_Model_CommunicationWayResponse,
	Model_CommunicationWay: requestComponent_Model_CommunicationWay,
	Model_CommunicationWayUpdate: requestComponent_Model_CommunicationWayUpdate,
	Model_AccountingContactResponse:
		requestComponent_Model_AccountingContactResponse,
	Model_AccountingContact: requestComponent_Model_AccountingContact,
	Model_AccountingContactUpdate: requestComponent_Model_AccountingContactUpdate,
	Model_Textparser_fetchDictionaryEntriesByType_response:
		requestComponent_Model_Textparser_fetchDictionaryEntriesByType_response,
	Model_ContactCustomFieldSettingResponse:
		requestComponent_Model_ContactCustomFieldSettingResponse,
	Model_ContactCustomFieldResponse:
		requestComponent_Model_ContactCustomFieldResponse,
	Model_ContactCustomField: requestComponent_Model_ContactCustomField,
	Model_ContactCustomFieldUpdate:
		requestComponent_Model_ContactCustomFieldUpdate,
	Model_ContactCustomFieldSetting:
		requestComponent_Model_ContactCustomFieldSetting,
	Model_ContactCustomFieldSettingUpdate:
		requestComponent_Model_ContactCustomFieldSettingUpdate,
	Model_creditNoteResponse: requestComponent_Model_creditNoteResponse,
	Model_creditNote: requestComponent_Model_creditNote,
	Model_creditNotePos: requestComponent_Model_creditNotePos,
	saveCreditNote: requestComponent_saveCreditNote,
	Model_creditNotePosResponse: requestComponent_Model_creditNotePosResponse,
	saveCreditNoteResponse: requestComponent_saveCreditNoteResponse,
	Model_discountsResponse: requestComponent_Model_discountsResponse,
	Model_creditNoteUpdate: requestComponent_Model_creditNoteUpdate,
	Model_CreditNote_sendByWithRender:
		requestComponent_Model_CreditNote_sendByWithRender,
	Model_creditNote_mailResponse: requestComponent_Model_creditNote_mailResponse,
	Export_Progress_Data: requestComponent_Export_Progress_Data,
	Export_Job_Download_Info: requestComponent_Export_Job_Download_Info,
	Model_Part: requestComponent_Model_Part,
	Model_PartUpdate: requestComponent_Model_PartUpdate,
	Model_InvoiceResponse: requestComponent_Model_InvoiceResponse,
	Model_Invoice: requestComponent_Model_Invoice,
	Model_InvoicePos: requestComponent_Model_InvoicePos,
	saveInvoice: requestComponent_saveInvoice,
	Model_InvoicePosResponse: requestComponent_Model_InvoicePosResponse,
	saveInvoiceResponse: requestComponent_saveInvoiceResponse,
	Model_CreateInvoiceFromOrder: requestComponent_Model_CreateInvoiceFromOrder,
	Model_Email: requestComponent_Model_Email,
	Model_ChangeLayout: requestComponent_Model_ChangeLayout,
	Model_ChangeLayoutResponse: requestComponent_Model_ChangeLayoutResponse,
	Model_OrderResponse: requestComponent_Model_OrderResponse,
	Model_Order: requestComponent_Model_Order,
	Model_OrderPos: requestComponent_Model_OrderPos,
	saveOrder: requestComponent_saveOrder,
	Model_OrderPosResponse: requestComponent_Model_OrderPosResponse,
	saveOrderResponse: requestComponent_saveOrderResponse,
	Model_OrderUpdate: requestComponent_Model_OrderUpdate,
	Model_Discount: requestComponent_Model_Discount,
	Model_EmailOrder: requestComponent_Model_EmailOrder,
	Model_CreatePackingListFromOrder:
		requestComponent_Model_CreatePackingListFromOrder,
	Model_OrderPosUpdate: requestComponent_Model_OrderPosUpdate,
	Model_Voucher: requestComponent_Model_Voucher,
	Model_VoucherPos: requestComponent_Model_VoucherPos,
	saveVoucher: requestComponent_saveVoucher,
	Model_VoucherResponse: requestComponent_Model_VoucherResponse,
	Model_VoucherPosResponse: requestComponent_Model_VoucherPosResponse,
	saveVoucherResponse: requestComponent_saveVoucherResponse,
	Model_VoucherUpdate: requestComponent_Model_VoucherUpdate,
	ReceiptGuideDto: requestComponent_ReceiptGuideDto,
	Model_TagResponse: requestComponent_Model_TagResponse,
	Model_TagCreateResponse: requestComponent_Model_TagCreateResponse,
} as const;

export const SevdeskResponseComponents = {
	Model_CheckAccountResponse: responseComponent_Model_CheckAccountResponse,
	createFileImportAccount: responseComponent_createFileImportAccount,
	createFileImportAccountResponse:
		responseComponent_createFileImportAccountResponse,
	createClearingAccount: responseComponent_createClearingAccount,
	createClearingAccountResponse:
		responseComponent_createClearingAccountResponse,
	Model_CheckAccountUpdate: responseComponent_Model_CheckAccountUpdate,
	Model_CheckAccountTransactionResponse:
		responseComponent_Model_CheckAccountTransactionResponse,
	Model_CheckAccountTransaction:
		responseComponent_Model_CheckAccountTransaction,
	Model_CheckAccountTransactionUpdate:
		responseComponent_Model_CheckAccountTransactionUpdate,
	validationError: responseComponent_validationError,
	Model_PrivateTransactionRuleResponse:
		responseComponent_Model_PrivateTransactionRuleResponse,
	CreatePrivateTransactionRule: responseComponent_CreatePrivateTransactionRule,
	Model_ContactResponse: responseComponent_Model_ContactResponse,
	Model_Contact: responseComponent_Model_Contact,
	Model_ContactUpdate: responseComponent_Model_ContactUpdate,
	Model_ContactAddressResponse: responseComponent_Model_ContactAddressResponse,
	Model_ContactAddress: responseComponent_Model_ContactAddress,
	Model_ContactAddressUpdate: responseComponent_Model_ContactAddressUpdate,
	Model_CommunicationWayResponse:
		responseComponent_Model_CommunicationWayResponse,
	Model_CommunicationWay: responseComponent_Model_CommunicationWay,
	Model_CommunicationWayUpdate: responseComponent_Model_CommunicationWayUpdate,
	Model_AccountingContactResponse:
		responseComponent_Model_AccountingContactResponse,
	Model_AccountingContact: responseComponent_Model_AccountingContact,
	Model_AccountingContactUpdate:
		responseComponent_Model_AccountingContactUpdate,
	Model_Textparser_fetchDictionaryEntriesByType_response:
		responseComponent_Model_Textparser_fetchDictionaryEntriesByType_response,
	Model_ContactCustomFieldSettingResponse:
		responseComponent_Model_ContactCustomFieldSettingResponse,
	Model_ContactCustomFieldResponse:
		responseComponent_Model_ContactCustomFieldResponse,
	Model_ContactCustomField: responseComponent_Model_ContactCustomField,
	Model_ContactCustomFieldUpdate:
		responseComponent_Model_ContactCustomFieldUpdate,
	Model_ContactCustomFieldSetting:
		responseComponent_Model_ContactCustomFieldSetting,
	Model_ContactCustomFieldSettingUpdate:
		responseComponent_Model_ContactCustomFieldSettingUpdate,
	Model_creditNoteResponse: responseComponent_Model_creditNoteResponse,
	Model_creditNote: responseComponent_Model_creditNote,
	Model_creditNotePos: responseComponent_Model_creditNotePos,
	saveCreditNote: responseComponent_saveCreditNote,
	Model_creditNotePosResponse: responseComponent_Model_creditNotePosResponse,
	saveCreditNoteResponse: responseComponent_saveCreditNoteResponse,
	Model_discountsResponse: responseComponent_Model_discountsResponse,
	Model_creditNoteUpdate: responseComponent_Model_creditNoteUpdate,
	Model_CreditNote_sendByWithRender:
		responseComponent_Model_CreditNote_sendByWithRender,
	Model_creditNote_mailResponse:
		responseComponent_Model_creditNote_mailResponse,
	Export_Progress_Data: responseComponent_Export_Progress_Data,
	Export_Job_Download_Info: responseComponent_Export_Job_Download_Info,
	Model_Part: responseComponent_Model_Part,
	Model_PartUpdate: responseComponent_Model_PartUpdate,
	Model_InvoiceResponse: responseComponent_Model_InvoiceResponse,
	Model_Invoice: responseComponent_Model_Invoice,
	Model_InvoicePos: responseComponent_Model_InvoicePos,
	saveInvoice: responseComponent_saveInvoice,
	Model_InvoicePosResponse: responseComponent_Model_InvoicePosResponse,
	saveInvoiceResponse: responseComponent_saveInvoiceResponse,
	Model_CreateInvoiceFromOrder: responseComponent_Model_CreateInvoiceFromOrder,
	Model_Email: responseComponent_Model_Email,
	Model_ChangeLayout: responseComponent_Model_ChangeLayout,
	Model_ChangeLayoutResponse: responseComponent_Model_ChangeLayoutResponse,
	Model_OrderResponse: responseComponent_Model_OrderResponse,
	Model_Order: responseComponent_Model_Order,
	Model_OrderPos: responseComponent_Model_OrderPos,
	saveOrder: responseComponent_saveOrder,
	Model_OrderPosResponse: responseComponent_Model_OrderPosResponse,
	saveOrderResponse: responseComponent_saveOrderResponse,
	Model_OrderUpdate: responseComponent_Model_OrderUpdate,
	Model_Discount: responseComponent_Model_Discount,
	Model_EmailOrder: responseComponent_Model_EmailOrder,
	Model_CreatePackingListFromOrder:
		responseComponent_Model_CreatePackingListFromOrder,
	Model_OrderPosUpdate: responseComponent_Model_OrderPosUpdate,
	Model_Voucher: responseComponent_Model_Voucher,
	Model_VoucherPos: responseComponent_Model_VoucherPos,
	saveVoucher: responseComponent_saveVoucher,
	Model_VoucherResponse: responseComponent_Model_VoucherResponse,
	Model_VoucherPosResponse: responseComponent_Model_VoucherPosResponse,
	saveVoucherResponse: responseComponent_saveVoucherResponse,
	Model_VoucherUpdate: responseComponent_Model_VoucherUpdate,
	ReceiptGuideDto: responseComponent_ReceiptGuideDto,
	Model_TagResponse: responseComponent_Model_TagResponse,
	Model_TagCreateResponse: responseComponent_Model_TagCreateResponse,
} as const;

export const SevdeskListEnvelopeSchema = z
	.object({ objects: z.array(z.json()), total: z.string().optional() })
	.passthrough();

export const SevdeskEndpointInputSchemas = {
	'basics.bookkeepingSystemVersion': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccount.getCheckAccounts': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccount.createFileImportAccount': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_createFileImportAccount.optional(),
		})
		.strict(),
	'checkAccount.createClearingAccount': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_createClearingAccount.optional(),
		})
		.strict(),
	'checkAccount.getCheckAccountById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccount.updateCheckAccount': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_CheckAccountUpdate.optional(),
		})
		.strict(),
	'checkAccount.deleteCheckAccount': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccount.getBalanceAtDate': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					date: z.string(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccountTransaction.getTransactions': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'checkAccount[id]': z.number().int().optional(),
					'checkAccount[objectName]': z.string().optional(),
					isBooked: z.boolean().optional(),
					paymtPurpose: z.string().optional(),
					startDate: z.string().optional(),
					endDate: z.string().optional(),
					payeePayerName: z.string().optional(),
					onlyCredit: z.boolean().optional(),
					onlyDebit: z.boolean().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccountTransaction.createTransaction': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_CheckAccountTransaction.optional(),
		})
		.strict(),
	'checkAccountTransaction.getCheckAccountTransactionById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountTransactionId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccountTransaction.updateCheckAccountTransaction': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountTransactionId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_CheckAccountTransactionUpdate.optional(),
		})
		.strict(),
	'checkAccountTransaction.deleteCheckAccountTransaction': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountTransactionId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'checkAccountTransaction.checkAccountTransactionEnshrine': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					checkAccountTransactionId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'privateTransactionRule.listPrivateTransactionRules': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'privateTransactionRule.createPrivateTransactionRule': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_CreatePrivateTransactionRule.optional(),
		})
		.strict(),
	'privateTransactionRule.deletePrivateTransactionRule': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					id: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contact.getNextCustomerNumber': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contact.findContactsByCustomFieldValue': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					value: z.string(),
					'customFieldSetting[id]': z.string().optional(),
					'customFieldSetting[objectName]': z.string().optional(),
					customFieldName: z.string(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contact.contactCustomerNumberAvailabilityCheck': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					customerNumber: z.string().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contact.getContacts': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					depth: z.union([z.literal('0'), z.literal('1')]).optional(),
					customerNumber: z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contact.createContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_Contact.optional(),
		})
		.strict(),
	'contact.getContactById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contact.updateContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ContactUpdate.optional(),
		})
		.strict(),
	'contact.deleteContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contact.getContactTabsItemCountById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactAddress.createContactAddress': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ContactAddress.optional(),
		})
		.strict(),
	'contactAddress.getContactAddresses': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactAddress.contactAddressId': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactAddressId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactAddress.updateContactAddress': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactAddressId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ContactAddressUpdate.optional(),
		})
		.strict(),
	'contactAddress.deleteContactAddress': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactAddressId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'communicationWay.getCommunicationWays': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'contact[id]': z.string().optional(),
					'contact[objectName]': z.string().optional(),
					type: z
						.union([
							z.literal('PHONE'),
							z.literal('EMAIL'),
							z.literal('WEB'),
							z.literal('MOBILE'),
						])
						.optional(),
					main: z.union([z.literal('0'), z.literal('1')]).optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'communicationWay.createCommunicationWay': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_CommunicationWay.optional(),
		})
		.strict(),
	'communicationWay.getCommunicationWayById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					communicationWayId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'communicationWay.deleteCommunicationWay': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					communicationWayId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'communicationWay.updateCommunicationWay': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					communicationWayId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_CommunicationWayUpdate.optional(),
		})
		.strict(),
	'communicationWay.getCommunicationWayKeys': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'accountingContact.getAccountingContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'contact[id]': z.string().optional(),
					'contact[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'accountingContact.createAccountingContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_AccountingContact.optional(),
		})
		.strict(),
	'accountingContact.getAccountingContactById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					accountingContactId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'accountingContact.updateAccountingContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					accountingContactId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_AccountingContactUpdate.optional(),
		})
		.strict(),
	'accountingContact.deleteAccountingContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					accountingContactId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.getPlaceholder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					objectName: z.union([
						z.literal('Invoice'),
						z.literal('CreditNote'),
						z.literal('Order'),
						z.literal('Contact'),
						z.literal('Letter'),
						z.literal('Email'),
					]),
					subObjectName: z
						.union([
							z.literal('Invoice'),
							z.literal('CreditNote'),
							z.literal('Order'),
							z.literal('Contact'),
							z.literal('Letter'),
						])
						.optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.getContactFields': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.createContactField': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ContactCustomField.optional(),
		})
		.strict(),
	'contactField.getContactFieldsById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactCustomFieldId: z.number(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.updateContactfield': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactCustomFieldId: z.number(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ContactCustomFieldUpdate.optional(),
		})
		.strict(),
	'contactField.deleteContactCustomFieldId': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactCustomFieldId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.getContactFieldSettings': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.createContactFieldSetting': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ContactCustomFieldSetting.optional(),
		})
		.strict(),
	'contactField.getContactFieldSettingById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactCustomFieldSettingId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.updateContactFieldSetting': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactCustomFieldSettingId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ContactCustomFieldSettingUpdate.optional(),
		})
		.strict(),
	'contactField.deleteContactFieldSetting': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactCustomFieldSettingId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'contactField.getReferenceCount': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					contactCustomFieldSettingId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.getCreditNotes': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					status: z
						.union([
							z.literal('100'),
							z.literal('200'),
							z.literal('300'),
							z.literal('500'),
							z.literal('750'),
							z.literal('1000'),
						])
						.optional(),
					creditNoteNumber: z.string().optional(),
					startDate: z.number().int().optional(),
					endDate: z.number().int().optional(),
					'contact[id]': z.number().int().optional(),
					'contact[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.createcreditNote': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_saveCreditNote.optional(),
		})
		.strict(),
	'creditNote.createCreditNoteFromInvoice': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					invoice: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'creditNote.createCreditNoteFromVoucher': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					voucher: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'creditNote.getcreditNoteById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.updatecreditNote': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_creditNoteUpdate.optional(),
		})
		.strict(),
	'creditNote.deletecreditNote': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.sendCreditNoteByPrinting': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					sendType: z.string(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.creditNoteSendBy': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					sendType: z.union([
						z.literal('VPR'),
						z.literal('VP'),
						z.literal('VM'),
						z.literal('VPDF'),
					]),
					sendDraft: z.boolean(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'creditNote.creditNoteEnshrine': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.creditNoteGetPdf': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					download: z.boolean().optional(),
					preventSendBy: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.sendCreditNoteViaEMail': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					toEmail: z.string(),
					subject: z.string(),
					text: z.string(),
					copy: z.boolean().optional(),
					additionalAttachments: z.string().optional(),
					ccEmail: z.string().optional(),
					bccEmail: z.string().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'creditNote.bookCreditNote': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					amount: z.number(),
					date: z.number().int(),
					type: z.union([
						z.literal('FULL_PAYMENT'),
						z.literal('N'),
						z.literal('CB'),
						z.literal('CF'),
						z.literal('O'),
						z.literal('OF'),
						z.literal('MTC'),
					]),
					checkAccount: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict(),
					checkAccountTransaction: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict()
						.optional(),
					createFeed: z.boolean().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'creditNote.creditNoteResetToOpen': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNote.creditNoteResetToDraft': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'creditNotePos.getcreditNotePositions': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'creditNote[id]': z.number().int().optional(),
					'creditNote[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.updateExportConfig': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					SevClientId: z.number(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					accountantNumber: z.number(),
					accountantClientNumber: z.number(),
					accountingYearBegin: z.number(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'export.exportDatevDepricated': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					Download: z.boolean().optional(),
					startDate: z.number().int(),
					endDate: z.number().int(),
					scope: z.string(),
					withUnpaidDocuments: z.boolean().optional(),
					withEnshrinedDocuments: z.boolean().optional(),
					enshrine: z.boolean().optional(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportDatevCSV': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					startDate: z.number().int(),
					endDate: z.number().int(),
					scope: z.string(),
					exportByPaydate: z.boolean().optional(),
					includeEnshrined: z.boolean().optional(),
					enshrineDocuments: z.boolean().optional(),
					includeDocumentImages: z.boolean().optional(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportDatevXML': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					startDate: z.number().int(),
					endDate: z.number().int(),
					scope: z.string(),
					exportByPaydate: z.boolean().optional(),
					includeEnshrined: z.boolean().optional(),
					includeExportedDocuments: z.boolean().optional(),
					includeDocumentXml: z.boolean().optional(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.generateDownloadHash': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					jobId: z.string(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.getProgress': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					hash: z.string(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.jobDownloadInfo': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					jobId: z.string(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportInvoice': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									invoiceType: z
										.array(
											z.union([
												z.literal('Re'),
												z.literal('SR'),
												z.literal('TR'),
												z.literal('AR'),
												z.literal('ER'),
												z.literal('WKR'),
												z.literal('MA'),
											]),
										)
										.optional(),
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportInvoiceZip': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									invoiceType: z
										.array(
											z.union([
												z.literal('Re'),
												z.literal('SR'),
												z.literal('TR'),
												z.literal('AR'),
												z.literal('ER'),
												z.literal('WKR'),
												z.literal('MA'),
											]),
										)
										.optional(),
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportCreditNote': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportVoucher': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									startPayDate: z.string().optional(),
									endPayDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportTransactions': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									paymtPurpose: z.string().optional(),
									name: z.string().optional(),
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
									checkAccount: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportVoucherZip': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									startPayDate: z.string().optional(),
									endPayDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'export.exportContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									zip: z.number().int().optional(),
									city: z.string().optional(),
									country: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									depth: z.boolean().optional(),
									onlyPeople: z.boolean().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'part.getParts': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					partNumber: z.string().optional(),
					name: z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'part.createPart': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_Part.optional(),
		})
		.strict(),
	'part.getPartById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					partId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'part.updatePart': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					partId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_PartUpdate.optional(),
		})
		.strict(),
	'part.partGetStock': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					partId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.getInvoices': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					status: z
						.union([z.literal(100), z.literal(200), z.literal(1000)])
						.optional(),
					invoiceNumber: z.string().optional(),
					startDate: z.number().int().optional(),
					endDate: z.number().int().optional(),
					'contact[id]': z.number().int().optional(),
					'contact[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.createInvoiceByFactory': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_saveInvoice.optional(),
		})
		.strict(),
	'invoice.getInvoiceById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.getInvoicePositionsById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					limit: z.number().int().optional(),
					offset: z.number().int().optional(),
					embed: z.array(z.string()).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.createInvoiceFromOrder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_CreateInvoiceFromOrder.optional(),
		})
		.strict(),
	'invoice.createInvoiceReminder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'invoice[id]': z.number().int(),
					'invoice[objectName]': z.string(),
				})
				.strict(),
			body: z
				.object({
					invoice: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'invoice.getIsInvoicePartiallyPaid': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.cancelInvoice': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.invoiceRender': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					forceReload: z.boolean().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'invoice.sendInvoiceViaEMail': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					toEmail: z.string(),
					subject: z.string(),
					text: z.string(),
					copy: z.boolean().optional(),
					additionalAttachments: z.string().optional(),
					ccEmail: z.string().optional(),
					bccEmail: z.string().optional(),
					sendXml: z.boolean().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'invoice.invoiceGetPdf': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					download: z.boolean().optional(),
					preventSendBy: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.invoiceSendBy': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					sendType: z.union([
						z.literal('VPR'),
						z.literal('VP'),
						z.literal('VM'),
						z.literal('VPDF'),
					]),
					sendDraft: z.boolean(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'invoice.invoiceEnshrine': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.bookInvoice': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					amount: z.number(),
					date: z.number().int(),
					type: z.union([
						z.literal('FULL_PAYMENT'),
						z.literal('N'),
						z.literal('CB'),
						z.literal('CF'),
						z.literal('O'),
						z.literal('OF'),
						z.literal('MTC'),
					]),
					checkAccount: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict(),
					checkAccountTransaction: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict()
						.optional(),
					createFeed: z.boolean().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'invoice.invoiceResetToOpen': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoice.invoiceResetToDraft': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'invoicePos.getInvoicePos': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					id: z.number().optional(),
					'invoice[id]': z.number().optional(),
					'invoice[objectName]': z.string().optional(),
					'part[id]': z.number().optional(),
					'part[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'layout.getLetterpapersWithThumb': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'layout.getTemplates': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					type: z
						.union([
							z.literal('Invoice'),
							z.literal('invoicereminder'),
							z.literal('Order'),
							z.literal('Contractnote'),
							z.literal('Packinglist'),
							z.literal('Letter'),
							z.literal('Creditnote'),
						])
						.optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'layout.updateInvoiceTemplate': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					invoiceId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ChangeLayout.optional(),
		})
		.strict(),
	'layout.updateOrderTemplate': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ChangeLayout.optional(),
		})
		.strict(),
	'layout.updateCreditNoteTemplate': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					creditNoteId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_ChangeLayout.optional(),
		})
		.strict(),
	'order.getOrders': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					status: z
						.union([
							z.literal(100),
							z.literal(200),
							z.literal(300),
							z.literal(500),
							z.literal(750),
							z.literal(1000),
						])
						.optional(),
					orderNumber: z.string().optional(),
					startDate: z.number().int().optional(),
					endDate: z.number().int().optional(),
					'contact[id]': z.number().int().optional(),
					'contact[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'order.createOrder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_saveOrder.optional(),
		})
		.strict(),
	'order.getOrderById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'order.updateOrder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_OrderUpdate.optional(),
		})
		.strict(),
	'order.deleteOrder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'order.getOrderPositionsById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					limit: z.number().int().optional(),
					offset: z.number().int().optional(),
					embed: z.array(z.string()).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'order.getDiscounts': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					limit: z.number().int().optional(),
					offset: z.number().int().optional(),
					embed: z.array(z.string()).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'order.getRelatedObjects': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					includeItself: z.boolean().optional(),
					sortByType: z.boolean().optional(),
					embed: z.array(z.string()).optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'order.sendorderViaEMail': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					toEmail: z.string(),
					subject: z.string(),
					text: z.string(),
					copy: z.boolean().optional(),
					additionalAttachments: z.string().optional(),
					ccEmail: z.string().optional(),
					bccEmail: z.string().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'order.createPackingListFromOrder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'order[id]': z.number().int(),
					'order[objectName]': z.string(),
				})
				.strict(),
			body: requestComponent_Model_CreatePackingListFromOrder.optional(),
		})
		.strict(),
	'order.createContractNoteFromOrder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'order[id]': z.number().int(),
					'order[objectName]': z.string(),
				})
				.strict(),
			body: requestComponent_Model_CreatePackingListFromOrder.optional(),
		})
		.strict(),
	'order.orderGetPdf': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z
				.object({
					download: z.boolean().optional(),
					preventSendBy: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'order.orderSendBy': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					sendType: z.union([
						z.literal('VPR'),
						z.literal('VP'),
						z.literal('VM'),
						z.literal('VPDF'),
					]),
					sendDraft: z.boolean(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'orderPos.getOrderPositions': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'order[id]': z.number().int().optional(),
					'order[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'orderPos.getOrderPositionById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderPosId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'orderPos.updateOrderPosition': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderPosId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_OrderPosUpdate.optional(),
		})
		.strict(),
	'orderPos.deleteOrderPos': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					orderPosId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.voucherFactorySaveVoucher': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: requestComponent_saveVoucher.optional(),
		})
		.strict(),
	'voucher.getVouchers': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					status: z
						.union([z.literal(50), z.literal(100), z.literal(1000)])
						.optional(),
					creditDebit: z.union([z.literal('C'), z.literal('D')]).optional(),
					descriptionLike: z.string().optional(),
					startDate: z.number().int().optional(),
					endDate: z.number().int().optional(),
					'contact[id]': z.number().int().optional(),
					'contact[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.getVoucherById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					voucherId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.updateVoucher': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					voucherId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: requestComponent_Model_VoucherUpdate.optional(),
		})
		.strict(),
	'voucher.voucherEnshrine': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					voucherId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.bookVoucher': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					voucherId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					amount: z.number(),
					date: z.string(),
					type: z.union([
						z.literal('FULL_PAYMENT'),
						z.literal('N'),
						z.literal('CB'),
						z.literal('CF'),
						z.literal('O'),
						z.literal('OF'),
						z.literal('MTC'),
					]),
					checkAccount: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict(),
					checkAccountTransaction: z
						.object({
							id: z.number().int(),
							objectName: z.string(),
						})
						.strict()
						.optional(),
					createFeed: z.boolean().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'voucher.voucherResetToOpen': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					voucherId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.voucherResetToDraft': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					voucherId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucherPos.getVoucherPositions': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					'voucher[id]': z.number().int().optional(),
					'voucher[objectName]': z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.forAllAccounts': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.forAccountNumber': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					accountNumber: z.number().int(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.forTaxRule': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					taxRule: z.string(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.forRevenue': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'voucher.forExpense': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'report.reportInvoice': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					view: z.string(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									invoiceType: z
										.array(
											z.union([
												z.literal('Re'),
												z.literal('SR'),
												z.literal('TR'),
												z.literal('AR'),
												z.literal('ER'),
												z.literal('WKR'),
												z.literal('MA'),
											]),
										)
										.optional(),
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'report.reportOrder': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					view: z.string(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									orderType: z
										.union([z.literal('AN'), z.literal('AB'), z.literal('LI')])
										.optional(),
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'report.reportContact': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									zip: z.number().int().optional(),
									city: z.string().optional(),
									country: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									depth: z.boolean().optional(),
									onlyPeople: z.boolean().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'report.reportVoucher': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					download: z.boolean().optional(),
					sevQuery: z
						.object({
							limit: z.number().int().optional(),
							modelName: z.json(),
							objectName: z.json(),
							filter: z
								.object({
									startDate: z.string().optional(),
									endDate: z.string().optional(),
									startPayDate: z.string().optional(),
									endPayDate: z.string().optional(),
									contact: z
										.object({
											id: z.number().int(),
											objectName: z.string(),
										})
										.strict()
										.optional(),
									startAmount: z.number().int().optional(),
									endAmount: z.number().int().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				})
				.strict(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'tag.getTags': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					id: z.number().optional(),
					name: z.string().optional(),
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'tag.getTagById': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					tagId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'tag.updateTag': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					tagId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					name: z.string().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tag.deleteTag': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z
				.object({
					tagId: z.number().int(),
				})
				.strict(),
			query: z.object({}).strict().optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
	'tag.createTag': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z.object({}).strict().optional(),
			body: z
				.object({
					name: z.string().optional(),
					object: z
						.object({
							id: z.number().int(),
							objectName: z.union([
								z.literal('Invoice'),
								z.literal('Voucher'),
								z.literal('Order'),
								z.literal('CreditNote'),
							]),
						})
						.strict(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tag.getTagRelations': z
		.object({
			resourceVersion: z
				.string()
				.regex(/^(?:default|\d+\.\d+)$/u)
				.optional(),
			path: z.object({}).strict().optional(),
			query: z
				.object({
					limit: z.number().int().min(1).max(1000).optional(),
					offset: z.number().int().min(0).optional(),
					countAll: z.boolean().optional(),
				})
				.strict()
				.optional(),
			body: z.object({}).strict().optional(),
		})
		.strict(),
} as const;

export const SevdeskEndpointOutputSchemas = {
	'basics.bookkeepingSystemVersion': z
		.object({
			objects: z
				.object({
					version: z.union([z.literal('1.0'), z.literal('2.0')]).optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'checkAccount.getCheckAccounts': z
		.object({
			objects: z.array(responseComponent_Model_CheckAccountResponse).optional(),
		})
		.passthrough(),
	'checkAccount.createFileImportAccount': z
		.object({
			objects: responseComponent_createFileImportAccountResponse.optional(),
		})
		.passthrough(),
	'checkAccount.createClearingAccount': z
		.object({
			objects: responseComponent_createClearingAccountResponse.optional(),
		})
		.passthrough(),
	'checkAccount.getCheckAccountById': z
		.object({
			objects: z.array(responseComponent_Model_CheckAccountResponse).optional(),
		})
		.passthrough(),
	'checkAccount.updateCheckAccount':
		responseComponent_Model_CheckAccountResponse,
	'checkAccount.deleteCheckAccount': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'checkAccount.getBalanceAtDate': z
		.object({
			objects: z.string().optional(),
		})
		.passthrough(),
	'checkAccountTransaction.getTransactions': z
		.object({
			objects: z
				.array(responseComponent_Model_CheckAccountTransactionResponse)
				.optional(),
		})
		.passthrough(),
	'checkAccountTransaction.createTransaction':
		responseComponent_Model_CheckAccountTransactionResponse,
	'checkAccountTransaction.getCheckAccountTransactionById': z
		.object({
			objects: z
				.array(responseComponent_Model_CheckAccountTransactionResponse)
				.optional(),
		})
		.passthrough(),
	'checkAccountTransaction.updateCheckAccountTransaction':
		responseComponent_Model_CheckAccountTransactionResponse,
	'checkAccountTransaction.deleteCheckAccountTransaction': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'checkAccountTransaction.checkAccountTransactionEnshrine': z
		.object({
			objects: z.json().optional(),
		})
		.passthrough(),
	'privateTransactionRule.listPrivateTransactionRules': z
		.object({
			objects: z
				.array(responseComponent_Model_PrivateTransactionRuleResponse)
				.optional(),
		})
		.passthrough(),
	'privateTransactionRule.createPrivateTransactionRule':
		responseComponent_Model_PrivateTransactionRuleResponse,
	'privateTransactionRule.deletePrivateTransactionRule': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'contact.getNextCustomerNumber': z
		.object({
			objects: z.string().optional(),
		})
		.passthrough(),
	'contact.findContactsByCustomFieldValue': z
		.object({
			objects: z.array(responseComponent_Model_ContactResponse).optional(),
		})
		.passthrough(),
	'contact.contactCustomerNumberAvailabilityCheck': z
		.object({
			objects: z.boolean().optional(),
		})
		.passthrough(),
	'contact.getContacts': z
		.object({
			objects: z.array(responseComponent_Model_ContactResponse).optional(),
		})
		.passthrough(),
	'contact.createContact': responseComponent_Model_ContactResponse,
	'contact.getContactById': z
		.object({
			objects: z.array(responseComponent_Model_ContactResponse).optional(),
		})
		.passthrough(),
	'contact.updateContact': responseComponent_Model_ContactResponse,
	'contact.deleteContact': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'contact.getContactTabsItemCountById': z
		.object({
			orders: z.number().optional(),
			invoices: z.number().optional(),
			creditNotes: z.number().optional(),
			documents: z.number().optional(),
			persons: z.number().optional(),
			vouchers: z.number().optional(),
			letters: z.number().optional(),
			parts: z.string().optional(),
			invoicePos: z.number().optional(),
		})
		.passthrough(),
	'contactAddress.createContactAddress':
		responseComponent_Model_ContactAddressResponse,
	'contactAddress.getContactAddresses': z
		.object({
			objects: z
				.array(responseComponent_Model_ContactAddressResponse)
				.optional(),
		})
		.passthrough(),
	'contactAddress.contactAddressId': z
		.object({
			objects: z
				.array(responseComponent_Model_ContactAddressResponse)
				.optional(),
		})
		.passthrough(),
	'contactAddress.updateContactAddress':
		responseComponent_Model_ContactAddressResponse,
	'contactAddress.deleteContactAddress': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'communicationWay.getCommunicationWays': z
		.object({
			objects: z
				.array(responseComponent_Model_CommunicationWayResponse)
				.optional(),
		})
		.passthrough(),
	'communicationWay.createCommunicationWay':
		responseComponent_Model_CommunicationWayResponse,
	'communicationWay.getCommunicationWayById': z
		.object({
			objects: z
				.array(responseComponent_Model_CommunicationWayResponse)
				.optional(),
		})
		.passthrough(),
	'communicationWay.deleteCommunicationWay': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'communicationWay.updateCommunicationWay':
		responseComponent_Model_CommunicationWayResponse,
	'communicationWay.getCommunicationWayKeys': z
		.object({
			objects: z
				.array(
					z
						.object({
							id: z.string().optional(),
							objectName: z.string().optional(),
							create: z.string().optional(),
							upadate: z.string().optional(),
							name: z
								.union([
									z.literal('Arbeit'),
									z.literal('Autobox'),
									z.literal('Fax'),
									z.literal('Mobil'),
									z.literal('Newsletter'),
									z.literal('Privat'),
									z.literal('Rechnungsadresse'),
									z.literal(' '),
								])
								.optional(),
							translationCode: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'accountingContact.getAccountingContact': z
		.object({
			objects: z
				.array(responseComponent_Model_AccountingContactResponse)
				.optional(),
		})
		.passthrough(),
	'accountingContact.createAccountingContact':
		responseComponent_Model_AccountingContactResponse,
	'accountingContact.getAccountingContactById': z
		.object({
			objects: z
				.array(responseComponent_Model_AccountingContactResponse)
				.optional(),
		})
		.passthrough(),
	'accountingContact.updateAccountingContact':
		responseComponent_Model_AccountingContactResponse,
	'accountingContact.deleteAccountingContact': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'contactField.getPlaceholder': z
		.object({
			objects: z
				.array(
					responseComponent_Model_Textparser_fetchDictionaryEntriesByType_response,
				)
				.optional(),
		})
		.passthrough(),
	'contactField.getContactFields': z
		.object({
			objects: z
				.array(responseComponent_Model_ContactCustomFieldResponse)
				.optional(),
		})
		.passthrough(),
	'contactField.createContactField':
		responseComponent_Model_ContactCustomFieldResponse,
	'contactField.getContactFieldsById': z
		.object({
			objects: z
				.array(responseComponent_Model_ContactCustomFieldResponse)
				.optional(),
		})
		.passthrough(),
	'contactField.updateContactfield':
		responseComponent_Model_ContactCustomFieldResponse,
	'contactField.deleteContactCustomFieldId': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'contactField.getContactFieldSettings': z
		.object({
			objects: z
				.array(responseComponent_Model_ContactCustomFieldSettingResponse)
				.optional(),
		})
		.passthrough(),
	'contactField.createContactFieldSetting': z
		.object({
			objects: z
				.array(responseComponent_Model_ContactCustomFieldSettingResponse)
				.optional(),
		})
		.passthrough(),
	'contactField.getContactFieldSettingById': z
		.object({
			objects: z
				.array(responseComponent_Model_ContactCustomFieldSettingResponse)
				.optional(),
		})
		.passthrough(),
	'contactField.updateContactFieldSetting':
		responseComponent_Model_ContactCustomFieldSettingResponse,
	'contactField.deleteContactFieldSetting': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'contactField.getReferenceCount': z
		.object({
			objects: z.number().int().optional(),
		})
		.passthrough(),
	'creditNote.getCreditNotes': z
		.object({
			objects: z.array(responseComponent_Model_creditNoteResponse).optional(),
		})
		.passthrough(),
	'creditNote.createcreditNote': responseComponent_saveCreditNoteResponse,
	'creditNote.createCreditNoteFromInvoice': z
		.object({
			objects: z
				.object({
					creditNote: responseComponent_Model_creditNoteResponse.optional(),
					creditNotePos: z
						.array(responseComponent_Model_creditNotePosResponse)
						.optional(),
					discount: z
						.array(responseComponent_Model_discountsResponse)
						.optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'creditNote.createCreditNoteFromVoucher': z
		.object({
			objects: z
				.object({
					creditNote: responseComponent_Model_creditNoteResponse.optional(),
					creditNotePos: z
						.array(responseComponent_Model_creditNotePosResponse)
						.optional(),
					discount: z
						.array(responseComponent_Model_discountsResponse)
						.optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'creditNote.getcreditNoteById': z
		.object({
			objects: z.array(responseComponent_Model_creditNoteResponse).optional(),
		})
		.passthrough(),
	'creditNote.updatecreditNote': responseComponent_Model_creditNoteResponse,
	'creditNote.deletecreditNote': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'creditNote.sendCreditNoteByPrinting':
		responseComponent_Model_CreditNote_sendByWithRender,
	'creditNote.creditNoteSendBy': responseComponent_Model_creditNoteResponse,
	'creditNote.creditNoteEnshrine': z
		.object({
			objects: z.json().optional(),
		})
		.passthrough(),
	'creditNote.creditNoteGetPdf': z
		.object({
			filename: z.string().optional(),
			mimeType: z.string().optional(),
			base64encoded: z.boolean().optional(),
			content: z.string().optional(),
		})
		.passthrough(),
	'creditNote.sendCreditNoteViaEMail': z
		.object({
			objects: z
				.array(responseComponent_Model_creditNote_mailResponse)
				.optional(),
		})
		.passthrough(),
	'creditNote.bookCreditNote': z
		.object({
			id: z.string().optional(),
			objectName: z.string().optional(),
			additionalInformation: z.string().optional(),
			create: z.string().optional(),
			creditNote: z
				.object({
					id: z.number().int(),
					objectName: z.string(),
				})
				.passthrough()
				.optional(),
			fromStatus: z.string().optional(),
			toStatus: z.string().optional(),
			ammountPayed: z.string().optional(),
			bookingDate: z.string().optional(),
			sevClient: z
				.object({
					id: z.number().int(),
					objectName: z.string(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'creditNote.creditNoteResetToOpen': z
		.object({
			objects: z
				.intersection(
					responseComponent_Model_creditNoteResponse,
					z
						.object({
							status: z.json().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'creditNote.creditNoteResetToDraft': z
		.object({
			objects: z
				.intersection(
					responseComponent_Model_creditNoteResponse,
					z
						.object({
							taxText: z.json().optional(),
							customerInternalNote: z.json().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'creditNotePos.getcreditNotePositions': z
		.object({
			objects: z
				.array(responseComponent_Model_creditNotePosResponse)
				.optional(),
		})
		.passthrough(),
	'export.updateExportConfig': z
		.object({
			objects: z.json().optional(),
		})
		.passthrough(),
	'export.exportDatevDepricated': z.record(z.string(), z.json()),
	'export.exportDatevCSV': z
		.object({
			objects: z.string().optional(),
		})
		.passthrough(),
	'export.exportDatevXML': z
		.object({
			objects: z.string().optional(),
		})
		.passthrough(),
	'export.generateDownloadHash': z
		.object({
			objects: z.array(responseComponent_Export_Progress_Data).optional(),
		})
		.passthrough(),
	'export.getProgress': z
		.object({
			objects: z.array(responseComponent_Export_Progress_Data).optional(),
		})
		.passthrough(),
	'export.jobDownloadInfo': z
		.object({
			objects: z.array(responseComponent_Export_Job_Download_Info).optional(),
		})
		.passthrough(),
	'export.exportInvoice': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'export.exportInvoiceZip': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'export.exportCreditNote': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'export.exportVoucher': z
		.object({
			filename: z.string().optional(),
			mimetype: z.string().optional(),
			base64Encoded: z.boolean().optional(),
			content: z.string().optional(),
		})
		.passthrough(),
	'export.exportTransactions': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'export.exportVoucherZip': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'export.exportContact': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'part.getParts': z
		.object({
			objects: z.array(responseComponent_Model_Part).optional(),
		})
		.passthrough(),
	'part.createPart': responseComponent_Model_Part,
	'part.getPartById': z
		.object({
			objects: z.array(responseComponent_Model_Part).optional(),
		})
		.passthrough(),
	'part.updatePart': responseComponent_Model_Part,
	'part.partGetStock': z
		.object({
			objects: z.number().int().optional(),
		})
		.passthrough(),
	'invoice.getInvoices': z
		.object({
			objects: z.array(responseComponent_Model_InvoiceResponse).optional(),
		})
		.passthrough(),
	'invoice.createInvoiceByFactory': responseComponent_saveInvoiceResponse,
	'invoice.getInvoiceById': z
		.object({
			objects: z.array(responseComponent_Model_InvoiceResponse).optional(),
		})
		.passthrough(),
	'invoice.getInvoicePositionsById': z
		.object({
			objects: z.array(responseComponent_Model_InvoicePosResponse).optional(),
		})
		.passthrough(),
	'invoice.createInvoiceFromOrder': responseComponent_Model_InvoiceResponse,
	'invoice.createInvoiceReminder': responseComponent_Model_InvoiceResponse,
	'invoice.getIsInvoicePartiallyPaid': z
		.object({
			objects: z.boolean().optional(),
		})
		.passthrough(),
	'invoice.cancelInvoice': responseComponent_Model_InvoiceResponse,
	'invoice.invoiceRender': z
		.object({
			pdf: z.string().optional(),
			docId: z.string().optional(),
			parameters: z
				.array(
					z
						.object({
							key: z.string().optional(),
							name: z.string().optional(),
							values: z
								.array(
									z
										.object({
											name: z.string().optional(),
											translationCade: z.string().optional(),
											value: z.string().optional(),
										})
										.passthrough(),
								)
								.optional(),
							visible: z.boolean().optional(),
							value: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'invoice.sendInvoiceViaEMail': responseComponent_Model_Email,
	'invoice.invoiceGetPdf': z
		.object({
			filename: z.string().optional(),
			mimeType: z.string().optional(),
			base64encoded: z.boolean().optional(),
			content: z.string().optional(),
		})
		.passthrough(),
	'invoice.invoiceSendBy': responseComponent_Model_InvoiceResponse,
	'invoice.invoiceEnshrine': z
		.object({
			objects: z.json().optional(),
		})
		.passthrough(),
	'invoice.bookInvoice': z
		.object({
			id: z.string().optional(),
			objectName: z.string().optional(),
			additionalInformation: z.string().optional(),
			create: z.string().optional(),
			creditNote: z
				.object({
					id: z.number().int(),
					objectName: z.string(),
				})
				.passthrough()
				.optional(),
			fromStatus: z.string().optional(),
			toStatus: z.string().optional(),
			ammountPayed: z.string().optional(),
			bookingDate: z.string().optional(),
			sevClient: z
				.object({
					id: z.number().int(),
					objectName: z.string(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'invoice.invoiceResetToOpen': z
		.object({
			objects: z
				.intersection(
					responseComponent_Model_InvoiceResponse,
					z
						.object({
							status: z.json().optional(),
							payDate: z.json().optional(),
							enshrined: z.json().optional(),
							accountIntervall: z.json().optional(),
							accountNextInvoice: z.json().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'invoice.invoiceResetToDraft': z
		.object({
			objects: z
				.intersection(
					responseComponent_Model_InvoiceResponse,
					z
						.object({
							payDate: z.json().optional(),
							enshrined: z.json().optional(),
							accountIntervall: z.json().optional(),
							accountNextInvoice: z.json().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'invoicePos.getInvoicePos': z
		.object({
			objects: z.array(responseComponent_Model_InvoicePosResponse).optional(),
		})
		.passthrough(),
	'layout.getLetterpapersWithThumb': z
		.object({
			result: z.string().optional(),
			letterpapers: z
				.array(
					z
						.object({
							id: z.string().optional(),
							pdf: z.string().optional(),
							sevClient: z.string().optional(),
							name: z.string().optional(),
							default: z.number().int().optional(),
							img: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'layout.getTemplates': z
		.object({
			result: z.string().optional(),
			templates: z
				.array(
					z
						.object({
							id: z.string().optional(),
							name: z.string().optional(),
							translationCode: z.string().optional(),
							sevClient: z.string().optional(),
							type: z.string().optional(),
							html: z.string().optional(),
							default: z.number().int().optional(),
							premium: z.boolean().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'layout.updateInvoiceTemplate': responseComponent_Model_ChangeLayoutResponse,
	'layout.updateOrderTemplate': responseComponent_Model_ChangeLayoutResponse,
	'layout.updateCreditNoteTemplate':
		responseComponent_Model_ChangeLayoutResponse,
	'order.getOrders': z
		.object({
			objects: z.array(responseComponent_Model_OrderResponse).optional(),
		})
		.passthrough(),
	'order.createOrder': responseComponent_saveOrderResponse,
	'order.getOrderById': z
		.object({
			objects: z.array(responseComponent_Model_OrderResponse).optional(),
		})
		.passthrough(),
	'order.updateOrder': responseComponent_Model_OrderResponse,
	'order.deleteOrder': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'order.getOrderPositionsById': z
		.object({
			objects: z.array(responseComponent_Model_OrderPosResponse).optional(),
		})
		.passthrough(),
	'order.getDiscounts': z
		.object({
			objects: z.array(responseComponent_Model_Discount).optional(),
		})
		.passthrough(),
	'order.getRelatedObjects': z
		.object({
			objects: z.array(responseComponent_Model_OrderPosResponse).optional(),
		})
		.passthrough(),
	'order.sendorderViaEMail': z
		.object({
			objects: z.array(responseComponent_Model_EmailOrder).optional(),
		})
		.passthrough(),
	'order.createPackingListFromOrder': responseComponent_Model_OrderResponse,
	'order.createContractNoteFromOrder': responseComponent_Model_OrderResponse,
	'order.orderGetPdf': z
		.object({
			filename: z.string().optional(),
			mimeType: z.string().optional(),
			base64encoded: z.boolean().optional(),
			content: z.string().optional(),
		})
		.passthrough(),
	'order.orderSendBy': responseComponent_Model_OrderResponse,
	'orderPos.getOrderPositions': z
		.object({
			objects: z.array(responseComponent_Model_OrderPosResponse).optional(),
		})
		.passthrough(),
	'orderPos.getOrderPositionById': z
		.object({
			objects: z.array(responseComponent_Model_OrderPosResponse).optional(),
		})
		.passthrough(),
	'orderPos.updateOrderPosition': responseComponent_Model_OrderPosResponse,
	'orderPos.deleteOrderPos': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'voucher.voucherFactorySaveVoucher': responseComponent_saveVoucherResponse,
	'voucher.getVouchers': z
		.object({
			objects: z.array(responseComponent_Model_VoucherResponse).optional(),
		})
		.passthrough(),
	'voucher.getVoucherById': z
		.object({
			objects: z.array(responseComponent_Model_VoucherResponse).optional(),
		})
		.passthrough(),
	'voucher.updateVoucher': responseComponent_Model_VoucherResponse,
	'voucher.voucherEnshrine': z
		.object({
			objects: z.json().optional(),
		})
		.passthrough(),
	'voucher.bookVoucher': z
		.object({
			id: z.string().optional(),
			objectName: z.string().optional(),
			create: z.string().optional(),
			voucher: z
				.object({
					id: z.number().int(),
					objectName: z.string(),
				})
				.passthrough()
				.optional(),
			fromStatus: z.string().optional(),
			toStatus: z.string().optional(),
			amountPayed: z.string().optional(),
			bookingDate: z.string().optional(),
			sevClient: z
				.object({
					id: z.number().int(),
					objectName: z.string(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'voucher.voucherResetToOpen': z
		.object({
			objects: z
				.intersection(
					responseComponent_Model_VoucherResponse,
					z
						.object({
							status: z.json().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'voucher.voucherResetToDraft': z
		.object({
			objects: z
				.intersection(
					responseComponent_Model_VoucherResponse,
					z
						.object({
							status: z.json().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	'voucherPos.getVoucherPositions': z
		.object({
			objects: z.array(responseComponent_Model_VoucherPosResponse).optional(),
		})
		.passthrough(),
	'voucher.forAllAccounts': z
		.object({
			objects: z.array(responseComponent_ReceiptGuideDto).optional(),
		})
		.passthrough(),
	'voucher.forAccountNumber': z
		.object({
			objects: z.array(responseComponent_ReceiptGuideDto).optional(),
		})
		.passthrough(),
	'voucher.forTaxRule': z
		.object({
			objects: z.array(responseComponent_ReceiptGuideDto).optional(),
		})
		.passthrough(),
	'voucher.forRevenue': z
		.object({
			objects: z.array(responseComponent_ReceiptGuideDto).optional(),
		})
		.passthrough(),
	'voucher.forExpense': z
		.object({
			objects: z.array(responseComponent_ReceiptGuideDto).optional(),
		})
		.passthrough(),
	'report.reportInvoice': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'report.reportOrder': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'report.reportContact': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'report.reportVoucher': z
		.object({
			objects: z
				.object({
					filename: z.string().optional(),
					mimetype: z.string().optional(),
					base64Encoded: z.boolean().optional(),
					content: z.string().optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	'tag.getTags': z
		.object({
			objects: z.array(responseComponent_Model_TagResponse).optional(),
		})
		.passthrough(),
	'tag.getTagById': z
		.object({
			objects: z.array(responseComponent_Model_TagResponse).optional(),
		})
		.passthrough(),
	'tag.updateTag': responseComponent_Model_TagResponse,
	'tag.deleteTag': z
		.object({
			objects: z.array(z.json()).optional(),
		})
		.passthrough(),
	'tag.createTag': responseComponent_Model_TagCreateResponse,
	'tag.getTagRelations': z
		.object({
			objects: z.array(responseComponent_Model_TagCreateResponse).optional(),
		})
		.passthrough(),
} as const;

export type SevdeskEndpointInputs = {
	'basics.bookkeepingSystemVersion': z.infer<
		(typeof SevdeskEndpointInputSchemas)['basics.bookkeepingSystemVersion']
	>;
	'checkAccount.getCheckAccounts': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccount.getCheckAccounts']
	>;
	'checkAccount.createFileImportAccount': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccount.createFileImportAccount']
	>;
	'checkAccount.createClearingAccount': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccount.createClearingAccount']
	>;
	'checkAccount.getCheckAccountById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccount.getCheckAccountById']
	>;
	'checkAccount.updateCheckAccount': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccount.updateCheckAccount']
	>;
	'checkAccount.deleteCheckAccount': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccount.deleteCheckAccount']
	>;
	'checkAccount.getBalanceAtDate': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccount.getBalanceAtDate']
	>;
	'checkAccountTransaction.getTransactions': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccountTransaction.getTransactions']
	>;
	'checkAccountTransaction.createTransaction': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccountTransaction.createTransaction']
	>;
	'checkAccountTransaction.getCheckAccountTransactionById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccountTransaction.getCheckAccountTransactionById']
	>;
	'checkAccountTransaction.updateCheckAccountTransaction': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccountTransaction.updateCheckAccountTransaction']
	>;
	'checkAccountTransaction.deleteCheckAccountTransaction': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccountTransaction.deleteCheckAccountTransaction']
	>;
	'checkAccountTransaction.checkAccountTransactionEnshrine': z.infer<
		(typeof SevdeskEndpointInputSchemas)['checkAccountTransaction.checkAccountTransactionEnshrine']
	>;
	'privateTransactionRule.listPrivateTransactionRules': z.infer<
		(typeof SevdeskEndpointInputSchemas)['privateTransactionRule.listPrivateTransactionRules']
	>;
	'privateTransactionRule.createPrivateTransactionRule': z.infer<
		(typeof SevdeskEndpointInputSchemas)['privateTransactionRule.createPrivateTransactionRule']
	>;
	'privateTransactionRule.deletePrivateTransactionRule': z.infer<
		(typeof SevdeskEndpointInputSchemas)['privateTransactionRule.deletePrivateTransactionRule']
	>;
	'contact.getNextCustomerNumber': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.getNextCustomerNumber']
	>;
	'contact.findContactsByCustomFieldValue': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.findContactsByCustomFieldValue']
	>;
	'contact.contactCustomerNumberAvailabilityCheck': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.contactCustomerNumberAvailabilityCheck']
	>;
	'contact.getContacts': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.getContacts']
	>;
	'contact.createContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.createContact']
	>;
	'contact.getContactById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.getContactById']
	>;
	'contact.updateContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.updateContact']
	>;
	'contact.deleteContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.deleteContact']
	>;
	'contact.getContactTabsItemCountById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contact.getContactTabsItemCountById']
	>;
	'contactAddress.createContactAddress': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactAddress.createContactAddress']
	>;
	'contactAddress.getContactAddresses': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactAddress.getContactAddresses']
	>;
	'contactAddress.contactAddressId': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactAddress.contactAddressId']
	>;
	'contactAddress.updateContactAddress': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactAddress.updateContactAddress']
	>;
	'contactAddress.deleteContactAddress': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactAddress.deleteContactAddress']
	>;
	'communicationWay.getCommunicationWays': z.infer<
		(typeof SevdeskEndpointInputSchemas)['communicationWay.getCommunicationWays']
	>;
	'communicationWay.createCommunicationWay': z.infer<
		(typeof SevdeskEndpointInputSchemas)['communicationWay.createCommunicationWay']
	>;
	'communicationWay.getCommunicationWayById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['communicationWay.getCommunicationWayById']
	>;
	'communicationWay.deleteCommunicationWay': z.infer<
		(typeof SevdeskEndpointInputSchemas)['communicationWay.deleteCommunicationWay']
	>;
	'communicationWay.updateCommunicationWay': z.infer<
		(typeof SevdeskEndpointInputSchemas)['communicationWay.updateCommunicationWay']
	>;
	'communicationWay.getCommunicationWayKeys': z.infer<
		(typeof SevdeskEndpointInputSchemas)['communicationWay.getCommunicationWayKeys']
	>;
	'accountingContact.getAccountingContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['accountingContact.getAccountingContact']
	>;
	'accountingContact.createAccountingContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['accountingContact.createAccountingContact']
	>;
	'accountingContact.getAccountingContactById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['accountingContact.getAccountingContactById']
	>;
	'accountingContact.updateAccountingContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['accountingContact.updateAccountingContact']
	>;
	'accountingContact.deleteAccountingContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['accountingContact.deleteAccountingContact']
	>;
	'contactField.getPlaceholder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.getPlaceholder']
	>;
	'contactField.getContactFields': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.getContactFields']
	>;
	'contactField.createContactField': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.createContactField']
	>;
	'contactField.getContactFieldsById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.getContactFieldsById']
	>;
	'contactField.updateContactfield': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.updateContactfield']
	>;
	'contactField.deleteContactCustomFieldId': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.deleteContactCustomFieldId']
	>;
	'contactField.getContactFieldSettings': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.getContactFieldSettings']
	>;
	'contactField.createContactFieldSetting': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.createContactFieldSetting']
	>;
	'contactField.getContactFieldSettingById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.getContactFieldSettingById']
	>;
	'contactField.updateContactFieldSetting': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.updateContactFieldSetting']
	>;
	'contactField.deleteContactFieldSetting': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.deleteContactFieldSetting']
	>;
	'contactField.getReferenceCount': z.infer<
		(typeof SevdeskEndpointInputSchemas)['contactField.getReferenceCount']
	>;
	'creditNote.getCreditNotes': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.getCreditNotes']
	>;
	'creditNote.createcreditNote': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.createcreditNote']
	>;
	'creditNote.createCreditNoteFromInvoice': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.createCreditNoteFromInvoice']
	>;
	'creditNote.createCreditNoteFromVoucher': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.createCreditNoteFromVoucher']
	>;
	'creditNote.getcreditNoteById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.getcreditNoteById']
	>;
	'creditNote.updatecreditNote': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.updatecreditNote']
	>;
	'creditNote.deletecreditNote': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.deletecreditNote']
	>;
	'creditNote.sendCreditNoteByPrinting': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.sendCreditNoteByPrinting']
	>;
	'creditNote.creditNoteSendBy': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.creditNoteSendBy']
	>;
	'creditNote.creditNoteEnshrine': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.creditNoteEnshrine']
	>;
	'creditNote.creditNoteGetPdf': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.creditNoteGetPdf']
	>;
	'creditNote.sendCreditNoteViaEMail': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.sendCreditNoteViaEMail']
	>;
	'creditNote.bookCreditNote': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.bookCreditNote']
	>;
	'creditNote.creditNoteResetToOpen': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.creditNoteResetToOpen']
	>;
	'creditNote.creditNoteResetToDraft': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNote.creditNoteResetToDraft']
	>;
	'creditNotePos.getcreditNotePositions': z.infer<
		(typeof SevdeskEndpointInputSchemas)['creditNotePos.getcreditNotePositions']
	>;
	'export.updateExportConfig': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.updateExportConfig']
	>;
	'export.exportDatevDepricated': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportDatevDepricated']
	>;
	'export.exportDatevCSV': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportDatevCSV']
	>;
	'export.exportDatevXML': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportDatevXML']
	>;
	'export.generateDownloadHash': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.generateDownloadHash']
	>;
	'export.getProgress': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.getProgress']
	>;
	'export.jobDownloadInfo': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.jobDownloadInfo']
	>;
	'export.exportInvoice': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportInvoice']
	>;
	'export.exportInvoiceZip': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportInvoiceZip']
	>;
	'export.exportCreditNote': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportCreditNote']
	>;
	'export.exportVoucher': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportVoucher']
	>;
	'export.exportTransactions': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportTransactions']
	>;
	'export.exportVoucherZip': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportVoucherZip']
	>;
	'export.exportContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['export.exportContact']
	>;
	'part.getParts': z.infer<
		(typeof SevdeskEndpointInputSchemas)['part.getParts']
	>;
	'part.createPart': z.infer<
		(typeof SevdeskEndpointInputSchemas)['part.createPart']
	>;
	'part.getPartById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['part.getPartById']
	>;
	'part.updatePart': z.infer<
		(typeof SevdeskEndpointInputSchemas)['part.updatePart']
	>;
	'part.partGetStock': z.infer<
		(typeof SevdeskEndpointInputSchemas)['part.partGetStock']
	>;
	'invoice.getInvoices': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.getInvoices']
	>;
	'invoice.createInvoiceByFactory': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.createInvoiceByFactory']
	>;
	'invoice.getInvoiceById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.getInvoiceById']
	>;
	'invoice.getInvoicePositionsById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.getInvoicePositionsById']
	>;
	'invoice.createInvoiceFromOrder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.createInvoiceFromOrder']
	>;
	'invoice.createInvoiceReminder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.createInvoiceReminder']
	>;
	'invoice.getIsInvoicePartiallyPaid': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.getIsInvoicePartiallyPaid']
	>;
	'invoice.cancelInvoice': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.cancelInvoice']
	>;
	'invoice.invoiceRender': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.invoiceRender']
	>;
	'invoice.sendInvoiceViaEMail': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.sendInvoiceViaEMail']
	>;
	'invoice.invoiceGetPdf': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.invoiceGetPdf']
	>;
	'invoice.invoiceSendBy': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.invoiceSendBy']
	>;
	'invoice.invoiceEnshrine': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.invoiceEnshrine']
	>;
	'invoice.bookInvoice': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.bookInvoice']
	>;
	'invoice.invoiceResetToOpen': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.invoiceResetToOpen']
	>;
	'invoice.invoiceResetToDraft': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoice.invoiceResetToDraft']
	>;
	'invoicePos.getInvoicePos': z.infer<
		(typeof SevdeskEndpointInputSchemas)['invoicePos.getInvoicePos']
	>;
	'layout.getLetterpapersWithThumb': z.infer<
		(typeof SevdeskEndpointInputSchemas)['layout.getLetterpapersWithThumb']
	>;
	'layout.getTemplates': z.infer<
		(typeof SevdeskEndpointInputSchemas)['layout.getTemplates']
	>;
	'layout.updateInvoiceTemplate': z.infer<
		(typeof SevdeskEndpointInputSchemas)['layout.updateInvoiceTemplate']
	>;
	'layout.updateOrderTemplate': z.infer<
		(typeof SevdeskEndpointInputSchemas)['layout.updateOrderTemplate']
	>;
	'layout.updateCreditNoteTemplate': z.infer<
		(typeof SevdeskEndpointInputSchemas)['layout.updateCreditNoteTemplate']
	>;
	'order.getOrders': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.getOrders']
	>;
	'order.createOrder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.createOrder']
	>;
	'order.getOrderById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.getOrderById']
	>;
	'order.updateOrder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.updateOrder']
	>;
	'order.deleteOrder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.deleteOrder']
	>;
	'order.getOrderPositionsById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.getOrderPositionsById']
	>;
	'order.getDiscounts': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.getDiscounts']
	>;
	'order.getRelatedObjects': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.getRelatedObjects']
	>;
	'order.sendorderViaEMail': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.sendorderViaEMail']
	>;
	'order.createPackingListFromOrder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.createPackingListFromOrder']
	>;
	'order.createContractNoteFromOrder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.createContractNoteFromOrder']
	>;
	'order.orderGetPdf': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.orderGetPdf']
	>;
	'order.orderSendBy': z.infer<
		(typeof SevdeskEndpointInputSchemas)['order.orderSendBy']
	>;
	'orderPos.getOrderPositions': z.infer<
		(typeof SevdeskEndpointInputSchemas)['orderPos.getOrderPositions']
	>;
	'orderPos.getOrderPositionById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['orderPos.getOrderPositionById']
	>;
	'orderPos.updateOrderPosition': z.infer<
		(typeof SevdeskEndpointInputSchemas)['orderPos.updateOrderPosition']
	>;
	'orderPos.deleteOrderPos': z.infer<
		(typeof SevdeskEndpointInputSchemas)['orderPos.deleteOrderPos']
	>;
	'voucher.voucherFactorySaveVoucher': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.voucherFactorySaveVoucher']
	>;
	'voucher.getVouchers': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.getVouchers']
	>;
	'voucher.getVoucherById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.getVoucherById']
	>;
	'voucher.updateVoucher': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.updateVoucher']
	>;
	'voucher.voucherEnshrine': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.voucherEnshrine']
	>;
	'voucher.bookVoucher': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.bookVoucher']
	>;
	'voucher.voucherResetToOpen': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.voucherResetToOpen']
	>;
	'voucher.voucherResetToDraft': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.voucherResetToDraft']
	>;
	'voucherPos.getVoucherPositions': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucherPos.getVoucherPositions']
	>;
	'voucher.forAllAccounts': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.forAllAccounts']
	>;
	'voucher.forAccountNumber': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.forAccountNumber']
	>;
	'voucher.forTaxRule': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.forTaxRule']
	>;
	'voucher.forRevenue': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.forRevenue']
	>;
	'voucher.forExpense': z.infer<
		(typeof SevdeskEndpointInputSchemas)['voucher.forExpense']
	>;
	'report.reportInvoice': z.infer<
		(typeof SevdeskEndpointInputSchemas)['report.reportInvoice']
	>;
	'report.reportOrder': z.infer<
		(typeof SevdeskEndpointInputSchemas)['report.reportOrder']
	>;
	'report.reportContact': z.infer<
		(typeof SevdeskEndpointInputSchemas)['report.reportContact']
	>;
	'report.reportVoucher': z.infer<
		(typeof SevdeskEndpointInputSchemas)['report.reportVoucher']
	>;
	'tag.getTags': z.infer<(typeof SevdeskEndpointInputSchemas)['tag.getTags']>;
	'tag.getTagById': z.infer<
		(typeof SevdeskEndpointInputSchemas)['tag.getTagById']
	>;
	'tag.updateTag': z.infer<
		(typeof SevdeskEndpointInputSchemas)['tag.updateTag']
	>;
	'tag.deleteTag': z.infer<
		(typeof SevdeskEndpointInputSchemas)['tag.deleteTag']
	>;
	'tag.createTag': z.infer<
		(typeof SevdeskEndpointInputSchemas)['tag.createTag']
	>;
	'tag.getTagRelations': z.infer<
		(typeof SevdeskEndpointInputSchemas)['tag.getTagRelations']
	>;
};

export type SevdeskEndpointOutputs = {
	'basics.bookkeepingSystemVersion': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['basics.bookkeepingSystemVersion']
	>;
	'checkAccount.getCheckAccounts': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccount.getCheckAccounts']
	>;
	'checkAccount.createFileImportAccount': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccount.createFileImportAccount']
	>;
	'checkAccount.createClearingAccount': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccount.createClearingAccount']
	>;
	'checkAccount.getCheckAccountById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccount.getCheckAccountById']
	>;
	'checkAccount.updateCheckAccount': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccount.updateCheckAccount']
	>;
	'checkAccount.deleteCheckAccount': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccount.deleteCheckAccount']
	>;
	'checkAccount.getBalanceAtDate': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccount.getBalanceAtDate']
	>;
	'checkAccountTransaction.getTransactions': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccountTransaction.getTransactions']
	>;
	'checkAccountTransaction.createTransaction': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccountTransaction.createTransaction']
	>;
	'checkAccountTransaction.getCheckAccountTransactionById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccountTransaction.getCheckAccountTransactionById']
	>;
	'checkAccountTransaction.updateCheckAccountTransaction': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccountTransaction.updateCheckAccountTransaction']
	>;
	'checkAccountTransaction.deleteCheckAccountTransaction': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccountTransaction.deleteCheckAccountTransaction']
	>;
	'checkAccountTransaction.checkAccountTransactionEnshrine': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['checkAccountTransaction.checkAccountTransactionEnshrine']
	>;
	'privateTransactionRule.listPrivateTransactionRules': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['privateTransactionRule.listPrivateTransactionRules']
	>;
	'privateTransactionRule.createPrivateTransactionRule': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['privateTransactionRule.createPrivateTransactionRule']
	>;
	'privateTransactionRule.deletePrivateTransactionRule': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['privateTransactionRule.deletePrivateTransactionRule']
	>;
	'contact.getNextCustomerNumber': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.getNextCustomerNumber']
	>;
	'contact.findContactsByCustomFieldValue': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.findContactsByCustomFieldValue']
	>;
	'contact.contactCustomerNumberAvailabilityCheck': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.contactCustomerNumberAvailabilityCheck']
	>;
	'contact.getContacts': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.getContacts']
	>;
	'contact.createContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.createContact']
	>;
	'contact.getContactById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.getContactById']
	>;
	'contact.updateContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.updateContact']
	>;
	'contact.deleteContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.deleteContact']
	>;
	'contact.getContactTabsItemCountById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contact.getContactTabsItemCountById']
	>;
	'contactAddress.createContactAddress': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactAddress.createContactAddress']
	>;
	'contactAddress.getContactAddresses': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactAddress.getContactAddresses']
	>;
	'contactAddress.contactAddressId': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactAddress.contactAddressId']
	>;
	'contactAddress.updateContactAddress': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactAddress.updateContactAddress']
	>;
	'contactAddress.deleteContactAddress': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactAddress.deleteContactAddress']
	>;
	'communicationWay.getCommunicationWays': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['communicationWay.getCommunicationWays']
	>;
	'communicationWay.createCommunicationWay': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['communicationWay.createCommunicationWay']
	>;
	'communicationWay.getCommunicationWayById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['communicationWay.getCommunicationWayById']
	>;
	'communicationWay.deleteCommunicationWay': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['communicationWay.deleteCommunicationWay']
	>;
	'communicationWay.updateCommunicationWay': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['communicationWay.updateCommunicationWay']
	>;
	'communicationWay.getCommunicationWayKeys': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['communicationWay.getCommunicationWayKeys']
	>;
	'accountingContact.getAccountingContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['accountingContact.getAccountingContact']
	>;
	'accountingContact.createAccountingContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['accountingContact.createAccountingContact']
	>;
	'accountingContact.getAccountingContactById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['accountingContact.getAccountingContactById']
	>;
	'accountingContact.updateAccountingContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['accountingContact.updateAccountingContact']
	>;
	'accountingContact.deleteAccountingContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['accountingContact.deleteAccountingContact']
	>;
	'contactField.getPlaceholder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.getPlaceholder']
	>;
	'contactField.getContactFields': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.getContactFields']
	>;
	'contactField.createContactField': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.createContactField']
	>;
	'contactField.getContactFieldsById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.getContactFieldsById']
	>;
	'contactField.updateContactfield': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.updateContactfield']
	>;
	'contactField.deleteContactCustomFieldId': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.deleteContactCustomFieldId']
	>;
	'contactField.getContactFieldSettings': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.getContactFieldSettings']
	>;
	'contactField.createContactFieldSetting': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.createContactFieldSetting']
	>;
	'contactField.getContactFieldSettingById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.getContactFieldSettingById']
	>;
	'contactField.updateContactFieldSetting': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.updateContactFieldSetting']
	>;
	'contactField.deleteContactFieldSetting': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.deleteContactFieldSetting']
	>;
	'contactField.getReferenceCount': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['contactField.getReferenceCount']
	>;
	'creditNote.getCreditNotes': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.getCreditNotes']
	>;
	'creditNote.createcreditNote': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.createcreditNote']
	>;
	'creditNote.createCreditNoteFromInvoice': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.createCreditNoteFromInvoice']
	>;
	'creditNote.createCreditNoteFromVoucher': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.createCreditNoteFromVoucher']
	>;
	'creditNote.getcreditNoteById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.getcreditNoteById']
	>;
	'creditNote.updatecreditNote': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.updatecreditNote']
	>;
	'creditNote.deletecreditNote': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.deletecreditNote']
	>;
	'creditNote.sendCreditNoteByPrinting': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.sendCreditNoteByPrinting']
	>;
	'creditNote.creditNoteSendBy': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.creditNoteSendBy']
	>;
	'creditNote.creditNoteEnshrine': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.creditNoteEnshrine']
	>;
	'creditNote.creditNoteGetPdf': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.creditNoteGetPdf']
	>;
	'creditNote.sendCreditNoteViaEMail': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.sendCreditNoteViaEMail']
	>;
	'creditNote.bookCreditNote': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.bookCreditNote']
	>;
	'creditNote.creditNoteResetToOpen': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.creditNoteResetToOpen']
	>;
	'creditNote.creditNoteResetToDraft': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNote.creditNoteResetToDraft']
	>;
	'creditNotePos.getcreditNotePositions': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['creditNotePos.getcreditNotePositions']
	>;
	'export.updateExportConfig': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.updateExportConfig']
	>;
	'export.exportDatevDepricated': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportDatevDepricated']
	>;
	'export.exportDatevCSV': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportDatevCSV']
	>;
	'export.exportDatevXML': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportDatevXML']
	>;
	'export.generateDownloadHash': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.generateDownloadHash']
	>;
	'export.getProgress': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.getProgress']
	>;
	'export.jobDownloadInfo': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.jobDownloadInfo']
	>;
	'export.exportInvoice': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportInvoice']
	>;
	'export.exportInvoiceZip': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportInvoiceZip']
	>;
	'export.exportCreditNote': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportCreditNote']
	>;
	'export.exportVoucher': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportVoucher']
	>;
	'export.exportTransactions': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportTransactions']
	>;
	'export.exportVoucherZip': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportVoucherZip']
	>;
	'export.exportContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['export.exportContact']
	>;
	'part.getParts': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['part.getParts']
	>;
	'part.createPart': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['part.createPart']
	>;
	'part.getPartById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['part.getPartById']
	>;
	'part.updatePart': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['part.updatePart']
	>;
	'part.partGetStock': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['part.partGetStock']
	>;
	'invoice.getInvoices': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.getInvoices']
	>;
	'invoice.createInvoiceByFactory': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.createInvoiceByFactory']
	>;
	'invoice.getInvoiceById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.getInvoiceById']
	>;
	'invoice.getInvoicePositionsById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.getInvoicePositionsById']
	>;
	'invoice.createInvoiceFromOrder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.createInvoiceFromOrder']
	>;
	'invoice.createInvoiceReminder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.createInvoiceReminder']
	>;
	'invoice.getIsInvoicePartiallyPaid': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.getIsInvoicePartiallyPaid']
	>;
	'invoice.cancelInvoice': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.cancelInvoice']
	>;
	'invoice.invoiceRender': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.invoiceRender']
	>;
	'invoice.sendInvoiceViaEMail': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.sendInvoiceViaEMail']
	>;
	'invoice.invoiceGetPdf': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.invoiceGetPdf']
	>;
	'invoice.invoiceSendBy': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.invoiceSendBy']
	>;
	'invoice.invoiceEnshrine': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.invoiceEnshrine']
	>;
	'invoice.bookInvoice': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.bookInvoice']
	>;
	'invoice.invoiceResetToOpen': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.invoiceResetToOpen']
	>;
	'invoice.invoiceResetToDraft': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoice.invoiceResetToDraft']
	>;
	'invoicePos.getInvoicePos': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['invoicePos.getInvoicePos']
	>;
	'layout.getLetterpapersWithThumb': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['layout.getLetterpapersWithThumb']
	>;
	'layout.getTemplates': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['layout.getTemplates']
	>;
	'layout.updateInvoiceTemplate': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['layout.updateInvoiceTemplate']
	>;
	'layout.updateOrderTemplate': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['layout.updateOrderTemplate']
	>;
	'layout.updateCreditNoteTemplate': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['layout.updateCreditNoteTemplate']
	>;
	'order.getOrders': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.getOrders']
	>;
	'order.createOrder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.createOrder']
	>;
	'order.getOrderById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.getOrderById']
	>;
	'order.updateOrder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.updateOrder']
	>;
	'order.deleteOrder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.deleteOrder']
	>;
	'order.getOrderPositionsById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.getOrderPositionsById']
	>;
	'order.getDiscounts': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.getDiscounts']
	>;
	'order.getRelatedObjects': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.getRelatedObjects']
	>;
	'order.sendorderViaEMail': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.sendorderViaEMail']
	>;
	'order.createPackingListFromOrder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.createPackingListFromOrder']
	>;
	'order.createContractNoteFromOrder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.createContractNoteFromOrder']
	>;
	'order.orderGetPdf': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.orderGetPdf']
	>;
	'order.orderSendBy': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['order.orderSendBy']
	>;
	'orderPos.getOrderPositions': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['orderPos.getOrderPositions']
	>;
	'orderPos.getOrderPositionById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['orderPos.getOrderPositionById']
	>;
	'orderPos.updateOrderPosition': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['orderPos.updateOrderPosition']
	>;
	'orderPos.deleteOrderPos': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['orderPos.deleteOrderPos']
	>;
	'voucher.voucherFactorySaveVoucher': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.voucherFactorySaveVoucher']
	>;
	'voucher.getVouchers': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.getVouchers']
	>;
	'voucher.getVoucherById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.getVoucherById']
	>;
	'voucher.updateVoucher': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.updateVoucher']
	>;
	'voucher.voucherEnshrine': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.voucherEnshrine']
	>;
	'voucher.bookVoucher': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.bookVoucher']
	>;
	'voucher.voucherResetToOpen': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.voucherResetToOpen']
	>;
	'voucher.voucherResetToDraft': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.voucherResetToDraft']
	>;
	'voucherPos.getVoucherPositions': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucherPos.getVoucherPositions']
	>;
	'voucher.forAllAccounts': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.forAllAccounts']
	>;
	'voucher.forAccountNumber': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.forAccountNumber']
	>;
	'voucher.forTaxRule': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.forTaxRule']
	>;
	'voucher.forRevenue': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.forRevenue']
	>;
	'voucher.forExpense': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['voucher.forExpense']
	>;
	'report.reportInvoice': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['report.reportInvoice']
	>;
	'report.reportOrder': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['report.reportOrder']
	>;
	'report.reportContact': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['report.reportContact']
	>;
	'report.reportVoucher': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['report.reportVoucher']
	>;
	'tag.getTags': z.infer<(typeof SevdeskEndpointOutputSchemas)['tag.getTags']>;
	'tag.getTagById': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['tag.getTagById']
	>;
	'tag.updateTag': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['tag.updateTag']
	>;
	'tag.deleteTag': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['tag.deleteTag']
	>;
	'tag.createTag': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['tag.createTag']
	>;
	'tag.getTagRelations': z.infer<
		(typeof SevdeskEndpointOutputSchemas)['tag.getTagRelations']
	>;
};

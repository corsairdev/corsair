import { z } from 'zod';

// ==========================================
// Common & Reusable Schemas
// ==========================================

export const PageSortSchema = z.object({
	property: z.string().optional(),
	direction: z.string().optional(),
	ignoreCase: z.boolean().optional(),
	nullHandling: z.string().optional(),
	ascending: z.boolean().optional(),
});

export const ResourceMutationResponseSchema = z.object({
	id: z.string(),
	resourceUri: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	version: z.number().optional(),
});
export type ResourceMutationResponse = z.infer<
	typeof ResourceMutationResponseSchema
>;

const VoucherTypeValues = [
	'salesinvoice',
	'salescreditnote',
	'purchaseinvoice',
	'purchasecreditnote',
	'invoice',
	'downpaymentinvoice',
	'creditnote',
	'orderconfirmation',
	'quotation',
	'deliverynote',
] as const;

const VoucherStatusValues = [
	'draft',
	'open',
	'overdue',
	'paid',
	'paidoff',
	'voided',
	'transferred',
	'sepadebit',
	'accepted',
	'rejected',
	'unchecked',
] as const;
const VoucherTypeSet = new Set<string>(VoucherTypeValues);
const VoucherStatusSet = new Set<string>(VoucherStatusValues);

const VoucherTypeFilterSchema = z
	.string()
	.refine(
		(value) =>
			value === 'any' ||
			value.split(',').every((type) => VoucherTypeSet.has(type)),
		{
			message: 'Use any or a comma-separated list of documented voucher types',
		},
	);

const VoucherStatusFilterSchema = z
	.string()
	.refine(
		(value) =>
			value === 'any' ||
			(value.split(',').every((status) => VoucherStatusSet.has(status)) &&
				(!value.split(',').includes('overdue') || !value.includes(','))),
		{ message: 'Use any or a valid list of voucher statuses' },
	);

const VoucherListFilters = {
	archived: z.boolean().optional(),
	contactId: z.string().optional(),
	voucherDateFrom: z.iso.date().optional(),
	voucherDateTo: z.iso.date().optional(),
	createdDateFrom: z.iso.date().optional(),
	createdDateTo: z.iso.date().optional(),
	updatedDateFrom: z.iso.date().optional(),
	updatedDateTo: z.iso.date().optional(),
	voucherNumber: z.string().optional(),
	page: z.number().int().min(0).optional(),
	size: z.number().int().min(1).max(250).optional(),
	sort: z
		.string()
		.regex(
			/^(voucherDate|voucherNumber|createdDate|updatedDate)(,(ASC|DESC))?$/,
		)
		.optional(),
};

const VoucherListResponseItemSchema = z.object({
	id: z.string(),
	voucherType: z.string(),
	voucherStatus: z.string(),
	voucherNumber: z.string().nullable().optional(),
	voucherDate: z.string(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	dueDate: z.string().nullable().optional(),
	contactId: z.string().nullable().optional(),
	contactName: z.string().nullable().optional(),
	totalAmount: z.number().optional(),
	openAmount: z.number().nullable().optional(),
	currency: z.string().optional(),
	archived: z.boolean().optional(),
});

export const VoucherListResponseSchema = z.object({
	content: z.array(VoucherListResponseItemSchema),
	first: z.boolean(),
	last: z.boolean(),
	totalPages: z.number(),
	totalElements: z.number(),
	numberOfElements: z.number(),
	size: z.number(),
	number: z.number(),
	sort: z.array(PageSortSchema).optional(),
});
export type VoucherListResponse = z.infer<typeof VoucherListResponseSchema>;

export const VoucherListInputSchema = z
	.object({
		voucherType: VoucherTypeFilterSchema,
		voucherStatus: VoucherStatusFilterSchema,
		...VoucherListFilters,
	})
	.strict();
export type VoucherListInput = z.infer<typeof VoucherListInputSchema>;

// ==========================================
// Contacts Schemas
// ==========================================

export const ContactAddressSchema = z.object({
	supplement: z.string().optional(),
	street: z.string().optional(),
	city: z.string().optional(),
	zip: z.string().optional(),
	countryCode: z.string().length(2),
});
export type ContactAddress = z.infer<typeof ContactAddressSchema>;

export const ContactPersonSchema = z.object({
	salutation: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string(),
	primary: z.boolean().optional(),
	emailAddress: z.string().optional(),
	phoneNumber: z.string().optional(),
});
export type ContactPerson = z.infer<typeof ContactPersonSchema>;

export const ContactCompanySchema = z.object({
	name: z.string(),
	taxNumber: z.string().optional(),
	vatRegistrationId: z.string().optional(),
	allowTaxFreeInvoices: z.boolean().optional(),
	contactPersons: z.array(ContactPersonSchema).optional(),
});
export type ContactCompany = z.infer<typeof ContactCompanySchema>;

export const ContactRoleCustomerSchema = z.object({
	number: z.number().int().optional(),
});

export const ContactRoleVendorSchema = z.object({
	number: z.number().int().optional(),
});

export const ContactRolesSchema = z.object({
	customer: ContactRoleCustomerSchema.optional(),
	vendor: ContactRoleVendorSchema.optional(),
});
export type ContactRoles = z.infer<typeof ContactRolesSchema>;

export const ContactSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	version: z.number(),
	roles: ContactRolesSchema.optional(),
	person: z
		.object({
			salutation: z.string().optional(),
			firstName: z.string().optional(),
			lastName: z.string(),
		})
		.optional(),
	company: ContactCompanySchema.optional(),
	xRechnung: z
		.object({
			buyerReference: z.string().optional(),
			vendorNumberAtCustomer: z.string().optional(),
		})
		.optional(),
	addresses: z
		.object({
			billing: z.array(ContactAddressSchema).optional(),
			shipping: z.array(ContactAddressSchema).optional(),
		})
		.optional(),
	emailAddresses: z
		.object({
			business: z.array(z.string()).optional(),
			office: z.array(z.string()).optional(),
			private: z.array(z.string()).optional(),
			other: z.array(z.string()).optional(),
		})
		.optional(),
	phoneNumbers: z
		.object({
			business: z.array(z.string()).optional(),
			office: z.array(z.string()).optional(),
			mobile: z.array(z.string()).optional(),
			private: z.array(z.string()).optional(),
			fax: z.array(z.string()).optional(),
			other: z.array(z.string()).optional(),
		})
		.optional(),
	note: z.string().optional(),
	archived: z.boolean().optional(),
});
export type Contact = z.infer<typeof ContactSchema>;

const ContactCreateFields = {
	roles: z
		.object({
			customer: z.object({}).strict().optional(),
			vendor: z.object({}).strict().optional(),
		})
		.strict(),
	person: z
		.object({
			salutation: z.string().max(25).optional(),
			firstName: z.string().optional(),
			lastName: z.string().min(1),
		})
		.strict()
		.optional(),
	company: z
		.object({
			name: z.string().min(1),
			taxNumber: z.string().optional(),
			vatRegistrationId: z.string().optional(),
			allowTaxFreeInvoices: z.boolean().optional(),
			contactPersons: z
				.array(
					z
						.object({
							salutation: z.string().max(25).optional(),
							firstName: z.string().optional(),
							lastName: z.string().min(1),
							primary: z.boolean().optional(),
							emailAddress: z.string().optional(),
							phoneNumber: z.string().optional(),
						})
						.strict(),
				)
				.max(1)
				.optional(),
		})
		.strict()
		.optional(),
	addresses: z
		.object({
			billing: z.array(ContactAddressSchema.strict()).max(1).optional(),
			shipping: z.array(ContactAddressSchema.strict()).max(1).optional(),
		})
		.strict()
		.optional(),
	emailAddresses: z
		.object({
			business: z.array(z.string()).max(1).optional(),
			office: z.array(z.string()).max(1).optional(),
			private: z.array(z.string()).max(1).optional(),
			other: z.array(z.string()).max(1).optional(),
		})
		.strict()
		.optional(),
	phoneNumbers: z
		.object({
			business: z.array(z.string()).max(1).optional(),
			office: z.array(z.string()).max(1).optional(),
			mobile: z.array(z.string()).max(1).optional(),
			private: z.array(z.string()).max(1).optional(),
			fax: z.array(z.string()).max(1).optional(),
			other: z.array(z.string()).max(1).optional(),
		})
		.strict()
		.optional(),
	xRechnung: z
		.object({
			buyerReference: z.string().optional(),
			vendorNumberAtCustomer: z.string().optional(),
		})
		.strict()
		.optional(),
	note: z.string().max(1000).optional(),
};

const ContactCreateFieldsSchema = z.object(ContactCreateFields).strict();

function validateContactWrite(
	input: z.infer<typeof ContactCreateFieldsSchema>,
	ctx: z.RefinementCtx,
) {
	if (input.roles.customer === undefined && input.roles.vendor === undefined) {
		ctx.addIssue({
			code: 'custom',
			message: 'At least one contact role is required',
			path: ['roles'],
		});
	}
	if ((input.person === undefined) === (input.company === undefined)) {
		ctx.addIssue({
			code: 'custom',
			message: 'Provide exactly one of person or company',
			path: ['person'],
		});
	}
	if (
		input.xRechnung?.buyerReference !== undefined &&
		input.xRechnung.vendorNumberAtCustomer === undefined
	) {
		ctx.addIssue({
			code: 'custom',
			message: 'vendorNumberAtCustomer is required with buyerReference',
			path: ['xRechnung', 'vendorNumberAtCustomer'],
		});
	}
}

export const ContactsListInputSchema = z
	.object({
		email: z.string().min(3).optional(),
		name: z.string().min(3).optional(),
		number: z.number().int().optional(),
		customer: z.boolean().optional(),
		vendor: z.boolean().optional(),
		page: z.number().int().min(0).optional(),
		size: z.number().int().min(1).max(250).optional(),
	})
	.strict();
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactsListResponseSchema = z.object({
	content: z.array(ContactSchema),
	first: z.boolean(),
	last: z.boolean(),
	totalPages: z.number(),
	totalElements: z.number(),
	numberOfElements: z.number(),
	size: z.number(),
	number: z.number(),
	sort: z.array(PageSortSchema).optional(),
});
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactsGetInputSchema = z
	.object({
		id: z.string().min(1, 'Contact ID is required'),
	})
	.strict();
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

export const ContactCreateInputSchema = z
	.object({
		version: z.number().int().default(0),
		...ContactCreateFields,
	})
	.strict()
	.superRefine(validateContactWrite);
export type ContactCreateInput = z.infer<typeof ContactCreateInputSchema>;

export const ContactUpdateInputSchema = z
	.object({
		id: z.string().min(1, 'Contact ID is required'),
		version: z.number().int(),
		...ContactCreateFields,
	})
	.strict()
	.superRefine(validateContactWrite);
export type ContactUpdateInput = z.infer<typeof ContactUpdateInputSchema>;

// ==========================================
// Invoices Schemas
// ==========================================

export const LineItemSchema = z.object({
	id: z.string().nullable().optional(),
	type: z.string(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	quantity: z.number().nullable().optional(),
	unitName: z.string().nullable().optional(),
	unitPrice: z
		.object({
			currency: z.string(),
			netAmount: z.number().nullable().optional(),
			grossAmount: z.number().nullable().optional(),
			taxRatePercentage: z.number(),
		})
		.nullable()
		.optional(),
	discountPercentage: z.number().nullable().optional(),
	lineItemAmount: z.number().nullable().optional(),
});
export type LineItem = z.infer<typeof LineItemSchema>;

export const TaxAmountSchema = z.object({
	taxRatePercentage: z.number(),
	taxAmount: z.number(),
	netAmount: z.number(),
});

export const RelatedVoucherSchema = z.object({
	id: z.string(),
	voucherNumber: z.string().nullable().optional(),
	voucherType: z.string(),
});

export const InvoicesListInputSchema = z
	.object({
		voucherStatus: VoucherStatusFilterSchema.optional(),
		...VoucherListFilters,
	})
	.strict();
export type InvoicesListInput = z.infer<typeof InvoicesListInputSchema>;

export const InvoiceSummarySchema = VoucherListResponseItemSchema;
export type InvoiceSummary = z.infer<typeof InvoiceSummarySchema>;

export const InvoicesListResponseSchema = VoucherListResponseSchema;
export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;

export const InvoicesGetInputSchema = z
	.object({
		id: z.string().min(1, 'Invoice ID is required'),
	})
	.strict();
export type InvoicesGetInput = z.infer<typeof InvoicesGetInputSchema>;

export const InvoiceDetailsSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	version: z.number(),
	language: z.string().optional(),
	archived: z.boolean().optional(),
	voucherStatus: z.string(),
	voucherNumber: z.string().nullable().optional(),
	voucherDate: z.string(),
	dueDate: z.string().nullable().optional(),
	address: z
		.object({
			contactId: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			supplement: z.string().nullable().optional(),
			street: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			zip: z.string().nullable().optional(),
			countryCode: z.string().nullable().optional(),
			contactPerson: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
	xRechnung: z
		.object({ buyerReference: z.string().nullable().optional() })
		.nullable()
		.optional(),
	electronicDocumentProfile: z.string().optional(),
	lineItems: z.array(LineItemSchema).optional(),
	totalPrice: z.object({
		currency: z.string(),
		totalNetAmount: z.number().nullable().optional(),
		totalGrossAmount: z.number().nullable().optional(),
		totalTaxAmount: z.number().nullable().optional(),
		totalDiscountAbsolute: z.number().nullable().optional(),
		totalDiscountPercentage: z.number().nullable().optional(),
	}),
	taxAmounts: z.array(TaxAmountSchema).optional(),
	taxConditions: z
		.object({
			taxType: z.string(),
			taxTypeNote: z.string().nullable().optional(),
			taxSubType: z.string().nullable().optional(),
		})
		.optional(),
	paymentConditions: z
		.object({
			paymentTermLabel: z.string().nullable().optional(),
			paymentTermLabelTemplate: z.string().nullable().optional(),
			paymentTermDuration: z.number().nullable().optional(),
			paymentDiscountConditions: z
				.object({
					discountPercentage: z.number(),
					discountRange: z.number(),
				})
				.nullable()
				.optional(),
		})
		.nullable()
		.optional(),
	closingInvoice: z.boolean().nullable().optional(),
	claimedGrossAmount: z.number().nullable().optional(),
	downPaymentDeductions: z
		.array(
			z.object({
				id: z.string(),
				voucherType: z.string(),
				title: z.string(),
				voucherNumber: z.string(),
				voucherDate: z.string(),
				receivedGrossAmount: z.number(),
				receivedNetAmount: z.number(),
				receivedTaxAmount: z.number(),
				taxRatePercentage: z.number(),
			}),
		)
		.nullable()
		.optional(),
	recurringTemplateId: z.string().nullable().optional(),
	relatedVouchers: z.array(RelatedVoucherSchema).optional(),
	printLayoutId: z.string().nullable().optional(),
	shippingConditions: z
		.object({
			shippingDate: z.string().nullable().optional(),
			shippingEndDate: z.string().nullable().optional(),
			shippingType: z.string().optional(),
		})
		.nullable()
		.optional(),
	title: z.string().nullable().optional(),
	introduction: z.string().nullable().optional(),
	remark: z.string().nullable().optional(),
	files: z
		.object({ documentFileId: z.string().nullable().optional() })
		.nullable()
		.optional(),
});
export type InvoiceDetails = z.infer<typeof InvoiceDetailsSchema>;

export const InvoiceCreateLineItemSchema = z
	.object({
		type: z.enum(['custom', 'material', 'service', 'text']),
		id: z.string().optional(),
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		quantity: z.number().positive().optional(),
		unitName: z.string().optional(),
		unitPrice: z
			.object({
				currency: z.literal('EUR'),
				netAmount: z.number().optional(),
				grossAmount: z.number().optional(),
				taxRatePercentage: z.number().min(0),
			})
			.strict()
			.optional(),
		discountPercentage: z.number().min(0).max(100).optional(),
	})
	.strict()
	.superRefine((line, ctx) => {
		if (line.type === 'text') {
			if (line.name === undefined && line.description === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'Text items require a name or description',
				});
			}
			if (
				line.id !== undefined ||
				line.quantity !== undefined ||
				line.unitName !== undefined ||
				line.unitPrice !== undefined ||
				line.discountPercentage !== undefined
			) {
				ctx.addIssue({
					code: 'custom',
					message: 'Text items only accept name and description',
				});
			}
		} else {
			if (line.name === undefined) {
				ctx.addIssue({ code: 'custom', message: 'name is required' });
			}
			if (line.quantity === undefined) {
				ctx.addIssue({ code: 'custom', message: 'quantity is required' });
			}
			if (line.unitName === undefined) {
				ctx.addIssue({ code: 'custom', message: 'unitName is required' });
			}
			if (line.unitPrice === undefined) {
				ctx.addIssue({ code: 'custom', message: 'unitPrice is required' });
			}
		}
		if (
			(line.type === 'material' || line.type === 'service') &&
			line.id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'id is required for catalog items',
			});
		}
	});

const CreditNoteCreateLineItemSchema = z
	.object({
		type: z.enum(['custom', 'material', 'service', 'text']),
		id: z.string().optional(),
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		quantity: z.number().positive().optional(),
		unitName: z.string().optional(),
		unitPrice: z
			.object({
				currency: z.literal('EUR'),
				netAmount: z.number().optional(),
				grossAmount: z.number().optional(),
				taxRatePercentage: z.number().min(0),
			})
			.strict()
			.optional(),
	})
	.strict()
	.superRefine((line, ctx) => {
		if (line.type === 'text') {
			if (line.name === undefined && line.description === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'Text items require a name or description',
				});
			}
			if (
				line.id !== undefined ||
				line.quantity !== undefined ||
				line.unitName !== undefined ||
				line.unitPrice !== undefined
			) {
				ctx.addIssue({
					code: 'custom',
					message: 'Text items only accept name and description',
				});
			}
		} else if (
			line.name === undefined ||
			line.quantity === undefined ||
			line.unitName === undefined ||
			line.unitPrice === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Sales line items require name, quantity, unitName, and unitPrice',
			});
		}
		if (
			(line.type === 'material' || line.type === 'service') &&
			line.id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'id is required for catalog items',
			});
		}
	});

const SaleVoucherAddressSchema = z
	.object({
		contactId: z.string().optional(),
		name: z.string().optional(),
		supplement: z.string().optional(),
		street: z.string().optional(),
		city: z.string().optional(),
		zip: z.string().optional(),
		countryCode: z.string().length(2).optional(),
	})
	.strict();

const SaleVoucherTaxConditionsSchema = z
	.object({
		taxType: z.enum([
			'net',
			'gross',
			'vatfree',
			'intraCommunitySupply',
			'constructionService13b',
			'externalService13b',
			'thirdPartyCountryService',
			'thirdPartyCountryDelivery',
			'photovoltaicEquipment',
		]),
		taxTypeNote: z.string().optional(),
		taxSubType: z
			.enum(['distanceSales', 'electronicServices'])
			.nullable()
			.optional(),
	})
	.strict();

const SaleVoucherPaymentConditionsSchema = z
	.object({
		paymentTermLabel: z.string().optional(),
		paymentTermDuration: z.number().int().min(0).optional(),
		paymentDiscountConditions: z
			.object({
				discountPercentage: z.number().min(0).max(100),
				discountRange: z.number().int().min(0),
			})
			.strict()
			.optional(),
	})
	.strict();

const XRechnungSchema = z.object({ buyerReference: z.string() }).strict();

function validateSaleVoucherLines(
	input: {
		address: { contactId?: string; countryCode?: string; name?: string };
		lineItems: z.infer<typeof InvoiceCreateLineItemSchema>[];
		taxConditions: z.infer<typeof SaleVoucherTaxConditionsSchema>;
	},
	ctx: z.RefinementCtx,
) {
	if (input.address.contactId === undefined) {
		if (
			input.address.name === undefined ||
			input.address.countryCode === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide contactId or both name and countryCode',
				path: ['address'],
			});
		}
	}
	input.lineItems.forEach((line, index) => {
		if (line.type === 'text' || line.unitPrice === undefined) return;
		if (
			input.taxConditions.taxType === 'vatfree' &&
			line.unitPrice.taxRatePercentage !== 0
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'vatfree sales vouchers require a zero tax rate',
				path: ['lineItems', index, 'unitPrice', 'taxRatePercentage'],
			});
		}
		if (
			input.taxConditions.taxType === 'gross' &&
			line.unitPrice.grossAmount === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'grossAmount is required for gross tax conditions',
				path: ['lineItems', index, 'unitPrice', 'grossAmount'],
			});
		}
		if (
			input.taxConditions.taxType !== 'gross' &&
			line.unitPrice.netAmount === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'netAmount is required unless taxType is gross',
				path: ['lineItems', index, 'unitPrice', 'netAmount'],
			});
		}
	});
}

export const InvoiceCreateInputSchema = z
	.object({
		finalize: z.boolean().optional(),
		precedingSalesVoucherId: z.string().min(1).optional(),
		voucherDate: z.string().min(1, 'voucherDate is required'),
		language: z.enum(['de', 'en']).optional(),
		printLayoutId: z.string().optional(),
		address: SaleVoucherAddressSchema,
		lineItems: z.array(InvoiceCreateLineItemSchema).min(1).max(300),
		totalPrice: z
			.object({
				currency: z.literal('EUR'),
				totalDiscountAbsolute: z.number().optional(),
				totalDiscountPercentage: z.number().min(0).max(100).optional(),
			})
			.strict(),
		taxConditions: SaleVoucherTaxConditionsSchema,
		paymentConditions: SaleVoucherPaymentConditionsSchema.optional(),
		xRechnung: XRechnungSchema.optional(),
		title: z.string().optional(),
		introduction: z.string().optional(),
		remark: z.string().optional(),
		shippingConditions: z
			.object({
				shippingDate: z.string().optional(),
				shippingEndDate: z.string().optional(),
				shippingType: z.enum([
					'service',
					'serviceperiod',
					'delivery',
					'deliveryperiod',
					'none',
				]),
			})
			.strict()
			.superRefine((shipping, ctx) => {
				if (shipping.shippingType !== 'none' && !shipping.shippingDate) {
					ctx.addIssue({
						code: 'custom',
						message: 'shippingDate is required for this shipping type',
					});
				}
				if (
					(shipping.shippingType === 'serviceperiod' ||
						shipping.shippingType === 'deliveryperiod') &&
					!shipping.shippingEndDate
				) {
					ctx.addIssue({
						code: 'custom',
						message: 'shippingEndDate is required for period shipping types',
					});
				}
				if (
					shipping.shippingType === 'none' &&
					(shipping.shippingDate !== undefined ||
						shipping.shippingEndDate !== undefined)
				) {
					ctx.addIssue({
						code: 'custom',
						message: 'shippingType none does not accept shipping dates',
					});
				}
			}),
	})
	.strict()
	.superRefine(validateSaleVoucherLines);
export type InvoiceCreateInput = z.infer<typeof InvoiceCreateInputSchema>;

export const CreditNoteCreateInputSchema = z
	.object({
		finalize: z.boolean().optional(),
		precedingSalesVoucherId: z.string().min(1).optional(),
		voucherDate: z.string().min(1, 'voucherDate is required'),
		language: z.enum(['de', 'en']).optional(),
		printLayoutId: z.string().optional(),
		address: SaleVoucherAddressSchema,
		lineItems: z.array(CreditNoteCreateLineItemSchema).min(1).max(300),
		totalPrice: z
			.object({
				currency: z.literal('EUR'),
				totalDiscountAbsolute: z.number().optional(),
				totalDiscountPercentage: z.number().min(0).max(100).optional(),
			})
			.strict(),
		taxConditions: SaleVoucherTaxConditionsSchema,
		title: z.string().optional(),
		introduction: z.string().optional(),
		remark: z.string().optional(),
	})
	.strict()
	.superRefine(validateSaleVoucherLines);
export type CreditNoteCreateInput = z.infer<typeof CreditNoteCreateInputSchema>;

export const InvoicesRenderInputSchema = z
	.object({
		id: z.string().min(1, 'Invoice ID is required'),
	})
	.strict();
export type InvoicesRenderInput = z.infer<typeof InvoicesRenderInputSchema>;

export const InvoicesRenderResponseSchema = z.object({
	documentFileId: z.string(),
});
export type InvoicesRenderResponse = z.infer<
	typeof InvoicesRenderResponseSchema
>;

export const FileDownloadInputSchema = z
	.object({
		id: z.string().min(1, 'File ID is required'),
		accept: z
			.enum([
				'*/*',
				'application/pdf',
				'application/xml',
				'image/jpeg',
				'image/png',
			])
			.optional(),
	})
	.strict();
export type FileDownloadInput = z.infer<typeof FileDownloadInputSchema>;

export const SalesFileDownloadInputSchema = z
	.object({
		id: z.string().min(1, 'Document ID is required'),
		accept: z.enum(['*/*', 'application/pdf', 'application/xml']).optional(),
	})
	.strict();
export type SalesFileDownloadInput = z.infer<
	typeof SalesFileDownloadInputSchema
>;

export const FileDownloadResponseSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string().min(1),
		base64: z.base64(),
		sizeBytes: z.number().int().min(0),
	})
	.strict()
	.superRefine((file, ctx) => {
		if (Buffer.from(file.base64, 'base64').byteLength !== file.sizeBytes) {
			ctx.addIssue({
				code: 'custom',
				message: 'sizeBytes must match the decoded binary payload',
				path: ['sizeBytes'],
			});
		}
	});
export type FileDownloadResponse = z.infer<typeof FileDownloadResponseSchema>;
export const InvoicesFileDownloadResponseSchema = FileDownloadResponseSchema;
export const CreditNotesFileDownloadResponseSchema = FileDownloadResponseSchema;
export const DownPaymentInvoicesFileDownloadResponseSchema =
	FileDownloadResponseSchema;

// ==========================================
// Vouchers Schemas
// ==========================================

export const VoucherItemSchema = z.object({
	amount: z.number(),
	taxAmount: z.number().optional(),
	taxRatePercent: z.number(),
	categoryId: z.string(),
});
export type VoucherItem = z.infer<typeof VoucherItemSchema>;

export const VouchersListInputSchema = z
	.object({
		voucherNumber: z.string().optional(),
		page: z.number().int().min(0).optional(),
		size: z.number().int().min(1).max(250).optional(),
	})
	.strict();
export type VouchersListInput = z.infer<typeof VouchersListInputSchema>;

export const VoucherSummarySchema = z.object({
	...VoucherListResponseItemSchema.shape,
});
export type VoucherSummary = z.infer<typeof VoucherSummarySchema>;

export const VouchersListResponseSchema = VoucherListResponseSchema;
export type VouchersListResponse = z.infer<typeof VouchersListResponseSchema>;

export const VouchersGetInputSchema = z
	.object({
		id: z.string().min(1, 'Voucher ID is required'),
	})
	.strict();
export type VouchersGetInput = z.infer<typeof VouchersGetInputSchema>;

export const VoucherDetailsSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	type: z.string(),
	voucherStatus: z.string(),
	voucherNumber: z.string().nullable().optional(),
	voucherDate: z.string(),
	shippingDate: z.string().nullable().optional(),
	dueDate: z.string().nullable().optional(),
	totalGrossAmount: z.number().nullable().optional(),
	totalTaxAmount: z.number().nullable().optional(),
	taxType: z.string().nullable().optional(),
	useCollectiveContact: z.boolean().optional(),
	contactId: z.string().nullable().optional(),
	contactName: z.string().nullable().optional(),
	remark: z.string().nullable().optional(),
	voucherItems: z.array(VoucherItemSchema),
	files: z.array(z.string()).optional(),
	version: z.number(),
});
export type VoucherDetails = z.infer<typeof VoucherDetailsSchema>;

export const VoucherCreateItemSchema = z
	.object({
		amount: z.number(),
		taxAmount: z.number(),
		taxRatePercent: z.number().min(0),
		categoryId: z.string().min(1, 'categoryId is required'),
	})
	.strict();

const VoucherWriteFields = {
	type: z.enum([
		'salesinvoice',
		'salescreditnote',
		'purchaseinvoice',
		'purchasecreditnote',
	]),
	voucherStatus: z.enum(['open', 'unchecked']).optional(),
	voucherNumber: z.string().min(1).optional(),
	voucherDate: z.iso.date().optional(),
	shippingDate: z.iso.date().optional(),
	dueDate: z.iso.date().optional(),
	totalGrossAmount: z.number().optional(),
	totalTaxAmount: z.number().optional(),
	taxType: z.enum(['net', 'gross', 'vatfree']),
	useCollectiveContact: z.boolean().optional(),
	contactId: z.string().min(1).optional(),
	contactName: z.string().optional(),
	remark: z.string().optional(),
	voucherItems: z.array(VoucherCreateItemSchema).min(1).optional(),
	files: z.array(z.string()).optional(),
};

function validateVoucherWrite(
	input: {
		type:
			| 'salesinvoice'
			| 'salescreditnote'
			| 'purchaseinvoice'
			| 'purchasecreditnote';
		contactId?: string;
		useCollectiveContact?: boolean;
		shippingDate?: string;
		voucherStatus?: 'open' | 'unchecked';
		voucherNumber?: string;
		voucherDate?: string;
		totalGrossAmount?: number;
		totalTaxAmount?: number;
		voucherItems?: VoucherItem[];
	},
	ctx: z.RefinementCtx,
) {
	if (input.contactId === undefined && input.useCollectiveContact !== true) {
		ctx.addIssue({
			code: 'custom',
			message: 'Provide contactId or set useCollectiveContact to true',
		});
	}
	if (input.voucherStatus !== 'unchecked') {
		for (const [field, value] of [
			['voucherNumber', input.voucherNumber],
			['voucherDate', input.voucherDate],
			['totalGrossAmount', input.totalGrossAmount],
			['totalTaxAmount', input.totalTaxAmount],
			['voucherItems', input.voucherItems],
		] as const) {
			if (value === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: `${field} is required for open vouchers`,
					path: [field],
				});
			}
		}
	}
	if (
		input.shippingDate !== undefined &&
		input.type !== 'salesinvoice' &&
		input.type !== 'salescreditnote'
	) {
		ctx.addIssue({
			code: 'custom',
			message:
				'shippingDate is only supported for sales invoices and credit notes',
			path: ['shippingDate'],
		});
	}
}

export const VoucherCreateInputSchema = z
	.object({
		...VoucherWriteFields,
		version: z.number().int().optional(),
	})
	.strict()
	.superRefine(validateVoucherWrite);
export type VoucherCreateInput = z.infer<typeof VoucherCreateInputSchema>;

export const VoucherUpdateInputSchema = z
	.object({
		id: z.string().min(1, 'Voucher ID is required'),
		version: z.number().int().min(0),
		...VoucherWriteFields,
		voucherNumber: z.string().min(1),
		voucherDate: z.iso.date(),
		totalGrossAmount: z.number(),
		totalTaxAmount: z.number(),
		voucherItems: z.array(VoucherCreateItemSchema).min(1),
		files: z.array(z.string()),
	})
	.strict()
	.superRefine(validateVoucherWrite);
export type VoucherUpdateInput = z.infer<typeof VoucherUpdateInputSchema>;

// ==========================================
// Profile Schemas
// ==========================================

export const ProfileGetInputSchema = z.object({}).strict();
export type ProfileGetInput = z.infer<typeof ProfileGetInputSchema>;

export const ProfileGetResponseSchema = z.object({
	organizationId: z.string(),
	companyName: z.string().optional(),
	created: z
		.object({
			userId: z.string().optional(),
			userName: z.string().optional(),
			userEmail: z.string().optional(),
			date: z.string().optional(),
		})
		.optional(),
	connectionId: z.string().optional(),
	taxType: z.enum(['net', 'gross', 'vatfree']).optional(),
	distanceSalesPrinciple: z.enum(['ORIGIN', 'DESTINATION']).optional(),
	businessFeatures: z.array(z.string()).optional(),
	smallBusiness: z.boolean().optional(),
});
export type ProfileGetResponse = z.infer<typeof ProfileGetResponseSchema>;

export const PaymentsGetInputSchema = z
	.object({ voucherId: z.string().min(1, 'Voucher ID is required') })
	.strict();
export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;

export const PaymentInformationSchema = z.object({
	openAmount: z.string(),
	currency: z.string(),
	paymentStatus: z.string(),
	voucherType: z.string(),
	voucherStatus: z.string(),
	paymentItems: z.array(
		z.object({
			paymentItemType: z.string(),
			postingDate: z.string(),
			amount: z.number(),
			currency: z.string(),
		}),
	),
});
export type PaymentInformation = z.infer<typeof PaymentInformationSchema>;

export const PostingCategoriesListInputSchema = z.object({}).strict();
export type PostingCategoriesListInput = z.infer<
	typeof PostingCategoriesListInputSchema
>;

export const PostingCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(['income', 'outgo']),
	contactRequired: z.boolean(),
	splitAllowed: z.boolean(),
	groupName: z.string(),
});
export const PostingCategoriesListResponseSchema = z.array(
	PostingCategorySchema,
);
export type PostingCategory = z.infer<typeof PostingCategorySchema>;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_FILE_BASE64_LENGTH = 4 * Math.ceil(MAX_FILE_BYTES / 3);
const FileContentTypes = [
	'application/pdf',
	'image/jpeg',
	'image/png',
	'application/xml',
	'text/xml',
] as const;

function decodedBase64ByteLength(value: string): number {
	const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
	return (value.length / 4) * 3 - padding;
}

const FileUploadFields = {
	file: z
		.string()
		.base64()
		.min(4)
		.max(MAX_FILE_BASE64_LENGTH)
		.refine(
			(value) => decodedBase64ByteLength(value) <= MAX_FILE_BYTES,
			'File must be no larger than 5 MiB',
		),
	fileName: z.string().min(1),
	contentType: z.enum(FileContentTypes),
};

function validateFileNameAndContentType(
	input: { fileName: string; contentType: (typeof FileContentTypes)[number] },
	ctx: z.RefinementCtx,
) {
	const extension = input.fileName.split('.').at(-1)?.toLowerCase();
	const expectedContentType = {
		pdf: 'application/pdf',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		xml: 'application/xml',
	}[extension ?? ''];
	const matchesXmlType =
		extension === 'xml' &&
		(input.contentType === 'application/xml' ||
			input.contentType === 'text/xml');
	if (expectedContentType !== input.contentType && !matchesXmlType) {
		ctx.addIssue({
			code: 'custom',
			message: 'fileName extension must match the documented contentType',
			path: ['contentType'],
		});
	}
}

export const FilesUploadInputSchema = z
	.object(FileUploadFields)
	.strict()
	.superRefine(validateFileNameAndContentType);
export type FilesUploadInput = z.infer<typeof FilesUploadInputSchema>;

export const VouchersAttachFileInputSchema = z
	.object({
		id: z.string().min(1, 'Voucher ID is required'),
		...FileUploadFields,
	})
	.strict()
	.superRefine(validateFileNameAndContentType);
export type VouchersAttachFileInput = z.infer<
	typeof VouchersAttachFileInputSchema
>;

export const FilesUploadResponseSchema = z.object({
	id: z.string(),
	voucherId: z.string(),
});
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;

export const VouchersAttachFileResponseSchema = z.object({ id: z.string() });
export type VouchersAttachFileResponse = z.infer<
	typeof VouchersAttachFileResponseSchema
>;

// ==========================================
// Credit Notes Schemas
// ==========================================

export const CreditNotesListInputSchema = z
	.object({
		voucherStatus: VoucherStatusFilterSchema.optional(),
		...VoucherListFilters,
	})
	.strict();
export type CreditNotesListInput = z.infer<typeof CreditNotesListInputSchema>;

export const CreditNoteSummarySchema = VoucherListResponseItemSchema;
export type CreditNoteSummary = z.infer<typeof CreditNoteSummarySchema>;

export const CreditNotesListResponseSchema = VoucherListResponseSchema;
export type CreditNotesListResponse = z.infer<
	typeof CreditNotesListResponseSchema
>;

export const CreditNotesGetInputSchema = z
	.object({
		id: z.string().min(1, 'Credit note ID is required'),
	})
	.strict();
export type CreditNotesGetInput = z.infer<typeof CreditNotesGetInputSchema>;

export const CreditNoteDetailsSchema = z.object({
	id: z.string(),
	organizationId: z.string().optional(),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	version: z.number(),
	language: z.string().optional(),
	archived: z.boolean().optional(),
	voucherStatus: z.string(),
	voucherNumber: z.string().nullable().optional(),
	voucherDate: z.string(),
	address: z
		.object({
			contactId: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			supplement: z.string().nullable().optional(),
			street: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			zip: z.string().nullable().optional(),
			countryCode: z.string().length(2).nullable().optional(),
			contactPerson: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
	electronicDocumentProfile: z.string().optional(),
	lineItems: z.array(LineItemSchema).optional(),
	totalPrice: z.object({
		currency: z.string(),
		totalNetAmount: z.number().nullable().optional(),
		totalGrossAmount: z.number().nullable().optional(),
		totalTaxAmount: z.number().nullable().optional(),
		totalDiscountAbsolute: z.number().nullable().optional(),
		totalDiscountPercentage: z.number().nullable().optional(),
	}),
	taxAmounts: z.array(TaxAmountSchema).optional(),
	taxConditions: z
		.object({
			taxType: z.string(),
			taxTypeNote: z.string().nullable().optional(),
			taxSubType: z.string().nullable().optional(),
		})
		.optional(),
	relatedVouchers: z.array(RelatedVoucherSchema).optional(),
	printLayoutId: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	introduction: z.string().nullable().optional(),
	remark: z.string().nullable().optional(),
	files: z
		.object({ documentFileId: z.string().nullable().optional() })
		.nullable()
		.optional(),
});
export type CreditNoteDetails = z.infer<typeof CreditNoteDetailsSchema>;

export const CreditNotesCreateInputSchema = CreditNoteCreateInputSchema;
export const CreditNotesRenderInputSchema = InvoicesRenderInputSchema;
export const CreditNotesRenderResponseSchema = InvoicesRenderResponseSchema;
export const CreditNotesDownloadInputSchema = SalesFileDownloadInputSchema;
export const InvoicesDownloadInputSchema = SalesFileDownloadInputSchema;
export type CreditNotesDownloadInput = SalesFileDownloadInput;
export type InvoicesDownloadInput = SalesFileDownloadInput;

export const DownPaymentInvoicesGetInputSchema = InvoicesGetInputSchema;
export type DownPaymentInvoicesGetInput = z.infer<
	typeof DownPaymentInvoicesGetInputSchema
>;
export const DownPaymentInvoiceDetailsSchema = InvoiceDetailsSchema.extend({
	closingInvoiceId: z.string().nullable().optional(),
});
export type DownPaymentInvoiceDetails = z.infer<
	typeof DownPaymentInvoiceDetailsSchema
>;
export const DownPaymentInvoicesDownloadInputSchema =
	SalesFileDownloadInputSchema;
export type DownPaymentInvoicesDownloadInput = SalesFileDownloadInput;

export const VoucherListListInputSchema = VoucherListInputSchema;
export const VoucherListListResponseSchema = VoucherListResponseSchema;
export const PaymentsGetResponseSchema = PaymentInformationSchema;
export const PostingCategoriesListOutputSchema =
	PostingCategoriesListResponseSchema;
export const FilesDownloadInputSchema = FileDownloadInputSchema;
export const FilesDownloadResponseSchema = FileDownloadResponseSchema;

// ==========================================
// Endpoint Schemas Mappings
// ==========================================

export const LexofficeEndpointInputSchemas = {
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsCreate: ContactCreateInputSchema,
	contactsUpdate: ContactUpdateInputSchema,
	voucherListList: VoucherListListInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	invoicesCreate: InvoiceCreateInputSchema,
	invoicesRender: InvoicesRenderInputSchema,
	invoicesDownload: InvoicesDownloadInputSchema,
	vouchersList: VouchersListInputSchema,
	vouchersGet: VouchersGetInputSchema,
	vouchersCreate: VoucherCreateInputSchema,
	vouchersUpdate: VoucherUpdateInputSchema,
	vouchersAttachFile: VouchersAttachFileInputSchema,
	profileGet: ProfileGetInputSchema,
	creditNotesList: CreditNotesListInputSchema,
	creditNotesGet: CreditNotesGetInputSchema,
	creditNotesCreate: CreditNotesCreateInputSchema,
	creditNotesRender: CreditNotesRenderInputSchema,
	creditNotesDownload: CreditNotesDownloadInputSchema,
	downPaymentInvoicesGet: DownPaymentInvoicesGetInputSchema,
	downPaymentInvoicesDownload: DownPaymentInvoicesDownloadInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	postingCategoriesList: PostingCategoriesListInputSchema,
	filesUpload: FilesUploadInputSchema,
	filesDownload: FilesDownloadInputSchema,
} as const;

export const LexofficeEndpointOutputSchemas = {
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactSchema,
	contactsCreate: ResourceMutationResponseSchema,
	contactsUpdate: ResourceMutationResponseSchema,
	voucherListList: VoucherListListResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesGet: InvoiceDetailsSchema,
	invoicesCreate: ResourceMutationResponseSchema,
	invoicesRender: InvoicesRenderResponseSchema,
	invoicesDownload: InvoicesFileDownloadResponseSchema,
	vouchersList: VouchersListResponseSchema,
	vouchersGet: VoucherDetailsSchema,
	vouchersCreate: ResourceMutationResponseSchema,
	vouchersUpdate: ResourceMutationResponseSchema,
	vouchersAttachFile: VouchersAttachFileResponseSchema,
	profileGet: ProfileGetResponseSchema,
	creditNotesList: CreditNotesListResponseSchema,
	creditNotesGet: CreditNoteDetailsSchema,
	creditNotesCreate: ResourceMutationResponseSchema,
	creditNotesRender: CreditNotesRenderResponseSchema,
	creditNotesDownload: CreditNotesFileDownloadResponseSchema,
	downPaymentInvoicesGet: DownPaymentInvoiceDetailsSchema,
	downPaymentInvoicesDownload: DownPaymentInvoicesFileDownloadResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	postingCategoriesList: PostingCategoriesListOutputSchema,
	filesUpload: FilesUploadResponseSchema,
	filesDownload: FilesDownloadResponseSchema,
} as const;

export type LexofficeEndpointInputs = {
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsCreate: ContactCreateInput;
	contactsUpdate: ContactUpdateInput;
	voucherListList: VoucherListInput;
	invoicesList: InvoicesListInput;
	invoicesGet: InvoicesGetInput;
	invoicesCreate: InvoiceCreateInput;
	invoicesRender: InvoicesRenderInput;
	invoicesDownload: SalesFileDownloadInput;
	vouchersList: VouchersListInput;
	vouchersGet: VouchersGetInput;
	vouchersCreate: VoucherCreateInput;
	vouchersUpdate: VoucherUpdateInput;
	vouchersAttachFile: VouchersAttachFileInput;
	profileGet: ProfileGetInput;
	creditNotesList: CreditNotesListInput;
	creditNotesGet: CreditNotesGetInput;
	creditNotesCreate: CreditNoteCreateInput;
	creditNotesRender: InvoicesRenderInput;
	creditNotesDownload: SalesFileDownloadInput;
	downPaymentInvoicesGet: DownPaymentInvoicesGetInput;
	downPaymentInvoicesDownload: SalesFileDownloadInput;
	paymentsGet: PaymentsGetInput;
	postingCategoriesList: PostingCategoriesListInput;
	filesUpload: FilesUploadInput;
	filesDownload: FileDownloadInput;
};

export type LexofficeEndpointOutputs = {
	contactsList: ContactsListResponse;
	contactsGet: Contact;
	contactsCreate: ResourceMutationResponse;
	contactsUpdate: ResourceMutationResponse;
	voucherListList: VoucherListResponse;
	invoicesList: InvoicesListResponse;
	invoicesGet: InvoiceDetails;
	invoicesCreate: ResourceMutationResponse;
	invoicesRender: InvoicesRenderResponse;
	invoicesDownload: FileDownloadResponse;
	vouchersList: VouchersListResponse;
	vouchersGet: VoucherDetails;
	vouchersCreate: ResourceMutationResponse;
	vouchersUpdate: ResourceMutationResponse;
	vouchersAttachFile: VouchersAttachFileResponse;
	profileGet: ProfileGetResponse;
	creditNotesList: CreditNotesListResponse;
	creditNotesGet: CreditNoteDetails;
	creditNotesCreate: ResourceMutationResponse;
	creditNotesRender: InvoicesRenderResponse;
	creditNotesDownload: FileDownloadResponse;
	downPaymentInvoicesGet: DownPaymentInvoiceDetails;
	downPaymentInvoicesDownload: FileDownloadResponse;
	paymentsGet: PaymentInformation;
	postingCategoriesList: PostingCategory[];
	filesUpload: FilesUploadResponse;
	filesDownload: FileDownloadResponse;
};

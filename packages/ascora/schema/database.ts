import { z } from 'zod';

/**
 * Local cache of Ascora entities.
 * Field names match official Ascora API v1.7:
 * https://www.ascora.com.au/Assets/Guides/AscoraApiGuide.pdf
 */

const EntityLink = z
	.object({
		/** Official entity link `id`. */
		id: z.string().nullable().optional(),
		/** Official entity link `name`. */
		name: z.string().nullable().optional(),
	})
	.loose();

/**
 * Customer from GET /Customers/Customer/{id} and GET /Customers/Customers.
 * Official: customer object.
 */
export const AscoraCustomer = z.object({
	/** Official `customerId`. */
	customerId: z.string(),
	/** Official `customerNumber`. */
	customerNumber: z.string().nullable().optional(),
	/** Official `customerName`. */
	customerName: z.string().nullable().optional(),
	/** Official `companyName`. */
	companyName: z.string().nullable().optional(),
	/** Official `contactFirstName`. */
	contactFirstName: z.string().nullable().optional(),
	/** Official `contactLastName`. */
	contactLastName: z.string().nullable().optional(),
	/** Official `emailAddress`. */
	emailAddress: z.string().nullable().optional(),
	/** Official `phoneNumber`. */
	phoneNumber: z.string().nullable().optional(),
	/** Official `mobileNumber`. */
	mobileNumber: z.string().nullable().optional(),
	/** Official `onHold`. */
	onHold: z.boolean().optional(),
	/** Official `streetLine1`. */
	streetLine1: z.string().nullable().optional(),
	/** Official `streetSuburb`. */
	streetSuburb: z.string().nullable().optional(),
	/** Official `streetPostcode`. */
	streetPostcode: z.string().nullable().optional(),
	/** Official `streetState`. */
	streetState: z.string().nullable().optional(),
	/** Official `streetCountry`. */
	streetCountry: z.string().nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Contact from GET /Customers/Contact/{id} and POST /Customers/Contact.
 * Official: contact object.
 */
export const AscoraContact = z.object({
	/** Official `contactId`. */
	contactId: z.string(),
	/** Official `customerId`. */
	customerId: z.string().nullable().optional(),
	/** Official `firstName`. */
	firstName: z.string().nullable().optional(),
	/** Official `lastName`. */
	lastName: z.string().nullable().optional(),
	/** Official `emailAddress`. */
	emailAddress: z.string().nullable().optional(),
	/** Official `phoneNumber`. */
	phoneNumber: z.string().nullable().optional(),
	/** Official `mobileNumber`. */
	mobileNumber: z.string().nullable().optional(),
	/** Official `defaultContact`. */
	defaultContact: z.boolean().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Job from GET /Jobs/Job/{JobNumber} and GET /Jobs/Jobs.
 * Official: job object.
 */
export const AscoraJob = z.object({
	/** Official `jobId`. */
	jobId: z.string(),
	/** Official `jobNumber`. */
	jobNumber: z.string().nullable().optional(),
	/** Official `jobName`. */
	jobName: z.string().nullable().optional(),
	/** Official `jobStatus`. New=0 InProgress=1 Completed=2 Cancelled=3 Deferred=4 Booked=5 Unscheduled=6 ReadyToInvoice=7 Closed=8. */
	jobStatus: z.number().optional(),
	/** Official `jobStatusText`. */
	jobStatusText: z.string().nullable().optional(),
	/** Official `dateCreated`. */
	dateCreated: z.string().nullable().optional(),
	/** Official `pricingMethod`. TIME-AND-MATERIALS | FIXED-PRICE | SECTIONS | STAGES. */
	pricingMethod: z.string().nullable().optional(),
	/** Official `totalIncTax`. */
	totalIncTax: z.number().optional(),
	/** Official `siteCustomer`. */
	siteCustomer: EntityLink.nullable().optional(),
	/** Official `billingCustomer`. */
	billingCustomer: EntityLink.nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Quote from GET /Quotes/Quotes and POST /Quotes/Quote.
 * Official: quotation object.
 */
export const AscoraQuote = z.object({
	/** Official `quoteId`. */
	quoteId: z.string(),
	/** Official `quoteNumber`. */
	quoteNumber: z.string().nullable().optional(),
	/** Official `quoteName`. */
	quoteName: z.string().nullable().optional(),
	/** Official `quoteStatus`. 0 In Progress, 1 Lost, 2 Converted to Job, 3 Sent to Client. */
	quoteStatus: z.number().optional(),
	/** Official `quotationDate`. */
	quotationDate: z.string().nullable().optional(),
	/** Official `totalIncTax`. */
	totalIncTax: z.number().optional(),
	/** Official `pricingMethod`. */
	pricingMethod: z.string().nullable().optional(),
	/** Official `siteCustomer`. */
	siteCustomer: EntityLink.nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Supply from GET /Inventory/Supplies.
 * Official: supply item.
 */
export const AscoraSupply = z.object({
	/** Official `supplyId`. */
	supplyId: z.string(),
	/** Official `partNumber`. */
	partNumber: z.string().nullable().optional(),
	/** Official `description`. */
	description: z.string().nullable().optional(),
	/** Official `unitCostExTax`. */
	unitCostExTax: z.number().optional(),
	/** Official `unitSellExTax`. */
	unitSellExTax: z.number().optional(),
	/** Official `unitSellIncTax`. */
	unitSellIncTax: z.number().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Kit from GET /Inventory/Kits.
 * Official: kit item.
 */
export const AscoraKit = z.object({
	/** Official `kitId`. */
	kitId: z.string(),
	/** Official `partNumber`. */
	partNumber: z.string().nullable().optional(),
	/** Official `description`. */
	description: z.string().nullable().optional(),
	/** Official `unitSellExTax`. */
	unitSellExTax: z.number().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Inventory category from GET /Inventory/Categories.
 * Official: category.
 */
export const AscoraInventoryCategory = z.object({
	/** Official `categoryId`. */
	categoryId: z.string(),
	/** Official `name`. */
	name: z.string().nullable().optional(),
	/** Official `categoryNumber`. 1 or 2. */
	categoryNumber: z.number().optional(),
	/** Official `parentCategoryId`. */
	parentCategoryId: z.string().nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Supplier from GET /Suppliers/Supplier/{id} and GET /Suppliers/Suppliers.
 * Official: supplier object.
 */
export const AscoraSupplier = z.object({
	/** Official `supplierId`. */
	supplierId: z.string(),
	/** Official `name`. */
	name: z.string().nullable().optional(),
	/** Official `businessNumber`. */
	businessNumber: z.string().nullable().optional(),
	/** Official `emailAddress`. */
	emailAddress: z.string().nullable().optional(),
	/** Official `phone`. */
	phone: z.string().nullable().optional(),
	/** Official `mobile`. */
	mobile: z.string().nullable().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Supplier invoice from GET /SupplierInvoices/SupplierInvoices.
 * Official: supplierInvoice object.
 */
export const AscoraSupplierInvoice = z.object({
	/** Official `supplierInvoiceId`. */
	supplierInvoiceId: z.string(),
	/** Official `trackingNumber`. */
	trackingNumber: z.string().nullable().optional(),
	/** Official `invoiceDate`. */
	invoiceDate: z.string().nullable().optional(),
	/** Official `dueDate`. */
	dueDate: z.string().nullable().optional(),
	/** Official `type`. INVOICE | CREDIT. */
	type: z.string().nullable().optional(),
	/** Official `totalAmountIncTax`. */
	totalAmountIncTax: z.number().optional(),
	/** Official `sentToAccounts`. */
	sentToAccounts: z.boolean().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Labour role from GET /Quotes/LabourRoles.
 * Official: labour role.
 */
export const AscoraLabourRole = z.object({
	/** Official `labourRoleId`. */
	labourRoleId: z.string(),
	/** Official `name`. */
	name: z.string().nullable().optional(),
	/** Official `hourlyRateExTax`. */
	hourlyRateExTax: z.number().optional(),
	checkedAt: z.coerce.date().nullable().optional(),
});

import {
	HarvestClientEntity,
	HarvestCompanyEntity,
	HarvestContactEntity,
	HarvestEstimateEntity,
	HarvestExpenseCategoryEntity,
	HarvestInvoiceEntity,
	HarvestInvoiceItemCategoryEntity,
	HarvestProjectEntity,
	HarvestTaskEntity,
	HarvestUserEntity,
} from './database';

export const HarvestSchema = {
	version: '1.0.0',
	entities: {
		clients: HarvestClientEntity,
		contacts: HarvestContactEntity,
		projects: HarvestProjectEntity,
		tasks: HarvestTaskEntity,
		users: HarvestUserEntity,
		invoices: HarvestInvoiceEntity,
		estimates: HarvestEstimateEntity,
		expenseCategories: HarvestExpenseCategoryEntity,
		invoiceItemCategories: HarvestInvoiceItemCategoryEntity,
		company: HarvestCompanyEntity,
	},
} as const;

export * from './database';

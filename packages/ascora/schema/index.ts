import {
	AscoraContact,
	AscoraCustomer,
	AscoraInventoryCategory,
	AscoraJob,
	AscoraKit,
	AscoraLabourRole,
	AscoraQuote,
	AscoraSupplier,
	AscoraSupplierInvoice,
	AscoraSupply,
} from './database';

export const AscoraSchema = {
	version: '1.0.0',
	entities: {
		customers: AscoraCustomer,
		contacts: AscoraContact,
		jobs: AscoraJob,
		quotes: AscoraQuote,
		supplies: AscoraSupply,
		kits: AscoraKit,
		inventoryCategories: AscoraInventoryCategory,
		suppliers: AscoraSupplier,
		supplierInvoices: AscoraSupplierInvoice,
		labourRoles: AscoraLabourRole,
	},
} as const;

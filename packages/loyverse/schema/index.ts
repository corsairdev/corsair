import {
	LoyverseCategoryEntity,
	LoyverseCustomerEntity,
	LoyverseDiscountEntity,
	LoyverseEmployeeEntity,
	LoyverseItemEntity,
	LoyverseMerchantEntity,
	LoyverseModifierEntity,
	LoyversePaymentTypeEntity,
	LoyversePosDeviceEntity,
	LoyverseStoreEntity,
	LoyverseSupplierEntity,
	LoyverseTaxEntity,
	LoyverseVariantEntity,
} from './database';

export const LoyverseSchema = {
	version: '1.0.0',
	entities: {
		items: LoyverseItemEntity,
		variants: LoyverseVariantEntity,
		categories: LoyverseCategoryEntity,
		modifiers: LoyverseModifierEntity,
		discounts: LoyverseDiscountEntity,
		taxes: LoyverseTaxEntity,
		customers: LoyverseCustomerEntity,
		suppliers: LoyverseSupplierEntity,
		stores: LoyverseStoreEntity,
		employees: LoyverseEmployeeEntity,
		paymentTypes: LoyversePaymentTypeEntity,
		posDevices: LoyversePosDeviceEntity,
		merchant: LoyverseMerchantEntity,
	},
} as const;

export * from './database';

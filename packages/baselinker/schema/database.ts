import { z } from 'zod';

const BaseLinkerEntityId = z.union([z.string(), z.number()]);

export const BaseLinkerInventory = z
	.object({
		inventory_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerInventory = z.infer<typeof BaseLinkerInventory>;

export const BaseLinkerCategory = z
	.object({
		category_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerCategory = z.infer<typeof BaseLinkerCategory>;

export const BaseLinkerManufacturer = z
	.object({
		manufacturer_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerManufacturer = z.infer<typeof BaseLinkerManufacturer>;

export const BaseLinkerPriceGroup = z
	.object({
		price_group_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerPriceGroup = z.infer<typeof BaseLinkerPriceGroup>;

export const BaseLinkerWarehouse = z
	.object({
		warehouse_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerWarehouse = z.infer<typeof BaseLinkerWarehouse>;

export const BaseLinkerSupplier = z
	.object({
		supplier_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerSupplier = z.infer<typeof BaseLinkerSupplier>;

export const BaseLinkerPayer = z
	.object({
		payer_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerPayer = z.infer<typeof BaseLinkerPayer>;

export const BaseLinkerTag = z
	.object({
		tag_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerTag = z.infer<typeof BaseLinkerTag>;

export const BaseLinkerInventoryExtraField = z
	.object({
		extra_field_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerInventoryExtraField = z.infer<
	typeof BaseLinkerInventoryExtraField
>;

export const BaseLinkerOrderStatus = z
	.object({
		id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerOrderStatus = z.infer<typeof BaseLinkerOrderStatus>;

export const BaseLinkerReturnStatus = z
	.object({
		id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerReturnStatus = z.infer<typeof BaseLinkerReturnStatus>;

export const BaseLinkerReturnReason = z
	.object({
		return_reason_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerReturnReason = z.infer<typeof BaseLinkerReturnReason>;

export const BaseLinkerReturnProductStatus = z
	.object({
		status_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerReturnProductStatus = z.infer<
	typeof BaseLinkerReturnProductStatus
>;

export const BaseLinkerCourier = z
	.object({
		code: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerCourier = z.infer<typeof BaseLinkerCourier>;

export const BaseLinkerExternalStorage = z
	.object({
		storage_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerExternalStorage = z.infer<
	typeof BaseLinkerExternalStorage
>;

export const BaseLinkerConnectIntegration = z
	.object({
		connect_integration_id: BaseLinkerEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();
export type BaseLinkerConnectIntegration = z.infer<
	typeof BaseLinkerConnectIntegration
>;

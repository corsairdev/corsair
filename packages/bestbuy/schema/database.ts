import { z } from 'zod';

/**
 * Field names match official Remix JSON keys.
 * https://bestbuyapis.github.io/api-documentation/
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();
const SN = z.union([z.string(), z.number()]).nullable().optional();

const CategoryNode = z
	.object({
		id: S,
		name: S,
	})
	.loose();

const SkuRef = z
	.object({
		sku: SN,
	})
	.loose();

/**
 * Product attributes from Products API sections:
 * Detail, Prop 65, Pricing, Availability, Shipping, Images, Links,
 * Categorizations, Offers, Listing Products.
 */
export const BestBuyProductEntity = z
	.object({
		sku: SN,
		name: S,
		upc: S,
		manufacturer: S,
		modelNumber: S,
		color: S,
		condition: S,
		description: S,
		longDescription: S,
		longDescriptionHtml: S,
		shortDescription: S,
		shortDescriptionHtml: S,
		customerReviewAverage: N,
		customerReviewCount: N,
		customerTopRated: B,
		depth: S,
		height: S,
		width: S,
		weight: S,
		digital: B,
		format: S,
		preowned: B,
		quantityLimit: N,
		releaseDate: S,
		warrantyLabor: S,
		warrantyParts: S,
		accessories: z.array(SkuRef).nullable().optional(),
		details: z
			.array(z.object({ name: S, value: S }).loose())
			.nullable()
			.optional(),
		features: z
			.array(z.object({ feature: S }).loose())
			.nullable()
			.optional(),
		includedItemList: z
			.array(z.object({ includedItem: S }).loose())
			.nullable()
			.optional(),
		productVariations: z.array(SkuRef).nullable().optional(),
		proposition65WarningMessage: S,
		proposition65WarningType: S,
		dollarSavings: N,
		lowPriceGuarantee: B,
		onSale: B,
		percentSavings: S,
		priceRestriction: S,
		priceUpdateDate: S,
		regularPrice: N,
		salePrice: N,
		contracts: z.array(z.object({}).loose()).nullable().optional(),
		priceWithPlan: z.object({}).loose().nullable().optional(),
		friendsAndFamilyPickup: B,
		homeDelivery: B,
		inStoreAvailability: B,
		inStoreAvailabilityUpdateDate: S,
		inStorePickup: B,
		onlineAvailability: B,
		onlineAvailabilityUpdateDate: S,
		orderable: S,
		specialOrder: B,
		freeShipping: B,
		freeShippingEligible: B,
		shippingCost: N,
		shippingWeight: N,
		shippingLevelsOfService: z
			.array(
				z
					.object({
						serviceLevelId: N,
						serviceLevelName: S,
						unitShippingPrice: N,
					})
					.loose(),
			)
			.nullable()
			.optional(),
		accessoriesImage: S,
		alternateViewsImage: S,
		angleImage: S,
		backViewImage: S,
		energyGuideImage: S,
		image: S,
		largeFrontImage: S,
		largeImage: S,
		leftViewImage: S,
		mediumImage: S,
		remoteControlImage: S,
		rightViewImage: S,
		spin360Url: S,
		thumbnailImage: S,
		topViewImage: S,
		addToCartUrl: S,
		url: S,
		affiliateAddToCartUrl: S,
		affiliateUrl: S,
		class: S,
		classId: N,
		department: S,
		departmentId: N,
		subclass: S,
		subclassId: N,
		categoryPath: z.array(CategoryNode).nullable().optional(),
		lists: z
			.array(
				z
					.object({
						endDate: S,
						listId: S,
						startDate: S,
					})
					.loose(),
			)
			.nullable()
			.optional(),
		offers: z
			.array(
				z
					.object({
						endDate: S,
						id: S,
						startDate: S,
						text: S,
						type: S,
						url: S,
					})
					.loose(),
			)
			.nullable()
			.optional(),
		active: B,
		activeUpdateDate: S,
		bundledIn: z.array(SkuRef).nullable().optional(),
		itemUpdateDate: S,
		members: z.array(SkuRef).nullable().optional(),
		new: B,
		secondaryMarket: B,
		startDate: S,
		type: S,
	})
	.loose();
export type BestBuyProductEntity = z.infer<typeof BestBuyProductEntity>;

/** Categories API common attributes. */
export const BestBuyCategoryEntity = z
	.object({
		id: S,
		name: S,
		url: S,
		path: z.array(CategoryNode).nullable().optional(),
		subCategories: z.array(CategoryNode).nullable().optional(),
	})
	.loose();
export type BestBuyCategoryEntity = z.infer<typeof BestBuyCategoryEntity>;

/** Stores API common, hours, and services attributes. */
export const BestBuyStoreEntity = z
	.object({
		storeId: N,
		name: S,
		longName: S,
		address: S,
		address2: S,
		city: S,
		region: S,
		postalCode: S,
		fullPostalCode: S,
		country: S,
		lat: N,
		lng: N,
		distance: N,
		location: S,
		locationType: S,
		storeType: S,
		phone: S,
		hours: S,
		hoursAmPm: S,
		gmtOffset: N,
		detailedHours: z
			.array(
				z
					.object({
						day: S,
						date: S,
						open: S,
						close: S,
					})
					.loose(),
			)
			.nullable()
			.optional(),
		services: z
			.array(z.object({ service: S }).loose())
			.nullable()
			.optional(),
	})
	.loose();
export type BestBuyStoreEntity = z.infer<typeof BestBuyStoreEntity>;

/**
 * Reviews API document fields used by `/v1/reviews`.
 * @see https://bestbuyapis.github.io/api-documentation/
 */
export const BestBuyReviewEntity = z
	.object({
		id: SN,
		sku: SN,
		title: S,
		comment: S,
		rating: N,
		submissionTime: S,
		recommended: B,
		qualityRating: N,
		valueRating: N,
		easeOfUseRating: N,
		reviewer: z
			.union([
				z.object({ name: S }).loose(),
				z.array(z.object({ name: S }).loose()),
			])
			.nullable()
			.optional(),
	})
	.loose();
export type BestBuyReviewEntity = z.infer<typeof BestBuyReviewEntity>;

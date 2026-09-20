import { z } from 'zod';

/**
 * Uniqode Organization.
 * Official: GET /api/2.0/organizations/
 * https://apidocs.uniqode.com/ · data-model key_fields
 */
export const BeaconstacOrganization = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		parent: z.number().nullable().optional(),
		reseller_access: z.boolean().optional(),
		whitelabel_access: z.boolean().optional(),
		custom_domain: z.string().nullable().optional(),
		cname: z.string().nullable().optional(),
		feature_permissions: z.unknown().optional(),
		domains: z.unknown().optional(),
		ga_code: z.string().nullable().optional(),
		fb_pixel_id: z.string().nullable().optional(),
		google_conversion_id: z.string().nullable().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.loose();

export type BeaconstacOrganization = z.infer<typeof BeaconstacOrganization>;

/**
 * Uniqode User.
 * Official: GET /api/2.0/users/{id}/
 * https://apidocs.uniqode.com/
 */
export const BeaconstacUser = z
	.object({
		id: z.number().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		username: z.string().optional(),
		user_group: z.string().optional(),
		customer_plan: z.string().optional(),
		subscription_state: z.string().optional(),
		is_active: z.boolean().optional(),
		stripe_id: z.string().nullable().optional(),
		timezone: z.string().optional(),
		organization: z.number().optional(),
		last_login: z.string().nullable().optional(),
		date_joined: z.string().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.loose();

export type BeaconstacUser = z.infer<typeof BeaconstacUser>;

/**
 * Uniqode QR Code (static qr_type=1, dynamic qr_type=2).
 * Official: GET /api/2.0/qrcodes/{id}/
 * https://docs.uniqode.com/en/articles/6725065-introduction-to-uniqode-s-qr-code-api
 */
export const BeaconstacQrCode = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		qr_type: z.number().optional(),
		url: z.string().optional(),
		state: z.string().optional(),
		organization: z.number().optional(),
		place: z.number().nullable().optional(),
		maintainer: z.number().nullable().optional(),
		tags: z.array(z.number()).optional(),
		template: z.number().nullable().optional(),
		campaign: z.unknown().optional(),
		attributes: z.unknown().optional(),
		fields_data: z.unknown().optional(),
		view_limit: z.number().nullable().optional(),
		domain: z.number().optional(),
		location_enabled: z.boolean().optional(),
		password: z.boolean().optional(),
		meta: z.unknown().optional(),
		additional_params: z.unknown().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
		heartbeat: z.string().nullable().optional(),
	})
	.loose();

export type BeaconstacQrCode = z.infer<typeof BeaconstacQrCode>;

/**
 * Uniqode QR Code template.
 * Official: GET /api/2.0/qrtemplates/{id}/
 * https://apidocs.uniqode.com/
 */
export const BeaconstacQrTemplate = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		default: z.boolean().optional(),
		organization: z.number().optional(),
		maintainer: z.number().nullable().optional(),
		meta: z.unknown().optional(),
		margin: z.number().optional(),
		dotScale: z.number().optional(),
		dataPattern: z.string().optional(),
		colorDark: z.string().optional(),
		colorLight: z.string().optional(),
		gradientType: z.string().optional(),
		eyeBallShape: z.string().optional(),
		eyeFrameShape: z.string().optional(),
		logoImage: z.string().optional(),
		backgroundImage: z.string().optional(),
		frameStyle: z.string().optional(),
		frameText: z.string().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.loose();

export type BeaconstacQrTemplate = z.infer<typeof BeaconstacQrTemplate>;

/**
 * Uniqode Tag.
 * Official: GET /api/2.0/tags/{id}/
 * https://apidocs.uniqode.com/
 */
export const BeaconstacTag = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		color: z.string().optional(),
		organization: z.number().optional(),
		maintainer: z.number().nullable().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.loose();

export type BeaconstacTag = z.infer<typeof BeaconstacTag>;

/**
 * Uniqode Place.
 * Official: GET /api/2.0/places/{id}/
 * https://apidocs.uniqode.com/
 */
export const BeaconstacPlace = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		organization: z.number().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		place_id: z.string().optional(),
		address: z.string().optional(),
		beacons: z.unknown().optional(),
		beacon_count: z.number().optional(),
		default_place: z.boolean().optional(),
		business_icon_url: z.string().optional(),
		business_cover_url: z.string().optional(),
		business_color: z.string().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.loose();

export type BeaconstacPlace = z.infer<typeof BeaconstacPlace>;

/**
 * Uniqode Bulk QR Code collection (legacy list surface).
 * Official: GET /api/2.0/bulkqrcodes/
 * https://apidocs.uniqode.com/
 */
export const BeaconstacBulkQrCode = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		attributes: z.unknown().optional(),
		qr_type: z.number().optional(),
		qr_data_type: z.number().optional(),
		organization: z.number().optional(),
		storage_url: z.string().optional(),
		media: z.number().nullable().optional(),
		media_data: z.unknown().optional(),
		maintainer: z.number().nullable().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.loose();

export type BeaconstacBulkQrCode = z.infer<typeof BeaconstacBulkQrCode>;

import { z } from 'zod';

/**
 * Users table row returned by registration, login, update, and find.
 *
 * Official REST: POST /api/users/register, POST /api/users/login,
 * PUT /api/users/<objectId>, GET /api/data/Users/<objectId>
 * https://backendless.com/docs/rest/users_user_registration.html
 * https://backendless.com/docs/rest/users_login.html
 * https://backendless.com/docs/rest/users_about_user_properties.html
 */
export const BackendlessUser = z
	.object({
		/** Unique user id. Official: `objectId`. */
		objectId: z.string(),
		/** Default identity column. Official: `email`. */
		email: z.string().optional(),
		/** Table name. Official: `___class`. */
		___class: z.string().optional(),
		/** Create time in ms. Official: `created`. */
		created: z.number().optional(),
		/** Update time in ms. Official: `updated`. */
		updated: z.number().nullable().optional(),
		/** Owner user id. Official: `ownerId`. */
		ownerId: z.string().nullable().optional(),
		/** Session token on login. Official: `user-token`. */
		'user-token': z.string().optional(),
	})
	.loose();

export type BackendlessUser = z.infer<typeof BackendlessUser>;

/**
 * File or directory listing entry.
 *
 * Official REST: GET /api/files/<path>
 * https://backendless.com/docs/rest/file_directory_listing.html
 */
export const BackendlessFile = z
	.object({
		/** File or directory name. Official: `name`. */
		name: z.string(),
		/** Create time in ms. Official: `createdOn`. */
		createdOn: z.number().optional(),
		/** Absolute public URL. Official: `publicUrl`. */
		publicUrl: z.string().optional(),
		/** Size in bytes. Official: `size`. */
		size: z.number().optional(),
		/** Path from file-storage root. Official: `url`. */
		url: z.string().optional(),
	})
	.loose();

export type BackendlessFile = z.infer<typeof BackendlessFile>;

/**
 * Data object from any table, including system `Users`.
 *
 * Official REST: GET /api/data/<table-name> and GET /api/data/<table-name>/<object-id>
 * https://backendless.com/docs/rest/data_basic_search.html
 */
export const BackendlessDataObject = z
	.object({
		/** Unique object id. Official: `objectId`. */
		objectId: z.string().optional(),
		/** Table name. Official: `___class`. */
		___class: z.string().optional(),
		/** Create time in ms. Official: `created`. */
		created: z.number().optional(),
		/** Update time in ms. Official: `updated`. */
		updated: z.number().nullable().optional(),
		/** Owner user id. Official: `ownerId`. */
		ownerId: z.string().nullable().optional(),
	})
	.loose();

export type BackendlessDataObject = z.infer<typeof BackendlessDataObject>;

/**
 * Publish status returned by messaging.
 *
 * Official REST: POST /api/messaging/<channel>
 * https://backendless.com/docs/rest/pubsub_basic_publish.html
 */
export const BackendlessMessageStatus = z
	.object({
		/** Delivery error, if any. Official: `errorMessage`. */
		errorMessage: z.string().nullable().optional(),
		/** Unique message id. Official: `messageId`. */
		messageId: z.string(),
		/** Delivery status. Official: `status`. */
		status: z.string(),
	})
	.loose();

export type BackendlessMessageStatus = z.infer<typeof BackendlessMessageStatus>;

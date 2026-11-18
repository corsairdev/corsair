// Generated from Pipedrive's official v1/v2 OpenAPI contracts; do not hand-edit route schemas.
import { z } from 'zod';

export const PipedriveCatalog = {
	'apiV1.activityFields.getActivityFields': {
		version: 'v1',
		method: 'GET',
		path: '/activityFields',
		group: 'activityFields',
		operationId: 'getActivityFields',
		summary: 'Get all activity fields',
		tokenCost: 20,
		oauthScopes: ['activities:read', 'activities:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().nullable().optional(),
								key: z.string().optional(),
								name: z.string().optional(),
								order_nr: z.number().int().optional(),
								field_type: z
									.union([
										z.literal('boolean'),
										z.literal('double'),
										z.literal('int'),
										z.literal('json'),
										z.literal('date'),
										z.literal('daterange'),
										z.literal('time'),
										z.literal('timerange'),
										z.literal('text'),
										z.literal('varchar'),
										z.literal('varchar_auto'),
										z.literal('varchar_options'),
										z.literal('address'),
										z.literal('enum'),
										z.literal('monetary'),
										z.literal('phone'),
										z.literal('set'),
										z.literal('activity'),
										z.literal('deal'),
										z.literal('lead'),
										z.literal('org'),
										z.literal('people'),
										z.literal('pipeline'),
										z.literal('product'),
										z.literal('project'),
										z.literal('stage'),
										z.literal('user'),
										z.literal('billing_frequency'),
										z.literal('picture'),
										z.literal('price_list'),
										z.literal('projects_board'),
										z.literal('projects_phase'),
										z.literal('status'),
										z.literal('visible_to'),
									])
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								last_updated_by_user_id: z.number().int().nullable().optional(),
								created_by_user_id: z.number().int().nullable().optional(),
								active_flag: z.boolean().optional(),
								edit_flag: z.boolean().optional(),
								index_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								add_visible_flag: z.boolean().optional(),
								important_flag: z.boolean().optional(),
								bulk_edit_allowed: z.boolean().optional(),
								searchable_flag: z.boolean().optional(),
								filtering_allowed: z.boolean().optional(),
								sortable_flag: z.boolean().optional(),
								mandatory_flag: z.boolean().optional(),
								options: z
									.array(z.object({}).passthrough())
									.nullable()
									.optional(),
								options_deleted: z.array(z.object({}).passthrough()).optional(),
								is_subfield: z.boolean().optional(),
								subfields: z.array(z.object({}).passthrough()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.activityTypes.getActivityTypes': {
		version: 'v1',
		method: 'GET',
		path: '/activityTypes',
		group: 'activityTypes',
		operationId: 'getActivityTypes',
		summary: 'Get all activity types',
		tokenCost: 20,
		oauthScopes: ['activities:read', 'activities:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								icon_key: z
									.union([
										z.literal('task'),
										z.literal('email'),
										z.literal('meeting'),
										z.literal('deadline'),
										z.literal('call'),
										z.literal('lunch'),
										z.literal('calendar'),
										z.literal('downarrow'),
										z.literal('document'),
										z.literal('smartphone'),
										z.literal('camera'),
										z.literal('scissors'),
										z.literal('cogs'),
										z.literal('bubble'),
										z.literal('uparrow'),
										z.literal('checkbox'),
										z.literal('signpost'),
										z.literal('shuffle'),
										z.literal('addressbook'),
										z.literal('linegraph'),
										z.literal('picture'),
										z.literal('car'),
										z.literal('world'),
										z.literal('search'),
										z.literal('clip'),
										z.literal('sound'),
										z.literal('brush'),
										z.literal('key'),
										z.literal('padlock'),
										z.literal('pricetag'),
										z.literal('suitcase'),
										z.literal('finish'),
										z.literal('plane'),
										z.literal('loop'),
										z.literal('wifi'),
										z.literal('truck'),
										z.literal('cart'),
										z.literal('bulb'),
										z.literal('bell'),
										z.literal('presentation'),
									])
									.optional(),
								color: z.string().optional(),
								order_nr: z.number().int().optional(),
								key_string: z.string().optional(),
								active_flag: z.boolean().optional(),
								is_custom_flag: z.boolean().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.activityTypes.addActivityType': {
		version: 'v1',
		method: 'POST',
		path: '/activityTypes',
		group: 'activityTypes',
		operationId: 'addActivityType',
		summary: 'Add new activity type',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					icon_key: z.union([
						z.literal('task'),
						z.literal('email'),
						z.literal('meeting'),
						z.literal('deadline'),
						z.literal('call'),
						z.literal('lunch'),
						z.literal('calendar'),
						z.literal('downarrow'),
						z.literal('document'),
						z.literal('smartphone'),
						z.literal('camera'),
						z.literal('scissors'),
						z.literal('cogs'),
						z.literal('bubble'),
						z.literal('uparrow'),
						z.literal('checkbox'),
						z.literal('signpost'),
						z.literal('shuffle'),
						z.literal('addressbook'),
						z.literal('linegraph'),
						z.literal('picture'),
						z.literal('car'),
						z.literal('world'),
						z.literal('search'),
						z.literal('clip'),
						z.literal('sound'),
						z.literal('brush'),
						z.literal('key'),
						z.literal('padlock'),
						z.literal('pricetag'),
						z.literal('suitcase'),
						z.literal('finish'),
						z.literal('plane'),
						z.literal('loop'),
						z.literal('wifi'),
						z.literal('truck'),
						z.literal('cart'),
						z.literal('bulb'),
						z.literal('bell'),
						z.literal('presentation'),
					]),
					color: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						icon_key: z
							.union([
								z.literal('task'),
								z.literal('email'),
								z.literal('meeting'),
								z.literal('deadline'),
								z.literal('call'),
								z.literal('lunch'),
								z.literal('calendar'),
								z.literal('downarrow'),
								z.literal('document'),
								z.literal('smartphone'),
								z.literal('camera'),
								z.literal('scissors'),
								z.literal('cogs'),
								z.literal('bubble'),
								z.literal('uparrow'),
								z.literal('checkbox'),
								z.literal('signpost'),
								z.literal('shuffle'),
								z.literal('addressbook'),
								z.literal('linegraph'),
								z.literal('picture'),
								z.literal('car'),
								z.literal('world'),
								z.literal('search'),
								z.literal('clip'),
								z.literal('sound'),
								z.literal('brush'),
								z.literal('key'),
								z.literal('padlock'),
								z.literal('pricetag'),
								z.literal('suitcase'),
								z.literal('finish'),
								z.literal('plane'),
								z.literal('loop'),
								z.literal('wifi'),
								z.literal('truck'),
								z.literal('cart'),
								z.literal('bulb'),
								z.literal('bell'),
								z.literal('presentation'),
							])
							.optional(),
						color: z.string().optional(),
						order_nr: z.number().int().optional(),
						key_string: z.string().optional(),
						active_flag: z.boolean().optional(),
						is_custom_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.activityTypes.deleteActivityType': {
		version: 'v1',
		method: 'DELETE',
		path: '/activityTypes/{id}',
		group: 'activityTypes',
		operationId: 'deleteActivityType',
		summary: 'Delete an activity type',
		tokenCost: 6,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						icon_key: z
							.union([
								z.literal('task'),
								z.literal('email'),
								z.literal('meeting'),
								z.literal('deadline'),
								z.literal('call'),
								z.literal('lunch'),
								z.literal('calendar'),
								z.literal('downarrow'),
								z.literal('document'),
								z.literal('smartphone'),
								z.literal('camera'),
								z.literal('scissors'),
								z.literal('cogs'),
								z.literal('bubble'),
								z.literal('uparrow'),
								z.literal('checkbox'),
								z.literal('signpost'),
								z.literal('shuffle'),
								z.literal('addressbook'),
								z.literal('linegraph'),
								z.literal('picture'),
								z.literal('car'),
								z.literal('world'),
								z.literal('search'),
								z.literal('clip'),
								z.literal('sound'),
								z.literal('brush'),
								z.literal('key'),
								z.literal('padlock'),
								z.literal('pricetag'),
								z.literal('suitcase'),
								z.literal('finish'),
								z.literal('plane'),
								z.literal('loop'),
								z.literal('wifi'),
								z.literal('truck'),
								z.literal('cart'),
								z.literal('bulb'),
								z.literal('bell'),
								z.literal('presentation'),
							])
							.optional(),
						color: z.string().optional(),
						order_nr: z.number().int().optional(),
						key_string: z.string().optional(),
						active_flag: z.boolean().optional(),
						is_custom_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.activityTypes.updateActivityType': {
		version: 'v1',
		method: 'PUT',
		path: '/activityTypes/{id}',
		group: 'activityTypes',
		operationId: 'updateActivityType',
		summary: 'Update an activity type',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					icon_key: z
						.union([
							z.literal('task'),
							z.literal('email'),
							z.literal('meeting'),
							z.literal('deadline'),
							z.literal('call'),
							z.literal('lunch'),
							z.literal('calendar'),
							z.literal('downarrow'),
							z.literal('document'),
							z.literal('smartphone'),
							z.literal('camera'),
							z.literal('scissors'),
							z.literal('cogs'),
							z.literal('bubble'),
							z.literal('uparrow'),
							z.literal('checkbox'),
							z.literal('signpost'),
							z.literal('shuffle'),
							z.literal('addressbook'),
							z.literal('linegraph'),
							z.literal('picture'),
							z.literal('car'),
							z.literal('world'),
							z.literal('search'),
							z.literal('clip'),
							z.literal('sound'),
							z.literal('brush'),
							z.literal('key'),
							z.literal('padlock'),
							z.literal('pricetag'),
							z.literal('suitcase'),
							z.literal('finish'),
							z.literal('plane'),
							z.literal('loop'),
							z.literal('wifi'),
							z.literal('truck'),
							z.literal('cart'),
							z.literal('bulb'),
							z.literal('bell'),
							z.literal('presentation'),
						])
						.optional(),
					color: z.string().optional(),
					order_nr: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						icon_key: z
							.union([
								z.literal('task'),
								z.literal('email'),
								z.literal('meeting'),
								z.literal('deadline'),
								z.literal('call'),
								z.literal('lunch'),
								z.literal('calendar'),
								z.literal('downarrow'),
								z.literal('document'),
								z.literal('smartphone'),
								z.literal('camera'),
								z.literal('scissors'),
								z.literal('cogs'),
								z.literal('bubble'),
								z.literal('uparrow'),
								z.literal('checkbox'),
								z.literal('signpost'),
								z.literal('shuffle'),
								z.literal('addressbook'),
								z.literal('linegraph'),
								z.literal('picture'),
								z.literal('car'),
								z.literal('world'),
								z.literal('search'),
								z.literal('clip'),
								z.literal('sound'),
								z.literal('brush'),
								z.literal('key'),
								z.literal('padlock'),
								z.literal('pricetag'),
								z.literal('suitcase'),
								z.literal('finish'),
								z.literal('plane'),
								z.literal('loop'),
								z.literal('wifi'),
								z.literal('truck'),
								z.literal('cart'),
								z.literal('bulb'),
								z.literal('bell'),
								z.literal('presentation'),
							])
							.optional(),
						color: z.string().optional(),
						order_nr: z.number().int().optional(),
						key_string: z.string().optional(),
						active_flag: z.boolean().optional(),
						is_custom_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.billing.getCompanyAddons': {
		version: 'v1',
		method: 'GET',
		path: '/billing/subscriptions/addons',
		group: 'billing',
		operationId: 'getCompanyAddons',
		summary: 'Get all add-ons for a single company',
		tokenCost: 20,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.object({}).passthrough()).optional(),
			})
			.passthrough(),
	},
	'apiV1.callLogs.addCallLog': {
		version: 'v1',
		method: 'POST',
		path: '/callLogs',
		group: 'callLogs',
		operationId: 'addCallLog',
		summary: 'Add a call log',
		tokenCost: 10,
		oauthScopes: ['phone-integration'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					user_id: z.number().int().optional(),
					activity_id: z.number().int().optional(),
					subject: z.string().optional(),
					duration: z.string().optional(),
					outcome: z.union([
						z.literal('connected'),
						z.literal('no_answer'),
						z.literal('left_message'),
						z.literal('left_voicemail'),
						z.literal('wrong_number'),
						z.literal('busy'),
					]),
					from_phone_number: z.string().optional(),
					to_phone_number: z.string(),
					start_time: z.string(),
					end_time: z.string(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					deal_id: z.number().int().optional(),
					lead_id: z.string().optional(),
					note: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						activity_id: z.number().int().optional(),
						subject: z.string().optional(),
						duration: z.string().optional(),
						outcome: z.union([
							z.literal('connected'),
							z.literal('no_answer'),
							z.literal('left_message'),
							z.literal('left_voicemail'),
							z.literal('wrong_number'),
							z.literal('busy'),
						]),
						from_phone_number: z.string().optional(),
						to_phone_number: z.string(),
						start_time: z.string(),
						end_time: z.string(),
						person_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						lead_id: z.string().optional(),
						note: z.string().optional(),
						id: z.string().optional(),
						has_recording: z.boolean().optional(),
						company_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.callLogs.getUserCallLogs': {
		version: 'v1',
		method: 'GET',
		path: '/callLogs',
		group: 'callLogs',
		operationId: 'getUserCallLogs',
		summary: 'Get all call logs assigned to a particular user',
		tokenCost: 20,
		oauthScopes: ['phone-integration'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								activity_id: z.number().int().optional(),
								subject: z.string().optional(),
								duration: z.string().optional(),
								outcome: z.union([
									z.literal('connected'),
									z.literal('no_answer'),
									z.literal('left_message'),
									z.literal('left_voicemail'),
									z.literal('wrong_number'),
									z.literal('busy'),
								]),
								from_phone_number: z.string().optional(),
								to_phone_number: z.string(),
								start_time: z.string(),
								end_time: z.string(),
								person_id: z.number().int().optional(),
								org_id: z.number().int().optional(),
								deal_id: z.number().int().optional(),
								lead_id: z.string().optional(),
								note: z.string().optional(),
								id: z.string().optional(),
								has_recording: z.boolean().optional(),
								company_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.callLogs.deleteCallLog': {
		version: 'v1',
		method: 'DELETE',
		path: '/callLogs/{id}',
		group: 'callLogs',
		operationId: 'deleteCallLog',
		summary: 'Delete a call log',
		tokenCost: 6,
		oauthScopes: ['phone-integration'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z.object({ success: z.boolean().optional() }).passthrough(),
	},
	'apiV1.callLogs.getCallLog': {
		version: 'v1',
		method: 'GET',
		path: '/callLogs/{id}',
		group: 'callLogs',
		operationId: 'getCallLog',
		summary: 'Get details of a call log',
		tokenCost: 2,
		oauthScopes: ['phone-integration'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						activity_id: z.number().int().optional(),
						subject: z.string().optional(),
						duration: z.string().optional(),
						outcome: z.union([
							z.literal('connected'),
							z.literal('no_answer'),
							z.literal('left_message'),
							z.literal('left_voicemail'),
							z.literal('wrong_number'),
							z.literal('busy'),
						]),
						from_phone_number: z.string().optional(),
						to_phone_number: z.string(),
						start_time: z.string(),
						end_time: z.string(),
						person_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						lead_id: z.string().optional(),
						note: z.string().optional(),
						id: z.string().optional(),
						has_recording: z.boolean().optional(),
						company_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.callLogs.addCallLogAudioFile': {
		version: 'v1',
		method: 'POST',
		path: '/callLogs/{id}/recordings',
		group: 'callLogs',
		operationId: 'addCallLogAudioFile',
		summary: 'Attach an audio file to the call log',
		tokenCost: 10,
		oauthScopes: ['phone-integration'],
		requestContentType: 'multipart/form-data',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string() }),
			body: z.strictObject({ file: z.instanceof(Blob) }).optional(),
		}),
		output: z.object({ success: z.boolean().optional() }).passthrough(),
	},
	'apiV1.channels.addChannel': {
		version: 'v1',
		method: 'POST',
		path: '/channels',
		group: 'channels',
		operationId: 'addChannel',
		summary: 'Add a channel',
		tokenCost: 10,
		oauthScopes: ['messengers-integration'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					provider_channel_id: z.string(),
					avatar_url: z.string().url().optional(),
					template_support: z.boolean().optional(),
					provider_type: z
						.union([
							z.literal('facebook'),
							z.literal('whatsapp'),
							z.literal('other'),
						])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						avatar_url: z.string().optional(),
						provider_channel_id: z.string().optional(),
						marketplace_client_id: z.string().optional(),
						pd_company_id: z.number().int().optional(),
						pd_user_id: z.number().int().optional(),
						created_at: z.string().optional(),
						provider_type: z
							.union([
								z.literal('facebook'),
								z.literal('whatsapp'),
								z.literal('other'),
							])
							.optional(),
						template_support: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.channels.deleteChannel': {
		version: 'v1',
		method: 'DELETE',
		path: '/channels/{id}',
		group: 'channels',
		operationId: 'deleteChannel',
		summary: 'Delete a channel',
		tokenCost: 6,
		oauthScopes: ['messengers-integration'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z.object({ success: z.boolean().optional() }).passthrough(),
	},
	'apiV1.channels.receiveMessage': {
		version: 'v1',
		method: 'POST',
		path: '/channels/messages/receive',
		group: 'channels',
		operationId: 'receiveMessage',
		summary: 'Receives an incoming message',
		tokenCost: 10,
		oauthScopes: ['messengers-integration'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					id: z.string(),
					channel_id: z.string(),
					sender_id: z.string(),
					conversation_id: z.string(),
					message: z.string(),
					status: z.union([
						z.literal('sent'),
						z.literal('delivered'),
						z.literal('read'),
						z.literal('failed'),
					]),
					created_at: z.string(),
					reply_by: z.string().optional(),
					conversation_link: z.string().url().optional(),
					attachments: z
						.array(
							z.strictObject({
								id: z.string(),
								type: z.string(),
								name: z.string().optional(),
								size: z.number().optional(),
								url: z.string(),
								preview_url: z.string().optional(),
								link_expires: z.boolean().optional(),
							}),
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string(),
						channel_id: z.string(),
						sender_id: z.string(),
						conversation_id: z.string(),
						message: z.string(),
						status: z.union([
							z.literal('sent'),
							z.literal('delivered'),
							z.literal('read'),
							z.literal('failed'),
						]),
						created_at: z.string(),
						reply_by: z.string().optional(),
						conversation_link: z.string().url().optional(),
						attachments: z
							.array(
								z
									.object({
										id: z.string(),
										type: z.string(),
										name: z.string().optional(),
										size: z.number().optional(),
										url: z.string(),
										preview_url: z.string().optional(),
										link_expires: z.boolean().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.channels.deleteConversation': {
		version: 'v1',
		method: 'DELETE',
		path: '/channels/{channel-id}/conversations/{conversation-id}',
		group: 'channels',
		operationId: 'deleteConversation',
		summary: 'Delete a conversation',
		tokenCost: 6,
		oauthScopes: ['messengers-integration'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['channel-id', 'conversation-id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				'channel-id': z.string(),
				'conversation-id': z.string(),
			}),
		}),
		output: z.object({ success: z.boolean().optional() }).passthrough(),
	},
	'apiV1.currencies.getCurrencies': {
		version: 'v1',
		method: 'GET',
		path: '/currencies',
		group: 'currencies',
		operationId: 'getCurrencies',
		summary: 'Get all supported currencies',
		tokenCost: 20,
		oauthScopes: ['base'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z.strictObject({ term: z.string().optional() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								code: z.string().optional(),
								name: z.string().optional(),
								decimal_points: z.number().int().optional(),
								symbol: z.string().optional(),
								active_flag: z.boolean().optional(),
								is_custom_flag: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getArchivedDeals': {
		version: 'v1',
		method: 'GET',
		path: '/deals/archived',
		group: 'deals',
		operationId: 'getArchivedDeals',
		summary: 'Get all archived deals',
		tokenCost: 40,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'org_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'product_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'pipeline_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'stage_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'status', style: 'form', explode: true, type: 'string' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
			{ name: 'owned_by_you', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					user_id: z.number().int().optional(),
					filter_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					product_id: z.number().int().optional(),
					pipeline_id: z.number().int().optional(),
					stage_id: z.number().int().optional(),
					status: z
						.union([
							z.literal('open'),
							z.literal('won'),
							z.literal('lost'),
							z.literal('deleted'),
							z.literal('all_not_deleted'),
						])
						.optional(),
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					sort: z.string().optional(),
					owned_by_you: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								creator_user_id: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								user_id: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.boolean().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								person_id: z
									.object({
										active_flag: z.boolean().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.nullable()
									.optional(),
								org_id: z
									.object({
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().optional(),
										active_flag: z.boolean().optional(),
										cc_email: z.string().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.nullable()
									.optional(),
								stage_id: z.number().int().optional(),
								title: z.string().optional(),
								value: z.number().optional(),
								currency: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								stage_change_time: z.string().nullable().optional(),
								active: z.boolean().optional(),
								deleted: z.boolean().optional(),
								is_archived: z.boolean().optional(),
								status: z.string().optional(),
								probability: z.number().nullable().optional(),
								next_activity_date: z.string().nullable().optional(),
								next_activity_time: z.string().nullable().optional(),
								next_activity_id: z.number().int().nullable().optional(),
								last_activity_id: z.number().int().nullable().optional(),
								last_activity_date: z.string().nullable().optional(),
								lost_reason: z.string().nullable().optional(),
								visible_to: z.string().optional(),
								close_time: z.string().nullable().optional(),
								pipeline_id: z.number().int().optional(),
								won_time: z.string().nullable().optional(),
								first_won_time: z.string().nullable().optional(),
								lost_time: z.string().nullable().optional(),
								products_count: z.number().int().optional(),
								files_count: z.number().int().optional(),
								notes_count: z.number().int().optional(),
								followers_count: z.number().int().optional(),
								email_messages_count: z.number().int().optional(),
								activities_count: z.number().int().optional(),
								done_activities_count: z.number().int().optional(),
								undone_activities_count: z.number().int().optional(),
								participants_count: z.number().int().optional(),
								expected_close_date: z.string().nullable().optional(),
								last_incoming_mail_time: z.string().nullable().optional(),
								last_outgoing_mail_time: z.string().nullable().optional(),
								label: z.string().nullable().optional(),
								stage_order_nr: z.number().int().optional(),
								person_name: z.string().nullable().optional(),
								org_name: z.string().nullable().optional(),
								next_activity_subject: z.string().nullable().optional(),
								next_activity_type: z.string().nullable().optional(),
								next_activity_duration: z.string().nullable().optional(),
								next_activity_note: z.string().nullable().optional(),
								formatted_value: z.string().optional(),
								weighted_value: z.number().optional(),
								formatted_weighted_value: z.string().optional(),
								weighted_value_currency: z.string().optional(),
								rotten_time: z.string().nullable().optional(),
								owner_name: z.string().optional(),
								cc_email: z.string().optional(),
								org_hidden: z.boolean().optional(),
								person_hidden: z.boolean().optional(),
								origin: z.string().optional(),
								origin_id: z.string().nullable().optional(),
								channel: z.number().int().nullable().optional(),
								channel_id: z.string().nullable().optional(),
								arr: z.number().nullable().optional(),
								mrr: z.number().nullable().optional(),
								acv: z.number().nullable().optional(),
								arr_currency: z.string().nullable().optional(),
								mrr_currency: z.string().nullable().optional(),
								acv_currency: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						user: z
							.object({
								USER_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						person: z
							.object({
								PERSON_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealsSummary': {
		version: 'v1',
		method: 'GET',
		path: '/deals/summary',
		group: 'deals',
		operationId: 'getDealsSummary',
		summary: 'Get deals summary',
		tokenCost: 40,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'status', style: 'form', explode: true, type: 'string' },
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'pipeline_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'stage_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					status: z
						.union([z.literal('open'), z.literal('won'), z.literal('lost')])
						.optional(),
					filter_id: z.number().int().optional(),
					user_id: z.number().int().optional(),
					pipeline_id: z.number().int().optional(),
					stage_id: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						values_total: z
							.object({
								value: z.number().optional(),
								count: z.number().int().optional(),
								value_converted: z.number().optional(),
								value_formatted: z.string().optional(),
								value_converted_formatted: z.string().optional(),
							})
							.passthrough()
							.optional(),
						weighted_values_total: z
							.object({
								value: z.number().optional(),
								count: z.number().int().optional(),
								value_formatted: z.string().optional(),
							})
							.passthrough()
							.optional(),
						total_count: z.number().int().optional(),
						total_currency_converted_value: z.number().optional(),
						total_weighted_currency_converted_value: z.number().optional(),
						total_currency_converted_value_formatted: z.string().optional(),
						total_weighted_currency_converted_value_formatted: z
							.string()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getArchivedDealsSummary': {
		version: 'v1',
		method: 'GET',
		path: '/deals/summary/archived',
		group: 'deals',
		operationId: 'getArchivedDealsSummary',
		summary: 'Get archived deals summary',
		tokenCost: 80,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'status', style: 'form', explode: true, type: 'string' },
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'pipeline_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'stage_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					status: z
						.union([z.literal('open'), z.literal('won'), z.literal('lost')])
						.optional(),
					filter_id: z.number().int().optional(),
					user_id: z.number().int().optional(),
					pipeline_id: z.number().int().optional(),
					stage_id: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						values_total: z
							.object({
								value: z.number().optional(),
								count: z.number().int().optional(),
								value_converted: z.number().optional(),
								value_formatted: z.string().optional(),
								value_converted_formatted: z.string().optional(),
							})
							.passthrough()
							.optional(),
						weighted_values_total: z
							.object({
								value: z.number().optional(),
								count: z.number().int().optional(),
								value_formatted: z.string().optional(),
							})
							.passthrough()
							.optional(),
						total_count: z.number().int().optional(),
						total_currency_converted_value: z.number().optional(),
						total_weighted_currency_converted_value: z.number().optional(),
						total_currency_converted_value_formatted: z.string().optional(),
						total_weighted_currency_converted_value_formatted: z
							.string()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealsTimeline': {
		version: 'v1',
		method: 'GET',
		path: '/deals/timeline',
		group: 'deals',
		operationId: 'getDealsTimeline',
		summary: 'Get deals timeline',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start_date', style: 'form', explode: true, type: 'string' },
			{ name: 'interval', style: 'form', explode: true, type: 'string' },
			{ name: 'amount', style: 'form', explode: true, type: 'integer' },
			{ name: 'field_key', style: 'form', explode: true, type: 'string' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'pipeline_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'exclude_deals', style: 'form', explode: true, type: 'number' },
			{
				name: 'totals_convert_currency',
				style: 'form',
				explode: true,
				type: 'string',
			},
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start_date: z.string(),
					interval: z.union([
						z.literal('day'),
						z.literal('week'),
						z.literal('month'),
						z.literal('quarter'),
					]),
					amount: z.number().int(),
					field_key: z.string(),
					user_id: z.number().int().optional(),
					pipeline_id: z.number().int().optional(),
					filter_id: z.number().int().optional(),
					exclude_deals: z.union([z.literal(0), z.literal(1)]).optional(),
					totals_convert_currency: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						period_start: z.string().optional(),
						period_end: z.string().optional(),
						deals: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										creator_user_id: z.number().int().optional(),
										user_id: z.number().int().optional(),
										person_id: z.number().int().nullable().optional(),
										org_id: z.number().int().nullable().optional(),
										stage_id: z.number().int().optional(),
										title: z.string().optional(),
										value: z.number().optional(),
										currency: z.string().optional(),
										add_time: z.string().optional(),
										update_time: z.string().nullable().optional(),
										stage_change_time: z.string().nullable().optional(),
										active: z.boolean().optional(),
										deleted: z.boolean().optional(),
										is_archived: z.boolean().optional(),
										status: z.string().optional(),
										probability: z.number().nullable().optional(),
										next_activity_date: z.string().nullable().optional(),
										next_activity_time: z.string().nullable().optional(),
										next_activity_id: z.number().int().nullable().optional(),
										last_activity_id: z.number().int().nullable().optional(),
										last_activity_date: z.string().nullable().optional(),
										lost_reason: z.string().nullable().optional(),
										visible_to: z.string().optional(),
										close_time: z.string().nullable().optional(),
										pipeline_id: z.number().int().optional(),
										won_time: z.string().nullable().optional(),
										first_won_time: z.string().nullable().optional(),
										lost_time: z.string().nullable().optional(),
										products_count: z.number().int().optional(),
										files_count: z.number().int().optional(),
										notes_count: z.number().int().optional(),
										followers_count: z.number().int().optional(),
										email_messages_count: z.number().int().optional(),
										activities_count: z.number().int().optional(),
										done_activities_count: z.number().int().optional(),
										undone_activities_count: z.number().int().optional(),
										participants_count: z.number().int().optional(),
										expected_close_date: z.string().nullable().optional(),
										last_incoming_mail_time: z.string().nullable().optional(),
										last_outgoing_mail_time: z.string().nullable().optional(),
										label: z.string().nullable().optional(),
										stage_order_nr: z.number().int().optional(),
										person_name: z.string().nullable().optional(),
										org_name: z.string().nullable().optional(),
										next_activity_subject: z.string().nullable().optional(),
										next_activity_type: z.string().nullable().optional(),
										next_activity_duration: z.string().nullable().optional(),
										next_activity_note: z.string().nullable().optional(),
										formatted_value: z.string().optional(),
										weighted_value: z.number().optional(),
										formatted_weighted_value: z.string().optional(),
										weighted_value_currency: z.string().optional(),
										rotten_time: z.string().nullable().optional(),
										owner_name: z.string().optional(),
										cc_email: z.string().optional(),
										org_hidden: z.boolean().optional(),
										person_hidden: z.boolean().optional(),
										origin: z.string().optional(),
										origin_id: z.string().nullable().optional(),
										channel: z.number().int().nullable().optional(),
										channel_id: z.string().nullable().optional(),
										arr: z.number().nullable().optional(),
										mrr: z.number().nullable().optional(),
										acv: z.number().nullable().optional(),
										arr_currency: z.string().nullable().optional(),
										mrr_currency: z.string().nullable().optional(),
										acv_currency: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.optional(),
						totals: z
							.object({
								count: z.number().int().optional(),
								values: z.object({}).passthrough().optional(),
								weighted_values: z.object({}).passthrough().optional(),
								open_count: z.number().int().optional(),
								open_values: z.object({}).passthrough().optional(),
								weighted_open_values: z.object({}).passthrough().optional(),
								won_count: z.number().int().optional(),
								won_values: z.object({}).passthrough().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getArchivedDealsTimeline': {
		version: 'v1',
		method: 'GET',
		path: '/deals/timeline/archived',
		group: 'deals',
		operationId: 'getArchivedDealsTimeline',
		summary: 'Get archived deals timeline',
		tokenCost: 40,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start_date', style: 'form', explode: true, type: 'string' },
			{ name: 'interval', style: 'form', explode: true, type: 'string' },
			{ name: 'amount', style: 'form', explode: true, type: 'integer' },
			{ name: 'field_key', style: 'form', explode: true, type: 'string' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'pipeline_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'exclude_deals', style: 'form', explode: true, type: 'number' },
			{
				name: 'totals_convert_currency',
				style: 'form',
				explode: true,
				type: 'string',
			},
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start_date: z.string(),
					interval: z.union([
						z.literal('day'),
						z.literal('week'),
						z.literal('month'),
						z.literal('quarter'),
					]),
					amount: z.number().int(),
					field_key: z.string(),
					user_id: z.number().int().optional(),
					pipeline_id: z.number().int().optional(),
					filter_id: z.number().int().optional(),
					exclude_deals: z.union([z.literal(0), z.literal(1)]).optional(),
					totals_convert_currency: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						period_start: z.string().optional(),
						period_end: z.string().optional(),
						deals: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										creator_user_id: z.number().int().optional(),
										user_id: z.number().int().optional(),
										person_id: z.number().int().nullable().optional(),
										org_id: z.number().int().nullable().optional(),
										stage_id: z.number().int().optional(),
										title: z.string().optional(),
										value: z.number().optional(),
										currency: z.string().optional(),
										add_time: z.string().optional(),
										update_time: z.string().nullable().optional(),
										stage_change_time: z.string().nullable().optional(),
										active: z.boolean().optional(),
										deleted: z.boolean().optional(),
										is_archived: z.boolean().optional(),
										status: z.string().optional(),
										probability: z.number().nullable().optional(),
										next_activity_date: z.string().nullable().optional(),
										next_activity_time: z.string().nullable().optional(),
										next_activity_id: z.number().int().nullable().optional(),
										last_activity_id: z.number().int().nullable().optional(),
										last_activity_date: z.string().nullable().optional(),
										lost_reason: z.string().nullable().optional(),
										visible_to: z.string().optional(),
										close_time: z.string().nullable().optional(),
										pipeline_id: z.number().int().optional(),
										won_time: z.string().nullable().optional(),
										first_won_time: z.string().nullable().optional(),
										lost_time: z.string().nullable().optional(),
										products_count: z.number().int().optional(),
										files_count: z.number().int().optional(),
										notes_count: z.number().int().optional(),
										followers_count: z.number().int().optional(),
										email_messages_count: z.number().int().optional(),
										activities_count: z.number().int().optional(),
										done_activities_count: z.number().int().optional(),
										undone_activities_count: z.number().int().optional(),
										participants_count: z.number().int().optional(),
										expected_close_date: z.string().nullable().optional(),
										last_incoming_mail_time: z.string().nullable().optional(),
										last_outgoing_mail_time: z.string().nullable().optional(),
										label: z.string().nullable().optional(),
										stage_order_nr: z.number().int().optional(),
										person_name: z.string().nullable().optional(),
										org_name: z.string().nullable().optional(),
										next_activity_subject: z.string().nullable().optional(),
										next_activity_type: z.string().nullable().optional(),
										next_activity_duration: z.string().nullable().optional(),
										next_activity_note: z.string().nullable().optional(),
										formatted_value: z.string().optional(),
										weighted_value: z.number().optional(),
										formatted_weighted_value: z.string().optional(),
										weighted_value_currency: z.string().optional(),
										rotten_time: z.string().nullable().optional(),
										owner_name: z.string().optional(),
										cc_email: z.string().optional(),
										org_hidden: z.boolean().optional(),
										person_hidden: z.boolean().optional(),
										origin: z.string().optional(),
										origin_id: z.string().nullable().optional(),
										channel: z.number().int().nullable().optional(),
										channel_id: z.string().nullable().optional(),
										arr: z.number().nullable().optional(),
										mrr: z.number().nullable().optional(),
										acv: z.number().nullable().optional(),
										arr_currency: z.string().nullable().optional(),
										mrr_currency: z.string().nullable().optional(),
										acv_currency: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.optional(),
						totals: z
							.object({
								count: z.number().int().optional(),
								values: z.object({}).passthrough().optional(),
								weighted_values: z.object({}).passthrough().optional(),
								open_count: z.number().int().optional(),
								open_values: z.object({}).passthrough().optional(),
								weighted_open_values: z.object({}).passthrough().optional(),
								won_count: z.number().int().optional(),
								won_values: z.object({}).passthrough().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealChangelog': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/changelog',
		group: 'deals',
		operationId: 'getDealChangelog',
		summary: 'List updates about deal field values',
		tokenCost: 20,
		oauthScopes: ['recents:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_key: z.string().optional(),
								old_value: z.string().nullable().optional(),
								new_value: z.string().nullable().optional(),
								actor_user_id: z.number().int().optional(),
								time: z.string().optional(),
								change_source: z.string().nullable().optional(),
								change_source_user_agent: z.string().nullable().optional(),
								is_bulk_update_flag: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.duplicateDeal': {
		version: 'v1',
		method: 'POST',
		path: '/deals/{id}/duplicate',
		group: 'deals',
		operationId: 'duplicateDeal',
		summary: 'Duplicate deal',
		tokenCost: 10,
		oauthScopes: ['deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						creator_user_id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						person_id: z.number().int().nullable().optional(),
						org_id: z.number().int().nullable().optional(),
						stage_id: z.number().int().optional(),
						title: z.string().optional(),
						value: z.number().optional(),
						currency: z.string().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						stage_change_time: z.string().nullable().optional(),
						active: z.boolean().optional(),
						deleted: z.boolean().optional(),
						is_archived: z.boolean().optional(),
						status: z.string().optional(),
						probability: z.number().nullable().optional(),
						next_activity_date: z.string().nullable().optional(),
						next_activity_time: z.string().nullable().optional(),
						next_activity_id: z.number().int().nullable().optional(),
						last_activity_id: z.number().int().nullable().optional(),
						last_activity_date: z.string().nullable().optional(),
						lost_reason: z.string().nullable().optional(),
						visible_to: z.string().optional(),
						close_time: z.string().nullable().optional(),
						pipeline_id: z.number().int().optional(),
						won_time: z.string().nullable().optional(),
						first_won_time: z.string().nullable().optional(),
						lost_time: z.string().nullable().optional(),
						products_count: z.number().int().optional(),
						files_count: z.number().int().optional(),
						notes_count: z.number().int().optional(),
						followers_count: z.number().int().optional(),
						email_messages_count: z.number().int().optional(),
						activities_count: z.number().int().optional(),
						done_activities_count: z.number().int().optional(),
						undone_activities_count: z.number().int().optional(),
						participants_count: z.number().int().optional(),
						expected_close_date: z.string().nullable().optional(),
						last_incoming_mail_time: z.string().nullable().optional(),
						last_outgoing_mail_time: z.string().nullable().optional(),
						label: z.string().nullable().optional(),
						stage_order_nr: z.number().int().optional(),
						person_name: z.string().nullable().optional(),
						org_name: z.string().nullable().optional(),
						next_activity_subject: z.string().nullable().optional(),
						next_activity_type: z.string().nullable().optional(),
						next_activity_duration: z.string().nullable().optional(),
						next_activity_note: z.string().nullable().optional(),
						formatted_value: z.string().optional(),
						weighted_value: z.number().optional(),
						formatted_weighted_value: z.string().optional(),
						weighted_value_currency: z.string().optional(),
						rotten_time: z.string().nullable().optional(),
						owner_name: z.string().optional(),
						cc_email: z.string().optional(),
						org_hidden: z.boolean().optional(),
						person_hidden: z.boolean().optional(),
						origin: z.string().optional(),
						origin_id: z.string().nullable().optional(),
						channel: z.number().int().nullable().optional(),
						channel_id: z.string().nullable().optional(),
						arr: z.number().nullable().optional(),
						mrr: z.number().nullable().optional(),
						acv: z.number().nullable().optional(),
						arr_currency: z.string().nullable().optional(),
						mrr_currency: z.string().nullable().optional(),
						acv_currency: z.string().nullable().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealFiles': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/files',
		group: 'deals',
		operationId: 'getDealFiles',
		summary: 'List files attached to a deal',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().max(100).optional(),
					sort: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								user_id: z.number().int().optional(),
								deal_id: z.number().int().optional(),
								person_id: z.number().int().optional(),
								org_id: z.number().int().optional(),
								product_id: z.number().int().optional(),
								activity_id: z.number().int().optional(),
								lead_id: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								file_name: z.string().optional(),
								file_size: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								inline_flag: z.boolean().optional(),
								remote_location: z.string().optional(),
								remote_id: z.string().optional(),
								cid: z.string().optional(),
								s3_bucket: z.string().optional(),
								mail_message_id: z.string().optional(),
								mail_template_id: z.string().optional(),
								deal_name: z.string().optional(),
								person_name: z.string().optional(),
								org_name: z.string().optional(),
								product_name: z.string().optional(),
								lead_name: z.string().optional(),
								url: z.string().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealUpdates': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/flow',
		group: 'deals',
		operationId: 'getDealUpdates',
		summary: 'List updates about a deal',
		tokenCost: 40,
		oauthScopes: ['recents:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'all_changes', style: 'form', explode: true, type: 'string' },
			{ name: 'items', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					all_changes: z.string().optional(),
					items: z
						.array(z.string())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								object: z.string().optional(),
								timestamp: z.string().optional(),
								data: z.object({}).passthrough().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						deal: z
							.object({
								DEAL_ID: z
									.object({
										id: z.number().int().optional(),
										title: z.string().optional(),
										status: z.string().optional(),
										value: z.number().optional(),
										currency: z.string().optional(),
										stage_id: z.number().int().optional(),
										pipeline_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						user: z
							.object({
								USER_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						person: z
							.object({
								PERSON_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealParticipantsChangelog': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/participantsChangelog',
		group: 'deals',
		operationId: 'getDealParticipantsChangelog',
		summary: 'List updates about participants of a deal',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								actor_user_id: z.number().int().optional(),
								person_id: z.number().int().optional(),
								action: z.string().optional(),
								time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealFollowers': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/followers',
		group: 'deals',
		operationId: 'getDealFollowers',
		summary: 'List followers of a deal',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								id: z.number().int().optional(),
								deal_id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.addDealFollower': {
		version: 'v1',
		method: 'POST',
		path: '/deals/{id}/followers',
		group: 'deals',
		operationId: 'addDealFollower',
		summary: 'Add a follower to a deal',
		tokenCost: 10,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						add_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.deleteDealFollower': {
		version: 'v1',
		method: 'DELETE',
		path: '/deals/{id}/followers/{follower_id}',
		group: 'deals',
		operationId: 'deleteDealFollower',
		summary: 'Delete a follower from a deal',
		tokenCost: 6,
		oauthScopes: ['deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'follower_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				follower_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealMailMessages': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/mailMessages',
		group: 'deals',
		operationId: 'getDealMailMessages',
		summary: 'List mail messages associated with a deal',
		tokenCost: 20,
		oauthScopes: ['mail:read', 'mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'include_body', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					include_body: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								object: z.string().optional(),
								timestamp: z.string().optional(),
								data: z
									.object({
										id: z.number().int().optional(),
										from: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										to: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										cc: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										bcc: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										body_url: z.string().optional(),
										body: z.string().optional(),
										account_id: z.string().optional(),
										user_id: z.number().int().optional(),
										mail_thread_id: z.number().int().optional(),
										subject: z.string().optional(),
										snippet: z.string().optional(),
										mail_tracking_status: z
											.union([z.literal('opened'), z.literal('not opened')])
											.nullable()
											.optional(),
										mail_link_tracking_enabled_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
										draft: z.string().nullable().optional(),
										draft_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										synced_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										deleted_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_body_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
										sent_from_pipedrive_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										smart_bcc_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										message_time: z.string().optional(),
										add_time: z.string().optional(),
										update_time: z.string().optional(),
										has_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_inline_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_real_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										nylas_id: z.string().optional(),
										s3_bucket: z.string().optional(),
										s3_bucket_path: z.string().optional(),
										external_deleted_flag: z.boolean().optional(),
										mua_message_id: z.string().optional(),
										template_id: z.number().int().nullable().optional(),
										timestamp: z.string().optional(),
										item_type: z.string().optional(),
										company_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.mergeDeals': {
		version: 'v1',
		method: 'PUT',
		path: '/deals/{id}/merge',
		group: 'deals',
		operationId: 'mergeDeals',
		summary: 'Merge two deals',
		tokenCost: 40,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ merge_with_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						creator_user_id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						person_id: z.number().int().nullable().optional(),
						org_id: z.number().int().nullable().optional(),
						stage_id: z.number().int().optional(),
						title: z.string().optional(),
						value: z.number().optional(),
						currency: z.string().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						stage_change_time: z.string().nullable().optional(),
						active: z.boolean().optional(),
						deleted: z.boolean().optional(),
						is_archived: z.boolean().optional(),
						status: z.string().optional(),
						probability: z.number().nullable().optional(),
						next_activity_date: z.string().nullable().optional(),
						next_activity_time: z.string().nullable().optional(),
						next_activity_id: z.number().int().nullable().optional(),
						last_activity_id: z.number().int().nullable().optional(),
						last_activity_date: z.string().nullable().optional(),
						lost_reason: z.string().nullable().optional(),
						visible_to: z.string().optional(),
						close_time: z.string().nullable().optional(),
						pipeline_id: z.number().int().optional(),
						won_time: z.string().nullable().optional(),
						first_won_time: z.string().nullable().optional(),
						lost_time: z.string().nullable().optional(),
						products_count: z.number().int().optional(),
						files_count: z.number().int().optional(),
						notes_count: z.number().int().optional(),
						followers_count: z.number().int().optional(),
						email_messages_count: z.number().int().optional(),
						activities_count: z.number().int().optional(),
						done_activities_count: z.number().int().optional(),
						undone_activities_count: z.number().int().optional(),
						participants_count: z.number().int().optional(),
						expected_close_date: z.string().nullable().optional(),
						last_incoming_mail_time: z.string().nullable().optional(),
						last_outgoing_mail_time: z.string().nullable().optional(),
						label: z.string().nullable().optional(),
						stage_order_nr: z.number().int().optional(),
						person_name: z.string().nullable().optional(),
						org_name: z.string().nullable().optional(),
						next_activity_subject: z.string().nullable().optional(),
						next_activity_type: z.string().nullable().optional(),
						next_activity_duration: z.string().nullable().optional(),
						next_activity_note: z.string().nullable().optional(),
						formatted_value: z.string().optional(),
						weighted_value: z.number().optional(),
						formatted_weighted_value: z.string().optional(),
						weighted_value_currency: z.string().optional(),
						rotten_time: z.string().nullable().optional(),
						owner_name: z.string().optional(),
						cc_email: z.string().optional(),
						org_hidden: z.boolean().optional(),
						person_hidden: z.boolean().optional(),
						origin: z.string().optional(),
						origin_id: z.string().nullable().optional(),
						channel: z.number().int().nullable().optional(),
						channel_id: z.string().nullable().optional(),
						arr: z.number().nullable().optional(),
						mrr: z.number().nullable().optional(),
						acv: z.number().nullable().optional(),
						arr_currency: z.string().nullable().optional(),
						mrr_currency: z.string().nullable().optional(),
						acv_currency: z.string().nullable().optional(),
						merge_what_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealParticipants': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/participants',
		group: 'deals',
		operationId: 'getDealParticipants',
		summary: 'List participants of a deal',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								person_id: z
									.object({
										active_flag: z.boolean().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														value: z.string().optional(),
														primary: z.boolean().optional(),
														label: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														value: z.string().optional(),
														primary: z.boolean().optional(),
														label: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
										company_id: z.number().int().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								add_time: z.string().optional(),
								active_flag: z.boolean().optional(),
								related_item_data: z
									.object({
										deal_id: z.number().int().optional(),
										title: z.string().optional(),
									})
									.passthrough()
									.optional(),
								person: z
									.object({
										id: z.number().int().optional(),
										company_id: z.number().int().optional(),
										active_flag: z.boolean().optional(),
										phone: z
											.array(
												z
													.object({
														value: z.string().optional(),
														primary: z.boolean().optional(),
														label: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										email: z
											.array(
												z
													.object({
														value: z.string().optional(),
														primary: z.boolean().optional(),
														label: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										first_char: z.string().optional(),
										add_time: z.string().optional(),
										update_time: z.string().optional(),
										visible_to: z.string().optional(),
										picture_id: z
											.object({
												id: z.number().int().optional(),
												item_type: z.string().optional(),
												item_id: z.number().int().optional(),
												active_flag: z.boolean().optional(),
												add_time: z.string().optional(),
												update_time: z.string().optional(),
												added_by_user_id: z.number().int().optional(),
												pictures: z
													.object({
														'128': z.string().optional(),
														'512': z.string().optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.nullable()
											.optional(),
										label: z.number().int().nullable().optional(),
										label_ids: z.array(z.number().int()).optional(),
										org_name: z.string().nullable().optional(),
										owner_name: z.string().optional(),
										cc_email: z.string().nullable().optional(),
										owner_id: z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												email: z.string().optional(),
												has_pic: z.number().int().optional(),
												pic_hash: z.string().nullable().optional(),
												active_flag: z.boolean().optional(),
												value: z.number().int().optional(),
											})
											.passthrough()
											.optional(),
										org_id: z
											.object({
												name: z.string().optional(),
												people_count: z.number().int().optional(),
												owner_id: z.number().int().optional(),
												address: z.string().nullable().optional(),
												cc_email: z.string().nullable().optional(),
												label_ids: z.array(z.number().int()).optional(),
												value: z.number().int().optional(),
												active_flag: z.boolean().optional(),
											})
											.passthrough()
											.nullable()
											.optional(),
										name: z.string().optional(),
										first_name: z.string().optional(),
										last_name: z.string().nullable().optional(),
										email_messages_count: z.number().int().optional(),
										activities_count: z.number().int().optional(),
										done_activities_count: z.number().int().optional(),
										undone_activities_count: z.number().int().optional(),
										files_count: z.number().int().optional(),
										notes_count: z.number().int().optional(),
										followers_count: z.number().int().optional(),
										last_incoming_mail_time: z.string().nullable().optional(),
										last_outgoing_mail_time: z.string().nullable().optional(),
										open_deals_count: z.number().int().optional(),
										related_open_deals_count: z.number().int().optional(),
										closed_deals_count: z.number().int().optional(),
										related_closed_deals_count: z.number().int().optional(),
										won_deals_count: z.number().int().optional(),
										related_won_deals_count: z.number().int().optional(),
										lost_deals_count: z.number().int().optional(),
										related_lost_deals_count: z.number().int().optional(),
										next_activity_date: z.string().nullable().optional(),
										next_activity_time: z.string().nullable().optional(),
										next_activity_id: z.number().int().nullable().optional(),
										last_activity_id: z.number().int().nullable().optional(),
										last_activity_date: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
								added_by_user_id: z
									.object({
										success: z.boolean().optional(),
										data: z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												default_currency: z.string().optional(),
												locale: z.string().optional(),
												lang: z.number().int().optional(),
												email: z.string().optional(),
												phone: z.string().nullable().optional(),
												activated: z.boolean().optional(),
												last_login: z.string().optional(),
												created: z.string().optional(),
												modified: z.string().nullable().optional(),
												has_created_company: z.boolean().optional(),
												access: z
													.array(
														z
															.object({
																app: z
																	.union([
																		z.literal('global'),
																		z.literal('sales'),
																		z.literal('campaigns'),
																		z.literal('projects'),
																		z.literal('account_settings'),
																		z.literal('partnership'),
																		z.literal('nova'),
																	])
																	.optional(),
																admin: z.boolean().optional(),
																permission_set_id: z.string().optional(),
															})
															.passthrough(),
													)
													.optional(),
												active_flag: z.boolean().optional(),
												timezone_name: z.string().optional(),
												timezone_offset: z.string().optional(),
												role_id: z.number().int().optional(),
												icon_url: z.string().nullable().optional(),
												is_you: z.boolean().optional(),
												is_deleted: z.boolean().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								related_item_type: z.string().optional(),
								related_item_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						user: z
							.object({
								USER_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						person: z
							.object({
								PERSON_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.addDealParticipant': {
		version: 'v1',
		method: 'POST',
		path: '/deals/{id}/participants',
		group: 'deals',
		operationId: 'addDealParticipant',
		summary: 'Add a participant to a deal',
		tokenCost: 10,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ person_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						person_id: z
							.object({
								active_flag: z.boolean().optional(),
								name: z.string().optional(),
								email: z
									.array(
										z
											.object({
												value: z.string().optional(),
												primary: z.boolean().optional(),
												label: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								phone: z
									.array(
										z
											.object({
												value: z.string().optional(),
												primary: z.boolean().optional(),
												label: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								owner_id: z.number().int().optional(),
								company_id: z.number().int().optional(),
								value: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						add_time: z.string().optional(),
						active_flag: z.boolean().optional(),
						related_item_data: z
							.object({
								deal_id: z.number().int().optional(),
								title: z.string().optional(),
							})
							.passthrough()
							.optional(),
						person: z
							.object({
								id: z.number().int().optional(),
								company_id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								phone: z
									.array(
										z
											.object({
												value: z.string().optional(),
												primary: z.boolean().optional(),
												label: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								email: z
									.array(
										z
											.object({
												value: z.string().optional(),
												primary: z.boolean().optional(),
												label: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								first_char: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								visible_to: z.string().optional(),
								picture_id: z
									.object({
										id: z.number().int().optional(),
										item_type: z.string().optional(),
										item_id: z.number().int().optional(),
										active_flag: z.boolean().optional(),
										add_time: z.string().optional(),
										update_time: z.string().optional(),
										added_by_user_id: z.number().int().optional(),
										pictures: z
											.object({
												'128': z.string().optional(),
												'512': z.string().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.nullable()
									.optional(),
								label: z.number().int().nullable().optional(),
								label_ids: z.array(z.number().int()).optional(),
								org_name: z.string().nullable().optional(),
								owner_name: z.string().optional(),
								cc_email: z.string().nullable().optional(),
								owner_id: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								org_id: z
									.object({
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
										label_ids: z.array(z.number().int()).optional(),
										value: z.number().int().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.nullable()
									.optional(),
								name: z.string().optional(),
								first_name: z.string().optional(),
								last_name: z.string().nullable().optional(),
								email_messages_count: z.number().int().optional(),
								activities_count: z.number().int().optional(),
								done_activities_count: z.number().int().optional(),
								undone_activities_count: z.number().int().optional(),
								files_count: z.number().int().optional(),
								notes_count: z.number().int().optional(),
								followers_count: z.number().int().optional(),
								last_incoming_mail_time: z.string().nullable().optional(),
								last_outgoing_mail_time: z.string().nullable().optional(),
								open_deals_count: z.number().int().optional(),
								related_open_deals_count: z.number().int().optional(),
								closed_deals_count: z.number().int().optional(),
								related_closed_deals_count: z.number().int().optional(),
								won_deals_count: z.number().int().optional(),
								related_won_deals_count: z.number().int().optional(),
								lost_deals_count: z.number().int().optional(),
								related_lost_deals_count: z.number().int().optional(),
								next_activity_date: z.string().nullable().optional(),
								next_activity_time: z.string().nullable().optional(),
								next_activity_id: z.number().int().nullable().optional(),
								last_activity_id: z.number().int().nullable().optional(),
								last_activity_date: z.string().nullable().optional(),
							})
							.passthrough()
							.optional(),
						added_by_user_id: z
							.object({
								success: z.boolean().optional(),
								data: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										default_currency: z.string().optional(),
										locale: z.string().optional(),
										lang: z.number().int().optional(),
										email: z.string().optional(),
										phone: z.string().nullable().optional(),
										activated: z.boolean().optional(),
										last_login: z.string().optional(),
										created: z.string().optional(),
										modified: z.string().nullable().optional(),
										has_created_company: z.boolean().optional(),
										access: z
											.array(
												z
													.object({
														app: z
															.union([
																z.literal('global'),
																z.literal('sales'),
																z.literal('campaigns'),
																z.literal('projects'),
																z.literal('account_settings'),
																z.literal('partnership'),
																z.literal('nova'),
															])
															.optional(),
														admin: z.boolean().optional(),
														permission_set_id: z.string().optional(),
													})
													.passthrough(),
											)
											.optional(),
										active_flag: z.boolean().optional(),
										timezone_name: z.string().optional(),
										timezone_offset: z.string().optional(),
										role_id: z.number().int().optional(),
										icon_url: z.string().nullable().optional(),
										is_you: z.boolean().optional(),
										is_deleted: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						related_item_type: z.string().optional(),
						related_item_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						user: z
							.object({
								USER_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						person: z
							.object({
								PERSON_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.deleteDealParticipant': {
		version: 'v1',
		method: 'DELETE',
		path: '/deals/{id}/participants/{deal_participant_id}',
		group: 'deals',
		operationId: 'deleteDealParticipant',
		summary: 'Delete a participant from a deal',
		tokenCost: 6,
		oauthScopes: ['deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'deal_participant_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				deal_participant_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.deals.getDealUsers': {
		version: 'v1',
		method: 'GET',
		path: '/deals/{id}/permittedUsers',
		group: 'deals',
		operationId: 'getDealUsers',
		summary: 'List permitted users',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z.object({ success: z.boolean().optional() }).passthrough(),
	},
	'apiV1.dealFields.getDealFields': {
		version: 'v1',
		method: 'GET',
		path: '/dealFields',
		group: 'dealFields',
		operationId: 'getDealFields',
		summary: 'Get all deal fields',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full', 'deal-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().nullable().optional(),
								key: z.string().optional(),
								name: z.string().optional(),
								order_nr: z.number().int().optional(),
								field_type: z
									.union([
										z.literal('boolean'),
										z.literal('double'),
										z.literal('int'),
										z.literal('json'),
										z.literal('date'),
										z.literal('daterange'),
										z.literal('time'),
										z.literal('timerange'),
										z.literal('text'),
										z.literal('varchar'),
										z.literal('varchar_auto'),
										z.literal('varchar_options'),
										z.literal('address'),
										z.literal('enum'),
										z.literal('monetary'),
										z.literal('phone'),
										z.literal('set'),
										z.literal('activity'),
										z.literal('deal'),
										z.literal('lead'),
										z.literal('org'),
										z.literal('people'),
										z.literal('pipeline'),
										z.literal('product'),
										z.literal('project'),
										z.literal('stage'),
										z.literal('user'),
										z.literal('billing_frequency'),
										z.literal('picture'),
										z.literal('price_list'),
										z.literal('projects_board'),
										z.literal('projects_phase'),
										z.literal('status'),
										z.literal('visible_to'),
									])
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								last_updated_by_user_id: z.number().int().nullable().optional(),
								created_by_user_id: z.number().int().nullable().optional(),
								active_flag: z.boolean().optional(),
								edit_flag: z.boolean().optional(),
								index_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								add_visible_flag: z.boolean().optional(),
								important_flag: z.boolean().optional(),
								bulk_edit_allowed: z.boolean().optional(),
								searchable_flag: z.boolean().optional(),
								filtering_allowed: z.boolean().optional(),
								sortable_flag: z.boolean().optional(),
								mandatory_flag: z.boolean().optional(),
								options: z
									.array(z.object({}).passthrough())
									.nullable()
									.optional(),
								options_deleted: z.array(z.object({}).passthrough()).optional(),
								is_subfield: z.boolean().optional(),
								subfields: z.array(z.object({}).passthrough()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.dealFields.addDealField': {
		version: 'v1',
		method: 'POST',
		path: '/dealFields',
		group: 'dealFields',
		operationId: 'addDealField',
		summary: 'Add a new deal field',
		tokenCost: 10,
		oauthScopes: ['deal-fields:full', 'admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					options: z.array(z.strictObject({ label: z.string() })).optional(),
					add_visible_flag: z.boolean().optional(),
					field_type: z.union([
						z.literal('address'),
						z.literal('date'),
						z.literal('daterange'),
						z.literal('double'),
						z.literal('enum'),
						z.literal('monetary'),
						z.literal('org'),
						z.literal('people'),
						z.literal('phone'),
						z.literal('set'),
						z.literal('text'),
						z.literal('time'),
						z.literal('timerange'),
						z.literal('user'),
						z.literal('varchar'),
						z.literal('varchar_auto'),
						z.literal('visible_to'),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.dealFields.deleteDealFields': {
		version: 'v1',
		method: 'DELETE',
		path: '/dealFields',
		group: 'dealFields',
		operationId: 'deleteDealFields',
		summary: 'Delete multiple deal fields in bulk',
		tokenCost: 10,
		oauthScopes: ['deal-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'ids', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					ids: z
						.array(z.number().int())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.dealFields.getDealField': {
		version: 'v1',
		method: 'GET',
		path: '/dealFields/{id}',
		group: 'dealFields',
		operationId: 'getDealField',
		summary: 'Get one deal field',
		tokenCost: 2,
		oauthScopes: ['deals:read', 'deals:full', 'deal-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.dealFields.deleteDealField': {
		version: 'v1',
		method: 'DELETE',
		path: '/dealFields/{id}',
		group: 'dealFields',
		operationId: 'deleteDealField',
		summary: 'Delete a deal field',
		tokenCost: 6,
		oauthScopes: ['deal-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.dealFields.updateDealField': {
		version: 'v1',
		method: 'PUT',
		path: '/dealFields/{id}',
		group: 'dealFields',
		operationId: 'updateDealField',
		summary: 'Update a deal field',
		tokenCost: 10,
		oauthScopes: ['deal-fields:full', 'admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					options: z
						.array(
							z.strictObject({
								id: z.number().int().optional(),
								label: z.string(),
							}),
						)
						.optional(),
					add_visible_flag: z.boolean().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.getFiles': {
		version: 'v1',
		method: 'GET',
		path: '/files',
		group: 'files',
		operationId: 'getFiles',
		summary: 'Get all files',
		tokenCost: 20,
		oauthScopes: [
			'deals:read',
			'deals:full',
			'activities:read',
			'activities:full',
			'contacts:read',
			'contacts:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().max(100).optional(),
					sort: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								user_id: z.number().int().optional(),
								deal_id: z.number().int().optional(),
								person_id: z.number().int().optional(),
								org_id: z.number().int().optional(),
								product_id: z.number().int().optional(),
								activity_id: z.number().int().optional(),
								lead_id: z.string().optional(),
								project_id: z.number().int().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								file_name: z.string().optional(),
								file_size: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								inline_flag: z.boolean().optional(),
								remote_location: z.string().optional(),
								remote_id: z.string().optional(),
								cid: z.string().optional(),
								s3_bucket: z.string().optional(),
								mail_message_id: z.string().optional(),
								mail_template_id: z.string().optional(),
								deal_name: z.string().optional(),
								person_name: z.string().optional(),
								org_name: z.string().optional(),
								product_name: z.string().optional(),
								lead_name: z.string().optional(),
								project_name: z.string().optional(),
								url: z.string().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
								next_start: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.addFile': {
		version: 'v1',
		method: 'POST',
		path: '/files',
		group: 'files',
		operationId: 'addFile',
		summary: 'Add file',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: 'multipart/form-data',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					file: z.instanceof(Blob),
					deal_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					product_id: z.number().int().optional(),
					activity_id: z.number().int().optional(),
					lead_id: z.string().optional(),
					project_id: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						person_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						product_id: z.number().int().optional(),
						activity_id: z.number().int().optional(),
						lead_id: z.string().optional(),
						project_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						file_name: z.string().optional(),
						file_size: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						inline_flag: z.boolean().optional(),
						remote_location: z.string().optional(),
						remote_id: z.string().optional(),
						cid: z.string().optional(),
						s3_bucket: z.string().optional(),
						mail_message_id: z.string().optional(),
						mail_template_id: z.string().optional(),
						deal_name: z.string().optional(),
						person_name: z.string().optional(),
						org_name: z.string().optional(),
						product_name: z.string().optional(),
						lead_name: z.string().optional(),
						project_name: z.string().optional(),
						url: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.addFileAndLinkIt': {
		version: 'v1',
		method: 'POST',
		path: '/files/remote',
		group: 'files',
		operationId: 'addFileAndLinkIt',
		summary: 'Create a remote file and link it to an item',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: 'application/x-www-form-urlencoded',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					file_type: z.union([
						z.literal('gdoc'),
						z.literal('gslides'),
						z.literal('gsheet'),
						z.literal('gform'),
						z.literal('gdraw'),
					]),
					title: z.string(),
					item_type: z.union([
						z.literal('deal'),
						z.literal('organization'),
						z.literal('person'),
					]),
					item_id: z.number().int(),
					remote_location: z.literal('googledrive'),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						person_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						product_id: z.number().int().optional(),
						activity_id: z.number().int().optional(),
						lead_id: z.string().optional(),
						project_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						file_name: z.string().optional(),
						file_size: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						inline_flag: z.boolean().optional(),
						remote_location: z.string().optional(),
						remote_id: z.string().optional(),
						cid: z.string().optional(),
						s3_bucket: z.string().optional(),
						mail_message_id: z.string().optional(),
						mail_template_id: z.string().optional(),
						deal_name: z.string().optional(),
						person_name: z.string().optional(),
						org_name: z.string().optional(),
						product_name: z.string().optional(),
						lead_name: z.string().optional(),
						project_name: z.string().optional(),
						url: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.linkFileToItem': {
		version: 'v1',
		method: 'POST',
		path: '/files/remoteLink',
		group: 'files',
		operationId: 'linkFileToItem',
		summary: 'Link a remote file to an item',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: 'application/x-www-form-urlencoded',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					item_type: z.union([
						z.literal('deal'),
						z.literal('organization'),
						z.literal('person'),
					]),
					item_id: z.number().int(),
					remote_id: z.string(),
					remote_location: z.literal('googledrive'),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						person_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						product_id: z.number().int().optional(),
						activity_id: z.number().int().optional(),
						lead_id: z.string().optional(),
						project_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						file_name: z.string().optional(),
						file_size: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						inline_flag: z.boolean().optional(),
						remote_location: z.string().optional(),
						remote_id: z.string().optional(),
						cid: z.string().optional(),
						s3_bucket: z.string().optional(),
						mail_message_id: z.string().optional(),
						mail_template_id: z.string().optional(),
						deal_name: z.string().optional(),
						person_name: z.string().optional(),
						org_name: z.string().optional(),
						product_name: z.string().optional(),
						lead_name: z.string().optional(),
						project_name: z.string().optional(),
						url: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.deleteFile': {
		version: 'v1',
		method: 'DELETE',
		path: '/files/{id}',
		group: 'files',
		operationId: 'deleteFile',
		summary: 'Delete a file',
		tokenCost: 6,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.getFile': {
		version: 'v1',
		method: 'GET',
		path: '/files/{id}',
		group: 'files',
		operationId: 'getFile',
		summary: 'Get one file',
		tokenCost: 2,
		oauthScopes: [
			'deals:read',
			'deals:full',
			'activities:read',
			'activities:full',
			'contacts:read',
			'contacts:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						person_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						product_id: z.number().int().optional(),
						activity_id: z.number().int().optional(),
						lead_id: z.string().optional(),
						project_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						file_name: z.string().optional(),
						file_size: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						inline_flag: z.boolean().optional(),
						remote_location: z.string().optional(),
						remote_id: z.string().optional(),
						cid: z.string().optional(),
						s3_bucket: z.string().optional(),
						mail_message_id: z.string().optional(),
						mail_template_id: z.string().optional(),
						deal_name: z.string().optional(),
						person_name: z.string().optional(),
						org_name: z.string().optional(),
						product_name: z.string().optional(),
						lead_name: z.string().optional(),
						project_name: z.string().optional(),
						url: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.updateFile': {
		version: 'v1',
		method: 'PUT',
		path: '/files/{id}',
		group: 'files',
		operationId: 'updateFile',
		summary: 'Update file details',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: 'application/x-www-form-urlencoded',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					description: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						deal_id: z.number().int().optional(),
						person_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						product_id: z.number().int().optional(),
						activity_id: z.number().int().optional(),
						lead_id: z.string().optional(),
						project_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						file_name: z.string().optional(),
						file_size: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						inline_flag: z.boolean().optional(),
						remote_location: z.string().optional(),
						remote_id: z.string().optional(),
						cid: z.string().optional(),
						s3_bucket: z.string().optional(),
						mail_message_id: z.string().optional(),
						mail_template_id: z.string().optional(),
						deal_name: z.string().optional(),
						person_name: z.string().optional(),
						org_name: z.string().optional(),
						product_name: z.string().optional(),
						lead_name: z.string().optional(),
						project_name: z.string().optional(),
						url: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.files.downloadFile': {
		version: 'v1',
		method: 'GET',
		path: '/files/{id}/download',
		group: 'files',
		operationId: 'downloadFile',
		summary: 'Download one file',
		tokenCost: 20,
		oauthScopes: [
			'deals:read',
			'deals:full',
			'activities:read',
			'activities:full',
			'contacts:read',
			'contacts:full',
		],
		requestContentType: '',
		responseContentType: 'application/octet-stream',
		isBinary: true,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z.strictObject({
			content_type: z.string(),
			base64: z.string(),
			byte_length: z.number().int().nonnegative(),
		}),
	},
	'apiV1.filters.deleteFilters': {
		version: 'v1',
		method: 'DELETE',
		path: '/filters',
		group: 'filters',
		operationId: 'deleteFilters',
		summary: 'Delete multiple filters in bulk',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'ids', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					ids: z
						.array(z.number().int())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.filters.getFilters': {
		version: 'v1',
		method: 'GET',
		path: '/filters',
		group: 'filters',
		operationId: 'getFilters',
		summary: 'Get all filters',
		tokenCost: 20,
		oauthScopes: [
			'deals:read',
			'deals:full',
			'activities:read',
			'activities:full',
			'contacts:read',
			'contacts:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'type', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					type: z
						.union([
							z.literal('deals'),
							z.literal('leads'),
							z.literal('org'),
							z.literal('people'),
							z.literal('products'),
							z.literal('activity'),
							z.literal('projects'),
						])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								filter_code: z.string().nullable().optional(),
								is_editable: z.boolean().optional(),
								active_flag: z.boolean().optional(),
								type: z
									.union([
										z.literal('deals'),
										z.literal('leads'),
										z.literal('org'),
										z.literal('people'),
										z.literal('products'),
										z.literal('activity'),
										z.literal('projects'),
									])
									.optional(),
								temporary_flag: z.boolean().nullable().optional(),
								user_id: z.number().int().optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								visible_to: z
									.union([
										z.literal('1'),
										z.literal('3'),
										z.literal('5'),
										z.literal('7'),
									])
									.optional(),
								last_used_time: z.string().nullable().optional(),
								custom_view_id: z.number().int().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.filters.addFilter': {
		version: 'v1',
		method: 'POST',
		path: '/filters',
		group: 'filters',
		operationId: 'addFilter',
		summary: 'Add a new filter',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{
				name: 'include_field_code',
				style: 'form',
				explode: true,
				type: 'boolean',
			},
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({ include_field_code: z.boolean().optional() })
				.optional(),
			body: z
				.strictObject({
					name: z.string(),
					conditions: z.strictObject({
						glue: z.literal('and'),
						conditions: z
							.array(
								z.strictObject({
									glue: z.enum(['and', 'or']),
									conditions: z.array(
										z.strictObject({
											object: z.enum([
												'person',
												'deal',
												'organization',
												'product',
												'activity',
											]),
											field_id: z.string(),
											operator: z.enum([
												'IS NOT NULL',
												'IS NULL',
												'<=',
												'>=',
												'<',
												'>',
												'!=',
												'=',
												"LIKE '$%'",
												"LIKE '%$%'",
												"NOT LIKE '$%'",
											]),
											value: z.string(),
											extra_value: z.string(),
										}),
									),
								}),
							)
							.refine(
								(groups) =>
									groups.reduce(
										(count, group) => count + group.conditions.length,
										0,
									) <= 16,
							),
					}),
					type: z.union([
						z.literal('deals'),
						z.literal('leads'),
						z.literal('org'),
						z.literal('people'),
						z.literal('products'),
						z.literal('activity'),
						z.literal('projects'),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						filter_code: z.string().nullable().optional(),
						is_editable: z.boolean().optional(),
						active_flag: z.boolean().optional(),
						type: z
							.union([
								z.literal('deals'),
								z.literal('leads'),
								z.literal('org'),
								z.literal('people'),
								z.literal('products'),
								z.literal('activity'),
								z.literal('projects'),
							])
							.optional(),
						temporary_flag: z.boolean().nullable().optional(),
						user_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						visible_to: z
							.union([
								z.literal('1'),
								z.literal('3'),
								z.literal('5'),
								z.literal('7'),
							])
							.optional(),
						last_used_time: z.string().nullable().optional(),
						custom_view_id: z.number().int().nullable().optional(),
						conditions: z
							.object({
								glue: z.literal('and').optional(),
								conditions: z
									.array(
										z
											.object({
												glue: z
													.union([z.literal('and'), z.literal('or')])
													.optional(),
												conditions: z
													.array(
														z
															.object({
																object: z.string().optional(),
																field_id: z.string().optional(),
																operator: z.string().optional(),
																value: z.string().nullable().optional(),
																extra_value: z.string().nullable().optional(),
																json_value_flag: z.boolean().optional(),
																field_code: z.string().nullable().optional(),
															})
															.passthrough(),
													)
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.filters.getFilterHelpers': {
		version: 'v1',
		method: 'GET',
		path: '/filters/helpers',
		group: 'filters',
		operationId: 'getFilterHelpers',
		summary: 'Get all filter helpers',
		tokenCost: 20,
		oauthScopes: [
			'deals:read',
			'deals:full',
			'activities:read',
			'activities:full',
			'contacts:read',
			'contacts:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z.object({}).passthrough(),
	},
	'apiV1.filters.deleteFilter': {
		version: 'v1',
		method: 'DELETE',
		path: '/filters/{id}',
		group: 'filters',
		operationId: 'deleteFilter',
		summary: 'Delete a filter',
		tokenCost: 6,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.filters.getFilter': {
		version: 'v1',
		method: 'GET',
		path: '/filters/{id}',
		group: 'filters',
		operationId: 'getFilter',
		summary: 'Get one filter',
		tokenCost: 2,
		oauthScopes: [
			'deals:read',
			'deals:full',
			'activities:read',
			'activities:full',
			'contacts:read',
			'contacts:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{
				name: 'include_field_code',
				style: 'form',
				explode: true,
				type: 'boolean',
			},
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({ include_field_code: z.boolean().optional() })
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						filter_code: z.string().nullable().optional(),
						is_editable: z.boolean().optional(),
						active_flag: z.boolean().optional(),
						type: z
							.union([
								z.literal('deals'),
								z.literal('leads'),
								z.literal('org'),
								z.literal('people'),
								z.literal('products'),
								z.literal('activity'),
								z.literal('projects'),
							])
							.optional(),
						temporary_flag: z.boolean().nullable().optional(),
						user_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						visible_to: z
							.union([
								z.literal('1'),
								z.literal('3'),
								z.literal('5'),
								z.literal('7'),
							])
							.optional(),
						last_used_time: z.string().nullable().optional(),
						custom_view_id: z.number().int().nullable().optional(),
						conditions: z
							.object({
								glue: z.literal('and').optional(),
								conditions: z
									.array(
										z
											.object({
												glue: z
													.union([z.literal('and'), z.literal('or')])
													.optional(),
												conditions: z
													.array(
														z
															.object({
																object: z.string().optional(),
																field_id: z.string().optional(),
																operator: z.string().optional(),
																value: z.string().nullable().optional(),
																extra_value: z.string().nullable().optional(),
																json_value_flag: z.boolean().optional(),
																field_code: z.string().nullable().optional(),
															})
															.passthrough(),
													)
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.filters.updateFilter': {
		version: 'v1',
		method: 'PUT',
		path: '/filters/{id}',
		group: 'filters',
		operationId: 'updateFilter',
		summary: 'Update filter',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'activities:full', 'contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{
				name: 'include_field_code',
				style: 'form',
				explode: true,
				type: 'boolean',
			},
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({ include_field_code: z.boolean().optional() })
				.optional(),
			body: z
				.strictObject({
					name: z.string().optional(),
					conditions: z.strictObject({
						glue: z.literal('and'),
						conditions: z
							.array(
								z.strictObject({
									glue: z.enum(['and', 'or']),
									conditions: z.array(
										z.strictObject({
											object: z.enum([
												'person',
												'deal',
												'organization',
												'product',
												'activity',
											]),
											field_id: z.string(),
											operator: z.enum([
												'IS NOT NULL',
												'IS NULL',
												'<=',
												'>=',
												'<',
												'>',
												'!=',
												'=',
												"LIKE '$%'",
												"LIKE '%$%'",
												"NOT LIKE '$%'",
											]),
											value: z.string(),
											extra_value: z.string(),
										}),
									),
								}),
							)
							.refine(
								(groups) =>
									groups.reduce(
										(count, group) => count + group.conditions.length,
										0,
									) <= 16,
							),
					}),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						filter_code: z.string().nullable().optional(),
						is_editable: z.boolean().optional(),
						active_flag: z.boolean().optional(),
						type: z
							.union([
								z.literal('deals'),
								z.literal('leads'),
								z.literal('org'),
								z.literal('people'),
								z.literal('products'),
								z.literal('activity'),
								z.literal('projects'),
							])
							.optional(),
						temporary_flag: z.boolean().nullable().optional(),
						user_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						visible_to: z
							.union([
								z.literal('1'),
								z.literal('3'),
								z.literal('5'),
								z.literal('7'),
							])
							.optional(),
						last_used_time: z.string().nullable().optional(),
						custom_view_id: z.number().int().nullable().optional(),
						conditions: z
							.object({
								glue: z.literal('and').optional(),
								conditions: z
									.array(
										z
											.object({
												glue: z
													.union([z.literal('and'), z.literal('or')])
													.optional(),
												conditions: z
													.array(
														z
															.object({
																object: z.string().optional(),
																field_id: z.string().optional(),
																operator: z.string().optional(),
																value: z.string().nullable().optional(),
																extra_value: z.string().nullable().optional(),
																json_value_flag: z.boolean().optional(),
																field_code: z.string().nullable().optional(),
															})
															.passthrough(),
													)
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.goals.addGoal': {
		version: 'v1',
		method: 'POST',
		path: '/goals',
		group: 'goals',
		operationId: 'addGoal',
		summary: 'Add a new goal',
		tokenCost: 10,
		oauthScopes: ['goals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					title: z.string().optional(),
					assignee: z.strictObject({
						id: z.number().int(),
						type: z.enum(['person', 'company', 'team']),
					}),
					type: z.strictObject({
						name: z.enum([
							'deals_won',
							'deals_progressed',
							'activities_completed',
							'activities_added',
							'deals_started',
							'revenue_forecast',
						]),
						params: z
							.strictObject({
								pipeline_id: z.array(z.number().int()).nullable().optional(),
								stage_id: z.number().int().optional(),
								activity_type_id: z
									.array(z.number().int())
									.nullable()
									.optional(),
							})
							.optional(),
					}),
					expected_outcome: z.strictObject({
						target: z.number(),
						tracking_metric: z.enum(['quantity', 'sum']),
						currency_id: z.number().int().optional(),
					}),
					duration: z.strictObject({
						start: z.string(),
						end: z.string().nullable(),
					}),
					interval: z.union([
						z.literal('weekly'),
						z.literal('monthly'),
						z.literal('quarterly'),
						z.literal('yearly'),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						goal: z
							.object({
								id: z.string().optional(),
								owner_id: z.number().int().optional(),
								title: z.string().optional(),
								type: z
									.object({
										name: z.string().optional(),
										params: z
											.object({
												pipeline_id: z.array(z.number().int()).optional(),
												activity_type_id: z.array(z.number().int()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								assignee: z
									.object({
										id: z.number().int().optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								interval: z.string().optional(),
								duration: z
									.object({
										start: z.string().optional(),
										end: z.string().optional(),
									})
									.passthrough()
									.optional(),
								expected_outcome: z
									.object({
										target: z.number().int().optional(),
										tracking_metric: z.string().optional(),
									})
									.passthrough()
									.optional(),
								is_active: z.boolean().optional(),
								report_ids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.goals.getGoals': {
		version: 'v1',
		method: 'GET',
		path: '/goals/find',
		group: 'goals',
		operationId: 'getGoals',
		summary: 'Find goals',
		tokenCost: 20,
		oauthScopes: ['goals:read', 'goals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'type.name', style: 'form', explode: true, type: 'string' },
			{ name: 'title', style: 'form', explode: true, type: 'string' },
			{ name: 'is_active', style: 'form', explode: true, type: 'boolean' },
			{ name: 'assignee.id', style: 'form', explode: true, type: 'integer' },
			{ name: 'assignee.type', style: 'form', explode: true, type: 'string' },
			{
				name: 'expected_outcome.target',
				style: 'form',
				explode: true,
				type: 'number',
			},
			{
				name: 'expected_outcome.tracking_metric',
				style: 'form',
				explode: true,
				type: 'string',
			},
			{
				name: 'expected_outcome.currency_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{
				name: 'type.params.pipeline_id',
				style: 'form',
				explode: true,
				type: 'array',
			},
			{
				name: 'type.params.stage_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{
				name: 'type.params.activity_type_id',
				style: 'form',
				explode: true,
				type: 'array',
			},
			{ name: 'period.start', style: 'form', explode: true, type: 'string' },
			{ name: 'period.end', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					'type.name': z
						.union([
							z.literal('deals_won'),
							z.literal('deals_progressed'),
							z.literal('activities_completed'),
							z.literal('activities_added'),
							z.literal('deals_started'),
						])
						.optional(),
					title: z.string().optional(),
					is_active: z.boolean().optional(),
					'assignee.id': z.number().int().optional(),
					'assignee.type': z
						.union([
							z.literal('person'),
							z.literal('company'),
							z.literal('team'),
						])
						.optional(),
					'expected_outcome.target': z.number().optional(),
					'expected_outcome.tracking_metric': z
						.union([z.literal('quantity'), z.literal('sum')])
						.optional(),
					'expected_outcome.currency_id': z.number().int().optional(),
					'type.params.pipeline_id': z.array(z.number().int()).optional(),
					'type.params.stage_id': z.number().int().optional(),
					'type.params.activity_type_id': z.array(z.number().int()).optional(),
					'period.start': z.string().optional(),
					'period.end': z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						goals: z
							.array(
								z
									.object({
										id: z.string().optional(),
										owner_id: z.number().int().optional(),
										title: z.string().optional(),
										type: z
											.object({
												name: z.string().optional(),
												params: z
													.object({
														pipeline_id: z.array(z.number().int()).optional(),
														activity_type_id: z
															.array(z.number().int())
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										assignee: z
											.object({
												id: z.number().int().optional(),
												type: z.string().optional(),
											})
											.passthrough()
											.optional(),
										interval: z.string().optional(),
										duration: z
											.object({
												start: z.string().optional(),
												end: z.string().optional(),
											})
											.passthrough()
											.optional(),
										expected_outcome: z
											.object({
												target: z.number().int().optional(),
												tracking_metric: z.string().optional(),
											})
											.passthrough()
											.optional(),
										is_active: z.boolean().optional(),
										report_ids: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.goals.updateGoal': {
		version: 'v1',
		method: 'PUT',
		path: '/goals/{id}',
		group: 'goals',
		operationId: 'updateGoal',
		summary: 'Update existing goal',
		tokenCost: 10,
		oauthScopes: ['goals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string() }),
			body: z
				.strictObject({
					title: z.string().optional(),
					assignee: z
						.strictObject({
							id: z.number().int(),
							type: z.enum(['person', 'company', 'team']),
						})
						.optional(),
					type: z
						.strictObject({
							name: z.enum([
								'deals_won',
								'deals_progressed',
								'activities_completed',
								'activities_added',
								'deals_started',
								'revenue_forecast',
							]),
							params: z
								.strictObject({
									pipeline_id: z.array(z.number().int()).nullable().optional(),
									stage_id: z.number().int().optional(),
									activity_type_id: z
										.array(z.number().int())
										.nullable()
										.optional(),
								})
								.optional(),
						})
						.optional(),
					expected_outcome: z
						.strictObject({
							target: z.number(),
							tracking_metric: z.enum(['quantity', 'sum']),
							currency_id: z.number().int().optional(),
						})
						.optional(),
					duration: z
						.strictObject({ start: z.string(), end: z.string().nullable() })
						.optional(),
					interval: z
						.union([
							z.literal('weekly'),
							z.literal('monthly'),
							z.literal('quarterly'),
							z.literal('yearly'),
						])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						goal: z
							.object({
								id: z.string().optional(),
								owner_id: z.number().int().optional(),
								title: z.string().optional(),
								type: z
									.object({
										name: z.string().optional(),
										params: z
											.object({
												pipeline_id: z.array(z.number().int()).optional(),
												activity_type_id: z.array(z.number().int()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								assignee: z
									.object({
										id: z.number().int().optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								interval: z.string().optional(),
								duration: z
									.object({
										start: z.string().optional(),
										end: z.string().optional(),
									})
									.passthrough()
									.optional(),
								expected_outcome: z
									.object({
										target: z.number().int().optional(),
										tracking_metric: z.string().optional(),
									})
									.passthrough()
									.optional(),
								is_active: z.boolean().optional(),
								report_ids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.goals.deleteGoal': {
		version: 'v1',
		method: 'DELETE',
		path: '/goals/{id}',
		group: 'goals',
		operationId: 'deleteGoal',
		summary: 'Delete existing goal',
		tokenCost: 6,
		oauthScopes: ['goals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z.object({ success: z.boolean().optional() }).passthrough(),
	},
	'apiV1.goals.getGoalResult': {
		version: 'v1',
		method: 'GET',
		path: '/goals/{id}/results',
		group: 'goals',
		operationId: 'getGoalResult',
		summary: 'Get result of a goal',
		tokenCost: 20,
		oauthScopes: ['goals:read', 'goals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'period.start', style: 'form', explode: true, type: 'string' },
			{ name: 'period.end', style: 'form', explode: true, type: 'string' },
			{ name: 'timezone', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string() }),
			query: z
				.strictObject({
					'period.start': z.string(),
					'period.end': z.string(),
					timezone: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						progress: z.number().int().optional(),
						goal: z
							.object({
								id: z.string().optional(),
								owner_id: z.number().int().optional(),
								title: z.string().optional(),
								type: z
									.object({
										name: z.string().optional(),
										params: z
											.object({
												pipeline_id: z.array(z.number().int()).optional(),
												activity_type_id: z.array(z.number().int()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								assignee: z
									.object({
										id: z.number().int().optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								interval: z.string().optional(),
								duration: z
									.object({
										start: z.string().optional(),
										end: z.string().optional(),
									})
									.passthrough()
									.optional(),
								expected_outcome: z
									.object({
										target: z.number().int().optional(),
										tracking_metric: z.string().optional(),
									})
									.passthrough()
									.optional(),
								is_active: z.boolean().optional(),
								report_ids: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.getLeads': {
		version: 'v1',
		method: 'GET',
		path: '/leads',
		group: 'leads',
		operationId: 'getLeads',
		summary: 'Get all leads',
		tokenCost: 20,
		oauthScopes: ['leads:read', 'leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'owner_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{
				name: 'organization_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'updated_since', style: 'form', explode: true, type: 'string' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					limit: z.number().int().optional(),
					start: z.number().int().optional(),
					owner_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					organization_id: z.number().int().optional(),
					filter_id: z.number().int().optional(),
					updated_since: z.string().optional(),
					sort: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.string().optional(),
								title: z.string().optional(),
								owner_id: z.number().int().optional(),
								creator_id: z.number().int().optional(),
								label_ids: z.array(z.string()).optional(),
								person_id: z.number().int().nullable().optional(),
								organization_id: z.number().int().nullable().optional(),
								source_name: z.string().optional(),
								origin: z.string().optional(),
								origin_id: z.string().nullable().optional(),
								channel: z.number().int().nullable().optional(),
								channel_id: z.string().nullable().optional(),
								source_deal_id: z.number().int().nullable().optional(),
								is_archived: z.boolean().optional(),
								archive_reason: z.string().nullable().optional(),
								was_seen: z.boolean().optional(),
								value: z
									.object({ amount: z.number(), currency: z.string() })
									.passthrough()
									.nullable()
									.optional(),
								expected_close_date: z.string().nullable().optional(),
								next_activity_id: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								visible_to: z
									.union([
										z.literal('1'),
										z.literal('3'),
										z.literal('5'),
										z.literal('7'),
									])
									.optional(),
								cc_email: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.addLead': {
		version: 'v1',
		method: 'POST',
		path: '/leads',
		group: 'leads',
		operationId: 'addLead',
		summary: 'Add a lead',
		tokenCost: 10,
		oauthScopes: ['leads:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					title: z.string(),
					owner_id: z.number().int().optional(),
					label_ids: z.array(z.string()).optional(),
					person_id: z.number().int().optional(),
					organization_id: z.number().int().optional(),
					value: z
						.strictObject({ amount: z.number(), currency: z.string() })
						.nullable()
						.optional(),
					expected_close_date: z.string().optional(),
					visible_to: z
						.union([
							z.literal('1'),
							z.literal('3'),
							z.literal('5'),
							z.literal('7'),
						])
						.optional(),
					was_seen: z.boolean().optional(),
					origin_id: z.string().nullable().optional(),
					channel: z.number().int().nullable().optional(),
					channel_id: z.string().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						title: z.string().optional(),
						owner_id: z.number().int().optional(),
						creator_id: z.number().int().optional(),
						label_ids: z.array(z.string()).optional(),
						person_id: z.number().int().nullable().optional(),
						organization_id: z.number().int().nullable().optional(),
						source_name: z.string().optional(),
						origin: z.string().optional(),
						origin_id: z.string().nullable().optional(),
						channel: z.number().int().nullable().optional(),
						channel_id: z.string().nullable().optional(),
						source_deal_id: z.number().int().nullable().optional(),
						is_archived: z.boolean().optional(),
						archive_reason: z.string().nullable().optional(),
						was_seen: z.boolean().optional(),
						value: z
							.object({ amount: z.number(), currency: z.string() })
							.passthrough()
							.nullable()
							.optional(),
						expected_close_date: z.string().nullable().optional(),
						next_activity_id: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						visible_to: z
							.union([
								z.literal('1'),
								z.literal('3'),
								z.literal('5'),
								z.literal('7'),
							])
							.optional(),
						cc_email: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.getArchivedLeads': {
		version: 'v1',
		method: 'GET',
		path: '/leads/archived',
		group: 'leads',
		operationId: 'getArchivedLeads',
		summary: 'Get all archived leads',
		tokenCost: 40,
		oauthScopes: ['leads:read', 'leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'owner_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{
				name: 'organization_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					limit: z.number().int().optional(),
					start: z.number().int().optional(),
					owner_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					organization_id: z.number().int().optional(),
					filter_id: z.number().int().optional(),
					sort: z
						.union([
							z.literal('id'),
							z.literal('title'),
							z.literal('owner_id'),
							z.literal('creator_id'),
							z.literal('was_seen'),
							z.literal('expected_close_date'),
							z.literal('next_activity_id'),
							z.literal('add_time'),
							z.literal('update_time'),
						])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.string().optional(),
								title: z.string().optional(),
								owner_id: z.number().int().optional(),
								creator_id: z.number().int().optional(),
								label_ids: z.array(z.string()).optional(),
								person_id: z.number().int().nullable().optional(),
								organization_id: z.number().int().nullable().optional(),
								source_name: z.string().optional(),
								origin: z.string().optional(),
								origin_id: z.string().nullable().optional(),
								channel: z.number().int().nullable().optional(),
								channel_id: z.string().nullable().optional(),
								source_deal_id: z.number().int().nullable().optional(),
								is_archived: z.boolean().optional(),
								archive_reason: z.string().nullable().optional(),
								was_seen: z.boolean().optional(),
								value: z
									.object({ amount: z.number(), currency: z.string() })
									.passthrough()
									.nullable()
									.optional(),
								expected_close_date: z.string().nullable().optional(),
								next_activity_id: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								visible_to: z
									.union([
										z.literal('1'),
										z.literal('3'),
										z.literal('5'),
										z.literal('7'),
									])
									.optional(),
								cc_email: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.getLead': {
		version: 'v1',
		method: 'GET',
		path: '/leads/{id}',
		group: 'leads',
		operationId: 'getLead',
		summary: 'Get one lead',
		tokenCost: 2,
		oauthScopes: ['leads:read', 'leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						title: z.string().optional(),
						owner_id: z.number().int().optional(),
						creator_id: z.number().int().optional(),
						label_ids: z.array(z.string()).optional(),
						person_id: z.number().int().nullable().optional(),
						organization_id: z.number().int().nullable().optional(),
						source_name: z.string().optional(),
						origin: z.string().optional(),
						origin_id: z.string().nullable().optional(),
						channel: z.number().int().nullable().optional(),
						channel_id: z.string().nullable().optional(),
						source_deal_id: z.number().int().nullable().optional(),
						is_archived: z.boolean().optional(),
						archive_reason: z.string().nullable().optional(),
						was_seen: z.boolean().optional(),
						value: z
							.object({ amount: z.number(), currency: z.string() })
							.passthrough()
							.nullable()
							.optional(),
						expected_close_date: z.string().nullable().optional(),
						next_activity_id: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						visible_to: z
							.union([
								z.literal('1'),
								z.literal('3'),
								z.literal('5'),
								z.literal('7'),
							])
							.optional(),
						cc_email: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.updateLead': {
		version: 'v1',
		method: 'PATCH',
		path: '/leads/{id}',
		group: 'leads',
		operationId: 'updateLead',
		summary: 'Update a lead',
		tokenCost: 10,
		oauthScopes: ['leads:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string() }),
			body: z
				.strictObject({
					title: z.string().nullable().optional(),
					owner_id: z.number().int().optional(),
					label_ids: z.array(z.string()).optional(),
					person_id: z.number().int().nullable().optional(),
					organization_id: z.number().int().nullable().optional(),
					is_archived: z.boolean().optional(),
					archive_reason: z.string().nullable().optional(),
					value: z
						.strictObject({ amount: z.number(), currency: z.string() })
						.nullable()
						.optional(),
					expected_close_date: z.string().nullable().optional(),
					visible_to: z
						.union([
							z.literal('1'),
							z.literal('3'),
							z.literal('5'),
							z.literal('7'),
						])
						.optional(),
					was_seen: z.boolean().optional(),
					channel: z.number().int().nullable().optional(),
					channel_id: z.string().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						title: z.string().optional(),
						owner_id: z.number().int().optional(),
						creator_id: z.number().int().optional(),
						label_ids: z.array(z.string()).optional(),
						person_id: z.number().int().nullable().optional(),
						organization_id: z.number().int().nullable().optional(),
						source_name: z.string().optional(),
						origin: z.string().optional(),
						origin_id: z.string().nullable().optional(),
						channel: z.number().int().nullable().optional(),
						channel_id: z.string().nullable().optional(),
						source_deal_id: z.number().int().nullable().optional(),
						is_archived: z.boolean().optional(),
						archive_reason: z.string().nullable().optional(),
						was_seen: z.boolean().optional(),
						value: z
							.object({ amount: z.number(), currency: z.string() })
							.passthrough()
							.nullable()
							.optional(),
						expected_close_date: z.string().nullable().optional(),
						next_activity_id: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						visible_to: z
							.union([
								z.literal('1'),
								z.literal('3'),
								z.literal('5'),
								z.literal('7'),
							])
							.optional(),
						cc_email: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.deleteLead': {
		version: 'v1',
		method: 'DELETE',
		path: '/leads/{id}',
		group: 'leads',
		operationId: 'deleteLead',
		summary: 'Delete a lead',
		tokenCost: 6,
		oauthScopes: ['leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.object({ id: z.string().optional() }).passthrough().optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.getLeadUsers': {
		version: 'v1',
		method: 'GET',
		path: '/leads/{id}/permittedUsers',
		group: 'leads',
		operationId: 'getLeadUsers',
		summary: 'List permitted users',
		tokenCost: 10,
		oauthScopes: ['leads:read', 'leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	'apiV1.leads.searchLeads': {
		version: 'v1',
		method: 'GET',
		path: '/leads/search',
		group: 'leads',
		operationId: 'searchLeads',
		summary: 'Search leads',
		tokenCost: 40,
		oauthScopes: ['leads:read', 'leads:full', 'search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'fields', style: 'form', explode: false, type: 'array' },
			{ name: 'exact_match', style: 'form', explode: true, type: 'boolean' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{
				name: 'organization_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string(),
					fields: z
						.array(
							z.union([
								z.literal('custom_fields'),
								z.literal('notes'),
								z.literal('title'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					exact_match: z.boolean().optional(),
					person_id: z.number().int().optional(),
					organization_id: z.number().int().optional(),
					include_fields: z
						.array(z.literal('lead.was_seen'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z
											.object({
												id: z.string().optional(),
												type: z.string().optional(),
												title: z.string().optional(),
												owner: z
													.object({ id: z.number().int().optional() })
													.passthrough()
													.optional(),
												person: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.optional(),
												organization: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.optional(),
												phones: z.array(z.string()).optional(),
												emails: z.array(z.string()).optional(),
												custom_fields: z.array(z.string()).optional(),
												notes: z.array(z.string()).optional(),
												value: z.number().int().optional(),
												currency: z.string().optional(),
												visible_to: z.number().int().optional(),
												is_archived: z.boolean().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
								next_start: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leadFields.getLeadFields': {
		version: 'v1',
		method: 'GET',
		path: '/leadFields',
		group: 'leadFields',
		operationId: 'getLeadFields',
		summary: 'Get all lead fields',
		tokenCost: 20,
		oauthScopes: ['leads:read', 'leads:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().nullable().optional(),
								key: z.string().optional(),
								name: z.string().optional(),
								order_nr: z.number().int().optional(),
								field_type: z
									.union([
										z.literal('boolean'),
										z.literal('double'),
										z.literal('int'),
										z.literal('json'),
										z.literal('date'),
										z.literal('daterange'),
										z.literal('time'),
										z.literal('timerange'),
										z.literal('text'),
										z.literal('varchar'),
										z.literal('varchar_auto'),
										z.literal('varchar_options'),
										z.literal('address'),
										z.literal('enum'),
										z.literal('monetary'),
										z.literal('phone'),
										z.literal('set'),
										z.literal('activity'),
										z.literal('deal'),
										z.literal('lead'),
										z.literal('org'),
										z.literal('people'),
										z.literal('pipeline'),
										z.literal('product'),
										z.literal('project'),
										z.literal('stage'),
										z.literal('user'),
										z.literal('billing_frequency'),
										z.literal('picture'),
										z.literal('price_list'),
										z.literal('projects_board'),
										z.literal('projects_phase'),
										z.literal('status'),
										z.literal('visible_to'),
									])
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								last_updated_by_user_id: z.number().int().nullable().optional(),
								created_by_user_id: z.number().int().nullable().optional(),
								active_flag: z.boolean().optional(),
								edit_flag: z.boolean().optional(),
								index_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								add_visible_flag: z.boolean().optional(),
								important_flag: z.boolean().optional(),
								bulk_edit_allowed: z.boolean().optional(),
								searchable_flag: z.boolean().optional(),
								filtering_allowed: z.boolean().optional(),
								sortable_flag: z.boolean().optional(),
								mandatory_flag: z.boolean().optional(),
								options: z
									.array(z.object({}).passthrough())
									.nullable()
									.optional(),
								options_deleted: z.array(z.object({}).passthrough()).optional(),
								is_subfield: z.boolean().optional(),
								subfields: z.array(z.object({}).passthrough()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leadLabels.getLeadLabels': {
		version: 'v1',
		method: 'GET',
		path: '/leadLabels',
		group: 'leadLabels',
		operationId: 'getLeadLabels',
		summary: 'Get all lead labels',
		tokenCost: 10,
		oauthScopes: ['leads:read', 'leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
								color: z
									.union([
										z.literal('blue'),
										z.literal('brown'),
										z.literal('dark-gray'),
										z.literal('gray'),
										z.literal('green'),
										z.literal('orange'),
										z.literal('pink'),
										z.literal('purple'),
										z.literal('red'),
										z.literal('yellow'),
									])
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leadLabels.addLeadLabel': {
		version: 'v1',
		method: 'POST',
		path: '/leadLabels',
		group: 'leadLabels',
		operationId: 'addLeadLabel',
		summary: 'Add a lead label',
		tokenCost: 10,
		oauthScopes: ['leads:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					color: z.union([
						z.literal('blue'),
						z.literal('brown'),
						z.literal('dark-gray'),
						z.literal('gray'),
						z.literal('green'),
						z.literal('orange'),
						z.literal('pink'),
						z.literal('purple'),
						z.literal('red'),
						z.literal('yellow'),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						color: z
							.union([
								z.literal('blue'),
								z.literal('brown'),
								z.literal('dark-gray'),
								z.literal('gray'),
								z.literal('green'),
								z.literal('orange'),
								z.literal('pink'),
								z.literal('purple'),
								z.literal('red'),
								z.literal('yellow'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leadLabels.updateLeadLabel': {
		version: 'v1',
		method: 'PATCH',
		path: '/leadLabels/{id}',
		group: 'leadLabels',
		operationId: 'updateLeadLabel',
		summary: 'Update a lead label',
		tokenCost: 10,
		oauthScopes: ['leads:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					color: z
						.union([
							z.literal('blue'),
							z.literal('brown'),
							z.literal('dark-gray'),
							z.literal('gray'),
							z.literal('green'),
							z.literal('orange'),
							z.literal('pink'),
							z.literal('purple'),
							z.literal('red'),
							z.literal('yellow'),
						])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						color: z
							.union([
								z.literal('blue'),
								z.literal('brown'),
								z.literal('dark-gray'),
								z.literal('gray'),
								z.literal('green'),
								z.literal('orange'),
								z.literal('pink'),
								z.literal('purple'),
								z.literal('red'),
								z.literal('yellow'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.leadLabels.deleteLeadLabel': {
		version: 'v1',
		method: 'DELETE',
		path: '/leadLabels/{id}',
		group: 'leadLabels',
		operationId: 'deleteLeadLabel',
		summary: 'Delete a lead label',
		tokenCost: 6,
		oauthScopes: ['leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.object({ id: z.string().optional() }).passthrough().optional(),
			})
			.passthrough(),
	},
	'apiV1.leadSources.getLeadSources': {
		version: 'v1',
		method: 'GET',
		path: '/leadSources',
		group: 'leadSources',
		operationId: 'getLeadSources',
		summary: 'Get all lead sources',
		tokenCost: 2,
		oauthScopes: ['leads:read', 'leads:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(z.object({ name: z.string().optional() }).passthrough())
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.getTeams': {
		version: 'v1',
		method: 'GET',
		path: '/legacyTeams',
		group: 'legacyTeams',
		operationId: 'getTeams',
		summary: 'Get all teams',
		tokenCost: 20,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'order_by', style: 'form', explode: true, type: 'string' },
			{ name: 'skip_users', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					order_by: z
						.union([
							z.literal('id'),
							z.literal('name'),
							z.literal('manager_id'),
							z.literal('active_flag'),
						])
						.optional(),
					skip_users: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
								manager_id: z.number().int().optional(),
								users: z.array(z.number().int()).optional(),
								active_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								add_time: z.string().optional(),
								created_by_user_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.addTeam': {
		version: 'v1',
		method: 'POST',
		path: '/legacyTeams',
		group: 'legacyTeams',
		operationId: 'addTeam',
		summary: 'Add a new team',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					description: z.string().optional(),
					manager_id: z.number().int(),
					users: z.array(z.number().int()).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
						manager_id: z.number().int().optional(),
						users: z.array(z.number().int()).optional(),
						active_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						add_time: z.string().optional(),
						created_by_user_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.getTeam': {
		version: 'v1',
		method: 'GET',
		path: '/legacyTeams/{id}',
		group: 'legacyTeams',
		operationId: 'getTeam',
		summary: 'Get a single team',
		tokenCost: 2,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'skip_users', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					skip_users: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
						manager_id: z.number().int().optional(),
						users: z.array(z.number().int()).optional(),
						active_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						add_time: z.string().optional(),
						created_by_user_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.updateTeam': {
		version: 'v1',
		method: 'PUT',
		path: '/legacyTeams/{id}',
		group: 'legacyTeams',
		operationId: 'updateTeam',
		summary: 'Update a team',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					description: z.string().optional(),
					manager_id: z.number().int().optional(),
					users: z.array(z.number().int()).optional(),
					active_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
						manager_id: z.number().int().optional(),
						users: z.array(z.number().int()).optional(),
						active_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						add_time: z.string().optional(),
						created_by_user_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.getTeamUsers': {
		version: 'v1',
		method: 'GET',
		path: '/legacyTeams/{id}/users',
		group: 'legacyTeams',
		operationId: 'getTeamUsers',
		summary: 'Get all users in a team',
		tokenCost: 20,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.addTeamUser': {
		version: 'v1',
		method: 'POST',
		path: '/legacyTeams/{id}/users',
		group: 'legacyTeams',
		operationId: 'addTeamUser',
		summary: 'Add users to a team',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ users: z.array(z.number().int()) }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.deleteTeamUser': {
		version: 'v1',
		method: 'DELETE',
		path: '/legacyTeams/{id}/users',
		group: 'legacyTeams',
		operationId: 'deleteTeamUser',
		summary: 'Delete users from a team',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ users: z.array(z.number().int()) }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	'apiV1.legacyTeams.getUserTeams': {
		version: 'v1',
		method: 'GET',
		path: '/legacyTeams/user/{id}',
		group: 'legacyTeams',
		operationId: 'getUserTeams',
		summary: 'Get all teams of a user',
		tokenCost: 20,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'order_by', style: 'form', explode: true, type: 'string' },
			{ name: 'skip_users', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					order_by: z
						.union([
							z.literal('id'),
							z.literal('name'),
							z.literal('manager_id'),
							z.literal('active_flag'),
						])
						.optional(),
					skip_users: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
								manager_id: z.number().int().optional(),
								users: z.array(z.number().int()).optional(),
								active_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								add_time: z.string().optional(),
								created_by_user_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.mailbox.getMailMessage': {
		version: 'v1',
		method: 'GET',
		path: '/mailbox/mailMessages/{id}',
		group: 'mailbox',
		operationId: 'getMailMessage',
		summary: 'Get one mail message',
		tokenCost: 2,
		oauthScopes: ['mail:read', 'mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'include_body', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					include_body: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				statusCode: z.number().int().optional(),
				statusText: z.string().optional(),
				service: z.string().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						from: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										email_address: z.string().optional(),
										name: z.string().optional(),
										linked_person_id: z.number().int().nullable().optional(),
										linked_person_name: z.string().nullable().optional(),
										mail_message_party_id: z.number().int().optional(),
									})
									.passthrough(),
							)
							.optional(),
						to: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										email_address: z.string().optional(),
										name: z.string().optional(),
										linked_person_id: z.number().int().nullable().optional(),
										linked_person_name: z.string().nullable().optional(),
										mail_message_party_id: z.number().int().optional(),
									})
									.passthrough(),
							)
							.optional(),
						cc: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										email_address: z.string().optional(),
										name: z.string().optional(),
										linked_person_id: z.number().int().nullable().optional(),
										linked_person_name: z.string().nullable().optional(),
										mail_message_party_id: z.number().int().optional(),
									})
									.passthrough(),
							)
							.optional(),
						bcc: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										email_address: z.string().optional(),
										name: z.string().optional(),
										linked_person_id: z.number().int().nullable().optional(),
										linked_person_name: z.string().nullable().optional(),
										mail_message_party_id: z.number().int().optional(),
									})
									.passthrough(),
							)
							.optional(),
						body_url: z.string().optional(),
						body: z.string().optional(),
						account_id: z.string().optional(),
						user_id: z.number().int().optional(),
						mail_thread_id: z.number().int().optional(),
						subject: z.string().optional(),
						snippet: z.string().optional(),
						mail_tracking_status: z
							.union([z.literal('opened'), z.literal('not opened')])
							.nullable()
							.optional(),
						mail_link_tracking_enabled_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						draft: z.string().nullable().optional(),
						draft_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						synced_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						has_body_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						sent_from_pipedrive_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						smart_bcc_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						message_time: z.string().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						has_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						has_inline_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						has_real_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.mailbox.getMailThreads': {
		version: 'v1',
		method: 'GET',
		path: '/mailbox/mailThreads',
		group: 'mailbox',
		operationId: 'getMailThreads',
		summary: 'Get mail threads',
		tokenCost: 20,
		oauthScopes: ['mail:read', 'mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'folder', style: 'form', explode: true, type: 'string' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					folder: z.union([
						z.literal('inbox'),
						z.literal('drafts'),
						z.literal('sent'),
						z.literal('archive'),
					]),
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								account_id: z.string().optional(),
								user_id: z.number().int().optional(),
								subject: z.string().optional(),
								snippet: z.string().optional(),
								read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								mail_tracking_status: z.string().nullable().optional(),
								has_attachments_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								has_inline_attachments_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								has_real_attachments_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								synced_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								smart_bcc_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								mail_link_tracking_enabled_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								parties: z
									.object({
										to: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
														latest_sent: z.boolean().optional(),
														email_address: z.string().optional(),
														message_time: z.number().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
														linked_organization_id: z
															.number()
															.int()
															.nullable()
															.optional(),
													})
													.passthrough(),
											)
											.optional(),
										from: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
														latest_sent: z.boolean().optional(),
														email_address: z.string().optional(),
														message_time: z.number().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
														linked_organization_id: z
															.number()
															.int()
															.nullable()
															.optional(),
													})
													.passthrough(),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
								drafts_parties: z
									.array(z.object({}).passthrough())
									.nullable()
									.optional(),
								folders: z.array(z.string()).optional(),
								version: z.number().optional(),
								snippet_draft: z.string().nullable().optional(),
								snippet_sent: z.string().nullable().optional(),
								message_count: z.number().int().optional(),
								has_draft_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								has_sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								archived_flag: z
									.union([z.literal(0), z.literal(1)])
									.nullable()
									.optional(),
								shared_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								external_deleted_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								first_message_to_me_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								last_message_timestamp: z.string().optional(),
								first_message_timestamp: z.string().optional(),
								last_message_sent_timestamp: z.string().nullable().optional(),
								last_message_received_timestamp: z
									.string()
									.nullable()
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								deal_id: z.number().int().nullable().optional(),
								deal_status: z.string().nullable().optional(),
								lead_id: z.string().nullable().optional(),
								all_messages_sent_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.mailbox.deleteMailThread': {
		version: 'v1',
		method: 'DELETE',
		path: '/mailbox/mailThreads/{id}',
		group: 'mailbox',
		operationId: 'deleteMailThread',
		summary: 'Delete mail thread',
		tokenCost: 6,
		oauthScopes: ['mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.mailbox.getMailThread': {
		version: 'v1',
		method: 'GET',
		path: '/mailbox/mailThreads/{id}',
		group: 'mailbox',
		operationId: 'getMailThread',
		summary: 'Get one mail thread',
		tokenCost: 20,
		oauthScopes: ['mail:read', 'mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						account_id: z.string().optional(),
						user_id: z.number().int().optional(),
						subject: z.string().optional(),
						snippet: z.string().optional(),
						read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						mail_tracking_status: z.string().nullable().optional(),
						has_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						has_inline_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						has_real_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						synced_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						smart_bcc_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						mail_link_tracking_enabled_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						parties: z
							.object({
								to: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								from: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						drafts_parties: z
							.array(z.object({}).passthrough())
							.nullable()
							.optional(),
						folders: z.array(z.string()).optional(),
						version: z.number().optional(),
						snippet_draft: z.string().nullable().optional(),
						snippet_sent: z.string().nullable().optional(),
						message_count: z.number().int().optional(),
						has_draft_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						has_sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						archived_flag: z
							.union([z.literal(0), z.literal(1)])
							.nullable()
							.optional(),
						shared_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						external_deleted_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						first_message_to_me_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						last_message_timestamp: z.string().optional(),
						first_message_timestamp: z.string().optional(),
						last_message_sent_timestamp: z.string().nullable().optional(),
						last_message_received_timestamp: z.string().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						deal_id: z.number().int().nullable().optional(),
						deal_status: z.string().nullable().optional(),
						lead_id: z.string().nullable().optional(),
						all_messages_sent_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.mailbox.updateMailThreadDetails': {
		version: 'v1',
		method: 'PUT',
		path: '/mailbox/mailThreads/{id}',
		group: 'mailbox',
		operationId: 'updateMailThreadDetails',
		summary: 'Update mail thread details',
		tokenCost: 10,
		oauthScopes: ['mail:full'],
		requestContentType: 'application/x-www-form-urlencoded',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					deal_id: z.number().int().nullable().optional(),
					lead_id: z.string().nullable().optional(),
					shared_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					archived_flag: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						account_id: z.string().optional(),
						user_id: z.number().int().optional(),
						subject: z.string().optional(),
						snippet: z.string().optional(),
						read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						mail_tracking_status: z.string().nullable().optional(),
						has_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						has_inline_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						has_real_attachments_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						synced_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						smart_bcc_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						mail_link_tracking_enabled_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						parties: z
							.object({
								to: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								from: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
						drafts_parties: z
							.array(z.object({}).passthrough())
							.nullable()
							.optional(),
						folders: z.array(z.string()).optional(),
						version: z.number().optional(),
						snippet_draft: z.string().nullable().optional(),
						snippet_sent: z.string().nullable().optional(),
						message_count: z.number().int().optional(),
						has_draft_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						has_sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						archived_flag: z
							.union([z.literal(0), z.literal(1)])
							.nullable()
							.optional(),
						shared_flag: z.union([z.literal(0), z.literal(1)]).optional(),
						external_deleted_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						first_message_to_me_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
						last_message_timestamp: z.string().optional(),
						first_message_timestamp: z.string().optional(),
						last_message_sent_timestamp: z.string().nullable().optional(),
						last_message_received_timestamp: z.string().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						deal_id: z.number().int().nullable().optional(),
						deal_status: z.string().nullable().optional(),
						lead_id: z.string().nullable().optional(),
						all_messages_sent_flag: z
							.union([z.literal(0), z.literal(1)])
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.mailbox.getMailThreadMessages': {
		version: 'v1',
		method: 'GET',
		path: '/mailbox/mailThreads/{id}/mailMessages',
		group: 'mailbox',
		operationId: 'getMailThreadMessages',
		summary: 'Get all mail messages of mail thread',
		tokenCost: 20,
		oauthScopes: ['mail:read', 'mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								account_id: z.string().optional(),
								user_id: z.number().int().optional(),
								subject: z.string().optional(),
								snippet: z.string().optional(),
								read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								mail_tracking_status: z.string().nullable().optional(),
								has_attachments_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								has_inline_attachments_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								has_real_attachments_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								deleted_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								synced_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								smart_bcc_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								mail_link_tracking_enabled_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								from: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								to: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								cc: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								bcc: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												name: z.string().optional(),
												latest_sent: z.boolean().optional(),
												email_address: z.string().optional(),
												message_time: z.number().optional(),
												linked_person_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												linked_person_name: z.string().nullable().optional(),
												mail_message_party_id: z.number().int().optional(),
												linked_organization_id: z
													.number()
													.int()
													.nullable()
													.optional(),
											})
											.passthrough(),
									)
									.optional(),
								body_url: z.string().optional(),
								mail_thread_id: z.number().int().optional(),
								draft: z.string().nullable().optional(),
								has_body_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
								sent_from_pipedrive_flag: z
									.union([z.literal(0), z.literal(1)])
									.optional(),
								message_time: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.meetings.saveUserProviderLink': {
		version: 'v1',
		method: 'POST',
		path: '/meetings/userProviderLinks',
		group: 'meetings',
		operationId: 'saveUserProviderLink',
		summary: 'Link a user with the installed video call integration',
		tokenCost: 10,
		oauthScopes: ['video-calls'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					user_provider_id: z.string(),
					user_id: z.number().int(),
					company_id: z.number().int(),
					marketplace_client_id: z.string(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ message: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.meetings.deleteUserProviderLink': {
		version: 'v1',
		method: 'DELETE',
		path: '/meetings/userProviderLinks/{id}',
		group: 'meetings',
		operationId: 'deleteUserProviderLink',
		summary:
			'Delete the link between a user and the installed video call integration',
		tokenCost: 6,
		oauthScopes: ['video-calls'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ message: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.getNotes': {
		version: 'v1',
		method: 'GET',
		path: '/notes',
		group: 'notes',
		operationId: 'getNotes',
		summary: 'Get all notes',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full', 'contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'lead_id', style: 'form', explode: true, type: 'string' },
			{ name: 'deal_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'org_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'project_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'task_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
			{ name: 'start_date', style: 'form', explode: true, type: 'string' },
			{ name: 'end_date', style: 'form', explode: true, type: 'string' },
			{ name: 'updated_since', style: 'form', explode: true, type: 'string' },
			{
				name: 'pinned_to_lead_flag',
				style: 'form',
				explode: true,
				type: 'number',
			},
			{
				name: 'pinned_to_deal_flag',
				style: 'form',
				explode: true,
				type: 'number',
			},
			{
				name: 'pinned_to_organization_flag',
				style: 'form',
				explode: true,
				type: 'number',
			},
			{
				name: 'pinned_to_person_flag',
				style: 'form',
				explode: true,
				type: 'number',
			},
			{
				name: 'pinned_to_project_flag',
				style: 'form',
				explode: true,
				type: 'number',
			},
			{
				name: 'pinned_to_task_flag',
				style: 'form',
				explode: true,
				type: 'number',
			},
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					user_id: z.number().int().optional(),
					lead_id: z.string().optional(),
					deal_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					project_id: z.number().int().optional(),
					task_id: z.number().int().optional(),
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					sort: z.string().optional(),
					start_date: z.string().optional(),
					end_date: z.string().optional(),
					updated_since: z.string().optional(),
					pinned_to_lead_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					pinned_to_deal_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					pinned_to_organization_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_person_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_project_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_task_flag: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								add_time: z.string().optional(),
								content: z.string().optional(),
								deal: z
									.object({ title: z.string().optional() })
									.passthrough()
									.nullable()
									.optional(),
								lead_id: z.string().nullable().optional(),
								deal_id: z.number().int().nullable().optional(),
								last_update_user_id: z.number().int().nullable().optional(),
								org_id: z.number().int().nullable().optional(),
								organization: z
									.object({ name: z.string().optional() })
									.passthrough()
									.nullable()
									.optional(),
								person: z
									.object({ name: z.string().optional() })
									.passthrough()
									.nullable()
									.optional(),
								person_id: z.number().int().nullable().optional(),
								project_id: z.number().int().nullable().optional(),
								project: z
									.object({ title: z.string().optional() })
									.passthrough()
									.nullable()
									.optional(),
								task_id: z.number().int().nullable().optional(),
								task: z
									.object({ title: z.string().optional() })
									.passthrough()
									.nullable()
									.optional(),
								pinned_to_deal_flag: z.boolean().optional(),
								pinned_to_organization_flag: z.boolean().optional(),
								pinned_to_person_flag: z.boolean().optional(),
								pinned_to_project_flag: z.boolean().optional(),
								pinned_to_task_flag: z.boolean().optional(),
								update_time: z.string().optional(),
								user: z
									.object({
										email: z.string().optional(),
										icon_url: z.string().nullable().optional(),
										is_you: z.boolean().optional(),
										name: z.string().optional(),
									})
									.passthrough()
									.optional(),
								user_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								next_start: z.number().int().optional(),
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.addNote': {
		version: 'v1',
		method: 'POST',
		path: '/notes',
		group: 'notes',
		operationId: 'addNote',
		summary: 'Add a note',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.object({
					content: z.string(),
					lead_id: z.string().optional(),
					deal_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					project_id: z.number().int().optional(),
					task_id: z.number().int().optional(),
					user_id: z.number().int().optional(),
					add_time: z.string().optional(),
					pinned_to_lead_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					pinned_to_deal_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					pinned_to_organization_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_person_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_project_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_task_flag: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.catchall(z.json())
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						content: z.string().optional(),
						deal: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						lead_id: z.string().nullable().optional(),
						deal_id: z.number().int().nullable().optional(),
						last_update_user_id: z.number().int().nullable().optional(),
						org_id: z.number().int().nullable().optional(),
						organization: z
							.object({ name: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						person: z
							.object({ name: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						person_id: z.number().int().nullable().optional(),
						project_id: z.number().int().nullable().optional(),
						project: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						task_id: z.number().int().nullable().optional(),
						task: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						pinned_to_deal_flag: z.boolean().optional(),
						pinned_to_organization_flag: z.boolean().optional(),
						pinned_to_person_flag: z.boolean().optional(),
						pinned_to_project_flag: z.boolean().optional(),
						pinned_to_task_flag: z.boolean().optional(),
						update_time: z.string().optional(),
						user: z
							.object({
								email: z.string().optional(),
								icon_url: z.string().nullable().optional(),
								is_you: z.boolean().optional(),
								name: z.string().optional(),
							})
							.passthrough()
							.optional(),
						user_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.deleteNote': {
		version: 'v1',
		method: 'DELETE',
		path: '/notes/{id}',
		group: 'notes',
		operationId: 'deleteNote',
		summary: 'Delete a note',
		tokenCost: 6,
		oauthScopes: ['deals:full', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({ success: z.boolean().optional(), data: z.boolean().optional() })
			.passthrough(),
	},
	'apiV1.notes.getNote': {
		version: 'v1',
		method: 'GET',
		path: '/notes/{id}',
		group: 'notes',
		operationId: 'getNote',
		summary: 'Get one note',
		tokenCost: 2,
		oauthScopes: ['deals:read', 'deals:full', 'contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						content: z.string().optional(),
						deal: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						lead_id: z.string().nullable().optional(),
						deal_id: z.number().int().nullable().optional(),
						last_update_user_id: z.number().int().nullable().optional(),
						org_id: z.number().int().nullable().optional(),
						organization: z
							.object({ name: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						person: z
							.object({ name: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						person_id: z.number().int().nullable().optional(),
						project_id: z.number().int().nullable().optional(),
						project: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						task_id: z.number().int().nullable().optional(),
						task: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						pinned_to_deal_flag: z.boolean().optional(),
						pinned_to_organization_flag: z.boolean().optional(),
						pinned_to_person_flag: z.boolean().optional(),
						pinned_to_project_flag: z.boolean().optional(),
						pinned_to_task_flag: z.boolean().optional(),
						update_time: z.string().optional(),
						user: z
							.object({
								email: z.string().optional(),
								icon_url: z.string().nullable().optional(),
								is_you: z.boolean().optional(),
								name: z.string().optional(),
							})
							.passthrough()
							.optional(),
						user_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.updateNote': {
		version: 'v1',
		method: 'PUT',
		path: '/notes/{id}',
		group: 'notes',
		operationId: 'updateNote',
		summary: 'Update a note',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					content: z.string().optional(),
					lead_id: z.string().optional(),
					deal_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					project_id: z.number().int().optional(),
					task_id: z.number().int().optional(),
					user_id: z.number().int().optional(),
					add_time: z.string().optional(),
					pinned_to_lead_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					pinned_to_deal_flag: z.union([z.literal(0), z.literal(1)]).optional(),
					pinned_to_organization_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_person_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_project_flag: z
						.union([z.literal(0), z.literal(1)])
						.optional(),
					pinned_to_task_flag: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						content: z.string().optional(),
						deal: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						lead_id: z.string().nullable().optional(),
						deal_id: z.number().int().nullable().optional(),
						last_update_user_id: z.number().int().nullable().optional(),
						org_id: z.number().int().nullable().optional(),
						organization: z
							.object({ name: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						person: z
							.object({ name: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						person_id: z.number().int().nullable().optional(),
						project_id: z.number().int().nullable().optional(),
						project: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						task_id: z.number().int().nullable().optional(),
						task: z
							.object({ title: z.string().optional() })
							.passthrough()
							.nullable()
							.optional(),
						pinned_to_deal_flag: z.boolean().optional(),
						pinned_to_organization_flag: z.boolean().optional(),
						pinned_to_person_flag: z.boolean().optional(),
						pinned_to_project_flag: z.boolean().optional(),
						pinned_to_task_flag: z.boolean().optional(),
						update_time: z.string().optional(),
						user: z
							.object({
								email: z.string().optional(),
								icon_url: z.string().nullable().optional(),
								is_you: z.boolean().optional(),
								name: z.string().optional(),
							})
							.passthrough()
							.optional(),
						user_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.getNoteComments': {
		version: 'v1',
		method: 'GET',
		path: '/notes/{id}/comments',
		group: 'notes',
		operationId: 'getNoteComments',
		summary: 'Get all comments for a note',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full', 'contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								uuid: z.string().optional(),
								active_flag: z.boolean().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								content: z.string().optional(),
								object_id: z.string().optional(),
								object_type: z.string().optional(),
								user_id: z.number().int().optional(),
								updater_id: z.number().int().optional(),
								company_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								next_start: z.number().int().optional(),
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.addNoteComment': {
		version: 'v1',
		method: 'POST',
		path: '/notes/{id}/comments',
		group: 'notes',
		operationId: 'addNoteComment',
		summary: 'Add a comment to a note',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ content: z.string() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						uuid: z.string().optional(),
						active_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						content: z.string().optional(),
						object_id: z.string().optional(),
						object_type: z.string().optional(),
						user_id: z.number().int().optional(),
						updater_id: z.number().int().optional(),
						company_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.getComment': {
		version: 'v1',
		method: 'GET',
		path: '/notes/{id}/comments/{commentId}',
		group: 'notes',
		operationId: 'getComment',
		summary: 'Get one comment',
		tokenCost: 2,
		oauthScopes: ['deals:read', 'deals:full', 'contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'commentId'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int(), commentId: z.string() }),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						uuid: z.string().optional(),
						active_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						content: z.string().optional(),
						object_id: z.string().optional(),
						object_type: z.string().optional(),
						user_id: z.number().int().optional(),
						updater_id: z.number().int().optional(),
						company_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.updateCommentForNote': {
		version: 'v1',
		method: 'PUT',
		path: '/notes/{id}/comments/{commentId}',
		group: 'notes',
		operationId: 'updateCommentForNote',
		summary: 'Update a comment related to a note',
		tokenCost: 10,
		oauthScopes: ['deals:full', 'contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'commentId'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int(), commentId: z.string() }),
			body: z.strictObject({ content: z.string() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						uuid: z.string().optional(),
						active_flag: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						content: z.string().optional(),
						object_id: z.string().optional(),
						object_type: z.string().optional(),
						user_id: z.number().int().optional(),
						updater_id: z.number().int().optional(),
						company_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.notes.deleteComment': {
		version: 'v1',
		method: 'DELETE',
		path: '/notes/{id}/comments/{commentId}',
		group: 'notes',
		operationId: 'deleteComment',
		summary: 'Delete a comment related to a note',
		tokenCost: 6,
		oauthScopes: ['deals:full', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'commentId'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int(), commentId: z.string() }),
		}),
		output: z
			.object({ success: z.boolean().optional(), data: z.boolean().optional() })
			.passthrough(),
	},
	'apiV1.noteFields.getNoteFields': {
		version: 'v1',
		method: 'GET',
		path: '/noteFields',
		group: 'noteFields',
		operationId: 'getNoteFields',
		summary: 'Get all note fields',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full', 'contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								key: z.string().optional(),
								name: z.string().optional(),
								field_type: z
									.union([
										z.literal('boolean'),
										z.literal('double'),
										z.literal('int'),
										z.literal('json'),
										z.literal('date'),
										z.literal('daterange'),
										z.literal('time'),
										z.literal('timerange'),
										z.literal('text'),
										z.literal('varchar'),
										z.literal('varchar_auto'),
										z.literal('varchar_options'),
										z.literal('address'),
										z.literal('enum'),
										z.literal('monetary'),
										z.literal('phone'),
										z.literal('set'),
										z.literal('activity'),
										z.literal('deal'),
										z.literal('lead'),
										z.literal('org'),
										z.literal('people'),
										z.literal('pipeline'),
										z.literal('product'),
										z.literal('project'),
										z.literal('stage'),
										z.literal('user'),
										z.literal('billing_frequency'),
										z.literal('picture'),
										z.literal('price_list'),
										z.literal('projects_board'),
										z.literal('projects_phase'),
										z.literal('status'),
										z.literal('visible_to'),
									])
									.optional(),
								active_flag: z.boolean().optional(),
								edit_flag: z.boolean().optional(),
								bulk_edit_allowed: z.boolean().optional(),
								mandatory_flag: z.boolean().optional(),
								options: z
									.array(
										z
											.object({
												id: z.number().int().optional(),
												label: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.getOrganizationChangelog': {
		version: 'v1',
		method: 'GET',
		path: '/organizations/{id}/changelog',
		group: 'organizations',
		operationId: 'getOrganizationChangelog',
		summary: 'List updates about organization field values',
		tokenCost: 20,
		oauthScopes: ['recents:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_key: z.string().optional(),
								old_value: z.string().nullable().optional(),
								new_value: z.string().nullable().optional(),
								actor_user_id: z.number().int().optional(),
								time: z.string().optional(),
								change_source: z.string().nullable().optional(),
								change_source_user_agent: z.string().nullable().optional(),
								is_bulk_update_flag: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.getOrganizationFiles': {
		version: 'v1',
		method: 'GET',
		path: '/organizations/{id}/files',
		group: 'organizations',
		operationId: 'getOrganizationFiles',
		summary: 'List files attached to an organization',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().max(100).optional(),
					sort: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								user_id: z.number().int().optional(),
								deal_id: z.number().int().optional(),
								person_id: z.number().int().optional(),
								org_id: z.number().int().optional(),
								product_id: z.number().int().optional(),
								activity_id: z.number().int().optional(),
								lead_id: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								file_name: z.string().optional(),
								file_size: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								inline_flag: z.boolean().optional(),
								remote_location: z.string().optional(),
								remote_id: z.string().optional(),
								cid: z.string().optional(),
								s3_bucket: z.string().optional(),
								mail_message_id: z.string().optional(),
								mail_template_id: z.string().optional(),
								deal_name: z.string().optional(),
								person_name: z.string().optional(),
								org_name: z.string().optional(),
								product_name: z.string().optional(),
								lead_name: z.string().optional(),
								url: z.string().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.getOrganizationUpdates': {
		version: 'v1',
		method: 'GET',
		path: '/organizations/{id}/flow',
		group: 'organizations',
		operationId: 'getOrganizationUpdates',
		summary: 'List updates about an organization',
		tokenCost: 40,
		oauthScopes: ['recents:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'all_changes', style: 'form', explode: true, type: 'string' },
			{ name: 'items', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					all_changes: z.string().optional(),
					items: z
						.array(z.string())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								object: z.string().optional(),
								timestamp: z.string().optional(),
								data: z.object({}).passthrough().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						user: z
							.object({
								USER_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.getOrganizationFollowers': {
		version: 'v1',
		method: 'GET',
		path: '/organizations/{id}/followers',
		group: 'organizations',
		operationId: 'getOrganizationFollowers',
		summary: 'List followers of an organization',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								org_id: z.number().int().optional(),
								user_id: z.number().int().optional(),
								id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
								next_start: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.addOrganizationFollower': {
		version: 'v1',
		method: 'POST',
		path: '/organizations/{id}/followers',
		group: 'organizations',
		operationId: 'addOrganizationFollower',
		summary: 'Add a follower to an organization',
		tokenCost: 10,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						org_id: z.number().int().optional(),
						user_id: z.number().int().optional(),
						id: z.number().int().optional(),
						add_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.deleteOrganizationFollower': {
		version: 'v1',
		method: 'DELETE',
		path: '/organizations/{id}/followers/{follower_id}',
		group: 'organizations',
		operationId: 'deleteOrganizationFollower',
		summary: 'Delete a follower from an organization',
		tokenCost: 6,
		oauthScopes: ['contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'follower_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				follower_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.getOrganizationMailMessages': {
		version: 'v1',
		method: 'GET',
		path: '/organizations/{id}/mailMessages',
		group: 'organizations',
		operationId: 'getOrganizationMailMessages',
		summary: 'List mail messages associated with an organization',
		tokenCost: 20,
		oauthScopes: ['mail:read', 'mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'include_body', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					include_body: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								object: z.string().optional(),
								timestamp: z.string().optional(),
								data: z
									.object({
										id: z.number().int().optional(),
										from: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										to: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										cc: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										bcc: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										body_url: z.string().optional(),
										body: z.string().optional(),
										account_id: z.string().optional(),
										user_id: z.number().int().optional(),
										mail_thread_id: z.number().int().optional(),
										subject: z.string().optional(),
										snippet: z.string().optional(),
										mail_tracking_status: z
											.union([z.literal('opened'), z.literal('not opened')])
											.nullable()
											.optional(),
										mail_link_tracking_enabled_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
										draft: z.string().nullable().optional(),
										draft_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										synced_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										deleted_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_body_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
										sent_from_pipedrive_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										smart_bcc_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										message_time: z.string().optional(),
										add_time: z.string().optional(),
										update_time: z.string().optional(),
										has_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_inline_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_real_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										nylas_id: z.string().optional(),
										s3_bucket: z.string().optional(),
										s3_bucket_path: z.string().optional(),
										external_deleted_flag: z.boolean().optional(),
										mua_message_id: z.string().optional(),
										template_id: z.number().int().nullable().optional(),
										timestamp: z.string().optional(),
										item_type: z.string().optional(),
										company_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.mergeOrganizations': {
		version: 'v1',
		method: 'PUT',
		path: '/organizations/{id}/merge',
		group: 'organizations',
		operationId: 'mergeOrganizations',
		summary: 'Merge two organizations',
		tokenCost: 40,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ merge_with_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizations.getOrganizationUsers': {
		version: 'v1',
		method: 'GET',
		path: '/organizations/{id}/permittedUsers',
		group: 'organizations',
		operationId: 'getOrganizationUsers',
		summary: 'List permitted users',
		tokenCost: 10,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number()).optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationFields.getOrganizationFields': {
		version: 'v1',
		method: 'GET',
		path: '/organizationFields',
		group: 'organizationFields',
		operationId: 'getOrganizationFields',
		summary: 'Get all organization fields',
		tokenCost: 20,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'contact-fields:full',
			'admin',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().nullable().optional(),
								key: z.string().optional(),
								name: z.string().optional(),
								order_nr: z.number().int().optional(),
								field_type: z
									.union([
										z.literal('boolean'),
										z.literal('double'),
										z.literal('int'),
										z.literal('json'),
										z.literal('date'),
										z.literal('daterange'),
										z.literal('time'),
										z.literal('timerange'),
										z.literal('text'),
										z.literal('varchar'),
										z.literal('varchar_auto'),
										z.literal('varchar_options'),
										z.literal('address'),
										z.literal('enum'),
										z.literal('monetary'),
										z.literal('phone'),
										z.literal('set'),
										z.literal('activity'),
										z.literal('deal'),
										z.literal('lead'),
										z.literal('org'),
										z.literal('people'),
										z.literal('pipeline'),
										z.literal('product'),
										z.literal('project'),
										z.literal('stage'),
										z.literal('user'),
										z.literal('billing_frequency'),
										z.literal('picture'),
										z.literal('price_list'),
										z.literal('projects_board'),
										z.literal('projects_phase'),
										z.literal('status'),
										z.literal('visible_to'),
									])
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								last_updated_by_user_id: z.number().int().nullable().optional(),
								created_by_user_id: z.number().int().nullable().optional(),
								active_flag: z.boolean().optional(),
								edit_flag: z.boolean().optional(),
								index_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								add_visible_flag: z.boolean().optional(),
								important_flag: z.boolean().optional(),
								bulk_edit_allowed: z.boolean().optional(),
								searchable_flag: z.boolean().optional(),
								filtering_allowed: z.boolean().optional(),
								sortable_flag: z.boolean().optional(),
								mandatory_flag: z.boolean().optional(),
								options: z
									.array(z.object({}).passthrough())
									.nullable()
									.optional(),
								options_deleted: z.array(z.object({}).passthrough()).optional(),
								is_subfield: z.boolean().optional(),
								subfields: z.array(z.object({}).passthrough()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationFields.addOrganizationField': {
		version: 'v1',
		method: 'POST',
		path: '/organizationFields',
		group: 'organizationFields',
		operationId: 'addOrganizationField',
		summary: 'Add a new organization field',
		tokenCost: 10,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					options: z.array(z.strictObject({ label: z.string() })).optional(),
					add_visible_flag: z.boolean().optional(),
					field_type: z.union([
						z.literal('address'),
						z.literal('date'),
						z.literal('daterange'),
						z.literal('double'),
						z.literal('enum'),
						z.literal('monetary'),
						z.literal('org'),
						z.literal('people'),
						z.literal('phone'),
						z.literal('set'),
						z.literal('text'),
						z.literal('time'),
						z.literal('timerange'),
						z.literal('user'),
						z.literal('varchar'),
						z.literal('varchar_auto'),
						z.literal('visible_to'),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationFields.deleteOrganizationFields': {
		version: 'v1',
		method: 'DELETE',
		path: '/organizationFields',
		group: 'organizationFields',
		operationId: 'deleteOrganizationFields',
		summary: 'Delete multiple organization fields in bulk',
		tokenCost: 10,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'ids', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					ids: z
						.array(z.number().int())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationFields.getOrganizationField': {
		version: 'v1',
		method: 'GET',
		path: '/organizationFields/{id}',
		group: 'organizationFields',
		operationId: 'getOrganizationField',
		summary: 'Get one organization field',
		tokenCost: 2,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'contact-fields:full',
			'admin',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationFields.deleteOrganizationField': {
		version: 'v1',
		method: 'DELETE',
		path: '/organizationFields/{id}',
		group: 'organizationFields',
		operationId: 'deleteOrganizationField',
		summary: 'Delete an organization field',
		tokenCost: 6,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationFields.updateOrganizationField': {
		version: 'v1',
		method: 'PUT',
		path: '/organizationFields/{id}',
		group: 'organizationFields',
		operationId: 'updateOrganizationField',
		summary: 'Update an organization field',
		tokenCost: 10,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					options: z
						.array(
							z.strictObject({
								id: z.number().int().optional(),
								label: z.string(),
							}),
						)
						.optional(),
					add_visible_flag: z.boolean().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationRelationships.getOrganizationRelationships': {
		version: 'v1',
		method: 'GET',
		path: '/organizationRelationships',
		group: 'organizationRelationships',
		operationId: 'getOrganizationRelationships',
		summary: 'Get all relationships for organization',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'org_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z.strictObject({ org_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								type: z.string().optional(),
								rel_owner_org_id: z
									.object({
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								rel_linked_org_id: z
									.object({
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								active_flag: z.string().optional(),
								calculated_type: z.string().optional(),
								calculated_related_org_id: z.number().int().optional(),
								related_organization_name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationRelationships.addOrganizationRelationship': {
		version: 'v1',
		method: 'POST',
		path: '/organizationRelationships',
		group: 'organizationRelationships',
		operationId: 'addOrganizationRelationship',
		summary: 'Create an organization relationship',
		tokenCost: 10,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					org_id: z.number().int().optional(),
					type: z.union([z.literal('parent'), z.literal('related')]),
					rel_owner_org_id: z.number().int(),
					rel_linked_org_id: z.number().int(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						type: z.string().optional(),
						rel_owner_org_id: z
							.object({
								name: z.string().optional(),
								people_count: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								address: z.string().nullable().optional(),
								cc_email: z.string().nullable().optional(),
								value: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						rel_linked_org_id: z
							.object({
								name: z.string().optional(),
								people_count: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								address: z.string().nullable().optional(),
								cc_email: z.string().nullable().optional(),
								value: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						active_flag: z.string().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationRelationships.deleteOrganizationRelationship': {
		version: 'v1',
		method: 'DELETE',
		path: '/organizationRelationships/{id}',
		group: 'organizationRelationships',
		operationId: 'deleteOrganizationRelationship',
		summary: 'Delete an organization relationship',
		tokenCost: 6,
		oauthScopes: ['contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationRelationships.getOrganizationRelationship': {
		version: 'v1',
		method: 'GET',
		path: '/organizationRelationships/{id}',
		group: 'organizationRelationships',
		operationId: 'getOrganizationRelationship',
		summary: 'Get one organization relationship',
		tokenCost: 2,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'org_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z.strictObject({ org_id: z.number().int().optional() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						type: z.string().optional(),
						rel_owner_org_id: z
							.object({
								name: z.string().optional(),
								people_count: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								address: z.string().nullable().optional(),
								cc_email: z.string().nullable().optional(),
								value: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						rel_linked_org_id: z
							.object({
								name: z.string().optional(),
								people_count: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								address: z.string().nullable().optional(),
								cc_email: z.string().nullable().optional(),
								value: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						active_flag: z.string().optional(),
						calculated_type: z.string().optional(),
						calculated_related_org_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.organizationRelationships.updateOrganizationRelationship': {
		version: 'v1',
		method: 'PUT',
		path: '/organizationRelationships/{id}',
		group: 'organizationRelationships',
		operationId: 'updateOrganizationRelationship',
		summary: 'Update an organization relationship',
		tokenCost: 10,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					org_id: z.number().int().optional(),
					type: z.union([z.literal('parent'), z.literal('related')]).optional(),
					rel_owner_org_id: z.number().int().optional(),
					rel_linked_org_id: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						type: z.string().optional(),
						rel_owner_org_id: z
							.object({
								name: z.string().optional(),
								people_count: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								address: z.string().nullable().optional(),
								cc_email: z.string().nullable().optional(),
								value: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						rel_linked_org_id: z
							.object({
								name: z.string().optional(),
								people_count: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								address: z.string().nullable().optional(),
								cc_email: z.string().nullable().optional(),
								value: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						active_flag: z.string().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.permissionSets.getPermissionSets': {
		version: 'v1',
		method: 'GET',
		path: '/permissionSets',
		group: 'permissionSets',
		operationId: 'getPermissionSets',
		summary: 'Get all permission sets',
		tokenCost: 20,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'app', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					app: z
						.union([
							z.literal('sales'),
							z.literal('projects'),
							z.literal('campaigns'),
							z.literal('global'),
							z.literal('account_settings'),
							z.literal('partnership'),
							z.literal('nova'),
						])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.string().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
								app: z
									.union([
										z.literal('sales'),
										z.literal('projects'),
										z.literal('campaigns'),
										z.literal('global'),
										z.literal('account_settings'),
										z.literal('partnership'),
										z.literal('nova'),
									])
									.optional(),
								type: z
									.union([
										z.literal('admin'),
										z.literal('manager'),
										z.literal('regular'),
										z.literal('custom'),
									])
									.optional(),
								assignment_count: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.permissionSets.getPermissionSet': {
		version: 'v1',
		method: 'GET',
		path: '/permissionSets/{id}',
		group: 'permissionSets',
		operationId: 'getPermissionSet',
		summary: 'Get one permission set',
		tokenCost: 2,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.string() }) }),
		output: z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
				description: z.string().optional(),
				app: z
					.union([
						z.literal('sales'),
						z.literal('projects'),
						z.literal('campaigns'),
						z.literal('global'),
						z.literal('account_settings'),
						z.literal('partnership'),
						z.literal('nova'),
					])
					.optional(),
				type: z
					.union([
						z.literal('admin'),
						z.literal('manager'),
						z.literal('regular'),
						z.literal('custom'),
					])
					.optional(),
				assignment_count: z.number().int().optional(),
				contents: z.array(z.string()).optional(),
			})
			.passthrough(),
	},
	'apiV1.permissionSets.getPermissionSetAssignments': {
		version: 'v1',
		method: 'GET',
		path: '/permissionSets/{id}/assignments',
		group: 'permissionSets',
		operationId: 'getPermissionSetAssignments',
		summary: 'List permission set assignments',
		tokenCost: 20,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								permission_set_id: z.string().optional(),
								name: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.getPersonChangelog': {
		version: 'v1',
		method: 'GET',
		path: '/persons/{id}/changelog',
		group: 'persons',
		operationId: 'getPersonChangelog',
		summary: 'List updates about person field values',
		tokenCost: 20,
		oauthScopes: ['recents:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_key: z.string().optional(),
								old_value: z.string().nullable().optional(),
								new_value: z.string().nullable().optional(),
								actor_user_id: z.number().int().optional(),
								time: z.string().optional(),
								change_source: z.string().nullable().optional(),
								change_source_user_agent: z.string().nullable().optional(),
								is_bulk_update_flag: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.getPersonFiles': {
		version: 'v1',
		method: 'GET',
		path: '/persons/{id}/files',
		group: 'persons',
		operationId: 'getPersonFiles',
		summary: 'List files attached to a person',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().max(100).optional(),
					sort: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								user_id: z.number().int().optional(),
								deal_id: z.number().int().optional(),
								person_id: z.number().int().optional(),
								org_id: z.number().int().optional(),
								product_id: z.number().int().optional(),
								activity_id: z.number().int().optional(),
								lead_id: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								file_name: z.string().optional(),
								file_size: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								inline_flag: z.boolean().optional(),
								remote_location: z.string().optional(),
								remote_id: z.string().optional(),
								cid: z.string().optional(),
								s3_bucket: z.string().optional(),
								mail_message_id: z.string().optional(),
								mail_template_id: z.string().optional(),
								deal_name: z.string().optional(),
								person_name: z.string().optional(),
								org_name: z.string().optional(),
								product_name: z.string().optional(),
								lead_name: z.string().optional(),
								url: z.string().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.getPersonUpdates': {
		version: 'v1',
		method: 'GET',
		path: '/persons/{id}/flow',
		group: 'persons',
		operationId: 'getPersonUpdates',
		summary: 'List updates about a person',
		tokenCost: 40,
		oauthScopes: ['recents:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'all_changes', style: 'form', explode: true, type: 'string' },
			{ name: 'items', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					all_changes: z.string().optional(),
					items: z
						.array(z.string())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								object: z.string().optional(),
								timestamp: z.string().optional(),
								data: z.object({}).passthrough().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						deal: z
							.object({
								DEAL_ID: z
									.object({
										id: z.number().int().optional(),
										title: z.string().optional(),
										status: z.string().optional(),
										value: z.number().optional(),
										currency: z.string().optional(),
										stage_id: z.number().int().optional(),
										pipeline_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						user: z
							.object({
								USER_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						person: z
							.object({
								PERSON_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.getPersonFollowers': {
		version: 'v1',
		method: 'GET',
		path: '/persons/{id}/followers',
		group: 'persons',
		operationId: 'getPersonFollowers',
		summary: 'List followers of a person',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								id: z.number().int().optional(),
								deal_id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.addPersonFollower': {
		version: 'v1',
		method: 'POST',
		path: '/persons/{id}/followers',
		group: 'persons',
		operationId: 'addPersonFollower',
		summary: 'Add a follower to a person',
		tokenCost: 10,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						id: z.number().int().optional(),
						person_id: z.number().int().optional(),
						add_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.deletePersonFollower': {
		version: 'v1',
		method: 'DELETE',
		path: '/persons/{id}/followers/{follower_id}',
		group: 'persons',
		operationId: 'deletePersonFollower',
		summary: 'Delete a follower from a person',
		tokenCost: 6,
		oauthScopes: ['contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'follower_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				follower_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.getPersonMailMessages': {
		version: 'v1',
		method: 'GET',
		path: '/persons/{id}/mailMessages',
		group: 'persons',
		operationId: 'getPersonMailMessages',
		summary: 'List mail messages associated with a person',
		tokenCost: 20,
		oauthScopes: ['mail:read', 'mail:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'include_body', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					include_body: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								object: z.string().optional(),
								timestamp: z.string().optional(),
								data: z
									.object({
										id: z.number().int().optional(),
										from: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										to: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										cc: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										bcc: z
											.array(
												z
													.object({
														id: z.number().int().optional(),
														email_address: z.string().optional(),
														name: z.string().optional(),
														linked_person_id: z
															.number()
															.int()
															.nullable()
															.optional(),
														linked_person_name: z
															.string()
															.nullable()
															.optional(),
														mail_message_party_id: z.number().int().optional(),
													})
													.passthrough(),
											)
											.optional(),
										body_url: z.string().optional(),
										body: z.string().optional(),
										account_id: z.string().optional(),
										user_id: z.number().int().optional(),
										mail_thread_id: z.number().int().optional(),
										subject: z.string().optional(),
										snippet: z.string().optional(),
										mail_tracking_status: z
											.union([z.literal('opened'), z.literal('not opened')])
											.nullable()
											.optional(),
										mail_link_tracking_enabled_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										read_flag: z.union([z.literal(0), z.literal(1)]).optional(),
										draft: z.string().nullable().optional(),
										draft_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										synced_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										deleted_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_body_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										sent_flag: z.union([z.literal(0), z.literal(1)]).optional(),
										sent_from_pipedrive_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										smart_bcc_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										message_time: z.string().optional(),
										add_time: z.string().optional(),
										update_time: z.string().optional(),
										has_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_inline_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										has_real_attachments_flag: z
											.union([z.literal(0), z.literal(1)])
											.optional(),
										nylas_id: z.string().optional(),
										s3_bucket: z.string().optional(),
										s3_bucket_path: z.string().optional(),
										external_deleted_flag: z.boolean().optional(),
										mua_message_id: z.string().optional(),
										template_id: z.number().int().nullable().optional(),
										timestamp: z.string().optional(),
										item_type: z.string().optional(),
										company_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.mergePersons': {
		version: 'v1',
		method: 'PUT',
		path: '/persons/{id}/merge',
		group: 'persons',
		operationId: 'mergePersons',
		summary: 'Merge two persons',
		tokenCost: 40,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ merge_with_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						company_id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						phone: z
							.array(
								z
									.object({
										value: z.string().optional(),
										primary: z.boolean().optional(),
										label: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						email: z
							.array(
								z
									.object({
										value: z.string().optional(),
										primary: z.boolean().optional(),
										label: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						first_char: z.string().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						visible_to: z.string().optional(),
						picture_id: z
							.object({
								id: z.number().int().optional(),
								item_type: z.string().optional(),
								item_id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								added_by_user_id: z.number().int().optional(),
								pictures: z
									.object({
										'128': z.string().optional(),
										'512': z.string().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.nullable()
							.optional(),
						label: z.number().int().nullable().optional(),
						label_ids: z.array(z.number().int()).optional(),
						org_name: z.string().nullable().optional(),
						owner_name: z.string().optional(),
						cc_email: z.string().nullable().optional(),
						owner_id: z.number().int().optional(),
						org_id: z.number().int().optional(),
						merge_what_id: z.number().int().optional(),
						name: z.string().optional(),
						first_name: z.string().optional(),
						last_name: z.string().nullable().optional(),
						email_messages_count: z.number().int().optional(),
						activities_count: z.number().int().optional(),
						done_activities_count: z.number().int().optional(),
						undone_activities_count: z.number().int().optional(),
						files_count: z.number().int().optional(),
						notes_count: z.number().int().optional(),
						followers_count: z.number().int().optional(),
						last_incoming_mail_time: z.string().nullable().optional(),
						last_outgoing_mail_time: z.string().nullable().optional(),
						open_deals_count: z.number().int().optional(),
						related_open_deals_count: z.number().int().optional(),
						closed_deals_count: z.number().int().optional(),
						related_closed_deals_count: z.number().int().optional(),
						won_deals_count: z.number().int().optional(),
						related_won_deals_count: z.number().int().optional(),
						lost_deals_count: z.number().int().optional(),
						related_lost_deals_count: z.number().int().optional(),
						next_activity_date: z.string().nullable().optional(),
						next_activity_time: z.string().nullable().optional(),
						next_activity_id: z.number().int().nullable().optional(),
						last_activity_id: z.number().int().nullable().optional(),
						last_activity_date: z.string().nullable().optional(),
						participant_open_deals_count: z.number().int().optional(),
						participant_closed_deals_count: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.getPersonUsers': {
		version: 'v1',
		method: 'GET',
		path: '/persons/{id}/permittedUsers',
		group: 'persons',
		operationId: 'getPersonUsers',
		summary: 'List permitted users',
		tokenCost: 10,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number()).optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.deletePersonPicture': {
		version: 'v1',
		method: 'DELETE',
		path: '/persons/{id}/picture',
		group: 'persons',
		operationId: 'deletePersonPicture',
		summary: 'Delete person picture',
		tokenCost: 6,
		oauthScopes: ['contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.addPersonPicture': {
		version: 'v1',
		method: 'POST',
		path: '/persons/{id}/picture',
		group: 'persons',
		operationId: 'addPersonPicture',
		summary: 'Add person picture',
		tokenCost: 10,
		oauthScopes: ['contacts:full'],
		requestContentType: 'multipart/form-data',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					file: z.instanceof(Blob),
					crop_x: z.number().int().optional(),
					crop_y: z.number().int().optional(),
					crop_width: z.number().int().optional(),
					crop_height: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						PICTURE_ID: z
							.object({
								id: z.number().int().optional(),
								item_type: z.string().optional(),
								item_id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								added_by_user_id: z.number().int().optional(),
								pictures: z
									.object({
										'128': z.string().optional(),
										'512': z.string().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.persons.getPersonProducts': {
		version: 'v1',
		method: 'GET',
		path: '/persons/{id}/products',
		group: 'persons',
		operationId: 'getPersonProducts',
		summary: 'List products associated with a person',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								DEAL_ID: z
									.object({
										deal: z
											.object({
												id: z.number().int().optional(),
												company_id: z.number().int().optional(),
												creator_user_id: z.number().int().optional(),
												user_id: z.number().int().optional(),
												person_id: z.number().int().nullable().optional(),
												org_id: z.number().int().nullable().optional(),
												stage_id: z.number().int().optional(),
												title: z.string().optional(),
												value: z.number().optional(),
												currency: z.string().optional(),
												add_time: z.string().optional(),
												first_add_time: z.string().optional(),
												update_time: z.string().nullable().optional(),
												stage_change_time: z.string().nullable().optional(),
												active: z.boolean().optional(),
												deleted: z.boolean().optional(),
												status: z.string().optional(),
												probability: z.number().nullable().optional(),
												next_activity_date: z.string().nullable().optional(),
												next_activity_time: z.string().nullable().optional(),
												next_activity_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												last_activity_id: z
													.number()
													.int()
													.nullable()
													.optional(),
												last_activity_date: z.string().nullable().optional(),
												lost_reason: z.string().nullable().optional(),
												visible_to: z.string().optional(),
												close_time: z.string().nullable().optional(),
												pipeline_id: z.number().int().optional(),
												won_time: z.string().nullable().optional(),
												first_won_time: z.string().nullable().optional(),
												lost_time: z.string().nullable().optional(),
												products_count: z.number().int().optional(),
												files_count: z.number().int().optional(),
												notes_count: z.number().int().optional(),
												followers_count: z.number().int().optional(),
												email_messages_count: z.number().int().optional(),
												activities_count: z.number().int().optional(),
												done_activities_count: z.number().int().optional(),
												undone_activities_count: z.number().int().optional(),
												participants_count: z.number().int().optional(),
												expected_close_date: z.string().nullable().optional(),
												last_incoming_mail_time: z
													.string()
													.nullable()
													.optional(),
												last_outgoing_mail_time: z
													.string()
													.nullable()
													.optional(),
												label: z.string().nullable().optional(),
											})
											.passthrough()
											.optional(),
										product: z
											.object({
												id: z.number().int().optional(),
												company_id: z.number().int().optional(),
												name: z.string().optional(),
												code: z.string().optional(),
												description: z.string().optional(),
												unit: z.string().optional(),
												tax: z.number().optional(),
												category: z.string().optional(),
												active_flag: z.boolean().optional(),
												selectable: z.boolean().optional(),
												first_char: z.string().optional(),
												visible_to: z
													.union([
														z.literal('1'),
														z.literal('3'),
														z.literal('5'),
														z.literal('7'),
													])
													.optional(),
												owner_id: z.number().int().optional(),
												files_count: z.number().int().optional(),
												add_time: z.string().optional(),
												update_time: z.string().optional(),
												deal_id: z.number().int().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
								next_start: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.personFields.getPersonFields': {
		version: 'v1',
		method: 'GET',
		path: '/personFields',
		group: 'personFields',
		operationId: 'getPersonFields',
		summary: 'Get all person fields',
		tokenCost: 20,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'contact-fields:full',
			'admin',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().nullable().optional(),
								key: z.string().optional(),
								name: z.string().optional(),
								order_nr: z.number().int().optional(),
								field_type: z
									.union([
										z.literal('boolean'),
										z.literal('double'),
										z.literal('int'),
										z.literal('json'),
										z.literal('date'),
										z.literal('daterange'),
										z.literal('time'),
										z.literal('timerange'),
										z.literal('text'),
										z.literal('varchar'),
										z.literal('varchar_auto'),
										z.literal('varchar_options'),
										z.literal('address'),
										z.literal('enum'),
										z.literal('monetary'),
										z.literal('phone'),
										z.literal('set'),
										z.literal('activity'),
										z.literal('deal'),
										z.literal('lead'),
										z.literal('org'),
										z.literal('people'),
										z.literal('pipeline'),
										z.literal('product'),
										z.literal('project'),
										z.literal('stage'),
										z.literal('user'),
										z.literal('billing_frequency'),
										z.literal('picture'),
										z.literal('price_list'),
										z.literal('projects_board'),
										z.literal('projects_phase'),
										z.literal('status'),
										z.literal('visible_to'),
									])
									.optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								last_updated_by_user_id: z.number().int().nullable().optional(),
								created_by_user_id: z.number().int().nullable().optional(),
								active_flag: z.boolean().optional(),
								edit_flag: z.boolean().optional(),
								index_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								add_visible_flag: z.boolean().optional(),
								important_flag: z.boolean().optional(),
								bulk_edit_allowed: z.boolean().optional(),
								searchable_flag: z.boolean().optional(),
								filtering_allowed: z.boolean().optional(),
								sortable_flag: z.boolean().optional(),
								mandatory_flag: z.boolean().optional(),
								options: z
									.array(z.object({}).passthrough())
									.nullable()
									.optional(),
								options_deleted: z.array(z.object({}).passthrough()).optional(),
								is_subfield: z.boolean().optional(),
								subfields: z.array(z.object({}).passthrough()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.personFields.addPersonField': {
		version: 'v1',
		method: 'POST',
		path: '/personFields',
		group: 'personFields',
		operationId: 'addPersonField',
		summary: 'Add a new person field',
		tokenCost: 10,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					options: z.array(z.strictObject({ label: z.string() })).optional(),
					add_visible_flag: z.boolean().optional(),
					field_type: z.union([
						z.literal('address'),
						z.literal('date'),
						z.literal('daterange'),
						z.literal('double'),
						z.literal('enum'),
						z.literal('monetary'),
						z.literal('org'),
						z.literal('people'),
						z.literal('phone'),
						z.literal('set'),
						z.literal('text'),
						z.literal('time'),
						z.literal('timerange'),
						z.literal('user'),
						z.literal('varchar'),
						z.literal('varchar_auto'),
						z.literal('visible_to'),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.personFields.deletePersonFields': {
		version: 'v1',
		method: 'DELETE',
		path: '/personFields',
		group: 'personFields',
		operationId: 'deletePersonFields',
		summary: 'Delete multiple person fields in bulk',
		tokenCost: 10,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'ids', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					ids: z
						.array(z.number().int())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.personFields.getPersonField': {
		version: 'v1',
		method: 'GET',
		path: '/personFields/{id}',
		group: 'personFields',
		operationId: 'getPersonField',
		summary: 'Get one person field',
		tokenCost: 2,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'contact-fields:full',
			'admin',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.personFields.deletePersonField': {
		version: 'v1',
		method: 'DELETE',
		path: '/personFields/{id}',
		group: 'personFields',
		operationId: 'deletePersonField',
		summary: 'Delete a person field',
		tokenCost: 6,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.personFields.updatePersonField': {
		version: 'v1',
		method: 'PUT',
		path: '/personFields/{id}',
		group: 'personFields',
		operationId: 'updatePersonField',
		summary: 'Update a person field',
		tokenCost: 10,
		oauthScopes: ['contact-fields:full', 'admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					options: z
						.array(
							z.strictObject({
								id: z.number().int().optional(),
								label: z.string(),
							}),
						)
						.optional(),
					add_visible_flag: z.boolean().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().nullable().optional(),
						key: z.string().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						field_type: z
							.union([
								z.literal('boolean'),
								z.literal('double'),
								z.literal('int'),
								z.literal('json'),
								z.literal('date'),
								z.literal('daterange'),
								z.literal('time'),
								z.literal('timerange'),
								z.literal('text'),
								z.literal('varchar'),
								z.literal('varchar_auto'),
								z.literal('varchar_options'),
								z.literal('address'),
								z.literal('enum'),
								z.literal('monetary'),
								z.literal('phone'),
								z.literal('set'),
								z.literal('activity'),
								z.literal('deal'),
								z.literal('lead'),
								z.literal('org'),
								z.literal('people'),
								z.literal('pipeline'),
								z.literal('product'),
								z.literal('project'),
								z.literal('stage'),
								z.literal('user'),
								z.literal('billing_frequency'),
								z.literal('picture'),
								z.literal('price_list'),
								z.literal('projects_board'),
								z.literal('projects_phase'),
								z.literal('status'),
								z.literal('visible_to'),
							])
							.optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
						last_updated_by_user_id: z.number().int().nullable().optional(),
						created_by_user_id: z.number().int().nullable().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						index_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						options_deleted: z.array(z.object({}).passthrough()).optional(),
						is_subfield: z.boolean().optional(),
						subfields: z.array(z.object({}).passthrough()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.pipelines.getPipelineConversionStatistics': {
		version: 'v1',
		method: 'GET',
		path: '/pipelines/{id}/conversion_statistics',
		group: 'pipelines',
		operationId: 'getPipelineConversionStatistics',
		summary: 'Get deals conversion rates in pipeline',
		tokenCost: 40,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start_date', style: 'form', explode: true, type: 'string' },
			{ name: 'end_date', style: 'form', explode: true, type: 'string' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start_date: z.string(),
					end_date: z.string(),
					user_id: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						stage_conversions: z
							.array(
								z
									.object({
										from_stage_id: z.number().int().optional(),
										to_stage_id: z.number().int().optional(),
										conversion_rate: z.number().int().optional(),
									})
									.passthrough(),
							)
							.optional(),
						won_conversion: z.number().int().optional(),
						lost_conversion: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.pipelines.getPipelineDeals': {
		version: 'v1',
		method: 'GET',
		path: '/pipelines/{id}/deals',
		group: 'pipelines',
		operationId: 'getPipelineDeals',
		summary: 'Get deals in a pipeline',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'everyone', style: 'form', explode: true, type: 'number' },
			{ name: 'stage_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'get_summary', style: 'form', explode: true, type: 'number' },
			{
				name: 'totals_convert_currency',
				style: 'form',
				explode: true,
				type: 'string',
			},
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					filter_id: z.number().int().optional(),
					user_id: z.number().int().optional(),
					everyone: z.union([z.literal(0), z.literal(1)]).optional(),
					stage_id: z.number().int().optional(),
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					get_summary: z.union([z.literal(0), z.literal(1)]).optional(),
					totals_convert_currency: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								creator_user_id: z.number().int().optional(),
								user_id: z.number().int().optional(),
								person_id: z.number().int().nullable().optional(),
								org_id: z.number().int().nullable().optional(),
								stage_id: z.number().int().optional(),
								title: z.string().optional(),
								value: z.number().optional(),
								currency: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								stage_change_time: z.string().nullable().optional(),
								active: z.boolean().optional(),
								deleted: z.boolean().optional(),
								is_archived: z.boolean().optional(),
								status: z.string().optional(),
								probability: z.number().nullable().optional(),
								next_activity_date: z.string().nullable().optional(),
								next_activity_time: z.string().nullable().optional(),
								next_activity_id: z.number().int().nullable().optional(),
								last_activity_id: z.number().int().nullable().optional(),
								last_activity_date: z.string().nullable().optional(),
								lost_reason: z.string().nullable().optional(),
								visible_to: z.string().optional(),
								close_time: z.string().nullable().optional(),
								pipeline_id: z.number().int().optional(),
								won_time: z.string().nullable().optional(),
								first_won_time: z.string().nullable().optional(),
								lost_time: z.string().nullable().optional(),
								products_count: z.number().int().optional(),
								files_count: z.number().int().optional(),
								notes_count: z.number().int().optional(),
								followers_count: z.number().int().optional(),
								email_messages_count: z.number().int().optional(),
								activities_count: z.number().int().optional(),
								done_activities_count: z.number().int().optional(),
								undone_activities_count: z.number().int().optional(),
								participants_count: z.number().int().optional(),
								expected_close_date: z.string().nullable().optional(),
								last_incoming_mail_time: z.string().nullable().optional(),
								last_outgoing_mail_time: z.string().nullable().optional(),
								label: z.string().nullable().optional(),
								stage_order_nr: z.number().int().optional(),
								person_name: z.string().nullable().optional(),
								org_name: z.string().nullable().optional(),
								next_activity_subject: z.string().nullable().optional(),
								next_activity_type: z.string().nullable().optional(),
								next_activity_duration: z.string().nullable().optional(),
								next_activity_note: z.string().nullable().optional(),
								formatted_value: z.string().optional(),
								weighted_value: z.number().optional(),
								formatted_weighted_value: z.string().optional(),
								weighted_value_currency: z.string().optional(),
								rotten_time: z.string().nullable().optional(),
								owner_name: z.string().optional(),
								cc_email: z.string().optional(),
								org_hidden: z.boolean().optional(),
								person_hidden: z.boolean().optional(),
								origin: z.string().optional(),
								origin_id: z.string().nullable().optional(),
								channel: z.number().int().nullable().optional(),
								channel_id: z.string().nullable().optional(),
								arr: z.number().nullable().optional(),
								mrr: z.number().nullable().optional(),
								acv: z.number().nullable().optional(),
								arr_currency: z.string().nullable().optional(),
								mrr_currency: z.string().nullable().optional(),
								acv_currency: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.pipelines.getPipelineMovementStatistics': {
		version: 'v1',
		method: 'GET',
		path: '/pipelines/{id}/movement_statistics',
		group: 'pipelines',
		operationId: 'getPipelineMovementStatistics',
		summary: 'Get deals movements in pipeline',
		tokenCost: 40,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start_date', style: 'form', explode: true, type: 'string' },
			{ name: 'end_date', style: 'form', explode: true, type: 'string' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start_date: z.string(),
					end_date: z.string(),
					user_id: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						movements_between_stages: z
							.object({ count: z.number().int().optional() })
							.passthrough()
							.optional(),
						new_deals: z
							.object({
								count: z.number().int().optional(),
								deals_ids: z.array(z.number().int()).optional(),
								values: z
									.object({ CURRENCY_ID: z.number().int().optional() })
									.passthrough()
									.optional(),
								formatted_values: z
									.object({ CURRENCY_ID: z.string().optional() })
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						deals_left_open: z
							.object({
								count: z.number().int().optional(),
								deals_ids: z.array(z.number().int()).optional(),
								values: z
									.object({ CURRENCY_ID: z.number().int().optional() })
									.passthrough()
									.optional(),
								formatted_values: z
									.object({ CURRENCY_ID: z.string().optional() })
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						won_deals: z
							.object({
								count: z.number().int().optional(),
								deals_ids: z.array(z.number().int()).optional(),
								values: z
									.object({ CURRENCY_ID: z.number().int().optional() })
									.passthrough()
									.optional(),
								formatted_values: z
									.object({ CURRENCY_ID: z.string().optional() })
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						lost_deals: z
							.object({
								count: z.number().int().optional(),
								deals_ids: z.array(z.number().int()).optional(),
								values: z
									.object({ CURRENCY_ID: z.number().int().optional() })
									.passthrough()
									.optional(),
								formatted_values: z
									.object({ CURRENCY_ID: z.string().optional() })
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						average_age_in_days: z
							.object({
								across_all_stages: z.number().int().optional(),
								by_stages: z
									.array(
										z
											.object({
												stage_id: z.number().int().optional(),
												value: z.number().int().optional(),
											})
											.passthrough(),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.products.getProductDeals': {
		version: 'v1',
		method: 'GET',
		path: '/products/{id}/deals',
		group: 'products',
		operationId: 'getProductDeals',
		summary: 'Get deals where a product is attached to',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'status', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
					status: z
						.union([
							z.literal('open'),
							z.literal('won'),
							z.literal('lost'),
							z.literal('deleted'),
							z.literal('all_not_deleted'),
						])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								creator_user_id: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								user_id: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.boolean().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
								person_id: z
									.object({
										active_flag: z.boolean().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.nullable()
									.optional(),
								org_id: z
									.object({
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().optional(),
										active_flag: z.boolean().optional(),
										cc_email: z.string().optional(),
										value: z.number().int().optional(),
									})
									.passthrough()
									.nullable()
									.optional(),
								stage_id: z.number().int().optional(),
								title: z.string().optional(),
								value: z.number().optional(),
								currency: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								stage_change_time: z.string().nullable().optional(),
								active: z.boolean().optional(),
								deleted: z.boolean().optional(),
								is_archived: z.boolean().optional(),
								status: z.string().optional(),
								probability: z.number().nullable().optional(),
								next_activity_date: z.string().nullable().optional(),
								next_activity_time: z.string().nullable().optional(),
								next_activity_id: z.number().int().nullable().optional(),
								last_activity_id: z.number().int().nullable().optional(),
								last_activity_date: z.string().nullable().optional(),
								lost_reason: z.string().nullable().optional(),
								visible_to: z.string().optional(),
								close_time: z.string().nullable().optional(),
								pipeline_id: z.number().int().optional(),
								won_time: z.string().nullable().optional(),
								first_won_time: z.string().nullable().optional(),
								lost_time: z.string().nullable().optional(),
								products_count: z.number().int().optional(),
								files_count: z.number().int().optional(),
								notes_count: z.number().int().optional(),
								followers_count: z.number().int().optional(),
								email_messages_count: z.number().int().optional(),
								activities_count: z.number().int().optional(),
								done_activities_count: z.number().int().optional(),
								undone_activities_count: z.number().int().optional(),
								participants_count: z.number().int().optional(),
								expected_close_date: z.string().nullable().optional(),
								last_incoming_mail_time: z.string().nullable().optional(),
								last_outgoing_mail_time: z.string().nullable().optional(),
								label: z.string().nullable().optional(),
								stage_order_nr: z.number().int().optional(),
								person_name: z.string().nullable().optional(),
								org_name: z.string().nullable().optional(),
								next_activity_subject: z.string().nullable().optional(),
								next_activity_type: z.string().nullable().optional(),
								next_activity_duration: z.string().nullable().optional(),
								next_activity_note: z.string().nullable().optional(),
								formatted_value: z.string().optional(),
								weighted_value: z.number().optional(),
								formatted_weighted_value: z.string().optional(),
								weighted_value_currency: z.string().optional(),
								rotten_time: z.string().nullable().optional(),
								owner_name: z.string().optional(),
								cc_email: z.string().optional(),
								org_hidden: z.boolean().optional(),
								person_hidden: z.boolean().optional(),
								origin: z.string().optional(),
								origin_id: z.string().nullable().optional(),
								channel: z.number().int().nullable().optional(),
								channel_id: z.string().nullable().optional(),
								arr: z.number().nullable().optional(),
								mrr: z.number().nullable().optional(),
								acv: z.number().nullable().optional(),
								arr_currency: z.string().nullable().optional(),
								mrr_currency: z.string().nullable().optional(),
								acv_currency: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				related_objects: z
					.object({
						organization: z
							.object({
								ORGANIZATION_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										people_count: z.number().int().optional(),
										owner_id: z.number().int().optional(),
										address: z.string().nullable().optional(),
										cc_email: z.string().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						person: z
							.object({
								PERSON_ID: z
									.object({
										active_flag: z.boolean().optional(),
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										phone: z
											.array(
												z
													.object({
														label: z.string().optional(),
														value: z.string().optional(),
														primary: z.boolean().optional(),
													})
													.passthrough(),
											)
											.optional(),
										owner_id: z.number().int().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						user: z
							.object({
								USER_ID: z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										email: z.string().optional(),
										has_pic: z.number().int().optional(),
										pic_hash: z.string().nullable().optional(),
										active_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						stage: z
							.object({
								id: z.number().int().optional(),
								order_nr: z.number().int().optional(),
								name: z.string().optional(),
								active_flag: z.boolean().optional(),
								deal_probability: z.number().int().optional(),
								pipeline_id: z.number().int().optional(),
								rotten_flag: z.boolean().optional(),
								rotten_days: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough()
							.optional(),
						pipeline: z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								url_title: z.string().optional(),
								order_nr: z.number().int().optional(),
								active: z.boolean().optional(),
								deal_probability: z.boolean().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.products.getProductFiles': {
		version: 'v1',
		method: 'GET',
		path: '/products/{id}/files',
		group: 'products',
		operationId: 'getProductFiles',
		summary: 'List files attached to a product',
		tokenCost: 20,
		oauthScopes: ['products:read', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().max(100).optional(),
					sort: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								product_id: z.number().int().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								file_name: z.string().optional(),
								file_size: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								inline_flag: z.boolean().optional(),
								remote_location: z.string().optional(),
								remote_id: z.string().optional(),
								s3_bucket: z.string().optional(),
								product_name: z.string().optional(),
								url: z.string().optional(),
								name: z.string().optional(),
								description: z.string().optional(),
							})
							.passthrough(),
					)
					.nullable()
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.products.getProductFollowers': {
		version: 'v1',
		method: 'GET',
		path: '/products/{id}/followers',
		group: 'products',
		operationId: 'getProductFollowers',
		summary: 'List followers of a product',
		tokenCost: 20,
		oauthScopes: ['products:read', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								id: z.number().int().optional(),
								product_id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.products.addProductFollower': {
		version: 'v1',
		method: 'POST',
		path: '/products/{id}/followers',
		group: 'products',
		operationId: 'addProductFollower',
		summary: 'Add a follower to a product',
		tokenCost: 10,
		oauthScopes: ['products:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						id: z.number().int().optional(),
						product_id: z.number().int().optional(),
						add_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.products.deleteProductFollower': {
		version: 'v1',
		method: 'DELETE',
		path: '/products/{id}/followers/{follower_id}',
		group: 'products',
		operationId: 'deleteProductFollower',
		summary: 'Delete a follower from a product',
		tokenCost: 6,
		oauthScopes: ['products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'follower_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				follower_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.products.getProductUsers': {
		version: 'v1',
		method: 'GET',
		path: '/products/{id}/permittedUsers',
		group: 'products',
		operationId: 'getProductUsers',
		summary: 'List permitted users',
		tokenCost: 10,
		oauthScopes: ['products:read', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	'apiV1.productFields.deleteProductFields': {
		version: 'v1',
		method: 'DELETE',
		path: '/productFields',
		group: 'productFields',
		operationId: 'deleteProductFields',
		summary: 'Delete multiple product fields in bulk',
		tokenCost: 10,
		oauthScopes: ['product-fields:full', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'ids', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					ids: z
						.array(z.number().int())
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.productFields.getProductFields': {
		version: 'v1',
		method: 'GET',
		path: '/productFields',
		group: 'productFields',
		operationId: 'getProductFields',
		summary: 'Get all product fields',
		tokenCost: 20,
		oauthScopes: ['products:read', 'product-fields:full', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								name: z.string(),
								options: z.array(z.object({}).passthrough()).optional(),
								field_type: z.union([
									z.literal('boolean'),
									z.literal('double'),
									z.literal('int'),
									z.literal('json'),
									z.literal('date'),
									z.literal('daterange'),
									z.literal('time'),
									z.literal('timerange'),
									z.literal('text'),
									z.literal('varchar'),
									z.literal('varchar_auto'),
									z.literal('varchar_options'),
									z.literal('address'),
									z.literal('enum'),
									z.literal('monetary'),
									z.literal('phone'),
									z.literal('set'),
									z.literal('activity'),
									z.literal('deal'),
									z.literal('lead'),
									z.literal('org'),
									z.literal('people'),
									z.literal('pipeline'),
									z.literal('product'),
									z.literal('project'),
									z.literal('stage'),
									z.literal('user'),
									z.literal('billing_frequency'),
									z.literal('picture'),
									z.literal('price_list'),
									z.literal('projects_board'),
									z.literal('projects_phase'),
									z.literal('status'),
									z.literal('visible_to'),
								]),
								id: z.number().int().optional(),
								key: z.string().optional(),
								order_nr: z.number().int().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								last_updated_by_user_id: z.number().int().optional(),
								created_by_user_id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								edit_flag: z.boolean().optional(),
								add_visible_flag: z.boolean().optional(),
								important_flag: z.boolean().optional(),
								bulk_edit_allowed: z.boolean().optional(),
								searchable_flag: z.boolean().optional(),
								filtering_allowed: z.boolean().optional(),
								sortable_flag: z.boolean().optional(),
								mandatory_flag: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().optional(),
			})
			.passthrough(),
	},
	'apiV1.productFields.addProductField': {
		version: 'v1',
		method: 'POST',
		path: '/productFields',
		group: 'productFields',
		operationId: 'addProductField',
		summary: 'Add a new product field',
		tokenCost: 10,
		oauthScopes: ['product-fields:full', 'products:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					options: z.array(z.strictObject({ label: z.string() })).optional(),
					field_type: z.union([
						z.literal('varchar'),
						z.literal('varchar_auto'),
						z.literal('text'),
						z.literal('double'),
						z.literal('monetary'),
						z.literal('date'),
						z.literal('set'),
						z.literal('enum'),
						z.literal('user'),
						z.literal('org'),
						z.literal('people'),
						z.literal('phone'),
						z.literal('time'),
						z.literal('timerange'),
						z.literal('daterange'),
						z.literal('address'),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						name: z.string(),
						options: z.array(z.object({}).passthrough()).optional(),
						field_type: z.union([
							z.literal('varchar'),
							z.literal('varchar_auto'),
							z.literal('text'),
							z.literal('double'),
							z.literal('monetary'),
							z.literal('date'),
							z.literal('set'),
							z.literal('enum'),
							z.literal('user'),
							z.literal('org'),
							z.literal('people'),
							z.literal('phone'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('daterange'),
							z.literal('address'),
						]),
						id: z.number().int().optional(),
						key: z.string().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						last_updated_by_user_id: z.number().int().optional(),
						created_by_user_id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.productFields.deleteProductField': {
		version: 'v1',
		method: 'DELETE',
		path: '/productFields/{id}',
		group: 'productFields',
		operationId: 'deleteProductField',
		summary: 'Delete a product field',
		tokenCost: 6,
		oauthScopes: ['product-fields:full', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.productFields.getProductField': {
		version: 'v1',
		method: 'GET',
		path: '/productFields/{id}',
		group: 'productFields',
		operationId: 'getProductField',
		summary: 'Get one product field',
		tokenCost: 2,
		oauthScopes: ['products:read', 'product-fields:full', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						name: z.string(),
						options: z.array(z.object({}).passthrough()).optional(),
						field_type: z.union([
							z.literal('varchar'),
							z.literal('varchar_auto'),
							z.literal('text'),
							z.literal('double'),
							z.literal('monetary'),
							z.literal('date'),
							z.literal('set'),
							z.literal('enum'),
							z.literal('user'),
							z.literal('org'),
							z.literal('people'),
							z.literal('phone'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('daterange'),
							z.literal('address'),
						]),
						id: z.number().int().optional(),
						key: z.string().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						last_updated_by_user_id: z.number().int().optional(),
						created_by_user_id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.productFields.updateProductField': {
		version: 'v1',
		method: 'PUT',
		path: '/productFields/{id}',
		group: 'productFields',
		operationId: 'updateProductField',
		summary: 'Update a product field',
		tokenCost: 10,
		oauthScopes: ['product-fields:full', 'products:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					options: z
						.array(z.strictObject({ id: z.number().int(), label: z.string() }))
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						name: z.string(),
						options: z.array(z.object({}).passthrough()).optional(),
						field_type: z.union([
							z.literal('varchar'),
							z.literal('varchar_auto'),
							z.literal('text'),
							z.literal('double'),
							z.literal('monetary'),
							z.literal('date'),
							z.literal('set'),
							z.literal('enum'),
							z.literal('user'),
							z.literal('org'),
							z.literal('people'),
							z.literal('phone'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('daterange'),
							z.literal('address'),
						]),
						id: z.number().int().optional(),
						key: z.string().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						last_updated_by_user_id: z.number().int().optional(),
						created_by_user_id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						edit_flag: z.boolean().optional(),
						add_visible_flag: z.boolean().optional(),
						important_flag: z.boolean().optional(),
						bulk_edit_allowed: z.boolean().optional(),
						searchable_flag: z.boolean().optional(),
						filtering_allowed: z.boolean().optional(),
						sortable_flag: z.boolean().optional(),
						mandatory_flag: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.getProjects': {
		version: 'v1',
		method: 'GET',
		path: '/projects',
		group: 'projects',
		operationId: 'getProjects',
		summary: 'Get all projects',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'status', style: 'form', explode: true, type: 'string' },
			{ name: 'phase_id', style: 'form', explode: true, type: 'integer' },
			{
				name: 'include_archived',
				style: 'form',
				explode: true,
				type: 'boolean',
			},
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
					filter_id: z.number().int().optional(),
					status: z.string().optional(),
					phase_id: z.number().int().optional(),
					include_archived: z.boolean().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								title: z.string().optional(),
								board_id: z.number().optional(),
								phase_id: z.number().optional(),
								description: z.string().optional(),
								status: z.string().optional(),
								owner_id: z.number().optional(),
								start_date: z.string().optional(),
								end_date: z.string().optional(),
								deal_ids: z.array(z.number().int()).optional(),
								org_id: z.number().optional(),
								person_id: z.number().optional(),
								labels: z.array(z.number().int()).optional(),
								health_status: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								status_change_time: z.string().optional(),
								archive_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.addProject': {
		version: 'v1',
		method: 'POST',
		path: '/projects',
		group: 'projects',
		operationId: 'addProject',
		summary: 'Add a project',
		tokenCost: 10,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					title: z.string(),
					board_id: z.number().optional(),
					phase_id: z.number().optional(),
					description: z.string().optional(),
					status: z.string().optional(),
					owner_id: z.number().optional(),
					start_date: z.string().optional(),
					end_date: z.string().optional(),
					deal_ids: z.array(z.number().int()).optional(),
					org_id: z.number().optional(),
					person_id: z.number().optional(),
					labels: z.array(z.number().int()).optional(),
					health_status: z.number().int().nullable().optional(),
					template_id: z.number().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						board_id: z.number().optional(),
						phase_id: z.number().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						owner_id: z.number().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						org_id: z.number().optional(),
						person_id: z.number().optional(),
						labels: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.getProject': {
		version: 'v1',
		method: 'GET',
		path: '/projects/{id}',
		group: 'projects',
		operationId: 'getProject',
		summary: 'Get details of a project',
		tokenCost: 2,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						board_id: z.number().optional(),
						phase_id: z.number().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						owner_id: z.number().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						org_id: z.number().optional(),
						person_id: z.number().optional(),
						labels: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.updateProject': {
		version: 'v1',
		method: 'PUT',
		path: '/projects/{id}',
		group: 'projects',
		operationId: 'updateProject',
		summary: 'Update a project',
		tokenCost: 10,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					title: z.string().optional(),
					board_id: z.number().optional(),
					phase_id: z.number().optional(),
					description: z.string().optional(),
					status: z.string().optional(),
					owner_id: z.number().optional(),
					start_date: z.string().optional(),
					end_date: z.string().optional(),
					deal_ids: z.array(z.number().int()).optional(),
					org_id: z.number().optional(),
					person_id: z.number().optional(),
					labels: z.array(z.number().int()).optional(),
					health_status: z.number().int().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						board_id: z.number().optional(),
						phase_id: z.number().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						owner_id: z.number().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						org_id: z.number().optional(),
						person_id: z.number().optional(),
						labels: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.deleteProject': {
		version: 'v1',
		method: 'DELETE',
		path: '/projects/{id}',
		group: 'projects',
		operationId: 'deleteProject',
		summary: 'Delete a project',
		tokenCost: 6,
		oauthScopes: ['projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						success: z.boolean().optional(),
						data: z
							.object({ id: z.number().int().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.archiveProject': {
		version: 'v1',
		method: 'POST',
		path: '/projects/{id}/archive',
		group: 'projects',
		operationId: 'archiveProject',
		summary: 'Archive a project',
		tokenCost: 10,
		oauthScopes: ['projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						board_id: z.number().optional(),
						phase_id: z.number().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						owner_id: z.number().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						org_id: z.number().optional(),
						person_id: z.number().optional(),
						labels: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.getProjectPlan': {
		version: 'v1',
		method: 'GET',
		path: '/projects/{id}/plan',
		group: 'projects',
		operationId: 'getProjectPlan',
		summary: 'Returns project plan',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								item_id: z.number().optional(),
								item_type: z.string().optional(),
								phase_id: z.number().optional(),
								group_id: z.number().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.putProjectPlanActivity': {
		version: 'v1',
		method: 'PUT',
		path: '/projects/{id}/plan/activities/{activityId}',
		group: 'projects',
		operationId: 'putProjectPlanActivity',
		summary: 'Update activity in project plan',
		tokenCost: 10,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'activityId'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				activityId: z.number().int(),
			}),
			body: z
				.strictObject({
					phase_id: z.number().optional(),
					group_id: z.number().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						item_id: z.number().optional(),
						item_type: z.string().optional(),
						phase_id: z.number().optional(),
						group_id: z.number().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.putProjectPlanTask': {
		version: 'v1',
		method: 'PUT',
		path: '/projects/{id}/plan/tasks/{taskId}',
		group: 'projects',
		operationId: 'putProjectPlanTask',
		summary: 'Update task in project plan',
		tokenCost: 10,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'taskId'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int(), taskId: z.number().int() }),
			body: z
				.strictObject({
					phase_id: z.number().optional(),
					group_id: z.number().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						item_id: z.number().optional(),
						item_type: z.string().optional(),
						phase_id: z.number().optional(),
						group_id: z.number().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.getProjectGroups': {
		version: 'v1',
		method: 'GET',
		path: '/projects/{id}/groups',
		group: 'projects',
		operationId: 'getProjectGroups',
		summary: 'Returns project groups',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().optional(),
								name: z.string().optional(),
								order_nr: z.number().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.getProjectTasks': {
		version: 'v1',
		method: 'GET',
		path: '/projects/{id}/tasks',
		group: 'projects',
		operationId: 'getProjectTasks',
		summary: 'Returns project tasks',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								title: z.string().optional(),
								project_id: z.number().optional(),
								description: z.string().optional(),
								parent_task_id: z.number().optional(),
								assignee_id: z.number().optional(),
								assignee_ids: z
									.array(z.number())
									.max(10)
									.refine(
										(values) =>
											new Set(values.map((value) => JSON.stringify(value)))
												.size === values.length,
									)
									.optional(),
								done: z.union([z.literal(0), z.literal(1)]).optional(),
								due_date: z.string().optional(),
								creator_id: z.number().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								marked_as_done_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.projects.getProjectActivities': {
		version: 'v1',
		method: 'GET',
		path: '/projects/{id}/activities',
		group: 'projects',
		operationId: 'getProjectActivities',
		summary: 'Returns project activities',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								due_date: z.string().optional(),
								due_time: z.string().optional(),
								duration: z.string().optional(),
								deal_id: z.number().int().optional(),
								lead_id: z.string().nullable().optional(),
								person_id: z.number().int().optional(),
								project_id: z.number().int().nullable().optional(),
								org_id: z.number().int().optional(),
								location: z.string().optional(),
								public_description: z.string().optional(),
								outcome: z.number().int().nullable().optional(),
								id: z.number().int().optional(),
								done: z.boolean().optional(),
								subject: z.string().optional(),
								type: z.string().optional(),
								user_id: z.number().int().optional(),
								busy_flag: z.boolean().optional(),
								company_id: z.number().int().optional(),
								conference_meeting_client: z.string().optional(),
								conference_meeting_url: z.string().optional(),
								conference_meeting_id: z.string().optional(),
								add_time: z.string().optional(),
								marked_as_done_time: z.string().optional(),
								active_flag: z.boolean().optional(),
								update_time: z.string().optional(),
								update_user_id: z.number().int().optional(),
								source_timezone: z.string().optional(),
								location_subpremise: z.string().optional(),
								location_street_number: z.string().optional(),
								location_route: z.string().optional(),
								location_sublocality: z.string().optional(),
								location_locality: z.string().optional(),
								location_admin_area_level_1: z.string().optional(),
								location_admin_area_level_2: z.string().optional(),
								location_country: z.string().optional(),
								location_postal_code: z.string().optional(),
								location_formatted_address: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.projectBoards.getProjectsBoards': {
		version: 'v1',
		method: 'GET',
		path: '/projects/boards',
		group: 'projectBoards',
		operationId: 'getProjectsBoards',
		summary: 'Get all project boards',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								order_nr: z.number().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projectBoards.getProjectsBoard': {
		version: 'v1',
		method: 'GET',
		path: '/projects/boards/{id}',
		group: 'projectBoards',
		operationId: 'getProjectsBoard',
		summary: 'Get details of a board',
		tokenCost: 2,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						order_nr: z.number().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projectPhases.getProjectsPhases': {
		version: 'v1',
		method: 'GET',
		path: '/projects/phases',
		group: 'projectPhases',
		operationId: 'getProjectsPhases',
		summary: 'Get project phases',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'board_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z.strictObject({ board_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								board_id: z.number().optional(),
								order_nr: z.number().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projectPhases.getProjectsPhase': {
		version: 'v1',
		method: 'GET',
		path: '/projects/phases/{id}',
		group: 'projectPhases',
		operationId: 'getProjectsPhase',
		summary: 'Get details of a phase',
		tokenCost: 2,
		oauthScopes: ['projects:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						board_id: z.number().optional(),
						order_nr: z.number().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.projectTemplates.getProjectTemplates': {
		version: 'v1',
		method: 'GET',
		path: '/projectTemplates',
		group: 'projectTemplates',
		operationId: 'getProjectTemplates',
		summary: 'Get all project templates',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().optional(),
								title: z.string().optional(),
								description: z.string().optional(),
								projects_board_id: z.number().optional(),
								owner_id: z.number().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.projectTemplates.getProjectTemplate': {
		version: 'v1',
		method: 'GET',
		path: '/projectTemplates/{id}',
		group: 'projectTemplates',
		operationId: 'getProjectTemplate',
		summary: 'Get details of a template',
		tokenCost: 2,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						projects_board_id: z.number().optional(),
						owner_id: z.number().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.recents.getRecents': {
		version: 'v1',
		method: 'GET',
		path: '/recents',
		group: 'recents',
		operationId: 'getRecents',
		summary: 'Get recents',
		tokenCost: 20,
		oauthScopes: ['recents:read', 'search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'since_timestamp', style: 'form', explode: true, type: 'string' },
			{ name: 'items', style: 'form', explode: true, type: 'string' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					since_timestamp: z.string(),
					items: z
						.union([
							z.literal('activity'),
							z.literal('activityType'),
							z.literal('deal'),
							z.literal('file'),
							z.literal('filter'),
							z.literal('note'),
							z.literal('person'),
							z.literal('organization'),
							z.literal('pipeline'),
							z.literal('product'),
							z.literal('stage'),
							z.literal('user'),
						])
						.optional(),
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.union([
							z
								.object({
									item: z.literal('activity').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											due_date: z.string().optional(),
											due_time: z.string().optional(),
											duration: z.string().optional(),
											deal_id: z.number().int().optional(),
											lead_id: z.string().nullable().optional(),
											person_id: z.number().int().optional(),
											project_id: z.number().int().nullable().optional(),
											org_id: z.number().int().optional(),
											location: z.string().optional(),
											public_description: z.string().optional(),
											outcome: z.number().int().nullable().optional(),
											id: z.number().int().optional(),
											note: z.string().optional(),
											done: z.boolean().optional(),
											subject: z.string().optional(),
											type: z.string().optional(),
											user_id: z.number().int().optional(),
											participants: z
												.array(z.object({}).passthrough())
												.nullable()
												.optional(),
											busy_flag: z.boolean().optional(),
											attendees: z
												.array(z.object({}).passthrough())
												.nullable()
												.optional(),
											company_id: z.number().int().optional(),
											reference_type: z.string().optional(),
											reference_id: z.number().int().optional(),
											conference_meeting_client: z.string().optional(),
											conference_meeting_url: z.string().optional(),
											conference_meeting_id: z.string().optional(),
											add_time: z.string().optional(),
											marked_as_done_time: z.string().optional(),
											last_notification_time: z.string().optional(),
											last_notification_user_id: z.number().int().optional(),
											notification_language_id: z.number().int().optional(),
											active_flag: z.boolean().optional(),
											update_time: z.string().optional(),
											update_user_id: z.number().int().optional(),
											gcal_event_id: z.string().optional(),
											google_calendar_id: z.string().optional(),
											google_calendar_etag: z.string().optional(),
											calendar_sync_include_context: z.string().optional(),
											source_timezone: z.string().optional(),
											rec_rule: z.string().optional(),
											rec_rule_extension: z.string().optional(),
											rec_master_activity_id: z.number().int().optional(),
											series: z.array(z.object({}).passthrough()).optional(),
											created_by_user_id: z.number().int().optional(),
											location_subpremise: z.string().optional(),
											location_street_number: z.string().optional(),
											location_route: z.string().optional(),
											location_sublocality: z.string().optional(),
											location_locality: z.string().optional(),
											location_admin_area_level_1: z.string().optional(),
											location_admin_area_level_2: z.string().optional(),
											location_country: z.string().optional(),
											location_postal_code: z.string().optional(),
											location_formatted_address: z.string().optional(),
											org_name: z.string().optional(),
											person_name: z.string().optional(),
											deal_title: z.string().optional(),
											owner_name: z.string().optional(),
											person_dropbox_bcc: z.string().optional(),
											deal_dropbox_bcc: z.string().optional(),
											assigned_to_user_id: z.number().int().optional(),
											file: z.object({}).passthrough().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('activityType').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											name: z.string().optional(),
											icon_key: z
												.union([
													z.literal('task'),
													z.literal('email'),
													z.literal('meeting'),
													z.literal('deadline'),
													z.literal('call'),
													z.literal('lunch'),
													z.literal('calendar'),
													z.literal('downarrow'),
													z.literal('document'),
													z.literal('smartphone'),
													z.literal('camera'),
													z.literal('scissors'),
													z.literal('cogs'),
													z.literal('bubble'),
													z.literal('uparrow'),
													z.literal('checkbox'),
													z.literal('signpost'),
													z.literal('shuffle'),
													z.literal('addressbook'),
													z.literal('linegraph'),
													z.literal('picture'),
													z.literal('car'),
													z.literal('world'),
													z.literal('search'),
													z.literal('clip'),
													z.literal('sound'),
													z.literal('brush'),
													z.literal('key'),
													z.literal('padlock'),
													z.literal('pricetag'),
													z.literal('suitcase'),
													z.literal('finish'),
													z.literal('plane'),
													z.literal('loop'),
													z.literal('wifi'),
													z.literal('truck'),
													z.literal('cart'),
													z.literal('bulb'),
													z.literal('bell'),
													z.literal('presentation'),
												])
												.optional(),
											color: z.string().optional(),
											order_nr: z.number().int().optional(),
											key_string: z.string().optional(),
											active_flag: z.boolean().optional(),
											is_custom_flag: z.boolean().optional(),
											add_time: z.string().optional(),
											update_time: z.string().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('deal').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											creator_user_id: z.number().int().optional(),
											user_id: z.number().int().optional(),
											person_id: z.number().int().nullable().optional(),
											org_id: z.number().int().nullable().optional(),
											stage_id: z.number().int().optional(),
											title: z.string().optional(),
											value: z.number().optional(),
											currency: z.string().optional(),
											add_time: z.string().optional(),
											update_time: z.string().nullable().optional(),
											stage_change_time: z.string().nullable().optional(),
											active: z.boolean().optional(),
											deleted: z.boolean().optional(),
											is_archived: z.boolean().optional(),
											status: z.string().optional(),
											probability: z.number().nullable().optional(),
											next_activity_date: z.string().nullable().optional(),
											next_activity_time: z.string().nullable().optional(),
											next_activity_id: z.number().int().nullable().optional(),
											last_activity_id: z.number().int().nullable().optional(),
											last_activity_date: z.string().nullable().optional(),
											lost_reason: z.string().nullable().optional(),
											visible_to: z.string().optional(),
											close_time: z.string().nullable().optional(),
											pipeline_id: z.number().int().optional(),
											won_time: z.string().nullable().optional(),
											first_won_time: z.string().nullable().optional(),
											lost_time: z.string().nullable().optional(),
											products_count: z.number().int().optional(),
											files_count: z.number().int().optional(),
											notes_count: z.number().int().optional(),
											followers_count: z.number().int().optional(),
											email_messages_count: z.number().int().optional(),
											activities_count: z.number().int().optional(),
											done_activities_count: z.number().int().optional(),
											undone_activities_count: z.number().int().optional(),
											participants_count: z.number().int().optional(),
											expected_close_date: z.string().nullable().optional(),
											last_incoming_mail_time: z.string().nullable().optional(),
											last_outgoing_mail_time: z.string().nullable().optional(),
											label: z.string().nullable().optional(),
											stage_order_nr: z.number().int().optional(),
											person_name: z.string().nullable().optional(),
											org_name: z.string().nullable().optional(),
											next_activity_subject: z.string().nullable().optional(),
											next_activity_type: z.string().nullable().optional(),
											next_activity_duration: z.string().nullable().optional(),
											next_activity_note: z.string().nullable().optional(),
											formatted_value: z.string().optional(),
											weighted_value: z.number().optional(),
											formatted_weighted_value: z.string().optional(),
											weighted_value_currency: z.string().optional(),
											rotten_time: z.string().nullable().optional(),
											owner_name: z.string().optional(),
											cc_email: z.string().optional(),
											org_hidden: z.boolean().optional(),
											person_hidden: z.boolean().optional(),
											origin: z.string().optional(),
											origin_id: z.string().nullable().optional(),
											channel: z.number().int().nullable().optional(),
											channel_id: z.string().nullable().optional(),
											arr: z.number().nullable().optional(),
											mrr: z.number().nullable().optional(),
											acv: z.number().nullable().optional(),
											arr_currency: z.string().nullable().optional(),
											mrr_currency: z.string().nullable().optional(),
											acv_currency: z.string().nullable().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('file').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											user_id: z.number().int().optional(),
											deal_id: z.number().int().optional(),
											person_id: z.number().int().optional(),
											org_id: z.number().int().optional(),
											product_id: z.number().int().optional(),
											activity_id: z.number().int().optional(),
											lead_id: z.string().optional(),
											add_time: z.string().optional(),
											update_time: z.string().optional(),
											file_name: z.string().optional(),
											file_size: z.number().int().optional(),
											active_flag: z.boolean().optional(),
											inline_flag: z.boolean().optional(),
											remote_location: z.string().optional(),
											remote_id: z.string().optional(),
											cid: z.string().optional(),
											s3_bucket: z.string().optional(),
											mail_message_id: z.string().optional(),
											mail_template_id: z.string().optional(),
											deal_name: z.string().optional(),
											person_name: z.string().optional(),
											org_name: z.string().optional(),
											product_name: z.string().optional(),
											lead_name: z.string().optional(),
											url: z.string().optional(),
											name: z.string().optional(),
											description: z.string().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('filter').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											name: z.string().optional(),
											filter_code: z.string().nullable().optional(),
											is_editable: z.boolean().optional(),
											active_flag: z.boolean().optional(),
											type: z
												.union([
													z.literal('deals'),
													z.literal('leads'),
													z.literal('org'),
													z.literal('people'),
													z.literal('products'),
													z.literal('activity'),
													z.literal('projects'),
												])
												.optional(),
											temporary_flag: z.boolean().nullable().optional(),
											user_id: z.number().int().optional(),
											add_time: z.string().optional(),
											update_time: z.string().nullable().optional(),
											visible_to: z
												.union([
													z.literal('1'),
													z.literal('3'),
													z.literal('5'),
													z.literal('7'),
												])
												.optional(),
											last_used_time: z.string().nullable().optional(),
											custom_view_id: z.number().int().nullable().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('note').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											active_flag: z.boolean().optional(),
											add_time: z.string().optional(),
											content: z.string().optional(),
											deal: z
												.object({ title: z.string().optional() })
												.passthrough()
												.nullable()
												.optional(),
											lead_id: z.string().nullable().optional(),
											deal_id: z.number().int().nullable().optional(),
											last_update_user_id: z
												.number()
												.int()
												.nullable()
												.optional(),
											org_id: z.number().int().nullable().optional(),
											organization: z
												.object({ name: z.string().optional() })
												.passthrough()
												.nullable()
												.optional(),
											person: z
												.object({ name: z.string().optional() })
												.passthrough()
												.nullable()
												.optional(),
											person_id: z.number().int().nullable().optional(),
											project_id: z.number().int().nullable().optional(),
											project: z
												.object({ title: z.string().optional() })
												.passthrough()
												.nullable()
												.optional(),
											task_id: z.number().int().nullable().optional(),
											task: z
												.object({ title: z.string().optional() })
												.passthrough()
												.nullable()
												.optional(),
											pinned_to_deal_flag: z.boolean().optional(),
											pinned_to_organization_flag: z.boolean().optional(),
											pinned_to_person_flag: z.boolean().optional(),
											pinned_to_project_flag: z.boolean().optional(),
											pinned_to_task_flag: z.boolean().optional(),
											update_time: z.string().optional(),
											user: z
												.object({
													email: z.string().optional(),
													icon_url: z.string().nullable().optional(),
													is_you: z.boolean().optional(),
													name: z.string().optional(),
												})
												.passthrough()
												.optional(),
											user_id: z.number().int().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('person').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											company_id: z.number().int().optional(),
											active_flag: z.boolean().optional(),
											phone: z
												.array(
													z
														.object({
															value: z.string().optional(),
															primary: z.boolean().optional(),
															label: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											email: z
												.array(
													z
														.object({
															value: z.string().optional(),
															primary: z.boolean().optional(),
															label: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											first_char: z.string().optional(),
											add_time: z.string().optional(),
											update_time: z.string().optional(),
											visible_to: z.string().optional(),
											picture_id: z
												.object({
													id: z.number().int().optional(),
													item_type: z.string().optional(),
													item_id: z.number().int().optional(),
													active_flag: z.boolean().optional(),
													add_time: z.string().optional(),
													update_time: z.string().optional(),
													added_by_user_id: z.number().int().optional(),
													pictures: z
														.object({
															'128': z.string().optional(),
															'512': z.string().optional(),
														})
														.passthrough()
														.optional(),
												})
												.passthrough()
												.nullable()
												.optional(),
											label: z.number().int().nullable().optional(),
											label_ids: z.array(z.number().int()).optional(),
											org_name: z.string().nullable().optional(),
											owner_name: z.string().optional(),
											cc_email: z.string().nullable().optional(),
											owner_id: z.number().int().optional(),
											org_id: z.number().int().optional(),
											merge_what_id: z.number().int().optional(),
											name: z.string().optional(),
											first_name: z.string().optional(),
											last_name: z.string().nullable().optional(),
											email_messages_count: z.number().int().optional(),
											activities_count: z.number().int().optional(),
											done_activities_count: z.number().int().optional(),
											undone_activities_count: z.number().int().optional(),
											files_count: z.number().int().optional(),
											notes_count: z.number().int().optional(),
											followers_count: z.number().int().optional(),
											last_incoming_mail_time: z.string().nullable().optional(),
											last_outgoing_mail_time: z.string().nullable().optional(),
											open_deals_count: z.number().int().optional(),
											related_open_deals_count: z.number().int().optional(),
											closed_deals_count: z.number().int().optional(),
											related_closed_deals_count: z.number().int().optional(),
											won_deals_count: z.number().int().optional(),
											related_won_deals_count: z.number().int().optional(),
											lost_deals_count: z.number().int().optional(),
											related_lost_deals_count: z.number().int().optional(),
											next_activity_date: z.string().nullable().optional(),
											next_activity_time: z.string().nullable().optional(),
											next_activity_id: z.number().int().nullable().optional(),
											last_activity_id: z.number().int().nullable().optional(),
											last_activity_date: z.string().nullable().optional(),
											participant_open_deals_count: z.number().int().optional(),
											participant_closed_deals_count: z
												.number()
												.int()
												.optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('organization').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											company_id: z.number().int().optional(),
											owner_id: z
												.object({
													id: z.number().int().optional(),
													name: z.string().optional(),
													email: z.string().optional(),
													has_pic: z.number().int().optional(),
													pic_hash: z.string().nullable().optional(),
													active_flag: z.boolean().optional(),
													value: z.number().int().optional(),
												})
												.passthrough()
												.optional(),
											name: z.string().optional(),
											active_flag: z.boolean().optional(),
											picture_id: z
												.object({
													value: z.number().int().optional(),
													item_type: z.string().optional(),
													item_id: z.number().int().optional(),
													active_flag: z.boolean().optional(),
													add_time: z.string().optional(),
													update_time: z.string().optional(),
													added_by_user_id: z.number().int().optional(),
													pictures: z
														.object({
															'128': z.string().optional(),
															'512': z.string().optional(),
														})
														.passthrough()
														.optional(),
												})
												.passthrough()
												.optional(),
											country_code: z.string().nullable().optional(),
											first_char: z.string().optional(),
											add_time: z.string().optional(),
											update_time: z.string().optional(),
											visible_to: z.string().optional(),
											label: z.number().int().nullable().optional(),
											label_ids: z.array(z.number().int()).optional(),
											owner_name: z.string().optional(),
											cc_email: z.string().optional(),
											email_messages_count: z.number().int().optional(),
											people_count: z.number().int().optional(),
											activities_count: z.number().int().optional(),
											done_activities_count: z.number().int().optional(),
											undone_activities_count: z.number().int().optional(),
											files_count: z.number().int().optional(),
											notes_count: z.number().int().optional(),
											followers_count: z.number().int().optional(),
											address: z.string().nullable().optional(),
											address_subpremise: z.string().nullable().optional(),
											address_street_number: z.string().nullable().optional(),
											address_route: z.string().nullable().optional(),
											address_sublocality: z.string().nullable().optional(),
											address_locality: z.string().nullable().optional(),
											address_admin_area_level_1: z
												.string()
												.nullable()
												.optional(),
											address_admin_area_level_2: z
												.string()
												.nullable()
												.optional(),
											address_country: z.string().nullable().optional(),
											address_postal_code: z.string().nullable().optional(),
											address_formatted_address: z
												.string()
												.nullable()
												.optional(),
											open_deals_count: z.number().int().optional(),
											related_open_deals_count: z.number().int().optional(),
											closed_deals_count: z.number().int().optional(),
											related_closed_deals_count: z.number().int().optional(),
											won_deals_count: z.number().int().optional(),
											related_won_deals_count: z.number().int().optional(),
											lost_deals_count: z.number().int().optional(),
											related_lost_deals_count: z.number().int().optional(),
											next_activity_date: z.string().nullable().optional(),
											next_activity_time: z.string().nullable().optional(),
											next_activity_id: z.number().int().nullable().optional(),
											last_activity_id: z.number().int().nullable().optional(),
											last_activity_date: z.string().nullable().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('pipeline').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											name: z.string().optional(),
											url_title: z.string().optional(),
											order_nr: z.number().int().optional(),
											active: z.boolean().optional(),
											deal_probability: z.boolean().optional(),
											add_time: z.string().optional(),
											update_time: z.string().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('product').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											name: z.string().optional(),
											code: z.string().nullable().optional(),
											description: z.string().nullable().optional(),
											unit: z.string().nullable().optional(),
											tax: z.number().optional(),
											category: z.string().nullable().optional(),
											active_flag: z.boolean().optional(),
											selectable: z.boolean().optional(),
											first_char: z.string().optional(),
											visible_to: z.number().int().optional(),
											owner_id: z.number().int().optional(),
											files_count: z.number().int().optional(),
											add_time: z.string().optional(),
											update_time: z.string().optional(),
											prices: z.array(z.object({}).passthrough()).optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('stage').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											order_nr: z.number().int().optional(),
											name: z.string().optional(),
											active_flag: z.boolean().optional(),
											deal_probability: z.number().int().optional(),
											pipeline_id: z.number().int().optional(),
											rotten_flag: z.boolean().optional(),
											rotten_days: z.number().int().nullable().optional(),
											add_time: z.string().optional(),
											update_time: z.string().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
							z
								.object({
									item: z.literal('user').optional(),
									id: z.number().int().optional(),
									data: z
										.object({
											id: z.number().int().optional(),
											name: z.string().optional(),
											default_currency: z.string().optional(),
											locale: z.string().optional(),
											lang: z.number().int().optional(),
											email: z.string().optional(),
											phone: z.string().nullable().optional(),
											activated: z.boolean().optional(),
											last_login: z.string().optional(),
											created: z.string().optional(),
											modified: z.string().nullable().optional(),
											has_created_company: z.boolean().optional(),
											access: z
												.array(
													z
														.object({
															app: z
																.union([
																	z.literal('global'),
																	z.literal('sales'),
																	z.literal('campaigns'),
																	z.literal('projects'),
																	z.literal('account_settings'),
																	z.literal('partnership'),
																	z.literal('nova'),
																])
																.optional(),
															admin: z.boolean().optional(),
															permission_set_id: z.string().optional(),
														})
														.passthrough(),
												)
												.optional(),
											active_flag: z.boolean().optional(),
											timezone_name: z.string().optional(),
											timezone_offset: z.string().optional(),
											role_id: z.number().int().optional(),
											icon_url: z.string().nullable().optional(),
											is_you: z.boolean().optional(),
											is_deleted: z.boolean().optional(),
										})
										.passthrough()
										.optional(),
								})
								.passthrough(),
						]),
					)
					.optional(),
				additional_data: z
					.object({
						since_timestamp: z.string().optional(),
						last_timestamp_on_page: z.string().optional(),
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.getRoles': {
		version: 'v1',
		method: 'GET',
		path: '/roles',
		group: 'roles',
		operationId: 'getRoles',
		summary: 'Get all roles',
		tokenCost: 20,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								parent_role_id: z.number().int().nullable().optional(),
								name: z.string().optional(),
								id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								assignment_count: z.string().optional(),
								sub_role_count: z.string().optional(),
								level: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.addRole': {
		version: 'v1',
		method: 'POST',
		path: '/roles',
		group: 'roles',
		operationId: 'addRole',
		summary: 'Add a role',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					parent_role_id: z.number().int().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.deleteRole': {
		version: 'v1',
		method: 'DELETE',
		path: '/roles/{id}',
		group: 'roles',
		operationId: 'deleteRole',
		summary: 'Delete a role',
		tokenCost: 6,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.getRole': {
		version: 'v1',
		method: 'GET',
		path: '/roles/{id}',
		group: 'roles',
		operationId: 'getRole',
		summary: 'Get one role',
		tokenCost: 2,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						parent_role_id: z.number().int().nullable().optional(),
						name: z.string().optional(),
						id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						assignment_count: z.string().optional(),
						sub_role_count: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({
						settings: z
							.object({
								deal_default_visibility: z.number().optional(),
								lead_default_visibility: z.number().optional(),
								org_default_visibility: z.number().optional(),
								person_default_visibility: z.number().optional(),
								product_default_visibility: z.number().optional(),
								deal_access_level: z.number().optional(),
								org_access_level: z.number().optional(),
								person_access_level: z.number().optional(),
								product_access_level: z.number().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.updateRole': {
		version: 'v1',
		method: 'PUT',
		path: '/roles/{id}',
		group: 'roles',
		operationId: 'updateRole',
		summary: 'Update role details',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					parent_role_id: z.number().int().nullable().optional(),
					name: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.deleteRoleAssignment': {
		version: 'v1',
		method: 'DELETE',
		path: '/roles/{id}/assignments',
		group: 'roles',
		operationId: 'deleteRoleAssignment',
		summary: 'Delete a role assignment',
		tokenCost: 6,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.getRoleAssignments': {
		version: 'v1',
		method: 'GET',
		path: '/roles/{id}/assignments',
		group: 'roles',
		operationId: 'getRoleAssignments',
		summary: 'List role assignments',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								parent_role_id: z.number().int().nullable().optional(),
								name: z.string().optional(),
								user_id: z.number().int().optional(),
								role_id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.addRoleAssignment': {
		version: 'v1',
		method: 'POST',
		path: '/roles/{id}/assignments',
		group: 'roles',
		operationId: 'addRoleAssignment',
		summary: 'Add role assignment',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						role_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.getRoleSettings': {
		version: 'v1',
		method: 'GET',
		path: '/roles/{id}/settings',
		group: 'roles',
		operationId: 'getRoleSettings',
		summary: 'List role settings',
		tokenCost: 20,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						deal_default_visibility: z.number().optional(),
						lead_default_visibility: z.number().optional(),
						org_default_visibility: z.number().optional(),
						person_default_visibility: z.number().optional(),
						product_default_visibility: z.number().optional(),
						deal_access_level: z.number().optional(),
						org_access_level: z.number().optional(),
						person_access_level: z.number().optional(),
						product_access_level: z.number().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.addOrUpdateRoleSetting': {
		version: 'v1',
		method: 'POST',
		path: '/roles/{id}/settings',
		group: 'roles',
		operationId: 'addOrUpdateRoleSetting',
		summary: 'Add or update role setting',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					setting_key: z.union([
						z.literal('deal_default_visibility'),
						z.literal('lead_default_visibility'),
						z.literal('org_default_visibility'),
						z.literal('person_default_visibility'),
						z.literal('product_default_visibility'),
					]),
					value: z.union([
						z.literal(1),
						z.literal(3),
						z.literal(5),
						z.literal(7),
					]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						deal_default_visibility: z
							.union([z.literal(1), z.literal(3), z.literal(5), z.literal(7)])
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.getRolePipelines': {
		version: 'v1',
		method: 'GET',
		path: '/roles/{id}/pipelines',
		group: 'roles',
		operationId: 'getRolePipelines',
		summary: 'List pipeline visibility for a role',
		tokenCost: 20,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'visible', style: 'form', explode: true, type: 'boolean' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z.strictObject({ visible: z.boolean().optional() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						pipeline_ids: z.array(z.number()).optional(),
						visible: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.roles.updateRolePipelines': {
		version: 'v1',
		method: 'PUT',
		path: '/roles/{id}/pipelines',
		group: 'roles',
		operationId: 'updateRolePipelines',
		summary: 'Update pipeline visibility for a role',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					visible_pipeline_ids: z.strictObject({
						add: z.string(),
						remove: z.string(),
					}),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						pipeline_ids: z.array(z.number()).optional(),
						visible: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.stages.getStageDeals': {
		version: 'v1',
		method: 'GET',
		path: '/stages/{id}/deals',
		group: 'stages',
		operationId: 'getStageDeals',
		summary: 'Get deals in a stage',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'user_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'everyone', style: 'form', explode: true, type: 'number' },
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					filter_id: z.number().int().optional(),
					user_id: z.number().int().optional(),
					everyone: z.union([z.literal(0), z.literal(1)]).optional(),
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								creator_user_id: z.number().int().optional(),
								user_id: z.number().int().optional(),
								person_id: z.number().int().nullable().optional(),
								org_id: z.number().int().nullable().optional(),
								stage_id: z.number().int().optional(),
								title: z.string().optional(),
								value: z.number().optional(),
								currency: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								stage_change_time: z.string().nullable().optional(),
								active: z.boolean().optional(),
								deleted: z.boolean().optional(),
								is_archived: z.boolean().optional(),
								status: z.string().optional(),
								probability: z.number().nullable().optional(),
								next_activity_date: z.string().nullable().optional(),
								next_activity_time: z.string().nullable().optional(),
								next_activity_id: z.number().int().nullable().optional(),
								last_activity_id: z.number().int().nullable().optional(),
								last_activity_date: z.string().nullable().optional(),
								lost_reason: z.string().nullable().optional(),
								visible_to: z.string().optional(),
								close_time: z.string().nullable().optional(),
								pipeline_id: z.number().int().optional(),
								won_time: z.string().nullable().optional(),
								first_won_time: z.string().nullable().optional(),
								lost_time: z.string().nullable().optional(),
								products_count: z.number().int().optional(),
								files_count: z.number().int().optional(),
								notes_count: z.number().int().optional(),
								followers_count: z.number().int().optional(),
								email_messages_count: z.number().int().optional(),
								activities_count: z.number().int().optional(),
								done_activities_count: z.number().int().optional(),
								undone_activities_count: z.number().int().optional(),
								participants_count: z.number().int().optional(),
								expected_close_date: z.string().nullable().optional(),
								last_incoming_mail_time: z.string().nullable().optional(),
								last_outgoing_mail_time: z.string().nullable().optional(),
								label: z.string().nullable().optional(),
								stage_order_nr: z.number().int().optional(),
								person_name: z.string().nullable().optional(),
								org_name: z.string().nullable().optional(),
								next_activity_subject: z.string().nullable().optional(),
								next_activity_type: z.string().nullable().optional(),
								next_activity_duration: z.string().nullable().optional(),
								next_activity_note: z.string().nullable().optional(),
								formatted_value: z.string().optional(),
								weighted_value: z.number().optional(),
								formatted_weighted_value: z.string().optional(),
								weighted_value_currency: z.string().optional(),
								rotten_time: z.string().nullable().optional(),
								owner_name: z.string().optional(),
								cc_email: z.string().optional(),
								org_hidden: z.boolean().optional(),
								person_hidden: z.boolean().optional(),
								origin: z.string().optional(),
								origin_id: z.string().nullable().optional(),
								channel: z.number().int().nullable().optional(),
								channel_id: z.string().nullable().optional(),
								arr: z.number().nullable().optional(),
								mrr: z.number().nullable().optional(),
								acv: z.number().nullable().optional(),
								arr_currency: z.string().nullable().optional(),
								mrr_currency: z.string().nullable().optional(),
								acv_currency: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						start: z.number().int().optional(),
						limit: z.number().int().optional(),
						more_items_in_collection: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.tasks.getTasks': {
		version: 'v1',
		method: 'GET',
		path: '/tasks',
		group: 'tasks',
		operationId: 'getTasks',
		summary: 'Get all tasks',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'assignee_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'project_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'parent_task_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'done', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
					assignee_id: z.number().int().optional(),
					project_id: z.number().int().optional(),
					parent_task_id: z.number().int().optional(),
					done: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								title: z.string().optional(),
								project_id: z.number().optional(),
								description: z.string().optional(),
								parent_task_id: z.number().optional(),
								assignee_id: z.number().optional(),
								assignee_ids: z
									.array(z.number())
									.max(10)
									.refine(
										(values) =>
											new Set(values.map((value) => JSON.stringify(value)))
												.size === values.length,
									)
									.optional(),
								done: z.union([z.literal(0), z.literal(1)]).optional(),
								due_date: z.string().optional(),
								creator_id: z.number().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								marked_as_done_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.tasks.addTask': {
		version: 'v1',
		method: 'POST',
		path: '/tasks',
		group: 'tasks',
		operationId: 'addTask',
		summary: 'Add a task',
		tokenCost: 10,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					title: z.string(),
					project_id: z.number(),
					description: z.string().optional(),
					parent_task_id: z.number().optional(),
					assignee_id: z.number().optional(),
					assignee_ids: z
						.array(z.number())
						.max(10)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					done: z.union([z.literal(0), z.literal(1)]).optional(),
					due_date: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						project_id: z.number().optional(),
						description: z.string().optional(),
						parent_task_id: z.number().optional(),
						assignee_id: z.number().optional(),
						assignee_ids: z
							.array(z.number())
							.max(10)
							.refine(
								(values) =>
									new Set(values.map((value) => JSON.stringify(value))).size ===
									values.length,
							)
							.optional(),
						done: z.union([z.literal(0), z.literal(1)]).optional(),
						due_date: z.string().optional(),
						creator_id: z.number().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						marked_as_done_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.tasks.getTask': {
		version: 'v1',
		method: 'GET',
		path: '/tasks/{id}',
		group: 'tasks',
		operationId: 'getTask',
		summary: 'Get details of a task',
		tokenCost: 2,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						project_id: z.number().optional(),
						description: z.string().optional(),
						parent_task_id: z.number().optional(),
						assignee_id: z.number().optional(),
						assignee_ids: z
							.array(z.number())
							.max(10)
							.refine(
								(values) =>
									new Set(values.map((value) => JSON.stringify(value))).size ===
									values.length,
							)
							.optional(),
						done: z.union([z.literal(0), z.literal(1)]).optional(),
						due_date: z.string().optional(),
						creator_id: z.number().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						marked_as_done_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.tasks.updateTask': {
		version: 'v1',
		method: 'PUT',
		path: '/tasks/{id}',
		group: 'tasks',
		operationId: 'updateTask',
		summary: 'Update a task',
		tokenCost: 10,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					title: z.string().optional(),
					project_id: z.number().optional(),
					description: z.string().optional(),
					parent_task_id: z.number().optional(),
					assignee_id: z.number().optional(),
					assignee_ids: z
						.array(z.number())
						.max(10)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					done: z.union([z.literal(0), z.literal(1)]).optional(),
					due_date: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						project_id: z.number().optional(),
						description: z.string().optional(),
						parent_task_id: z.number().optional(),
						assignee_id: z.number().optional(),
						assignee_ids: z
							.array(z.number())
							.max(10)
							.refine(
								(values) =>
									new Set(values.map((value) => JSON.stringify(value))).size ===
									values.length,
							)
							.optional(),
						done: z.union([z.literal(0), z.literal(1)]).optional(),
						due_date: z.string().optional(),
						creator_id: z.number().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						marked_as_done_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.tasks.deleteTask': {
		version: 'v1',
		method: 'DELETE',
		path: '/tasks/{id}',
		group: 'tasks',
		operationId: 'deleteTask',
		summary: 'Delete a task',
		tokenCost: 6,
		oauthScopes: ['projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						success: z.boolean().optional(),
						data: z
							.object({ id: z.number().int().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV1.users.getUsers': {
		version: 'v1',
		method: 'GET',
		path: '/users',
		group: 'users',
		operationId: 'getUsers',
		summary: 'Get all users',
		tokenCost: 20,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								default_currency: z.string().optional(),
								locale: z.string().optional(),
								lang: z.number().int().optional(),
								email: z.string().optional(),
								phone: z.string().nullable().optional(),
								activated: z.boolean().optional(),
								last_login: z.string().optional(),
								created: z.string().optional(),
								modified: z.string().nullable().optional(),
								has_created_company: z.boolean().optional(),
								access: z
									.array(
										z
											.object({
												app: z
													.union([
														z.literal('global'),
														z.literal('sales'),
														z.literal('campaigns'),
														z.literal('projects'),
														z.literal('account_settings'),
														z.literal('partnership'),
														z.literal('nova'),
													])
													.optional(),
												admin: z.boolean().optional(),
												permission_set_id: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active_flag: z.boolean().optional(),
								timezone_name: z.string().optional(),
								timezone_offset: z.string().optional(),
								role_id: z.number().int().optional(),
								icon_url: z.string().nullable().optional(),
								is_you: z.boolean().optional(),
								is_deleted: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.addUser': {
		version: 'v1',
		method: 'POST',
		path: '/users',
		group: 'users',
		operationId: 'addUser',
		summary: 'Add a new user',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					email: z.string(),
					access: z
						.array(
							z.strictObject({
								app: z.union([
									z.literal('global'),
									z.literal('sales'),
									z.literal('campaigns'),
									z.literal('projects'),
									z.literal('account_settings'),
									z.literal('partnership'),
									z.literal('nova'),
								]),
								admin: z.boolean().optional(),
								permission_set_id: z.string().optional(),
							}),
						)
						.optional(),
					active_flag: z.boolean().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						default_currency: z.string().optional(),
						locale: z.string().optional(),
						lang: z.number().int().optional(),
						email: z.string().optional(),
						phone: z.string().nullable().optional(),
						activated: z.boolean().optional(),
						last_login: z.string().optional(),
						created: z.string().optional(),
						modified: z.string().nullable().optional(),
						has_created_company: z.boolean().optional(),
						access: z
							.array(
								z
									.object({
										app: z
											.union([
												z.literal('global'),
												z.literal('sales'),
												z.literal('campaigns'),
												z.literal('projects'),
												z.literal('account_settings'),
												z.literal('partnership'),
												z.literal('nova'),
											])
											.optional(),
										admin: z.boolean().optional(),
										permission_set_id: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active_flag: z.boolean().optional(),
						timezone_name: z.string().optional(),
						timezone_offset: z.string().optional(),
						role_id: z.number().int().optional(),
						icon_url: z.string().nullable().optional(),
						is_you: z.boolean().optional(),
						is_deleted: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.findUsersByName': {
		version: 'v1',
		method: 'GET',
		path: '/users/find',
		group: 'users',
		operationId: 'findUsersByName',
		summary: 'Find users by name',
		tokenCost: 40,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'search_by_email', style: 'form', explode: true, type: 'number' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string(),
					search_by_email: z.union([z.literal(0), z.literal(1)]).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								default_currency: z.string().optional(),
								locale: z.string().optional(),
								lang: z.number().int().optional(),
								email: z.string().optional(),
								phone: z.string().nullable().optional(),
								activated: z.boolean().optional(),
								last_login: z.string().optional(),
								created: z.string().optional(),
								modified: z.string().nullable().optional(),
								has_created_company: z.boolean().optional(),
								access: z
									.array(
										z
											.object({
												app: z
													.union([
														z.literal('global'),
														z.literal('sales'),
														z.literal('campaigns'),
														z.literal('projects'),
														z.literal('account_settings'),
														z.literal('partnership'),
														z.literal('nova'),
													])
													.optional(),
												admin: z.boolean().optional(),
												permission_set_id: z.string().optional(),
											})
											.passthrough(),
									)
									.optional(),
								active_flag: z.boolean().optional(),
								timezone_name: z.string().optional(),
								timezone_offset: z.string().optional(),
								role_id: z.number().int().optional(),
								icon_url: z.string().nullable().optional(),
								is_you: z.boolean().optional(),
								is_deleted: z.boolean().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.getCurrentUser': {
		version: 'v1',
		method: 'GET',
		path: '/users/me',
		group: 'users',
		operationId: 'getCurrentUser',
		summary: 'Get current user data',
		tokenCost: 2,
		oauthScopes: ['base'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						default_currency: z.string().optional(),
						locale: z.string().optional(),
						lang: z.number().int().optional(),
						email: z.string().optional(),
						phone: z.string().nullable().optional(),
						activated: z.boolean().optional(),
						last_login: z.string().optional(),
						created: z.string().optional(),
						modified: z.string().nullable().optional(),
						has_created_company: z.boolean().optional(),
						access: z
							.array(
								z
									.object({
										app: z
											.union([
												z.literal('global'),
												z.literal('sales'),
												z.literal('campaigns'),
												z.literal('projects'),
												z.literal('account_settings'),
												z.literal('partnership'),
												z.literal('nova'),
											])
											.optional(),
										admin: z.boolean().optional(),
										permission_set_id: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active_flag: z.boolean().optional(),
						timezone_name: z.string().optional(),
						timezone_offset: z.string().optional(),
						role_id: z.number().int().optional(),
						icon_url: z.string().nullable().optional(),
						is_you: z.boolean().optional(),
						is_deleted: z.boolean().optional(),
						company_id: z.number().int().optional(),
						company_name: z.string().optional(),
						company_domain: z.string().optional(),
						company_country: z.string().optional(),
						company_industry: z.string().optional(),
						language: z
							.object({
								language_code: z.string().optional(),
								country_code: z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.getUser': {
		version: 'v1',
		method: 'GET',
		path: '/users/{id}',
		group: 'users',
		operationId: 'getUser',
		summary: 'Get one user',
		tokenCost: 2,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						default_currency: z.string().optional(),
						locale: z.string().optional(),
						lang: z.number().int().optional(),
						email: z.string().optional(),
						phone: z.string().nullable().optional(),
						activated: z.boolean().optional(),
						last_login: z.string().optional(),
						created: z.string().optional(),
						modified: z.string().nullable().optional(),
						has_created_company: z.boolean().optional(),
						access: z
							.array(
								z
									.object({
										app: z
											.union([
												z.literal('global'),
												z.literal('sales'),
												z.literal('campaigns'),
												z.literal('projects'),
												z.literal('account_settings'),
												z.literal('partnership'),
												z.literal('nova'),
											])
											.optional(),
										admin: z.boolean().optional(),
										permission_set_id: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active_flag: z.boolean().optional(),
						timezone_name: z.string().optional(),
						timezone_offset: z.string().optional(),
						role_id: z.number().int().optional(),
						icon_url: z.string().nullable().optional(),
						is_you: z.boolean().optional(),
						is_deleted: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.updateUser': {
		version: 'v1',
		method: 'PUT',
		path: '/users/{id}',
		group: 'users',
		operationId: 'updateUser',
		summary: 'Update user details',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ active_flag: z.boolean() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						default_currency: z.string().optional(),
						locale: z.string().optional(),
						lang: z.number().int().optional(),
						email: z.string().optional(),
						phone: z.string().nullable().optional(),
						activated: z.boolean().optional(),
						last_login: z.string().optional(),
						created: z.string().optional(),
						modified: z.string().nullable().optional(),
						has_created_company: z.boolean().optional(),
						access: z
							.array(
								z
									.object({
										app: z
											.union([
												z.literal('global'),
												z.literal('sales'),
												z.literal('campaigns'),
												z.literal('projects'),
												z.literal('account_settings'),
												z.literal('partnership'),
												z.literal('nova'),
											])
											.optional(),
										admin: z.boolean().optional(),
										permission_set_id: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						active_flag: z.boolean().optional(),
						timezone_name: z.string().optional(),
						timezone_offset: z.string().optional(),
						role_id: z.number().int().optional(),
						icon_url: z.string().nullable().optional(),
						is_you: z.boolean().optional(),
						is_deleted: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.getUserFollowers': {
		version: 'v1',
		method: 'GET',
		path: '/users/{id}/followers',
		group: 'users',
		operationId: 'getUserFollowers',
		summary: 'List followers of a user',
		tokenCost: 20,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	'apiV1.users.getUserPermissions': {
		version: 'v1',
		method: 'GET',
		path: '/users/{id}/permissions',
		group: 'users',
		operationId: 'getUserPermissions',
		summary: 'List user permissions',
		tokenCost: 10,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						can_add_custom_fields: z.boolean().optional(),
						can_add_products: z.boolean().optional(),
						can_add_prospects_as_leads: z.boolean().optional(),
						can_bulk_edit_items: z.boolean().optional(),
						can_change_visibility_of_items: z.boolean().optional(),
						can_convert_deals_to_leads: z.boolean().optional(),
						can_create_own_workflow: z.boolean().optional(),
						can_delete_activities: z.boolean().optional(),
						can_delete_custom_fields: z.boolean().optional(),
						can_delete_deals: z.boolean().optional(),
						can_edit_custom_fields: z.boolean().optional(),
						can_edit_deals_closed_date: z.boolean().optional(),
						can_edit_products: z.boolean().optional(),
						can_edit_shared_filters: z.boolean().optional(),
						can_export_data_from_lists: z.boolean().optional(),
						can_follow_other_users: z.boolean().optional(),
						can_merge_deals: z.boolean().optional(),
						can_merge_organizations: z.boolean().optional(),
						can_merge_people: z.boolean().optional(),
						can_modify_labels: z.boolean().optional(),
						can_see_company_wide_statistics: z.boolean().optional(),
						can_see_deals_list_summary: z.boolean().optional(),
						can_see_hidden_items_names: z.boolean().optional(),
						can_see_other_users: z.boolean().optional(),
						can_see_other_users_statistics: z.boolean().optional(),
						can_see_security_dashboard: z.boolean().optional(),
						can_share_filters: z.boolean().optional(),
						can_share_insights: z.boolean().optional(),
						can_use_api: z.boolean().optional(),
						can_use_email_tracking: z.boolean().optional(),
						can_use_import: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.getUserRoleAssignments': {
		version: 'v1',
		method: 'GET',
		path: '/users/{id}/roleAssignments',
		group: 'users',
		operationId: 'getUserRoleAssignments',
		summary: 'List role assignments',
		tokenCost: 10,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'start', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					start: z.number().int().optional(),
					limit: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								parent_role_id: z.number().int().nullable().optional(),
								name: z.string().optional(),
								user_id: z.number().int().optional(),
								role_id: z.number().int().optional(),
								active_flag: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({
						pagination: z
							.object({
								start: z.number().int().optional(),
								limit: z.number().int().optional(),
								more_items_in_collection: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.users.getUserRoleSettings': {
		version: 'v1',
		method: 'GET',
		path: '/users/{id}/roleSettings',
		group: 'users',
		operationId: 'getUserRoleSettings',
		summary: 'List user role settings',
		tokenCost: 10,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						deal_default_visibility: z.number().optional(),
						lead_default_visibility: z.number().optional(),
						org_default_visibility: z.number().optional(),
						person_default_visibility: z.number().optional(),
						product_default_visibility: z.number().optional(),
						deal_access_level: z.number().optional(),
						org_access_level: z.number().optional(),
						person_access_level: z.number().optional(),
						product_access_level: z.number().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.userConnections.getUserConnections': {
		version: 'v1',
		method: 'GET',
		path: '/userConnections',
		group: 'userConnections',
		operationId: 'getUserConnections',
		summary: 'Get all user connections',
		tokenCost: 20,
		oauthScopes: ['base'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ google: z.string().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV1.userSettings.getUserSettings': {
		version: 'v1',
		method: 'GET',
		path: '/userSettings',
		group: 'userSettings',
		operationId: 'getUserSettings',
		summary: 'List settings of an authorized user',
		tokenCost: 2,
		oauthScopes: ['base'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						marketplace_team: z.boolean().optional(),
						list_limit: z.number().optional(),
						beta_app: z.boolean().optional(),
						prevent_salesphone_callto_override: z.boolean().optional(),
						file_upload_destination: z.string().optional(),
						callto_link_syntax: z.string().optional(),
						autofill_deal_expected_close_date: z.boolean().optional(),
						person_duplicate_condition: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.activityFields.getActivityFields': {
		version: 'v2',
		method: 'GET',
		path: '/activityFields',
		group: 'activityFields',
		operationId: 'getActivityFields',
		summary: 'Get all activity fields',
		tokenCost: 10,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					include_fields: z
						.array(z.literal('ui_visibility'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_name: z.string(),
								field_code: z.string(),
								field_type: z.union([
									z.literal('int'),
									z.literal('double'),
									z.literal('boolean'),
									z.literal('varchar'),
									z.literal('text'),
									z.literal('phone'),
									z.literal('varchar_options'),
									z.literal('varchar_auto'),
									z.literal('date'),
									z.literal('daterange'),
									z.literal('time'),
									z.literal('timerange'),
									z.literal('enum'),
									z.literal('set'),
									z.literal('address'),
									z.literal('monetary'),
									z.literal('deal'),
									z.literal('deals'),
									z.literal('lead'),
									z.literal('org'),
									z.literal('people'),
									z.literal('project'),
									z.literal('stage'),
									z.literal('user'),
									z.literal('activity'),
									z.literal('json'),
									z.literal('picture'),
									z.literal('status'),
									z.literal('visible_to'),
									z.literal('price_list'),
									z.literal('billing_frequency'),
									z.literal('projects_board'),
									z.literal('projects_phase'),
									z.literal('participants'),
									z.literal('attendees'),
								]),
								options: z
									.array(
										z
											.object({
												id: z.union([z.number().int(), z.string()]).optional(),
												label: z.string().optional(),
												color: z.string().nullable().optional(),
												update_time: z.string().nullable().optional(),
												add_time: z.string().nullable().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								subfields: z
									.array(
										z
											.object({
												field_code: z.string().optional(),
												field_name: z.string().optional(),
												field_type: z.string().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								is_custom_field: z.boolean(),
								is_optional_response_field: z.boolean(),
								ui_visibility: z
									.object({
										add_visible_flag: z.boolean().optional(),
										details_visible_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.activityFields.getActivityField': {
		version: 'v2',
		method: 'GET',
		path: '/activityFields/{field_code}',
		group: 'activityFields',
		operationId: 'getActivityField',
		summary: 'Get one activity field',
		tokenCost: 1,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			query: z
				.strictObject({
					include_fields: z
						.array(z.literal('ui_visibility'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
							z.literal('participants'),
							z.literal('attendees'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.getArchivedDeals': {
		version: 'v2',
		method: 'GET',
		path: '/deals/archived',
		group: 'deals',
		operationId: 'getArchivedDeals',
		summary: 'Get all archived deals',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'ids', style: 'form', explode: false, type: 'array' },
			{ name: 'owner_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'org_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'pipeline_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'stage_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'status', style: 'form', explode: false, type: 'array' },
			{ name: 'updated_since', style: 'form', explode: true, type: 'string' },
			{ name: 'updated_until', style: 'form', explode: true, type: 'string' },
			{ name: 'sort_by', style: 'form', explode: true, type: 'string' },
			{ name: 'sort_direction', style: 'form', explode: true, type: 'string' },
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'custom_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					filter_id: z.number().int().optional(),
					ids: z
						.array(z.number().int())
						.max(100)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					owner_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					pipeline_id: z.number().int().optional(),
					stage_id: z.number().int().optional(),
					status: z
						.array(
							z.union([
								z.literal('open'),
								z.literal('won'),
								z.literal('lost'),
								z.literal('deleted'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					updated_since: z.string().optional(),
					updated_until: z.string().optional(),
					sort_by: z
						.union([
							z.literal('id'),
							z.literal('update_time'),
							z.literal('add_time'),
						])
						.optional(),
					sort_direction: z
						.union([z.literal('asc'), z.literal('desc')])
						.optional(),
					include_fields: z
						.array(
							z.union([
								z.literal('next_activity_id'),
								z.literal('last_activity_id'),
								z.literal('first_won_time'),
								z.literal('products_count'),
								z.literal('files_count'),
								z.literal('notes_count'),
								z.literal('followers_count'),
								z.literal('email_messages_count'),
								z.literal('activities_count'),
								z.literal('done_activities_count'),
								z.literal('undone_activities_count'),
								z.literal('participants_count'),
								z.literal('last_incoming_mail_time'),
								z.literal('last_outgoing_mail_time'),
								z.literal('smart_bcc_email'),
								z.literal('source_lead_id'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					custom_fields: z
						.array(z.string())
						.max(15)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								title: z.string().optional(),
								owner_id: z.number().int().optional(),
								person_id: z.number().int().nullable().optional(),
								org_id: z.number().int().nullable().optional(),
								pipeline_id: z.number().int().optional(),
								stage_id: z.number().int().optional(),
								value: z.number().optional(),
								currency: z.string().optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
								stage_change_time: z.string().nullable().optional(),
								is_deleted: z.boolean().optional(),
								is_archived: z.boolean().optional(),
								status: z.string().optional(),
								probability: z.number().nullable().optional(),
								lost_reason: z.string().nullable().optional(),
								visible_to: z.number().int().optional(),
								close_time: z.string().nullable().optional(),
								won_time: z.string().nullable().optional(),
								lost_time: z.string().nullable().optional(),
								expected_close_date: z.string().nullable().optional(),
								label_ids: z.array(z.number().int()).optional(),
								origin: z.string().optional(),
								origin_id: z.string().nullable().optional(),
								channel: z.number().int().nullable().optional(),
								channel_id: z.string().nullable().optional(),
								source_lead_id: z.string().nullable().optional(),
								arr: z.number().nullable().optional(),
								mrr: z.number().nullable().optional(),
								acv: z.number().nullable().optional(),
								custom_fields: z.object({}).catchall(z.json()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.getDealFollowers': {
		version: 'v2',
		method: 'GET',
		path: '/deals/{id}/followers',
		group: 'deals',
		operationId: 'getDealFollowers',
		summary: 'List followers of a deal',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.addDealFollower': {
		version: 'v2',
		method: 'POST',
		path: '/deals/{id}/followers',
		group: 'deals',
		operationId: 'addDealFollower',
		summary: 'Add a follower to a deal',
		tokenCost: 5,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						add_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.getDealFollowersChangelog': {
		version: 'v2',
		method: 'GET',
		path: '/deals/{id}/followers/changelog',
		group: 'deals',
		operationId: 'getDealFollowersChangelog',
		summary: 'List followers changelog of a deal',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								action: z.string().optional(),
								actor_user_id: z.number().int().optional(),
								follower_user_id: z.number().int().optional(),
								time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.deleteDealFollower': {
		version: 'v2',
		method: 'DELETE',
		path: '/deals/{id}/followers/{follower_id}',
		group: 'deals',
		operationId: 'deleteDealFollower',
		summary: 'Delete a follower from a deal',
		tokenCost: 3,
		oauthScopes: ['deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'follower_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				follower_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ user_id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealProducts.getDealsProducts': {
		version: 'v2',
		method: 'GET',
		path: '/deals/products',
		group: 'dealProducts',
		operationId: 'getDealsProducts',
		summary: 'Get deal products of several deals',
		tokenCost: 10,
		oauthScopes: ['products:read', 'products:full', 'deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'deal_ids', style: 'form', explode: false, type: 'array' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort_by', style: 'form', explode: true, type: 'string' },
			{ name: 'sort_direction', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					deal_ids: z.array(z.number().int()),
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
					sort_by: z
						.union([
							z.literal('id'),
							z.literal('deal_id'),
							z.literal('add_time'),
							z.literal('update_time'),
							z.literal('order_nr'),
						])
						.optional(),
					sort_direction: z
						.union([z.literal('asc'), z.literal('desc')])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								sum: z.number().optional(),
								tax: z.number().optional(),
								deal_id: z.number().int().optional(),
								name: z.string().optional(),
								product_id: z.number().int().optional(),
								product_variation_id: z.number().int().nullable().optional(),
								order_nr: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								comments: z.string().optional(),
								currency: z.string().optional(),
								discount: z.number().optional(),
								discount_type: z
									.union([z.literal('percentage'), z.literal('amount')])
									.optional(),
								quantity: z.number().optional(),
								item_price: z.number().optional(),
								tax_method: z
									.union([
										z.literal('exclusive'),
										z.literal('inclusive'),
										z.literal('none'),
									])
									.optional(),
								is_enabled: z.boolean().optional(),
								billing_frequency: z
									.union([
										z.literal('one-time'),
										z.literal('annually'),
										z.literal('semi-annually'),
										z.literal('quarterly'),
										z.literal('monthly'),
										z.literal('weekly'),
									])
									.optional(),
								billing_frequency_cycles: z
									.number()
									.int()
									.nullable()
									.optional(),
								billing_start_date: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.searchDeals': {
		version: 'v2',
		method: 'GET',
		path: '/deals/search',
		group: 'deals',
		operationId: 'searchDeals',
		summary: 'Search deals',
		tokenCost: 20,
		oauthScopes: ['deals:read', 'deals:full', 'search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'fields', style: 'form', explode: false, type: 'array' },
			{ name: 'exact_match', style: 'form', explode: true, type: 'boolean' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{
				name: 'organization_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{ name: 'status', style: 'form', explode: true, type: 'string' },
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string().max(100),
					fields: z
						.array(
							z.union([
								z.literal('custom_fields'),
								z.literal('notes'),
								z.literal('title'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					exact_match: z.boolean().optional(),
					person_id: z.number().int().optional(),
					organization_id: z.number().int().optional(),
					status: z
						.union([z.literal('open'), z.literal('won'), z.literal('lost')])
						.optional(),
					include_fields: z
						.array(z.literal('deal.cc_email'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(100).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z
											.object({
												id: z.number().int().optional(),
												type: z.string().optional(),
												title: z.string().optional(),
												value: z.number().nullable().optional(),
												currency: z.string().optional(),
												status: z.string().optional(),
												visible_to: z.number().int().optional(),
												owner: z
													.object({ id: z.number().int().optional() })
													.passthrough()
													.optional(),
												stage: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.optional(),
												person: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.nullable()
													.optional(),
												organization: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.nullable()
													.optional(),
												custom_fields: z.array(z.string()).optional(),
												notes: z.array(z.string()).optional(),
												is_archived: z.boolean().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealProducts.getDealProducts': {
		version: 'v2',
		method: 'GET',
		path: '/deals/{id}/products',
		group: 'dealProducts',
		operationId: 'getDealProducts',
		summary: 'List products attached to a deal',
		tokenCost: 10,
		oauthScopes: ['products:read', 'products:full', 'deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort_by', style: 'form', explode: true, type: 'string' },
			{ name: 'sort_direction', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
					sort_by: z
						.union([
							z.literal('id'),
							z.literal('add_time'),
							z.literal('update_time'),
							z.literal('order_nr'),
						])
						.optional(),
					sort_direction: z
						.union([z.literal('asc'), z.literal('desc')])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								sum: z.number().optional(),
								tax: z.number().optional(),
								deal_id: z.number().int().optional(),
								name: z.string().optional(),
								product_id: z.number().int().optional(),
								product_variation_id: z.number().int().nullable().optional(),
								order_nr: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								comments: z.string().optional(),
								currency: z.string().optional(),
								discount: z.number().optional(),
								discount_type: z
									.union([z.literal('percentage'), z.literal('amount')])
									.optional(),
								quantity: z.number().optional(),
								item_price: z.number().optional(),
								tax_method: z
									.union([
										z.literal('exclusive'),
										z.literal('inclusive'),
										z.literal('none'),
									])
									.optional(),
								is_enabled: z.boolean().optional(),
								billing_frequency: z
									.union([
										z.literal('one-time'),
										z.literal('annually'),
										z.literal('semi-annually'),
										z.literal('quarterly'),
										z.literal('monthly'),
										z.literal('weekly'),
									])
									.optional(),
								billing_frequency_cycles: z
									.number()
									.int()
									.nullable()
									.optional(),
								billing_start_date: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealProducts.addDealProduct': {
		version: 'v2',
		method: 'POST',
		path: '/deals/{id}/products',
		group: 'dealProducts',
		operationId: 'addDealProduct',
		summary: 'Add a product to a deal',
		tokenCost: 5,
		oauthScopes: ['products:full', 'deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					product_id: z.number().int(),
					item_price: z.number(),
					quantity: z.number(),
					tax: z.number().optional(),
					comments: z.string().optional(),
					discount: z.number().optional(),
					is_enabled: z.boolean().optional(),
					tax_method: z
						.union([
							z.literal('exclusive'),
							z.literal('inclusive'),
							z.literal('none'),
						])
						.optional(),
					discount_type: z
						.union([z.literal('percentage'), z.literal('amount')])
						.optional(),
					product_variation_id: z.number().int().nullable().optional(),
					billing_frequency: z
						.union([
							z.literal('one-time'),
							z.literal('annually'),
							z.literal('semi-annually'),
							z.literal('quarterly'),
							z.literal('monthly'),
							z.literal('weekly'),
						])
						.optional(),
					billing_frequency_cycles: z.number().int().nullable().optional(),
					billing_start_date: z.string().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						sum: z.number().optional(),
						tax: z.number().optional(),
						deal_id: z.number().int().optional(),
						name: z.string().optional(),
						product_id: z.number().int().optional(),
						product_variation_id: z.number().int().nullable().optional(),
						order_nr: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						comments: z.string().optional(),
						currency: z.string().optional(),
						discount: z.number().optional(),
						discount_type: z
							.union([z.literal('percentage'), z.literal('amount')])
							.optional(),
						quantity: z.number().optional(),
						item_price: z.number().optional(),
						tax_method: z
							.union([
								z.literal('exclusive'),
								z.literal('inclusive'),
								z.literal('none'),
							])
							.optional(),
						is_enabled: z.boolean().optional(),
						billing_frequency: z
							.union([
								z.literal('one-time'),
								z.literal('annually'),
								z.literal('semi-annually'),
								z.literal('quarterly'),
								z.literal('monthly'),
								z.literal('weekly'),
							])
							.optional(),
						billing_frequency_cycles: z.number().int().nullable().optional(),
						billing_start_date: z.string().nullable().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealProducts.deleteManyDealProducts': {
		version: 'v2',
		method: 'DELETE',
		path: '/deals/{id}/products',
		group: 'dealProducts',
		operationId: 'deleteManyDealProducts',
		summary: 'Delete many products from a deal',
		tokenCost: 15,
		oauthScopes: ['products:full', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'ids', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					ids: z
						.array(z.number().int())
						.max(100)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ ids: z.array(z.number().int()).optional() })
					.passthrough()
					.optional(),
				additional_data: z
					.object({ more_items_in_collection: z.boolean().optional() })
					.passthrough()
					.nullable()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealProducts.updateDealProduct': {
		version: 'v2',
		method: 'PATCH',
		path: '/deals/{id}/products/{product_attachment_id}',
		group: 'dealProducts',
		operationId: 'updateDealProduct',
		summary: 'Update the product attached to a deal',
		tokenCost: 5,
		oauthScopes: ['products:full', 'deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'product_attachment_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				product_attachment_id: z.number().int(),
			}),
			body: z
				.strictObject({
					product_id: z.number().int().optional(),
					item_price: z.number().optional(),
					quantity: z.number().optional(),
					tax: z.number().optional(),
					comments: z.string().optional(),
					discount: z.number().optional(),
					is_enabled: z.boolean().optional(),
					tax_method: z
						.union([
							z.literal('exclusive'),
							z.literal('inclusive'),
							z.literal('none'),
						])
						.optional(),
					discount_type: z
						.union([z.literal('percentage'), z.literal('amount')])
						.optional(),
					product_variation_id: z.number().int().nullable().optional(),
					billing_frequency: z
						.union([
							z.literal('one-time'),
							z.literal('annually'),
							z.literal('semi-annually'),
							z.literal('quarterly'),
							z.literal('monthly'),
							z.literal('weekly'),
						])
						.optional(),
					billing_frequency_cycles: z.number().int().nullable().optional(),
					billing_start_date: z.string().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						sum: z.number().optional(),
						tax: z.number().optional(),
						deal_id: z.number().int().optional(),
						name: z.string().optional(),
						product_id: z.number().int().optional(),
						product_variation_id: z.number().int().nullable().optional(),
						order_nr: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						comments: z.string().optional(),
						currency: z.string().optional(),
						discount: z.number().optional(),
						discount_type: z
							.union([z.literal('percentage'), z.literal('amount')])
							.optional(),
						quantity: z.number().optional(),
						item_price: z.number().optional(),
						tax_method: z
							.union([
								z.literal('exclusive'),
								z.literal('inclusive'),
								z.literal('none'),
							])
							.optional(),
						is_enabled: z.boolean().optional(),
						billing_frequency: z
							.union([
								z.literal('one-time'),
								z.literal('annually'),
								z.literal('semi-annually'),
								z.literal('quarterly'),
								z.literal('monthly'),
								z.literal('weekly'),
							])
							.optional(),
						billing_frequency_cycles: z.number().int().nullable().optional(),
						billing_start_date: z.string().nullable().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealProducts.deleteDealProduct': {
		version: 'v2',
		method: 'DELETE',
		path: '/deals/{id}/products/{product_attachment_id}',
		group: 'dealProducts',
		operationId: 'deleteDealProduct',
		summary: 'Delete an attached product from a deal',
		tokenCost: 3,
		oauthScopes: ['deals:full', 'products:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'product_attachment_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				product_attachment_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealProducts.addManyDealProducts': {
		version: 'v2',
		method: 'POST',
		path: '/deals/{id}/products/bulk',
		group: 'dealProducts',
		operationId: 'addManyDealProducts',
		summary: 'Add multiple products to a deal',
		tokenCost: 25,
		oauthScopes: ['products:full', 'deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					data: z
						.array(
							z.strictObject({
								product_id: z.number().int(),
								item_price: z.number(),
								quantity: z.number(),
								tax: z.number().optional(),
								comments: z.string().optional(),
								discount: z.number().optional(),
								is_enabled: z.boolean().optional(),
								tax_method: z
									.union([
										z.literal('exclusive'),
										z.literal('inclusive'),
										z.literal('none'),
									])
									.optional(),
								discount_type: z
									.union([z.literal('percentage'), z.literal('amount')])
									.optional(),
								product_variation_id: z.number().int().nullable().optional(),
								billing_frequency: z
									.union([
										z.literal('one-time'),
										z.literal('annually'),
										z.literal('semi-annually'),
										z.literal('quarterly'),
										z.literal('monthly'),
										z.literal('weekly'),
									])
									.optional(),
								billing_frequency_cycles: z
									.number()
									.int()
									.nullable()
									.optional(),
								billing_start_date: z.string().nullable().optional(),
							}),
						)
						.max(100),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								sum: z.number().optional(),
								tax: z.number().optional(),
								deal_id: z.number().int().optional(),
								name: z.string().optional(),
								product_id: z.number().int().optional(),
								product_variation_id: z.number().int().nullable().optional(),
								order_nr: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								comments: z.string().optional(),
								currency: z.string().optional(),
								discount: z.number().optional(),
								discount_type: z
									.union([z.literal('percentage'), z.literal('amount')])
									.optional(),
								quantity: z.number().optional(),
								item_price: z.number().optional(),
								tax_method: z
									.union([
										z.literal('exclusive'),
										z.literal('inclusive'),
										z.literal('none'),
									])
									.optional(),
								is_enabled: z.boolean().optional(),
								billing_frequency: z
									.union([
										z.literal('one-time'),
										z.literal('annually'),
										z.literal('semi-annually'),
										z.literal('quarterly'),
										z.literal('monthly'),
										z.literal('weekly'),
									])
									.optional(),
								billing_frequency_cycles: z
									.number()
									.int()
									.nullable()
									.optional(),
								billing_start_date: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.getAdditionalDiscounts': {
		version: 'v2',
		method: 'GET',
		path: '/deals/{id}/discounts',
		group: 'deals',
		operationId: 'getAdditionalDiscounts',
		summary: 'List discounts added to a deal',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.string().optional(),
								type: z
									.union([z.literal('percentage'), z.literal('amount')])
									.optional(),
								amount: z.number().optional(),
								description: z.string().optional(),
								deal_id: z.number().int().optional(),
								created_at: z.string().optional(),
								created_by: z.number().int().optional(),
								updated_at: z.string().optional(),
								updated_by: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.postAdditionalDiscount': {
		version: 'v2',
		method: 'POST',
		path: '/deals/{id}/discounts',
		group: 'deals',
		operationId: 'postAdditionalDiscount',
		summary: 'Add a discount to a deal',
		tokenCost: 5,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					description: z.string(),
					amount: z.number(),
					type: z.union([z.literal('percentage'), z.literal('amount')]),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						type: z
							.union([z.literal('percentage'), z.literal('amount')])
							.optional(),
						amount: z.number().optional(),
						description: z.string().optional(),
						deal_id: z.number().int().optional(),
						created_at: z.string().optional(),
						created_by: z.number().int().optional(),
						updated_at: z.string().optional(),
						updated_by: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.updateAdditionalDiscount': {
		version: 'v2',
		method: 'PATCH',
		path: '/deals/{id}/discounts/{discount_id}',
		group: 'deals',
		operationId: 'updateAdditionalDiscount',
		summary: 'Update a discount added to a deal',
		tokenCost: 5,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'discount_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int(), discount_id: z.string() }),
			body: z
				.strictObject({
					description: z.string().optional(),
					amount: z.number().optional(),
					type: z
						.union([z.literal('percentage'), z.literal('amount')])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.string().optional(),
						type: z
							.union([z.literal('percentage'), z.literal('amount')])
							.optional(),
						amount: z.number().optional(),
						description: z.string().optional(),
						deal_id: z.number().int().optional(),
						created_at: z.string().optional(),
						created_by: z.number().int().optional(),
						updated_at: z.string().optional(),
						updated_by: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.deleteAdditionalDiscount': {
		version: 'v2',
		method: 'DELETE',
		path: '/deals/{id}/discounts/{discount_id}',
		group: 'deals',
		operationId: 'deleteAdditionalDiscount',
		summary: 'Delete a discount from a deal',
		tokenCost: 3,
		oauthScopes: ['deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'discount_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int(), discount_id: z.string() }),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealInstallments.getInstallments': {
		version: 'v2',
		method: 'GET',
		path: '/deals/installments',
		group: 'dealInstallments',
		operationId: 'getInstallments',
		summary: 'List installments added to a list of deals',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'deal_ids', style: 'form', explode: true, type: 'array' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort_by', style: 'form', explode: true, type: 'string' },
			{ name: 'sort_direction', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					deal_ids: z.array(z.number().int()),
					cursor: z.string().optional(),
					limit: z.number().int().optional(),
					sort_by: z
						.union([
							z.literal('id'),
							z.literal('billing_date'),
							z.literal('deal_id'),
						])
						.optional(),
					sort_direction: z
						.union([z.literal('asc'), z.literal('desc')])
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								amount: z.number().optional(),
								billing_date: z.string().optional(),
								description: z.string().optional(),
								deal_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealInstallments.postInstallment': {
		version: 'v2',
		method: 'POST',
		path: '/deals/{id}/installments',
		group: 'dealInstallments',
		operationId: 'postInstallment',
		summary: 'Add an installment to a deal',
		tokenCost: 5,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					description: z.string(),
					amount: z.number(),
					billing_date: z.string(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						amount: z.number().optional(),
						billing_date: z.string().optional(),
						description: z.string().optional(),
						deal_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealInstallments.updateInstallment': {
		version: 'v2',
		method: 'PATCH',
		path: '/deals/{id}/installments/{installment_id}',
		group: 'dealInstallments',
		operationId: 'updateInstallment',
		summary: 'Update an installment added to a deal',
		tokenCost: 5,
		oauthScopes: ['deals:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'installment_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				installment_id: z.number().int(),
			}),
			body: z
				.strictObject({
					description: z.string().optional(),
					amount: z.number().optional(),
					billing_date: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						amount: z.number().optional(),
						billing_date: z.string().optional(),
						description: z.string().optional(),
						deal_id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealInstallments.deleteInstallment': {
		version: 'v2',
		method: 'DELETE',
		path: '/deals/{id}/installments/{installment_id}',
		group: 'dealInstallments',
		operationId: 'deleteInstallment',
		summary: 'Delete an installment from a deal',
		tokenCost: 3,
		oauthScopes: ['deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'installment_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				installment_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.convertDealToLead': {
		version: 'v2',
		method: 'POST',
		path: '/deals/{id}/convert/lead',
		group: 'deals',
		operationId: 'convertDealToLead',
		summary: 'Convert a deal to a lead',
		tokenCost: 40,
		oauthScopes: ['deals:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.object({ conversion_id: z.string() }).passthrough().optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.getDealFields': {
		version: 'v2',
		method: 'GET',
		path: '/dealFields',
		group: 'dealFields',
		operationId: 'getDealFields',
		summary: 'Get all deal fields',
		tokenCost: 10,
		oauthScopes: ['deals:read', 'deals:full', 'admin', 'deal-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					include_fields: z
						.array(
							z.union([
								z.literal('ui_visibility'),
								z.literal('important_fields'),
								z.literal('required_fields'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_name: z.string(),
								field_code: z.string(),
								description: z.string().optional(),
								field_type: z.union([
									z.literal('int'),
									z.literal('double'),
									z.literal('boolean'),
									z.literal('varchar'),
									z.literal('text'),
									z.literal('phone'),
									z.literal('varchar_options'),
									z.literal('varchar_auto'),
									z.literal('date'),
									z.literal('daterange'),
									z.literal('time'),
									z.literal('timerange'),
									z.literal('enum'),
									z.literal('set'),
									z.literal('address'),
									z.literal('monetary'),
									z.literal('deal'),
									z.literal('deals'),
									z.literal('lead'),
									z.literal('org'),
									z.literal('people'),
									z.literal('project'),
									z.literal('stage'),
									z.literal('user'),
									z.literal('activity'),
									z.literal('json'),
									z.literal('picture'),
									z.literal('status'),
									z.literal('visible_to'),
									z.literal('price_list'),
									z.literal('billing_frequency'),
									z.literal('projects_board'),
									z.literal('projects_phase'),
								]),
								options: z
									.array(
										z
											.object({
												id: z.union([z.number().int(), z.string()]).optional(),
												label: z.string().optional(),
												color: z.string().nullable().optional(),
												update_time: z.string().nullable().optional(),
												add_time: z.string().nullable().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								subfields: z
									.array(
										z
											.object({
												field_code: z.string().optional(),
												field_name: z.string().optional(),
												field_type: z.string().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								is_custom_field: z.boolean(),
								is_optional_response_field: z.boolean(),
								ui_visibility: z
									.object({
										add_visible_flag: z.boolean().optional(),
										details_visible_flag: z.boolean().optional(),
										projects_detail_visible_flag: z.boolean().optional(),
										show_in_pipelines: z
											.object({
												show_in_all: z.boolean().optional(),
												pipeline_ids: z.array(z.number().int()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								important_fields: z
									.object({
										enabled: z.boolean().optional(),
										stage_ids: z.array(z.number().int()).optional(),
									})
									.passthrough()
									.optional(),
								required_fields: z
									.object({
										enabled: z.boolean().optional(),
										stage_ids: z.array(z.number().int()).optional(),
										statuses: z
											.object({})
											.catchall(
												z.array(z.union([z.literal('won'), z.literal('lost')])),
											)
											.optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.addDealField': {
		version: 'v2',
		method: 'POST',
		path: '/dealFields',
		group: 'dealFields',
		operationId: 'addDealField',
		summary: 'Create one deal field',
		tokenCost: 5,
		oauthScopes: ['admin', 'deal-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				field_name: z.string().min(1).max(255),
				field_type: z.union([
					z.literal('varchar'),
					z.literal('text'),
					z.literal('double'),
					z.literal('phone'),
					z.literal('date'),
					z.literal('daterange'),
					z.literal('time'),
					z.literal('timerange'),
					z.literal('set'),
					z.literal('enum'),
					z.literal('varchar_auto'),
					z.literal('address'),
					z.literal('monetary'),
					z.literal('org'),
					z.literal('people'),
					z.literal('user'),
				]),
				options: z.array(z.strictObject({ label: z.string() })).optional(),
				ui_visibility: z
					.object({
						add_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						projects_detail_visible_flag: z.boolean().optional(),
						show_in_pipelines: z
							.strictObject({
								show_in_all: z.boolean().optional(),
								pipeline_ids: z.array(z.number().int()).optional(),
							})
							.optional(),
					})
					.catchall(z.json())
					.optional(),
				important_fields: z
					.object({
						enabled: z.boolean().optional(),
						stage_ids: z.array(z.number().int()).optional(),
					})
					.catchall(z.json())
					.optional(),
				required_fields: z
					.object({
						enabled: z.boolean().optional(),
						stage_ids: z.array(z.number().int()).optional(),
						statuses: z
							.object({})
							.catchall(z.array(z.union([z.literal('won'), z.literal('lost')])))
							.optional(),
					})
					.catchall(z.json())
					.optional(),
				description: z.string().nullable().optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						description: z.string().optional(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								projects_detail_visible_flag: z.boolean().optional(),
								show_in_pipelines: z
									.object({
										show_in_all: z.boolean().optional(),
										pipeline_ids: z.array(z.number().int()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
								statuses: z
									.object({})
									.catchall(
										z.array(z.union([z.literal('won'), z.literal('lost')])),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.getDealField': {
		version: 'v2',
		method: 'GET',
		path: '/dealFields/{field_code}',
		group: 'dealFields',
		operationId: 'getDealField',
		summary: 'Get one deal field',
		tokenCost: 1,
		oauthScopes: ['deals:read', 'deals:full', 'admin', 'deal-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			query: z
				.strictObject({
					include_fields: z
						.array(
							z.union([
								z.literal('ui_visibility'),
								z.literal('important_fields'),
								z.literal('required_fields'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						description: z.string().optional(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								projects_detail_visible_flag: z.boolean().optional(),
								show_in_pipelines: z
									.object({
										show_in_all: z.boolean().optional(),
										pipeline_ids: z.array(z.number().int()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
								statuses: z
									.object({})
									.catchall(
										z.array(z.union([z.literal('won'), z.literal('lost')])),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.updateDealField': {
		version: 'v2',
		method: 'PATCH',
		path: '/dealFields/{field_code}',
		group: 'dealFields',
		operationId: 'updateDealField',
		summary: 'Update one deal field',
		tokenCost: 5,
		oauthScopes: ['deals:full', 'admin', 'deal-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z
				.strictObject({
					field_name: z.string().min(1).max(255).optional(),
					ui_visibility: z
						.object({
							add_visible_flag: z.boolean().optional(),
							details_visible_flag: z.boolean().optional(),
							projects_detail_visible_flag: z.boolean().optional(),
							show_in_pipelines: z
								.strictObject({
									show_in_all: z.boolean().optional(),
									pipeline_ids: z.array(z.number().int()).optional(),
								})
								.optional(),
						})
						.catchall(z.json())
						.optional(),
					important_fields: z
						.object({
							enabled: z.boolean().optional(),
							stage_ids: z.array(z.number().int()).optional(),
						})
						.catchall(z.json())
						.optional(),
					required_fields: z
						.object({
							enabled: z.boolean().optional(),
							stage_ids: z.array(z.number().int()).optional(),
							statuses: z
								.object({})
								.catchall(
									z.array(z.union([z.literal('won'), z.literal('lost')])),
								)
								.optional(),
						})
						.catchall(z.json())
						.optional(),
					description: z.string().nullable().optional(),
				})
				.refine((value) => Object.keys(value).length >= 1),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						description: z.string().optional(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								projects_detail_visible_flag: z.boolean().optional(),
								show_in_pipelines: z
									.object({
										show_in_all: z.boolean().optional(),
										pipeline_ids: z.array(z.number().int()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
								statuses: z
									.object({})
									.catchall(
										z.array(z.union([z.literal('won'), z.literal('lost')])),
									)
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.deleteDealField': {
		version: 'v2',
		method: 'DELETE',
		path: '/dealFields/{field_code}',
		group: 'dealFields',
		operationId: 'deleteDealField',
		summary: 'Delete one deal field',
		tokenCost: 3,
		oauthScopes: ['admin', 'deal-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ field_code: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						description: z.string().optional(),
						field_type: z.string(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						subfields: z
							.array(z.object({}).passthrough())
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.addDealFieldOptions': {
		version: 'v2',
		method: 'POST',
		path: '/dealFields/{field_code}/options',
		group: 'dealFields',
		operationId: 'addDealFieldOptions',
		summary: 'Add deal field options in bulk',
		tokenCost: 5,
		oauthScopes: ['deals:full', 'admin', 'deal-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ label: z.string().min(1).max(255) })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.deleteDealFieldOptions': {
		version: 'v2',
		method: 'DELETE',
		path: '/dealFields/{field_code}/options',
		group: 'dealFields',
		operationId: 'deleteDealFieldOptions',
		summary: 'Delete deal field options in bulk',
		tokenCost: 3,
		oauthScopes: ['deals:full', 'admin', 'deal-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ id: z.number().int() })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.dealFields.updateDealFieldOptions': {
		version: 'v2',
		method: 'PATCH',
		path: '/dealFields/{field_code}/options',
		group: 'dealFields',
		operationId: 'updateDealFieldOptions',
		summary: 'Update deal field options in bulk',
		tokenCost: 5,
		oauthScopes: ['deals:full', 'admin', 'deal-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(
				z.strictObject({
					id: z.number().int(),
					label: z.string().min(1).max(255),
				}),
			),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.deals.getDealConversionStatus': {
		version: 'v2',
		method: 'GET',
		path: '/deals/{id}/convert/status/{conversion_id}',
		group: 'deals',
		operationId: 'getDealConversionStatus',
		summary: 'Get Deal conversion status',
		tokenCost: 1,
		oauthScopes: ['deals:full', 'deals:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'conversion_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int(), conversion_id: z.string() }),
		}),
		output: z
			.object({
				success: z.boolean(),
				data: z
					.object({
						lead_id: z.string().optional(),
						deal_id: z.number().int().optional(),
						conversion_id: z.string(),
						status: z.union([
							z.literal('not_started'),
							z.literal('running'),
							z.literal('completed'),
							z.literal('failed'),
							z.literal('rejected'),
						]),
					})
					.passthrough(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.persons.getPersonFollowers': {
		version: 'v2',
		method: 'GET',
		path: '/persons/{id}/followers',
		group: 'persons',
		operationId: 'getPersonFollowers',
		summary: 'List followers of a person',
		tokenCost: 10,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.persons.addPersonFollower': {
		version: 'v2',
		method: 'POST',
		path: '/persons/{id}/followers',
		group: 'persons',
		operationId: 'addPersonFollower',
		summary: 'Add a follower to a person',
		tokenCost: 5,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						add_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.persons.getPersonFollowersChangelog': {
		version: 'v2',
		method: 'GET',
		path: '/persons/{id}/followers/changelog',
		group: 'persons',
		operationId: 'getPersonFollowersChangelog',
		summary: 'List followers changelog of a person',
		tokenCost: 10,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								action: z.string().optional(),
								actor_user_id: z.number().int().optional(),
								follower_user_id: z.number().int().optional(),
								time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.persons.deletePersonFollower': {
		version: 'v2',
		method: 'DELETE',
		path: '/persons/{id}/followers/{follower_id}',
		group: 'persons',
		operationId: 'deletePersonFollower',
		summary: 'Delete a follower from a person',
		tokenCost: 3,
		oauthScopes: ['contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'follower_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				follower_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ user_id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.persons.getPersonPicture': {
		version: 'v2',
		method: 'GET',
		path: '/persons/{id}/picture',
		group: 'persons',
		operationId: 'getPersonPicture',
		summary: 'Get picture of a person',
		tokenCost: 1,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						item_type: z.string().optional(),
						item_id: z.number().int().optional(),
						added_by_user_id: z.number().int().optional(),
						active_flag: z.boolean().optional(),
						file_size: z.number().int().optional(),
						pictures: z
							.object({
								'128': z.string().optional(),
								'512': z.string().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.getPersonFields': {
		version: 'v2',
		method: 'GET',
		path: '/personFields',
		group: 'personFields',
		operationId: 'getPersonFields',
		summary: 'Get all person fields',
		tokenCost: 10,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'admin',
			'contact-fields:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					include_fields: z
						.array(
							z.union([
								z.literal('ui_visibility'),
								z.literal('important_fields'),
								z.literal('required_fields'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_name: z.string(),
								field_code: z.string(),
								field_type: z.union([
									z.literal('int'),
									z.literal('double'),
									z.literal('boolean'),
									z.literal('varchar'),
									z.literal('text'),
									z.literal('phone'),
									z.literal('varchar_options'),
									z.literal('varchar_auto'),
									z.literal('date'),
									z.literal('daterange'),
									z.literal('time'),
									z.literal('timerange'),
									z.literal('enum'),
									z.literal('set'),
									z.literal('address'),
									z.literal('monetary'),
									z.literal('deal'),
									z.literal('deals'),
									z.literal('lead'),
									z.literal('org'),
									z.literal('people'),
									z.literal('project'),
									z.literal('stage'),
									z.literal('user'),
									z.literal('activity'),
									z.literal('json'),
									z.literal('picture'),
									z.literal('status'),
									z.literal('visible_to'),
									z.literal('price_list'),
									z.literal('billing_frequency'),
									z.literal('projects_board'),
									z.literal('projects_phase'),
								]),
								options: z
									.array(
										z
											.object({
												id: z.union([z.number().int(), z.string()]).optional(),
												label: z.string().optional(),
												color: z.string().nullable().optional(),
												update_time: z.string().nullable().optional(),
												add_time: z.string().nullable().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								subfields: z
									.array(
										z
											.object({
												field_code: z.string().optional(),
												field_name: z.string().optional(),
												field_type: z.string().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								is_custom_field: z.boolean(),
								is_optional_response_field: z.boolean(),
								ui_visibility: z
									.object({
										add_visible_flag: z.boolean().optional(),
										details_visible_flag: z.boolean().optional(),
										show_in_add_deal_dialog: z
											.object({
												show: z.boolean().optional(),
												order: z.number().int().nullable().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								important_fields: z
									.object({
										enabled: z.boolean().optional(),
										stage_ids: z.array(z.number().int()).optional(),
									})
									.passthrough()
									.optional(),
								required_fields: z
									.object({ enabled: z.boolean().optional() })
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.addPersonField': {
		version: 'v2',
		method: 'POST',
		path: '/personFields',
		group: 'personFields',
		operationId: 'addPersonField',
		summary: 'Create one person field',
		tokenCost: 5,
		oauthScopes: ['admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				field_name: z.string().min(1).max(255),
				field_type: z.union([
					z.literal('varchar'),
					z.literal('text'),
					z.literal('double'),
					z.literal('phone'),
					z.literal('date'),
					z.literal('daterange'),
					z.literal('time'),
					z.literal('timerange'),
					z.literal('set'),
					z.literal('enum'),
					z.literal('varchar_auto'),
					z.literal('address'),
					z.literal('monetary'),
					z.literal('org'),
					z.literal('people'),
					z.literal('user'),
				]),
				options: z.array(z.strictObject({ label: z.string() })).optional(),
				ui_visibility: z
					.object({
						add_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						show_in_add_deal_dialog: z
							.strictObject({
								show: z.boolean().optional(),
								order: z.number().int().nullable().optional(),
							})
							.optional(),
					})
					.catchall(z.json())
					.optional(),
				important_fields: z
					.object({
						enabled: z.boolean().optional(),
						stage_ids: z.array(z.number().int()).optional(),
					})
					.catchall(z.json())
					.optional(),
				required_fields: z
					.object({ enabled: z.boolean().optional() })
					.catchall(z.json())
					.optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								show_in_add_deal_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.getPersonField': {
		version: 'v2',
		method: 'GET',
		path: '/personFields/{field_code}',
		group: 'personFields',
		operationId: 'getPersonField',
		summary: 'Get one person field',
		tokenCost: 1,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'admin',
			'contact-fields:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			query: z
				.strictObject({
					include_fields: z
						.array(
							z.union([
								z.literal('ui_visibility'),
								z.literal('important_fields'),
								z.literal('required_fields'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								show_in_add_deal_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.updatePersonField': {
		version: 'v2',
		method: 'PATCH',
		path: '/personFields/{field_code}',
		group: 'personFields',
		operationId: 'updatePersonField',
		summary: 'Update one person field',
		tokenCost: 5,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z
				.strictObject({
					field_name: z.string().min(1).max(255).optional(),
					ui_visibility: z
						.object({
							add_visible_flag: z.boolean().optional(),
							details_visible_flag: z.boolean().optional(),
							show_in_add_deal_dialog: z
								.strictObject({
									show: z.boolean().optional(),
									order: z.number().int().nullable().optional(),
								})
								.optional(),
						})
						.catchall(z.json())
						.optional(),
					important_fields: z
						.object({
							enabled: z.boolean().optional(),
							stage_ids: z.array(z.number().int()).optional(),
						})
						.catchall(z.json())
						.optional(),
					required_fields: z
						.object({ enabled: z.boolean().optional() })
						.catchall(z.json())
						.optional(),
				})
				.refine((value) => Object.keys(value).length >= 1),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								show_in_add_deal_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.deletePersonField': {
		version: 'v2',
		method: 'DELETE',
		path: '/personFields/{field_code}',
		group: 'personFields',
		operationId: 'deletePersonField',
		summary: 'Delete one person field',
		tokenCost: 3,
		oauthScopes: ['admin', 'contact-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ field_code: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.string(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						subfields: z
							.array(z.object({}).passthrough())
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.addPersonFieldOptions': {
		version: 'v2',
		method: 'POST',
		path: '/personFields/{field_code}/options',
		group: 'personFields',
		operationId: 'addPersonFieldOptions',
		summary: 'Add person field options in bulk',
		tokenCost: 5,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ label: z.string().min(1).max(255) })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.deletePersonFieldOptions': {
		version: 'v2',
		method: 'DELETE',
		path: '/personFields/{field_code}/options',
		group: 'personFields',
		operationId: 'deletePersonFieldOptions',
		summary: 'Delete person field options in bulk',
		tokenCost: 3,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ id: z.number().int() })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.personFields.updatePersonFieldOptions': {
		version: 'v2',
		method: 'PATCH',
		path: '/personFields/{field_code}/options',
		group: 'personFields',
		operationId: 'updatePersonFieldOptions',
		summary: 'Update person field options in bulk',
		tokenCost: 5,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(
				z.strictObject({
					id: z.number().int(),
					label: z.string().min(1).max(255),
				}),
			),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.organizations.getOrganizationFollowers': {
		version: 'v2',
		method: 'GET',
		path: '/organizations/{id}/followers',
		group: 'organizations',
		operationId: 'getOrganizationFollowers',
		summary: 'List followers of an organization',
		tokenCost: 10,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizations.addOrganizationFollower': {
		version: 'v2',
		method: 'POST',
		path: '/organizations/{id}/followers',
		group: 'organizations',
		operationId: 'addOrganizationFollower',
		summary: 'Add a follower to an organization',
		tokenCost: 5,
		oauthScopes: ['contacts:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z.strictObject({ user_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						user_id: z.number().int().optional(),
						add_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizations.getOrganizationFollowersChangelog': {
		version: 'v2',
		method: 'GET',
		path: '/organizations/{id}/followers/changelog',
		group: 'organizations',
		operationId: 'getOrganizationFollowersChangelog',
		summary: 'List followers changelog of an organization',
		tokenCost: 10,
		oauthScopes: ['contacts:read', 'contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								action: z.string().optional(),
								actor_user_id: z.number().int().optional(),
								follower_user_id: z.number().int().optional(),
								time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizations.deleteOrganizationFollower': {
		version: 'v2',
		method: 'DELETE',
		path: '/organizations/{id}/followers/{follower_id}',
		group: 'organizations',
		operationId: 'deleteOrganizationFollower',
		summary: 'Delete a follower from an organization',
		tokenCost: 3,
		oauthScopes: ['contacts:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'follower_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({
				id: z.number().int(),
				follower_id: z.number().int(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ user_id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.getOrganizationFields': {
		version: 'v2',
		method: 'GET',
		path: '/organizationFields',
		group: 'organizationFields',
		operationId: 'getOrganizationFields',
		summary: 'Get all organization fields',
		tokenCost: 10,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'admin',
			'contact-fields:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					include_fields: z
						.array(
							z.union([
								z.literal('ui_visibility'),
								z.literal('important_fields'),
								z.literal('required_fields'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_name: z.string(),
								field_code: z.string(),
								field_type: z.union([
									z.literal('int'),
									z.literal('double'),
									z.literal('boolean'),
									z.literal('varchar'),
									z.literal('text'),
									z.literal('phone'),
									z.literal('varchar_options'),
									z.literal('varchar_auto'),
									z.literal('date'),
									z.literal('daterange'),
									z.literal('time'),
									z.literal('timerange'),
									z.literal('enum'),
									z.literal('set'),
									z.literal('address'),
									z.literal('monetary'),
									z.literal('deal'),
									z.literal('deals'),
									z.literal('lead'),
									z.literal('org'),
									z.literal('people'),
									z.literal('project'),
									z.literal('stage'),
									z.literal('user'),
									z.literal('activity'),
									z.literal('json'),
									z.literal('picture'),
									z.literal('status'),
									z.literal('visible_to'),
									z.literal('price_list'),
									z.literal('billing_frequency'),
									z.literal('projects_board'),
									z.literal('projects_phase'),
								]),
								options: z
									.array(
										z
											.object({
												id: z.union([z.number().int(), z.string()]).optional(),
												label: z.string().optional(),
												color: z.string().nullable().optional(),
												update_time: z.string().nullable().optional(),
												add_time: z.string().nullable().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								subfields: z
									.array(
										z
											.object({
												field_code: z.string().optional(),
												field_name: z.string().optional(),
												field_type: z.string().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								is_custom_field: z.boolean(),
								is_optional_response_field: z.boolean(),
								ui_visibility: z
									.object({
										add_visible_flag: z.boolean().optional(),
										details_visible_flag: z.boolean().optional(),
										org_detail_visible_flag: z.boolean().optional(),
										person_detail_visible_flag: z.boolean().optional(),
										deal_detail_visible_flag: z.boolean().optional(),
										show_in_add_deal_dialog: z
											.object({
												show: z.boolean().optional(),
												order: z.number().int().nullable().optional(),
											})
											.passthrough()
											.optional(),
										show_in_add_person_dialog: z
											.object({
												show: z.boolean().optional(),
												order: z.number().int().nullable().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								important_fields: z
									.object({
										enabled: z.boolean().optional(),
										stage_ids: z.array(z.number().int()).optional(),
									})
									.passthrough()
									.optional(),
								required_fields: z
									.object({ enabled: z.boolean().optional() })
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.addOrganizationField': {
		version: 'v2',
		method: 'POST',
		path: '/organizationFields',
		group: 'organizationFields',
		operationId: 'addOrganizationField',
		summary: 'Create one organization field',
		tokenCost: 5,
		oauthScopes: ['admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				field_name: z.string().min(1).max(255),
				field_type: z.union([
					z.literal('varchar'),
					z.literal('text'),
					z.literal('double'),
					z.literal('phone'),
					z.literal('date'),
					z.literal('daterange'),
					z.literal('time'),
					z.literal('timerange'),
					z.literal('set'),
					z.literal('enum'),
					z.literal('varchar_auto'),
					z.literal('address'),
					z.literal('monetary'),
					z.literal('org'),
					z.literal('people'),
					z.literal('user'),
				]),
				options: z.array(z.strictObject({ label: z.string() })).optional(),
				ui_visibility: z
					.object({
						add_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
						show_in_add_deal_dialog: z
							.strictObject({
								show: z.boolean().optional(),
								order: z.number().int().nullable().optional(),
							})
							.optional(),
						show_in_add_person_dialog: z
							.strictObject({
								show: z.boolean().optional(),
								order: z.number().int().nullable().optional(),
							})
							.optional(),
					})
					.catchall(z.json())
					.optional(),
				important_fields: z
					.object({
						enabled: z.boolean().optional(),
						stage_ids: z.array(z.number().int()).optional(),
					})
					.catchall(z.json())
					.optional(),
				required_fields: z
					.object({ enabled: z.boolean().optional() })
					.catchall(z.json())
					.optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								org_detail_visible_flag: z.boolean().optional(),
								person_detail_visible_flag: z.boolean().optional(),
								deal_detail_visible_flag: z.boolean().optional(),
								show_in_add_deal_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
								show_in_add_person_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.getOrganizationField': {
		version: 'v2',
		method: 'GET',
		path: '/organizationFields/{field_code}',
		group: 'organizationFields',
		operationId: 'getOrganizationField',
		summary: 'Get one organization field',
		tokenCost: 1,
		oauthScopes: [
			'contacts:read',
			'contacts:full',
			'admin',
			'contact-fields:full',
		],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			query: z
				.strictObject({
					include_fields: z
						.array(
							z.union([
								z.literal('ui_visibility'),
								z.literal('important_fields'),
								z.literal('required_fields'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								org_detail_visible_flag: z.boolean().optional(),
								person_detail_visible_flag: z.boolean().optional(),
								deal_detail_visible_flag: z.boolean().optional(),
								show_in_add_deal_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
								show_in_add_person_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.updateOrganizationField': {
		version: 'v2',
		method: 'PATCH',
		path: '/organizationFields/{field_code}',
		group: 'organizationFields',
		operationId: 'updateOrganizationField',
		summary: 'Update one organization field',
		tokenCost: 5,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z
				.strictObject({
					field_name: z.string().min(1).max(255).optional(),
					ui_visibility: z
						.object({
							add_visible_flag: z.boolean().optional(),
							details_visible_flag: z.boolean().optional(),
							show_in_add_deal_dialog: z
								.strictObject({
									show: z.boolean().optional(),
									order: z.number().int().nullable().optional(),
								})
								.optional(),
							show_in_add_person_dialog: z
								.strictObject({
									show: z.boolean().optional(),
									order: z.number().int().nullable().optional(),
								})
								.optional(),
						})
						.catchall(z.json())
						.optional(),
					important_fields: z
						.object({
							enabled: z.boolean().optional(),
							stage_ids: z.array(z.number().int()).optional(),
						})
						.catchall(z.json())
						.optional(),
					required_fields: z
						.object({ enabled: z.boolean().optional() })
						.catchall(z.json())
						.optional(),
				})
				.refine((value) => Object.keys(value).length >= 1),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
								org_detail_visible_flag: z.boolean().optional(),
								person_detail_visible_flag: z.boolean().optional(),
								deal_detail_visible_flag: z.boolean().optional(),
								show_in_add_deal_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
								show_in_add_person_dialog: z
									.object({
										show: z.boolean().optional(),
										order: z.number().int().nullable().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.deleteOrganizationField': {
		version: 'v2',
		method: 'DELETE',
		path: '/organizationFields/{field_code}',
		group: 'organizationFields',
		operationId: 'deleteOrganizationField',
		summary: 'Delete one organization field',
		tokenCost: 3,
		oauthScopes: ['admin', 'contact-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ field_code: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.string(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						subfields: z
							.array(z.object({}).passthrough())
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.addOrganizationFieldOptions': {
		version: 'v2',
		method: 'POST',
		path: '/organizationFields/{field_code}/options',
		group: 'organizationFields',
		operationId: 'addOrganizationFieldOptions',
		summary: 'Add organization field options in bulk',
		tokenCost: 5,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ label: z.string().min(1).max(255) })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.deleteOrganizationFieldOptions': {
		version: 'v2',
		method: 'DELETE',
		path: '/organizationFields/{field_code}/options',
		group: 'organizationFields',
		operationId: 'deleteOrganizationFieldOptions',
		summary: 'Delete organization field options in bulk',
		tokenCost: 3,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ id: z.number().int() })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.organizationFields.updateOrganizationFieldOptions': {
		version: 'v2',
		method: 'PATCH',
		path: '/organizationFields/{field_code}/options',
		group: 'organizationFields',
		operationId: 'updateOrganizationFieldOptions',
		summary: 'Update organization field options in bulk',
		tokenCost: 5,
		oauthScopes: ['contacts:full', 'admin', 'contact-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(
				z.strictObject({
					id: z.number().int(),
					label: z.string().min(1).max(255),
				}),
			),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.getProductFields': {
		version: 'v2',
		method: 'GET',
		path: '/productFields',
		group: 'productFields',
		operationId: 'getProductFields',
		summary: 'Get all product fields',
		tokenCost: 10,
		oauthScopes: ['products:read', 'products:full', 'product-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					include_fields: z
						.array(z.literal('ui_visibility'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_name: z.string(),
								field_code: z.string(),
								field_type: z.union([
									z.literal('int'),
									z.literal('double'),
									z.literal('boolean'),
									z.literal('varchar'),
									z.literal('text'),
									z.literal('phone'),
									z.literal('varchar_options'),
									z.literal('varchar_auto'),
									z.literal('date'),
									z.literal('daterange'),
									z.literal('time'),
									z.literal('timerange'),
									z.literal('enum'),
									z.literal('set'),
									z.literal('address'),
									z.literal('monetary'),
									z.literal('deal'),
									z.literal('deals'),
									z.literal('lead'),
									z.literal('org'),
									z.literal('people'),
									z.literal('project'),
									z.literal('stage'),
									z.literal('user'),
									z.literal('activity'),
									z.literal('json'),
									z.literal('picture'),
									z.literal('status'),
									z.literal('visible_to'),
									z.literal('price_list'),
									z.literal('billing_frequency'),
									z.literal('projects_board'),
									z.literal('projects_phase'),
								]),
								options: z
									.array(
										z
											.object({
												id: z.union([z.number().int(), z.string()]).optional(),
												label: z.string().optional(),
												color: z.string().nullable().optional(),
												update_time: z.string().nullable().optional(),
												add_time: z.string().nullable().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								subfields: z
									.array(
										z
											.object({
												field_code: z.string().optional(),
												field_name: z.string().optional(),
												field_type: z.string().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								is_custom_field: z.boolean(),
								is_optional_response_field: z.boolean(),
								ui_visibility: z
									.object({
										add_visible_flag: z.boolean().optional(),
										details_visible_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.addProductField': {
		version: 'v2',
		method: 'POST',
		path: '/productFields',
		group: 'productFields',
		operationId: 'addProductField',
		summary: 'Create one product field',
		tokenCost: 5,
		oauthScopes: ['products:full', 'product-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				field_name: z.string().min(1).max(255),
				field_type: z.union([
					z.literal('varchar'),
					z.literal('text'),
					z.literal('double'),
					z.literal('phone'),
					z.literal('date'),
					z.literal('daterange'),
					z.literal('time'),
					z.literal('timerange'),
					z.literal('set'),
					z.literal('enum'),
					z.literal('varchar_auto'),
					z.literal('address'),
					z.literal('monetary'),
					z.literal('org'),
					z.literal('people'),
					z.literal('user'),
				]),
				options: z.array(z.strictObject({ label: z.string() })).optional(),
				ui_visibility: z
					.object({
						add_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
					})
					.catchall(z.json())
					.optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.getProductField': {
		version: 'v2',
		method: 'GET',
		path: '/productFields/{field_code}',
		group: 'productFields',
		operationId: 'getProductField',
		summary: 'Get one product field',
		tokenCost: 1,
		oauthScopes: ['products:read', 'products:full', 'product-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			query: z
				.strictObject({
					include_fields: z
						.array(z.literal('ui_visibility'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.updateProductField': {
		version: 'v2',
		method: 'PATCH',
		path: '/productFields/{field_code}',
		group: 'productFields',
		operationId: 'updateProductField',
		summary: 'Update one product field',
		tokenCost: 5,
		oauthScopes: ['products:full', 'product-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z
				.strictObject({
					field_name: z.string().min(1).max(255).optional(),
					ui_visibility: z
						.object({
							add_visible_flag: z.boolean().optional(),
							details_visible_flag: z.boolean().optional(),
						})
						.catchall(z.json())
						.optional(),
				})
				.refine((value) => Object.keys(value).length >= 1),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.deleteProductField': {
		version: 'v2',
		method: 'DELETE',
		path: '/productFields/{field_code}',
		group: 'productFields',
		operationId: 'deleteProductField',
		summary: 'Delete one product field',
		tokenCost: 3,
		oauthScopes: ['products:full', 'product-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ field_code: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.string(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						subfields: z
							.array(z.object({}).passthrough())
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.addProductFieldOptions': {
		version: 'v2',
		method: 'POST',
		path: '/productFields/{field_code}/options',
		group: 'productFields',
		operationId: 'addProductFieldOptions',
		summary: 'Add product field options in bulk',
		tokenCost: 5,
		oauthScopes: ['products:full', 'product-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ label: z.string().min(1).max(255) })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.deleteProductFieldOptions': {
		version: 'v2',
		method: 'DELETE',
		path: '/productFields/{field_code}/options',
		group: 'productFields',
		operationId: 'deleteProductFieldOptions',
		summary: 'Delete product field options in bulk',
		tokenCost: 3,
		oauthScopes: ['products:full', 'product-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ id: z.number().int() })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.productFields.updateProductFieldOptions': {
		version: 'v2',
		method: 'PATCH',
		path: '/productFields/{field_code}/options',
		group: 'productFields',
		operationId: 'updateProductFieldOptions',
		summary: 'Update product field options in bulk',
		tokenCost: 5,
		oauthScopes: ['products:full', 'product-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(
				z.strictObject({
					id: z.number().int(),
					label: z.string().min(1).max(255),
				}),
			),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.leads.searchLeads': {
		version: 'v2',
		method: 'GET',
		path: '/leads/search',
		group: 'leads',
		operationId: 'searchLeads',
		summary: 'Search leads',
		tokenCost: 20,
		oauthScopes: ['leads:read', 'leads:full', 'search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'fields', style: 'form', explode: false, type: 'array' },
			{ name: 'exact_match', style: 'form', explode: true, type: 'boolean' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{
				name: 'organization_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string().max(100),
					fields: z
						.array(
							z.union([
								z.literal('custom_fields'),
								z.literal('notes'),
								z.literal('title'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					exact_match: z.boolean().optional(),
					person_id: z.number().int().optional(),
					organization_id: z.number().int().optional(),
					include_fields: z
						.array(z.literal('lead.was_seen'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(100).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z
											.object({
												id: z.string().optional(),
												type: z.string().optional(),
												title: z.string().optional(),
												owner: z
													.object({ id: z.number().int().optional() })
													.passthrough()
													.optional(),
												person: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.nullable()
													.optional(),
												organization: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.optional(),
												phones: z.array(z.string()).optional(),
												emails: z.array(z.string()).optional(),
												custom_fields: z.array(z.string()).optional(),
												notes: z.array(z.string()).optional(),
												value: z.number().int().optional(),
												currency: z.string().optional(),
												visible_to: z.number().int().optional(),
												is_archived: z.boolean().optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.leads.convertLeadToDeal': {
		version: 'v2',
		method: 'POST',
		path: '/leads/{id}/convert/deal',
		group: 'leads',
		operationId: 'convertLeadToDeal',
		summary: 'Convert a lead to a deal',
		tokenCost: 40,
		oauthScopes: ['leads:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string() }),
			body: z
				.strictObject({
					stage_id: z.number().int().optional(),
					pipeline_id: z.number().int().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.object({ conversion_id: z.string() }).passthrough().optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.leads.getLeadConversionStatus': {
		version: 'v2',
		method: 'GET',
		path: '/leads/{id}/convert/status/{conversion_id}',
		group: 'leads',
		operationId: 'getLeadConversionStatus',
		summary: 'Get Lead conversion status',
		tokenCost: 1,
		oauthScopes: ['leads:full', 'leads:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id', 'conversion_id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.string(), conversion_id: z.string() }),
		}),
		output: z
			.object({
				success: z.boolean(),
				data: z
					.object({
						lead_id: z.string().optional(),
						deal_id: z.number().int().optional(),
						conversion_id: z.string(),
						status: z.union([
							z.literal('not_started'),
							z.literal('running'),
							z.literal('completed'),
							z.literal('failed'),
							z.literal('rejected'),
						]),
					})
					.passthrough(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.organizations.searchOrganization': {
		version: 'v2',
		method: 'GET',
		path: '/organizations/search',
		group: 'organizations',
		operationId: 'searchOrganization',
		summary: 'Search organizations',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full', 'search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'fields', style: 'form', explode: false, type: 'array' },
			{ name: 'exact_match', style: 'form', explode: true, type: 'boolean' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string().max(100),
					fields: z
						.array(
							z.union([
								z.literal('address'),
								z.literal('custom_fields'),
								z.literal('notes'),
								z.literal('name'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					exact_match: z.boolean().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z
											.object({
												id: z.number().int().optional(),
												type: z.string().optional(),
												name: z.string().optional(),
												address: z.string().nullable().optional(),
												visible_to: z.number().int().optional(),
												owner: z
													.object({ id: z.number().int().optional() })
													.passthrough()
													.optional(),
												custom_fields: z.array(z.string()).optional(),
												notes: z.array(z.string()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.persons.searchPersons': {
		version: 'v2',
		method: 'GET',
		path: '/persons/search',
		group: 'persons',
		operationId: 'searchPersons',
		summary: 'Search persons',
		tokenCost: 20,
		oauthScopes: ['contacts:read', 'contacts:full', 'search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'fields', style: 'form', explode: false, type: 'array' },
			{ name: 'exact_match', style: 'form', explode: true, type: 'boolean' },
			{
				name: 'organization_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string().max(100),
					fields: z
						.array(
							z.union([
								z.literal('custom_fields'),
								z.literal('email'),
								z.literal('notes'),
								z.literal('phone'),
								z.literal('name'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					exact_match: z.boolean().optional(),
					organization_id: z.number().int().optional(),
					include_fields: z
						.array(z.literal('person.picture'))
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(100).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z
											.object({
												id: z.number().int().optional(),
												type: z.string().optional(),
												name: z.string().optional(),
												phones: z.array(z.string()).optional(),
												emails: z.array(z.string()).optional(),
												visible_to: z.number().int().optional(),
												owner: z
													.object({ id: z.number().int().optional() })
													.passthrough()
													.optional(),
												organization: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.optional(),
												custom_fields: z.array(z.string()).optional(),
												notes: z.array(z.string()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.itemSearch.searchItem': {
		version: 'v2',
		method: 'GET',
		path: '/itemSearch',
		group: 'itemSearch',
		operationId: 'searchItem',
		summary: 'Perform a search from multiple item types',
		tokenCost: 20,
		oauthScopes: ['search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'item_types', style: 'form', explode: false, type: 'array' },
			{ name: 'fields', style: 'form', explode: false, type: 'array' },
			{
				name: 'search_for_related_items',
				style: 'form',
				explode: true,
				type: 'boolean',
			},
			{ name: 'exact_match', style: 'form', explode: true, type: 'boolean' },
			{ name: 'include_fields', style: 'form', explode: false, type: 'array' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string().max(100),
					item_types: z
						.array(
							z.union([
								z.literal('deal'),
								z.literal('person'),
								z.literal('organization'),
								z.literal('product'),
								z.literal('lead'),
								z.literal('file'),
								z.literal('mail_attachment'),
								z.literal('project'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					fields: z
						.array(
							z.union([
								z.literal('address'),
								z.literal('code'),
								z.literal('custom_fields'),
								z.literal('email'),
								z.literal('name'),
								z.literal('notes'),
								z.literal('phone'),
								z.literal('title'),
								z.literal('description'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					search_for_related_items: z.boolean().optional(),
					exact_match: z.boolean().optional(),
					include_fields: z
						.array(
							z.union([
								z.literal('deal.cc_email'),
								z.literal('person.picture'),
								z.literal('product.price'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					limit: z.number().int().min(1).max(100).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z.object({}).passthrough().optional(),
									})
									.passthrough(),
							)
							.optional(),
						related_items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z.object({}).passthrough().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.itemSearch.searchItemByField': {
		version: 'v2',
		method: 'GET',
		path: '/itemSearch/field',
		group: 'itemSearch',
		operationId: 'searchItemByField',
		summary: 'Perform a search using a specific field from an item type',
		tokenCost: 20,
		oauthScopes: ['search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'entity_type', style: 'form', explode: true, type: 'string' },
			{ name: 'match', style: 'form', explode: true, type: 'string' },
			{ name: 'field', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string().max(100),
					entity_type: z.union([
						z.literal('deal'),
						z.literal('lead'),
						z.literal('person'),
						z.literal('organization'),
						z.literal('product'),
						z.literal('project'),
					]),
					match: z
						.union([
							z.literal('exact'),
							z.literal('beginning'),
							z.literal('middle'),
						])
						.optional(),
					field: z.string(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								result_score: z.number().optional(),
								item: z.object({}).passthrough().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.stages.getStages': {
		version: 'v2',
		method: 'GET',
		path: '/stages',
		group: 'stages',
		operationId: 'getStages',
		summary: 'Get all stages',
		tokenCost: 5,
		oauthScopes: ['deals:read', 'deals:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'pipeline_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'sort_by', style: 'form', explode: true, type: 'string' },
			{ name: 'sort_direction', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					pipeline_id: z.number().int().optional(),
					sort_by: z
						.union([
							z.literal('id'),
							z.literal('update_time'),
							z.literal('add_time'),
							z.literal('order_nr'),
						])
						.optional(),
					sort_direction: z
						.union([z.literal('asc'), z.literal('desc')])
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								order_nr: z.number().int().optional(),
								name: z.string().optional(),
								is_deleted: z.boolean().optional(),
								deal_probability: z.number().int().optional(),
								pipeline_id: z.number().int().optional(),
								is_deal_rot_enabled: z.boolean().optional(),
								days_to_rotten: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.stages.addStage': {
		version: 'v2',
		method: 'POST',
		path: '/stages',
		group: 'stages',
		operationId: 'addStage',
		summary: 'Add a new stage',
		tokenCost: 5,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					pipeline_id: z.number().int(),
					deal_probability: z.number().int().optional(),
					is_deal_rot_enabled: z.boolean().optional(),
					days_to_rotten: z.number().int().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						order_nr: z.number().int().optional(),
						name: z.string().optional(),
						is_deleted: z.boolean().optional(),
						deal_probability: z.number().int().optional(),
						pipeline_id: z.number().int().optional(),
						is_deal_rot_enabled: z.boolean().optional(),
						days_to_rotten: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.stages.deleteStage': {
		version: 'v2',
		method: 'DELETE',
		path: '/stages/{id}',
		group: 'stages',
		operationId: 'deleteStage',
		summary: 'Delete a stage',
		tokenCost: 3,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.stages.getStage': {
		version: 'v2',
		method: 'GET',
		path: '/stages/{id}',
		group: 'stages',
		operationId: 'getStage',
		summary: 'Get one stage',
		tokenCost: 1,
		oauthScopes: ['deals:read', 'deals:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						order_nr: z.number().int().optional(),
						name: z.string().optional(),
						is_deleted: z.boolean().optional(),
						deal_probability: z.number().int().optional(),
						pipeline_id: z.number().int().optional(),
						is_deal_rot_enabled: z.boolean().optional(),
						days_to_rotten: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.stages.updateStage': {
		version: 'v2',
		method: 'PATCH',
		path: '/stages/{id}',
		group: 'stages',
		operationId: 'updateStage',
		summary: 'Update stage details',
		tokenCost: 5,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					pipeline_id: z.number().int().optional(),
					deal_probability: z.number().int().optional(),
					is_deal_rot_enabled: z.boolean().optional(),
					days_to_rotten: z.number().int().nullable().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						order_nr: z.number().int().optional(),
						name: z.string().optional(),
						is_deleted: z.boolean().optional(),
						deal_probability: z.number().int().optional(),
						pipeline_id: z.number().int().optional(),
						is_deal_rot_enabled: z.boolean().optional(),
						days_to_rotten: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().nullable().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.pipelines.getPipelines': {
		version: 'v2',
		method: 'GET',
		path: '/pipelines',
		group: 'pipelines',
		operationId: 'getPipelines',
		summary: 'Get all pipelines',
		tokenCost: 5,
		oauthScopes: ['deals:read', 'deals:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'sort_by', style: 'form', explode: true, type: 'string' },
			{ name: 'sort_direction', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					sort_by: z
						.union([
							z.literal('id'),
							z.literal('update_time'),
							z.literal('add_time'),
						])
						.optional(),
					sort_direction: z
						.union([z.literal('asc'), z.literal('desc')])
						.optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								order_nr: z.number().int().optional(),
								is_deleted: z.boolean().optional(),
								is_deal_probability_enabled: z.boolean().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.pipelines.addPipeline': {
		version: 'v2',
		method: 'POST',
		path: '/pipelines',
		group: 'pipelines',
		operationId: 'addPipeline',
		summary: 'Add a new pipeline',
		tokenCost: 5,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z
				.strictObject({
					name: z.string(),
					is_deal_probability_enabled: z.boolean().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						is_deleted: z.boolean().optional(),
						is_deal_probability_enabled: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.pipelines.deletePipeline': {
		version: 'v2',
		method: 'DELETE',
		path: '/pipelines/{id}',
		group: 'pipelines',
		operationId: 'deletePipeline',
		summary: 'Delete a pipeline',
		tokenCost: 3,
		oauthScopes: ['admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.pipelines.getPipeline': {
		version: 'v2',
		method: 'GET',
		path: '/pipelines/{id}',
		group: 'pipelines',
		operationId: 'getPipeline',
		summary: 'Get one pipeline',
		tokenCost: 1,
		oauthScopes: ['deals:read', 'deals:full', 'admin'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						is_deleted: z.boolean().optional(),
						is_deal_probability_enabled: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.pipelines.updatePipeline': {
		version: 'v2',
		method: 'PATCH',
		path: '/pipelines/{id}',
		group: 'pipelines',
		operationId: 'updatePipeline',
		summary: 'Update a pipeline',
		tokenCost: 5,
		oauthScopes: ['admin'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					is_deal_probability_enabled: z.boolean().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						is_deleted: z.boolean().optional(),
						is_deal_probability_enabled: z.boolean().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.getProjectFields': {
		version: 'v2',
		method: 'GET',
		path: '/projectFields',
		group: 'projectFields',
		operationId: 'getProjectFields',
		summary: 'Get all project fields',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full', 'project-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								field_name: z.string(),
								field_code: z.string(),
								field_type: z.union([
									z.literal('int'),
									z.literal('double'),
									z.literal('boolean'),
									z.literal('varchar'),
									z.literal('text'),
									z.literal('phone'),
									z.literal('varchar_options'),
									z.literal('varchar_auto'),
									z.literal('date'),
									z.literal('daterange'),
									z.literal('time'),
									z.literal('timerange'),
									z.literal('enum'),
									z.literal('set'),
									z.literal('address'),
									z.literal('monetary'),
									z.literal('deal'),
									z.literal('deals'),
									z.literal('lead'),
									z.literal('org'),
									z.literal('people'),
									z.literal('project'),
									z.literal('stage'),
									z.literal('user'),
									z.literal('activity'),
									z.literal('json'),
									z.literal('picture'),
									z.literal('status'),
									z.literal('visible_to'),
									z.literal('price_list'),
									z.literal('billing_frequency'),
									z.literal('projects_board'),
									z.literal('projects_phase'),
									z.literal('orgs'),
								]),
								options: z
									.array(
										z
											.object({
												id: z.union([z.number().int(), z.string()]).optional(),
												label: z.string().optional(),
												color: z.string().nullable().optional(),
												update_time: z.string().nullable().optional(),
												add_time: z.string().nullable().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								subfields: z
									.array(
										z
											.object({
												field_code: z.string().optional(),
												field_name: z.string().optional(),
												field_type: z.string().optional(),
											})
											.passthrough(),
									)
									.nullable()
									.optional(),
								is_custom_field: z.boolean(),
								is_optional_response_field: z.boolean(),
								ui_visibility: z
									.object({
										add_visible_flag: z.boolean().optional(),
										details_visible_flag: z.boolean().optional(),
									})
									.passthrough()
									.optional(),
								important_fields: z
									.object({
										enabled: z.boolean().optional(),
										stage_ids: z.array(z.number().int()).optional(),
									})
									.passthrough()
									.optional(),
								required_fields: z
									.object({ enabled: z.boolean().optional() })
									.passthrough()
									.optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.addProjectField': {
		version: 'v2',
		method: 'POST',
		path: '/projectFields',
		group: 'projectFields',
		operationId: 'addProjectField',
		summary: 'Create one project field',
		tokenCost: 5,
		oauthScopes: ['project-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				field_name: z.string().min(1).max(255),
				field_type: z.union([
					z.literal('varchar'),
					z.literal('text'),
					z.literal('double'),
					z.literal('phone'),
					z.literal('date'),
					z.literal('daterange'),
					z.literal('time'),
					z.literal('timerange'),
					z.literal('set'),
					z.literal('enum'),
					z.literal('varchar_auto'),
					z.literal('address'),
					z.literal('monetary'),
					z.literal('org'),
					z.literal('people'),
					z.literal('user'),
				]),
				options: z.array(z.strictObject({ label: z.string() })).optional(),
				ui_visibility: z
					.object({
						add_visible_flag: z.boolean().optional(),
						details_visible_flag: z.boolean().optional(),
					})
					.catchall(z.json())
					.optional(),
				important_fields: z
					.object({
						enabled: z.boolean().optional(),
						stage_ids: z.array(z.number().int()).optional(),
					})
					.catchall(z.json())
					.optional(),
				required_fields: z
					.object({ enabled: z.boolean().optional() })
					.catchall(z.json())
					.optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
							z.literal('orgs'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.getProjectField': {
		version: 'v2',
		method: 'GET',
		path: '/projectFields/{field_code}',
		group: 'projectFields',
		operationId: 'getProjectField',
		summary: 'Get one project field',
		tokenCost: 1,
		oauthScopes: ['projects:read', 'projects:full', 'project-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ field_code: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
							z.literal('orgs'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.updateProjectField': {
		version: 'v2',
		method: 'PATCH',
		path: '/projectFields/{field_code}',
		group: 'projectFields',
		operationId: 'updateProjectField',
		summary: 'Update one project field',
		tokenCost: 5,
		oauthScopes: ['project-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z
				.strictObject({
					field_name: z.string().min(1).max(255).optional(),
					ui_visibility: z
						.object({
							add_visible_flag: z.boolean().optional(),
							details_visible_flag: z.boolean().optional(),
						})
						.catchall(z.json())
						.optional(),
					important_fields: z
						.object({
							enabled: z.boolean().optional(),
							stage_ids: z.array(z.number().int()).optional(),
						})
						.catchall(z.json())
						.optional(),
					required_fields: z
						.object({ enabled: z.boolean().optional() })
						.catchall(z.json())
						.optional(),
				})
				.refine((value) => Object.keys(value).length >= 1),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.union([
							z.literal('int'),
							z.literal('double'),
							z.literal('boolean'),
							z.literal('varchar'),
							z.literal('text'),
							z.literal('phone'),
							z.literal('varchar_options'),
							z.literal('varchar_auto'),
							z.literal('date'),
							z.literal('daterange'),
							z.literal('time'),
							z.literal('timerange'),
							z.literal('enum'),
							z.literal('set'),
							z.literal('address'),
							z.literal('monetary'),
							z.literal('deal'),
							z.literal('deals'),
							z.literal('lead'),
							z.literal('org'),
							z.literal('people'),
							z.literal('project'),
							z.literal('stage'),
							z.literal('user'),
							z.literal('activity'),
							z.literal('json'),
							z.literal('picture'),
							z.literal('status'),
							z.literal('visible_to'),
							z.literal('price_list'),
							z.literal('billing_frequency'),
							z.literal('projects_board'),
							z.literal('projects_phase'),
							z.literal('orgs'),
						]),
						options: z
							.array(
								z
									.object({
										id: z.union([z.number().int(), z.string()]).optional(),
										label: z.string().optional(),
										color: z.string().nullable().optional(),
										update_time: z.string().nullable().optional(),
										add_time: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						subfields: z
							.array(
								z
									.object({
										field_code: z.string().optional(),
										field_name: z.string().optional(),
										field_type: z.string().optional(),
									})
									.passthrough(),
							)
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
						ui_visibility: z
							.object({
								add_visible_flag: z.boolean().optional(),
								details_visible_flag: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						important_fields: z
							.object({
								enabled: z.boolean().optional(),
								stage_ids: z.array(z.number().int()).optional(),
							})
							.passthrough()
							.optional(),
						required_fields: z
							.object({ enabled: z.boolean().optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.deleteProjectField': {
		version: 'v2',
		method: 'DELETE',
		path: '/projectFields/{field_code}',
		group: 'projectFields',
		operationId: 'deleteProjectField',
		summary: 'Delete one project field',
		tokenCost: 3,
		oauthScopes: ['project-fields:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ field_code: z.string() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						field_name: z.string(),
						field_code: z.string(),
						field_type: z.string(),
						options: z.array(z.object({}).passthrough()).nullable().optional(),
						subfields: z
							.array(z.object({}).passthrough())
							.nullable()
							.optional(),
						is_custom_field: z.boolean(),
						is_optional_response_field: z.boolean(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.addProjectFieldOptions': {
		version: 'v2',
		method: 'POST',
		path: '/projectFields/{field_code}/options',
		group: 'projectFields',
		operationId: 'addProjectFieldOptions',
		summary: 'Add project field options in bulk',
		tokenCost: 5,
		oauthScopes: ['project-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ label: z.string().min(1).max(255) })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.deleteProjectFieldOptions': {
		version: 'v2',
		method: 'DELETE',
		path: '/projectFields/{field_code}/options',
		group: 'projectFields',
		operationId: 'deleteProjectFieldOptions',
		summary: 'Delete project field options in bulk',
		tokenCost: 3,
		oauthScopes: ['project-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(z.strictObject({ id: z.number().int() })),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.projectFields.updateProjectFieldOptions': {
		version: 'v2',
		method: 'PATCH',
		path: '/projectFields/{field_code}/options',
		group: 'projectFields',
		operationId: 'updateProjectFieldOptions',
		summary: 'Update project field options in bulk',
		tokenCost: 5,
		oauthScopes: ['project-fields:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['field_code'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ field_code: z.string() }),
			body: z.array(
				z.strictObject({
					id: z.number().int(),
					label: z.string().min(1).max(255),
				}),
			),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z.object({ id: z.number().int(), label: z.string() }).passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.getProjects': {
		version: 'v2',
		method: 'GET',
		path: '/projects',
		group: 'projects',
		operationId: 'getProjects',
		summary: 'Get all projects',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'status', style: 'form', explode: true, type: 'string' },
			{ name: 'phase_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'deal_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'org_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					filter_id: z.number().int().optional(),
					status: z.string().optional(),
					phase_id: z.number().int().optional(),
					deal_id: z.number().int().optional(),
					person_id: z.number().int().optional(),
					org_id: z.number().int().optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								title: z.string().optional(),
								description: z.string().optional(),
								status: z.string().optional(),
								board_id: z.number().int().optional(),
								phase_id: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								start_date: z.string().optional(),
								end_date: z.string().optional(),
								deal_ids: z.array(z.number().int()).optional(),
								person_ids: z.array(z.number().int()).optional(),
								org_ids: z.array(z.number().int()).optional(),
								label_ids: z.array(z.number().int()).optional(),
								health_status: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								status_change_time: z.string().optional(),
								archive_time: z.string().nullable().optional(),
								custom_fields: z.object({}).catchall(z.json()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.addProject': {
		version: 'v2',
		method: 'POST',
		path: '/projects',
		group: 'projects',
		operationId: 'addProject',
		summary: 'Add a project',
		tokenCost: 5,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				title: z.string(),
				description: z.string().optional(),
				status: z.string().optional(),
				board_id: z.number().int().optional(),
				phase_id: z.number().int().optional(),
				owner_id: z.number().int().optional(),
				start_date: z.string().optional(),
				end_date: z.string().optional(),
				deal_ids: z.array(z.number().int()).optional(),
				person_ids: z.array(z.number().int()).optional(),
				org_ids: z.array(z.number().int()).optional(),
				label_ids: z.array(z.number().int()).optional(),
				health_status: z.number().int().optional(),
				template_id: z.number().int().optional(),
				custom_fields: z.object({}).catchall(z.json()).optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						board_id: z.number().int().optional(),
						phase_id: z.number().int().optional(),
						owner_id: z.number().int().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						person_ids: z.array(z.number().int()).optional(),
						org_ids: z.array(z.number().int()).optional(),
						label_ids: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().nullable().optional(),
						custom_fields: z.object({}).catchall(z.json()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.getArchivedProjects': {
		version: 'v2',
		method: 'GET',
		path: '/projects/archived',
		group: 'projects',
		operationId: 'getArchivedProjects',
		summary: 'Get all archived projects',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'filter_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'status', style: 'form', explode: true, type: 'string' },
			{ name: 'phase_id', style: 'form', explode: true, type: 'integer' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					filter_id: z.number().int().optional(),
					status: z.string().optional(),
					phase_id: z.number().int().optional(),
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								title: z.string().optional(),
								description: z.string().optional(),
								status: z.string().optional(),
								board_id: z.number().int().optional(),
								phase_id: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								start_date: z.string().optional(),
								end_date: z.string().optional(),
								deal_ids: z.array(z.number().int()).optional(),
								person_ids: z.array(z.number().int()).optional(),
								org_ids: z.array(z.number().int()).optional(),
								label_ids: z.array(z.number().int()).optional(),
								health_status: z.number().int().nullable().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
								status_change_time: z.string().optional(),
								archive_time: z.string().nullable().optional(),
								custom_fields: z.object({}).catchall(z.json()).optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.getProject': {
		version: 'v2',
		method: 'GET',
		path: '/projects/{id}',
		group: 'projects',
		operationId: 'getProject',
		summary: 'Get details of a project',
		tokenCost: 1,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						board_id: z.number().int().optional(),
						phase_id: z.number().int().optional(),
						owner_id: z.number().int().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						person_ids: z.array(z.number().int()).optional(),
						org_ids: z.array(z.number().int()).optional(),
						label_ids: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().nullable().optional(),
						custom_fields: z.object({}).catchall(z.json()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.updateProject': {
		version: 'v2',
		method: 'PATCH',
		path: '/projects/{id}',
		group: 'projects',
		operationId: 'updateProject',
		summary: 'Update a project',
		tokenCost: 5,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					title: z.string().optional(),
					description: z.string().optional(),
					status: z.string().optional(),
					board_id: z.number().int().optional(),
					phase_id: z.number().int().optional(),
					owner_id: z.number().int().optional(),
					start_date: z.string().optional(),
					end_date: z.string().optional(),
					deal_ids: z.array(z.number().int()).optional(),
					person_ids: z.array(z.number().int()).optional(),
					org_ids: z.array(z.number().int()).optional(),
					label_ids: z.array(z.number().int()).optional(),
					health_status: z.number().int().optional(),
					template_id: z.number().int().optional(),
					custom_fields: z.object({}).catchall(z.json()).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						board_id: z.number().int().optional(),
						phase_id: z.number().int().optional(),
						owner_id: z.number().int().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						person_ids: z.array(z.number().int()).optional(),
						org_ids: z.array(z.number().int()).optional(),
						label_ids: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().nullable().optional(),
						custom_fields: z.object({}).catchall(z.json()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.deleteProject': {
		version: 'v2',
		method: 'DELETE',
		path: '/projects/{id}',
		group: 'projects',
		operationId: 'deleteProject',
		summary: 'Delete a project',
		tokenCost: 3,
		oauthScopes: ['projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectTemplates.getProjectTemplates': {
		version: 'v2',
		method: 'GET',
		path: '/projectTemplates',
		group: 'projectTemplates',
		operationId: 'getProjectTemplates',
		summary: 'Get all project templates',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(500).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								title: z.string().optional(),
								description: z.string().optional(),
								projects_board_id: z.number().int().optional(),
								owner_id: z.number().int().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectTemplates.getProjectTemplate': {
		version: 'v2',
		method: 'GET',
		path: '/projectTemplates/{id}',
		group: 'projectTemplates',
		operationId: 'getProjectTemplate',
		summary: 'Get details of a template',
		tokenCost: 1,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						projects_board_id: z.number().int().optional(),
						owner_id: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.searchProjects': {
		version: 'v2',
		method: 'GET',
		path: '/projects/search',
		group: 'projects',
		operationId: 'searchProjects',
		summary: 'Search projects',
		tokenCost: 20,
		oauthScopes: ['projects:read', 'projects:full', 'search:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'term', style: 'form', explode: true, type: 'string' },
			{ name: 'fields', style: 'form', explode: false, type: 'array' },
			{ name: 'exact_match', style: 'form', explode: true, type: 'boolean' },
			{ name: 'person_id', style: 'form', explode: true, type: 'integer' },
			{
				name: 'organization_id',
				style: 'form',
				explode: true,
				type: 'integer',
			},
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z
				.strictObject({
					term: z.string().max(100),
					fields: z
						.array(
							z.union([
								z.literal('custom_fields'),
								z.literal('notes'),
								z.literal('title'),
								z.literal('description'),
							]),
						)
						.refine(
							(values) =>
								new Set(values.map((value) => JSON.stringify(value))).size ===
								values.length,
						)
						.optional(),
					exact_match: z.boolean().optional(),
					person_id: z.number().int().optional(),
					organization_id: z.number().int().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						items: z
							.array(
								z
									.object({
										result_score: z.number().optional(),
										item: z
											.object({
												id: z.number().int().optional(),
												type: z.string().optional(),
												title: z.string().optional(),
												status: z.string().nullable().optional(),
												owner: z
													.object({
														id: z.number().int().nullable().optional(),
													})
													.passthrough()
													.optional(),
												board_id: z.number().int().nullable().optional(),
												phase: z
													.object({
														id: z.number().int().optional(),
														name: z.string().optional(),
													})
													.passthrough()
													.nullable()
													.optional(),
												person: z
													.object({
														id: z.number().int().optional(),
														name: z.string().nullable().optional(),
													})
													.passthrough()
													.nullable()
													.optional(),
												organization: z
													.object({
														id: z.number().int().optional(),
														name: z.string().nullable().optional(),
														address: z.string().nullable().optional(),
													})
													.passthrough()
													.nullable()
													.optional(),
												deal: z
													.object({
														id: z.number().int().optional(),
														title: z.string().nullable().optional(),
													})
													.passthrough()
													.nullable()
													.optional(),
												deal_count: z.number().int().optional(),
												description: z.string().nullable().optional(),
												end_date: z.string().nullable().optional(),
												custom_fields: z.array(z.string()).optional(),
												notes: z.array(z.string()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough()
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.archiveProject': {
		version: 'v2',
		method: 'POST',
		path: '/projects/{id}/archive',
		group: 'projects',
		operationId: 'archiveProject',
		summary: 'Archive a project',
		tokenCost: 3,
		oauthScopes: ['projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						status: z.string().optional(),
						board_id: z.number().int().optional(),
						phase_id: z.number().int().optional(),
						owner_id: z.number().int().optional(),
						start_date: z.string().optional(),
						end_date: z.string().optional(),
						deal_ids: z.array(z.number().int()).optional(),
						person_ids: z.array(z.number().int()).optional(),
						org_ids: z.array(z.number().int()).optional(),
						label_ids: z.array(z.number().int()).optional(),
						health_status: z.number().int().nullable().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
						status_change_time: z.string().optional(),
						archive_time: z.string().nullable().optional(),
						custom_fields: z.object({}).catchall(z.json()).optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.getProjectUsers': {
		version: 'v2',
		method: 'GET',
		path: '/projects/{id}/permittedUsers',
		group: 'projects',
		operationId: 'getProjectUsers',
		summary: 'List permitted users',
		tokenCost: 5,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	'apiV2.projects.getProjectChangelog': {
		version: 'v2',
		method: 'GET',
		path: '/projects/{id}/changelog',
		group: 'projects',
		operationId: 'getProjectChangelog',
		summary: 'List updates about project field values',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								change_source: z.string().nullable().optional(),
								change_source_user_agent: z.string().nullable().optional(),
								time: z.string().optional(),
								new_values: z.object({}).catchall(z.json()).optional(),
								old_values: z.object({}).catchall(z.json()).optional(),
								actor_user_id: z.number().int().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectBoards.getProjectsBoards': {
		version: 'v2',
		method: 'GET',
		path: '/boards',
		group: 'projectBoards',
		operationId: 'getProjectsBoards',
		summary: 'Get all project boards',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								order_nr: z.number().int().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.projectBoards.addProjectBoard': {
		version: 'v2',
		method: 'POST',
		path: '/boards',
		group: 'projectBoards',
		operationId: 'addProjectBoard',
		summary: 'Add a project board',
		tokenCost: 5,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				name: z.string(),
				order_nr: z.number().int().min(1).optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectBoards.getProjectsBoard': {
		version: 'v2',
		method: 'GET',
		path: '/boards/{id}',
		group: 'projectBoards',
		operationId: 'getProjectsBoard',
		summary: 'Get details of a project board',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectBoards.updateProjectBoard': {
		version: 'v2',
		method: 'PATCH',
		path: '/boards/{id}',
		group: 'projectBoards',
		operationId: 'updateProjectBoard',
		summary: 'Update a project board',
		tokenCost: 5,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					order_nr: z.number().int().min(1).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectBoards.deleteProjectBoard': {
		version: 'v2',
		method: 'DELETE',
		path: '/boards/{id}',
		group: 'projectBoards',
		operationId: 'deleteProjectBoard',
		summary: 'Delete a project board',
		tokenCost: 3,
		oauthScopes: ['projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectPhases.getProjectsPhases': {
		version: 'v2',
		method: 'GET',
		path: '/phases',
		group: 'projectPhases',
		operationId: 'getProjectsPhases',
		summary: 'Get project phases',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [
			{ name: 'board_id', style: 'form', explode: true, type: 'integer' },
		],
		headerParams: [],
		input: z.strictObject({
			query: z.strictObject({ board_id: z.number().int() }).optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								board_id: z.number().int().optional(),
								order_nr: z.number().int().optional(),
								add_time: z.string().optional(),
								update_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z.object({}).passthrough().nullable().optional(),
			})
			.passthrough(),
	},
	'apiV2.projectPhases.addProjectPhase': {
		version: 'v2',
		method: 'POST',
		path: '/phases',
		group: 'projectPhases',
		operationId: 'addProjectPhase',
		summary: 'Add a project phase',
		tokenCost: 5,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: [],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			body: z.strictObject({
				name: z.string(),
				board_id: z.number().int(),
				order_nr: z.number().int().min(1).optional(),
			}),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						board_id: z.number().int().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectPhases.getProjectsPhase': {
		version: 'v2',
		method: 'GET',
		path: '/phases/{id}',
		group: 'projectPhases',
		operationId: 'getProjectsPhase',
		summary: 'Get details of a project phase',
		tokenCost: 10,
		oauthScopes: ['projects:read', 'projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						board_id: z.number().int().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectPhases.updateProjectPhase': {
		version: 'v2',
		method: 'PATCH',
		path: '/phases/{id}',
		group: 'projectPhases',
		operationId: 'updateProjectPhase',
		summary: 'Update a project phase',
		tokenCost: 5,
		oauthScopes: ['projects:full'],
		requestContentType: 'application/json',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			body: z
				.strictObject({
					name: z.string().optional(),
					board_id: z.number().int().optional(),
					order_nr: z.number().int().min(1).optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						board_id: z.number().int().optional(),
						order_nr: z.number().int().optional(),
						add_time: z.string().optional(),
						update_time: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.projectPhases.deleteProjectPhase': {
		version: 'v2',
		method: 'DELETE',
		path: '/phases/{id}',
		group: 'projectPhases',
		operationId: 'deleteProjectPhase',
		summary: 'Delete a project phase',
		tokenCost: 3,
		oauthScopes: ['projects:full'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [],
		headerParams: [],
		input: z.strictObject({ path: z.strictObject({ id: z.number().int() }) }),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.object({ id: z.number().int().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	'apiV2.users.getUserFollowers': {
		version: 'v2',
		method: 'GET',
		path: '/users/{id}/followers',
		group: 'users',
		operationId: 'getUserFollowers',
		summary: 'List followers of a user',
		tokenCost: 10,
		oauthScopes: ['users:read'],
		requestContentType: '',
		responseContentType: 'application/json',
		isBinary: false,
		pathParams: ['id'],
		queryParams: [
			{ name: 'limit', style: 'form', explode: true, type: 'integer' },
			{ name: 'cursor', style: 'form', explode: true, type: 'string' },
		],
		headerParams: [],
		input: z.strictObject({
			path: z.strictObject({ id: z.number().int() }),
			query: z
				.strictObject({
					limit: z.number().int().min(1).max(500).optional(),
					cursor: z.string().optional(),
				})
				.optional(),
		}),
		output: z
			.object({
				success: z.boolean().optional(),
				data: z
					.array(
						z
							.object({
								user_id: z.number().int().optional(),
								add_time: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				additional_data: z
					.object({ next_cursor: z.string().nullable().optional() })
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
} as const;

export type PipedriveCatalogKey = keyof typeof PipedriveCatalog;
export const PipedriveCatalogEndpointSchemas = {
	'apiV1.activityFields.getActivityFields': {
		input: PipedriveCatalog['apiV1.activityFields.getActivityFields'].input,
		output: PipedriveCatalog['apiV1.activityFields.getActivityFields'].output,
	},
	'apiV1.activityTypes.getActivityTypes': {
		input: PipedriveCatalog['apiV1.activityTypes.getActivityTypes'].input,
		output: PipedriveCatalog['apiV1.activityTypes.getActivityTypes'].output,
	},
	'apiV1.activityTypes.addActivityType': {
		input: PipedriveCatalog['apiV1.activityTypes.addActivityType'].input,
		output: PipedriveCatalog['apiV1.activityTypes.addActivityType'].output,
	},
	'apiV1.activityTypes.deleteActivityType': {
		input: PipedriveCatalog['apiV1.activityTypes.deleteActivityType'].input,
		output: PipedriveCatalog['apiV1.activityTypes.deleteActivityType'].output,
	},
	'apiV1.activityTypes.updateActivityType': {
		input: PipedriveCatalog['apiV1.activityTypes.updateActivityType'].input,
		output: PipedriveCatalog['apiV1.activityTypes.updateActivityType'].output,
	},
	'apiV1.billing.getCompanyAddons': {
		input: PipedriveCatalog['apiV1.billing.getCompanyAddons'].input,
		output: PipedriveCatalog['apiV1.billing.getCompanyAddons'].output,
	},
	'apiV1.callLogs.addCallLog': {
		input: PipedriveCatalog['apiV1.callLogs.addCallLog'].input,
		output: PipedriveCatalog['apiV1.callLogs.addCallLog'].output,
	},
	'apiV1.callLogs.getUserCallLogs': {
		input: PipedriveCatalog['apiV1.callLogs.getUserCallLogs'].input,
		output: PipedriveCatalog['apiV1.callLogs.getUserCallLogs'].output,
	},
	'apiV1.callLogs.deleteCallLog': {
		input: PipedriveCatalog['apiV1.callLogs.deleteCallLog'].input,
		output: PipedriveCatalog['apiV1.callLogs.deleteCallLog'].output,
	},
	'apiV1.callLogs.getCallLog': {
		input: PipedriveCatalog['apiV1.callLogs.getCallLog'].input,
		output: PipedriveCatalog['apiV1.callLogs.getCallLog'].output,
	},
	'apiV1.callLogs.addCallLogAudioFile': {
		input: PipedriveCatalog['apiV1.callLogs.addCallLogAudioFile'].input,
		output: PipedriveCatalog['apiV1.callLogs.addCallLogAudioFile'].output,
	},
	'apiV1.channels.addChannel': {
		input: PipedriveCatalog['apiV1.channels.addChannel'].input,
		output: PipedriveCatalog['apiV1.channels.addChannel'].output,
	},
	'apiV1.channels.deleteChannel': {
		input: PipedriveCatalog['apiV1.channels.deleteChannel'].input,
		output: PipedriveCatalog['apiV1.channels.deleteChannel'].output,
	},
	'apiV1.channels.receiveMessage': {
		input: PipedriveCatalog['apiV1.channels.receiveMessage'].input,
		output: PipedriveCatalog['apiV1.channels.receiveMessage'].output,
	},
	'apiV1.channels.deleteConversation': {
		input: PipedriveCatalog['apiV1.channels.deleteConversation'].input,
		output: PipedriveCatalog['apiV1.channels.deleteConversation'].output,
	},
	'apiV1.currencies.getCurrencies': {
		input: PipedriveCatalog['apiV1.currencies.getCurrencies'].input,
		output: PipedriveCatalog['apiV1.currencies.getCurrencies'].output,
	},
	'apiV1.deals.getArchivedDeals': {
		input: PipedriveCatalog['apiV1.deals.getArchivedDeals'].input,
		output: PipedriveCatalog['apiV1.deals.getArchivedDeals'].output,
	},
	'apiV1.deals.getDealsSummary': {
		input: PipedriveCatalog['apiV1.deals.getDealsSummary'].input,
		output: PipedriveCatalog['apiV1.deals.getDealsSummary'].output,
	},
	'apiV1.deals.getArchivedDealsSummary': {
		input: PipedriveCatalog['apiV1.deals.getArchivedDealsSummary'].input,
		output: PipedriveCatalog['apiV1.deals.getArchivedDealsSummary'].output,
	},
	'apiV1.deals.getDealsTimeline': {
		input: PipedriveCatalog['apiV1.deals.getDealsTimeline'].input,
		output: PipedriveCatalog['apiV1.deals.getDealsTimeline'].output,
	},
	'apiV1.deals.getArchivedDealsTimeline': {
		input: PipedriveCatalog['apiV1.deals.getArchivedDealsTimeline'].input,
		output: PipedriveCatalog['apiV1.deals.getArchivedDealsTimeline'].output,
	},
	'apiV1.deals.getDealChangelog': {
		input: PipedriveCatalog['apiV1.deals.getDealChangelog'].input,
		output: PipedriveCatalog['apiV1.deals.getDealChangelog'].output,
	},
	'apiV1.deals.duplicateDeal': {
		input: PipedriveCatalog['apiV1.deals.duplicateDeal'].input,
		output: PipedriveCatalog['apiV1.deals.duplicateDeal'].output,
	},
	'apiV1.deals.getDealFiles': {
		input: PipedriveCatalog['apiV1.deals.getDealFiles'].input,
		output: PipedriveCatalog['apiV1.deals.getDealFiles'].output,
	},
	'apiV1.deals.getDealUpdates': {
		input: PipedriveCatalog['apiV1.deals.getDealUpdates'].input,
		output: PipedriveCatalog['apiV1.deals.getDealUpdates'].output,
	},
	'apiV1.deals.getDealParticipantsChangelog': {
		input: PipedriveCatalog['apiV1.deals.getDealParticipantsChangelog'].input,
		output: PipedriveCatalog['apiV1.deals.getDealParticipantsChangelog'].output,
	},
	'apiV1.deals.getDealFollowers': {
		input: PipedriveCatalog['apiV1.deals.getDealFollowers'].input,
		output: PipedriveCatalog['apiV1.deals.getDealFollowers'].output,
	},
	'apiV1.deals.addDealFollower': {
		input: PipedriveCatalog['apiV1.deals.addDealFollower'].input,
		output: PipedriveCatalog['apiV1.deals.addDealFollower'].output,
	},
	'apiV1.deals.deleteDealFollower': {
		input: PipedriveCatalog['apiV1.deals.deleteDealFollower'].input,
		output: PipedriveCatalog['apiV1.deals.deleteDealFollower'].output,
	},
	'apiV1.deals.getDealMailMessages': {
		input: PipedriveCatalog['apiV1.deals.getDealMailMessages'].input,
		output: PipedriveCatalog['apiV1.deals.getDealMailMessages'].output,
	},
	'apiV1.deals.mergeDeals': {
		input: PipedriveCatalog['apiV1.deals.mergeDeals'].input,
		output: PipedriveCatalog['apiV1.deals.mergeDeals'].output,
	},
	'apiV1.deals.getDealParticipants': {
		input: PipedriveCatalog['apiV1.deals.getDealParticipants'].input,
		output: PipedriveCatalog['apiV1.deals.getDealParticipants'].output,
	},
	'apiV1.deals.addDealParticipant': {
		input: PipedriveCatalog['apiV1.deals.addDealParticipant'].input,
		output: PipedriveCatalog['apiV1.deals.addDealParticipant'].output,
	},
	'apiV1.deals.deleteDealParticipant': {
		input: PipedriveCatalog['apiV1.deals.deleteDealParticipant'].input,
		output: PipedriveCatalog['apiV1.deals.deleteDealParticipant'].output,
	},
	'apiV1.deals.getDealUsers': {
		input: PipedriveCatalog['apiV1.deals.getDealUsers'].input,
		output: PipedriveCatalog['apiV1.deals.getDealUsers'].output,
	},
	'apiV1.dealFields.getDealFields': {
		input: PipedriveCatalog['apiV1.dealFields.getDealFields'].input,
		output: PipedriveCatalog['apiV1.dealFields.getDealFields'].output,
	},
	'apiV1.dealFields.addDealField': {
		input: PipedriveCatalog['apiV1.dealFields.addDealField'].input,
		output: PipedriveCatalog['apiV1.dealFields.addDealField'].output,
	},
	'apiV1.dealFields.deleteDealFields': {
		input: PipedriveCatalog['apiV1.dealFields.deleteDealFields'].input,
		output: PipedriveCatalog['apiV1.dealFields.deleteDealFields'].output,
	},
	'apiV1.dealFields.getDealField': {
		input: PipedriveCatalog['apiV1.dealFields.getDealField'].input,
		output: PipedriveCatalog['apiV1.dealFields.getDealField'].output,
	},
	'apiV1.dealFields.deleteDealField': {
		input: PipedriveCatalog['apiV1.dealFields.deleteDealField'].input,
		output: PipedriveCatalog['apiV1.dealFields.deleteDealField'].output,
	},
	'apiV1.dealFields.updateDealField': {
		input: PipedriveCatalog['apiV1.dealFields.updateDealField'].input,
		output: PipedriveCatalog['apiV1.dealFields.updateDealField'].output,
	},
	'apiV1.files.getFiles': {
		input: PipedriveCatalog['apiV1.files.getFiles'].input,
		output: PipedriveCatalog['apiV1.files.getFiles'].output,
	},
	'apiV1.files.addFile': {
		input: PipedriveCatalog['apiV1.files.addFile'].input,
		output: PipedriveCatalog['apiV1.files.addFile'].output,
	},
	'apiV1.files.addFileAndLinkIt': {
		input: PipedriveCatalog['apiV1.files.addFileAndLinkIt'].input,
		output: PipedriveCatalog['apiV1.files.addFileAndLinkIt'].output,
	},
	'apiV1.files.linkFileToItem': {
		input: PipedriveCatalog['apiV1.files.linkFileToItem'].input,
		output: PipedriveCatalog['apiV1.files.linkFileToItem'].output,
	},
	'apiV1.files.deleteFile': {
		input: PipedriveCatalog['apiV1.files.deleteFile'].input,
		output: PipedriveCatalog['apiV1.files.deleteFile'].output,
	},
	'apiV1.files.getFile': {
		input: PipedriveCatalog['apiV1.files.getFile'].input,
		output: PipedriveCatalog['apiV1.files.getFile'].output,
	},
	'apiV1.files.updateFile': {
		input: PipedriveCatalog['apiV1.files.updateFile'].input,
		output: PipedriveCatalog['apiV1.files.updateFile'].output,
	},
	'apiV1.files.downloadFile': {
		input: PipedriveCatalog['apiV1.files.downloadFile'].input,
		output: PipedriveCatalog['apiV1.files.downloadFile'].output,
	},
	'apiV1.filters.deleteFilters': {
		input: PipedriveCatalog['apiV1.filters.deleteFilters'].input,
		output: PipedriveCatalog['apiV1.filters.deleteFilters'].output,
	},
	'apiV1.filters.getFilters': {
		input: PipedriveCatalog['apiV1.filters.getFilters'].input,
		output: PipedriveCatalog['apiV1.filters.getFilters'].output,
	},
	'apiV1.filters.addFilter': {
		input: PipedriveCatalog['apiV1.filters.addFilter'].input,
		output: PipedriveCatalog['apiV1.filters.addFilter'].output,
	},
	'apiV1.filters.getFilterHelpers': {
		input: PipedriveCatalog['apiV1.filters.getFilterHelpers'].input,
		output: PipedriveCatalog['apiV1.filters.getFilterHelpers'].output,
	},
	'apiV1.filters.deleteFilter': {
		input: PipedriveCatalog['apiV1.filters.deleteFilter'].input,
		output: PipedriveCatalog['apiV1.filters.deleteFilter'].output,
	},
	'apiV1.filters.getFilter': {
		input: PipedriveCatalog['apiV1.filters.getFilter'].input,
		output: PipedriveCatalog['apiV1.filters.getFilter'].output,
	},
	'apiV1.filters.updateFilter': {
		input: PipedriveCatalog['apiV1.filters.updateFilter'].input,
		output: PipedriveCatalog['apiV1.filters.updateFilter'].output,
	},
	'apiV1.goals.addGoal': {
		input: PipedriveCatalog['apiV1.goals.addGoal'].input,
		output: PipedriveCatalog['apiV1.goals.addGoal'].output,
	},
	'apiV1.goals.getGoals': {
		input: PipedriveCatalog['apiV1.goals.getGoals'].input,
		output: PipedriveCatalog['apiV1.goals.getGoals'].output,
	},
	'apiV1.goals.updateGoal': {
		input: PipedriveCatalog['apiV1.goals.updateGoal'].input,
		output: PipedriveCatalog['apiV1.goals.updateGoal'].output,
	},
	'apiV1.goals.deleteGoal': {
		input: PipedriveCatalog['apiV1.goals.deleteGoal'].input,
		output: PipedriveCatalog['apiV1.goals.deleteGoal'].output,
	},
	'apiV1.goals.getGoalResult': {
		input: PipedriveCatalog['apiV1.goals.getGoalResult'].input,
		output: PipedriveCatalog['apiV1.goals.getGoalResult'].output,
	},
	'apiV1.leads.getLeads': {
		input: PipedriveCatalog['apiV1.leads.getLeads'].input,
		output: PipedriveCatalog['apiV1.leads.getLeads'].output,
	},
	'apiV1.leads.addLead': {
		input: PipedriveCatalog['apiV1.leads.addLead'].input,
		output: PipedriveCatalog['apiV1.leads.addLead'].output,
	},
	'apiV1.leads.getArchivedLeads': {
		input: PipedriveCatalog['apiV1.leads.getArchivedLeads'].input,
		output: PipedriveCatalog['apiV1.leads.getArchivedLeads'].output,
	},
	'apiV1.leads.getLead': {
		input: PipedriveCatalog['apiV1.leads.getLead'].input,
		output: PipedriveCatalog['apiV1.leads.getLead'].output,
	},
	'apiV1.leads.updateLead': {
		input: PipedriveCatalog['apiV1.leads.updateLead'].input,
		output: PipedriveCatalog['apiV1.leads.updateLead'].output,
	},
	'apiV1.leads.deleteLead': {
		input: PipedriveCatalog['apiV1.leads.deleteLead'].input,
		output: PipedriveCatalog['apiV1.leads.deleteLead'].output,
	},
	'apiV1.leads.getLeadUsers': {
		input: PipedriveCatalog['apiV1.leads.getLeadUsers'].input,
		output: PipedriveCatalog['apiV1.leads.getLeadUsers'].output,
	},
	'apiV1.leads.searchLeads': {
		input: PipedriveCatalog['apiV1.leads.searchLeads'].input,
		output: PipedriveCatalog['apiV1.leads.searchLeads'].output,
	},
	'apiV1.leadFields.getLeadFields': {
		input: PipedriveCatalog['apiV1.leadFields.getLeadFields'].input,
		output: PipedriveCatalog['apiV1.leadFields.getLeadFields'].output,
	},
	'apiV1.leadLabels.getLeadLabels': {
		input: PipedriveCatalog['apiV1.leadLabels.getLeadLabels'].input,
		output: PipedriveCatalog['apiV1.leadLabels.getLeadLabels'].output,
	},
	'apiV1.leadLabels.addLeadLabel': {
		input: PipedriveCatalog['apiV1.leadLabels.addLeadLabel'].input,
		output: PipedriveCatalog['apiV1.leadLabels.addLeadLabel'].output,
	},
	'apiV1.leadLabels.updateLeadLabel': {
		input: PipedriveCatalog['apiV1.leadLabels.updateLeadLabel'].input,
		output: PipedriveCatalog['apiV1.leadLabels.updateLeadLabel'].output,
	},
	'apiV1.leadLabels.deleteLeadLabel': {
		input: PipedriveCatalog['apiV1.leadLabels.deleteLeadLabel'].input,
		output: PipedriveCatalog['apiV1.leadLabels.deleteLeadLabel'].output,
	},
	'apiV1.leadSources.getLeadSources': {
		input: PipedriveCatalog['apiV1.leadSources.getLeadSources'].input,
		output: PipedriveCatalog['apiV1.leadSources.getLeadSources'].output,
	},
	'apiV1.legacyTeams.getTeams': {
		input: PipedriveCatalog['apiV1.legacyTeams.getTeams'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.getTeams'].output,
	},
	'apiV1.legacyTeams.addTeam': {
		input: PipedriveCatalog['apiV1.legacyTeams.addTeam'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.addTeam'].output,
	},
	'apiV1.legacyTeams.getTeam': {
		input: PipedriveCatalog['apiV1.legacyTeams.getTeam'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.getTeam'].output,
	},
	'apiV1.legacyTeams.updateTeam': {
		input: PipedriveCatalog['apiV1.legacyTeams.updateTeam'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.updateTeam'].output,
	},
	'apiV1.legacyTeams.getTeamUsers': {
		input: PipedriveCatalog['apiV1.legacyTeams.getTeamUsers'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.getTeamUsers'].output,
	},
	'apiV1.legacyTeams.addTeamUser': {
		input: PipedriveCatalog['apiV1.legacyTeams.addTeamUser'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.addTeamUser'].output,
	},
	'apiV1.legacyTeams.deleteTeamUser': {
		input: PipedriveCatalog['apiV1.legacyTeams.deleteTeamUser'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.deleteTeamUser'].output,
	},
	'apiV1.legacyTeams.getUserTeams': {
		input: PipedriveCatalog['apiV1.legacyTeams.getUserTeams'].input,
		output: PipedriveCatalog['apiV1.legacyTeams.getUserTeams'].output,
	},
	'apiV1.mailbox.getMailMessage': {
		input: PipedriveCatalog['apiV1.mailbox.getMailMessage'].input,
		output: PipedriveCatalog['apiV1.mailbox.getMailMessage'].output,
	},
	'apiV1.mailbox.getMailThreads': {
		input: PipedriveCatalog['apiV1.mailbox.getMailThreads'].input,
		output: PipedriveCatalog['apiV1.mailbox.getMailThreads'].output,
	},
	'apiV1.mailbox.deleteMailThread': {
		input: PipedriveCatalog['apiV1.mailbox.deleteMailThread'].input,
		output: PipedriveCatalog['apiV1.mailbox.deleteMailThread'].output,
	},
	'apiV1.mailbox.getMailThread': {
		input: PipedriveCatalog['apiV1.mailbox.getMailThread'].input,
		output: PipedriveCatalog['apiV1.mailbox.getMailThread'].output,
	},
	'apiV1.mailbox.updateMailThreadDetails': {
		input: PipedriveCatalog['apiV1.mailbox.updateMailThreadDetails'].input,
		output: PipedriveCatalog['apiV1.mailbox.updateMailThreadDetails'].output,
	},
	'apiV1.mailbox.getMailThreadMessages': {
		input: PipedriveCatalog['apiV1.mailbox.getMailThreadMessages'].input,
		output: PipedriveCatalog['apiV1.mailbox.getMailThreadMessages'].output,
	},
	'apiV1.meetings.saveUserProviderLink': {
		input: PipedriveCatalog['apiV1.meetings.saveUserProviderLink'].input,
		output: PipedriveCatalog['apiV1.meetings.saveUserProviderLink'].output,
	},
	'apiV1.meetings.deleteUserProviderLink': {
		input: PipedriveCatalog['apiV1.meetings.deleteUserProviderLink'].input,
		output: PipedriveCatalog['apiV1.meetings.deleteUserProviderLink'].output,
	},
	'apiV1.notes.getNotes': {
		input: PipedriveCatalog['apiV1.notes.getNotes'].input,
		output: PipedriveCatalog['apiV1.notes.getNotes'].output,
	},
	'apiV1.notes.addNote': {
		input: PipedriveCatalog['apiV1.notes.addNote'].input,
		output: PipedriveCatalog['apiV1.notes.addNote'].output,
	},
	'apiV1.notes.deleteNote': {
		input: PipedriveCatalog['apiV1.notes.deleteNote'].input,
		output: PipedriveCatalog['apiV1.notes.deleteNote'].output,
	},
	'apiV1.notes.getNote': {
		input: PipedriveCatalog['apiV1.notes.getNote'].input,
		output: PipedriveCatalog['apiV1.notes.getNote'].output,
	},
	'apiV1.notes.updateNote': {
		input: PipedriveCatalog['apiV1.notes.updateNote'].input,
		output: PipedriveCatalog['apiV1.notes.updateNote'].output,
	},
	'apiV1.notes.getNoteComments': {
		input: PipedriveCatalog['apiV1.notes.getNoteComments'].input,
		output: PipedriveCatalog['apiV1.notes.getNoteComments'].output,
	},
	'apiV1.notes.addNoteComment': {
		input: PipedriveCatalog['apiV1.notes.addNoteComment'].input,
		output: PipedriveCatalog['apiV1.notes.addNoteComment'].output,
	},
	'apiV1.notes.getComment': {
		input: PipedriveCatalog['apiV1.notes.getComment'].input,
		output: PipedriveCatalog['apiV1.notes.getComment'].output,
	},
	'apiV1.notes.updateCommentForNote': {
		input: PipedriveCatalog['apiV1.notes.updateCommentForNote'].input,
		output: PipedriveCatalog['apiV1.notes.updateCommentForNote'].output,
	},
	'apiV1.notes.deleteComment': {
		input: PipedriveCatalog['apiV1.notes.deleteComment'].input,
		output: PipedriveCatalog['apiV1.notes.deleteComment'].output,
	},
	'apiV1.noteFields.getNoteFields': {
		input: PipedriveCatalog['apiV1.noteFields.getNoteFields'].input,
		output: PipedriveCatalog['apiV1.noteFields.getNoteFields'].output,
	},
	'apiV1.organizations.getOrganizationChangelog': {
		input:
			PipedriveCatalog['apiV1.organizations.getOrganizationChangelog'].input,
		output:
			PipedriveCatalog['apiV1.organizations.getOrganizationChangelog'].output,
	},
	'apiV1.organizations.getOrganizationFiles': {
		input: PipedriveCatalog['apiV1.organizations.getOrganizationFiles'].input,
		output: PipedriveCatalog['apiV1.organizations.getOrganizationFiles'].output,
	},
	'apiV1.organizations.getOrganizationUpdates': {
		input: PipedriveCatalog['apiV1.organizations.getOrganizationUpdates'].input,
		output:
			PipedriveCatalog['apiV1.organizations.getOrganizationUpdates'].output,
	},
	'apiV1.organizations.getOrganizationFollowers': {
		input:
			PipedriveCatalog['apiV1.organizations.getOrganizationFollowers'].input,
		output:
			PipedriveCatalog['apiV1.organizations.getOrganizationFollowers'].output,
	},
	'apiV1.organizations.addOrganizationFollower': {
		input:
			PipedriveCatalog['apiV1.organizations.addOrganizationFollower'].input,
		output:
			PipedriveCatalog['apiV1.organizations.addOrganizationFollower'].output,
	},
	'apiV1.organizations.deleteOrganizationFollower': {
		input:
			PipedriveCatalog['apiV1.organizations.deleteOrganizationFollower'].input,
		output:
			PipedriveCatalog['apiV1.organizations.deleteOrganizationFollower'].output,
	},
	'apiV1.organizations.getOrganizationMailMessages': {
		input:
			PipedriveCatalog['apiV1.organizations.getOrganizationMailMessages'].input,
		output:
			PipedriveCatalog['apiV1.organizations.getOrganizationMailMessages']
				.output,
	},
	'apiV1.organizations.mergeOrganizations': {
		input: PipedriveCatalog['apiV1.organizations.mergeOrganizations'].input,
		output: PipedriveCatalog['apiV1.organizations.mergeOrganizations'].output,
	},
	'apiV1.organizations.getOrganizationUsers': {
		input: PipedriveCatalog['apiV1.organizations.getOrganizationUsers'].input,
		output: PipedriveCatalog['apiV1.organizations.getOrganizationUsers'].output,
	},
	'apiV1.organizationFields.getOrganizationFields': {
		input:
			PipedriveCatalog['apiV1.organizationFields.getOrganizationFields'].input,
		output:
			PipedriveCatalog['apiV1.organizationFields.getOrganizationFields'].output,
	},
	'apiV1.organizationFields.addOrganizationField': {
		input:
			PipedriveCatalog['apiV1.organizationFields.addOrganizationField'].input,
		output:
			PipedriveCatalog['apiV1.organizationFields.addOrganizationField'].output,
	},
	'apiV1.organizationFields.deleteOrganizationFields': {
		input:
			PipedriveCatalog['apiV1.organizationFields.deleteOrganizationFields']
				.input,
		output:
			PipedriveCatalog['apiV1.organizationFields.deleteOrganizationFields']
				.output,
	},
	'apiV1.organizationFields.getOrganizationField': {
		input:
			PipedriveCatalog['apiV1.organizationFields.getOrganizationField'].input,
		output:
			PipedriveCatalog['apiV1.organizationFields.getOrganizationField'].output,
	},
	'apiV1.organizationFields.deleteOrganizationField': {
		input:
			PipedriveCatalog['apiV1.organizationFields.deleteOrganizationField']
				.input,
		output:
			PipedriveCatalog['apiV1.organizationFields.deleteOrganizationField']
				.output,
	},
	'apiV1.organizationFields.updateOrganizationField': {
		input:
			PipedriveCatalog['apiV1.organizationFields.updateOrganizationField']
				.input,
		output:
			PipedriveCatalog['apiV1.organizationFields.updateOrganizationField']
				.output,
	},
	'apiV1.organizationRelationships.getOrganizationRelationships': {
		input:
			PipedriveCatalog[
				'apiV1.organizationRelationships.getOrganizationRelationships'
			].input,
		output:
			PipedriveCatalog[
				'apiV1.organizationRelationships.getOrganizationRelationships'
			].output,
	},
	'apiV1.organizationRelationships.addOrganizationRelationship': {
		input:
			PipedriveCatalog[
				'apiV1.organizationRelationships.addOrganizationRelationship'
			].input,
		output:
			PipedriveCatalog[
				'apiV1.organizationRelationships.addOrganizationRelationship'
			].output,
	},
	'apiV1.organizationRelationships.deleteOrganizationRelationship': {
		input:
			PipedriveCatalog[
				'apiV1.organizationRelationships.deleteOrganizationRelationship'
			].input,
		output:
			PipedriveCatalog[
				'apiV1.organizationRelationships.deleteOrganizationRelationship'
			].output,
	},
	'apiV1.organizationRelationships.getOrganizationRelationship': {
		input:
			PipedriveCatalog[
				'apiV1.organizationRelationships.getOrganizationRelationship'
			].input,
		output:
			PipedriveCatalog[
				'apiV1.organizationRelationships.getOrganizationRelationship'
			].output,
	},
	'apiV1.organizationRelationships.updateOrganizationRelationship': {
		input:
			PipedriveCatalog[
				'apiV1.organizationRelationships.updateOrganizationRelationship'
			].input,
		output:
			PipedriveCatalog[
				'apiV1.organizationRelationships.updateOrganizationRelationship'
			].output,
	},
	'apiV1.permissionSets.getPermissionSets': {
		input: PipedriveCatalog['apiV1.permissionSets.getPermissionSets'].input,
		output: PipedriveCatalog['apiV1.permissionSets.getPermissionSets'].output,
	},
	'apiV1.permissionSets.getPermissionSet': {
		input: PipedriveCatalog['apiV1.permissionSets.getPermissionSet'].input,
		output: PipedriveCatalog['apiV1.permissionSets.getPermissionSet'].output,
	},
	'apiV1.permissionSets.getPermissionSetAssignments': {
		input:
			PipedriveCatalog['apiV1.permissionSets.getPermissionSetAssignments']
				.input,
		output:
			PipedriveCatalog['apiV1.permissionSets.getPermissionSetAssignments']
				.output,
	},
	'apiV1.persons.getPersonChangelog': {
		input: PipedriveCatalog['apiV1.persons.getPersonChangelog'].input,
		output: PipedriveCatalog['apiV1.persons.getPersonChangelog'].output,
	},
	'apiV1.persons.getPersonFiles': {
		input: PipedriveCatalog['apiV1.persons.getPersonFiles'].input,
		output: PipedriveCatalog['apiV1.persons.getPersonFiles'].output,
	},
	'apiV1.persons.getPersonUpdates': {
		input: PipedriveCatalog['apiV1.persons.getPersonUpdates'].input,
		output: PipedriveCatalog['apiV1.persons.getPersonUpdates'].output,
	},
	'apiV1.persons.getPersonFollowers': {
		input: PipedriveCatalog['apiV1.persons.getPersonFollowers'].input,
		output: PipedriveCatalog['apiV1.persons.getPersonFollowers'].output,
	},
	'apiV1.persons.addPersonFollower': {
		input: PipedriveCatalog['apiV1.persons.addPersonFollower'].input,
		output: PipedriveCatalog['apiV1.persons.addPersonFollower'].output,
	},
	'apiV1.persons.deletePersonFollower': {
		input: PipedriveCatalog['apiV1.persons.deletePersonFollower'].input,
		output: PipedriveCatalog['apiV1.persons.deletePersonFollower'].output,
	},
	'apiV1.persons.getPersonMailMessages': {
		input: PipedriveCatalog['apiV1.persons.getPersonMailMessages'].input,
		output: PipedriveCatalog['apiV1.persons.getPersonMailMessages'].output,
	},
	'apiV1.persons.mergePersons': {
		input: PipedriveCatalog['apiV1.persons.mergePersons'].input,
		output: PipedriveCatalog['apiV1.persons.mergePersons'].output,
	},
	'apiV1.persons.getPersonUsers': {
		input: PipedriveCatalog['apiV1.persons.getPersonUsers'].input,
		output: PipedriveCatalog['apiV1.persons.getPersonUsers'].output,
	},
	'apiV1.persons.deletePersonPicture': {
		input: PipedriveCatalog['apiV1.persons.deletePersonPicture'].input,
		output: PipedriveCatalog['apiV1.persons.deletePersonPicture'].output,
	},
	'apiV1.persons.addPersonPicture': {
		input: PipedriveCatalog['apiV1.persons.addPersonPicture'].input,
		output: PipedriveCatalog['apiV1.persons.addPersonPicture'].output,
	},
	'apiV1.persons.getPersonProducts': {
		input: PipedriveCatalog['apiV1.persons.getPersonProducts'].input,
		output: PipedriveCatalog['apiV1.persons.getPersonProducts'].output,
	},
	'apiV1.personFields.getPersonFields': {
		input: PipedriveCatalog['apiV1.personFields.getPersonFields'].input,
		output: PipedriveCatalog['apiV1.personFields.getPersonFields'].output,
	},
	'apiV1.personFields.addPersonField': {
		input: PipedriveCatalog['apiV1.personFields.addPersonField'].input,
		output: PipedriveCatalog['apiV1.personFields.addPersonField'].output,
	},
	'apiV1.personFields.deletePersonFields': {
		input: PipedriveCatalog['apiV1.personFields.deletePersonFields'].input,
		output: PipedriveCatalog['apiV1.personFields.deletePersonFields'].output,
	},
	'apiV1.personFields.getPersonField': {
		input: PipedriveCatalog['apiV1.personFields.getPersonField'].input,
		output: PipedriveCatalog['apiV1.personFields.getPersonField'].output,
	},
	'apiV1.personFields.deletePersonField': {
		input: PipedriveCatalog['apiV1.personFields.deletePersonField'].input,
		output: PipedriveCatalog['apiV1.personFields.deletePersonField'].output,
	},
	'apiV1.personFields.updatePersonField': {
		input: PipedriveCatalog['apiV1.personFields.updatePersonField'].input,
		output: PipedriveCatalog['apiV1.personFields.updatePersonField'].output,
	},
	'apiV1.pipelines.getPipelineConversionStatistics': {
		input:
			PipedriveCatalog['apiV1.pipelines.getPipelineConversionStatistics'].input,
		output:
			PipedriveCatalog['apiV1.pipelines.getPipelineConversionStatistics']
				.output,
	},
	'apiV1.pipelines.getPipelineDeals': {
		input: PipedriveCatalog['apiV1.pipelines.getPipelineDeals'].input,
		output: PipedriveCatalog['apiV1.pipelines.getPipelineDeals'].output,
	},
	'apiV1.pipelines.getPipelineMovementStatistics': {
		input:
			PipedriveCatalog['apiV1.pipelines.getPipelineMovementStatistics'].input,
		output:
			PipedriveCatalog['apiV1.pipelines.getPipelineMovementStatistics'].output,
	},
	'apiV1.products.getProductDeals': {
		input: PipedriveCatalog['apiV1.products.getProductDeals'].input,
		output: PipedriveCatalog['apiV1.products.getProductDeals'].output,
	},
	'apiV1.products.getProductFiles': {
		input: PipedriveCatalog['apiV1.products.getProductFiles'].input,
		output: PipedriveCatalog['apiV1.products.getProductFiles'].output,
	},
	'apiV1.products.getProductFollowers': {
		input: PipedriveCatalog['apiV1.products.getProductFollowers'].input,
		output: PipedriveCatalog['apiV1.products.getProductFollowers'].output,
	},
	'apiV1.products.addProductFollower': {
		input: PipedriveCatalog['apiV1.products.addProductFollower'].input,
		output: PipedriveCatalog['apiV1.products.addProductFollower'].output,
	},
	'apiV1.products.deleteProductFollower': {
		input: PipedriveCatalog['apiV1.products.deleteProductFollower'].input,
		output: PipedriveCatalog['apiV1.products.deleteProductFollower'].output,
	},
	'apiV1.products.getProductUsers': {
		input: PipedriveCatalog['apiV1.products.getProductUsers'].input,
		output: PipedriveCatalog['apiV1.products.getProductUsers'].output,
	},
	'apiV1.productFields.deleteProductFields': {
		input: PipedriveCatalog['apiV1.productFields.deleteProductFields'].input,
		output: PipedriveCatalog['apiV1.productFields.deleteProductFields'].output,
	},
	'apiV1.productFields.getProductFields': {
		input: PipedriveCatalog['apiV1.productFields.getProductFields'].input,
		output: PipedriveCatalog['apiV1.productFields.getProductFields'].output,
	},
	'apiV1.productFields.addProductField': {
		input: PipedriveCatalog['apiV1.productFields.addProductField'].input,
		output: PipedriveCatalog['apiV1.productFields.addProductField'].output,
	},
	'apiV1.productFields.deleteProductField': {
		input: PipedriveCatalog['apiV1.productFields.deleteProductField'].input,
		output: PipedriveCatalog['apiV1.productFields.deleteProductField'].output,
	},
	'apiV1.productFields.getProductField': {
		input: PipedriveCatalog['apiV1.productFields.getProductField'].input,
		output: PipedriveCatalog['apiV1.productFields.getProductField'].output,
	},
	'apiV1.productFields.updateProductField': {
		input: PipedriveCatalog['apiV1.productFields.updateProductField'].input,
		output: PipedriveCatalog['apiV1.productFields.updateProductField'].output,
	},
	'apiV1.projects.getProjects': {
		input: PipedriveCatalog['apiV1.projects.getProjects'].input,
		output: PipedriveCatalog['apiV1.projects.getProjects'].output,
	},
	'apiV1.projects.addProject': {
		input: PipedriveCatalog['apiV1.projects.addProject'].input,
		output: PipedriveCatalog['apiV1.projects.addProject'].output,
	},
	'apiV1.projects.getProject': {
		input: PipedriveCatalog['apiV1.projects.getProject'].input,
		output: PipedriveCatalog['apiV1.projects.getProject'].output,
	},
	'apiV1.projects.updateProject': {
		input: PipedriveCatalog['apiV1.projects.updateProject'].input,
		output: PipedriveCatalog['apiV1.projects.updateProject'].output,
	},
	'apiV1.projects.deleteProject': {
		input: PipedriveCatalog['apiV1.projects.deleteProject'].input,
		output: PipedriveCatalog['apiV1.projects.deleteProject'].output,
	},
	'apiV1.projects.archiveProject': {
		input: PipedriveCatalog['apiV1.projects.archiveProject'].input,
		output: PipedriveCatalog['apiV1.projects.archiveProject'].output,
	},
	'apiV1.projects.getProjectPlan': {
		input: PipedriveCatalog['apiV1.projects.getProjectPlan'].input,
		output: PipedriveCatalog['apiV1.projects.getProjectPlan'].output,
	},
	'apiV1.projects.putProjectPlanActivity': {
		input: PipedriveCatalog['apiV1.projects.putProjectPlanActivity'].input,
		output: PipedriveCatalog['apiV1.projects.putProjectPlanActivity'].output,
	},
	'apiV1.projects.putProjectPlanTask': {
		input: PipedriveCatalog['apiV1.projects.putProjectPlanTask'].input,
		output: PipedriveCatalog['apiV1.projects.putProjectPlanTask'].output,
	},
	'apiV1.projects.getProjectGroups': {
		input: PipedriveCatalog['apiV1.projects.getProjectGroups'].input,
		output: PipedriveCatalog['apiV1.projects.getProjectGroups'].output,
	},
	'apiV1.projects.getProjectTasks': {
		input: PipedriveCatalog['apiV1.projects.getProjectTasks'].input,
		output: PipedriveCatalog['apiV1.projects.getProjectTasks'].output,
	},
	'apiV1.projects.getProjectActivities': {
		input: PipedriveCatalog['apiV1.projects.getProjectActivities'].input,
		output: PipedriveCatalog['apiV1.projects.getProjectActivities'].output,
	},
	'apiV1.projectBoards.getProjectsBoards': {
		input: PipedriveCatalog['apiV1.projectBoards.getProjectsBoards'].input,
		output: PipedriveCatalog['apiV1.projectBoards.getProjectsBoards'].output,
	},
	'apiV1.projectBoards.getProjectsBoard': {
		input: PipedriveCatalog['apiV1.projectBoards.getProjectsBoard'].input,
		output: PipedriveCatalog['apiV1.projectBoards.getProjectsBoard'].output,
	},
	'apiV1.projectPhases.getProjectsPhases': {
		input: PipedriveCatalog['apiV1.projectPhases.getProjectsPhases'].input,
		output: PipedriveCatalog['apiV1.projectPhases.getProjectsPhases'].output,
	},
	'apiV1.projectPhases.getProjectsPhase': {
		input: PipedriveCatalog['apiV1.projectPhases.getProjectsPhase'].input,
		output: PipedriveCatalog['apiV1.projectPhases.getProjectsPhase'].output,
	},
	'apiV1.projectTemplates.getProjectTemplates': {
		input: PipedriveCatalog['apiV1.projectTemplates.getProjectTemplates'].input,
		output:
			PipedriveCatalog['apiV1.projectTemplates.getProjectTemplates'].output,
	},
	'apiV1.projectTemplates.getProjectTemplate': {
		input: PipedriveCatalog['apiV1.projectTemplates.getProjectTemplate'].input,
		output:
			PipedriveCatalog['apiV1.projectTemplates.getProjectTemplate'].output,
	},
	'apiV1.recents.getRecents': {
		input: PipedriveCatalog['apiV1.recents.getRecents'].input,
		output: PipedriveCatalog['apiV1.recents.getRecents'].output,
	},
	'apiV1.roles.getRoles': {
		input: PipedriveCatalog['apiV1.roles.getRoles'].input,
		output: PipedriveCatalog['apiV1.roles.getRoles'].output,
	},
	'apiV1.roles.addRole': {
		input: PipedriveCatalog['apiV1.roles.addRole'].input,
		output: PipedriveCatalog['apiV1.roles.addRole'].output,
	},
	'apiV1.roles.deleteRole': {
		input: PipedriveCatalog['apiV1.roles.deleteRole'].input,
		output: PipedriveCatalog['apiV1.roles.deleteRole'].output,
	},
	'apiV1.roles.getRole': {
		input: PipedriveCatalog['apiV1.roles.getRole'].input,
		output: PipedriveCatalog['apiV1.roles.getRole'].output,
	},
	'apiV1.roles.updateRole': {
		input: PipedriveCatalog['apiV1.roles.updateRole'].input,
		output: PipedriveCatalog['apiV1.roles.updateRole'].output,
	},
	'apiV1.roles.deleteRoleAssignment': {
		input: PipedriveCatalog['apiV1.roles.deleteRoleAssignment'].input,
		output: PipedriveCatalog['apiV1.roles.deleteRoleAssignment'].output,
	},
	'apiV1.roles.getRoleAssignments': {
		input: PipedriveCatalog['apiV1.roles.getRoleAssignments'].input,
		output: PipedriveCatalog['apiV1.roles.getRoleAssignments'].output,
	},
	'apiV1.roles.addRoleAssignment': {
		input: PipedriveCatalog['apiV1.roles.addRoleAssignment'].input,
		output: PipedriveCatalog['apiV1.roles.addRoleAssignment'].output,
	},
	'apiV1.roles.getRoleSettings': {
		input: PipedriveCatalog['apiV1.roles.getRoleSettings'].input,
		output: PipedriveCatalog['apiV1.roles.getRoleSettings'].output,
	},
	'apiV1.roles.addOrUpdateRoleSetting': {
		input: PipedriveCatalog['apiV1.roles.addOrUpdateRoleSetting'].input,
		output: PipedriveCatalog['apiV1.roles.addOrUpdateRoleSetting'].output,
	},
	'apiV1.roles.getRolePipelines': {
		input: PipedriveCatalog['apiV1.roles.getRolePipelines'].input,
		output: PipedriveCatalog['apiV1.roles.getRolePipelines'].output,
	},
	'apiV1.roles.updateRolePipelines': {
		input: PipedriveCatalog['apiV1.roles.updateRolePipelines'].input,
		output: PipedriveCatalog['apiV1.roles.updateRolePipelines'].output,
	},
	'apiV1.stages.getStageDeals': {
		input: PipedriveCatalog['apiV1.stages.getStageDeals'].input,
		output: PipedriveCatalog['apiV1.stages.getStageDeals'].output,
	},
	'apiV1.tasks.getTasks': {
		input: PipedriveCatalog['apiV1.tasks.getTasks'].input,
		output: PipedriveCatalog['apiV1.tasks.getTasks'].output,
	},
	'apiV1.tasks.addTask': {
		input: PipedriveCatalog['apiV1.tasks.addTask'].input,
		output: PipedriveCatalog['apiV1.tasks.addTask'].output,
	},
	'apiV1.tasks.getTask': {
		input: PipedriveCatalog['apiV1.tasks.getTask'].input,
		output: PipedriveCatalog['apiV1.tasks.getTask'].output,
	},
	'apiV1.tasks.updateTask': {
		input: PipedriveCatalog['apiV1.tasks.updateTask'].input,
		output: PipedriveCatalog['apiV1.tasks.updateTask'].output,
	},
	'apiV1.tasks.deleteTask': {
		input: PipedriveCatalog['apiV1.tasks.deleteTask'].input,
		output: PipedriveCatalog['apiV1.tasks.deleteTask'].output,
	},
	'apiV1.users.getUsers': {
		input: PipedriveCatalog['apiV1.users.getUsers'].input,
		output: PipedriveCatalog['apiV1.users.getUsers'].output,
	},
	'apiV1.users.addUser': {
		input: PipedriveCatalog['apiV1.users.addUser'].input,
		output: PipedriveCatalog['apiV1.users.addUser'].output,
	},
	'apiV1.users.findUsersByName': {
		input: PipedriveCatalog['apiV1.users.findUsersByName'].input,
		output: PipedriveCatalog['apiV1.users.findUsersByName'].output,
	},
	'apiV1.users.getCurrentUser': {
		input: PipedriveCatalog['apiV1.users.getCurrentUser'].input,
		output: PipedriveCatalog['apiV1.users.getCurrentUser'].output,
	},
	'apiV1.users.getUser': {
		input: PipedriveCatalog['apiV1.users.getUser'].input,
		output: PipedriveCatalog['apiV1.users.getUser'].output,
	},
	'apiV1.users.updateUser': {
		input: PipedriveCatalog['apiV1.users.updateUser'].input,
		output: PipedriveCatalog['apiV1.users.updateUser'].output,
	},
	'apiV1.users.getUserFollowers': {
		input: PipedriveCatalog['apiV1.users.getUserFollowers'].input,
		output: PipedriveCatalog['apiV1.users.getUserFollowers'].output,
	},
	'apiV1.users.getUserPermissions': {
		input: PipedriveCatalog['apiV1.users.getUserPermissions'].input,
		output: PipedriveCatalog['apiV1.users.getUserPermissions'].output,
	},
	'apiV1.users.getUserRoleAssignments': {
		input: PipedriveCatalog['apiV1.users.getUserRoleAssignments'].input,
		output: PipedriveCatalog['apiV1.users.getUserRoleAssignments'].output,
	},
	'apiV1.users.getUserRoleSettings': {
		input: PipedriveCatalog['apiV1.users.getUserRoleSettings'].input,
		output: PipedriveCatalog['apiV1.users.getUserRoleSettings'].output,
	},
	'apiV1.userConnections.getUserConnections': {
		input: PipedriveCatalog['apiV1.userConnections.getUserConnections'].input,
		output: PipedriveCatalog['apiV1.userConnections.getUserConnections'].output,
	},
	'apiV1.userSettings.getUserSettings': {
		input: PipedriveCatalog['apiV1.userSettings.getUserSettings'].input,
		output: PipedriveCatalog['apiV1.userSettings.getUserSettings'].output,
	},
	'apiV2.activityFields.getActivityFields': {
		input: PipedriveCatalog['apiV2.activityFields.getActivityFields'].input,
		output: PipedriveCatalog['apiV2.activityFields.getActivityFields'].output,
	},
	'apiV2.activityFields.getActivityField': {
		input: PipedriveCatalog['apiV2.activityFields.getActivityField'].input,
		output: PipedriveCatalog['apiV2.activityFields.getActivityField'].output,
	},
	'apiV2.deals.getArchivedDeals': {
		input: PipedriveCatalog['apiV2.deals.getArchivedDeals'].input,
		output: PipedriveCatalog['apiV2.deals.getArchivedDeals'].output,
	},
	'apiV2.deals.getDealFollowers': {
		input: PipedriveCatalog['apiV2.deals.getDealFollowers'].input,
		output: PipedriveCatalog['apiV2.deals.getDealFollowers'].output,
	},
	'apiV2.deals.addDealFollower': {
		input: PipedriveCatalog['apiV2.deals.addDealFollower'].input,
		output: PipedriveCatalog['apiV2.deals.addDealFollower'].output,
	},
	'apiV2.deals.getDealFollowersChangelog': {
		input: PipedriveCatalog['apiV2.deals.getDealFollowersChangelog'].input,
		output: PipedriveCatalog['apiV2.deals.getDealFollowersChangelog'].output,
	},
	'apiV2.deals.deleteDealFollower': {
		input: PipedriveCatalog['apiV2.deals.deleteDealFollower'].input,
		output: PipedriveCatalog['apiV2.deals.deleteDealFollower'].output,
	},
	'apiV2.dealProducts.getDealsProducts': {
		input: PipedriveCatalog['apiV2.dealProducts.getDealsProducts'].input,
		output: PipedriveCatalog['apiV2.dealProducts.getDealsProducts'].output,
	},
	'apiV2.deals.searchDeals': {
		input: PipedriveCatalog['apiV2.deals.searchDeals'].input,
		output: PipedriveCatalog['apiV2.deals.searchDeals'].output,
	},
	'apiV2.dealProducts.getDealProducts': {
		input: PipedriveCatalog['apiV2.dealProducts.getDealProducts'].input,
		output: PipedriveCatalog['apiV2.dealProducts.getDealProducts'].output,
	},
	'apiV2.dealProducts.addDealProduct': {
		input: PipedriveCatalog['apiV2.dealProducts.addDealProduct'].input,
		output: PipedriveCatalog['apiV2.dealProducts.addDealProduct'].output,
	},
	'apiV2.dealProducts.deleteManyDealProducts': {
		input: PipedriveCatalog['apiV2.dealProducts.deleteManyDealProducts'].input,
		output:
			PipedriveCatalog['apiV2.dealProducts.deleteManyDealProducts'].output,
	},
	'apiV2.dealProducts.updateDealProduct': {
		input: PipedriveCatalog['apiV2.dealProducts.updateDealProduct'].input,
		output: PipedriveCatalog['apiV2.dealProducts.updateDealProduct'].output,
	},
	'apiV2.dealProducts.deleteDealProduct': {
		input: PipedriveCatalog['apiV2.dealProducts.deleteDealProduct'].input,
		output: PipedriveCatalog['apiV2.dealProducts.deleteDealProduct'].output,
	},
	'apiV2.dealProducts.addManyDealProducts': {
		input: PipedriveCatalog['apiV2.dealProducts.addManyDealProducts'].input,
		output: PipedriveCatalog['apiV2.dealProducts.addManyDealProducts'].output,
	},
	'apiV2.deals.getAdditionalDiscounts': {
		input: PipedriveCatalog['apiV2.deals.getAdditionalDiscounts'].input,
		output: PipedriveCatalog['apiV2.deals.getAdditionalDiscounts'].output,
	},
	'apiV2.deals.postAdditionalDiscount': {
		input: PipedriveCatalog['apiV2.deals.postAdditionalDiscount'].input,
		output: PipedriveCatalog['apiV2.deals.postAdditionalDiscount'].output,
	},
	'apiV2.deals.updateAdditionalDiscount': {
		input: PipedriveCatalog['apiV2.deals.updateAdditionalDiscount'].input,
		output: PipedriveCatalog['apiV2.deals.updateAdditionalDiscount'].output,
	},
	'apiV2.deals.deleteAdditionalDiscount': {
		input: PipedriveCatalog['apiV2.deals.deleteAdditionalDiscount'].input,
		output: PipedriveCatalog['apiV2.deals.deleteAdditionalDiscount'].output,
	},
	'apiV2.dealInstallments.getInstallments': {
		input: PipedriveCatalog['apiV2.dealInstallments.getInstallments'].input,
		output: PipedriveCatalog['apiV2.dealInstallments.getInstallments'].output,
	},
	'apiV2.dealInstallments.postInstallment': {
		input: PipedriveCatalog['apiV2.dealInstallments.postInstallment'].input,
		output: PipedriveCatalog['apiV2.dealInstallments.postInstallment'].output,
	},
	'apiV2.dealInstallments.updateInstallment': {
		input: PipedriveCatalog['apiV2.dealInstallments.updateInstallment'].input,
		output: PipedriveCatalog['apiV2.dealInstallments.updateInstallment'].output,
	},
	'apiV2.dealInstallments.deleteInstallment': {
		input: PipedriveCatalog['apiV2.dealInstallments.deleteInstallment'].input,
		output: PipedriveCatalog['apiV2.dealInstallments.deleteInstallment'].output,
	},
	'apiV2.deals.convertDealToLead': {
		input: PipedriveCatalog['apiV2.deals.convertDealToLead'].input,
		output: PipedriveCatalog['apiV2.deals.convertDealToLead'].output,
	},
	'apiV2.dealFields.getDealFields': {
		input: PipedriveCatalog['apiV2.dealFields.getDealFields'].input,
		output: PipedriveCatalog['apiV2.dealFields.getDealFields'].output,
	},
	'apiV2.dealFields.addDealField': {
		input: PipedriveCatalog['apiV2.dealFields.addDealField'].input,
		output: PipedriveCatalog['apiV2.dealFields.addDealField'].output,
	},
	'apiV2.dealFields.getDealField': {
		input: PipedriveCatalog['apiV2.dealFields.getDealField'].input,
		output: PipedriveCatalog['apiV2.dealFields.getDealField'].output,
	},
	'apiV2.dealFields.updateDealField': {
		input: PipedriveCatalog['apiV2.dealFields.updateDealField'].input,
		output: PipedriveCatalog['apiV2.dealFields.updateDealField'].output,
	},
	'apiV2.dealFields.deleteDealField': {
		input: PipedriveCatalog['apiV2.dealFields.deleteDealField'].input,
		output: PipedriveCatalog['apiV2.dealFields.deleteDealField'].output,
	},
	'apiV2.dealFields.addDealFieldOptions': {
		input: PipedriveCatalog['apiV2.dealFields.addDealFieldOptions'].input,
		output: PipedriveCatalog['apiV2.dealFields.addDealFieldOptions'].output,
	},
	'apiV2.dealFields.deleteDealFieldOptions': {
		input: PipedriveCatalog['apiV2.dealFields.deleteDealFieldOptions'].input,
		output: PipedriveCatalog['apiV2.dealFields.deleteDealFieldOptions'].output,
	},
	'apiV2.dealFields.updateDealFieldOptions': {
		input: PipedriveCatalog['apiV2.dealFields.updateDealFieldOptions'].input,
		output: PipedriveCatalog['apiV2.dealFields.updateDealFieldOptions'].output,
	},
	'apiV2.deals.getDealConversionStatus': {
		input: PipedriveCatalog['apiV2.deals.getDealConversionStatus'].input,
		output: PipedriveCatalog['apiV2.deals.getDealConversionStatus'].output,
	},
	'apiV2.persons.getPersonFollowers': {
		input: PipedriveCatalog['apiV2.persons.getPersonFollowers'].input,
		output: PipedriveCatalog['apiV2.persons.getPersonFollowers'].output,
	},
	'apiV2.persons.addPersonFollower': {
		input: PipedriveCatalog['apiV2.persons.addPersonFollower'].input,
		output: PipedriveCatalog['apiV2.persons.addPersonFollower'].output,
	},
	'apiV2.persons.getPersonFollowersChangelog': {
		input: PipedriveCatalog['apiV2.persons.getPersonFollowersChangelog'].input,
		output:
			PipedriveCatalog['apiV2.persons.getPersonFollowersChangelog'].output,
	},
	'apiV2.persons.deletePersonFollower': {
		input: PipedriveCatalog['apiV2.persons.deletePersonFollower'].input,
		output: PipedriveCatalog['apiV2.persons.deletePersonFollower'].output,
	},
	'apiV2.persons.getPersonPicture': {
		input: PipedriveCatalog['apiV2.persons.getPersonPicture'].input,
		output: PipedriveCatalog['apiV2.persons.getPersonPicture'].output,
	},
	'apiV2.personFields.getPersonFields': {
		input: PipedriveCatalog['apiV2.personFields.getPersonFields'].input,
		output: PipedriveCatalog['apiV2.personFields.getPersonFields'].output,
	},
	'apiV2.personFields.addPersonField': {
		input: PipedriveCatalog['apiV2.personFields.addPersonField'].input,
		output: PipedriveCatalog['apiV2.personFields.addPersonField'].output,
	},
	'apiV2.personFields.getPersonField': {
		input: PipedriveCatalog['apiV2.personFields.getPersonField'].input,
		output: PipedriveCatalog['apiV2.personFields.getPersonField'].output,
	},
	'apiV2.personFields.updatePersonField': {
		input: PipedriveCatalog['apiV2.personFields.updatePersonField'].input,
		output: PipedriveCatalog['apiV2.personFields.updatePersonField'].output,
	},
	'apiV2.personFields.deletePersonField': {
		input: PipedriveCatalog['apiV2.personFields.deletePersonField'].input,
		output: PipedriveCatalog['apiV2.personFields.deletePersonField'].output,
	},
	'apiV2.personFields.addPersonFieldOptions': {
		input: PipedriveCatalog['apiV2.personFields.addPersonFieldOptions'].input,
		output: PipedriveCatalog['apiV2.personFields.addPersonFieldOptions'].output,
	},
	'apiV2.personFields.deletePersonFieldOptions': {
		input:
			PipedriveCatalog['apiV2.personFields.deletePersonFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.personFields.deletePersonFieldOptions'].output,
	},
	'apiV2.personFields.updatePersonFieldOptions': {
		input:
			PipedriveCatalog['apiV2.personFields.updatePersonFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.personFields.updatePersonFieldOptions'].output,
	},
	'apiV2.organizations.getOrganizationFollowers': {
		input:
			PipedriveCatalog['apiV2.organizations.getOrganizationFollowers'].input,
		output:
			PipedriveCatalog['apiV2.organizations.getOrganizationFollowers'].output,
	},
	'apiV2.organizations.addOrganizationFollower': {
		input:
			PipedriveCatalog['apiV2.organizations.addOrganizationFollower'].input,
		output:
			PipedriveCatalog['apiV2.organizations.addOrganizationFollower'].output,
	},
	'apiV2.organizations.getOrganizationFollowersChangelog': {
		input:
			PipedriveCatalog['apiV2.organizations.getOrganizationFollowersChangelog']
				.input,
		output:
			PipedriveCatalog['apiV2.organizations.getOrganizationFollowersChangelog']
				.output,
	},
	'apiV2.organizations.deleteOrganizationFollower': {
		input:
			PipedriveCatalog['apiV2.organizations.deleteOrganizationFollower'].input,
		output:
			PipedriveCatalog['apiV2.organizations.deleteOrganizationFollower'].output,
	},
	'apiV2.organizationFields.getOrganizationFields': {
		input:
			PipedriveCatalog['apiV2.organizationFields.getOrganizationFields'].input,
		output:
			PipedriveCatalog['apiV2.organizationFields.getOrganizationFields'].output,
	},
	'apiV2.organizationFields.addOrganizationField': {
		input:
			PipedriveCatalog['apiV2.organizationFields.addOrganizationField'].input,
		output:
			PipedriveCatalog['apiV2.organizationFields.addOrganizationField'].output,
	},
	'apiV2.organizationFields.getOrganizationField': {
		input:
			PipedriveCatalog['apiV2.organizationFields.getOrganizationField'].input,
		output:
			PipedriveCatalog['apiV2.organizationFields.getOrganizationField'].output,
	},
	'apiV2.organizationFields.updateOrganizationField': {
		input:
			PipedriveCatalog['apiV2.organizationFields.updateOrganizationField']
				.input,
		output:
			PipedriveCatalog['apiV2.organizationFields.updateOrganizationField']
				.output,
	},
	'apiV2.organizationFields.deleteOrganizationField': {
		input:
			PipedriveCatalog['apiV2.organizationFields.deleteOrganizationField']
				.input,
		output:
			PipedriveCatalog['apiV2.organizationFields.deleteOrganizationField']
				.output,
	},
	'apiV2.organizationFields.addOrganizationFieldOptions': {
		input:
			PipedriveCatalog['apiV2.organizationFields.addOrganizationFieldOptions']
				.input,
		output:
			PipedriveCatalog['apiV2.organizationFields.addOrganizationFieldOptions']
				.output,
	},
	'apiV2.organizationFields.deleteOrganizationFieldOptions': {
		input:
			PipedriveCatalog[
				'apiV2.organizationFields.deleteOrganizationFieldOptions'
			].input,
		output:
			PipedriveCatalog[
				'apiV2.organizationFields.deleteOrganizationFieldOptions'
			].output,
	},
	'apiV2.organizationFields.updateOrganizationFieldOptions': {
		input:
			PipedriveCatalog[
				'apiV2.organizationFields.updateOrganizationFieldOptions'
			].input,
		output:
			PipedriveCatalog[
				'apiV2.organizationFields.updateOrganizationFieldOptions'
			].output,
	},
	'apiV2.productFields.getProductFields': {
		input: PipedriveCatalog['apiV2.productFields.getProductFields'].input,
		output: PipedriveCatalog['apiV2.productFields.getProductFields'].output,
	},
	'apiV2.productFields.addProductField': {
		input: PipedriveCatalog['apiV2.productFields.addProductField'].input,
		output: PipedriveCatalog['apiV2.productFields.addProductField'].output,
	},
	'apiV2.productFields.getProductField': {
		input: PipedriveCatalog['apiV2.productFields.getProductField'].input,
		output: PipedriveCatalog['apiV2.productFields.getProductField'].output,
	},
	'apiV2.productFields.updateProductField': {
		input: PipedriveCatalog['apiV2.productFields.updateProductField'].input,
		output: PipedriveCatalog['apiV2.productFields.updateProductField'].output,
	},
	'apiV2.productFields.deleteProductField': {
		input: PipedriveCatalog['apiV2.productFields.deleteProductField'].input,
		output: PipedriveCatalog['apiV2.productFields.deleteProductField'].output,
	},
	'apiV2.productFields.addProductFieldOptions': {
		input: PipedriveCatalog['apiV2.productFields.addProductFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.productFields.addProductFieldOptions'].output,
	},
	'apiV2.productFields.deleteProductFieldOptions': {
		input:
			PipedriveCatalog['apiV2.productFields.deleteProductFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.productFields.deleteProductFieldOptions'].output,
	},
	'apiV2.productFields.updateProductFieldOptions': {
		input:
			PipedriveCatalog['apiV2.productFields.updateProductFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.productFields.updateProductFieldOptions'].output,
	},
	'apiV2.leads.searchLeads': {
		input: PipedriveCatalog['apiV2.leads.searchLeads'].input,
		output: PipedriveCatalog['apiV2.leads.searchLeads'].output,
	},
	'apiV2.leads.convertLeadToDeal': {
		input: PipedriveCatalog['apiV2.leads.convertLeadToDeal'].input,
		output: PipedriveCatalog['apiV2.leads.convertLeadToDeal'].output,
	},
	'apiV2.leads.getLeadConversionStatus': {
		input: PipedriveCatalog['apiV2.leads.getLeadConversionStatus'].input,
		output: PipedriveCatalog['apiV2.leads.getLeadConversionStatus'].output,
	},
	'apiV2.organizations.searchOrganization': {
		input: PipedriveCatalog['apiV2.organizations.searchOrganization'].input,
		output: PipedriveCatalog['apiV2.organizations.searchOrganization'].output,
	},
	'apiV2.persons.searchPersons': {
		input: PipedriveCatalog['apiV2.persons.searchPersons'].input,
		output: PipedriveCatalog['apiV2.persons.searchPersons'].output,
	},
	'apiV2.itemSearch.searchItem': {
		input: PipedriveCatalog['apiV2.itemSearch.searchItem'].input,
		output: PipedriveCatalog['apiV2.itemSearch.searchItem'].output,
	},
	'apiV2.itemSearch.searchItemByField': {
		input: PipedriveCatalog['apiV2.itemSearch.searchItemByField'].input,
		output: PipedriveCatalog['apiV2.itemSearch.searchItemByField'].output,
	},
	'apiV2.stages.getStages': {
		input: PipedriveCatalog['apiV2.stages.getStages'].input,
		output: PipedriveCatalog['apiV2.stages.getStages'].output,
	},
	'apiV2.stages.addStage': {
		input: PipedriveCatalog['apiV2.stages.addStage'].input,
		output: PipedriveCatalog['apiV2.stages.addStage'].output,
	},
	'apiV2.stages.deleteStage': {
		input: PipedriveCatalog['apiV2.stages.deleteStage'].input,
		output: PipedriveCatalog['apiV2.stages.deleteStage'].output,
	},
	'apiV2.stages.getStage': {
		input: PipedriveCatalog['apiV2.stages.getStage'].input,
		output: PipedriveCatalog['apiV2.stages.getStage'].output,
	},
	'apiV2.stages.updateStage': {
		input: PipedriveCatalog['apiV2.stages.updateStage'].input,
		output: PipedriveCatalog['apiV2.stages.updateStage'].output,
	},
	'apiV2.pipelines.getPipelines': {
		input: PipedriveCatalog['apiV2.pipelines.getPipelines'].input,
		output: PipedriveCatalog['apiV2.pipelines.getPipelines'].output,
	},
	'apiV2.pipelines.addPipeline': {
		input: PipedriveCatalog['apiV2.pipelines.addPipeline'].input,
		output: PipedriveCatalog['apiV2.pipelines.addPipeline'].output,
	},
	'apiV2.pipelines.deletePipeline': {
		input: PipedriveCatalog['apiV2.pipelines.deletePipeline'].input,
		output: PipedriveCatalog['apiV2.pipelines.deletePipeline'].output,
	},
	'apiV2.pipelines.getPipeline': {
		input: PipedriveCatalog['apiV2.pipelines.getPipeline'].input,
		output: PipedriveCatalog['apiV2.pipelines.getPipeline'].output,
	},
	'apiV2.pipelines.updatePipeline': {
		input: PipedriveCatalog['apiV2.pipelines.updatePipeline'].input,
		output: PipedriveCatalog['apiV2.pipelines.updatePipeline'].output,
	},
	'apiV2.projectFields.getProjectFields': {
		input: PipedriveCatalog['apiV2.projectFields.getProjectFields'].input,
		output: PipedriveCatalog['apiV2.projectFields.getProjectFields'].output,
	},
	'apiV2.projectFields.addProjectField': {
		input: PipedriveCatalog['apiV2.projectFields.addProjectField'].input,
		output: PipedriveCatalog['apiV2.projectFields.addProjectField'].output,
	},
	'apiV2.projectFields.getProjectField': {
		input: PipedriveCatalog['apiV2.projectFields.getProjectField'].input,
		output: PipedriveCatalog['apiV2.projectFields.getProjectField'].output,
	},
	'apiV2.projectFields.updateProjectField': {
		input: PipedriveCatalog['apiV2.projectFields.updateProjectField'].input,
		output: PipedriveCatalog['apiV2.projectFields.updateProjectField'].output,
	},
	'apiV2.projectFields.deleteProjectField': {
		input: PipedriveCatalog['apiV2.projectFields.deleteProjectField'].input,
		output: PipedriveCatalog['apiV2.projectFields.deleteProjectField'].output,
	},
	'apiV2.projectFields.addProjectFieldOptions': {
		input: PipedriveCatalog['apiV2.projectFields.addProjectFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.projectFields.addProjectFieldOptions'].output,
	},
	'apiV2.projectFields.deleteProjectFieldOptions': {
		input:
			PipedriveCatalog['apiV2.projectFields.deleteProjectFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.projectFields.deleteProjectFieldOptions'].output,
	},
	'apiV2.projectFields.updateProjectFieldOptions': {
		input:
			PipedriveCatalog['apiV2.projectFields.updateProjectFieldOptions'].input,
		output:
			PipedriveCatalog['apiV2.projectFields.updateProjectFieldOptions'].output,
	},
	'apiV2.projects.getProjects': {
		input: PipedriveCatalog['apiV2.projects.getProjects'].input,
		output: PipedriveCatalog['apiV2.projects.getProjects'].output,
	},
	'apiV2.projects.addProject': {
		input: PipedriveCatalog['apiV2.projects.addProject'].input,
		output: PipedriveCatalog['apiV2.projects.addProject'].output,
	},
	'apiV2.projects.getArchivedProjects': {
		input: PipedriveCatalog['apiV2.projects.getArchivedProjects'].input,
		output: PipedriveCatalog['apiV2.projects.getArchivedProjects'].output,
	},
	'apiV2.projects.getProject': {
		input: PipedriveCatalog['apiV2.projects.getProject'].input,
		output: PipedriveCatalog['apiV2.projects.getProject'].output,
	},
	'apiV2.projects.updateProject': {
		input: PipedriveCatalog['apiV2.projects.updateProject'].input,
		output: PipedriveCatalog['apiV2.projects.updateProject'].output,
	},
	'apiV2.projects.deleteProject': {
		input: PipedriveCatalog['apiV2.projects.deleteProject'].input,
		output: PipedriveCatalog['apiV2.projects.deleteProject'].output,
	},
	'apiV2.projectTemplates.getProjectTemplates': {
		input: PipedriveCatalog['apiV2.projectTemplates.getProjectTemplates'].input,
		output:
			PipedriveCatalog['apiV2.projectTemplates.getProjectTemplates'].output,
	},
	'apiV2.projectTemplates.getProjectTemplate': {
		input: PipedriveCatalog['apiV2.projectTemplates.getProjectTemplate'].input,
		output:
			PipedriveCatalog['apiV2.projectTemplates.getProjectTemplate'].output,
	},
	'apiV2.projects.searchProjects': {
		input: PipedriveCatalog['apiV2.projects.searchProjects'].input,
		output: PipedriveCatalog['apiV2.projects.searchProjects'].output,
	},
	'apiV2.projects.archiveProject': {
		input: PipedriveCatalog['apiV2.projects.archiveProject'].input,
		output: PipedriveCatalog['apiV2.projects.archiveProject'].output,
	},
	'apiV2.projects.getProjectUsers': {
		input: PipedriveCatalog['apiV2.projects.getProjectUsers'].input,
		output: PipedriveCatalog['apiV2.projects.getProjectUsers'].output,
	},
	'apiV2.projects.getProjectChangelog': {
		input: PipedriveCatalog['apiV2.projects.getProjectChangelog'].input,
		output: PipedriveCatalog['apiV2.projects.getProjectChangelog'].output,
	},
	'apiV2.projectBoards.getProjectsBoards': {
		input: PipedriveCatalog['apiV2.projectBoards.getProjectsBoards'].input,
		output: PipedriveCatalog['apiV2.projectBoards.getProjectsBoards'].output,
	},
	'apiV2.projectBoards.addProjectBoard': {
		input: PipedriveCatalog['apiV2.projectBoards.addProjectBoard'].input,
		output: PipedriveCatalog['apiV2.projectBoards.addProjectBoard'].output,
	},
	'apiV2.projectBoards.getProjectsBoard': {
		input: PipedriveCatalog['apiV2.projectBoards.getProjectsBoard'].input,
		output: PipedriveCatalog['apiV2.projectBoards.getProjectsBoard'].output,
	},
	'apiV2.projectBoards.updateProjectBoard': {
		input: PipedriveCatalog['apiV2.projectBoards.updateProjectBoard'].input,
		output: PipedriveCatalog['apiV2.projectBoards.updateProjectBoard'].output,
	},
	'apiV2.projectBoards.deleteProjectBoard': {
		input: PipedriveCatalog['apiV2.projectBoards.deleteProjectBoard'].input,
		output: PipedriveCatalog['apiV2.projectBoards.deleteProjectBoard'].output,
	},
	'apiV2.projectPhases.getProjectsPhases': {
		input: PipedriveCatalog['apiV2.projectPhases.getProjectsPhases'].input,
		output: PipedriveCatalog['apiV2.projectPhases.getProjectsPhases'].output,
	},
	'apiV2.projectPhases.addProjectPhase': {
		input: PipedriveCatalog['apiV2.projectPhases.addProjectPhase'].input,
		output: PipedriveCatalog['apiV2.projectPhases.addProjectPhase'].output,
	},
	'apiV2.projectPhases.getProjectsPhase': {
		input: PipedriveCatalog['apiV2.projectPhases.getProjectsPhase'].input,
		output: PipedriveCatalog['apiV2.projectPhases.getProjectsPhase'].output,
	},
	'apiV2.projectPhases.updateProjectPhase': {
		input: PipedriveCatalog['apiV2.projectPhases.updateProjectPhase'].input,
		output: PipedriveCatalog['apiV2.projectPhases.updateProjectPhase'].output,
	},
	'apiV2.projectPhases.deleteProjectPhase': {
		input: PipedriveCatalog['apiV2.projectPhases.deleteProjectPhase'].input,
		output: PipedriveCatalog['apiV2.projectPhases.deleteProjectPhase'].output,
	},
	'apiV2.users.getUserFollowers': {
		input: PipedriveCatalog['apiV2.users.getUserFollowers'].input,
		output: PipedriveCatalog['apiV2.users.getUserFollowers'].output,
	},
} as const;

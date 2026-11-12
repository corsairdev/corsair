import { z } from 'zod';

// Thanks.io examples return null for fields the general recipient schema describes as strings.
const nullableString = z.string().nullable().optional();
export const recipientSchema = z
	.object({
		id: z.number().int().optional(),
		mailing_list_id: z.number().int().optional(),
		name: nullableString,
		company: nullableString,
		address: nullableString,
		address2: nullableString,
		city: nullableString,
		province: nullableString,
		postal_code: nullableString,
		country: nullableString,
		dob: nullableString,
		anniversary: nullableString,
		email: nullableString,
		phone: nullableString,
		custom1: nullableString,
		custom2: nullableString,
		custom3: nullableString,
		custom4: nullableString,
		custom5: nullableString,
		custom6: nullableString,
		custom7: nullableString,
		custom8: nullableString,
		custom9: nullableString,
		custom10: nullableString,
		absentee_address: nullableString,
		created_at: nullableString,
		updated_at: nullableString,
		// The bulk-create example includes an error for individual failures.
		error: z.string().optional(),
	})
	.passthrough();

const recipientBody = recipientSchema
	.omit({ id: true, created_at: true, updated_at: true, error: true })
	.extend({
		absentee_city: nullableString,
		absentee_province: nullableString,
		absentee_postal_code: nullableString,
	});
const createBody = recipientBody
	.extend({ mailing_list_id: z.number().int() })
	.refine((value) => value.address != null || value.email != null, {
		message: 'address or email is required',
	});
// The bulk endpoint's published example uses mailing_list instead of mailing_list_id.
const bulkCreateBody = recipientBody
	.extend({
		mailing_list: z.number().int().optional(),
	})
	.refine(
		(value) =>
			(value.mailing_list_id != null || value.mailing_list != null) &&
			(value.address != null || value.email != null),
		{ message: 'a mailing list and address or email are required' },
	);
const recipientId = z.object({ recipientId: z.number().int().nonnegative() });
const emptyResponse = z.object({}).passthrough();
const deleteByAddressBody = z
	.object({
		mailing_list_id: z.number().int(),
		address: z.string().optional(),
		address2: z.string().optional(),
		city: z.string().optional(),
		province: z.string().optional(),
		postal_code: z.string().optional(),
		country: z.string().optional(),
		email: z.string().optional(),
	})
	.refine(
		(value) =>
			value.email !== undefined ||
			(value.address !== undefined && value.postal_code !== undefined),
		{
			message: 'email or address and postal_code are required',
		},
	);

const mailingListSchema = z
	.object({
		id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		sub_account_id: z.number().int().nullable().optional(),
		type: z.string().optional(),
		description: z.string().optional(),
		qrcode_url: nullableString,
		total_recipients: z.number().int().optional(),
		processed: z.boolean().optional(),
		is_suppression_list: z.boolean().optional(),
		total_scans: z.number().int().optional(),
		unique_scans: z.number().int().optional(),
		last_scan: nullableString,
		total_sends: z.number().int().optional(),
		last_send: nullableString,
		api_key: z.string().optional(),
		created_at: z.string().optional(),
		created_at_diff: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const paginationNumber = z.union([z.number().int(), z.string()]);
const paginationMeta = z
	.object({
		current_page: z.number().int().optional(),
		from: z.number().int().nullable().optional(),
		last_page: z.number().int().optional(),
		path: z.string().optional(),
		per_page: paginationNumber.optional(),
		to: z.number().int().nullable().optional(),
		total: z.number().int().optional(),
	})
	.passthrough();
const pageLinks = z
	.object({
		first: nullableString,
		last: nullableString,
		prev: nullableString,
		next: nullableString,
	})
	.passthrough();
const paginatedRecipients = paginationMeta.extend({
	data: z.array(recipientSchema).optional(),
	first_page_url: nullableString,
	last_page_url: nullableString,
	next_page_url: nullableString,
	prev_page_url: nullableString,
});
const recordTypes = z.enum([
	'all',
	'likelytomove',
	'apartmentcomplex',
	'likelytodownsize',
	'likelytorefi',
	'absenteeowner',
	'highnetworth',
	'majorityhomeequity',
	'homefreeclear',
	'underwater',
	'kidsinhousehold',
	'newhomeowner',
	'firsttimehomebuyer',
	'renters',
	'retiring',
	'retired',
	'pool',
	'onlybusinesses',
	'newbusiness',
]);
const radiusBody = z.object({
	address: z.string(),
	postal_code: z.string(),
	record_count: z.number().int().min(1).max(10000),
	record_types: recordTypes.optional(),
	include_condos: z.boolean().optional(),
});
const listId = z.object({ mailingListId: z.number().int().nonnegative() });
const radiusResult = z
	.object({
		message: z.string().optional(),
		status: z.string().optional(),
		mailing_list_id: z.number().int().optional(),
		count: z.number().int().optional(),
		failure: z.boolean().optional(),
	})
	.passthrough();
const webhookType = z.enum([
	'order_item.status_update',
	'order.status_update',
	'order_item.delivered',
	'scans.scan_update',
	'scan_board.status_update',
]);
const scanBoardStatus = z.enum(['new', 'contacted', 'follow_up', 'done']);
const webhookBody = z.object({
	url: z.string(),
	type: webhookType,
	verb: z.string(),
	scan_board_status: scanBoardStatus.nullable().optional(),
	description: nullableString,
});
const webhookSchema = webhookBody
	.partial()
	.extend({
		id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		mailing_list_id: z.number().int().nullable().optional(),
		invoke_count: z.number().int().optional(),
		created_at: nullableString,
		updated_at: z.string().optional(),
		deleted_at: nullableString,
	})
	.passthrough();
const webhookId = z.object({ webhookId: z.number().int().nonnegative() });
const subAccountBody = z.object({
	title: z.string(),
	return_name: z.string().optional(),
	return_address: z.string().optional(),
	return_address2: z.string().optional(),
	return_city: z.string().optional(),
	return_state: z.string().optional(),
	return_postal_code: z.string().optional(),
});
const subAccountSchema = subAccountBody
	.partial()
	.extend({
		id: z.number().int().optional(),
		user_id: z.number().int().optional(),
	})
	.passthrough();
const subAccountId = z.object({ subAccountId: z.number().int().nonnegative() });
const mailerType = z.enum([
	'postcard',
	'postcard6x9',
	'postcard6x11',
	'letter',
	'windowlessletter',
	'notecard',
	'giftcard',
	'magnacard',
]);
const messageTemplateBody = z.object({
	type: mailerType.optional(),
	name: z.string().optional(),
	handwriting_style_id: z.number().int().optional(),
	font_color: z.string().optional(),
	handwriting_realism: z.boolean().optional(),
	content: z.string().optional(),
	sub_account_id: z.number().int().nullable().optional(),
	additional_pages: z.string().optional(),
	pdf_only_url: z.string().optional(),
	custom_background_url: z.string().optional(),
	qrcode_url: z.string().optional(),
	cc_emails: z.array(z.string()).optional(),
	giftcard_brand_code: z.string().optional(),
	giftcard_amount: z.number().int().optional(),
	landing_page_url: z.string().optional(),
});
const messageTemplateSchema = z
	.object({
		id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		sub_account_id: z.number().int().nullable().optional(),
		handwriting_style_id: z.number().int().optional(),
		font_size: z.union([z.string(), z.number()]).optional(),
		font_color: z.string().optional(),
		handwriting_realism: z.boolean().optional(),
		name: z.string().optional(),
		content: z.string().optional(),
		additional_pages: nullableString,
		skip_creative_generation: z.union([z.number(), z.boolean()]).optional(),
		custom_background_url: nullableString,
		qrcode_url: nullableString,
		cc_emails: z.array(z.string()).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		type: z.string().optional(),
		giftcard_brand_code: z.string().optional(),
		giftcard_brand_image: nullableString,
		giftcard_amount: z.union([z.string(), z.number()]).optional(),
		landing_page_url: nullableString,
		share_uuid: z.string().optional(),
	})
	.passthrough();
const templateId = z.object({
	messageTemplateId: z.number().int().nonnegative(),
});
const templateQuery = z.object({
	page: z.number().int().positive().optional(),
	items_per_page: z.number().int().positive().optional(),
	sub_account_id: z.number().int().optional(),
	type: mailerType.optional(),
});
const imageTemplateSchema = z
	.object({
		id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		sub_account_id: z.number().int().nullable().optional(),
		type: z.string().optional(),
		name: z.string().optional(),
		image: z.string().optional(),
		is_dynamic: z.boolean().optional(),
		dynamic_image_url: nullableString,
		canva_id: nullableString,
		share_uuid: nullableString,
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const creativeSchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		mailer_type: nullableString,
		postcard_size: nullableString,
		sub_account_id: z.number().int().nullable().optional(),
		source: nullableString,
		hidden: z.boolean().optional(),
		default: z.boolean().optional(),
		preview_image_url: nullableString,
		thumbnail_url: nullableString,
		share_url: nullableString,
		is_complete: z.boolean().optional(),
		needs: z.array(z.string()).optional(),
		// The provider leaves the nested front, message and background object shapes open.
		image_template: z.record(z.string(), z.unknown()).nullable().optional(),
		message_template: z.record(z.string(), z.unknown()).nullable().optional(),
		back_background: z.record(z.string(), z.unknown()).nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const brandSchema = z
	.object({
		brand_code: z.string().optional(),
		title: z.string().optional(),
		image: z.string().optional(),
		available_amounts: z.array(z.number().int()).optional(),
		group: z.string().optional(),
	})
	.passthrough();
const brandGroupSchema = z
	.object({
		title: z.string().optional(),
		brands: z.array(brandSchema).optional(),
	})
	.passthrough();
const flatBrandListSchema = z
	.object({ brands: z.array(brandSchema).optional() })
	.passthrough();
const metadata = z.record(z.string(), z.unknown()).nullable().optional();
const orderSchema = z
	.object({
		id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		sub_account_id: z.number().int().nullable().optional(),
		message: z.string().optional(),
		size: z.string().optional(),
		type: z.string().optional(),
		display_type: z.string().optional(),
		style: z.number().int().optional(),
		front_image: z.string().optional(),
		high_quality_preview: z.string().optional(),
		authorization_total: z.number().int().optional(),
		grand_total: z.number().int().optional(),
		order_total: z.number().int().optional(),
		total_estimated_recipients: z.number().int().optional(),
		total_recipients: z.number().int().optional(),
		recipient_count: z.number().int().optional(),
		status: z.string().optional(),
		method: z.string().optional(),
		cancellable: z.boolean().optional(),
		total_scans: z.number().int().optional(),
		metadata,
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		replayed_from_order_id: z.number().int().optional(),
	})
	.passthrough();
const orderItemSchema = z
	.object({
		id: z.number().int().optional(),
		status: z.string().optional(),
		delivery_date: nullableString,
		scans: z.number().int().optional(),
		failure: nullableString,
		recipient: recipientSchema.optional(),
		giftcard: z
			.object({
				brand: z.string().optional(),
				amount: z.number().int().optional(),
				redeemed_at: nullableString,
				invalidated_at: nullableString,
			})
			.passthrough()
			.nullable()
			.optional(),
		preview: z
			.object({
				front: nullableString,
				back: nullableString,
				pdf: nullableString,
			})
			.passthrough()
			.optional(),
		created_at: z.string().optional(),
	})
	.passthrough();
const safeStringId = z
	.string()
	.min(1)
	.refine(
		(value) =>
			value.trim().length > 0 &&
			value !== '.' &&
			value !== '..' &&
			!/[\\/"']/.test(value),
		{ message: 'invalid route ID' },
	);
const flexibleOrderId = z.union([safeStringId, z.number().int().nonnegative()]);
const replayRecipient = z.object({
	name: z.string().optional(),
	company: z.string().optional(),
	address: z.string(),
	address2: z.string().optional(),
	city: z.string().optional(),
	province: z.string().optional(),
	postal_code: z.string().optional(),
	country: z.string().optional(),
});
const sendRecipient = recipientBody
	.omit({ mailing_list_id: true })
	.refine((value) => value.address != null || value.email != null, {
		message: 'address or email is required',
	});
const sendBase = z.object({
	preview: z.boolean().optional(),
	mailing_list_ids: z.array(z.number().int()).optional(),
	recipients: z.array(sendRecipient).optional(),
	radius_search: z
		.object({
			preview: z.boolean().optional(),
			address: z.string().optional(),
			record_count: z.number().int().min(1).max(10000).optional(),
			record_types: recordTypes.optional(),
			include_condos: z.boolean().optional(),
			append_data: z.boolean().optional(),
			use_property_owner: z.boolean().optional(),
			include_search_address: z.boolean().optional(),
		})
		.optional(),
	handwriting_style_id: z.number().int().optional(),
	handwriting_color: z.string().optional(),
	handwriting_realism: z.boolean().optional(),
	sub_account: z.number().int().optional(),
	notification_emails: z.string().optional(),
	email_lookup: z.boolean().optional(),
	postage_class: z.enum(['first_class', 'standard']).optional(),
	return_name: z.string().optional(),
	return_address: z.string().optional(),
	return_address2: z.string().optional(),
	return_city: z.string().optional(),
	return_state: z.string().optional(),
	return_postal_code: z.string().optional(),
	metadata,
	creative_id: z.number().int().optional(),
	image_template_id: z.number().int().optional(),
	front_image_url: z.string().optional(),
	message: z.string().optional(),
	message_template_id: z.number().int().optional(),
});
const postcardBody = sendBase.extend({
	use_custom_background: z.boolean().optional(),
	custom_background_image: z.string().optional(),
	qrcode_url: z.string().optional(),
	size: z.enum(['4x6', '6x9', '6x11']).optional(),
});
const magnacardBody = sendBase.extend({
	use_custom_background: z.boolean().optional(),
	custom_background_image: z.string().optional(),
});
const letterBody = sendBase.extend({
	qrcode_url: z.string().optional(),
	additional_pages_url: z.string().optional(),
	pdf_only_url: z.string().optional(),
});
const notecardBody = sendBase.extend({
	use_custom_background: z.boolean().optional(),
	custom_background_image: z.string().optional(),
	qrcode_url: z.string().optional(),
});
const giftcardBody = sendBase.extend({
	giftcard_brand: z.string().optional(),
	giftcard_amount_in_cents: z.number().int().optional(),
});
const sendResponse = z.union([
	z
		.object({
			message: z.string().optional(),
			data: z
				.object({ previews: z.array(z.string()).optional() })
				.passthrough(),
		})
		.passthrough(),
	orderSchema,
]);
const estimateResponse = z
	.object({
		message: z.string().optional(),
		data: z
			.object({
				type: z.string().optional(),
				size: nullableString,
				total_recipients: z.number().int().optional(),
				recipients: z
					.object({
						united_states: z.number().int().optional(),
						international: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				pending_email_lookups: z.number().int().optional(),
				costs_in_cents: z
					.object({
						united_states: z.number().int().optional(),
						international: z.number().int().optional(),
						additional_pages: z.number().int().optional(),
						giftcard_face_value: z.number().int().optional(),
						grand_total: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				total_cost_in_cents: z.number().int().optional(),
				total_cost: z.string().optional(),
				current_balance_in_cents: z.number().int().optional(),
				covered_by_balance: z.boolean().optional(),
				test_mode: z.boolean().optional(),
				notes: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const ThanksIoEndpointInputSchemas = {
	recipientsGet: recipientId,
	recipientsUpdate: recipientId.extend({ body: recipientBody }),
	recipientsDelete: recipientId,
	recipientsCreate: z.object({ body: createBody }),
	recipientsCreateMultiple: z.object({ body: z.array(bulkCreateBody) }),
	recipientsDeleteByAddress: z.object({ body: deleteByAddressBody }),
	mailingListsList: z.object({
		page: z.number().int().positive().optional(),
		items_per_page: z.number().int().positive().optional(),
	}),
	mailingListsCreate: z.object({
		body: z.object({
			description: z.string(),
			sub_account_id: z.number().int().optional(),
			qrcode_url: z.string().optional(),
		}),
	}),
	mailingListsGet: listId,
	mailingListsDelete: listId,
	mailingListsListRecipients: listId.extend({
		page: z.number().int().positive().optional(),
		limit: z.number().int().min(1).max(10000).optional(),
		updated_since: z.string().optional(),
	}),
	mailingListsBuyRadiusSearch: z.object({
		body: radiusBody.extend({
			record_count: z.number().int().min(1).max(2500),
			mailing_list_id: z.number().int().optional(),
			append_data: z.boolean().optional(),
			use_property_owner: z.boolean().optional(),
			include_search_address: z.boolean().optional(),
		}),
	}),
	mailingListsCountRadiusSearch: z.object({ body: radiusBody }),
	webhookDestinationsList: z.object({
		page: z.number().int().positive().optional(),
		items_per_page: z.number().int().positive().optional(),
		type: webhookType.optional(),
		scan_board_status: scanBoardStatus.optional(),
	}),
	webhookDestinationsCreate: z.object({
		body: webhookBody
			.extend({ mailing_list_id: z.number().int().nullable().optional() })
			.refine(
				(body) =>
					body.type !== 'scan_board.status_update' ||
					body.scan_board_status != null,
				{
					message: 'scan_board_status is required for scan_board.status_update',
				},
			),
	}),
	webhookDestinationsUpdate: webhookId.extend({
		body: webhookBody.refine(
			(body) =>
				body.type !== 'scan_board.status_update' ||
				body.scan_board_status != null,
			{ message: 'scan_board_status is required for scan_board.status_update' },
		),
	}),
	webhookDestinationsDelete: webhookId,
	subAccountsList: z.object({}),
	subAccountsCreate: z.object({ body: subAccountBody }),
	subAccountsGet: subAccountId,
	subAccountsUpdate: subAccountId.extend({ body: subAccountBody }),
	subAccountsDelete: subAccountId,
	messageTemplatesList: templateQuery,
	messageTemplatesCreate: z.object({
		body: messageTemplateBody.refine(
			(body) =>
				body.type !== 'giftcard' ||
				(body.giftcard_brand_code !== undefined &&
					body.giftcard_amount !== undefined),
			{
				message:
					'giftcard_brand_code and giftcard_amount are required for giftcards',
			},
		),
	}),
	messageTemplatesGet: templateId,
	messageTemplatesUpdate: templateId.extend({ body: messageTemplateBody }),
	messageTemplatesDelete: templateId,
	imageTemplatesList: templateQuery,
	creativesList: z.object({
		sub_account_id: z.number().int().optional(),
		mailer_type: mailerType.optional(),
		complete_only: z.boolean().optional(),
		search: z.string().optional(),
		include_hidden: z.boolean().optional(),
		page: z.number().int().positive().optional(),
	}),
	creativesGet: z.object({ creativeId: z.number().int().nonnegative() }),
	handwritingStylesList: z.object({}),
	giftcardBrandsList: z.object({}),
	giftcardBrandsListFlat: z.object({}),
	ordersList: z.object({
		page: z.number().int().positive().optional(),
		items_per_page: z.number().int().positive().optional(),
		sub_account_id: z.number().int().optional(),
		type: z
			.union([mailerType, z.enum(['4x6-postcard', '6x9-postcard'])])
			.optional(),
		creative_id: z.number().int().optional(),
		campaign: z.number().int().optional(),
	}),
	ordersTrack: z.object({ orderId: flexibleOrderId }),
	ordersListItems: z.object({
		orderId: z.number().int().nonnegative(),
		page: z.number().int().positive().optional(),
		per_page: z.number().int().min(1).max(100).optional(),
	}),
	ordersCancel: z.object({ orderId: flexibleOrderId }),
	ordersReplay: z.object({
		orderId: z.number().int().nonnegative(),
		body: z
			.object({
				recipients: z.array(replayRecipient).min(1).optional(),
				schedule_for: z.string().optional(),
				metadata,
			})
			.optional(),
	}),
	orderItemsInvalidateGiftcard: z.object({
		orderItemId: z.number().int().nonnegative(),
	}),
	sendPostcard: z.object({ body: postcardBody }),
	sendMagnacard: z.object({ body: magnacardBody }),
	sendWindowedLetter: z.object({ body: letterBody }),
	sendWindowlessLetter: z.object({ body: letterBody }),
	sendNotecard: z.object({ body: notecardBody }),
	sendGiftcard: z.object({ body: giftcardBody }),
	estimatePostcard: z.object({ body: postcardBody }),
	estimateMagnacard: z.object({ body: magnacardBody }),
	estimateWindowedLetter: z.object({ body: letterBody }),
	estimateWindowlessLetter: z.object({ body: letterBody }),
	estimateNotecard: z.object({ body: notecardBody }),
	estimateGiftcard: z.object({ body: giftcardBody }),
	imageBuilderCreate: z.object({
		id: z.number().int().min(1).max(18),
		background_url: z.string().optional(),
		header: z.string().optional(),
		subheader: z.string().optional(),
		redirect_url: z.string().optional(),
		logo_url: z.string().optional(),
		overlay_url: z.string().optional(),
		size: z.enum(['4x6', '6x9']).optional(),
	}),
} as const;

export const ThanksIoEndpointOutputSchemas = {
	recipientsGet: recipientSchema,
	recipientsUpdate: recipientSchema,
	recipientsDelete: emptyResponse,
	recipientsCreate: recipientSchema,
	recipientsCreateMultiple: z.array(recipientSchema),
	recipientsDeleteByAddress: emptyResponse,
	mailingListsList: z
		.object({
			data: z.array(mailingListSchema).optional(),
			links: pageLinks.optional(),
			meta: paginationMeta.optional(),
		})
		.passthrough(),
	mailingListsCreate: mailingListSchema,
	mailingListsGet: mailingListSchema,
	mailingListsDelete: emptyResponse,
	mailingListsListRecipients: paginatedRecipients,
	mailingListsBuyRadiusSearch: radiusResult,
	mailingListsCountRadiusSearch: radiusResult,
	webhookDestinationsList: z
		.object({
			data: z.array(webhookSchema).optional(),
			links: pageLinks.optional(),
			meta: paginationMeta.optional(),
			can_manage_webhooks: z.boolean().optional(),
		})
		.passthrough(),
	webhookDestinationsCreate: webhookSchema,
	webhookDestinationsUpdate: webhookSchema,
	webhookDestinationsDelete: z
		.object({ status: z.string().optional() })
		.passthrough(),
	subAccountsList: z
		.object({ data: z.array(subAccountSchema).optional() })
		.passthrough(),
	subAccountsCreate: subAccountSchema,
	subAccountsGet: subAccountSchema,
	subAccountsUpdate: subAccountSchema,
	subAccountsDelete: emptyResponse,
	messageTemplatesList: z
		.object({
			data: z.array(messageTemplateSchema).optional(),
			links: pageLinks.optional(),
			meta: paginationMeta.optional(),
		})
		.passthrough(),
	messageTemplatesCreate: messageTemplateSchema,
	messageTemplatesGet: messageTemplateSchema,
	messageTemplatesUpdate: messageTemplateSchema,
	messageTemplatesDelete: z
		.object({ message: z.string().optional() })
		.passthrough(),
	imageTemplatesList: z
		.object({
			data: z.array(imageTemplateSchema).optional(),
			links: pageLinks.optional(),
			meta: paginationMeta.optional(),
		})
		.passthrough(),
	creativesList: z
		.object({
			data: z.array(creativeSchema).optional(),
			links: pageLinks.optional(),
			meta: paginationMeta.optional(),
		})
		.passthrough(),
	creativesGet: z.object({ data: creativeSchema.optional() }).passthrough(),
	// The published examples include style types beyond the schema's two-value enum.
	handwritingStylesList: z
		.object({
			data: z
				.array(
					z
						.object({
							handwriting_style_id: z.number().int().optional(),
							name: z.string().optional(),
							sample: z.string().optional(),
							type: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough(),
	giftcardBrandsList: z
		.object({
			main: brandGroupSchema.optional(),
			food: brandGroupSchema.optional(),
			entertainment: brandGroupSchema.optional(),
			gift: brandGroupSchema.optional(),
			gifts: brandGroupSchema.optional(),
			travel: brandGroupSchema.optional(),
			big_box: brandGroupSchema.optional(),
			other: brandGroupSchema.optional(),
		})
		.passthrough(),
	// OpenAPI declares an array of objects, but its official example is a single object.
	giftcardBrandsListFlat: z.union([
		flatBrandListSchema,
		z.array(flatBrandListSchema),
	]),
	ordersList: z
		.object({
			data: z.array(orderSchema).optional(),
			links: pageLinks.optional(),
			meta: paginationMeta.optional(),
		})
		.passthrough(),
	ordersTrack: z
		.object({
			data: z
				.object({
					id: z.number().int().optional(),
					order: orderSchema.optional(),
					stats: z
						.object({
							delivered: z.number().int().optional(),
							processing: z.number().int().optional(),
							printed: z.number().int().optional(),
							in_transit: z.number().int().optional(),
							in_local_area: z.number().int().optional(),
							processed_for_delivery: z.number().int().optional(),
							re_routed: z.number().int().optional(),
							returned_to_sender: z.number().int().optional(),
							failed: z.number().int().optional(),
							scans: z.number().int().optional(),
							multi_scans: z.number().int().optional(),
						})
						.passthrough()
						.optional(),
					errors: z
						.array(recipientSchema.extend({ failure: z.string().optional() }))
						.optional(),
					returned: z.array(recipientSchema).optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
	ordersListItems: z
		.object({
			data: z.array(orderItemSchema).optional(),
			links: pageLinks.optional(),
			meta: paginationMeta.optional(),
		})
		.passthrough(),
	ordersCancel: z.object({ order: orderSchema.optional() }).passthrough(),
	ordersReplay: orderSchema,
	orderItemsInvalidateGiftcard: z
		.object({ data: orderItemSchema.optional() })
		.passthrough(),
	sendPostcard: sendResponse,
	sendMagnacard: sendResponse,
	sendWindowedLetter: sendResponse,
	sendWindowlessLetter: sendResponse,
	sendNotecard: sendResponse,
	sendGiftcard: sendResponse,
	estimatePostcard: estimateResponse,
	estimateMagnacard: estimateResponse,
	estimateWindowedLetter: estimateResponse,
	estimateWindowlessLetter: estimateResponse,
	estimateNotecard: estimateResponse,
	estimateGiftcard: estimateResponse,
	imageBuilderCreate: z.instanceof(Blob),
} as const;

export type ThanksIoEndpointInputs = {
	[K in keyof typeof ThanksIoEndpointInputSchemas]: z.input<
		(typeof ThanksIoEndpointInputSchemas)[K]
	>;
};
export type ThanksIoEndpointOutputs = {
	[K in keyof typeof ThanksIoEndpointOutputSchemas]: z.output<
		(typeof ThanksIoEndpointOutputSchemas)[K]
	>;
};

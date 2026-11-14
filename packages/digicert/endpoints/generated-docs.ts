import type { CorsairEndpoint } from 'corsair/core';
import { z } from 'zod';
import type { DigicertContext } from '../index';
import type { OpenApiCallInput, OpenApiFamily } from './generated-runtime';
import { createOpenApiEndpoint } from './generated-runtime';

const doc_b404e0df280eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_b404e0df280eOutput = z
	.object({
		id: z.number().int().optional(),
		make_renewal_calls: z.boolean().optional(),
		express_install_enabled: z.boolean().optional(),
		admin_email: z.string().optional(),
		display_rep: z.boolean().optional(),
		rep_name: z.string().optional(),
		rep_phone: z.string().optional(),
		rep_email: z.string().optional(),
		balance_negative_limit: z.number().int().optional(),
		pricing_model: z.string().optional(),
		cert_transparency: z.string().optional(),
		cert_central_type: z.string().optional(),
		is_reseller_customer: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_9eaf8d093062Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				label: z.string(),
				is_required: z.boolean().optional(),
				is_active: z.boolean().optional(),
				data_type: z.string().optional(),
				show_in_receipt: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_9eaf8d093062Output = z.json().optional();
const doc_d3cc6430936dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_d3cc6430936dOutput = z.json().optional();
const doc_00ad039ae491Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				metadata: z.array(z.json()).optional(),
				label: z.string().optional(),
				is_required: z.boolean().optional(),
				is_active: z.boolean().optional(),
				data_type: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_00ad039ae491Output = z.json().optional();
const doc_1ef869474727Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				provider_url: z.string(),
				client_id: z.string(),
				client_secret: z.string(),
				friendly_name: z.string(),
				scope_parameter: z.string(),
				discoverable: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_1ef869474727Output = z.json().optional();
const doc_bb6c5576f14bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_bb6c5576f14bOutput = z.json().optional();
const doc_a8eee1e78e72Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_a8eee1e78e72Output = z
	.object({
		auth_key_id: z.string().optional(),
		auth_key: z.string().optional(),
		expiration_datetime: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_c391f0331b7eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_c391f0331b7eOutput = z.json().optional();
const doc_abdf255be06aInput = z
	.object({
		path: z.object({ metadata_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_abdf255be06aOutput = z.json().optional();
const doc_f5cd45279030Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_f5cd45279030Output = z.json().optional();
const doc_7f053e614b94Input = z
	.object({
		path: z.object({ metadata_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				label: z.string(),
				is_required: z.boolean().optional(),
				is_active: z.boolean().optional(),
				data_type: z.string().optional(),
				show_in_receipt: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_7f053e614b94Output = z.json().optional();
const doc_8ed6be3e6d29Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_8ed6be3e6d29Output = z
	.object({
		enabled: z.boolean().optional(),
		guest_access_url: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_d9379f0e3a78Input = z
	.object({
		path: z.object({ invite_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_d9379f0e3a78Output = z
	.object({
		id: z.number().int().optional(),
		email: z.string().optional(),
		subaccount_type: z.string().optional(),
		invite_note: z.string().optional(),
		date_created: z.string().optional(),
		last_sent_date: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_35988e9424cfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_35988e9424cfOutput = z.json().optional();
const doc_10eeaf071883Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_10eeaf071883Output = z
	.object({
		metadata: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		label: z.string().optional(),
		is_required: z.boolean().optional(),
		is_active: z.boolean().optional(),
		data_type: z.string().optional(),
		show_in_receipt: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_12638b157910Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_12638b157910Output = z
	.object({
		subaccount_invites: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		email: z.string().optional(),
		subaccount_type: z.string().optional(),
		invite_note: z.string().optional(),
		date_created: z.string().optional(),
		last_sent_date: z.string().optional(),
		status: z.string().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_ad55507625c4Input = z
	.object({
		path: z.object({ target_account_id: z.number().int().positive() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				target_org_id: z.number().int().optional(),
				order_ids: z.string(),
				move_custom_fields: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_ad55507625c4Output = z
	.object({ move_request_id: z.number().int().optional() })
	.passthrough()
	.optional();
const doc_aa0985870136Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_aa0985870136Output = z
	.object({
		provider_url: z.string().optional(),
		friendly_name: z.string().optional(),
		slug_name: z.string().optional(),
		client_id: z.string().optional(),
		client_secret: z.string().optional(),
		discoverable: z.boolean().optional(),
		scope_parameter: z.string().optional(),
		date_created: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_fb8e1d4e570bInput = z
	.object({
		path: z.object({ invite_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ invite_note: z.string().optional() }).strict().optional(),
	})
	.strict();
const doc_fb8e1d4e570bOutput = z.json().optional();
const doc_b0fef9c9858cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_b0fef9c9858cOutput = z
	.object({
		id: z.string().optional(),
		account_id: z.string().optional(),
		xml_metadata: z.string().optional(),
		source_url: z.string().optional(),
		idp_entity_id: z.string().optional(),
		attribute_mapping: z.string().optional(),
		friendly_name: z.string().optional(),
		friendly_slug: z.string().optional(),
		date_created: z.string().optional(),
		last_signon_date: z.string().optional(),
		username_attribute: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_22f01bc0cb8aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				emails: z.array(z.json()),
				subaccount_type: z.string(),
				invite_note: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_22f01bc0cb8aOutput = z.json().optional();
const doc_b790c4385b03Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				admin_email: z.string().optional(),
				emergency_emails: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_b790c4385b03Output = z.json().optional();
const doc_6a803196fac7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_settings: z.array(z.json()).optional(),
				name: z.string().optional(),
				value: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_6a803196fac7Output = z
	.object({ status: z.string().optional(), message: z.string().optional() })
	.passthrough()
	.optional();
const doc_ad6d2a03d1b2Input = z
	.object({
		path: z.object({ invite_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ status: z.string() }).strict(),
	})
	.strict();
const doc_ad6d2a03d1b2Output = z.json().optional();
const doc_af38437e1d87Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				provider_url: z.string(),
				client_id: z.string(),
				client_secret: z.string(),
				friendly_name: z.string(),
				scope_parameter: z.string(),
				discoverable: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_af38437e1d87Output = z.json().optional();
const doc_b27a9742c359Input = z
	.object({
		path: z.object({ entity_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				xml_metadata: z.string().optional(),
				source_url: z.string().optional(),
				attribute_mapping: z.string(),
				friendly_name: z.string(),
			})
			.strict(),
	})
	.strict();
const doc_b27a9742c359Output = z.json().optional();
const doc_4e257ad17e08Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string().optional(),
				product_name_id: z.string().optional(),
				organization_id: z.number().int().optional(),
				validity_years: z.number().int().optional(),
				validity_days: z.number().int().optional(),
				profile_option: z.string().optional(),
				container_id: z.number().int().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				ca_cert_id: z.string().optional(),
				order_validity_days: z.number().int().optional(),
				order_validity_years: z.number().int().optional(),
				sans: z.array(z.json()).optional(),
				allowed_order_count: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_4e257ad17e08Output = z
	.object({
		acme_directory_url: z.string().optional(),
		ext_act_kid: z.string().optional(),
		ext_act_hmac: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_c578cc27f1aaInput = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				restricted_to_role_id: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_c578cc27f1aaOutput = z
	.object({ id: z.number().int().optional(), api_key: z.string().optional() })
	.passthrough()
	.optional();
const doc_8f9edc9117c4Input = z
	.object({
		path: z.object({ key_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				restricted_to_role_id: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_8f9edc9117c4Output = z.json().optional();
const doc_81b584e30788Input = z
	.object({
		path: z.object({ key_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_81b584e30788Output = z
	.object({
		id: z.number().int().optional(),
		user: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		status: z.string().optional(),
		create_date: z.string().optional(),
		last_used_date: z.string().optional(),
		name: z.string().optional(),
		is_legacy: z.boolean().optional(),
		restricted_to_role_id: z.number().int().optional(),
		acme_directory_url: z.string().optional(),
		product_name_id: z.string().optional(),
		product_name: z.string().optional(),
		organization_id: z.string().optional(),
		organizatin_name: z.string().optional(),
		validity_days: z.string().optional(),
		validity_years: z.string().optional(),
		sans: z.array(z.json()).optional(),
		allowed_order_count: z.number().int().optional(),
		used_order_count: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_560d6f2d1221Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_560d6f2d1221Output = z
	.object({
		access_roles: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		name: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_070d6e77a00aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_070d6e77a00aOutput = z
	.object({
		api_keys: z.array(z.json()).optional(),
		acme_urls: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_5912774bad5eInput = z
	.object({
		path: z.object({ key_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				sans: z.array(z.json()).optional(),
				allowed_order_count: z.number().int().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_5912774bad5eOutput = z.json().optional();
const doc_54f409a9171cInput = z
	.object({
		path: z.object({ key_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ status: z.string() }).strict(),
	})
	.strict();
const doc_54f409a9171cOutput = z.json().optional();
const doc_476f9fe16b9bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_476f9fe16b9bOutput = z
	.object({
		authorized: z.boolean().optional(),
		permission: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_d00cf8a74f8aInput = z
	.object({
		path: z.object({ permission: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_d00cf8a74f8aOutput = z.json().optional();
const doc_73f2ef62b52dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_73f2ef62b52dOutput = z
	.object({
		authorizations: z.array(z.json()).optional(),
		authorized: z.boolean().optional(),
		permission: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_b4febad46718Input = z
	.object({
		path: z.object({ certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ text: z.string() }).strict(),
	})
	.strict();
const doc_b4febad46718Output = z.json().optional();
const doc_6bca5b5ddaa2Input = z
	.object({
		path: z.object({ certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_6bca5b5ddaa2Output = z.json().optional();
const doc_c4cb46253fc8Input = z
	.object({
		path: z.object({ certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_c4cb46253fc8Output = z
	.object({
		intermediates: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_12ee3803b0eaInput = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), format_type: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_12ee3803b0eaOutput = z.json().optional();
const doc_3eac5982f660Input = z
	.object({
		path: z
			.object({
				certificate_id: z.string().min(1),
				format_type: z.string().min(1),
			})
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_3eac5982f660Output = z.json().optional();
const doc_98dfb200c831Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_98dfb200c831Output = z.json().optional();
const doc_15d58a0242efInput = z
	.object({
		path: z.object({ certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				emails: z.array(z.json()).optional(),
				certificate_collect_format: z.string().optional(),
				custom_message: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_15d58a0242efOutput = z.json().optional();
const doc_52f8e42773fbInput = z
	.object({
		path: z.object({ certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_52f8e42773fbOutput = z
	.object({
		notes: z.array(z.json()).optional(),
		date_created: z.string().optional(),
		text: z.string().optional(),
		user: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_86f85ef51d05Input = z
	.object({
		path: z.object({ certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_86f85ef51d05Output = z.json().optional();
const doc_20c8dbbadda5Input = z
	.object({
		path: z.object({ certificate_identifier: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				revocation_reason: z.string().optional(),
				comment: z.string().optional(),
				skip_approval: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_20c8dbbadda5Output = z
	.object({
		id: z.number().int().optional(),
		date: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		requester: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		comments: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_a3736174ce8eInput = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_a3736174ce8eOutput = z.json().optional();
const doc_82d35daae87fInput = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_82d35daae87fOutput = z
	.object({
		id: z.number().int().optional(),
		public_id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		parent_id: z.string().optional(),
		template_id: z.string().optional(),
		ekey: z.string().optional(),
		has_logo: z.boolean().optional(),
		is_active: z.boolean().optional(),
		user_id_assignments: z.array(z.json()).optional(),
		allowed_domain_names: z.array(z.json()).optional(),
		organization_assignments: z.array(z.json()).optional(),
		status: z.string().optional(),
		display_name: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_f7b30cc3e4dfInput = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				description: z.string().optional(),
				template_id: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_f7b30cc3e4dfOutput = z
	.object({ id: z.number().int().optional() })
	.passthrough()
	.optional();
const doc_3f2ca5c0125dInput = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_3f2ca5c0125dOutput = z.json().optional();
const doc_d0c1793b18e1Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ name: z.string(), description: z.string().optional() })
			.strict(),
	})
	.strict();
const doc_d0c1793b18e1Output = z.json().optional();
const doc_b3e6aee2fc46Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_b3e6aee2fc46Output = z
	.object({
		containers: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		public_id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		parent_id: z.string().optional(),
		template_id: z.string().optional(),
		has_logo: z.boolean().optional(),
		is_active: z.boolean().optional(),
		allowed_domain_names: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_aeef15756129Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_aeef15756129Output = z
	.object({
		organizations: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		assumed_name: z.string().optional(),
		display_name: z.string().optional(),
		is_active: z.boolean().optional(),
		address: z.string().optional(),
		address2: z.string().optional(),
		zip: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		telephone: z.string().optional(),
		validations: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_12b9a2ef2c46Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_12b9a2ef2c46Output = z
	.object({
		access_roles: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		name: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_0ef8984e5c8bInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_0ef8984e5c8bOutput = z
	.object({
		containers: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		public_id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		parent_id: z.number().int().optional(),
		template_id: z.number().int().optional(),
		has_logo: z.boolean().optional(),
		is_active: z.boolean().optional(),
		user_id_assignments: z.array(z.json()).optional(),
		allowed_domain_names: z.array(z.json()).optional(),
		organization_assignments: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_1041d732a432Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_1041d732a432Output = z
	.object({
		container_templates: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		name: z.string().optional(),
		date_created: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_11b9f13443f4Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_11b9f13443f4Output = z
	.object({
		id: z.number().int().optional(),
		public_id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		parent_id: z.number().int().optional(),
		template_id: z.number().int().optional(),
		has_logo: z.boolean().optional(),
		is_active: z.boolean().optional(),
		allowed_domain_names: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_9881d9a4588eInput = z
	.object({
		path: z.object({ 'container-id': z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_9881d9a4588eOutput = z
	.object({
		is_limited: z.boolean().optional(),
		limited_container_ids: z.array(z.json()).optional(),
		product_limits: z.array(z.json()).optional(),
		container_id: z.number().int().optional(),
		role_id: z.number().int().optional(),
		product_name_id: z.string().optional(),
		allowed_hashes: z.array(z.json()).optional(),
		allowed_intermediates: z.array(z.json()).optional(),
		allowed_lifetimes: z.array(z.json()).optional(),
		allowed_order_lifetimes: z.array(z.json()).optional(),
		allow_auto_renew: z.boolean().optional(),
		allow_auto_reissue: z.boolean().optional(),
		default_intermediate: z.string().optional(),
		allowed_wildcards: z.boolean().optional(),
		ct_log_option: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_8eb4885d89b3Input = z
	.object({
		path: z
			.object({
				container_id: z.string().min(1),
				template_id: z.string().min(1),
			})
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_8eb4885d89b3Output = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		date_created: z.string().optional(),
		access_roles: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_979cc97944f4Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ allowed_domain_names: z.array(z.json()) }).strict(),
	})
	.strict();
const doc_979cc97944f4Output = z.json().optional();
const doc_af5d117edb7aInput = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ organization_id_assignments: z.array(z.json()) }).strict(),
	})
	.strict();
const doc_af5d117edb7aOutput = z.json().optional();
const doc_0bdd00e8d1ceInput = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string(),
				value: z.string(),
				allow_override: z.boolean(),
				inheritable: z.boolean(),
			})
			.strict(),
	})
	.strict();
const doc_0bdd00e8d1ceOutput = z.json().optional();
const doc_0a55eec794e9Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ user_id_assignments: z.array(z.json()) }).strict(),
	})
	.strict();
const doc_0a55eec794e9Output = z.json().optional();
const doc_14e4b1bd5a34Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				issuer_brand: z.string(),
				disable_email_notification_flag: z.boolean().optional(),
				trusted_ica_flag: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_14e4b1bd5a34Output = z.json().optional();
const doc_30ad424e79e1Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_30ad424e79e1Output = z.json().optional();
const doc_c0e294c9d204Input = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), serial_id: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_c0e294c9d204Output = z
	.object({ pem: z.string().optional() })
	.passthrough()
	.optional();
const doc_9e9475186e42Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_9e9475186e42Output = z.json().optional();
const doc_5d231daccbc1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_5d231daccbc1Output = z
	.object({
		ct_issuer_brand_settings: z.array(z.json()).optional(),
		issuer_brand: z.string().optional(),
		certificates_count: z.string().optional(),
		disable_email_notification_flag: z.boolean().optional(),
		trusted_ica_flag: z.boolean().optional(),
		page: z.json().optional(),
		total: z.number().int().optional(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_f1dbbc96926eInput = z
	.object({
		path: z
			.object({
				order_id: z.string().min(1),
				certificate_serial_number: z.string().min(1),
			})
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_f1dbbc96926eOutput = z
	.object({
		serial: z.string().optional(),
		issuer: z.string().optional(),
		not_after: z.string().optional(),
		not_before: z.string().optional(),
		pem: z.string().optional(),
		digicert_issued: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_0ca93d0cc9c4Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_0ca93d0cc9c4Output = z
	.object({ status: z.boolean().optional() })
	.passthrough()
	.optional();
const doc_48620dc4c72aInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_48620dc4c72aOutput = z
	.object({
		ct_certificates: z
			.array(
				z
					.object({
						serial: z.string().optional(),
						digicert_issued: z.boolean().optional(),
						ctlogs: z
							.array(
								z
									.object({
										logged_on: z.string().optional(),
										entry_no: z.json().optional(),
										log_name: z.string().optional(),
										operated_by: z.string().optional(),
										log_url: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						not_after: z.string().optional(),
						not_before: z.string().optional(),
						subject: z.string().optional(),
						issuer: z.string().optional(),
						precert: z.boolean().optional(),
						hosts: z.json().optional(),
						issuer_ca: z.string().optional(),
						trusted_ica: z.boolean().optional(),
						key_algorithm: z.string().optional(),
						key_length: z.number().int().optional(),
						self_signed: z.boolean().optional(),
						signature_algorithm: z.string().optional(),
						cert_type: z.string().optional(),
						wildcard: z.boolean().optional(),
					})
					.passthrough(),
			)
			.optional(),
		page: z.json().optional(),
		issuer_ca_list: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_262c27590310Input = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_262c27590310Output = z.json().optional();
const doc_8aae6a51f92aInput = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_8aae6a51f92aOutput = z.json().optional();
const doc_1aac58120f09Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				validations: z.array(z.json()).optional(),
				type: z.string().optional(),
				dcv_method: z.string().optional(),
				locale: z.string().optional(),
				email_array: z.array(z.json()).optional(),
				keep_www: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_1aac58120f09Output = z
	.object({
		id: z.number().int().optional(),
		validation_emails: z.json().optional(),
		name_scope: z.string().optional(),
		base_emails: z.array(z.json()).optional(),
		email_array: z.array(z.json()).optional(),
		dcv_token: z.json().optional(),
		token: z.string().optional(),
		status: z.string().optional(),
		expiration_date: z.string().optional(),
		http_token_url: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_f226832d3875Input = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				dcv_method: z.string(),
				locale: z.string().optional(),
				send_dcv_email_flag: z.boolean().optional(),
				email_array: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_f226832d3875Output = z
	.object({
		validation_emails: z.json().optional(),
		name_scope: z.string().optional(),
		base_emails: z.array(z.json()).optional(),
		email_array: z.array(z.json()).optional(),
		dcv_token: z.string().optional(),
		token: z.string().optional(),
		status: z.string().optional(),
		expiration_date: z.string().optional(),
		verification_value: z.string().optional(),
		http_token_url: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_5732d67dff2dInput = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ account_token: z.string() }).strict(),
	})
	.strict();
const doc_5732d67dff2dOutput = z
	.object({ status: z.string().optional() })
	.passthrough()
	.optional();
const doc_8c2ebcb999dbInput = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_8c2ebcb999dbOutput = z.json().optional();
const doc_8174f07e86d8Input = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_8174f07e86d8Output = z.json().optional();
const doc_68c760dcbd07Input = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_68c760dcbd07Output = z.json().optional();
const doc_11c825cbc8c6Input = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z
			.object({ consider_dcv_email_preferences: z.boolean().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_11c825cbc8c6Output = z
	.object({
		name_scope: z.string().optional(),
		base_emails: z.array(z.json()).optional(),
		dns_txt_emails: z.array(z.json()).optional(),
		email_array: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_7553d189737cInput = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_7553d189737cOutput = z
	.object({
		id: z.number().int().optional(),
		is_active: z.boolean().optional(),
		status: z.string().optional(),
		is_pending_validation: z.boolean().optional(),
		name: z.string().optional(),
		date_created: z.string().optional(),
		domain_locking_status: z.string().optional(),
		account_token: z.string().optional(),
		dcv_approval_datetime: z.string().optional(),
		dcv_expiration_datetime: z.string().optional(),
		organization: z.json().optional(),
		assumed_name: z.string().optional(),
		display_name: z.string().optional(),
		validations: z.array(z.json()).optional(),
		type: z.string().optional(),
		description: z.string().optional(),
		dcv_status: z.string().optional(),
		dcv_method: z.string().optional(),
		dcv_token: z.json().optional(),
		token: z.string().optional(),
		expiration_date: z.string().optional(),
		higher_level_domains: z.array(z.json()).optional(),
		dcv_expiration: z.string().optional(),
		ev: z.string().optional(),
		ov: z.string().optional(),
		ov_shortened: z.string().optional(),
		ov_status: z.string().optional(),
		ev_status: z.string().optional(),
		dcv_approval_date: z.string().optional(),
		container: z.json().optional(),
		parent_id: z.number().int().optional(),
		base_domain: z.string().optional(),
		dcv_approval_method: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_e4cc91b4b088Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_e4cc91b4b088Output = z
	.object({
		number_of_expired_domains: z.string().optional(),
		number_of_expiry_soon_domains: z.string().optional(),
		number_of_domains_affected_by_mozilla_policy: z.string().optional(),
		number_of_domains_recent_expired: z.string().optional(),
		number_of_domains_expiring_within_30_days: z.string().optional(),
		number_of_domains_expiring_from_31_to_60_days: z.string().optional(),
		number_of_domains_expiring_from_61_to_90_days: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_4c129eef60aeInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_4c129eef60aeOutput = z
	.object({
		methods: z.array(z.json()).optional(),
		name: z.string().optional(),
		display_name: z.string().optional(),
		description: z.string().optional(),
		default: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_c11852b77be3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_c11852b77be3Output = z
	.object({
		domains: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		is_active: z.boolean().optional(),
		name: z.string().optional(),
		dcv_approval_datetime: z.string().optional(),
		dcv_expiration_datetime: z.string().optional(),
		last_submitted_datetime: z.string().optional(),
		date_created: z.string().optional(),
		domain_locking_status: z.string().optional(),
		account_token: z.string().optional(),
		organization: z.json().optional(),
		validations: z.array(z.json()).optional(),
		dcv_method: z.string().optional(),
		dcv_expiration: z.string().optional(),
		container: z.json().optional(),
		base_domain: z.string().optional(),
		dcv_approval_method: z.string().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_c7aed98b2e77Input = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_c7aed98b2e77Output = z
	.object({ status: z.string().optional() })
	.passthrough()
	.optional();
const doc_4545251fa69dInput = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				validations: z.array(z.json()).optional(),
				type: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_4545251fa69dOutput = z
	.object({
		token: z.string().optional(),
		expiration_date: z.string().optional(),
		http_token_url: z.string().optional(),
		verification_value: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_b1ecc284456cInput = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name_scope: z.string().optional(),
				locale: z.string().optional(),
				email_array: z.array(z.json()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_b1ecc284456cOutput = z.json().optional();
const doc_28388b3fed6aInput = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				validations: z.array(z.json()).optional(),
				type: z.string().optional(),
				dcv_method: z.string().optional(),
				email_array: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_28388b3fed6aOutput = z
	.object({
		id: z.number().int().optional(),
		validation_emails: z.json().optional(),
		name_scope: z.string().optional(),
		base_emails: z.array(z.json()).optional(),
		email_array: z.array(z.json()).optional(),
		dcv_token: z.json().optional(),
		token: z.string().optional(),
		status: z.string().optional(),
		expiration_date: z.string().optional(),
		verification_value: z.string().optional(),
		http_token_url: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_ff77d342fe74Input = z
	.object({
		path: z.object({ domain_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_ff77d342fe74Output = z
	.object({
		validations: z.array(z.json()).optional(),
		type: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		date_created: z.string().optional(),
		validated_until: z.string().optional(),
		status: z.string().optional(),
		dcv_status: z.string().optional(),
		org_status: z.string().optional(),
		verified_users: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_879c2f7de929Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_879c2f7de929Output = z
	.object({ validation_types: z.array(z.json()).optional() })
	.passthrough()
	.optional();
const doc_1177e54e3da6Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_1177e54e3da6Output = z
	.object({
		adjustments: z
			.array(
				z
					.object({
						id: z.string().optional(),
						container: z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								is_active: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						credit: z.string().optional(),
						debit: z.string().optional(),
						transaction_type: z.string().optional(),
						receipt_id: z.string().optional(),
						transaction_date: z.string().optional(),
						balance_after: z.string().optional(),
						expiration_date: z.string().optional(),
						note: z.string().optional(),
						currency: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_f7d972dc06d1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_f7d972dc06d1Output = z
	.object({
		order_transactions: z
			.array(
				z
					.object({
						id: z.string().optional(),
						container: z.json().optional(),
						order_id: z.string().optional(),
						receipt_id: z.string().optional(),
						amount: z.string().optional(),
						payment_type: z.string().optional(),
						transaction_date: z.string().optional(),
						transaction_type: z.string().optional(),
						product_name: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_019b3c552368Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ domains: z.array(z.json()) }).strict(),
	})
	.strict();
const doc_019b3c552368Output = z
	.object({
		certificates: z.array(z.json()).optional(),
		subject: z.string().optional(),
		san_list: z.array(z.json()).optional(),
		serial_number: z.string().optional(),
		issuer_ca: z.string().optional(),
		issuer_brand: z.string().optional(),
		not_before: z.string().optional(),
		not_after: z.string().optional(),
		validation_type: z.string().optional(),
		matched_domains_count: z.number().int().optional(),
		matched_domains: z.array(z.json()).optional(),
		certificate_replacement_benefits: z.array(z.json()).optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_1d5152684c65Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				dns_names: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().optional(),
				days: z.number().optional(),
				custom_expiration_date: z.string().optional(),
				validity_years: z.number().int().optional(),
				is_out_of_contract: z.number().int().optional(),
				product_name_id: z.string().optional(),
				billing_address: z.json().optional(),
				country: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				renewal_of_order_valid_till: z.string().optional(),
				addons: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_1d5152684c65Output = z
	.object({
		base_price: z.number().int().optional(),
		total_price: z.number().int().optional(),
		addons_price: z.number().int().optional(),
		addons_price_details: z.array(z.json()).optional(),
		subtotal: z.number().int().optional(),
		product_id: z.number().int().optional(),
		units: z.number().int().optional(),
		price: z.string().optional(),
		fqdns: z.json().optional(),
		wildcards: z.json().optional(),
		balance: z.number().int().optional(),
		currency: z.string().optional(),
		tax: z.number().optional(),
		tax_error: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_572756329e70Input = z
	.object({
		path: z.object({ receipt_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_572756329e70Output = z
	.object({
		id: z.string().optional(),
		date_time: z.string().optional(),
		acct_amount: z.string().optional(),
		gross_amount: z.string().optional(),
		tax_amount: z.string().optional(),
		currency: z.string().optional(),
		cc_amount: z.string().optional(),
		cc_last4: z.string().optional(),
		cc_exp_date: z.string().optional(),
		cc_type: z.string().optional(),
		bill_name: z.string().optional(),
		bill_addr1: z.string().optional(),
		bill_city: z.string().optional(),
		bill_state: z.string().optional(),
		bill_zip: z.string().optional(),
		bill_country: z.string().optional(),
		bill_email: z.string().optional(),
		billing_entity_id: z.number().int().optional(),
		vat_number: z.string().optional(),
		payment_method: z.string().optional(),
		transaction_type: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_0298380d0e17Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				amount: z.number().int(),
				from_container_id: z.number().int(),
				to_container_id: z.number().int(),
			})
			.strict(),
	})
	.strict();
const doc_0298380d0e17Output = z.json().optional();
const doc_835a391f5830Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_835a391f5830Output = z
	.object({
		balance: z.string().optional(),
		currency: z.string().optional(),
		unpaid_invoice_balance: z.string().optional(),
		negative_balance_limit: z.string().optional(),
		total_available_funds: z.string().optional(),
		used_credit_from_other_containers: z.string().optional(),
		unlimited_negative_balance: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_5390d99534c7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				vouchers: z.array(z.json()).optional(),
				product_name_id: z.string().optional(),
				no_of_fqdns: z.number().int().optional(),
				no_of_wildcards: z.number().int().optional(),
				shipping_method: z.string().optional(),
				validity_years: z.number().int().optional(),
				validity_days: z.number().int().optional(),
				quantity: z.number().int().optional(),
				billing_address: z.json().optional(),
				country: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_5390d99534c7Output = z
	.object({
		voucher_prices: z.array(z.json()).optional(),
		product_name_id: z.string().optional(),
		no_of_fqdns: z.number().int().optional(),
		no_of_wildcards: z.number().int().optional(),
		shipping_method: z.string().optional(),
		validity_years: z.number().int().optional(),
		validity_days: z.number().int().optional(),
		quantity: z.number().int().optional(),
		cost: z.number().optional(),
		total_cost: z.number().optional(),
		total_tax: z.number().optional(),
		total_cost_plus_tax: z.number().optional(),
		currency: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_021260e79a53Input = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				ip_address: z.string(),
				ip_address_end: z.string(),
				user_id: z.number().int().optional(),
				api_key_id: z.number().int().optional(),
				description: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_021260e79a53Output = z.json().optional();
const doc_72a39e90b633Input = z
	.object({
		path: z
			.object({ container_id: z.string().min(1), rule_id: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_72a39e90b633Output = z.json().optional();
const doc_993889ac64ddInput = z
	.object({
		path: z.object({ container_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_993889ac64ddOutput = z
	.object({
		ip_rules: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		date_created: z.string().optional(),
		account_id: z.string().optional(),
		container_id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		api_key_id: z.number().int().optional(),
		ip_address: z.string().optional(),
		ip_address_end: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_195aa516f3faInput = z
	.object({
		path: z.object({ legacy_order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_195aa516f3faOutput = z
	.object({ id: z.number().int().optional() })
	.passthrough()
	.optional();
const doc_840c367cc8e6Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ text: z.string() }).strict(),
	})
	.strict();
const doc_840c367cc8e6Output = z
	.object({
		id: z.number().int().optional(),
		date_created: z.string().optional(),
		text: z.string().optional(),
		user: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_b9fef9a10667Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ additional_emails: z.array(z.json()) }).strict(),
	})
	.strict();
const doc_b9fef9a10667Output = z.json().optional();
const doc_76411ce6ddb4Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ disable_ct: z.boolean() }).strict(),
	})
	.strict();
const doc_76411ce6ddb4Output = z.json().optional();
const doc_0414f6f07b3fInput = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), container_id: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_0414f6f07b3fOutput = z.json().optional();
const doc_5d952ea36887Input = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), metadata_id: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_5d952ea36887Output = z.json().optional();
const doc_a5e2b942c7caInput = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), note_id: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_a5e2b942c7caOutput = z.json().optional();
const doc_55ad712f0558Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		// Optional: also revoke the order's certificate in the same request.
		query: z.object({ revoke: z.boolean().optional() }).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_55ad712f0558Output = z.json().optional();
const doc_35d402490c05Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_35d402490c05Output = z.json().optional();
const doc_7e426cc9eb65Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				server_platform: z.json().optional(),
				signature_hash: z.string().optional(),
				ca_cert_id: z.string().optional(),
				custom_expiration_date: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_7e426cc9eb65Output = z
	.object({
		id: z.number().int().optional(),
		requests: z.array(z.json()).optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_45222df80d71Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ dcv_method: z.string() }).strict(),
	})
	.strict();
const doc_45222df80d71Output = z
	.object({
		dcv_random_value: z.string().optional(),
		expiration_date: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_e81cc18a9102Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				dns_name_validations: z.array(z.json()).optional(),
				dns_name: z.string().optional(),
				dcv_method: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_e81cc18a9102Output = z
	.object({
		order_status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		dcv_status: z.string().optional(),
		dns_name_validations: z.array(z.json()).optional(),
		dns_name: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_e9a79ceccf84Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_e9a79ceccf84Output = z
	.object({
		dcv_random_value: z.string().optional(),
		expiration_date: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_9f9ccccf949cInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				domain_approval_emails: z.array(z.json()).optional(),
				domain: z.string().optional(),
				email: z.string().optional(),
				email_domain: z.string().optional(),
				locale: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_9f9ccccf949cOutput = z.json().optional();
const doc_c428dd43444eInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ metadata_id: z.number().int(), value: z.string() })
			.strict(),
	})
	.strict();
const doc_c428dd43444eOutput = z.json().optional();
const doc_b245584eda79Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_b245584eda79Output = z
	.object({
		domains: z.json().optional(),
		id: z.number().int().optional(),
		name: z.string().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_f4797f262e2eInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ enable_guest_access: z.number().int() }).strict(),
	})
	.strict();
const doc_f4797f262e2eOutput = z.json().optional();
const doc_1a5d357e8d7cInput = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), note_id: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ text: z.string() }).strict(),
	})
	.strict();
const doc_1a5d357e8d7cOutput = z.json().optional();
const doc_cdce3b9fe81aInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ recipient_email: z.string().optional() })
			.strict()
			.optional(),
	})
	.strict();
const doc_cdce3b9fe81aOutput = z.json().optional();
const doc_29565de72e14Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_29565de72e14Output = z
	.object({
		delivery_options: z.array(z.json()).optional(),
		emails: z.array(z.json()).optional(),
		email: z.string().optional(),
		status: z.string().optional(),
		date_emailed: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_c19139eee34bInput = z
	.object({
		path: z.object({ alternative_order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_c19139eee34bOutput = z
	.object({
		orders: z.array(z.json()).optional(),
		order_id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		status: z.string().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_53d08315b668Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_53d08315b668Output = z
	.object({ logo: z.string().optional() })
	.passthrough()
	.optional();
const doc_a03377134888Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z
			.object({ show_archived: z.boolean().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_a03377134888Output = z
	.object({
		certificates: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		thumbprint: z.string().optional(),
		serial_number: z.string().optional(),
		common_name: z.string().optional(),
		dns_names: z.array(z.json()).optional(),
		status: z.string().optional(),
		date_created: z.string().optional(),
		valid_from: z.string().optional(),
		valid_till: z.string().optional(),
		days_remaining: z.number().int().optional(),
		csr: z.string().optional(),
		server_platform: z.json().optional(),
		signature_hash: z.string().optional(),
		key_size: z.number().int().optional(),
		ca_cert_id: z.string().optional(),
		sub_id: z.string().optional(),
		public_id: z.string().optional(),
		archived: z.string().optional(),
		user_id: z.number().int().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_1d9e28c15f55Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_1d9e28c15f55Output = z
	.object({
		notes: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		date_created: z.string().optional(),
		text: z.string().optional(),
		user: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_ad437431bcfbInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z
			.object({ show_archived: z.boolean().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_ad437431bcfbOutput = z
	.object({
		certificates: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		thumbprint: z.string().optional(),
		serial_number: z.string().optional(),
		common_name: z.string().optional(),
		dns_names: z.array(z.json()).optional(),
		status: z.string().optional(),
		date_created: z.string().optional(),
		date_issued: z.string().optional(),
		valid_till: z.string().optional(),
		days_remaining: z.number().int().optional(),
		csr: z.string().optional(),
		key_size: z.number().int().optional(),
		archived: z.number().int().optional(),
		user_id: z.number().int().optional(),
		email: z.string().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		receipt_id: z.string().optional(),
		purchased_dns_names: z.string().optional(),
		purchased_wildcard_names: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_d96c027674bdInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				usage_designation: z.json().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				key_size: z.number().int().optional(),
				csr_key_type: z.string().optional(),
				signature_hash: z.string().optional(),
				comments: z.string().optional(),
				additional_emails: z.array(z.json()).optional(),
				user_id_assignments: z.array(z.json()).optional(),
				csa_agreed_to: z.boolean().optional(),
				promo_code: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				common_name_indicator: z.string().optional(),
				individual: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				pseudonym: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_d96c027674bdOutput = z
	.object({
		id: z.number().int().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_eb56e3af90eaInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				usage_designation: z.json().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				key_size: z.number().int().optional(),
				csr_key_type: z.string().optional(),
				signature_hash: z.string().optional(),
				comments: z.string().optional(),
				additional_emails: z.array(z.json()).optional(),
				csa_agreed_to: z.boolean().optional(),
				promo_code: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				common_name_indicator: z.string().optional(),
				individual: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				pseudonym: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				id: z.number().int().optional(),
				organization: z.json().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				skip_approval: z.boolean().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_eb56e3af90eaOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_a3e235afb912Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				usage_designation: z.json().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				key_size: z.number().int().optional(),
				csr_key_type: z.string().optional(),
				signature_hash: z.string().optional(),
				comments: z.string().optional(),
				additional_emails: z.array(z.json()).optional(),
				csa_agreed_to: z.boolean().optional(),
				promo_code: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				requester: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				skip_approval: z.boolean().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_a3e235afb912Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_d3677b341798Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_d3677b341798Output = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_d9a1c6ca3a31Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				use_auth_key: z.boolean().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_d9a1c6ca3a31Output = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_a941335e148eInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_a941335e148eOutput = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_09dc6b5907cdInput = z
	.object({
		path: z.object({ client_certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				emails: z.array(z.json()).optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				csr: z.string().optional(),
				ca_cert_id: z.string().optional(),
				auto_renew: z.number().int().optional(),
				renewal_of_order_id: z.number().int().optional(),
				skip_approval: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				container: z.json().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				validity_years: z.number().int().optional(),
				custom_fields: z.json().optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_09dc6b5907cdOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_0f8799b1925fInput = z
	.object({
		path: z.object({ code_signing_certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				ca_cert_id: z.string().optional(),
				server_platform: z.json().optional(),
				organization_units: z.array(z.json()).optional(),
				auto_renew: z.number().int().optional(),
				additional_emails: z.array(z.json()).optional(),
				renewal_of_order_id: z.number().int().optional(),
				skip_approval: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				name: z.string().optional(),
				assumed_name: z.string().optional(),
				country: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				contacts: z.string().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				container: z.json().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				method: z.string().optional(),
				subject: z.json().optional(),
				custom_fields: z.json().optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				vat_number: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_0f8799b1925fOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_89fbabad7e9cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				dns_names: z.array(z.json()).optional(),
				vmc: z.json().optional(),
				logo: z.string().optional(),
				enable_hosting: z.boolean().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				comments: z.string().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_89fbabad7e9cOutput = z
	.object({
		id: z.number().int().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		vmc: z.json().optional(),
		logo_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_1493e154c3f6Input = z
	.object({
		path: z.object({ document_certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				csr: z.string().optional(),
				server_platform: z.json().optional(),
				signature_hash: z.string().optional(),
				cs_provisioning_method: z.string().optional(),
				use_org_as_common_name: z.boolean().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				validity_years: z.number().int().optional(),
				comments: z.string().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				container: z.json().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				subject: z.json().optional(),
				phone: z.string().optional(),
				custom_fields: z.json().optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				user_id_assignments: z.array(z.json()).optional(),
				skip_approval: z.boolean().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				vat_number: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_1493e154c3f6Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_c3967d800a90Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				server_platform: z.json().optional(),
				ca_cert_id: z.string().optional(),
				usage_designation: z.json().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				key_size: z.number().int().optional(),
				csr_key_type: z.string().optional(),
				signature_hash: z.string().optional(),
				comments: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				renewal_of_order_id: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				additional_emails: z.array(z.json()).optional(),
				user_id_assignments: z.array(z.json()).optional(),
				csa_agreed_to: z.boolean().optional(),
				promo_code: z.string().optional(),
				subject: z.json().optional(),
				given_name: z.string().optional(),
				surname: z.string().optional(),
				job_title: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_c3967d800a90Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_56d7bc836984Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				server_platform: z.json().optional(),
				ca_cert_id: z.string().optional(),
				usage_designation: z.json().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				key_size: z.number().int().optional(),
				csr_key_type: z.string().optional(),
				signature_hash: z.string().optional(),
				comments: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				additional_emails: z.array(z.json()).optional(),
				user_id_assignments: z.array(z.json()).optional(),
				csa_agreed_to: z.boolean().optional(),
				promo_code: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				individual: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_56d7bc836984Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_2dac0a15a7fdInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				server_platform: z.json().optional(),
				ca_cert_id: z.string().optional(),
				usage_designation: z.json().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				key_size: z.number().int().optional(),
				csr_key_type: z.string().optional(),
				signature_hash: z.string().optional(),
				comments: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				renewal_of_order_id: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				additional_emails: z.array(z.json()).optional(),
				user_id_assignments: z.array(z.json()).optional(),
				csa_agreed_to: z.boolean().optional(),
				promo_code: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_2dac0a15a7fdOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_c0609891ae33Input = z
	.object({
		path: z.object({ dv_ssl_certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				profile_option: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				dcv_emails: z.array(z.json()).optional(),
				use_auth_key: z.boolean().optional(),
				auth_key_id: z.string().optional(),
				dns_name: z.string().optional(),
				email_domain: z.string().optional(),
				email: z.string().optional(),
				locale: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.number().int().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				technical_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				telephone: z.string().optional(),
				job_title: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_c0609891ae33Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_0b4c79c821dcInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				psp_roles: z.array(z.json()).optional(),
				is_rsassa_pss: z.boolean().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				cert_validity: z.json().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				sca_token: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_0b4c79c821dcOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_0a3891051c4aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				cert_validity: z.json().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_0a3891051c4aOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_e5dcf600c0d7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				common_name_indictator: z.string().optional(),
				individual: z.json().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				renewed_thumbprint: z.string().optional(),
				cert_validity: z.json().optional(),
				comments: z.string().optional(),
				skip_approval: z.boolean().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_e5dcf600c0d7Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_c2ec15235334Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				common_name_indicator: z.string().optional(),
				individual: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				pseudonym: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				country: z.string().optional(),
				state: z.string().optional(),
				city: z.string().optional(),
				zip: z.string().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				method: z.string().optional(),
				csr: z.string().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				renewed_thumbprint: z.string().optional(),
				cert_validity: z.json().optional(),
				comments: z.string().optional(),
				skip_approval: z.boolean().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_c2ec15235334Output = z
	.object({
		id: z.number().int().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_191957a930e4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.string().optional(),
				common_name: z.string().optional(),
				service_name: z.string().optional(),
				dns_names: z.string().optional(),
				csr: z.string().optional(),
				profile_option: z.string().optional(),
				signature_hash: z.string().optional(),
				dcv_method: z.string().optional(),
				organization: z.string().optional(),
				id: z.string().optional(),
				contacts: z.string().optional(),
				server_platform: z.string().optional(),
				'renewed_thumbprint-or-renewal_of_order_id': z.string().optional(),
				custom_expiration_date: z.string().optional(),
				cert_validity: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.string().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_191957a930e4Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_f1de1effc183Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.string().optional(),
				common_name: z.string().optional(),
				service_name: z.string().optional(),
				dns_names: z.string().optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				psp_roles: z.string().optional(),
				dcv_method: z.string().optional(),
				organization: z.string().optional(),
				id: z.string().optional(),
				contacts: z.string().optional(),
				pseudonym: z.string().optional(),
				server_platform: z.string().optional(),
				profile_option: z.string().optional(),
				'renewed_thumbprint-or-renewal_of_order_id': z.string().optional(),
				custom_expiration_date: z.string().optional(),
				cert_validity: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.string().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				sca_token: z.string().optional(),
				billing_address: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_f1de1effc183Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_159cdf63adcaInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				dcv_emails: z.array(z.json()).optional(),
				use_auth_key: z.boolean().optional(),
				auth_key_id: z.string().optional(),
				dns_name: z.string().optional(),
				email_domain: z.string().optional(),
				email: z.string().optional(),
				locale: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				technical_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				telephone: z.string().optional(),
				job_title: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_159cdf63adcaOutput = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_95010aa1d993Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z
			.object({ include_caa_status: z.boolean().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_95010aa1d993Output = z
	.object({
		id: z.number().int().optional(),
		certificate: z.json().optional(),
		thumbprint: z.string().optional(),
		serial_number: z.string().optional(),
		common_name: z.string().optional(),
		cert_validity: z.json().optional(),
		emails: z.array(z.json()).optional(),
		dns_names: z.array(z.json()).optional(),
		date_created: z.string().optional(),
		date_issued: z.string().optional(),
		valid_from: z.string().optional(),
		valid_till: z.string().optional(),
		days_remaining: z.number().int().optional(),
		csr: z.string().optional(),
		organization: z.json().optional(),
		organization_units: z.array(z.json()).optional(),
		server_platform: z.json().optional(),
		signature_hash: z.string().optional(),
		key_size: z.number().int().optional(),
		ca_cert: z.json().optional(),
		additional_emails: z.array(z.json()).optional(),
		status: z.string().optional(),
		is_renewal: z.boolean().optional(),
		is_renewed: z.boolean().optional(),
		renewed_order_id: z.number().int().optional(),
		was_renewed_by_order_id: z.number().int().optional(),
		name: z.string().optional(),
		assumed_name: z.string().optional(),
		display_name: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		telephone: z.string().optional(),
		validity_years: z.string().optional(),
		order_valid_from: z.string().optional(),
		order_valid_till: z.string().optional(),
		order_validity: z.json().optional(),
		years: z.number().int().optional(),
		days: z.number().int().optional(),
		custom_expiration_date: z.string().optional(),
		disable_renewal_notifications: z.boolean().optional(),
		auto_renew: z.number().int().optional(),
		auto_reissue: z.number().int().optional(),
		container: z.json().optional(),
		is_active: z.boolean().optional(),
		product: z.json().optional(),
		name_id: z.string().optional(),
		type: z.string().optional(),
		validation_type: z.string().optional(),
		validation_name: z.string().optional(),
		validation_description: z.string().optional(),
		csr_required: z.boolean().optional(),
		organization_contact: z.json().optional(),
		technical_contact: z.json().optional(),
		user: z.json().optional(),
		purchased_dns_names: z.number().int().optional(),
		requests: z.array(z.json()).optional(),
		date: z.string().optional(),
		comments: z.string().optional(),
		receipt_id: z.number().int().optional(),
		subject: z.json().optional(),
		email: z.string().optional(),
		cs_provisioning_method: z.string().optional(),
		ship_info: z.json().optional(),
		addr1: z.string().optional(),
		addr2: z.string().optional(),
		zip: z.string().optional(),
		method: z.string().optional(),
		hardware_init_code: z.string().optional(),
		public_id: z.string().optional(),
		allow_duplicates: z.boolean().optional(),
		duplicates_count: z.number().int().optional(),
		reissues_count: z.number().int().optional(),
		price: z.number().optional(),
		currency: z.string().optional(),
		prices: z.array(z.json()).optional(),
		user_assignments: z.array(z.json()).optional(),
		is_out_of_contract: z.boolean().optional(),
		payment_method: z.string().optional(),
		payment_profile: z.json().optional(),
		product_name_id: z.string().optional(),
		custom_fields: z.array(z.json()).optional(),
		metadata_id: z.number().int().optional(),
		label: z.string().optional(),
		value: z.string().optional(),
		disable_issuance_email: z.boolean().optional(),
		disable_ct: z.boolean().optional(),
		alternative_order_id: z.string().optional(),
		api_key: z.json().optional(),
		key_type: z.string().optional(),
		benefits: z.json().optional(),
		actual_price: z.string().optional(),
		discount_percent: z.string().optional(),
		benefits_data: z.json().optional(),
		is_multi_year_plan: z.string().optional(),
		order_approval_complete: z.boolean().optional(),
		approver: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		is_guest_access_enabled: z.boolean().optional(),
		vmc: z.json().optional(),
		logo_id: z.number().int().optional(),
		logo: z.string().optional(),
		enable_hosting: z.boolean().optional(),
		hosted_logo_location: z.string().optional(),
		hosted_cert_location: z.string().optional(),
		mark_type: z.json().optional(),
		mark_type_data: z.json().optional(),
		trademark_country_code: z.string().optional(),
		trademark_registration_number: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_d47d505089b2Input = z
	.object({
		path: z.object({ ssl_certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_d47d505089b2Output = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_3aa38830d853Input = z
	.object({
		path: z.object({ ssl_certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_3aa38830d853Output = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_1d36c4da1722Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_1d36c4da1722Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_ed7bb79325cdInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_ed7bb79325cdOutput = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_11c324bdd693Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_11c324bdd693Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_c78a672ff18cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_c78a672ff18cOutput = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_dc85a3280001Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_dc85a3280001Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_93ed34af7e68Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_93ed34af7e68Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_dcecf46c1fbbInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_dcecf46c1fbbOutput = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_74b189e5ad53Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_74b189e5ad53Output = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_ec7f110447fbInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				organization: z.json().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_ec7f110447fbOutput = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_2a78e2010ac6Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				organization: z.json().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_2a78e2010ac6Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_5e63a22b01a3Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				oin: z.number().int().optional(),
				exclude_oin: z.boolean().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				csr: z.string().optional(),
				disable_generate_in_browser_email: z.boolean().optional(),
				csa_agreed_to: z.boolean().optional(),
				dcv_method: z.string().optional(),
				certificate_dcv_scope: z.string().optional(),
				use_qvtl_domain: z.string().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				organization: z.json().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_5e63a22b01a3Output = z
	.object({
		id: z.number().int().optional(),
		domains: z.json().optional(),
		name: z.string().optional(),
		dns_name: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_b302c342b6b8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_b302c342b6b8Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_b9ea55c57e9fInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_b9ea55c57e9fOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_cdbafa8cb54fInput = z
	.object({
		path: z.object({ private_ssl_certificate_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				ca_cert_id: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				profile_option: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				validity_years: z.number().int().optional(),
				validity_days: z.number().int().optional(),
				comments: z.string().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_cdbafa8cb54fOutput = z
	.object({
		id: z.number().int().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_398fcd149bccInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				csr: z.string().optional(),
				key_size: z.number().int().optional(),
				csr_key_type: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				emails: z.array(z.json()).optional(),
				user_principle_name: z.array(z.json()).optional(),
				common_name_indicator: z.string().optional(),
				individual: z.json().optional(),
				usage_designation: z.json().optional(),
				signature_hash: z.string().optional(),
				ca_cert_id: z.string().optional(),
				profile_type: z.string().optional(),
				auto_renew: z.number().int().optional(),
				renewal_of_order_id: z.number().int().optional(),
				skip_approval: z.boolean().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				container: z.json().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_398fcd149bccOutput = z
	.object({
		id: z.number().int().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_9f6a27310b14Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				server_licenses: z.number().int().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_9f6a27310b14Output = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_7d2b11ef40caInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				server_licenses: z.number().int().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_7d2b11ef40caOutput = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_6be9baf8c041Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				server_licenses: z.number().int().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_6be9baf8c041Output = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_f7a5b4e62ac8Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				server_licenses: z.number().int().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_f7a5b4e62ac8Output = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_9e11e8506b9aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				organization_units: z.array(z.json()).optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				comments: z.string().optional(),
				apply_cr_discount: z.boolean().optional(),
				serial_number: z.string().optional(),
				product: z.json().optional(),
				type_hint: z.string().optional(),
				auto_renew: z.number().int().optional(),
				auto_reissue: z.number().int().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				renewal_of_order_id: z.number().int().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				disable_ct: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				container: z.json().optional(),
				alternative_order_id: z.string().optional(),
				enable_guest_access: z.number().int().optional(),
				certificate_dcv_scope: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_9e11e8506b9aOutput = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_cd38e0a41be1Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				emails: z.array(z.json()).optional(),
				signature_hash: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				ca_cert_id: z.string().optional(),
				auto_renew: z.number().int().optional(),
				renewal_of_order_id: z.number().int().optional(),
				id: z.number().int().optional(),
				user_id_assignments: z.array(z.json()).optional(),
				csa_agreed_to: z.boolean().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_cd38e0a41be1Output = z
	.object({
		id: z.number().int().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_2eb02d4b4bceInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				requester: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				job_title: z.string().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				contacts: z.array(z.json()).optional(),
				cert_validity: z.json().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_2eb02d4b4bceOutput = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_b1982a6f1fd9Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				requester: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				job_title: z.string().optional(),
				cert_validity: z.json().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_b1982a6f1fd9Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_df8381884a60Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				requester: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				job_title: z.string().optional(),
				organization: z.json().optional(),
				contacts: z.array(z.json()).optional(),
				cert_validity: z.json().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_df8381884a60Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_ea0edb75c1d4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				individual: z.json().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				requester: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				job_title: z.string().optional(),
				cert_validity: z.json().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_ea0edb75c1d4Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_2f1de3705731Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				is_rsassa_pss: z.boolean().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				csa_agreed_to: z.boolean().optional(),
				provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				requester: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				telephone: z.string().optional(),
				job_title: z.string().optional(),
				organization: z.json().optional(),
				contacts: z.array(z.json()).optional(),
				cert_validity: z.json().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.string().optional(),
				expiration_year: z.string().optional(),
				cvv: z.string().optional(),
				cardholder_name: z.string().optional(),
				save_credit_card: z.string().optional(),
				set_as_default: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_2f1de3705731Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		organization: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_a9d557b1a987Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				dns_names: z.array(z.json()).optional(),
				vmc: z.json().optional(),
				logo: z.string().optional(),
				enable_hosting: z.boolean().optional(),
				mark_type: z.string().optional(),
				mark_type_data: z.json().optional(),
				trademark_country_code: z.string().optional(),
				trademark_registration_number: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				comments: z.string().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
				dcv_method: z.string().optional(),
				skip_approval: z.boolean().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				technical_contact: z.json().optional(),
				organization: z.json().optional(),
				id: z.number().int().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				contacts: z.array(z.json()).optional(),
				container: z.json().optional(),
				custom_fields: z.array(z.json()).optional(),
				metadata_id: z.number().int().optional(),
				value: z.string().optional(),
				alternative_order_id: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_a9d557b1a987Output = z
	.object({
		id: z.number().int().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		vmc: z.json().optional(),
		logo_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_5870683c0fddInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				csr: z.string().optional(),
				signature_hash: z.string().optional(),
				server_platform: z.json().optional(),
				comments: z.string().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				auto_renew: z.number().int().optional(),
				custom_renewal_message: z.string().optional(),
				renewal_of_order_id: z.number().int().optional(),
				key_usages: z.array(z.json()).optional(),
				extended_key_usages: z.array(z.json()).optional(),
				ca_cert_id: z.string().optional(),
				renewed_thumbprint: z.string().optional(),
				csa_agreed_to: z.boolean().optional(),
				promo_code: z.string().optional(),
				dcv_method: z.string().optional(),
				certificate_dcv_scope: z.string().optional(),
				skip_approval: z.boolean().optional(),
				additional_emails: z.array(z.json()).optional(),
				locale: z.string().optional(),
				organization: z.json().optional(),
				contacts: z.array(z.json()).optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				technical_contact: z.json().optional(),
				order_validity: z.json().optional(),
				years: z.number().int().optional(),
				days: z.number().int().optional(),
				custom_expiration_date: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				vat_number: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_5870683c0fddOutput = z
	.object({
		id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		organization: z.json().optional(),
		domains: z.array(z.json()).optional(),
		name: z.number().int().optional(),
		dns_name: z.string().optional(),
		dcv_token: z.json().optional(),
		requests: z.array(z.json()).optional(),
		status: z.string().optional(),
		certificate_id: z.number().int().optional(),
		certificate_chain: z.array(z.json()).optional(),
		subject_common_name: z.string().optional(),
		pem: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_53a320a8c6adInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ signature_units: z.number().int(), payment_method: z.string() })
			.strict(),
	})
	.strict();
const doc_53a320a8c6adOutput = z.json().optional();
const doc_a5e7a4804418Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				certificate: z.json().optional(),
				csr: z.string().optional(),
				common_name: z.string().optional(),
				dns_names: z.array(z.json()).optional(),
				emails: z.array(z.json()).optional(),
				user_principle_name: z.array(z.json()).optional(),
				common_name_indicator: z.string().optional(),
				individual: z.json().optional(),
				usage_designation: z.json().optional(),
				is_rsassa_pss: z.boolean().optional(),
				server_platform: z.json().optional(),
				cert_validity: z.json().optional(),
				signature_hash: z.string().optional(),
				profile_option: z.string().optional(),
				ca_cert_id: z.string().optional(),
				dcv_method: z.string().optional(),
				comments: z.string().optional(),
				skip_approval: z.boolean().optional(),
				certificate_dcv_scope: z.string().optional(),
				use_auth_key: z.boolean().optional(),
				cs_provisioning_method: z.string().optional(),
				ship_info: z.json().optional(),
				name: z.string().optional(),
				addr1: z.string().optional(),
				addr2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				country: z.string().optional(),
				method: z.string().optional(),
				subject: z.json().optional(),
				serial_number: z.string().optional(),
				pseudonym: z.string().optional(),
				job_title: z.string().optional(),
				include_pseudonym: z.boolean().optional(),
				include_email: z.boolean().optional(),
				include_given_name_surname: z.boolean().optional(),
				store_reissue_as_duplicate: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_a5e7a4804418Output = z
	.object({
		id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		dcv_random_value: z.string().optional(),
		requests: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_c974e0814d0cInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ emails: z.array(z.json()) }).strict(),
	})
	.strict();
const doc_c974e0814d0cOutput = z.json().optional();
const doc_ece6a500fcc4Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				revocation_reason: z.string().optional(),
				comment: z.string().optional(),
				skip_approval: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_ece6a500fcc4Output = z
	.object({
		id: z.number().int().optional(),
		date: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		requester: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		comments: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_fb4079d19b2cInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_fb4079d19b2cOutput = z
	.object({
		order_id: z.number().int().optional(),
		product_name_id: z.string().optional(),
		seal_hash: z.string().optional(),
		seal_number: z.string().optional(),
		seal_size: z.string().optional(),
		seal_hover: z.boolean().optional(),
		seal_autoplay: z.boolean().optional(),
		seal_use_logo: z.boolean().optional(),
		display_malware_scan: z.boolean().optional(),
		display_ct_log: z.boolean().optional(),
		display_pci_scan: z.boolean().optional(),
		display_blocklist_check: z.boolean().optional(),
		display_verified_customer: z.boolean().optional(),
		eligible_ct_log: z.boolean().optional(),
		eligible_blocklist_check: z.boolean().optional(),
		eligible_pci_scan: z.boolean().optional(),
		ct_log_enabled: z.boolean().optional(),
		pci_scan_enabled: z.boolean().optional(),
		seal_code: z.string().optional(),
		seal_logo: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_024f62ae3007Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({
				minutes: z.number().int().optional(),
				seconds: z.number().int().optional(),
				'filters[status_last_updated]': z.string().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_024f62ae3007Output = z
	.object({
		orders: z.array(z.json()).optional(),
		order_id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
		status: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_d747245e5a92Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ auto_reissue: z.number().int() }).strict(),
	})
	.strict();
const doc_d747245e5a92Output = z.json().optional();
const doc_68f7c024afdcInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ csr: z.string() }).strict(),
	})
	.strict();
const doc_68f7c024afdcOutput = z.json().optional();
const doc_371c627c78f8Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				contacts: z.array(z.json()).optional(),
				contact_type: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				language_id: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_371c627c78f8Output = z.json().optional();
const doc_d3087471b789Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ status: z.string(), note: z.string().optional() })
			.strict(),
	})
	.strict();
const doc_d3087471b789Output = z.json().optional();
const doc_d7be8ba6987cInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ custom_renewal_message: z.string().optional() })
			.strict()
			.optional(),
	})
	.strict();
const doc_d7be8ba6987cOutput = z.json().optional();
const doc_0bc073434146Input = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), status: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_0bc073434146Output = z.json().optional();
const doc_c407e746e39fInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				seal_number: z.number().int().optional(),
				seal_size: z.string().optional(),
				seal_hover: z.boolean().optional(),
				seal_autoplay: z.boolean().optional(),
				seal_use_logo: z.boolean().optional(),
				display_malware_scan: z.boolean().optional(),
				display_ct_log: z.boolean().optional(),
				display_pci_scan: z.boolean().optional(),
				display_blocklist_check: z.boolean().optional(),
				display_verified_customer: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_c407e746e39fOutput = z
	.object({
		order_id: z.number().int().optional(),
		product_name_id: z.string().optional(),
		seal_hash: z.string().optional(),
		seal_number: z.string().optional(),
		seal_size: z.string().optional(),
		seal_hover: z.boolean().optional(),
		seal_autoplay: z.boolean().optional(),
		seal_use_logo: z.boolean().optional(),
		display_malware_scan: z.boolean().optional(),
		display_ct_log: z.boolean().optional(),
		display_pci_scan: z.boolean().optional(),
		display_blocklist_check: z.boolean().optional(),
		display_verified_customer: z.boolean().optional(),
		eligible_ct_log: z.boolean().optional(),
		eligible_blocklist_check: z.boolean().optional(),
		eligible_pci_scan: z.boolean().optional(),
		ct_log_enabled: z.boolean().optional(),
		pci_scan_enabled: z.boolean().optional(),
		seal_code: z.string().optional(),
		seal_logo: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_856d9dd6a089Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_856d9dd6a089Output = z.json().optional();
const doc_4c494339b8bcInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_4c494339b8bcOutput = z.json().optional();
const doc_c458695a77c1Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_c458695a77c1Output = z
	.object({
		id: z.number().int().optional(),
		organization_id: z.number().int().optional(),
		trademark_country_code: z.string().optional(),
		trademark_registration_number: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_1cd57426d84fInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_1cd57426d84fOutput = z
	.object({
		id: z.number().int().optional(),
		organization_id: z.number().int().optional(),
		trademark_country_code: z.string().optional(),
		trademark_registration_number: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_00c9ade1d573Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z
			.object({ include_risk_check: z.boolean().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_00c9ade1d573Output = z
	.object({
		order_id: z.string().optional(),
		order_status: z.string().optional(),
		order_name_scope: z.string().optional(),
		order_dcv_method: z.string().optional(),
		organization_id: z.string().optional(),
		organization_name: z.string().optional(),
		organization_validations: z.array(z.json()).optional(),
		type: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		date_created: z.string().optional(),
		validated_until: z.string().optional(),
		status: z.string().optional(),
		verified_contacts: z.array(z.json()).optional(),
		verification_details: z.json().optional(),
		dns_name_validations: z.array(z.json()).optional(),
		domain_id: z.string().optional(),
		risk_status: z.string().optional(),
		method: z.string().optional(),
		name_scope: z.string().optional(),
		dns_names: z.array(z.json()).optional(),
		base_domain: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_51a82794cb6bInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_51a82794cb6bOutput = z
	.object({
		signatures: z.json().optional(),
		signatures_allotted: z.number().int().optional(),
		signatures_consumed: z.number().int().optional(),
		user_assigned: z.json().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		account_id: z.number().int().optional(),
		order_id: z.number().int().optional(),
		certificate_id: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_7e904da76356Input = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), note_id: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_7e904da76356Output = z
	.object({
		id: z.number().int().optional(),
		date_created: z.string().optional(),
		text: z.string().optional(),
		user: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_91ec86e31af6Input = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_91ec86e31af6Output = z.json().optional();
const doc_38b5a83402faInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				name: z.string().optional(),
				assumed_name: z.string().optional(),
				country: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				telephone: z.string().optional(),
				organization_contact: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				job_title: z.string().optional(),
				email: z.string().optional(),
				telephone_extension: z.string().optional(),
				skip_duplicate_org_check: z.boolean().optional(),
				validations: z.array(z.json()).optional(),
				type: z.string().optional(),
				verified_users: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_38b5a83402faOutput = z
	.object({ id: z.number().int().optional() })
	.passthrough()
	.optional();
const doc_60d5e42efa4dInput = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_60d5e42efa4dOutput = z.json().optional();
const doc_c81496b5c977Input = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_c81496b5c977Output = z.json().optional();
const doc_b4370f044cc5Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_b4370f044cc5Output = z
	.object({
		users: z.array(z.json()).optional(),
		user_id: z.string().optional(),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		job_title: z.string().optional(),
		telephone: z.string().optional(),
		email: z.string().optional(),
		contacts: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_11645edfc36dInput = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_11645edfc36dOutput = z
	.object({
		organization_contact: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		job_title: z.string().optional(),
		telephone: z.string().optional(),
		telephone_extension: z.string().optional(),
		language_id: z.string().optional(),
		name: z.string().optional(),
		contact_type: z.string().optional(),
		technical_contact: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_50cc2f9183daInput = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_50cc2f9183daOutput = z
	.object({
		id: z.number().int().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		assumed_name: z.string().optional(),
		display_name: z.string().optional(),
		is_active: z.boolean().optional(),
		address: z.string().optional(),
		address2: z.string().optional(),
		zip: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		telephone: z.string().optional(),
		container: z.json().optional(),
		parent_id: z.string().optional(),
		organization_contact: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		job_title: z.string().optional(),
		telephone_extension: z.string().optional(),
		verified_contacts: z.array(z.json()).optional(),
		verified_roles: z.array(z.json()).optional(),
		ev_approvers: z.array(z.json()).optional(),
		extended_validation: z.json().optional(),
		container_id_assignments: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_74e413c4970dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_74e413c4970dOutput = z
	.object({ organization_ids: z.array(z.json()).optional() })
	.passthrough()
	.optional();
const doc_a8d91a5423b6Input = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				validations: z.array(z.json()).optional(),
				type: z.string().optional(),
				verified_users: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_a8d91a5423b6Output = z.json().optional();
const doc_b2e717699b06Input = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				contacts: z.array(z.json()).optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				telephone_extension: z.string().optional(),
				language_id: z.string().optional(),
				contact_type: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_b2e717699b06Output = z.json().optional();
const doc_0215c703c550Input = z
	.object({
		path: z.object({ organization_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_0215c703c550Output = z
	.object({
		validations: z.array(z.json()).optional(),
		type: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		date_created: z.string().optional(),
		validated_until: z.string().optional(),
		status: z.string().optional(),
		verified_users: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_c52e159d5991Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_c52e159d5991Output = z
	.object({ validation_types: z.array(z.json()).optional() })
	.passthrough()
	.optional();
const doc_666f59568c27Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_666f59568c27Output = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		install_url: z.string().optional(),
		csr_url: z.string().optional(),
		best_format: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_8465456a9693Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_8465456a9693Output = z
	.object({
		standard_prices: z.array(z.json()).optional(),
		group_name: z.string().optional(),
		name_id: z.string().optional(),
		name: z.string().optional(),
		prices: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_f16f9dd049d1Input = z
	.object({
		path: z.object({ name_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_f16f9dd049d1Output = z
	.object({
		group_name: z.string().optional(),
		name_id: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		validation_type: z.string().optional(),
		duplicates_allowed: z.boolean().optional(),
		allowed_validity_years: z.array(z.json()).optional(),
		allowed_order_validity_years: z.array(z.json()).optional(),
		max_multi_year_order_validity_years: z.number().int().optional(),
		signature_hash_types: z.json().optional(),
		allowed_hash_types: z.array(z.json()).optional(),
		default_hash_type_id: z.string().optional(),
		allowed_ca_certs: z.array(z.json()).optional(),
		id: z.string().optional(),
		chain_info: z.string().optional(),
		default_intermediate: z.string().optional(),
		additional_dns_names_allowed: z.boolean().optional(),
		increased_compatibility_allowed: z.boolean().optional(),
		custom_expiration_date_allowed: z.boolean().optional(),
		custom_order_expiration_date_allowed: z.boolean().optional(),
		csr_required: z.boolean().optional(),
		allow_auto_renew: z.boolean().optional(),
		allow_auto_reissue: z.boolean().optional(),
		server_platforms: z.array(z.json()).optional(),
		install_url: z.string().optional(),
		csr_url: z.string().optional(),
		best_format: z.string().optional(),
		license_agreement: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_3dd2a16378a7Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_3dd2a16378a7Output = z
	.object({
		products: z.array(z.json()).optional(),
		group_name: z.string().optional(),
		name_id: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		allowed_container_ids: z.array(z.json()).optional(),
		allowed_validity_years: z.array(z.json()).optional(),
		allowed_order_validity_years: z.array(z.json()).optional(),
		signature_hash_types: z.json().optional(),
		allowed_ca_certs: z.array(z.json()).optional(),
		csr_required: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_91596e1eec37Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_91596e1eec37Output = z
	.object({
		expiring_orders: z.array(z.json()).optional(),
		days_expiring: z.number().optional(),
		'order_count/countNote: If include_expiring_certs is true, returns as count instead of order_count.':
			z.number().optional(),
		expiring_certs: z.array(z.json()).optional(),
		count: z.number().optional(),
	})
	.passthrough()
	.optional();
const doc_e0f375953ec2Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_e0f375953ec2Output = z.json().optional();
const doc_8798826d45afInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_8798826d45afOutput = z
	.object({
		request: z.json().optional(),
		total: z.number().int().optional(),
		types: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_6df583932616Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_6df583932616Output = z
	.object({
		requests: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		date: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		requester: z.json().optional(),
		order: z.json().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_44723439c252Input = z
	.object({
		path: z.object({ request_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_44723439c252Output = z
	.object({
		id: z.number().int().optional(),
		date: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		date_processed: z.string().optional(),
		requester: z.json().optional(),
		reviewer: z.json().optional(),
		processor: z.json().optional(),
		order: z.json().optional(),
		unsubmitted_domains: z.array(z.json()).optional(),
		renewal_of_order_valid_till: z.string().optional(),
		comments: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_473a86610c11Input = z
	.object({
		path: z.object({ request_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_473a86610c11Output = z.json().optional();
const doc_baa0fe4977e9Input = z
	.object({
		path: z.object({ request_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ status: z.string(), processor_comment: z.string().optional() })
			.strict(),
	})
	.strict();
const doc_baa0fe4977e9Output = z.json().optional();
const doc_7396b08a6f91Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ amount: z.number().int(), transaction_type: z.string() })
			.strict(),
	})
	.strict();
const doc_7396b08a6f91Output = z.json().optional();
const doc_512fbcb31521Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_512fbcb31521Output = z
	.object({
		amount: z.number().int().optional(),
		currency: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_6aea189047bbInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_6aea189047bbOutput = z.json().optional();
const doc_e003784932c5Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_type: z.string().optional(),
				allowed_grandchildren: z.array(z.json()).optional(),
				account_manager_user_id: z.number().int().optional(),
				bill_parent: z.boolean().optional(),
				enforce_bill_parent: z.boolean().optional(),
				child_name: z.string().optional(),
				user: z.json().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string().optional(),
				username: z.string().optional(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				disable_renewal_notifications: z.boolean().optional(),
				organization: z.json().optional(),
				name: z.string().optional(),
				assumed_name: z.string().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				zip: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				max_allowed_multi_year_plan_length: z.number().int().optional(),
				allow_parent_order_renewal: z.boolean().optional(),
				enable_ica_selection: z.boolean().optional(),
				custom_order_validity: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_e003784932c5Output = z
	.object({
		id: z.number().int().optional(),
		account_type: z.string().optional(),
		account_manager_user_id: z.number().int().optional(),
		bill_parent: z.boolean().optional(),
		organization: z.json().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		assumed_name: z.string().optional(),
		display_name: z.string().optional(),
		is_active: z.boolean().optional(),
		address: z.string().optional(),
		address2: z.string().optional(),
		zip: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		telephone: z.string().optional(),
		container: z.json().optional(),
		user: z.json().optional(),
		username: z.string().optional(),
		account_id: z.number().int().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		job_title: z.string().optional(),
		type: z.string().optional(),
		api_key: z.string().optional(),
		child_name: z.string().optional(),
		max_allowed_multi_year_plan_length: z.number().int().optional(),
		allow_parent_order_renewal: z.boolean().optional(),
		enable_ica_selection: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_816b2c098a33Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				unit_account_id: z.number().int().optional(),
				notes: z.string().optional(),
				bundle: z.array(z.json()).optional(),
				product_name_id: z.string().optional(),
				units: z.number().int().optional(),
			})
			.strict(),
	})
	.strict();
const doc_816b2c098a33Output = z
	.object({ id: z.number().int().optional() })
	.passthrough()
	.optional();
const doc_503cf4e16d2bInput = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				account_manager_user_id: z.number().int().optional(),
				bill_parent: z.boolean().optional(),
				child_name: z.string().optional(),
				allow_parent_order_renewal: z.boolean().optional(),
				allow_removing_account_manager: z.boolean().optional(),
				enable_ica_selection: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const doc_503cf4e16d2bOutput = z.json().optional();
const doc_74f49ae8a8a6Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_74f49ae8a8a6Output = z
	.object({
		domains: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		is_active: z.boolean().optional(),
		name: z.string().optional(),
		dcv_approval_datetime: z.string().optional(),
		last_submitted_datetime: z.string().optional(),
		date_created: z.string().optional(),
		organization: z.json().optional(),
		validations: z.array(z.json()).optional(),
		dcv_method: z.string().optional(),
		dcv_expiration: z.string().optional(),
		container: z.json().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_ab644043c397Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_ab644043c397Output = z
	.object({
		orders: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		certificate: z.json().optional(),
		subaccount: z.json().optional(),
		product: z.json().optional(),
		order_price: z.json().optional(),
		status: z.string().optional(),
		number_of_sans: z.number().int().optional(),
		date_created: z.string().optional(),
		date_issued: z.string().optional(),
		validity_years: z.number().int().optional(),
		order_prices: z.array(z.json()).optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_d5803b6e7447Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_d5803b6e7447Output = z
	.object({
		organizations: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		display_name: z.string().optional(),
		validations: z.array(z.json()).optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_e1dc075902d1Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_e1dc075902d1Output = z
	.object({
		product_limits: z.array(z.json()).optional(),
		product_name_id: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_6d243866e576Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_6d243866e576Output = z
	.object({
		currency: z.string().optional(),
		pricing_method: z.string().optional(),
		balance_negative_limit: z.number().int().optional(),
		products: z.array(z.json()).optional(),
		product_name_id: z.string().optional(),
		product_name: z.string().optional(),
		product_shim_map: z.array(z.json()).optional(),
		prices: z.array(z.json()).optional(),
		unit: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_56a9f95675c0Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_56a9f95675c0Output = z
	.object({
		child_accounts: z.array(z.json()).optional(),
		account_id: z.number().int().optional(),
		account_type: z.string().optional(),
		organization_name: z.string().optional(),
		date_created: z.string().optional(),
		account_manager: z.string().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_2e94b48c0b5aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_2e94b48c0b5aOutput = z
	.object({
		orders: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		unit_account_id: z.number().int().optional(),
		unit_account_name: z.string().optional(),
		cost: z.number().optional(),
		currency: z.string().optional(),
		status: z.string().optional(),
		expiration_date: z.string().optional(),
		created_date: z.string().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_22d7ace97d71Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				currency: z.string().optional(),
				pricing_method: z.string().optional(),
				balance_negative_limit: z.number().int().optional(),
				products: z.array(z.json()).optional(),
				product_name_id: z.string().optional(),
				prices: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_22d7ace97d71Output = z.json().optional();
const doc_704eaf682fa9Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_704eaf682fa9Output = z
	.object({
		account_id: z.number().int().optional(),
		account_type: z.string().optional(),
		organization_name: z.string().optional(),
		child_name: z.string().optional(),
		date_created: z.string().optional(),
		parent_account_id: z.string().optional(),
		billing_account_name: z.string().optional(),
		billing_account_id: z.number().int().optional(),
		account_manager: z.string().optional(),
		bill_parent: z.boolean().optional(),
		enforce_bill_parent: z.boolean().optional(),
		master_user: z.json().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		job_title: z.string().optional(),
		telephone: z.string().optional(),
		i18n_language_id: z.string().optional(),
		container_id: z.string().optional(),
		organization: z.json().optional(),
		id: z.number().int().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		address: z.string().optional(),
		zip: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		country: z.string().optional(),
		is_active: z.boolean().optional(),
		container: z.json().optional(),
		billing_contact: z.json().optional(),
		phone: z.string().optional(),
		max_allowed_multi_year_plan_length: z.number().int().optional(),
		allow_parent_order_renewal: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_6b9b6089bd0cInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z
			.object({
				include_validation_status: z.boolean().optional(),
				include_cs_provisioning_method: z.boolean().optional(),
			})
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_6b9b6089bd0cOutput = z
	.object({
		id: z.number().int().optional(),
		certificate: z.json().optional(),
		thumbprint: z.string().optional(),
		serial_number: z.string().optional(),
		common_name: z.string().optional(),
		dns_names: z.array(z.json()).optional(),
		valid_till: z.string().optional(),
		organization_units: z.array(z.json()).optional(),
		signature_hash: z.string().optional(),
		ca_cert: z.json().optional(),
		organization: z.json().optional(),
		name: z.string().optional(),
		assumed_name: z.string().optional(),
		display_name: z.string().optional(),
		subaccount: z.json().optional(),
		account_id: z.number().int().optional(),
		account_type: z.string().optional(),
		organization_name: z.string().optional(),
		product: z.json().optional(),
		name_id: z.string().optional(),
		type: z.string().optional(),
		order_price: z.json().optional(),
		cost: z.number().int().optional(),
		currency: z.string().optional(),
		status: z.string().optional(),
		number_of_sans: z.number().int().optional(),
		date_created: z.string().optional(),
		date_issued: z.string().optional(),
		is_multi_year_plan: z.string().optional(),
		order_valid_from: z.string().optional(),
		order_valid_till: z.string().optional(),
		validity_years: z.number().int().optional(),
		order_prices: z.array(z.json()).optional(),
		subaccount_order_validations: z.json().optional(),
		order_name_scope: z.string().optional(),
		order_dcv_method: z.string().optional(),
		organization_validations: z.array(z.json()).optional(),
		dns_name_validations: z.array(z.json()).optional(),
		cs_provisioning_method: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_08798f327d62Input = z
	.object({
		path: z.object({ subaccount_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_08798f327d62Output = z
	.object({
		subaccount_price: z.json().optional(),
		cost: z.number().optional(),
		currency: z.string().optional(),
		order_price: z.json().optional(),
		order_prices: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_eb9bb3268567Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_eb9bb3268567Output = z
	.object({
		id: z.number().int().optional(),
		unit_account_id: z.number().int().optional(),
		unit_account_name: z.string().optional(),
		bundle: z.array(z.json()).optional(),
		product_name_id: z.string().optional(),
		product_name: z.string().optional(),
		units: z.number().int().optional(),
		cost: z.number().optional(),
		status: z.string().optional(),
		expiration_date: z.string().optional(),
		created_date: z.string().optional(),
		can_cancel: z.boolean().optional(),
	})
	.passthrough()
	.optional();
const doc_d1001d003fbfInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				is_api_only: z.boolean().optional(),
				email: z.string().optional(),
				api_name: z.string().optional(),
				restricted_to_role_id: z.number().int().optional(),
				container_id_assignments: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_d1001d003fbfOutput = z
	.object({ id: z.number().int().optional(), api_key: z.string().optional() })
	.passthrough()
	.optional();
const doc_a0f2712ff23dInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				username: z.string(),
				first_name: z.string(),
				last_name: z.string(),
				email: z.string(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				container: z.json().optional(),
				id: z.number().int().optional(),
				access_roles: z.array(z.json()),
				container_id_assignments: z.array(z.json()).optional(),
				is_saml_sso_only: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
const doc_a0f2712ff23dOutput = z
	.object({ id: z.number().int().optional() })
	.passthrough()
	.optional();
const doc_dc9fc9718da9Input = z
	.object({
		path: z.object({ invitation_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				status: z.string().optional(),
				processor_comment: z.string().optional(),
				requested_user: z.json().optional(),
				container_id_assignments: z.array(z.json()).optional(),
				access_roles: z.array(z.json()).optional(),
			})
			.strict(),
	})
	.strict();
const doc_dc9fc9718da9Output = z.json().optional();
const doc_04640f5ca9dbInput = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({ access_roles: z.array(z.json()), id: z.number().int() })
			.strict(),
	})
	.strict();
const doc_04640f5ca9dbOutput = z.json().optional();
const doc_6dcc4cfc0332Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				user_id: z.number().int(),
				delegated_verified_contact_id: z.number().int(),
			})
			.strict(),
	})
	.strict();
const doc_6dcc4cfc0332Output = z
	.object({ status: z.string().optional() })
	.passthrough()
	.optional();
const doc_4f3aa3dcbddfInput = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_4f3aa3dcbddfOutput = z.json().optional();
const doc_acb283c67d28Input = z
	.object({
		path: z.object({ delegation_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_acb283c67d28Output = z.json().optional();
const doc_c2cad94af625Input = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ email: z.string() }).strict(),
	})
	.strict();
const doc_c2cad94af625Output = z.json().optional();
const doc_99cd5c10b76eInput = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				username: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				email: z.string(),
				job_title: z.string().optional(),
				telephone: z.string().optional(),
				is_saml_sso_only: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_99cd5c10b76eOutput = z.json().optional();
const doc_05d5cbb0f106Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_05d5cbb0f106Output = z
	.object({
		users: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		username: z.string().optional(),
		account_id: z.number().int().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		status: z.string().optional(),
		container: z.json().optional(),
		access_roles: z.array(z.json()).optional(),
		type: z.string().optional(),
		has_container_assignments: z.boolean().optional(),
		container_assignments: z.array(z.json()).optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_77496855f701Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_77496855f701Output = z
	.object({
		invites: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		date_created: z.string().optional(),
		date_accepted: z.string().optional(),
		last_sent_date: z.string().optional(),
		status: z.string().optional(),
		email: z.string().optional(),
		container_id: z.number().int().optional(),
		user: z.json().optional(),
		requested_user: z.json().optional(),
		page: z.json().optional(),
		total: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_14c9ed9ecbeaInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ user_id: z.number().int().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_14c9ed9ecbeaOutput = z
	.object({
		delegations: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		user_id: z.number().int().optional(),
		delegated_verified_contact_id: z.number().int().optional(),
		verified_contact_first_name: z.string().optional(),
		verified_contact_last_name: z.string().optional(),
		verified_contact_email: z.string().optional(),
		organization_id: z.number().int().optional(),
		status: z.string().optional(),
		email_last_sent: z.string().optional(),
		date_created: z.string().optional(),
		requested_by_user_id: z.number().int().optional(),
		delegation_group_id: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_acb30b6fe47cInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_acb30b6fe47cOutput = z
	.object({
		contacts: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_13f84ef14d51Input = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_13f84ef14d51Output = z.json().optional();
const doc_7c7b9e214afcInput = z
	.object({
		path: z.object({ delegation_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_7c7b9e214afcOutput = z.json().optional();
const doc_9d28384fd2c0Input = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ container_id_assignments: z.array(z.json()) }).strict(),
	})
	.strict();
const doc_9d28384fd2c0Output = z.json().optional();
const doc_eab6767a5cc2Input = z
	.object({
		path: z.object({ user_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_eab6767a5cc2Output = z
	.object({
		id: z.number().int().optional(),
		username: z.string().optional(),
		account_id: z.number().int().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		job_title: z.string().optional(),
		telephone: z.string().optional(),
		status: z.string().optional(),
		last_login_date: z.string().optional(),
		container: z.json().optional(),
		public_id: z.string().optional(),
		name: z.string().optional(),
		parent_id: z.number().int().optional(),
		template_id: z.number().int().optional(),
		ekey: z.string().optional(),
		has_logo: z.boolean().optional(),
		is_active: z.boolean().optional(),
		access_roles: z.array(z.json()).optional(),
		is_cert_central: z.boolean().optional(),
		is_enterprise: z.boolean().optional(),
		is_saml_sso_only: z.boolean().optional(),
		type: z.string().optional(),
		language_id: z.number().int().optional(),
		account_language_id: z.number().int().optional(),
		has_container_assignments: z.boolean().optional(),
		container_assignments: z.array(z.json()).optional(),
		container_visibility: z.array(z.json()).optional(),
		allowed_domain_names: z.array(z.json()).optional(),
		organization_assignments: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_fe8391ee5a60Input = z
	.object({
		path: z.object({ user_name: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_fe8391ee5a60Output = z
	.object({ available: z.boolean().optional() })
	.passthrough()
	.optional();
const doc_90cef15abecdInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.object({ logo: z.string() }).strict(),
	})
	.strict();
const doc_90cef15abecdOutput = z.json().optional();
const doc_7ca7fbf49e63Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_7ca7fbf49e63Output = z.json().optional();
const doc_032cc159a9c0Input = z
	.object({
		path: z.object({ id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_032cc159a9c0Output = z.json().optional();
const doc_6dffbee7df22Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z
			.object({
				vouchers: z.array(z.json()).optional(),
				product_name_id: z.string().optional(),
				no_of_fqdns: z.number().int().optional(),
				no_of_wildcards: z.number().int().optional(),
				validity_years: z.number().int().optional(),
				validity_days: z.number().int().optional(),
				quantity: z.number().int().optional(),
				shipping_method: z.string().optional(),
				payment_method: z.string().optional(),
				credit_card: z.json().optional(),
				number: z.string().optional(),
				expiration_month: z.number().int().optional(),
				expiration_year: z.number().int().optional(),
				cvv: z.number().int().optional(),
				cardholder_name: z.string().optional(),
				billing_address: z.json().optional(),
				address: z.string().optional(),
				address2: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				country: z.string().optional(),
				zip: z.string().optional(),
				billing_contact: z.json().optional(),
				name: z.string().optional(),
				organization_name: z.string().optional(),
				email: z.string().optional(),
				phone: z.string().optional(),
				notes: z.string().optional(),
			})
			.strict(),
	})
	.strict();
const doc_6dffbee7df22Output = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		cost: z.number().optional(),
		cost_plus_tax: z.number().optional(),
		created_date: z.string().optional(),
		expiration_date: z.string().optional(),
		receipt_id: z.number().int().optional(),
		invoice_id: z.number().int().optional(),
		codes: z.array(z.json()).optional(),
		value: z.string().optional(),
		product: z.json().optional(),
		no_of_fqdns: z.number().int().optional(),
		no_of_wildcards: z.number().int().optional(),
		validity_years: z.number().int().optional(),
		validity_days: z.number().int().optional(),
		notes: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_22a02832d5c8Input = z
	.object({
		path: z.object({ id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_22a02832d5c8Output = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		cost: z.number().int().optional(),
		currency: z.string().optional(),
		created_date: z.string().optional(),
		expiration_date: z.string().optional(),
		can_cancel: z.boolean().optional(),
		codes: z.json().optional(),
		value: z.string().optional(),
		product_name_id: z.string().optional(),
		no_of_fqdns: z.number().int().optional(),
		no_of_wildcards: z.number().int().optional(),
		validity_years: z.number().int().optional(),
		validity_days: z.number().int().optional(),
		notes: z.string().optional(),
		used_from: z.string().optional(),
		valid_till: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_0253c8f31570Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_0253c8f31570Output = z
	.object({
		voucher_orders: z.json().optional(),
		id: z.number().int().optional(),
		status: z.string().optional(),
		cost: z.number().optional(),
		cost_plus_tax: z.number().optional(),
		currency: z.string().optional(),
		created_date: z.string().optional(),
		expiration_date: z.string().optional(),
		receipt_id: z.number().int().optional(),
		invoice_id: z.number().int().optional(),
		notes: z.string().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_24364ddc889bInput = z
	.object({
		path: z.object({ voucher_order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_24364ddc889bOutput = z
	.object({
		codes: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		value: z.string().optional(),
		product_name: z.string().optional(),
		no_of_fqdns: z.number().int().optional(),
		no_of_wildcards: z.string().optional(),
		shipping_method: z.string().optional(),
		validity_years: z.number().int().optional(),
		validity_days: z.number().int().optional(),
		status: z.string().optional(),
		created_date: z.string().optional(),
		voucher_order_id: z.number().int().optional(),
		cert_request_date: z.string().optional(),
		cert_validity_start_date: z.string().optional(),
		cert_validity_end_date: z.string().optional(),
		cert_organization: z.string().optional(),
		cert_common_name: z.string().optional(),
		certificate_order_id: z.string().optional(),
		voucher_validity_end_date: z.string().optional(),
		order_valid_from: z.string().optional(),
		order_valid_till: z.string().optional(),
		server_licenses: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_66501a2d927aInput = z
	.object({
		path: z.object({}).strict().default({}),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_66501a2d927aOutput = z
	.object({
		codes: z.array(z.json()).optional(),
		id: z.number().int().optional(),
		value: z.string().optional(),
		product_name: z.string().optional(),
		no_of_fqdns: z.number().int().optional(),
		no_of_wildcards: z.string().optional(),
		shipping_method: z.string().optional(),
		validity_years: z.number().int().optional(),
		validity_days: z.number().int().optional(),
		status: z.string().optional(),
		created_date: z.string().optional(),
		voucher_order_id: z.number().int().optional(),
		cert_request_date: z.string().optional(),
		cert_validity_start_date: z.string().optional(),
		cert_validity_end_date: z.string().optional(),
		cert_organization: z.string().optional(),
		cert_common_name: z.string().optional(),
		certificate_order_id: z.string().optional(),
		voucher_validity_end_date: z.string().optional(),
		order_valid_from: z.string().optional(),
		order_valid_till: z.string().optional(),
		server_licenses: z.number().int().optional(),
	})
	.passthrough()
	.optional();
const doc_386a3b63ebcdInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_386a3b63ebcdOutput = z.json().optional();
const doc_6e582dcd1d0bInput = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), domain_name: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_6e582dcd1d0bOutput = z.json().optional();
const doc_d1f51d8aad67Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_d1f51d8aad67Output = z.json().optional();
const doc_8086b322241cInput = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_8086b322241cOutput = z
	.object({ status: z.string().optional() })
	.passthrough()
	.optional();
const doc_6b3b0b1d5184Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_6b3b0b1d5184Output = z
	.object({ setting: z.string().optional() })
	.passthrough()
	.optional();
const doc_a3c0623a5337Input = z
	.object({
		path: z.object({ order_id: z.string().min(1) }).strict(),
		query: z.record(z.string(), z.json()),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_a3c0623a5337Output = z
	.object({
		domains_scan_details: z.array(z.json()).optional(),
		host_name: z.string().optional(),
		scan_start_date: z.string().optional(),
		scan_end_date: z.string().optional(),
		vulnerability_status: z.string().optional(),
		notification_status: z.string().optional(),
		critical_vulnerabilities_count: z.number().int().optional(),
		severe_vulnerabilities_count: z.number().int().optional(),
		moderate_vulnerabilities_count: z.number().int().optional(),
		is_download_available: z.boolean().optional(),
		is_rescan_available: z.boolean().optional(),
		is_site_enabled: z.boolean().optional(),
		page: z.json().optional(),
	})
	.passthrough()
	.optional();
const doc_cf596c53b5beInput = z
	.object({
		path: z
			.object({ order_id: z.string().min(1), domain: z.string().min(1) })
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: z.json().optional(),
	})
	.strict();
const doc_cf596c53b5beOutput = z.json().optional();
// Report Library create/edit bodies are nested: schedule, notification
// recipients, and report_metadata are objects/arrays, not flattened fields.
const reportScheduleSchema = z
	.object({
		frequency: z.string(),
		weekday_to_run: z.string().optional(),
		weekday_frequency: z.string().optional(),
		// Docs table says string; the published cURL example sends an integer.
		repeat_every: z.union([z.string(), z.number().int()]).optional(),
		repeat_on: z.string().optional(),
		repeat_on_date: z
			.object({
				date: z.number().int().optional(),
				last_day_of_the_month: z.boolean().optional(),
			})
			.strict()
			.optional(),
		run_until: z.string().optional(),
	})
	.strict();
const reportNotificationEmailSchema = z
	.object({
		user_id: z.number().int(),
		first_name: z.string(),
		last_name: z.string(),
		email: z.string(),
	})
	.strict();
const reportMetadataSchema = z
	.object({
		report_type: z.string(),
		columns: z.array(z.object({ identifier: z.string() }).strict()).optional(),
		filters: z
			.array(
				z
					.object({
						column_identifier: z.string(),
						values: z.array(z.string()).optional(),
						filter_identifier: z.string(),
					})
					.strict(),
			)
			.optional(),
		sources: z
			.object({
				division_filter_type: z.string().optional(),
				divisions: z.array(z.number().int()).optional(),
				sub_account_filter_type: z.string().optional(),
				sub_accounts: z.array(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
const reportRequestBodySchema = z
	.object({
		display_name: z.string(),
		schedule: reportScheduleSchema,
		format: z.array(z.string()),
		notification_emails: z.array(reportNotificationEmailSchema).optional(),
		report_metadata: reportMetadataSchema,
	})
	.strict();
const doc_25993fbcf6e2Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ language_id: z.number().int().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: reportRequestBodySchema,
	})
	.strict();
const doc_25993fbcf6e2Output = z
	.object({
		report_identifier: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough()
	.optional();
const doc_9e251cf5f94bInput = z
	.object({
		path: z
			.object({
				report_identifier: z.string().min(1),
				report_run_identifier: z.string().min(1),
			})
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_9e251cf5f94bOutput = z
	.object({ message: z.string().optional() })
	.passthrough()
	.optional();
const doc_5572d37bb03dInput = z
	.object({
		path: z.object({ report_identifier: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_5572d37bb03dOutput = z
	.object({ message: z.string().optional() })
	.passthrough()
	.optional();
const doc_53f4f8bcf551Input = z
	.object({
		path: z.object({ report_identifier: z.string().min(1) }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_53f4f8bcf551Output = z
	.object({ message: z.string().optional() })
	.passthrough()
	.optional();
const doc_f22fa239a636Input = z
	.object({
		path: z
			.object({
				report_identifier: z.string().uuid(),
				report_run_identifier: z.string().uuid(),
			})
			.strict(),
		query: z
			.object({
				report_format: z.enum(['JSON', 'CSV', 'EXCEL', 'ZIP']),
				split_report_sequence: z.number().int().min(0).optional(),
			})
			.strict(),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_f22fa239a636Output = z.array(z.number().int().min(0).max(255));
const doc_d6c0bc13eb4bInput = z
	.object({
		path: z.object({ report_identifier: z.string().min(1) }).strict(),
		query: z
			.object({ language_id: z.number().int().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
		body: reportRequestBodySchema,
	})
	.strict();
const doc_d6c0bc13eb4bOutput = z.json().optional();
const doc_5574ec7619c8Input = z
	.object({
		path: z
			.object({
				report_identifier: z.string().min(1),
				report_run_identifier: z.string().min(1),
			})
			.strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_5574ec7619c8Output = z.json().optional();
const doc_08c16f4a80d4Input = z
	.object({
		path: z.object({}).strict().default({}),
		query: z
			.object({ language_id: z.number().int().optional() })
			.strict()
			.default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_08c16f4a80d4Output = z
	.object({
		display_categories: z.array(z.json()).optional(),
		display_category_name: z.string().optional(),
		display_sub_categories: z.array(z.json()).optional(),
	})
	.passthrough()
	.optional();
const doc_b285fe5a9222Input = z
	.object({
		path: z.object({ report_identifier: z.string().uuid() }).strict(),
		query: z.object({}).strict().default({}),
		headers: z.object({}).strict().default({}),
		cookies: z.object({}).strict().default({}),
	})
	.strict();
const doc_b285fe5a9222Output = z
	.object({
		report_identifier: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough()
	.optional();

const generatedSchemas = {
	doc_b404e0df280eInput: doc_b404e0df280eInput,
	doc_b404e0df280eOutput: doc_b404e0df280eOutput,
	doc_9eaf8d093062Input: doc_9eaf8d093062Input,
	doc_9eaf8d093062Output: doc_9eaf8d093062Output,
	doc_d3cc6430936dInput: doc_d3cc6430936dInput,
	doc_d3cc6430936dOutput: doc_d3cc6430936dOutput,
	doc_00ad039ae491Input: doc_00ad039ae491Input,
	doc_00ad039ae491Output: doc_00ad039ae491Output,
	doc_1ef869474727Input: doc_1ef869474727Input,
	doc_1ef869474727Output: doc_1ef869474727Output,
	doc_bb6c5576f14bInput: doc_bb6c5576f14bInput,
	doc_bb6c5576f14bOutput: doc_bb6c5576f14bOutput,
	doc_a8eee1e78e72Input: doc_a8eee1e78e72Input,
	doc_a8eee1e78e72Output: doc_a8eee1e78e72Output,
	doc_c391f0331b7eInput: doc_c391f0331b7eInput,
	doc_c391f0331b7eOutput: doc_c391f0331b7eOutput,
	doc_abdf255be06aInput: doc_abdf255be06aInput,
	doc_abdf255be06aOutput: doc_abdf255be06aOutput,
	doc_f5cd45279030Input: doc_f5cd45279030Input,
	doc_f5cd45279030Output: doc_f5cd45279030Output,
	doc_7f053e614b94Input: doc_7f053e614b94Input,
	doc_7f053e614b94Output: doc_7f053e614b94Output,
	doc_8ed6be3e6d29Input: doc_8ed6be3e6d29Input,
	doc_8ed6be3e6d29Output: doc_8ed6be3e6d29Output,
	doc_d9379f0e3a78Input: doc_d9379f0e3a78Input,
	doc_d9379f0e3a78Output: doc_d9379f0e3a78Output,
	doc_35988e9424cfInput: doc_35988e9424cfInput,
	doc_35988e9424cfOutput: doc_35988e9424cfOutput,
	doc_10eeaf071883Input: doc_10eeaf071883Input,
	doc_10eeaf071883Output: doc_10eeaf071883Output,
	doc_12638b157910Input: doc_12638b157910Input,
	doc_12638b157910Output: doc_12638b157910Output,
	doc_ad55507625c4Input: doc_ad55507625c4Input,
	doc_ad55507625c4Output: doc_ad55507625c4Output,
	doc_aa0985870136Input: doc_aa0985870136Input,
	doc_aa0985870136Output: doc_aa0985870136Output,
	doc_fb8e1d4e570bInput: doc_fb8e1d4e570bInput,
	doc_fb8e1d4e570bOutput: doc_fb8e1d4e570bOutput,
	doc_b0fef9c9858cInput: doc_b0fef9c9858cInput,
	doc_b0fef9c9858cOutput: doc_b0fef9c9858cOutput,
	doc_22f01bc0cb8aInput: doc_22f01bc0cb8aInput,
	doc_22f01bc0cb8aOutput: doc_22f01bc0cb8aOutput,
	doc_b790c4385b03Input: doc_b790c4385b03Input,
	doc_b790c4385b03Output: doc_b790c4385b03Output,
	doc_6a803196fac7Input: doc_6a803196fac7Input,
	doc_6a803196fac7Output: doc_6a803196fac7Output,
	doc_ad6d2a03d1b2Input: doc_ad6d2a03d1b2Input,
	doc_ad6d2a03d1b2Output: doc_ad6d2a03d1b2Output,
	doc_af38437e1d87Input: doc_af38437e1d87Input,
	doc_af38437e1d87Output: doc_af38437e1d87Output,
	doc_b27a9742c359Input: doc_b27a9742c359Input,
	doc_b27a9742c359Output: doc_b27a9742c359Output,
	doc_4e257ad17e08Input: doc_4e257ad17e08Input,
	doc_4e257ad17e08Output: doc_4e257ad17e08Output,
	doc_c578cc27f1aaInput: doc_c578cc27f1aaInput,
	doc_c578cc27f1aaOutput: doc_c578cc27f1aaOutput,
	doc_8f9edc9117c4Input: doc_8f9edc9117c4Input,
	doc_8f9edc9117c4Output: doc_8f9edc9117c4Output,
	doc_81b584e30788Input: doc_81b584e30788Input,
	doc_81b584e30788Output: doc_81b584e30788Output,
	doc_560d6f2d1221Input: doc_560d6f2d1221Input,
	doc_560d6f2d1221Output: doc_560d6f2d1221Output,
	doc_070d6e77a00aInput: doc_070d6e77a00aInput,
	doc_070d6e77a00aOutput: doc_070d6e77a00aOutput,
	doc_5912774bad5eInput: doc_5912774bad5eInput,
	doc_5912774bad5eOutput: doc_5912774bad5eOutput,
	doc_54f409a9171cInput: doc_54f409a9171cInput,
	doc_54f409a9171cOutput: doc_54f409a9171cOutput,
	doc_476f9fe16b9bInput: doc_476f9fe16b9bInput,
	doc_476f9fe16b9bOutput: doc_476f9fe16b9bOutput,
	doc_d00cf8a74f8aInput: doc_d00cf8a74f8aInput,
	doc_d00cf8a74f8aOutput: doc_d00cf8a74f8aOutput,
	doc_73f2ef62b52dInput: doc_73f2ef62b52dInput,
	doc_73f2ef62b52dOutput: doc_73f2ef62b52dOutput,
	doc_b4febad46718Input: doc_b4febad46718Input,
	doc_b4febad46718Output: doc_b4febad46718Output,
	doc_6bca5b5ddaa2Input: doc_6bca5b5ddaa2Input,
	doc_6bca5b5ddaa2Output: doc_6bca5b5ddaa2Output,
	doc_c4cb46253fc8Input: doc_c4cb46253fc8Input,
	doc_c4cb46253fc8Output: doc_c4cb46253fc8Output,
	doc_12ee3803b0eaInput: doc_12ee3803b0eaInput,
	doc_12ee3803b0eaOutput: doc_12ee3803b0eaOutput,
	doc_3eac5982f660Input: doc_3eac5982f660Input,
	doc_3eac5982f660Output: doc_3eac5982f660Output,
	doc_98dfb200c831Input: doc_98dfb200c831Input,
	doc_98dfb200c831Output: doc_98dfb200c831Output,
	doc_15d58a0242efInput: doc_15d58a0242efInput,
	doc_15d58a0242efOutput: doc_15d58a0242efOutput,
	doc_52f8e42773fbInput: doc_52f8e42773fbInput,
	doc_52f8e42773fbOutput: doc_52f8e42773fbOutput,
	doc_86f85ef51d05Input: doc_86f85ef51d05Input,
	doc_86f85ef51d05Output: doc_86f85ef51d05Output,
	doc_20c8dbbadda5Input: doc_20c8dbbadda5Input,
	doc_20c8dbbadda5Output: doc_20c8dbbadda5Output,
	doc_a3736174ce8eInput: doc_a3736174ce8eInput,
	doc_a3736174ce8eOutput: doc_a3736174ce8eOutput,
	doc_82d35daae87fInput: doc_82d35daae87fInput,
	doc_82d35daae87fOutput: doc_82d35daae87fOutput,
	doc_f7b30cc3e4dfInput: doc_f7b30cc3e4dfInput,
	doc_f7b30cc3e4dfOutput: doc_f7b30cc3e4dfOutput,
	doc_3f2ca5c0125dInput: doc_3f2ca5c0125dInput,
	doc_3f2ca5c0125dOutput: doc_3f2ca5c0125dOutput,
	doc_d0c1793b18e1Input: doc_d0c1793b18e1Input,
	doc_d0c1793b18e1Output: doc_d0c1793b18e1Output,
	doc_b3e6aee2fc46Input: doc_b3e6aee2fc46Input,
	doc_b3e6aee2fc46Output: doc_b3e6aee2fc46Output,
	doc_aeef15756129Input: doc_aeef15756129Input,
	doc_aeef15756129Output: doc_aeef15756129Output,
	doc_12b9a2ef2c46Input: doc_12b9a2ef2c46Input,
	doc_12b9a2ef2c46Output: doc_12b9a2ef2c46Output,
	doc_0ef8984e5c8bInput: doc_0ef8984e5c8bInput,
	doc_0ef8984e5c8bOutput: doc_0ef8984e5c8bOutput,
	doc_1041d732a432Input: doc_1041d732a432Input,
	doc_1041d732a432Output: doc_1041d732a432Output,
	doc_11b9f13443f4Input: doc_11b9f13443f4Input,
	doc_11b9f13443f4Output: doc_11b9f13443f4Output,
	doc_9881d9a4588eInput: doc_9881d9a4588eInput,
	doc_9881d9a4588eOutput: doc_9881d9a4588eOutput,
	doc_8eb4885d89b3Input: doc_8eb4885d89b3Input,
	doc_8eb4885d89b3Output: doc_8eb4885d89b3Output,
	doc_979cc97944f4Input: doc_979cc97944f4Input,
	doc_979cc97944f4Output: doc_979cc97944f4Output,
	doc_af5d117edb7aInput: doc_af5d117edb7aInput,
	doc_af5d117edb7aOutput: doc_af5d117edb7aOutput,
	doc_0bdd00e8d1ceInput: doc_0bdd00e8d1ceInput,
	doc_0bdd00e8d1ceOutput: doc_0bdd00e8d1ceOutput,
	doc_0a55eec794e9Input: doc_0a55eec794e9Input,
	doc_0a55eec794e9Output: doc_0a55eec794e9Output,
	doc_14e4b1bd5a34Input: doc_14e4b1bd5a34Input,
	doc_14e4b1bd5a34Output: doc_14e4b1bd5a34Output,
	doc_30ad424e79e1Input: doc_30ad424e79e1Input,
	doc_30ad424e79e1Output: doc_30ad424e79e1Output,
	doc_c0e294c9d204Input: doc_c0e294c9d204Input,
	doc_c0e294c9d204Output: doc_c0e294c9d204Output,
	doc_9e9475186e42Input: doc_9e9475186e42Input,
	doc_9e9475186e42Output: doc_9e9475186e42Output,
	doc_5d231daccbc1Input: doc_5d231daccbc1Input,
	doc_5d231daccbc1Output: doc_5d231daccbc1Output,
	doc_f1dbbc96926eInput: doc_f1dbbc96926eInput,
	doc_f1dbbc96926eOutput: doc_f1dbbc96926eOutput,
	doc_0ca93d0cc9c4Input: doc_0ca93d0cc9c4Input,
	doc_0ca93d0cc9c4Output: doc_0ca93d0cc9c4Output,
	doc_48620dc4c72aInput: doc_48620dc4c72aInput,
	doc_48620dc4c72aOutput: doc_48620dc4c72aOutput,
	doc_262c27590310Input: doc_262c27590310Input,
	doc_262c27590310Output: doc_262c27590310Output,
	doc_8aae6a51f92aInput: doc_8aae6a51f92aInput,
	doc_8aae6a51f92aOutput: doc_8aae6a51f92aOutput,
	doc_1aac58120f09Input: doc_1aac58120f09Input,
	doc_1aac58120f09Output: doc_1aac58120f09Output,
	doc_f226832d3875Input: doc_f226832d3875Input,
	doc_f226832d3875Output: doc_f226832d3875Output,
	doc_5732d67dff2dInput: doc_5732d67dff2dInput,
	doc_5732d67dff2dOutput: doc_5732d67dff2dOutput,
	doc_8c2ebcb999dbInput: doc_8c2ebcb999dbInput,
	doc_8c2ebcb999dbOutput: doc_8c2ebcb999dbOutput,
	doc_8174f07e86d8Input: doc_8174f07e86d8Input,
	doc_8174f07e86d8Output: doc_8174f07e86d8Output,
	doc_68c760dcbd07Input: doc_68c760dcbd07Input,
	doc_68c760dcbd07Output: doc_68c760dcbd07Output,
	doc_11c825cbc8c6Input: doc_11c825cbc8c6Input,
	doc_11c825cbc8c6Output: doc_11c825cbc8c6Output,
	doc_7553d189737cInput: doc_7553d189737cInput,
	doc_7553d189737cOutput: doc_7553d189737cOutput,
	doc_e4cc91b4b088Input: doc_e4cc91b4b088Input,
	doc_e4cc91b4b088Output: doc_e4cc91b4b088Output,
	doc_4c129eef60aeInput: doc_4c129eef60aeInput,
	doc_4c129eef60aeOutput: doc_4c129eef60aeOutput,
	doc_c11852b77be3Input: doc_c11852b77be3Input,
	doc_c11852b77be3Output: doc_c11852b77be3Output,
	doc_c7aed98b2e77Input: doc_c7aed98b2e77Input,
	doc_c7aed98b2e77Output: doc_c7aed98b2e77Output,
	doc_4545251fa69dInput: doc_4545251fa69dInput,
	doc_4545251fa69dOutput: doc_4545251fa69dOutput,
	doc_b1ecc284456cInput: doc_b1ecc284456cInput,
	doc_b1ecc284456cOutput: doc_b1ecc284456cOutput,
	doc_28388b3fed6aInput: doc_28388b3fed6aInput,
	doc_28388b3fed6aOutput: doc_28388b3fed6aOutput,
	doc_ff77d342fe74Input: doc_ff77d342fe74Input,
	doc_ff77d342fe74Output: doc_ff77d342fe74Output,
	doc_879c2f7de929Input: doc_879c2f7de929Input,
	doc_879c2f7de929Output: doc_879c2f7de929Output,
	doc_1177e54e3da6Input: doc_1177e54e3da6Input,
	doc_1177e54e3da6Output: doc_1177e54e3da6Output,
	doc_f7d972dc06d1Input: doc_f7d972dc06d1Input,
	doc_f7d972dc06d1Output: doc_f7d972dc06d1Output,
	doc_019b3c552368Input: doc_019b3c552368Input,
	doc_019b3c552368Output: doc_019b3c552368Output,
	doc_1d5152684c65Input: doc_1d5152684c65Input,
	doc_1d5152684c65Output: doc_1d5152684c65Output,
	doc_572756329e70Input: doc_572756329e70Input,
	doc_572756329e70Output: doc_572756329e70Output,
	doc_0298380d0e17Input: doc_0298380d0e17Input,
	doc_0298380d0e17Output: doc_0298380d0e17Output,
	doc_835a391f5830Input: doc_835a391f5830Input,
	doc_835a391f5830Output: doc_835a391f5830Output,
	doc_5390d99534c7Input: doc_5390d99534c7Input,
	doc_5390d99534c7Output: doc_5390d99534c7Output,
	doc_021260e79a53Input: doc_021260e79a53Input,
	doc_021260e79a53Output: doc_021260e79a53Output,
	doc_72a39e90b633Input: doc_72a39e90b633Input,
	doc_72a39e90b633Output: doc_72a39e90b633Output,
	doc_993889ac64ddInput: doc_993889ac64ddInput,
	doc_993889ac64ddOutput: doc_993889ac64ddOutput,
	doc_195aa516f3faInput: doc_195aa516f3faInput,
	doc_195aa516f3faOutput: doc_195aa516f3faOutput,
	doc_840c367cc8e6Input: doc_840c367cc8e6Input,
	doc_840c367cc8e6Output: doc_840c367cc8e6Output,
	doc_b9fef9a10667Input: doc_b9fef9a10667Input,
	doc_b9fef9a10667Output: doc_b9fef9a10667Output,
	doc_76411ce6ddb4Input: doc_76411ce6ddb4Input,
	doc_76411ce6ddb4Output: doc_76411ce6ddb4Output,
	doc_0414f6f07b3fInput: doc_0414f6f07b3fInput,
	doc_0414f6f07b3fOutput: doc_0414f6f07b3fOutput,
	doc_5d952ea36887Input: doc_5d952ea36887Input,
	doc_5d952ea36887Output: doc_5d952ea36887Output,
	doc_a5e2b942c7caInput: doc_a5e2b942c7caInput,
	doc_a5e2b942c7caOutput: doc_a5e2b942c7caOutput,
	doc_55ad712f0558Input: doc_55ad712f0558Input,
	doc_55ad712f0558Output: doc_55ad712f0558Output,
	doc_35d402490c05Input: doc_35d402490c05Input,
	doc_35d402490c05Output: doc_35d402490c05Output,
	doc_7e426cc9eb65Input: doc_7e426cc9eb65Input,
	doc_7e426cc9eb65Output: doc_7e426cc9eb65Output,
	doc_45222df80d71Input: doc_45222df80d71Input,
	doc_45222df80d71Output: doc_45222df80d71Output,
	doc_e81cc18a9102Input: doc_e81cc18a9102Input,
	doc_e81cc18a9102Output: doc_e81cc18a9102Output,
	doc_e9a79ceccf84Input: doc_e9a79ceccf84Input,
	doc_e9a79ceccf84Output: doc_e9a79ceccf84Output,
	doc_9f9ccccf949cInput: doc_9f9ccccf949cInput,
	doc_9f9ccccf949cOutput: doc_9f9ccccf949cOutput,
	doc_c428dd43444eInput: doc_c428dd43444eInput,
	doc_c428dd43444eOutput: doc_c428dd43444eOutput,
	doc_b245584eda79Input: doc_b245584eda79Input,
	doc_b245584eda79Output: doc_b245584eda79Output,
	doc_f4797f262e2eInput: doc_f4797f262e2eInput,
	doc_f4797f262e2eOutput: doc_f4797f262e2eOutput,
	doc_1a5d357e8d7cInput: doc_1a5d357e8d7cInput,
	doc_1a5d357e8d7cOutput: doc_1a5d357e8d7cOutput,
	doc_cdce3b9fe81aInput: doc_cdce3b9fe81aInput,
	doc_cdce3b9fe81aOutput: doc_cdce3b9fe81aOutput,
	doc_29565de72e14Input: doc_29565de72e14Input,
	doc_29565de72e14Output: doc_29565de72e14Output,
	doc_c19139eee34bInput: doc_c19139eee34bInput,
	doc_c19139eee34bOutput: doc_c19139eee34bOutput,
	doc_53d08315b668Input: doc_53d08315b668Input,
	doc_53d08315b668Output: doc_53d08315b668Output,
	doc_a03377134888Input: doc_a03377134888Input,
	doc_a03377134888Output: doc_a03377134888Output,
	doc_1d9e28c15f55Input: doc_1d9e28c15f55Input,
	doc_1d9e28c15f55Output: doc_1d9e28c15f55Output,
	doc_ad437431bcfbInput: doc_ad437431bcfbInput,
	doc_ad437431bcfbOutput: doc_ad437431bcfbOutput,
	doc_d96c027674bdInput: doc_d96c027674bdInput,
	doc_d96c027674bdOutput: doc_d96c027674bdOutput,
	doc_eb56e3af90eaInput: doc_eb56e3af90eaInput,
	doc_eb56e3af90eaOutput: doc_eb56e3af90eaOutput,
	doc_a3e235afb912Input: doc_a3e235afb912Input,
	doc_a3e235afb912Output: doc_a3e235afb912Output,
	doc_d3677b341798Input: doc_d3677b341798Input,
	doc_d3677b341798Output: doc_d3677b341798Output,
	doc_d9a1c6ca3a31Input: doc_d9a1c6ca3a31Input,
	doc_d9a1c6ca3a31Output: doc_d9a1c6ca3a31Output,
	doc_a941335e148eInput: doc_a941335e148eInput,
	doc_a941335e148eOutput: doc_a941335e148eOutput,
	doc_09dc6b5907cdInput: doc_09dc6b5907cdInput,
	doc_09dc6b5907cdOutput: doc_09dc6b5907cdOutput,
	doc_0f8799b1925fInput: doc_0f8799b1925fInput,
	doc_0f8799b1925fOutput: doc_0f8799b1925fOutput,
	doc_89fbabad7e9cInput: doc_89fbabad7e9cInput,
	doc_89fbabad7e9cOutput: doc_89fbabad7e9cOutput,
	doc_1493e154c3f6Input: doc_1493e154c3f6Input,
	doc_1493e154c3f6Output: doc_1493e154c3f6Output,
	doc_c3967d800a90Input: doc_c3967d800a90Input,
	doc_c3967d800a90Output: doc_c3967d800a90Output,
	doc_56d7bc836984Input: doc_56d7bc836984Input,
	doc_56d7bc836984Output: doc_56d7bc836984Output,
	doc_2dac0a15a7fdInput: doc_2dac0a15a7fdInput,
	doc_2dac0a15a7fdOutput: doc_2dac0a15a7fdOutput,
	doc_c0609891ae33Input: doc_c0609891ae33Input,
	doc_c0609891ae33Output: doc_c0609891ae33Output,
	doc_0b4c79c821dcInput: doc_0b4c79c821dcInput,
	doc_0b4c79c821dcOutput: doc_0b4c79c821dcOutput,
	doc_0a3891051c4aInput: doc_0a3891051c4aInput,
	doc_0a3891051c4aOutput: doc_0a3891051c4aOutput,
	doc_e5dcf600c0d7Input: doc_e5dcf600c0d7Input,
	doc_e5dcf600c0d7Output: doc_e5dcf600c0d7Output,
	doc_c2ec15235334Input: doc_c2ec15235334Input,
	doc_c2ec15235334Output: doc_c2ec15235334Output,
	doc_191957a930e4Input: doc_191957a930e4Input,
	doc_191957a930e4Output: doc_191957a930e4Output,
	doc_f1de1effc183Input: doc_f1de1effc183Input,
	doc_f1de1effc183Output: doc_f1de1effc183Output,
	doc_159cdf63adcaInput: doc_159cdf63adcaInput,
	doc_159cdf63adcaOutput: doc_159cdf63adcaOutput,
	doc_95010aa1d993Input: doc_95010aa1d993Input,
	doc_95010aa1d993Output: doc_95010aa1d993Output,
	doc_d47d505089b2Input: doc_d47d505089b2Input,
	doc_d47d505089b2Output: doc_d47d505089b2Output,
	doc_3aa38830d853Input: doc_3aa38830d853Input,
	doc_3aa38830d853Output: doc_3aa38830d853Output,
	doc_1d36c4da1722Input: doc_1d36c4da1722Input,
	doc_1d36c4da1722Output: doc_1d36c4da1722Output,
	doc_ed7bb79325cdInput: doc_ed7bb79325cdInput,
	doc_ed7bb79325cdOutput: doc_ed7bb79325cdOutput,
	doc_11c324bdd693Input: doc_11c324bdd693Input,
	doc_11c324bdd693Output: doc_11c324bdd693Output,
	doc_c78a672ff18cInput: doc_c78a672ff18cInput,
	doc_c78a672ff18cOutput: doc_c78a672ff18cOutput,
	doc_dc85a3280001Input: doc_dc85a3280001Input,
	doc_dc85a3280001Output: doc_dc85a3280001Output,
	doc_93ed34af7e68Input: doc_93ed34af7e68Input,
	doc_93ed34af7e68Output: doc_93ed34af7e68Output,
	doc_dcecf46c1fbbInput: doc_dcecf46c1fbbInput,
	doc_dcecf46c1fbbOutput: doc_dcecf46c1fbbOutput,
	doc_74b189e5ad53Input: doc_74b189e5ad53Input,
	doc_74b189e5ad53Output: doc_74b189e5ad53Output,
	doc_ec7f110447fbInput: doc_ec7f110447fbInput,
	doc_ec7f110447fbOutput: doc_ec7f110447fbOutput,
	doc_2a78e2010ac6Input: doc_2a78e2010ac6Input,
	doc_2a78e2010ac6Output: doc_2a78e2010ac6Output,
	doc_5e63a22b01a3Input: doc_5e63a22b01a3Input,
	doc_5e63a22b01a3Output: doc_5e63a22b01a3Output,
	doc_b302c342b6b8Input: doc_b302c342b6b8Input,
	doc_b302c342b6b8Output: doc_b302c342b6b8Output,
	doc_b9ea55c57e9fInput: doc_b9ea55c57e9fInput,
	doc_b9ea55c57e9fOutput: doc_b9ea55c57e9fOutput,
	doc_cdbafa8cb54fInput: doc_cdbafa8cb54fInput,
	doc_cdbafa8cb54fOutput: doc_cdbafa8cb54fOutput,
	doc_398fcd149bccInput: doc_398fcd149bccInput,
	doc_398fcd149bccOutput: doc_398fcd149bccOutput,
	doc_9f6a27310b14Input: doc_9f6a27310b14Input,
	doc_9f6a27310b14Output: doc_9f6a27310b14Output,
	doc_7d2b11ef40caInput: doc_7d2b11ef40caInput,
	doc_7d2b11ef40caOutput: doc_7d2b11ef40caOutput,
	doc_6be9baf8c041Input: doc_6be9baf8c041Input,
	doc_6be9baf8c041Output: doc_6be9baf8c041Output,
	doc_f7a5b4e62ac8Input: doc_f7a5b4e62ac8Input,
	doc_f7a5b4e62ac8Output: doc_f7a5b4e62ac8Output,
	doc_9e11e8506b9aInput: doc_9e11e8506b9aInput,
	doc_9e11e8506b9aOutput: doc_9e11e8506b9aOutput,
	doc_cd38e0a41be1Input: doc_cd38e0a41be1Input,
	doc_cd38e0a41be1Output: doc_cd38e0a41be1Output,
	doc_2eb02d4b4bceInput: doc_2eb02d4b4bceInput,
	doc_2eb02d4b4bceOutput: doc_2eb02d4b4bceOutput,
	doc_b1982a6f1fd9Input: doc_b1982a6f1fd9Input,
	doc_b1982a6f1fd9Output: doc_b1982a6f1fd9Output,
	doc_df8381884a60Input: doc_df8381884a60Input,
	doc_df8381884a60Output: doc_df8381884a60Output,
	doc_ea0edb75c1d4Input: doc_ea0edb75c1d4Input,
	doc_ea0edb75c1d4Output: doc_ea0edb75c1d4Output,
	doc_2f1de3705731Input: doc_2f1de3705731Input,
	doc_2f1de3705731Output: doc_2f1de3705731Output,
	doc_a9d557b1a987Input: doc_a9d557b1a987Input,
	doc_a9d557b1a987Output: doc_a9d557b1a987Output,
	doc_5870683c0fddInput: doc_5870683c0fddInput,
	doc_5870683c0fddOutput: doc_5870683c0fddOutput,
	doc_53a320a8c6adInput: doc_53a320a8c6adInput,
	doc_53a320a8c6adOutput: doc_53a320a8c6adOutput,
	doc_a5e7a4804418Input: doc_a5e7a4804418Input,
	doc_a5e7a4804418Output: doc_a5e7a4804418Output,
	doc_c974e0814d0cInput: doc_c974e0814d0cInput,
	doc_c974e0814d0cOutput: doc_c974e0814d0cOutput,
	doc_ece6a500fcc4Input: doc_ece6a500fcc4Input,
	doc_ece6a500fcc4Output: doc_ece6a500fcc4Output,
	doc_fb4079d19b2cInput: doc_fb4079d19b2cInput,
	doc_fb4079d19b2cOutput: doc_fb4079d19b2cOutput,
	doc_024f62ae3007Input: doc_024f62ae3007Input,
	doc_024f62ae3007Output: doc_024f62ae3007Output,
	doc_d747245e5a92Input: doc_d747245e5a92Input,
	doc_d747245e5a92Output: doc_d747245e5a92Output,
	doc_68f7c024afdcInput: doc_68f7c024afdcInput,
	doc_68f7c024afdcOutput: doc_68f7c024afdcOutput,
	doc_371c627c78f8Input: doc_371c627c78f8Input,
	doc_371c627c78f8Output: doc_371c627c78f8Output,
	doc_d3087471b789Input: doc_d3087471b789Input,
	doc_d3087471b789Output: doc_d3087471b789Output,
	doc_d7be8ba6987cInput: doc_d7be8ba6987cInput,
	doc_d7be8ba6987cOutput: doc_d7be8ba6987cOutput,
	doc_0bc073434146Input: doc_0bc073434146Input,
	doc_0bc073434146Output: doc_0bc073434146Output,
	doc_c407e746e39fInput: doc_c407e746e39fInput,
	doc_c407e746e39fOutput: doc_c407e746e39fOutput,
	doc_856d9dd6a089Input: doc_856d9dd6a089Input,
	doc_856d9dd6a089Output: doc_856d9dd6a089Output,
	doc_4c494339b8bcInput: doc_4c494339b8bcInput,
	doc_4c494339b8bcOutput: doc_4c494339b8bcOutput,
	doc_c458695a77c1Input: doc_c458695a77c1Input,
	doc_c458695a77c1Output: doc_c458695a77c1Output,
	doc_1cd57426d84fInput: doc_1cd57426d84fInput,
	doc_1cd57426d84fOutput: doc_1cd57426d84fOutput,
	doc_00c9ade1d573Input: doc_00c9ade1d573Input,
	doc_00c9ade1d573Output: doc_00c9ade1d573Output,
	doc_51a82794cb6bInput: doc_51a82794cb6bInput,
	doc_51a82794cb6bOutput: doc_51a82794cb6bOutput,
	doc_7e904da76356Input: doc_7e904da76356Input,
	doc_7e904da76356Output: doc_7e904da76356Output,
	doc_91ec86e31af6Input: doc_91ec86e31af6Input,
	doc_91ec86e31af6Output: doc_91ec86e31af6Output,
	doc_38b5a83402faInput: doc_38b5a83402faInput,
	doc_38b5a83402faOutput: doc_38b5a83402faOutput,
	doc_60d5e42efa4dInput: doc_60d5e42efa4dInput,
	doc_60d5e42efa4dOutput: doc_60d5e42efa4dOutput,
	doc_c81496b5c977Input: doc_c81496b5c977Input,
	doc_c81496b5c977Output: doc_c81496b5c977Output,
	doc_b4370f044cc5Input: doc_b4370f044cc5Input,
	doc_b4370f044cc5Output: doc_b4370f044cc5Output,
	doc_11645edfc36dInput: doc_11645edfc36dInput,
	doc_11645edfc36dOutput: doc_11645edfc36dOutput,
	doc_50cc2f9183daInput: doc_50cc2f9183daInput,
	doc_50cc2f9183daOutput: doc_50cc2f9183daOutput,
	doc_74e413c4970dInput: doc_74e413c4970dInput,
	doc_74e413c4970dOutput: doc_74e413c4970dOutput,
	doc_a8d91a5423b6Input: doc_a8d91a5423b6Input,
	doc_a8d91a5423b6Output: doc_a8d91a5423b6Output,
	doc_b2e717699b06Input: doc_b2e717699b06Input,
	doc_b2e717699b06Output: doc_b2e717699b06Output,
	doc_0215c703c550Input: doc_0215c703c550Input,
	doc_0215c703c550Output: doc_0215c703c550Output,
	doc_c52e159d5991Input: doc_c52e159d5991Input,
	doc_c52e159d5991Output: doc_c52e159d5991Output,
	doc_666f59568c27Input: doc_666f59568c27Input,
	doc_666f59568c27Output: doc_666f59568c27Output,
	doc_8465456a9693Input: doc_8465456a9693Input,
	doc_8465456a9693Output: doc_8465456a9693Output,
	doc_f16f9dd049d1Input: doc_f16f9dd049d1Input,
	doc_f16f9dd049d1Output: doc_f16f9dd049d1Output,
	doc_3dd2a16378a7Input: doc_3dd2a16378a7Input,
	doc_3dd2a16378a7Output: doc_3dd2a16378a7Output,
	doc_91596e1eec37Input: doc_91596e1eec37Input,
	doc_91596e1eec37Output: doc_91596e1eec37Output,
	doc_e0f375953ec2Input: doc_e0f375953ec2Input,
	doc_e0f375953ec2Output: doc_e0f375953ec2Output,
	doc_8798826d45afInput: doc_8798826d45afInput,
	doc_8798826d45afOutput: doc_8798826d45afOutput,
	doc_6df583932616Input: doc_6df583932616Input,
	doc_6df583932616Output: doc_6df583932616Output,
	doc_44723439c252Input: doc_44723439c252Input,
	doc_44723439c252Output: doc_44723439c252Output,
	doc_473a86610c11Input: doc_473a86610c11Input,
	doc_473a86610c11Output: doc_473a86610c11Output,
	doc_baa0fe4977e9Input: doc_baa0fe4977e9Input,
	doc_baa0fe4977e9Output: doc_baa0fe4977e9Output,
	doc_7396b08a6f91Input: doc_7396b08a6f91Input,
	doc_7396b08a6f91Output: doc_7396b08a6f91Output,
	doc_512fbcb31521Input: doc_512fbcb31521Input,
	doc_512fbcb31521Output: doc_512fbcb31521Output,
	doc_6aea189047bbInput: doc_6aea189047bbInput,
	doc_6aea189047bbOutput: doc_6aea189047bbOutput,
	doc_e003784932c5Input: doc_e003784932c5Input,
	doc_e003784932c5Output: doc_e003784932c5Output,
	doc_816b2c098a33Input: doc_816b2c098a33Input,
	doc_816b2c098a33Output: doc_816b2c098a33Output,
	doc_503cf4e16d2bInput: doc_503cf4e16d2bInput,
	doc_503cf4e16d2bOutput: doc_503cf4e16d2bOutput,
	doc_74f49ae8a8a6Input: doc_74f49ae8a8a6Input,
	doc_74f49ae8a8a6Output: doc_74f49ae8a8a6Output,
	doc_ab644043c397Input: doc_ab644043c397Input,
	doc_ab644043c397Output: doc_ab644043c397Output,
	doc_d5803b6e7447Input: doc_d5803b6e7447Input,
	doc_d5803b6e7447Output: doc_d5803b6e7447Output,
	doc_e1dc075902d1Input: doc_e1dc075902d1Input,
	doc_e1dc075902d1Output: doc_e1dc075902d1Output,
	doc_6d243866e576Input: doc_6d243866e576Input,
	doc_6d243866e576Output: doc_6d243866e576Output,
	doc_56a9f95675c0Input: doc_56a9f95675c0Input,
	doc_56a9f95675c0Output: doc_56a9f95675c0Output,
	doc_2e94b48c0b5aInput: doc_2e94b48c0b5aInput,
	doc_2e94b48c0b5aOutput: doc_2e94b48c0b5aOutput,
	doc_22d7ace97d71Input: doc_22d7ace97d71Input,
	doc_22d7ace97d71Output: doc_22d7ace97d71Output,
	doc_704eaf682fa9Input: doc_704eaf682fa9Input,
	doc_704eaf682fa9Output: doc_704eaf682fa9Output,
	doc_6b9b6089bd0cInput: doc_6b9b6089bd0cInput,
	doc_6b9b6089bd0cOutput: doc_6b9b6089bd0cOutput,
	doc_08798f327d62Input: doc_08798f327d62Input,
	doc_08798f327d62Output: doc_08798f327d62Output,
	doc_eb9bb3268567Input: doc_eb9bb3268567Input,
	doc_eb9bb3268567Output: doc_eb9bb3268567Output,
	doc_d1001d003fbfInput: doc_d1001d003fbfInput,
	doc_d1001d003fbfOutput: doc_d1001d003fbfOutput,
	doc_a0f2712ff23dInput: doc_a0f2712ff23dInput,
	doc_a0f2712ff23dOutput: doc_a0f2712ff23dOutput,
	doc_dc9fc9718da9Input: doc_dc9fc9718da9Input,
	doc_dc9fc9718da9Output: doc_dc9fc9718da9Output,
	doc_04640f5ca9dbInput: doc_04640f5ca9dbInput,
	doc_04640f5ca9dbOutput: doc_04640f5ca9dbOutput,
	doc_6dcc4cfc0332Input: doc_6dcc4cfc0332Input,
	doc_6dcc4cfc0332Output: doc_6dcc4cfc0332Output,
	doc_4f3aa3dcbddfInput: doc_4f3aa3dcbddfInput,
	doc_4f3aa3dcbddfOutput: doc_4f3aa3dcbddfOutput,
	doc_acb283c67d28Input: doc_acb283c67d28Input,
	doc_acb283c67d28Output: doc_acb283c67d28Output,
	doc_c2cad94af625Input: doc_c2cad94af625Input,
	doc_c2cad94af625Output: doc_c2cad94af625Output,
	doc_99cd5c10b76eInput: doc_99cd5c10b76eInput,
	doc_99cd5c10b76eOutput: doc_99cd5c10b76eOutput,
	doc_05d5cbb0f106Input: doc_05d5cbb0f106Input,
	doc_05d5cbb0f106Output: doc_05d5cbb0f106Output,
	doc_77496855f701Input: doc_77496855f701Input,
	doc_77496855f701Output: doc_77496855f701Output,
	doc_14c9ed9ecbeaInput: doc_14c9ed9ecbeaInput,
	doc_14c9ed9ecbeaOutput: doc_14c9ed9ecbeaOutput,
	doc_acb30b6fe47cInput: doc_acb30b6fe47cInput,
	doc_acb30b6fe47cOutput: doc_acb30b6fe47cOutput,
	doc_13f84ef14d51Input: doc_13f84ef14d51Input,
	doc_13f84ef14d51Output: doc_13f84ef14d51Output,
	doc_7c7b9e214afcInput: doc_7c7b9e214afcInput,
	doc_7c7b9e214afcOutput: doc_7c7b9e214afcOutput,
	doc_9d28384fd2c0Input: doc_9d28384fd2c0Input,
	doc_9d28384fd2c0Output: doc_9d28384fd2c0Output,
	doc_eab6767a5cc2Input: doc_eab6767a5cc2Input,
	doc_eab6767a5cc2Output: doc_eab6767a5cc2Output,
	doc_fe8391ee5a60Input: doc_fe8391ee5a60Input,
	doc_fe8391ee5a60Output: doc_fe8391ee5a60Output,
	doc_90cef15abecdInput: doc_90cef15abecdInput,
	doc_90cef15abecdOutput: doc_90cef15abecdOutput,
	doc_7ca7fbf49e63Input: doc_7ca7fbf49e63Input,
	doc_7ca7fbf49e63Output: doc_7ca7fbf49e63Output,
	doc_032cc159a9c0Input: doc_032cc159a9c0Input,
	doc_032cc159a9c0Output: doc_032cc159a9c0Output,
	doc_6dffbee7df22Input: doc_6dffbee7df22Input,
	doc_6dffbee7df22Output: doc_6dffbee7df22Output,
	doc_22a02832d5c8Input: doc_22a02832d5c8Input,
	doc_22a02832d5c8Output: doc_22a02832d5c8Output,
	doc_0253c8f31570Input: doc_0253c8f31570Input,
	doc_0253c8f31570Output: doc_0253c8f31570Output,
	doc_24364ddc889bInput: doc_24364ddc889bInput,
	doc_24364ddc889bOutput: doc_24364ddc889bOutput,
	doc_66501a2d927aInput: doc_66501a2d927aInput,
	doc_66501a2d927aOutput: doc_66501a2d927aOutput,
	doc_386a3b63ebcdInput: doc_386a3b63ebcdInput,
	doc_386a3b63ebcdOutput: doc_386a3b63ebcdOutput,
	doc_6e582dcd1d0bInput: doc_6e582dcd1d0bInput,
	doc_6e582dcd1d0bOutput: doc_6e582dcd1d0bOutput,
	doc_d1f51d8aad67Input: doc_d1f51d8aad67Input,
	doc_d1f51d8aad67Output: doc_d1f51d8aad67Output,
	doc_8086b322241cInput: doc_8086b322241cInput,
	doc_8086b322241cOutput: doc_8086b322241cOutput,
	doc_6b3b0b1d5184Input: doc_6b3b0b1d5184Input,
	doc_6b3b0b1d5184Output: doc_6b3b0b1d5184Output,
	doc_a3c0623a5337Input: doc_a3c0623a5337Input,
	doc_a3c0623a5337Output: doc_a3c0623a5337Output,
	doc_cf596c53b5beInput: doc_cf596c53b5beInput,
	doc_cf596c53b5beOutput: doc_cf596c53b5beOutput,
	doc_25993fbcf6e2Input: doc_25993fbcf6e2Input,
	doc_25993fbcf6e2Output: doc_25993fbcf6e2Output,
	doc_9e251cf5f94bInput: doc_9e251cf5f94bInput,
	doc_9e251cf5f94bOutput: doc_9e251cf5f94bOutput,
	doc_5572d37bb03dInput: doc_5572d37bb03dInput,
	doc_5572d37bb03dOutput: doc_5572d37bb03dOutput,
	doc_53f4f8bcf551Input: doc_53f4f8bcf551Input,
	doc_53f4f8bcf551Output: doc_53f4f8bcf551Output,
	doc_f22fa239a636Input: doc_f22fa239a636Input,
	doc_f22fa239a636Output: doc_f22fa239a636Output,
	doc_d6c0bc13eb4bInput: doc_d6c0bc13eb4bInput,
	doc_d6c0bc13eb4bOutput: doc_d6c0bc13eb4bOutput,
	doc_5574ec7619c8Input: doc_5574ec7619c8Input,
	doc_5574ec7619c8Output: doc_5574ec7619c8Output,
	doc_08c16f4a80d4Input: doc_08c16f4a80d4Input,
	doc_08c16f4a80d4Output: doc_08c16f4a80d4Output,
	doc_b285fe5a9222Input: doc_b285fe5a9222Input,
	doc_b285fe5a9222Output: doc_b285fe5a9222Output,
} as const;

export const generatedDocEndpoints = {
	certcentralApi: {
		accountDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account',
			method: 'GET',
			operationId: 'certcentralApi.accountDetails',
			inputSchema: generatedSchemas.doc_b404e0df280eInput,
			outputSchema: generatedSchemas.doc_b404e0df280eOutput,
		}),
		addCustomField: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/metadata',
			method: 'POST',
			operationId: 'certcentralApi.addCustomField',
			inputSchema: generatedSchemas.doc_9eaf8d093062Input,
			outputSchema: generatedSchemas.doc_9eaf8d093062Output,
		}),
		authKeyDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/auth-key',
			method: 'GET',
			operationId: 'certcentralApi.authKeyDetails',
			inputSchema: generatedSchemas.doc_d3cc6430936dInput,
			outputSchema: generatedSchemas.doc_d3cc6430936dOutput,
		}),
		bulkAddFields: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/metadata/bulk',
			method: 'POST',
			operationId: 'certcentralApi.bulkAddFields',
			inputSchema: generatedSchemas.doc_00ad039ae491Input,
			outputSchema: generatedSchemas.doc_00ad039ae491Output,
		}),
		configureOidcSso: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'POST',
			operationId: 'certcentralApi.configureOidcSso',
			inputSchema: generatedSchemas.doc_1ef869474727Input,
			outputSchema: generatedSchemas.doc_1ef869474727Output,
		}),
		contractDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/contract',
			method: 'GET',
			operationId: 'certcentralApi.contractDetails',
			inputSchema: generatedSchemas.doc_bb6c5576f14bInput,
			outputSchema: generatedSchemas.doc_bb6c5576f14bOutput,
		}),
		createAuthKey: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/auth-key',
			method: 'POST',
			operationId: 'certcentralApi.createAuthKey',
			inputSchema: generatedSchemas.doc_a8eee1e78e72Input,
			outputSchema: generatedSchemas.doc_a8eee1e78e72Output,
		}),
		deleteAuthKey: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/auth-key',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteAuthKey',
			inputSchema: generatedSchemas.doc_c391f0331b7eInput,
			outputSchema: generatedSchemas.doc_c391f0331b7eOutput,
		}),
		deleteCustomField: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/metadata/{metadata_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteCustomField',
			inputSchema: generatedSchemas.doc_abdf255be06aInput,
			outputSchema: generatedSchemas.doc_abdf255be06aOutput,
		}),
		deleteOidcSsoConfiguration: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteOidcSsoConfiguration',
			inputSchema: generatedSchemas.doc_f5cd45279030Input,
			outputSchema: generatedSchemas.doc_f5cd45279030Output,
		}),
		editCustomField: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/metadata/{metadata_id}',
			method: 'PUT',
			operationId: 'certcentralApi.editCustomField',
			inputSchema: generatedSchemas.doc_7f053e614b94Input,
			outputSchema: generatedSchemas.doc_7f053e614b94Output,
		}),
		guestAccessUrl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/guest-access',
			method: 'GET',
			operationId: 'certcentralApi.guestAccessUrl',
			inputSchema: generatedSchemas.doc_8ed6be3e6d29Input,
			outputSchema: generatedSchemas.doc_8ed6be3e6d29Output,
		}),
		inviteDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{invite_id}',
			method: 'GET',
			operationId: 'certcentralApi.inviteDetails',
			inputSchema: generatedSchemas.doc_d9379f0e3a78Input,
			outputSchema: generatedSchemas.doc_d9379f0e3a78Output,
		}),
		listAuthKeys: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/auth-keys',
			method: 'GET',
			operationId: 'certcentralApi.listAuthKeys',
			inputSchema: generatedSchemas.doc_35988e9424cfInput,
			outputSchema: generatedSchemas.doc_35988e9424cfOutput,
		}),
		listCustomFields: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/metadata',
			method: 'GET',
			operationId: 'certcentralApi.listCustomFields',
			inputSchema: generatedSchemas.doc_10eeaf071883Input,
			outputSchema: generatedSchemas.doc_10eeaf071883Output,
		}),
		listInvites: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/invite',
			method: 'GET',
			operationId: 'certcentralApi.listInvites',
			inputSchema: generatedSchemas.doc_12638b157910Input,
			outputSchema: generatedSchemas.doc_12638b157910Output,
		}),
		moveOrders: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/move-orders/{target_account_id}',
			method: 'POST',
			operationId: 'certcentralApi.moveOrders',
			inputSchema: generatedSchemas.doc_ad55507625c4Input,
			outputSchema: generatedSchemas.doc_ad55507625c4Output,
		}),
		oidcSsoConfigurationDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'GET',
			operationId: 'certcentralApi.oidcSsoConfigurationDetails',
			inputSchema: generatedSchemas.doc_aa0985870136Input,
			outputSchema: generatedSchemas.doc_aa0985870136Output,
		}),
		resendInvite: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/invite/{invite_id}/send',
			method: 'PUT',
			operationId: 'certcentralApi.resendInvite',
			inputSchema: generatedSchemas.doc_fb8e1d4e570bInput,
			outputSchema: generatedSchemas.doc_fb8e1d4e570bOutput,
		}),
		samlEntityDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/saml-entity',
			method: 'GET',
			operationId: 'certcentralApi.samlEntityDetails',
			inputSchema: generatedSchemas.doc_b0fef9c9858cInput,
			outputSchema: generatedSchemas.doc_b0fef9c9858cOutput,
		}),
		sendInvite: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/invite',
			method: 'POST',
			operationId: 'certcentralApi.sendInvite',
			inputSchema: generatedSchemas.doc_22f01bc0cb8aInput,
			outputSchema: generatedSchemas.doc_22f01bc0cb8aOutput,
		}),
		updateAccountEmails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account',
			method: 'PUT',
			operationId: 'certcentralApi.updateAccountEmails',
			inputSchema: generatedSchemas.doc_b790c4385b03Input,
			outputSchema: generatedSchemas.doc_b790c4385b03Output,
		}),
		updateAccountNotificationSettings: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/settings',
			method: 'PUT',
			operationId: 'certcentralApi.updateAccountNotificationSettings',
			inputSchema: generatedSchemas.doc_6a803196fac7Input,
			outputSchema: generatedSchemas.doc_6a803196fac7Output,
		}),
		updateInviteStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/invite/{invite_id}/status',
			method: 'PUT',
			operationId: 'certcentralApi.updateInviteStatus',
			inputSchema: generatedSchemas.doc_ad6d2a03d1b2Input,
			outputSchema: generatedSchemas.doc_ad6d2a03d1b2Output,
		}),
		updateOidcSsoConfiguration: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'PUT',
			operationId: 'certcentralApi.updateOidcSsoConfiguration',
			inputSchema: generatedSchemas.doc_af38437e1d87Input,
			outputSchema: generatedSchemas.doc_af38437e1d87Output,
		}),
		updateSamlEntity: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/saml-entity/{entity_id}',
			method: 'PUT',
			operationId: 'certcentralApi.updateSamlEntity',
			inputSchema: generatedSchemas.doc_b27a9742c359Input,
			outputSchema: generatedSchemas.doc_b27a9742c359Output,
		}),
		acmeExternalAccountBinding: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key/acme-eab/tlm',
			method: 'POST',
			operationId: 'certcentralApi.acmeExternalAccountBinding',
			inputSchema: generatedSchemas.doc_4e257ad17e08Input,
			outputSchema: generatedSchemas.doc_4e257ad17e08Output,
		}),
		createKey: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key/user/{user_id}',
			method: 'POST',
			operationId: 'certcentralApi.createKey',
			inputSchema: generatedSchemas.doc_c578cc27f1aaInput,
			outputSchema: generatedSchemas.doc_c578cc27f1aaOutput,
		}),
		editKey: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key/{key_id}',
			method: 'PUT',
			operationId: 'certcentralApi.editKey',
			inputSchema: generatedSchemas.doc_8f9edc9117c4Input,
			outputSchema: generatedSchemas.doc_8f9edc9117c4Output,
		}),
		getKeyInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key/{key_id}',
			method: 'GET',
			operationId: 'certcentralApi.getKeyInfo',
			inputSchema: generatedSchemas.doc_81b584e30788Input,
			outputSchema: generatedSchemas.doc_81b584e30788Output,
		}),
		listApiAccessRoles: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key/api-roles',
			method: 'GET',
			operationId: 'certcentralApi.listApiAccessRoles',
			inputSchema: generatedSchemas.doc_560d6f2d1221Input,
			outputSchema: generatedSchemas.doc_560d6f2d1221Output,
		}),
		listKeys: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key',
			method: 'GET',
			operationId: 'certcentralApi.listKeys',
			inputSchema: generatedSchemas.doc_070d6e77a00aInput,
			outputSchema: generatedSchemas.doc_070d6e77a00aOutput,
		}),
		updateAcmeRestrictions: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key/{key_id}/restrictions',
			method: 'PATCH',
			operationId: 'certcentralApi.updateAcmeRestrictions',
			inputSchema: generatedSchemas.doc_5912774bad5eInput,
			outputSchema: generatedSchemas.doc_5912774bad5eOutput,
		}),
		updateKeyStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/key/{key_id}/status',
			method: 'PUT',
			operationId: 'certcentralApi.updateKeyStatus',
			inputSchema: generatedSchemas.doc_54f409a9171cInput,
			outputSchema: generatedSchemas.doc_54f409a9171cOutput,
		}),
		checkPermission: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/authorization/view_orders',
			method: 'GET',
			operationId: 'certcentralApi.checkPermission',
			inputSchema: generatedSchemas.doc_476f9fe16b9bInput,
			outputSchema: generatedSchemas.doc_476f9fe16b9bOutput,
		}),
		containerPermissions: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/authorization/{permission}/container',
			method: 'GET',
			operationId: 'certcentralApi.containerPermissions',
			inputSchema: generatedSchemas.doc_d00cf8a74f8aInput,
			outputSchema: generatedSchemas.doc_d00cf8a74f8aOutput,
		}),
		listPermissions: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/authorization',
			method: 'GET',
			operationId: 'certcentralApi.listPermissions',
			inputSchema: generatedSchemas.doc_73f2ef62b52dInput,
			outputSchema: generatedSchemas.doc_73f2ef62b52dOutput,
		}),
		addNote: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_id}/note',
			method: 'POST',
			operationId: 'certcentralApi.addNote',
			inputSchema: generatedSchemas.doc_b4febad46718Input,
			outputSchema: generatedSchemas.doc_b4febad46718Output,
		}),
		archiveCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_id}/archive',
			method: 'PUT',
			operationId: 'certcentralApi.archiveCertificate',
			inputSchema: generatedSchemas.doc_6bca5b5ddaa2Input,
			outputSchema: generatedSchemas.doc_6bca5b5ddaa2Output,
		}),
		certificateChain: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_id}/chain',
			method: 'GET',
			operationId: 'certcentralApi.certificateChain',
			inputSchema: generatedSchemas.doc_c4cb46253fc8Input,
			outputSchema: generatedSchemas.doc_c4cb46253fc8Output,
		}),
		downloadCertificateByFormatOrderId: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/download/order/{order_id}/format/{format_type}',
			method: 'GET',
			operationId: 'certcentralApi.downloadCertificateByFormatOrderId',
			inputSchema: generatedSchemas.doc_12ee3803b0eaInput,
			outputSchema: generatedSchemas.doc_12ee3803b0eaOutput,
		}),
		downloadCertificateByFormat: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_id}/download/format/{format_type}',
			method: 'GET',
			operationId: 'certcentralApi.downloadCertificateByFormat',
			inputSchema: generatedSchemas.doc_3eac5982f660Input,
			outputSchema: generatedSchemas.doc_3eac5982f660Output,
		}),
		downloadCertificateOrderId: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/download/order/{order_id}',
			method: 'GET',
			operationId: 'certcentralApi.downloadCertificateOrderId',
			inputSchema: generatedSchemas.doc_98dfb200c831Input,
			outputSchema: generatedSchemas.doc_98dfb200c831Output,
		}),
		emailCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_id}/sendemail',
			method: 'PUT',
			operationId: 'certcentralApi.emailCertificate',
			inputSchema: generatedSchemas.doc_15d58a0242efInput,
			outputSchema: generatedSchemas.doc_15d58a0242efOutput,
		}),
		listCertificateNotes: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_id}/note',
			method: 'GET',
			operationId: 'certcentralApi.listCertificateNotes',
			inputSchema: generatedSchemas.doc_52f8e42773fbInput,
			outputSchema: generatedSchemas.doc_52f8e42773fbOutput,
		}),
		restoreCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_id}/unarchive',
			method: 'PUT',
			operationId: 'certcentralApi.restoreCertificate',
			inputSchema: generatedSchemas.doc_86f85ef51d05Input,
			outputSchema: generatedSchemas.doc_86f85ef51d05Output,
		}),
		revokeCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/certificate/{certificate_identifier}/revoke',
			method: 'PUT',
			operationId: 'certcentralApi.revokeCertificate',
			inputSchema: generatedSchemas.doc_20c8dbbadda5Input,
			outputSchema: generatedSchemas.doc_20c8dbbadda5Output,
		}),
		activateContainer: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/activate',
			method: 'PUT',
			operationId: 'certcentralApi.activateContainer',
			inputSchema: generatedSchemas.doc_a3736174ce8eInput,
			outputSchema: generatedSchemas.doc_a3736174ce8eOutput,
		}),
		containerInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}',
			method: 'GET',
			operationId: 'certcentralApi.containerInfo',
			inputSchema: generatedSchemas.doc_82d35daae87fInput,
			outputSchema: generatedSchemas.doc_82d35daae87fOutput,
		}),
		createContainer: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/children',
			method: 'POST',
			operationId: 'certcentralApi.createContainer',
			inputSchema: generatedSchemas.doc_f7b30cc3e4dfInput,
			outputSchema: generatedSchemas.doc_f7b30cc3e4dfOutput,
		}),
		deactivateContainer: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/deactivate',
			method: 'PUT',
			operationId: 'certcentralApi.deactivateContainer',
			inputSchema: generatedSchemas.doc_3f2ca5c0125dInput,
			outputSchema: generatedSchemas.doc_3f2ca5c0125dOutput,
		}),
		editContainer: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}',
			method: 'PUT',
			operationId: 'certcentralApi.editContainer',
			inputSchema: generatedSchemas.doc_d0c1793b18e1Input,
			outputSchema: generatedSchemas.doc_d0c1793b18e1Output,
		}),
		listChildContainers: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/children',
			method: 'GET',
			operationId: 'certcentralApi.listChildContainers',
			inputSchema: generatedSchemas.doc_b3e6aee2fc46Input,
			outputSchema: generatedSchemas.doc_b3e6aee2fc46Output,
		}),
		listContainerOrganizations: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/order/organization',
			method: 'GET',
			operationId: 'certcentralApi.listContainerOrganizations',
			inputSchema: generatedSchemas.doc_aeef15756129Input,
			outputSchema: generatedSchemas.doc_aeef15756129Output,
		}),
		listContainerRoles: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/role',
			method: 'GET',
			operationId: 'certcentralApi.listContainerRoles',
			inputSchema: generatedSchemas.doc_12b9a2ef2c46Input,
			outputSchema: generatedSchemas.doc_12b9a2ef2c46Output,
		}),
		listContainers: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container',
			method: 'GET',
			operationId: 'certcentralApi.listContainers',
			inputSchema: generatedSchemas.doc_0ef8984e5c8bInput,
			outputSchema: generatedSchemas.doc_0ef8984e5c8bOutput,
		}),
		listTemplates: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/template',
			method: 'GET',
			operationId: 'certcentralApi.listTemplates',
			inputSchema: generatedSchemas.doc_1041d732a432Input,
			outputSchema: generatedSchemas.doc_1041d732a432Output,
		}),
		parentContainerInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/parent',
			method: 'GET',
			operationId: 'certcentralApi.parentContainerInfo',
			inputSchema: generatedSchemas.doc_11b9f13443f4Input,
			outputSchema: generatedSchemas.doc_11b9f13443f4Output,
		}),
		productLimits: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container-id}/product-limits',
			method: 'GET',
			operationId: 'certcentralApi.productLimits',
			inputSchema: generatedSchemas.doc_9881d9a4588eInput,
			outputSchema: generatedSchemas.doc_9881d9a4588eOutput,
		}),
		templateInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/template/{template_id}',
			method: 'GET',
			operationId: 'certcentralApi.templateInfo',
			inputSchema: generatedSchemas.doc_8eb4885d89b3Input,
			outputSchema: generatedSchemas.doc_8eb4885d89b3Output,
		}),
		updateAllowedDomains: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/allowed-domain-names',
			method: 'PUT',
			operationId: 'certcentralApi.updateAllowedDomains',
			inputSchema: generatedSchemas.doc_979cc97944f4Input,
			outputSchema: generatedSchemas.doc_979cc97944f4Output,
		}),
		updateOrganizationAssignments: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/organization-assignments',
			method: 'PUT',
			operationId: 'certcentralApi.updateOrganizationAssignments',
			inputSchema: generatedSchemas.doc_af5d117edb7aInput,
			outputSchema: generatedSchemas.doc_af5d117edb7aOutput,
		}),
		updateRenewalNotificationRecipients: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/settings/additional_renewal_emails',
			method: 'PUT',
			operationId: 'certcentralApi.updateRenewalNotificationRecipients',
			inputSchema: generatedSchemas.doc_0bdd00e8d1ceInput,
			outputSchema: generatedSchemas.doc_0bdd00e8d1ceOutput,
		}),
		updateUserAssignments: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/user-assignments',
			method: 'PUT',
			operationId: 'certcentralApi.updateUserAssignments',
			inputSchema: generatedSchemas.doc_0a55eec794e9Input,
			outputSchema: generatedSchemas.doc_0a55eec794e9Output,
		}),
		allowlistIssuingCertificateAuthority: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/issuer-brand-settings',
			method: 'PUT',
			operationId: 'certcentralApi.allowlistIssuingCertificateAuthority',
			inputSchema: generatedSchemas.doc_14e4b1bd5a34Input,
			outputSchema: generatedSchemas.doc_14e4b1bd5a34Output,
		}),
		disableCtLogMonitoring: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/disable',
			method: 'PUT',
			operationId: 'certcentralApi.disableCtLogMonitoring',
			inputSchema: generatedSchemas.doc_30ad424e79e1Input,
			outputSchema: generatedSchemas.doc_30ad424e79e1Output,
		}),
		downloadCertificateSerialNumber: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/ct-cert/{serial_id}/',
			method: 'GET',
			operationId: 'certcentralApi.downloadCertificateSerialNumber',
			inputSchema: generatedSchemas.doc_c0e294c9d204Input,
			outputSchema: generatedSchemas.doc_c0e294c9d204Output,
		}),
		enableCtLogMonitoring: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/enable',
			method: 'PUT',
			operationId: 'certcentralApi.enableCtLogMonitoring',
			inputSchema: generatedSchemas.doc_9e9475186e42Input,
			outputSchema: generatedSchemas.doc_9e9475186e42Output,
		}),
		getAllowlistedIssuingCaBrandDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/issuer-brand-settings',
			method: 'GET',
			operationId: 'certcentralApi.getAllowlistedIssuingCaBrandDetails',
			inputSchema: generatedSchemas.doc_5d231daccbc1Input,
			outputSchema: generatedSchemas.doc_5d231daccbc1Output,
		}),
		getCtLogDetailsForACertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/cert-details/{certificate_serial_number}',
			method: 'GET',
			operationId: 'certcentralApi.getCtLogDetailsForACertificate',
			inputSchema: generatedSchemas.doc_f1dbbc96926eInput,
			outputSchema: generatedSchemas.doc_f1dbbc96926eOutput,
		}),
		getCtLogMonitoringStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/status',
			method: 'GET',
			operationId: 'certcentralApi.getCtLogMonitoringStatus',
			inputSchema: generatedSchemas.doc_0ca93d0cc9c4Input,
			outputSchema: generatedSchemas.doc_0ca93d0cc9c4Output,
		}),
		getCtLogsOrderId: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/details',
			method: 'GET',
			operationId: 'certcentralApi.getCtLogsOrderId',
			inputSchema: generatedSchemas.doc_48620dc4c72aInput,
			outputSchema: generatedSchemas.doc_48620dc4c72aOutput,
		}),
		activateDomainLocking: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/activate-domain-locking',
			method: 'PUT',
			operationId: 'certcentralApi.activateDomainLocking',
			inputSchema: generatedSchemas.doc_262c27590310Input,
			outputSchema: generatedSchemas.doc_262c27590310Output,
		}),
		activateDomain: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/activate',
			method: 'PUT',
			operationId: 'certcentralApi.activateDomain',
			inputSchema: generatedSchemas.doc_8aae6a51f92aInput,
			outputSchema: generatedSchemas.doc_8aae6a51f92aOutput,
		}),
		addDomain: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain',
			method: 'POST',
			operationId: 'certcentralApi.addDomain',
			inputSchema: generatedSchemas.doc_1aac58120f09Input,
			outputSchema: generatedSchemas.doc_1aac58120f09Output,
		}),
		changeDcvMethod: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/method',
			method: 'PUT',
			operationId: 'certcentralApi.changeDcvMethod',
			inputSchema: generatedSchemas.doc_f226832d3875Input,
			outputSchema: generatedSchemas.doc_f226832d3875Output,
		}),
		checkCaaDomainLock: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/caa',
			method: 'PUT',
			operationId: 'certcentralApi.checkCaaDomainLock',
			inputSchema: generatedSchemas.doc_5732d67dff2dInput,
			outputSchema: generatedSchemas.doc_5732d67dff2dOutput,
		}),
		deactivateDomainLocking: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/deactivate-domain-locking',
			method: 'PUT',
			operationId: 'certcentralApi.deactivateDomainLocking',
			inputSchema: generatedSchemas.doc_8c2ebcb999dbInput,
			outputSchema: generatedSchemas.doc_8c2ebcb999dbOutput,
		}),
		deactivateDomain: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/deactivate',
			method: 'PUT',
			operationId: 'certcentralApi.deactivateDomain',
			inputSchema: generatedSchemas.doc_8174f07e86d8Input,
			outputSchema: generatedSchemas.doc_8174f07e86d8Output,
		}),
		deleteDomain: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteDomain',
			inputSchema: generatedSchemas.doc_68c760dcbd07Input,
			outputSchema: generatedSchemas.doc_68c760dcbd07Output,
		}),
		domainEmails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/emails',
			method: 'GET',
			operationId: 'certcentralApi.domainEmails',
			inputSchema: generatedSchemas.doc_11c825cbc8c6Input,
			outputSchema: generatedSchemas.doc_11c825cbc8c6Output,
		}),
		domainInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}',
			method: 'GET',
			operationId: 'certcentralApi.domainInfo',
			inputSchema: generatedSchemas.doc_7553d189737cInput,
			outputSchema: generatedSchemas.doc_7553d189737cOutput,
		}),
		expiringDomainsCount: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/expiration-count',
			method: 'GET',
			operationId: 'certcentralApi.expiringDomainsCount',
			inputSchema: generatedSchemas.doc_e4cc91b4b088Input,
			outputSchema: generatedSchemas.doc_e4cc91b4b088Output,
		}),
		listDcvMethods: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/dcv/method',
			method: 'GET',
			operationId: 'certcentralApi.listDcvMethods',
			inputSchema: generatedSchemas.doc_4c129eef60aeInput,
			outputSchema: generatedSchemas.doc_4c129eef60aeOutput,
		}),
		listDomains: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain',
			method: 'GET',
			operationId: 'certcentralApi.listDomains',
			inputSchema: generatedSchemas.doc_c11852b77be3Input,
			outputSchema: generatedSchemas.doc_c11852b77be3Output,
		}),
		ovEvSslCheckDcv: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/validate-token',
			method: 'PUT',
			operationId: 'certcentralApi.ovEvSslCheckDcv',
			inputSchema: generatedSchemas.doc_c7aed98b2e77Input,
			outputSchema: generatedSchemas.doc_c7aed98b2e77Output,
		}),
		ovEvSslGenerateDcvToken: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/token',
			method: 'POST',
			operationId: 'certcentralApi.ovEvSslGenerateDcvToken',
			inputSchema: generatedSchemas.doc_4545251fa69dInput,
			outputSchema: generatedSchemas.doc_4545251fa69dOutput,
		}),
		resendDcvEmail: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/emails',
			method: 'PUT',
			operationId: 'certcentralApi.resendDcvEmail',
			inputSchema: generatedSchemas.doc_b1ecc284456cInput,
			outputSchema: generatedSchemas.doc_b1ecc284456cOutput,
		}),
		submitForValidation: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/validation',
			method: 'POST',
			operationId: 'certcentralApi.submitForValidation',
			inputSchema: generatedSchemas.doc_28388b3fed6aInput,
			outputSchema: generatedSchemas.doc_28388b3fed6aOutput,
		}),
		validationDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/{domain_id}/validation',
			method: 'GET',
			operationId: 'certcentralApi.validationDetails',
			inputSchema: generatedSchemas.doc_ff77d342fe74Input,
			outputSchema: generatedSchemas.doc_ff77d342fe74Output,
		}),
		validationTypes: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/domain/validation-type',
			method: 'GET',
			operationId: 'certcentralApi.validationTypes',
			inputSchema: generatedSchemas.doc_879c2f7de929Input,
			outputSchema: generatedSchemas.doc_879c2f7de929Output,
		}),
		listBalanceHistory: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/finance/balance-history',
			method: 'GET',
			operationId: 'certcentralApi.listBalanceHistory',
			inputSchema: generatedSchemas.doc_1177e54e3da6Input,
			outputSchema: generatedSchemas.doc_1177e54e3da6Output,
		}),
		listPurchaseHistory: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/finance/purchase-history',
			method: 'GET',
			operationId: 'certcentralApi.listPurchaseHistory',
			inputSchema: generatedSchemas.doc_f7d972dc06d1Input,
			outputSchema: generatedSchemas.doc_f7d972dc06d1Output,
		}),
		listReplacementBenefits: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/competitive-replacement/certificates',
			method: 'POST',
			operationId: 'certcentralApi.listReplacementBenefits',
			inputSchema: generatedSchemas.doc_019b3c552368Input,
			outputSchema: generatedSchemas.doc_019b3c552368Output,
		}),
		priceEstimate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/finance/order-pricing',
			method: 'POST',
			operationId: 'certcentralApi.priceEstimate',
			inputSchema: generatedSchemas.doc_1d5152684c65Input,
			outputSchema: generatedSchemas.doc_1d5152684c65Output,
		}),
		receiptInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/finance/receipt/{receipt_id}',
			method: 'GET',
			operationId: 'certcentralApi.receiptInfo',
			inputSchema: generatedSchemas.doc_572756329e70Input,
			outputSchema: generatedSchemas.doc_572756329e70Output,
		}),
		transferFunds: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/finance/transfer',
			method: 'POST',
			operationId: 'certcentralApi.transferFunds',
			inputSchema: generatedSchemas.doc_0298380d0e17Input,
			outputSchema: generatedSchemas.doc_0298380d0e17Output,
		}),
		viewBalance: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/finance/balance',
			method: 'GET',
			operationId: 'certcentralApi.viewBalance',
			inputSchema: generatedSchemas.doc_835a391f5830Input,
			outputSchema: generatedSchemas.doc_835a391f5830Output,
		}),
		voucherPriceEstimate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/finance/voucher-pricing',
			method: 'POST',
			operationId: 'certcentralApi.voucherPriceEstimate',
			inputSchema: generatedSchemas.doc_5390d99534c7Input,
			outputSchema: generatedSchemas.doc_5390d99534c7Output,
		}),
		addIpRestriction: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/ip/rules',
			method: 'POST',
			operationId: 'certcentralApi.addIpRestriction',
			inputSchema: generatedSchemas.doc_021260e79a53Input,
			outputSchema: generatedSchemas.doc_021260e79a53Output,
		}),
		deleteIpRestriction: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/ip/rule/{rule_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteIpRestriction',
			inputSchema: generatedSchemas.doc_72a39e90b633Input,
			outputSchema: generatedSchemas.doc_72a39e90b633Output,
		}),
		listIpRestrictions: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/container/{container_id}/ip/rules',
			method: 'GET',
			operationId: 'certcentralApi.listIpRestrictions',
			inputSchema: generatedSchemas.doc_993889ac64ddInput,
			outputSchema: generatedSchemas.doc_993889ac64ddOutput,
		}),
		digiCertOrderId: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/oem-migration/{legacy_order_id}/order-id',
			method: 'GET',
			operationId: 'certcentralApi.digiCertOrderId',
			inputSchema: generatedSchemas.doc_195aa516f3faInput,
			outputSchema: generatedSchemas.doc_195aa516f3faOutput,
		}),
		addNote_504f5354: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note',
			method: 'POST',
			operationId: 'certcentralApi.addNote_504f5354',
			inputSchema: generatedSchemas.doc_840c367cc8e6Input,
			outputSchema: generatedSchemas.doc_840c367cc8e6Output,
		}),
		additionalEmails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/additional-emails',
			method: 'PUT',
			operationId: 'certcentralApi.additionalEmails',
			inputSchema: generatedSchemas.doc_b9fef9a10667Input,
			outputSchema: generatedSchemas.doc_b9fef9a10667Output,
		}),
		changeCtStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/ct-status',
			method: 'PUT',
			operationId: 'certcentralApi.changeCtStatus',
			inputSchema: generatedSchemas.doc_76411ce6ddb4Input,
			outputSchema: generatedSchemas.doc_76411ce6ddb4Output,
		}),
		changeOrderContainer: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/move-to-container/{container_id}',
			method: 'PUT',
			operationId: 'certcentralApi.changeOrderContainer',
			inputSchema: generatedSchemas.doc_0414f6f07b3fInput,
			outputSchema: generatedSchemas.doc_0414f6f07b3fOutput,
		}),
		deleteCustomField_44454c45: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-field/{metadata_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteCustomField_44454c45',
			inputSchema: generatedSchemas.doc_5d952ea36887Input,
			outputSchema: generatedSchemas.doc_5d952ea36887Output,
		}),
		deleteNoteDeleteNote: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note/{note_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteNoteDeleteNote',
			inputSchema: generatedSchemas.doc_a5e2b942c7caInput,
			outputSchema: generatedSchemas.doc_a5e2b942c7caOutput,
		}),
		deleteOrderDeleteOrder: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteOrderDeleteOrder',
			inputSchema: generatedSchemas.doc_55ad712f0558Input,
			outputSchema: generatedSchemas.doc_55ad712f0558Output,
		}),
		deleteRenewalMessage: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-renewal-message',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteRenewalMessage',
			inputSchema: generatedSchemas.doc_35d402490c05Input,
			outputSchema: generatedSchemas.doc_35d402490c05Output,
		}),
		duplicateCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/duplicate',
			method: 'POST',
			operationId: 'certcentralApi.duplicateCertificate',
			inputSchema: generatedSchemas.doc_7e426cc9eb65Input,
			outputSchema: generatedSchemas.doc_7e426cc9eb65Output,
		}),
		dvSslChangeDcvMethod: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/dcv-method',
			method: 'PUT',
			operationId: 'certcentralApi.dvSslChangeDcvMethod',
			inputSchema: generatedSchemas.doc_45222df80d71Input,
			outputSchema: generatedSchemas.doc_45222df80d71Output,
		}),
		dvSslCheckDcv: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/check-dcv',
			method: 'PUT',
			operationId: 'certcentralApi.dvSslCheckDcv',
			inputSchema: generatedSchemas.doc_e81cc18a9102Input,
			outputSchema: generatedSchemas.doc_e81cc18a9102Output,
		}),
		generateDcvToken: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/dcv-random-value',
			method: 'PUT',
			operationId: 'certcentralApi.generateDcvToken',
			inputSchema: generatedSchemas.doc_e9a79ceccf84Input,
			outputSchema: generatedSchemas.doc_e9a79ceccf84Output,
		}),
		dvSslResendEmails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/resend-emails',
			method: 'PUT',
			operationId: 'certcentralApi.dvSslResendEmails',
			inputSchema: generatedSchemas.doc_9f9ccccf949cInput,
			outputSchema: generatedSchemas.doc_9f9ccccf949cOutput,
		}),
		editCustomFieldValue: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-field',
			method: 'POST',
			operationId: 'certcentralApi.editCustomFieldValue',
			inputSchema: generatedSchemas.doc_c428dd43444eInput,
			outputSchema: generatedSchemas.doc_c428dd43444eOutput,
		}),
		editDomainsOnAPendingOrderOrReissue: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/dns-names',
			method: 'PUT',
			operationId: 'certcentralApi.editDomainsOnAPendingOrderOrReissue',
			inputSchema: generatedSchemas.doc_b245584eda79Input,
			outputSchema: generatedSchemas.doc_b245584eda79Output,
		}),
		editGuestAccessOrder: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/guest-access',
			method: 'PUT',
			operationId: 'certcentralApi.editGuestAccessOrder',
			inputSchema: generatedSchemas.doc_f4797f262e2eInput,
			outputSchema: generatedSchemas.doc_f4797f262e2eOutput,
		}),
		editNote: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note/{note_id}',
			method: 'PUT',
			operationId: 'certcentralApi.editNote',
			inputSchema: generatedSchemas.doc_1a5d357e8d7cInput,
			outputSchema: generatedSchemas.doc_1a5d357e8d7cOutput,
		}),
		emailSiteSeal: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal/email-seal',
			method: 'POST',
			operationId: 'certcentralApi.emailSiteSeal',
			inputSchema: generatedSchemas.doc_cdce3b9fe81aInput,
			outputSchema: generatedSchemas.doc_cdce3b9fe81aOutput,
		}),
		emailValidationStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/email-validation',
			method: 'GET',
			operationId: 'certcentralApi.emailValidationStatus',
			inputSchema: generatedSchemas.doc_29565de72e14Input,
			outputSchema: generatedSchemas.doc_29565de72e14Output,
		}),
		getOrdersByAlternativeOrderId: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/alternate/{alternative_order_id}',
			method: 'GET',
			operationId: 'certcentralApi.getOrdersByAlternativeOrderId',
			inputSchema: generatedSchemas.doc_c19139eee34bInput,
			outputSchema: generatedSchemas.doc_c19139eee34bOutput,
		}),
		getVmcOrCmcLogo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc/logo',
			method: 'GET',
			operationId: 'certcentralApi.getVmcOrCmcLogo',
			inputSchema: generatedSchemas.doc_53d08315b668Input,
			outputSchema: generatedSchemas.doc_53d08315b668Output,
		}),
		listDuplicates: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/duplicate',
			method: 'GET',
			operationId: 'certcentralApi.listDuplicates',
			inputSchema: generatedSchemas.doc_a03377134888Input,
			outputSchema: generatedSchemas.doc_a03377134888Output,
		}),
		listOrderNotes: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note',
			method: 'GET',
			operationId: 'certcentralApi.listOrderNotes',
			inputSchema: generatedSchemas.doc_1d9e28c15f55Input,
			outputSchema: generatedSchemas.doc_1d9e28c15f55Output,
		}),
		listReissues: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/reissue',
			method: 'GET',
			operationId: 'certcentralApi.listReissues',
			inputSchema: generatedSchemas.doc_ad437431bcfbInput,
			outputSchema: generatedSchemas.doc_ad437431bcfbOutput,
		}),
		orderAatlNaturalPersonCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/aatl_np',
			method: 'POST',
			operationId: 'certcentralApi.orderAatlNaturalPersonCertificate',
			inputSchema: generatedSchemas.doc_d96c027674bdInput,
			outputSchema: generatedSchemas.doc_d96c027674bdOutput,
		}),
		orderAatlNaturalPersonInOrganisationCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/aatl_npo',
			method: 'POST',
			operationId:
				'certcentralApi.orderAatlNaturalPersonInOrganisationCertificate',
			inputSchema: generatedSchemas.doc_eb56e3af90eaInput,
			outputSchema: generatedSchemas.doc_eb56e3af90eaOutput,
		}),
		orderAatlOrganizationEsealCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/aatl_org',
			method: 'POST',
			operationId: 'certcentralApi.orderAatlOrganizationEsealCertificate',
			inputSchema: generatedSchemas.doc_a3e235afb912Input,
			outputSchema: generatedSchemas.doc_a3e235afb912Output,
		}),
		orderBasicEvOrderBasicEv: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_basic',
			method: 'POST',
			operationId: 'certcentralApi.orderBasicEvOrderBasicEv',
			inputSchema: generatedSchemas.doc_d3677b341798Input,
			outputSchema: generatedSchemas.doc_d3677b341798Output,
		}),
		orderMultiYearPlanOrderMultiYearPlan: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_basic',
			method: 'POST',
			operationId: 'certcentralApi.orderMultiYearPlanOrderMultiYearPlan',
			inputSchema: generatedSchemas.doc_d9a1c6ca3a31Input,
			outputSchema: generatedSchemas.doc_d9a1c6ca3a31Output,
		}),
		orderBasicOv: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_basic',
			method: 'POST',
			operationId: 'certcentralApi.orderBasicOv',
			inputSchema: generatedSchemas.doc_a941335e148eInput,
			outputSchema: generatedSchemas.doc_a941335e148eOutput,
		}),
		orderClientCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{client_certificate_id}',
			method: 'POST',
			operationId: 'certcentralApi.orderClientCertificate',
			inputSchema: generatedSchemas.doc_09dc6b5907cdInput,
			outputSchema: generatedSchemas.doc_09dc6b5907cdOutput,
		}),
		orderCodeSigningCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{code_signing_certificate_id}',
			method: 'POST',
			operationId: 'certcentralApi.orderCodeSigningCertificate',
			inputSchema: generatedSchemas.doc_0f8799b1925fInput,
			outputSchema: generatedSchemas.doc_0f8799b1925fOutput,
		}),
		orderCommonMarkCertificateCmc: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/mark_certificate',
			method: 'POST',
			operationId: 'certcentralApi.orderCommonMarkCertificateCmc',
			inputSchema: generatedSchemas.doc_89fbabad7e9cInput,
			outputSchema: generatedSchemas.doc_89fbabad7e9cOutput,
		}),
		orderDocumentSigningCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{document_certificate_id}',
			method: 'POST',
			operationId: 'certcentralApi.orderDocumentSigningCertificate',
			inputSchema: generatedSchemas.doc_1493e154c3f6Input,
			outputSchema: generatedSchemas.doc_1493e154c3f6Output,
		}),
		orderDocumentSigningForEmployee: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ds_org_individual',
			method: 'POST',
			operationId: 'certcentralApi.orderDocumentSigningForEmployee',
			inputSchema: generatedSchemas.doc_c3967d800a90Input,
			outputSchema: generatedSchemas.doc_c3967d800a90Output,
		}),
		orderDocumentSigningForIndividual: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ds_individual',
			method: 'POST',
			operationId: 'certcentralApi.orderDocumentSigningForIndividual',
			inputSchema: generatedSchemas.doc_56d7bc836984Input,
			outputSchema: generatedSchemas.doc_56d7bc836984Output,
		}),
		orderDocumentSigningForOrganization: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ds_org',
			method: 'POST',
			operationId: 'certcentralApi.orderDocumentSigningForOrganization',
			inputSchema: generatedSchemas.doc_2dac0a15a7fdInput,
			outputSchema: generatedSchemas.doc_2dac0a15a7fdOutput,
		}),
		orderDvSsl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{dv_ssl_certificate_id}',
			method: 'POST',
			operationId: 'certcentralApi.orderDvSsl',
			inputSchema: generatedSchemas.doc_c0609891ae33Input,
			outputSchema: generatedSchemas.doc_c0609891ae33Output,
		}),
		orderEuQualifiedESealPsd2: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/eu_eseal_psd2',
			method: 'POST',
			operationId: 'certcentralApi.orderEuQualifiedESealPsd2',
			inputSchema: generatedSchemas.doc_0b4c79c821dcInput,
			outputSchema: generatedSchemas.doc_0b4c79c821dcOutput,
		}),
		orderEuQualifiedESeal: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/eu_eseal',
			method: 'POST',
			operationId: 'certcentralApi.orderEuQualifiedESeal',
			inputSchema: generatedSchemas.doc_0a3891051c4aInput,
			outputSchema: generatedSchemas.doc_0a3891051c4aOutput,
		}),
		orderEuQualifiedPersonalOrganisation: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/eu_individual_org',
			method: 'POST',
			operationId: 'certcentralApi.orderEuQualifiedPersonalOrganisation',
			inputSchema: generatedSchemas.doc_e5dcf600c0d7Input,
			outputSchema: generatedSchemas.doc_e5dcf600c0d7Output,
		}),
		orderEuQualifiedPersonal: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/eu_individual',
			method: 'POST',
			operationId: 'certcentralApi.orderEuQualifiedPersonal',
			inputSchema: generatedSchemas.doc_c2ec15235334Input,
			outputSchema: generatedSchemas.doc_c2ec15235334Output,
		}),
		orderEuQualifiedWebsiteAuthenticationCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/eu_qwac',
			method: 'POST',
			operationId:
				'certcentralApi.orderEuQualifiedWebsiteAuthenticationCertificate',
			inputSchema: generatedSchemas.doc_191957a930e4Input,
			outputSchema: generatedSchemas.doc_191957a930e4Output,
		}),
		orderEuQualifiedWebsiteAuthenticationPsd2Certificate: createOpenApiEndpoint(
			{
				family: 'certcentral',
				path: '/order/certificate/eu_qwac_psd2',
				method: 'POST',
				operationId:
					'certcentralApi.orderEuQualifiedWebsiteAuthenticationPsd2Certificate',
				inputSchema: generatedSchemas.doc_f1de1effc183Input,
				outputSchema: generatedSchemas.doc_f1de1effc183Output,
			},
		),
		orderGeoTrustDvSsl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_dv_geotrust_flex',
			method: 'POST',
			operationId: 'certcentralApi.orderGeoTrustDvSsl',
			inputSchema: generatedSchemas.doc_159cdf63adcaInput,
			outputSchema: generatedSchemas.doc_159cdf63adcaOutput,
		}),
		orderInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}',
			method: 'GET',
			operationId: 'certcentralApi.orderInfo',
			inputSchema: generatedSchemas.doc_95010aa1d993Input,
			outputSchema: generatedSchemas.doc_95010aa1d993Output,
		}),
		orderOvEvSslOrderOvEvSsl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{ssl_certificate_id}',
			method: 'POST',
			operationId: 'certcentralApi.orderOvEvSslOrderOvEvSsl',
			inputSchema: generatedSchemas.doc_d47d505089b2Input,
			outputSchema: generatedSchemas.doc_d47d505089b2Output,
		}),
		orderSecureSiteSslOrderSecureSiteSsl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{ssl_certificate_id}',
			method: 'POST',
			operationId: 'certcentralApi.orderSecureSiteSslOrderSecureSiteSsl',
			inputSchema: generatedSchemas.doc_3aa38830d853Input,
			outputSchema: generatedSchemas.doc_3aa38830d853Output,
		}),
		orderPkioAuthenticationOrEncryptionCitizen: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_burger',
			method: 'POST',
			operationId: 'certcentralApi.orderPkioAuthenticationOrEncryptionCitizen',
			inputSchema: generatedSchemas.doc_1d36c4da1722Input,
			outputSchema: generatedSchemas.doc_1d36c4da1722Output,
		}),
		orderPkioAuthenticationOrEncryptionOrganisationPerson:
			createOpenApiEndpoint({
				family: 'certcentral',
				path: '/order/certificate/pkio_organisation_person',
				method: 'POST',
				operationId:
					'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationPerson',
				inputSchema: generatedSchemas.doc_ed7bb79325cdInput,
				outputSchema: generatedSchemas.doc_ed7bb79325cdOutput,
			}),
		orderPkioAuthenticationOrEncryptionOrganisationServices:
			createOpenApiEndpoint({
				family: 'certcentral',
				path: '/order/certificate/pkio_organisation_services',
				method: 'POST',
				operationId:
					'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationServices',
				inputSchema: generatedSchemas.doc_11c324bdd693Input,
				outputSchema: generatedSchemas.doc_11c324bdd693Output,
			}),
		orderPkioAuthenticationOrEncryptionPrivatePerson: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_private_person',
			method: 'POST',
			operationId:
				'certcentralApi.orderPkioAuthenticationOrEncryptionPrivatePerson',
			inputSchema: generatedSchemas.doc_c78a672ff18cInput,
			outputSchema: generatedSchemas.doc_c78a672ff18cOutput,
		}),
		orderPkioAuthenticationOrEncryptionPrivateProfessional:
			createOpenApiEndpoint({
				family: 'certcentral',
				path: '/order/certificate/pkio_private_person_prof',
				method: 'POST',
				operationId:
					'certcentralApi.orderPkioAuthenticationOrEncryptionPrivateProfessional',
				inputSchema: generatedSchemas.doc_dc85a3280001Input,
				outputSchema: generatedSchemas.doc_dc85a3280001Output,
			}),
		orderPkioAuthenticationOrEncryptionProfessional: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_organisation_person_prof',
			method: 'POST',
			operationId:
				'certcentralApi.orderPkioAuthenticationOrEncryptionProfessional',
			inputSchema: generatedSchemas.doc_93ed34af7e68Input,
			outputSchema: generatedSchemas.doc_93ed34af7e68Output,
		}),
		orderPkioCitizenSigning: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_burger',
			method: 'POST',
			operationId: 'certcentralApi.orderPkioCitizenSigning',
			inputSchema: generatedSchemas.doc_dcecf46c1fbbInput,
			outputSchema: generatedSchemas.doc_dcecf46c1fbbOutput,
		}),
		orderPkioPersonalOrganisationSigning: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_organisation_person',
			method: 'POST',
			operationId: 'certcentralApi.orderPkioPersonalOrganisationSigning',
			inputSchema: generatedSchemas.doc_74b189e5ad53Input,
			outputSchema: generatedSchemas.doc_74b189e5ad53Output,
		}),
		orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning:
			createOpenApiEndpoint({
				family: 'certcentral',
				path: '/order/certificate/pkio_qualified_private_person',
				method: 'POST',
				operationId:
					'certcentralApi.orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning',
				inputSchema: generatedSchemas.doc_ec7f110447fbInput,
				outputSchema: generatedSchemas.doc_ec7f110447fbOutput,
			}),
		orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning:
			createOpenApiEndpoint({
				family: 'certcentral',
				path: '/order/certificate/pkio_qualified_private_person',
				method: 'POST',
				operationId:
					'certcentralApi.orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning',
				inputSchema: generatedSchemas.doc_2a78e2010ac6Input,
				outputSchema: generatedSchemas.doc_2a78e2010ac6Output,
			}),
		orderPkioPrivateServicesServer: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_private_services_server',
			method: 'POST',
			operationId: 'certcentralApi.orderPkioPrivateServicesServer',
			inputSchema: generatedSchemas.doc_5e63a22b01a3Input,
			outputSchema: generatedSchemas.doc_5e63a22b01a3Output,
		}),
		orderPkioProfessionalSigning: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_organisation_person_prof',
			method: 'POST',
			operationId: 'certcentralApi.orderPkioProfessionalSigning',
			inputSchema: generatedSchemas.doc_b302c342b6b8Input,
			outputSchema: generatedSchemas.doc_b302c342b6b8Output,
		}),
		orderPkioQualifiedESeal: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_organisation_services',
			method: 'POST',
			operationId: 'certcentralApi.orderPkioQualifiedESeal',
			inputSchema: generatedSchemas.doc_b9ea55c57e9fInput,
			outputSchema: generatedSchemas.doc_b9ea55c57e9fOutput,
		}),
		orderPrivateSsl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{private_ssl_certificate_id}',
			method: 'POST',
			operationId: 'certcentralApi.orderPrivateSsl',
			inputSchema: generatedSchemas.doc_cdbafa8cb54fInput,
			outputSchema: generatedSchemas.doc_cdbafa8cb54fOutput,
		}),
		orderSecureEmailCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/secure_email_mailbox',
			method: 'POST',
			operationId: 'certcentralApi.orderSecureEmailCertificate',
			inputSchema: generatedSchemas.doc_398fcd149bccInput,
			outputSchema: generatedSchemas.doc_398fcd149bccOutput,
		}),
		orderSecureSiteEv: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_securesite_flex',
			method: 'POST',
			operationId: 'certcentralApi.orderSecureSiteEv',
			inputSchema: generatedSchemas.doc_9f6a27310b14Input,
			outputSchema: generatedSchemas.doc_9f6a27310b14Output,
		}),
		orderSecureSiteOv: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_securesite_flex',
			method: 'POST',
			operationId: 'certcentralApi.orderSecureSiteOv',
			inputSchema: generatedSchemas.doc_7d2b11ef40caInput,
			outputSchema: generatedSchemas.doc_7d2b11ef40caOutput,
		}),
		orderSecureSiteProEvSsl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_securesite_pro',
			method: 'POST',
			operationId: 'certcentralApi.orderSecureSiteProEvSsl',
			inputSchema: generatedSchemas.doc_6be9baf8c041Input,
			outputSchema: generatedSchemas.doc_6be9baf8c041Output,
		}),
		orderSecureSiteProSsl: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl_securesite_pro',
			method: 'POST',
			operationId: 'certcentralApi.orderSecureSiteProSsl',
			inputSchema: generatedSchemas.doc_f7a5b4e62ac8Input,
			outputSchema: generatedSchemas.doc_f7a5b4e62ac8Output,
		}),
		orderSslTypeHint: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/ssl',
			method: 'POST',
			operationId: 'certcentralApi.orderSslTypeHint',
			inputSchema: generatedSchemas.doc_9e11e8506b9aInput,
			outputSchema: generatedSchemas.doc_9e11e8506b9aOutput,
		}),
		orderSwissClientAuthenticationCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/dtm_client_authentication_ch',
			method: 'POST',
			operationId: 'certcentralApi.orderSwissClientAuthenticationCertificate',
			inputSchema: generatedSchemas.doc_cd38e0a41be1Input,
			outputSchema: generatedSchemas.doc_cd38e0a41be1Output,
		}),
		orderSwissQualifiedCertificateForIndividualInOrganisation:
			createOpenApiEndpoint({
				family: 'certcentral',
				path: '/order/certificate/swiss_qualified_individual_organisation',
				method: 'POST',
				operationId:
					'certcentralApi.orderSwissQualifiedCertificateForIndividualInOrganisation',
				inputSchema: generatedSchemas.doc_2eb02d4b4bceInput,
				outputSchema: generatedSchemas.doc_2eb02d4b4bceOutput,
			}),
		orderSwissQualifiedCertificateForIndividual: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/swiss_qualified_individual',
			method: 'POST',
			operationId: 'certcentralApi.orderSwissQualifiedCertificateForIndividual',
			inputSchema: generatedSchemas.doc_b1982a6f1fd9Input,
			outputSchema: generatedSchemas.doc_b1982a6f1fd9Output,
		}),
		orderSwissRegulatedCertificateForIndividualInOrganisation:
			createOpenApiEndpoint({
				family: 'certcentral',
				path: '/order/certificate/swiss_regulated_individual_organisation',
				method: 'POST',
				operationId:
					'certcentralApi.orderSwissRegulatedCertificateForIndividualInOrganisation',
				inputSchema: generatedSchemas.doc_df8381884a60Input,
				outputSchema: generatedSchemas.doc_df8381884a60Output,
			}),
		orderSwissRegulatedCertificateForIndividual: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/swiss_regulated_individual',
			method: 'POST',
			operationId: 'certcentralApi.orderSwissRegulatedCertificateForIndividual',
			inputSchema: generatedSchemas.doc_ea0edb75c1d4Input,
			outputSchema: generatedSchemas.doc_ea0edb75c1d4Output,
		}),
		orderSwissRegulatedCertificateForOrganisation: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/swiss_regulated_organisation',
			method: 'POST',
			operationId:
				'certcentralApi.orderSwissRegulatedCertificateForOrganisation',
			inputSchema: generatedSchemas.doc_2f1de3705731Input,
			outputSchema: generatedSchemas.doc_2f1de3705731Output,
		}),
		orderVerifiedMarkCertificateVmc: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/vmc_basic',
			method: 'POST',
			operationId: 'certcentralApi.orderVerifiedMarkCertificateVmc',
			inputSchema: generatedSchemas.doc_a9d557b1a987Input,
			outputSchema: generatedSchemas.doc_a9d557b1a987Output,
		}),
		orderX9PkiForTls: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/x9_pki',
			method: 'POST',
			operationId: 'certcentralApi.orderX9PkiForTls',
			inputSchema: generatedSchemas.doc_5870683c0fddInput,
			outputSchema: generatedSchemas.doc_5870683c0fddOutput,
		}),
		purchaseKeyLockerSignatures: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/buy-keylocker-signature-unit',
			method: 'PUT',
			operationId: 'certcentralApi.purchaseKeyLockerSignatures',
			inputSchema: generatedSchemas.doc_53a320a8c6adInput,
			outputSchema: generatedSchemas.doc_53a320a8c6adOutput,
		}),
		reissueCertificate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/reissue',
			method: 'POST',
			operationId: 'certcentralApi.reissueCertificate',
			inputSchema: generatedSchemas.doc_a5e7a4804418Input,
			outputSchema: generatedSchemas.doc_a5e7a4804418Output,
		}),
		resendOrderApprovalEmail: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/order-approval/resend-emails',
			method: 'PUT',
			operationId: 'certcentralApi.resendOrderApprovalEmail',
			inputSchema: generatedSchemas.doc_c974e0814d0cInput,
			outputSchema: generatedSchemas.doc_c974e0814d0cOutput,
		}),
		revokeOrderCertificates: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/revoke',
			method: 'PUT',
			operationId: 'certcentralApi.revokeOrderCertificates',
			inputSchema: generatedSchemas.doc_ece6a500fcc4Input,
			outputSchema: generatedSchemas.doc_ece6a500fcc4Output,
		}),
		siteSealSettings: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal',
			method: 'GET',
			operationId: 'certcentralApi.siteSealSettings',
			inputSchema: generatedSchemas.doc_fb4079d19b2cInput,
			outputSchema: generatedSchemas.doc_fb4079d19b2cOutput,
		}),
		statusChangeList: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/status-changes',
			method: 'GET',
			operationId: 'certcentralApi.statusChangeList',
			inputSchema: generatedSchemas.doc_024f62ae3007Input,
			outputSchema: generatedSchemas.doc_024f62ae3007Output,
		}),
		updateAutoReissueSettings: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/auto-reissue',
			method: 'PUT',
			operationId: 'certcentralApi.updateAutoReissueSettings',
			inputSchema: generatedSchemas.doc_d747245e5a92Input,
			outputSchema: generatedSchemas.doc_d747245e5a92Output,
		}),
		updateCsr: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/csr',
			method: 'POST',
			operationId: 'certcentralApi.updateCsr',
			inputSchema: generatedSchemas.doc_68f7c024afdcInput,
			outputSchema: generatedSchemas.doc_68f7c024afdcOutput,
		}),
		updateOrderContacts: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/contact',
			method: 'PUT',
			operationId: 'certcentralApi.updateOrderContacts',
			inputSchema: generatedSchemas.doc_371c627c78f8Input,
			outputSchema: generatedSchemas.doc_371c627c78f8Output,
		}),
		updateOrderStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/status',
			method: 'PUT',
			operationId: 'certcentralApi.updateOrderStatus',
			inputSchema: generatedSchemas.doc_d3087471b789Input,
			outputSchema: generatedSchemas.doc_d3087471b789Output,
		}),
		updateRenewalMessage: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-renewal-message',
			method: 'PUT',
			operationId: 'certcentralApi.updateRenewalMessage',
			inputSchema: generatedSchemas.doc_d7be8ba6987cInput,
			outputSchema: generatedSchemas.doc_d7be8ba6987cOutput,
		}),
		updateRenewalNotificationSettings: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/renewal-emails/{status}',
			method: 'PUT',
			operationId: 'certcentralApi.updateRenewalNotificationSettings',
			inputSchema: generatedSchemas.doc_0bc073434146Input,
			outputSchema: generatedSchemas.doc_0bc073434146Output,
		}),
		updateSiteSealSettings: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal',
			method: 'PUT',
			operationId: 'certcentralApi.updateSiteSealSettings',
			inputSchema: generatedSchemas.doc_c407e746e39fInput,
			outputSchema: generatedSchemas.doc_c407e746e39fOutput,
		}),
		updateVmcOrCmcOrders: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc',
			method: 'PUT',
			operationId: 'certcentralApi.updateVmcOrCmcOrders',
			inputSchema: generatedSchemas.doc_856d9dd6a089Input,
			outputSchema: generatedSchemas.doc_856d9dd6a089Output,
		}),
		uploadSiteSealLogo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal/logo',
			method: 'POST',
			operationId: 'certcentralApi.uploadSiteSealLogo',
			inputSchema: generatedSchemas.doc_4c494339b8bcInput,
			outputSchema: generatedSchemas.doc_4c494339b8bcOutput,
		}),
		uploadVmcOrCmcLogoEncoded: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc/encoded-logo',
			method: 'POST',
			operationId: 'certcentralApi.uploadVmcOrCmcLogoEncoded',
			inputSchema: generatedSchemas.doc_c458695a77c1Input,
			outputSchema: generatedSchemas.doc_c458695a77c1Output,
		}),
		uploadVmcOrCmcLogoSvg: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc/logo',
			method: 'POST',
			operationId: 'certcentralApi.uploadVmcOrCmcLogoSvg',
			inputSchema: generatedSchemas.doc_1cd57426d84fInput,
			outputSchema: generatedSchemas.doc_1cd57426d84fOutput,
		}),
		orderValidationStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/validation',
			method: 'GET',
			operationId: 'certcentralApi.orderValidationStatus',
			inputSchema: generatedSchemas.doc_00c9ade1d573Input,
			outputSchema: generatedSchemas.doc_00c9ade1d573Output,
		}),
		viewKeyLockerSignatures: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/signature-unit',
			method: 'GET',
			operationId: 'certcentralApi.viewKeyLockerSignatures',
			inputSchema: generatedSchemas.doc_51a82794cb6bInput,
			outputSchema: generatedSchemas.doc_51a82794cb6bOutput,
		}),
		viewNote: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note/{note_id}',
			method: 'GET',
			operationId: 'certcentralApi.viewNote',
			inputSchema: generatedSchemas.doc_7e904da76356Input,
			outputSchema: generatedSchemas.doc_7e904da76356Output,
		}),
		activateOrganization: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}/activate',
			method: 'PUT',
			operationId: 'certcentralApi.activateOrganization',
			inputSchema: generatedSchemas.doc_91ec86e31af6Input,
			outputSchema: generatedSchemas.doc_91ec86e31af6Output,
		}),
		createOrganization: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization',
			method: 'POST',
			operationId: 'certcentralApi.createOrganization',
			inputSchema: generatedSchemas.doc_38b5a83402faInput,
			outputSchema: generatedSchemas.doc_38b5a83402faOutput,
		}),
		deactivateOrganization: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}/deactivate',
			method: 'PUT',
			operationId: 'certcentralApi.deactivateOrganization',
			inputSchema: generatedSchemas.doc_60d5e42efa4dInput,
			outputSchema: generatedSchemas.doc_60d5e42efa4dOutput,
		}),
		deleteOrganization: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteOrganization',
			inputSchema: generatedSchemas.doc_c81496b5c977Input,
			outputSchema: generatedSchemas.doc_c81496b5c977Output,
		}),
		listApprovers: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/potential-approvers',
			method: 'GET',
			operationId: 'certcentralApi.listApprovers',
			inputSchema: generatedSchemas.doc_b4370f044cc5Input,
			outputSchema: generatedSchemas.doc_b4370f044cc5Output,
		}),
		organizationAndTechnicalContactInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}/contact',
			method: 'GET',
			operationId: 'certcentralApi.organizationAndTechnicalContactInfo',
			inputSchema: generatedSchemas.doc_11645edfc36dInput,
			outputSchema: generatedSchemas.doc_11645edfc36dOutput,
		}),
		organizationInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}',
			method: 'GET',
			operationId: 'certcentralApi.organizationInfo',
			inputSchema: generatedSchemas.doc_50cc2f9183daInput,
			outputSchema: generatedSchemas.doc_50cc2f9183daOutput,
		}),
		recentOrganizations: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/recent',
			method: 'GET',
			operationId: 'certcentralApi.recentOrganizations',
			inputSchema: generatedSchemas.doc_74e413c4970dInput,
			outputSchema: generatedSchemas.doc_74e413c4970dOutput,
		}),
		submitForValidation_504f5354: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}/validation',
			method: 'POST',
			operationId: 'certcentralApi.submitForValidation_504f5354',
			inputSchema: generatedSchemas.doc_a8d91a5423b6Input,
			outputSchema: generatedSchemas.doc_a8d91a5423b6Output,
		}),
		updateOrganizationAndTechnicalContact: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}/contact',
			method: 'PUT',
			operationId: 'certcentralApi.updateOrganizationAndTechnicalContact',
			inputSchema: generatedSchemas.doc_b2e717699b06Input,
			outputSchema: generatedSchemas.doc_b2e717699b06Output,
		}),
		validationDetails_4745542f: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/{organization_id}/validation',
			method: 'GET',
			operationId: 'certcentralApi.validationDetails_4745542f',
			inputSchema: generatedSchemas.doc_0215c703c550Input,
			outputSchema: generatedSchemas.doc_0215c703c550Output,
		}),
		validationTypes_4745542f: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/organization/validation-type',
			method: 'GET',
			operationId: 'certcentralApi.validationTypes_4745542f',
			inputSchema: generatedSchemas.doc_c52e159d5991Input,
			outputSchema: generatedSchemas.doc_c52e159d5991Output,
		}),
		certificateFormatMap: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/product/platform-certformat-mapping',
			method: 'GET',
			operationId: 'certcentralApi.certificateFormatMap',
			inputSchema: generatedSchemas.doc_666f59568c27Input,
			outputSchema: generatedSchemas.doc_666f59568c27Output,
		}),
		pricingList: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/product/pricing',
			method: 'GET',
			operationId: 'certcentralApi.pricingList',
			inputSchema: generatedSchemas.doc_8465456a9693Input,
			outputSchema: generatedSchemas.doc_8465456a9693Output,
		}),
		productInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/product/{name_id}',
			method: 'GET',
			operationId: 'certcentralApi.productInfo',
			inputSchema: generatedSchemas.doc_f16f9dd049d1Input,
			outputSchema: generatedSchemas.doc_f16f9dd049d1Output,
		}),
		productList: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/product',
			method: 'GET',
			operationId: 'certcentralApi.productList',
			inputSchema: generatedSchemas.doc_3dd2a16378a7Input,
			outputSchema: generatedSchemas.doc_3dd2a16378a7Output,
		}),
		expiringOrdersAndCertificates: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/report/order/expiring',
			method: 'GET',
			operationId: 'certcentralApi.expiringOrdersAndCertificates',
			inputSchema: generatedSchemas.doc_91596e1eec37Input,
			outputSchema: generatedSchemas.doc_91596e1eec37Output,
		}),
		orderReport: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/report/order',
			method: 'GET',
			operationId: 'certcentralApi.orderReport',
			inputSchema: generatedSchemas.doc_e0f375953ec2Input,
			outputSchema: generatedSchemas.doc_e0f375953ec2Output,
		}),
		requestSummary: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/report/request',
			method: 'GET',
			operationId: 'certcentralApi.requestSummary',
			inputSchema: generatedSchemas.doc_8798826d45afInput,
			outputSchema: generatedSchemas.doc_8798826d45afOutput,
		}),
		listRequests: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/request',
			method: 'GET',
			operationId: 'certcentralApi.listRequests',
			inputSchema: generatedSchemas.doc_6df583932616Input,
			outputSchema: generatedSchemas.doc_6df583932616Output,
		}),
		requestInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/request/{request_id}',
			method: 'GET',
			operationId: 'certcentralApi.requestInfo',
			inputSchema: generatedSchemas.doc_44723439c252Input,
			outputSchema: generatedSchemas.doc_44723439c252Output,
		}),
		updateCsrForAPendingReissueRequest: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/request/{request_id}/csr',
			method: 'GET',
			operationId: 'certcentralApi.updateCsrForAPendingReissueRequest',
			inputSchema: generatedSchemas.doc_473a86610c11Input,
			outputSchema: generatedSchemas.doc_473a86610c11Output,
		}),
		updateRequestStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/request/{request_id}/status',
			method: 'PUT',
			operationId: 'certcentralApi.updateRequestStatus',
			inputSchema: generatedSchemas.doc_baa0fe4977e9Input,
			outputSchema: generatedSchemas.doc_baa0fe4977e9Output,
		}),
		addOrRemoveFunds: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/balance',
			method: 'POST',
			operationId: 'certcentralApi.addOrRemoveFunds',
			inputSchema: generatedSchemas.doc_7396b08a6f91Input,
			outputSchema: generatedSchemas.doc_7396b08a6f91Output,
		}),
		balanceDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/balance',
			method: 'GET',
			operationId: 'certcentralApi.balanceDetails',
			inputSchema: generatedSchemas.doc_512fbcb31521Input,
			outputSchema: generatedSchemas.doc_512fbcb31521Output,
		}),
		cancelUnitOrder: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/units/order/{order_id}/cancel',
			method: 'PUT',
			operationId: 'certcentralApi.cancelUnitOrder',
			inputSchema: generatedSchemas.doc_6aea189047bbInput,
			outputSchema: generatedSchemas.doc_6aea189047bbOutput,
		}),
		createSubaccount: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account',
			method: 'POST',
			operationId: 'certcentralApi.createSubaccount',
			inputSchema: generatedSchemas.doc_e003784932c5Input,
			outputSchema: generatedSchemas.doc_e003784932c5Output,
		}),
		createUnitOrder: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/units/order',
			method: 'POST',
			operationId: 'certcentralApi.createUnitOrder',
			inputSchema: generatedSchemas.doc_816b2c098a33Input,
			outputSchema: generatedSchemas.doc_816b2c098a33Output,
		}),
		editSubaccount: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}',
			method: 'PUT',
			operationId: 'certcentralApi.editSubaccount',
			inputSchema: generatedSchemas.doc_503cf4e16d2bInput,
			outputSchema: generatedSchemas.doc_503cf4e16d2bOutput,
		}),
		listSubaccountDomains: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/domain',
			method: 'GET',
			operationId: 'certcentralApi.listSubaccountDomains',
			inputSchema: generatedSchemas.doc_74f49ae8a8a6Input,
			outputSchema: generatedSchemas.doc_74f49ae8a8a6Output,
		}),
		listSubaccountOrders: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/order',
			method: 'GET',
			operationId: 'certcentralApi.listSubaccountOrders',
			inputSchema: generatedSchemas.doc_ab644043c397Input,
			outputSchema: generatedSchemas.doc_ab644043c397Output,
		}),
		listSubaccountOrganizations: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/organization',
			method: 'GET',
			operationId: 'certcentralApi.listSubaccountOrganizations',
			inputSchema: generatedSchemas.doc_d5803b6e7447Input,
			outputSchema: generatedSchemas.doc_d5803b6e7447Output,
		}),
		listSubaccountProductLimits: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/product-limits',
			method: 'GET',
			operationId: 'certcentralApi.listSubaccountProductLimits',
			inputSchema: generatedSchemas.doc_e1dc075902d1Input,
			outputSchema: generatedSchemas.doc_e1dc075902d1Output,
		}),
		listSubaccountProducts: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/products',
			method: 'GET',
			operationId: 'certcentralApi.listSubaccountProducts',
			inputSchema: generatedSchemas.doc_6d243866e576Input,
			outputSchema: generatedSchemas.doc_6d243866e576Output,
		}),
		listSubaccounts: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount',
			method: 'GET',
			operationId: 'certcentralApi.listSubaccounts',
			inputSchema: generatedSchemas.doc_56a9f95675c0Input,
			outputSchema: generatedSchemas.doc_56a9f95675c0Output,
		}),
		listUnitOrders: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/units/order',
			method: 'GET',
			operationId: 'certcentralApi.listUnitOrders',
			inputSchema: generatedSchemas.doc_2e94b48c0b5aInput,
			outputSchema: generatedSchemas.doc_2e94b48c0b5aOutput,
		}),
		setSubaccountProducts: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/products',
			method: 'PUT',
			operationId: 'certcentralApi.setSubaccountProducts',
			inputSchema: generatedSchemas.doc_22d7ace97d71Input,
			outputSchema: generatedSchemas.doc_22d7ace97d71Output,
		}),
		subaccountInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}',
			method: 'GET',
			operationId: 'certcentralApi.subaccountInfo',
			inputSchema: generatedSchemas.doc_704eaf682fa9Input,
			outputSchema: generatedSchemas.doc_704eaf682fa9Output,
		}),
		subaccountOrderInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/order/{order_id}',
			method: 'GET',
			operationId: 'certcentralApi.subaccountOrderInfo',
			inputSchema: generatedSchemas.doc_6b9b6089bd0cInput,
			outputSchema: generatedSchemas.doc_6b9b6089bd0cOutput,
		}),
		subaccountReport: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/report',
			method: 'GET',
			operationId: 'certcentralApi.subaccountReport',
			inputSchema: generatedSchemas.doc_08798f327d62Input,
			outputSchema: generatedSchemas.doc_08798f327d62Output,
		}),
		unitOrderDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/units/order/{order_id}',
			method: 'GET',
			operationId: 'certcentralApi.unitOrderDetails',
			inputSchema: generatedSchemas.doc_eb9bb3268567Input,
			outputSchema: generatedSchemas.doc_eb9bb3268567Output,
		}),
		addServiceUserAddServiceUser: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user',
			method: 'POST',
			operationId: 'certcentralApi.addServiceUserAddServiceUser',
			inputSchema: generatedSchemas.doc_d1001d003fbfInput,
			outputSchema: generatedSchemas.doc_d1001d003fbfOutput,
		}),
		addUserAddUser: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user',
			method: 'POST',
			operationId: 'certcentralApi.addUserAddUser',
			inputSchema: generatedSchemas.doc_a0f2712ff23dInput,
			outputSchema: generatedSchemas.doc_a0f2712ff23dOutput,
		}),
		approveUserInvitation: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/invite/{invitation_id}/status',
			method: 'PUT',
			operationId: 'certcentralApi.approveUserInvitation',
			inputSchema: generatedSchemas.doc_dc9fc9718da9Input,
			outputSchema: generatedSchemas.doc_dc9fc9718da9Output,
		}),
		changeUserRole: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/{user_id}/role',
			method: 'PUT',
			operationId: 'certcentralApi.changeUserRole',
			inputSchema: generatedSchemas.doc_04640f5ca9dbInput,
			outputSchema: generatedSchemas.doc_04640f5ca9dbOutput,
		}),
		createVerifiedContactDelegation: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/delegation',
			method: 'POST',
			operationId: 'certcentralApi.createVerifiedContactDelegation',
			inputSchema: generatedSchemas.doc_6dcc4cfc0332Input,
			outputSchema: generatedSchemas.doc_6dcc4cfc0332Output,
		}),
		deleteUser: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/{user_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteUser',
			inputSchema: generatedSchemas.doc_4f3aa3dcbddfInput,
			outputSchema: generatedSchemas.doc_4f3aa3dcbddfOutput,
		}),
		deleteVerifiedContactDelegation: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/delegation/{delegation_id}',
			method: 'DELETE',
			operationId: 'certcentralApi.deleteVerifiedContactDelegation',
			inputSchema: generatedSchemas.doc_acb283c67d28Input,
			outputSchema: generatedSchemas.doc_acb283c67d28Output,
		}),
		editServiceUserEditServiceUser: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/{user_id}',
			method: 'PUT',
			operationId: 'certcentralApi.editServiceUserEditServiceUser',
			inputSchema: generatedSchemas.doc_c2cad94af625Input,
			outputSchema: generatedSchemas.doc_c2cad94af625Output,
		}),
		editUserEditUser: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/{user_id}',
			method: 'PUT',
			operationId: 'certcentralApi.editUserEditUser',
			inputSchema: generatedSchemas.doc_99cd5c10b76eInput,
			outputSchema: generatedSchemas.doc_99cd5c10b76eOutput,
		}),
		listServiceUsers: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/api-only',
			method: 'GET',
			operationId: 'certcentralApi.listServiceUsers',
			inputSchema: generatedSchemas.doc_05d5cbb0f106Input,
			outputSchema: generatedSchemas.doc_05d5cbb0f106Output,
		}),
		listUserInvitations: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/invite',
			method: 'GET',
			operationId: 'certcentralApi.listUserInvitations',
			inputSchema: generatedSchemas.doc_77496855f701Input,
			outputSchema: generatedSchemas.doc_77496855f701Output,
		}),
		listVerifiedContactDelegations: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/delegation',
			method: 'GET',
			operationId: 'certcentralApi.listVerifiedContactDelegations',
			inputSchema: generatedSchemas.doc_14c9ed9ecbeaInput,
			outputSchema: generatedSchemas.doc_14c9ed9ecbeaOutput,
		}),
		listVerifiedContactsThatCanDelegate: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/delegation/verified-contacts',
			method: 'GET',
			operationId: 'certcentralApi.listVerifiedContactsThatCanDelegate',
			inputSchema: generatedSchemas.doc_acb30b6fe47cInput,
			outputSchema: generatedSchemas.doc_acb30b6fe47cOutput,
		}),
		resendCreateUserEmail: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/{user_id}/resend-create-email',
			method: 'GET',
			operationId: 'certcentralApi.resendCreateUserEmail',
			inputSchema: generatedSchemas.doc_13f84ef14d51Input,
			outputSchema: generatedSchemas.doc_13f84ef14d51Output,
		}),
		resendVerifiedContactDelegationEmail: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/delegation/{delegation_id}/resend',
			method: 'PUT',
			operationId: 'certcentralApi.resendVerifiedContactDelegationEmail',
			inputSchema: generatedSchemas.doc_7c7b9e214afcInput,
			outputSchema: generatedSchemas.doc_7c7b9e214afcOutput,
		}),
		updateContainerAssignments: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/{user_id}/container-assignments',
			method: 'PUT',
			operationId: 'certcentralApi.updateContainerAssignments',
			inputSchema: generatedSchemas.doc_9d28384fd2c0Input,
			outputSchema: generatedSchemas.doc_9d28384fd2c0Output,
		}),
		userInfo: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/{user_id}',
			method: 'GET',
			operationId: 'certcentralApi.userInfo',
			inputSchema: generatedSchemas.doc_eab6767a5cc2Input,
			outputSchema: generatedSchemas.doc_eab6767a5cc2Output,
		}),
		usernameAvailability: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/user/availability/{user_name}',
			method: 'GET',
			operationId: 'certcentralApi.usernameAvailability',
			inputSchema: generatedSchemas.doc_fe8391ee5a60Input,
			outputSchema: generatedSchemas.doc_fe8391ee5a60Output,
		}),
		validateVmcOrCmcLogoFormatEncoded: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/util/validate-vmc-encoded-logo',
			method: 'PUT',
			operationId: 'certcentralApi.validateVmcOrCmcLogoFormatEncoded',
			inputSchema: generatedSchemas.doc_90cef15abecdInput,
			outputSchema: generatedSchemas.doc_90cef15abecdOutput,
		}),
		validateVmcOrCmcLogoFormatSvg: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/util/validate-vmc-logo',
			method: 'PUT',
			operationId: 'certcentralApi.validateVmcOrCmcLogoFormatSvg',
			inputSchema: generatedSchemas.doc_7ca7fbf49e63Input,
			outputSchema: generatedSchemas.doc_7ca7fbf49e63Output,
		}),
		cancelVoucherCode: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/voucher/{id}/cancel',
			method: 'PUT',
			operationId: 'certcentralApi.cancelVoucherCode',
			inputSchema: generatedSchemas.doc_032cc159a9c0Input,
			outputSchema: generatedSchemas.doc_032cc159a9c0Output,
		}),
		createVoucherOrder: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/voucher',
			method: 'POST',
			operationId: 'certcentralApi.createVoucherOrder',
			inputSchema: generatedSchemas.doc_6dffbee7df22Input,
			outputSchema: generatedSchemas.doc_6dffbee7df22Output,
		}),
		getVoucherOrderDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/voucher/{id}',
			method: 'GET',
			operationId: 'certcentralApi.getVoucherOrderDetails',
			inputSchema: generatedSchemas.doc_22a02832d5c8Input,
			outputSchema: generatedSchemas.doc_22a02832d5c8Output,
		}),
		listAllVoucherOrders: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/voucher',
			method: 'GET',
			operationId: 'certcentralApi.listAllVoucherOrders',
			inputSchema: generatedSchemas.doc_0253c8f31570Input,
			outputSchema: generatedSchemas.doc_0253c8f31570Output,
		}),
		listCodesForVoucherOrder: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/voucher/{voucher_order_id}/download',
			method: 'GET',
			operationId: 'certcentralApi.listCodesForVoucherOrder',
			inputSchema: generatedSchemas.doc_24364ddc889bInput,
			outputSchema: generatedSchemas.doc_24364ddc889bOutput,
		}),
		listUsedVoucherCodes: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/voucher/download/used-codes',
			method: 'GET',
			operationId: 'certcentralApi.listUsedVoucherCodes',
			inputSchema: generatedSchemas.doc_66501a2d927aInput,
			outputSchema: generatedSchemas.doc_66501a2d927aOutput,
		}),
		disableScanning: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/scan',
			method: 'DELETE',
			operationId: 'certcentralApi.disableScanning',
			inputSchema: generatedSchemas.doc_386a3b63ebcdInput,
			outputSchema: generatedSchemas.doc_386a3b63ebcdOutput,
		}),
		downloadResults: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/report/{domain_name}',
			method: 'GET',
			operationId: 'certcentralApi.downloadResults',
			inputSchema: generatedSchemas.doc_6e582dcd1d0bInput,
			outputSchema: generatedSchemas.doc_6e582dcd1d0bOutput,
		}),
		enableScanning: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/scan',
			method: 'PUT',
			operationId: 'certcentralApi.enableScanning',
			inputSchema: generatedSchemas.doc_d1f51d8aad67Input,
			outputSchema: generatedSchemas.doc_d1f51d8aad67Output,
		}),
		getEnabledStatus: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/status',
			method: 'GET',
			operationId: 'certcentralApi.getEnabledStatus',
			inputSchema: generatedSchemas.doc_8086b322241cInput,
			outputSchema: generatedSchemas.doc_8086b322241cOutput,
		}),
		getNotificationSettings: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/notification-settings',
			method: 'GET',
			operationId: 'certcentralApi.getNotificationSettings',
			inputSchema: generatedSchemas.doc_6b3b0b1d5184Input,
			outputSchema: generatedSchemas.doc_6b3b0b1d5184Output,
		}),
		getScanDetails: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/details',
			method: 'GET',
			operationId: 'certcentralApi.getScanDetails',
			inputSchema: generatedSchemas.doc_a3c0623a5337Input,
			outputSchema: generatedSchemas.doc_a3c0623a5337Output,
		}),
		rescanDomain: createOpenApiEndpoint({
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/rescan/{domain}',
			method: 'PUT',
			operationId: 'certcentralApi.rescanDomain',
			inputSchema: generatedSchemas.doc_cf596c53b5beInput,
			outputSchema: generatedSchemas.doc_cf596c53b5beOutput,
		}),
	},
	reportLibraryApi: {
		createReport: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report',
			method: 'POST',
			operationId: 'reportLibraryApi.createReport',
			inputSchema: generatedSchemas.doc_25993fbcf6e2Input,
			outputSchema: generatedSchemas.doc_25993fbcf6e2Output,
		}),
		deleteReportRun: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/{report_identifier}/{report_run_identifier}',
			method: 'DELETE',
			operationId: 'reportLibraryApi.deleteReportRun',
			inputSchema: generatedSchemas.doc_9e251cf5f94bInput,
			outputSchema: generatedSchemas.doc_9e251cf5f94bOutput,
		}),
		deleteReport: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/{report_identifier}',
			method: 'DELETE',
			operationId: 'reportLibraryApi.deleteReport',
			inputSchema: generatedSchemas.doc_5572d37bb03dInput,
			outputSchema: generatedSchemas.doc_5572d37bb03dOutput,
		}),
		deleteScheduledReport: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/scheduled/{report_identifier}',
			method: 'DELETE',
			operationId: 'reportLibraryApi.deleteScheduledReport',
			inputSchema: generatedSchemas.doc_53f4f8bcf551Input,
			outputSchema: generatedSchemas.doc_53f4f8bcf551Output,
		}),
		downloadReport: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/{report_identifier}/{report_run_identifier}/download',
			method: 'GET',
			operationId: 'reportLibraryApi.downloadReport',
			responseType: 'binary',
			inputSchema: generatedSchemas.doc_f22fa239a636Input,
			outputSchema: generatedSchemas.doc_f22fa239a636Output,
		}),
		editReport: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/{report_identifier}',
			method: 'PUT',
			operationId: 'reportLibraryApi.editReport',
			inputSchema: generatedSchemas.doc_d6c0bc13eb4bInput,
			outputSchema: generatedSchemas.doc_d6c0bc13eb4bOutput,
		}),
		getJsonReport: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/{report_identifier}/{report_run_identifier}/json',
			method: 'GET',
			operationId: 'reportLibraryApi.getJsonReport',
			inputSchema: generatedSchemas.doc_5574ec7619c8Input,
			outputSchema: generatedSchemas.doc_5574ec7619c8Output,
		}),
		listColumns: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/types/orders/supported-columns',
			method: 'GET',
			operationId: 'reportLibraryApi.listColumns',
			inputSchema: generatedSchemas.doc_08c16f4a80d4Input,
			outputSchema: generatedSchemas.doc_08c16f4a80d4Output,
		}),
		startReportRun: createOpenApiEndpoint({
			family: 'reportLibrary',
			path: '/report/{report_identifier}/run',
			method: 'POST',
			operationId: 'reportLibraryApi.startReportRun',
			inputSchema: generatedSchemas.doc_b285fe5a9222Input,
			outputSchema: generatedSchemas.doc_b285fe5a9222Output,
		}),
	},
} as const;

type GeneratedDocEndpointPath =
	| 'certcentralApi.accountDetails'
	| 'certcentralApi.addCustomField'
	| 'certcentralApi.authKeyDetails'
	| 'certcentralApi.bulkAddFields'
	| 'certcentralApi.configureOidcSso'
	| 'certcentralApi.contractDetails'
	| 'certcentralApi.createAuthKey'
	| 'certcentralApi.deleteAuthKey'
	| 'certcentralApi.deleteCustomField'
	| 'certcentralApi.deleteOidcSsoConfiguration'
	| 'certcentralApi.editCustomField'
	| 'certcentralApi.guestAccessUrl'
	| 'certcentralApi.inviteDetails'
	| 'certcentralApi.listAuthKeys'
	| 'certcentralApi.listCustomFields'
	| 'certcentralApi.listInvites'
	| 'certcentralApi.moveOrders'
	| 'certcentralApi.oidcSsoConfigurationDetails'
	| 'certcentralApi.resendInvite'
	| 'certcentralApi.samlEntityDetails'
	| 'certcentralApi.sendInvite'
	| 'certcentralApi.updateAccountEmails'
	| 'certcentralApi.updateAccountNotificationSettings'
	| 'certcentralApi.updateInviteStatus'
	| 'certcentralApi.updateOidcSsoConfiguration'
	| 'certcentralApi.updateSamlEntity'
	| 'certcentralApi.acmeExternalAccountBinding'
	| 'certcentralApi.createKey'
	| 'certcentralApi.editKey'
	| 'certcentralApi.getKeyInfo'
	| 'certcentralApi.listApiAccessRoles'
	| 'certcentralApi.listKeys'
	| 'certcentralApi.updateAcmeRestrictions'
	| 'certcentralApi.updateKeyStatus'
	| 'certcentralApi.checkPermission'
	| 'certcentralApi.containerPermissions'
	| 'certcentralApi.listPermissions'
	| 'certcentralApi.addNote'
	| 'certcentralApi.archiveCertificate'
	| 'certcentralApi.certificateChain'
	| 'certcentralApi.downloadCertificateByFormatOrderId'
	| 'certcentralApi.downloadCertificateByFormat'
	| 'certcentralApi.downloadCertificateOrderId'
	| 'certcentralApi.emailCertificate'
	| 'certcentralApi.listCertificateNotes'
	| 'certcentralApi.restoreCertificate'
	| 'certcentralApi.revokeCertificate'
	| 'certcentralApi.activateContainer'
	| 'certcentralApi.containerInfo'
	| 'certcentralApi.createContainer'
	| 'certcentralApi.deactivateContainer'
	| 'certcentralApi.editContainer'
	| 'certcentralApi.listChildContainers'
	| 'certcentralApi.listContainerOrganizations'
	| 'certcentralApi.listContainerRoles'
	| 'certcentralApi.listContainers'
	| 'certcentralApi.listTemplates'
	| 'certcentralApi.parentContainerInfo'
	| 'certcentralApi.productLimits'
	| 'certcentralApi.templateInfo'
	| 'certcentralApi.updateAllowedDomains'
	| 'certcentralApi.updateOrganizationAssignments'
	| 'certcentralApi.updateRenewalNotificationRecipients'
	| 'certcentralApi.updateUserAssignments'
	| 'certcentralApi.allowlistIssuingCertificateAuthority'
	| 'certcentralApi.disableCtLogMonitoring'
	| 'certcentralApi.downloadCertificateSerialNumber'
	| 'certcentralApi.enableCtLogMonitoring'
	| 'certcentralApi.getAllowlistedIssuingCaBrandDetails'
	| 'certcentralApi.getCtLogDetailsForACertificate'
	| 'certcentralApi.getCtLogMonitoringStatus'
	| 'certcentralApi.getCtLogsOrderId'
	| 'certcentralApi.activateDomainLocking'
	| 'certcentralApi.activateDomain'
	| 'certcentralApi.addDomain'
	| 'certcentralApi.changeDcvMethod'
	| 'certcentralApi.checkCaaDomainLock'
	| 'certcentralApi.deactivateDomainLocking'
	| 'certcentralApi.deactivateDomain'
	| 'certcentralApi.deleteDomain'
	| 'certcentralApi.domainEmails'
	| 'certcentralApi.domainInfo'
	| 'certcentralApi.expiringDomainsCount'
	| 'certcentralApi.listDcvMethods'
	| 'certcentralApi.listDomains'
	| 'certcentralApi.ovEvSslCheckDcv'
	| 'certcentralApi.ovEvSslGenerateDcvToken'
	| 'certcentralApi.resendDcvEmail'
	| 'certcentralApi.submitForValidation'
	| 'certcentralApi.validationDetails'
	| 'certcentralApi.validationTypes'
	| 'certcentralApi.listBalanceHistory'
	| 'certcentralApi.listPurchaseHistory'
	| 'certcentralApi.listReplacementBenefits'
	| 'certcentralApi.priceEstimate'
	| 'certcentralApi.receiptInfo'
	| 'certcentralApi.transferFunds'
	| 'certcentralApi.viewBalance'
	| 'certcentralApi.voucherPriceEstimate'
	| 'certcentralApi.addIpRestriction'
	| 'certcentralApi.deleteIpRestriction'
	| 'certcentralApi.listIpRestrictions'
	| 'certcentralApi.digiCertOrderId'
	| 'certcentralApi.addNote_504f5354'
	| 'certcentralApi.additionalEmails'
	| 'certcentralApi.changeCtStatus'
	| 'certcentralApi.changeOrderContainer'
	| 'certcentralApi.deleteCustomField_44454c45'
	| 'certcentralApi.deleteNoteDeleteNote'
	| 'certcentralApi.deleteOrderDeleteOrder'
	| 'certcentralApi.deleteRenewalMessage'
	| 'certcentralApi.duplicateCertificate'
	| 'certcentralApi.dvSslChangeDcvMethod'
	| 'certcentralApi.dvSslCheckDcv'
	| 'certcentralApi.generateDcvToken'
	| 'certcentralApi.dvSslResendEmails'
	| 'certcentralApi.editCustomFieldValue'
	| 'certcentralApi.editDomainsOnAPendingOrderOrReissue'
	| 'certcentralApi.editGuestAccessOrder'
	| 'certcentralApi.editNote'
	| 'certcentralApi.emailSiteSeal'
	| 'certcentralApi.emailValidationStatus'
	| 'certcentralApi.getOrdersByAlternativeOrderId'
	| 'certcentralApi.getVmcOrCmcLogo'
	| 'certcentralApi.listDuplicates'
	| 'certcentralApi.listOrderNotes'
	| 'certcentralApi.listReissues'
	| 'certcentralApi.orderAatlNaturalPersonCertificate'
	| 'certcentralApi.orderAatlNaturalPersonInOrganisationCertificate'
	| 'certcentralApi.orderAatlOrganizationEsealCertificate'
	| 'certcentralApi.orderBasicEvOrderBasicEv'
	| 'certcentralApi.orderMultiYearPlanOrderMultiYearPlan'
	| 'certcentralApi.orderBasicOv'
	| 'certcentralApi.orderClientCertificate'
	| 'certcentralApi.orderCodeSigningCertificate'
	| 'certcentralApi.orderCommonMarkCertificateCmc'
	| 'certcentralApi.orderDocumentSigningCertificate'
	| 'certcentralApi.orderDocumentSigningForEmployee'
	| 'certcentralApi.orderDocumentSigningForIndividual'
	| 'certcentralApi.orderDocumentSigningForOrganization'
	| 'certcentralApi.orderDvSsl'
	| 'certcentralApi.orderEuQualifiedESealPsd2'
	| 'certcentralApi.orderEuQualifiedESeal'
	| 'certcentralApi.orderEuQualifiedPersonalOrganisation'
	| 'certcentralApi.orderEuQualifiedPersonal'
	| 'certcentralApi.orderEuQualifiedWebsiteAuthenticationCertificate'
	| 'certcentralApi.orderEuQualifiedWebsiteAuthenticationPsd2Certificate'
	| 'certcentralApi.orderGeoTrustDvSsl'
	| 'certcentralApi.orderInfo'
	| 'certcentralApi.orderOvEvSslOrderOvEvSsl'
	| 'certcentralApi.orderSecureSiteSslOrderSecureSiteSsl'
	| 'certcentralApi.orderPkioAuthenticationOrEncryptionCitizen'
	| 'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationPerson'
	| 'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationServices'
	| 'certcentralApi.orderPkioAuthenticationOrEncryptionPrivatePerson'
	| 'certcentralApi.orderPkioAuthenticationOrEncryptionPrivateProfessional'
	| 'certcentralApi.orderPkioAuthenticationOrEncryptionProfessional'
	| 'certcentralApi.orderPkioCitizenSigning'
	| 'certcentralApi.orderPkioPersonalOrganisationSigning'
	| 'certcentralApi.orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning'
	| 'certcentralApi.orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning'
	| 'certcentralApi.orderPkioPrivateServicesServer'
	| 'certcentralApi.orderPkioProfessionalSigning'
	| 'certcentralApi.orderPkioQualifiedESeal'
	| 'certcentralApi.orderPrivateSsl'
	| 'certcentralApi.orderSecureEmailCertificate'
	| 'certcentralApi.orderSecureSiteEv'
	| 'certcentralApi.orderSecureSiteOv'
	| 'certcentralApi.orderSecureSiteProEvSsl'
	| 'certcentralApi.orderSecureSiteProSsl'
	| 'certcentralApi.orderSslTypeHint'
	| 'certcentralApi.orderSwissClientAuthenticationCertificate'
	| 'certcentralApi.orderSwissQualifiedCertificateForIndividualInOrganisation'
	| 'certcentralApi.orderSwissQualifiedCertificateForIndividual'
	| 'certcentralApi.orderSwissRegulatedCertificateForIndividualInOrganisation'
	| 'certcentralApi.orderSwissRegulatedCertificateForIndividual'
	| 'certcentralApi.orderSwissRegulatedCertificateForOrganisation'
	| 'certcentralApi.orderVerifiedMarkCertificateVmc'
	| 'certcentralApi.orderX9PkiForTls'
	| 'certcentralApi.purchaseKeyLockerSignatures'
	| 'certcentralApi.reissueCertificate'
	| 'certcentralApi.resendOrderApprovalEmail'
	| 'certcentralApi.revokeOrderCertificates'
	| 'certcentralApi.siteSealSettings'
	| 'certcentralApi.statusChangeList'
	| 'certcentralApi.updateAutoReissueSettings'
	| 'certcentralApi.updateCsr'
	| 'certcentralApi.updateOrderContacts'
	| 'certcentralApi.updateOrderStatus'
	| 'certcentralApi.updateRenewalMessage'
	| 'certcentralApi.updateRenewalNotificationSettings'
	| 'certcentralApi.updateSiteSealSettings'
	| 'certcentralApi.updateVmcOrCmcOrders'
	| 'certcentralApi.uploadSiteSealLogo'
	| 'certcentralApi.uploadVmcOrCmcLogoEncoded'
	| 'certcentralApi.uploadVmcOrCmcLogoSvg'
	| 'certcentralApi.orderValidationStatus'
	| 'certcentralApi.viewKeyLockerSignatures'
	| 'certcentralApi.viewNote'
	| 'certcentralApi.activateOrganization'
	| 'certcentralApi.createOrganization'
	| 'certcentralApi.deactivateOrganization'
	| 'certcentralApi.deleteOrganization'
	| 'certcentralApi.listApprovers'
	| 'certcentralApi.organizationAndTechnicalContactInfo'
	| 'certcentralApi.organizationInfo'
	| 'certcentralApi.recentOrganizations'
	| 'certcentralApi.submitForValidation_504f5354'
	| 'certcentralApi.updateOrganizationAndTechnicalContact'
	| 'certcentralApi.validationDetails_4745542f'
	| 'certcentralApi.validationTypes_4745542f'
	| 'certcentralApi.certificateFormatMap'
	| 'certcentralApi.pricingList'
	| 'certcentralApi.productInfo'
	| 'certcentralApi.productList'
	| 'certcentralApi.expiringOrdersAndCertificates'
	| 'certcentralApi.orderReport'
	| 'certcentralApi.requestSummary'
	| 'certcentralApi.listRequests'
	| 'certcentralApi.requestInfo'
	| 'certcentralApi.updateCsrForAPendingReissueRequest'
	| 'certcentralApi.updateRequestStatus'
	| 'certcentralApi.addOrRemoveFunds'
	| 'certcentralApi.balanceDetails'
	| 'certcentralApi.cancelUnitOrder'
	| 'certcentralApi.createSubaccount'
	| 'certcentralApi.createUnitOrder'
	| 'certcentralApi.editSubaccount'
	| 'certcentralApi.listSubaccountDomains'
	| 'certcentralApi.listSubaccountOrders'
	| 'certcentralApi.listSubaccountOrganizations'
	| 'certcentralApi.listSubaccountProductLimits'
	| 'certcentralApi.listSubaccountProducts'
	| 'certcentralApi.listSubaccounts'
	| 'certcentralApi.listUnitOrders'
	| 'certcentralApi.setSubaccountProducts'
	| 'certcentralApi.subaccountInfo'
	| 'certcentralApi.subaccountOrderInfo'
	| 'certcentralApi.subaccountReport'
	| 'certcentralApi.unitOrderDetails'
	| 'certcentralApi.addServiceUserAddServiceUser'
	| 'certcentralApi.addUserAddUser'
	| 'certcentralApi.approveUserInvitation'
	| 'certcentralApi.changeUserRole'
	| 'certcentralApi.createVerifiedContactDelegation'
	| 'certcentralApi.deleteUser'
	| 'certcentralApi.deleteVerifiedContactDelegation'
	| 'certcentralApi.editServiceUserEditServiceUser'
	| 'certcentralApi.editUserEditUser'
	| 'certcentralApi.listServiceUsers'
	| 'certcentralApi.listUserInvitations'
	| 'certcentralApi.listVerifiedContactDelegations'
	| 'certcentralApi.listVerifiedContactsThatCanDelegate'
	| 'certcentralApi.resendCreateUserEmail'
	| 'certcentralApi.resendVerifiedContactDelegationEmail'
	| 'certcentralApi.updateContainerAssignments'
	| 'certcentralApi.userInfo'
	| 'certcentralApi.usernameAvailability'
	| 'certcentralApi.validateVmcOrCmcLogoFormatEncoded'
	| 'certcentralApi.validateVmcOrCmcLogoFormatSvg'
	| 'certcentralApi.cancelVoucherCode'
	| 'certcentralApi.createVoucherOrder'
	| 'certcentralApi.getVoucherOrderDetails'
	| 'certcentralApi.listAllVoucherOrders'
	| 'certcentralApi.listCodesForVoucherOrder'
	| 'certcentralApi.listUsedVoucherCodes'
	| 'certcentralApi.disableScanning'
	| 'certcentralApi.downloadResults'
	| 'certcentralApi.enableScanning'
	| 'certcentralApi.getEnabledStatus'
	| 'certcentralApi.getNotificationSettings'
	| 'certcentralApi.getScanDetails'
	| 'certcentralApi.rescanDomain'
	| 'reportLibraryApi.createReport'
	| 'reportLibraryApi.deleteReportRun'
	| 'reportLibraryApi.deleteReport'
	| 'reportLibraryApi.deleteScheduledReport'
	| 'reportLibraryApi.downloadReport'
	| 'reportLibraryApi.editReport'
	| 'reportLibraryApi.getJsonReport'
	| 'reportLibraryApi.listColumns'
	| 'reportLibraryApi.startReportRun';

export const generatedDocEndpointSchemas: Record<
	GeneratedDocEndpointPath,
	{ input: z.ZodTypeAny; output: z.ZodTypeAny }
> = {
	'certcentralApi.accountDetails': {
		input: generatedSchemas.doc_b404e0df280eInput,
		output: generatedSchemas.doc_b404e0df280eOutput,
	},
	'certcentralApi.addCustomField': {
		input: generatedSchemas.doc_9eaf8d093062Input,
		output: generatedSchemas.doc_9eaf8d093062Output,
	},
	'certcentralApi.authKeyDetails': {
		input: generatedSchemas.doc_d3cc6430936dInput,
		output: generatedSchemas.doc_d3cc6430936dOutput,
	},
	'certcentralApi.bulkAddFields': {
		input: generatedSchemas.doc_00ad039ae491Input,
		output: generatedSchemas.doc_00ad039ae491Output,
	},
	'certcentralApi.configureOidcSso': {
		input: generatedSchemas.doc_1ef869474727Input,
		output: generatedSchemas.doc_1ef869474727Output,
	},
	'certcentralApi.contractDetails': {
		input: generatedSchemas.doc_bb6c5576f14bInput,
		output: generatedSchemas.doc_bb6c5576f14bOutput,
	},
	'certcentralApi.createAuthKey': {
		input: generatedSchemas.doc_a8eee1e78e72Input,
		output: generatedSchemas.doc_a8eee1e78e72Output,
	},
	'certcentralApi.deleteAuthKey': {
		input: generatedSchemas.doc_c391f0331b7eInput,
		output: generatedSchemas.doc_c391f0331b7eOutput,
	},
	'certcentralApi.deleteCustomField': {
		input: generatedSchemas.doc_abdf255be06aInput,
		output: generatedSchemas.doc_abdf255be06aOutput,
	},
	'certcentralApi.deleteOidcSsoConfiguration': {
		input: generatedSchemas.doc_f5cd45279030Input,
		output: generatedSchemas.doc_f5cd45279030Output,
	},
	'certcentralApi.editCustomField': {
		input: generatedSchemas.doc_7f053e614b94Input,
		output: generatedSchemas.doc_7f053e614b94Output,
	},
	'certcentralApi.guestAccessUrl': {
		input: generatedSchemas.doc_8ed6be3e6d29Input,
		output: generatedSchemas.doc_8ed6be3e6d29Output,
	},
	'certcentralApi.inviteDetails': {
		input: generatedSchemas.doc_d9379f0e3a78Input,
		output: generatedSchemas.doc_d9379f0e3a78Output,
	},
	'certcentralApi.listAuthKeys': {
		input: generatedSchemas.doc_35988e9424cfInput,
		output: generatedSchemas.doc_35988e9424cfOutput,
	},
	'certcentralApi.listCustomFields': {
		input: generatedSchemas.doc_10eeaf071883Input,
		output: generatedSchemas.doc_10eeaf071883Output,
	},
	'certcentralApi.listInvites': {
		input: generatedSchemas.doc_12638b157910Input,
		output: generatedSchemas.doc_12638b157910Output,
	},
	'certcentralApi.moveOrders': {
		input: generatedSchemas.doc_ad55507625c4Input,
		output: generatedSchemas.doc_ad55507625c4Output,
	},
	'certcentralApi.oidcSsoConfigurationDetails': {
		input: generatedSchemas.doc_aa0985870136Input,
		output: generatedSchemas.doc_aa0985870136Output,
	},
	'certcentralApi.resendInvite': {
		input: generatedSchemas.doc_fb8e1d4e570bInput,
		output: generatedSchemas.doc_fb8e1d4e570bOutput,
	},
	'certcentralApi.samlEntityDetails': {
		input: generatedSchemas.doc_b0fef9c9858cInput,
		output: generatedSchemas.doc_b0fef9c9858cOutput,
	},
	'certcentralApi.sendInvite': {
		input: generatedSchemas.doc_22f01bc0cb8aInput,
		output: generatedSchemas.doc_22f01bc0cb8aOutput,
	},
	'certcentralApi.updateAccountEmails': {
		input: generatedSchemas.doc_b790c4385b03Input,
		output: generatedSchemas.doc_b790c4385b03Output,
	},
	'certcentralApi.updateAccountNotificationSettings': {
		input: generatedSchemas.doc_6a803196fac7Input,
		output: generatedSchemas.doc_6a803196fac7Output,
	},
	'certcentralApi.updateInviteStatus': {
		input: generatedSchemas.doc_ad6d2a03d1b2Input,
		output: generatedSchemas.doc_ad6d2a03d1b2Output,
	},
	'certcentralApi.updateOidcSsoConfiguration': {
		input: generatedSchemas.doc_af38437e1d87Input,
		output: generatedSchemas.doc_af38437e1d87Output,
	},
	'certcentralApi.updateSamlEntity': {
		input: generatedSchemas.doc_b27a9742c359Input,
		output: generatedSchemas.doc_b27a9742c359Output,
	},
	'certcentralApi.acmeExternalAccountBinding': {
		input: generatedSchemas.doc_4e257ad17e08Input,
		output: generatedSchemas.doc_4e257ad17e08Output,
	},
	'certcentralApi.createKey': {
		input: generatedSchemas.doc_c578cc27f1aaInput,
		output: generatedSchemas.doc_c578cc27f1aaOutput,
	},
	'certcentralApi.editKey': {
		input: generatedSchemas.doc_8f9edc9117c4Input,
		output: generatedSchemas.doc_8f9edc9117c4Output,
	},
	'certcentralApi.getKeyInfo': {
		input: generatedSchemas.doc_81b584e30788Input,
		output: generatedSchemas.doc_81b584e30788Output,
	},
	'certcentralApi.listApiAccessRoles': {
		input: generatedSchemas.doc_560d6f2d1221Input,
		output: generatedSchemas.doc_560d6f2d1221Output,
	},
	'certcentralApi.listKeys': {
		input: generatedSchemas.doc_070d6e77a00aInput,
		output: generatedSchemas.doc_070d6e77a00aOutput,
	},
	'certcentralApi.updateAcmeRestrictions': {
		input: generatedSchemas.doc_5912774bad5eInput,
		output: generatedSchemas.doc_5912774bad5eOutput,
	},
	'certcentralApi.updateKeyStatus': {
		input: generatedSchemas.doc_54f409a9171cInput,
		output: generatedSchemas.doc_54f409a9171cOutput,
	},
	'certcentralApi.checkPermission': {
		input: generatedSchemas.doc_476f9fe16b9bInput,
		output: generatedSchemas.doc_476f9fe16b9bOutput,
	},
	'certcentralApi.containerPermissions': {
		input: generatedSchemas.doc_d00cf8a74f8aInput,
		output: generatedSchemas.doc_d00cf8a74f8aOutput,
	},
	'certcentralApi.listPermissions': {
		input: generatedSchemas.doc_73f2ef62b52dInput,
		output: generatedSchemas.doc_73f2ef62b52dOutput,
	},
	'certcentralApi.addNote': {
		input: generatedSchemas.doc_b4febad46718Input,
		output: generatedSchemas.doc_b4febad46718Output,
	},
	'certcentralApi.archiveCertificate': {
		input: generatedSchemas.doc_6bca5b5ddaa2Input,
		output: generatedSchemas.doc_6bca5b5ddaa2Output,
	},
	'certcentralApi.certificateChain': {
		input: generatedSchemas.doc_c4cb46253fc8Input,
		output: generatedSchemas.doc_c4cb46253fc8Output,
	},
	'certcentralApi.downloadCertificateByFormatOrderId': {
		input: generatedSchemas.doc_12ee3803b0eaInput,
		output: generatedSchemas.doc_12ee3803b0eaOutput,
	},
	'certcentralApi.downloadCertificateByFormat': {
		input: generatedSchemas.doc_3eac5982f660Input,
		output: generatedSchemas.doc_3eac5982f660Output,
	},
	'certcentralApi.downloadCertificateOrderId': {
		input: generatedSchemas.doc_98dfb200c831Input,
		output: generatedSchemas.doc_98dfb200c831Output,
	},
	'certcentralApi.emailCertificate': {
		input: generatedSchemas.doc_15d58a0242efInput,
		output: generatedSchemas.doc_15d58a0242efOutput,
	},
	'certcentralApi.listCertificateNotes': {
		input: generatedSchemas.doc_52f8e42773fbInput,
		output: generatedSchemas.doc_52f8e42773fbOutput,
	},
	'certcentralApi.restoreCertificate': {
		input: generatedSchemas.doc_86f85ef51d05Input,
		output: generatedSchemas.doc_86f85ef51d05Output,
	},
	'certcentralApi.revokeCertificate': {
		input: generatedSchemas.doc_20c8dbbadda5Input,
		output: generatedSchemas.doc_20c8dbbadda5Output,
	},
	'certcentralApi.activateContainer': {
		input: generatedSchemas.doc_a3736174ce8eInput,
		output: generatedSchemas.doc_a3736174ce8eOutput,
	},
	'certcentralApi.containerInfo': {
		input: generatedSchemas.doc_82d35daae87fInput,
		output: generatedSchemas.doc_82d35daae87fOutput,
	},
	'certcentralApi.createContainer': {
		input: generatedSchemas.doc_f7b30cc3e4dfInput,
		output: generatedSchemas.doc_f7b30cc3e4dfOutput,
	},
	'certcentralApi.deactivateContainer': {
		input: generatedSchemas.doc_3f2ca5c0125dInput,
		output: generatedSchemas.doc_3f2ca5c0125dOutput,
	},
	'certcentralApi.editContainer': {
		input: generatedSchemas.doc_d0c1793b18e1Input,
		output: generatedSchemas.doc_d0c1793b18e1Output,
	},
	'certcentralApi.listChildContainers': {
		input: generatedSchemas.doc_b3e6aee2fc46Input,
		output: generatedSchemas.doc_b3e6aee2fc46Output,
	},
	'certcentralApi.listContainerOrganizations': {
		input: generatedSchemas.doc_aeef15756129Input,
		output: generatedSchemas.doc_aeef15756129Output,
	},
	'certcentralApi.listContainerRoles': {
		input: generatedSchemas.doc_12b9a2ef2c46Input,
		output: generatedSchemas.doc_12b9a2ef2c46Output,
	},
	'certcentralApi.listContainers': {
		input: generatedSchemas.doc_0ef8984e5c8bInput,
		output: generatedSchemas.doc_0ef8984e5c8bOutput,
	},
	'certcentralApi.listTemplates': {
		input: generatedSchemas.doc_1041d732a432Input,
		output: generatedSchemas.doc_1041d732a432Output,
	},
	'certcentralApi.parentContainerInfo': {
		input: generatedSchemas.doc_11b9f13443f4Input,
		output: generatedSchemas.doc_11b9f13443f4Output,
	},
	'certcentralApi.productLimits': {
		input: generatedSchemas.doc_9881d9a4588eInput,
		output: generatedSchemas.doc_9881d9a4588eOutput,
	},
	'certcentralApi.templateInfo': {
		input: generatedSchemas.doc_8eb4885d89b3Input,
		output: generatedSchemas.doc_8eb4885d89b3Output,
	},
	'certcentralApi.updateAllowedDomains': {
		input: generatedSchemas.doc_979cc97944f4Input,
		output: generatedSchemas.doc_979cc97944f4Output,
	},
	'certcentralApi.updateOrganizationAssignments': {
		input: generatedSchemas.doc_af5d117edb7aInput,
		output: generatedSchemas.doc_af5d117edb7aOutput,
	},
	'certcentralApi.updateRenewalNotificationRecipients': {
		input: generatedSchemas.doc_0bdd00e8d1ceInput,
		output: generatedSchemas.doc_0bdd00e8d1ceOutput,
	},
	'certcentralApi.updateUserAssignments': {
		input: generatedSchemas.doc_0a55eec794e9Input,
		output: generatedSchemas.doc_0a55eec794e9Output,
	},
	'certcentralApi.allowlistIssuingCertificateAuthority': {
		input: generatedSchemas.doc_14e4b1bd5a34Input,
		output: generatedSchemas.doc_14e4b1bd5a34Output,
	},
	'certcentralApi.disableCtLogMonitoring': {
		input: generatedSchemas.doc_30ad424e79e1Input,
		output: generatedSchemas.doc_30ad424e79e1Output,
	},
	'certcentralApi.downloadCertificateSerialNumber': {
		input: generatedSchemas.doc_c0e294c9d204Input,
		output: generatedSchemas.doc_c0e294c9d204Output,
	},
	'certcentralApi.enableCtLogMonitoring': {
		input: generatedSchemas.doc_9e9475186e42Input,
		output: generatedSchemas.doc_9e9475186e42Output,
	},
	'certcentralApi.getAllowlistedIssuingCaBrandDetails': {
		input: generatedSchemas.doc_5d231daccbc1Input,
		output: generatedSchemas.doc_5d231daccbc1Output,
	},
	'certcentralApi.getCtLogDetailsForACertificate': {
		input: generatedSchemas.doc_f1dbbc96926eInput,
		output: generatedSchemas.doc_f1dbbc96926eOutput,
	},
	'certcentralApi.getCtLogMonitoringStatus': {
		input: generatedSchemas.doc_0ca93d0cc9c4Input,
		output: generatedSchemas.doc_0ca93d0cc9c4Output,
	},
	'certcentralApi.getCtLogsOrderId': {
		input: generatedSchemas.doc_48620dc4c72aInput,
		output: generatedSchemas.doc_48620dc4c72aOutput,
	},
	'certcentralApi.activateDomainLocking': {
		input: generatedSchemas.doc_262c27590310Input,
		output: generatedSchemas.doc_262c27590310Output,
	},
	'certcentralApi.activateDomain': {
		input: generatedSchemas.doc_8aae6a51f92aInput,
		output: generatedSchemas.doc_8aae6a51f92aOutput,
	},
	'certcentralApi.addDomain': {
		input: generatedSchemas.doc_1aac58120f09Input,
		output: generatedSchemas.doc_1aac58120f09Output,
	},
	'certcentralApi.changeDcvMethod': {
		input: generatedSchemas.doc_f226832d3875Input,
		output: generatedSchemas.doc_f226832d3875Output,
	},
	'certcentralApi.checkCaaDomainLock': {
		input: generatedSchemas.doc_5732d67dff2dInput,
		output: generatedSchemas.doc_5732d67dff2dOutput,
	},
	'certcentralApi.deactivateDomainLocking': {
		input: generatedSchemas.doc_8c2ebcb999dbInput,
		output: generatedSchemas.doc_8c2ebcb999dbOutput,
	},
	'certcentralApi.deactivateDomain': {
		input: generatedSchemas.doc_8174f07e86d8Input,
		output: generatedSchemas.doc_8174f07e86d8Output,
	},
	'certcentralApi.deleteDomain': {
		input: generatedSchemas.doc_68c760dcbd07Input,
		output: generatedSchemas.doc_68c760dcbd07Output,
	},
	'certcentralApi.domainEmails': {
		input: generatedSchemas.doc_11c825cbc8c6Input,
		output: generatedSchemas.doc_11c825cbc8c6Output,
	},
	'certcentralApi.domainInfo': {
		input: generatedSchemas.doc_7553d189737cInput,
		output: generatedSchemas.doc_7553d189737cOutput,
	},
	'certcentralApi.expiringDomainsCount': {
		input: generatedSchemas.doc_e4cc91b4b088Input,
		output: generatedSchemas.doc_e4cc91b4b088Output,
	},
	'certcentralApi.listDcvMethods': {
		input: generatedSchemas.doc_4c129eef60aeInput,
		output: generatedSchemas.doc_4c129eef60aeOutput,
	},
	'certcentralApi.listDomains': {
		input: generatedSchemas.doc_c11852b77be3Input,
		output: generatedSchemas.doc_c11852b77be3Output,
	},
	'certcentralApi.ovEvSslCheckDcv': {
		input: generatedSchemas.doc_c7aed98b2e77Input,
		output: generatedSchemas.doc_c7aed98b2e77Output,
	},
	'certcentralApi.ovEvSslGenerateDcvToken': {
		input: generatedSchemas.doc_4545251fa69dInput,
		output: generatedSchemas.doc_4545251fa69dOutput,
	},
	'certcentralApi.resendDcvEmail': {
		input: generatedSchemas.doc_b1ecc284456cInput,
		output: generatedSchemas.doc_b1ecc284456cOutput,
	},
	'certcentralApi.submitForValidation': {
		input: generatedSchemas.doc_28388b3fed6aInput,
		output: generatedSchemas.doc_28388b3fed6aOutput,
	},
	'certcentralApi.validationDetails': {
		input: generatedSchemas.doc_ff77d342fe74Input,
		output: generatedSchemas.doc_ff77d342fe74Output,
	},
	'certcentralApi.validationTypes': {
		input: generatedSchemas.doc_879c2f7de929Input,
		output: generatedSchemas.doc_879c2f7de929Output,
	},
	'certcentralApi.listBalanceHistory': {
		input: generatedSchemas.doc_1177e54e3da6Input,
		output: generatedSchemas.doc_1177e54e3da6Output,
	},
	'certcentralApi.listPurchaseHistory': {
		input: generatedSchemas.doc_f7d972dc06d1Input,
		output: generatedSchemas.doc_f7d972dc06d1Output,
	},
	'certcentralApi.listReplacementBenefits': {
		input: generatedSchemas.doc_019b3c552368Input,
		output: generatedSchemas.doc_019b3c552368Output,
	},
	'certcentralApi.priceEstimate': {
		input: generatedSchemas.doc_1d5152684c65Input,
		output: generatedSchemas.doc_1d5152684c65Output,
	},
	'certcentralApi.receiptInfo': {
		input: generatedSchemas.doc_572756329e70Input,
		output: generatedSchemas.doc_572756329e70Output,
	},
	'certcentralApi.transferFunds': {
		input: generatedSchemas.doc_0298380d0e17Input,
		output: generatedSchemas.doc_0298380d0e17Output,
	},
	'certcentralApi.viewBalance': {
		input: generatedSchemas.doc_835a391f5830Input,
		output: generatedSchemas.doc_835a391f5830Output,
	},
	'certcentralApi.voucherPriceEstimate': {
		input: generatedSchemas.doc_5390d99534c7Input,
		output: generatedSchemas.doc_5390d99534c7Output,
	},
	'certcentralApi.addIpRestriction': {
		input: generatedSchemas.doc_021260e79a53Input,
		output: generatedSchemas.doc_021260e79a53Output,
	},
	'certcentralApi.deleteIpRestriction': {
		input: generatedSchemas.doc_72a39e90b633Input,
		output: generatedSchemas.doc_72a39e90b633Output,
	},
	'certcentralApi.listIpRestrictions': {
		input: generatedSchemas.doc_993889ac64ddInput,
		output: generatedSchemas.doc_993889ac64ddOutput,
	},
	'certcentralApi.digiCertOrderId': {
		input: generatedSchemas.doc_195aa516f3faInput,
		output: generatedSchemas.doc_195aa516f3faOutput,
	},
	'certcentralApi.addNote_504f5354': {
		input: generatedSchemas.doc_840c367cc8e6Input,
		output: generatedSchemas.doc_840c367cc8e6Output,
	},
	'certcentralApi.additionalEmails': {
		input: generatedSchemas.doc_b9fef9a10667Input,
		output: generatedSchemas.doc_b9fef9a10667Output,
	},
	'certcentralApi.changeCtStatus': {
		input: generatedSchemas.doc_76411ce6ddb4Input,
		output: generatedSchemas.doc_76411ce6ddb4Output,
	},
	'certcentralApi.changeOrderContainer': {
		input: generatedSchemas.doc_0414f6f07b3fInput,
		output: generatedSchemas.doc_0414f6f07b3fOutput,
	},
	'certcentralApi.deleteCustomField_44454c45': {
		input: generatedSchemas.doc_5d952ea36887Input,
		output: generatedSchemas.doc_5d952ea36887Output,
	},
	'certcentralApi.deleteNoteDeleteNote': {
		input: generatedSchemas.doc_a5e2b942c7caInput,
		output: generatedSchemas.doc_a5e2b942c7caOutput,
	},
	'certcentralApi.deleteOrderDeleteOrder': {
		input: generatedSchemas.doc_55ad712f0558Input,
		output: generatedSchemas.doc_55ad712f0558Output,
	},
	'certcentralApi.deleteRenewalMessage': {
		input: generatedSchemas.doc_35d402490c05Input,
		output: generatedSchemas.doc_35d402490c05Output,
	},
	'certcentralApi.duplicateCertificate': {
		input: generatedSchemas.doc_7e426cc9eb65Input,
		output: generatedSchemas.doc_7e426cc9eb65Output,
	},
	'certcentralApi.dvSslChangeDcvMethod': {
		input: generatedSchemas.doc_45222df80d71Input,
		output: generatedSchemas.doc_45222df80d71Output,
	},
	'certcentralApi.dvSslCheckDcv': {
		input: generatedSchemas.doc_e81cc18a9102Input,
		output: generatedSchemas.doc_e81cc18a9102Output,
	},
	'certcentralApi.generateDcvToken': {
		input: generatedSchemas.doc_e9a79ceccf84Input,
		output: generatedSchemas.doc_e9a79ceccf84Output,
	},
	'certcentralApi.dvSslResendEmails': {
		input: generatedSchemas.doc_9f9ccccf949cInput,
		output: generatedSchemas.doc_9f9ccccf949cOutput,
	},
	'certcentralApi.editCustomFieldValue': {
		input: generatedSchemas.doc_c428dd43444eInput,
		output: generatedSchemas.doc_c428dd43444eOutput,
	},
	'certcentralApi.editDomainsOnAPendingOrderOrReissue': {
		input: generatedSchemas.doc_b245584eda79Input,
		output: generatedSchemas.doc_b245584eda79Output,
	},
	'certcentralApi.editGuestAccessOrder': {
		input: generatedSchemas.doc_f4797f262e2eInput,
		output: generatedSchemas.doc_f4797f262e2eOutput,
	},
	'certcentralApi.editNote': {
		input: generatedSchemas.doc_1a5d357e8d7cInput,
		output: generatedSchemas.doc_1a5d357e8d7cOutput,
	},
	'certcentralApi.emailSiteSeal': {
		input: generatedSchemas.doc_cdce3b9fe81aInput,
		output: generatedSchemas.doc_cdce3b9fe81aOutput,
	},
	'certcentralApi.emailValidationStatus': {
		input: generatedSchemas.doc_29565de72e14Input,
		output: generatedSchemas.doc_29565de72e14Output,
	},
	'certcentralApi.getOrdersByAlternativeOrderId': {
		input: generatedSchemas.doc_c19139eee34bInput,
		output: generatedSchemas.doc_c19139eee34bOutput,
	},
	'certcentralApi.getVmcOrCmcLogo': {
		input: generatedSchemas.doc_53d08315b668Input,
		output: generatedSchemas.doc_53d08315b668Output,
	},
	'certcentralApi.listDuplicates': {
		input: generatedSchemas.doc_a03377134888Input,
		output: generatedSchemas.doc_a03377134888Output,
	},
	'certcentralApi.listOrderNotes': {
		input: generatedSchemas.doc_1d9e28c15f55Input,
		output: generatedSchemas.doc_1d9e28c15f55Output,
	},
	'certcentralApi.listReissues': {
		input: generatedSchemas.doc_ad437431bcfbInput,
		output: generatedSchemas.doc_ad437431bcfbOutput,
	},
	'certcentralApi.orderAatlNaturalPersonCertificate': {
		input: generatedSchemas.doc_d96c027674bdInput,
		output: generatedSchemas.doc_d96c027674bdOutput,
	},
	'certcentralApi.orderAatlNaturalPersonInOrganisationCertificate': {
		input: generatedSchemas.doc_eb56e3af90eaInput,
		output: generatedSchemas.doc_eb56e3af90eaOutput,
	},
	'certcentralApi.orderAatlOrganizationEsealCertificate': {
		input: generatedSchemas.doc_a3e235afb912Input,
		output: generatedSchemas.doc_a3e235afb912Output,
	},
	'certcentralApi.orderBasicEvOrderBasicEv': {
		input: generatedSchemas.doc_d3677b341798Input,
		output: generatedSchemas.doc_d3677b341798Output,
	},
	'certcentralApi.orderMultiYearPlanOrderMultiYearPlan': {
		input: generatedSchemas.doc_d9a1c6ca3a31Input,
		output: generatedSchemas.doc_d9a1c6ca3a31Output,
	},
	'certcentralApi.orderBasicOv': {
		input: generatedSchemas.doc_a941335e148eInput,
		output: generatedSchemas.doc_a941335e148eOutput,
	},
	'certcentralApi.orderClientCertificate': {
		input: generatedSchemas.doc_09dc6b5907cdInput,
		output: generatedSchemas.doc_09dc6b5907cdOutput,
	},
	'certcentralApi.orderCodeSigningCertificate': {
		input: generatedSchemas.doc_0f8799b1925fInput,
		output: generatedSchemas.doc_0f8799b1925fOutput,
	},
	'certcentralApi.orderCommonMarkCertificateCmc': {
		input: generatedSchemas.doc_89fbabad7e9cInput,
		output: generatedSchemas.doc_89fbabad7e9cOutput,
	},
	'certcentralApi.orderDocumentSigningCertificate': {
		input: generatedSchemas.doc_1493e154c3f6Input,
		output: generatedSchemas.doc_1493e154c3f6Output,
	},
	'certcentralApi.orderDocumentSigningForEmployee': {
		input: generatedSchemas.doc_c3967d800a90Input,
		output: generatedSchemas.doc_c3967d800a90Output,
	},
	'certcentralApi.orderDocumentSigningForIndividual': {
		input: generatedSchemas.doc_56d7bc836984Input,
		output: generatedSchemas.doc_56d7bc836984Output,
	},
	'certcentralApi.orderDocumentSigningForOrganization': {
		input: generatedSchemas.doc_2dac0a15a7fdInput,
		output: generatedSchemas.doc_2dac0a15a7fdOutput,
	},
	'certcentralApi.orderDvSsl': {
		input: generatedSchemas.doc_c0609891ae33Input,
		output: generatedSchemas.doc_c0609891ae33Output,
	},
	'certcentralApi.orderEuQualifiedESealPsd2': {
		input: generatedSchemas.doc_0b4c79c821dcInput,
		output: generatedSchemas.doc_0b4c79c821dcOutput,
	},
	'certcentralApi.orderEuQualifiedESeal': {
		input: generatedSchemas.doc_0a3891051c4aInput,
		output: generatedSchemas.doc_0a3891051c4aOutput,
	},
	'certcentralApi.orderEuQualifiedPersonalOrganisation': {
		input: generatedSchemas.doc_e5dcf600c0d7Input,
		output: generatedSchemas.doc_e5dcf600c0d7Output,
	},
	'certcentralApi.orderEuQualifiedPersonal': {
		input: generatedSchemas.doc_c2ec15235334Input,
		output: generatedSchemas.doc_c2ec15235334Output,
	},
	'certcentralApi.orderEuQualifiedWebsiteAuthenticationCertificate': {
		input: generatedSchemas.doc_191957a930e4Input,
		output: generatedSchemas.doc_191957a930e4Output,
	},
	'certcentralApi.orderEuQualifiedWebsiteAuthenticationPsd2Certificate': {
		input: generatedSchemas.doc_f1de1effc183Input,
		output: generatedSchemas.doc_f1de1effc183Output,
	},
	'certcentralApi.orderGeoTrustDvSsl': {
		input: generatedSchemas.doc_159cdf63adcaInput,
		output: generatedSchemas.doc_159cdf63adcaOutput,
	},
	'certcentralApi.orderInfo': {
		input: generatedSchemas.doc_95010aa1d993Input,
		output: generatedSchemas.doc_95010aa1d993Output,
	},
	'certcentralApi.orderOvEvSslOrderOvEvSsl': {
		input: generatedSchemas.doc_d47d505089b2Input,
		output: generatedSchemas.doc_d47d505089b2Output,
	},
	'certcentralApi.orderSecureSiteSslOrderSecureSiteSsl': {
		input: generatedSchemas.doc_3aa38830d853Input,
		output: generatedSchemas.doc_3aa38830d853Output,
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionCitizen': {
		input: generatedSchemas.doc_1d36c4da1722Input,
		output: generatedSchemas.doc_1d36c4da1722Output,
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationPerson': {
		input: generatedSchemas.doc_ed7bb79325cdInput,
		output: generatedSchemas.doc_ed7bb79325cdOutput,
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationServices': {
		input: generatedSchemas.doc_11c324bdd693Input,
		output: generatedSchemas.doc_11c324bdd693Output,
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionPrivatePerson': {
		input: generatedSchemas.doc_c78a672ff18cInput,
		output: generatedSchemas.doc_c78a672ff18cOutput,
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionPrivateProfessional': {
		input: generatedSchemas.doc_dc85a3280001Input,
		output: generatedSchemas.doc_dc85a3280001Output,
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionProfessional': {
		input: generatedSchemas.doc_93ed34af7e68Input,
		output: generatedSchemas.doc_93ed34af7e68Output,
	},
	'certcentralApi.orderPkioCitizenSigning': {
		input: generatedSchemas.doc_dcecf46c1fbbInput,
		output: generatedSchemas.doc_dcecf46c1fbbOutput,
	},
	'certcentralApi.orderPkioPersonalOrganisationSigning': {
		input: generatedSchemas.doc_74b189e5ad53Input,
		output: generatedSchemas.doc_74b189e5ad53Output,
	},
	'certcentralApi.orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning': {
		input: generatedSchemas.doc_ec7f110447fbInput,
		output: generatedSchemas.doc_ec7f110447fbOutput,
	},
	'certcentralApi.orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning':
		{
			input: generatedSchemas.doc_2a78e2010ac6Input,
			output: generatedSchemas.doc_2a78e2010ac6Output,
		},
	'certcentralApi.orderPkioPrivateServicesServer': {
		input: generatedSchemas.doc_5e63a22b01a3Input,
		output: generatedSchemas.doc_5e63a22b01a3Output,
	},
	'certcentralApi.orderPkioProfessionalSigning': {
		input: generatedSchemas.doc_b302c342b6b8Input,
		output: generatedSchemas.doc_b302c342b6b8Output,
	},
	'certcentralApi.orderPkioQualifiedESeal': {
		input: generatedSchemas.doc_b9ea55c57e9fInput,
		output: generatedSchemas.doc_b9ea55c57e9fOutput,
	},
	'certcentralApi.orderPrivateSsl': {
		input: generatedSchemas.doc_cdbafa8cb54fInput,
		output: generatedSchemas.doc_cdbafa8cb54fOutput,
	},
	'certcentralApi.orderSecureEmailCertificate': {
		input: generatedSchemas.doc_398fcd149bccInput,
		output: generatedSchemas.doc_398fcd149bccOutput,
	},
	'certcentralApi.orderSecureSiteEv': {
		input: generatedSchemas.doc_9f6a27310b14Input,
		output: generatedSchemas.doc_9f6a27310b14Output,
	},
	'certcentralApi.orderSecureSiteOv': {
		input: generatedSchemas.doc_7d2b11ef40caInput,
		output: generatedSchemas.doc_7d2b11ef40caOutput,
	},
	'certcentralApi.orderSecureSiteProEvSsl': {
		input: generatedSchemas.doc_6be9baf8c041Input,
		output: generatedSchemas.doc_6be9baf8c041Output,
	},
	'certcentralApi.orderSecureSiteProSsl': {
		input: generatedSchemas.doc_f7a5b4e62ac8Input,
		output: generatedSchemas.doc_f7a5b4e62ac8Output,
	},
	'certcentralApi.orderSslTypeHint': {
		input: generatedSchemas.doc_9e11e8506b9aInput,
		output: generatedSchemas.doc_9e11e8506b9aOutput,
	},
	'certcentralApi.orderSwissClientAuthenticationCertificate': {
		input: generatedSchemas.doc_cd38e0a41be1Input,
		output: generatedSchemas.doc_cd38e0a41be1Output,
	},
	'certcentralApi.orderSwissQualifiedCertificateForIndividualInOrganisation': {
		input: generatedSchemas.doc_2eb02d4b4bceInput,
		output: generatedSchemas.doc_2eb02d4b4bceOutput,
	},
	'certcentralApi.orderSwissQualifiedCertificateForIndividual': {
		input: generatedSchemas.doc_b1982a6f1fd9Input,
		output: generatedSchemas.doc_b1982a6f1fd9Output,
	},
	'certcentralApi.orderSwissRegulatedCertificateForIndividualInOrganisation': {
		input: generatedSchemas.doc_df8381884a60Input,
		output: generatedSchemas.doc_df8381884a60Output,
	},
	'certcentralApi.orderSwissRegulatedCertificateForIndividual': {
		input: generatedSchemas.doc_ea0edb75c1d4Input,
		output: generatedSchemas.doc_ea0edb75c1d4Output,
	},
	'certcentralApi.orderSwissRegulatedCertificateForOrganisation': {
		input: generatedSchemas.doc_2f1de3705731Input,
		output: generatedSchemas.doc_2f1de3705731Output,
	},
	'certcentralApi.orderVerifiedMarkCertificateVmc': {
		input: generatedSchemas.doc_a9d557b1a987Input,
		output: generatedSchemas.doc_a9d557b1a987Output,
	},
	'certcentralApi.orderX9PkiForTls': {
		input: generatedSchemas.doc_5870683c0fddInput,
		output: generatedSchemas.doc_5870683c0fddOutput,
	},
	'certcentralApi.purchaseKeyLockerSignatures': {
		input: generatedSchemas.doc_53a320a8c6adInput,
		output: generatedSchemas.doc_53a320a8c6adOutput,
	},
	'certcentralApi.reissueCertificate': {
		input: generatedSchemas.doc_a5e7a4804418Input,
		output: generatedSchemas.doc_a5e7a4804418Output,
	},
	'certcentralApi.resendOrderApprovalEmail': {
		input: generatedSchemas.doc_c974e0814d0cInput,
		output: generatedSchemas.doc_c974e0814d0cOutput,
	},
	'certcentralApi.revokeOrderCertificates': {
		input: generatedSchemas.doc_ece6a500fcc4Input,
		output: generatedSchemas.doc_ece6a500fcc4Output,
	},
	'certcentralApi.siteSealSettings': {
		input: generatedSchemas.doc_fb4079d19b2cInput,
		output: generatedSchemas.doc_fb4079d19b2cOutput,
	},
	'certcentralApi.statusChangeList': {
		input: generatedSchemas.doc_024f62ae3007Input,
		output: generatedSchemas.doc_024f62ae3007Output,
	},
	'certcentralApi.updateAutoReissueSettings': {
		input: generatedSchemas.doc_d747245e5a92Input,
		output: generatedSchemas.doc_d747245e5a92Output,
	},
	'certcentralApi.updateCsr': {
		input: generatedSchemas.doc_68f7c024afdcInput,
		output: generatedSchemas.doc_68f7c024afdcOutput,
	},
	'certcentralApi.updateOrderContacts': {
		input: generatedSchemas.doc_371c627c78f8Input,
		output: generatedSchemas.doc_371c627c78f8Output,
	},
	'certcentralApi.updateOrderStatus': {
		input: generatedSchemas.doc_d3087471b789Input,
		output: generatedSchemas.doc_d3087471b789Output,
	},
	'certcentralApi.updateRenewalMessage': {
		input: generatedSchemas.doc_d7be8ba6987cInput,
		output: generatedSchemas.doc_d7be8ba6987cOutput,
	},
	'certcentralApi.updateRenewalNotificationSettings': {
		input: generatedSchemas.doc_0bc073434146Input,
		output: generatedSchemas.doc_0bc073434146Output,
	},
	'certcentralApi.updateSiteSealSettings': {
		input: generatedSchemas.doc_c407e746e39fInput,
		output: generatedSchemas.doc_c407e746e39fOutput,
	},
	'certcentralApi.updateVmcOrCmcOrders': {
		input: generatedSchemas.doc_856d9dd6a089Input,
		output: generatedSchemas.doc_856d9dd6a089Output,
	},
	'certcentralApi.uploadSiteSealLogo': {
		input: generatedSchemas.doc_4c494339b8bcInput,
		output: generatedSchemas.doc_4c494339b8bcOutput,
	},
	'certcentralApi.uploadVmcOrCmcLogoEncoded': {
		input: generatedSchemas.doc_c458695a77c1Input,
		output: generatedSchemas.doc_c458695a77c1Output,
	},
	'certcentralApi.uploadVmcOrCmcLogoSvg': {
		input: generatedSchemas.doc_1cd57426d84fInput,
		output: generatedSchemas.doc_1cd57426d84fOutput,
	},
	'certcentralApi.orderValidationStatus': {
		input: generatedSchemas.doc_00c9ade1d573Input,
		output: generatedSchemas.doc_00c9ade1d573Output,
	},
	'certcentralApi.viewKeyLockerSignatures': {
		input: generatedSchemas.doc_51a82794cb6bInput,
		output: generatedSchemas.doc_51a82794cb6bOutput,
	},
	'certcentralApi.viewNote': {
		input: generatedSchemas.doc_7e904da76356Input,
		output: generatedSchemas.doc_7e904da76356Output,
	},
	'certcentralApi.activateOrganization': {
		input: generatedSchemas.doc_91ec86e31af6Input,
		output: generatedSchemas.doc_91ec86e31af6Output,
	},
	'certcentralApi.createOrganization': {
		input: generatedSchemas.doc_38b5a83402faInput,
		output: generatedSchemas.doc_38b5a83402faOutput,
	},
	'certcentralApi.deactivateOrganization': {
		input: generatedSchemas.doc_60d5e42efa4dInput,
		output: generatedSchemas.doc_60d5e42efa4dOutput,
	},
	'certcentralApi.deleteOrganization': {
		input: generatedSchemas.doc_c81496b5c977Input,
		output: generatedSchemas.doc_c81496b5c977Output,
	},
	'certcentralApi.listApprovers': {
		input: generatedSchemas.doc_b4370f044cc5Input,
		output: generatedSchemas.doc_b4370f044cc5Output,
	},
	'certcentralApi.organizationAndTechnicalContactInfo': {
		input: generatedSchemas.doc_11645edfc36dInput,
		output: generatedSchemas.doc_11645edfc36dOutput,
	},
	'certcentralApi.organizationInfo': {
		input: generatedSchemas.doc_50cc2f9183daInput,
		output: generatedSchemas.doc_50cc2f9183daOutput,
	},
	'certcentralApi.recentOrganizations': {
		input: generatedSchemas.doc_74e413c4970dInput,
		output: generatedSchemas.doc_74e413c4970dOutput,
	},
	'certcentralApi.submitForValidation_504f5354': {
		input: generatedSchemas.doc_a8d91a5423b6Input,
		output: generatedSchemas.doc_a8d91a5423b6Output,
	},
	'certcentralApi.updateOrganizationAndTechnicalContact': {
		input: generatedSchemas.doc_b2e717699b06Input,
		output: generatedSchemas.doc_b2e717699b06Output,
	},
	'certcentralApi.validationDetails_4745542f': {
		input: generatedSchemas.doc_0215c703c550Input,
		output: generatedSchemas.doc_0215c703c550Output,
	},
	'certcentralApi.validationTypes_4745542f': {
		input: generatedSchemas.doc_c52e159d5991Input,
		output: generatedSchemas.doc_c52e159d5991Output,
	},
	'certcentralApi.certificateFormatMap': {
		input: generatedSchemas.doc_666f59568c27Input,
		output: generatedSchemas.doc_666f59568c27Output,
	},
	'certcentralApi.pricingList': {
		input: generatedSchemas.doc_8465456a9693Input,
		output: generatedSchemas.doc_8465456a9693Output,
	},
	'certcentralApi.productInfo': {
		input: generatedSchemas.doc_f16f9dd049d1Input,
		output: generatedSchemas.doc_f16f9dd049d1Output,
	},
	'certcentralApi.productList': {
		input: generatedSchemas.doc_3dd2a16378a7Input,
		output: generatedSchemas.doc_3dd2a16378a7Output,
	},
	'certcentralApi.expiringOrdersAndCertificates': {
		input: generatedSchemas.doc_91596e1eec37Input,
		output: generatedSchemas.doc_91596e1eec37Output,
	},
	'certcentralApi.orderReport': {
		input: generatedSchemas.doc_e0f375953ec2Input,
		output: generatedSchemas.doc_e0f375953ec2Output,
	},
	'certcentralApi.requestSummary': {
		input: generatedSchemas.doc_8798826d45afInput,
		output: generatedSchemas.doc_8798826d45afOutput,
	},
	'certcentralApi.listRequests': {
		input: generatedSchemas.doc_6df583932616Input,
		output: generatedSchemas.doc_6df583932616Output,
	},
	'certcentralApi.requestInfo': {
		input: generatedSchemas.doc_44723439c252Input,
		output: generatedSchemas.doc_44723439c252Output,
	},
	'certcentralApi.updateCsrForAPendingReissueRequest': {
		input: generatedSchemas.doc_473a86610c11Input,
		output: generatedSchemas.doc_473a86610c11Output,
	},
	'certcentralApi.updateRequestStatus': {
		input: generatedSchemas.doc_baa0fe4977e9Input,
		output: generatedSchemas.doc_baa0fe4977e9Output,
	},
	'certcentralApi.addOrRemoveFunds': {
		input: generatedSchemas.doc_7396b08a6f91Input,
		output: generatedSchemas.doc_7396b08a6f91Output,
	},
	'certcentralApi.balanceDetails': {
		input: generatedSchemas.doc_512fbcb31521Input,
		output: generatedSchemas.doc_512fbcb31521Output,
	},
	'certcentralApi.cancelUnitOrder': {
		input: generatedSchemas.doc_6aea189047bbInput,
		output: generatedSchemas.doc_6aea189047bbOutput,
	},
	'certcentralApi.createSubaccount': {
		input: generatedSchemas.doc_e003784932c5Input,
		output: generatedSchemas.doc_e003784932c5Output,
	},
	'certcentralApi.createUnitOrder': {
		input: generatedSchemas.doc_816b2c098a33Input,
		output: generatedSchemas.doc_816b2c098a33Output,
	},
	'certcentralApi.editSubaccount': {
		input: generatedSchemas.doc_503cf4e16d2bInput,
		output: generatedSchemas.doc_503cf4e16d2bOutput,
	},
	'certcentralApi.listSubaccountDomains': {
		input: generatedSchemas.doc_74f49ae8a8a6Input,
		output: generatedSchemas.doc_74f49ae8a8a6Output,
	},
	'certcentralApi.listSubaccountOrders': {
		input: generatedSchemas.doc_ab644043c397Input,
		output: generatedSchemas.doc_ab644043c397Output,
	},
	'certcentralApi.listSubaccountOrganizations': {
		input: generatedSchemas.doc_d5803b6e7447Input,
		output: generatedSchemas.doc_d5803b6e7447Output,
	},
	'certcentralApi.listSubaccountProductLimits': {
		input: generatedSchemas.doc_e1dc075902d1Input,
		output: generatedSchemas.doc_e1dc075902d1Output,
	},
	'certcentralApi.listSubaccountProducts': {
		input: generatedSchemas.doc_6d243866e576Input,
		output: generatedSchemas.doc_6d243866e576Output,
	},
	'certcentralApi.listSubaccounts': {
		input: generatedSchemas.doc_56a9f95675c0Input,
		output: generatedSchemas.doc_56a9f95675c0Output,
	},
	'certcentralApi.listUnitOrders': {
		input: generatedSchemas.doc_2e94b48c0b5aInput,
		output: generatedSchemas.doc_2e94b48c0b5aOutput,
	},
	'certcentralApi.setSubaccountProducts': {
		input: generatedSchemas.doc_22d7ace97d71Input,
		output: generatedSchemas.doc_22d7ace97d71Output,
	},
	'certcentralApi.subaccountInfo': {
		input: generatedSchemas.doc_704eaf682fa9Input,
		output: generatedSchemas.doc_704eaf682fa9Output,
	},
	'certcentralApi.subaccountOrderInfo': {
		input: generatedSchemas.doc_6b9b6089bd0cInput,
		output: generatedSchemas.doc_6b9b6089bd0cOutput,
	},
	'certcentralApi.subaccountReport': {
		input: generatedSchemas.doc_08798f327d62Input,
		output: generatedSchemas.doc_08798f327d62Output,
	},
	'certcentralApi.unitOrderDetails': {
		input: generatedSchemas.doc_eb9bb3268567Input,
		output: generatedSchemas.doc_eb9bb3268567Output,
	},
	'certcentralApi.addServiceUserAddServiceUser': {
		input: generatedSchemas.doc_d1001d003fbfInput,
		output: generatedSchemas.doc_d1001d003fbfOutput,
	},
	'certcentralApi.addUserAddUser': {
		input: generatedSchemas.doc_a0f2712ff23dInput,
		output: generatedSchemas.doc_a0f2712ff23dOutput,
	},
	'certcentralApi.approveUserInvitation': {
		input: generatedSchemas.doc_dc9fc9718da9Input,
		output: generatedSchemas.doc_dc9fc9718da9Output,
	},
	'certcentralApi.changeUserRole': {
		input: generatedSchemas.doc_04640f5ca9dbInput,
		output: generatedSchemas.doc_04640f5ca9dbOutput,
	},
	'certcentralApi.createVerifiedContactDelegation': {
		input: generatedSchemas.doc_6dcc4cfc0332Input,
		output: generatedSchemas.doc_6dcc4cfc0332Output,
	},
	'certcentralApi.deleteUser': {
		input: generatedSchemas.doc_4f3aa3dcbddfInput,
		output: generatedSchemas.doc_4f3aa3dcbddfOutput,
	},
	'certcentralApi.deleteVerifiedContactDelegation': {
		input: generatedSchemas.doc_acb283c67d28Input,
		output: generatedSchemas.doc_acb283c67d28Output,
	},
	'certcentralApi.editServiceUserEditServiceUser': {
		input: generatedSchemas.doc_c2cad94af625Input,
		output: generatedSchemas.doc_c2cad94af625Output,
	},
	'certcentralApi.editUserEditUser': {
		input: generatedSchemas.doc_99cd5c10b76eInput,
		output: generatedSchemas.doc_99cd5c10b76eOutput,
	},
	'certcentralApi.listServiceUsers': {
		input: generatedSchemas.doc_05d5cbb0f106Input,
		output: generatedSchemas.doc_05d5cbb0f106Output,
	},
	'certcentralApi.listUserInvitations': {
		input: generatedSchemas.doc_77496855f701Input,
		output: generatedSchemas.doc_77496855f701Output,
	},
	'certcentralApi.listVerifiedContactDelegations': {
		input: generatedSchemas.doc_14c9ed9ecbeaInput,
		output: generatedSchemas.doc_14c9ed9ecbeaOutput,
	},
	'certcentralApi.listVerifiedContactsThatCanDelegate': {
		input: generatedSchemas.doc_acb30b6fe47cInput,
		output: generatedSchemas.doc_acb30b6fe47cOutput,
	},
	'certcentralApi.resendCreateUserEmail': {
		input: generatedSchemas.doc_13f84ef14d51Input,
		output: generatedSchemas.doc_13f84ef14d51Output,
	},
	'certcentralApi.resendVerifiedContactDelegationEmail': {
		input: generatedSchemas.doc_7c7b9e214afcInput,
		output: generatedSchemas.doc_7c7b9e214afcOutput,
	},
	'certcentralApi.updateContainerAssignments': {
		input: generatedSchemas.doc_9d28384fd2c0Input,
		output: generatedSchemas.doc_9d28384fd2c0Output,
	},
	'certcentralApi.userInfo': {
		input: generatedSchemas.doc_eab6767a5cc2Input,
		output: generatedSchemas.doc_eab6767a5cc2Output,
	},
	'certcentralApi.usernameAvailability': {
		input: generatedSchemas.doc_fe8391ee5a60Input,
		output: generatedSchemas.doc_fe8391ee5a60Output,
	},
	'certcentralApi.validateVmcOrCmcLogoFormatEncoded': {
		input: generatedSchemas.doc_90cef15abecdInput,
		output: generatedSchemas.doc_90cef15abecdOutput,
	},
	'certcentralApi.validateVmcOrCmcLogoFormatSvg': {
		input: generatedSchemas.doc_7ca7fbf49e63Input,
		output: generatedSchemas.doc_7ca7fbf49e63Output,
	},
	'certcentralApi.cancelVoucherCode': {
		input: generatedSchemas.doc_032cc159a9c0Input,
		output: generatedSchemas.doc_032cc159a9c0Output,
	},
	'certcentralApi.createVoucherOrder': {
		input: generatedSchemas.doc_6dffbee7df22Input,
		output: generatedSchemas.doc_6dffbee7df22Output,
	},
	'certcentralApi.getVoucherOrderDetails': {
		input: generatedSchemas.doc_22a02832d5c8Input,
		output: generatedSchemas.doc_22a02832d5c8Output,
	},
	'certcentralApi.listAllVoucherOrders': {
		input: generatedSchemas.doc_0253c8f31570Input,
		output: generatedSchemas.doc_0253c8f31570Output,
	},
	'certcentralApi.listCodesForVoucherOrder': {
		input: generatedSchemas.doc_24364ddc889bInput,
		output: generatedSchemas.doc_24364ddc889bOutput,
	},
	'certcentralApi.listUsedVoucherCodes': {
		input: generatedSchemas.doc_66501a2d927aInput,
		output: generatedSchemas.doc_66501a2d927aOutput,
	},
	'certcentralApi.disableScanning': {
		input: generatedSchemas.doc_386a3b63ebcdInput,
		output: generatedSchemas.doc_386a3b63ebcdOutput,
	},
	'certcentralApi.downloadResults': {
		input: generatedSchemas.doc_6e582dcd1d0bInput,
		output: generatedSchemas.doc_6e582dcd1d0bOutput,
	},
	'certcentralApi.enableScanning': {
		input: generatedSchemas.doc_d1f51d8aad67Input,
		output: generatedSchemas.doc_d1f51d8aad67Output,
	},
	'certcentralApi.getEnabledStatus': {
		input: generatedSchemas.doc_8086b322241cInput,
		output: generatedSchemas.doc_8086b322241cOutput,
	},
	'certcentralApi.getNotificationSettings': {
		input: generatedSchemas.doc_6b3b0b1d5184Input,
		output: generatedSchemas.doc_6b3b0b1d5184Output,
	},
	'certcentralApi.getScanDetails': {
		input: generatedSchemas.doc_a3c0623a5337Input,
		output: generatedSchemas.doc_a3c0623a5337Output,
	},
	'certcentralApi.rescanDomain': {
		input: generatedSchemas.doc_cf596c53b5beInput,
		output: generatedSchemas.doc_cf596c53b5beOutput,
	},
	'reportLibraryApi.createReport': {
		input: generatedSchemas.doc_25993fbcf6e2Input,
		output: generatedSchemas.doc_25993fbcf6e2Output,
	},
	'reportLibraryApi.deleteReportRun': {
		input: generatedSchemas.doc_9e251cf5f94bInput,
		output: generatedSchemas.doc_9e251cf5f94bOutput,
	},
	'reportLibraryApi.deleteReport': {
		input: generatedSchemas.doc_5572d37bb03dInput,
		output: generatedSchemas.doc_5572d37bb03dOutput,
	},
	'reportLibraryApi.deleteScheduledReport': {
		input: generatedSchemas.doc_53f4f8bcf551Input,
		output: generatedSchemas.doc_53f4f8bcf551Output,
	},
	'reportLibraryApi.downloadReport': {
		input: generatedSchemas.doc_f22fa239a636Input,
		output: generatedSchemas.doc_f22fa239a636Output,
	},
	'reportLibraryApi.editReport': {
		input: generatedSchemas.doc_d6c0bc13eb4bInput,
		output: generatedSchemas.doc_d6c0bc13eb4bOutput,
	},
	'reportLibraryApi.getJsonReport': {
		input: generatedSchemas.doc_5574ec7619c8Input,
		output: generatedSchemas.doc_5574ec7619c8Output,
	},
	'reportLibraryApi.listColumns': {
		input: generatedSchemas.doc_08c16f4a80d4Input,
		output: generatedSchemas.doc_08c16f4a80d4Output,
	},
	'reportLibraryApi.startReportRun': {
		input: generatedSchemas.doc_b285fe5a9222Input,
		output: generatedSchemas.doc_b285fe5a9222Output,
	},
} as const;

export const generatedDocEndpointMeta: Record<
	GeneratedDocEndpointPath,
	{ riskLevel: 'read' | 'write' | 'destructive'; description: string }
> = {
	'certcentralApi.accountDetails': {
		riskLevel: 'read',
		description: 'Account details',
	},
	'certcentralApi.addCustomField': {
		riskLevel: 'write',
		description: 'Add custom field',
	},
	'certcentralApi.authKeyDetails': {
		riskLevel: 'read',
		description: 'AuthKey details',
	},
	'certcentralApi.bulkAddFields': {
		riskLevel: 'write',
		description: 'Bulk add fields',
	},
	'certcentralApi.configureOidcSso': {
		riskLevel: 'write',
		description: 'Configure OIDC SSO',
	},
	'certcentralApi.contractDetails': {
		riskLevel: 'read',
		description: 'Contract details',
	},
	'certcentralApi.createAuthKey': {
		riskLevel: 'write',
		description: 'Create AuthKey',
	},
	'certcentralApi.deleteAuthKey': {
		riskLevel: 'destructive',
		description: 'Delete AuthKey',
	},
	'certcentralApi.deleteCustomField': {
		riskLevel: 'destructive',
		description: 'Delete custom field',
	},
	'certcentralApi.deleteOidcSsoConfiguration': {
		riskLevel: 'destructive',
		description: 'Delete OIDC SSO configuration',
	},
	'certcentralApi.editCustomField': {
		riskLevel: 'write',
		description: 'Edit custom field',
	},
	'certcentralApi.guestAccessUrl': {
		riskLevel: 'read',
		description: 'Guest access URL',
	},
	'certcentralApi.inviteDetails': {
		riskLevel: 'read',
		description: 'Invite details',
	},
	'certcentralApi.listAuthKeys': {
		riskLevel: 'read',
		description: 'List AuthKeys',
	},
	'certcentralApi.listCustomFields': {
		riskLevel: 'read',
		description: 'List custom fields',
	},
	'certcentralApi.listInvites': {
		riskLevel: 'read',
		description: 'List invites',
	},
	'certcentralApi.moveOrders': {
		riskLevel: 'write',
		description: 'Move orders',
	},
	'certcentralApi.oidcSsoConfigurationDetails': {
		riskLevel: 'read',
		description: 'OIDC SSO configuration details',
	},
	'certcentralApi.resendInvite': {
		riskLevel: 'destructive',
		description: 'Resend invite',
	},
	'certcentralApi.samlEntityDetails': {
		riskLevel: 'read',
		description: 'SAML entity details',
	},
	'certcentralApi.sendInvite': {
		riskLevel: 'destructive',
		description: 'Send invite',
	},
	'certcentralApi.updateAccountEmails': {
		riskLevel: 'write',
		description: 'Update account emails',
	},
	'certcentralApi.updateAccountNotificationSettings': {
		riskLevel: 'write',
		description: 'Update account notification settings',
	},
	'certcentralApi.updateInviteStatus': {
		riskLevel: 'write',
		description: 'Update invite status',
	},
	'certcentralApi.updateOidcSsoConfiguration': {
		riskLevel: 'write',
		description: 'Update OIDC SSO configuration',
	},
	'certcentralApi.updateSamlEntity': {
		riskLevel: 'write',
		description: 'Update SAML entity',
	},
	'certcentralApi.acmeExternalAccountBinding': {
		riskLevel: 'write',
		description: 'ACME External Account Binding',
	},
	'certcentralApi.createKey': { riskLevel: 'write', description: 'Create key' },
	'certcentralApi.editKey': { riskLevel: 'write', description: 'Edit key' },
	'certcentralApi.getKeyInfo': {
		riskLevel: 'read',
		description: 'Get key info',
	},
	'certcentralApi.listApiAccessRoles': {
		riskLevel: 'read',
		description: 'List API access roles',
	},
	'certcentralApi.listKeys': { riskLevel: 'read', description: 'List keys' },
	'certcentralApi.updateAcmeRestrictions': {
		riskLevel: 'write',
		description: 'Update ACME restrictions',
	},
	'certcentralApi.updateKeyStatus': {
		riskLevel: 'write',
		description: 'Update key status',
	},
	'certcentralApi.checkPermission': {
		riskLevel: 'read',
		description: 'Check permission',
	},
	'certcentralApi.containerPermissions': {
		riskLevel: 'read',
		description: 'Container permissions',
	},
	'certcentralApi.listPermissions': {
		riskLevel: 'read',
		description: 'List permissions',
	},
	'certcentralApi.addNote': { riskLevel: 'write', description: 'Add note' },
	'certcentralApi.archiveCertificate': {
		riskLevel: 'write',
		description: 'Archive certificate',
	},
	'certcentralApi.certificateChain': {
		riskLevel: 'read',
		description: 'Certificate chain',
	},
	'certcentralApi.downloadCertificateByFormatOrderId': {
		riskLevel: 'read',
		description: 'Download certificate by format (order_id)',
	},
	'certcentralApi.downloadCertificateByFormat': {
		riskLevel: 'read',
		description: 'Download certificate by format',
	},
	'certcentralApi.downloadCertificateOrderId': {
		riskLevel: 'read',
		description: 'Download certificate (order_id)',
	},
	'certcentralApi.emailCertificate': {
		riskLevel: 'destructive',
		description: 'Email certificate',
	},
	'certcentralApi.listCertificateNotes': {
		riskLevel: 'read',
		description: 'List certificate notes',
	},
	'certcentralApi.restoreCertificate': {
		riskLevel: 'write',
		description: 'Restore certificate',
	},
	'certcentralApi.revokeCertificate': {
		riskLevel: 'destructive',
		description: 'Revoke certificate',
	},
	'certcentralApi.activateContainer': {
		riskLevel: 'write',
		description: 'Activate container',
	},
	'certcentralApi.containerInfo': {
		riskLevel: 'read',
		description: 'Container info',
	},
	'certcentralApi.createContainer': {
		riskLevel: 'write',
		description: 'Create container',
	},
	'certcentralApi.deactivateContainer': {
		riskLevel: 'write',
		description: 'Deactivate container',
	},
	'certcentralApi.editContainer': {
		riskLevel: 'write',
		description: 'Edit container',
	},
	'certcentralApi.listChildContainers': {
		riskLevel: 'read',
		description: 'List child containers',
	},
	'certcentralApi.listContainerOrganizations': {
		riskLevel: 'read',
		description: 'List container organizations',
	},
	'certcentralApi.listContainerRoles': {
		riskLevel: 'read',
		description: 'List container roles',
	},
	'certcentralApi.listContainers': {
		riskLevel: 'read',
		description: 'List containers',
	},
	'certcentralApi.listTemplates': {
		riskLevel: 'read',
		description: 'List templates',
	},
	'certcentralApi.parentContainerInfo': {
		riskLevel: 'read',
		description: 'Parent container info',
	},
	'certcentralApi.productLimits': {
		riskLevel: 'read',
		description: 'Product limits',
	},
	'certcentralApi.templateInfo': {
		riskLevel: 'read',
		description: 'Template info',
	},
	'certcentralApi.updateAllowedDomains': {
		riskLevel: 'write',
		description: 'Update allowed domains',
	},
	'certcentralApi.updateOrganizationAssignments': {
		riskLevel: 'write',
		description: 'Update organization assignments',
	},
	'certcentralApi.updateRenewalNotificationRecipients': {
		riskLevel: 'write',
		description: 'Update renewal notification recipients',
	},
	'certcentralApi.updateUserAssignments': {
		riskLevel: 'write',
		description: 'Update user assignments',
	},
	'certcentralApi.allowlistIssuingCertificateAuthority': {
		riskLevel: 'write',
		description: 'Allowlist issuing certificate authority',
	},
	'certcentralApi.disableCtLogMonitoring': {
		riskLevel: 'write',
		description: 'Disable CT log monitoring',
	},
	'certcentralApi.downloadCertificateSerialNumber': {
		riskLevel: 'read',
		description: 'Download certificate (serial number)',
	},
	'certcentralApi.enableCtLogMonitoring': {
		riskLevel: 'write',
		description: 'Enable CT log monitoring',
	},
	'certcentralApi.getAllowlistedIssuingCaBrandDetails': {
		riskLevel: 'read',
		description: 'Get allowlisted issuing CA brand details',
	},
	'certcentralApi.getCtLogDetailsForACertificate': {
		riskLevel: 'read',
		description: 'Get CT log details for a certificate',
	},
	'certcentralApi.getCtLogMonitoringStatus': {
		riskLevel: 'read',
		description: 'Get CT log monitoring status',
	},
	'certcentralApi.getCtLogsOrderId': {
		riskLevel: 'read',
		description: 'Get CT logs (order ID)',
	},
	'certcentralApi.activateDomainLocking': {
		riskLevel: 'write',
		description: 'Activate domain locking',
	},
	'certcentralApi.activateDomain': {
		riskLevel: 'write',
		description: 'Activate domain',
	},
	'certcentralApi.addDomain': { riskLevel: 'write', description: 'Add domain' },
	'certcentralApi.changeDcvMethod': {
		riskLevel: 'write',
		description: 'Change DCV method',
	},
	'certcentralApi.checkCaaDomainLock': {
		riskLevel: 'write',
		description: 'Check CAA (domain lock)',
	},
	'certcentralApi.deactivateDomainLocking': {
		riskLevel: 'write',
		description: 'Deactivate domain locking',
	},
	'certcentralApi.deactivateDomain': {
		riskLevel: 'write',
		description: 'Deactivate domain',
	},
	'certcentralApi.deleteDomain': {
		riskLevel: 'destructive',
		description: 'Delete domain',
	},
	'certcentralApi.domainEmails': {
		riskLevel: 'read',
		description: 'Domain emails',
	},
	'certcentralApi.domainInfo': {
		riskLevel: 'read',
		description: 'Domain info',
	},
	'certcentralApi.expiringDomainsCount': {
		riskLevel: 'read',
		description: 'Expiring domains count',
	},
	'certcentralApi.listDcvMethods': {
		riskLevel: 'read',
		description: 'List DCV methods',
	},
	'certcentralApi.listDomains': {
		riskLevel: 'read',
		description: 'List domains',
	},
	'certcentralApi.ovEvSslCheckDcv': {
		riskLevel: 'write',
		description: 'OV/EV SSL: Check DCV',
	},
	'certcentralApi.ovEvSslGenerateDcvToken': {
		riskLevel: 'write',
		description: 'OV/EV SSL: Generate DCV token',
	},
	'certcentralApi.resendDcvEmail': {
		riskLevel: 'destructive',
		description: 'Resend DCV email',
	},
	'certcentralApi.submitForValidation': {
		riskLevel: 'write',
		description: 'Submit for validation',
	},
	'certcentralApi.validationDetails': {
		riskLevel: 'read',
		description: 'Validation details',
	},
	'certcentralApi.validationTypes': {
		riskLevel: 'read',
		description: 'Validation types',
	},
	'certcentralApi.listBalanceHistory': {
		riskLevel: 'read',
		description: 'List balance history',
	},
	'certcentralApi.listPurchaseHistory': {
		riskLevel: 'read',
		description: 'List purchase history',
	},
	'certcentralApi.listReplacementBenefits': {
		riskLevel: 'write',
		description: 'List replacement benefits',
	},
	'certcentralApi.priceEstimate': {
		riskLevel: 'write',
		description: 'Price estimate',
	},
	'certcentralApi.receiptInfo': {
		riskLevel: 'read',
		description: 'Receipt info',
	},
	'certcentralApi.transferFunds': {
		riskLevel: 'destructive',
		description: 'Transfer funds',
	},
	'certcentralApi.viewBalance': {
		riskLevel: 'read',
		description: 'View balance',
	},
	'certcentralApi.voucherPriceEstimate': {
		riskLevel: 'write',
		description: 'Voucher price estimate',
	},
	'certcentralApi.addIpRestriction': {
		riskLevel: 'write',
		description: 'Add IP restriction',
	},
	'certcentralApi.deleteIpRestriction': {
		riskLevel: 'destructive',
		description: 'Delete IP restriction',
	},
	'certcentralApi.listIpRestrictions': {
		riskLevel: 'read',
		description: 'List IP restrictions',
	},
	'certcentralApi.digiCertOrderId': {
		riskLevel: 'read',
		description: 'DigiCert order ID',
	},
	'certcentralApi.addNote_504f5354': {
		riskLevel: 'write',
		description: 'Add note',
	},
	'certcentralApi.additionalEmails': {
		riskLevel: 'write',
		description: 'Additional emails',
	},
	'certcentralApi.changeCtStatus': {
		riskLevel: 'write',
		description: 'Change CT status',
	},
	'certcentralApi.changeOrderContainer': {
		riskLevel: 'write',
		description: 'Change order container',
	},
	'certcentralApi.deleteCustomField_44454c45': {
		riskLevel: 'destructive',
		description: 'Delete custom field',
	},
	'certcentralApi.deleteNoteDeleteNote': {
		riskLevel: 'destructive',
		description: 'Delete note — Delete note',
	},
	'certcentralApi.deleteOrderDeleteOrder': {
		riskLevel: 'destructive',
		description:
			'Delete order — Permanently delete an eligible inactive order; set query.revoke to also revoke its certificate',
	},
	'certcentralApi.deleteRenewalMessage': {
		riskLevel: 'destructive',
		description: 'Delete renewal message',
	},
	'certcentralApi.duplicateCertificate': {
		riskLevel: 'write',
		description: 'Duplicate certificate',
	},
	'certcentralApi.dvSslChangeDcvMethod': {
		riskLevel: 'write',
		description: 'DV SSL: Change DCV method',
	},
	'certcentralApi.dvSslCheckDcv': {
		riskLevel: 'write',
		description: 'DV SSL: Check DCV',
	},
	'certcentralApi.generateDcvToken': {
		riskLevel: 'write',
		description: 'Generate DCV token',
	},
	'certcentralApi.dvSslResendEmails': {
		riskLevel: 'destructive',
		description: 'DV SSL: Resend emails',
	},
	'certcentralApi.editCustomFieldValue': {
		riskLevel: 'write',
		description: 'Edit custom field value',
	},
	'certcentralApi.editDomainsOnAPendingOrderOrReissue': {
		riskLevel: 'write',
		description: 'Edit domains on a pending order or reissue',
	},
	'certcentralApi.editGuestAccessOrder': {
		riskLevel: 'write',
		description: 'Edit guest access (order)',
	},
	'certcentralApi.editNote': { riskLevel: 'write', description: 'Edit note' },
	'certcentralApi.emailSiteSeal': {
		riskLevel: 'destructive',
		description: 'Email site seal',
	},
	'certcentralApi.emailValidationStatus': {
		riskLevel: 'read',
		description: 'Email validation status',
	},
	'certcentralApi.getOrdersByAlternativeOrderId': {
		riskLevel: 'read',
		description: 'Get orders by alternative order ID',
	},
	'certcentralApi.getVmcOrCmcLogo': {
		riskLevel: 'read',
		description: 'Get VMC or CMC logo',
	},
	'certcentralApi.listDuplicates': {
		riskLevel: 'read',
		description: 'List duplicates',
	},
	'certcentralApi.listOrderNotes': {
		riskLevel: 'read',
		description: 'List order notes',
	},
	'certcentralApi.listReissues': {
		riskLevel: 'read',
		description: 'List reissues',
	},
	'certcentralApi.orderAatlNaturalPersonCertificate': {
		riskLevel: 'destructive',
		description: 'Order AATL Natural Person Certificate',
	},
	'certcentralApi.orderAatlNaturalPersonInOrganisationCertificate': {
		riskLevel: 'destructive',
		description: 'Order AATL Natural Person in Organisation Certificate',
	},
	'certcentralApi.orderAatlOrganizationEsealCertificate': {
		riskLevel: 'destructive',
		description: 'Order AATL Organization eseal Certificate',
	},
	'certcentralApi.orderBasicEvOrderBasicEv': {
		riskLevel: 'destructive',
		description: 'Order Basic EV — Order Basic EV',
	},
	'certcentralApi.orderMultiYearPlanOrderMultiYearPlan': {
		riskLevel: 'destructive',
		description: 'Order Multi-year Plan — Order Multi-year Plan',
	},
	'certcentralApi.orderBasicOv': {
		riskLevel: 'destructive',
		description: 'Order Basic OV',
	},
	'certcentralApi.orderClientCertificate': {
		riskLevel: 'destructive',
		description: 'Order client certificate',
	},
	'certcentralApi.orderCodeSigningCertificate': {
		riskLevel: 'destructive',
		description: 'Order code signing certificate',
	},
	'certcentralApi.orderCommonMarkCertificateCmc': {
		riskLevel: 'destructive',
		description: 'Order Common Mark Certificate (CMC)',
	},
	'certcentralApi.orderDocumentSigningCertificate': {
		riskLevel: 'destructive',
		description: 'Order document signing certificate',
	},
	'certcentralApi.orderDocumentSigningForEmployee': {
		riskLevel: 'destructive',
		description: 'Order Document Signing for Employee',
	},
	'certcentralApi.orderDocumentSigningForIndividual': {
		riskLevel: 'destructive',
		description: 'Order Document Signing for Individual',
	},
	'certcentralApi.orderDocumentSigningForOrganization': {
		riskLevel: 'destructive',
		description: 'Order Document Signing for Organization',
	},
	'certcentralApi.orderDvSsl': {
		riskLevel: 'destructive',
		description: 'Order DV SSL',
	},
	'certcentralApi.orderEuQualifiedESealPsd2': {
		riskLevel: 'destructive',
		description: 'Order EU Qualified eSeal PSD2',
	},
	'certcentralApi.orderEuQualifiedESeal': {
		riskLevel: 'destructive',
		description: 'Order EU Qualified eSeal',
	},
	'certcentralApi.orderEuQualifiedPersonalOrganisation': {
		riskLevel: 'destructive',
		description: 'Order EU Qualified Personal Organisation',
	},
	'certcentralApi.orderEuQualifiedPersonal': {
		riskLevel: 'destructive',
		description: 'Order EU Qualified Personal',
	},
	'certcentralApi.orderEuQualifiedWebsiteAuthenticationCertificate': {
		riskLevel: 'destructive',
		description: 'Order EU Qualified Website Authentication Certificate',
	},
	'certcentralApi.orderEuQualifiedWebsiteAuthenticationPsd2Certificate': {
		riskLevel: 'destructive',
		description: 'Order EU Qualified Website Authentication PSD2 Certificate',
	},
	'certcentralApi.orderGeoTrustDvSsl': {
		riskLevel: 'destructive',
		description: 'Order GeoTrust DV SSL',
	},
	'certcentralApi.orderInfo': { riskLevel: 'read', description: 'Order info' },
	'certcentralApi.orderOvEvSslOrderOvEvSsl': {
		riskLevel: 'destructive',
		description: 'Order OV/EV SSL — Order OV/EV SSL',
	},
	'certcentralApi.orderSecureSiteSslOrderSecureSiteSsl': {
		riskLevel: 'destructive',
		description: 'Order Secure Site SSL — Order Secure Site SSL',
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionCitizen': {
		riskLevel: 'destructive',
		description: 'Order PKIo Authentication or Encryption - Citizen',
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationPerson': {
		riskLevel: 'destructive',
		description:
			'Order PKIo Authentication or Encryption - Organisation Person',
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationServices': {
		riskLevel: 'destructive',
		description:
			'Order PKIo Authentication or Encryption - Organisation Services',
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionPrivatePerson': {
		riskLevel: 'destructive',
		description: 'Order PKIo Authentication or Encryption - Private Person',
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionPrivateProfessional': {
		riskLevel: 'destructive',
		description:
			'Order PKIo Authentication or Encryption - Private Professional',
	},
	'certcentralApi.orderPkioAuthenticationOrEncryptionProfessional': {
		riskLevel: 'destructive',
		description: 'Order PKIo Authentication or Encryption - Professional',
	},
	'certcentralApi.orderPkioCitizenSigning': {
		riskLevel: 'destructive',
		description: 'Order PKIo Citizen - Signing',
	},
	'certcentralApi.orderPkioPersonalOrganisationSigning': {
		riskLevel: 'destructive',
		description: 'Order PKIo Personal Organisation - Signing',
	},
	'certcentralApi.orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning': {
		riskLevel: 'destructive',
		description:
			'Order PKIo Private Person - Signing — Order PKIo Private Person - Signing',
	},
	'certcentralApi.orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning':
		{
			riskLevel: 'destructive',
			description:
				'Order PKIo Private Professional - Signing — Order PKIo Private Professional - Signing',
		},
	'certcentralApi.orderPkioPrivateServicesServer': {
		riskLevel: 'destructive',
		description: 'Order PKIo Private Services Server',
	},
	'certcentralApi.orderPkioProfessionalSigning': {
		riskLevel: 'destructive',
		description: 'Order PKIo Professional - Signing',
	},
	'certcentralApi.orderPkioQualifiedESeal': {
		riskLevel: 'destructive',
		description: 'Order PKIo Qualified eSeal',
	},
	'certcentralApi.orderPrivateSsl': {
		riskLevel: 'destructive',
		description: 'Order Private SSL',
	},
	'certcentralApi.orderSecureEmailCertificate': {
		riskLevel: 'destructive',
		description: 'Order secure email certificate',
	},
	'certcentralApi.orderSecureSiteEv': {
		riskLevel: 'destructive',
		description: 'Order Secure Site EV',
	},
	'certcentralApi.orderSecureSiteOv': {
		riskLevel: 'destructive',
		description: 'Order Secure Site OV',
	},
	'certcentralApi.orderSecureSiteProEvSsl': {
		riskLevel: 'destructive',
		description: 'Order Secure Site Pro EV SSL',
	},
	'certcentralApi.orderSecureSiteProSsl': {
		riskLevel: 'destructive',
		description: 'Order Secure Site Pro SSL',
	},
	'certcentralApi.orderSslTypeHint': {
		riskLevel: 'destructive',
		description: 'Order SSL (type_hint)',
	},
	'certcentralApi.orderSwissClientAuthenticationCertificate': {
		riskLevel: 'destructive',
		description: 'Order Swiss Client Authentication Certificate',
	},
	'certcentralApi.orderSwissQualifiedCertificateForIndividualInOrganisation': {
		riskLevel: 'destructive',
		description:
			'Order Swiss Qualified Certificate for Individual in Organisation',
	},
	'certcentralApi.orderSwissQualifiedCertificateForIndividual': {
		riskLevel: 'destructive',
		description: 'Order Swiss Qualified Certificate for Individual',
	},
	'certcentralApi.orderSwissRegulatedCertificateForIndividualInOrganisation': {
		riskLevel: 'destructive',
		description:
			'Order Swiss Regulated Certificate for Individual in Organisation',
	},
	'certcentralApi.orderSwissRegulatedCertificateForIndividual': {
		riskLevel: 'destructive',
		description: 'Order Swiss Regulated Certificate for Individual',
	},
	'certcentralApi.orderSwissRegulatedCertificateForOrganisation': {
		riskLevel: 'destructive',
		description: 'Order Swiss Regulated Certificate for Organisation',
	},
	'certcentralApi.orderVerifiedMarkCertificateVmc': {
		riskLevel: 'destructive',
		description: 'Order Verified Mark Certificate (VMC)',
	},
	'certcentralApi.orderX9PkiForTls': {
		riskLevel: 'destructive',
		description: 'Order X9 PKI for TLS',
	},
	'certcentralApi.purchaseKeyLockerSignatures': {
		riskLevel: 'destructive',
		description: 'Purchase KeyLocker signatures',
	},
	'certcentralApi.reissueCertificate': {
		riskLevel: 'destructive',
		description: 'Reissue certificate',
	},
	'certcentralApi.resendOrderApprovalEmail': {
		riskLevel: 'destructive',
		description: 'Resend order approval email',
	},
	'certcentralApi.revokeOrderCertificates': {
		riskLevel: 'destructive',
		description: 'Revoke order certificates',
	},
	'certcentralApi.siteSealSettings': {
		riskLevel: 'read',
		description: 'Site seal settings',
	},
	'certcentralApi.statusChangeList': {
		riskLevel: 'read',
		description: 'Status change list',
	},
	'certcentralApi.updateAutoReissueSettings': {
		riskLevel: 'write',
		description: 'Update auto-reissue settings',
	},
	'certcentralApi.updateCsr': { riskLevel: 'write', description: 'Update CSR' },
	'certcentralApi.updateOrderContacts': {
		riskLevel: 'write',
		description: 'Update order contacts',
	},
	'certcentralApi.updateOrderStatus': {
		riskLevel: 'destructive',
		description: 'Update order status',
	},
	'certcentralApi.updateRenewalMessage': {
		riskLevel: 'write',
		description: 'Update renewal message',
	},
	'certcentralApi.updateRenewalNotificationSettings': {
		riskLevel: 'write',
		description: 'Update renewal notification settings',
	},
	'certcentralApi.updateSiteSealSettings': {
		riskLevel: 'write',
		description: 'Update site seal settings',
	},
	'certcentralApi.updateVmcOrCmcOrders': {
		riskLevel: 'write',
		description: 'Update VMC or CMC orders',
	},
	'certcentralApi.uploadSiteSealLogo': {
		riskLevel: 'write',
		description: 'Upload site seal logo',
	},
	'certcentralApi.uploadVmcOrCmcLogoEncoded': {
		riskLevel: 'write',
		description: 'Upload VMC or CMC logo (encoded)',
	},
	'certcentralApi.uploadVmcOrCmcLogoSvg': {
		riskLevel: 'write',
		description: 'Upload VMC or CMC logo (SVG)',
	},
	'certcentralApi.orderValidationStatus': {
		riskLevel: 'read',
		description: 'Order validation status',
	},
	'certcentralApi.viewKeyLockerSignatures': {
		riskLevel: 'read',
		description: 'View KeyLocker signatures',
	},
	'certcentralApi.viewNote': { riskLevel: 'read', description: 'View note' },
	'certcentralApi.activateOrganization': {
		riskLevel: 'write',
		description: 'Activate organization',
	},
	'certcentralApi.createOrganization': {
		riskLevel: 'write',
		description: 'Create organization',
	},
	'certcentralApi.deactivateOrganization': {
		riskLevel: 'write',
		description: 'Deactivate organization',
	},
	'certcentralApi.deleteOrganization': {
		riskLevel: 'destructive',
		description: 'Delete organization',
	},
	'certcentralApi.listApprovers': {
		riskLevel: 'read',
		description: 'List approvers',
	},
	'certcentralApi.organizationAndTechnicalContactInfo': {
		riskLevel: 'read',
		description: 'Organization and technical contact info',
	},
	'certcentralApi.organizationInfo': {
		riskLevel: 'read',
		description: 'Organization info',
	},
	'certcentralApi.recentOrganizations': {
		riskLevel: 'read',
		description: 'Recent organizations',
	},
	'certcentralApi.submitForValidation_504f5354': {
		riskLevel: 'write',
		description: 'Submit for validation',
	},
	'certcentralApi.updateOrganizationAndTechnicalContact': {
		riskLevel: 'write',
		description: 'Update organization and technical contact',
	},
	'certcentralApi.validationDetails_4745542f': {
		riskLevel: 'read',
		description: 'Validation details',
	},
	'certcentralApi.validationTypes_4745542f': {
		riskLevel: 'read',
		description: 'Validation types',
	},
	'certcentralApi.certificateFormatMap': {
		riskLevel: 'read',
		description: 'Certificate format map',
	},
	'certcentralApi.pricingList': {
		riskLevel: 'read',
		description: 'Pricing list',
	},
	'certcentralApi.productInfo': {
		riskLevel: 'read',
		description: 'Product info',
	},
	'certcentralApi.productList': {
		riskLevel: 'read',
		description: 'Product list',
	},
	'certcentralApi.expiringOrdersAndCertificates': {
		riskLevel: 'read',
		description: 'Expiring orders and certificates',
	},
	'certcentralApi.orderReport': {
		riskLevel: 'read',
		description: 'Order report',
	},
	'certcentralApi.requestSummary': {
		riskLevel: 'read',
		description: 'Request summary',
	},
	'certcentralApi.listRequests': {
		riskLevel: 'read',
		description: 'List requests',
	},
	'certcentralApi.requestInfo': {
		riskLevel: 'read',
		description: 'Request info',
	},
	'certcentralApi.updateCsrForAPendingReissueRequest': {
		riskLevel: 'read',
		description: 'Update CSR for a pending reissue request',
	},
	'certcentralApi.updateRequestStatus': {
		riskLevel: 'write',
		description: 'Update request status',
	},
	'certcentralApi.addOrRemoveFunds': {
		riskLevel: 'destructive',
		description: 'Add or remove funds',
	},
	'certcentralApi.balanceDetails': {
		riskLevel: 'read',
		description: 'Balance details',
	},
	'certcentralApi.cancelUnitOrder': {
		riskLevel: 'destructive',
		description: 'Cancel unit order',
	},
	'certcentralApi.createSubaccount': {
		riskLevel: 'write',
		description: 'Create subaccount',
	},
	'certcentralApi.createUnitOrder': {
		riskLevel: 'destructive',
		description: 'Create unit order',
	},
	'certcentralApi.editSubaccount': {
		riskLevel: 'write',
		description: 'Edit subaccount',
	},
	'certcentralApi.listSubaccountDomains': {
		riskLevel: 'read',
		description: 'List subaccount domains',
	},
	'certcentralApi.listSubaccountOrders': {
		riskLevel: 'read',
		description: 'List subaccount orders',
	},
	'certcentralApi.listSubaccountOrganizations': {
		riskLevel: 'read',
		description: 'List subaccount organizations',
	},
	'certcentralApi.listSubaccountProductLimits': {
		riskLevel: 'read',
		description: 'List subaccount product limits',
	},
	'certcentralApi.listSubaccountProducts': {
		riskLevel: 'read',
		description: 'List subaccount products',
	},
	'certcentralApi.listSubaccounts': {
		riskLevel: 'read',
		description: 'List subaccounts',
	},
	'certcentralApi.listUnitOrders': {
		riskLevel: 'read',
		description: 'List unit orders',
	},
	'certcentralApi.setSubaccountProducts': {
		riskLevel: 'write',
		description: 'Set subaccount products',
	},
	'certcentralApi.subaccountInfo': {
		riskLevel: 'read',
		description: 'Subaccount info',
	},
	'certcentralApi.subaccountOrderInfo': {
		riskLevel: 'read',
		description: 'Subaccount order info',
	},
	'certcentralApi.subaccountReport': {
		riskLevel: 'read',
		description: 'Subaccount report',
	},
	'certcentralApi.unitOrderDetails': {
		riskLevel: 'read',
		description: 'Unit order details',
	},
	'certcentralApi.addServiceUserAddServiceUser': {
		riskLevel: 'write',
		description: 'Add service user — Add service user',
	},
	'certcentralApi.addUserAddUser': {
		riskLevel: 'write',
		description: 'Add user — Add user',
	},
	'certcentralApi.approveUserInvitation': {
		riskLevel: 'write',
		description: 'Approve user invitation',
	},
	'certcentralApi.changeUserRole': {
		riskLevel: 'write',
		description: 'Change user role',
	},
	'certcentralApi.createVerifiedContactDelegation': {
		riskLevel: 'write',
		description: 'Create verified contact delegation',
	},
	'certcentralApi.deleteUser': {
		riskLevel: 'destructive',
		description: 'Delete user',
	},
	'certcentralApi.deleteVerifiedContactDelegation': {
		riskLevel: 'destructive',
		description: 'Delete verified contact delegation',
	},
	'certcentralApi.editServiceUserEditServiceUser': {
		riskLevel: 'write',
		description: 'Edit service user — Edit service user',
	},
	'certcentralApi.editUserEditUser': {
		riskLevel: 'write',
		description: 'Edit user — Edit user',
	},
	'certcentralApi.listServiceUsers': {
		riskLevel: 'read',
		description: 'List service users',
	},
	'certcentralApi.listUserInvitations': {
		riskLevel: 'read',
		description: 'List user invitations',
	},
	'certcentralApi.listVerifiedContactDelegations': {
		riskLevel: 'read',
		description: 'List verified contact delegations',
	},
	'certcentralApi.listVerifiedContactsThatCanDelegate': {
		riskLevel: 'read',
		description: 'List verified contacts that can delegate',
	},
	'certcentralApi.resendCreateUserEmail': {
		riskLevel: 'destructive',
		description: 'Resend create user email',
	},
	'certcentralApi.resendVerifiedContactDelegationEmail': {
		riskLevel: 'destructive',
		description: 'Resend verified contact delegation email',
	},
	'certcentralApi.updateContainerAssignments': {
		riskLevel: 'write',
		description: 'Update container assignments',
	},
	'certcentralApi.userInfo': { riskLevel: 'read', description: 'User info' },
	'certcentralApi.usernameAvailability': {
		riskLevel: 'read',
		description: 'Username availability',
	},
	'certcentralApi.validateVmcOrCmcLogoFormatEncoded': {
		riskLevel: 'write',
		description: 'Validate VMC or CMC logo format (encoded)',
	},
	'certcentralApi.validateVmcOrCmcLogoFormatSvg': {
		riskLevel: 'write',
		description: 'Validate VMC or CMC logo format (SVG)',
	},
	'certcentralApi.cancelVoucherCode': {
		riskLevel: 'destructive',
		description: 'Cancel voucher code',
	},
	'certcentralApi.createVoucherOrder': {
		riskLevel: 'destructive',
		description: 'Create voucher order',
	},
	'certcentralApi.getVoucherOrderDetails': {
		riskLevel: 'read',
		description: 'Get voucher order details',
	},
	'certcentralApi.listAllVoucherOrders': {
		riskLevel: 'read',
		description: 'List all voucher orders',
	},
	'certcentralApi.listCodesForVoucherOrder': {
		riskLevel: 'read',
		description: 'List codes for voucher order',
	},
	'certcentralApi.listUsedVoucherCodes': {
		riskLevel: 'read',
		description: 'List used voucher codes',
	},
	'certcentralApi.disableScanning': {
		riskLevel: 'destructive',
		description: 'Disable scanning',
	},
	'certcentralApi.downloadResults': {
		riskLevel: 'read',
		description: 'Download results',
	},
	'certcentralApi.enableScanning': {
		riskLevel: 'write',
		description: 'Enable scanning',
	},
	'certcentralApi.getEnabledStatus': {
		riskLevel: 'read',
		description: 'Get enabled status',
	},
	'certcentralApi.getNotificationSettings': {
		riskLevel: 'read',
		description: 'Get notification settings',
	},
	'certcentralApi.getScanDetails': {
		riskLevel: 'read',
		description: 'Get scan details',
	},
	'certcentralApi.rescanDomain': {
		riskLevel: 'write',
		description: 'Rescan domain',
	},
	'reportLibraryApi.createReport': {
		riskLevel: 'write',
		description: 'Create report',
	},
	'reportLibraryApi.deleteReportRun': {
		riskLevel: 'destructive',
		description: 'Delete report run',
	},
	'reportLibraryApi.deleteReport': {
		riskLevel: 'destructive',
		description: 'Delete report',
	},
	'reportLibraryApi.deleteScheduledReport': {
		riskLevel: 'destructive',
		description: 'Delete scheduled report',
	},
	'reportLibraryApi.downloadReport': {
		riskLevel: 'read',
		description: 'Download report',
	},
	'reportLibraryApi.editReport': {
		riskLevel: 'write',
		description: 'Edit report',
	},
	'reportLibraryApi.getJsonReport': {
		riskLevel: 'read',
		description: 'Get JSON report',
	},
	'reportLibraryApi.listColumns': {
		riskLevel: 'read',
		description: 'List columns',
	},
	'reportLibraryApi.startReportRun': {
		riskLevel: 'write',
		description: 'Start report run',
	},
} as const;

// Fixture table over 282 differently-typed generated endpoints: each entry has
// its own parsed input/output schema, so a single table row cannot keep the
// per-operation types. The table only exercises routing, so erasing the output
// to `unknown` avoids inventing a shared response type.
export type GeneratedDocTestCase = {
	id: string;
	// `unknown`: the fixture table covers 282 output types, so one row cannot keep them.
	endpoint: CorsairEndpoint<DigicertContext, OpenApiCallInput, unknown>;
	input: OpenApiCallInput;
	// `unknown`: each row's output example is checked by that operation's schema at runtime.
	outputExample: unknown;
	expected: { family: OpenApiFamily; path: string; method: string };
};
export const generatedDocTestCases: GeneratedDocTestCase[] = [
	{
		id: 'certcentralApi.accountDetails',
		endpoint: generatedDocEndpoints.certcentralApi.accountDetails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/account', method: 'GET' },
	},
	{
		id: 'certcentralApi.addCustomField',
		endpoint: generatedDocEndpoints.certcentralApi.addCustomField,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { label: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/metadata',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.authKeyDetails',
		endpoint: generatedDocEndpoints.certcentralApi.authKeyDetails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/auth-key',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.bulkAddFields',
		endpoint: generatedDocEndpoints.certcentralApi.bulkAddFields,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { metadata: [], label: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/metadata/bulk',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.configureOidcSso',
		endpoint: generatedDocEndpoints.certcentralApi.configureOidcSso,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				provider_url: 'fixture',
				client_id: 'fixture',
				client_secret: 'fixture',
				friendly_name: 'fixture',
				scope_parameter: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.contractDetails',
		endpoint: generatedDocEndpoints.certcentralApi.contractDetails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/contract',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.createAuthKey',
		endpoint: generatedDocEndpoints.certcentralApi.createAuthKey,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/auth-key',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.deleteAuthKey',
		endpoint: generatedDocEndpoints.certcentralApi.deleteAuthKey,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/auth-key',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.deleteCustomField',
		endpoint: generatedDocEndpoints.certcentralApi.deleteCustomField,
		input: {
			path: { metadata_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/metadata/{metadata_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.deleteOidcSsoConfiguration',
		endpoint: generatedDocEndpoints.certcentralApi.deleteOidcSsoConfiguration,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.editCustomField',
		endpoint: generatedDocEndpoints.certcentralApi.editCustomField,
		input: {
			path: { metadata_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { label: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/metadata/{metadata_id}',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.guestAccessUrl',
		endpoint: generatedDocEndpoints.certcentralApi.guestAccessUrl,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/guest-access',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.inviteDetails',
		endpoint: generatedDocEndpoints.certcentralApi.inviteDetails,
		input: {
			path: { invite_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{invite_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listAuthKeys',
		endpoint: generatedDocEndpoints.certcentralApi.listAuthKeys,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/auth-keys',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listCustomFields',
		endpoint: generatedDocEndpoints.certcentralApi.listCustomFields,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/metadata',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listInvites',
		endpoint: generatedDocEndpoints.certcentralApi.listInvites,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/invite',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.moveOrders',
		endpoint: generatedDocEndpoints.certcentralApi.moveOrders,
		input: {
			path: { target_account_id: 1 },
			query: {},
			headers: {},
			cookies: {},
			body: { order_ids: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/move-orders/{target_account_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.oidcSsoConfigurationDetails',
		endpoint: generatedDocEndpoints.certcentralApi.oidcSsoConfigurationDetails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.resendInvite',
		endpoint: generatedDocEndpoints.certcentralApi.resendInvite,
		input: {
			path: { invite_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/invite/{invite_id}/send',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.samlEntityDetails',
		endpoint: generatedDocEndpoints.certcentralApi.samlEntityDetails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/saml-entity',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.sendInvite',
		endpoint: generatedDocEndpoints.certcentralApi.sendInvite,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { emails: [], subaccount_type: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/invite',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.updateAccountEmails',
		endpoint: generatedDocEndpoints.certcentralApi.updateAccountEmails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/account', method: 'PUT' },
	},
	{
		id: 'certcentralApi.updateAccountNotificationSettings',
		endpoint:
			generatedDocEndpoints.certcentralApi.updateAccountNotificationSettings,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { account_settings: [], name: 'fixture', value: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/settings',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateInviteStatus',
		endpoint: generatedDocEndpoints.certcentralApi.updateInviteStatus,
		input: {
			path: { invite_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { status: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/invite/{invite_id}/status',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateOidcSsoConfiguration',
		endpoint: generatedDocEndpoints.certcentralApi.updateOidcSsoConfiguration,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				provider_url: 'fixture',
				client_id: 'fixture',
				client_secret: 'fixture',
				friendly_name: 'fixture',
				scope_parameter: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/sso/oidc/entity',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateSamlEntity',
		endpoint: generatedDocEndpoints.certcentralApi.updateSamlEntity,
		input: {
			path: { entity_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { attribute_mapping: 'fixture', friendly_name: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/saml-entity/{entity_id}',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.acmeExternalAccountBinding',
		endpoint: generatedDocEndpoints.certcentralApi.acmeExternalAccountBinding,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				name: 'fixture',
				product_name_id: 'fixture',
				validity_years: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/key/acme-eab/tlm',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.createKey',
		endpoint: generatedDocEndpoints.certcentralApi.createKey,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/key/user/{user_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.editKey',
		endpoint: generatedDocEndpoints.certcentralApi.editKey,
		input: {
			path: { key_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'fixture' },
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/key/{key_id}', method: 'PUT' },
	},
	{
		id: 'certcentralApi.getKeyInfo',
		endpoint: generatedDocEndpoints.certcentralApi.getKeyInfo,
		input: { path: { key_id: 'fixture' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/key/{key_id}', method: 'GET' },
	},
	{
		id: 'certcentralApi.listApiAccessRoles',
		endpoint: generatedDocEndpoints.certcentralApi.listApiAccessRoles,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/key/api-roles', method: 'GET' },
	},
	{
		id: 'certcentralApi.listKeys',
		endpoint: generatedDocEndpoints.certcentralApi.listKeys,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/key', method: 'GET' },
	},
	{
		id: 'certcentralApi.updateAcmeRestrictions',
		endpoint: generatedDocEndpoints.certcentralApi.updateAcmeRestrictions,
		input: { path: { key_id: 'fixture' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/key/{key_id}/restrictions',
			method: 'PATCH',
		},
	},
	{
		id: 'certcentralApi.updateKeyStatus',
		endpoint: generatedDocEndpoints.certcentralApi.updateKeyStatus,
		input: {
			path: { key_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { status: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/key/{key_id}/status',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.checkPermission',
		endpoint: generatedDocEndpoints.certcentralApi.checkPermission,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/authorization/view_orders',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.containerPermissions',
		endpoint: generatedDocEndpoints.certcentralApi.containerPermissions,
		input: {
			path: { permission: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/authorization/{permission}/container',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listPermissions',
		endpoint: generatedDocEndpoints.certcentralApi.listPermissions,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/authorization', method: 'GET' },
	},
	{
		id: 'certcentralApi.addNote',
		endpoint: generatedDocEndpoints.certcentralApi.addNote,
		input: {
			path: { certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { text: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_id}/note',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.archiveCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.archiveCertificate,
		input: {
			path: { certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_id}/archive',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.certificateChain',
		endpoint: generatedDocEndpoints.certcentralApi.certificateChain,
		input: {
			path: { certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_id}/chain',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.downloadCertificateByFormatOrderId',
		endpoint:
			generatedDocEndpoints.certcentralApi.downloadCertificateByFormatOrderId,
		input: {
			path: { order_id: 'fixture', format_type: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/download/order/{order_id}/format/{format_type}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.downloadCertificateByFormat',
		endpoint: generatedDocEndpoints.certcentralApi.downloadCertificateByFormat,
		input: {
			path: { certificate_id: 'fixture', format_type: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_id}/download/format/{format_type}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.downloadCertificateOrderId',
		endpoint: generatedDocEndpoints.certcentralApi.downloadCertificateOrderId,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/download/order/{order_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.emailCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.emailCertificate,
		input: {
			path: { certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { emails: [], certificate_collect_format: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_id}/sendemail',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.listCertificateNotes',
		endpoint: generatedDocEndpoints.certcentralApi.listCertificateNotes,
		input: {
			path: { certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_id}/note',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.restoreCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.restoreCertificate,
		input: {
			path: { certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_id}/unarchive',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.revokeCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.revokeCertificate,
		input: {
			path: { certificate_identifier: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/certificate/{certificate_identifier}/revoke',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.activateContainer',
		endpoint: generatedDocEndpoints.certcentralApi.activateContainer,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/activate',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.containerInfo',
		endpoint: generatedDocEndpoints.certcentralApi.containerInfo,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.createContainer',
		endpoint: generatedDocEndpoints.certcentralApi.createContainer,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/children',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.deactivateContainer',
		endpoint: generatedDocEndpoints.certcentralApi.deactivateContainer,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/deactivate',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.editContainer',
		endpoint: generatedDocEndpoints.certcentralApi.editContainer,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { name: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.listChildContainers',
		endpoint: generatedDocEndpoints.certcentralApi.listChildContainers,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/children',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listContainerOrganizations',
		endpoint: generatedDocEndpoints.certcentralApi.listContainerOrganizations,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/order/organization',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listContainerRoles',
		endpoint: generatedDocEndpoints.certcentralApi.listContainerRoles,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/role',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listContainers',
		endpoint: generatedDocEndpoints.certcentralApi.listContainers,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/container', method: 'GET' },
	},
	{
		id: 'certcentralApi.listTemplates',
		endpoint: generatedDocEndpoints.certcentralApi.listTemplates,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/template',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.parentContainerInfo',
		endpoint: generatedDocEndpoints.certcentralApi.parentContainerInfo,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/parent',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.productLimits',
		endpoint: generatedDocEndpoints.certcentralApi.productLimits,
		input: {
			path: { 'container-id': 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container-id}/product-limits',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.templateInfo',
		endpoint: generatedDocEndpoints.certcentralApi.templateInfo,
		input: {
			path: { container_id: 'fixture', template_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/template/{template_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.updateAllowedDomains',
		endpoint: generatedDocEndpoints.certcentralApi.updateAllowedDomains,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { allowed_domain_names: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/allowed-domain-names',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateOrganizationAssignments',
		endpoint:
			generatedDocEndpoints.certcentralApi.updateOrganizationAssignments,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { organization_id_assignments: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/organization-assignments',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateRenewalNotificationRecipients',
		endpoint:
			generatedDocEndpoints.certcentralApi.updateRenewalNotificationRecipients,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				name: 'fixture',
				value: 'fixture',
				allow_override: true,
				inheritable: true,
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/settings/additional_renewal_emails',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateUserAssignments',
		endpoint: generatedDocEndpoints.certcentralApi.updateUserAssignments,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { user_id_assignments: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/user-assignments',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.allowlistIssuingCertificateAuthority',
		endpoint:
			generatedDocEndpoints.certcentralApi.allowlistIssuingCertificateAuthority,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { issuer_brand: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/issuer-brand-settings',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.disableCtLogMonitoring',
		endpoint: generatedDocEndpoints.certcentralApi.disableCtLogMonitoring,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/disable',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.downloadCertificateSerialNumber',
		endpoint:
			generatedDocEndpoints.certcentralApi.downloadCertificateSerialNumber,
		input: {
			path: { order_id: 'fixture', serial_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/ct-cert/{serial_id}/',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.enableCtLogMonitoring',
		endpoint: generatedDocEndpoints.certcentralApi.enableCtLogMonitoring,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/enable',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.getAllowlistedIssuingCaBrandDetails',
		endpoint:
			generatedDocEndpoints.certcentralApi.getAllowlistedIssuingCaBrandDetails,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/issuer-brand-settings',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.getCtLogDetailsForACertificate',
		endpoint:
			generatedDocEndpoints.certcentralApi.getCtLogDetailsForACertificate,
		input: {
			path: { order_id: 'fixture', certificate_serial_number: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/cert-details/{certificate_serial_number}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.getCtLogMonitoringStatus',
		endpoint: generatedDocEndpoints.certcentralApi.getCtLogMonitoringStatus,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/status',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.getCtLogsOrderId',
		endpoint: generatedDocEndpoints.certcentralApi.getCtLogsOrderId,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/ctmonitor/{order_id}/details',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.activateDomainLocking',
		endpoint: generatedDocEndpoints.certcentralApi.activateDomainLocking,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/activate-domain-locking',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.activateDomain',
		endpoint: generatedDocEndpoints.certcentralApi.activateDomain,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/activate',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.addDomain',
		endpoint: generatedDocEndpoints.certcentralApi.addDomain,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				name: 'fixture',
				organization: {},
				id: 1,
				validations: [],
				type: 'fixture',
			},
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/domain', method: 'POST' },
	},
	{
		id: 'certcentralApi.changeDcvMethod',
		endpoint: generatedDocEndpoints.certcentralApi.changeDcvMethod,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { dcv_method: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/method',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.checkCaaDomainLock',
		endpoint: generatedDocEndpoints.certcentralApi.checkCaaDomainLock,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { account_token: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/caa',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.deactivateDomainLocking',
		endpoint: generatedDocEndpoints.certcentralApi.deactivateDomainLocking,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/deactivate-domain-locking',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.deactivateDomain',
		endpoint: generatedDocEndpoints.certcentralApi.deactivateDomain,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/deactivate',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.deleteDomain',
		endpoint: generatedDocEndpoints.certcentralApi.deleteDomain,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.domainEmails',
		endpoint: generatedDocEndpoints.certcentralApi.domainEmails,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/emails',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.domainInfo',
		endpoint: generatedDocEndpoints.certcentralApi.domainInfo,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.expiringDomainsCount',
		endpoint: generatedDocEndpoints.certcentralApi.expiringDomainsCount,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/expiration-count',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listDcvMethods',
		endpoint: generatedDocEndpoints.certcentralApi.listDcvMethods,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/dcv/method',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listDomains',
		endpoint: generatedDocEndpoints.certcentralApi.listDomains,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/domain', method: 'GET' },
	},
	{
		id: 'certcentralApi.ovEvSslCheckDcv',
		endpoint: generatedDocEndpoints.certcentralApi.ovEvSslCheckDcv,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/validate-token',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.ovEvSslGenerateDcvToken',
		endpoint: generatedDocEndpoints.certcentralApi.ovEvSslGenerateDcvToken,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/token',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.resendDcvEmail',
		endpoint: generatedDocEndpoints.certcentralApi.resendDcvEmail,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/dcv/emails',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.submitForValidation',
		endpoint: generatedDocEndpoints.certcentralApi.submitForValidation,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { validations: [], type: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/validation',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.validationDetails',
		endpoint: generatedDocEndpoints.certcentralApi.validationDetails,
		input: {
			path: { domain_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/{domain_id}/validation',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.validationTypes',
		endpoint: generatedDocEndpoints.certcentralApi.validationTypes,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/domain/validation-type',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listBalanceHistory',
		endpoint: generatedDocEndpoints.certcentralApi.listBalanceHistory,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/finance/balance-history',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listPurchaseHistory',
		endpoint: generatedDocEndpoints.certcentralApi.listPurchaseHistory,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/finance/purchase-history',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listReplacementBenefits',
		endpoint: generatedDocEndpoints.certcentralApi.listReplacementBenefits,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { domains: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/competitive-replacement/certificates',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.priceEstimate',
		endpoint: generatedDocEndpoints.certcentralApi.priceEstimate,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				dns_names: [],
				order_validity: {},
				years: 1,
				days: 1,
				validity_years: 1,
				product_name_id: 'fixture',
				country: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/finance/order-pricing',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.receiptInfo',
		endpoint: generatedDocEndpoints.certcentralApi.receiptInfo,
		input: {
			path: { receipt_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/finance/receipt/{receipt_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.transferFunds',
		endpoint: generatedDocEndpoints.certcentralApi.transferFunds,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { amount: 1, from_container_id: 1, to_container_id: 1 },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/finance/transfer',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.viewBalance',
		endpoint: generatedDocEndpoints.certcentralApi.viewBalance,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/finance/balance',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.voucherPriceEstimate',
		endpoint: generatedDocEndpoints.certcentralApi.voucherPriceEstimate,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				vouchers: [],
				product_name_id: 'fixture',
				quantity: 1,
				country: 'fixture',
				city: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/finance/voucher-pricing',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.addIpRestriction',
		endpoint: generatedDocEndpoints.certcentralApi.addIpRestriction,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { ip_address: 'fixture', ip_address_end: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/ip/rules',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.deleteIpRestriction',
		endpoint: generatedDocEndpoints.certcentralApi.deleteIpRestriction,
		input: {
			path: { container_id: 'fixture', rule_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/ip/rule/{rule_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.listIpRestrictions',
		endpoint: generatedDocEndpoints.certcentralApi.listIpRestrictions,
		input: {
			path: { container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/container/{container_id}/ip/rules',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.digiCertOrderId',
		endpoint: generatedDocEndpoints.certcentralApi.digiCertOrderId,
		input: {
			path: { legacy_order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/oem-migration/{legacy_order_id}/order-id',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.addNote_504f5354',
		endpoint: generatedDocEndpoints.certcentralApi.addNote_504f5354,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { text: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.additionalEmails',
		endpoint: generatedDocEndpoints.certcentralApi.additionalEmails,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { additional_emails: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/additional-emails',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.changeCtStatus',
		endpoint: generatedDocEndpoints.certcentralApi.changeCtStatus,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { disable_ct: true },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/ct-status',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.changeOrderContainer',
		endpoint: generatedDocEndpoints.certcentralApi.changeOrderContainer,
		input: {
			path: { order_id: 'fixture', container_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/move-to-container/{container_id}',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.deleteCustomField_44454c45',
		endpoint: generatedDocEndpoints.certcentralApi.deleteCustomField_44454c45,
		input: {
			path: { order_id: 'fixture', metadata_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-field/{metadata_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.deleteNoteDeleteNote',
		endpoint: generatedDocEndpoints.certcentralApi.deleteNoteDeleteNote,
		input: {
			path: { order_id: 'fixture', note_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note/{note_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.deleteOrderDeleteOrder',
		endpoint: generatedDocEndpoints.certcentralApi.deleteOrderDeleteOrder,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.deleteRenewalMessage',
		endpoint: generatedDocEndpoints.certcentralApi.deleteRenewalMessage,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-renewal-message',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.duplicateCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.duplicateCertificate,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/duplicate',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.dvSslChangeDcvMethod',
		endpoint: generatedDocEndpoints.certcentralApi.dvSslChangeDcvMethod,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { dcv_method: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/dcv-method',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.dvSslCheckDcv',
		endpoint: generatedDocEndpoints.certcentralApi.dvSslCheckDcv,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { dns_name: 'fixture', dcv_method: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/check-dcv',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.generateDcvToken',
		endpoint: generatedDocEndpoints.certcentralApi.generateDcvToken,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/dcv-random-value',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.dvSslResendEmails',
		endpoint: generatedDocEndpoints.certcentralApi.dvSslResendEmails,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { domain: 'fixture', email: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/resend-emails',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.editCustomFieldValue',
		endpoint: generatedDocEndpoints.certcentralApi.editCustomFieldValue,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { metadata_id: 1, value: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-field',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.editDomainsOnAPendingOrderOrReissue',
		endpoint:
			generatedDocEndpoints.certcentralApi.editDomainsOnAPendingOrderOrReissue,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { certificate: {} },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/dns-names',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.editGuestAccessOrder',
		endpoint: generatedDocEndpoints.certcentralApi.editGuestAccessOrder,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { enable_guest_access: 1 },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/guest-access',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.editNote',
		endpoint: generatedDocEndpoints.certcentralApi.editNote,
		input: {
			path: { order_id: 'fixture', note_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { text: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note/{note_id}',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.emailSiteSeal',
		endpoint: generatedDocEndpoints.certcentralApi.emailSiteSeal,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal/email-seal',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.emailValidationStatus',
		endpoint: generatedDocEndpoints.certcentralApi.emailValidationStatus,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/email-validation',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.getOrdersByAlternativeOrderId',
		endpoint:
			generatedDocEndpoints.certcentralApi.getOrdersByAlternativeOrderId,
		input: {
			path: { alternative_order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/alternate/{alternative_order_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.getVmcOrCmcLogo',
		endpoint: generatedDocEndpoints.certcentralApi.getVmcOrCmcLogo,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc/logo',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listDuplicates',
		endpoint: generatedDocEndpoints.certcentralApi.listDuplicates,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/duplicate',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listOrderNotes',
		endpoint: generatedDocEndpoints.certcentralApi.listOrderNotes,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listReissues',
		endpoint: generatedDocEndpoints.certcentralApi.listReissues,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/reissue',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.orderAatlNaturalPersonCertificate',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderAatlNaturalPersonCertificate,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				usage_designation: {},
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				csa_agreed_to: true,
				order_validity: {},
				years: 1,
				individual: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/aatl_np',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderAatlNaturalPersonInOrganisationCertificate',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderAatlNaturalPersonInOrganisationCertificate,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				usage_designation: {},
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				csa_agreed_to: true,
				order_validity: {},
				years: 1,
				individual: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				organization: {},
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/aatl_npo',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderAatlOrganizationEsealCertificate',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderAatlOrganizationEsealCertificate,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				usage_designation: {},
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				csa_agreed_to: true,
				order_validity: {},
				years: 1,
				requester: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/aatl_org',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderBasicEvOrderBasicEv',
		endpoint: generatedDocEndpoints.certcentralApi.orderBasicEvOrderBasicEv,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_basic',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderMultiYearPlanOrderMultiYearPlan',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderMultiYearPlanOrderMultiYearPlan,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_basic',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderBasicOv',
		endpoint: generatedDocEndpoints.certcentralApi.orderBasicOv,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_basic',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderClientCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.orderClientCertificate,
		input: {
			path: { client_certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				emails: [],
				signature_hash: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				id: 1,
				order_validity: {},
				years: 1,
				metadata_id: 1,
				value: 'fixture',
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{client_certificate_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderCodeSigningCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.orderCodeSigningCertificate,
		input: {
			path: { code_signing_certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				order_validity: {},
				years: 1,
				addr1: 'fixture',
				method: 'fixture',
				metadata_id: 1,
				value: 'fixture',
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{code_signing_certificate_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderCommonMarkCertificateCmc',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderCommonMarkCertificateCmc,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/mark_certificate',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderDocumentSigningCertificate',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderDocumentSigningCertificate,
		input: {
			path: { document_certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				name: 'fixture',
				addr1: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				subject: {},
				phone: 'fixture',
				metadata_id: 1,
				value: 'fixture',
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{document_certificate_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderDocumentSigningForEmployee',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderDocumentSigningForEmployee,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				usage_designation: {},
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				csa_agreed_to: true,
				subject: {},
				given_name: 'fixture',
				surname: 'fixture',
				job_title: 'fixture',
				phone: 'fixture',
				email: 'fixture',
				order_validity: {},
				years: 1,
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ds_org_individual',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderDocumentSigningForIndividual',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderDocumentSigningForIndividual,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				usage_designation: {},
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				csa_agreed_to: true,
				order_validity: {},
				years: 1,
				individual: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ds_individual',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderDocumentSigningForOrganization',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderDocumentSigningForOrganization,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				usage_designation: {},
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				csa_agreed_to: true,
				order_validity: {},
				years: 1,
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ds_org',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderDvSsl',
		endpoint: generatedDocEndpoints.certcentralApi.orderDvSsl,
		input: {
			path: { dv_ssl_certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				dns_name: 'fixture',
				email_domain: 'fixture',
				id: 1,
				metadata_id: 1,
				value: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				telephone: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{dv_ssl_certificate_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderEuQualifiedESealPsd2',
		endpoint: generatedDocEndpoints.certcentralApi.orderEuQualifiedESealPsd2,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				psp_roles: [],
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/eu_eseal_psd2',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderEuQualifiedESeal',
		endpoint: generatedDocEndpoints.certcentralApi.orderEuQualifiedESeal,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/eu_eseal',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderEuQualifiedPersonalOrganisation',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderEuQualifiedPersonalOrganisation,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				common_name_indictator: 'fixture',
				individual: {},
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				metadata_id: 1,
				value: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/eu_individual_org',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderEuQualifiedPersonal',
		endpoint: generatedDocEndpoints.certcentralApi.orderEuQualifiedPersonal,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				common_name_indicator: 'fixture',
				individual: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				country: 'fixture',
				state: 'fixture',
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				method: 'fixture',
				id: 1,
				metadata_id: 1,
				value: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/eu_individual',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderEuQualifiedWebsiteAuthenticationCertificate',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderEuQualifiedWebsiteAuthenticationCertificate,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/eu_qwac',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderEuQualifiedWebsiteAuthenticationPsd2Certificate',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderEuQualifiedWebsiteAuthenticationPsd2Certificate,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/eu_qwac_psd2',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderGeoTrustDvSsl',
		endpoint: generatedDocEndpoints.certcentralApi.orderGeoTrustDvSsl,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				dns_name: 'fixture',
				email_domain: 'fixture',
				id: 1,
				metadata_id: 1,
				value: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				telephone: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_dv_geotrust_flex',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderInfo',
		endpoint: generatedDocEndpoints.certcentralApi.orderInfo,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.orderOvEvSslOrderOvEvSsl',
		endpoint: generatedDocEndpoints.certcentralApi.orderOvEvSslOrderOvEvSsl,
		input: {
			path: { ssl_certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{ssl_certificate_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSecureSiteSslOrderSecureSiteSsl',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderSecureSiteSslOrderSecureSiteSsl,
		input: {
			path: { ssl_certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{ssl_certificate_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioAuthenticationOrEncryptionCitizen',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioAuthenticationOrEncryptionCitizen,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				ship_info: {},
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_burger',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationPerson',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioAuthenticationOrEncryptionOrganisationPerson,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_organisation_person',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioAuthenticationOrEncryptionOrganisationServices',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioAuthenticationOrEncryptionOrganisationServices,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_organisation_services',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioAuthenticationOrEncryptionPrivatePerson',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioAuthenticationOrEncryptionPrivatePerson,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_private_person',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioAuthenticationOrEncryptionPrivateProfessional',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioAuthenticationOrEncryptionPrivateProfessional,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_private_person_prof',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioAuthenticationOrEncryptionProfessional',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioAuthenticationOrEncryptionProfessional,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				cs_provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_organisation_person_prof',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioCitizenSigning',
		endpoint: generatedDocEndpoints.certcentralApi.orderPkioCitizenSigning,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_burger',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioPersonalOrganisationSigning',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderPkioPersonalOrganisationSigning,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_organisation_person',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioPrivatePersonSigningOrderPkioPrivatePersonSigning,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				individual: {},
				id: 1,
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_private_person',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderPkioPrivateProfessionalSigningOrderPkioPrivateProfessionalSigning,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				individual: {},
				id: 1,
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_private_person',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioPrivateServicesServer',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderPkioPrivateServicesServer,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				csr: 'fixture',
				csa_agreed_to: true,
				id: 1,
				organization: {},
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_private_services_server',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioProfessionalSigning',
		endpoint: generatedDocEndpoints.certcentralApi.orderPkioProfessionalSigning,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_organisation_person_prof',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPkioQualifiedESeal',
		endpoint: generatedDocEndpoints.certcentralApi.orderPkioQualifiedESeal,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				profile_option: 'fixture',
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/pkio_qualified_organisation_services',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderPrivateSsl',
		endpoint: generatedDocEndpoints.certcentralApi.orderPrivateSsl,
		input: {
			path: { private_ssl_certificate_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{private_ssl_certificate_id}',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSecureEmailCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.orderSecureEmailCertificate,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				emails: [],
				usage_designation: {},
				signature_hash: 'fixture',
				order_validity: {},
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/secure_email_mailbox',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSecureSiteEv',
		endpoint: generatedDocEndpoints.certcentralApi.orderSecureSiteEv,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_securesite_flex',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSecureSiteOv',
		endpoint: generatedDocEndpoints.certcentralApi.orderSecureSiteOv,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_securesite_flex',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSecureSiteProEvSsl',
		endpoint: generatedDocEndpoints.certcentralApi.orderSecureSiteProEvSsl,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_ev_securesite_pro',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSecureSiteProSsl',
		endpoint: generatedDocEndpoints.certcentralApi.orderSecureSiteProSsl,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl_securesite_pro',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSslTypeHint',
		endpoint: generatedDocEndpoints.certcentralApi.orderSslTypeHint,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				order_validity: {},
				years: 1,
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				id: 1,
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/ssl',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSwissClientAuthenticationCertificate',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderSwissClientAuthenticationCertificate,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				emails: [],
				signature_hash: 'fixture',
				id: 1,
				csa_agreed_to: true,
				order_validity: {},
				years: 1,
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/dtm_client_authentication_ch',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSwissQualifiedCertificateForIndividualInOrganisation',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderSwissQualifiedCertificateForIndividualInOrganisation,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				requester: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				job_title: 'fixture',
				organization: {},
				id: 1,
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/swiss_qualified_individual_organisation',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSwissQualifiedCertificateForIndividual',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderSwissQualifiedCertificateForIndividual,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				requester: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				job_title: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/swiss_qualified_individual',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSwissRegulatedCertificateForIndividualInOrganisation',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderSwissRegulatedCertificateForIndividualInOrganisation,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				individual: {},
				id: 1,
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				requester: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				job_title: 'fixture',
				organization: {},
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/swiss_regulated_individual_organisation',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSwissRegulatedCertificateForIndividual',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderSwissRegulatedCertificateForIndividual,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				individual: {},
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				requester: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				job_title: 'fixture',
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/swiss_regulated_individual',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderSwissRegulatedCertificateForOrganisation',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.orderSwissRegulatedCertificateForOrganisation,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				id: 1,
				csa_agreed_to: true,
				provisioning_method: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				addr2: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
				requester: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				telephone: 'fixture',
				job_title: 'fixture',
				organization: {},
				contacts: [],
				payment_method: 'fixture',
				credit_card: {},
				number: 'fixture',
				expiration_month: 'fixture',
				expiration_year: 'fixture',
				cvv: 'fixture',
				cardholder_name: 'fixture',
				set_as_default: 'fixture',
				address: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/swiss_regulated_organisation',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderVerifiedMarkCertificateVmc',
		endpoint:
			generatedDocEndpoints.certcentralApi.orderVerifiedMarkCertificateVmc,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				metadata_id: 1,
				value: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/vmc_basic',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderX9PkiForTls',
		endpoint: generatedDocEndpoints.certcentralApi.orderX9PkiForTls,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				common_name: 'fixture',
				csr: 'fixture',
				signature_hash: 'fixture',
				id: 1,
				csa_agreed_to: true,
				organization: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				order_validity: {},
				years: 1,
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/x9_pki',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.purchaseKeyLockerSignatures',
		endpoint: generatedDocEndpoints.certcentralApi.purchaseKeyLockerSignatures,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { signature_units: 1, payment_method: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/buy-keylocker-signature-unit',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.reissueCertificate',
		endpoint: generatedDocEndpoints.certcentralApi.reissueCertificate,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				certificate: {},
				signature_hash: 'fixture',
				name: 'fixture',
				addr1: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				country: 'fixture',
				method: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/reissue',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.resendOrderApprovalEmail',
		endpoint: generatedDocEndpoints.certcentralApi.resendOrderApprovalEmail,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { emails: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/order-approval/resend-emails',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.revokeOrderCertificates',
		endpoint: generatedDocEndpoints.certcentralApi.revokeOrderCertificates,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/revoke',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.siteSealSettings',
		endpoint: generatedDocEndpoints.certcentralApi.siteSealSettings,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.statusChangeList',
		endpoint: generatedDocEndpoints.certcentralApi.statusChangeList,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/status-changes',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.updateAutoReissueSettings',
		endpoint: generatedDocEndpoints.certcentralApi.updateAutoReissueSettings,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { auto_reissue: 1 },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/auto-reissue',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateCsr',
		endpoint: generatedDocEndpoints.certcentralApi.updateCsr,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { csr: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/csr',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.updateOrderContacts',
		endpoint: generatedDocEndpoints.certcentralApi.updateOrderContacts,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				contacts: [],
				contact_type: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/contact',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateOrderStatus',
		endpoint: generatedDocEndpoints.certcentralApi.updateOrderStatus,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { status: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/status',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateRenewalMessage',
		endpoint: generatedDocEndpoints.certcentralApi.updateRenewalMessage,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/custom-renewal-message',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateRenewalNotificationSettings',
		endpoint:
			generatedDocEndpoints.certcentralApi.updateRenewalNotificationSettings,
		input: {
			path: { order_id: 'fixture', status: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/renewal-emails/{status}',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateSiteSealSettings',
		endpoint: generatedDocEndpoints.certcentralApi.updateSiteSealSettings,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateVmcOrCmcOrders',
		endpoint: generatedDocEndpoints.certcentralApi.updateVmcOrCmcOrders,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.uploadSiteSealLogo',
		endpoint: generatedDocEndpoints.certcentralApi.uploadSiteSealLogo,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/site-seal/logo',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.uploadVmcOrCmcLogoEncoded',
		endpoint: generatedDocEndpoints.certcentralApi.uploadVmcOrCmcLogoEncoded,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc/encoded-logo',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.uploadVmcOrCmcLogoSvg',
		endpoint: generatedDocEndpoints.certcentralApi.uploadVmcOrCmcLogoSvg,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/vmc/logo',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.orderValidationStatus',
		endpoint: generatedDocEndpoints.certcentralApi.orderValidationStatus,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/validation',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.viewKeyLockerSignatures',
		endpoint: generatedDocEndpoints.certcentralApi.viewKeyLockerSignatures,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/signature-unit',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.viewNote',
		endpoint: generatedDocEndpoints.certcentralApi.viewNote,
		input: {
			path: { order_id: 'fixture', note_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/order/certificate/{order_id}/note/{note_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.activateOrganization',
		endpoint: generatedDocEndpoints.certcentralApi.activateOrganization,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}/activate',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.createOrganization',
		endpoint: generatedDocEndpoints.certcentralApi.createOrganization,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				name: 'fixture',
				country: 'fixture',
				address: 'fixture',
				city: 'fixture',
				state: 'fixture',
				zip: 'fixture',
				telephone: 'fixture',
				organization_contact: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				type: 'fixture',
			},
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/organization', method: 'POST' },
	},
	{
		id: 'certcentralApi.deactivateOrganization',
		endpoint: generatedDocEndpoints.certcentralApi.deactivateOrganization,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}/deactivate',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.deleteOrganization',
		endpoint: generatedDocEndpoints.certcentralApi.deleteOrganization,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.listApprovers',
		endpoint: generatedDocEndpoints.certcentralApi.listApprovers,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/potential-approvers',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.organizationAndTechnicalContactInfo',
		endpoint:
			generatedDocEndpoints.certcentralApi.organizationAndTechnicalContactInfo,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}/contact',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.organizationInfo',
		endpoint: generatedDocEndpoints.certcentralApi.organizationInfo,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.recentOrganizations',
		endpoint: generatedDocEndpoints.certcentralApi.recentOrganizations,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/recent',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.submitForValidation_504f5354',
		endpoint: generatedDocEndpoints.certcentralApi.submitForValidation_504f5354,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { validations: [], type: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}/validation',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.updateOrganizationAndTechnicalContact',
		endpoint:
			generatedDocEndpoints.certcentralApi
				.updateOrganizationAndTechnicalContact,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { contacts: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}/contact',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.validationDetails_4745542f',
		endpoint: generatedDocEndpoints.certcentralApi.validationDetails_4745542f,
		input: {
			path: { organization_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/{organization_id}/validation',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.validationTypes_4745542f',
		endpoint: generatedDocEndpoints.certcentralApi.validationTypes_4745542f,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/organization/validation-type',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.certificateFormatMap',
		endpoint: generatedDocEndpoints.certcentralApi.certificateFormatMap,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/product/platform-certformat-mapping',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.pricingList',
		endpoint: generatedDocEndpoints.certcentralApi.pricingList,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/product/pricing',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.productInfo',
		endpoint: generatedDocEndpoints.certcentralApi.productInfo,
		input: {
			path: { name_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/product/{name_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.productList',
		endpoint: generatedDocEndpoints.certcentralApi.productList,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/product', method: 'GET' },
	},
	{
		id: 'certcentralApi.expiringOrdersAndCertificates',
		endpoint:
			generatedDocEndpoints.certcentralApi.expiringOrdersAndCertificates,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/report/order/expiring',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.orderReport',
		endpoint: generatedDocEndpoints.certcentralApi.orderReport,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/report/order', method: 'GET' },
	},
	{
		id: 'certcentralApi.requestSummary',
		endpoint: generatedDocEndpoints.certcentralApi.requestSummary,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/report/request', method: 'GET' },
	},
	{
		id: 'certcentralApi.listRequests',
		endpoint: generatedDocEndpoints.certcentralApi.listRequests,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/request', method: 'GET' },
	},
	{
		id: 'certcentralApi.requestInfo',
		endpoint: generatedDocEndpoints.certcentralApi.requestInfo,
		input: {
			path: { request_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/request/{request_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.updateCsrForAPendingReissueRequest',
		endpoint:
			generatedDocEndpoints.certcentralApi.updateCsrForAPendingReissueRequest,
		input: {
			path: { request_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/request/{request_id}/csr',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.updateRequestStatus',
		endpoint: generatedDocEndpoints.certcentralApi.updateRequestStatus,
		input: {
			path: { request_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { status: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/request/{request_id}/status',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.addOrRemoveFunds',
		endpoint: generatedDocEndpoints.certcentralApi.addOrRemoveFunds,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { amount: 1, transaction_type: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/balance',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.balanceDetails',
		endpoint: generatedDocEndpoints.certcentralApi.balanceDetails,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/balance',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.cancelUnitOrder',
		endpoint: generatedDocEndpoints.certcentralApi.cancelUnitOrder,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/units/order/{order_id}/cancel',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.createSubaccount',
		endpoint: generatedDocEndpoints.certcentralApi.createSubaccount,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				account_type: 'fixture',
				allowed_grandchildren: [],
				user: {},
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				organization: {},
				name: 'fixture',
				address: 'fixture',
				zip: 'fixture',
				city: 'fixture',
				state: 'fixture',
				country: 'fixture',
			},
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/account', method: 'POST' },
	},
	{
		id: 'certcentralApi.createUnitOrder',
		endpoint: generatedDocEndpoints.certcentralApi.createUnitOrder,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				unit_account_id: 1,
				bundle: [],
				product_name_id: 'fixture',
				units: 1,
			},
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/units/order', method: 'POST' },
	},
	{
		id: 'certcentralApi.editSubaccount',
		endpoint: generatedDocEndpoints.certcentralApi.editSubaccount,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.listSubaccountDomains',
		endpoint: generatedDocEndpoints.certcentralApi.listSubaccountDomains,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/domain',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listSubaccountOrders',
		endpoint: generatedDocEndpoints.certcentralApi.listSubaccountOrders,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/order',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listSubaccountOrganizations',
		endpoint: generatedDocEndpoints.certcentralApi.listSubaccountOrganizations,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/organization',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listSubaccountProductLimits',
		endpoint: generatedDocEndpoints.certcentralApi.listSubaccountProductLimits,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/product-limits',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listSubaccountProducts',
		endpoint: generatedDocEndpoints.certcentralApi.listSubaccountProducts,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/products',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listSubaccounts',
		endpoint: generatedDocEndpoints.certcentralApi.listSubaccounts,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listUnitOrders',
		endpoint: generatedDocEndpoints.certcentralApi.listUnitOrders,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/units/order', method: 'GET' },
	},
	{
		id: 'certcentralApi.setSubaccountProducts',
		endpoint: generatedDocEndpoints.certcentralApi.setSubaccountProducts,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { products: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/products',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.subaccountInfo',
		endpoint: generatedDocEndpoints.certcentralApi.subaccountInfo,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.subaccountOrderInfo',
		endpoint: generatedDocEndpoints.certcentralApi.subaccountOrderInfo,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/order/{order_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.subaccountReport',
		endpoint: generatedDocEndpoints.certcentralApi.subaccountReport,
		input: {
			path: { subaccount_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/account/subaccount/{subaccount_id}/report',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.unitOrderDetails',
		endpoint: generatedDocEndpoints.certcentralApi.unitOrderDetails,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/units/order/{order_id}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.addServiceUserAddServiceUser',
		endpoint: generatedDocEndpoints.certcentralApi.addServiceUserAddServiceUser,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { is_api_only: true, email: 'fixture', api_name: 'fixture' },
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/user', method: 'POST' },
	},
	{
		id: 'certcentralApi.addUserAddUser',
		endpoint: generatedDocEndpoints.certcentralApi.addUserAddUser,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				username: 'fixture',
				first_name: 'fixture',
				last_name: 'fixture',
				email: 'fixture',
				access_roles: [],
				container_id_assignments: [],
			},
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/user', method: 'POST' },
	},
	{
		id: 'certcentralApi.approveUserInvitation',
		endpoint: generatedDocEndpoints.certcentralApi.approveUserInvitation,
		input: {
			path: { invitation_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				status: 'fixture',
				requested_user: {},
				container_id_assignments: [],
				access_roles: [],
			},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/invite/{invitation_id}/status',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.changeUserRole',
		endpoint: generatedDocEndpoints.certcentralApi.changeUserRole,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { access_roles: [], id: 1 },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/{user_id}/role',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.createVerifiedContactDelegation',
		endpoint:
			generatedDocEndpoints.certcentralApi.createVerifiedContactDelegation,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { user_id: 1, delegated_verified_contact_id: 1 },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/delegation',
			method: 'POST',
		},
	},
	{
		id: 'certcentralApi.deleteUser',
		endpoint: generatedDocEndpoints.certcentralApi.deleteUser,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/{user_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.deleteVerifiedContactDelegation',
		endpoint:
			generatedDocEndpoints.certcentralApi.deleteVerifiedContactDelegation,
		input: {
			path: { delegation_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/delegation/{delegation_id}',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.editServiceUserEditServiceUser',
		endpoint:
			generatedDocEndpoints.certcentralApi.editServiceUserEditServiceUser,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { email: 'fixture' },
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/user/{user_id}', method: 'PUT' },
	},
	{
		id: 'certcentralApi.editUserEditUser',
		endpoint: generatedDocEndpoints.certcentralApi.editUserEditUser,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { email: 'fixture' },
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/user/{user_id}', method: 'PUT' },
	},
	{
		id: 'certcentralApi.listServiceUsers',
		endpoint: generatedDocEndpoints.certcentralApi.listServiceUsers,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/user/api-only', method: 'GET' },
	},
	{
		id: 'certcentralApi.listUserInvitations',
		endpoint: generatedDocEndpoints.certcentralApi.listUserInvitations,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/user/invite', method: 'GET' },
	},
	{
		id: 'certcentralApi.listVerifiedContactDelegations',
		endpoint:
			generatedDocEndpoints.certcentralApi.listVerifiedContactDelegations,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/delegation',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listVerifiedContactsThatCanDelegate',
		endpoint:
			generatedDocEndpoints.certcentralApi.listVerifiedContactsThatCanDelegate,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/delegation/verified-contacts',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.resendCreateUserEmail',
		endpoint: generatedDocEndpoints.certcentralApi.resendCreateUserEmail,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/{user_id}/resend-create-email',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.resendVerifiedContactDelegationEmail',
		endpoint:
			generatedDocEndpoints.certcentralApi.resendVerifiedContactDelegationEmail,
		input: {
			path: { delegation_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/delegation/{delegation_id}/resend',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.updateContainerAssignments',
		endpoint: generatedDocEndpoints.certcentralApi.updateContainerAssignments,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: { container_id_assignments: [] },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/{user_id}/container-assignments',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.userInfo',
		endpoint: generatedDocEndpoints.certcentralApi.userInfo,
		input: {
			path: { user_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/user/{user_id}', method: 'GET' },
	},
	{
		id: 'certcentralApi.usernameAvailability',
		endpoint: generatedDocEndpoints.certcentralApi.usernameAvailability,
		input: {
			path: { user_name: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/user/availability/{user_name}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.validateVmcOrCmcLogoFormatEncoded',
		endpoint:
			generatedDocEndpoints.certcentralApi.validateVmcOrCmcLogoFormatEncoded,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: { logo: 'fixture' },
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/util/validate-vmc-encoded-logo',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.validateVmcOrCmcLogoFormatSvg',
		endpoint:
			generatedDocEndpoints.certcentralApi.validateVmcOrCmcLogoFormatSvg,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/util/validate-vmc-logo',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.cancelVoucherCode',
		endpoint: generatedDocEndpoints.certcentralApi.cancelVoucherCode,
		input: { path: { id: 'fixture' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/voucher/{id}/cancel',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.createVoucherOrder',
		endpoint: generatedDocEndpoints.certcentralApi.createVoucherOrder,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				vouchers: [],
				product_name_id: 'fixture',
				quantity: 1,
				payment_method: 'fixture',
				number: 'fixture',
				expiration_month: 1,
				expiration_year: 1,
				cvv: 1,
				cardholder_name: 'fixture',
				address: 'fixture',
				city: 'fixture',
				country: 'fixture',
				name: 'fixture',
				organization_name: 'fixture',
				email: 'fixture',
			},
		},
		outputExample: {},
		expected: { family: 'certcentral', path: '/voucher', method: 'POST' },
	},
	{
		id: 'certcentralApi.getVoucherOrderDetails',
		endpoint: generatedDocEndpoints.certcentralApi.getVoucherOrderDetails,
		input: { path: { id: 'fixture' }, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/voucher/{id}', method: 'GET' },
	},
	{
		id: 'certcentralApi.listAllVoucherOrders',
		endpoint: generatedDocEndpoints.certcentralApi.listAllVoucherOrders,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: { family: 'certcentral', path: '/voucher', method: 'GET' },
	},
	{
		id: 'certcentralApi.listCodesForVoucherOrder',
		endpoint: generatedDocEndpoints.certcentralApi.listCodesForVoucherOrder,
		input: {
			path: { voucher_order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/voucher/{voucher_order_id}/download',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.listUsedVoucherCodes',
		endpoint: generatedDocEndpoints.certcentralApi.listUsedVoucherCodes,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/voucher/download/used-codes',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.disableScanning',
		endpoint: generatedDocEndpoints.certcentralApi.disableScanning,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/scan',
			method: 'DELETE',
		},
	},
	{
		id: 'certcentralApi.downloadResults',
		endpoint: generatedDocEndpoints.certcentralApi.downloadResults,
		input: {
			path: { order_id: 'fixture', domain_name: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/report/{domain_name}',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.enableScanning',
		endpoint: generatedDocEndpoints.certcentralApi.enableScanning,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/scan',
			method: 'PUT',
		},
	},
	{
		id: 'certcentralApi.getEnabledStatus',
		endpoint: generatedDocEndpoints.certcentralApi.getEnabledStatus,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/status',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.getNotificationSettings',
		endpoint: generatedDocEndpoints.certcentralApi.getNotificationSettings,
		input: {
			path: { order_id: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/notification-settings',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.getScanDetails',
		endpoint: generatedDocEndpoints.certcentralApi.getScanDetails,
		input: {
			path: { order_id: 'fixture' },
			query: { offset: 1, limit: 1 },
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/details',
			method: 'GET',
		},
	},
	{
		id: 'certcentralApi.rescanDomain',
		endpoint: generatedDocEndpoints.certcentralApi.rescanDomain,
		input: {
			path: { order_id: 'fixture', domain: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'certcentral',
			path: '/vulnerability-assessment/{order_id}/rescan/{domain}',
			method: 'PUT',
		},
	},
	{
		id: 'reportLibraryApi.createReport',
		endpoint: generatedDocEndpoints.reportLibraryApi.createReport,
		input: {
			path: {},
			query: {},
			headers: {},
			cookies: {},
			body: {
				display_name: 'fixture',
				schedule: { frequency: 'ON_DEMAND' },
				format: ['CSV'],
				report_metadata: { report_type: 'orders' },
			},
		},
		outputExample: {},
		expected: { family: 'reportLibrary', path: '/report', method: 'POST' },
	},
	{
		id: 'reportLibraryApi.deleteReportRun',
		endpoint: generatedDocEndpoints.reportLibraryApi.deleteReportRun,
		input: {
			path: { report_identifier: 'fixture', report_run_identifier: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'reportLibrary',
			path: '/report/{report_identifier}/{report_run_identifier}',
			method: 'DELETE',
		},
	},
	{
		id: 'reportLibraryApi.deleteReport',
		endpoint: generatedDocEndpoints.reportLibraryApi.deleteReport,
		input: {
			path: { report_identifier: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'reportLibrary',
			path: '/report/{report_identifier}',
			method: 'DELETE',
		},
	},
	{
		id: 'reportLibraryApi.deleteScheduledReport',
		endpoint: generatedDocEndpoints.reportLibraryApi.deleteScheduledReport,
		input: {
			path: { report_identifier: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'reportLibrary',
			path: '/report/scheduled/{report_identifier}',
			method: 'DELETE',
		},
	},
	{
		id: 'reportLibraryApi.downloadReport',
		endpoint: generatedDocEndpoints.reportLibraryApi.downloadReport,
		input: {
			path: {
				report_identifier: '00000000-0000-4000-8000-000000000001',
				report_run_identifier: '00000000-0000-4000-8000-000000000002',
			},
			query: { report_format: 'ZIP' },
			headers: {},
			cookies: {},
		},
		outputExample: [],
		expected: {
			family: 'reportLibrary',
			path: '/report/{report_identifier}/{report_run_identifier}/download',
			method: 'GET',
		},
	},
	{
		id: 'reportLibraryApi.editReport',
		endpoint: generatedDocEndpoints.reportLibraryApi.editReport,
		input: {
			path: { report_identifier: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
			body: {
				display_name: 'fixture',
				schedule: { frequency: 'ON_DEMAND' },
				format: ['CSV'],
				report_metadata: { report_type: 'orders' },
			},
		},
		outputExample: {},
		expected: {
			family: 'reportLibrary',
			path: '/report/{report_identifier}',
			method: 'PUT',
		},
	},
	{
		id: 'reportLibraryApi.getJsonReport',
		endpoint: generatedDocEndpoints.reportLibraryApi.getJsonReport,
		input: {
			path: { report_identifier: 'fixture', report_run_identifier: 'fixture' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'reportLibrary',
			path: '/report/{report_identifier}/{report_run_identifier}/json',
			method: 'GET',
		},
	},
	{
		id: 'reportLibraryApi.listColumns',
		endpoint: generatedDocEndpoints.reportLibraryApi.listColumns,
		input: { path: {}, query: {}, headers: {}, cookies: {} },
		outputExample: {},
		expected: {
			family: 'reportLibrary',
			path: '/report/types/orders/supported-columns',
			method: 'GET',
		},
	},
	{
		id: 'reportLibraryApi.startReportRun',
		endpoint: generatedDocEndpoints.reportLibraryApi.startReportRun,
		input: {
			path: { report_identifier: '00000000-0000-4000-8000-000000000001' },
			query: {},
			headers: {},
			cookies: {},
		},
		outputExample: {},
		expected: {
			family: 'reportLibrary',
			path: '/report/{report_identifier}/run',
			method: 'POST',
		},
	},
];

export const generatedDocEndpointCount = 282;

import { z } from 'zod';

// Generated from ShipEngine's official OpenAPI 3.0 contract (version 1.1.202604070904); provider descriptions/examples are intentionally omitted from runtime schemas.
const shipEngineSchema2 = z.union([z.literal('4x6'), z.literal('Letter')]);
const shipEngineSchema1 = shipEngineSchema2;
const shipEngineSchema0 = z
	.object({ default_label_layout: shipEngineSchema1.optional() })
	.strict();
const shipEngineSchema4 = z.number().int().min(0);
const shipEngineSchema5 = z.number().int().min(1);
const shipEngineSchema9 = z.string().url().min(1);
const shipEngineSchema8 = shipEngineSchema9;
const shipEngineSchema10 = z.string().min(1);
const shipEngineSchema7 = z
	.object({ href: shipEngineSchema8, type: shipEngineSchema10.optional() })
	.strict();
const shipEngineSchema11 = z
	.object({
		href: shipEngineSchema8.optional(),
		type: shipEngineSchema10.optional(),
	})
	.strict();
const shipEngineSchema6 = z
	.object({
		first: shipEngineSchema7,
		last: shipEngineSchema7,
		prev: shipEngineSchema11,
		next: shipEngineSchema11,
	})
	.strict();
const shipEngineSchema15 = z.string().min(4);
const shipEngineSchema14 = shipEngineSchema15;
const shipEngineSchema16 = z.string().min(1).max(50);
const shipEngineSchema17 = z.boolean();
const shipEngineSchema19 = z.union([
	z.literal('image/png'),
	z.literal('image/jpeg'),
]);
const shipEngineSchema18 = shipEngineSchema19;
const shipEngineSchema20 = z.string();
const shipEngineSchema22 = z
	.string()
	.datetime({ offset: true })
	.regex(
		new RegExp(
			'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[-+]\\d{2}:\\d{2})$',
		),
	);
const shipEngineSchema21 = shipEngineSchema22;
const shipEngineSchema13 = z
	.object({
		label_image_id: shipEngineSchema14.optional(),
		name: shipEngineSchema16.optional(),
		is_default: shipEngineSchema17.optional(),
		image_content_type: shipEngineSchema18.optional(),
		image_data: shipEngineSchema20.optional(),
		created_at: shipEngineSchema21.optional(),
		modified_at: shipEngineSchema21.optional(),
	})
	.strict();
const shipEngineSchema12 = z.array(shipEngineSchema13).min(0);
const shipEngineSchema3 = z
	.object({
		total: shipEngineSchema4,
		page: shipEngineSchema5,
		pages: shipEngineSchema4,
		links: shipEngineSchema6,
		images: shipEngineSchema12,
	})
	.strict();
const shipEngineSchema24 = z.string().min(1).max(50);
const shipEngineSchema25 = z.boolean();
const shipEngineSchema27 = z.union([
	z.literal('image/png'),
	z.literal('image/jpeg'),
]);
const shipEngineSchema26 = shipEngineSchema27;
const shipEngineSchema28 = z.string();
const shipEngineSchema23 = z
	.object({
		name: shipEngineSchema24,
		is_default: shipEngineSchema25.optional(),
		image_content_type: shipEngineSchema26,
		image_data: shipEngineSchema28,
	})
	.strict();
const shipEngineSchema29 = z
	.object({
		label_image_id: shipEngineSchema14.optional(),
		name: shipEngineSchema16.optional(),
		is_default: shipEngineSchema17.optional(),
		image_content_type: shipEngineSchema18.optional(),
		image_data: shipEngineSchema20.optional(),
		created_at: shipEngineSchema21.optional(),
		modified_at: shipEngineSchema21.optional(),
	})
	.strict();
const shipEngineSchema30 = z.string().min(4);
const shipEngineSchema31 = z
	.object({
		name: shipEngineSchema24.optional(),
		is_default: shipEngineSchema25,
		image_content_type: shipEngineSchema26.optional(),
		image_data: shipEngineSchema28.optional(),
	})
	.strict();
const shipEngineSchema32 = z.string().min(0).max(0);
const shipEngineSchema34 = z.string().min(1);
const shipEngineSchema36 = z.string().nullable();
const shipEngineSchema37 = z.string().min(1).nullable();
const shipEngineSchema39 = z.string().min(1);
const shipEngineSchema38 = shipEngineSchema39;
const shipEngineSchema41 = z.string().min(2).max(2);
const shipEngineSchema40 = shipEngineSchema41;
const shipEngineSchema43 = z.union([
	z.literal('unknown'),
	z.literal('yes'),
	z.literal('no'),
]);
const shipEngineSchema42 = shipEngineSchema43;
const shipEngineSchema35 = z
	.object({
		name: shipEngineSchema34.optional(),
		phone: shipEngineSchema34.optional(),
		email: shipEngineSchema36.optional(),
		company_name: shipEngineSchema37.optional(),
		address_line1: shipEngineSchema34.optional(),
		address_line2: shipEngineSchema37.optional(),
		address_line3: shipEngineSchema37.optional(),
		city_locality: shipEngineSchema34.optional(),
		state_province: shipEngineSchema34.optional(),
		postal_code: shipEngineSchema38.optional(),
		country_code: shipEngineSchema40.optional(),
		address_residential_indicator: shipEngineSchema42.optional(),
	})
	.strict();
const shipEngineSchema33 = z
	.object({ text: shipEngineSchema34, address: shipEngineSchema35.optional() })
	.strict();
const shipEngineSchema45 = z.number().min(0).max(1);
const shipEngineSchema47 = z.string().nullable();
const shipEngineSchema48 = z.string().min(1).nullable();
const shipEngineSchema50 = z.string().min(1);
const shipEngineSchema49 = shipEngineSchema50;
const shipEngineSchema52 = z.string().min(2).max(2);
const shipEngineSchema51 = shipEngineSchema52;
const shipEngineSchema54 = z.union([
	z.literal('unknown'),
	z.literal('yes'),
	z.literal('no'),
]);
const shipEngineSchema53 = shipEngineSchema54;
const shipEngineSchema46 = z
	.object({
		name: shipEngineSchema10.optional(),
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10.optional(),
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10.optional(),
		state_province: shipEngineSchema10.optional(),
		postal_code: shipEngineSchema49.optional(),
		country_code: shipEngineSchema51.optional(),
		address_residential_indicator: shipEngineSchema53.optional(),
	})
	.strict();
const shipEngineSchema57 = z.number().min(0).max(1);
const shipEngineSchema58 = z.record(z.string(), z.json());
const shipEngineSchema56 = z
	.object({
		type: shipEngineSchema10,
		score: shipEngineSchema57,
		text: shipEngineSchema10,
		start_index: shipEngineSchema4,
		end_index: shipEngineSchema4,
		result: shipEngineSchema58.optional(),
	})
	.strict();
const shipEngineSchema55 = z.array(shipEngineSchema56).min(0);
const shipEngineSchema44 = z
	.object({
		score: shipEngineSchema45,
		address: shipEngineSchema46,
		entities: shipEngineSchema55,
	})
	.strict();
const shipEngineSchema60 = z
	.object({
		name: shipEngineSchema34.optional(),
		phone: shipEngineSchema34.optional(),
		email: shipEngineSchema36.optional(),
		company_name: shipEngineSchema37.optional(),
		address_line1: shipEngineSchema34,
		address_line2: shipEngineSchema37.optional(),
		address_line3: shipEngineSchema37.optional(),
		city_locality: shipEngineSchema34,
		state_province: shipEngineSchema34,
		postal_code: shipEngineSchema38.optional(),
		country_code: shipEngineSchema40,
		address_residential_indicator: shipEngineSchema42.optional(),
	})
	.strict();
const shipEngineSchema59 = z.array(shipEngineSchema60);
const shipEngineSchema64 = z.union([
	z.literal('unverified'),
	z.literal('verified'),
	z.literal('warning'),
	z.literal('error'),
]);
const shipEngineSchema63 = shipEngineSchema64;
const shipEngineSchema65 = z
	.object({
		name: shipEngineSchema10,
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10,
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10,
		state_province: shipEngineSchema10,
		postal_code: shipEngineSchema49,
		country_code: shipEngineSchema51.optional(),
		address_residential_indicator: shipEngineSchema53.optional(),
	})
	.strict();
const shipEngineSchema66 = z
	.object({
		name: shipEngineSchema10,
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10,
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10,
		state_province: shipEngineSchema10,
		postal_code: shipEngineSchema49,
		country_code: shipEngineSchema51.optional(),
		address_residential_indicator: shipEngineSchema53.optional(),
	})
	.strict()
	.nullable();
const shipEngineSchema70 = z.union([
	z.literal('a1000'),
	z.literal('a1001'),
	z.literal('a1002'),
	z.literal('a1003'),
	z.literal('a1004'),
	z.literal('a1005'),
	z.literal('a1006'),
	z.literal('a1007'),
	z.literal('a1008'),
	z.literal('r1000'),
	z.literal('r1001'),
	z.literal('r1002'),
	z.literal('r1003'),
]);
const shipEngineSchema69 = shipEngineSchema70;
const shipEngineSchema71 = z.string().min(1);
const shipEngineSchema73 = z.union([
	z.literal('error'),
	z.literal('warning'),
	z.literal('info'),
]);
const shipEngineSchema72 = shipEngineSchema73;
const shipEngineSchema75 = z.union([
	z.literal('unsupported_country'),
	z.literal('non_supported_country'),
	z.literal('minimum_postal_code_verification_failed'),
	z.literal('street_does_not_match_unique_street_name'),
	z.literal('multiple_directionals'),
	z.literal('multiple_matches'),
	z.literal('suite_not_valid'),
	z.literal('suite_missing'),
	z.literal('incompatible_paired_labels'),
	z.literal('invalid_house_number'),
	z.literal('missing_house_number'),
	z.literal('invalid_box_number'),
	z.literal('invalid_charge_event'),
	z.literal('missing_box_number'),
	z.literal('missing_cmra_or_private_mail_box_number'),
	z.literal('suite_has_no_secondaries'),
	z.literal('postal_code_changed_or_added'),
	z.literal('state_province_changed_or_added'),
	z.literal('city_locality_changed_or_added'),
	z.literal('urbanization_changed'),
	z.literal('street_name_spelling_changed_or_added'),
	z.literal('street_name_type_changed_or_added'),
	z.literal('street_direction_changed_or_added'),
	z.literal('suite_type_changed_or_added'),
	z.literal('suite_unit_number_changed_or_added'),
	z.literal('double_dependent_locality_changed_or_added'),
	z.literal('subadministrative_area_changed_or_added'),
	z.literal('subnational_area_changed_or_added'),
	z.literal('po_box_changed_or_added'),
	z.literal('premise_type_changed_or_added'),
	z.literal('house_number_changed'),
	z.literal('organization_changed_or_added'),
	z.literal('partially_verified_to_state_level'),
	z.literal('partially_verified_to_city_level'),
	z.literal('partially_verified_to_street_level'),
	z.literal('partially_verified_to_premise_level'),
	z.literal('verified_to_state_level'),
	z.literal('verified_to_city_level'),
	z.literal('verified_to_street_level'),
	z.literal('verified_to_premise_level'),
	z.literal('verified_to_suite_level'),
	z.literal('coded_to_street_lavel'),
	z.literal('coded_to_neighborhood_level'),
	z.literal('coded_to_community_level'),
	z.literal('coded_to_state_level'),
	z.literal('coded_to_rooftop_level'),
	z.literal('coded_to_rooftop_interpolation_level'),
	z.literal('name_max_length_exceeded'),
	z.literal('phone_max_length_exceeded'),
	z.literal('company_name_max_length_exceeded'),
	z.literal('line1_min_max_length'),
	z.literal('line2_max_length_exceeded'),
	z.literal('line3_max_length_exceeded'),
	z.literal('city_locality_max_length_exceeded'),
	z.literal('state_province_max_length_exceeded'),
	z.literal('invalid_postal_code'),
	z.literal('country_invalid_length'),
	z.literal('address_not_found'),
]);
const shipEngineSchema74 = shipEngineSchema75.nullable();
const shipEngineSchema68 = z
	.object({
		code: shipEngineSchema69,
		message: shipEngineSchema71,
		type: shipEngineSchema72,
		detail_code: shipEngineSchema74,
	})
	.strict();
const shipEngineSchema67 = z.array(shipEngineSchema68);
const shipEngineSchema62 = z
	.object({
		status: shipEngineSchema63,
		original_address: shipEngineSchema65,
		matched_address: shipEngineSchema66,
		messages: shipEngineSchema67,
	})
	.strict();
const shipEngineSchema61 = z.array(shipEngineSchema62);
const shipEngineSchema76 = z.union([
	z.literal('open'),
	z.literal('queued'),
	z.literal('processing'),
	z.literal('completed'),
	z.literal('completed_with_errors'),
	z.literal('archived'),
	z.literal('notifying'),
	z.literal('invalid'),
]);
const shipEngineSchema77 = z.number().int().min(1);
const shipEngineSchema79 = z.union([z.literal('asc'), z.literal('desc')]);
const shipEngineSchema78 = shipEngineSchema79;
const shipEngineSchema80 = z.string().datetime({ offset: true });
const shipEngineSchema81 = z.union([
	z.literal('ship_date'),
	z.literal('processed_at'),
	z.literal('created_at'),
]);
const shipEngineSchema86 = z.union([
	z.literal('4x6'),
	z.literal('letter'),
	z.literal('A4'),
	z.literal('A6'),
]);
const shipEngineSchema85 = shipEngineSchema86;
const shipEngineSchema88 = z.union([
	z.literal('pdf'),
	z.literal('png'),
	z.literal('zpl'),
]);
const shipEngineSchema87 = shipEngineSchema88;
const shipEngineSchema90 = z
	.string()
	.min(1)
	.max(25)
	.regex(new RegExp('^se(-[a-z0-9]+)+$'));
const shipEngineSchema89 = shipEngineSchema90;
const shipEngineSchema91 = z.string().min(0);
const shipEngineSchema92 = z.string().min(0).nullable();
const shipEngineSchema93 = z.string().nullable();
const shipEngineSchema94 = shipEngineSchema22.nullable();
const shipEngineSchema95 = z.number().int().min(0);
const shipEngineSchema99 = z.union([
	z.literal('carrier'),
	z.literal('order_source'),
	z.literal('shipengine'),
]);
const shipEngineSchema98 = shipEngineSchema99;
const shipEngineSchema101 = z.union([
	z.literal('account_status'),
	z.literal('business_rules'),
	z.literal('validation'),
	z.literal('security'),
	z.literal('system'),
	z.literal('integrations'),
]);
const shipEngineSchema100 = shipEngineSchema101;
const shipEngineSchema103 = z.union([
	z.literal('auto_fund_not_supported'),
	z.literal('batch_cannot_be_modified'),
	z.literal('carrier_conflict'),
	z.literal('carrier_disconnected'),
	z.literal('carrier_not_connected'),
	z.literal('carrier_not_supported'),
	z.literal('confirmation_not_supported'),
	z.literal('default_warehouse_cannot_be_deleted'),
	z.literal('field_conflict'),
	z.literal('field_value_required'),
	z.literal('forbidden'),
	z.literal('identifier_conflict'),
	z.literal('identifiers_must_match'),
	z.literal('insufficient_funds'),
	z.literal('invalid_address'),
	z.literal('invalid_billing_plan'),
	z.literal('invalid_field_value'),
	z.literal('invalid_identifier'),
	z.literal('invalid_status'),
	z.literal('invalid_string_length'),
	z.literal('label_images_not_supported'),
	z.literal('meter_failure'),
	z.literal('order_source_not_active'),
	z.literal('rate_limit_exceeded'),
	z.literal('refresh_not_supported'),
	z.literal('request_body_required'),
	z.literal('return_label_not_supported'),
	z.literal('settings_not_supported'),
	z.literal('subscription_inactive'),
	z.literal('terms_not_accepted'),
	z.literal('tracking_not_supported'),
	z.literal('trial_expired'),
	z.literal('unauthorized'),
	z.literal('unknown'),
	z.literal('unspecified'),
	z.literal('verification_failure'),
	z.literal('warehouse_conflict'),
	z.literal('webhook_event_type_conflict'),
	z.literal('customs_items_required'),
	z.literal('incompatible_paired_labels'),
	z.literal('invalid_charge_event'),
	z.literal('invalid_object'),
	z.literal('no_rates_returned'),
	z.literal('file_not_found'),
	z.literal('shipping_rule_not_found'),
	z.literal('service_not_determined'),
	z.literal('funding_source_registration_in_progress'),
	z.literal('insurance_failure'),
	z.literal('funding_source_missing_configuration'),
	z.literal('funding_source_error'),
]);
const shipEngineSchema102 = shipEngineSchema103;
const shipEngineSchema105 = z
	.string()
	.regex(new RegExp('^[a-z0-9]+(_[a-z0-9]+)*$'));
const shipEngineSchema104 = shipEngineSchema105;
const shipEngineSchema106 = z.string();
const shipEngineSchema97 = z
	.object({
		error_source: shipEngineSchema98,
		error_type: shipEngineSchema100,
		error_code: shipEngineSchema102,
		message: shipEngineSchema71,
		carrier_id: shipEngineSchema89.optional(),
		carrier_code: shipEngineSchema104.optional(),
		field_name: shipEngineSchema106.optional(),
	})
	.strict();
const shipEngineSchema96 = z.array(shipEngineSchema97);
const shipEngineSchema107 = z
	.object({
		href: shipEngineSchema8.optional(),
		type: shipEngineSchema10.optional(),
	})
	.strict();
const shipEngineSchema108 = z
	.object({
		href: shipEngineSchema8.optional(),
		pdf: shipEngineSchema8.optional(),
		png: shipEngineSchema8.optional(),
		zpl: shipEngineSchema8.optional(),
	})
	.strict();
const shipEngineSchema109 = z
	.object({
		href: shipEngineSchema8.optional(),
		instructions: shipEngineSchema47.optional(),
		handoff_code: shipEngineSchema47.optional(),
	})
	.strict();
const shipEngineSchema111 = z.union([
	z.literal('open'),
	z.literal('queued'),
	z.literal('processing'),
	z.literal('completed'),
	z.literal('completed_with_errors'),
	z.literal('archived'),
	z.literal('notifying'),
	z.literal('invalid'),
]);
const shipEngineSchema110 = shipEngineSchema111;
const shipEngineSchema84 = z
	.object({
		label_layout: shipEngineSchema85,
		label_format: shipEngineSchema87,
		batch_id: shipEngineSchema89,
		batch_number: shipEngineSchema91,
		external_batch_id: shipEngineSchema92,
		batch_notes: shipEngineSchema93,
		created_at: shipEngineSchema21,
		processed_at: shipEngineSchema94,
		errors: shipEngineSchema95,
		process_errors: shipEngineSchema96,
		warnings: shipEngineSchema95,
		completed: shipEngineSchema95,
		forms: shipEngineSchema95,
		count: shipEngineSchema95,
		batch_shipments_url: shipEngineSchema11,
		batch_labels_url: shipEngineSchema11,
		batch_errors_url: shipEngineSchema107,
		label_download: shipEngineSchema108,
		form_download: shipEngineSchema107,
		paperless_download: shipEngineSchema109,
		status: shipEngineSchema110,
	})
	.strict();
const shipEngineSchema83 = z.array(shipEngineSchema84).min(0);
const shipEngineSchema112 = z.number().int().min(0);
const shipEngineSchema113 = z.number().int().min(1);
const shipEngineSchema114 = z
	.object({
		first: shipEngineSchema7,
		last: shipEngineSchema7,
		prev: shipEngineSchema11,
		next: shipEngineSchema11,
	})
	.strict();
const shipEngineSchema82 = z
	.object({
		batches: shipEngineSchema83,
		total: shipEngineSchema112,
		page: shipEngineSchema113,
		pages: shipEngineSchema113,
		links: shipEngineSchema114,
	})
	.strict();
const shipEngineSchema117 = z
	.string()
	.min(1)
	.max(25)
	.regex(new RegExp('^se(-[a-z0-9]+)+$'));
const shipEngineSchema116 = shipEngineSchema117;
const shipEngineSchema118 = z.array(shipEngineSchema116);
const shipEngineSchema120 = shipEngineSchema117;
const shipEngineSchema119 = z.array(shipEngineSchema120);
const shipEngineSchema123 = z
	.string()
	.datetime({ offset: true })
	.regex(
		new RegExp(
			'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[-+]\\d{2}:\\d{2})$',
		),
	);
const shipEngineSchema122 = shipEngineSchema123;
const shipEngineSchema125 = z.union([
	z.literal('4x6'),
	z.literal('letter'),
	z.literal('A4'),
	z.literal('A6'),
]);
const shipEngineSchema124 = shipEngineSchema125;
const shipEngineSchema127 = z.union([
	z.literal('pdf'),
	z.literal('png'),
	z.literal('zpl'),
]);
const shipEngineSchema126 = shipEngineSchema127;
const shipEngineSchema129 = z.union([
	z.literal('label'),
	z.literal('paperless'),
	z.literal('label_and_paperless'),
]);
const shipEngineSchema128 = shipEngineSchema129;
const shipEngineSchema121 = z
	.object({
		create_batch_and_process_labels: shipEngineSchema25.optional(),
		ship_date: shipEngineSchema122.optional(),
		label_layout: shipEngineSchema124.optional(),
		label_format: shipEngineSchema126.optional(),
		display_scheme: shipEngineSchema128.optional(),
	})
	.strict();
const shipEngineSchema115 = z.union([
	z
		.object({
			external_batch_id: shipEngineSchema116.optional(),
			batch_notes: shipEngineSchema34.optional(),
			shipment_ids: shipEngineSchema118.optional(),
			rate_ids: shipEngineSchema119.optional(),
		})
		.strict(),
	z
		.object({
			external_batch_id: shipEngineSchema116.optional(),
			batch_notes: shipEngineSchema34.optional(),
			shipment_ids: shipEngineSchema118.optional(),
			rate_ids: shipEngineSchema119.optional(),
			process_labels: shipEngineSchema121.optional(),
		})
		.strict(),
]);
const shipEngineSchema130 = z
	.object({
		label_layout: shipEngineSchema85,
		label_format: shipEngineSchema87,
		batch_id: shipEngineSchema89,
		batch_number: shipEngineSchema91,
		external_batch_id: shipEngineSchema92,
		batch_notes: shipEngineSchema93,
		created_at: shipEngineSchema21,
		processed_at: shipEngineSchema94,
		errors: shipEngineSchema95,
		process_errors: shipEngineSchema96,
		warnings: shipEngineSchema95,
		completed: shipEngineSchema95,
		forms: shipEngineSchema95,
		count: shipEngineSchema95,
		batch_shipments_url: shipEngineSchema11,
		batch_labels_url: shipEngineSchema11,
		batch_errors_url: shipEngineSchema107,
		label_download: shipEngineSchema108,
		form_download: shipEngineSchema107,
		paperless_download: shipEngineSchema109,
		status: shipEngineSchema110,
	})
	.strict();
const shipEngineSchema131 = z
	.object({
		shipment_ids: shipEngineSchema118.optional(),
		rate_ids: shipEngineSchema118.optional(),
	})
	.strict();
const shipEngineSchema135 = z.string();
const shipEngineSchema134 = z
	.object({
		error: shipEngineSchema71.optional(),
		shipment_id: shipEngineSchema89.optional(),
		external_shipment_id: shipEngineSchema135.optional(),
	})
	.strict();
const shipEngineSchema133 = z.array(shipEngineSchema134);
const shipEngineSchema132 = z
	.object({ errors: shipEngineSchema133, links: shipEngineSchema114 })
	.strict();
const shipEngineSchema136 = z
	.object({
		ship_date: shipEngineSchema122.optional(),
		label_layout: shipEngineSchema124.optional(),
		label_format: shipEngineSchema126.optional(),
		display_scheme: shipEngineSchema128.optional(),
	})
	.strict();
const shipEngineSchema140 = z.boolean();
const shipEngineSchema141 = z.number().min(0);
const shipEngineSchema142 = shipEngineSchema90.nullable();
const shipEngineSchema145 = shipEngineSchema90;
const shipEngineSchema146 = z.string().min(1);
const shipEngineSchema144 = z
	.object({
		carrier_id: shipEngineSchema89.optional(),
		carrier_code: shipEngineSchema145.optional(),
		service_code: shipEngineSchema146.optional(),
		name: shipEngineSchema146.optional(),
		domestic: shipEngineSchema140.optional(),
		international: shipEngineSchema140.optional(),
		is_multi_package_supported: shipEngineSchema140.optional(),
		is_return_supported: shipEngineSchema140.optional(),
	})
	.strict();
const shipEngineSchema143 = z.array(shipEngineSchema144);
const shipEngineSchema150 = z
	.string()
	.min(1)
	.max(50)
	.regex(new RegExp('^[a-z0-9]+(_[a-z0-9]+)*$'));
const shipEngineSchema149 = shipEngineSchema150;
const shipEngineSchema153 = z.union([
	z.literal('inch'),
	z.literal('centimeter'),
]);
const shipEngineSchema152 = shipEngineSchema153;
const shipEngineSchema154 = z.number().min(0);
const shipEngineSchema151 = z
	.object({
		unit: shipEngineSchema152,
		length: shipEngineSchema154,
		width: shipEngineSchema154,
		height: shipEngineSchema154,
	})
	.strict();
const shipEngineSchema148 = z
	.object({
		package_id: shipEngineSchema145.optional(),
		package_code: shipEngineSchema149,
		name: shipEngineSchema16,
		dimensions: shipEngineSchema151.optional(),
	})
	.strict();
const shipEngineSchema147 = z.array(shipEngineSchema148);
const shipEngineSchema156 = z
	.object({
		name: shipEngineSchema146.optional(),
		default_value: shipEngineSchema146.optional(),
	})
	.strict();
const shipEngineSchema155 = z.array(shipEngineSchema156);
const shipEngineSchema157 = z.union([
	z.literal('pending_approval'),
	z.literal('approved'),
]);
const shipEngineSchema139 = z
	.object({
		carrier_id: shipEngineSchema89.optional(),
		carrier_code: shipEngineSchema104.optional(),
		account_number: shipEngineSchema71.optional(),
		requires_funded_amount: shipEngineSchema140.optional(),
		balance: shipEngineSchema141.optional(),
		nickname: shipEngineSchema71.optional(),
		friendly_name: shipEngineSchema71.optional(),
		funding_source_id: shipEngineSchema142.optional(),
		primary: shipEngineSchema140.optional(),
		has_multi_package_supporting_services: shipEngineSchema140.optional(),
		allows_returns: shipEngineSchema140.optional(),
		supports_label_messages: shipEngineSchema140.optional(),
		disabled_by_billing_plan: shipEngineSchema140.optional(),
		services: shipEngineSchema143.optional(),
		packages: shipEngineSchema147.optional(),
		options: shipEngineSchema155.optional(),
		send_rates: shipEngineSchema140.optional(),
		supports_user_managed_rates: shipEngineSchema140.optional(),
		connection_status: shipEngineSchema157.optional(),
	})
	.strict();
const shipEngineSchema138 = z.array(shipEngineSchema139);
const shipEngineSchema159 = z
	.string()
	.uuid()
	.min(36)
	.max(36)
	.regex(
		new RegExp(
			'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
		),
	);
const shipEngineSchema158 = shipEngineSchema159;
const shipEngineSchema160 = z.array(shipEngineSchema97);
const shipEngineSchema137 = z
	.object({
		carriers: shipEngineSchema138,
		request_id: shipEngineSchema158,
		errors: shipEngineSchema160,
	})
	.strict();
const shipEngineSchema161 = z
	.object({
		carrier_id: shipEngineSchema89.optional(),
		carrier_code: shipEngineSchema104.optional(),
		account_number: shipEngineSchema71.optional(),
		requires_funded_amount: shipEngineSchema140.optional(),
		balance: shipEngineSchema141.optional(),
		nickname: shipEngineSchema71.optional(),
		friendly_name: shipEngineSchema71.optional(),
		funding_source_id: shipEngineSchema142.optional(),
		primary: shipEngineSchema140.optional(),
		has_multi_package_supporting_services: shipEngineSchema140.optional(),
		allows_returns: shipEngineSchema140.optional(),
		supports_label_messages: shipEngineSchema140.optional(),
		disabled_by_billing_plan: shipEngineSchema140.optional(),
		services: shipEngineSchema143.optional(),
		packages: shipEngineSchema147.optional(),
		options: shipEngineSchema155.optional(),
		send_rates: shipEngineSchema140.optional(),
		supports_user_managed_rates: shipEngineSchema140.optional(),
		connection_status: shipEngineSchema157.optional(),
	})
	.strict();
const shipEngineSchema163 = shipEngineSchema28;
const shipEngineSchema164 = z.number().min(0);
const shipEngineSchema162 = z
	.object({ currency: shipEngineSchema163, amount: shipEngineSchema164 })
	.strict();
const shipEngineSchema167 = shipEngineSchema20;
const shipEngineSchema166 = z
	.object({ currency: shipEngineSchema167, amount: shipEngineSchema154 })
	.strict();
const shipEngineSchema165 = z.object({ balance: shipEngineSchema166 }).strict();
const shipEngineSchema168 = z
	.object({ options: shipEngineSchema155.optional() })
	.strict();
const shipEngineSchema169 = z
	.object({ packages: shipEngineSchema147.optional() })
	.strict();
const shipEngineSchema170 = z
	.object({ services: shipEngineSchema143.optional() })
	.strict();
const shipEngineSchema171 = z.union([
	z.literal('access_worldwide'),
	z.literal('amazon_buy_shipping'),
	z.literal('amazon_shipping_uk'),
	z.literal('apc'),
	z.literal('asendia'),
	z.literal('australia_post'),
	z.literal('canada_post'),
	z.literal('dhl_ecommerce'),
	z.literal('dhl_express'),
	z.literal('dhl_express_au'),
	z.literal('dhl_express_ca'),
	z.literal('dhl_express_uk'),
	z.literal('dpd'),
	z.literal('endicia'),
	z.literal('fedex'),
	z.literal('fedex_uk'),
	z.literal('firstmile'),
	z.literal('imex'),
	z.literal('newgistics'),
	z.literal('ontrac'),
	z.literal('purolator_canada'),
	z.literal('royal_mail'),
	z.literal('rr_donnelley'),
	z.literal('seko'),
	z.literal('sendle'),
	z.literal('stamps_com'),
	z.literal('ups'),
	z.literal('lasership'),
]);
const shipEngineSchema174 = z.string().email().min(1);
const shipEngineSchema173 = shipEngineSchema174;
const shipEngineSchema176 = z.union([
	z.literal('none'),
	z.literal('return_service_requested'),
	z.literal('forwarding_service_requested'),
	z.literal('address_service_requested'),
	z.literal('change_service_requested'),
	z.literal('leave_if_no_response'),
]);
const shipEngineSchema175 = shipEngineSchema176;
const shipEngineSchema177 = z.string();
const shipEngineSchema178 = z.string();
const shipEngineSchema179 = z.number().int().min(0);
const shipEngineSchema172 = z.union([
	z
		.object({
			nickname: shipEngineSchema34,
			username: shipEngineSchema34,
			password: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			merchant_seller_id: shipEngineSchema34,
			mws_auth_token: shipEngineSchema34,
			email: shipEngineSchema173,
		})
		.strict(),
	z
		.object({ nickname: shipEngineSchema34, auth_code: shipEngineSchema34 })
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			username: shipEngineSchema34,
			password: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			account_number: shipEngineSchema34,
			username: shipEngineSchema34,
			password: shipEngineSchema34,
			api_key: shipEngineSchema34,
			processing_location: shipEngineSchema34,
			sub_account_number: shipEngineSchema34.optional(),
		})
		.strict(),
	z
		.object({
			account_number: shipEngineSchema34,
			api_key: shipEngineSchema34,
			api_secret: shipEngineSchema34,
			nickname: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			api_key: shipEngineSchema34,
			api_secret: shipEngineSchema34,
			account_number: shipEngineSchema34,
			contract_id: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			client_id: shipEngineSchema34,
			username: shipEngineSchema34,
			password: shipEngineSchema34,
			pickup_number: shipEngineSchema34,
			distribution_center: shipEngineSchema34,
			api_key: shipEngineSchema34.optional(),
			api_secret: shipEngineSchema34.optional(),
			ancillary_endorsement: shipEngineSchema175.optional(),
			account_number: shipEngineSchema34.optional(),
			ftp_username: shipEngineSchema34.optional(),
			ftp_password: shipEngineSchema34.optional(),
			sold_to: shipEngineSchema28.optional(),
			registration_id: shipEngineSchema28.optional(),
			software_name: shipEngineSchema28.optional(),
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			account_number: shipEngineSchema34,
			site_id: shipEngineSchema34.optional(),
			password: shipEngineSchema34.optional(),
			country_code: shipEngineSchema40.optional(),
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			account_number: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			account_number: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			account_number: shipEngineSchema34,
			site_id: shipEngineSchema116,
			password: shipEngineSchema34,
			nickname: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			account_number: shipEngineSchema34,
			password: shipEngineSchema34,
			nickname: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			account: shipEngineSchema34,
			passphrase: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			account_number: shipEngineSchema34,
			address1: shipEngineSchema34,
			address2: shipEngineSchema34.optional(),
			city: shipEngineSchema34,
			company: shipEngineSchema34.optional(),
			country_code: shipEngineSchema34,
			email: shipEngineSchema173,
			first_name: shipEngineSchema34,
			last_name: shipEngineSchema34,
			phone: shipEngineSchema34,
			postal_code: shipEngineSchema34,
			state: shipEngineSchema34,
			nickname: shipEngineSchema34,
			agree_to_eula: shipEngineSchema25,
			meter_number: shipEngineSchema34.optional(),
		})
		.strict(),
	z
		.object({
			account_number: shipEngineSchema34,
			address1: shipEngineSchema34,
			address2: shipEngineSchema34.optional(),
			city: shipEngineSchema34,
			company: shipEngineSchema34.optional(),
			country_code: shipEngineSchema34,
			email: shipEngineSchema173,
			first_name: shipEngineSchema34,
			last_name: shipEngineSchema34,
			phone: shipEngineSchema34,
			postal_code: shipEngineSchema34,
			state: shipEngineSchema34,
			nickname: shipEngineSchema34,
			agree_to_eula: shipEngineSchema25,
			meter_number: shipEngineSchema34.optional(),
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			mailer_id: shipEngineSchema116,
			profile_name: shipEngineSchema34.optional(),
			password: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			username: shipEngineSchema34,
			password: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			web_services_id: shipEngineSchema34,
			web_services_key: shipEngineSchema34,
			customer_branch: shipEngineSchema34,
			Address: shipEngineSchema177,
			Address2: shipEngineSchema177.optional(),
			PostalCode: shipEngineSchema177,
			City: shipEngineSchema177,
			State: shipEngineSchema177,
			country: shipEngineSchema177.optional(),
			Phone: shipEngineSchema177.optional(),
			Email: shipEngineSchema177.optional(),
			instructions: shipEngineSchema177.optional(),
			facility_code: shipEngineSchema177.optional(),
			lasership_critical_pull_time: shipEngineSchema177,
			lasership_critical_entry_time: shipEngineSchema177,
			declare_piece_attributes_separately_for_every_shipment:
				shipEngineSchema178.optional(),
			AttrAlcohol: shipEngineSchema178.optional(),
			AttrDryIce: shipEngineSchema178.optional(),
			AttrHazmat: shipEngineSchema178.optional(),
			AttrTwoPersons: shipEngineSchema178.optional(),
			AttrExplosive: shipEngineSchema178.optional(),
			AttrControlledSubstance: shipEngineSchema178.optional(),
			AttrRefrigerated: shipEngineSchema178.optional(),
			AttrPerishable: shipEngineSchema178.optional(),
			AttrNoRTS: shipEngineSchema178.optional(),
		})
		.strict(),
	z
		.object({
			merchant_id: shipEngineSchema179.optional(),
			mailer_id: shipEngineSchema179.optional(),
			induction_site: shipEngineSchema34,
			nickname: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			account_number: shipEngineSchema34,
			password: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			account_number: shipEngineSchema34,
			activation_key: shipEngineSchema34,
			nickname: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			account_number: shipEngineSchema34,
			oba_email: shipEngineSchema173.optional(),
			contact_name: shipEngineSchema34,
			email: shipEngineSchema173.optional(),
			company_name: shipEngineSchema34.optional(),
			street_line1: shipEngineSchema34.optional(),
			street_line2: shipEngineSchema34.optional(),
			street_line3: shipEngineSchema34.optional(),
			city: shipEngineSchema34,
			postal_code: shipEngineSchema34,
			phone: shipEngineSchema34.optional(),
			nickname: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			username: shipEngineSchema34,
			password: shipEngineSchema34,
		})
		.strict(),
	z
		.object({ nickname: shipEngineSchema34, access_key: shipEngineSchema34 })
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			sendle_id: shipEngineSchema116,
			api_key: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			username: shipEngineSchema34,
			password: shipEngineSchema34,
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34,
			account_number: shipEngineSchema34,
			account_postal_code: shipEngineSchema34,
			account_country_code: shipEngineSchema34,
		})
		.strict(),
]);
const shipEngineSchema180 = z
	.object({ carrier_id: shipEngineSchema145 })
	.strict();
const shipEngineSchema181 = z.union([
	z.literal('dhl_express'),
	z.literal('fedex'),
	z.literal('newgistics'),
	z.literal('ups'),
]);
const shipEngineSchema184 = z.union([
	z.literal('none'),
	z.literal('regular_pickup'),
	z.literal('request_courier'),
	z.literal('drop_box'),
	z.literal('business_service_center'),
	z.literal('station'),
]);
const shipEngineSchema183 = shipEngineSchema184;
const shipEngineSchema186 = z.union([
	z.literal('none'),
	z.literal('allentown_pa'),
	z.literal('atlanta_ga'),
	z.literal('baltimore_md'),
	z.literal('charlotte_nc'),
	z.literal('chino_ca'),
	z.literal('dallas_tx'),
	z.literal('denver_co'),
	z.literal('detroit_mi'),
	z.literal('edison_nj'),
	z.literal('grove_city_oh'),
	z.literal('groveport_oh'),
	z.literal('houston_tx'),
	z.literal('indianapolis_in'),
	z.literal('kansas_city_ks'),
	z.literal('los_angeles_ca'),
	z.literal('martinsburg_wv'),
	z.literal('memphis_tn'),
	z.literal('minneapolis_mn'),
	z.literal('new_berlin_wi'),
	z.literal('northborough_ma'),
	z.literal('orlando_fl'),
	z.literal('phoneix_az'),
	z.literal('pittsburgh_pa'),
	z.literal('reno_nv'),
	z.literal('sacramento_ca'),
	z.literal('salt_lake_city_ut'),
	z.literal('seattle_wa'),
	z.literal('st_louis_mo'),
	z.literal('windsor_ct'),
	z.literal('newark_ny'),
	z.literal('south_brunswick_nj'),
	z.literal('scranton_pa'),
	z.literal('wheeling_il'),
	z.literal('middletown_ct'),
	z.literal('portland_or'),
]);
const shipEngineSchema185 = shipEngineSchema186;
const shipEngineSchema188 = z.union([
	z.literal('none'),
	z.literal('return_service_requested'),
	z.literal('forwarding_service_requested'),
	z.literal('address_service_requested'),
	z.literal('change_service_requested'),
	z.literal('leave_if_no_response'),
]);
const shipEngineSchema187 = shipEngineSchema188;
const shipEngineSchema190 = z.union([
	z.literal('daily_pickup'),
	z.literal('occasional_pickup'),
	z.literal('customer_counter'),
]);
const shipEngineSchema189 = shipEngineSchema190;
const shipEngineSchema191 = z.string().min(0);
const shipEngineSchema192 = z.string().min(5);
const shipEngineSchema194 = z.string().datetime({ offset: true }).min(1);
const shipEngineSchema193 = z
	.object({
		invoice_date: shipEngineSchema194.optional(),
		invoice_number: shipEngineSchema10.optional(),
		control_id: shipEngineSchema145.optional(),
		invoice_amount: shipEngineSchema154.optional(),
		invoice_currency_code: shipEngineSchema20.optional(),
	})
	.strict();
const shipEngineSchema182 = z.union([
	z
		.object({
			nickname: shipEngineSchema10.optional(),
			should_hide_account_number_on_archive_doc: shipEngineSchema17.optional(),
			is_primary_account: shipEngineSchema17.optional(),
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema10.optional(),
			pickup_type: shipEngineSchema183.optional(),
			smart_post_hub: shipEngineSchema185.optional(),
			smart_post_endorsement: shipEngineSchema187.optional(),
			is_primary_account: shipEngineSchema17.optional(),
			signature_image: shipEngineSchema20.optional(),
			letterhead_image: shipEngineSchema20.optional(),
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema10.optional(),
			is_primary_account: shipEngineSchema17.optional(),
			pickup_type: shipEngineSchema189.optional(),
			use_carbon_neutral_shipping_program: shipEngineSchema17.optional(),
			use_ground_freight_pricing: shipEngineSchema17.optional(),
			use_consolidation_services: shipEngineSchema17.optional(),
			use_order_number_on_mail_innovations_labels:
				shipEngineSchema17.optional(),
			mail_innovations_endorsement: shipEngineSchema187.optional(),
			mail_innovations_cost_center: shipEngineSchema191.optional(),
			use_negotiated_rates: shipEngineSchema17.optional(),
			account_postal_code: shipEngineSchema192.optional(),
			invoice: shipEngineSchema193.optional(),
		})
		.strict(),
]);
const shipEngineSchema197 = z.union([
	z.literal('none'),
	z.literal('regular_pickup'),
	z.literal('request_courier'),
	z.literal('drop_box'),
	z.literal('business_service_center'),
	z.literal('station'),
]);
const shipEngineSchema196 = shipEngineSchema197;
const shipEngineSchema199 = z.union([
	z.literal('none'),
	z.literal('allentown_pa'),
	z.literal('atlanta_ga'),
	z.literal('baltimore_md'),
	z.literal('charlotte_nc'),
	z.literal('chino_ca'),
	z.literal('dallas_tx'),
	z.literal('denver_co'),
	z.literal('detroit_mi'),
	z.literal('edison_nj'),
	z.literal('grove_city_oh'),
	z.literal('groveport_oh'),
	z.literal('houston_tx'),
	z.literal('indianapolis_in'),
	z.literal('kansas_city_ks'),
	z.literal('los_angeles_ca'),
	z.literal('martinsburg_wv'),
	z.literal('memphis_tn'),
	z.literal('minneapolis_mn'),
	z.literal('new_berlin_wi'),
	z.literal('northborough_ma'),
	z.literal('orlando_fl'),
	z.literal('phoneix_az'),
	z.literal('pittsburgh_pa'),
	z.literal('reno_nv'),
	z.literal('sacramento_ca'),
	z.literal('salt_lake_city_ut'),
	z.literal('seattle_wa'),
	z.literal('st_louis_mo'),
	z.literal('windsor_ct'),
	z.literal('newark_ny'),
	z.literal('south_brunswick_nj'),
	z.literal('scranton_pa'),
	z.literal('wheeling_il'),
	z.literal('middletown_ct'),
	z.literal('portland_or'),
]);
const shipEngineSchema198 = shipEngineSchema199;
const shipEngineSchema201 = z.union([
	z.literal('daily_pickup'),
	z.literal('occasional_pickup'),
	z.literal('customer_counter'),
]);
const shipEngineSchema200 = shipEngineSchema201;
const shipEngineSchema202 = z.string().min(0);
const shipEngineSchema203 = z.string().min(5);
const shipEngineSchema205 = z.string().datetime({ offset: true }).min(1);
const shipEngineSchema204 = z
	.object({
		invoice_date: shipEngineSchema205.optional(),
		invoice_number: shipEngineSchema34.optional(),
		control_id: shipEngineSchema116.optional(),
		invoice_amount: shipEngineSchema164.optional(),
		invoice_currency_code: shipEngineSchema28.optional(),
	})
	.strict();
const shipEngineSchema195 = z.union([
	z
		.object({
			nickname: shipEngineSchema34.optional(),
			should_hide_account_number_on_archive_doc: shipEngineSchema25.optional(),
			is_primary_account: shipEngineSchema25.optional(),
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34.optional(),
			pickup_type: shipEngineSchema196.optional(),
			smart_post_hub: shipEngineSchema198.optional(),
			smart_post_endorsement: shipEngineSchema175.optional(),
			is_primary_account: shipEngineSchema25.optional(),
			signature_image: shipEngineSchema28.optional(),
			letterhead_image: shipEngineSchema28.optional(),
		})
		.strict(),
	z
		.object({
			include_barcode_with_order_number: shipEngineSchema25.optional(),
			receive_email_on_manifest_processing: shipEngineSchema25.optional(),
		})
		.strict(),
	z
		.object({
			nickname: shipEngineSchema34.optional(),
			is_primary_account: shipEngineSchema25.optional(),
			pickup_type: shipEngineSchema200.optional(),
			use_carbon_neutral_shipping_program: shipEngineSchema25.optional(),
			use_ground_freight_pricing: shipEngineSchema25.optional(),
			use_consolidation_services: shipEngineSchema25.optional(),
			use_order_number_on_mail_innovations_labels:
				shipEngineSchema25.optional(),
			mail_innovations_endorsement: shipEngineSchema175.optional(),
			mail_innovations_cost_center: shipEngineSchema202.optional(),
			use_negotiated_rates: shipEngineSchema25.optional(),
			account_postal_code: shipEngineSchema203.optional(),
			invoice: shipEngineSchema204.optional(),
		})
		.strict(),
	z.object({ email: shipEngineSchema34.optional() }).strict(),
]);
const shipEngineSchema206 = z.record(z.string(), z.json());
const shipEngineSchema207 = z
	.object({ email: shipEngineSchema173, policy_id: shipEngineSchema34 })
	.strict();
const shipEngineSchema209 = z.literal('pdf');
const shipEngineSchema211 = z.union([z.literal('url'), z.literal('inline')]);
const shipEngineSchema210 = shipEngineSchema211;
const shipEngineSchema208 = z
	.object({
		label_ids: shipEngineSchema118.optional(),
		label_format: shipEngineSchema209.optional(),
		label_download_type: shipEngineSchema210.optional(),
	})
	.strict();
const shipEngineSchema212 = z
	.object({ label_download: shipEngineSchema108.optional() })
	.strict();
const shipEngineSchema213 = z.number().int();
const shipEngineSchema214 = z
	.object({ currency: shipEngineSchema167, amount: shipEngineSchema154 })
	.strict();
const shipEngineSchema215 = z.union([
	z.literal('processing'),
	z.literal('completed'),
	z.literal('error'),
	z.literal('voided'),
]);
const shipEngineSchema216 = z
	.string()
	.regex(new RegExp('^[a-z0-9]+(_[a-z0-9-]+)* ?$'));
const shipEngineSchema218 = z.union([
	z.literal('request_scheduled'),
	z.literal('pending'),
	z.literal('approved'),
	z.literal('rejected'),
	z.literal('excluded'),
]);
const shipEngineSchema217 = z.array(shipEngineSchema218);
const shipEngineSchema219 = z.union([
	z.literal('modified_at'),
	z.literal('created_at'),
	z.literal('voided_at'),
]);
const shipEngineSchema224 = z.union([
	z.literal('processing'),
	z.literal('completed'),
	z.literal('error'),
	z.literal('voided'),
]);
const shipEngineSchema223 = shipEngineSchema224;
const shipEngineSchema225 = z.string().max(50).nullable();
const shipEngineSchema226 = z.string().nullable();
const shipEngineSchema228 = z
	.string()
	.datetime({ offset: true })
	.regex(
		new RegExp(
			'^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[-+]\\d{2}:\\d{2}))?$',
		),
	);
const shipEngineSchema227 = shipEngineSchema228;
const shipEngineSchema232 = z.union([
	z.literal('uncategorized'),
	z.literal('shipping'),
	z.literal('insurance'),
	z.literal('confirmation'),
	z.literal('discount'),
	z.literal('fuel_charge'),
	z.literal('additional_fees'),
	z.literal('tariff'),
	z.literal('tax'),
	z.literal('delivery'),
	z.literal('handling'),
	z.literal('special_goods'),
	z.literal('pickup'),
	z.literal('location_fee'),
	z.literal('oversize'),
	z.literal('returns'),
	z.literal('notifications'),
	z.literal('tip'),
	z.literal('duties_and_taxes'),
	z.literal('brokerage_fee'),
	z.literal('admin_fee'),
	z.literal('adjustment'),
]);
const shipEngineSchema231 = shipEngineSchema232;
const shipEngineSchema233 = z
	.object({ currency: shipEngineSchema167, amount: shipEngineSchema154 })
	.strict();
const shipEngineSchema236 = z.literal('vat');
const shipEngineSchema235 = shipEngineSchema236;
const shipEngineSchema237 = z.number();
const shipEngineSchema234 = z
	.object({
		tax_type: shipEngineSchema235.optional(),
		tax_percentage: shipEngineSchema237.optional(),
	})
	.strict();
const shipEngineSchema230 = z
	.object({
		rate_detail_type: shipEngineSchema231.optional(),
		carrier_description: shipEngineSchema20.optional(),
		carrier_billing_code: shipEngineSchema20.optional(),
		carrier_memo: shipEngineSchema20.optional(),
		amount: shipEngineSchema233.optional(),
		rate_detail_attributes: shipEngineSchema234.optional(),
		billing_source: shipEngineSchema20.optional(),
	})
	.strict();
const shipEngineSchema229 = z.array(shipEngineSchema230);
const shipEngineSchema239 = z.union([
	z.literal('carrier_default'),
	z.literal('on_creation'),
	z.literal('on_carrier_acceptance'),
]);
const shipEngineSchema238 = shipEngineSchema239;
const shipEngineSchema241 = z
	.string()
	.regex(new RegExp('^[a-z0-9]+(_[a-z0-9-]+)* ?$'));
const shipEngineSchema240 = shipEngineSchema241;
const shipEngineSchema242 = shipEngineSchema150;
const shipEngineSchema243 = shipEngineSchema88;
const shipEngineSchema245 = z.union([
	z.literal('label'),
	z.literal('paperless'),
	z.literal('label_and_paperless'),
]);
const shipEngineSchema244 = shipEngineSchema245;
const shipEngineSchema246 = shipEngineSchema86;
const shipEngineSchema247 = shipEngineSchema15.nullable();
const shipEngineSchema249 = z.union([
	z.literal('unknown'),
	z.literal('in_transit'),
	z.literal('error'),
	z.literal('delivered'),
]);
const shipEngineSchema248 = shipEngineSchema249;
const shipEngineSchema251 = z.union([
	z.literal('none'),
	z.literal('delivery'),
	z.literal('signature'),
	z.literal('adult_signature'),
	z.literal('direct_signature'),
	z.literal('delivery_mailed'),
	z.literal('verbal_confirmation'),
	z.literal('delivery_code'),
	z.literal('age_verification_16_plus'),
]);
const shipEngineSchema250 = shipEngineSchema251;
const shipEngineSchema252 = z
	.object({
		href: shipEngineSchema8.optional(),
		pdf: shipEngineSchema8.optional(),
		png: shipEngineSchema8.optional(),
		zpl: shipEngineSchema8.optional(),
	})
	.strict();
const shipEngineSchema253 = z
	.object({ href: shipEngineSchema8, type: shipEngineSchema10.optional() })
	.strict()
	.nullable();
const shipEngineSchema254 = z
	.object({
		href: shipEngineSchema8.optional(),
		type: shipEngineSchema10.optional(),
	})
	.strict()
	.nullable();
const shipEngineSchema255 = z
	.object({
		href: shipEngineSchema8.optional(),
		instructions: shipEngineSchema47.optional(),
		handoff_code: shipEngineSchema47.optional(),
	})
	.strict()
	.nullable();
const shipEngineSchema258 = z.number().int();
const shipEngineSchema260 = z.number().min(0);
const shipEngineSchema262 = z.union([
	z.literal('pound'),
	z.literal('ounce'),
	z.literal('gram'),
	z.literal('kilogram'),
]);
const shipEngineSchema261 = shipEngineSchema262;
const shipEngineSchema259 = z
	.object({ value: shipEngineSchema260, unit: shipEngineSchema261 })
	.strict();
const shipEngineSchema263 = shipEngineSchema10;
const shipEngineSchema264 = z
	.object({
		reference1: shipEngineSchema47,
		reference2: shipEngineSchema47,
		reference3: shipEngineSchema47,
	})
	.strict();
const shipEngineSchema265 = z.string().min(1).max(35).nullable();
const shipEngineSchema266 = z.number().int();
const shipEngineSchema268 = z
	.object({
		type: shipEngineSchema10.optional(),
		value: shipEngineSchema10.optional(),
	})
	.strict();
const shipEngineSchema267 = z.array(shipEngineSchema268).nullable();
const shipEngineSchema257 = z
	.object({
		package_id: shipEngineSchema258.optional(),
		package_code: shipEngineSchema149.optional(),
		weight: shipEngineSchema259,
		dimensions: shipEngineSchema151.optional(),
		insured_value: shipEngineSchema233.optional(),
		tracking_number: shipEngineSchema263.optional(),
		label_download: shipEngineSchema108.optional(),
		form_download: shipEngineSchema107.optional(),
		qr_code_download: shipEngineSchema107.optional(),
		paperless_download: shipEngineSchema109.optional(),
		label_messages: shipEngineSchema264.optional(),
		external_package_id: shipEngineSchema10.optional(),
		content_description: shipEngineSchema265.optional(),
		sequence: shipEngineSchema266.optional(),
		has_label_documents: shipEngineSchema17.optional(),
		has_form_documents: shipEngineSchema17.optional(),
		has_qr_code_documents: shipEngineSchema17.optional(),
		has_paperless_label_documents: shipEngineSchema17.optional(),
		alternative_identifiers: shipEngineSchema267.optional(),
	})
	.strict();
const shipEngineSchema256 = z.array(shipEngineSchema257);
const shipEngineSchema269 = z.string().nullable();
const shipEngineSchema273 = z.literal('what3words');
const shipEngineSchema272 = z.object({
	type: shipEngineSchema273.optional(),
	value: shipEngineSchema20.optional(),
});
const shipEngineSchema271 = z.array(shipEngineSchema272);
const shipEngineSchema270 = z
	.object({
		name: shipEngineSchema10,
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10,
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10,
		state_province: shipEngineSchema10,
		postal_code: shipEngineSchema49,
		country_code: shipEngineSchema51.optional(),
		address_residential_indicator: shipEngineSchema53.optional(),
		instructions: shipEngineSchema48.optional(),
		geolocation: shipEngineSchema271.optional(),
	})
	.strict();
const shipEngineSchema275 = z.union([
	z.literal('refund_assist'),
	z.literal('manual'),
]);
const shipEngineSchema274 = shipEngineSchema275.nullable();
const shipEngineSchema278 = z.union([
	z.literal('request_scheduled'),
	z.literal('pending'),
	z.literal('approved'),
	z.literal('rejected'),
	z.literal('excluded'),
]);
const shipEngineSchema277 = shipEngineSchema278;
const shipEngineSchema279 = z
	.object({ currency: shipEngineSchema167, amount: shipEngineSchema154 })
	.strict()
	.nullable();
const shipEngineSchema276 = z
	.object({
		refund_status: shipEngineSchema277.optional(),
		request_date: shipEngineSchema21.optional(),
		amount_paid: shipEngineSchema279.optional(),
		amount_requested: shipEngineSchema279.optional(),
		amount_approved: shipEngineSchema279.optional(),
		amount_credited: shipEngineSchema279.optional(),
	})
	.strict()
	.nullable();
const shipEngineSchema222 = z
	.object({
		label_id: shipEngineSchema89.optional(),
		status: shipEngineSchema223.optional(),
		shipment_id: shipEngineSchema89.optional(),
		external_shipment_id: shipEngineSchema225.optional(),
		external_order_id: shipEngineSchema226.optional(),
		ship_date: shipEngineSchema227.optional(),
		created_at: shipEngineSchema21.optional(),
		shipment_cost: shipEngineSchema166.optional(),
		insurance_cost: shipEngineSchema166.optional(),
		requested_comparison_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		tracking_number: shipEngineSchema146.optional(),
		is_return_label: shipEngineSchema17.optional(),
		rma_number: shipEngineSchema47.optional(),
		is_international: shipEngineSchema140.optional(),
		batch_id: shipEngineSchema89.optional(),
		carrier_id: shipEngineSchema89.optional(),
		charge_event: shipEngineSchema238.optional(),
		service_code: shipEngineSchema240.optional(),
		package_code: shipEngineSchema242.optional(),
		voided: shipEngineSchema140.optional(),
		voided_at: shipEngineSchema94.optional(),
		label_format: shipEngineSchema243.optional(),
		display_scheme: shipEngineSchema244.optional(),
		label_layout: shipEngineSchema246.optional(),
		trackable: shipEngineSchema140.optional(),
		label_image_id: shipEngineSchema247.optional(),
		carrier_code: shipEngineSchema104.optional(),
		tracking_status: shipEngineSchema248.optional(),
		confirmation: shipEngineSchema250.optional(),
		label_download: shipEngineSchema252.optional(),
		form_download: shipEngineSchema253.optional(),
		qr_code_download: shipEngineSchema254.optional(),
		paperless_download: shipEngineSchema255.optional(),
		insurance_claim: shipEngineSchema253.optional(),
		packages: shipEngineSchema256.optional(),
		alternative_identifiers: shipEngineSchema267.optional(),
		tracking_url: shipEngineSchema269.optional(),
		ship_to: shipEngineSchema270.optional(),
		void_type: shipEngineSchema274.optional(),
		refund_details: shipEngineSchema276.optional(),
	})
	.strict();
const shipEngineSchema221 = z.array(shipEngineSchema222).min(0);
const shipEngineSchema220 = z
	.object({
		total: shipEngineSchema4,
		page: shipEngineSchema5,
		pages: shipEngineSchema4,
		links: shipEngineSchema6,
		labels: shipEngineSchema221,
	})
	.strict();
const shipEngineSchema282 = shipEngineSchema216;
const shipEngineSchema285 = z.string().min(10).max(10).nullable();
const shipEngineSchema287 = z.union([
	z.literal('amazon_ca'),
	z.literal('amazon_us'),
	z.literal('brightpearl'),
	z.literal('channel_advisor'),
	z.literal('cratejoy'),
	z.literal('ebay'),
	z.literal('etsy'),
	z.literal('jane'),
	z.literal('groupon_goods'),
	z.literal('magento'),
	z.literal('paypal'),
	z.literal('seller_active'),
	z.literal('shopify'),
	z.literal('stitch_labs'),
	z.literal('squarespace'),
	z.literal('three_dcart'),
	z.literal('tophatter'),
	z.literal('walmart'),
	z.literal('woo_commerce'),
	z.literal('volusion'),
]);
const shipEngineSchema286 = shipEngineSchema287;
const shipEngineSchema284 = z
	.object({
		name: shipEngineSchema202.optional(),
		sales_order_id: shipEngineSchema36.optional(),
		sales_order_item_id: shipEngineSchema36.optional(),
		quantity: shipEngineSchema179.optional(),
		sku: shipEngineSchema36.optional(),
		external_order_id: shipEngineSchema36.optional(),
		external_order_item_id: shipEngineSchema36.optional(),
		asin: shipEngineSchema285.optional(),
		order_source_code: shipEngineSchema286.optional(),
	})
	.strict();
const shipEngineSchema283 = z.array(shipEngineSchema284);
const shipEngineSchema291 = z.union([
	z.literal('shipper'),
	z.literal('recipient'),
	z.literal('ior'),
]);
const shipEngineSchema290 = shipEngineSchema291;
const shipEngineSchema293 = z.union([
	z.literal('vat'),
	z.literal('eori'),
	z.literal('ssn'),
	z.literal('ein'),
	z.literal('tin'),
	z.literal('ioss'),
	z.literal('pan'),
	z.literal('voec'),
	z.literal('pccc'),
	z.literal('oss'),
	z.literal('passport'),
	z.literal('abn'),
	z.literal('ukims'),
]);
const shipEngineSchema292 = shipEngineSchema293;
const shipEngineSchema289 = z
	.object({
		taxable_entity_type: shipEngineSchema290,
		identifier_type: shipEngineSchema292,
		issuing_authority: shipEngineSchema28,
		value: shipEngineSchema28,
	})
	.strict();
const shipEngineSchema288 = z.array(shipEngineSchema289).nullable();
const shipEngineSchema294 = z.string().max(50).nullable();
const shipEngineSchema296 = z
	.string()
	.datetime({ offset: true })
	.regex(
		new RegExp(
			'^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[-+]\\d{2}:\\d{2}))?$',
		),
	);
const shipEngineSchema295 = shipEngineSchema296;
const shipEngineSchema300 = z.literal('what3words');
const shipEngineSchema299 = z
	.object({
		type: shipEngineSchema300.optional(),
		value: shipEngineSchema28.optional(),
	})
	.strict();
const shipEngineSchema298 = z.array(shipEngineSchema299);
const shipEngineSchema297 = z
	.object({
		name: shipEngineSchema34,
		phone: shipEngineSchema34.optional(),
		email: shipEngineSchema36.optional(),
		company_name: shipEngineSchema37.optional(),
		address_line1: shipEngineSchema34,
		address_line2: shipEngineSchema37.optional(),
		address_line3: shipEngineSchema37.optional(),
		city_locality: shipEngineSchema34,
		state_province: shipEngineSchema34,
		postal_code: shipEngineSchema38,
		country_code: shipEngineSchema40.optional(),
		address_residential_indicator: shipEngineSchema42.optional(),
		instructions: shipEngineSchema37.optional(),
		geolocation: shipEngineSchema298.optional(),
	})
	.strict();
const shipEngineSchema301 = z
	.object({
		name: shipEngineSchema34,
		phone: shipEngineSchema34,
		email: shipEngineSchema36.optional(),
		company_name: shipEngineSchema37.optional(),
		address_line1: shipEngineSchema34,
		address_line2: shipEngineSchema37.optional(),
		address_line3: shipEngineSchema37.optional(),
		city_locality: shipEngineSchema34,
		state_province: shipEngineSchema34,
		postal_code: shipEngineSchema38,
		country_code: shipEngineSchema40,
		address_residential_indicator: shipEngineSchema42.optional(),
		instructions: shipEngineSchema37.optional(),
	})
	.strict();
const shipEngineSchema302 = shipEngineSchema117.nullable();
const shipEngineSchema303 = z
	.object({
		name: shipEngineSchema34,
		phone: shipEngineSchema34.optional(),
		email: shipEngineSchema36.optional(),
		company_name: shipEngineSchema37.optional(),
		address_line1: shipEngineSchema34,
		address_line2: shipEngineSchema37.optional(),
		address_line3: shipEngineSchema37.optional(),
		city_locality: shipEngineSchema34,
		state_province: shipEngineSchema34,
		postal_code: shipEngineSchema38,
		country_code: shipEngineSchema40.optional(),
		address_residential_indicator: shipEngineSchema42.optional(),
		instructions: shipEngineSchema37.optional(),
	})
	.strict();
const shipEngineSchema304 = z.boolean().nullable();
const shipEngineSchema306 = z.union([
	z.literal('none'),
	z.literal('delivery'),
	z.literal('signature'),
	z.literal('adult_signature'),
	z.literal('direct_signature'),
	z.literal('delivery_mailed'),
	z.literal('verbal_confirmation'),
	z.literal('delivery_code'),
	z.literal('age_verification_16_plus'),
]);
const shipEngineSchema305 = shipEngineSchema306;
const shipEngineSchema309 = z.union([
	z.literal('merchandise'),
	z.literal('documents'),
	z.literal('gift'),
	z.literal('returned_goods'),
	z.literal('sample'),
	z.literal('other'),
]);
const shipEngineSchema308 = shipEngineSchema309;
const shipEngineSchema311 = z.union([
	z.literal('return_to_sender'),
	z.literal('treat_as_abandoned'),
]);
const shipEngineSchema310 = shipEngineSchema311;
const shipEngineSchema313 = z.union([
	z.literal('exw'),
	z.literal('fca'),
	z.literal('cpt'),
	z.literal('cip'),
	z.literal('dpu'),
	z.literal('dap'),
	z.literal('ddp'),
	z.literal('fas'),
	z.literal('fob'),
	z.literal('cfr'),
	z.literal('cif'),
	z.literal('ddu'),
	z.literal('daf'),
	z.literal('deq'),
	z.literal('des'),
]);
const shipEngineSchema312 = shipEngineSchema313;
const shipEngineSchema315 = z
	.object({ currency: shipEngineSchema163, amount: shipEngineSchema164 })
	.strict();
const shipEngineSchema316 = z
	.object({
		taxes: shipEngineSchema315.optional(),
		duties: shipEngineSchema315.optional(),
	})
	.strict();
const shipEngineSchema314 = z
	.object({
		freight_charge: shipEngineSchema315.optional(),
		insurance_charge: shipEngineSchema315.optional(),
		discount: shipEngineSchema315.optional(),
		estimated_import_charges: shipEngineSchema316.optional(),
		other_charge: shipEngineSchema315.optional(),
		other_charge_description: shipEngineSchema28.optional(),
		invoice_number: shipEngineSchema28.optional(),
	})
	.strict();
const shipEngineSchema317 = z
	.object({
		name: shipEngineSchema34,
		phone: shipEngineSchema34.optional(),
		email: shipEngineSchema36.optional(),
		company_name: shipEngineSchema37.optional(),
		address_line1: shipEngineSchema34,
		address_line2: shipEngineSchema37.optional(),
		address_line3: shipEngineSchema37.optional(),
		city_locality: shipEngineSchema34,
		state_province: shipEngineSchema34.optional(),
		postal_code: shipEngineSchema38,
		country_code: shipEngineSchema40,
	})
	.strict();
const shipEngineSchema321 = z.number().min(0);
const shipEngineSchema323 = z.union([
	z.literal('pound'),
	z.literal('ounce'),
	z.literal('gram'),
	z.literal('kilogram'),
]);
const shipEngineSchema322 = shipEngineSchema323;
const shipEngineSchema320 = z
	.object({ value: shipEngineSchema321, unit: shipEngineSchema322 })
	.strict();
const shipEngineSchema324 = shipEngineSchema41.nullable();
const shipEngineSchema319 = z
	.object({
		quantity: shipEngineSchema179.optional(),
		value: shipEngineSchema164.optional(),
		value_currency: shipEngineSchema28.optional(),
		weight: shipEngineSchema320.optional(),
		harmonized_tariff_code: shipEngineSchema36.optional(),
		country_of_origin: shipEngineSchema324.optional(),
		unit_of_measure: shipEngineSchema36.optional(),
		sku: shipEngineSchema36.optional(),
		sku_description: shipEngineSchema36.optional(),
	})
	.strict();
const shipEngineSchema318 = z.array(shipEngineSchema319).min(0);
const shipEngineSchema307 = z
	.object({
		contents: shipEngineSchema308,
		contents_explanation: shipEngineSchema28.optional(),
		non_delivery: shipEngineSchema310,
		terms_of_trade_code: shipEngineSchema312.optional(),
		declaration: shipEngineSchema28.optional(),
		invoice_additional_details: shipEngineSchema314.optional(),
		importer_of_record: shipEngineSchema317.optional(),
		license_number: shipEngineSchema28.optional(),
		certificate_number: shipEngineSchema28.optional(),
		customs_items: shipEngineSchema318.optional(),
	})
	.strict()
	.nullable();
const shipEngineSchema327 = z.union([
	z.literal('recipient'),
	z.literal('third_party'),
]);
const shipEngineSchema326 = shipEngineSchema327.nullable();
const shipEngineSchema328 = z
	.object({ value: shipEngineSchema321, unit: shipEngineSchema322 })
	.strict()
	.nullable();
const shipEngineSchema329 = z
	.object({
		shipper_load_and_count: shipEngineSchema28.optional(),
		booking_confirmation: shipEngineSchema28.optional(),
	})
	.strict();
const shipEngineSchema330 = z.string().max(100).nullable();
const shipEngineSchema332 = z.union([
	z.literal('pickup'),
	z.literal('drop_off'),
]);
const shipEngineSchema331 = shipEngineSchema332.nullable();
const shipEngineSchema335 = z.union([
	z.literal('any'),
	z.literal('cash'),
	z.literal('cash_equivalent'),
	z.literal('none'),
]);
const shipEngineSchema334 = shipEngineSchema335;
const shipEngineSchema337 = z.number().min(0);
const shipEngineSchema336 = z
	.object({
		currency: shipEngineSchema163.optional(),
		amount: shipEngineSchema337.optional(),
	})
	.strict();
const shipEngineSchema333 = z
	.object({
		payment_type: shipEngineSchema334.optional(),
		payment_amount: shipEngineSchema336.optional(),
	})
	.strict();
const shipEngineSchema338 = z
	.object({
		name: shipEngineSchema28.optional(),
		phone: shipEngineSchema28.optional(),
	})
	.strict();
const shipEngineSchema340 = z.union([
	z.literal('c2c'),
	z.literal('b2c'),
	z.literal('c2b'),
	z.literal('b2b'),
]);
const shipEngineSchema339 = z
	.object({
		movement_indicator: shipEngineSchema340.optional(),
		not_at_risk: shipEngineSchema25.optional(),
	})
	.strict();
const shipEngineSchema342 = z.union([
	z.literal('day_old_poultry'),
	z.literal('other_live_animal'),
]);
const shipEngineSchema341 = shipEngineSchema342.nullable();
const shipEngineSchema325 = z
	.object({
		bill_to_account: shipEngineSchema36.optional(),
		bill_to_country_code: shipEngineSchema324.optional(),
		bill_to_party: shipEngineSchema326.optional(),
		bill_to_postal_code: shipEngineSchema36.optional(),
		contains_alcohol: shipEngineSchema25.optional(),
		delivered_duty_paid: shipEngineSchema25.optional(),
		dry_ice: shipEngineSchema25.optional(),
		dry_ice_weight: shipEngineSchema328.optional(),
		non_machinable: shipEngineSchema25.optional(),
		saturday_delivery: shipEngineSchema25.optional(),
		fedex_freight: shipEngineSchema329.optional(),
		use_ups_ground_freight_pricing: shipEngineSchema304.optional(),
		freight_class: shipEngineSchema36.optional(),
		custom_field1: shipEngineSchema330.optional(),
		custom_field2: shipEngineSchema330.optional(),
		custom_field3: shipEngineSchema330.optional(),
		origin_type: shipEngineSchema331.optional(),
		additional_handling: shipEngineSchema304.optional(),
		shipper_release: shipEngineSchema304.optional(),
		collect_on_delivery: shipEngineSchema333.optional(),
		third_party_consignee: shipEngineSchema25.optional(),
		dangerous_goods: shipEngineSchema25.optional(),
		dangerous_goods_contact: shipEngineSchema338.optional(),
		windsor_framework_details: shipEngineSchema339.optional(),
		license_number: shipEngineSchema36.optional(),
		invoice_number: shipEngineSchema36.optional(),
		certificate_number: shipEngineSchema36.optional(),
		fragile: shipEngineSchema25.optional(),
		'delivery-as-addressed': shipEngineSchema25.optional(),
		'return-after-first-attempt': shipEngineSchema25.optional(),
		regulated_content_type: shipEngineSchema341.optional(),
	})
	.strict();
const shipEngineSchema344 = z.union([
	z.literal('none'),
	z.literal('shipsurance'),
	z.literal('carrier'),
	z.literal('third_party'),
]);
const shipEngineSchema343 = shipEngineSchema344;
const shipEngineSchema348 = z
	.string()
	.min(1)
	.max(50)
	.regex(new RegExp('^[a-z0-9]+(_[a-z0-9]+)*$'));
const shipEngineSchema347 = shipEngineSchema348;
const shipEngineSchema351 = z.union([
	z.literal('inch'),
	z.literal('centimeter'),
]);
const shipEngineSchema350 = shipEngineSchema351;
const shipEngineSchema349 = z
	.object({
		unit: shipEngineSchema350,
		length: shipEngineSchema164,
		width: shipEngineSchema164,
		height: shipEngineSchema164,
	})
	.strict();
const shipEngineSchema352 = z
	.object({
		reference1: shipEngineSchema36,
		reference2: shipEngineSchema36,
		reference3: shipEngineSchema36,
	})
	.strict();
const shipEngineSchema353 = z.string().min(1).max(35).nullable();
const shipEngineSchema356 = z.number().nullable();
const shipEngineSchema359 = z.union([
	z.literal('i'),
	z.literal('ii'),
	z.literal('iii'),
]);
const shipEngineSchema360 = z
	.object({
		amount: shipEngineSchema164.optional(),
		unit: shipEngineSchema36.optional(),
	})
	.strict();
const shipEngineSchema361 = z.union([
	z.literal('section_1'),
	z.literal('section_2'),
	z.literal('section_1a'),
	z.literal('section_1b'),
]);
const shipEngineSchema362 = z.union([
	z.literal('ground'),
	z.literal('water'),
	z.literal('cargo_aircraft_only'),
	z.literal('passenger_aircraft'),
]);
const shipEngineSchema363 = z.union([
	z.literal('lightly_regulated'),
	z.literal('fully_regulated'),
	z.literal('limited_quantities'),
	z.literal('excepted_quantity'),
]);
const shipEngineSchema358 = z
	.object({
		id_number: shipEngineSchema36.optional(),
		shipping_name: shipEngineSchema36.optional(),
		technical_name: shipEngineSchema36.optional(),
		product_class: shipEngineSchema36.optional(),
		product_class_subsidiary: shipEngineSchema36.optional(),
		packaging_group: shipEngineSchema359.optional(),
		dangerous_amount: shipEngineSchema360.optional(),
		quantity: shipEngineSchema179.optional(),
		packaging_instruction: shipEngineSchema36.optional(),
		packaging_instruction_section: shipEngineSchema361.optional(),
		packaging_type: shipEngineSchema36.optional(),
		transport_mean: shipEngineSchema362.optional(),
		transport_category: shipEngineSchema36.optional(),
		regulation_authority: shipEngineSchema36.optional(),
		regulation_level: shipEngineSchema363.optional(),
		radioactive: shipEngineSchema304.optional(),
		reportable_quantity: shipEngineSchema304.optional(),
		tunnel_code: shipEngineSchema36.optional(),
		additional_description: shipEngineSchema36.optional(),
	})
	.strict();
const shipEngineSchema357 = z.array(shipEngineSchema358).min(0);
const shipEngineSchema364 = z.record(z.string(), z.json());
const shipEngineSchema355 = z
	.object({
		quantity: shipEngineSchema179.optional(),
		value: shipEngineSchema315.optional(),
		weight: shipEngineSchema320.optional(),
		harmonized_tariff_code: shipEngineSchema36.optional(),
		country_of_origin: shipEngineSchema324.optional(),
		unit_of_measure: shipEngineSchema36.optional(),
		sku: shipEngineSchema36.optional(),
		sku_description: shipEngineSchema36.optional(),
		mid_code: shipEngineSchema36.optional(),
		product_url: shipEngineSchema36.optional(),
		vat_rate: shipEngineSchema356.optional(),
		dangerous_goods: shipEngineSchema357.optional(),
		extended_details: shipEngineSchema364.optional(),
	})
	.strict();
const shipEngineSchema354 = z.array(shipEngineSchema355).min(0);
const shipEngineSchema346 = z
	.object({
		package_id: shipEngineSchema116.optional(),
		package_code: shipEngineSchema347.optional(),
		package_name: shipEngineSchema28.optional(),
		weight: shipEngineSchema320,
		dimensions: shipEngineSchema349.optional(),
		insured_value: shipEngineSchema315.optional(),
		label_messages: shipEngineSchema352.optional(),
		external_package_id: shipEngineSchema34.optional(),
		content_description: shipEngineSchema353.optional(),
		products: shipEngineSchema354.optional(),
	})
	.strict();
const shipEngineSchema345 = z.array(shipEngineSchema346).min(1);
const shipEngineSchema365 = z.string().nullable();
const shipEngineSchema281 = z
	.object({
		carrier_id: shipEngineSchema116,
		service_code: shipEngineSchema282,
		shipping_rule_id: shipEngineSchema116.optional(),
		external_order_id: shipEngineSchema36.optional(),
		items: shipEngineSchema283.optional(),
		tax_identifiers: shipEngineSchema288.optional(),
		external_shipment_id: shipEngineSchema294.optional(),
		shipment_number: shipEngineSchema294.optional(),
		ship_date: shipEngineSchema295.optional(),
		ship_to: shipEngineSchema297,
		ship_from: shipEngineSchema301.optional(),
		warehouse_id: shipEngineSchema302.optional(),
		return_to: shipEngineSchema303.optional(),
		is_return: shipEngineSchema304.optional(),
		confirmation: shipEngineSchema305.optional(),
		customs: shipEngineSchema307.optional(),
		advanced_options: shipEngineSchema325.optional(),
		insurance_provider: shipEngineSchema343.optional(),
		order_source_code: shipEngineSchema286.optional(),
		packages: shipEngineSchema345,
		comparison_rate_type: shipEngineSchema365.optional(),
	})
	.strict();
const shipEngineSchema367 = z.union([
	z.literal('carrier_default'),
	z.literal('on_creation'),
	z.literal('on_carrier_acceptance'),
]);
const shipEngineSchema366 = shipEngineSchema367;
const shipEngineSchema368 = shipEngineSchema117;
const shipEngineSchema369 = z.boolean();
const shipEngineSchema371 = z.union([
	z.literal('no_validation'),
	z.literal('validate_only'),
	z.literal('validate_and_clean'),
]);
const shipEngineSchema370 = shipEngineSchema371;
const shipEngineSchema372 = shipEngineSchema211;
const shipEngineSchema373 = shipEngineSchema125;
const shipEngineSchema374 = shipEngineSchema30.nullable();
const shipEngineSchema280 = z
	.object({
		shipment: shipEngineSchema281,
		is_return_label: shipEngineSchema25.optional(),
		rma_number: shipEngineSchema36.optional(),
		charge_event: shipEngineSchema366.optional(),
		outbound_label_id: shipEngineSchema368.optional(),
		test_label: shipEngineSchema369.optional(),
		validate_address: shipEngineSchema370.optional(),
		label_download_type: shipEngineSchema372.optional(),
		label_format: shipEngineSchema126.optional(),
		display_scheme: shipEngineSchema128.optional(),
		label_layout: shipEngineSchema373.optional(),
		label_image_id: shipEngineSchema374.optional(),
		ship_to_service_point_id: shipEngineSchema365.optional(),
		ship_from_service_point_id: shipEngineSchema365.optional(),
	})
	.strict();
const shipEngineSchema375 = z
	.object({
		label_id: shipEngineSchema89,
		status: shipEngineSchema223,
		shipment_id: shipEngineSchema89,
		external_shipment_id: shipEngineSchema225,
		external_order_id: shipEngineSchema226,
		ship_date: shipEngineSchema227,
		created_at: shipEngineSchema21,
		shipment_cost: shipEngineSchema166,
		insurance_cost: shipEngineSchema166,
		requested_comparison_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		tracking_number: shipEngineSchema146,
		is_return_label: shipEngineSchema17,
		rma_number: shipEngineSchema47,
		is_international: shipEngineSchema140,
		batch_id: shipEngineSchema89,
		carrier_id: shipEngineSchema89,
		charge_event: shipEngineSchema238,
		service_code: shipEngineSchema240,
		package_code: shipEngineSchema242,
		voided: shipEngineSchema140,
		voided_at: shipEngineSchema94.optional(),
		label_format: shipEngineSchema243,
		display_scheme: shipEngineSchema244,
		label_layout: shipEngineSchema246,
		trackable: shipEngineSchema140,
		label_image_id: shipEngineSchema247,
		carrier_code: shipEngineSchema104,
		tracking_status: shipEngineSchema248,
		confirmation: shipEngineSchema250.optional(),
		label_download: shipEngineSchema252,
		form_download: shipEngineSchema253,
		qr_code_download: shipEngineSchema254,
		paperless_download: shipEngineSchema255,
		insurance_claim: shipEngineSchema253,
		packages: shipEngineSchema256,
		alternative_identifiers: shipEngineSchema267.optional(),
		tracking_url: shipEngineSchema269.optional(),
		ship_to: shipEngineSchema270,
		void_type: shipEngineSchema274.optional(),
		refund_details: shipEngineSchema276.optional(),
	})
	.strict();
const shipEngineSchema376 = z
	.object({
		label_id: shipEngineSchema89.optional(),
		status: shipEngineSchema223.optional(),
		shipment_id: shipEngineSchema89.optional(),
		external_shipment_id: shipEngineSchema225.optional(),
		external_order_id: shipEngineSchema226.optional(),
		ship_date: shipEngineSchema227.optional(),
		created_at: shipEngineSchema21.optional(),
		shipment_cost: shipEngineSchema166.optional(),
		insurance_cost: shipEngineSchema166.optional(),
		requested_comparison_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		tracking_number: shipEngineSchema146.optional(),
		is_return_label: shipEngineSchema17.optional(),
		rma_number: shipEngineSchema47.optional(),
		is_international: shipEngineSchema140.optional(),
		batch_id: shipEngineSchema89.optional(),
		carrier_id: shipEngineSchema89.optional(),
		charge_event: shipEngineSchema238.optional(),
		service_code: shipEngineSchema240.optional(),
		package_code: shipEngineSchema242.optional(),
		voided: shipEngineSchema140.optional(),
		voided_at: shipEngineSchema94.optional(),
		label_format: shipEngineSchema243.optional(),
		display_scheme: shipEngineSchema244.optional(),
		label_layout: shipEngineSchema246.optional(),
		trackable: shipEngineSchema140.optional(),
		label_image_id: shipEngineSchema247.optional(),
		carrier_code: shipEngineSchema104.optional(),
		tracking_status: shipEngineSchema248.optional(),
		confirmation: shipEngineSchema250.optional(),
		label_download: shipEngineSchema252.optional(),
		form_download: shipEngineSchema253.optional(),
		qr_code_download: shipEngineSchema254.optional(),
		paperless_download: shipEngineSchema255.optional(),
		insurance_claim: shipEngineSchema253.optional(),
		packages: shipEngineSchema256.optional(),
		alternative_identifiers: shipEngineSchema267.optional(),
		tracking_url: shipEngineSchema269.optional(),
		ship_to: shipEngineSchema270.optional(),
		void_type: shipEngineSchema274.optional(),
		refund_details: shipEngineSchema276.optional(),
	})
	.strict();
const shipEngineSchema378 = shipEngineSchema371;
const shipEngineSchema377 = z
	.object({
		validate_address: shipEngineSchema378.optional(),
		label_layout: shipEngineSchema373.optional(),
		label_format: shipEngineSchema126.optional(),
		label_download_type: shipEngineSchema210.optional(),
		display_scheme: shipEngineSchema128.optional(),
		custom_field1: shipEngineSchema28.optional(),
		custom_field2: shipEngineSchema28.optional(),
		custom_field3: shipEngineSchema28.optional(),
	})
	.strict();
const shipEngineSchema379 = z.union([
	z.literal('best_value'),
	z.literal('cheapest'),
	z.literal('fastest'),
]);
const shipEngineSchema381 = z
	.object({
		external_order_id: shipEngineSchema36.optional(),
		items: shipEngineSchema283.optional(),
		tax_identifiers: shipEngineSchema288.optional(),
		external_shipment_id: shipEngineSchema294.optional(),
		shipment_number: shipEngineSchema294.optional(),
		ship_date: shipEngineSchema295.optional(),
		ship_to: shipEngineSchema297.optional(),
		ship_from: shipEngineSchema303.optional(),
		warehouse_id: shipEngineSchema302.optional(),
		return_to: shipEngineSchema303.optional(),
		is_return: shipEngineSchema304.optional(),
		confirmation: shipEngineSchema305.optional(),
		customs: shipEngineSchema307.optional(),
		advanced_options: shipEngineSchema325.optional(),
		insurance_provider: shipEngineSchema343.optional(),
		order_source_code: shipEngineSchema286.optional(),
		packages: shipEngineSchema345.optional(),
		comparison_rate_type: shipEngineSchema365.optional(),
	})
	.strict();
const shipEngineSchema380 = z
	.object({
		shipment: shipEngineSchema381,
		is_return_label: shipEngineSchema25.optional(),
		rma_number: shipEngineSchema36.optional(),
		charge_event: shipEngineSchema366.optional(),
		outbound_label_id: shipEngineSchema368.optional(),
		test_label: shipEngineSchema369.optional(),
		validate_address: shipEngineSchema370.optional(),
		label_download_type: shipEngineSchema372.optional(),
		label_format: shipEngineSchema126.optional(),
		display_scheme: shipEngineSchema128.optional(),
		label_layout: shipEngineSchema373.optional(),
		label_image_id: shipEngineSchema374.optional(),
	})
	.strict();
const shipEngineSchema384 = z.union([
	z.literal('best_value'),
	z.literal('cheapest'),
	z.literal('fastest'),
]);
const shipEngineSchema383 = shipEngineSchema384;
const shipEngineSchema382 = z
	.object({
		label_id: shipEngineSchema89.optional(),
		status: shipEngineSchema223.optional(),
		shipment_id: shipEngineSchema89.optional(),
		external_shipment_id: shipEngineSchema225.optional(),
		external_order_id: shipEngineSchema226.optional(),
		ship_date: shipEngineSchema227.optional(),
		created_at: shipEngineSchema21.optional(),
		shipment_cost: shipEngineSchema166.optional(),
		insurance_cost: shipEngineSchema166.optional(),
		requested_comparison_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		tracking_number: shipEngineSchema146.optional(),
		is_return_label: shipEngineSchema17.optional(),
		rma_number: shipEngineSchema47.optional(),
		is_international: shipEngineSchema140.optional(),
		batch_id: shipEngineSchema89.optional(),
		carrier_id: shipEngineSchema89.optional(),
		charge_event: shipEngineSchema238.optional(),
		service_code: shipEngineSchema240.optional(),
		package_code: shipEngineSchema242.optional(),
		voided: shipEngineSchema140.optional(),
		voided_at: shipEngineSchema94.optional(),
		label_format: shipEngineSchema243.optional(),
		display_scheme: shipEngineSchema244.optional(),
		label_layout: shipEngineSchema246.optional(),
		trackable: shipEngineSchema140.optional(),
		label_image_id: shipEngineSchema247.optional(),
		carrier_code: shipEngineSchema104.optional(),
		tracking_status: shipEngineSchema248.optional(),
		confirmation: shipEngineSchema250.optional(),
		label_download: shipEngineSchema252.optional(),
		form_download: shipEngineSchema253.optional(),
		qr_code_download: shipEngineSchema254.optional(),
		paperless_download: shipEngineSchema255.optional(),
		insurance_claim: shipEngineSchema253.optional(),
		packages: shipEngineSchema256.optional(),
		alternative_identifiers: shipEngineSchema267.optional(),
		tracking_url: shipEngineSchema269.optional(),
		ship_to: shipEngineSchema270.optional(),
		void_type: shipEngineSchema274.optional(),
		refund_details: shipEngineSchema276.optional(),
		rate_shopper_id: shipEngineSchema383.optional(),
	})
	.strict();
const shipEngineSchema385 = z
	.object({
		validate_address: shipEngineSchema378.optional(),
		label_layout: shipEngineSchema373.optional(),
		label_format: shipEngineSchema126.optional(),
		label_download_type: shipEngineSchema210.optional(),
		display_scheme: shipEngineSchema128.optional(),
	})
	.strict();
const shipEngineSchema386 = z
	.object({
		charge_event: shipEngineSchema366.optional(),
		label_layout: shipEngineSchema373.optional(),
		label_format: shipEngineSchema126.optional(),
		label_download_type: shipEngineSchema372.optional(),
		display_scheme: shipEngineSchema128.optional(),
		label_image_id: shipEngineSchema374.optional(),
		rma_number: shipEngineSchema36.optional(),
	})
	.strict();
const shipEngineSchema388 = shipEngineSchema10;
const shipEngineSchema390 = z.union([
	z.literal('UN'),
	z.literal('AC'),
	z.literal('IT'),
	z.literal('DE'),
	z.literal('EX'),
	z.literal('AT'),
	z.literal('NY'),
	z.literal('SP'),
]);
const shipEngineSchema389 = shipEngineSchema390;
const shipEngineSchema392 = z.union([
	z.literal('CARRIER_STATUS_NOT_MAPPED'),
	z.literal('SHIPMENT_CREATED'),
	z.literal('AWAITING_PICKUP_DROP_OFF'),
	z.literal('DROPPED_OFF'),
	z.literal('ELEC_ADVICE_RECD_BY_CARRIER'),
	z.literal('PICKED_UP'),
	z.literal('CUSTOMS_CLEARED'),
	z.literal('CUSTOMS_PROCESSING'),
	z.literal('DELIVERY_ARRANGED_WITH_RECIPIENT'),
	z.literal('HUB_SCAN_OUT'),
	z.literal('HUB_SCAN_IN'),
	z.literal('IN_TRANSIT'),
	z.literal('INFORMATION'),
	z.literal('PARCEL_OVER_LABELLED'),
	z.literal('PARCEL_UPDATE_NOTIFICATION'),
	z.literal('RECEIVED_BY_CARRIER'),
	z.literal('RECEIVED_LOCAL_DELIVERY_DEPOT'),
	z.literal('SUB_CONTRACTOR_EVENT'),
	z.literal('SUB_CONTRACTOR_RECEIVED'),
	z.literal('PARCEL_REDIRECTED'),
	z.literal('DELIVERY_SCHEDULED'),
	z.literal('HUB_PROCESSING'),
	z.literal('DELIVERY_RESCHEDULED'),
	z.literal('ATTEMPTED_DELIVERY'),
	z.literal('ATTEMPTED_DELIVERY_FINAL'),
	z.literal('COD_AMOUNT_PAID'),
	z.literal('CUSTOMER_CARDED'),
	z.literal('OUT_FOR_DELIVERY'),
	z.literal('AWAITING_COLLECTION_FROM_PICKUP_POINT'),
	z.literal('COLLECT_AT_LOCAL_PO'),
	z.literal('CUSTOMER_TO_COLLECT_FROM_CARRIER'),
	z.literal('DELIVERED_TO_RECEPTION'),
	z.literal('DELIVERED'),
	z.literal('DELIVERED_DAMAGED'),
	z.literal('DELIVERED_IN_PART'),
	z.literal('DELIVERED_SPECIFIED_SAFE_PLACE'),
	z.literal('DELIVERED_TO_ALTERNATIVE_DELIVERY_LOCATION'),
	z.literal('DELIVERED_TO_NEIGHBOUR'),
	z.literal('DELIVERED_TO_PO_BOX'),
	z.literal('PARCEL_COLLECTED_FROM_PICKUP_POINT'),
	z.literal('POST_TRANSIT_STATUS'),
	z.literal('PROOF_OF_DELIVERY'),
	z.literal('PICKUP_FAILED'),
	z.literal('NOT_YET_RECEIVED_BY_CARRIER'),
	z.literal('PARCEL_DAMAGED'),
	z.literal('ADDRESS_QUERY'),
	z.literal('CARRIER_DELAYS'),
	z.literal('DELAYED_NOT_CARRIER'),
	z.literal('HELD_BY_CARRIER'),
	z.literal('HELD_BY_CARRIER_FOR_CLEARANCE_PRE_PROCESSING'),
	z.literal('HELD_BY_CUSTOMS'),
	z.literal('INCORRECT_DECLARATION'),
	z.literal('MISROUTED'),
	z.literal('PARCEL_REPACKED'),
	z.literal('RECD_BY_CARRIER_NO_ELEC_ADVICE'),
	z.literal('COD_AMOUNT_NOT_PAID'),
	z.literal('CUSTOMER_IDENTIFICATION_FAILED'),
	z.literal('NO_ACCESS_TO_RECIPIENTS_ADDRESS'),
	z.literal('CANCELLED'),
	z.literal('CUSTOMER_MOVED'),
	z.literal('HAZARDOUS_PROHIBITED'),
	z.literal('NOT_COLLECTED_FROM_PICKUP_POINT'),
	z.literal('NOT_DELIVERED'),
	z.literal('NOT_DELIVERED_ADDRESSEE_DECEASED'),
	z.literal('PARCEL_DISPOSED'),
	z.literal('PARCEL_LOST'),
	z.literal('PARCEL_OUTSIDE_OF_SERVICE_CAPABILITY'),
	z.literal('REFUSED_BY_CUSTOMER'),
	z.literal('RETURN_TO_SENDER'),
	z.literal('UNSPECIFIED_EXCEPTION'),
	z.literal('TRACKING_EXPIRED'),
	z.literal('DUTY_NOT_PAID'),
	z.literal('PARCEL_REDIRECTED_BY_CARRIER'),
	z.literal('DELIVERED_TO_PICKUP_POINT'),
	z.literal('UNDELIVERABLE_RETURNED_TO_SENDER'),
]);
const shipEngineSchema391 = shipEngineSchema392;
const shipEngineSchema393 = shipEngineSchema105;
const shipEngineSchema394 = z.string().min(0);
const shipEngineSchema395 = z.string().min(0);
const shipEngineSchema396 = shipEngineSchema22;
const shipEngineSchema399 = z.string().min(2);
const shipEngineSchema400 = z.number().min(-90).max(90);
const shipEngineSchema401 = z.number().min(-180).max(180);
const shipEngineSchema398 = z
	.object({
		occurred_at: shipEngineSchema396,
		carrier_occurred_at: shipEngineSchema396.optional(),
		city_locality: shipEngineSchema394,
		state_province: shipEngineSchema399,
		postal_code: shipEngineSchema394,
		country_code: shipEngineSchema51.optional(),
		company_name: shipEngineSchema394.optional(),
		signer: shipEngineSchema395.optional(),
		event_code: shipEngineSchema191.optional(),
		carrier_detail_code: shipEngineSchema71,
		status_code: shipEngineSchema389,
		status_detail_code: shipEngineSchema391.optional(),
		status_description: shipEngineSchema71,
		status_detail_description: shipEngineSchema394.optional(),
		carrier_status_code: shipEngineSchema71,
		carrier_status_description: shipEngineSchema395,
		latitude: shipEngineSchema400.optional(),
		longitude: shipEngineSchema401.optional(),
		proof_of_delivery_url: shipEngineSchema106.optional(),
	})
	.strict();
const shipEngineSchema397 = z.array(shipEngineSchema398);
const shipEngineSchema387 = z
	.object({
		tracking_number: shipEngineSchema388,
		tracking_url: shipEngineSchema106.optional(),
		status_code: shipEngineSchema389,
		status_detail_code: shipEngineSchema391.optional(),
		carrier_code: shipEngineSchema393.optional(),
		carrier_id: shipEngineSchema258.optional(),
		status_description: shipEngineSchema394.optional(),
		status_detail_description: shipEngineSchema394.optional(),
		carrier_status_code: shipEngineSchema71,
		carrier_detail_code: shipEngineSchema71.optional(),
		carrier_status_description: shipEngineSchema395.optional(),
		ship_date: shipEngineSchema396.optional(),
		estimated_delivery_date: shipEngineSchema396.optional(),
		actual_delivery_date: shipEngineSchema396.optional(),
		exception_description: shipEngineSchema394.optional(),
		events: shipEngineSchema397,
	})
	.strict();
const shipEngineSchema404 = z.union([
	z.literal('unknown'),
	z.literal('unspecified'),
	z.literal('validation_failed'),
	z.literal('label_not_found_within_void_period'),
	z.literal('label_already_used'),
	z.literal('label_already_voided'),
	z.literal('contact_carrier'),
]);
const shipEngineSchema403 = shipEngineSchema404;
const shipEngineSchema402 = z
	.object({
		approved: shipEngineSchema140,
		message: shipEngineSchema395,
		reason_code: shipEngineSchema403.optional(),
	})
	.strict();
const shipEngineSchema405 = z.array(shipEngineSchema117);
const shipEngineSchema409 = z.string().datetime({ offset: true }).min(1);
const shipEngineSchema410 = z.array(shipEngineSchema145);
const shipEngineSchema411 = z.string().min(1);
const shipEngineSchema412 = z
	.object({ href: shipEngineSchema8.optional() })
	.strict();
const shipEngineSchema408 = z
	.object({
		manifest_id: shipEngineSchema89.optional(),
		form_id: shipEngineSchema89.optional(),
		created_at: shipEngineSchema409.optional(),
		ship_date: shipEngineSchema409.optional(),
		shipments: shipEngineSchema113.optional(),
		label_ids: shipEngineSchema410.optional(),
		warehouse_id: shipEngineSchema89.optional(),
		submission_id: shipEngineSchema411.optional(),
		carrier_id: shipEngineSchema89.optional(),
		manifest_download: shipEngineSchema412.optional(),
	})
	.strict();
const shipEngineSchema407 = z.array(shipEngineSchema408);
const shipEngineSchema406 = z
	.object({
		manifests: shipEngineSchema407,
		total: shipEngineSchema112,
		page: shipEngineSchema113,
		pages: shipEngineSchema113,
		links: shipEngineSchema114,
	})
	.strict();
const shipEngineSchema413 = z.union([
	z
		.object({
			carrier_id: shipEngineSchema116,
			excluded_label_ids: shipEngineSchema118.optional(),
			label_ids: shipEngineSchema118.optional(),
			warehouse_id: shipEngineSchema116,
			ship_date: shipEngineSchema205,
		})
		.strict(),
	z.object({ label_ids: shipEngineSchema118 }).strict(),
]);
const shipEngineSchema416 = z
	.object({
		manifest_id: shipEngineSchema89.optional(),
		form_id: shipEngineSchema89.optional(),
		created_at: shipEngineSchema409.optional(),
		ship_date: shipEngineSchema409.optional(),
		shipments: shipEngineSchema113.optional(),
		label_ids: shipEngineSchema410.optional(),
		warehouse_id: shipEngineSchema89.optional(),
		submission_id: shipEngineSchema411.optional(),
		carrier_id: shipEngineSchema89.optional(),
		manifest_download: shipEngineSchema412.optional(),
	})
	.strict();
const shipEngineSchema415 = z.array(shipEngineSchema416);
const shipEngineSchema420 = z.union([
	z.literal('in_progress'),
	z.literal('completed'),
]);
const shipEngineSchema419 = shipEngineSchema420;
const shipEngineSchema418 = z
	.object({
		manifest_request_id: shipEngineSchema89.optional(),
		status: shipEngineSchema419.optional(),
	})
	.strict();
const shipEngineSchema417 = z.array(shipEngineSchema418);
const shipEngineSchema421 = z
	.object({ href: shipEngineSchema8.optional() })
	.strict();
const shipEngineSchema414 = z
	.object({
		manifests: shipEngineSchema415.optional(),
		manifest_requests: shipEngineSchema417.optional(),
		manifest_id: shipEngineSchema145,
		form_id: shipEngineSchema145,
		created_at: shipEngineSchema194,
		ship_date: shipEngineSchema194,
		shipments: shipEngineSchema113,
		warehouse_id: shipEngineSchema145,
		submission_id: shipEngineSchema10,
		carrier_id: shipEngineSchema145,
		manifest_download: shipEngineSchema421,
		label_ids: shipEngineSchema410.optional(),
		request_id: shipEngineSchema158,
		errors: shipEngineSchema160,
	})
	.strict();
const shipEngineSchema422 = z
	.object({
		manifest_id: shipEngineSchema89,
		form_id: shipEngineSchema89,
		created_at: shipEngineSchema409,
		ship_date: shipEngineSchema409,
		shipments: shipEngineSchema113,
		label_ids: shipEngineSchema410,
		warehouse_id: shipEngineSchema89,
		submission_id: shipEngineSchema411,
		carrier_id: shipEngineSchema89,
		manifest_download: shipEngineSchema412,
	})
	.strict();
const shipEngineSchema423 = z
	.object({
		package_id: shipEngineSchema116.optional(),
		package_code: shipEngineSchema347,
		name: shipEngineSchema24,
		dimensions: shipEngineSchema349.optional(),
	})
	.strict();
const shipEngineSchema424 = z
	.object({
		package_id: shipEngineSchema145.optional(),
		package_code: shipEngineSchema149,
		name: shipEngineSchema16,
		dimensions: shipEngineSchema151.optional(),
	})
	.strict();
const shipEngineSchema428 = z.array(shipEngineSchema145);
const shipEngineSchema429 = z
	.object({
		name: shipEngineSchema10,
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10,
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10,
		state_province: shipEngineSchema10,
		postal_code: shipEngineSchema49,
		country_code: shipEngineSchema51.optional(),
		address_residential_indicator: shipEngineSchema53.optional(),
	})
	.strict();
const shipEngineSchema432 = z.string().email().min(1);
const shipEngineSchema431 = shipEngineSchema432;
const shipEngineSchema433 = z.string().min(7);
const shipEngineSchema430 = z.object({
	name: shipEngineSchema10,
	email: shipEngineSchema431,
	phone: shipEngineSchema433,
});
const shipEngineSchema435 = z
	.object({
		start_at: shipEngineSchema396.optional(),
		end_at: shipEngineSchema396.optional(),
	})
	.strict();
const shipEngineSchema434 = z.array(shipEngineSchema435);
const shipEngineSchema427 = z
	.object({
		pickup_id: shipEngineSchema14.optional(),
		label_ids: shipEngineSchema428.optional(),
		created_at: shipEngineSchema21.optional(),
		cancelled_at: shipEngineSchema21.optional(),
		carrier_id: shipEngineSchema89.optional(),
		confirmation_number: shipEngineSchema226.optional(),
		warehouse_id: shipEngineSchema89.optional(),
		pickup_address: shipEngineSchema429.optional(),
		contact_details: shipEngineSchema430.optional(),
		pickup_notes: shipEngineSchema191.optional(),
		pickup_windows: shipEngineSchema434.optional(),
	})
	.strict();
const shipEngineSchema426 = z.array(shipEngineSchema427);
const shipEngineSchema425 = z
	.object({
		pickups: shipEngineSchema426,
		total: shipEngineSchema112,
		page: shipEngineSchema113,
		pages: shipEngineSchema113,
		links: shipEngineSchema114,
		request_id: shipEngineSchema158,
		errors: shipEngineSchema160,
	})
	.strict();
const shipEngineSchema438 = z.string().min(7);
const shipEngineSchema437 = z
	.object({
		name: shipEngineSchema34,
		email: shipEngineSchema173,
		phone: shipEngineSchema438,
	})
	.strict();
const shipEngineSchema439 = z
	.object({ start_at: shipEngineSchema122, end_at: shipEngineSchema122 })
	.strict();
const shipEngineSchema436 = z
	.object({
		label_ids: shipEngineSchema118,
		contact_details: shipEngineSchema437,
		pickup_notes: shipEngineSchema202.optional(),
		pickup_window: shipEngineSchema439,
	})
	.strict();
const shipEngineSchema440 = z
	.object({
		pickup_id: shipEngineSchema14.optional(),
		label_ids: shipEngineSchema428.optional(),
		created_at: shipEngineSchema21.optional(),
		cancelled_at: shipEngineSchema21.optional(),
		carrier_id: shipEngineSchema89.optional(),
		confirmation_number: shipEngineSchema226.optional(),
		warehouse_id: shipEngineSchema89.optional(),
		pickup_address: shipEngineSchema429.optional(),
		contact_details: shipEngineSchema430.optional(),
		pickup_notes: shipEngineSchema191.optional(),
		pickup_windows: shipEngineSchema434.optional(),
		request_id: shipEngineSchema158,
		errors: shipEngineSchema160,
	})
	.strict();
const shipEngineSchema441 = z
	.object({
		pickup_id: shipEngineSchema14,
		label_ids: shipEngineSchema428,
		created_at: shipEngineSchema21,
		cancelled_at: shipEngineSchema21.optional(),
		carrier_id: shipEngineSchema89,
		confirmation_number: shipEngineSchema226,
		warehouse_id: shipEngineSchema89,
		pickup_address: shipEngineSchema429,
		contact_details: shipEngineSchema430,
		pickup_notes: shipEngineSchema191.optional(),
		pickup_windows: shipEngineSchema434.optional(),
		request_id: shipEngineSchema158,
		errors: shipEngineSchema160,
	})
	.strict();
const shipEngineSchema443 = shipEngineSchema15;
const shipEngineSchema442 = z
	.object({
		request_id: shipEngineSchema158,
		errors: shipEngineSchema160,
		pickup_id: shipEngineSchema443,
	})
	.strict();
const shipEngineSchema446 = z.array(shipEngineSchema116).min(1);
const shipEngineSchema447 = z.array(shipEngineSchema34);
const shipEngineSchema448 = z.union([
	z.literal('check'),
	z.literal('shipment'),
	z.literal('quick'),
]);
const shipEngineSchema445 = z
	.object({
		carrier_ids: shipEngineSchema446,
		package_types: shipEngineSchema447.optional(),
		service_codes: shipEngineSchema447.optional(),
		calculate_tax_amount: shipEngineSchema25.optional(),
		preferred_currency: shipEngineSchema163.optional(),
		is_return: shipEngineSchema25.optional(),
		rate_type: shipEngineSchema448.optional(),
	})
	.strict();
const shipEngineSchema449 = z
	.object({
		validate_address: shipEngineSchema378.optional(),
		carrier_id: shipEngineSchema116,
		service_code: shipEngineSchema282,
		shipping_rule_id: shipEngineSchema116.optional(),
		external_order_id: shipEngineSchema36.optional(),
		items: shipEngineSchema283.optional(),
		tax_identifiers: shipEngineSchema288.optional(),
		external_shipment_id: shipEngineSchema294.optional(),
		shipment_number: shipEngineSchema294.optional(),
		ship_date: shipEngineSchema295.optional(),
		ship_to: shipEngineSchema297,
		ship_from: shipEngineSchema303,
		warehouse_id: shipEngineSchema302.optional(),
		return_to: shipEngineSchema303.optional(),
		is_return: shipEngineSchema304.optional(),
		confirmation: shipEngineSchema305.optional(),
		customs: shipEngineSchema307.optional(),
		advanced_options: shipEngineSchema325.optional(),
		insurance_provider: shipEngineSchema343.optional(),
		order_source_code: shipEngineSchema286.optional(),
		packages: shipEngineSchema345.optional(),
		comparison_rate_type: shipEngineSchema365.optional(),
	})
	.strict();
const shipEngineSchema444 = z.union([
	z
		.object({
			rate_options: shipEngineSchema445.optional(),
			ship_to_service_point_id: shipEngineSchema365.optional(),
			ship_from_service_point_id: shipEngineSchema365.optional(),
			shipment_id: shipEngineSchema116,
		})
		.strict(),
	z
		.object({
			rate_options: shipEngineSchema445.optional(),
			ship_to_service_point_id: shipEngineSchema365.optional(),
			ship_from_service_point_id: shipEngineSchema365.optional(),
			shipment: shipEngineSchema449,
		})
		.strict(),
]);
const shipEngineSchema451 = shipEngineSchema241;
const shipEngineSchema454 = z.number().int().min(0);
const shipEngineSchema455 = z.string().nullable();
const shipEngineSchema456 = z.string().min(10).max(10).nullable();
const shipEngineSchema458 = z.union([
	z.literal('amazon_ca'),
	z.literal('amazon_us'),
	z.literal('brightpearl'),
	z.literal('channel_advisor'),
	z.literal('cratejoy'),
	z.literal('ebay'),
	z.literal('etsy'),
	z.literal('jane'),
	z.literal('groupon_goods'),
	z.literal('magento'),
	z.literal('paypal'),
	z.literal('seller_active'),
	z.literal('shopify'),
	z.literal('stitch_labs'),
	z.literal('squarespace'),
	z.literal('three_dcart'),
	z.literal('tophatter'),
	z.literal('walmart'),
	z.literal('woo_commerce'),
	z.literal('volusion'),
]);
const shipEngineSchema457 = shipEngineSchema458;
const shipEngineSchema453 = z
	.object({
		name: shipEngineSchema191.optional(),
		sales_order_id: shipEngineSchema47.optional(),
		sales_order_item_id: shipEngineSchema47.optional(),
		quantity: shipEngineSchema454.optional(),
		sku: shipEngineSchema47.optional(),
		bundle_sku: shipEngineSchema455.optional(),
		external_order_id: shipEngineSchema47.optional(),
		external_order_item_id: shipEngineSchema47.optional(),
		asin: shipEngineSchema456.optional(),
		order_source_code: shipEngineSchema457.optional(),
	})
	.strict();
const shipEngineSchema452 = z.array(shipEngineSchema453);
const shipEngineSchema462 = z.union([
	z.literal('shipper'),
	z.literal('recipient'),
	z.literal('ior'),
]);
const shipEngineSchema461 = shipEngineSchema462;
const shipEngineSchema464 = z.union([
	z.literal('vat'),
	z.literal('eori'),
	z.literal('ssn'),
	z.literal('ein'),
	z.literal('tin'),
	z.literal('ioss'),
	z.literal('pan'),
	z.literal('voec'),
	z.literal('pccc'),
	z.literal('oss'),
	z.literal('passport'),
	z.literal('abn'),
	z.literal('ukims'),
]);
const shipEngineSchema463 = shipEngineSchema464;
const shipEngineSchema460 = z
	.object({
		taxable_entity_type: shipEngineSchema461,
		identifier_type: shipEngineSchema463,
		issuing_authority: shipEngineSchema20,
		value: shipEngineSchema20,
	})
	.strict();
const shipEngineSchema459 = z.array(shipEngineSchema460).nullable();
const shipEngineSchema465 = z.string().max(50).nullable();
const shipEngineSchema466 = shipEngineSchema228;
const shipEngineSchema468 = z.union([
	z.literal('pending'),
	z.literal('processing'),
	z.literal('label_purchased'),
	z.literal('cancelled'),
]);
const shipEngineSchema467 = shipEngineSchema468;
const shipEngineSchema469 = z
	.object({
		name: shipEngineSchema10,
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10,
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10,
		state_province: shipEngineSchema10,
		postal_code: shipEngineSchema49,
		country_code: shipEngineSchema51.optional(),
		address_residential_indicator: shipEngineSchema53.optional(),
		instructions: shipEngineSchema48.optional(),
		geolocation: shipEngineSchema271.optional(),
	})
	.strict();
const shipEngineSchema470 = z
	.object({
		name: shipEngineSchema10,
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10,
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10,
		state_province: shipEngineSchema10,
		postal_code: shipEngineSchema49,
		country_code: shipEngineSchema51.optional(),
		address_residential_indicator: shipEngineSchema53.optional(),
		instructions: shipEngineSchema48.optional(),
	})
	.strict();
const shipEngineSchema471 = shipEngineSchema90.nullable();
const shipEngineSchema472 = z.boolean().nullable();
const shipEngineSchema473 = shipEngineSchema251;
const shipEngineSchema476 = z.union([
	z.literal('merchandise'),
	z.literal('documents'),
	z.literal('gift'),
	z.literal('returned_goods'),
	z.literal('sample'),
	z.literal('other'),
]);
const shipEngineSchema475 = shipEngineSchema476;
const shipEngineSchema478 = z.union([
	z.literal('return_to_sender'),
	z.literal('treat_as_abandoned'),
]);
const shipEngineSchema477 = shipEngineSchema478;
const shipEngineSchema480 = z.union([
	z.literal('exw'),
	z.literal('fca'),
	z.literal('cpt'),
	z.literal('cip'),
	z.literal('dpu'),
	z.literal('dap'),
	z.literal('ddp'),
	z.literal('fas'),
	z.literal('fob'),
	z.literal('cfr'),
	z.literal('cif'),
	z.literal('ddu'),
	z.literal('daf'),
	z.literal('deq'),
	z.literal('des'),
]);
const shipEngineSchema479 = shipEngineSchema480;
const shipEngineSchema482 = z
	.object({
		taxes: shipEngineSchema233.optional(),
		duties: shipEngineSchema233.optional(),
	})
	.strict();
const shipEngineSchema481 = z
	.object({
		freight_charge: shipEngineSchema233.optional(),
		insurance_charge: shipEngineSchema233.optional(),
		discount: shipEngineSchema233.optional(),
		estimated_import_charges: shipEngineSchema482.optional(),
		other_charge: shipEngineSchema233.optional(),
		other_charge_description: shipEngineSchema20.optional(),
		invoice_number: shipEngineSchema20.optional(),
	})
	.strict();
const shipEngineSchema483 = z
	.object({
		name: shipEngineSchema10,
		phone: shipEngineSchema10.optional(),
		email: shipEngineSchema47.optional(),
		company_name: shipEngineSchema48.optional(),
		address_line1: shipEngineSchema10,
		address_line2: shipEngineSchema48.optional(),
		address_line3: shipEngineSchema48.optional(),
		city_locality: shipEngineSchema10,
		state_province: shipEngineSchema10.optional(),
		postal_code: shipEngineSchema49,
		country_code: shipEngineSchema51,
	})
	.strict();
const shipEngineSchema486 = shipEngineSchema52.nullable();
const shipEngineSchema485 = z
	.object({
		customs_item_id: shipEngineSchema89,
		quantity: shipEngineSchema454.optional(),
		value: shipEngineSchema154.optional(),
		value_currency: shipEngineSchema20.optional(),
		weight: shipEngineSchema259.optional(),
		harmonized_tariff_code: shipEngineSchema47.optional(),
		country_of_origin: shipEngineSchema486.optional(),
		unit_of_measure: shipEngineSchema47.optional(),
		sku: shipEngineSchema47.optional(),
		sku_description: shipEngineSchema47.optional(),
	})
	.strict();
const shipEngineSchema484 = z.array(shipEngineSchema485).min(0);
const shipEngineSchema474 = z
	.object({
		contents: shipEngineSchema475,
		contents_explanation: shipEngineSchema20.optional(),
		non_delivery: shipEngineSchema477,
		terms_of_trade_code: shipEngineSchema479.optional(),
		declaration: shipEngineSchema20.optional(),
		invoice_additional_details: shipEngineSchema481.optional(),
		importer_of_record: shipEngineSchema483.optional(),
		license_number: shipEngineSchema20.optional(),
		certificate_number: shipEngineSchema20.optional(),
		customs_items: shipEngineSchema484.optional(),
	})
	.strict()
	.nullable();
const shipEngineSchema489 = z.union([
	z.literal('recipient'),
	z.literal('third_party'),
]);
const shipEngineSchema488 = shipEngineSchema489.nullable();
const shipEngineSchema490 = z
	.object({ value: shipEngineSchema260, unit: shipEngineSchema261 })
	.strict()
	.nullable();
const shipEngineSchema491 = z.object({
	shipper_load_and_count: shipEngineSchema20.optional(),
	booking_confirmation: shipEngineSchema20.optional(),
});
const shipEngineSchema492 = z.string().max(100).nullable();
const shipEngineSchema494 = z.union([
	z.literal('pickup'),
	z.literal('drop_off'),
]);
const shipEngineSchema493 = shipEngineSchema494.nullable();
const shipEngineSchema497 = z.union([
	z.literal('any'),
	z.literal('cash'),
	z.literal('cash_equivalent'),
	z.literal('none'),
]);
const shipEngineSchema496 = shipEngineSchema497;
const shipEngineSchema499 = z.number().min(0);
const shipEngineSchema498 = z.object({
	currency: shipEngineSchema167.optional(),
	amount: shipEngineSchema499.optional(),
});
const shipEngineSchema495 = z.object({
	payment_type: shipEngineSchema496.optional(),
	payment_amount: shipEngineSchema498.optional(),
});
const shipEngineSchema500 = z.object({
	name: shipEngineSchema20.optional(),
	phone: shipEngineSchema20.optional(),
});
const shipEngineSchema502 = z.union([
	z.literal('c2c'),
	z.literal('b2c'),
	z.literal('c2b'),
	z.literal('b2b'),
]);
const shipEngineSchema501 = z.object({
	movement_indicator: shipEngineSchema502.optional(),
	not_at_risk: shipEngineSchema17.optional(),
});
const shipEngineSchema504 = z.union([
	z.literal('day_old_poultry'),
	z.literal('other_live_animal'),
]);
const shipEngineSchema503 = shipEngineSchema504.nullable();
const shipEngineSchema487 = z
	.object({
		bill_to_account: shipEngineSchema47.optional(),
		bill_to_country_code: shipEngineSchema486.optional(),
		bill_to_party: shipEngineSchema488.optional(),
		bill_to_postal_code: shipEngineSchema47.optional(),
		contains_alcohol: shipEngineSchema17.optional(),
		delivered_duty_paid: shipEngineSchema17.optional(),
		dry_ice: shipEngineSchema17.optional(),
		dry_ice_weight: shipEngineSchema490.optional(),
		non_machinable: shipEngineSchema17.optional(),
		saturday_delivery: shipEngineSchema17.optional(),
		fedex_freight: shipEngineSchema491.optional(),
		use_ups_ground_freight_pricing: shipEngineSchema472.optional(),
		freight_class: shipEngineSchema47.optional(),
		custom_field1: shipEngineSchema492.optional(),
		custom_field2: shipEngineSchema492.optional(),
		custom_field3: shipEngineSchema492.optional(),
		origin_type: shipEngineSchema493.optional(),
		additional_handling: shipEngineSchema472.optional(),
		shipper_release: shipEngineSchema472.optional(),
		collect_on_delivery: shipEngineSchema495.optional(),
		third_party_consignee: shipEngineSchema17.optional(),
		dangerous_goods: shipEngineSchema17.optional(),
		dangerous_goods_contact: shipEngineSchema500.optional(),
		windsor_framework_details: shipEngineSchema501.optional(),
		license_number: shipEngineSchema47.optional(),
		invoice_number: shipEngineSchema47.optional(),
		certificate_number: shipEngineSchema47.optional(),
		fragile: shipEngineSchema17.optional(),
		'delivery-as-addressed': shipEngineSchema17.optional(),
		'return-after-first-attempt': shipEngineSchema17.optional(),
		regulated_content_type: shipEngineSchema503.optional(),
	})
	.catchall(z.json());
const shipEngineSchema506 = z.union([
	z.literal('none'),
	z.literal('shipsurance'),
	z.literal('carrier'),
	z.literal('third_party'),
]);
const shipEngineSchema505 = shipEngineSchema506;
const shipEngineSchema508 = z
	.object({
		tag_id: shipEngineSchema113.optional(),
		name: shipEngineSchema10,
		color: shipEngineSchema10.optional(),
	})
	.strict();
const shipEngineSchema507 = z.array(shipEngineSchema508).min(0);
const shipEngineSchema511 = shipEngineSchema90;
const shipEngineSchema514 = z.number().nullable();
const shipEngineSchema517 = z.union([
	z.literal('i'),
	z.literal('ii'),
	z.literal('iii'),
]);
const shipEngineSchema518 = z
	.object({
		amount: shipEngineSchema154.optional(),
		unit: shipEngineSchema47.optional(),
	})
	.strict();
const shipEngineSchema519 = z.union([
	z.literal('section_1'),
	z.literal('section_2'),
	z.literal('section_1a'),
	z.literal('section_1b'),
]);
const shipEngineSchema520 = z.union([
	z.literal('ground'),
	z.literal('water'),
	z.literal('cargo_aircraft_only'),
	z.literal('passenger_aircraft'),
]);
const shipEngineSchema521 = z.union([
	z.literal('lightly_regulated'),
	z.literal('fully_regulated'),
	z.literal('limited_quantities'),
	z.literal('excepted_quantity'),
]);
const shipEngineSchema516 = z
	.object({
		id_number: shipEngineSchema47.optional(),
		shipping_name: shipEngineSchema47.optional(),
		technical_name: shipEngineSchema47.optional(),
		product_class: shipEngineSchema47.optional(),
		product_class_subsidiary: shipEngineSchema47.optional(),
		packaging_group: shipEngineSchema517.optional(),
		dangerous_amount: shipEngineSchema518.optional(),
		quantity: shipEngineSchema454.optional(),
		packaging_instruction: shipEngineSchema47.optional(),
		packaging_instruction_section: shipEngineSchema519.optional(),
		packaging_type: shipEngineSchema47.optional(),
		transport_mean: shipEngineSchema520.optional(),
		transport_category: shipEngineSchema47.optional(),
		regulation_authority: shipEngineSchema47.optional(),
		regulation_level: shipEngineSchema521.optional(),
		radioactive: shipEngineSchema472.optional(),
		reportable_quantity: shipEngineSchema472.optional(),
		tunnel_code: shipEngineSchema47.optional(),
		additional_description: shipEngineSchema47.optional(),
	})
	.strict();
const shipEngineSchema515 = z.array(shipEngineSchema516).min(0);
const shipEngineSchema522 = z.record(z.string(), z.json());
const shipEngineSchema513 = z
	.object({
		quantity: shipEngineSchema454.optional(),
		value: shipEngineSchema233.optional(),
		weight: shipEngineSchema259.optional(),
		harmonized_tariff_code: shipEngineSchema47.optional(),
		country_of_origin: shipEngineSchema486.optional(),
		unit_of_measure: shipEngineSchema47.optional(),
		sku: shipEngineSchema47.optional(),
		sku_description: shipEngineSchema47.optional(),
		mid_code: shipEngineSchema47.optional(),
		product_url: shipEngineSchema47.optional(),
		vat_rate: shipEngineSchema514.optional(),
		dangerous_goods: shipEngineSchema515.optional(),
		extended_details: shipEngineSchema522.optional(),
	})
	.strict();
const shipEngineSchema512 = z.array(shipEngineSchema513).min(0);
const shipEngineSchema510 = z
	.object({
		shipment_package_id: shipEngineSchema511.optional(),
		package_id: shipEngineSchema145.optional(),
		package_code: shipEngineSchema149.optional(),
		package_name: shipEngineSchema20.optional(),
		weight: shipEngineSchema259,
		dimensions: shipEngineSchema151.optional(),
		insured_value: shipEngineSchema233.optional(),
		label_messages: shipEngineSchema264.optional(),
		external_package_id: shipEngineSchema10.optional(),
		tracking_number: shipEngineSchema263.optional(),
		content_description: shipEngineSchema265.optional(),
		products: shipEngineSchema512.optional(),
	})
	.strict();
const shipEngineSchema509 = z.array(shipEngineSchema510).min(1);
const shipEngineSchema523 = z
	.object({ value: shipEngineSchema260, unit: shipEngineSchema261 })
	.strict();
const shipEngineSchema524 = z.string().nullable();
const shipEngineSchema525 = z.number().int().min(0).nullable();
const shipEngineSchema530 = z.union([
	z.literal('check'),
	z.literal('shipment'),
]);
const shipEngineSchema529 = shipEngineSchema530;
const shipEngineSchema531 = z.string().min(1).nullable();
const shipEngineSchema532 = z.number().int().min(1).nullable();
const shipEngineSchema533 = shipEngineSchema228.nullable();
const shipEngineSchema534 = z.string().datetime({ offset: true }).min(1);
const shipEngineSchema536 = z.union([
	z.literal('valid'),
	z.literal('invalid'),
	z.literal('has_warnings'),
	z.literal('unknown'),
]);
const shipEngineSchema535 = shipEngineSchema536;
const shipEngineSchema537 = z.array(shipEngineSchema394).min(0);
const shipEngineSchema539 = shipEngineSchema384;
const shipEngineSchema538 = z.array(shipEngineSchema539);
const shipEngineSchema528 = z
	.object({
		rate_id: shipEngineSchema89,
		rate_type: shipEngineSchema529,
		carrier_id: shipEngineSchema89,
		shipping_amount: shipEngineSchema166,
		insurance_amount: shipEngineSchema166,
		confirmation_amount: shipEngineSchema166,
		other_amount: shipEngineSchema166,
		requested_comparison_amount: shipEngineSchema166.optional(),
		tax_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		zone: shipEngineSchema525,
		package_type: shipEngineSchema531,
		delivery_days: shipEngineSchema532.optional(),
		guaranteed_service: shipEngineSchema140,
		estimated_delivery_date: shipEngineSchema533.optional(),
		carrier_delivery_days: shipEngineSchema71.optional(),
		ship_date: shipEngineSchema534.optional(),
		negotiated_rate: shipEngineSchema140,
		service_type: shipEngineSchema71,
		service_code: shipEngineSchema71,
		trackable: shipEngineSchema140,
		carrier_code: shipEngineSchema71,
		carrier_nickname: shipEngineSchema71,
		carrier_friendly_name: shipEngineSchema71,
		validation_status: shipEngineSchema535,
		warning_messages: shipEngineSchema537,
		error_messages: shipEngineSchema537,
		rate_attributes: shipEngineSchema538.optional(),
	})
	.strict();
const shipEngineSchema527 = z.array(shipEngineSchema528);
const shipEngineSchema541 = z
	.object({
		rate_id: shipEngineSchema89,
		rate_type: shipEngineSchema529,
		carrier_id: shipEngineSchema89,
		shipping_amount: shipEngineSchema166,
		insurance_amount: shipEngineSchema166,
		confirmation_amount: shipEngineSchema166,
		other_amount: shipEngineSchema166,
		requested_comparison_amount: shipEngineSchema166.optional(),
		tax_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		zone: shipEngineSchema525,
		package_type: shipEngineSchema531,
		delivery_days: shipEngineSchema532.optional(),
		guaranteed_service: shipEngineSchema140,
		estimated_delivery_date: shipEngineSchema533.optional(),
		carrier_delivery_days: shipEngineSchema71.optional(),
		ship_date: shipEngineSchema534.optional(),
		negotiated_rate: shipEngineSchema140,
		service_type: shipEngineSchema71,
		service_code: shipEngineSchema71,
		trackable: shipEngineSchema140,
		carrier_code: shipEngineSchema71,
		carrier_nickname: shipEngineSchema71,
		carrier_friendly_name: shipEngineSchema71,
		validation_status: shipEngineSchema535,
		warning_messages: shipEngineSchema537,
		error_messages: shipEngineSchema537,
	})
	.strict();
const shipEngineSchema540 = z.array(shipEngineSchema541);
const shipEngineSchema542 = shipEngineSchema90;
const shipEngineSchema544 = z.union([
	z.literal('working'),
	z.literal('completed'),
	z.literal('partial'),
	z.literal('error'),
]);
const shipEngineSchema543 = shipEngineSchema544;
const shipEngineSchema545 = z.array(shipEngineSchema97);
const shipEngineSchema526 = z
	.object({
		rates: shipEngineSchema527.optional(),
		invalid_rates: shipEngineSchema540.optional(),
		rate_request_id: shipEngineSchema89.optional(),
		shipment_id: shipEngineSchema89.optional(),
		created_at: shipEngineSchema542.optional(),
		status: shipEngineSchema543.optional(),
		errors: shipEngineSchema545.optional(),
	})
	.strict();
const shipEngineSchema450 = z
	.object({
		shipment_id: shipEngineSchema89,
		carrier_id: shipEngineSchema145.optional(),
		service_code: shipEngineSchema451.optional(),
		shipping_rule_id: shipEngineSchema145.optional(),
		external_order_id: shipEngineSchema47.optional(),
		items: shipEngineSchema452.optional(),
		tax_identifiers: shipEngineSchema459.optional(),
		external_shipment_id: shipEngineSchema465.optional(),
		shipment_number: shipEngineSchema465.optional(),
		ship_date: shipEngineSchema466,
		created_at: shipEngineSchema21,
		modified_at: shipEngineSchema21,
		shipment_status: shipEngineSchema467,
		ship_to: shipEngineSchema469.optional(),
		ship_from: shipEngineSchema470.optional(),
		warehouse_id: shipEngineSchema471.optional(),
		return_to: shipEngineSchema470,
		is_return: shipEngineSchema472.optional(),
		confirmation: shipEngineSchema473,
		customs: shipEngineSchema474,
		advanced_options: shipEngineSchema487,
		insurance_provider: shipEngineSchema505,
		tags: shipEngineSchema507,
		order_source_code: shipEngineSchema457.optional(),
		packages: shipEngineSchema509,
		total_weight: shipEngineSchema523,
		comparison_rate_type: shipEngineSchema524.optional(),
		zone: shipEngineSchema525.optional(),
		rate_response: shipEngineSchema526,
	})
	.strict();
const shipEngineSchema547 = z.array(shipEngineSchema449).min(1);
const shipEngineSchema546 = z.union([
	z
		.object({
			rate_options: shipEngineSchema445,
			ship_to_service_point_id: shipEngineSchema365.optional(),
			ship_from_service_point_id: shipEngineSchema365.optional(),
			shipment_ids: shipEngineSchema118,
		})
		.strict(),
	z
		.object({
			rate_options: shipEngineSchema445,
			ship_to_service_point_id: shipEngineSchema365.optional(),
			ship_from_service_point_id: shipEngineSchema365.optional(),
			shipments: shipEngineSchema547,
		})
		.strict(),
]);
const shipEngineSchema550 = shipEngineSchema22;
const shipEngineSchema552 = z
	.object({
		error_source: shipEngineSchema98,
		error_type: shipEngineSchema100,
		error_code: shipEngineSchema102,
		message: shipEngineSchema71,
		carrier_id: shipEngineSchema89.optional(),
		carrier_code: shipEngineSchema104.optional(),
		field_name: shipEngineSchema106.optional(),
	})
	.strict();
const shipEngineSchema551 = z.array(shipEngineSchema552);
const shipEngineSchema549 = z
	.object({
		rate_request_id: shipEngineSchema89,
		shipment_id: shipEngineSchema89,
		created_at: shipEngineSchema550,
		status: shipEngineSchema543,
		errors: shipEngineSchema551,
	})
	.strict();
const shipEngineSchema548 = z.array(shipEngineSchema549);
const shipEngineSchema554 = shipEngineSchema123;
const shipEngineSchema556 = shipEngineSchema117;
const shipEngineSchema555 = z.array(shipEngineSchema556).min(1);
const shipEngineSchema553 = z.union([
	z
		.object({
			from_country_code: shipEngineSchema40,
			from_postal_code: shipEngineSchema38,
			from_city_locality: shipEngineSchema34,
			from_state_province: shipEngineSchema34,
			to_country_code: shipEngineSchema40,
			to_postal_code: shipEngineSchema38,
			to_city_locality: shipEngineSchema34,
			to_state_province: shipEngineSchema34,
			weight: shipEngineSchema320,
			dimensions: shipEngineSchema349.optional(),
			confirmation: shipEngineSchema305.optional(),
			address_residential_indicator: shipEngineSchema42.optional(),
			ship_date: shipEngineSchema554,
			carrier_id: shipEngineSchema116.optional(),
		})
		.strict(),
	z
		.object({
			from_country_code: shipEngineSchema40,
			from_postal_code: shipEngineSchema38,
			from_city_locality: shipEngineSchema34,
			from_state_province: shipEngineSchema34,
			to_country_code: shipEngineSchema40,
			to_postal_code: shipEngineSchema38,
			to_city_locality: shipEngineSchema34,
			to_state_province: shipEngineSchema34,
			weight: shipEngineSchema320,
			dimensions: shipEngineSchema349.optional(),
			confirmation: shipEngineSchema305.optional(),
			address_residential_indicator: shipEngineSchema42.optional(),
			ship_date: shipEngineSchema554,
			carrier_ids: shipEngineSchema555.optional(),
		})
		.strict(),
]);
const shipEngineSchema558 = z
	.object({
		rate_type: shipEngineSchema529,
		carrier_id: shipEngineSchema89,
		shipping_amount: shipEngineSchema166,
		insurance_amount: shipEngineSchema166,
		confirmation_amount: shipEngineSchema166,
		other_amount: shipEngineSchema166,
		tax_amount: shipEngineSchema166.optional(),
		zone: shipEngineSchema525,
		package_type: shipEngineSchema531,
		delivery_days: shipEngineSchema113.optional(),
		guaranteed_service: shipEngineSchema140,
		estimated_delivery_date: shipEngineSchema533.optional(),
		carrier_delivery_days: shipEngineSchema71.optional(),
		ship_date: shipEngineSchema534.optional(),
		negotiated_rate: shipEngineSchema140,
		service_type: shipEngineSchema71,
		service_code: shipEngineSchema71,
		trackable: shipEngineSchema140,
		carrier_code: shipEngineSchema71,
		carrier_nickname: shipEngineSchema71,
		carrier_friendly_name: shipEngineSchema71,
		validation_status: shipEngineSchema535,
		warning_messages: shipEngineSchema537,
		error_messages: shipEngineSchema537,
		rate_attributes: shipEngineSchema538.optional(),
	})
	.strict();
const shipEngineSchema557 = z.array(shipEngineSchema558);
const shipEngineSchema559 = z
	.object({
		rate_id: shipEngineSchema89,
		rate_type: shipEngineSchema529,
		carrier_id: shipEngineSchema89,
		shipping_amount: shipEngineSchema166,
		insurance_amount: shipEngineSchema166,
		confirmation_amount: shipEngineSchema166,
		other_amount: shipEngineSchema166,
		requested_comparison_amount: shipEngineSchema166.optional(),
		tax_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		zone: shipEngineSchema525,
		package_type: shipEngineSchema531,
		delivery_days: shipEngineSchema113.optional(),
		guaranteed_service: shipEngineSchema140,
		estimated_delivery_date: shipEngineSchema533.optional(),
		carrier_delivery_days: shipEngineSchema71.optional(),
		ship_date: shipEngineSchema534.optional(),
		negotiated_rate: shipEngineSchema140,
		service_type: shipEngineSchema71,
		service_code: shipEngineSchema71,
		trackable: shipEngineSchema140,
		carrier_code: shipEngineSchema71,
		carrier_nickname: shipEngineSchema71,
		carrier_friendly_name: shipEngineSchema71,
		validation_status: shipEngineSchema535,
		warning_messages: shipEngineSchema537,
		error_messages: shipEngineSchema537,
	})
	.strict();
const shipEngineSchema562 = shipEngineSchema39;
const shipEngineSchema563 = shipEngineSchema41;
const shipEngineSchema561 = z
	.object({
		address_line1: shipEngineSchema28.optional(),
		address_line2: shipEngineSchema28.optional(),
		address_line3: shipEngineSchema28.optional(),
		city_locality: shipEngineSchema28.optional(),
		state_province: shipEngineSchema28.optional(),
		postal_code: shipEngineSchema562.optional(),
		country_code: shipEngineSchema563,
	})
	.strict();
const shipEngineSchema566 = z.array(shipEngineSchema28);
const shipEngineSchema565 = z
	.object({
		carrier_id: shipEngineSchema28.optional(),
		service_code: shipEngineSchema566.optional(),
	})
	.strict();
const shipEngineSchema564 = z.array(shipEngineSchema565);
const shipEngineSchema567 = z.number();
const shipEngineSchema568 = z.number().int();
const shipEngineSchema571 = z
	.object({ dimensions: shipEngineSchema349.optional() })
	.strict();
const shipEngineSchema570 = z.array(shipEngineSchema571);
const shipEngineSchema569 = z
	.object({
		total_weight: shipEngineSchema320.optional(),
		packages: shipEngineSchema570.optional(),
	})
	.strict();
const shipEngineSchema560 = z
	.object({
		address_query: shipEngineSchema28.optional(),
		address: shipEngineSchema561.optional(),
		providers: shipEngineSchema564,
		lat: shipEngineSchema567.optional(),
		long: shipEngineSchema567.optional(),
		radius: shipEngineSchema568.optional(),
		max_results: shipEngineSchema568.optional(),
		shipment: shipEngineSchema569.optional(),
	})
	.strict();
const shipEngineSchema573 = z.number();
const shipEngineSchema576 = z.array(shipEngineSchema20);
const shipEngineSchema579 = z.object({
	open: shipEngineSchema20.optional(),
	close: shipEngineSchema20.optional(),
});
const shipEngineSchema578 = z.array(shipEngineSchema579);
const shipEngineSchema577 = z.object({
	monday: shipEngineSchema578.optional(),
	tuesday: shipEngineSchema578.optional(),
	wednesday: shipEngineSchema578.optional(),
	thursday: shipEngineSchema578.optional(),
	friday: shipEngineSchema578.optional(),
	saturday: shipEngineSchema578.optional(),
	sunday: shipEngineSchema578.optional(),
});
const shipEngineSchema581 = z.union([
	z.literal('drop_off_point'),
	z.literal('pickup_point'),
	z.literal('print_services'),
	z.literal('after_hours_locker'),
	z.literal('after_hours_dropbox'),
]);
const shipEngineSchema580 = z.array(shipEngineSchema581);
const shipEngineSchema582 = z.union([z.literal('pudo'), z.literal('locker')]);
const shipEngineSchema575 = z.object({
	carrier_code: shipEngineSchema393.optional(),
	service_codes: shipEngineSchema576.optional(),
	service_point_id: shipEngineSchema20.optional(),
	company_name: shipEngineSchema20.optional(),
	address_line1: shipEngineSchema20.optional(),
	city_locality: shipEngineSchema20.optional(),
	state_province: shipEngineSchema20.optional(),
	postal_code: shipEngineSchema49.optional(),
	country_code: shipEngineSchema51.optional(),
	phone_number: shipEngineSchema20.optional(),
	lat: shipEngineSchema573.optional(),
	long: shipEngineSchema573.optional(),
	distance_in_meters: shipEngineSchema573.optional(),
	hours_of_operation: shipEngineSchema577.optional(),
	features: shipEngineSchema580.optional(),
	type: shipEngineSchema582.optional(),
});
const shipEngineSchema574 = z.array(shipEngineSchema575);
const shipEngineSchema572 = z.object({
	lat: shipEngineSchema573.optional(),
	long: shipEngineSchema573.optional(),
	service_points: shipEngineSchema574.optional(),
	errors: shipEngineSchema160.optional(),
});
const shipEngineSchema584 = z.object({
	carrier_code: shipEngineSchema393.optional(),
	service_codes: shipEngineSchema576.optional(),
	service_point_id: shipEngineSchema20.optional(),
	company_name: shipEngineSchema20.optional(),
	address_line1: shipEngineSchema20.optional(),
	city_locality: shipEngineSchema20.optional(),
	state_province: shipEngineSchema20.optional(),
	postal_code: shipEngineSchema49.optional(),
	country_code: shipEngineSchema51.optional(),
	phone_number: shipEngineSchema20.optional(),
	lat: shipEngineSchema573.optional(),
	long: shipEngineSchema573.optional(),
	hours_of_operation: shipEngineSchema577.optional(),
	features: shipEngineSchema580.optional(),
	type: shipEngineSchema582.optional(),
});
const shipEngineSchema583 = z.object({
	service_point: shipEngineSchema584.optional(),
});
const shipEngineSchema585 = z.union([
	z.literal('pending'),
	z.literal('processing'),
	z.literal('label_purchased'),
	z.literal('cancelled'),
]);
const shipEngineSchema586 = z.union([
	z.literal('modified_at'),
	z.literal('created_at'),
]);
const shipEngineSchema589 = z
	.object({
		shipment_id: shipEngineSchema89,
		carrier_id: shipEngineSchema145,
		service_code: shipEngineSchema451,
		shipping_rule_id: shipEngineSchema145.optional(),
		external_order_id: shipEngineSchema47.optional(),
		items: shipEngineSchema452.optional(),
		tax_identifiers: shipEngineSchema459.optional(),
		external_shipment_id: shipEngineSchema465.optional(),
		shipment_number: shipEngineSchema465.optional(),
		ship_date: shipEngineSchema466,
		created_at: shipEngineSchema21,
		modified_at: shipEngineSchema21,
		shipment_status: shipEngineSchema467,
		ship_to: shipEngineSchema469,
		ship_from: shipEngineSchema470,
		warehouse_id: shipEngineSchema471,
		return_to: shipEngineSchema470,
		is_return: shipEngineSchema472.optional(),
		confirmation: shipEngineSchema473,
		customs: shipEngineSchema474,
		advanced_options: shipEngineSchema487,
		insurance_provider: shipEngineSchema505,
		tags: shipEngineSchema507,
		order_source_code: shipEngineSchema457.optional(),
		packages: shipEngineSchema509,
		total_weight: shipEngineSchema523,
		comparison_rate_type: shipEngineSchema524.optional(),
		zone: shipEngineSchema525.optional(),
	})
	.strict();
const shipEngineSchema588 = z.array(shipEngineSchema589);
const shipEngineSchema587 = z
	.object({
		shipments: shipEngineSchema588,
		total: shipEngineSchema112,
		page: shipEngineSchema113,
		pages: shipEngineSchema113,
		links: shipEngineSchema114,
	})
	.strict();
const shipEngineSchema590 = z
	.object({ shipments: shipEngineSchema547 })
	.strict();
const shipEngineSchema594 = z.array(shipEngineSchema10);
const shipEngineSchema595 = z
	.object({
		status: shipEngineSchema63,
		original_address: shipEngineSchema65,
		matched_address: shipEngineSchema66,
		messages: shipEngineSchema67,
	})
	.strict();
const shipEngineSchema593 = z
	.object({
		shipment_id: shipEngineSchema89.optional(),
		carrier_id: shipEngineSchema145.optional(),
		service_code: shipEngineSchema451.optional(),
		shipping_rule_id: shipEngineSchema145.optional(),
		external_order_id: shipEngineSchema47.optional(),
		items: shipEngineSchema452.optional(),
		tax_identifiers: shipEngineSchema459.optional(),
		external_shipment_id: shipEngineSchema465.optional(),
		shipment_number: shipEngineSchema465.optional(),
		ship_date: shipEngineSchema466.optional(),
		created_at: shipEngineSchema21.optional(),
		modified_at: shipEngineSchema21.optional(),
		shipment_status: shipEngineSchema467.optional(),
		ship_to: shipEngineSchema469.optional(),
		ship_from: shipEngineSchema470.optional(),
		warehouse_id: shipEngineSchema471.optional(),
		return_to: shipEngineSchema470.optional(),
		is_return: shipEngineSchema472.optional(),
		confirmation: shipEngineSchema473.optional(),
		customs: shipEngineSchema474.optional(),
		advanced_options: shipEngineSchema487.optional(),
		insurance_provider: shipEngineSchema505.optional(),
		tags: shipEngineSchema507.optional(),
		order_source_code: shipEngineSchema457.optional(),
		packages: shipEngineSchema509.optional(),
		total_weight: shipEngineSchema523.optional(),
		comparison_rate_type: shipEngineSchema524.optional(),
		zone: shipEngineSchema525.optional(),
		errors: shipEngineSchema594.optional(),
		address_validation: shipEngineSchema595.optional(),
	})
	.strict();
const shipEngineSchema592 = z.array(shipEngineSchema593);
const shipEngineSchema591 = z
	.object({ has_errors: shipEngineSchema17, shipments: shipEngineSchema592 })
	.strict();
const shipEngineSchema596 = z
	.object({
		shipment_id: shipEngineSchema89,
		carrier_id: shipEngineSchema145,
		service_code: shipEngineSchema451,
		shipping_rule_id: shipEngineSchema145.optional(),
		external_order_id: shipEngineSchema47.optional(),
		items: shipEngineSchema452.optional(),
		tax_identifiers: shipEngineSchema459.optional(),
		external_shipment_id: shipEngineSchema465.optional(),
		shipment_number: shipEngineSchema465.optional(),
		ship_date: shipEngineSchema466,
		created_at: shipEngineSchema21,
		modified_at: shipEngineSchema21,
		shipment_status: shipEngineSchema467,
		ship_to: shipEngineSchema469,
		ship_from: shipEngineSchema470,
		warehouse_id: shipEngineSchema471,
		return_to: shipEngineSchema470,
		is_return: shipEngineSchema472.optional(),
		confirmation: shipEngineSchema473,
		customs: shipEngineSchema474,
		advanced_options: shipEngineSchema487,
		insurance_provider: shipEngineSchema505,
		tags: shipEngineSchema507,
		order_source_code: shipEngineSchema457.optional(),
		packages: shipEngineSchema509,
		total_weight: shipEngineSchema523,
		comparison_rate_type: shipEngineSchema524.optional(),
		zone: shipEngineSchema525.optional(),
	})
	.strict();
const shipEngineSchema598 = z
	.object({
		carrier_id: shipEngineSchema116.optional(),
		service_code: shipEngineSchema282.optional(),
		shipping_rule_id: shipEngineSchema116.optional(),
		external_order_id: shipEngineSchema36.optional(),
		items: shipEngineSchema283.optional(),
		tax_identifiers: shipEngineSchema288.optional(),
		external_shipment_id: shipEngineSchema294.optional(),
		shipment_number: shipEngineSchema294.optional(),
		ship_date: shipEngineSchema295.optional(),
		ship_to: shipEngineSchema297.optional(),
		ship_from: shipEngineSchema303.optional(),
		warehouse_id: shipEngineSchema302.optional(),
		return_to: shipEngineSchema303.optional(),
		is_return: shipEngineSchema304.optional(),
		confirmation: shipEngineSchema305.optional(),
		customs: shipEngineSchema307.optional(),
		advanced_options: shipEngineSchema325.optional(),
		insurance_provider: shipEngineSchema343.optional(),
		order_source_code: shipEngineSchema286.optional(),
		packages: shipEngineSchema345.optional(),
		comparison_rate_type: shipEngineSchema365.optional(),
	})
	.strict();
const shipEngineSchema597 = z
	.object({
		text: shipEngineSchema34,
		shipment: shipEngineSchema598.optional(),
	})
	.strict();
const shipEngineSchema600 = z
	.object({
		shipment_id: shipEngineSchema89.optional(),
		carrier_id: shipEngineSchema145.optional(),
		service_code: shipEngineSchema451.optional(),
		shipping_rule_id: shipEngineSchema145.optional(),
		external_order_id: shipEngineSchema47.optional(),
		items: shipEngineSchema452.optional(),
		tax_identifiers: shipEngineSchema459.optional(),
		external_shipment_id: shipEngineSchema465.optional(),
		shipment_number: shipEngineSchema465.optional(),
		ship_date: shipEngineSchema466.optional(),
		created_at: shipEngineSchema21.optional(),
		modified_at: shipEngineSchema21.optional(),
		shipment_status: shipEngineSchema467.optional(),
		ship_to: shipEngineSchema469.optional(),
		ship_from: shipEngineSchema470.optional(),
		warehouse_id: shipEngineSchema471.optional(),
		return_to: shipEngineSchema470.optional(),
		is_return: shipEngineSchema472.optional(),
		confirmation: shipEngineSchema473.optional(),
		customs: shipEngineSchema474.optional(),
		advanced_options: shipEngineSchema487.optional(),
		insurance_provider: shipEngineSchema505.optional(),
		tags: shipEngineSchema507.optional(),
		order_source_code: shipEngineSchema457.optional(),
		packages: shipEngineSchema509.optional(),
		total_weight: shipEngineSchema523.optional(),
		comparison_rate_type: shipEngineSchema524.optional(),
		zone: shipEngineSchema525.optional(),
	})
	.strict();
const shipEngineSchema599 = z
	.object({
		score: shipEngineSchema45,
		shipment: shipEngineSchema600,
		entities: shipEngineSchema55,
	})
	.strict();
const shipEngineSchema601 = z
	.object({
		carrier_id: shipEngineSchema116.optional(),
		service_code: shipEngineSchema282.optional(),
		shipping_rule_id: shipEngineSchema116.optional(),
		external_order_id: shipEngineSchema36.optional(),
		items: shipEngineSchema283.optional(),
		tax_identifiers: shipEngineSchema288.optional(),
		external_shipment_id: shipEngineSchema294.optional(),
		shipment_number: shipEngineSchema294.optional(),
		ship_date: shipEngineSchema295.optional(),
		ship_to: shipEngineSchema297,
		ship_from: shipEngineSchema303,
		warehouse_id: shipEngineSchema302.optional(),
		return_to: shipEngineSchema303.optional(),
		is_return: shipEngineSchema304.optional(),
		confirmation: shipEngineSchema305.optional(),
		customs: shipEngineSchema307.optional(),
		advanced_options: shipEngineSchema325.optional(),
		insurance_provider: shipEngineSchema343.optional(),
		order_source_code: shipEngineSchema286.optional(),
		packages: shipEngineSchema345.optional(),
		comparison_rate_type: shipEngineSchema365.optional(),
		validate_address: shipEngineSchema378.optional(),
	})
	.strict();
const shipEngineSchema602 = z
	.object({
		shipment_id: shipEngineSchema89,
		carrier_id: shipEngineSchema145,
		service_code: shipEngineSchema451,
		shipping_rule_id: shipEngineSchema145.optional(),
		external_order_id: shipEngineSchema47.optional(),
		items: shipEngineSchema452.optional(),
		tax_identifiers: shipEngineSchema459.optional(),
		external_shipment_id: shipEngineSchema465.optional(),
		shipment_number: shipEngineSchema465.optional(),
		ship_date: shipEngineSchema466,
		created_at: shipEngineSchema21,
		modified_at: shipEngineSchema21.optional(),
		shipment_status: shipEngineSchema467,
		ship_to: shipEngineSchema469,
		ship_from: shipEngineSchema470,
		warehouse_id: shipEngineSchema471.optional(),
		return_to: shipEngineSchema470,
		is_return: shipEngineSchema472.optional(),
		confirmation: shipEngineSchema473,
		customs: shipEngineSchema474,
		advanced_options: shipEngineSchema487,
		insurance_provider: shipEngineSchema505,
		tags: shipEngineSchema507,
		order_source_code: shipEngineSchema457.optional(),
		packages: shipEngineSchema509,
		total_weight: shipEngineSchema523,
		comparison_rate_type: shipEngineSchema524.optional(),
		zone: shipEngineSchema525.optional(),
		errors: shipEngineSchema594,
		address_validation: shipEngineSchema595,
	})
	.strict();
const shipEngineSchema605 = z
	.object({
		rate_id: shipEngineSchema89,
		rate_type: shipEngineSchema529,
		carrier_id: shipEngineSchema89,
		shipping_amount: shipEngineSchema166,
		insurance_amount: shipEngineSchema166,
		confirmation_amount: shipEngineSchema166,
		other_amount: shipEngineSchema166,
		requested_comparison_amount: shipEngineSchema166.optional(),
		tax_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		zone: shipEngineSchema525,
		package_type: shipEngineSchema531,
		delivery_days: shipEngineSchema113.optional(),
		guaranteed_service: shipEngineSchema140,
		estimated_delivery_date: shipEngineSchema533.optional(),
		carrier_delivery_days: shipEngineSchema71.optional(),
		ship_date: shipEngineSchema534.optional(),
		negotiated_rate: shipEngineSchema140,
		service_type: shipEngineSchema71,
		service_code: shipEngineSchema71,
		trackable: shipEngineSchema140,
		carrier_code: shipEngineSchema71,
		carrier_nickname: shipEngineSchema71,
		carrier_friendly_name: shipEngineSchema71,
		validation_status: shipEngineSchema535,
		warning_messages: shipEngineSchema537,
		error_messages: shipEngineSchema537,
		rate_attributes: shipEngineSchema538.optional(),
	})
	.strict();
const shipEngineSchema604 = z.array(shipEngineSchema605);
const shipEngineSchema607 = z
	.object({
		rate_id: shipEngineSchema89,
		rate_type: shipEngineSchema529,
		carrier_id: shipEngineSchema89,
		shipping_amount: shipEngineSchema166,
		insurance_amount: shipEngineSchema166,
		confirmation_amount: shipEngineSchema166,
		other_amount: shipEngineSchema166,
		requested_comparison_amount: shipEngineSchema166.optional(),
		tax_amount: shipEngineSchema166.optional(),
		rate_details: shipEngineSchema229.optional(),
		zone: shipEngineSchema525,
		package_type: shipEngineSchema531,
		delivery_days: shipEngineSchema113.optional(),
		guaranteed_service: shipEngineSchema140,
		estimated_delivery_date: shipEngineSchema533.optional(),
		carrier_delivery_days: shipEngineSchema71.optional(),
		ship_date: shipEngineSchema534.optional(),
		negotiated_rate: shipEngineSchema140,
		service_type: shipEngineSchema71,
		service_code: shipEngineSchema71,
		trackable: shipEngineSchema140,
		carrier_code: shipEngineSchema71,
		carrier_nickname: shipEngineSchema71,
		carrier_friendly_name: shipEngineSchema71,
		validation_status: shipEngineSchema535,
		warning_messages: shipEngineSchema537,
		error_messages: shipEngineSchema537,
	})
	.strict();
const shipEngineSchema606 = z.array(shipEngineSchema607);
const shipEngineSchema603 = z
	.object({
		rates: shipEngineSchema604,
		invalid_rates: shipEngineSchema606,
		rate_request_id: shipEngineSchema89,
		shipment_id: shipEngineSchema89,
		created_at: shipEngineSchema542,
		status: shipEngineSchema543,
		errors: shipEngineSchema545,
	})
	.strict();
const shipEngineSchema610 = z
	.object({
		shipment_id: shipEngineSchema28.optional(),
		tags: shipEngineSchema566.optional(),
	})
	.strict();
const shipEngineSchema609 = z.array(shipEngineSchema610);
const shipEngineSchema608 = z
	.object({ shipments_tags: shipEngineSchema609.optional() })
	.strict();
const shipEngineSchema611 = z.object({ tags: shipEngineSchema576 }).strict();
const shipEngineSchema613 = z.array(shipEngineSchema508);
const shipEngineSchema612 = z
	.object({ tags: shipEngineSchema613.optional() })
	.strict();
const shipEngineSchema614 = z
	.object({ name: shipEngineSchema34, color: shipEngineSchema34.optional() })
	.strict();
const shipEngineSchema615 = z
	.object({
		tag_id: shipEngineSchema113.optional(),
		name: shipEngineSchema10,
		color: shipEngineSchema10.optional(),
	})
	.strict();
const shipEngineSchema616 = z.literal('shipengine-dashboard');
const shipEngineSchema617 = z.object({
	token: shipEngineSchema20.optional(),
	redirect_url: shipEngineSchema20.optional(),
});
const shipEngineSchema618 = z
	.object({
		tracking_number: shipEngineSchema388,
		tracking_url: shipEngineSchema106,
		status_code: shipEngineSchema389,
		status_detail_code: shipEngineSchema391.optional(),
		carrier_code: shipEngineSchema393,
		carrier_id: shipEngineSchema258,
		status_description: shipEngineSchema394.optional(),
		status_detail_description: shipEngineSchema394.optional(),
		carrier_status_code: shipEngineSchema71,
		carrier_detail_code: shipEngineSchema71,
		carrier_status_description: shipEngineSchema395.optional(),
		ship_date: shipEngineSchema396.optional(),
		estimated_delivery_date: shipEngineSchema396.optional(),
		actual_delivery_date: shipEngineSchema396.optional(),
		exception_description: shipEngineSchema394.optional(),
		events: shipEngineSchema397,
	})
	.strict();
const shipEngineSchema622 = z.boolean().nullable();
const shipEngineSchema621 = z
	.object({
		warehouse_id: shipEngineSchema89.optional(),
		is_default: shipEngineSchema622.optional(),
		name: shipEngineSchema10.optional(),
		created_at: shipEngineSchema534.optional(),
		origin_address: shipEngineSchema65.optional(),
		return_address: shipEngineSchema65.optional(),
	})
	.strict();
const shipEngineSchema620 = z.array(shipEngineSchema621);
const shipEngineSchema619 = z
	.object({ warehouses: shipEngineSchema620 })
	.strict();
const shipEngineSchema624 = z.boolean().nullable();
const shipEngineSchema625 = z
	.object({
		name: shipEngineSchema34,
		phone: shipEngineSchema34.optional(),
		email: shipEngineSchema36.optional(),
		company_name: shipEngineSchema37.optional(),
		address_line1: shipEngineSchema34,
		address_line2: shipEngineSchema37.optional(),
		address_line3: shipEngineSchema37.optional(),
		city_locality: shipEngineSchema34,
		state_province: shipEngineSchema34,
		postal_code: shipEngineSchema38,
		country_code: shipEngineSchema40.optional(),
		address_residential_indicator: shipEngineSchema42.optional(),
	})
	.strict();
const shipEngineSchema623 = z
	.object({
		is_default: shipEngineSchema624.optional(),
		name: shipEngineSchema34,
		origin_address: shipEngineSchema625,
		return_address: shipEngineSchema625.optional(),
	})
	.strict();
const shipEngineSchema626 = z
	.object({
		warehouse_id: shipEngineSchema89,
		is_default: shipEngineSchema622.optional(),
		name: shipEngineSchema10,
		created_at: shipEngineSchema534,
		origin_address: shipEngineSchema65,
		return_address: shipEngineSchema65,
	})
	.strict();
const shipEngineSchema627 = z
	.object({ is_default: shipEngineSchema304.optional() })
	.strict();

export const ShipEngineEndpointInputSchemas = {
	'account.listAccountSettings': z.object({}).strict(),
	'account.listAccountImages': z.object({}).strict(),
	'account.createAccountImage': z.object({ body: shipEngineSchema23 }).strict(),
	'account.getAccountSettingsImagesById': z
		.object({ path: z.object({ label_image_id: shipEngineSchema30 }).strict() })
		.strict(),
	'account.updateAccountSettingsImagesById': z
		.object({
			path: z.object({ label_image_id: shipEngineSchema30 }).strict(),
			body: shipEngineSchema31,
		})
		.strict(),
	'account.deleteAccountImageById': z
		.object({ path: z.object({ label_image_id: shipEngineSchema30 }).strict() })
		.strict(),
	'addresses.parseAddress': z.object({ body: shipEngineSchema33 }).strict(),
	'addresses.validateAddress': z.object({ body: shipEngineSchema59 }).strict(),
	'batches.listBatches': z
		.object({
			query: z
				.object({
					status: shipEngineSchema76.optional(),
					page: shipEngineSchema77.optional(),
					page_size: shipEngineSchema77.optional(),
					sort_dir: shipEngineSchema78.optional(),
					batch_number: shipEngineSchema28.optional(),
					created_at_start: shipEngineSchema80.optional(),
					created_at_end: shipEngineSchema80.optional(),
					processed_at_start: shipEngineSchema80.optional(),
					processed_at_end: shipEngineSchema80.optional(),
					sort_by: shipEngineSchema81.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'batches.createBatch': z.object({ body: shipEngineSchema115 }).strict(),
	'batches.getBatchByExternalId': z
		.object({
			path: z.object({ external_batch_id: shipEngineSchema28 }).strict(),
		})
		.strict(),
	'batches.deleteBatch': z
		.object({ path: z.object({ batch_id: shipEngineSchema117 }).strict() })
		.strict(),
	'batches.getBatchById': z
		.object({ path: z.object({ batch_id: shipEngineSchema117 }).strict() })
		.strict(),
	'batches.updateBatch': z
		.object({ path: z.object({ batch_id: shipEngineSchema117 }).strict() })
		.strict(),
	'batches.addToBatch': z
		.object({
			path: z.object({ batch_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema131,
		})
		.strict(),
	'batches.listBatchErrors': z
		.object({
			path: z.object({ batch_id: shipEngineSchema117 }).strict(),
			query: z
				.object({
					page: shipEngineSchema77.optional(),
					pagesize: shipEngineSchema77.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'batches.processBatch': z
		.object({
			path: z.object({ batch_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema136,
		})
		.strict(),
	'batches.removeFromBatch': z
		.object({
			path: z.object({ batch_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema131,
		})
		.strict(),
	'carriers.listCarriers': z.object({}).strict(),
	'carriers.getCarrierById': z
		.object({ path: z.object({ carrier_id: shipEngineSchema117 }).strict() })
		.strict(),
	'carriers.disconnectCarrierById': z
		.object({ path: z.object({ carrier_id: shipEngineSchema117 }).strict() })
		.strict(),
	'carriers.addFundsToCarrier': z
		.object({
			path: z.object({ carrier_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema162,
		})
		.strict(),
	'carriers.getCarrierOptions': z
		.object({ path: z.object({ carrier_id: shipEngineSchema117 }).strict() })
		.strict(),
	'carriers.listCarrierPackageTypes': z
		.object({ path: z.object({ carrier_id: shipEngineSchema117 }).strict() })
		.strict(),
	'carriers.listCarrierServices': z
		.object({ path: z.object({ carrier_id: shipEngineSchema117 }).strict() })
		.strict(),
	'carrierAccounts.connectCarrier': z
		.object({
			path: z.object({ carrier_name: shipEngineSchema171 }).strict(),
			body: shipEngineSchema172,
		})
		.strict(),
	'carrierAccounts.disconnectCarrier': z
		.object({
			path: z
				.object({
					carrier_name: shipEngineSchema171,
					carrier_id: shipEngineSchema117,
				})
				.strict(),
		})
		.strict(),
	'carrierAccounts.getCarrierSettings': z
		.object({
			path: z
				.object({
					carrier_name: shipEngineSchema181,
					carrier_id: shipEngineSchema117,
				})
				.strict(),
		})
		.strict(),
	'carrierAccounts.updateCarrierSettings': z
		.object({
			path: z
				.object({
					carrier_name: shipEngineSchema181,
					carrier_id: shipEngineSchema117,
				})
				.strict(),
			body: shipEngineSchema195,
		})
		.strict(),
	'insurance.disconnectInsurer': z.object({}).strict(),
	'insurance.connectInsurer': z.object({ body: shipEngineSchema207 }).strict(),
	'labels.createCombinedLabelDocument': z
		.object({ body: shipEngineSchema208 })
		.strict(),
	'downloads.downloadFile': z
		.object({
			path: z
				.object({
					subdir: shipEngineSchema28,
					filename: shipEngineSchema28,
					dir: shipEngineSchema28,
				})
				.strict(),
			query: z
				.object({
					download: shipEngineSchema28.optional(),
					rotation: shipEngineSchema213.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'insurance.addFundsToInsurance': z
		.object({ body: shipEngineSchema162 })
		.strict(),
	'insurance.getInsuranceBalance': z.object({}).strict(),
	'labels.listLabels': z
		.object({
			query: z
				.object({
					label_status: shipEngineSchema215.optional(),
					service_code: shipEngineSchema216.optional(),
					carrier_id: shipEngineSchema117.optional(),
					tracking_number: shipEngineSchema34.optional(),
					batch_id: shipEngineSchema117.optional(),
					rate_id: shipEngineSchema117.optional(),
					shipment_id: shipEngineSchema117.optional(),
					warehouse_id: shipEngineSchema117.optional(),
					created_at_start: shipEngineSchema80.optional(),
					created_at_end: shipEngineSchema80.optional(),
					refund_status: shipEngineSchema217.optional(),
					page: shipEngineSchema77.optional(),
					page_size: shipEngineSchema77.optional(),
					sort_dir: shipEngineSchema78.optional(),
					sort_by: shipEngineSchema219.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'labels.createLabel': z.object({ body: shipEngineSchema280 }).strict(),
	'labels.getLabelByExternalShipmentId': z
		.object({
			path: z.object({ external_shipment_id: shipEngineSchema28 }).strict(),
			query: z
				.object({ label_download_type: shipEngineSchema211.optional() })
				.strict()
				.optional(),
		})
		.strict(),
	'labels.createLabelFromRate': z
		.object({
			path: z.object({ rate_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema377,
		})
		.strict(),
	'labels.createLabelFromRateShopper': z
		.object({
			path: z.object({ rate_shopper_id: shipEngineSchema379 }).strict(),
			body: shipEngineSchema380,
		})
		.strict(),
	'labels.createLabelFromShipment': z
		.object({
			path: z.object({ shipment_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema385,
		})
		.strict(),
	'labels.getLabelById': z
		.object({
			path: z.object({ label_id: shipEngineSchema117 }).strict(),
			query: z
				.object({ label_download_type: shipEngineSchema211.optional() })
				.strict()
				.optional(),
		})
		.strict(),
	'labels.createReturnLabel': z
		.object({
			path: z.object({ label_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema386,
		})
		.strict(),
	'labels.getTrackingLogFromLabel': z
		.object({ path: z.object({ label_id: shipEngineSchema117 }).strict() })
		.strict(),
	'labels.voidLabel': z
		.object({ path: z.object({ label_id: shipEngineSchema117 }).strict() })
		.strict(),
	'labels.cancelLabelRefund': z
		.object({ path: z.object({ label_id: shipEngineSchema117 }).strict() })
		.strict(),
	'manifests.listManifests': z
		.object({
			query: z
				.object({
					warehouse_id: shipEngineSchema117.optional(),
					ship_date_start: shipEngineSchema80.optional(),
					ship_date_end: shipEngineSchema80.optional(),
					created_at_start: shipEngineSchema80.optional(),
					created_at_end: shipEngineSchema80.optional(),
					carrier_id: shipEngineSchema117.optional(),
					page: shipEngineSchema77.optional(),
					page_size: shipEngineSchema77.optional(),
					label_ids: shipEngineSchema405.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'manifests.createManifest': z.object({ body: shipEngineSchema413 }).strict(),
	'manifests.getManifestById': z
		.object({ path: z.object({ manifest_id: shipEngineSchema117 }).strict() })
		.strict(),
	'manifests.getManifestRequestById': z
		.object({
			path: z.object({ manifest_request_id: shipEngineSchema117 }).strict(),
		})
		.strict(),
	'packageTypes.listPackageTypes': z.object({}).strict(),
	'packageTypes.createPackageType': z
		.object({ body: shipEngineSchema423 })
		.strict(),
	'packageTypes.getPackageTypeById': z
		.object({ path: z.object({ package_id: shipEngineSchema117 }).strict() })
		.strict(),
	'packageTypes.updatePackageType': z
		.object({
			path: z.object({ package_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema423,
		})
		.strict(),
	'packageTypes.deletePackageType': z
		.object({ path: z.object({ package_id: shipEngineSchema117 }).strict() })
		.strict(),
	'packagePickups.listScheduledPickups': z
		.object({
			query: z
				.object({
					carrier_id: shipEngineSchema117.optional(),
					warehouse_id: shipEngineSchema117.optional(),
					created_at_start: shipEngineSchema80.optional(),
					created_at_end: shipEngineSchema80.optional(),
					page: shipEngineSchema77.optional(),
					page_size: shipEngineSchema77.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'packagePickups.schedulePickup': z
		.object({ body: shipEngineSchema436 })
		.strict(),
	'packagePickups.getPickupById': z
		.object({ path: z.object({ pickup_id: shipEngineSchema30 }).strict() })
		.strict(),
	'packagePickups.deleteScheduledPickup': z
		.object({ path: z.object({ pickup_id: shipEngineSchema30 }).strict() })
		.strict(),
	'rates.calculateRates': z.object({ body: shipEngineSchema444 }).strict(),
	'rates.compareBulkRates': z.object({ body: shipEngineSchema546 }).strict(),
	'rates.estimateRates': z.object({ body: shipEngineSchema553 }).strict(),
	'rates.getRateById': z
		.object({ path: z.object({ rate_id: shipEngineSchema117 }).strict() })
		.strict(),
	'servicePoints.servicePointsList': z
		.object({ body: shipEngineSchema560 })
		.strict(),
	'servicePoints.servicePointsGetById': z
		.object({
			path: z
				.object({
					carrier_code: shipEngineSchema34,
					country_code: shipEngineSchema41,
					service_point_id: shipEngineSchema28,
				})
				.strict(),
		})
		.strict(),
	'shipments.listShipments': z
		.object({
			query: z
				.object({
					shipment_status: shipEngineSchema585.optional(),
					batch_id: shipEngineSchema117.optional(),
					tag: shipEngineSchema34.optional(),
					created_at_start: shipEngineSchema80.optional(),
					created_at_end: shipEngineSchema80.optional(),
					modified_at_start: shipEngineSchema80.optional(),
					modified_at_end: shipEngineSchema80.optional(),
					page: shipEngineSchema77.optional(),
					page_size: shipEngineSchema77.optional(),
					sales_order_id: shipEngineSchema28.optional(),
					sort_dir: shipEngineSchema78.optional(),
					sort_by: shipEngineSchema586.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'shipments.createShipments': z.object({ body: shipEngineSchema590 }).strict(),
	'shipments.getShipmentByExternalId': z
		.object({
			path: z.object({ external_shipment_id: shipEngineSchema28 }).strict(),
		})
		.strict(),
	'shipments.parseShipment': z.object({ body: shipEngineSchema597 }).strict(),
	'shipments.getShipmentById': z
		.object({ path: z.object({ shipment_id: shipEngineSchema117 }).strict() })
		.strict(),
	'shipments.updateShipment': z
		.object({
			path: z.object({ shipment_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema601,
		})
		.strict(),
	'shipments.cancelShipments': z
		.object({ path: z.object({ shipment_id: shipEngineSchema117 }).strict() })
		.strict(),
	'shipments.listShipmentRates': z
		.object({
			path: z.object({ shipment_id: shipEngineSchema117 }).strict(),
			query: z
				.object({ created_at_start: shipEngineSchema80.optional() })
				.strict()
				.optional(),
		})
		.strict(),
	'shipments.shipmentsUpdateTags': z
		.object({ body: shipEngineSchema608 })
		.strict(),
	'shipments.shipmentsListTags': z
		.object({ path: z.object({ shipment_id: shipEngineSchema117 }).strict() })
		.strict(),
	'shipments.tagShipment': z
		.object({
			path: z
				.object({
					shipment_id: shipEngineSchema117,
					tag_name: shipEngineSchema34,
				})
				.strict(),
		})
		.strict(),
	'shipments.untagShipment': z
		.object({
			path: z
				.object({
					shipment_id: shipEngineSchema117,
					tag_name: shipEngineSchema34,
				})
				.strict(),
		})
		.strict(),
	'tags.listTags': z.object({}).strict(),
	'tags.createTag': z.object({ body: shipEngineSchema614 }).strict(),
	'tags.createTagByName': z
		.object({ path: z.object({ tag_name: shipEngineSchema34 }).strict() })
		.strict(),
	'tags.deleteTag': z
		.object({ path: z.object({ tag_name: shipEngineSchema34 }).strict() })
		.strict(),
	'tags.renameTag': z
		.object({
			path: z
				.object({
					tag_name: shipEngineSchema34,
					new_tag_name: shipEngineSchema34,
				})
				.strict(),
		})
		.strict(),
	'tokens.tokensGetEphemeralToken': z
		.object({
			query: z
				.object({ redirect: shipEngineSchema616.optional() })
				.strict()
				.optional(),
		})
		.strict(),
	'tracking.getTrackingLog': z
		.object({
			query: z
				.object({
					carrier_code: shipEngineSchema34.optional(),
					tracking_number: shipEngineSchema34.optional(),
					carrier_id: shipEngineSchema117.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tracking.startTracking': z
		.object({
			query: z
				.object({
					carrier_code: shipEngineSchema34.optional(),
					tracking_number: shipEngineSchema34.optional(),
					carrier_id: shipEngineSchema117.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tracking.stopTracking': z
		.object({
			query: z
				.object({
					carrier_code: shipEngineSchema34.optional(),
					tracking_number: shipEngineSchema34.optional(),
					carrier_id: shipEngineSchema117.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'warehouses.listWarehouses': z.object({}).strict(),
	'warehouses.createWarehouse': z
		.object({ body: shipEngineSchema623 })
		.strict(),
	'warehouses.getWarehouseById': z
		.object({ path: z.object({ warehouse_id: shipEngineSchema117 }).strict() })
		.strict(),
	'warehouses.updateWarehouse': z
		.object({
			path: z.object({ warehouse_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema623,
		})
		.strict(),
	'warehouses.deleteWarehouse': z
		.object({ path: z.object({ warehouse_id: shipEngineSchema117 }).strict() })
		.strict(),
	'warehouses.updateWarehouseSettings': z
		.object({
			path: z.object({ warehouse_id: shipEngineSchema117 }).strict(),
			body: shipEngineSchema627,
		})
		.strict(),
} as const;

export const ShipEngineEndpointOutputSchemas = {
	'account.listAccountSettings': shipEngineSchema0,
	'account.listAccountImages': shipEngineSchema3,
	'account.createAccountImage': shipEngineSchema29,
	'account.getAccountSettingsImagesById': shipEngineSchema29,
	'account.updateAccountSettingsImagesById': shipEngineSchema32,
	'account.deleteAccountImageById': shipEngineSchema32,
	'addresses.parseAddress': shipEngineSchema44,
	'addresses.validateAddress': shipEngineSchema61,
	'batches.listBatches': shipEngineSchema82,
	'batches.createBatch': shipEngineSchema130,
	'batches.getBatchByExternalId': shipEngineSchema130,
	'batches.deleteBatch': shipEngineSchema32,
	'batches.getBatchById': shipEngineSchema130,
	'batches.updateBatch': shipEngineSchema32,
	'batches.addToBatch': shipEngineSchema32,
	'batches.listBatchErrors': shipEngineSchema132,
	'batches.processBatch': shipEngineSchema32,
	'batches.removeFromBatch': shipEngineSchema32,
	'carriers.listCarriers': shipEngineSchema137,
	'carriers.getCarrierById': shipEngineSchema161,
	'carriers.disconnectCarrierById': shipEngineSchema32,
	'carriers.addFundsToCarrier': shipEngineSchema165,
	'carriers.getCarrierOptions': shipEngineSchema168,
	'carriers.listCarrierPackageTypes': shipEngineSchema169,
	'carriers.listCarrierServices': shipEngineSchema170,
	'carrierAccounts.connectCarrier': shipEngineSchema180,
	'carrierAccounts.disconnectCarrier': shipEngineSchema32,
	'carrierAccounts.getCarrierSettings': shipEngineSchema182,
	'carrierAccounts.updateCarrierSettings': shipEngineSchema32,
	'insurance.disconnectInsurer': shipEngineSchema206,
	'insurance.connectInsurer': shipEngineSchema206,
	'labels.createCombinedLabelDocument': shipEngineSchema212,
	'downloads.downloadFile': z
		.object({
			kind: z.literal('binary'),
			contentType: z.enum(['application/pdf', 'image/png', 'application/zpl']),
			base64: z.string(),
			byteLength: z.number().int().nonnegative(),
		})
		.strict(),
	'insurance.addFundsToInsurance': shipEngineSchema214,
	'insurance.getInsuranceBalance': shipEngineSchema214,
	'labels.listLabels': shipEngineSchema220,
	'labels.createLabel': shipEngineSchema375,
	'labels.getLabelByExternalShipmentId': shipEngineSchema376,
	'labels.createLabelFromRate': shipEngineSchema376,
	'labels.createLabelFromRateShopper': shipEngineSchema382,
	'labels.createLabelFromShipment': shipEngineSchema376,
	'labels.getLabelById': shipEngineSchema376,
	'labels.createReturnLabel': shipEngineSchema376,
	'labels.getTrackingLogFromLabel': shipEngineSchema387,
	'labels.voidLabel': shipEngineSchema402,
	'labels.cancelLabelRefund': shipEngineSchema376,
	'manifests.listManifests': shipEngineSchema406,
	'manifests.createManifest': shipEngineSchema414,
	'manifests.getManifestById': shipEngineSchema422,
	'manifests.getManifestRequestById': shipEngineSchema414,
	'packageTypes.listPackageTypes': shipEngineSchema169,
	'packageTypes.createPackageType': shipEngineSchema424,
	'packageTypes.getPackageTypeById': shipEngineSchema424,
	'packageTypes.updatePackageType': shipEngineSchema32,
	'packageTypes.deletePackageType': shipEngineSchema32,
	'packagePickups.listScheduledPickups': shipEngineSchema425,
	'packagePickups.schedulePickup': shipEngineSchema440,
	'packagePickups.getPickupById': shipEngineSchema441,
	'packagePickups.deleteScheduledPickup': shipEngineSchema442,
	'rates.calculateRates': shipEngineSchema450,
	'rates.compareBulkRates': shipEngineSchema548,
	'rates.estimateRates': shipEngineSchema557,
	'rates.getRateById': shipEngineSchema559,
	'servicePoints.servicePointsList': shipEngineSchema572,
	'servicePoints.servicePointsGetById': shipEngineSchema583,
	'shipments.listShipments': shipEngineSchema587,
	'shipments.createShipments': shipEngineSchema591,
	'shipments.getShipmentByExternalId': shipEngineSchema596,
	'shipments.parseShipment': shipEngineSchema599,
	'shipments.getShipmentById': shipEngineSchema596,
	'shipments.updateShipment': shipEngineSchema602,
	'shipments.cancelShipments': shipEngineSchema32,
	'shipments.listShipmentRates': shipEngineSchema603,
	'shipments.shipmentsUpdateTags': z.undefined(),
	'shipments.shipmentsListTags': shipEngineSchema611,
	'shipments.tagShipment': shipEngineSchema611,
	'shipments.untagShipment': shipEngineSchema32,
	'tags.listTags': shipEngineSchema612,
	'tags.createTag': shipEngineSchema615,
	'tags.createTagByName': shipEngineSchema615,
	'tags.deleteTag': shipEngineSchema32,
	'tags.renameTag': shipEngineSchema32,
	'tokens.tokensGetEphemeralToken': shipEngineSchema617,
	'tracking.getTrackingLog': shipEngineSchema618,
	'tracking.startTracking': shipEngineSchema32,
	'tracking.stopTracking': shipEngineSchema32,
	'warehouses.listWarehouses': shipEngineSchema619,
	'warehouses.createWarehouse': shipEngineSchema626,
	'warehouses.getWarehouseById': shipEngineSchema626,
	'warehouses.updateWarehouse': shipEngineSchema32,
	'warehouses.deleteWarehouse': shipEngineSchema32,
	'warehouses.updateWarehouseSettings': shipEngineSchema32,
} as const;

export type ShipEngineOperationName =
	keyof typeof ShipEngineEndpointInputSchemas;
export type ShipEngineEndpointInputs = {
	[K in ShipEngineOperationName]: z.infer<
		(typeof ShipEngineEndpointInputSchemas)[K]
	>;
};
export type ShipEngineEndpointOutputs = {
	[K in ShipEngineOperationName]: z.infer<
		(typeof ShipEngineEndpointOutputSchemas)[K]
	>;
};

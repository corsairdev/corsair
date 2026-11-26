import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LobEndpointOutputSchemas } from './endpoints/types';

/**
 * Every example response in Lob's OpenAPI 1.22.0 (github.com/lob/lob-openapi),
 * trimmed to one row per list, parsed through the operation's output schema.
 * The schemas are lenient, so this proves no documented field has a type the
 * schema refuses (a number where it says string, an array where it says
 * object), which is how earlier plugins failed live.
 */
const examples = JSON.parse(
	readFileSync(join(__dirname, 'fixtures', 'spec-examples.json'), 'utf8'),
) as Record<string, unknown>;

const OPERATION_BY_ROUTE: Record<
	string,
	keyof typeof LobEndpointOutputSchemas
> = {
	'GET /accounts': 'accountGetBalance',
	'GET /addresses': 'addressesList',
	'POST /addresses': 'addressesCreate',
	'DELETE /addresses/{adr_id}': 'addressesDelete',
	'POST /bank_accounts/{bank_id}/verify': 'bankAccountsVerify',
	'GET /bank_accounts/{bank_id}': 'bankAccountsGet',
	'DELETE /bank_accounts/{bank_id}': 'bankAccountsDelete',
	'GET /bank_accounts': 'bankAccountsList',
	'POST /bank_accounts': 'bankAccountsCreate',
	'GET /billing_groups/{bg_id}': 'billingGroupsGet',
	'POST /billing_groups/{bg_id}': 'billingGroupsUpdate',
	'GET /billing_groups': 'billingGroupsList',
	'POST /billing_groups': 'billingGroupsCreate',
	'GET /booklets/{booklet_id}': 'bookletsGet',
	'DELETE /booklets/{booklet_id}': 'bookletsCancel',
	'GET /booklets': 'bookletsList',
	'POST /booklets': 'bookletsSend',
	'GET /buckslips': 'buckslipsList',
	'POST /buckslips': 'buckslipsCreate',
	'GET /buckslips/{buckslip_id}': 'buckslipsGet',
	'PATCH /buckslips/{buckslip_id}': 'buckslipsUpdate',
	'DELETE /buckslips/{buckslip_id}': 'buckslipsDelete',
	'GET /buckslips/{buckslip_id}/orders': 'buckslipsListOrders',
	'POST /buckslips/{buckslip_id}/orders': 'buckslipsCreateOrder',
	'POST /bulk/us_verifications': 'usVerificationsBulk',
	'POST /bulk/intl_verifications': 'intlVerificationsBulk',
	'GET /campaigns': 'campaignsList',
	'POST /campaigns': 'campaignsCreate',
	'GET /campaigns/{cmp_id}': 'campaignsGet',
	'PATCH /campaigns/{cmp_id}': 'campaignsUpdate',
	'DELETE /campaigns/{cmp_id}': 'campaignsDelete',
	'POST /campaigns/{cmp_id}/send': 'campaignsSend',
	'GET /cards': 'cardsList',
	'POST /cards': 'cardsCreate',
	'GET /cards/{card_id}': 'cardsGet',
	'POST /cards/{card_id}': 'cardsUpdate',
	'DELETE /cards/{card_id}': 'cardsDelete',
	'GET /cards/{card_id}/orders': 'cardsListOrders',
	'POST /cards/{card_id}/orders': 'cardsCreateOrder',
	'GET /checks': 'checksList',
	'POST /checks': 'checksSend',
	'GET /checks/{chk_id}': 'checksGet',
	'DELETE /checks/{chk_id}': 'checksCancel',
	'POST /creatives': 'creativesCreate',
	'GET /creatives/{crv_id}': 'creativesGet',
	'PATCH /creatives/{crv_id}': 'creativesUpdate',
	'POST /identity_validation': 'identityValidationValidate',
	'GET /informed_delivery_campaigns': 'informedDeliveryList',
	'POST /informed_delivery_campaigns': 'informedDeliveryCreate',
	'GET /informed_delivery_campaigns/{usps_campaign_id}': 'informedDeliveryGet',
	'PATCH /informed_delivery_campaigns/{usps_campaign_id}':
		'informedDeliveryUpdate',
	'POST /intl_verifications': 'intlVerificationsVerify',
	'GET /letters/{ltr_id}': 'lettersGet',
	'DELETE /letters/{ltr_id}': 'lettersCancel',
	'GET /letters': 'lettersList',
	'POST /letters': 'lettersSend',
	'GET /postcards/{psc_id}': 'postcardsGet',
	'DELETE /postcards/{psc_id}': 'postcardsCancel',
	'GET /postcards': 'postcardsList',
	'POST /postcards': 'postcardsSend',
	'GET /qr_code_analytics': 'qrCodesList',
	'GET /resource_proofs/{res_prf_id}': 'resourceProofsGet',
	'PATCH /resource_proofs/{res_prf_id}': 'resourceProofsUpdate',
	'POST /resource_proofs': 'resourceProofsCreate',
	'GET /self_mailers/{sfm_id}': 'selfMailersGet',
	'DELETE /self_mailers/{sfm_id}': 'selfMailersCancel',
	'GET /self_mailers': 'selfMailersList',
	'POST /self_mailers': 'selfMailersSend',
	'GET /snap_packs/{snap_pack_id}': 'snapPacksGet',
	'DELETE /snap_packs/{snap_pack_id}': 'snapPacksCancel',
	'GET /snap_packs': 'snapPacksList',
	'POST /snap_packs': 'snapPacksSend',
	'GET /templates/{tmpl_id}/versions/{vrsn_id}': 'templateVersionsGet',
	'POST /templates/{tmpl_id}/versions/{vrsn_id}': 'templateVersionsUpdate',
	'DELETE /templates/{tmpl_id}/versions/{vrsn_id}': 'templateVersionsDelete',
	'GET /templates/{tmpl_id}/versions': 'templateVersionsList',
	'POST /templates/{tmpl_id}/versions': 'templateVersionsCreate',
	'GET /templates/{tmpl_id}': 'templatesGet',
	'POST /templates/{tmpl_id}': 'templatesUpdate',
	'DELETE /templates/{tmpl_id}': 'templatesDelete',
	'GET /templates': 'templatesList',
	'POST /templates': 'templatesCreate',
	'GET /uploads': 'uploadsList',
	'POST /uploads': 'uploadsCreate',
	'GET /uploads/{upl_id}': 'uploadsGet',
	'PATCH /uploads/{upl_id}': 'uploadsUpdate',
	'GET /uploads/{upl_id}/report': 'uploadsGetReport',
	'GET /uploads/{upl_id}/exports/{ex_id}': 'uploadsGetExport',
	'POST /us_autocompletions': 'autocompleteUsAutocomplete',
	'POST /us_reverse_geocode_lookups': 'reverseGeocodeLookup',
	'POST /us_verifications': 'usVerificationsVerify',
	'POST /us_zip_lookups': 'zipUsZipLookup',
};

describe("Lob's spec examples parse through the output schemas", () => {
	it('maps every spec example to an operation', () => {
		expect(Object.keys(examples).sort()).toEqual(
			Object.keys(OPERATION_BY_ROUTE).sort(),
		);
	});

	it.each(Object.entries(OPERATION_BY_ROUTE))('%s -> %s', (route, op) => {
		const result = LobEndpointOutputSchemas[op].safeParse(examples[route]);
		if (!result.success) {
			throw new Error(`${route}: ${JSON.stringify(result.error.issues)}`);
		}
	});
});

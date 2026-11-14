import { logEventFromContext } from 'corsair/core';
import { makeShipEngineRequest } from './client';
import { ShipEngine } from './endpoints';
import {
	SHIPENGINE_OPERATION_NAMES,
	SHIPENGINE_OPERATIONS,
} from './endpoints/operations';
import type {
	ShipEngineEndpointInputs,
	ShipEngineEndpointOutputs,
} from './endpoints/types';
import {
	ShipEngineEndpointInputSchemas,
	ShipEngineEndpointOutputSchemas,
} from './endpoints/types';
import type { ShipEngineContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const mockedLogEvent = jest.mocked(logEventFromContext);

type EndpointContext = Parameters<
	typeof ShipEngine.addresses.validateAddress
>[0];

function buildContext(): EndpointContext {
	const context: ShipEngineContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const testInputs = {
	'account.listAccountSettings': ShipEngineEndpointInputSchemas[
		'account.listAccountSettings'
	].parse({}),
	'account.listAccountImages': ShipEngineEndpointInputSchemas[
		'account.listAccountImages'
	].parse({}),
	'account.createAccountImage': ShipEngineEndpointInputSchemas[
		'account.createAccountImage'
	].parse({
		body: {
			name: 'My logo',
			image_content_type: 'image/png',
			image_data:
				'iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAiVJREFUSEu91j3IeVEcB/CvSTIoBrFSikEZMdjsjExeUspgUEp5SUpeshrIgEFJJmWwMZHJQGHDhJSXTPfpnH/8ebzd56HnN93u7ZzP/f1+55x7Ob1ejxEKheByufh0HI9HrFYrcKbTKUMu5HI5BALBx5zNZoPxeAySAGc2mzF8Pp/e+BR0Ash8u93uHyKVSnH54J2Mvs8zn8//I6RO70L3xt8g70CPXvAu8hvoWQUeIj+BXpX4KcIGegWQOV4izyA2AGvkHsQW+BFyCUkkEiwWC9Ybl1W5Ls8ZMoAABCIbmE3cINFoFMFgEEajEeVyGSKRCJ1OB3q9ns5nMpmQTCaxXq9/l8loNEKj0YDX66UACYvFQq9brRYcDgdUKhU9RD/SEwLm83lEIhGUSiX0+33E4/GrU5otRMs1mUyYbDYLu90OhUJBMzhlZbPZ4Pf7odFo4HQ6b1rABqJIvV5nttstLc0pSIn2+z0tTy6XQ6FQoI/a7TZ0Ot0V9gqiiMFgYKrVKm0yieVyCZ/PB6vVSpF0Ok2zJHEqIY/HYw1RxOfzMYlE4jwoEAhAJpPBbDZf9eBwOCCVSsHtdp9f6FJ6egorlUqmVqvRfjSbTXS7XXg8nptP8Svk0RF01ROtVguSUTgchlgsPpeOZBaLxTAcDlEsFpHJZPC9XM8yoshgMGBCoRBdQWTCU7hcLjohWb5kM6rValQqlfMKfLbbb77xf/K38hf/XV9ilOpnLqvnogAAAABJRU5ErkJggg==',
		},
	}),
	'account.getAccountSettingsImagesById': ShipEngineEndpointInputSchemas[
		'account.getAccountSettingsImagesById'
	].parse({ path: { label_image_id: 'img_DtBXupDBxREpHnwEXhTfgK' } }),
	'account.updateAccountSettingsImagesById': ShipEngineEndpointInputSchemas[
		'account.updateAccountSettingsImagesById'
	].parse({
		path: { label_image_id: 'img_DtBXupDBxREpHnwEXhTfgK' },
		body: { is_default: false },
	}),
	'account.deleteAccountImageById': ShipEngineEndpointInputSchemas[
		'account.deleteAccountImageById'
	].parse({ path: { label_image_id: 'img_DtBXupDBxREpHnwEXhTfgK' } }),
	'addresses.parseAddress': ShipEngineEndpointInputSchemas[
		'addresses.parseAddress'
	].parse({
		body: {
			text: 'Margie McMiller at 3800 North Lamar suite 200 in austin, tx.  The zip code there is 78652.',
		},
	}),
	'addresses.validateAddress': ShipEngineEndpointInputSchemas[
		'addresses.validateAddress'
	].parse({
		body: [
			{
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				country_code: 'CA',
			},
		],
	}),
	'batches.listBatches': ShipEngineEndpointInputSchemas[
		'batches.listBatches'
	].parse({
		query: {
			status: 'open',
			page: 1,
			page_size: 1,
			sort_dir: 'asc',
			batch_number: 'example',
			created_at_start: '2026-01-01T00:00:00Z',
			created_at_end: '2026-01-01T00:00:00Z',
			processed_at_start: '2026-01-01T00:00:00Z',
			processed_at_end: '2026-01-01T00:00:00Z',
			sort_by: 'ship_date',
		},
	}),
	'batches.createBatch': ShipEngineEndpointInputSchemas[
		'batches.createBatch'
	].parse({ body: { external_batch_id: 'se-28529731' } }),
	'batches.getBatchByExternalId': ShipEngineEndpointInputSchemas[
		'batches.getBatchByExternalId'
	].parse({ path: { external_batch_id: 'example' } }),
	'batches.deleteBatch': ShipEngineEndpointInputSchemas[
		'batches.deleteBatch'
	].parse({ path: { batch_id: 'se-28529731' } }),
	'batches.getBatchById': ShipEngineEndpointInputSchemas[
		'batches.getBatchById'
	].parse({ path: { batch_id: 'se-28529731' } }),
	'batches.updateBatch': ShipEngineEndpointInputSchemas[
		'batches.updateBatch'
	].parse({ path: { batch_id: 'se-28529731' } }),
	'batches.addToBatch': ShipEngineEndpointInputSchemas[
		'batches.addToBatch'
	].parse({ path: { batch_id: 'se-28529731' }, body: {} }),
	'batches.listBatchErrors': ShipEngineEndpointInputSchemas[
		'batches.listBatchErrors'
	].parse({
		path: { batch_id: 'se-28529731' },
		query: { page: 1, pagesize: 1 },
	}),
	'batches.processBatch': ShipEngineEndpointInputSchemas[
		'batches.processBatch'
	].parse({ path: { batch_id: 'se-28529731' }, body: {} }),
	'batches.removeFromBatch': ShipEngineEndpointInputSchemas[
		'batches.removeFromBatch'
	].parse({ path: { batch_id: 'se-28529731' }, body: {} }),
	'carriers.listCarriers': ShipEngineEndpointInputSchemas[
		'carriers.listCarriers'
	].parse({}),
	'carriers.getCarrierById': ShipEngineEndpointInputSchemas[
		'carriers.getCarrierById'
	].parse({ path: { carrier_id: 'se-28529731' } }),
	'carriers.disconnectCarrierById': ShipEngineEndpointInputSchemas[
		'carriers.disconnectCarrierById'
	].parse({ path: { carrier_id: 'se-28529731' } }),
	'carriers.addFundsToCarrier': ShipEngineEndpointInputSchemas[
		'carriers.addFundsToCarrier'
	].parse({
		path: { carrier_id: 'se-28529731' },
		body: { currency: 'example', amount: 0 },
	}),
	'carriers.getCarrierOptions': ShipEngineEndpointInputSchemas[
		'carriers.getCarrierOptions'
	].parse({ path: { carrier_id: 'se-28529731' } }),
	'carriers.listCarrierPackageTypes': ShipEngineEndpointInputSchemas[
		'carriers.listCarrierPackageTypes'
	].parse({ path: { carrier_id: 'se-28529731' } }),
	'carriers.listCarrierServices': ShipEngineEndpointInputSchemas[
		'carriers.listCarrierServices'
	].parse({ path: { carrier_id: 'se-28529731' } }),
	'carrierAccounts.connectCarrier': ShipEngineEndpointInputSchemas[
		'carrierAccounts.connectCarrier'
	].parse({
		path: { carrier_name: 'access_worldwide' },
		body: { nickname: 'Stamps.com', username: 'x', password: 'x' },
	}),
	'carrierAccounts.disconnectCarrier': ShipEngineEndpointInputSchemas[
		'carrierAccounts.disconnectCarrier'
	].parse({
		path: { carrier_name: 'access_worldwide', carrier_id: 'se-28529731' },
	}),
	'carrierAccounts.getCarrierSettings': ShipEngineEndpointInputSchemas[
		'carrierAccounts.getCarrierSettings'
	].parse({ path: { carrier_name: 'dhl_express', carrier_id: 'se-28529731' } }),
	'carrierAccounts.updateCarrierSettings': ShipEngineEndpointInputSchemas[
		'carrierAccounts.updateCarrierSettings'
	].parse({
		path: { carrier_name: 'dhl_express', carrier_id: 'se-28529731' },
		body: {},
	}),
	'insurance.disconnectInsurer': ShipEngineEndpointInputSchemas[
		'insurance.disconnectInsurer'
	].parse({}),
	'insurance.connectInsurer': ShipEngineEndpointInputSchemas[
		'insurance.connectInsurer'
	].parse({ body: { email: 'john.doe@example.com', policy_id: 'x' } }),
	'labels.createCombinedLabelDocument': ShipEngineEndpointInputSchemas[
		'labels.createCombinedLabelDocument'
	].parse({ body: {} }),
	'downloads.downloadFile': ShipEngineEndpointInputSchemas[
		'downloads.downloadFile'
	].parse({
		path: { subdir: 'example', filename: 'example', dir: 'example' },
		query: { download: 'example', rotation: 1 },
	}),
	'insurance.addFundsToInsurance': ShipEngineEndpointInputSchemas[
		'insurance.addFundsToInsurance'
	].parse({ body: { currency: 'example', amount: 0 } }),
	'insurance.getInsuranceBalance': ShipEngineEndpointInputSchemas[
		'insurance.getInsuranceBalance'
	].parse({}),
	'labels.listLabels': ShipEngineEndpointInputSchemas[
		'labels.listLabels'
	].parse({
		query: {
			label_status: 'processing',
			service_code: 'usps_first_class_mail',
			carrier_id: 'se-28529731',
			tracking_number: 'x',
			batch_id: 'se-28529731',
			rate_id: 'se-28529731',
			shipment_id: 'se-28529731',
			warehouse_id: 'se-28529731',
			created_at_start: '2026-01-01T00:00:00Z',
			created_at_end: '2026-01-01T00:00:00Z',
			refund_status: ['request_scheduled', 'pending'],
			page: 1,
			page_size: 1,
			sort_dir: 'asc',
			sort_by: 'modified_at',
		},
	}),
	'labels.createLabel': ShipEngineEndpointInputSchemas[
		'labels.createLabel'
	].parse({
		body: {
			shipment: {
				carrier_id: 'se-28529731',
				service_code: 'usps_first_class_mail',
				ship_to: {
					name: 'John Doe',
					address_line1: '1999 Bishop Grandin Blvd.',
					city_locality: 'Winnipeg',
					state_province: 'Manitoba',
					postal_code: '78756-3717',
				},
				packages: [{ weight: { value: 0, unit: 'pound' } }],
			},
		},
	}),
	'labels.getLabelByExternalShipmentId': ShipEngineEndpointInputSchemas[
		'labels.getLabelByExternalShipmentId'
	].parse({
		path: { external_shipment_id: 'example' },
		query: { label_download_type: 'url' },
	}),
	'labels.createLabelFromRate': ShipEngineEndpointInputSchemas[
		'labels.createLabelFromRate'
	].parse({ path: { rate_id: 'se-28529731' }, body: {} }),
	'labels.createLabelFromRateShopper': ShipEngineEndpointInputSchemas[
		'labels.createLabelFromRateShopper'
	].parse({ path: { rate_shopper_id: 'best_value' }, body: { shipment: {} } }),
	'labels.createLabelFromShipment': ShipEngineEndpointInputSchemas[
		'labels.createLabelFromShipment'
	].parse({ path: { shipment_id: 'se-28529731' }, body: {} }),
	'labels.getLabelById': ShipEngineEndpointInputSchemas[
		'labels.getLabelById'
	].parse({
		path: { label_id: 'se-28529731' },
		query: { label_download_type: 'url' },
	}),
	'labels.createReturnLabel': ShipEngineEndpointInputSchemas[
		'labels.createReturnLabel'
	].parse({ path: { label_id: 'se-28529731' }, body: {} }),
	'labels.getTrackingLogFromLabel': ShipEngineEndpointInputSchemas[
		'labels.getTrackingLogFromLabel'
	].parse({ path: { label_id: 'se-28529731' } }),
	'labels.voidLabel': ShipEngineEndpointInputSchemas['labels.voidLabel'].parse({
		path: { label_id: 'se-28529731' },
	}),
	'labels.cancelLabelRefund': ShipEngineEndpointInputSchemas[
		'labels.cancelLabelRefund'
	].parse({ path: { label_id: 'se-28529731' } }),
	'manifests.listManifests': ShipEngineEndpointInputSchemas[
		'manifests.listManifests'
	].parse({
		query: {
			warehouse_id: 'se-28529731',
			ship_date_start: '2026-01-01T00:00:00Z',
			ship_date_end: '2026-01-01T00:00:00Z',
			created_at_start: '2026-01-01T00:00:00Z',
			created_at_end: '2026-01-01T00:00:00Z',
			carrier_id: 'se-28529731',
			page: 1,
			page_size: 1,
			label_ids: ['se-28529731', 'se-28529732'],
		},
	}),
	'manifests.createManifest': ShipEngineEndpointInputSchemas[
		'manifests.createManifest'
	].parse({
		body: {
			carrier_id: 'se-28529731',
			warehouse_id: 'se-28529731',
			ship_date: '2018-09-23T15:00:00.000Z',
		},
	}),
	'manifests.getManifestById': ShipEngineEndpointInputSchemas[
		'manifests.getManifestById'
	].parse({ path: { manifest_id: 'se-28529731' } }),
	'manifests.getManifestRequestById': ShipEngineEndpointInputSchemas[
		'manifests.getManifestRequestById'
	].parse({ path: { manifest_request_id: 'se-28529731' } }),
	'packageTypes.listPackageTypes': ShipEngineEndpointInputSchemas[
		'packageTypes.listPackageTypes'
	].parse({}),
	'packageTypes.createPackageType': ShipEngineEndpointInputSchemas[
		'packageTypes.createPackageType'
	].parse({
		body: { name: 'laptop_box', package_code: 'small_flat_rate_box' },
	}),
	'packageTypes.getPackageTypeById': ShipEngineEndpointInputSchemas[
		'packageTypes.getPackageTypeById'
	].parse({ path: { package_id: 'se-28529731' } }),
	'packageTypes.updatePackageType': ShipEngineEndpointInputSchemas[
		'packageTypes.updatePackageType'
	].parse({
		path: { package_id: 'se-28529731' },
		body: { name: 'laptop_box', package_code: 'small_flat_rate_box' },
	}),
	'packageTypes.deletePackageType': ShipEngineEndpointInputSchemas[
		'packageTypes.deletePackageType'
	].parse({ path: { package_id: 'se-28529731' } }),
	'packagePickups.listScheduledPickups': ShipEngineEndpointInputSchemas[
		'packagePickups.listScheduledPickups'
	].parse({
		query: {
			carrier_id: 'se-28529731',
			warehouse_id: 'se-28529731',
			created_at_start: '2026-01-01T00:00:00Z',
			created_at_end: '2026-01-01T00:00:00Z',
			page: 1,
			page_size: 1,
		},
	}),
	'packagePickups.schedulePickup': ShipEngineEndpointInputSchemas[
		'packagePickups.schedulePickup'
	].parse({
		body: {
			contact_details: {
				name: 'x',
				email: 'john.doe@example.com',
				phone: 'xxxxxxx',
			},
			label_ids: ['se-28529731'],
			pickup_window: {
				start_at: '2018-09-23T15:00:00.000Z',
				end_at: '2018-09-23T15:00:00.000Z',
			},
		},
	}),
	'packagePickups.getPickupById': ShipEngineEndpointInputSchemas[
		'packagePickups.getPickupById'
	].parse({ path: { pickup_id: 'pik_3YcKU5zdtJuCqoeNwyqqbW' } }),
	'packagePickups.deleteScheduledPickup': ShipEngineEndpointInputSchemas[
		'packagePickups.deleteScheduledPickup'
	].parse({ path: { pickup_id: 'pik_3YcKU5zdtJuCqoeNwyqqbW' } }),
	'rates.calculateRates': ShipEngineEndpointInputSchemas[
		'rates.calculateRates'
	].parse({ body: { shipment_id: 'se-28529731' } }),
	'rates.compareBulkRates': ShipEngineEndpointInputSchemas[
		'rates.compareBulkRates'
	].parse({
		body: {
			rate_options: { carrier_ids: ['se-28529731'] },
			shipment_ids: ['se-28529731'],
		},
	}),
	'rates.estimateRates': ShipEngineEndpointInputSchemas[
		'rates.estimateRates'
	].parse({
		body: {
			from_country_code: 'CA',
			from_postal_code: '78756-3717',
			from_city_locality: 'Austin',
			from_state_province: 'Austin',
			to_country_code: 'CA',
			to_postal_code: '78756-3717',
			to_city_locality: 'Austin',
			to_state_province: 'Houston',
			weight: { value: 0, unit: 'pound' },
			ship_date: '2018-09-23T15:00:00.000Z',
			carrier_id: 'se-28529731',
		},
	}),
	'rates.getRateById': ShipEngineEndpointInputSchemas[
		'rates.getRateById'
	].parse({ path: { rate_id: 'se-28529731' } }),
	'servicePoints.servicePointsList': ShipEngineEndpointInputSchemas[
		'servicePoints.servicePointsList'
	].parse({ body: { providers: [{}] } }),
	'servicePoints.servicePointsGetById': ShipEngineEndpointInputSchemas[
		'servicePoints.servicePointsGetById'
	].parse({
		path: {
			carrier_code: 'x',
			country_code: 'xx',
			service_point_id: 'example',
		},
	}),
	'shipments.listShipments': ShipEngineEndpointInputSchemas[
		'shipments.listShipments'
	].parse({
		query: {
			shipment_status: 'pending',
			batch_id: 'se-28529731',
			tag: 'x',
			created_at_start: '2026-01-01T00:00:00Z',
			created_at_end: '2026-01-01T00:00:00Z',
			modified_at_start: '2026-01-01T00:00:00Z',
			modified_at_end: '2026-01-01T00:00:00Z',
			page: 1,
			page_size: 1,
			sales_order_id: 'example',
			sort_dir: 'asc',
			sort_by: 'modified_at',
		},
	}),
	'shipments.createShipments': ShipEngineEndpointInputSchemas[
		'shipments.createShipments'
	].parse({
		body: {
			shipments: [
				{
					carrier_id: 'se-28529731',
					service_code: 'usps_first_class_mail',
					ship_to: {
						name: 'John Doe',
						address_line1: '1999 Bishop Grandin Blvd.',
						city_locality: 'Winnipeg',
						state_province: 'Manitoba',
						postal_code: '78756-3717',
					},
					ship_from: {
						name: 'John Doe',
						address_line1: '1999 Bishop Grandin Blvd.',
						city_locality: 'Winnipeg',
						state_province: 'Manitoba',
						postal_code: '78756-3717',
					},
				},
			],
		},
	}),
	'shipments.getShipmentByExternalId': ShipEngineEndpointInputSchemas[
		'shipments.getShipmentByExternalId'
	].parse({ path: { external_shipment_id: 'example' } }),
	'shipments.parseShipment': ShipEngineEndpointInputSchemas[
		'shipments.parseShipment'
	].parse({
		body: {
			text: "I have a 4oz package that's 5x10x14in, and I need to ship it to Margie McMiller at 3800 North Lamar suite 200 in austin, tx 78652. Please send it via USPS first class and require an adult signature. It also needs to be insured for $400.\n",
		},
	}),
	'shipments.getShipmentById': ShipEngineEndpointInputSchemas[
		'shipments.getShipmentById'
	].parse({ path: { shipment_id: 'se-28529731' } }),
	'shipments.updateShipment': ShipEngineEndpointInputSchemas[
		'shipments.updateShipment'
	].parse({
		path: { shipment_id: 'se-28529731' },
		body: {
			ship_to: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
			ship_from: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
		},
	}),
	'shipments.cancelShipments': ShipEngineEndpointInputSchemas[
		'shipments.cancelShipments'
	].parse({ path: { shipment_id: 'se-28529731' } }),
	'shipments.listShipmentRates': ShipEngineEndpointInputSchemas[
		'shipments.listShipmentRates'
	].parse({
		path: { shipment_id: 'se-28529731' },
		query: { created_at_start: '2026-01-01T00:00:00Z' },
	}),
	'shipments.shipmentsUpdateTags': ShipEngineEndpointInputSchemas[
		'shipments.shipmentsUpdateTags'
	].parse({ body: {} }),
	'shipments.shipmentsListTags': ShipEngineEndpointInputSchemas[
		'shipments.shipmentsListTags'
	].parse({ path: { shipment_id: 'se-28529731' } }),
	'shipments.tagShipment': ShipEngineEndpointInputSchemas[
		'shipments.tagShipment'
	].parse({ path: { shipment_id: 'se-28529731', tag_name: 'Fragile' } }),
	'shipments.untagShipment': ShipEngineEndpointInputSchemas[
		'shipments.untagShipment'
	].parse({ path: { shipment_id: 'se-28529731', tag_name: 'Fragile' } }),
	'tags.listTags': ShipEngineEndpointInputSchemas['tags.listTags'].parse({}),
	'tags.createTag': ShipEngineEndpointInputSchemas['tags.createTag'].parse({
		body: { name: 'Fragile' },
	}),
	'tags.createTagByName': ShipEngineEndpointInputSchemas[
		'tags.createTagByName'
	].parse({ path: { tag_name: 'Fragile' } }),
	'tags.deleteTag': ShipEngineEndpointInputSchemas['tags.deleteTag'].parse({
		path: { tag_name: 'Fragile' },
	}),
	'tags.renameTag': ShipEngineEndpointInputSchemas['tags.renameTag'].parse({
		path: { tag_name: 'Fragile', new_tag_name: 'Fragile' },
	}),
	'tokens.tokensGetEphemeralToken': ShipEngineEndpointInputSchemas[
		'tokens.tokensGetEphemeralToken'
	].parse({ query: { redirect: 'shipengine-dashboard' } }),
	'tracking.getTrackingLog': ShipEngineEndpointInputSchemas[
		'tracking.getTrackingLog'
	].parse({
		query: {
			carrier_code: 'x',
			tracking_number: 'x',
			carrier_id: 'se-28529731',
		},
	}),
	'tracking.startTracking': ShipEngineEndpointInputSchemas[
		'tracking.startTracking'
	].parse({
		query: {
			carrier_code: 'x',
			tracking_number: 'x',
			carrier_id: 'se-28529731',
		},
	}),
	'tracking.stopTracking': ShipEngineEndpointInputSchemas[
		'tracking.stopTracking'
	].parse({
		query: {
			carrier_code: 'x',
			tracking_number: 'x',
			carrier_id: 'se-28529731',
		},
	}),
	'warehouses.listWarehouses': ShipEngineEndpointInputSchemas[
		'warehouses.listWarehouses'
	].parse({}),
	'warehouses.createWarehouse': ShipEngineEndpointInputSchemas[
		'warehouses.createWarehouse'
	].parse({
		body: {
			name: 'Zero Cool HQ',
			origin_address: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
		},
	}),
	'warehouses.getWarehouseById': ShipEngineEndpointInputSchemas[
		'warehouses.getWarehouseById'
	].parse({ path: { warehouse_id: 'se-28529731' } }),
	'warehouses.updateWarehouse': ShipEngineEndpointInputSchemas[
		'warehouses.updateWarehouse'
	].parse({
		path: { warehouse_id: 'se-28529731' },
		body: {
			name: 'Zero Cool HQ',
			origin_address: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
		},
	}),
	'warehouses.deleteWarehouse': ShipEngineEndpointInputSchemas[
		'warehouses.deleteWarehouse'
	].parse({ path: { warehouse_id: 'se-28529731' } }),
	'warehouses.updateWarehouseSettings': ShipEngineEndpointInputSchemas[
		'warehouses.updateWarehouseSettings'
	].parse({ path: { warehouse_id: 'se-28529731' }, body: {} }),
} satisfies ShipEngineEndpointInputs;

const testOutputs = {
	'account.listAccountSettings': ShipEngineEndpointOutputSchemas[
		'account.listAccountSettings'
	].parse({}),
	'account.listAccountImages': ShipEngineEndpointOutputSchemas[
		'account.listAccountImages'
	].parse({
		total: 2750,
		page: 1,
		pages: 4,
		links: {
			first: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			last: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			prev: {},
			next: {},
		},
		images: [{}],
	}),
	'account.createAccountImage': ShipEngineEndpointOutputSchemas[
		'account.createAccountImage'
	].parse({}),
	'account.getAccountSettingsImagesById': ShipEngineEndpointOutputSchemas[
		'account.getAccountSettingsImagesById'
	].parse({}),
	'account.updateAccountSettingsImagesById':
		ShipEngineEndpointOutputSchemas[
			'account.updateAccountSettingsImagesById'
		].parse(''),
	'account.deleteAccountImageById':
		ShipEngineEndpointOutputSchemas['account.deleteAccountImageById'].parse(''),
	'addresses.parseAddress': ShipEngineEndpointOutputSchemas[
		'addresses.parseAddress'
	].parse({
		score: 0,
		address: {},
		entities: [
			{ type: 'x', score: 0, text: 'x', start_index: 0, end_index: 0 },
		],
	}),
	'addresses.validateAddress': ShipEngineEndpointOutputSchemas[
		'addresses.validateAddress'
	].parse([
		{
			status: 'unverified',
			original_address: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
			matched_address: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
			messages: [
				{
					code: 'a1000',
					message: 'Invalid Postal Code',
					type: 'error',
					detail_code: 'unsupported_country',
				},
			],
		},
	]),
	'batches.listBatches': ShipEngineEndpointOutputSchemas[
		'batches.listBatches'
	].parse({
		batches: [
			{
				label_layout: '4x6',
				label_format: 'pdf',
				batch_id: 'se-28529731',
				batch_number: 'example',
				external_batch_id: null,
				batch_notes: 'Batch for morning shipment',
				created_at: '2018-09-23T15:00:00.000Z',
				processed_at: '2018-09-23T15:00:00.000Z',
				errors: 2,
				process_errors: [
					{
						error_source: 'carrier',
						error_type: 'account_status',
						error_code: 'auto_fund_not_supported',
						message: 'Body of request cannot be null.',
					},
				],
				warnings: 1,
				completed: 1,
				forms: 3,
				count: 2,
				batch_shipments_url: {},
				batch_labels_url: {},
				batch_errors_url: {},
				label_download: {},
				form_download: {},
				paperless_download: {},
				status: 'open',
			},
		],
		total: 10,
		page: 1,
		pages: 10,
		links: {
			first: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			last: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			prev: {},
			next: {},
		},
	}),
	'batches.createBatch': ShipEngineEndpointOutputSchemas[
		'batches.createBatch'
	].parse({
		label_layout: '4x6',
		label_format: 'pdf',
		batch_id: 'se-28529731',
		batch_number: 'example',
		external_batch_id: null,
		batch_notes: 'Batch for morning shipment',
		created_at: '2018-09-23T15:00:00.000Z',
		processed_at: '2018-09-23T15:00:00.000Z',
		errors: 2,
		process_errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
		warnings: 1,
		completed: 1,
		forms: 3,
		count: 2,
		batch_shipments_url: {},
		batch_labels_url: {},
		batch_errors_url: {},
		label_download: {},
		form_download: {},
		paperless_download: {},
		status: 'open',
	}),
	'batches.getBatchByExternalId': ShipEngineEndpointOutputSchemas[
		'batches.getBatchByExternalId'
	].parse({
		label_layout: '4x6',
		label_format: 'pdf',
		batch_id: 'se-28529731',
		batch_number: 'example',
		external_batch_id: null,
		batch_notes: 'Batch for morning shipment',
		created_at: '2018-09-23T15:00:00.000Z',
		processed_at: '2018-09-23T15:00:00.000Z',
		errors: 2,
		process_errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
		warnings: 1,
		completed: 1,
		forms: 3,
		count: 2,
		batch_shipments_url: {},
		batch_labels_url: {},
		batch_errors_url: {},
		label_download: {},
		form_download: {},
		paperless_download: {},
		status: 'open',
	}),
	'batches.deleteBatch':
		ShipEngineEndpointOutputSchemas['batches.deleteBatch'].parse(''),
	'batches.getBatchById': ShipEngineEndpointOutputSchemas[
		'batches.getBatchById'
	].parse({
		label_layout: '4x6',
		label_format: 'pdf',
		batch_id: 'se-28529731',
		batch_number: 'example',
		external_batch_id: null,
		batch_notes: 'Batch for morning shipment',
		created_at: '2018-09-23T15:00:00.000Z',
		processed_at: '2018-09-23T15:00:00.000Z',
		errors: 2,
		process_errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
		warnings: 1,
		completed: 1,
		forms: 3,
		count: 2,
		batch_shipments_url: {},
		batch_labels_url: {},
		batch_errors_url: {},
		label_download: {},
		form_download: {},
		paperless_download: {},
		status: 'open',
	}),
	'batches.updateBatch':
		ShipEngineEndpointOutputSchemas['batches.updateBatch'].parse(''),
	'batches.addToBatch':
		ShipEngineEndpointOutputSchemas['batches.addToBatch'].parse(''),
	'batches.listBatchErrors': ShipEngineEndpointOutputSchemas[
		'batches.listBatchErrors'
	].parse({
		errors: [{}],
		links: {
			first: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			last: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			prev: {},
			next: {},
		},
	}),
	'batches.processBatch':
		ShipEngineEndpointOutputSchemas['batches.processBatch'].parse(''),
	'batches.removeFromBatch':
		ShipEngineEndpointOutputSchemas['batches.removeFromBatch'].parse(''),
	'carriers.listCarriers': ShipEngineEndpointOutputSchemas[
		'carriers.listCarriers'
	].parse({
		carriers: [{}],
		request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
	}),
	'carriers.getCarrierById': ShipEngineEndpointOutputSchemas[
		'carriers.getCarrierById'
	].parse({}),
	'carriers.disconnectCarrierById':
		ShipEngineEndpointOutputSchemas['carriers.disconnectCarrierById'].parse(''),
	'carriers.addFundsToCarrier': ShipEngineEndpointOutputSchemas[
		'carriers.addFundsToCarrier'
	].parse({ balance: { currency: 'example', amount: 0 } }),
	'carriers.getCarrierOptions': ShipEngineEndpointOutputSchemas[
		'carriers.getCarrierOptions'
	].parse({}),
	'carriers.listCarrierPackageTypes': ShipEngineEndpointOutputSchemas[
		'carriers.listCarrierPackageTypes'
	].parse({}),
	'carriers.listCarrierServices': ShipEngineEndpointOutputSchemas[
		'carriers.listCarrierServices'
	].parse({}),
	'carrierAccounts.connectCarrier': ShipEngineEndpointOutputSchemas[
		'carrierAccounts.connectCarrier'
	].parse({ carrier_id: 'se-28529731' }),
	'carrierAccounts.disconnectCarrier':
		ShipEngineEndpointOutputSchemas['carrierAccounts.disconnectCarrier'].parse(
			'',
		),
	'carrierAccounts.getCarrierSettings': ShipEngineEndpointOutputSchemas[
		'carrierAccounts.getCarrierSettings'
	].parse({}),
	'carrierAccounts.updateCarrierSettings':
		ShipEngineEndpointOutputSchemas[
			'carrierAccounts.updateCarrierSettings'
		].parse(''),
	'insurance.disconnectInsurer': ShipEngineEndpointOutputSchemas[
		'insurance.disconnectInsurer'
	].parse({}),
	'insurance.connectInsurer': ShipEngineEndpointOutputSchemas[
		'insurance.connectInsurer'
	].parse({}),
	'labels.createCombinedLabelDocument': ShipEngineEndpointOutputSchemas[
		'labels.createCombinedLabelDocument'
	].parse({}),
	'downloads.downloadFile': ShipEngineEndpointOutputSchemas[
		'downloads.downloadFile'
	].parse({
		kind: 'binary',
		contentType: 'application/pdf',
		base64: 'UERG',
		byteLength: 3,
	}),
	'insurance.addFundsToInsurance': ShipEngineEndpointOutputSchemas[
		'insurance.addFundsToInsurance'
	].parse({ currency: 'example', amount: 0 }),
	'insurance.getInsuranceBalance': ShipEngineEndpointOutputSchemas[
		'insurance.getInsuranceBalance'
	].parse({ currency: 'example', amount: 0 }),
	'labels.listLabels': ShipEngineEndpointOutputSchemas[
		'labels.listLabels'
	].parse({
		total: 2750,
		page: 1,
		pages: 4,
		links: {
			first: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			last: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			prev: {},
			next: {},
		},
		labels: [{}],
	}),
	'labels.createLabel': ShipEngineEndpointOutputSchemas[
		'labels.createLabel'
	].parse({
		label_id: 'se-28529731',
		status: 'processing',
		shipment_id: 'se-28529731',
		external_shipment_id: null,
		external_order_id: null,
		ship_date: '2018-09-23T00:00:00.000Z',
		created_at: '2018-09-23T15:00:00.000Z',
		shipment_cost: { currency: 'example', amount: 0 },
		insurance_cost: { currency: 'example', amount: 0 },
		tracking_number: '782758401696',
		is_international: false,
		batch_id: 'se-28529731',
		carrier_id: 'se-28529731',
		service_code: 'usps_first_class_mail',
		voided: false,
		label_image_id: 'img_DtBXupDBxREpHnwEXhTfgK',
		label_format: 'pdf',
		label_layout: '4x6',
		trackable: false,
		carrier_code: 'dhl_express',
		tracking_status: 'unknown',
		label_download: {},
		form_download: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
		qr_code_download: {},
		paperless_download: {},
		insurance_claim: {
			href: 'http://api.shipengine.com/v1/labels/se-28529731',
		},
		packages: [{ weight: { value: 0, unit: 'pound' } }],
		is_return_label: false,
		rma_number: null,
		charge_event: 'carrier_default',
		package_code: 'small_flat_rate_box',
		display_scheme: 'label',
		ship_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
	}),
	'labels.getLabelByExternalShipmentId': ShipEngineEndpointOutputSchemas[
		'labels.getLabelByExternalShipmentId'
	].parse({}),
	'labels.createLabelFromRate': ShipEngineEndpointOutputSchemas[
		'labels.createLabelFromRate'
	].parse({}),
	'labels.createLabelFromRateShopper': ShipEngineEndpointOutputSchemas[
		'labels.createLabelFromRateShopper'
	].parse({}),
	'labels.createLabelFromShipment': ShipEngineEndpointOutputSchemas[
		'labels.createLabelFromShipment'
	].parse({}),
	'labels.getLabelById': ShipEngineEndpointOutputSchemas[
		'labels.getLabelById'
	].parse({}),
	'labels.createReturnLabel': ShipEngineEndpointOutputSchemas[
		'labels.createReturnLabel'
	].parse({}),
	'labels.getTrackingLogFromLabel': ShipEngineEndpointOutputSchemas[
		'labels.getTrackingLogFromLabel'
	].parse({
		tracking_number: '1Z932R800392060079',
		status_code: 'DE',
		carrier_status_code: 'x',
		events: [
			{
				occurred_at: '2018-09-23T15:00:00.000Z',
				city_locality: 'AUSTIN',
				state_province: 'TX',
				postal_code: 'example',
				carrier_detail_code: 'OT',
				status_code: 'IT',
				status_description: 'In Transit',
				carrier_status_code: 'x',
				carrier_status_description:
					'Your item was delivered in or at the mailbox at 9:10 am on March',
			},
		],
	}),
	'labels.voidLabel': ShipEngineEndpointOutputSchemas['labels.voidLabel'].parse(
		{
			approved: false,
			message:
				'Unable to delete FedEx shipment. Unable to retrieve record from database.',
		},
	),
	'labels.cancelLabelRefund': ShipEngineEndpointOutputSchemas[
		'labels.cancelLabelRefund'
	].parse({}),
	'manifests.listManifests': ShipEngineEndpointOutputSchemas[
		'manifests.listManifests'
	].parse({
		manifests: [{}],
		total: 3,
		page: 3,
		pages: 4,
		links: {
			first: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			last: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			prev: {},
			next: {},
		},
	}),
	'manifests.createManifest': ShipEngineEndpointOutputSchemas[
		'manifests.createManifest'
	].parse({
		request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
		manifest_id: 'se-28529731',
		form_id: 'se-28529731',
		created_at: '2019-07-12T13:37:39.050Z',
		ship_date: '2019-07-12T13:37:39.050Z',
		shipments: 100,
		warehouse_id: 'se-28529731',
		submission_id: '9475711899564878915476',
		carrier_id: 'se-28529731',
		manifest_download: {},
	}),
	'manifests.getManifestById': ShipEngineEndpointOutputSchemas[
		'manifests.getManifestById'
	].parse({
		manifest_id: 'se-28529731',
		form_id: 'se-28529731',
		created_at: '2019-07-12T13:37:39.050Z',
		ship_date: '2019-07-12T13:37:39.050Z',
		shipments: 100,
		warehouse_id: 'se-28529731',
		submission_id: '9475711899564878915476',
		carrier_id: 'se-28529731',
		manifest_download: {},
		label_ids: ['se-28529731'],
	}),
	'manifests.getManifestRequestById': ShipEngineEndpointOutputSchemas[
		'manifests.getManifestRequestById'
	].parse({
		request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
		manifest_id: 'se-28529731',
		form_id: 'se-28529731',
		created_at: '2019-07-12T13:37:39.050Z',
		ship_date: '2019-07-12T13:37:39.050Z',
		shipments: 100,
		warehouse_id: 'se-28529731',
		submission_id: '9475711899564878915476',
		carrier_id: 'se-28529731',
		manifest_download: {},
	}),
	'packageTypes.listPackageTypes': ShipEngineEndpointOutputSchemas[
		'packageTypes.listPackageTypes'
	].parse({}),
	'packageTypes.createPackageType': ShipEngineEndpointOutputSchemas[
		'packageTypes.createPackageType'
	].parse({ name: 'laptop_box', package_code: 'small_flat_rate_box' }),
	'packageTypes.getPackageTypeById': ShipEngineEndpointOutputSchemas[
		'packageTypes.getPackageTypeById'
	].parse({ name: 'laptop_box', package_code: 'small_flat_rate_box' }),
	'packageTypes.updatePackageType':
		ShipEngineEndpointOutputSchemas['packageTypes.updatePackageType'].parse(''),
	'packageTypes.deletePackageType':
		ShipEngineEndpointOutputSchemas['packageTypes.deletePackageType'].parse(''),
	'packagePickups.listScheduledPickups': ShipEngineEndpointOutputSchemas[
		'packagePickups.listScheduledPickups'
	].parse({
		pickups: [{}],
		total: 3,
		page: 3,
		pages: 4,
		links: {
			first: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			last: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			prev: {},
			next: {},
		},
		request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
	}),
	'packagePickups.schedulePickup': ShipEngineEndpointOutputSchemas[
		'packagePickups.schedulePickup'
	].parse({
		request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
	}),
	'packagePickups.getPickupById': ShipEngineEndpointOutputSchemas[
		'packagePickups.getPickupById'
	].parse({
		pickup_id: 'pik_3YcKU5zdtJuCqoeNwyqqbW',
		label_ids: ['se-28529731'],
		created_at: '2018-09-23T15:00:00.000Z',
		carrier_id: 'se-28529731',
		warehouse_id: 'se-28529731',
		pickup_address: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		contact_details: {
			name: 'x',
			email: 'john.doe@example.com',
			phone: 'xxxxxxx',
		},
		confirmation_number: '292513CL4A3',
		request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
	}),
	'packagePickups.deleteScheduledPickup': ShipEngineEndpointOutputSchemas[
		'packagePickups.deleteScheduledPickup'
	].parse({
		request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
		pickup_id: 'pik_3YcKU5zdtJuCqoeNwyqqbW',
	}),
	'rates.calculateRates': ShipEngineEndpointOutputSchemas[
		'rates.calculateRates'
	].parse({
		rate_response: {},
		shipment_id: 'se-28529731',
		ship_date: '2018-09-23T00:00:00.000Z',
		created_at: '2018-09-23T15:00:00.000Z',
		modified_at: '2018-09-23T15:00:00.000Z',
		shipment_status: 'pending',
		return_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		confirmation: 'none',
		customs: { contents: 'merchandise', non_delivery: 'return_to_sender' },
		advanced_options: {},
		insurance_provider: 'none',
		tags: [{ name: 'Fragile' }],
		packages: [{ weight: { value: 0, unit: 'pound' } }],
		total_weight: { value: 0, unit: 'pound' },
	}),
	'rates.compareBulkRates': ShipEngineEndpointOutputSchemas[
		'rates.compareBulkRates'
	].parse([
		{
			rate_request_id: 'se-28529731',
			shipment_id: 'se-28529731',
			created_at: '2018-09-23T15:00:00.000Z',
			status: 'working',
			errors: [
				{
					error_source: 'carrier',
					error_type: 'account_status',
					error_code: 'auto_fund_not_supported',
					message: 'Body of request cannot be null.',
				},
			],
		},
	]),
	'rates.estimateRates': ShipEngineEndpointOutputSchemas[
		'rates.estimateRates'
	].parse([
		{
			rate_type: 'check',
			carrier_id: 'se-28529731',
			shipping_amount: { currency: 'example', amount: 0 },
			insurance_amount: { currency: 'example', amount: 0 },
			confirmation_amount: { currency: 'example', amount: 0 },
			other_amount: { currency: 'example', amount: 0 },
			zone: 6,
			package_type: 'package',
			guaranteed_service: false,
			negotiated_rate: false,
			service_type: 'x',
			service_code: 'x',
			trackable: false,
			carrier_code: 'x',
			carrier_nickname: 'x',
			carrier_friendly_name: 'x',
			validation_status: 'valid',
			warning_messages: ['example'],
			error_messages: ['example'],
		},
	]),
	'rates.getRateById': ShipEngineEndpointOutputSchemas[
		'rates.getRateById'
	].parse({
		rate_id: 'se-28529731',
		rate_type: 'check',
		carrier_id: 'se-28529731',
		shipping_amount: { currency: 'example', amount: 0 },
		insurance_amount: { currency: 'example', amount: 0 },
		confirmation_amount: { currency: 'example', amount: 0 },
		other_amount: { currency: 'example', amount: 0 },
		zone: 6,
		package_type: 'package',
		guaranteed_service: false,
		negotiated_rate: false,
		service_type: 'x',
		service_code: 'x',
		trackable: false,
		carrier_code: 'x',
		carrier_nickname: 'x',
		carrier_friendly_name: 'x',
		validation_status: 'valid',
		warning_messages: ['example'],
		error_messages: ['example'],
	}),
	'servicePoints.servicePointsList': ShipEngineEndpointOutputSchemas[
		'servicePoints.servicePointsList'
	].parse({}),
	'servicePoints.servicePointsGetById': ShipEngineEndpointOutputSchemas[
		'servicePoints.servicePointsGetById'
	].parse({}),
	'shipments.listShipments': ShipEngineEndpointOutputSchemas[
		'shipments.listShipments'
	].parse({
		shipments: [
			{
				shipment_id: 'se-28529731',
				carrier_id: 'se-28529731',
				service_code: 'usps_first_class_mail',
				ship_date: '2018-09-23T00:00:00.000Z',
				created_at: '2018-09-23T15:00:00.000Z',
				modified_at: '2018-09-23T15:00:00.000Z',
				shipment_status: 'pending',
				ship_to: {
					name: 'John Doe',
					address_line1: '1999 Bishop Grandin Blvd.',
					city_locality: 'Winnipeg',
					state_province: 'Manitoba',
					postal_code: '78756-3717',
				},
				ship_from: {
					name: 'John Doe',
					address_line1: '1999 Bishop Grandin Blvd.',
					city_locality: 'Winnipeg',
					state_province: 'Manitoba',
					postal_code: '78756-3717',
				},
				warehouse_id: 'se-28529731',
				return_to: {
					name: 'John Doe',
					address_line1: '1999 Bishop Grandin Blvd.',
					city_locality: 'Winnipeg',
					state_province: 'Manitoba',
					postal_code: '78756-3717',
				},
				confirmation: 'none',
				customs: { contents: 'merchandise', non_delivery: 'return_to_sender' },
				advanced_options: {},
				insurance_provider: 'none',
				tags: [{ name: 'Fragile' }],
				packages: [{ weight: { value: 0, unit: 'pound' } }],
				total_weight: { value: 0, unit: 'pound' },
			},
		],
		total: 1990,
		page: 1,
		pages: 1,
		links: {
			first: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			last: { href: 'http://api.shipengine.com/v1/labels/se-28529731' },
			prev: {},
			next: {},
		},
	}),
	'shipments.createShipments': ShipEngineEndpointOutputSchemas[
		'shipments.createShipments'
	].parse({ has_errors: false, shipments: [{}] }),
	'shipments.getShipmentByExternalId': ShipEngineEndpointOutputSchemas[
		'shipments.getShipmentByExternalId'
	].parse({
		shipment_id: 'se-28529731',
		carrier_id: 'se-28529731',
		service_code: 'usps_first_class_mail',
		ship_date: '2018-09-23T00:00:00.000Z',
		created_at: '2018-09-23T15:00:00.000Z',
		modified_at: '2018-09-23T15:00:00.000Z',
		shipment_status: 'pending',
		ship_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		ship_from: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		warehouse_id: 'se-28529731',
		return_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		confirmation: 'none',
		customs: { contents: 'merchandise', non_delivery: 'return_to_sender' },
		advanced_options: {},
		insurance_provider: 'none',
		tags: [{ name: 'Fragile' }],
		packages: [{ weight: { value: 0, unit: 'pound' } }],
		total_weight: { value: 0, unit: 'pound' },
	}),
	'shipments.parseShipment': ShipEngineEndpointOutputSchemas[
		'shipments.parseShipment'
	].parse({
		score: 0,
		shipment: {},
		entities: [
			{ type: 'x', score: 0, text: 'x', start_index: 0, end_index: 0 },
		],
	}),
	'shipments.getShipmentById': ShipEngineEndpointOutputSchemas[
		'shipments.getShipmentById'
	].parse({
		shipment_id: 'se-28529731',
		carrier_id: 'se-28529731',
		service_code: 'usps_first_class_mail',
		ship_date: '2018-09-23T00:00:00.000Z',
		created_at: '2018-09-23T15:00:00.000Z',
		modified_at: '2018-09-23T15:00:00.000Z',
		shipment_status: 'pending',
		ship_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		ship_from: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		warehouse_id: 'se-28529731',
		return_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		confirmation: 'none',
		customs: { contents: 'merchandise', non_delivery: 'return_to_sender' },
		advanced_options: {},
		insurance_provider: 'none',
		tags: [{ name: 'Fragile' }],
		packages: [{ weight: { value: 0, unit: 'pound' } }],
		total_weight: { value: 0, unit: 'pound' },
	}),
	'shipments.updateShipment': ShipEngineEndpointOutputSchemas[
		'shipments.updateShipment'
	].parse({
		errors: ["Parameter value '100000000.00' is out of range."],
		address_validation: {
			status: 'unverified',
			original_address: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
			matched_address: {
				name: 'John Doe',
				address_line1: '1999 Bishop Grandin Blvd.',
				city_locality: 'Winnipeg',
				state_province: 'Manitoba',
				postal_code: '78756-3717',
			},
			messages: [
				{
					code: 'a1000',
					message: 'Invalid Postal Code',
					type: 'error',
					detail_code: 'unsupported_country',
				},
			],
		},
		shipment_id: 'se-28529731',
		carrier_id: 'se-28529731',
		service_code: 'usps_first_class_mail',
		ship_date: '2018-09-23T00:00:00.000Z',
		created_at: '2018-09-23T15:00:00.000Z',
		shipment_status: 'pending',
		ship_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		ship_from: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		return_to: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		confirmation: 'none',
		customs: { contents: 'merchandise', non_delivery: 'return_to_sender' },
		advanced_options: {},
		insurance_provider: 'none',
		tags: [{ name: 'Fragile' }],
		packages: [{ weight: { value: 0, unit: 'pound' } }],
		total_weight: { value: 0, unit: 'pound' },
	}),
	'shipments.cancelShipments':
		ShipEngineEndpointOutputSchemas['shipments.cancelShipments'].parse(''),
	'shipments.listShipmentRates': ShipEngineEndpointOutputSchemas[
		'shipments.listShipmentRates'
	].parse({
		rates: [
			{
				rate_id: 'se-28529731',
				rate_type: 'check',
				carrier_id: 'se-28529731',
				shipping_amount: { currency: 'example', amount: 0 },
				insurance_amount: { currency: 'example', amount: 0 },
				confirmation_amount: { currency: 'example', amount: 0 },
				other_amount: { currency: 'example', amount: 0 },
				zone: 6,
				package_type: 'package',
				guaranteed_service: false,
				negotiated_rate: false,
				service_type: 'x',
				service_code: 'x',
				trackable: false,
				carrier_code: 'x',
				carrier_nickname: 'x',
				carrier_friendly_name: 'x',
				validation_status: 'valid',
				warning_messages: ['example'],
				error_messages: ['example'],
			},
		],
		invalid_rates: [
			{
				rate_id: 'se-28529731',
				rate_type: 'check',
				carrier_id: 'se-28529731',
				shipping_amount: { currency: 'example', amount: 0 },
				insurance_amount: { currency: 'example', amount: 0 },
				confirmation_amount: { currency: 'example', amount: 0 },
				other_amount: { currency: 'example', amount: 0 },
				zone: 6,
				package_type: 'package',
				guaranteed_service: false,
				negotiated_rate: false,
				service_type: 'x',
				service_code: 'x',
				trackable: false,
				carrier_code: 'x',
				carrier_nickname: 'x',
				carrier_friendly_name: 'x',
				validation_status: 'valid',
				warning_messages: ['example'],
				error_messages: ['example'],
			},
		],
		rate_request_id: 'se-28529731',
		shipment_id: 'se-28529731',
		created_at: 'se-28529731',
		status: 'working',
		errors: [
			{
				error_source: 'carrier',
				error_type: 'account_status',
				error_code: 'auto_fund_not_supported',
				message: 'Body of request cannot be null.',
			},
		],
	}),
	'shipments.shipmentsUpdateTags':
		ShipEngineEndpointOutputSchemas['shipments.shipmentsUpdateTags'].parse(
			undefined,
		),
	'shipments.shipmentsListTags': ShipEngineEndpointOutputSchemas[
		'shipments.shipmentsListTags'
	].parse({ tags: ['example'] }),
	'shipments.tagShipment': ShipEngineEndpointOutputSchemas[
		'shipments.tagShipment'
	].parse({ tags: ['example'] }),
	'shipments.untagShipment':
		ShipEngineEndpointOutputSchemas['shipments.untagShipment'].parse(''),
	'tags.listTags': ShipEngineEndpointOutputSchemas['tags.listTags'].parse({}),
	'tags.createTag': ShipEngineEndpointOutputSchemas['tags.createTag'].parse({
		name: 'Fragile',
	}),
	'tags.createTagByName': ShipEngineEndpointOutputSchemas[
		'tags.createTagByName'
	].parse({ name: 'Fragile' }),
	'tags.deleteTag': ShipEngineEndpointOutputSchemas['tags.deleteTag'].parse(''),
	'tags.renameTag': ShipEngineEndpointOutputSchemas['tags.renameTag'].parse(''),
	'tokens.tokensGetEphemeralToken': ShipEngineEndpointOutputSchemas[
		'tokens.tokensGetEphemeralToken'
	].parse({}),
	'tracking.getTrackingLog': ShipEngineEndpointOutputSchemas[
		'tracking.getTrackingLog'
	].parse({
		tracking_number: '1Z932R800392060079',
		tracking_url:
			'https://www.fedex.com/fedextrack/?action=track&trackingnumber=1234',
		status_code: 'DE',
		carrier_code: 'dhl_express',
		carrier_id: 1,
		carrier_detail_code: 'OT',
		carrier_status_code: 'x',
		events: [
			{
				occurred_at: '2018-09-23T15:00:00.000Z',
				city_locality: 'AUSTIN',
				state_province: 'TX',
				postal_code: 'example',
				carrier_detail_code: 'OT',
				status_code: 'IT',
				status_description: 'In Transit',
				carrier_status_code: 'x',
				carrier_status_description:
					'Your item was delivered in or at the mailbox at 9:10 am on March',
			},
		],
	}),
	'tracking.startTracking':
		ShipEngineEndpointOutputSchemas['tracking.startTracking'].parse(''),
	'tracking.stopTracking':
		ShipEngineEndpointOutputSchemas['tracking.stopTracking'].parse(''),
	'warehouses.listWarehouses': ShipEngineEndpointOutputSchemas[
		'warehouses.listWarehouses'
	].parse({ warehouses: [{}] }),
	'warehouses.createWarehouse': ShipEngineEndpointOutputSchemas[
		'warehouses.createWarehouse'
	].parse({
		warehouse_id: 'se-28529731',
		name: 'Zero Cool HQ',
		created_at: '2019-06-25T18:12:35.583Z',
		origin_address: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		return_address: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
	}),
	'warehouses.getWarehouseById': ShipEngineEndpointOutputSchemas[
		'warehouses.getWarehouseById'
	].parse({
		warehouse_id: 'se-28529731',
		name: 'Zero Cool HQ',
		created_at: '2019-06-25T18:12:35.583Z',
		origin_address: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
		return_address: {
			name: 'John Doe',
			address_line1: '1999 Bishop Grandin Blvd.',
			city_locality: 'Winnipeg',
			state_province: 'Manitoba',
			postal_code: '78756-3717',
		},
	}),
	'warehouses.updateWarehouse':
		ShipEngineEndpointOutputSchemas['warehouses.updateWarehouse'].parse(''),
	'warehouses.deleteWarehouse':
		ShipEngineEndpointOutputSchemas['warehouses.deleteWarehouse'].parse(''),
	'warehouses.updateWarehouseSettings':
		ShipEngineEndpointOutputSchemas['warehouses.updateWarehouseSettings'].parse(
			'',
		),
} satisfies ShipEngineEndpointOutputs;

function makeJsonResponse(value: unknown): Response {
	// unknown because HTTP JSON fixtures are serialized test data before endpoint schema validation.
	return new Response(JSON.stringify(value), {
		status: 200,
		headers: { 'content-type': 'application/json' },
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	// unknown because generated operation fixtures have operation-specific input object shapes.
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getObjectProperty(value: object, key: string): unknown {
	// unknown because each operation has a different strict input schema.
	return Object.fromEntries(Object.entries(value))[key];
}

function getPathParameter(input: object, name: string): string {
	const path = getObjectProperty(input, 'path');
	if (!isRecord(path) || typeof path[name] !== 'string')
		throw new Error('Invalid path fixture');
	return path[name];
}

function serializeQueryValue(value: unknown): string {
	// unknown because generated query fixtures contain scalar and array OpenAPI parameter values.
	return Array.isArray(value) ? value.join(',') : String(value);
}

describe('ShipEngine operations', () => {
	for (const operationName of SHIPENGINE_OPERATION_NAMES) {
		it(operationName, async () => {
			const operation = SHIPENGINE_OPERATIONS[operationName];
			const input = testInputs[operationName];
			const expectedOutput = testOutputs[operationName];
			const fetchMock = jest.spyOn(globalThis, 'fetch');
			if (operation.binary) {
				fetchMock.mockResolvedValue(
					new Response(new Uint8Array([80, 68, 70]), {
						status: 200,
						headers: { 'content-type': 'application/pdf' },
					}),
				);
			} else if (expectedOutput === undefined) {
				fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
			} else {
				fetchMock.mockResolvedValue(makeJsonResponse(expectedOutput));
			}
			try {
				const output = await makeShipEngineRequest(
					operationName,
					'test-api-key',
					input,
				);
				expect(output).toEqual(expectedOutput);
				const requestCall = fetchMock.mock.calls[0];
				expect(requestCall).toBeDefined();
				if (!requestCall) throw new Error('Expected ShipEngine request');
				const [requestUrl, requestInit] = requestCall;
				const url = new URL(String(requestUrl));
				expect(url.origin).toBe('https://api.shipengine.com');
				expect(url.pathname).toBe(
					operation.path.replace(/\{([^}]+)\}/g, (_match, name: string) =>
						getPathParameter(input, name),
					),
				);
				expect(requestInit?.method).toBe(operation.method);
				expect(new Headers(requestInit?.headers).get('API-Key')).toBe(
					'test-api-key',
				);
				expect(new Headers(requestInit?.headers).has('Authorization')).toBe(
					false,
				);
				const query = getObjectProperty(input, 'query');
				if (isRecord(query)) {
					for (const [key, value] of Object.entries(query)) {
						const parameter = operation.queryParameters.find(
							(queryParameter) => queryParameter.name === key,
						);
						const expectedValues =
							Array.isArray(value) && parameter?.explode !== false
								? value.map(String)
								: [serializeQueryValue(value)];
						expect(url.searchParams.getAll(key)).toEqual(expectedValues);
					}
				}
				const body = getObjectProperty(input, 'body');
				if (body !== undefined)
					expect(JSON.parse(String(requestInit?.body))).toEqual(body);
				else expect(requestInit?.body).toBeUndefined();
			} finally {
				fetchMock.mockRestore();
			}
		});
	}
	it('logs only the safe operation name when request input contains customer address data', async () => {
		const context = buildContext();
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('[]', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		mockedLogEvent.mockClear();
		try {
			await ShipEngine.addresses.validateAddress(context, {
				body: [
					{
						address_line1: '123 Private Road',
						city_locality: 'Example City',
						state_province: 'CA',
						country_code: 'US',
					},
				],
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				context,
				'shipengine.validate_address',
				{ operation: 'addresses.validateAddress' },
				'completed',
			);
			expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
				'123 Private Road',
			);
		} finally {
			fetchMock.mockRestore();
		}
	});
	expect(SHIPENGINE_OPERATION_NAMES).toHaveLength(92);
});

import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ShipEngineContext } from '..';
import { makeShipEngineRequest } from '../client';
import { SHIPENGINE_OPERATIONS } from './operations';
import type {
	ShipEngineEndpointInputs,
	ShipEngineEndpointOutputs,
	ShipEngineOperationName,
} from './types';

export type ShipEngineHandler<K extends ShipEngineOperationName> =
	CorsairEndpoint<
		ShipEngineContext,
		ShipEngineEndpointInputs[K],
		ShipEngineEndpointOutputs[K]
	>;

function createOperation<K extends ShipEngineOperationName>(
	name: K,
): ShipEngineHandler<K> {
	return async (ctx, input) => {
		const result = await makeShipEngineRequest(
			name,
			ctx.key,
			input,
			ctx.options.apiRegion,
		);
		await logEventFromContext(
			ctx,
			`shipengine.${SHIPENGINE_OPERATIONS[name].operationId}`,
			{ operation: name },
			'completed',
		);
		return result;
	};
}

export const ShipEngine = {
	account: {
		listAccountSettings: createOperation('account.listAccountSettings'),
		listAccountImages: createOperation('account.listAccountImages'),
		createAccountImage: createOperation('account.createAccountImage'),
		getAccountSettingsImagesById: createOperation(
			'account.getAccountSettingsImagesById',
		),
		updateAccountSettingsImagesById: createOperation(
			'account.updateAccountSettingsImagesById',
		),
		deleteAccountImageById: createOperation('account.deleteAccountImageById'),
	},
	addresses: {
		parseAddress: createOperation('addresses.parseAddress'),
		validateAddress: createOperation('addresses.validateAddress'),
	},
	batches: {
		listBatches: createOperation('batches.listBatches'),
		createBatch: createOperation('batches.createBatch'),
		getBatchByExternalId: createOperation('batches.getBatchByExternalId'),
		deleteBatch: createOperation('batches.deleteBatch'),
		getBatchById: createOperation('batches.getBatchById'),
		updateBatch: createOperation('batches.updateBatch'),
		addToBatch: createOperation('batches.addToBatch'),
		listBatchErrors: createOperation('batches.listBatchErrors'),
		processBatch: createOperation('batches.processBatch'),
		removeFromBatch: createOperation('batches.removeFromBatch'),
	},
	carriers: {
		listCarriers: createOperation('carriers.listCarriers'),
		getCarrierById: createOperation('carriers.getCarrierById'),
		disconnectCarrierById: createOperation('carriers.disconnectCarrierById'),
		addFundsToCarrier: createOperation('carriers.addFundsToCarrier'),
		getCarrierOptions: createOperation('carriers.getCarrierOptions'),
		listCarrierPackageTypes: createOperation(
			'carriers.listCarrierPackageTypes',
		),
		listCarrierServices: createOperation('carriers.listCarrierServices'),
	},
	carrierAccounts: {
		connectCarrier: createOperation('carrierAccounts.connectCarrier'),
		disconnectCarrier: createOperation('carrierAccounts.disconnectCarrier'),
		getCarrierSettings: createOperation('carrierAccounts.getCarrierSettings'),
		updateCarrierSettings: createOperation(
			'carrierAccounts.updateCarrierSettings',
		),
	},
	insurance: {
		disconnectInsurer: createOperation('insurance.disconnectInsurer'),
		connectInsurer: createOperation('insurance.connectInsurer'),
		addFundsToInsurance: createOperation('insurance.addFundsToInsurance'),
		getInsuranceBalance: createOperation('insurance.getInsuranceBalance'),
	},
	labels: {
		createCombinedLabelDocument: createOperation(
			'labels.createCombinedLabelDocument',
		),
		listLabels: createOperation('labels.listLabels'),
		createLabel: createOperation('labels.createLabel'),
		getLabelByExternalShipmentId: createOperation(
			'labels.getLabelByExternalShipmentId',
		),
		createLabelFromRate: createOperation('labels.createLabelFromRate'),
		createLabelFromRateShopper: createOperation(
			'labels.createLabelFromRateShopper',
		),
		createLabelFromShipment: createOperation('labels.createLabelFromShipment'),
		getLabelById: createOperation('labels.getLabelById'),
		createReturnLabel: createOperation('labels.createReturnLabel'),
		getTrackingLogFromLabel: createOperation('labels.getTrackingLogFromLabel'),
		voidLabel: createOperation('labels.voidLabel'),
		cancelLabelRefund: createOperation('labels.cancelLabelRefund'),
	},
	downloads: {
		downloadFile: createOperation('downloads.downloadFile'),
	},
	manifests: {
		listManifests: createOperation('manifests.listManifests'),
		createManifest: createOperation('manifests.createManifest'),
		getManifestById: createOperation('manifests.getManifestById'),
		getManifestRequestById: createOperation('manifests.getManifestRequestById'),
	},
	packageTypes: {
		listPackageTypes: createOperation('packageTypes.listPackageTypes'),
		createPackageType: createOperation('packageTypes.createPackageType'),
		getPackageTypeById: createOperation('packageTypes.getPackageTypeById'),
		updatePackageType: createOperation('packageTypes.updatePackageType'),
		deletePackageType: createOperation('packageTypes.deletePackageType'),
	},
	packagePickups: {
		listScheduledPickups: createOperation(
			'packagePickups.listScheduledPickups',
		),
		schedulePickup: createOperation('packagePickups.schedulePickup'),
		getPickupById: createOperation('packagePickups.getPickupById'),
		deleteScheduledPickup: createOperation(
			'packagePickups.deleteScheduledPickup',
		),
	},
	rates: {
		calculateRates: createOperation('rates.calculateRates'),
		compareBulkRates: createOperation('rates.compareBulkRates'),
		estimateRates: createOperation('rates.estimateRates'),
		getRateById: createOperation('rates.getRateById'),
	},
	servicePoints: {
		servicePointsList: createOperation('servicePoints.servicePointsList'),
		servicePointsGetById: createOperation('servicePoints.servicePointsGetById'),
	},
	shipments: {
		listShipments: createOperation('shipments.listShipments'),
		createShipments: createOperation('shipments.createShipments'),
		getShipmentByExternalId: createOperation(
			'shipments.getShipmentByExternalId',
		),
		parseShipment: createOperation('shipments.parseShipment'),
		getShipmentById: createOperation('shipments.getShipmentById'),
		updateShipment: createOperation('shipments.updateShipment'),
		cancelShipments: createOperation('shipments.cancelShipments'),
		listShipmentRates: createOperation('shipments.listShipmentRates'),
		shipmentsUpdateTags: createOperation('shipments.shipmentsUpdateTags'),
		shipmentsListTags: createOperation('shipments.shipmentsListTags'),
		tagShipment: createOperation('shipments.tagShipment'),
		untagShipment: createOperation('shipments.untagShipment'),
	},
	tags: {
		listTags: createOperation('tags.listTags'),
		createTag: createOperation('tags.createTag'),
		createTagByName: createOperation('tags.createTagByName'),
		deleteTag: createOperation('tags.deleteTag'),
		renameTag: createOperation('tags.renameTag'),
	},
	tokens: {
		tokensGetEphemeralToken: createOperation('tokens.tokensGetEphemeralToken'),
	},
	tracking: {
		getTrackingLog: createOperation('tracking.getTrackingLog'),
		startTracking: createOperation('tracking.startTracking'),
		stopTracking: createOperation('tracking.stopTracking'),
	},
	warehouses: {
		listWarehouses: createOperation('warehouses.listWarehouses'),
		createWarehouse: createOperation('warehouses.createWarehouse'),
		getWarehouseById: createOperation('warehouses.getWarehouseById'),
		updateWarehouse: createOperation('warehouses.updateWarehouse'),
		deleteWarehouse: createOperation('warehouses.deleteWarehouse'),
		updateWarehouseSettings: createOperation(
			'warehouses.updateWarehouseSettings',
		),
	},
} as const;

export type ShipEngineNestedEndpoints = typeof ShipEngine;

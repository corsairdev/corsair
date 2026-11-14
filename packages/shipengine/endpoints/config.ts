import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { ShipEngineNestedEndpoints } from './index';
import { SHIPENGINE_OPERATIONS } from './operations';
import {
	ShipEngineEndpointInputSchemas,
	ShipEngineEndpointOutputSchemas,
} from './types';

export const shipEngineEndpointSchemas = {
	'account.listAccountSettings': {
		input: ShipEngineEndpointInputSchemas['account.listAccountSettings'],
		output: ShipEngineEndpointOutputSchemas['account.listAccountSettings'],
	},
	'account.listAccountImages': {
		input: ShipEngineEndpointInputSchemas['account.listAccountImages'],
		output: ShipEngineEndpointOutputSchemas['account.listAccountImages'],
	},
	'account.createAccountImage': {
		input: ShipEngineEndpointInputSchemas['account.createAccountImage'],
		output: ShipEngineEndpointOutputSchemas['account.createAccountImage'],
	},
	'account.getAccountSettingsImagesById': {
		input:
			ShipEngineEndpointInputSchemas['account.getAccountSettingsImagesById'],
		output:
			ShipEngineEndpointOutputSchemas['account.getAccountSettingsImagesById'],
	},
	'account.updateAccountSettingsImagesById': {
		input:
			ShipEngineEndpointInputSchemas['account.updateAccountSettingsImagesById'],
		output:
			ShipEngineEndpointOutputSchemas[
				'account.updateAccountSettingsImagesById'
			],
	},
	'account.deleteAccountImageById': {
		input: ShipEngineEndpointInputSchemas['account.deleteAccountImageById'],
		output: ShipEngineEndpointOutputSchemas['account.deleteAccountImageById'],
	},
	'addresses.parseAddress': {
		input: ShipEngineEndpointInputSchemas['addresses.parseAddress'],
		output: ShipEngineEndpointOutputSchemas['addresses.parseAddress'],
	},
	'addresses.validateAddress': {
		input: ShipEngineEndpointInputSchemas['addresses.validateAddress'],
		output: ShipEngineEndpointOutputSchemas['addresses.validateAddress'],
	},
	'batches.listBatches': {
		input: ShipEngineEndpointInputSchemas['batches.listBatches'],
		output: ShipEngineEndpointOutputSchemas['batches.listBatches'],
	},
	'batches.createBatch': {
		input: ShipEngineEndpointInputSchemas['batches.createBatch'],
		output: ShipEngineEndpointOutputSchemas['batches.createBatch'],
	},
	'batches.getBatchByExternalId': {
		input: ShipEngineEndpointInputSchemas['batches.getBatchByExternalId'],
		output: ShipEngineEndpointOutputSchemas['batches.getBatchByExternalId'],
	},
	'batches.deleteBatch': {
		input: ShipEngineEndpointInputSchemas['batches.deleteBatch'],
		output: ShipEngineEndpointOutputSchemas['batches.deleteBatch'],
	},
	'batches.getBatchById': {
		input: ShipEngineEndpointInputSchemas['batches.getBatchById'],
		output: ShipEngineEndpointOutputSchemas['batches.getBatchById'],
	},
	'batches.updateBatch': {
		input: ShipEngineEndpointInputSchemas['batches.updateBatch'],
		output: ShipEngineEndpointOutputSchemas['batches.updateBatch'],
	},
	'batches.addToBatch': {
		input: ShipEngineEndpointInputSchemas['batches.addToBatch'],
		output: ShipEngineEndpointOutputSchemas['batches.addToBatch'],
	},
	'batches.listBatchErrors': {
		input: ShipEngineEndpointInputSchemas['batches.listBatchErrors'],
		output: ShipEngineEndpointOutputSchemas['batches.listBatchErrors'],
	},
	'batches.processBatch': {
		input: ShipEngineEndpointInputSchemas['batches.processBatch'],
		output: ShipEngineEndpointOutputSchemas['batches.processBatch'],
	},
	'batches.removeFromBatch': {
		input: ShipEngineEndpointInputSchemas['batches.removeFromBatch'],
		output: ShipEngineEndpointOutputSchemas['batches.removeFromBatch'],
	},
	'carriers.listCarriers': {
		input: ShipEngineEndpointInputSchemas['carriers.listCarriers'],
		output: ShipEngineEndpointOutputSchemas['carriers.listCarriers'],
	},
	'carriers.getCarrierById': {
		input: ShipEngineEndpointInputSchemas['carriers.getCarrierById'],
		output: ShipEngineEndpointOutputSchemas['carriers.getCarrierById'],
	},
	'carriers.disconnectCarrierById': {
		input: ShipEngineEndpointInputSchemas['carriers.disconnectCarrierById'],
		output: ShipEngineEndpointOutputSchemas['carriers.disconnectCarrierById'],
	},
	'carriers.addFundsToCarrier': {
		input: ShipEngineEndpointInputSchemas['carriers.addFundsToCarrier'],
		output: ShipEngineEndpointOutputSchemas['carriers.addFundsToCarrier'],
	},
	'carriers.getCarrierOptions': {
		input: ShipEngineEndpointInputSchemas['carriers.getCarrierOptions'],
		output: ShipEngineEndpointOutputSchemas['carriers.getCarrierOptions'],
	},
	'carriers.listCarrierPackageTypes': {
		input: ShipEngineEndpointInputSchemas['carriers.listCarrierPackageTypes'],
		output: ShipEngineEndpointOutputSchemas['carriers.listCarrierPackageTypes'],
	},
	'carriers.listCarrierServices': {
		input: ShipEngineEndpointInputSchemas['carriers.listCarrierServices'],
		output: ShipEngineEndpointOutputSchemas['carriers.listCarrierServices'],
	},
	'carrierAccounts.connectCarrier': {
		input: ShipEngineEndpointInputSchemas['carrierAccounts.connectCarrier'],
		output: ShipEngineEndpointOutputSchemas['carrierAccounts.connectCarrier'],
	},
	'carrierAccounts.disconnectCarrier': {
		input: ShipEngineEndpointInputSchemas['carrierAccounts.disconnectCarrier'],
		output:
			ShipEngineEndpointOutputSchemas['carrierAccounts.disconnectCarrier'],
	},
	'carrierAccounts.getCarrierSettings': {
		input: ShipEngineEndpointInputSchemas['carrierAccounts.getCarrierSettings'],
		output:
			ShipEngineEndpointOutputSchemas['carrierAccounts.getCarrierSettings'],
	},
	'carrierAccounts.updateCarrierSettings': {
		input:
			ShipEngineEndpointInputSchemas['carrierAccounts.updateCarrierSettings'],
		output:
			ShipEngineEndpointOutputSchemas['carrierAccounts.updateCarrierSettings'],
	},
	'insurance.disconnectInsurer': {
		input: ShipEngineEndpointInputSchemas['insurance.disconnectInsurer'],
		output: ShipEngineEndpointOutputSchemas['insurance.disconnectInsurer'],
	},
	'insurance.connectInsurer': {
		input: ShipEngineEndpointInputSchemas['insurance.connectInsurer'],
		output: ShipEngineEndpointOutputSchemas['insurance.connectInsurer'],
	},
	'labels.createCombinedLabelDocument': {
		input: ShipEngineEndpointInputSchemas['labels.createCombinedLabelDocument'],
		output:
			ShipEngineEndpointOutputSchemas['labels.createCombinedLabelDocument'],
	},
	'downloads.downloadFile': {
		input: ShipEngineEndpointInputSchemas['downloads.downloadFile'],
		output: ShipEngineEndpointOutputSchemas['downloads.downloadFile'],
	},
	'insurance.addFundsToInsurance': {
		input: ShipEngineEndpointInputSchemas['insurance.addFundsToInsurance'],
		output: ShipEngineEndpointOutputSchemas['insurance.addFundsToInsurance'],
	},
	'insurance.getInsuranceBalance': {
		input: ShipEngineEndpointInputSchemas['insurance.getInsuranceBalance'],
		output: ShipEngineEndpointOutputSchemas['insurance.getInsuranceBalance'],
	},
	'labels.listLabels': {
		input: ShipEngineEndpointInputSchemas['labels.listLabels'],
		output: ShipEngineEndpointOutputSchemas['labels.listLabels'],
	},
	'labels.createLabel': {
		input: ShipEngineEndpointInputSchemas['labels.createLabel'],
		output: ShipEngineEndpointOutputSchemas['labels.createLabel'],
	},
	'labels.getLabelByExternalShipmentId': {
		input:
			ShipEngineEndpointInputSchemas['labels.getLabelByExternalShipmentId'],
		output:
			ShipEngineEndpointOutputSchemas['labels.getLabelByExternalShipmentId'],
	},
	'labels.createLabelFromRate': {
		input: ShipEngineEndpointInputSchemas['labels.createLabelFromRate'],
		output: ShipEngineEndpointOutputSchemas['labels.createLabelFromRate'],
	},
	'labels.createLabelFromRateShopper': {
		input: ShipEngineEndpointInputSchemas['labels.createLabelFromRateShopper'],
		output:
			ShipEngineEndpointOutputSchemas['labels.createLabelFromRateShopper'],
	},
	'labels.createLabelFromShipment': {
		input: ShipEngineEndpointInputSchemas['labels.createLabelFromShipment'],
		output: ShipEngineEndpointOutputSchemas['labels.createLabelFromShipment'],
	},
	'labels.getLabelById': {
		input: ShipEngineEndpointInputSchemas['labels.getLabelById'],
		output: ShipEngineEndpointOutputSchemas['labels.getLabelById'],
	},
	'labels.createReturnLabel': {
		input: ShipEngineEndpointInputSchemas['labels.createReturnLabel'],
		output: ShipEngineEndpointOutputSchemas['labels.createReturnLabel'],
	},
	'labels.getTrackingLogFromLabel': {
		input: ShipEngineEndpointInputSchemas['labels.getTrackingLogFromLabel'],
		output: ShipEngineEndpointOutputSchemas['labels.getTrackingLogFromLabel'],
	},
	'labels.voidLabel': {
		input: ShipEngineEndpointInputSchemas['labels.voidLabel'],
		output: ShipEngineEndpointOutputSchemas['labels.voidLabel'],
	},
	'labels.cancelLabelRefund': {
		input: ShipEngineEndpointInputSchemas['labels.cancelLabelRefund'],
		output: ShipEngineEndpointOutputSchemas['labels.cancelLabelRefund'],
	},
	'manifests.listManifests': {
		input: ShipEngineEndpointInputSchemas['manifests.listManifests'],
		output: ShipEngineEndpointOutputSchemas['manifests.listManifests'],
	},
	'manifests.createManifest': {
		input: ShipEngineEndpointInputSchemas['manifests.createManifest'],
		output: ShipEngineEndpointOutputSchemas['manifests.createManifest'],
	},
	'manifests.getManifestById': {
		input: ShipEngineEndpointInputSchemas['manifests.getManifestById'],
		output: ShipEngineEndpointOutputSchemas['manifests.getManifestById'],
	},
	'manifests.getManifestRequestById': {
		input: ShipEngineEndpointInputSchemas['manifests.getManifestRequestById'],
		output: ShipEngineEndpointOutputSchemas['manifests.getManifestRequestById'],
	},
	'packageTypes.listPackageTypes': {
		input: ShipEngineEndpointInputSchemas['packageTypes.listPackageTypes'],
		output: ShipEngineEndpointOutputSchemas['packageTypes.listPackageTypes'],
	},
	'packageTypes.createPackageType': {
		input: ShipEngineEndpointInputSchemas['packageTypes.createPackageType'],
		output: ShipEngineEndpointOutputSchemas['packageTypes.createPackageType'],
	},
	'packageTypes.getPackageTypeById': {
		input: ShipEngineEndpointInputSchemas['packageTypes.getPackageTypeById'],
		output: ShipEngineEndpointOutputSchemas['packageTypes.getPackageTypeById'],
	},
	'packageTypes.updatePackageType': {
		input: ShipEngineEndpointInputSchemas['packageTypes.updatePackageType'],
		output: ShipEngineEndpointOutputSchemas['packageTypes.updatePackageType'],
	},
	'packageTypes.deletePackageType': {
		input: ShipEngineEndpointInputSchemas['packageTypes.deletePackageType'],
		output: ShipEngineEndpointOutputSchemas['packageTypes.deletePackageType'],
	},
	'packagePickups.listScheduledPickups': {
		input:
			ShipEngineEndpointInputSchemas['packagePickups.listScheduledPickups'],
		output:
			ShipEngineEndpointOutputSchemas['packagePickups.listScheduledPickups'],
	},
	'packagePickups.schedulePickup': {
		input: ShipEngineEndpointInputSchemas['packagePickups.schedulePickup'],
		output: ShipEngineEndpointOutputSchemas['packagePickups.schedulePickup'],
	},
	'packagePickups.getPickupById': {
		input: ShipEngineEndpointInputSchemas['packagePickups.getPickupById'],
		output: ShipEngineEndpointOutputSchemas['packagePickups.getPickupById'],
	},
	'packagePickups.deleteScheduledPickup': {
		input:
			ShipEngineEndpointInputSchemas['packagePickups.deleteScheduledPickup'],
		output:
			ShipEngineEndpointOutputSchemas['packagePickups.deleteScheduledPickup'],
	},
	'rates.calculateRates': {
		input: ShipEngineEndpointInputSchemas['rates.calculateRates'],
		output: ShipEngineEndpointOutputSchemas['rates.calculateRates'],
	},
	'rates.compareBulkRates': {
		input: ShipEngineEndpointInputSchemas['rates.compareBulkRates'],
		output: ShipEngineEndpointOutputSchemas['rates.compareBulkRates'],
	},
	'rates.estimateRates': {
		input: ShipEngineEndpointInputSchemas['rates.estimateRates'],
		output: ShipEngineEndpointOutputSchemas['rates.estimateRates'],
	},
	'rates.getRateById': {
		input: ShipEngineEndpointInputSchemas['rates.getRateById'],
		output: ShipEngineEndpointOutputSchemas['rates.getRateById'],
	},
	'servicePoints.servicePointsList': {
		input: ShipEngineEndpointInputSchemas['servicePoints.servicePointsList'],
		output: ShipEngineEndpointOutputSchemas['servicePoints.servicePointsList'],
	},
	'servicePoints.servicePointsGetById': {
		input: ShipEngineEndpointInputSchemas['servicePoints.servicePointsGetById'],
		output:
			ShipEngineEndpointOutputSchemas['servicePoints.servicePointsGetById'],
	},
	'shipments.listShipments': {
		input: ShipEngineEndpointInputSchemas['shipments.listShipments'],
		output: ShipEngineEndpointOutputSchemas['shipments.listShipments'],
	},
	'shipments.createShipments': {
		input: ShipEngineEndpointInputSchemas['shipments.createShipments'],
		output: ShipEngineEndpointOutputSchemas['shipments.createShipments'],
	},
	'shipments.getShipmentByExternalId': {
		input: ShipEngineEndpointInputSchemas['shipments.getShipmentByExternalId'],
		output:
			ShipEngineEndpointOutputSchemas['shipments.getShipmentByExternalId'],
	},
	'shipments.parseShipment': {
		input: ShipEngineEndpointInputSchemas['shipments.parseShipment'],
		output: ShipEngineEndpointOutputSchemas['shipments.parseShipment'],
	},
	'shipments.getShipmentById': {
		input: ShipEngineEndpointInputSchemas['shipments.getShipmentById'],
		output: ShipEngineEndpointOutputSchemas['shipments.getShipmentById'],
	},
	'shipments.updateShipment': {
		input: ShipEngineEndpointInputSchemas['shipments.updateShipment'],
		output: ShipEngineEndpointOutputSchemas['shipments.updateShipment'],
	},
	'shipments.cancelShipments': {
		input: ShipEngineEndpointInputSchemas['shipments.cancelShipments'],
		output: ShipEngineEndpointOutputSchemas['shipments.cancelShipments'],
	},
	'shipments.listShipmentRates': {
		input: ShipEngineEndpointInputSchemas['shipments.listShipmentRates'],
		output: ShipEngineEndpointOutputSchemas['shipments.listShipmentRates'],
	},
	'shipments.shipmentsUpdateTags': {
		input: ShipEngineEndpointInputSchemas['shipments.shipmentsUpdateTags'],
		output: ShipEngineEndpointOutputSchemas['shipments.shipmentsUpdateTags'],
	},
	'shipments.shipmentsListTags': {
		input: ShipEngineEndpointInputSchemas['shipments.shipmentsListTags'],
		output: ShipEngineEndpointOutputSchemas['shipments.shipmentsListTags'],
	},
	'shipments.tagShipment': {
		input: ShipEngineEndpointInputSchemas['shipments.tagShipment'],
		output: ShipEngineEndpointOutputSchemas['shipments.tagShipment'],
	},
	'shipments.untagShipment': {
		input: ShipEngineEndpointInputSchemas['shipments.untagShipment'],
		output: ShipEngineEndpointOutputSchemas['shipments.untagShipment'],
	},
	'tags.listTags': {
		input: ShipEngineEndpointInputSchemas['tags.listTags'],
		output: ShipEngineEndpointOutputSchemas['tags.listTags'],
	},
	'tags.createTag': {
		input: ShipEngineEndpointInputSchemas['tags.createTag'],
		output: ShipEngineEndpointOutputSchemas['tags.createTag'],
	},
	'tags.createTagByName': {
		input: ShipEngineEndpointInputSchemas['tags.createTagByName'],
		output: ShipEngineEndpointOutputSchemas['tags.createTagByName'],
	},
	'tags.deleteTag': {
		input: ShipEngineEndpointInputSchemas['tags.deleteTag'],
		output: ShipEngineEndpointOutputSchemas['tags.deleteTag'],
	},
	'tags.renameTag': {
		input: ShipEngineEndpointInputSchemas['tags.renameTag'],
		output: ShipEngineEndpointOutputSchemas['tags.renameTag'],
	},
	'tokens.tokensGetEphemeralToken': {
		input: ShipEngineEndpointInputSchemas['tokens.tokensGetEphemeralToken'],
		output: ShipEngineEndpointOutputSchemas['tokens.tokensGetEphemeralToken'],
	},
	'tracking.getTrackingLog': {
		input: ShipEngineEndpointInputSchemas['tracking.getTrackingLog'],
		output: ShipEngineEndpointOutputSchemas['tracking.getTrackingLog'],
	},
	'tracking.startTracking': {
		input: ShipEngineEndpointInputSchemas['tracking.startTracking'],
		output: ShipEngineEndpointOutputSchemas['tracking.startTracking'],
	},
	'tracking.stopTracking': {
		input: ShipEngineEndpointInputSchemas['tracking.stopTracking'],
		output: ShipEngineEndpointOutputSchemas['tracking.stopTracking'],
	},
	'warehouses.listWarehouses': {
		input: ShipEngineEndpointInputSchemas['warehouses.listWarehouses'],
		output: ShipEngineEndpointOutputSchemas['warehouses.listWarehouses'],
	},
	'warehouses.createWarehouse': {
		input: ShipEngineEndpointInputSchemas['warehouses.createWarehouse'],
		output: ShipEngineEndpointOutputSchemas['warehouses.createWarehouse'],
	},
	'warehouses.getWarehouseById': {
		input: ShipEngineEndpointInputSchemas['warehouses.getWarehouseById'],
		output: ShipEngineEndpointOutputSchemas['warehouses.getWarehouseById'],
	},
	'warehouses.updateWarehouse': {
		input: ShipEngineEndpointInputSchemas['warehouses.updateWarehouse'],
		output: ShipEngineEndpointOutputSchemas['warehouses.updateWarehouse'],
	},
	'warehouses.deleteWarehouse': {
		input: ShipEngineEndpointInputSchemas['warehouses.deleteWarehouse'],
		output: ShipEngineEndpointOutputSchemas['warehouses.deleteWarehouse'],
	},
	'warehouses.updateWarehouseSettings': {
		input: ShipEngineEndpointInputSchemas['warehouses.updateWarehouseSettings'],
		output:
			ShipEngineEndpointOutputSchemas['warehouses.updateWarehouseSettings'],
	},
} as const satisfies RequiredPluginEndpointSchemas<ShipEngineNestedEndpoints>;

export const shipEngineEndpointMeta = {
	'account.listAccountSettings': {
		riskLevel: SHIPENGINE_OPERATIONS['account.listAccountSettings'].risk,
		description: SHIPENGINE_OPERATIONS['account.listAccountSettings'].summary,
	},
	'account.listAccountImages': {
		riskLevel: SHIPENGINE_OPERATIONS['account.listAccountImages'].risk,
		description: SHIPENGINE_OPERATIONS['account.listAccountImages'].summary,
	},
	'account.createAccountImage': {
		riskLevel: SHIPENGINE_OPERATIONS['account.createAccountImage'].risk,
		description: SHIPENGINE_OPERATIONS['account.createAccountImage'].summary,
	},
	'account.getAccountSettingsImagesById': {
		riskLevel:
			SHIPENGINE_OPERATIONS['account.getAccountSettingsImagesById'].risk,
		description:
			SHIPENGINE_OPERATIONS['account.getAccountSettingsImagesById'].summary,
	},
	'account.updateAccountSettingsImagesById': {
		riskLevel:
			SHIPENGINE_OPERATIONS['account.updateAccountSettingsImagesById'].risk,
		description:
			SHIPENGINE_OPERATIONS['account.updateAccountSettingsImagesById'].summary,
	},
	'account.deleteAccountImageById': {
		riskLevel: SHIPENGINE_OPERATIONS['account.deleteAccountImageById'].risk,
		description:
			SHIPENGINE_OPERATIONS['account.deleteAccountImageById'].summary,
	},
	'addresses.parseAddress': {
		riskLevel: SHIPENGINE_OPERATIONS['addresses.parseAddress'].risk,
		description: SHIPENGINE_OPERATIONS['addresses.parseAddress'].summary,
	},
	'addresses.validateAddress': {
		riskLevel: SHIPENGINE_OPERATIONS['addresses.validateAddress'].risk,
		description: SHIPENGINE_OPERATIONS['addresses.validateAddress'].summary,
	},
	'batches.listBatches': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.listBatches'].risk,
		description: SHIPENGINE_OPERATIONS['batches.listBatches'].summary,
	},
	'batches.createBatch': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.createBatch'].risk,
		description: SHIPENGINE_OPERATIONS['batches.createBatch'].summary,
	},
	'batches.getBatchByExternalId': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.getBatchByExternalId'].risk,
		description: SHIPENGINE_OPERATIONS['batches.getBatchByExternalId'].summary,
	},
	'batches.deleteBatch': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.deleteBatch'].risk,
		description: SHIPENGINE_OPERATIONS['batches.deleteBatch'].summary,
	},
	'batches.getBatchById': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.getBatchById'].risk,
		description: SHIPENGINE_OPERATIONS['batches.getBatchById'].summary,
	},
	'batches.updateBatch': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.updateBatch'].risk,
		description: SHIPENGINE_OPERATIONS['batches.updateBatch'].summary,
	},
	'batches.addToBatch': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.addToBatch'].risk,
		description: SHIPENGINE_OPERATIONS['batches.addToBatch'].summary,
	},
	'batches.listBatchErrors': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.listBatchErrors'].risk,
		description: SHIPENGINE_OPERATIONS['batches.listBatchErrors'].summary,
	},
	'batches.processBatch': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.processBatch'].risk,
		description: SHIPENGINE_OPERATIONS['batches.processBatch'].summary,
	},
	'batches.removeFromBatch': {
		riskLevel: SHIPENGINE_OPERATIONS['batches.removeFromBatch'].risk,
		description: SHIPENGINE_OPERATIONS['batches.removeFromBatch'].summary,
	},
	'carriers.listCarriers': {
		riskLevel: SHIPENGINE_OPERATIONS['carriers.listCarriers'].risk,
		description: SHIPENGINE_OPERATIONS['carriers.listCarriers'].summary,
	},
	'carriers.getCarrierById': {
		riskLevel: SHIPENGINE_OPERATIONS['carriers.getCarrierById'].risk,
		description: SHIPENGINE_OPERATIONS['carriers.getCarrierById'].summary,
	},
	'carriers.disconnectCarrierById': {
		riskLevel: SHIPENGINE_OPERATIONS['carriers.disconnectCarrierById'].risk,
		description:
			SHIPENGINE_OPERATIONS['carriers.disconnectCarrierById'].summary,
	},
	'carriers.addFundsToCarrier': {
		riskLevel: SHIPENGINE_OPERATIONS['carriers.addFundsToCarrier'].risk,
		description: SHIPENGINE_OPERATIONS['carriers.addFundsToCarrier'].summary,
	},
	'carriers.getCarrierOptions': {
		riskLevel: SHIPENGINE_OPERATIONS['carriers.getCarrierOptions'].risk,
		description: SHIPENGINE_OPERATIONS['carriers.getCarrierOptions'].summary,
	},
	'carriers.listCarrierPackageTypes': {
		riskLevel: SHIPENGINE_OPERATIONS['carriers.listCarrierPackageTypes'].risk,
		description:
			SHIPENGINE_OPERATIONS['carriers.listCarrierPackageTypes'].summary,
	},
	'carriers.listCarrierServices': {
		riskLevel: SHIPENGINE_OPERATIONS['carriers.listCarrierServices'].risk,
		description: SHIPENGINE_OPERATIONS['carriers.listCarrierServices'].summary,
	},
	'carrierAccounts.connectCarrier': {
		riskLevel: SHIPENGINE_OPERATIONS['carrierAccounts.connectCarrier'].risk,
		description:
			SHIPENGINE_OPERATIONS['carrierAccounts.connectCarrier'].summary,
	},
	'carrierAccounts.disconnectCarrier': {
		riskLevel: SHIPENGINE_OPERATIONS['carrierAccounts.disconnectCarrier'].risk,
		description:
			SHIPENGINE_OPERATIONS['carrierAccounts.disconnectCarrier'].summary,
	},
	'carrierAccounts.getCarrierSettings': {
		riskLevel: SHIPENGINE_OPERATIONS['carrierAccounts.getCarrierSettings'].risk,
		description:
			SHIPENGINE_OPERATIONS['carrierAccounts.getCarrierSettings'].summary,
	},
	'carrierAccounts.updateCarrierSettings': {
		riskLevel:
			SHIPENGINE_OPERATIONS['carrierAccounts.updateCarrierSettings'].risk,
		description:
			SHIPENGINE_OPERATIONS['carrierAccounts.updateCarrierSettings'].summary,
	},
	'insurance.disconnectInsurer': {
		riskLevel: SHIPENGINE_OPERATIONS['insurance.disconnectInsurer'].risk,
		description: SHIPENGINE_OPERATIONS['insurance.disconnectInsurer'].summary,
	},
	'insurance.connectInsurer': {
		riskLevel: SHIPENGINE_OPERATIONS['insurance.connectInsurer'].risk,
		description: SHIPENGINE_OPERATIONS['insurance.connectInsurer'].summary,
	},
	'labels.createCombinedLabelDocument': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.createCombinedLabelDocument'].risk,
		description:
			SHIPENGINE_OPERATIONS['labels.createCombinedLabelDocument'].summary,
	},
	'downloads.downloadFile': {
		riskLevel: SHIPENGINE_OPERATIONS['downloads.downloadFile'].risk,
		description: SHIPENGINE_OPERATIONS['downloads.downloadFile'].summary,
	},
	'insurance.addFundsToInsurance': {
		riskLevel: SHIPENGINE_OPERATIONS['insurance.addFundsToInsurance'].risk,
		description: SHIPENGINE_OPERATIONS['insurance.addFundsToInsurance'].summary,
	},
	'insurance.getInsuranceBalance': {
		riskLevel: SHIPENGINE_OPERATIONS['insurance.getInsuranceBalance'].risk,
		description: SHIPENGINE_OPERATIONS['insurance.getInsuranceBalance'].summary,
	},
	'labels.listLabels': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.listLabels'].risk,
		description: SHIPENGINE_OPERATIONS['labels.listLabels'].summary,
	},
	'labels.createLabel': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.createLabel'].risk,
		description: SHIPENGINE_OPERATIONS['labels.createLabel'].summary,
	},
	'labels.getLabelByExternalShipmentId': {
		riskLevel:
			SHIPENGINE_OPERATIONS['labels.getLabelByExternalShipmentId'].risk,
		description:
			SHIPENGINE_OPERATIONS['labels.getLabelByExternalShipmentId'].summary,
	},
	'labels.createLabelFromRate': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.createLabelFromRate'].risk,
		description: SHIPENGINE_OPERATIONS['labels.createLabelFromRate'].summary,
	},
	'labels.createLabelFromRateShopper': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.createLabelFromRateShopper'].risk,
		description:
			SHIPENGINE_OPERATIONS['labels.createLabelFromRateShopper'].summary,
	},
	'labels.createLabelFromShipment': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.createLabelFromShipment'].risk,
		description:
			SHIPENGINE_OPERATIONS['labels.createLabelFromShipment'].summary,
	},
	'labels.getLabelById': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.getLabelById'].risk,
		description: SHIPENGINE_OPERATIONS['labels.getLabelById'].summary,
	},
	'labels.createReturnLabel': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.createReturnLabel'].risk,
		description: SHIPENGINE_OPERATIONS['labels.createReturnLabel'].summary,
	},
	'labels.getTrackingLogFromLabel': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.getTrackingLogFromLabel'].risk,
		description:
			SHIPENGINE_OPERATIONS['labels.getTrackingLogFromLabel'].summary,
	},
	'labels.voidLabel': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.voidLabel'].risk,
		description: SHIPENGINE_OPERATIONS['labels.voidLabel'].summary,
	},
	'labels.cancelLabelRefund': {
		riskLevel: SHIPENGINE_OPERATIONS['labels.cancelLabelRefund'].risk,
		description: SHIPENGINE_OPERATIONS['labels.cancelLabelRefund'].summary,
	},
	'manifests.listManifests': {
		riskLevel: SHIPENGINE_OPERATIONS['manifests.listManifests'].risk,
		description: SHIPENGINE_OPERATIONS['manifests.listManifests'].summary,
	},
	'manifests.createManifest': {
		riskLevel: SHIPENGINE_OPERATIONS['manifests.createManifest'].risk,
		description: SHIPENGINE_OPERATIONS['manifests.createManifest'].summary,
	},
	'manifests.getManifestById': {
		riskLevel: SHIPENGINE_OPERATIONS['manifests.getManifestById'].risk,
		description: SHIPENGINE_OPERATIONS['manifests.getManifestById'].summary,
	},
	'manifests.getManifestRequestById': {
		riskLevel: SHIPENGINE_OPERATIONS['manifests.getManifestRequestById'].risk,
		description:
			SHIPENGINE_OPERATIONS['manifests.getManifestRequestById'].summary,
	},
	'packageTypes.listPackageTypes': {
		riskLevel: SHIPENGINE_OPERATIONS['packageTypes.listPackageTypes'].risk,
		description: SHIPENGINE_OPERATIONS['packageTypes.listPackageTypes'].summary,
	},
	'packageTypes.createPackageType': {
		riskLevel: SHIPENGINE_OPERATIONS['packageTypes.createPackageType'].risk,
		description:
			SHIPENGINE_OPERATIONS['packageTypes.createPackageType'].summary,
	},
	'packageTypes.getPackageTypeById': {
		riskLevel: SHIPENGINE_OPERATIONS['packageTypes.getPackageTypeById'].risk,
		description:
			SHIPENGINE_OPERATIONS['packageTypes.getPackageTypeById'].summary,
	},
	'packageTypes.updatePackageType': {
		riskLevel: SHIPENGINE_OPERATIONS['packageTypes.updatePackageType'].risk,
		description:
			SHIPENGINE_OPERATIONS['packageTypes.updatePackageType'].summary,
	},
	'packageTypes.deletePackageType': {
		riskLevel: SHIPENGINE_OPERATIONS['packageTypes.deletePackageType'].risk,
		description:
			SHIPENGINE_OPERATIONS['packageTypes.deletePackageType'].summary,
	},
	'packagePickups.listScheduledPickups': {
		riskLevel:
			SHIPENGINE_OPERATIONS['packagePickups.listScheduledPickups'].risk,
		description:
			SHIPENGINE_OPERATIONS['packagePickups.listScheduledPickups'].summary,
	},
	'packagePickups.schedulePickup': {
		riskLevel: SHIPENGINE_OPERATIONS['packagePickups.schedulePickup'].risk,
		description: SHIPENGINE_OPERATIONS['packagePickups.schedulePickup'].summary,
	},
	'packagePickups.getPickupById': {
		riskLevel: SHIPENGINE_OPERATIONS['packagePickups.getPickupById'].risk,
		description: SHIPENGINE_OPERATIONS['packagePickups.getPickupById'].summary,
	},
	'packagePickups.deleteScheduledPickup': {
		riskLevel:
			SHIPENGINE_OPERATIONS['packagePickups.deleteScheduledPickup'].risk,
		description:
			SHIPENGINE_OPERATIONS['packagePickups.deleteScheduledPickup'].summary,
	},
	'rates.calculateRates': {
		riskLevel: SHIPENGINE_OPERATIONS['rates.calculateRates'].risk,
		description: SHIPENGINE_OPERATIONS['rates.calculateRates'].summary,
	},
	'rates.compareBulkRates': {
		riskLevel: SHIPENGINE_OPERATIONS['rates.compareBulkRates'].risk,
		description: SHIPENGINE_OPERATIONS['rates.compareBulkRates'].summary,
	},
	'rates.estimateRates': {
		riskLevel: SHIPENGINE_OPERATIONS['rates.estimateRates'].risk,
		description: SHIPENGINE_OPERATIONS['rates.estimateRates'].summary,
	},
	'rates.getRateById': {
		riskLevel: SHIPENGINE_OPERATIONS['rates.getRateById'].risk,
		description: SHIPENGINE_OPERATIONS['rates.getRateById'].summary,
	},
	'servicePoints.servicePointsList': {
		riskLevel: SHIPENGINE_OPERATIONS['servicePoints.servicePointsList'].risk,
		description:
			SHIPENGINE_OPERATIONS['servicePoints.servicePointsList'].summary,
	},
	'servicePoints.servicePointsGetById': {
		riskLevel: SHIPENGINE_OPERATIONS['servicePoints.servicePointsGetById'].risk,
		description:
			SHIPENGINE_OPERATIONS['servicePoints.servicePointsGetById'].summary,
	},
	'shipments.listShipments': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.listShipments'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.listShipments'].summary,
	},
	'shipments.createShipments': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.createShipments'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.createShipments'].summary,
	},
	'shipments.getShipmentByExternalId': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.getShipmentByExternalId'].risk,
		description:
			SHIPENGINE_OPERATIONS['shipments.getShipmentByExternalId'].summary,
	},
	'shipments.parseShipment': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.parseShipment'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.parseShipment'].summary,
	},
	'shipments.getShipmentById': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.getShipmentById'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.getShipmentById'].summary,
	},
	'shipments.updateShipment': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.updateShipment'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.updateShipment'].summary,
	},
	'shipments.cancelShipments': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.cancelShipments'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.cancelShipments'].summary,
	},
	'shipments.listShipmentRates': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.listShipmentRates'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.listShipmentRates'].summary,
	},
	'shipments.shipmentsUpdateTags': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.shipmentsUpdateTags'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.shipmentsUpdateTags'].summary,
	},
	'shipments.shipmentsListTags': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.shipmentsListTags'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.shipmentsListTags'].summary,
	},
	'shipments.tagShipment': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.tagShipment'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.tagShipment'].summary,
	},
	'shipments.untagShipment': {
		riskLevel: SHIPENGINE_OPERATIONS['shipments.untagShipment'].risk,
		description: SHIPENGINE_OPERATIONS['shipments.untagShipment'].summary,
	},
	'tags.listTags': {
		riskLevel: SHIPENGINE_OPERATIONS['tags.listTags'].risk,
		description: SHIPENGINE_OPERATIONS['tags.listTags'].summary,
	},
	'tags.createTag': {
		riskLevel: SHIPENGINE_OPERATIONS['tags.createTag'].risk,
		description: SHIPENGINE_OPERATIONS['tags.createTag'].summary,
	},
	'tags.createTagByName': {
		riskLevel: SHIPENGINE_OPERATIONS['tags.createTagByName'].risk,
		description:
			'Deprecated: create a tag by path name; use POST /v1/tags instead.',
	},
	'tags.deleteTag': {
		riskLevel: SHIPENGINE_OPERATIONS['tags.deleteTag'].risk,
		description: SHIPENGINE_OPERATIONS['tags.deleteTag'].summary,
	},
	'tags.renameTag': {
		riskLevel: SHIPENGINE_OPERATIONS['tags.renameTag'].risk,
		description: SHIPENGINE_OPERATIONS['tags.renameTag'].summary,
	},
	'tokens.tokensGetEphemeralToken': {
		riskLevel: SHIPENGINE_OPERATIONS['tokens.tokensGetEphemeralToken'].risk,
		description:
			SHIPENGINE_OPERATIONS['tokens.tokensGetEphemeralToken'].summary,
	},
	'tracking.getTrackingLog': {
		riskLevel: SHIPENGINE_OPERATIONS['tracking.getTrackingLog'].risk,
		description: SHIPENGINE_OPERATIONS['tracking.getTrackingLog'].summary,
	},
	'tracking.startTracking': {
		riskLevel: SHIPENGINE_OPERATIONS['tracking.startTracking'].risk,
		description: SHIPENGINE_OPERATIONS['tracking.startTracking'].summary,
	},
	'tracking.stopTracking': {
		riskLevel: SHIPENGINE_OPERATIONS['tracking.stopTracking'].risk,
		description: SHIPENGINE_OPERATIONS['tracking.stopTracking'].summary,
	},
	'warehouses.listWarehouses': {
		riskLevel: SHIPENGINE_OPERATIONS['warehouses.listWarehouses'].risk,
		description: SHIPENGINE_OPERATIONS['warehouses.listWarehouses'].summary,
	},
	'warehouses.createWarehouse': {
		riskLevel: SHIPENGINE_OPERATIONS['warehouses.createWarehouse'].risk,
		description: SHIPENGINE_OPERATIONS['warehouses.createWarehouse'].summary,
	},
	'warehouses.getWarehouseById': {
		riskLevel: SHIPENGINE_OPERATIONS['warehouses.getWarehouseById'].risk,
		description: SHIPENGINE_OPERATIONS['warehouses.getWarehouseById'].summary,
	},
	'warehouses.updateWarehouse': {
		riskLevel: SHIPENGINE_OPERATIONS['warehouses.updateWarehouse'].risk,
		description: SHIPENGINE_OPERATIONS['warehouses.updateWarehouse'].summary,
	},
	'warehouses.deleteWarehouse': {
		riskLevel: SHIPENGINE_OPERATIONS['warehouses.deleteWarehouse'].risk,
		description: SHIPENGINE_OPERATIONS['warehouses.deleteWarehouse'].summary,
	},
	'warehouses.updateWarehouseSettings': {
		riskLevel: SHIPENGINE_OPERATIONS['warehouses.updateWarehouseSettings'].risk,
		description:
			SHIPENGINE_OPERATIONS['warehouses.updateWarehouseSettings'].summary,
	},
} as const satisfies RequiredPluginEndpointMeta<ShipEngineNestedEndpoints>;

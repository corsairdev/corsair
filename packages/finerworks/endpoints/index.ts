import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AccountEndpoints } from './account';
import { FramingEndpoints } from './framing';
import { GalleriesEndpoints } from './galleries';
import { ImagesEndpoints } from './images';
import { InventoryEndpoints } from './inventory';
import { OrdersEndpoints } from './orders';
import { ProductsEndpoints } from './products';
import { ShippingEndpoints } from './shipping';
import {
	FinerWorksEndpointInputSchemas,
	FinerWorksEndpointOutputSchemas,
} from './types';

export const finerworksEndpointsNested = {
	account: AccountEndpoints,
	images: ImagesEndpoints,
	galleries: GalleriesEndpoints,
	orders: OrdersEndpoints,
	products: ProductsEndpoints,
	framing: FramingEndpoints,
	shipping: ShippingEndpoints,
	inventory: InventoryEndpoints,
} as const;

export const finerworksEndpointMeta = {
	'account.getCompanyInfo': {
		riskLevel: 'read',
		description:
			"Get FinerWorks' site identifier, company address and business hours",
	},
	'account.getUser': {
		riskLevel: 'read',
		description:
			'Get the authenticated FinerWorks account profile, including billing and business addresses',
	},
	'account.updateUser': {
		riskLevel: 'write',
		description:
			'Update the FinerWorks account profile, including billing and payment information',
	},
	'account.updateAppDetails': {
		riskLevel: 'write',
		description:
			"Update the calling application's name, description and live mode",
	},
	'images.add': {
		riskLevel: 'write',
		description: 'Add up to five prepared images to a FinerWorks library',
	},
	'images.list': {
		riskLevel: 'read',
		description:
			'List image files uploaded to the FinerWorks account, with pagination',
	},
	'images.update': {
		riskLevel: 'write',
		description: 'Update image metadata by GUID',
	},
	'images.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete image files by GUID, along with any virtual inventory products assigned to them',
	},
	'images.listFileSelection': {
		riskLevel: 'read',
		description: 'List the image GUIDs grouped under a file-selection key',
	},
	'images.updateFileSelection': {
		riskLevel: 'write',
		description: 'Replace the image files held under a selection GUID',
	},
	'galleries.addOrUpdateCollection': {
		riskLevel: 'write',
		description:
			'Create a personal gallery collection, or update one by supplying its id',
	},
	'galleries.list': {
		riskLevel: 'read',
		description: 'List GeoGalleries.com galleries, with optional filtering',
	},
	'galleries.listThemes': {
		riskLevel: 'read',
		description: 'List the theme options available for gallery customisation',
	},
	'orders.submit': {
		riskLevel: 'write',
		description: 'Submit up to five new orders for production',
	},
	'orders.savePending': {
		riskLevel: 'write',
		description:
			'Save orders to temporary storage for review before submission',
	},
	'orders.deletePending': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove orders that were saved as pending',
	},
	'orders.fetchStatus': {
		riskLevel: 'read',
		description: 'Get production status and tracking information for orders',
	},
	'orders.listStatusDefinitions': {
		riskLevel: 'read',
		description: 'List every production status an order can have',
	},
	'orders.validateRecipientAddress': {
		riskLevel: 'read',
		description: 'Validate a recipient address before submitting an order',
	},
	'products.getPrices': {
		riskLevel: 'read',
		description: 'Get pricing for a set of FinerWorks product SKUs',
	},
	'products.listMediaTypes': {
		riskLevel: 'read',
		description:
			'List printing substrates (canvas, paper, vinyl) and their product information',
	},
	'products.listProductTypes': {
		riskLevel: 'read',
		description:
			'List printing categories such as Canvas Prints and Metal Prints',
	},
	'products.listStyleTypes': {
		riskLevel: 'read',
		description:
			'List print formatting options including borders and canvas wraps',
	},
	'framing.getFrameDetails': {
		riskLevel: 'read',
		description:
			'Get dimensions, pricing, materials and imagery for a specific frame',
	},
	'framing.listCollections': {
		riskLevel: 'read',
		description: 'List available frame collections and categories',
	},
	'framing.listGlazing': {
		riskLevel: 'read',
		description: 'List available glazing and glass options',
	},
	'framing.listMats': {
		riskLevel: 'read',
		description: 'List matting specifications, colours and pricing',
	},
	'shipping.getOptionIds': {
		riskLevel: 'read',
		description: 'List shipping method identifiers for cross-reference',
	},
	'shipping.listOptionsMultiple': {
		riskLevel: 'read',
		description: 'Get shipping options and rates for a batch of orders',
	},
	'inventory.list': {
		riskLevel: 'read',
		description:
			'List the virtual inventory products on the account, with pagination',
	},
	'inventory.update': {
		riskLevel: 'write',
		description:
			'Update virtual inventory pricing, stock and third-party integrations',
	},
	'inventory.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete virtual inventory products by SKU and disconnect their third-party sync',
	},
	'inventory.disconnect': {
		riskLevel: 'write',
		description:
			'Disconnect every virtual inventory item from a third-party platform',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof finerworksEndpointsNested
>;

export const finerworksEndpointSchemas = {
	'account.getCompanyInfo': {
		input: FinerWorksEndpointInputSchemas['account.getCompanyInfo'],
		output: FinerWorksEndpointOutputSchemas['account.getCompanyInfo'],
	},
	'account.getUser': {
		input: FinerWorksEndpointInputSchemas['account.getUser'],
		output: FinerWorksEndpointOutputSchemas['account.getUser'],
	},
	'account.updateUser': {
		input: FinerWorksEndpointInputSchemas['account.updateUser'],
		output: FinerWorksEndpointOutputSchemas['account.updateUser'],
	},
	'account.updateAppDetails': {
		input: FinerWorksEndpointInputSchemas['account.updateAppDetails'],
		output: FinerWorksEndpointOutputSchemas['account.updateAppDetails'],
	},
	'images.add': {
		input: FinerWorksEndpointInputSchemas['images.add'],
		output: FinerWorksEndpointOutputSchemas['images.add'],
	},
	'images.list': {
		input: FinerWorksEndpointInputSchemas['images.list'],
		output: FinerWorksEndpointOutputSchemas['images.list'],
	},
	'images.update': {
		input: FinerWorksEndpointInputSchemas['images.update'],
		output: FinerWorksEndpointOutputSchemas['images.update'],
	},
	'images.delete': {
		input: FinerWorksEndpointInputSchemas['images.delete'],
		output: FinerWorksEndpointOutputSchemas['images.delete'],
	},
	'images.listFileSelection': {
		input: FinerWorksEndpointInputSchemas['images.listFileSelection'],
		output: FinerWorksEndpointOutputSchemas['images.listFileSelection'],
	},
	'images.updateFileSelection': {
		input: FinerWorksEndpointInputSchemas['images.updateFileSelection'],
		output: FinerWorksEndpointOutputSchemas['images.updateFileSelection'],
	},
	'galleries.addOrUpdateCollection': {
		input: FinerWorksEndpointInputSchemas['galleries.addOrUpdateCollection'],
		output: FinerWorksEndpointOutputSchemas['galleries.addOrUpdateCollection'],
	},
	'galleries.list': {
		input: FinerWorksEndpointInputSchemas['galleries.list'],
		output: FinerWorksEndpointOutputSchemas['galleries.list'],
	},
	'galleries.listThemes': {
		input: FinerWorksEndpointInputSchemas['galleries.listThemes'],
		output: FinerWorksEndpointOutputSchemas['galleries.listThemes'],
	},
	'orders.submit': {
		input: FinerWorksEndpointInputSchemas['orders.submit'],
		output: FinerWorksEndpointOutputSchemas['orders.submit'],
	},
	'orders.savePending': {
		input: FinerWorksEndpointInputSchemas['orders.savePending'],
		output: FinerWorksEndpointOutputSchemas['orders.savePending'],
	},
	'orders.deletePending': {
		input: FinerWorksEndpointInputSchemas['orders.deletePending'],
		output: FinerWorksEndpointOutputSchemas['orders.deletePending'],
	},
	'orders.fetchStatus': {
		input: FinerWorksEndpointInputSchemas['orders.fetchStatus'],
		output: FinerWorksEndpointOutputSchemas['orders.fetchStatus'],
	},
	'orders.listStatusDefinitions': {
		input: FinerWorksEndpointInputSchemas['orders.listStatusDefinitions'],
		output: FinerWorksEndpointOutputSchemas['orders.listStatusDefinitions'],
	},
	'orders.validateRecipientAddress': {
		input: FinerWorksEndpointInputSchemas['orders.validateRecipientAddress'],
		output: FinerWorksEndpointOutputSchemas['orders.validateRecipientAddress'],
	},
	'products.getPrices': {
		input: FinerWorksEndpointInputSchemas['products.getPrices'],
		output: FinerWorksEndpointOutputSchemas['products.getPrices'],
	},
	'products.listMediaTypes': {
		input: FinerWorksEndpointInputSchemas['products.listMediaTypes'],
		output: FinerWorksEndpointOutputSchemas['products.listMediaTypes'],
	},
	'products.listProductTypes': {
		input: FinerWorksEndpointInputSchemas['products.listProductTypes'],
		output: FinerWorksEndpointOutputSchemas['products.listProductTypes'],
	},
	'products.listStyleTypes': {
		input: FinerWorksEndpointInputSchemas['products.listStyleTypes'],
		output: FinerWorksEndpointOutputSchemas['products.listStyleTypes'],
	},
	'framing.getFrameDetails': {
		input: FinerWorksEndpointInputSchemas['framing.getFrameDetails'],
		output: FinerWorksEndpointOutputSchemas['framing.getFrameDetails'],
	},
	'framing.listCollections': {
		input: FinerWorksEndpointInputSchemas['framing.listCollections'],
		output: FinerWorksEndpointOutputSchemas['framing.listCollections'],
	},
	'framing.listGlazing': {
		input: FinerWorksEndpointInputSchemas['framing.listGlazing'],
		output: FinerWorksEndpointOutputSchemas['framing.listGlazing'],
	},
	'framing.listMats': {
		input: FinerWorksEndpointInputSchemas['framing.listMats'],
		output: FinerWorksEndpointOutputSchemas['framing.listMats'],
	},
	'shipping.getOptionIds': {
		input: FinerWorksEndpointInputSchemas['shipping.getOptionIds'],
		output: FinerWorksEndpointOutputSchemas['shipping.getOptionIds'],
	},
	'shipping.listOptionsMultiple': {
		input: FinerWorksEndpointInputSchemas['shipping.listOptionsMultiple'],
		output: FinerWorksEndpointOutputSchemas['shipping.listOptionsMultiple'],
	},
	'inventory.list': {
		input: FinerWorksEndpointInputSchemas['inventory.list'],
		output: FinerWorksEndpointOutputSchemas['inventory.list'],
	},
	'inventory.update': {
		input: FinerWorksEndpointInputSchemas['inventory.update'],
		output: FinerWorksEndpointOutputSchemas['inventory.update'],
	},
	'inventory.delete': {
		input: FinerWorksEndpointInputSchemas['inventory.delete'],
		output: FinerWorksEndpointOutputSchemas['inventory.delete'],
	},
	'inventory.disconnect': {
		input: FinerWorksEndpointInputSchemas['inventory.disconnect'],
		output: FinerWorksEndpointOutputSchemas['inventory.disconnect'],
	},
} as const;

export { FinerWorksEndpointInputSchemas, FinerWorksEndpointOutputSchemas };
export * from './types';

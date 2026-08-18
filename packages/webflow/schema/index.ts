import {
	WebflowAsset,
	WebflowAssetFolder,
	WebflowCollection,
	WebflowCollectionItem,
	WebflowOrder,
	WebflowPage,
	WebflowSite,
	WebflowWebhook,
} from './database';

export const WebflowSchema = {
	version: '1.0.0',
	entities: {
		sites: WebflowSite,
		collections: WebflowCollection,
		collectionItems: WebflowCollectionItem,
		assets: WebflowAsset,
		assetFolders: WebflowAssetFolder,
		pages: WebflowPage,
		orders: WebflowOrder,
		webhooks: WebflowWebhook,
	},
} as const;

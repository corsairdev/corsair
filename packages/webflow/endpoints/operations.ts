import { assetsOperations } from '../operations/assets';
import { collectionFieldsOperations } from '../operations/collection-fields';
import { collectionItemsOperations } from '../operations/collection-items';
import { collectionsOperations } from '../operations/collections';
import { commentsOperations } from '../operations/comments';
import { componentsOperations } from '../operations/components';
import { ecommerceOperations } from '../operations/ecommerce';
import { formsOperations } from '../operations/forms';
import { pagesOperations } from '../operations/pages';
import { sitesOperations } from '../operations/sites';
import { tokenOperations } from '../operations/token';
import { webhooksOperations } from '../operations/webhooks';

export type { WebflowMethod, WebflowOperation } from './operation-types';

export const webflowOperations = [
	...assetsOperations,
	...collectionFieldsOperations,
	...collectionItemsOperations,
	...collectionsOperations,
	...commentsOperations,
	...componentsOperations,
	...ecommerceOperations,
	...formsOperations,
	...pagesOperations,
	...sitesOperations,
	...tokenOperations,
	...webhooksOperations,
] as const;

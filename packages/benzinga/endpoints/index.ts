import { listNewsChannels } from './channels';
import { listDividends } from './dividends';
import { listEarnings } from './earnings';
import { listEconomics } from './economics';
import { listGuidance } from './guidance';
import { listIpos } from './ipos';
import { getNews } from './news';
import { listRatings } from './ratings';
import { listSplits } from './splits';
import { testWebhookDelivery } from './webhook-test';

export { listNewsChannels } from './channels';
export { listDividends } from './dividends';
export { listEarnings } from './earnings';
export { listEconomics } from './economics';
export { listGuidance } from './guidance';
export { listIpos } from './ipos';
export { getNews } from './news';
export { listRatings } from './ratings';
export { listSplits } from './splits';
export * from './types';
export { testWebhookDelivery } from './webhook-test';

export const BenzingaEndpointFns = {
	getNews,
	listNewsChannels,
	listEarnings,
	listDividends,
	listRatings,
	listGuidance,
	listIpos,
	listSplits,
	listEconomics,
	testWebhookDelivery,
} as const;

import { listNewsChannels } from './channels';
import { listConferenceCalls } from './conference-calls';
import { getConsensusRatings } from './consensus-ratings';
import { listDividends } from './dividends';
import { listEarnings } from './earnings';
import { listEconomics } from './economics';
import { listGuidance } from './guidance';
import { listIpos } from './ipos';
import { getNews } from './news';
import { listRatings } from './ratings';
import { listRemovedCalendarEvents, listRemovedNews } from './removed';
import { listSplits } from './splits';
import { getEarningsStream, getNewsStream } from './streams';

export { listNewsChannels } from './channels';
export { listConferenceCalls } from './conference-calls';
export { getConsensusRatings } from './consensus-ratings';
export { listDividends } from './dividends';
export { listEarnings } from './earnings';
export { listEconomics } from './economics';
export { listGuidance } from './guidance';
export { listIpos } from './ipos';
export { getNews } from './news';
export { listRatings } from './ratings';
export { listRemovedCalendarEvents, listRemovedNews } from './removed';
export { listSplits } from './splits';
export { getEarningsStream, getNewsStream } from './streams';
export * from './types';

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
	listConferenceCalls,
	getConsensusRatings,
	listRemovedCalendarEvents,
	listRemovedNews,
	getEarningsStream,
	getNewsStream,
} as const;

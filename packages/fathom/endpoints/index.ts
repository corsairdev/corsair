export * as Account from './account';

import * as EventsModule from './events';
import * as MilestonesModule from './milestones';

export * as Reports from './reports';

import * as SitesModule from './sites';

export const Sites = {
	...SitesModule,
	delete: SitesModule.del,
};

export const Events = {
	...EventsModule,
	delete: EventsModule.del,
};

export const Milestones = {
	...MilestonesModule,
	delete: MilestonesModule.del,
};

import {
	AliasService,
	EventService,
	IdentityService,
	TrackService,
} from './services';

export const PostHog = {
	Alias: {
		create: AliasService.createAlias,
	},
	Events: {
		create: EventService.createEvent,
	},
	Identity: {
		create: IdentityService.createIdentity,
	},
	Track: {
		trackPage: TrackService.trackPage,
		trackScreen: TrackService.trackScreen,
	},
};


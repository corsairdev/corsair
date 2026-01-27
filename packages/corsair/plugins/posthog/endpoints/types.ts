export type CreateAliasResponse = number | {
	status?: number;
	message?: string;
};

export type CreateEventResponse = number | {
	status?: number;
	message?: string;
};

export type CreateIdentityResponse = number | {
	status?: number;
	message?: string;
};

export type TrackPageResponse = number | {
	status?: number;
	message?: string;
};

export type TrackScreenResponse = number | {
	status?: number;
	message?: string;
};

export type PostHogEndpointOutputs = {
	aliasCreate: CreateAliasResponse;
	eventCreate: CreateEventResponse;
	identityCreate: CreateIdentityResponse;
	trackPage: TrackPageResponse;
	trackScreen: TrackScreenResponse;
};

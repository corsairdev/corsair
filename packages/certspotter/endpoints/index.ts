import * as Issuances from './issuances';

export const IssuancesEndpoints = {
	list: Issuances.listIssuances,
};

export const FirehoseEndpoints = {
	list: Issuances.firehose,
};

export * from './types';

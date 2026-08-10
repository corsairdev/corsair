import * as Actors from './actors';
import * as Docs from './docs';
import * as Runs from './runs';

export const ActorsEndpoints = {
	searchActors: Actors.searchActors,
	fetchActorDetails: Actors.fetchActorDetails,
	callActor: Actors.callActor,
	ragWebBrowser: Actors.ragWebBrowser,
} as const;

export const RunsEndpoints = {
	getActorRun: Runs.getActorRun,
	getActorOutput: Runs.getActorOutput,
} as const;

export const DocsEndpoints = {
	searchApifyDocs: Docs.searchApifyDocs,
	fetchApifyDocs: Docs.fetchApifyDocs,
} as const;

export * from './types';

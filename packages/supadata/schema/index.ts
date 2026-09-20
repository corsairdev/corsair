import { databaseEntities } from './database';

export const SupadataSchema = {
	version: '1.0.0',
	entities: databaseEntities,
} as const;

export {
	databaseEntities,
	SupadataAccount,
	SupadataErrorPayload,
	SupadataTranscript,
	SupadataTranscriptChunk,
	SupadataTranscriptContent,
	SupadataTranscriptJob,
	SupadataTranscriptJobRef,
	SupadataVideoIds,
	SupadataWebMap,
	SupadataWebPage,
	SupadataYoutubeChannel,
	SupadataYoutubeChannelRef,
	SupadataYoutubePlaylist,
	SupadataYoutubeSearchResult,
	SupadataYoutubeVideo,
	SupadataMetadata,
	SupadataMetadataAuthor,
	SupadataMetadataMedia,
	SupadataMetadataStats,
} from './database';

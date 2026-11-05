import { answerCreate } from './answer';
import { broadSearchPost } from './broad-search';
import { businessSearchPost } from './business-search';
import { embeddingCreate } from './embedding';
import { extractPost } from './extract';
import {
	groundedGenerationCreate,
	groundedGenerationGet,
} from './grounded-generation';
import { imageSearchPost } from './image-search';
import { newsSearchPost } from './news-search';
import { searchPost } from './search';
import { videoGenerationCreate, videoGenerationGet } from './video-generation';
import { videoSearchPost } from './video-search';
import { vlEmbeddingCreate } from './vl-embedding';

export const Search = {
	post: searchPost,
};

export const BroadSearch = {
	post: broadSearchPost,
};

export const NewsSearch = {
	post: newsSearchPost,
};

export const BusinessSearch = {
	post: businessSearchPost,
};

export const ImageSearch = {
	post: imageSearchPost,
};

export const VideoSearch = {
	post: videoSearchPost,
};

export const Extract = {
	post: extractPost,
};

export const Embedding = {
	create: embeddingCreate,
};

export const VlEmbedding = {
	create: vlEmbeddingCreate,
};

export const Answer = {
	create: answerCreate,
};

export const VideoGeneration = {
	create: videoGenerationCreate,
	get: videoGenerationGet,
};

export const GroundedGeneration = {
	create: groundedGenerationCreate,
	get: groundedGenerationGet,
};

export * from './types';

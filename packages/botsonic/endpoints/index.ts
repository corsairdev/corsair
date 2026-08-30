import { generateResponse } from './generate-response';
import { getAllFaqs } from './get-all-faqs';

export const GenerateResponse = {
	post: generateResponse,
};

export const GetAllFaqs = {
	get: getAllFaqs,
};

export * from './types';

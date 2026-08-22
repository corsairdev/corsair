import { makeBunnycdnRequest } from '../client';
import type { BunnycdnContext } from '../index';
import type {
    PullZone,
    PullZoneGetInput,
    PullZoneListInput,
} from './types';

export const PullZoneEndpoints = {
    list: async (ctx: BunnycdnContext, input: PullZoneListInput = {}): Promise<PullZone[]> => {
        const key = (await ctx.keys?.get_api_key()) ?? ctx.options.key ?? '';
        return makeBunnycdnRequest<PullZone[]>('/pullzone', key, {
            method: 'GET',
            query: {
                page: input.page,
                perPage: input.perPage,
            },
        });
    },

    get: async (ctx: BunnycdnContext, input: PullZoneGetInput): Promise<PullZone> => {
        const key = (await ctx.keys?.get_api_key()) ?? ctx.options.key ?? '';
        return makeBunnycdnRequest<PullZone>(`/pullzone/${input.id}`, key, {
            method: 'GET',
        });
    },
};

export * from './types';
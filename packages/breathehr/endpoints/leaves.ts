import { makeBreatheHrRequest } from '../client';
import type { BreatheHrContext } from '../index';
import type {
  LeavesGetInput,
  LeavesGetResponse,
  LeavesListInput,
  LeavesListResponse,
} from './types';

export const Leaves = {
  list: async (ctx: BreatheHrContext, input: LeavesListInput): Promise<LeavesListResponse> => {
    const apiKey = ctx.key;
    const query: Record<string, any> = {};
    if (input.start_date) query.start_date = input.start_date;
    if (input.end_date) query.end_date = input.end_date;
    if (input.employee_id) query.employee_id = input.employee_id;
    if (input.page) query.page = input.page;

    return await makeBreatheHrRequest<LeavesListResponse>('/leaves', apiKey, { query });
  },

  get: async (ctx: BreatheHrContext, input: LeavesGetInput): Promise<LeavesGetResponse> => {
    const apiKey = ctx.key;
    return await makeBreatheHrRequest<LeavesGetResponse>(`/leaves/${input.id}`, apiKey);
  },
};
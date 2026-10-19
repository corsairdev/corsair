import type { ContextDevEndpoints } from '..';
import { call } from './call';

export const enrich: ContextDevEndpoints['peopleEnrich'] = (ctx, input) =>
	call(ctx, 'peopleEnrich', 'people.enrich', 'POST', 'people/enrich', input);

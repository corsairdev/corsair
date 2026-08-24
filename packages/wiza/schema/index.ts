import { WizaList, WizaProspect, WizaReveal } from './database';

export const WizaSchema = {
	version: '1.0.0',
	entities: {
		reveals: WizaReveal,
		lists: WizaList,
		prospects: WizaProspect,
	},
} as const;

import { TallyForm, TallySubmission, TallyWorkspace } from './database';

export const TallySchema = {
	version: '1.0.0',
	entities: {
		forms: TallyForm,
		submissions: TallySubmission,
		workspaces: TallyWorkspace,
	},
} as const;

import {
	CapsuleCrmBoard,
	CapsuleCrmEntry,
	CapsuleCrmMilestone,
	CapsuleCrmOpportunity,
	CapsuleCrmParty,
	CapsuleCrmProject,
	CapsuleCrmSite,
	CapsuleCrmTask,
	CapsuleCrmUser,
} from './database';

export const CapsuleCrmSchema = {
	version: '1.0.0',
	entities: {
		parties: CapsuleCrmParty,
		opportunities: CapsuleCrmOpportunity,
		projects: CapsuleCrmProject,
		tasks: CapsuleCrmTask,
		entries: CapsuleCrmEntry,
		users: CapsuleCrmUser,
		site: CapsuleCrmSite,
		milestones: CapsuleCrmMilestone,
		boards: CapsuleCrmBoard,
	},
} as const;

export {
	CapsuleCrmBoard,
	CapsuleCrmEntry,
	CapsuleCrmMilestone,
	CapsuleCrmOpportunity,
	CapsuleCrmParty,
	CapsuleCrmProject,
	CapsuleCrmSite,
	CapsuleCrmTask,
	CapsuleCrmUser,
} from './database';

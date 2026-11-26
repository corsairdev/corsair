import {
	FathomAiMeeting,
	FathomAiMeetingType,
	FathomAiTeam,
	FathomAiTeamMember,
	FathomAiUser,
} from './database';

export const FathomAiSchema = {
	version: '1.0.0',
	entities: {
		meetings: FathomAiMeeting,
		meetingTypes: FathomAiMeetingType,
		teams: FathomAiTeam,
		teamMembers: FathomAiTeamMember,
		users: FathomAiUser,
	},
} as const;

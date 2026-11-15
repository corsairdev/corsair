import {
	GOOGLE_CLASSROOM_ROUTES,
	GoogleClassroomEndpointInputSchemas,
	GoogleClassroomEndpointOutputSchemas,
} from './types';

export const GoogleClassroomEndpointSchemas = {
	'courses.aliases.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.aliases.create'],
		output: GoogleClassroomEndpointOutputSchemas['courses.aliases.create'],
	},
	'courses.aliases.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.aliases.delete'],
		output: GoogleClassroomEndpointOutputSchemas['courses.aliases.delete'],
	},
	'courses.aliases.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.aliases.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.aliases.list'],
	},
	'courses.announcements.addOnAttachments.create': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.create'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.create'
			],
	},
	'courses.announcements.addOnAttachments.delete': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.delete'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.delete'
			],
	},
	'courses.announcements.addOnAttachments.get': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.get'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.get'
			],
	},
	'courses.announcements.addOnAttachments.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.list'
			],
	},
	'courses.announcements.addOnAttachments.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.patch'
			],
	},
	'courses.announcements.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.announcements.create'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.announcements.create'],
	},
	'courses.announcements.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.announcements.delete'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.announcements.delete'],
	},
	'courses.announcements.get': {
		input: GoogleClassroomEndpointInputSchemas['courses.announcements.get'],
		output: GoogleClassroomEndpointOutputSchemas['courses.announcements.get'],
	},
	'courses.announcements.getAddOnContext': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.getAddOnContext'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.getAddOnContext'
			],
	},
	'courses.announcements.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.announcements.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.announcements.list'],
	},
	'courses.announcements.modifyAssignees': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.modifyAssignees'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.modifyAssignees'
			],
	},
	'courses.announcements.patch': {
		input: GoogleClassroomEndpointInputSchemas['courses.announcements.patch'],
		output: GoogleClassroomEndpointOutputSchemas['courses.announcements.patch'],
	},
	'courses.courseWork.addOnAttachments.create': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.create'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.create'
			],
	},
	'courses.courseWork.addOnAttachments.delete': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.delete'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.delete'
			],
	},
	'courses.courseWork.addOnAttachments.get': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.get'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.get'
			],
	},
	'courses.courseWork.addOnAttachments.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.list'
			],
	},
	'courses.courseWork.addOnAttachments.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.patch'
			],
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.get': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.get'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.get'
			],
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			],
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			],
	},
	'courses.courseWork.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.courseWork.create'],
		output: GoogleClassroomEndpointOutputSchemas['courses.courseWork.create'],
	},
	'courses.courseWork.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.courseWork.delete'],
		output: GoogleClassroomEndpointOutputSchemas['courses.courseWork.delete'],
	},
	'courses.courseWork.get': {
		input: GoogleClassroomEndpointInputSchemas['courses.courseWork.get'],
		output: GoogleClassroomEndpointOutputSchemas['courses.courseWork.get'],
	},
	'courses.courseWork.getAddOnContext': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWork.getAddOnContext'],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.getAddOnContext'
			],
	},
	'courses.courseWork.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.courseWork.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.courseWork.list'],
	},
	'courses.courseWork.modifyAssignees': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWork.modifyAssignees'],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.modifyAssignees'
			],
	},
	'courses.courseWork.patch': {
		input: GoogleClassroomEndpointInputSchemas['courses.courseWork.patch'],
		output: GoogleClassroomEndpointOutputSchemas['courses.courseWork.patch'],
	},
	'courses.courseWork.rubrics.create': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.create'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.create'],
	},
	'courses.courseWork.rubrics.delete': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.delete'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.delete'],
	},
	'courses.courseWork.rubrics.get': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.get'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.get'],
	},
	'courses.courseWork.rubrics.list': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.list'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.list'],
	},
	'courses.courseWork.rubrics.patch': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.patch'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.patch'],
	},
	'courses.courseWork.studentSubmissions.get': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.get'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.get'
			],
	},
	'courses.courseWork.studentSubmissions.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.list'
			],
	},
	'courses.courseWork.studentSubmissions.modifyAttachments': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.modifyAttachments'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.modifyAttachments'
			],
	},
	'courses.courseWork.studentSubmissions.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.patch'
			],
	},
	'courses.courseWork.studentSubmissions.reclaim': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.reclaim'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.reclaim'
			],
	},
	'courses.courseWork.studentSubmissions.return': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.return'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.return'
			],
	},
	'courses.courseWork.studentSubmissions.turnIn': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.turnIn'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.turnIn'
			],
	},
	'courses.courseWorkMaterials.addOnAttachments.create': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.create'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.create'
			],
	},
	'courses.courseWorkMaterials.addOnAttachments.delete': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.delete'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.delete'
			],
	},
	'courses.courseWorkMaterials.addOnAttachments.get': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.get'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.get'
			],
	},
	'courses.courseWorkMaterials.addOnAttachments.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.list'
			],
	},
	'courses.courseWorkMaterials.addOnAttachments.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.patch'
			],
	},
	'courses.courseWorkMaterials.create': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.create'],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.create'
			],
	},
	'courses.courseWorkMaterials.delete': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.delete'],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.delete'
			],
	},
	'courses.courseWorkMaterials.get': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.get'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.get'],
	},
	'courses.courseWorkMaterials.getAddOnContext': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.getAddOnContext'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.getAddOnContext'
			],
	},
	'courses.courseWorkMaterials.list': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.list'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.list'],
	},
	'courses.courseWorkMaterials.patch': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.patch'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.patch'],
	},
	'courses.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.create'],
		output: GoogleClassroomEndpointOutputSchemas['courses.create'],
	},
	'courses.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.delete'],
		output: GoogleClassroomEndpointOutputSchemas['courses.delete'],
	},
	'courses.get': {
		input: GoogleClassroomEndpointInputSchemas['courses.get'],
		output: GoogleClassroomEndpointOutputSchemas['courses.get'],
	},
	'courses.getGradingPeriodSettings': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.getGradingPeriodSettings'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.getGradingPeriodSettings'],
	},
	'courses.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.list'],
	},
	'courses.patch': {
		input: GoogleClassroomEndpointInputSchemas['courses.patch'],
		output: GoogleClassroomEndpointOutputSchemas['courses.patch'],
	},
	'courses.posts.addOnAttachments.create': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.create'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.create'
			],
	},
	'courses.posts.addOnAttachments.delete': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.delete'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.delete'
			],
	},
	'courses.posts.addOnAttachments.get': {
		input:
			GoogleClassroomEndpointInputSchemas['courses.posts.addOnAttachments.get'],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.get'
			],
	},
	'courses.posts.addOnAttachments.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.list'
			],
	},
	'courses.posts.addOnAttachments.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.patch'
			],
	},
	'courses.posts.addOnAttachments.studentSubmissions.get': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.get'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.get'
			],
	},
	'courses.posts.addOnAttachments.studentSubmissions.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.patch'
			],
	},
	'courses.posts.getAddOnContext': {
		input: GoogleClassroomEndpointInputSchemas['courses.posts.getAddOnContext'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.posts.getAddOnContext'],
	},
	'courses.studentGroups.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.studentGroups.create'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.studentGroups.create'],
	},
	'courses.studentGroups.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.studentGroups.delete'],
		output:
			GoogleClassroomEndpointOutputSchemas['courses.studentGroups.delete'],
	},
	'courses.studentGroups.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.studentGroups.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.studentGroups.list'],
	},
	'courses.studentGroups.patch': {
		input: GoogleClassroomEndpointInputSchemas['courses.studentGroups.patch'],
		output: GoogleClassroomEndpointOutputSchemas['courses.studentGroups.patch'],
	},
	'courses.studentGroups.studentGroupMembers.create': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.create'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.studentGroupMembers.create'
			],
	},
	'courses.studentGroups.studentGroupMembers.delete': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.delete'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.studentGroupMembers.delete'
			],
	},
	'courses.studentGroups.studentGroupMembers.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.studentGroupMembers.list'
			],
	},
	'courses.students.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.students.create'],
		output: GoogleClassroomEndpointOutputSchemas['courses.students.create'],
	},
	'courses.students.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.students.delete'],
		output: GoogleClassroomEndpointOutputSchemas['courses.students.delete'],
	},
	'courses.students.get': {
		input: GoogleClassroomEndpointInputSchemas['courses.students.get'],
		output: GoogleClassroomEndpointOutputSchemas['courses.students.get'],
	},
	'courses.students.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.students.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.students.list'],
	},
	'courses.teachers.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.teachers.create'],
		output: GoogleClassroomEndpointOutputSchemas['courses.teachers.create'],
	},
	'courses.teachers.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.teachers.delete'],
		output: GoogleClassroomEndpointOutputSchemas['courses.teachers.delete'],
	},
	'courses.teachers.get': {
		input: GoogleClassroomEndpointInputSchemas['courses.teachers.get'],
		output: GoogleClassroomEndpointOutputSchemas['courses.teachers.get'],
	},
	'courses.teachers.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.teachers.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.teachers.list'],
	},
	'courses.topics.create': {
		input: GoogleClassroomEndpointInputSchemas['courses.topics.create'],
		output: GoogleClassroomEndpointOutputSchemas['courses.topics.create'],
	},
	'courses.topics.delete': {
		input: GoogleClassroomEndpointInputSchemas['courses.topics.delete'],
		output: GoogleClassroomEndpointOutputSchemas['courses.topics.delete'],
	},
	'courses.topics.get': {
		input: GoogleClassroomEndpointInputSchemas['courses.topics.get'],
		output: GoogleClassroomEndpointOutputSchemas['courses.topics.get'],
	},
	'courses.topics.list': {
		input: GoogleClassroomEndpointInputSchemas['courses.topics.list'],
		output: GoogleClassroomEndpointOutputSchemas['courses.topics.list'],
	},
	'courses.topics.patch': {
		input: GoogleClassroomEndpointInputSchemas['courses.topics.patch'],
		output: GoogleClassroomEndpointOutputSchemas['courses.topics.patch'],
	},
	'courses.update': {
		input: GoogleClassroomEndpointInputSchemas['courses.update'],
		output: GoogleClassroomEndpointOutputSchemas['courses.update'],
	},
	'courses.updateGradingPeriodSettings': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'courses.updateGradingPeriodSettings'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'courses.updateGradingPeriodSettings'
			],
	},
	'invitations.accept': {
		input: GoogleClassroomEndpointInputSchemas['invitations.accept'],
		output: GoogleClassroomEndpointOutputSchemas['invitations.accept'],
	},
	'invitations.create': {
		input: GoogleClassroomEndpointInputSchemas['invitations.create'],
		output: GoogleClassroomEndpointOutputSchemas['invitations.create'],
	},
	'invitations.delete': {
		input: GoogleClassroomEndpointInputSchemas['invitations.delete'],
		output: GoogleClassroomEndpointOutputSchemas['invitations.delete'],
	},
	'invitations.get': {
		input: GoogleClassroomEndpointInputSchemas['invitations.get'],
		output: GoogleClassroomEndpointOutputSchemas['invitations.get'],
	},
	'invitations.list': {
		input: GoogleClassroomEndpointInputSchemas['invitations.list'],
		output: GoogleClassroomEndpointOutputSchemas['invitations.list'],
	},
	'registrations.create': {
		input: GoogleClassroomEndpointInputSchemas['registrations.create'],
		output: GoogleClassroomEndpointOutputSchemas['registrations.create'],
	},
	'registrations.delete': {
		input: GoogleClassroomEndpointInputSchemas['registrations.delete'],
		output: GoogleClassroomEndpointOutputSchemas['registrations.delete'],
	},
	'userProfiles.get': {
		input: GoogleClassroomEndpointInputSchemas['userProfiles.get'],
		output: GoogleClassroomEndpointOutputSchemas['userProfiles.get'],
	},
	'userProfiles.guardianInvitations.create': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.create'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.create'
			],
	},
	'userProfiles.guardianInvitations.get': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.get'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.get'
			],
	},
	'userProfiles.guardianInvitations.list': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.list'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.list'
			],
	},
	'userProfiles.guardianInvitations.patch': {
		input:
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.patch'
			],
		output:
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.patch'
			],
	},
	'userProfiles.guardians.delete': {
		input: GoogleClassroomEndpointInputSchemas['userProfiles.guardians.delete'],
		output:
			GoogleClassroomEndpointOutputSchemas['userProfiles.guardians.delete'],
	},
	'userProfiles.guardians.get': {
		input: GoogleClassroomEndpointInputSchemas['userProfiles.guardians.get'],
		output: GoogleClassroomEndpointOutputSchemas['userProfiles.guardians.get'],
	},
	'userProfiles.guardians.list': {
		input: GoogleClassroomEndpointInputSchemas['userProfiles.guardians.list'],
		output: GoogleClassroomEndpointOutputSchemas['userProfiles.guardians.list'],
	},
} as const;

export const GoogleClassroomEndpointMetadata = {
	'courses.aliases.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.aliases.create'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.aliases.create'].description,
	},
	'courses.aliases.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.aliases.delete'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.aliases.delete'].description,
	},
	'courses.aliases.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.aliases.list'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.aliases.list'].description,
	},
	'courses.announcements.addOnAttachments.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.create']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.create']
				.description,
	},
	'courses.announcements.addOnAttachments.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.delete']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.delete']
				.description,
	},
	'courses.announcements.addOnAttachments.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.get']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.get']
				.description,
	},
	'courses.announcements.addOnAttachments.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.list']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.list']
				.description,
	},
	'courses.announcements.addOnAttachments.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.patch']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.patch']
				.description,
	},
	'courses.announcements.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.create'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.create'].description,
	},
	'courses.announcements.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.delete'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.delete'].description,
	},
	'courses.announcements.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.announcements.get'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.get'].description,
	},
	'courses.announcements.getAddOnContext': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.getAddOnContext']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.getAddOnContext']
				.description,
	},
	'courses.announcements.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.announcements.list'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.list'].description,
	},
	'courses.announcements.modifyAssignees': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.modifyAssignees']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.modifyAssignees']
				.description,
	},
	'courses.announcements.patch': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.announcements.patch'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.announcements.patch'].description,
	},
	'courses.courseWork.addOnAttachments.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.create']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.create']
				.description,
	},
	'courses.courseWork.addOnAttachments.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.delete']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.delete']
				.description,
	},
	'courses.courseWork.addOnAttachments.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.get']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.get']
				.description,
	},
	'courses.courseWork.addOnAttachments.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.list']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.list']
				.description,
	},
	'courses.courseWork.addOnAttachments.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.patch']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.patch']
				.description,
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.get'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.get'
			].description,
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			].description,
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			].description,
	},
	'courses.courseWork.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.courseWork.create'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.create'].description,
	},
	'courses.courseWork.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.courseWork.delete'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.delete'].description,
	},
	'courses.courseWork.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.courseWork.get'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.courseWork.get'].description,
	},
	'courses.courseWork.getAddOnContext': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.getAddOnContext'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.getAddOnContext'].description,
	},
	'courses.courseWork.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.courseWork.list'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.courseWork.list'].description,
	},
	'courses.courseWork.modifyAssignees': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.modifyAssignees'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.modifyAssignees'].description,
	},
	'courses.courseWork.patch': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.courseWork.patch'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.patch'].description,
	},
	'courses.courseWork.rubrics.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.create'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.create'].description,
	},
	'courses.courseWork.rubrics.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.delete'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.delete'].description,
	},
	'courses.courseWork.rubrics.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.get'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.get'].description,
	},
	'courses.courseWork.rubrics.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.list'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.list'].description,
	},
	'courses.courseWork.rubrics.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.patch'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.patch'].description,
	},
	'courses.courseWork.studentSubmissions.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.get']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.get']
				.description,
	},
	'courses.courseWork.studentSubmissions.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.list']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.list']
				.description,
	},
	'courses.courseWork.studentSubmissions.modifyAttachments': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.studentSubmissions.modifyAttachments'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.studentSubmissions.modifyAttachments'
			].description,
	},
	'courses.courseWork.studentSubmissions.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.patch']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.patch']
				.description,
	},
	'courses.courseWork.studentSubmissions.reclaim': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.reclaim']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.reclaim']
				.description,
	},
	'courses.courseWork.studentSubmissions.return': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.return']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.return']
				.description,
	},
	'courses.courseWork.studentSubmissions.turnIn': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.turnIn']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.turnIn']
				.description,
	},
	'courses.courseWorkMaterials.addOnAttachments.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.create'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.create'
			].description,
	},
	'courses.courseWorkMaterials.addOnAttachments.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.delete'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.delete'
			].description,
	},
	'courses.courseWorkMaterials.addOnAttachments.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.get'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.get'
			].description,
	},
	'courses.courseWorkMaterials.addOnAttachments.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.list'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.list'
			].description,
	},
	'courses.courseWorkMaterials.addOnAttachments.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.patch'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWorkMaterials.addOnAttachments.patch'
			].description,
	},
	'courses.courseWorkMaterials.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.create'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.create'].description,
	},
	'courses.courseWorkMaterials.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.delete'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.delete'].description,
	},
	'courses.courseWorkMaterials.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.get'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.get'].description,
	},
	'courses.courseWorkMaterials.getAddOnContext': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.getAddOnContext']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.getAddOnContext']
				.description,
	},
	'courses.courseWorkMaterials.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.list'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.list'].description,
	},
	'courses.courseWorkMaterials.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.patch'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.patch'].description,
	},
	'courses.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.create'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.create'].description,
	},
	'courses.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.delete'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.delete'].description,
	},
	'courses.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.get'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.get'].description,
	},
	'courses.getGradingPeriodSettings': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.getGradingPeriodSettings'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.getGradingPeriodSettings'].description,
	},
	'courses.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.list'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.list'].description,
	},
	'courses.patch': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.patch'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.patch'].description,
	},
	'courses.posts.addOnAttachments.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.create']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.create']
				.description,
	},
	'courses.posts.addOnAttachments.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.delete']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.delete']
				.description,
	},
	'courses.posts.addOnAttachments.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.get'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.get'].description,
	},
	'courses.posts.addOnAttachments.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.list'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.list']
				.description,
	},
	'courses.posts.addOnAttachments.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.patch'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.patch']
				.description,
	},
	'courses.posts.addOnAttachments.studentSubmissions.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.posts.addOnAttachments.studentSubmissions.get'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.posts.addOnAttachments.studentSubmissions.get'
			].description,
	},
	'courses.posts.addOnAttachments.studentSubmissions.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.posts.addOnAttachments.studentSubmissions.patch'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.posts.addOnAttachments.studentSubmissions.patch'
			].description,
	},
	'courses.posts.getAddOnContext': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.getAddOnContext'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.posts.getAddOnContext'].description,
	},
	'courses.studentGroups.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.create'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.create'].description,
	},
	'courses.studentGroups.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.delete'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.delete'].description,
	},
	'courses.studentGroups.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.list'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.list'].description,
	},
	'courses.studentGroups.patch': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.patch'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.patch'].description,
	},
	'courses.studentGroups.studentGroupMembers.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.studentGroups.studentGroupMembers.create'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.studentGroups.studentGroupMembers.create'
			].description,
	},
	'courses.studentGroups.studentGroupMembers.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.studentGroups.studentGroupMembers.delete'
			].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES[
				'courses.studentGroups.studentGroupMembers.delete'
			].description,
	},
	'courses.studentGroups.studentGroupMembers.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.studentGroupMembers.list']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.studentGroupMembers.list']
				.description,
	},
	'courses.students.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.students.create'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.students.create'].description,
	},
	'courses.students.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.students.delete'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.students.delete'].description,
	},
	'courses.students.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.students.get'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.students.get'].description,
	},
	'courses.students.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.students.list'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.students.list'].description,
	},
	'courses.teachers.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.teachers.create'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.teachers.create'].description,
	},
	'courses.teachers.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.teachers.delete'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.teachers.delete'].description,
	},
	'courses.teachers.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.teachers.get'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.teachers.get'].description,
	},
	'courses.teachers.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.teachers.list'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.teachers.list'].description,
	},
	'courses.topics.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.topics.create'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.topics.create'].description,
	},
	'courses.topics.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.topics.delete'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.topics.delete'].description,
	},
	'courses.topics.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.topics.get'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.topics.get'].description,
	},
	'courses.topics.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.topics.list'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.topics.list'].description,
	},
	'courses.topics.patch': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.topics.patch'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.topics.patch'].description,
	},
	'courses.update': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['courses.update'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['courses.update'].description,
	},
	'courses.updateGradingPeriodSettings': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['courses.updateGradingPeriodSettings'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['courses.updateGradingPeriodSettings']
				.description,
	},
	'invitations.accept': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['invitations.accept'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['invitations.accept'].description,
	},
	'invitations.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['invitations.create'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['invitations.create'].description,
	},
	'invitations.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['invitations.delete'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['invitations.delete'].description,
	},
	'invitations.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['invitations.get'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['invitations.get'].description,
	},
	'invitations.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['invitations.list'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['invitations.list'].description,
	},
	'registrations.create': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['registrations.create'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['registrations.create'].description,
	},
	'registrations.delete': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['registrations.delete'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['registrations.delete'].description,
	},
	'userProfiles.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['userProfiles.get'].riskLevel,
		description: GOOGLE_CLASSROOM_ROUTES['userProfiles.get'].description,
	},
	'userProfiles.guardianInvitations.create': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.create']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.create']
				.description,
	},
	'userProfiles.guardianInvitations.get': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.get'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.get']
				.description,
	},
	'userProfiles.guardianInvitations.list': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.list']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.list']
				.description,
	},
	'userProfiles.guardianInvitations.patch': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.patch']
				.riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.patch']
				.description,
	},
	'userProfiles.guardians.delete': {
		riskLevel:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.delete'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.delete'].description,
	},
	'userProfiles.guardians.get': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.get'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.get'].description,
	},
	'userProfiles.guardians.list': {
		riskLevel: GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.list'].riskLevel,
		description:
			GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.list'].description,
	},
} as const;

export const GOOGLE_CLASSROOM_OAUTH_SCOPES = [
	'https://www.googleapis.com/auth/classroom.addons.teacher',
	'https://www.googleapis.com/auth/classroom.announcements',
	'https://www.googleapis.com/auth/classroom.courses',
	'https://www.googleapis.com/auth/classroom.coursework.me',
	'https://www.googleapis.com/auth/classroom.coursework.students',
	'https://www.googleapis.com/auth/classroom.courseworkmaterials',
	'https://www.googleapis.com/auth/classroom.guardianlinks.students',
	'https://www.googleapis.com/auth/classroom.push-notifications',
	'https://www.googleapis.com/auth/classroom.rosters',
	'https://www.googleapis.com/auth/classroom.topics',
] as const;

export const GOOGLE_CLASSROOM_SUPPORTED_SCOPES = [
	'https://www.googleapis.com/auth/classroom.addons.student',
	'https://www.googleapis.com/auth/classroom.addons.teacher',
	'https://www.googleapis.com/auth/classroom.announcements',
	'https://www.googleapis.com/auth/classroom.announcements.readonly',
	'https://www.googleapis.com/auth/classroom.courses',
	'https://www.googleapis.com/auth/classroom.courses.readonly',
	'https://www.googleapis.com/auth/classroom.coursework.me',
	'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
	'https://www.googleapis.com/auth/classroom.coursework.students',
	'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
	'https://www.googleapis.com/auth/classroom.courseworkmaterials',
	'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
	'https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly',
	'https://www.googleapis.com/auth/classroom.guardianlinks.students',
	'https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly',
	'https://www.googleapis.com/auth/classroom.profile.emails',
	'https://www.googleapis.com/auth/classroom.profile.photos',
	'https://www.googleapis.com/auth/classroom.push-notifications',
	'https://www.googleapis.com/auth/classroom.rosters',
	'https://www.googleapis.com/auth/classroom.rosters.readonly',
	'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
	'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
	'https://www.googleapis.com/auth/classroom.topics',
	'https://www.googleapis.com/auth/classroom.topics.readonly',
	'https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/spreadsheets.readonly',
] as const;
export type GoogleClassroomOAuthScope =
	(typeof GOOGLE_CLASSROOM_SUPPORTED_SCOPES)[number];

export const GOOGLE_CLASSROOM_RESPONSE_MODELS = {
	'courses.aliases.create': 'CourseAlias',
	'courses.aliases.delete': 'Empty',
	'courses.aliases.list': 'ListCourseAliasesResponse',
	'courses.announcements.addOnAttachments.create': 'AddOnAttachment',
	'courses.announcements.addOnAttachments.delete': 'Empty',
	'courses.announcements.addOnAttachments.get': 'AddOnAttachment',
	'courses.announcements.addOnAttachments.list': 'ListAddOnAttachmentsResponse',
	'courses.announcements.addOnAttachments.patch': 'AddOnAttachment',
	'courses.announcements.create': 'Announcement',
	'courses.announcements.delete': 'Empty',
	'courses.announcements.get': 'Announcement',
	'courses.announcements.getAddOnContext': 'AddOnContext',
	'courses.announcements.list': 'ListAnnouncementsResponse',
	'courses.announcements.modifyAssignees': 'Announcement',
	'courses.announcements.patch': 'Announcement',
	'courses.courseWork.addOnAttachments.create': 'AddOnAttachment',
	'courses.courseWork.addOnAttachments.delete': 'Empty',
	'courses.courseWork.addOnAttachments.get': 'AddOnAttachment',
	'courses.courseWork.addOnAttachments.list': 'ListAddOnAttachmentsResponse',
	'courses.courseWork.addOnAttachments.patch': 'AddOnAttachment',
	'courses.courseWork.addOnAttachments.studentSubmissions.get':
		'AddOnAttachmentStudentSubmission',
	'courses.courseWork.addOnAttachments.studentSubmissions.list':
		'ListAddOnAttachmentStudentSubmissionsResponse',
	'courses.courseWork.addOnAttachments.studentSubmissions.patch':
		'AddOnAttachmentStudentSubmission',
	'courses.courseWork.create': 'CourseWork',
	'courses.courseWork.delete': 'Empty',
	'courses.courseWork.get': 'CourseWork',
	'courses.courseWork.getAddOnContext': 'AddOnContext',
	'courses.courseWork.list': 'ListCourseWorkResponse',
	'courses.courseWork.modifyAssignees': 'CourseWork',
	'courses.courseWork.patch': 'CourseWork',
	'courses.courseWork.rubrics.create': 'Rubric',
	'courses.courseWork.rubrics.delete': 'Empty',
	'courses.courseWork.rubrics.get': 'Rubric',
	'courses.courseWork.rubrics.list': 'ListRubricsResponse',
	'courses.courseWork.rubrics.patch': 'Rubric',
	'courses.courseWork.studentSubmissions.get': 'StudentSubmission',
	'courses.courseWork.studentSubmissions.list':
		'ListStudentSubmissionsResponse',
	'courses.courseWork.studentSubmissions.modifyAttachments':
		'StudentSubmission',
	'courses.courseWork.studentSubmissions.patch': 'StudentSubmission',
	'courses.courseWork.studentSubmissions.reclaim': 'Empty',
	'courses.courseWork.studentSubmissions.return': 'Empty',
	'courses.courseWork.studentSubmissions.turnIn': 'Empty',
	'courses.courseWorkMaterials.addOnAttachments.create': 'AddOnAttachment',
	'courses.courseWorkMaterials.addOnAttachments.delete': 'Empty',
	'courses.courseWorkMaterials.addOnAttachments.get': 'AddOnAttachment',
	'courses.courseWorkMaterials.addOnAttachments.list':
		'ListAddOnAttachmentsResponse',
	'courses.courseWorkMaterials.addOnAttachments.patch': 'AddOnAttachment',
	'courses.courseWorkMaterials.create': 'CourseWorkMaterial',
	'courses.courseWorkMaterials.delete': 'Empty',
	'courses.courseWorkMaterials.get': 'CourseWorkMaterial',
	'courses.courseWorkMaterials.getAddOnContext': 'AddOnContext',
	'courses.courseWorkMaterials.list': 'ListCourseWorkMaterialResponse',
	'courses.courseWorkMaterials.patch': 'CourseWorkMaterial',
	'courses.create': 'Course',
	'courses.delete': 'Empty',
	'courses.get': 'Course',
	'courses.getGradingPeriodSettings': 'GradingPeriodSettings',
	'courses.list': 'ListCoursesResponse',
	'courses.patch': 'Course',
	'courses.posts.addOnAttachments.create': 'AddOnAttachment',
	'courses.posts.addOnAttachments.delete': 'Empty',
	'courses.posts.addOnAttachments.get': 'AddOnAttachment',
	'courses.posts.addOnAttachments.list': 'ListAddOnAttachmentsResponse',
	'courses.posts.addOnAttachments.patch': 'AddOnAttachment',
	'courses.posts.addOnAttachments.studentSubmissions.get':
		'AddOnAttachmentStudentSubmission',
	'courses.posts.addOnAttachments.studentSubmissions.patch':
		'AddOnAttachmentStudentSubmission',
	'courses.posts.getAddOnContext': 'AddOnContext',
	'courses.studentGroups.create': 'StudentGroup',
	'courses.studentGroups.delete': 'Empty',
	'courses.studentGroups.list': 'ListStudentGroupsResponse',
	'courses.studentGroups.patch': 'StudentGroup',
	'courses.studentGroups.studentGroupMembers.create': 'StudentGroupMember',
	'courses.studentGroups.studentGroupMembers.delete': 'Empty',
	'courses.studentGroups.studentGroupMembers.list':
		'ListStudentGroupMembersResponse',
	'courses.students.create': 'Student',
	'courses.students.delete': 'Empty',
	'courses.students.get': 'Student',
	'courses.students.list': 'ListStudentsResponse',
	'courses.teachers.create': 'Teacher',
	'courses.teachers.delete': 'Empty',
	'courses.teachers.get': 'Teacher',
	'courses.teachers.list': 'ListTeachersResponse',
	'courses.topics.create': 'Topic',
	'courses.topics.delete': 'Empty',
	'courses.topics.get': 'Topic',
	'courses.topics.list': 'ListTopicResponse',
	'courses.topics.patch': 'Topic',
	'courses.update': 'Course',
	'courses.updateGradingPeriodSettings': 'GradingPeriodSettings',
	'invitations.accept': 'Empty',
	'invitations.create': 'Invitation',
	'invitations.delete': 'Empty',
	'invitations.get': 'Invitation',
	'invitations.list': 'ListInvitationsResponse',
	'registrations.create': 'Registration',
	'registrations.delete': 'Empty',
	'userProfiles.get': 'UserProfile',
	'userProfiles.guardianInvitations.create': 'GuardianInvitation',
	'userProfiles.guardianInvitations.get': 'GuardianInvitation',
	'userProfiles.guardianInvitations.list': 'ListGuardianInvitationsResponse',
	'userProfiles.guardianInvitations.patch': 'GuardianInvitation',
	'userProfiles.guardians.delete': 'Empty',
	'userProfiles.guardians.get': 'Guardian',
	'userProfiles.guardians.list': 'ListGuardiansResponse',
} as const;
export type GoogleClassroomResponseModelName =
	(typeof GOOGLE_CLASSROOM_RESPONSE_MODELS)[keyof typeof GOOGLE_CLASSROOM_RESPONSE_MODELS];

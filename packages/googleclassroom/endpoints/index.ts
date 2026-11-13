import { GoogleClassroomOperationFunctions } from './api';

export const GoogleClassroomEndpoints = {
	courses: {
		aliases: {
			create: GoogleClassroomOperationFunctions['courses.aliases.create'],
			delete: GoogleClassroomOperationFunctions['courses.aliases.delete'],
			list: GoogleClassroomOperationFunctions['courses.aliases.list'],
		},
		announcements: {
			addOnAttachments: {
				create:
					GoogleClassroomOperationFunctions[
						'courses.announcements.addOnAttachments.create'
					],
				delete:
					GoogleClassroomOperationFunctions[
						'courses.announcements.addOnAttachments.delete'
					],
				get: GoogleClassroomOperationFunctions[
					'courses.announcements.addOnAttachments.get'
				],
				list: GoogleClassroomOperationFunctions[
					'courses.announcements.addOnAttachments.list'
				],
				patch:
					GoogleClassroomOperationFunctions[
						'courses.announcements.addOnAttachments.patch'
					],
			},
			create: GoogleClassroomOperationFunctions['courses.announcements.create'],
			delete: GoogleClassroomOperationFunctions['courses.announcements.delete'],
			get: GoogleClassroomOperationFunctions['courses.announcements.get'],
			getAddOnContext:
				GoogleClassroomOperationFunctions[
					'courses.announcements.getAddOnContext'
				],
			list: GoogleClassroomOperationFunctions['courses.announcements.list'],
			modifyAssignees:
				GoogleClassroomOperationFunctions[
					'courses.announcements.modifyAssignees'
				],
			patch: GoogleClassroomOperationFunctions['courses.announcements.patch'],
		},
		courseWork: {
			addOnAttachments: {
				create:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.addOnAttachments.create'
					],
				delete:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.addOnAttachments.delete'
					],
				get: GoogleClassroomOperationFunctions[
					'courses.courseWork.addOnAttachments.get'
				],
				list: GoogleClassroomOperationFunctions[
					'courses.courseWork.addOnAttachments.list'
				],
				patch:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.addOnAttachments.patch'
					],
				studentSubmissions: {
					get: GoogleClassroomOperationFunctions[
						'courses.courseWork.addOnAttachments.studentSubmissions.get'
					],
					list: GoogleClassroomOperationFunctions[
						'courses.courseWork.addOnAttachments.studentSubmissions.list'
					],
					patch:
						GoogleClassroomOperationFunctions[
							'courses.courseWork.addOnAttachments.studentSubmissions.patch'
						],
				},
			},
			create: GoogleClassroomOperationFunctions['courses.courseWork.create'],
			delete: GoogleClassroomOperationFunctions['courses.courseWork.delete'],
			get: GoogleClassroomOperationFunctions['courses.courseWork.get'],
			getAddOnContext:
				GoogleClassroomOperationFunctions['courses.courseWork.getAddOnContext'],
			list: GoogleClassroomOperationFunctions['courses.courseWork.list'],
			modifyAssignees:
				GoogleClassroomOperationFunctions['courses.courseWork.modifyAssignees'],
			patch: GoogleClassroomOperationFunctions['courses.courseWork.patch'],
			rubrics: {
				create:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.rubrics.create'
					],
				delete:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.rubrics.delete'
					],
				get: GoogleClassroomOperationFunctions[
					'courses.courseWork.rubrics.get'
				],
				list: GoogleClassroomOperationFunctions[
					'courses.courseWork.rubrics.list'
				],
				patch:
					GoogleClassroomOperationFunctions['courses.courseWork.rubrics.patch'],
			},
			studentSubmissions: {
				get: GoogleClassroomOperationFunctions[
					'courses.courseWork.studentSubmissions.get'
				],
				list: GoogleClassroomOperationFunctions[
					'courses.courseWork.studentSubmissions.list'
				],
				modifyAttachments:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.studentSubmissions.modifyAttachments'
					],
				patch:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.studentSubmissions.patch'
					],
				reclaim:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.studentSubmissions.reclaim'
					],
				return:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.studentSubmissions.return'
					],
				turnIn:
					GoogleClassroomOperationFunctions[
						'courses.courseWork.studentSubmissions.turnIn'
					],
			},
		},
		courseWorkMaterials: {
			addOnAttachments: {
				create:
					GoogleClassroomOperationFunctions[
						'courses.courseWorkMaterials.addOnAttachments.create'
					],
				delete:
					GoogleClassroomOperationFunctions[
						'courses.courseWorkMaterials.addOnAttachments.delete'
					],
				get: GoogleClassroomOperationFunctions[
					'courses.courseWorkMaterials.addOnAttachments.get'
				],
				list: GoogleClassroomOperationFunctions[
					'courses.courseWorkMaterials.addOnAttachments.list'
				],
				patch:
					GoogleClassroomOperationFunctions[
						'courses.courseWorkMaterials.addOnAttachments.patch'
					],
			},
			create:
				GoogleClassroomOperationFunctions['courses.courseWorkMaterials.create'],
			delete:
				GoogleClassroomOperationFunctions['courses.courseWorkMaterials.delete'],
			get: GoogleClassroomOperationFunctions['courses.courseWorkMaterials.get'],
			getAddOnContext:
				GoogleClassroomOperationFunctions[
					'courses.courseWorkMaterials.getAddOnContext'
				],
			list: GoogleClassroomOperationFunctions[
				'courses.courseWorkMaterials.list'
			],
			patch:
				GoogleClassroomOperationFunctions['courses.courseWorkMaterials.patch'],
		},
		create: GoogleClassroomOperationFunctions['courses.create'],
		delete: GoogleClassroomOperationFunctions['courses.delete'],
		get: GoogleClassroomOperationFunctions['courses.get'],
		getGradingPeriodSettings:
			GoogleClassroomOperationFunctions['courses.getGradingPeriodSettings'],
		list: GoogleClassroomOperationFunctions['courses.list'],
		patch: GoogleClassroomOperationFunctions['courses.patch'],
		posts: {
			addOnAttachments: {
				create:
					GoogleClassroomOperationFunctions[
						'courses.posts.addOnAttachments.create'
					],
				delete:
					GoogleClassroomOperationFunctions[
						'courses.posts.addOnAttachments.delete'
					],
				get: GoogleClassroomOperationFunctions[
					'courses.posts.addOnAttachments.get'
				],
				list: GoogleClassroomOperationFunctions[
					'courses.posts.addOnAttachments.list'
				],
				patch:
					GoogleClassroomOperationFunctions[
						'courses.posts.addOnAttachments.patch'
					],
				studentSubmissions: {
					get: GoogleClassroomOperationFunctions[
						'courses.posts.addOnAttachments.studentSubmissions.get'
					],
					patch:
						GoogleClassroomOperationFunctions[
							'courses.posts.addOnAttachments.studentSubmissions.patch'
						],
				},
			},
			getAddOnContext:
				GoogleClassroomOperationFunctions['courses.posts.getAddOnContext'],
		},
		studentGroups: {
			create: GoogleClassroomOperationFunctions['courses.studentGroups.create'],
			delete: GoogleClassroomOperationFunctions['courses.studentGroups.delete'],
			list: GoogleClassroomOperationFunctions['courses.studentGroups.list'],
			patch: GoogleClassroomOperationFunctions['courses.studentGroups.patch'],
			studentGroupMembers: {
				create:
					GoogleClassroomOperationFunctions[
						'courses.studentGroups.studentGroupMembers.create'
					],
				delete:
					GoogleClassroomOperationFunctions[
						'courses.studentGroups.studentGroupMembers.delete'
					],
				list: GoogleClassroomOperationFunctions[
					'courses.studentGroups.studentGroupMembers.list'
				],
			},
		},
		students: {
			create: GoogleClassroomOperationFunctions['courses.students.create'],
			delete: GoogleClassroomOperationFunctions['courses.students.delete'],
			get: GoogleClassroomOperationFunctions['courses.students.get'],
			list: GoogleClassroomOperationFunctions['courses.students.list'],
		},
		teachers: {
			create: GoogleClassroomOperationFunctions['courses.teachers.create'],
			delete: GoogleClassroomOperationFunctions['courses.teachers.delete'],
			get: GoogleClassroomOperationFunctions['courses.teachers.get'],
			list: GoogleClassroomOperationFunctions['courses.teachers.list'],
		},
		topics: {
			create: GoogleClassroomOperationFunctions['courses.topics.create'],
			delete: GoogleClassroomOperationFunctions['courses.topics.delete'],
			get: GoogleClassroomOperationFunctions['courses.topics.get'],
			list: GoogleClassroomOperationFunctions['courses.topics.list'],
			patch: GoogleClassroomOperationFunctions['courses.topics.patch'],
		},
		update: GoogleClassroomOperationFunctions['courses.update'],
		updateGradingPeriodSettings:
			GoogleClassroomOperationFunctions['courses.updateGradingPeriodSettings'],
	},
	invitations: {
		accept: GoogleClassroomOperationFunctions['invitations.accept'],
		create: GoogleClassroomOperationFunctions['invitations.create'],
		delete: GoogleClassroomOperationFunctions['invitations.delete'],
		get: GoogleClassroomOperationFunctions['invitations.get'],
		list: GoogleClassroomOperationFunctions['invitations.list'],
	},
	registrations: {
		create: GoogleClassroomOperationFunctions['registrations.create'],
		delete: GoogleClassroomOperationFunctions['registrations.delete'],
	},
	userProfiles: {
		get: GoogleClassroomOperationFunctions['userProfiles.get'],
		guardianInvitations: {
			create:
				GoogleClassroomOperationFunctions[
					'userProfiles.guardianInvitations.create'
				],
			get: GoogleClassroomOperationFunctions[
				'userProfiles.guardianInvitations.get'
			],
			list: GoogleClassroomOperationFunctions[
				'userProfiles.guardianInvitations.list'
			],
			patch:
				GoogleClassroomOperationFunctions[
					'userProfiles.guardianInvitations.patch'
				],
		},
		guardians: {
			delete:
				GoogleClassroomOperationFunctions['userProfiles.guardians.delete'],
			get: GoogleClassroomOperationFunctions['userProfiles.guardians.get'],
			list: GoogleClassroomOperationFunctions['userProfiles.guardians.list'],
		},
	},
} as const;

export * from './registry';
export * from './types';

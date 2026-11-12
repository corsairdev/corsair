import { getD2lRoute } from '../route-definitions';
import { createD2lRouteEndpoint } from './route-operation';

export const d2lBrightspaceEndpointsNested = {
	apiProperties: {
		getProductCodeVersions: createD2lRouteEndpoint(getD2lRoute(0)),
		getProductCodeVersionsVersion: createD2lRouteEndpoint(getD2lRoute(1)),
		getVersions: createD2lRouteEndpoint(getD2lRoute(2)),
		postVersionsCheck: createD2lRouteEndpoint(getD2lRoute(3)),
	},
	awardService: {
		getAssociationsAvailableToEarn: createD2lRouteEndpoint(getD2lRoute(6)),
		getAwards: createD2lRouteEndpoint(getD2lRoute(7)),
		postAwards: createD2lRouteEndpoint(getD2lRoute(8)),
		deleteAwardsAwardId: createD2lRouteEndpoint(getD2lRoute(9)),
		getAwardsAwardId: createD2lRouteEndpoint(getD2lRoute(10)),
		putAwardsAwardId: createD2lRouteEndpoint(getD2lRoute(11)),
		getCreditSummary: createD2lRouteEndpoint(getD2lRoute(12)),
		deleteIssuedIssuedId: createD2lRouteEndpoint(getD2lRoute(13)),
		deleteIssuedIssuedIdSharingProfile: createD2lRouteEndpoint(getD2lRoute(14)),
		putIssuedIssuedIdSharingProfile: createD2lRouteEndpoint(getD2lRoute(15)),
		getIssuedCertificatesCertificateId: createD2lRouteEndpoint(getD2lRoute(16)),
		getIssuedCertificatesIssuedIdPdf: createD2lRouteEndpoint(getD2lRoute(17)),
		getIssuedUsersUserId: createD2lRouteEndpoint(getD2lRoute(18)),
		getLibraryIcons: createD2lRouteEndpoint(getD2lRoute(19)),
		postLibraryIcons: createD2lRouteEndpoint(getD2lRoute(20)),
		deleteLibraryIconsFileName: createD2lRouteEndpoint(getD2lRoute(21)),
		getLibraryIconsFileName: createD2lRouteEndpoint(getD2lRoute(22)),
		getLibraryTemplates: createD2lRouteEndpoint(getD2lRoute(23)),
		postLibraryTemplates: createD2lRouteEndpoint(getD2lRoute(24)),
		deleteLibraryTemplatesFileName: createD2lRouteEndpoint(getD2lRoute(25)),
		getLibraryTemplatesFileName: createD2lRouteEndpoint(getD2lRoute(26)),
		getOrgunitsOrgUnitIdAssociations: createD2lRouteEndpoint(getD2lRoute(27)),
		postOrgunitsOrgUnitIdAssociations: createD2lRouteEndpoint(getD2lRoute(28)),
		deleteOrgunitsOrgUnitIdAssociationsAssociationId: createD2lRouteEndpoint(
			getD2lRoute(29),
		),
		getOrgunitsOrgUnitIdAssociationsAssociationId: createD2lRouteEndpoint(
			getD2lRoute(30),
		),
		putOrgunitsOrgUnitIdAssociationsAssociationId: createD2lRouteEndpoint(
			getD2lRoute(31),
		),
		getOrgunitsOrgUnitIdAssociationsAvailableToManage: createD2lRouteEndpoint(
			getD2lRoute(32),
		),
		getOrgunitsOrgUnitIdClasslist: createD2lRouteEndpoint(getD2lRoute(33)),
		getOrgunitsOrgUnitIdClasslistUsersUserId: createD2lRouteEndpoint(
			getD2lRoute(34),
		),
		postOrgunitsOrgUnitIdIssued: createD2lRouteEndpoint(getD2lRoute(35)),
		putOrgunitsOrgUnitIdIssuedIssuedId: createD2lRouteEndpoint(getD2lRoute(36)),
		getOrgunitsOrgUnitIdMyConfiguration: createD2lRouteEndpoint(
			getD2lRoute(37),
		),
		getOrgunitsOrgUnitIdRevocableawards: createD2lRouteEndpoint(
			getD2lRoute(38),
		),
		getOrgunitsOrgUnitIdRevocableawardsUserId: createD2lRouteEndpoint(
			getD2lRoute(39),
		),
	},
	brightspaceForParents: {
		deleteRelationships: createD2lRouteEndpoint(getD2lRoute(40)),
		putRelationships: createD2lRouteEndpoint(getD2lRoute(41)),
		getRelationshipsUserId: createD2lRouteEndpoint(getD2lRoute(42)),
	},
	eportfolio: {
		getActivity: createD2lRouteEndpoint(getD2lRoute(43)),
		getActivityFilters: createD2lRouteEndpoint(getD2lRoute(44)),
		getActivityMy: createD2lRouteEndpoint(getD2lRoute(45)),
		getActivityShared: createD2lRouteEndpoint(getD2lRoute(46)),
		deleteArtifactObjectId: createD2lRouteEndpoint(getD2lRoute(47)),
		getArtifactObjectId: createD2lRouteEndpoint(getD2lRoute(48)),
		deleteArtifactFileObjectId: createD2lRouteEndpoint(getD2lRoute(49)),
		getArtifactFileObjectId: createD2lRouteEndpoint(getD2lRoute(50)),
		postArtifactFileObjectId: createD2lRouteEndpoint(getD2lRoute(51)),
		deleteArtifactLinkObjectId: createD2lRouteEndpoint(getD2lRoute(52)),
		getArtifactLinkObjectId: createD2lRouteEndpoint(getD2lRoute(53)),
		postArtifactLinkObjectId: createD2lRouteEndpoint(getD2lRoute(54)),
		postArtifactsFileNew: createD2lRouteEndpoint(getD2lRoute(55)),
		postArtifactsFileUpload: createD2lRouteEndpoint(getD2lRoute(56)),
		postArtifactsLinkNew: createD2lRouteEndpoint(getD2lRoute(57)),
		postCollectionCollectionIdAddObjectId: createD2lRouteEndpoint(
			getD2lRoute(58),
		),
		postCollectionCollectionIdRemoveObjectId: createD2lRouteEndpoint(
			getD2lRoute(59),
		),
		deleteCollectionObjectId: createD2lRouteEndpoint(getD2lRoute(60)),
		getCollectionObjectId: createD2lRouteEndpoint(getD2lRoute(61)),
		postCollectionObjectId: createD2lRouteEndpoint(getD2lRoute(62)),
		getCollectionObjectIdContents: createD2lRouteEndpoint(getD2lRoute(63)),
		postCollectionsNew: createD2lRouteEndpoint(getD2lRoute(64)),
		getDashboard: createD2lRouteEndpoint(getD2lRoute(65)),
		getDashboardFilters: createD2lRouteEndpoint(getD2lRoute(66)),
		getExportExportIdPackage: createD2lRouteEndpoint(getD2lRoute(67)),
		getExportExportIdStatus: createD2lRouteEndpoint(getD2lRoute(68)),
		postExportNew: createD2lRouteEndpoint(getD2lRoute(69)),
		postExportNewAll: createD2lRouteEndpoint(getD2lRoute(70)),
		getIgnoredusers: createD2lRouteEndpoint(getD2lRoute(71)),
		postIgnoredusersAdd: createD2lRouteEndpoint(getD2lRoute(72)),
		postIgnoredusersRemove: createD2lRouteEndpoint(getD2lRoute(73)),
		getImportImportIdStatus: createD2lRouteEndpoint(getD2lRoute(74)),
		postImportNew: createD2lRouteEndpoint(getD2lRoute(75)),
		postImportNewwithdetails: createD2lRouteEndpoint(getD2lRoute(76)),
		getInvites: createD2lRouteEndpoint(getD2lRoute(77)),
		postInvitesDelete: createD2lRouteEndpoint(getD2lRoute(78)),
		postInvitesNew: createD2lRouteEndpoint(getD2lRoute(79)),
		postInvitesStatus: createD2lRouteEndpoint(getD2lRoute(80)),
		deleteLearningobjectiveObjectiveId: createD2lRouteEndpoint(getD2lRoute(81)),
		getLearningobjectiveObjectiveId: createD2lRouteEndpoint(getD2lRoute(82)),
		postLearningobjectiveObjectiveId: createD2lRouteEndpoint(getD2lRoute(83)),
		deleteLearningobjectiveObjectiveIdAssociationObjectId:
			createD2lRouteEndpoint(getD2lRoute(84)),
		postLearningobjectiveObjectiveIdAssociationObjectId: createD2lRouteEndpoint(
			getD2lRoute(85),
		),
		getNewsfeed: createD2lRouteEndpoint(getD2lRoute(86)),
		getNewsfeedFilters: createD2lRouteEndpoint(getD2lRoute(87)),
		getObject: createD2lRouteEndpoint(getD2lRoute(88)),
		getObjectObjectId: createD2lRouteEndpoint(getD2lRoute(89)),
		getObjectObjectIdAssociations: createD2lRouteEndpoint(getD2lRoute(90)),
		deleteObjectObjectIdCommentCommentId: createD2lRouteEndpoint(
			getD2lRoute(91),
		),
		getObjectObjectIdComments: createD2lRouteEndpoint(getD2lRoute(92)),
		postObjectObjectIdCommentsNew: createD2lRouteEndpoint(getD2lRoute(93)),
		getObjectObjectIdContent: createD2lRouteEndpoint(getD2lRoute(94)),
		postObjectObjectIdShareDelete: createD2lRouteEndpoint(getD2lRoute(95)),
		postObjectObjectIdShareNew: createD2lRouteEndpoint(getD2lRoute(96)),
		getObjectObjectIdShares: createD2lRouteEndpoint(getD2lRoute(97)),
		getObjectObjectIdTags: createD2lRouteEndpoint(getD2lRoute(98)),
		postObjectObjectIdTagsAdd: createD2lRouteEndpoint(getD2lRoute(99)),
		postObjectObjectIdTagsRemove: createD2lRouteEndpoint(getD2lRoute(100)),
		deleteObjectCommentCommentId: createD2lRouteEndpoint(getD2lRoute(101)),
		getObjectComments: createD2lRouteEndpoint(getD2lRoute(102)),
		postObjectCommentsNew: createD2lRouteEndpoint(getD2lRoute(103)),
		getObjectContent: createD2lRouteEndpoint(getD2lRoute(104)),
		getObjectSharetargets: createD2lRouteEndpoint(getD2lRoute(105)),
		getObjectSharetargetsMy: createD2lRouteEndpoint(getD2lRoute(106)),
		getObjectSharetargetsSharinggroups: createD2lRouteEndpoint(
			getD2lRoute(107),
		),
		getObjectSharetargetsUsers: createD2lRouteEndpoint(getD2lRoute(108)),
		getObjectThumbnail: createD2lRouteEndpoint(getD2lRoute(109)),
		getObjectsObjectsFilterCommentsCommentsFilter: createD2lRouteEndpoint(
			getD2lRoute(110),
		),
		getObjectsMy: createD2lRouteEndpoint(getD2lRoute(111)),
		getObjectsMySharedModified: createD2lRouteEndpoint(getD2lRoute(112)),
		getObjectsShared: createD2lRouteEndpoint(getD2lRoute(113)),
		getObjectsTags: createD2lRouteEndpoint(getD2lRoute(114)),
		postObjectsTagsAdd: createD2lRouteEndpoint(getD2lRoute(115)),
		postObjectsTagsRemove: createD2lRouteEndpoint(getD2lRoute(116)),
		deletePresentationObjectId: createD2lRouteEndpoint(getD2lRoute(117)),
		getPresentationObjectId: createD2lRouteEndpoint(getD2lRoute(118)),
		postPresentationObjectId: createD2lRouteEndpoint(getD2lRoute(119)),
		postPresentationsNew: createD2lRouteEndpoint(getD2lRoute(120)),
		deleteReflectionObjectId: createD2lRouteEndpoint(getD2lRoute(121)),
		getReflectionObjectId: createD2lRouteEndpoint(getD2lRoute(122)),
		postReflectionObjectId: createD2lRouteEndpoint(getD2lRoute(123)),
		deleteReflectionReflectionIdOnObjectId: createD2lRouteEndpoint(
			getD2lRoute(124),
		),
		postReflectionReflectionIdOnObjectId: createD2lRouteEndpoint(
			getD2lRoute(125),
		),
		postReflectionsNew: createD2lRouteEndpoint(getD2lRoute(126)),
		getSubscriptionsObjects: createD2lRouteEndpoint(getD2lRoute(127)),
		deleteSubscriptionsObjectsObjectId: createD2lRouteEndpoint(
			getD2lRoute(128),
		),
		postSubscriptionsObjectsObjectId: createD2lRouteEndpoint(getD2lRoute(129)),
		getSubscriptionsObjectsExists: createD2lRouteEndpoint(getD2lRoute(130)),
		getSubscriptionsUsers: createD2lRouteEndpoint(getD2lRoute(131)),
		deleteSubscriptionsUsersUserId: createD2lRouteEndpoint(getD2lRoute(132)),
		postSubscriptionsUsersUserId: createD2lRouteEndpoint(getD2lRoute(133)),
		getSubscriptionsUsersExists: createD2lRouteEndpoint(getD2lRoute(134)),
		postTagsAutocomplete: createD2lRouteEndpoint(getD2lRoute(135)),
		getUsersSharing: createD2lRouteEndpoint(getD2lRoute(136)),
	},
	learningEnvironment: {
		postLtiadvantageQuicklinksOrgunitOrgUnitIdLinkLinkId:
			createD2lRouteEndpoint(getD2lRoute(137)),
		getOrgUnitIdAgents: createD2lRouteEndpoint(getD2lRoute(138)),
		postOrgUnitIdAgents: createD2lRouteEndpoint(getD2lRoute(139)),
		deleteOrgUnitIdAgentsAgentId: createD2lRouteEndpoint(getD2lRoute(140)),
		getOrgUnitIdAgentsAgentId: createD2lRouteEndpoint(getD2lRoute(141)),
		postOrgUnitIdAgentsAgentId: createD2lRouteEndpoint(getD2lRoute(142)),
		putOrgUnitIdAgentsAgentId: createD2lRouteEndpoint(getD2lRoute(143)),
		getOrgUnitIdAgentsAgentIdRuns: createD2lRouteEndpoint(getD2lRoute(144)),
		postOrgUnitIdAgentsAgentIdRuns: createD2lRouteEndpoint(getD2lRoute(145)),
		getOrgUnitIdAgentsAgentIdRunsRunId: createD2lRouteEndpoint(
			getD2lRoute(146),
		),
		getOrgUnitIdAgentsCategories: createD2lRouteEndpoint(getD2lRoute(147)),
		postOrgUnitIdAgentsCategories: createD2lRouteEndpoint(getD2lRoute(148)),
		deleteOrgUnitIdAgentsCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(149),
		),
		getOrgUnitIdAgentsCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(150),
		),
		putOrgUnitIdAgentsCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(151),
		),
		getOrgUnitIdAgentsDeleted: createD2lRouteEndpoint(getD2lRoute(152)),
		getOrgUnitIdAssessment: createD2lRouteEndpoint(getD2lRoute(153)),
		putOrgUnitIdAssessment: createD2lRouteEndpoint(getD2lRoute(154)),
		postOrgUnitIdCalendarEvent: createD2lRouteEndpoint(getD2lRoute(155)),
		deleteOrgUnitIdCalendarEventEventId: createD2lRouteEndpoint(
			getD2lRoute(156),
		),
		getOrgUnitIdCalendarEventEventId: createD2lRouteEndpoint(getD2lRoute(157)),
		putOrgUnitIdCalendarEventEventId: createD2lRouteEndpoint(getD2lRoute(158)),
		getOrgUnitIdCalendarEventEventIdAccess: createD2lRouteEndpoint(
			getD2lRoute(159),
		),
		getOrgUnitIdCalendarEventEventIdOccurrences: createD2lRouteEndpoint(
			getD2lRoute(160),
		),
		postOrgUnitIdCalendarEventEventIdPresenter: createD2lRouteEndpoint(
			getD2lRoute(161),
		),
		deleteOrgUnitIdCalendarEventEventIdPresenterUserId: createD2lRouteEndpoint(
			getD2lRoute(162),
		),
		getOrgUnitIdCalendarEvents: createD2lRouteEndpoint(getD2lRoute(163)),
		getOrgUnitIdCalendarEventsUserIdItemCount: createD2lRouteEndpoint(
			getD2lRoute(164),
		),
		getOrgUnitIdCalendarEventsMyEvents: createD2lRouteEndpoint(
			getD2lRoute(165),
		),
		getOrgUnitIdCalendarEventsMyEventsItemCount: createD2lRouteEndpoint(
			getD2lRoute(166),
		),
		getOrgUnitIdCalendarEventsOccurrences: createD2lRouteEndpoint(
			getD2lRoute(167),
		),
		getOrgUnitIdCalendarEventsOrgunits: createD2lRouteEndpoint(
			getD2lRoute(168),
		),
		getOrgUnitIdCalendarEventsUser: createD2lRouteEndpoint(getD2lRoute(169)),
		getOrgUnitIdChecklists: createD2lRouteEndpoint(getD2lRoute(170)),
		postOrgUnitIdChecklists: createD2lRouteEndpoint(getD2lRoute(171)),
		deleteOrgUnitIdChecklistsChecklistId: createD2lRouteEndpoint(
			getD2lRoute(172),
		),
		getOrgUnitIdChecklistsChecklistId: createD2lRouteEndpoint(getD2lRoute(173)),
		putOrgUnitIdChecklistsChecklistId: createD2lRouteEndpoint(getD2lRoute(174)),
		getOrgUnitIdChecklistsChecklistIdCategories: createD2lRouteEndpoint(
			getD2lRoute(175),
		),
		postOrgUnitIdChecklistsChecklistIdCategories: createD2lRouteEndpoint(
			getD2lRoute(176),
		),
		deleteOrgUnitIdChecklistsChecklistIdCategoriesCategoryId:
			createD2lRouteEndpoint(getD2lRoute(177)),
		getOrgUnitIdChecklistsChecklistIdCategoriesCategoryId:
			createD2lRouteEndpoint(getD2lRoute(178)),
		putOrgUnitIdChecklistsChecklistIdCategoriesCategoryId:
			createD2lRouteEndpoint(getD2lRoute(179)),
		getOrgUnitIdChecklistsChecklistIdItems: createD2lRouteEndpoint(
			getD2lRoute(180),
		),
		postOrgUnitIdChecklistsChecklistIdItems: createD2lRouteEndpoint(
			getD2lRoute(181),
		),
		deleteOrgUnitIdChecklistsChecklistIdItemsChecklistItemId:
			createD2lRouteEndpoint(getD2lRoute(182)),
		getOrgUnitIdChecklistsChecklistIdItemsChecklistItemId:
			createD2lRouteEndpoint(getD2lRoute(183)),
		putOrgUnitIdChecklistsChecklistIdItemsChecklistItemId:
			createD2lRouteEndpoint(getD2lRoute(184)),
		getOrgUnitIdClasslist: createD2lRouteEndpoint(getD2lRoute(185)),
		getOrgUnitIdClasslistPaged: createD2lRouteEndpoint(getD2lRoute(186)),
		getOrgUnitIdCompetenciesStructure: createD2lRouteEndpoint(getD2lRoute(187)),
		getOrgUnitIdContentBookmarks: createD2lRouteEndpoint(getD2lRoute(188)),
		getOrgUnitIdContentCompletions: createD2lRouteEndpoint(getD2lRoute(189)),
		getOrgUnitIdContentCompletionsMycount: createD2lRouteEndpoint(
			getD2lRoute(190),
		),
		postOrgUnitIdContentExemptionsUsersUserIdByFilter: createD2lRouteEndpoint(
			getD2lRoute(191),
		),
		postOrgUnitIdContentExemptionsUsersUserIdByList: createD2lRouteEndpoint(
			getD2lRoute(192),
		),
		postOrgUnitIdContentExemptionsUsersUserIdByListDelete:
			createD2lRouteEndpoint(getD2lRoute(193)),
		deleteOrgUnitIdContentModulesModuleId: createD2lRouteEndpoint(
			getD2lRoute(194),
		),
		getOrgUnitIdContentModulesModuleId: createD2lRouteEndpoint(
			getD2lRoute(195),
		),
		putOrgUnitIdContentModulesModuleId: createD2lRouteEndpoint(
			getD2lRoute(196),
		),
		getOrgUnitIdContentModulesModuleIdAccess: createD2lRouteEndpoint(
			getD2lRoute(197),
		),
		getOrgUnitIdContentModulesModuleIdStructure: createD2lRouteEndpoint(
			getD2lRoute(198),
		),
		postOrgUnitIdContentModulesModuleIdStructure: createD2lRouteEndpoint(
			getD2lRoute(199),
		),
		getOrgUnitIdContentMyItems: createD2lRouteEndpoint(getD2lRoute(200)),
		getOrgUnitIdContentMyItemsDue: createD2lRouteEndpoint(getD2lRoute(201)),
		getOrgUnitIdContentMyItemsDueItemCount: createD2lRouteEndpoint(
			getD2lRoute(202),
		),
		getOrgUnitIdContentMyItemsItemCount: createD2lRouteEndpoint(
			getD2lRoute(203),
		),
		postOrgUnitIdContentOrderObjectIdObjectId: createD2lRouteEndpoint(
			getD2lRoute(204),
		),
		getOrgUnitIdContentPacing: createD2lRouteEndpoint(getD2lRoute(205)),
		putOrgUnitIdContentPacing: createD2lRouteEndpoint(getD2lRoute(206)),
		putOrgUnitIdContentPacingModulesModuleId: createD2lRouteEndpoint(
			getD2lRoute(207),
		),
		getOrgUnitIdContentRecent: createD2lRouteEndpoint(getD2lRoute(208)),
		getOrgUnitIdContentRoot: createD2lRouteEndpoint(getD2lRoute(209)),
		postOrgUnitIdContentRoot: createD2lRouteEndpoint(getD2lRoute(210)),
		getOrgUnitIdContentToc: createD2lRouteEndpoint(getD2lRoute(211)),
		deleteOrgUnitIdContentTopicsTopicId: createD2lRouteEndpoint(
			getD2lRoute(212),
		),
		getOrgUnitIdContentTopicsTopicId: createD2lRouteEndpoint(getD2lRoute(213)),
		putOrgUnitIdContentTopicsTopicId: createD2lRouteEndpoint(getD2lRoute(214)),
		getOrgUnitIdContentTopicsTopicIdAccess: createD2lRouteEndpoint(
			getD2lRoute(215),
		),
		getOrgUnitIdContentTopicsTopicIdCaptions: createD2lRouteEndpoint(
			getD2lRoute(216),
		),
		deleteOrgUnitIdContentTopicsTopicIdCaptionsLanguage: createD2lRouteEndpoint(
			getD2lRoute(217),
		),
		putOrgUnitIdContentTopicsTopicIdCaptionsLanguage: createD2lRouteEndpoint(
			getD2lRoute(218),
		),
		getOrgUnitIdContentTopicsTopicIdCompletions: createD2lRouteEndpoint(
			getD2lRoute(219),
		),
		getOrgUnitIdContentTopicsTopicIdCompletionsUsersUserId:
			createD2lRouteEndpoint(getD2lRoute(220)),
		putOrgUnitIdContentTopicsTopicIdCompletionsUsersUserId:
			createD2lRouteEndpoint(getD2lRoute(221)),
		getOrgUnitIdContentTopicsTopicIdFile: createD2lRouteEndpoint(
			getD2lRoute(222),
		),
		putOrgUnitIdContentTopicsTopicIdFile: createD2lRouteEndpoint(
			getD2lRoute(223),
		),
		getOrgUnitIdContentUserprogress: createD2lRouteEndpoint(getD2lRoute(224)),
		postOrgUnitIdContentUserprogress: createD2lRouteEndpoint(getD2lRoute(225)),
		getOrgUnitIdContentUserprogressTopicId: createD2lRouteEndpoint(
			getD2lRoute(226),
		),
		getOrgUnitIdDiscussionsDeleted: createD2lRouteEndpoint(getD2lRoute(227)),
		getOrgUnitIdDiscussionsForums: createD2lRouteEndpoint(getD2lRoute(228)),
		postOrgUnitIdDiscussionsForums: createD2lRouteEndpoint(getD2lRoute(229)),
		deleteOrgUnitIdDiscussionsForumsForumId: createD2lRouteEndpoint(
			getD2lRoute(230),
		),
		getOrgUnitIdDiscussionsForumsForumId: createD2lRouteEndpoint(
			getD2lRoute(231),
		),
		putOrgUnitIdDiscussionsForumsForumId: createD2lRouteEndpoint(
			getD2lRoute(232),
		),
		getOrgUnitIdDiscussionsForumsForumIdAccess: createD2lRouteEndpoint(
			getD2lRoute(233),
		),
		postOrgUnitIdDiscussionsForumsForumIdCopy: createD2lRouteEndpoint(
			getD2lRoute(234),
		),
		postOrgUnitIdDiscussionsForumsForumIdOrder: createD2lRouteEndpoint(
			getD2lRoute(235),
		),
		postOrgUnitIdDiscussionsForumsForumIdRestore: createD2lRouteEndpoint(
			getD2lRoute(236),
		),
		getOrgUnitIdDiscussionsForumsForumIdStatistics: createD2lRouteEndpoint(
			getD2lRoute(237),
		),
		getOrgUnitIdDiscussionsForumsForumIdTopics: createD2lRouteEndpoint(
			getD2lRoute(238),
		),
		postOrgUnitIdDiscussionsForumsForumIdTopics: createD2lRouteEndpoint(
			getD2lRoute(239),
		),
		deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicId:
			createD2lRouteEndpoint(getD2lRoute(240)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicId: createD2lRouteEndpoint(
			getD2lRoute(241),
		),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicId: createD2lRouteEndpoint(
			getD2lRoute(242),
		),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdAccess:
			createD2lRouteEndpoint(getD2lRoute(243)),
		postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdCopy:
			createD2lRouteEndpoint(getD2lRoute(244)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdExemption:
			createD2lRouteEndpoint(getD2lRoute(245)),
		deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions:
			createD2lRouteEndpoint(getD2lRoute(246)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions:
			createD2lRouteEndpoint(getD2lRoute(247)),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions:
			createD2lRouteEndpoint(getD2lRoute(248)),
		postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdOrder:
			createD2lRouteEndpoint(getD2lRoute(249)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPosts:
			createD2lRouteEndpoint(getD2lRoute(250)),
		postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPosts:
			createD2lRouteEndpoint(getD2lRoute(251)),
		deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId:
			createD2lRouteEndpoint(getD2lRoute(252)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId:
			createD2lRouteEndpoint(getD2lRoute(253)),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId:
			createD2lRouteEndpoint(getD2lRoute(254)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdApproval:
			createD2lRouteEndpoint(getD2lRoute(255)),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdApproval:
			createD2lRouteEndpoint(getD2lRoute(256)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdFlag:
			createD2lRouteEndpoint(getD2lRoute(257)),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdFlag:
			createD2lRouteEndpoint(getD2lRoute(258)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRating:
			createD2lRouteEndpoint(getD2lRoute(259)),
		deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating:
			createD2lRouteEndpoint(getD2lRoute(260)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating:
			createD2lRouteEndpoint(getD2lRoute(261)),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating:
			createD2lRouteEndpoint(getD2lRoute(262)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdReadStatus:
			createD2lRouteEndpoint(getD2lRoute(263)),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdReadStatus:
			createD2lRouteEndpoint(getD2lRoute(264)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotes:
			createD2lRouteEndpoint(getD2lRoute(265)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotesMyVote:
			createD2lRouteEndpoint(getD2lRoute(266)),
		putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotesMyVote:
			createD2lRouteEndpoint(getD2lRoute(267)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdAttachmentsFileId:
			createD2lRouteEndpoint(getD2lRoute(268)),
		postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdPin:
			createD2lRouteEndpoint(getD2lRoute(269)),
		postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdUnpin:
			createD2lRouteEndpoint(getD2lRoute(270)),
		postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdRestore:
			createD2lRouteEndpoint(getD2lRoute(271)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdStatistics:
			createD2lRouteEndpoint(getD2lRoute(272)),
		deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserUserIdExemption:
			createD2lRouteEndpoint(getD2lRoute(273)),
		postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserUserIdExemption:
			createD2lRouteEndpoint(getD2lRoute(274)),
		getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserstatistics:
			createD2lRouteEndpoint(getD2lRoute(275)),
		getOrgUnitIdDiscussionsForumtopicstatistics: createD2lRouteEndpoint(
			getD2lRoute(276),
		),
		getOrgUnitIdDiscussionsStatistics: createD2lRouteEndpoint(getD2lRoute(277)),
		getOrgUnitIdDiscussionsUserstatistics: createD2lRouteEndpoint(
			getD2lRoute(278),
		),
		getOrgUnitIdDropboxCategories: createD2lRouteEndpoint(getD2lRoute(279)),
		postOrgUnitIdDropboxCategories: createD2lRouteEndpoint(getD2lRoute(280)),
		deleteOrgUnitIdDropboxCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(281),
		),
		getOrgUnitIdDropboxCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(282),
		),
		putOrgUnitIdDropboxCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(283),
		),
		getOrgUnitIdDropboxFolders: createD2lRouteEndpoint(getD2lRoute(284)),
		postOrgUnitIdDropboxFolders: createD2lRouteEndpoint(getD2lRoute(285)),
		deleteOrgUnitIdDropboxFoldersFolderId: createD2lRouteEndpoint(
			getD2lRoute(286),
		),
		getOrgUnitIdDropboxFoldersFolderId: createD2lRouteEndpoint(
			getD2lRoute(287),
		),
		putOrgUnitIdDropboxFoldersFolderId: createD2lRouteEndpoint(
			getD2lRoute(288),
		),
		getOrgUnitIdDropboxFoldersFolderIdAccess: createD2lRouteEndpoint(
			getD2lRoute(289),
		),
		getOrgUnitIdDropboxFoldersFolderIdAttachmentsFileId: createD2lRouteEndpoint(
			getD2lRoute(290),
		),
		putOrgUnitIdDropboxFoldersFolderIdEntitiesEntityIdCompletion:
			createD2lRouteEndpoint(getD2lRoute(291)),
		getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityId:
			createD2lRouteEndpoint(getD2lRoute(292)),
		postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityId:
			createD2lRouteEndpoint(getD2lRoute(293)),
		postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttach:
			createD2lRouteEndpoint(getD2lRoute(294)),
		deleteOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttachmentsFileId:
			createD2lRouteEndpoint(getD2lRoute(295)),
		getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttachmentsFileId:
			createD2lRouteEndpoint(getD2lRoute(296)),
		getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdLinksLinkId:
			createD2lRouteEndpoint(getD2lRoute(297)),
		postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdUpload:
			createD2lRouteEndpoint(getD2lRoute(298)),
		getOrgUnitIdDropboxFoldersFolderIdGroupSubmissionsGroupIdDownload:
			createD2lRouteEndpoint(getD2lRoute(299)),
		getOrgUnitIdDropboxFoldersFolderIdSpecialaccess: createD2lRouteEndpoint(
			getD2lRoute(300),
		),
		deleteOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId:
			createD2lRouteEndpoint(getD2lRoute(301)),
		getOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId:
			createD2lRouteEndpoint(getD2lRoute(302)),
		putOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId:
			createD2lRouteEndpoint(getD2lRoute(303)),
		getOrgUnitIdDropboxFoldersFolderIdSubmissions: createD2lRouteEndpoint(
			getD2lRoute(304),
		),
		getOrgUnitIdDropboxFoldersFolderIdSubmissionsSubmissionIdFilesFileId:
			createD2lRouteEndpoint(getD2lRoute(305)),
		postOrgUnitIdDropboxFoldersFolderIdSubmissionsSubmissionIdFilesFileIdMarkAsRead:
			createD2lRouteEndpoint(getD2lRoute(306)),
		getOrgUnitIdDropboxFoldersFolderIdSubmissionsUserIdDownload:
			createD2lRouteEndpoint(getD2lRoute(307)),
		getOrgUnitIdDropboxFoldersFolderIdSubmissionsGroupGroupId:
			createD2lRouteEndpoint(getD2lRoute(308)),
		postOrgUnitIdDropboxFoldersFolderIdSubmissionsGroupGroupId:
			createD2lRouteEndpoint(getD2lRoute(309)),
		getOrgUnitIdDropboxFoldersFolderIdSubmissionsMysubmissions:
			createD2lRouteEndpoint(getD2lRoute(310)),
		postOrgUnitIdDropboxFoldersFolderIdSubmissionsMysubmissions:
			createD2lRouteEndpoint(getD2lRoute(311)),
		getOrgUnitIdDropboxFoldersFolderIdSubmissionsPaged: createD2lRouteEndpoint(
			getD2lRoute(312),
		),
		getOrgUnitIdDropboxFoldersFolderIdSubmissionsUserUserId:
			createD2lRouteEndpoint(getD2lRoute(313)),
		getOrgUnitIdGrades: createD2lRouteEndpoint(getD2lRoute(314)),
		postOrgUnitIdGrades: createD2lRouteEndpoint(getD2lRoute(315)),
		deleteOrgUnitIdGradesGradeObjectId: createD2lRouteEndpoint(
			getD2lRoute(316),
		),
		getOrgUnitIdGradesGradeObjectId: createD2lRouteEndpoint(getD2lRoute(317)),
		putOrgUnitIdGradesGradeObjectId: createD2lRouteEndpoint(getD2lRoute(318)),
		getOrgUnitIdGradesGradeObjectIdAccess: createD2lRouteEndpoint(
			getD2lRoute(319),
		),
		getOrgUnitIdGradesGradeObjectIdExemptions: createD2lRouteEndpoint(
			getD2lRoute(320),
		),
		deleteOrgUnitIdGradesGradeObjectIdExemptionsUserId: createD2lRouteEndpoint(
			getD2lRoute(321),
		),
		getOrgUnitIdGradesGradeObjectIdExemptionsUserId: createD2lRouteEndpoint(
			getD2lRoute(322),
		),
		postOrgUnitIdGradesGradeObjectIdExemptionsUserId: createD2lRouteEndpoint(
			getD2lRoute(323),
		),
		getOrgUnitIdGradesGradeObjectIdIpsis: createD2lRouteEndpoint(
			getD2lRoute(324),
		),
		putOrgUnitIdGradesGradeObjectIdIpsis: createD2lRouteEndpoint(
			getD2lRoute(325),
		),
		getOrgUnitIdGradesGradeObjectIdStatistics: createD2lRouteEndpoint(
			getD2lRoute(326),
		),
		getOrgUnitIdGradesGradeObjectIdValues: createD2lRouteEndpoint(
			getD2lRoute(327),
		),
		getOrgUnitIdGradesGradeObjectIdValuesUserId: createD2lRouteEndpoint(
			getD2lRoute(328),
		),
		putOrgUnitIdGradesGradeObjectIdValuesUserId: createD2lRouteEndpoint(
			getD2lRoute(329),
		),
		postOrgUnitIdGradesGradeObjectIdValuesUserIdClear: createD2lRouteEndpoint(
			getD2lRoute(330),
		),
		getOrgUnitIdGradesGradeObjectIdValuesMyGradeValue: createD2lRouteEndpoint(
			getD2lRoute(331),
		),
		getOrgUnitIdGradesCategories: createD2lRouteEndpoint(getD2lRoute(332)),
		postOrgUnitIdGradesCategories: createD2lRouteEndpoint(getD2lRoute(333)),
		deleteOrgUnitIdGradesCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(334),
		),
		getOrgUnitIdGradesCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(335),
		),
		putOrgUnitIdGradesCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(336),
		),
		getOrgUnitIdGradesCategoriesCategoryIdIpsis: createD2lRouteEndpoint(
			getD2lRoute(337),
		),
		putOrgUnitIdGradesCategoriesCategoryIdIpsis: createD2lRouteEndpoint(
			getD2lRoute(338),
		),
		getOrgUnitIdGradesCourseCompletion: createD2lRouteEndpoint(
			getD2lRoute(339),
		),
		postOrgUnitIdGradesCourseCompletion: createD2lRouteEndpoint(
			getD2lRoute(340),
		),
		deleteOrgUnitIdGradesCourseCompletionCompletionId: createD2lRouteEndpoint(
			getD2lRoute(341),
		),
		putOrgUnitIdGradesCourseCompletionCompletionId: createD2lRouteEndpoint(
			getD2lRoute(342),
		),
		getOrgUnitIdGradesExemptionsUserId: createD2lRouteEndpoint(
			getD2lRoute(343),
		),
		postOrgUnitIdGradesExemptionsUserId: createD2lRouteEndpoint(
			getD2lRoute(344),
		),
		postOrgUnitIdGradesFinalCalculatedUserId: createD2lRouteEndpoint(
			getD2lRoute(345),
		),
		postOrgUnitIdGradesFinalCalculatedAll: createD2lRouteEndpoint(
			getD2lRoute(346),
		),
		getOrgUnitIdGradesFinalValues: createD2lRouteEndpoint(getD2lRoute(347)),
		getOrgUnitIdGradesFinalValuesUserId: createD2lRouteEndpoint(
			getD2lRoute(348),
		),
		putOrgUnitIdGradesFinalValuesUserId: createD2lRouteEndpoint(
			getD2lRoute(349),
		),
		getOrgUnitIdGradesFinalValuesMyGradeValue: createD2lRouteEndpoint(
			getD2lRoute(350),
		),
		getOrgUnitIdGradesSchemes: createD2lRouteEndpoint(getD2lRoute(351)),
		postOrgUnitIdGradesSchemes: createD2lRouteEndpoint(getD2lRoute(352)),
		deleteOrgUnitIdGradesSchemesGradeSchemeId: createD2lRouteEndpoint(
			getD2lRoute(353),
		),
		getOrgUnitIdGradesSchemesGradeSchemeId: createD2lRouteEndpoint(
			getD2lRoute(354),
		),
		getOrgUnitIdGradesSchemesDefault: createD2lRouteEndpoint(getD2lRoute(355)),
		getOrgUnitIdGradesSetup: createD2lRouteEndpoint(getD2lRoute(356)),
		putOrgUnitIdGradesSetup: createD2lRouteEndpoint(getD2lRoute(357)),
		getOrgUnitIdGradesValues: createD2lRouteEndpoint(getD2lRoute(358)),
		getOrgUnitIdGradesValuesUserId: createD2lRouteEndpoint(getD2lRoute(359)),
		getOrgUnitIdGradesValuesDescendants: createD2lRouteEndpoint(
			getD2lRoute(360),
		),
		getOrgUnitIdGradesValuesMyGradeValues: createD2lRouteEndpoint(
			getD2lRoute(361),
		),
		getOrgUnitIdLoAlignments: createD2lRouteEndpoint(getD2lRoute(362)),
		getOrgUnitIdLoAlignmentsActivityActivityTypeObjectId:
			createD2lRouteEndpoint(getD2lRoute(363)),
		postOrgUnitIdLoAlignmentsActivityActivityTypeObjectId:
			createD2lRouteEndpoint(getD2lRoute(364)),
		getOrgUnitIdLoAlignmentsOutcomeOutcomeId: createD2lRouteEndpoint(
			getD2lRoute(365),
		),
		getOrgUnitIdLoAlignmentsOutcomeSetOutcomeSetId: createD2lRouteEndpoint(
			getD2lRoute(366),
		),
		postOrgUnitIdLoBulkExport: createD2lRouteEndpoint(getD2lRoute(367)),
		postOrgUnitIdLoBulkImport: createD2lRouteEndpoint(getD2lRoute(368)),
		getOrgUnitIdLoOutcomeSets: createD2lRouteEndpoint(getD2lRoute(369)),
		getOrgUnitIdLoOutcomeSetsOutcomeSetId: createD2lRouteEndpoint(
			getD2lRoute(370),
		),
		putOrgUnitIdLoOutcomeSetsOutcomeSetId: createD2lRouteEndpoint(
			getD2lRoute(371),
		),
		deleteOrgUnitIdLockerGroupGroupIdPath: createD2lRouteEndpoint(
			getD2lRoute(372),
		),
		getOrgUnitIdLockerGroupGroupIdPath: createD2lRouteEndpoint(
			getD2lRoute(373),
		),
		postOrgUnitIdLockerGroupGroupIdPath: createD2lRouteEndpoint(
			getD2lRoute(374),
		),
		putOrgUnitIdLockerGroupGroupIdPath: createD2lRouteEndpoint(
			getD2lRoute(375),
		),
		getOrgUnitIdNews: createD2lRouteEndpoint(getD2lRoute(376)),
		postOrgUnitIdNews: createD2lRouteEndpoint(getD2lRoute(377)),
		deleteOrgUnitIdNewsNewsItemId: createD2lRouteEndpoint(getD2lRoute(378)),
		getOrgUnitIdNewsNewsItemId: createD2lRouteEndpoint(getD2lRoute(379)),
		putOrgUnitIdNewsNewsItemId: createD2lRouteEndpoint(getD2lRoute(380)),
		getOrgUnitIdNewsNewsItemIdAccess: createD2lRouteEndpoint(getD2lRoute(381)),
		postOrgUnitIdNewsNewsItemIdAttachments: createD2lRouteEndpoint(
			getD2lRoute(382),
		),
		deleteOrgUnitIdNewsNewsItemIdAttachmentsFileId: createD2lRouteEndpoint(
			getD2lRoute(383),
		),
		getOrgUnitIdNewsNewsItemIdAttachmentsFileId: createD2lRouteEndpoint(
			getD2lRoute(384),
		),
		postOrgUnitIdNewsNewsItemIdDismiss: createD2lRouteEndpoint(
			getD2lRoute(385),
		),
		postOrgUnitIdNewsNewsItemIdPublish: createD2lRouteEndpoint(
			getD2lRoute(386),
		),
		postOrgUnitIdNewsNewsItemIdRestore: createD2lRouteEndpoint(
			getD2lRoute(387),
		),
		deleteOrgUnitIdNewsNewsItemIdSharing: createD2lRouteEndpoint(
			getD2lRoute(388),
		),
		getOrgUnitIdNewsNewsItemIdSharing: createD2lRouteEndpoint(getD2lRoute(389)),
		postOrgUnitIdNewsNewsItemIdSharing: createD2lRouteEndpoint(
			getD2lRoute(390),
		),
		deleteOrgUnitIdNewsNewsItemIdSharingSharingOrgUnitId:
			createD2lRouteEndpoint(getD2lRoute(391)),
		putOrgUnitIdNewsNewsItemIdSharingSharingOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(392),
		),
		getOrgUnitIdNewsDeleted: createD2lRouteEndpoint(getD2lRoute(393)),
		postOrgUnitIdNewsDeletedNewsItemIdRestore: createD2lRouteEndpoint(
			getD2lRoute(394),
		),
		getOrgUnitIdNewsUserUserId: createD2lRouteEndpoint(getD2lRoute(395)),
		getOrgUnitIdOverview: createD2lRouteEndpoint(getD2lRoute(396)),
		getOrgUnitIdOverviewAttachment: createD2lRouteEndpoint(getD2lRoute(397)),
		getOrgUnitIdQuizzes: createD2lRouteEndpoint(getD2lRoute(398)),
		postOrgUnitIdQuizzes: createD2lRouteEndpoint(getD2lRoute(399)),
		deleteOrgUnitIdQuizzesQuizId: createD2lRouteEndpoint(getD2lRoute(400)),
		getOrgUnitIdQuizzesQuizId: createD2lRouteEndpoint(getD2lRoute(401)),
		putOrgUnitIdQuizzesQuizId: createD2lRouteEndpoint(getD2lRoute(402)),
		getOrgUnitIdQuizzesQuizIdAccess: createD2lRouteEndpoint(getD2lRoute(403)),
		getOrgUnitIdQuizzesQuizIdAttempts: createD2lRouteEndpoint(getD2lRoute(404)),
		getOrgUnitIdQuizzesQuizIdAttemptsAttemptId: createD2lRouteEndpoint(
			getD2lRoute(405),
		),
		getOrgUnitIdQuizzesQuizIdQuestions: createD2lRouteEndpoint(
			getD2lRoute(406),
		),
		postOrgUnitIdQuizzesQuizIdQuestions: createD2lRouteEndpoint(
			getD2lRoute(407),
		),
		getOrgUnitIdQuizzesQuizIdQuestionsQuestionId: createD2lRouteEndpoint(
			getD2lRoute(408),
		),
		putOrgUnitIdQuizzesQuizIdQuestionsQuestionId: createD2lRouteEndpoint(
			getD2lRoute(409),
		),
		getOrgUnitIdQuizzesQuizIdSpecialaccess: createD2lRouteEndpoint(
			getD2lRoute(410),
		),
		deleteOrgUnitIdQuizzesQuizIdSpecialaccessUserId: createD2lRouteEndpoint(
			getD2lRoute(411),
		),
		getOrgUnitIdQuizzesQuizIdSpecialaccessUserId: createD2lRouteEndpoint(
			getD2lRoute(412),
		),
		putOrgUnitIdQuizzesQuizIdSpecialaccessUserId: createD2lRouteEndpoint(
			getD2lRoute(413),
		),
		getOrgUnitIdQuizzesCategories: createD2lRouteEndpoint(getD2lRoute(414)),
		postOrgUnitIdQuizzesCategories: createD2lRouteEndpoint(getD2lRoute(415)),
		deleteOrgUnitIdQuizzesCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(416),
		),
		getOrgUnitIdQuizzesCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(417),
		),
		putOrgUnitIdQuizzesCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(418),
		),
		getOrgUnitIdRubrics: createD2lRouteEndpoint(getD2lRoute(419)),
		postOrgUnitIdRubrics: createD2lRouteEndpoint(getD2lRoute(420)),
		deleteOrgUnitIdRubricsRubricId: createD2lRouteEndpoint(getD2lRoute(421)),
		getOrgUnitIdRubricsRubricId: createD2lRouteEndpoint(getD2lRoute(422)),
		putOrgUnitIdRubricsRubricId: createD2lRouteEndpoint(getD2lRoute(423)),
		getOrgUnitIdRubricsAssociations: createD2lRouteEndpoint(getD2lRoute(424)),
		getOrgUnitIdRubricsAssociationsActivityActivityTypeObjectId:
			createD2lRouteEndpoint(getD2lRoute(425)),
		postOrgUnitIdRubricsAssociationsActivityActivityTypeObjectId:
			createD2lRouteEndpoint(getD2lRoute(426)),
		putOrgUnitIdRubricsInfoRubricId: createD2lRouteEndpoint(getD2lRoute(427)),
		getOrgUnitIdSurveys: createD2lRouteEndpoint(getD2lRoute(428)),
		postOrgUnitIdSurveys: createD2lRouteEndpoint(getD2lRoute(429)),
		deleteOrgUnitIdSurveysSurveyId: createD2lRouteEndpoint(getD2lRoute(430)),
		getOrgUnitIdSurveysSurveyId: createD2lRouteEndpoint(getD2lRoute(431)),
		putOrgUnitIdSurveysSurveyId: createD2lRouteEndpoint(getD2lRoute(432)),
		getOrgUnitIdSurveysSurveyIdAccess: createD2lRouteEndpoint(getD2lRoute(433)),
		getOrgUnitIdSurveysSurveyIdAttempts: createD2lRouteEndpoint(
			getD2lRoute(434),
		),
		getOrgUnitIdSurveysSurveyIdAttemptsAttemptId: createD2lRouteEndpoint(
			getD2lRoute(435),
		),
		getOrgUnitIdSurveysSurveyIdQuestions: createD2lRouteEndpoint(
			getD2lRoute(436),
		),
		getOrgUnitIdSurveysSurveyIdSpecialaccess: createD2lRouteEndpoint(
			getD2lRoute(437),
		),
		deleteOrgUnitIdSurveysSurveyIdSpecialaccessUserId: createD2lRouteEndpoint(
			getD2lRoute(438),
		),
		getOrgUnitIdSurveysSurveyIdSpecialaccessUserId: createD2lRouteEndpoint(
			getD2lRoute(439),
		),
		putOrgUnitIdSurveysSurveyIdSpecialaccessUserId: createD2lRouteEndpoint(
			getD2lRoute(440),
		),
		getOrgUnitIdSurveysCategories: createD2lRouteEndpoint(getD2lRoute(441)),
		postOrgUnitIdSurveysCategories: createD2lRouteEndpoint(getD2lRoute(442)),
		deleteOrgUnitIdSurveysCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(443),
		),
		getOrgUnitIdSurveysCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(444),
		),
		putOrgUnitIdSurveysCategoriesCategoryId: createD2lRouteEndpoint(
			getD2lRoute(445),
		),
		getOrgUnitIdUpdatesMyUpdates: createD2lRouteEndpoint(getD2lRoute(446)),
		putAccommodations: createD2lRouteEndpoint(getD2lRoute(447)),
		getAccommodationsOrgUnitIdMyaccommodations: createD2lRouteEndpoint(
			getD2lRoute(448),
		),
		getAccommodationsOrgUnitIdUsersUserId: createD2lRouteEndpoint(
			getD2lRoute(449),
		),
		getAuditingAuditeesAuditeeId: createD2lRouteEndpoint(getD2lRoute(450)),
		getAuditingAuditorsAuditorId: createD2lRouteEndpoint(getD2lRoute(451)),
		deleteAuditingAuditorsAuditorIdAuditees: createD2lRouteEndpoint(
			getD2lRoute(452),
		),
		getAuditingAuditorsAuditorIdAuditees: createD2lRouteEndpoint(
			getD2lRoute(453),
		),
		postAuditingAuditorsAuditorIdAuditees: createD2lRouteEndpoint(
			getD2lRoute(454),
		),
		getCalendarEventsUserIdItemCounts: createD2lRouteEndpoint(getD2lRoute(455)),
		getCalendarEventsMyEvents: createD2lRouteEndpoint(getD2lRoute(456)),
		getCalendarEventsMyEventsItemCounts: createD2lRouteEndpoint(
			getD2lRoute(457),
		),
		getCalendarEventsMyEventsWithOccurrences: createD2lRouteEndpoint(
			getD2lRoute(458),
		),
		getCcbLogs: createD2lRouteEndpoint(getD2lRoute(459)),
		getContentCompletionsUserId: createD2lRouteEndpoint(getD2lRoute(460)),
		getContentItemsUserId: createD2lRouteEndpoint(getD2lRoute(461)),
		getContentMyItems: createD2lRouteEndpoint(getD2lRoute(462)),
		getContentMyItemsCompletions: createD2lRouteEndpoint(getD2lRoute(463)),
		getContentMyItemsCompletionsDue: createD2lRouteEndpoint(getD2lRoute(464)),
		getContentMyItemsDue: createD2lRouteEndpoint(getD2lRoute(465)),
		getContentMyItemsDueItemCounts: createD2lRouteEndpoint(getD2lRoute(466)),
		getContentMyItemsItemCounts: createD2lRouteEndpoint(getD2lRoute(467)),
		getCpdCategoryCategoryId: createD2lRouteEndpoint(getD2lRoute(468)),
		getCpdMethodMethodId: createD2lRouteEndpoint(getD2lRoute(469)),
		getCpdQuestionQuestionId: createD2lRouteEndpoint(getD2lRoute(470)),
		getCpdRecordRecordId: createD2lRouteEndpoint(getD2lRoute(471)),
		putCpdRecordRecordId: createD2lRouteEndpoint(getD2lRoute(472)),
		getCpdRecordRecordIdAttachmentAttachmentId: createD2lRouteEndpoint(
			getD2lRoute(473),
		),
		postCpdRecordRecordIdAttachmentUpload: createD2lRouteEndpoint(
			getD2lRoute(474),
		),
		deleteCpdRecordRecordIdAttachments: createD2lRouteEndpoint(
			getD2lRoute(475),
		),
		postCpdRecordRecordIdAttachments: createD2lRouteEndpoint(getD2lRoute(476)),
		getCpdRecordUserUserId: createD2lRouteEndpoint(getD2lRoute(477)),
		getCpdTargetProgressUserUserId: createD2lRouteEndpoint(getD2lRoute(478)),
		postCpdUserUserIdRecord: createD2lRouteEndpoint(getD2lRoute(479)),
		getDropboxOrgUnitsFeedback: createD2lRouteEndpoint(getD2lRoute(480)),
		getGradesCourseCompletionUserId: createD2lRouteEndpoint(getD2lRoute(481)),
		getGradesFinalValuesMyGradeValues: createD2lRouteEndpoint(getD2lRoute(482)),
		getGradesValuesUserId: createD2lRouteEndpoint(getD2lRoute(483)),
		postImportOrgUnitIdCopy: createD2lRouteEndpoint(getD2lRoute(484)),
		getImportOrgUnitIdCopyJobToken: createD2lRouteEndpoint(getD2lRoute(485)),
		postImportOrgUnitIdImports: createD2lRouteEndpoint(getD2lRoute(486)),
		getImportOrgUnitIdImportsJobToken: createD2lRouteEndpoint(getD2lRoute(487)),
		getImportOrgUnitidImportsJobTokenLogs: createD2lRouteEndpoint(
			getD2lRoute(488),
		),
		getLoAlignmentsOutcomeOutcomeId: createD2lRouteEndpoint(getD2lRoute(489)),
		getLoAlignmentsOutcomeSetOutcomeSetId: createD2lRouteEndpoint(
			getD2lRoute(490),
		),
		postLoBulkExport: createD2lRouteEndpoint(getD2lRoute(491)),
		postLoBulkImport: createD2lRouteEndpoint(getD2lRoute(492)),
		getLoOutcomeScales: createD2lRouteEndpoint(getD2lRoute(493)),
		postLoOutcomeScales: createD2lRouteEndpoint(getD2lRoute(494)),
		deleteLoOutcomeScalesScaleId: createD2lRouteEndpoint(getD2lRoute(495)),
		getLoOutcomeScalesScaleId: createD2lRouteEndpoint(getD2lRoute(496)),
		putLoOutcomeScalesScaleId: createD2lRouteEndpoint(getD2lRoute(497)),
		putLoOutcomeScalesScaleIdLevelId: createD2lRouteEndpoint(getD2lRoute(498)),
		getLoOutcomeSets: createD2lRouteEndpoint(getD2lRoute(499)),
		postLoOutcomeSets: createD2lRouteEndpoint(getD2lRoute(500)),
		deleteLoOutcomeSetsOutcomeSetId: createD2lRouteEndpoint(getD2lRoute(501)),
		getLoOutcomeSetsOutcomeSetId: createD2lRouteEndpoint(getD2lRoute(502)),
		putLoOutcomeSetsOutcomeSetId: createD2lRouteEndpoint(getD2lRoute(503)),
		deleteLockerMyLockerPath: createD2lRouteEndpoint(getD2lRoute(504)),
		getLockerMyLockerPath: createD2lRouteEndpoint(getD2lRoute(505)),
		postLockerMyLockerPath: createD2lRouteEndpoint(getD2lRoute(506)),
		putLockerMyLockerPath: createD2lRouteEndpoint(getD2lRoute(507)),
		deleteLockerUserUserIdPath: createD2lRouteEndpoint(getD2lRoute(508)),
		getLockerUserUserIdPath: createD2lRouteEndpoint(getD2lRoute(509)),
		postLockerUserUserIdPath: createD2lRouteEndpoint(getD2lRoute(510)),
		putLockerUserUserIdPath: createD2lRouteEndpoint(getD2lRoute(511)),
		deleteLtiLinkLtiLinkId: createD2lRouteEndpoint(getD2lRoute(512)),
		putLtiLinkLtiLinkId: createD2lRouteEndpoint(getD2lRoute(513)),
		postLtiLinkOrgUnitId: createD2lRouteEndpoint(getD2lRoute(514)),
		getLtiLinkOrgUnitId: createD2lRouteEndpoint(getD2lRoute(515)),
		deleteLtiLinkOrgUnitIdLinkIdSharing: createD2lRouteEndpoint(
			getD2lRoute(516),
		),
		getLtiLinkOrgUnitIdLinkIdSharing: createD2lRouteEndpoint(getD2lRoute(517)),
		postLtiLinkOrgUnitIdLinkIdSharing: createD2lRouteEndpoint(getD2lRoute(518)),
		deleteLtiLinkOrgUnitIdLinkIdSharingSharingOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(519),
		),
		putLtiLinkOrgUnitIdLinkIdSharingSharingOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(520),
		),
		getLtiLinkOrgUnitIdLtiLinkId: createD2lRouteEndpoint(getD2lRoute(521)),
		postLtiQuicklinkOrgUnitIdLtiLinkId: createD2lRouteEndpoint(
			getD2lRoute(522),
		),
		postLtiTpOrgUnitId: createD2lRouteEndpoint(getD2lRoute(523)),
		getLtiTpOrgUnitId: createD2lRouteEndpoint(getD2lRoute(524)),
		getLtiTpOrgUnitIdTpId: createD2lRouteEndpoint(getD2lRoute(525)),
		deleteLtiTpOrgUnitIdTpIdSharing: createD2lRouteEndpoint(getD2lRoute(526)),
		getLtiTpOrgUnitIdTpIdSharing: createD2lRouteEndpoint(getD2lRoute(527)),
		postLtiTpOrgUnitIdTpIdSharing: createD2lRouteEndpoint(getD2lRoute(528)),
		deleteLtiTpOrgUnitIdTpIdSharingSharingOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(529),
		),
		putLtiTpOrgUnitIdTpIdSharingSharingOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(530),
		),
		deleteLtiTpTpId: createD2lRouteEndpoint(getD2lRoute(531)),
		putLtiTpTpId: createD2lRouteEndpoint(getD2lRoute(532)),
		getLtiadvantageDeployment: createD2lRouteEndpoint(getD2lRoute(533)),
		postLtiadvantageDeployment: createD2lRouteEndpoint(getD2lRoute(534)),
		deleteLtiadvantageDeploymentDeploymentId: createD2lRouteEndpoint(
			getD2lRoute(535),
		),
		getLtiadvantageDeploymentDeploymentId: createD2lRouteEndpoint(
			getD2lRoute(536),
		),
		putLtiadvantageDeploymentDeploymentId: createD2lRouteEndpoint(
			getD2lRoute(537),
		),
		getLtiadvantageDeploymentDeploymentIdAssetprocessors:
			createD2lRouteEndpoint(getD2lRoute(538)),
		getLtiadvantageDeploymentDeploymentIdLinksSummaries: createD2lRouteEndpoint(
			getD2lRoute(539),
		),
		deleteLtiadvantageDeploymentDeploymentIdSharing: createD2lRouteEndpoint(
			getD2lRoute(540),
		),
		getLtiadvantageDeploymentDeploymentIdSharing: createD2lRouteEndpoint(
			getD2lRoute(541),
		),
		postLtiadvantageDeploymentDeploymentIdSharing: createD2lRouteEndpoint(
			getD2lRoute(542),
		),
		deleteLtiadvantageDeploymentDeploymentIdSharingSharingOrgUnitId:
			createD2lRouteEndpoint(getD2lRoute(543)),
		putLtiadvantageDeploymentDeploymentIdSharingSharingOrgUnitId:
			createD2lRouteEndpoint(getD2lRoute(544)),
		getLtiadvantageLinksOrganization: createD2lRouteEndpoint(getD2lRoute(545)),
		postLtiadvantageLinksOrganization: createD2lRouteEndpoint(getD2lRoute(546)),
		deleteLtiadvantageLinksOrganizationLinkId: createD2lRouteEndpoint(
			getD2lRoute(547),
		),
		getLtiadvantageLinksOrganizationLinkId: createD2lRouteEndpoint(
			getD2lRoute(548),
		),
		putLtiadvantageLinksOrganizationLinkId: createD2lRouteEndpoint(
			getD2lRoute(549),
		),
		getLtiadvantageLinksOrgunitOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(550),
		),
		postLtiadvantageLinksOrgunitOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(551),
		),
		deleteLtiadvantageLinksOrgunitOrgUnitIdLinkId: createD2lRouteEndpoint(
			getD2lRoute(552),
		),
		getLtiadvantageLinksOrgunitOrgUnitIdLinkId: createD2lRouteEndpoint(
			getD2lRoute(553),
		),
		putLtiadvantageLinksOrgunitOrgUnitIdLinkId: createD2lRouteEndpoint(
			getD2lRoute(554),
		),
		getLtiadvantageMigrationJobs: createD2lRouteEndpoint(getD2lRoute(555)),
		postLtiadvantageMigrationJobs: createD2lRouteEndpoint(getD2lRoute(556)),
		getLtiadvantageMigrationJobsJobId: createD2lRouteEndpoint(getD2lRoute(557)),
		postLtiadvantageMigrationLinksLinkId: createD2lRouteEndpoint(
			getD2lRoute(558),
		),
		deleteLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorId:
			createD2lRouteEndpoint(getD2lRoute(559)),
		getLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorId:
			createD2lRouteEndpoint(getD2lRoute(560)),
		putLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorIdStatus:
			createD2lRouteEndpoint(getD2lRoute(561)),
		getLtiadvantageOrgunitOrgUnitIdAssetprocessors: createD2lRouteEndpoint(
			getD2lRoute(562),
		),
		getLtiadvantageRegistration: createD2lRouteEndpoint(getD2lRoute(563)),
		postLtiadvantageRegistration: createD2lRouteEndpoint(getD2lRoute(564)),
		deleteLtiadvantageRegistrationClientId: createD2lRouteEndpoint(
			getD2lRoute(565),
		),
		getLtiadvantageRegistrationClientId: createD2lRouteEndpoint(
			getD2lRoute(566),
		),
		putLtiadvantageRegistrationClientId: createD2lRouteEndpoint(
			getD2lRoute(567),
		),
		getLtiadvantageRegistrationClientIdLegacydomains: createD2lRouteEndpoint(
			getD2lRoute(568),
		),
		postLtiadvantageRegistrationClientIdLegacydomains: createD2lRouteEndpoint(
			getD2lRoute(569),
		),
		putLtiadvantageRegistrationClientIdLegacydomains: createD2lRouteEndpoint(
			getD2lRoute(570),
		),
		getNewsUserUserId: createD2lRouteEndpoint(getD2lRoute(571)),
		getOverdueItems: createD2lRouteEndpoint(getD2lRoute(572)),
		getOverdueItemsMyItems: createD2lRouteEndpoint(getD2lRoute(573)),
		getUpdatesMyUpdates: createD2lRouteEndpoint(getD2lRoute(574)),
		getUserIdentifiersTypes: createD2lRouteEndpoint(getD2lRoute(575)),
		postUserIdentifiersTypes: createD2lRouteEndpoint(getD2lRoute(576)),
		deleteUserIdentifiersTypesType: createD2lRouteEndpoint(getD2lRoute(577)),
		putUserIdentifiersTypesType: createD2lRouteEndpoint(getD2lRoute(578)),
		putUserIdentifiersUsersUserId: createD2lRouteEndpoint(getD2lRoute(579)),
		getUserIdentifiersUsersUserId: createD2lRouteEndpoint(getD2lRoute(580)),
		postIpsisUploadSourceSystemIdSignedurl: createD2lRouteEndpoint(
			getD2lRoute(581),
		),
	},
	learningObjectRepository: {
		postRepositoryIdUpload: createD2lRouteEndpoint(getD2lRoute(582)),
		postRepositoryIdUploadPublish: createD2lRouteEndpoint(getD2lRoute(583)),
		putRepositoryIdUploadPublishObjectId: createD2lRouteEndpoint(
			getD2lRoute(584),
		),
		putObjects: createD2lRouteEndpoint(getD2lRoute(585)),
		postObjectsObjectId: createD2lRouteEndpoint(getD2lRoute(586)),
		getObjectsObjectIdObjectVersionDownload: createD2lRouteEndpoint(
			getD2lRoute(587),
		),
		getObjectsObjectIdObjectVersionDownloadfile: createD2lRouteEndpoint(
			getD2lRoute(588),
		),
		getObjectsObjectIdObjectVersionLink: createD2lRouteEndpoint(
			getD2lRoute(589),
		),
		getObjectsObjectIdObjectVersionMetadata: createD2lRouteEndpoint(
			getD2lRoute(590),
		),
		getObjectsObjectIdObjectVersionProperties: createD2lRouteEndpoint(
			getD2lRoute(591),
		),
		postObjectsObjectIdObjectVersionProperties: createD2lRouteEndpoint(
			getD2lRoute(592),
		),
		postObjectsObjectIdDelete: createD2lRouteEndpoint(getD2lRoute(593)),
		getObjectsObjectIdDownload: createD2lRouteEndpoint(getD2lRoute(594)),
		getObjectsObjectIdDownloadfile: createD2lRouteEndpoint(getD2lRoute(595)),
		getObjectsObjectIdLink: createD2lRouteEndpoint(getD2lRoute(596)),
		getObjectsObjectIdProperties: createD2lRouteEndpoint(getD2lRoute(597)),
		postObjectsObjectIdProperties: createD2lRouteEndpoint(getD2lRoute(598)),
		getObjectsSearch: createD2lRouteEndpoint(getD2lRoute(599)),
		getRepositoriesType: createD2lRouteEndpoint(getD2lRoute(600)),
		getRepositoriesAll: createD2lRouteEndpoint(getD2lRoute(601)),
		getRepositoryRepositoryIdListorgUnittrusts: createD2lRouteEndpoint(
			getD2lRoute(602),
		),
	},
	learningPlatform: {
		postGaeVersionLinkuser: createD2lRouteEndpoint(getD2lRoute(603)),
		getOrgUnitIdConditionalReleaseConditionsTargetTypeTargetId:
			createD2lRouteEndpoint(getD2lRoute(604)),
		putOrgUnitIdConditionalReleaseConditionsTargetTypeTargetId:
			createD2lRouteEndpoint(getD2lRoute(605)),
		getOrgUnitIdGroupcategories: createD2lRouteEndpoint(getD2lRoute(606)),
		postOrgUnitIdGroupcategories: createD2lRouteEndpoint(getD2lRoute(607)),
		deleteOrgUnitIdGroupcategoriesGroupCategoryId: createD2lRouteEndpoint(
			getD2lRoute(608),
		),
		getOrgUnitIdGroupcategoriesGroupCategoryId: createD2lRouteEndpoint(
			getD2lRoute(609),
		),
		putOrgUnitIdGroupcategoriesGroupCategoryId: createD2lRouteEndpoint(
			getD2lRoute(610),
		),
		getOrgUnitIdGroupcategoriesGroupCategoryIdGroups: createD2lRouteEndpoint(
			getD2lRoute(611),
		),
		postOrgUnitIdGroupcategoriesGroupCategoryIdGroups: createD2lRouteEndpoint(
			getD2lRoute(612),
		),
		deleteOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId:
			createD2lRouteEndpoint(getD2lRoute(613)),
		getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId:
			createD2lRouteEndpoint(getD2lRoute(614)),
		putOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId:
			createD2lRouteEndpoint(getD2lRoute(615)),
		getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollments:
			createD2lRouteEndpoint(getD2lRoute(616)),
		postOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollments:
			createD2lRouteEndpoint(getD2lRoute(617)),
		deleteOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollmentsUserId:
			createD2lRouteEndpoint(getD2lRoute(618)),
		getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdNoenrollments:
			createD2lRouteEndpoint(getD2lRoute(619)),
		getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsEnrollments:
			createD2lRouteEndpoint(getD2lRoute(620)),
		getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsPaged:
			createD2lRouteEndpoint(getD2lRoute(621)),
		getOrgUnitIdGroupcategoriesGroupCategoryIdLocker: createD2lRouteEndpoint(
			getD2lRoute(622),
		),
		postOrgUnitIdGroupcategoriesGroupCategoryIdLocker: createD2lRouteEndpoint(
			getD2lRoute(623),
		),
		getOrgUnitIdGroupcategoriesGroupCategoryIdStatus: createD2lRouteEndpoint(
			getD2lRoute(624),
		),
		getOrgUnitIdGroups: createD2lRouteEndpoint(getD2lRoute(625)),
		getOrgUnitIdGroupsSelfEnrollmentAvailable: createD2lRouteEndpoint(
			getD2lRoute(626),
		),
		getOrgUnitIdManagefiles: createD2lRouteEndpoint(getD2lRoute(627)),
		deleteOrgUnitIdManagefilesFile: createD2lRouteEndpoint(getD2lRoute(628)),
		getOrgUnitIdManagefilesFile: createD2lRouteEndpoint(getD2lRoute(629)),
		postOrgUnitIdManagefilesFileSave: createD2lRouteEndpoint(getD2lRoute(630)),
		postOrgUnitIdManagefilesFileUpload: createD2lRouteEndpoint(
			getD2lRoute(631),
		),
		deleteOrgUnitIdManagefilesFolder: createD2lRouteEndpoint(getD2lRoute(632)),
		postOrgUnitIdManagefilesFolder: createD2lRouteEndpoint(getD2lRoute(633)),
		getOrgUnitIdRoles: createD2lRouteEndpoint(getD2lRoute(634)),
		getOrgUnitIdSections: createD2lRouteEndpoint(getD2lRoute(635)),
		postOrgUnitIdSections: createD2lRouteEndpoint(getD2lRoute(636)),
		putOrgUnitIdSections: createD2lRouteEndpoint(getD2lRoute(637)),
		deleteOrgUnitIdSectionsSectionId: createD2lRouteEndpoint(getD2lRoute(638)),
		getOrgUnitIdSectionsSectionId: createD2lRouteEndpoint(getD2lRoute(639)),
		putOrgUnitIdSectionsSectionId: createD2lRouteEndpoint(getD2lRoute(640)),
		getOrgUnitIdSectionsSectionIdEnrollments: createD2lRouteEndpoint(
			getD2lRoute(641),
		),
		postOrgUnitIdSectionsSectionIdEnrollments: createD2lRouteEndpoint(
			getD2lRoute(642),
		),
		getOrgUnitIdSectionsSectionIdNoenrollments: createD2lRouteEndpoint(
			getD2lRoute(643),
		),
		getOrgUnitIdSectionsEnrollments: createD2lRouteEndpoint(getD2lRoute(644)),
		getOrgUnitIdSectionsMysections: createD2lRouteEndpoint(getD2lRoute(645)),
		getOrgUnitIdSectionsPaged: createD2lRouteEndpoint(getD2lRoute(646)),
		getOrgUnitIdSectionsSettings: createD2lRouteEndpoint(getD2lRoute(647)),
		postOrgUnitIdSectionsSettings: createD2lRouteEndpoint(getD2lRoute(648)),
		putOrgUnitIdSectionsSettings: createD2lRouteEndpoint(getD2lRoute(649)),
		deleteOrgUnitIdWidgetdataCustomWidgetId: createD2lRouteEndpoint(
			getD2lRoute(650),
		),
		getOrgUnitIdWidgetdataCustomWidgetId: createD2lRouteEndpoint(
			getD2lRoute(651),
		),
		putOrgUnitIdWidgetdataCustomWidgetId: createD2lRouteEndpoint(
			getD2lRoute(652),
		),
		deleteOrgUnitIdWidgetdataCustomWidgetIdUserId: createD2lRouteEndpoint(
			getD2lRoute(653),
		),
		getOrgUnitIdWidgetdataCustomWidgetIdUserId: createD2lRouteEndpoint(
			getD2lRoute(654),
		),
		putOrgUnitIdWidgetdataCustomWidgetIdUserId: createD2lRouteEndpoint(
			getD2lRoute(655),
		),
		deleteOrgUnitIdWidgetdataCustomWidgetIdMydata: createD2lRouteEndpoint(
			getD2lRoute(656),
		),
		getOrgUnitIdWidgetdataCustomWidgetIdMydata: createD2lRouteEndpoint(
			getD2lRoute(657),
		),
		putOrgUnitIdWidgetdataCustomWidgetIdMydata: createD2lRouteEndpoint(
			getD2lRoute(658),
		),
		getAccountSettingsUserIdLocale: createD2lRouteEndpoint(getD2lRoute(659)),
		putAccountSettingsUserIdLocale: createD2lRouteEndpoint(getD2lRoute(660)),
		getAccountSettingsMySettingsLocale: createD2lRouteEndpoint(
			getD2lRoute(661),
		),
		putAccountSettingsMySettingsLocale: createD2lRouteEndpoint(
			getD2lRoute(662),
		),
		getAlertsUserUserId: createD2lRouteEndpoint(getD2lRoute(663)),
		getAttributesSchemas: createD2lRouteEndpoint(getD2lRoute(664)),
		deleteAttributesUsersUserId: createD2lRouteEndpoint(getD2lRoute(665)),
		getAttributesUsersUserId: createD2lRouteEndpoint(getD2lRoute(666)),
		putAttributesUsersUserId: createD2lRouteEndpoint(getD2lRoute(667)),
		getAuthSoaptoken: createD2lRouteEndpoint(getD2lRoute(668)),
		getConfigVariablesVariableIdDefinition: createD2lRouteEndpoint(
			getD2lRoute(669),
		),
		getConfigVariablesVariableIdEffectiveValuesOrgUnitsOrgUnitId:
			createD2lRouteEndpoint(getD2lRoute(670)),
		deleteConfigVariablesVariableIdResolver: createD2lRouteEndpoint(
			getD2lRoute(671),
		),
		getConfigVariablesVariableIdResolver: createD2lRouteEndpoint(
			getD2lRoute(672),
		),
		putConfigVariablesVariableIdResolver: createD2lRouteEndpoint(
			getD2lRoute(673),
		),
		getConfigVariablesVariableIdValues: createD2lRouteEndpoint(
			getD2lRoute(674),
		),
		getConfigVariablesVariableIdValuesOrg: createD2lRouteEndpoint(
			getD2lRoute(675),
		),
		putConfigVariablesVariableIdValuesOrg: createD2lRouteEndpoint(
			getD2lRoute(676),
		),
		getConfigVariablesVariableIdValuesOrgUnits: createD2lRouteEndpoint(
			getD2lRoute(677),
		),
		getConfigVariablesVariableIdValuesOrgUnitsOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(678),
		),
		putConfigVariablesVariableIdValuesOrgUnitsOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(679),
		),
		getConfigVariablesVariableIdValuesRoles: createD2lRouteEndpoint(
			getD2lRoute(680),
		),
		getConfigVariablesVariableIdValuesRolesRoleId: createD2lRouteEndpoint(
			getD2lRoute(681),
		),
		putConfigVariablesVariableIdValuesRolesRoleId: createD2lRouteEndpoint(
			getD2lRoute(682),
		),
		getConfigVariablesVariableIdValuesSystem: createD2lRouteEndpoint(
			getD2lRoute(683),
		),
		putConfigVariablesVariableIdValuesSystem: createD2lRouteEndpoint(
			getD2lRoute(684),
		),
		getConfigVariablesDefinitions: createD2lRouteEndpoint(getD2lRoute(685)),
		postCourses: createD2lRouteEndpoint(getD2lRoute(686)),
		deleteCoursesOrgUnitId: createD2lRouteEndpoint(getD2lRoute(687)),
		getCoursesOrgUnitId: createD2lRouteEndpoint(getD2lRoute(688)),
		putCoursesOrgUnitId: createD2lRouteEndpoint(getD2lRoute(689)),
		getCoursesOrgUnitIdImage: createD2lRouteEndpoint(getD2lRoute(690)),
		putCoursesOrgUnitIdImage: createD2lRouteEndpoint(getD2lRoute(691)),
		getCoursesBulkUpdateJobTokenId: createD2lRouteEndpoint(getD2lRoute(692)),
		getCoursesParentorgunits: createD2lRouteEndpoint(getD2lRoute(693)),
		getCoursesParents: createD2lRouteEndpoint(getD2lRoute(694)),
		getCoursesQuery: createD2lRouteEndpoint(getD2lRoute(695)),
		getCoursesSchema: createD2lRouteEndpoint(getD2lRoute(696)),
		postCoursesUpdate: createD2lRouteEndpoint(getD2lRoute(697)),
		postCoursetemplates: createD2lRouteEndpoint(getD2lRoute(698)),
		deleteCoursetemplatesOrgUnitId: createD2lRouteEndpoint(getD2lRoute(699)),
		getCoursetemplatesOrgUnitId: createD2lRouteEndpoint(getD2lRoute(700)),
		putCoursetemplatesOrgUnitId: createD2lRouteEndpoint(getD2lRoute(701)),
		getCoursetemplatesSchema: createD2lRouteEndpoint(getD2lRoute(702)),
		getDataExportBds: createD2lRouteEndpoint(getD2lRoute(703)),
		getDataExportBdsPluginidIdentifier: createD2lRouteEndpoint(
			getD2lRoute(704),
		),
		getDataExportBdsDownloadPluginid: createD2lRouteEndpoint(getD2lRoute(705)),
		getDataExportBdsList: createD2lRouteEndpoint(getD2lRoute(706)),
		postDataExportCreate: createD2lRouteEndpoint(getD2lRoute(707)),
		getDataExportDownloadExportJobId: createD2lRouteEndpoint(getD2lRoute(708)),
		getDataExportJobs: createD2lRouteEndpoint(getD2lRoute(709)),
		getDataExportJobsExportJobId: createD2lRouteEndpoint(getD2lRoute(710)),
		getDataExportList: createD2lRouteEndpoint(getD2lRoute(711)),
		getDataExportListDataSetId: createD2lRouteEndpoint(getD2lRoute(712)),
		getDataExportVersion: createD2lRouteEndpoint(getD2lRoute(713)),
		getDatasetsBds: createD2lRouteEndpoint(getD2lRoute(714)),
		getDatasetsBdsSchemaIdExtracts: createD2lRouteEndpoint(getD2lRoute(715)),
		getDatasetsBdsSchemaIdPluginsPluginIdExtracts: createD2lRouteEndpoint(
			getD2lRoute(716),
		),
		getDatasetsBdsSchemaIdPluginsPluginIdExtractsExtractId:
			createD2lRouteEndpoint(getD2lRoute(717)),
		getDemographicsDataTypes: createD2lRouteEndpoint(getD2lRoute(718)),
		getDemographicsDataTypesDataTypeId: createD2lRouteEndpoint(
			getD2lRoute(719),
		),
		getDemographicsFields: createD2lRouteEndpoint(getD2lRoute(720)),
		postDemographicsFields: createD2lRouteEndpoint(getD2lRoute(721)),
		deleteDemographicsFieldsFieldId: createD2lRouteEndpoint(getD2lRoute(722)),
		getDemographicsFieldsFieldId: createD2lRouteEndpoint(getD2lRoute(723)),
		putDemographicsFieldsFieldId: createD2lRouteEndpoint(getD2lRoute(724)),
		getDemographicsOrgUnitsOrgUnitIdUsers: createD2lRouteEndpoint(
			getD2lRoute(725),
		),
		getDemographicsOrgUnitsOrgUnitIdUsersUserId: createD2lRouteEndpoint(
			getD2lRoute(726),
		),
		getDemographicsUsers: createD2lRouteEndpoint(getD2lRoute(727)),
		deleteDemographicsUsersUserId: createD2lRouteEndpoint(getD2lRoute(728)),
		getDemographicsUsersUserId: createD2lRouteEndpoint(getD2lRoute(729)),
		putDemographicsUsersUserId: createD2lRouteEndpoint(getD2lRoute(730)),
		postEnrollments: createD2lRouteEndpoint(getD2lRoute(731)),
		postEnrollmentsBatch: createD2lRouteEndpoint(getD2lRoute(732)),
		getEnrollmentsMyenrollments: createD2lRouteEndpoint(getD2lRoute(733)),
		getEnrollmentsMyenrollmentsOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(734),
		),
		getEnrollmentsMyenrollmentsOrgUnitIdAccess: createD2lRouteEndpoint(
			getD2lRoute(735),
		),
		getEnrollmentsMyenrollmentsOrgUnitIdParentOrgUnits: createD2lRouteEndpoint(
			getD2lRoute(736),
		),
		deleteEnrollmentsMyenrollmentsOrgUnitIdPin: createD2lRouteEndpoint(
			getD2lRoute(737),
		),
		postEnrollmentsMyenrollmentsOrgUnitIdPin: createD2lRouteEndpoint(
			getD2lRoute(738),
		),
		getEnrollmentsOrgUnitsOrgUnitIdUsers: createD2lRouteEndpoint(
			getD2lRoute(739),
		),
		deleteEnrollmentsOrgUnitsOrgUnitIdUsersUserId: createD2lRouteEndpoint(
			getD2lRoute(740),
		),
		getEnrollmentsOrgUnitsOrgUnitIdUsersUserId: createD2lRouteEndpoint(
			getD2lRoute(741),
		),
		getEnrollmentsOrgUnitsOrgUnitIdUsersUserIdCompletion:
			createD2lRouteEndpoint(getD2lRoute(742)),
		putEnrollmentsOrgUnitsOrgUnitIdUsersUserIdCompletion:
			createD2lRouteEndpoint(getD2lRoute(743)),
		deleteEnrollmentsOrgUnitsOrgUnitIdUsersUserIdPin: createD2lRouteEndpoint(
			getD2lRoute(744),
		),
		postEnrollmentsOrgUnitsOrgUnitIdUsersUserIdPin: createD2lRouteEndpoint(
			getD2lRoute(745),
		),
		getEnrollmentsUsersUserIdOrgUnits: createD2lRouteEndpoint(getD2lRoute(746)),
		deleteEnrollmentsUsersUserIdOrgUnitsOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(747),
		),
		getEnrollmentsUsersUserIdOrgUnitsOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(748),
		),
		getFeed: createD2lRouteEndpoint(getD2lRoute(749)),
		putForceLogoutUserId: createD2lRouteEndpoint(getD2lRoute(750)),
		getGlobalusermappingIdentifiersIdentifier: createD2lRouteEndpoint(
			getD2lRoute(751),
		),
		deleteGlobalusermappingUsersUserid: createD2lRouteEndpoint(
			getD2lRoute(752),
		),
		getGlobalusermappingUsersUserid: createD2lRouteEndpoint(getD2lRoute(753)),
		putGlobalusermappingUsersUserid: createD2lRouteEndpoint(getD2lRoute(754)),
		getImsconfigMapRoles: createD2lRouteEndpoint(getD2lRoute(755)),
		getImsconfigMapRolesRoleId: createD2lRouteEndpoint(getD2lRoute(756)),
		putImsconfigMapRolesRoleId: createD2lRouteEndpoint(getD2lRoute(757)),
		getImsconfigRoles: createD2lRouteEndpoint(getD2lRoute(758)),
		getLanguage: createD2lRouteEndpoint(getD2lRoute(759)),
		deleteLocalauthenticationsecurityOverrides: createD2lRouteEndpoint(
			getD2lRoute(760),
		),
		getLocalauthenticationsecurityOverrides: createD2lRouteEndpoint(
			getD2lRoute(761),
		),
		postLocalauthenticationsecurityOverrides: createD2lRouteEndpoint(
			getD2lRoute(762),
		),
		getLocales: createD2lRouteEndpoint(getD2lRoute(763)),
		getLocalesLocaleId: createD2lRouteEndpoint(getD2lRoute(764)),
		getLogging: createD2lRouteEndpoint(getD2lRoute(765)),
		getLoggingLogMessageId: createD2lRouteEndpoint(getD2lRoute(766)),
		getLoggingGrouped: createD2lRouteEndpoint(getD2lRoute(767)),
		getNotificationsInstantCarriers: createD2lRouteEndpoint(getD2lRoute(768)),
		getNotificationsInstantCarriersCarrierIdSubscriptions:
			createD2lRouteEndpoint(getD2lRoute(769)),
		deleteNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeId:
			createD2lRouteEndpoint(getD2lRoute(770)),
		putNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeId:
			createD2lRouteEndpoint(getD2lRoute(771)),
		deleteNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeIdUsersUserId:
			createD2lRouteEndpoint(getD2lRoute(772)),
		putNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeIdUsersUserId:
			createD2lRouteEndpoint(getD2lRoute(773)),
		getNotificationsInstantCarriersCarrierIdSubscriptionsUsersUserId:
			createD2lRouteEndpoint(getD2lRoute(774)),
		getNotificationsInstantUsersUserIdSettings: createD2lRouteEndpoint(
			getD2lRoute(775),
		),
		putNotificationsInstantUsersUserIdSettings: createD2lRouteEndpoint(
			getD2lRoute(776),
		),
		getOrganizationInfo: createD2lRouteEndpoint(getD2lRoute(777)),
		getOrganizationPrimaryUrl: createD2lRouteEndpoint(getD2lRoute(778)),
		getOrgstructure: createD2lRouteEndpoint(getD2lRoute(779)),
		postOrgstructure: createD2lRouteEndpoint(getD2lRoute(780)),
		getOrgstructureOrgUnitId: createD2lRouteEndpoint(getD2lRoute(781)),
		putOrgstructureOrgUnitId: createD2lRouteEndpoint(getD2lRoute(782)),
		getOrgstructureOrgUnitIdAncestors: createD2lRouteEndpoint(getD2lRoute(783)),
		getOrgstructureOrgUnitIdChildren: createD2lRouteEndpoint(getD2lRoute(784)),
		postOrgstructureOrgUnitIdChildren: createD2lRouteEndpoint(getD2lRoute(785)),
		deleteOrgstructureOrgUnitIdChildrenChildOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(786),
		),
		getOrgstructureOrgUnitIdChildrenPaged: createD2lRouteEndpoint(
			getD2lRoute(787),
		),
		getOrgstructureOrgUnitIdColours: createD2lRouteEndpoint(getD2lRoute(788)),
		putOrgstructureOrgUnitIdColours: createD2lRouteEndpoint(getD2lRoute(789)),
		getOrgstructureOrgUnitIdDescendants: createD2lRouteEndpoint(
			getD2lRoute(790),
		),
		getOrgstructureOrgUnitIdDescendantsPaged: createD2lRouteEndpoint(
			getD2lRoute(791),
		),
		getOrgstructureOrgUnitIdParents: createD2lRouteEndpoint(getD2lRoute(792)),
		postOrgstructureOrgUnitIdParents: createD2lRouteEndpoint(getD2lRoute(793)),
		deleteOrgstructureOrgUnitIdParentsParentOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(794),
		),
		getOrgstructureChildless: createD2lRouteEndpoint(getD2lRoute(795)),
		getOrgstructureOrphans: createD2lRouteEndpoint(getD2lRoute(796)),
		getOrgstructureRecyclebin: createD2lRouteEndpoint(getD2lRoute(797)),
		deleteOrgstructureRecyclebinOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(798),
		),
		postOrgstructureRecyclebinOrgUnitIdRecycle: createD2lRouteEndpoint(
			getD2lRoute(799),
		),
		postOrgstructureRecyclebinOrgUnitIdRestore: createD2lRouteEndpoint(
			getD2lRoute(800),
		),
		getOutypes: createD2lRouteEndpoint(getD2lRoute(801)),
		postOutypes: createD2lRouteEndpoint(getD2lRoute(802)),
		deleteOutypesOrgUnitTypeId: createD2lRouteEndpoint(getD2lRoute(803)),
		getOutypesOrgUnitTypeId: createD2lRouteEndpoint(getD2lRoute(804)),
		postOutypesOrgUnitTypeId: createD2lRouteEndpoint(getD2lRoute(805)),
		getOutypesDepartment: createD2lRouteEndpoint(getD2lRoute(806)),
		getOutypesSemester: createD2lRouteEndpoint(getD2lRoute(807)),
		getPermissionsToolsToolIdCapabilities: createD2lRouteEndpoint(
			getD2lRoute(808),
		),
		postPermissionsToolsToolIdCapabilities: createD2lRouteEndpoint(
			getD2lRoute(809),
		),
		deletePermissionsToolsToolIdCapabilitiesCapabilityId:
			createD2lRouteEndpoint(getD2lRoute(810)),
		getPermissionsToolsToolIdClaims: createD2lRouteEndpoint(getD2lRoute(811)),
		getPermissionsToolsToolIdClaimsAllowed: createD2lRouteEndpoint(
			getD2lRoute(812),
		),
		deletePermissionsToolsToolIdClaimsAllowedGrantId: createD2lRouteEndpoint(
			getD2lRoute(813),
		),
		getPermissionsToolsToolIdClaimsAllowedGrantId: createD2lRouteEndpoint(
			getD2lRoute(814),
		),
		putPermissionsToolsToolIdClaimsAllowedGrantId: createD2lRouteEndpoint(
			getD2lRoute(815),
		),
		getPermissionsToolsToolIdClaimsMetadata: createD2lRouteEndpoint(
			getD2lRoute(816),
		),
		getPermissionsToolsToolIdClaimsMetadataClaimId: createD2lRouteEndpoint(
			getD2lRoute(817),
		),
		getProfileProfileId: createD2lRouteEndpoint(getD2lRoute(818)),
		putProfileProfileId: createD2lRouteEndpoint(getD2lRoute(819)),
		deleteProfileProfileIdImage: createD2lRouteEndpoint(getD2lRoute(820)),
		getProfileProfileIdImage: createD2lRouteEndpoint(getD2lRoute(821)),
		postProfileProfileIdImage: createD2lRouteEndpoint(getD2lRoute(822)),
		getProfileMyProfile: createD2lRouteEndpoint(getD2lRoute(823)),
		putProfileMyProfile: createD2lRouteEndpoint(getD2lRoute(824)),
		deleteProfileMyProfileImage: createD2lRouteEndpoint(getD2lRoute(825)),
		getProfileMyProfileImage: createD2lRouteEndpoint(getD2lRoute(826)),
		postProfileMyProfileImage: createD2lRouteEndpoint(getD2lRoute(827)),
		getProfileUserUserId: createD2lRouteEndpoint(getD2lRoute(828)),
		putProfileUserUserId: createD2lRouteEndpoint(getD2lRoute(829)),
		deleteProfileUserUserIdImage: createD2lRouteEndpoint(getD2lRoute(830)),
		getProfileUserUserIdImage: createD2lRouteEndpoint(getD2lRoute(831)),
		postProfileUserUserIdImage: createD2lRouteEndpoint(getD2lRoute(832)),
		getRoles: createD2lRouteEndpoint(getD2lRoute(833)),
		postRoles: createD2lRouteEndpoint(getD2lRoute(834)),
		getRolesRoleId: createD2lRouteEndpoint(getD2lRoute(835)),
		deleteSessionsUserId: createD2lRouteEndpoint(getD2lRoute(836)),
		postSourceCourses: createD2lRouteEndpoint(getD2lRoute(837)),
		getSourceCoursesOrgUnitIdCurrentReofferedCourse: createD2lRouteEndpoint(
			getD2lRoute(838),
		),
		postSourceCoursesOrgUnitIdDeploy: createD2lRouteEndpoint(getD2lRoute(839)),
		postSourceCoursesOrgUnitIdReofferCourse: createD2lRouteEndpoint(
			getD2lRoute(840),
		),
		getSourceCoursesOrgUnitIdReofferedCourses: createD2lRouteEndpoint(
			getD2lRoute(841),
		),
		getSourceCoursesCourseOfferingsOrgUnitId: createD2lRouteEndpoint(
			getD2lRoute(842),
		),
		getTimezones: createD2lRouteEndpoint(getD2lRoute(843)),
		getToolsOrg: createD2lRouteEndpoint(getD2lRoute(844)),
		getToolsOrgToolId: createD2lRouteEndpoint(getD2lRoute(845)),
		putToolsOrgToolId: createD2lRouteEndpoint(getD2lRoute(846)),
		putToolsOrgToolIdOUDefault: createD2lRouteEndpoint(getD2lRoute(847)),
		putToolsOrgToolIdOUDefaultOverride: createD2lRouteEndpoint(
			getD2lRoute(848),
		),
		getToolsOrgUnitsOrgUnitId: createD2lRouteEndpoint(getD2lRoute(849)),
		getToolsOrgUnitsOrgUnitIdToolId: createD2lRouteEndpoint(getD2lRoute(850)),
		putToolsOrgUnitsOrgUnitIdToolId: createD2lRouteEndpoint(getD2lRoute(851)),
		getToolsOrgUnitsOrgUnitIdToolNames: createD2lRouteEndpoint(
			getD2lRoute(852),
		),
		getUsers: createD2lRouteEndpoint(getD2lRoute(853)),
		postUsers: createD2lRouteEndpoint(getD2lRoute(854)),
		deleteUsersUserId: createD2lRouteEndpoint(getD2lRoute(855)),
		getUsersUserId: createD2lRouteEndpoint(getD2lRoute(856)),
		putUsersUserId: createD2lRouteEndpoint(getD2lRoute(857)),
		getUsersUserIdActivation: createD2lRouteEndpoint(getD2lRoute(858)),
		putUsersUserIdActivation: createD2lRouteEndpoint(getD2lRoute(859)),
		getUsersUserIdEnrollmentlogs: createD2lRouteEndpoint(getD2lRoute(860)),
		getUsersUserIdNames: createD2lRouteEndpoint(getD2lRoute(861)),
		putUsersUserIdNames: createD2lRouteEndpoint(getD2lRoute(862)),
		deleteUsersUserIdPassword: createD2lRouteEndpoint(getD2lRoute(863)),
		postUsersUserIdPassword: createD2lRouteEndpoint(getD2lRoute(864)),
		putUsersUserIdPassword: createD2lRouteEndpoint(getD2lRoute(865)),
		getUsersUserIdUsertrackinglogs: createD2lRouteEndpoint(getD2lRoute(866)),
		postUsersBatch: createD2lRouteEndpoint(getD2lRoute(867)),
		postUsersMerge: createD2lRouteEndpoint(getD2lRoute(868)),
		getUsersMypronouns: createD2lRouteEndpoint(getD2lRoute(869)),
		putUsersMypronouns: createD2lRouteEndpoint(getD2lRoute(870)),
		getUsersMypronounsVisibility: createD2lRouteEndpoint(getD2lRoute(871)),
		putUsersMypronounsVisibility: createD2lRouteEndpoint(getD2lRoute(872)),
		getUsersRolesStatistics: createD2lRouteEndpoint(getD2lRoute(873)),
		getUsersStatistics: createD2lRouteEndpoint(getD2lRoute(874)),
		getUsersWhoami: createD2lRouteEndpoint(getD2lRoute(875)),
	},
} as const;

import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { getD2lRoute } from '../route-definitions';
import type { d2lBrightspaceEndpointsNested } from './index';
import { createD2lRouteInputSchema, createD2lRouteOutputSchema } from './types';

export const d2lBrightspaceEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof d2lBrightspaceEndpointsNested
> = {
	'apiProperties.getProductCodeVersions': {
		input: createD2lRouteInputSchema(getD2lRoute(0)),
		output: createD2lRouteOutputSchema(getD2lRoute(0)),
	},
	'apiProperties.getProductCodeVersionsVersion': {
		input: createD2lRouteInputSchema(getD2lRoute(1)),
		output: createD2lRouteOutputSchema(getD2lRoute(1)),
	},
	'apiProperties.getVersions': {
		input: createD2lRouteInputSchema(getD2lRoute(2)),
		output: createD2lRouteOutputSchema(getD2lRoute(2)),
	},
	'apiProperties.postVersionsCheck': {
		input: createD2lRouteInputSchema(getD2lRoute(3)),
		output: createD2lRouteOutputSchema(getD2lRoute(3)),
	},
	'awardService.getAssociationsAvailableToEarn': {
		input: createD2lRouteInputSchema(getD2lRoute(6)),
		output: createD2lRouteOutputSchema(getD2lRoute(6)),
	},
	'awardService.getAwards': {
		input: createD2lRouteInputSchema(getD2lRoute(7)),
		output: createD2lRouteOutputSchema(getD2lRoute(7)),
	},
	'awardService.postAwards': {
		input: createD2lRouteInputSchema(getD2lRoute(8)),
		output: createD2lRouteOutputSchema(getD2lRoute(8)),
	},
	'awardService.deleteAwardsAwardId': {
		input: createD2lRouteInputSchema(getD2lRoute(9)),
		output: createD2lRouteOutputSchema(getD2lRoute(9)),
	},
	'awardService.getAwardsAwardId': {
		input: createD2lRouteInputSchema(getD2lRoute(10)),
		output: createD2lRouteOutputSchema(getD2lRoute(10)),
	},
	'awardService.putAwardsAwardId': {
		input: createD2lRouteInputSchema(getD2lRoute(11)),
		output: createD2lRouteOutputSchema(getD2lRoute(11)),
	},
	'awardService.getCreditSummary': {
		input: createD2lRouteInputSchema(getD2lRoute(12)),
		output: createD2lRouteOutputSchema(getD2lRoute(12)),
	},
	'awardService.deleteIssuedIssuedId': {
		input: createD2lRouteInputSchema(getD2lRoute(13)),
		output: createD2lRouteOutputSchema(getD2lRoute(13)),
	},
	'awardService.deleteIssuedIssuedIdSharingProfile': {
		input: createD2lRouteInputSchema(getD2lRoute(14)),
		output: createD2lRouteOutputSchema(getD2lRoute(14)),
	},
	'awardService.putIssuedIssuedIdSharingProfile': {
		input: createD2lRouteInputSchema(getD2lRoute(15)),
		output: createD2lRouteOutputSchema(getD2lRoute(15)),
	},
	'awardService.getIssuedCertificatesCertificateId': {
		input: createD2lRouteInputSchema(getD2lRoute(16)),
		output: createD2lRouteOutputSchema(getD2lRoute(16)),
	},
	'awardService.getIssuedCertificatesIssuedIdPdf': {
		input: createD2lRouteInputSchema(getD2lRoute(17)),
		output: createD2lRouteOutputSchema(getD2lRoute(17)),
	},
	'awardService.getIssuedUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(18)),
		output: createD2lRouteOutputSchema(getD2lRoute(18)),
	},
	'awardService.getLibraryIcons': {
		input: createD2lRouteInputSchema(getD2lRoute(19)),
		output: createD2lRouteOutputSchema(getD2lRoute(19)),
	},
	'awardService.postLibraryIcons': {
		input: createD2lRouteInputSchema(getD2lRoute(20)),
		output: createD2lRouteOutputSchema(getD2lRoute(20)),
	},
	'awardService.deleteLibraryIconsFileName': {
		input: createD2lRouteInputSchema(getD2lRoute(21)),
		output: createD2lRouteOutputSchema(getD2lRoute(21)),
	},
	'awardService.getLibraryIconsFileName': {
		input: createD2lRouteInputSchema(getD2lRoute(22)),
		output: createD2lRouteOutputSchema(getD2lRoute(22)),
	},
	'awardService.getLibraryTemplates': {
		input: createD2lRouteInputSchema(getD2lRoute(23)),
		output: createD2lRouteOutputSchema(getD2lRoute(23)),
	},
	'awardService.postLibraryTemplates': {
		input: createD2lRouteInputSchema(getD2lRoute(24)),
		output: createD2lRouteOutputSchema(getD2lRoute(24)),
	},
	'awardService.deleteLibraryTemplatesFileName': {
		input: createD2lRouteInputSchema(getD2lRoute(25)),
		output: createD2lRouteOutputSchema(getD2lRoute(25)),
	},
	'awardService.getLibraryTemplatesFileName': {
		input: createD2lRouteInputSchema(getD2lRoute(26)),
		output: createD2lRouteOutputSchema(getD2lRoute(26)),
	},
	'awardService.getOrgunitsOrgUnitIdAssociations': {
		input: createD2lRouteInputSchema(getD2lRoute(27)),
		output: createD2lRouteOutputSchema(getD2lRoute(27)),
	},
	'awardService.postOrgunitsOrgUnitIdAssociations': {
		input: createD2lRouteInputSchema(getD2lRoute(28)),
		output: createD2lRouteOutputSchema(getD2lRoute(28)),
	},
	'awardService.deleteOrgunitsOrgUnitIdAssociationsAssociationId': {
		input: createD2lRouteInputSchema(getD2lRoute(29)),
		output: createD2lRouteOutputSchema(getD2lRoute(29)),
	},
	'awardService.getOrgunitsOrgUnitIdAssociationsAssociationId': {
		input: createD2lRouteInputSchema(getD2lRoute(30)),
		output: createD2lRouteOutputSchema(getD2lRoute(30)),
	},
	'awardService.putOrgunitsOrgUnitIdAssociationsAssociationId': {
		input: createD2lRouteInputSchema(getD2lRoute(31)),
		output: createD2lRouteOutputSchema(getD2lRoute(31)),
	},
	'awardService.getOrgunitsOrgUnitIdAssociationsAvailableToManage': {
		input: createD2lRouteInputSchema(getD2lRoute(32)),
		output: createD2lRouteOutputSchema(getD2lRoute(32)),
	},
	'awardService.getOrgunitsOrgUnitIdClasslist': {
		input: createD2lRouteInputSchema(getD2lRoute(33)),
		output: createD2lRouteOutputSchema(getD2lRoute(33)),
	},
	'awardService.getOrgunitsOrgUnitIdClasslistUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(34)),
		output: createD2lRouteOutputSchema(getD2lRoute(34)),
	},
	'awardService.postOrgunitsOrgUnitIdIssued': {
		input: createD2lRouteInputSchema(getD2lRoute(35)),
		output: createD2lRouteOutputSchema(getD2lRoute(35)),
	},
	'awardService.putOrgunitsOrgUnitIdIssuedIssuedId': {
		input: createD2lRouteInputSchema(getD2lRoute(36)),
		output: createD2lRouteOutputSchema(getD2lRoute(36)),
	},
	'awardService.getOrgunitsOrgUnitIdMyConfiguration': {
		input: createD2lRouteInputSchema(getD2lRoute(37)),
		output: createD2lRouteOutputSchema(getD2lRoute(37)),
	},
	'awardService.getOrgunitsOrgUnitIdRevocableawards': {
		input: createD2lRouteInputSchema(getD2lRoute(38)),
		output: createD2lRouteOutputSchema(getD2lRoute(38)),
	},
	'awardService.getOrgunitsOrgUnitIdRevocableawardsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(39)),
		output: createD2lRouteOutputSchema(getD2lRoute(39)),
	},
	'brightspaceForParents.deleteRelationships': {
		input: createD2lRouteInputSchema(getD2lRoute(40)),
		output: createD2lRouteOutputSchema(getD2lRoute(40)),
	},
	'brightspaceForParents.putRelationships': {
		input: createD2lRouteInputSchema(getD2lRoute(41)),
		output: createD2lRouteOutputSchema(getD2lRoute(41)),
	},
	'brightspaceForParents.getRelationshipsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(42)),
		output: createD2lRouteOutputSchema(getD2lRoute(42)),
	},
	'eportfolio.getActivity': {
		input: createD2lRouteInputSchema(getD2lRoute(43)),
		output: createD2lRouteOutputSchema(getD2lRoute(43)),
	},
	'eportfolio.getActivityFilters': {
		input: createD2lRouteInputSchema(getD2lRoute(44)),
		output: createD2lRouteOutputSchema(getD2lRoute(44)),
	},
	'eportfolio.getActivityMy': {
		input: createD2lRouteInputSchema(getD2lRoute(45)),
		output: createD2lRouteOutputSchema(getD2lRoute(45)),
	},
	'eportfolio.getActivityShared': {
		input: createD2lRouteInputSchema(getD2lRoute(46)),
		output: createD2lRouteOutputSchema(getD2lRoute(46)),
	},
	'eportfolio.deleteArtifactObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(47)),
		output: createD2lRouteOutputSchema(getD2lRoute(47)),
	},
	'eportfolio.getArtifactObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(48)),
		output: createD2lRouteOutputSchema(getD2lRoute(48)),
	},
	'eportfolio.deleteArtifactFileObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(49)),
		output: createD2lRouteOutputSchema(getD2lRoute(49)),
	},
	'eportfolio.getArtifactFileObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(50)),
		output: createD2lRouteOutputSchema(getD2lRoute(50)),
	},
	'eportfolio.postArtifactFileObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(51)),
		output: createD2lRouteOutputSchema(getD2lRoute(51)),
	},
	'eportfolio.deleteArtifactLinkObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(52)),
		output: createD2lRouteOutputSchema(getD2lRoute(52)),
	},
	'eportfolio.getArtifactLinkObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(53)),
		output: createD2lRouteOutputSchema(getD2lRoute(53)),
	},
	'eportfolio.postArtifactLinkObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(54)),
		output: createD2lRouteOutputSchema(getD2lRoute(54)),
	},
	'eportfolio.postArtifactsFileNew': {
		input: createD2lRouteInputSchema(getD2lRoute(55)),
		output: createD2lRouteOutputSchema(getD2lRoute(55)),
	},
	'eportfolio.postArtifactsFileUpload': {
		input: createD2lRouteInputSchema(getD2lRoute(56)),
		output: createD2lRouteOutputSchema(getD2lRoute(56)),
	},
	'eportfolio.postArtifactsLinkNew': {
		input: createD2lRouteInputSchema(getD2lRoute(57)),
		output: createD2lRouteOutputSchema(getD2lRoute(57)),
	},
	'eportfolio.postCollectionCollectionIdAddObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(58)),
		output: createD2lRouteOutputSchema(getD2lRoute(58)),
	},
	'eportfolio.postCollectionCollectionIdRemoveObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(59)),
		output: createD2lRouteOutputSchema(getD2lRoute(59)),
	},
	'eportfolio.deleteCollectionObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(60)),
		output: createD2lRouteOutputSchema(getD2lRoute(60)),
	},
	'eportfolio.getCollectionObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(61)),
		output: createD2lRouteOutputSchema(getD2lRoute(61)),
	},
	'eportfolio.postCollectionObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(62)),
		output: createD2lRouteOutputSchema(getD2lRoute(62)),
	},
	'eportfolio.getCollectionObjectIdContents': {
		input: createD2lRouteInputSchema(getD2lRoute(63)),
		output: createD2lRouteOutputSchema(getD2lRoute(63)),
	},
	'eportfolio.postCollectionsNew': {
		input: createD2lRouteInputSchema(getD2lRoute(64)),
		output: createD2lRouteOutputSchema(getD2lRoute(64)),
	},
	'eportfolio.getDashboard': {
		input: createD2lRouteInputSchema(getD2lRoute(65)),
		output: createD2lRouteOutputSchema(getD2lRoute(65)),
	},
	'eportfolio.getDashboardFilters': {
		input: createD2lRouteInputSchema(getD2lRoute(66)),
		output: createD2lRouteOutputSchema(getD2lRoute(66)),
	},
	'eportfolio.getExportExportIdPackage': {
		input: createD2lRouteInputSchema(getD2lRoute(67)),
		output: createD2lRouteOutputSchema(getD2lRoute(67)),
	},
	'eportfolio.getExportExportIdStatus': {
		input: createD2lRouteInputSchema(getD2lRoute(68)),
		output: createD2lRouteOutputSchema(getD2lRoute(68)),
	},
	'eportfolio.postExportNew': {
		input: createD2lRouteInputSchema(getD2lRoute(69)),
		output: createD2lRouteOutputSchema(getD2lRoute(69)),
	},
	'eportfolio.postExportNewAll': {
		input: createD2lRouteInputSchema(getD2lRoute(70)),
		output: createD2lRouteOutputSchema(getD2lRoute(70)),
	},
	'eportfolio.getIgnoredusers': {
		input: createD2lRouteInputSchema(getD2lRoute(71)),
		output: createD2lRouteOutputSchema(getD2lRoute(71)),
	},
	'eportfolio.postIgnoredusersAdd': {
		input: createD2lRouteInputSchema(getD2lRoute(72)),
		output: createD2lRouteOutputSchema(getD2lRoute(72)),
	},
	'eportfolio.postIgnoredusersRemove': {
		input: createD2lRouteInputSchema(getD2lRoute(73)),
		output: createD2lRouteOutputSchema(getD2lRoute(73)),
	},
	'eportfolio.getImportImportIdStatus': {
		input: createD2lRouteInputSchema(getD2lRoute(74)),
		output: createD2lRouteOutputSchema(getD2lRoute(74)),
	},
	'eportfolio.postImportNew': {
		input: createD2lRouteInputSchema(getD2lRoute(75)),
		output: createD2lRouteOutputSchema(getD2lRoute(75)),
	},
	'eportfolio.postImportNewwithdetails': {
		input: createD2lRouteInputSchema(getD2lRoute(76)),
		output: createD2lRouteOutputSchema(getD2lRoute(76)),
	},
	'eportfolio.getInvites': {
		input: createD2lRouteInputSchema(getD2lRoute(77)),
		output: createD2lRouteOutputSchema(getD2lRoute(77)),
	},
	'eportfolio.postInvitesDelete': {
		input: createD2lRouteInputSchema(getD2lRoute(78)),
		output: createD2lRouteOutputSchema(getD2lRoute(78)),
	},
	'eportfolio.postInvitesNew': {
		input: createD2lRouteInputSchema(getD2lRoute(79)),
		output: createD2lRouteOutputSchema(getD2lRoute(79)),
	},
	'eportfolio.postInvitesStatus': {
		input: createD2lRouteInputSchema(getD2lRoute(80)),
		output: createD2lRouteOutputSchema(getD2lRoute(80)),
	},
	'eportfolio.deleteLearningobjectiveObjectiveId': {
		input: createD2lRouteInputSchema(getD2lRoute(81)),
		output: createD2lRouteOutputSchema(getD2lRoute(81)),
	},
	'eportfolio.getLearningobjectiveObjectiveId': {
		input: createD2lRouteInputSchema(getD2lRoute(82)),
		output: createD2lRouteOutputSchema(getD2lRoute(82)),
	},
	'eportfolio.postLearningobjectiveObjectiveId': {
		input: createD2lRouteInputSchema(getD2lRoute(83)),
		output: createD2lRouteOutputSchema(getD2lRoute(83)),
	},
	'eportfolio.deleteLearningobjectiveObjectiveIdAssociationObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(84)),
		output: createD2lRouteOutputSchema(getD2lRoute(84)),
	},
	'eportfolio.postLearningobjectiveObjectiveIdAssociationObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(85)),
		output: createD2lRouteOutputSchema(getD2lRoute(85)),
	},
	'eportfolio.getNewsfeed': {
		input: createD2lRouteInputSchema(getD2lRoute(86)),
		output: createD2lRouteOutputSchema(getD2lRoute(86)),
	},
	'eportfolio.getNewsfeedFilters': {
		input: createD2lRouteInputSchema(getD2lRoute(87)),
		output: createD2lRouteOutputSchema(getD2lRoute(87)),
	},
	'eportfolio.getObject': {
		input: createD2lRouteInputSchema(getD2lRoute(88)),
		output: createD2lRouteOutputSchema(getD2lRoute(88)),
	},
	'eportfolio.getObjectObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(89)),
		output: createD2lRouteOutputSchema(getD2lRoute(89)),
	},
	'eportfolio.getObjectObjectIdAssociations': {
		input: createD2lRouteInputSchema(getD2lRoute(90)),
		output: createD2lRouteOutputSchema(getD2lRoute(90)),
	},
	'eportfolio.deleteObjectObjectIdCommentCommentId': {
		input: createD2lRouteInputSchema(getD2lRoute(91)),
		output: createD2lRouteOutputSchema(getD2lRoute(91)),
	},
	'eportfolio.getObjectObjectIdComments': {
		input: createD2lRouteInputSchema(getD2lRoute(92)),
		output: createD2lRouteOutputSchema(getD2lRoute(92)),
	},
	'eportfolio.postObjectObjectIdCommentsNew': {
		input: createD2lRouteInputSchema(getD2lRoute(93)),
		output: createD2lRouteOutputSchema(getD2lRoute(93)),
	},
	'eportfolio.getObjectObjectIdContent': {
		input: createD2lRouteInputSchema(getD2lRoute(94)),
		output: createD2lRouteOutputSchema(getD2lRoute(94)),
	},
	'eportfolio.postObjectObjectIdShareDelete': {
		input: createD2lRouteInputSchema(getD2lRoute(95)),
		output: createD2lRouteOutputSchema(getD2lRoute(95)),
	},
	'eportfolio.postObjectObjectIdShareNew': {
		input: createD2lRouteInputSchema(getD2lRoute(96)),
		output: createD2lRouteOutputSchema(getD2lRoute(96)),
	},
	'eportfolio.getObjectObjectIdShares': {
		input: createD2lRouteInputSchema(getD2lRoute(97)),
		output: createD2lRouteOutputSchema(getD2lRoute(97)),
	},
	'eportfolio.getObjectObjectIdTags': {
		input: createD2lRouteInputSchema(getD2lRoute(98)),
		output: createD2lRouteOutputSchema(getD2lRoute(98)),
	},
	'eportfolio.postObjectObjectIdTagsAdd': {
		input: createD2lRouteInputSchema(getD2lRoute(99)),
		output: createD2lRouteOutputSchema(getD2lRoute(99)),
	},
	'eportfolio.postObjectObjectIdTagsRemove': {
		input: createD2lRouteInputSchema(getD2lRoute(100)),
		output: createD2lRouteOutputSchema(getD2lRoute(100)),
	},
	'eportfolio.deleteObjectCommentCommentId': {
		input: createD2lRouteInputSchema(getD2lRoute(101)),
		output: createD2lRouteOutputSchema(getD2lRoute(101)),
	},
	'eportfolio.getObjectComments': {
		input: createD2lRouteInputSchema(getD2lRoute(102)),
		output: createD2lRouteOutputSchema(getD2lRoute(102)),
	},
	'eportfolio.postObjectCommentsNew': {
		input: createD2lRouteInputSchema(getD2lRoute(103)),
		output: createD2lRouteOutputSchema(getD2lRoute(103)),
	},
	'eportfolio.getObjectContent': {
		input: createD2lRouteInputSchema(getD2lRoute(104)),
		output: createD2lRouteOutputSchema(getD2lRoute(104)),
	},
	'eportfolio.getObjectSharetargets': {
		input: createD2lRouteInputSchema(getD2lRoute(105)),
		output: createD2lRouteOutputSchema(getD2lRoute(105)),
	},
	'eportfolio.getObjectSharetargetsMy': {
		input: createD2lRouteInputSchema(getD2lRoute(106)),
		output: createD2lRouteOutputSchema(getD2lRoute(106)),
	},
	'eportfolio.getObjectSharetargetsSharinggroups': {
		input: createD2lRouteInputSchema(getD2lRoute(107)),
		output: createD2lRouteOutputSchema(getD2lRoute(107)),
	},
	'eportfolio.getObjectSharetargetsUsers': {
		input: createD2lRouteInputSchema(getD2lRoute(108)),
		output: createD2lRouteOutputSchema(getD2lRoute(108)),
	},
	'eportfolio.getObjectThumbnail': {
		input: createD2lRouteInputSchema(getD2lRoute(109)),
		output: createD2lRouteOutputSchema(getD2lRoute(109)),
	},
	'eportfolio.getObjectsObjectsFilterCommentsCommentsFilter': {
		input: createD2lRouteInputSchema(getD2lRoute(110)),
		output: createD2lRouteOutputSchema(getD2lRoute(110)),
	},
	'eportfolio.getObjectsMy': {
		input: createD2lRouteInputSchema(getD2lRoute(111)),
		output: createD2lRouteOutputSchema(getD2lRoute(111)),
	},
	'eportfolio.getObjectsMySharedModified': {
		input: createD2lRouteInputSchema(getD2lRoute(112)),
		output: createD2lRouteOutputSchema(getD2lRoute(112)),
	},
	'eportfolio.getObjectsShared': {
		input: createD2lRouteInputSchema(getD2lRoute(113)),
		output: createD2lRouteOutputSchema(getD2lRoute(113)),
	},
	'eportfolio.getObjectsTags': {
		input: createD2lRouteInputSchema(getD2lRoute(114)),
		output: createD2lRouteOutputSchema(getD2lRoute(114)),
	},
	'eportfolio.postObjectsTagsAdd': {
		input: createD2lRouteInputSchema(getD2lRoute(115)),
		output: createD2lRouteOutputSchema(getD2lRoute(115)),
	},
	'eportfolio.postObjectsTagsRemove': {
		input: createD2lRouteInputSchema(getD2lRoute(116)),
		output: createD2lRouteOutputSchema(getD2lRoute(116)),
	},
	'eportfolio.deletePresentationObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(117)),
		output: createD2lRouteOutputSchema(getD2lRoute(117)),
	},
	'eportfolio.getPresentationObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(118)),
		output: createD2lRouteOutputSchema(getD2lRoute(118)),
	},
	'eportfolio.postPresentationObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(119)),
		output: createD2lRouteOutputSchema(getD2lRoute(119)),
	},
	'eportfolio.postPresentationsNew': {
		input: createD2lRouteInputSchema(getD2lRoute(120)),
		output: createD2lRouteOutputSchema(getD2lRoute(120)),
	},
	'eportfolio.deleteReflectionObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(121)),
		output: createD2lRouteOutputSchema(getD2lRoute(121)),
	},
	'eportfolio.getReflectionObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(122)),
		output: createD2lRouteOutputSchema(getD2lRoute(122)),
	},
	'eportfolio.postReflectionObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(123)),
		output: createD2lRouteOutputSchema(getD2lRoute(123)),
	},
	'eportfolio.deleteReflectionReflectionIdOnObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(124)),
		output: createD2lRouteOutputSchema(getD2lRoute(124)),
	},
	'eportfolio.postReflectionReflectionIdOnObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(125)),
		output: createD2lRouteOutputSchema(getD2lRoute(125)),
	},
	'eportfolio.postReflectionsNew': {
		input: createD2lRouteInputSchema(getD2lRoute(126)),
		output: createD2lRouteOutputSchema(getD2lRoute(126)),
	},
	'eportfolio.getSubscriptionsObjects': {
		input: createD2lRouteInputSchema(getD2lRoute(127)),
		output: createD2lRouteOutputSchema(getD2lRoute(127)),
	},
	'eportfolio.deleteSubscriptionsObjectsObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(128)),
		output: createD2lRouteOutputSchema(getD2lRoute(128)),
	},
	'eportfolio.postSubscriptionsObjectsObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(129)),
		output: createD2lRouteOutputSchema(getD2lRoute(129)),
	},
	'eportfolio.getSubscriptionsObjectsExists': {
		input: createD2lRouteInputSchema(getD2lRoute(130)),
		output: createD2lRouteOutputSchema(getD2lRoute(130)),
	},
	'eportfolio.getSubscriptionsUsers': {
		input: createD2lRouteInputSchema(getD2lRoute(131)),
		output: createD2lRouteOutputSchema(getD2lRoute(131)),
	},
	'eportfolio.deleteSubscriptionsUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(132)),
		output: createD2lRouteOutputSchema(getD2lRoute(132)),
	},
	'eportfolio.postSubscriptionsUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(133)),
		output: createD2lRouteOutputSchema(getD2lRoute(133)),
	},
	'eportfolio.getSubscriptionsUsersExists': {
		input: createD2lRouteInputSchema(getD2lRoute(134)),
		output: createD2lRouteOutputSchema(getD2lRoute(134)),
	},
	'eportfolio.postTagsAutocomplete': {
		input: createD2lRouteInputSchema(getD2lRoute(135)),
		output: createD2lRouteOutputSchema(getD2lRoute(135)),
	},
	'eportfolio.getUsersSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(136)),
		output: createD2lRouteOutputSchema(getD2lRoute(136)),
	},
	'learningEnvironment.postLtiadvantageQuicklinksOrgunitOrgUnitIdLinkLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(137)),
		output: createD2lRouteOutputSchema(getD2lRoute(137)),
	},
	'learningEnvironment.getOrgUnitIdAgents': {
		input: createD2lRouteInputSchema(getD2lRoute(138)),
		output: createD2lRouteOutputSchema(getD2lRoute(138)),
	},
	'learningEnvironment.postOrgUnitIdAgents': {
		input: createD2lRouteInputSchema(getD2lRoute(139)),
		output: createD2lRouteOutputSchema(getD2lRoute(139)),
	},
	'learningEnvironment.deleteOrgUnitIdAgentsAgentId': {
		input: createD2lRouteInputSchema(getD2lRoute(140)),
		output: createD2lRouteOutputSchema(getD2lRoute(140)),
	},
	'learningEnvironment.getOrgUnitIdAgentsAgentId': {
		input: createD2lRouteInputSchema(getD2lRoute(141)),
		output: createD2lRouteOutputSchema(getD2lRoute(141)),
	},
	'learningEnvironment.postOrgUnitIdAgentsAgentId': {
		input: createD2lRouteInputSchema(getD2lRoute(142)),
		output: createD2lRouteOutputSchema(getD2lRoute(142)),
	},
	'learningEnvironment.putOrgUnitIdAgentsAgentId': {
		input: createD2lRouteInputSchema(getD2lRoute(143)),
		output: createD2lRouteOutputSchema(getD2lRoute(143)),
	},
	'learningEnvironment.getOrgUnitIdAgentsAgentIdRuns': {
		input: createD2lRouteInputSchema(getD2lRoute(144)),
		output: createD2lRouteOutputSchema(getD2lRoute(144)),
	},
	'learningEnvironment.postOrgUnitIdAgentsAgentIdRuns': {
		input: createD2lRouteInputSchema(getD2lRoute(145)),
		output: createD2lRouteOutputSchema(getD2lRoute(145)),
	},
	'learningEnvironment.getOrgUnitIdAgentsAgentIdRunsRunId': {
		input: createD2lRouteInputSchema(getD2lRoute(146)),
		output: createD2lRouteOutputSchema(getD2lRoute(146)),
	},
	'learningEnvironment.getOrgUnitIdAgentsCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(147)),
		output: createD2lRouteOutputSchema(getD2lRoute(147)),
	},
	'learningEnvironment.postOrgUnitIdAgentsCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(148)),
		output: createD2lRouteOutputSchema(getD2lRoute(148)),
	},
	'learningEnvironment.deleteOrgUnitIdAgentsCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(149)),
		output: createD2lRouteOutputSchema(getD2lRoute(149)),
	},
	'learningEnvironment.getOrgUnitIdAgentsCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(150)),
		output: createD2lRouteOutputSchema(getD2lRoute(150)),
	},
	'learningEnvironment.putOrgUnitIdAgentsCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(151)),
		output: createD2lRouteOutputSchema(getD2lRoute(151)),
	},
	'learningEnvironment.getOrgUnitIdAgentsDeleted': {
		input: createD2lRouteInputSchema(getD2lRoute(152)),
		output: createD2lRouteOutputSchema(getD2lRoute(152)),
	},
	'learningEnvironment.getOrgUnitIdAssessment': {
		input: createD2lRouteInputSchema(getD2lRoute(153)),
		output: createD2lRouteOutputSchema(getD2lRoute(153)),
	},
	'learningEnvironment.putOrgUnitIdAssessment': {
		input: createD2lRouteInputSchema(getD2lRoute(154)),
		output: createD2lRouteOutputSchema(getD2lRoute(154)),
	},
	'learningEnvironment.postOrgUnitIdCalendarEvent': {
		input: createD2lRouteInputSchema(getD2lRoute(155)),
		output: createD2lRouteOutputSchema(getD2lRoute(155)),
	},
	'learningEnvironment.deleteOrgUnitIdCalendarEventEventId': {
		input: createD2lRouteInputSchema(getD2lRoute(156)),
		output: createD2lRouteOutputSchema(getD2lRoute(156)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventEventId': {
		input: createD2lRouteInputSchema(getD2lRoute(157)),
		output: createD2lRouteOutputSchema(getD2lRoute(157)),
	},
	'learningEnvironment.putOrgUnitIdCalendarEventEventId': {
		input: createD2lRouteInputSchema(getD2lRoute(158)),
		output: createD2lRouteOutputSchema(getD2lRoute(158)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventEventIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(159)),
		output: createD2lRouteOutputSchema(getD2lRoute(159)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventEventIdOccurrences': {
		input: createD2lRouteInputSchema(getD2lRoute(160)),
		output: createD2lRouteOutputSchema(getD2lRoute(160)),
	},
	'learningEnvironment.postOrgUnitIdCalendarEventEventIdPresenter': {
		input: createD2lRouteInputSchema(getD2lRoute(161)),
		output: createD2lRouteOutputSchema(getD2lRoute(161)),
	},
	'learningEnvironment.deleteOrgUnitIdCalendarEventEventIdPresenterUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(162)),
		output: createD2lRouteOutputSchema(getD2lRoute(162)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEvents': {
		input: createD2lRouteInputSchema(getD2lRoute(163)),
		output: createD2lRouteOutputSchema(getD2lRoute(163)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsUserIdItemCount': {
		input: createD2lRouteInputSchema(getD2lRoute(164)),
		output: createD2lRouteOutputSchema(getD2lRoute(164)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsMyEvents': {
		input: createD2lRouteInputSchema(getD2lRoute(165)),
		output: createD2lRouteOutputSchema(getD2lRoute(165)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsMyEventsItemCount': {
		input: createD2lRouteInputSchema(getD2lRoute(166)),
		output: createD2lRouteOutputSchema(getD2lRoute(166)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsOccurrences': {
		input: createD2lRouteInputSchema(getD2lRoute(167)),
		output: createD2lRouteOutputSchema(getD2lRoute(167)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsOrgunits': {
		input: createD2lRouteInputSchema(getD2lRoute(168)),
		output: createD2lRouteOutputSchema(getD2lRoute(168)),
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsUser': {
		input: createD2lRouteInputSchema(getD2lRoute(169)),
		output: createD2lRouteOutputSchema(getD2lRoute(169)),
	},
	'learningEnvironment.getOrgUnitIdChecklists': {
		input: createD2lRouteInputSchema(getD2lRoute(170)),
		output: createD2lRouteOutputSchema(getD2lRoute(170)),
	},
	'learningEnvironment.postOrgUnitIdChecklists': {
		input: createD2lRouteInputSchema(getD2lRoute(171)),
		output: createD2lRouteOutputSchema(getD2lRoute(171)),
	},
	'learningEnvironment.deleteOrgUnitIdChecklistsChecklistId': {
		input: createD2lRouteInputSchema(getD2lRoute(172)),
		output: createD2lRouteOutputSchema(getD2lRoute(172)),
	},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistId': {
		input: createD2lRouteInputSchema(getD2lRoute(173)),
		output: createD2lRouteOutputSchema(getD2lRoute(173)),
	},
	'learningEnvironment.putOrgUnitIdChecklistsChecklistId': {
		input: createD2lRouteInputSchema(getD2lRoute(174)),
		output: createD2lRouteOutputSchema(getD2lRoute(174)),
	},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(175)),
		output: createD2lRouteOutputSchema(getD2lRoute(175)),
	},
	'learningEnvironment.postOrgUnitIdChecklistsChecklistIdCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(176)),
		output: createD2lRouteOutputSchema(getD2lRoute(176)),
	},
	'learningEnvironment.deleteOrgUnitIdChecklistsChecklistIdCategoriesCategoryId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(177)),
			output: createD2lRouteOutputSchema(getD2lRoute(177)),
		},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(178)),
		output: createD2lRouteOutputSchema(getD2lRoute(178)),
	},
	'learningEnvironment.putOrgUnitIdChecklistsChecklistIdCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(179)),
		output: createD2lRouteOutputSchema(getD2lRoute(179)),
	},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdItems': {
		input: createD2lRouteInputSchema(getD2lRoute(180)),
		output: createD2lRouteOutputSchema(getD2lRoute(180)),
	},
	'learningEnvironment.postOrgUnitIdChecklistsChecklistIdItems': {
		input: createD2lRouteInputSchema(getD2lRoute(181)),
		output: createD2lRouteOutputSchema(getD2lRoute(181)),
	},
	'learningEnvironment.deleteOrgUnitIdChecklistsChecklistIdItemsChecklistItemId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(182)),
			output: createD2lRouteOutputSchema(getD2lRoute(182)),
		},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdItemsChecklistItemId': {
		input: createD2lRouteInputSchema(getD2lRoute(183)),
		output: createD2lRouteOutputSchema(getD2lRoute(183)),
	},
	'learningEnvironment.putOrgUnitIdChecklistsChecklistIdItemsChecklistItemId': {
		input: createD2lRouteInputSchema(getD2lRoute(184)),
		output: createD2lRouteOutputSchema(getD2lRoute(184)),
	},
	'learningEnvironment.getOrgUnitIdClasslist': {
		input: createD2lRouteInputSchema(getD2lRoute(185)),
		output: createD2lRouteOutputSchema(getD2lRoute(185)),
	},
	'learningEnvironment.getOrgUnitIdClasslistPaged': {
		input: createD2lRouteInputSchema(getD2lRoute(186)),
		output: createD2lRouteOutputSchema(getD2lRoute(186)),
	},
	'learningEnvironment.getOrgUnitIdCompetenciesStructure': {
		input: createD2lRouteInputSchema(getD2lRoute(187)),
		output: createD2lRouteOutputSchema(getD2lRoute(187)),
	},
	'learningEnvironment.getOrgUnitIdContentBookmarks': {
		input: createD2lRouteInputSchema(getD2lRoute(188)),
		output: createD2lRouteOutputSchema(getD2lRoute(188)),
	},
	'learningEnvironment.getOrgUnitIdContentCompletions': {
		input: createD2lRouteInputSchema(getD2lRoute(189)),
		output: createD2lRouteOutputSchema(getD2lRoute(189)),
	},
	'learningEnvironment.getOrgUnitIdContentCompletionsMycount': {
		input: createD2lRouteInputSchema(getD2lRoute(190)),
		output: createD2lRouteOutputSchema(getD2lRoute(190)),
	},
	'learningEnvironment.postOrgUnitIdContentExemptionsUsersUserIdByFilter': {
		input: createD2lRouteInputSchema(getD2lRoute(191)),
		output: createD2lRouteOutputSchema(getD2lRoute(191)),
	},
	'learningEnvironment.postOrgUnitIdContentExemptionsUsersUserIdByList': {
		input: createD2lRouteInputSchema(getD2lRoute(192)),
		output: createD2lRouteOutputSchema(getD2lRoute(192)),
	},
	'learningEnvironment.postOrgUnitIdContentExemptionsUsersUserIdByListDelete': {
		input: createD2lRouteInputSchema(getD2lRoute(193)),
		output: createD2lRouteOutputSchema(getD2lRoute(193)),
	},
	'learningEnvironment.deleteOrgUnitIdContentModulesModuleId': {
		input: createD2lRouteInputSchema(getD2lRoute(194)),
		output: createD2lRouteOutputSchema(getD2lRoute(194)),
	},
	'learningEnvironment.getOrgUnitIdContentModulesModuleId': {
		input: createD2lRouteInputSchema(getD2lRoute(195)),
		output: createD2lRouteOutputSchema(getD2lRoute(195)),
	},
	'learningEnvironment.putOrgUnitIdContentModulesModuleId': {
		input: createD2lRouteInputSchema(getD2lRoute(196)),
		output: createD2lRouteOutputSchema(getD2lRoute(196)),
	},
	'learningEnvironment.getOrgUnitIdContentModulesModuleIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(197)),
		output: createD2lRouteOutputSchema(getD2lRoute(197)),
	},
	'learningEnvironment.getOrgUnitIdContentModulesModuleIdStructure': {
		input: createD2lRouteInputSchema(getD2lRoute(198)),
		output: createD2lRouteOutputSchema(getD2lRoute(198)),
	},
	'learningEnvironment.postOrgUnitIdContentModulesModuleIdStructure': {
		input: createD2lRouteInputSchema(getD2lRoute(199)),
		output: createD2lRouteOutputSchema(getD2lRoute(199)),
	},
	'learningEnvironment.getOrgUnitIdContentMyItems': {
		input: createD2lRouteInputSchema(getD2lRoute(200)),
		output: createD2lRouteOutputSchema(getD2lRoute(200)),
	},
	'learningEnvironment.getOrgUnitIdContentMyItemsDue': {
		input: createD2lRouteInputSchema(getD2lRoute(201)),
		output: createD2lRouteOutputSchema(getD2lRoute(201)),
	},
	'learningEnvironment.getOrgUnitIdContentMyItemsDueItemCount': {
		input: createD2lRouteInputSchema(getD2lRoute(202)),
		output: createD2lRouteOutputSchema(getD2lRoute(202)),
	},
	'learningEnvironment.getOrgUnitIdContentMyItemsItemCount': {
		input: createD2lRouteInputSchema(getD2lRoute(203)),
		output: createD2lRouteOutputSchema(getD2lRoute(203)),
	},
	'learningEnvironment.postOrgUnitIdContentOrderObjectIdObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(204)),
		output: createD2lRouteOutputSchema(getD2lRoute(204)),
	},
	'learningEnvironment.getOrgUnitIdContentPacing': {
		input: createD2lRouteInputSchema(getD2lRoute(205)),
		output: createD2lRouteOutputSchema(getD2lRoute(205)),
	},
	'learningEnvironment.putOrgUnitIdContentPacing': {
		input: createD2lRouteInputSchema(getD2lRoute(206)),
		output: createD2lRouteOutputSchema(getD2lRoute(206)),
	},
	'learningEnvironment.putOrgUnitIdContentPacingModulesModuleId': {
		input: createD2lRouteInputSchema(getD2lRoute(207)),
		output: createD2lRouteOutputSchema(getD2lRoute(207)),
	},
	'learningEnvironment.getOrgUnitIdContentRecent': {
		input: createD2lRouteInputSchema(getD2lRoute(208)),
		output: createD2lRouteOutputSchema(getD2lRoute(208)),
	},
	'learningEnvironment.getOrgUnitIdContentRoot': {
		input: createD2lRouteInputSchema(getD2lRoute(209)),
		output: createD2lRouteOutputSchema(getD2lRoute(209)),
	},
	'learningEnvironment.postOrgUnitIdContentRoot': {
		input: createD2lRouteInputSchema(getD2lRoute(210)),
		output: createD2lRouteOutputSchema(getD2lRoute(210)),
	},
	'learningEnvironment.getOrgUnitIdContentToc': {
		input: createD2lRouteInputSchema(getD2lRoute(211)),
		output: createD2lRouteOutputSchema(getD2lRoute(211)),
	},
	'learningEnvironment.deleteOrgUnitIdContentTopicsTopicId': {
		input: createD2lRouteInputSchema(getD2lRoute(212)),
		output: createD2lRouteOutputSchema(getD2lRoute(212)),
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicId': {
		input: createD2lRouteInputSchema(getD2lRoute(213)),
		output: createD2lRouteOutputSchema(getD2lRoute(213)),
	},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicId': {
		input: createD2lRouteInputSchema(getD2lRoute(214)),
		output: createD2lRouteOutputSchema(getD2lRoute(214)),
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(215)),
		output: createD2lRouteOutputSchema(getD2lRoute(215)),
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdCaptions': {
		input: createD2lRouteInputSchema(getD2lRoute(216)),
		output: createD2lRouteOutputSchema(getD2lRoute(216)),
	},
	'learningEnvironment.deleteOrgUnitIdContentTopicsTopicIdCaptionsLanguage': {
		input: createD2lRouteInputSchema(getD2lRoute(217)),
		output: createD2lRouteOutputSchema(getD2lRoute(217)),
	},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicIdCaptionsLanguage': {
		input: createD2lRouteInputSchema(getD2lRoute(218)),
		output: createD2lRouteOutputSchema(getD2lRoute(218)),
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdCompletions': {
		input: createD2lRouteInputSchema(getD2lRoute(219)),
		output: createD2lRouteOutputSchema(getD2lRoute(219)),
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdCompletionsUsersUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(220)),
			output: createD2lRouteOutputSchema(getD2lRoute(220)),
		},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicIdCompletionsUsersUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(221)),
			output: createD2lRouteOutputSchema(getD2lRoute(221)),
		},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdFile': {
		input: createD2lRouteInputSchema(getD2lRoute(222)),
		output: createD2lRouteOutputSchema(getD2lRoute(222)),
	},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicIdFile': {
		input: createD2lRouteInputSchema(getD2lRoute(223)),
		output: createD2lRouteOutputSchema(getD2lRoute(223)),
	},
	'learningEnvironment.getOrgUnitIdContentUserprogress': {
		input: createD2lRouteInputSchema(getD2lRoute(224)),
		output: createD2lRouteOutputSchema(getD2lRoute(224)),
	},
	'learningEnvironment.postOrgUnitIdContentUserprogress': {
		input: createD2lRouteInputSchema(getD2lRoute(225)),
		output: createD2lRouteOutputSchema(getD2lRoute(225)),
	},
	'learningEnvironment.getOrgUnitIdContentUserprogressTopicId': {
		input: createD2lRouteInputSchema(getD2lRoute(226)),
		output: createD2lRouteOutputSchema(getD2lRoute(226)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsDeleted': {
		input: createD2lRouteInputSchema(getD2lRoute(227)),
		output: createD2lRouteOutputSchema(getD2lRoute(227)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForums': {
		input: createD2lRouteInputSchema(getD2lRoute(228)),
		output: createD2lRouteOutputSchema(getD2lRoute(228)),
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForums': {
		input: createD2lRouteInputSchema(getD2lRoute(229)),
		output: createD2lRouteOutputSchema(getD2lRoute(229)),
	},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumId': {
		input: createD2lRouteInputSchema(getD2lRoute(230)),
		output: createD2lRouteOutputSchema(getD2lRoute(230)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumId': {
		input: createD2lRouteInputSchema(getD2lRoute(231)),
		output: createD2lRouteOutputSchema(getD2lRoute(231)),
	},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumId': {
		input: createD2lRouteInputSchema(getD2lRoute(232)),
		output: createD2lRouteOutputSchema(getD2lRoute(232)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(233)),
		output: createD2lRouteOutputSchema(getD2lRoute(233)),
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdCopy': {
		input: createD2lRouteInputSchema(getD2lRoute(234)),
		output: createD2lRouteOutputSchema(getD2lRoute(234)),
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdOrder': {
		input: createD2lRouteInputSchema(getD2lRoute(235)),
		output: createD2lRouteOutputSchema(getD2lRoute(235)),
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdRestore': {
		input: createD2lRouteInputSchema(getD2lRoute(236)),
		output: createD2lRouteOutputSchema(getD2lRoute(236)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdStatistics': {
		input: createD2lRouteInputSchema(getD2lRoute(237)),
		output: createD2lRouteOutputSchema(getD2lRoute(237)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopics': {
		input: createD2lRouteInputSchema(getD2lRoute(238)),
		output: createD2lRouteOutputSchema(getD2lRoute(238)),
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopics': {
		input: createD2lRouteInputSchema(getD2lRoute(239)),
		output: createD2lRouteOutputSchema(getD2lRoute(239)),
	},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicId': {
		input: createD2lRouteInputSchema(getD2lRoute(240)),
		output: createD2lRouteOutputSchema(getD2lRoute(240)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicId': {
		input: createD2lRouteInputSchema(getD2lRoute(241)),
		output: createD2lRouteOutputSchema(getD2lRoute(241)),
	},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicId': {
		input: createD2lRouteInputSchema(getD2lRoute(242)),
		output: createD2lRouteOutputSchema(getD2lRoute(242)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdAccess':
		{
			input: createD2lRouteInputSchema(getD2lRoute(243)),
			output: createD2lRouteOutputSchema(getD2lRoute(243)),
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdCopy':
		{
			input: createD2lRouteInputSchema(getD2lRoute(244)),
			output: createD2lRouteOutputSchema(getD2lRoute(244)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdExemption':
		{
			input: createD2lRouteInputSchema(getD2lRoute(245)),
			output: createD2lRouteOutputSchema(getD2lRoute(245)),
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions':
		{
			input: createD2lRouteInputSchema(getD2lRoute(246)),
			output: createD2lRouteOutputSchema(getD2lRoute(246)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions':
		{
			input: createD2lRouteInputSchema(getD2lRoute(247)),
			output: createD2lRouteOutputSchema(getD2lRoute(247)),
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions':
		{
			input: createD2lRouteInputSchema(getD2lRoute(248)),
			output: createD2lRouteOutputSchema(getD2lRoute(248)),
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdOrder':
		{
			input: createD2lRouteInputSchema(getD2lRoute(249)),
			output: createD2lRouteOutputSchema(getD2lRoute(249)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPosts':
		{
			input: createD2lRouteInputSchema(getD2lRoute(250)),
			output: createD2lRouteOutputSchema(getD2lRoute(250)),
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPosts':
		{
			input: createD2lRouteInputSchema(getD2lRoute(251)),
			output: createD2lRouteOutputSchema(getD2lRoute(251)),
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(252)),
			output: createD2lRouteOutputSchema(getD2lRoute(252)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(253)),
			output: createD2lRouteOutputSchema(getD2lRoute(253)),
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(254)),
			output: createD2lRouteOutputSchema(getD2lRoute(254)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdApproval':
		{
			input: createD2lRouteInputSchema(getD2lRoute(255)),
			output: createD2lRouteOutputSchema(getD2lRoute(255)),
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdApproval':
		{
			input: createD2lRouteInputSchema(getD2lRoute(256)),
			output: createD2lRouteOutputSchema(getD2lRoute(256)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdFlag':
		{
			input: createD2lRouteInputSchema(getD2lRoute(257)),
			output: createD2lRouteOutputSchema(getD2lRoute(257)),
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdFlag':
		{
			input: createD2lRouteInputSchema(getD2lRoute(258)),
			output: createD2lRouteOutputSchema(getD2lRoute(258)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRating':
		{
			input: createD2lRouteInputSchema(getD2lRoute(259)),
			output: createD2lRouteOutputSchema(getD2lRoute(259)),
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating':
		{
			input: createD2lRouteInputSchema(getD2lRoute(260)),
			output: createD2lRouteOutputSchema(getD2lRoute(260)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating':
		{
			input: createD2lRouteInputSchema(getD2lRoute(261)),
			output: createD2lRouteOutputSchema(getD2lRoute(261)),
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating':
		{
			input: createD2lRouteInputSchema(getD2lRoute(262)),
			output: createD2lRouteOutputSchema(getD2lRoute(262)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdReadStatus':
		{
			input: createD2lRouteInputSchema(getD2lRoute(263)),
			output: createD2lRouteOutputSchema(getD2lRoute(263)),
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdReadStatus':
		{
			input: createD2lRouteInputSchema(getD2lRoute(264)),
			output: createD2lRouteOutputSchema(getD2lRoute(264)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotes':
		{
			input: createD2lRouteInputSchema(getD2lRoute(265)),
			output: createD2lRouteOutputSchema(getD2lRoute(265)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotesMyVote':
		{
			input: createD2lRouteInputSchema(getD2lRoute(266)),
			output: createD2lRouteOutputSchema(getD2lRoute(266)),
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotesMyVote':
		{
			input: createD2lRouteInputSchema(getD2lRoute(267)),
			output: createD2lRouteOutputSchema(getD2lRoute(267)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdAttachmentsFileId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(268)),
			output: createD2lRouteOutputSchema(getD2lRoute(268)),
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdPin':
		{
			input: createD2lRouteInputSchema(getD2lRoute(269)),
			output: createD2lRouteOutputSchema(getD2lRoute(269)),
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdUnpin':
		{
			input: createD2lRouteInputSchema(getD2lRoute(270)),
			output: createD2lRouteOutputSchema(getD2lRoute(270)),
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdRestore':
		{
			input: createD2lRouteInputSchema(getD2lRoute(271)),
			output: createD2lRouteOutputSchema(getD2lRoute(271)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdStatistics':
		{
			input: createD2lRouteInputSchema(getD2lRoute(272)),
			output: createD2lRouteOutputSchema(getD2lRoute(272)),
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserUserIdExemption':
		{
			input: createD2lRouteInputSchema(getD2lRoute(273)),
			output: createD2lRouteOutputSchema(getD2lRoute(273)),
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserUserIdExemption':
		{
			input: createD2lRouteInputSchema(getD2lRoute(274)),
			output: createD2lRouteOutputSchema(getD2lRoute(274)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserstatistics':
		{
			input: createD2lRouteInputSchema(getD2lRoute(275)),
			output: createD2lRouteOutputSchema(getD2lRoute(275)),
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumtopicstatistics': {
		input: createD2lRouteInputSchema(getD2lRoute(276)),
		output: createD2lRouteOutputSchema(getD2lRoute(276)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsStatistics': {
		input: createD2lRouteInputSchema(getD2lRoute(277)),
		output: createD2lRouteOutputSchema(getD2lRoute(277)),
	},
	'learningEnvironment.getOrgUnitIdDiscussionsUserstatistics': {
		input: createD2lRouteInputSchema(getD2lRoute(278)),
		output: createD2lRouteOutputSchema(getD2lRoute(278)),
	},
	'learningEnvironment.getOrgUnitIdDropboxCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(279)),
		output: createD2lRouteOutputSchema(getD2lRoute(279)),
	},
	'learningEnvironment.postOrgUnitIdDropboxCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(280)),
		output: createD2lRouteOutputSchema(getD2lRoute(280)),
	},
	'learningEnvironment.deleteOrgUnitIdDropboxCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(281)),
		output: createD2lRouteOutputSchema(getD2lRoute(281)),
	},
	'learningEnvironment.getOrgUnitIdDropboxCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(282)),
		output: createD2lRouteOutputSchema(getD2lRoute(282)),
	},
	'learningEnvironment.putOrgUnitIdDropboxCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(283)),
		output: createD2lRouteOutputSchema(getD2lRoute(283)),
	},
	'learningEnvironment.getOrgUnitIdDropboxFolders': {
		input: createD2lRouteInputSchema(getD2lRoute(284)),
		output: createD2lRouteOutputSchema(getD2lRoute(284)),
	},
	'learningEnvironment.postOrgUnitIdDropboxFolders': {
		input: createD2lRouteInputSchema(getD2lRoute(285)),
		output: createD2lRouteOutputSchema(getD2lRoute(285)),
	},
	'learningEnvironment.deleteOrgUnitIdDropboxFoldersFolderId': {
		input: createD2lRouteInputSchema(getD2lRoute(286)),
		output: createD2lRouteOutputSchema(getD2lRoute(286)),
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderId': {
		input: createD2lRouteInputSchema(getD2lRoute(287)),
		output: createD2lRouteOutputSchema(getD2lRoute(287)),
	},
	'learningEnvironment.putOrgUnitIdDropboxFoldersFolderId': {
		input: createD2lRouteInputSchema(getD2lRoute(288)),
		output: createD2lRouteOutputSchema(getD2lRoute(288)),
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(289)),
		output: createD2lRouteOutputSchema(getD2lRoute(289)),
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdAttachmentsFileId': {
		input: createD2lRouteInputSchema(getD2lRoute(290)),
		output: createD2lRouteOutputSchema(getD2lRoute(290)),
	},
	'learningEnvironment.putOrgUnitIdDropboxFoldersFolderIdEntitiesEntityIdCompletion':
		{
			input: createD2lRouteInputSchema(getD2lRoute(291)),
			output: createD2lRouteOutputSchema(getD2lRoute(291)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(292)),
			output: createD2lRouteOutputSchema(getD2lRoute(292)),
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(293)),
			output: createD2lRouteOutputSchema(getD2lRoute(293)),
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttach':
		{
			input: createD2lRouteInputSchema(getD2lRoute(294)),
			output: createD2lRouteOutputSchema(getD2lRoute(294)),
		},
	'learningEnvironment.deleteOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttachmentsFileId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(295)),
			output: createD2lRouteOutputSchema(getD2lRoute(295)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttachmentsFileId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(296)),
			output: createD2lRouteOutputSchema(getD2lRoute(296)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdLinksLinkId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(297)),
			output: createD2lRouteOutputSchema(getD2lRoute(297)),
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdUpload':
		{
			input: createD2lRouteInputSchema(getD2lRoute(298)),
			output: createD2lRouteOutputSchema(getD2lRoute(298)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdGroupSubmissionsGroupIdDownload':
		{
			input: createD2lRouteInputSchema(getD2lRoute(299)),
			output: createD2lRouteOutputSchema(getD2lRoute(299)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSpecialaccess': {
		input: createD2lRouteInputSchema(getD2lRoute(300)),
		output: createD2lRouteOutputSchema(getD2lRoute(300)),
	},
	'learningEnvironment.deleteOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(301)),
			output: createD2lRouteOutputSchema(getD2lRoute(301)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(302)),
		output: createD2lRouteOutputSchema(getD2lRoute(302)),
	},
	'learningEnvironment.putOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(303)),
		output: createD2lRouteOutputSchema(getD2lRoute(303)),
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissions': {
		input: createD2lRouteInputSchema(getD2lRoute(304)),
		output: createD2lRouteOutputSchema(getD2lRoute(304)),
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsSubmissionIdFilesFileId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(305)),
			output: createD2lRouteOutputSchema(getD2lRoute(305)),
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdSubmissionsSubmissionIdFilesFileIdMarkAsRead':
		{
			input: createD2lRouteInputSchema(getD2lRoute(306)),
			output: createD2lRouteOutputSchema(getD2lRoute(306)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsUserIdDownload':
		{
			input: createD2lRouteInputSchema(getD2lRoute(307)),
			output: createD2lRouteOutputSchema(getD2lRoute(307)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsGroupGroupId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(308)),
			output: createD2lRouteOutputSchema(getD2lRoute(308)),
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdSubmissionsGroupGroupId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(309)),
			output: createD2lRouteOutputSchema(getD2lRoute(309)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsMysubmissions':
		{
			input: createD2lRouteInputSchema(getD2lRoute(310)),
			output: createD2lRouteOutputSchema(getD2lRoute(310)),
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdSubmissionsMysubmissions':
		{
			input: createD2lRouteInputSchema(getD2lRoute(311)),
			output: createD2lRouteOutputSchema(getD2lRoute(311)),
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsPaged': {
		input: createD2lRouteInputSchema(getD2lRoute(312)),
		output: createD2lRouteOutputSchema(getD2lRoute(312)),
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsUserUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(313)),
			output: createD2lRouteOutputSchema(getD2lRoute(313)),
		},
	'learningEnvironment.getOrgUnitIdGrades': {
		input: createD2lRouteInputSchema(getD2lRoute(314)),
		output: createD2lRouteOutputSchema(getD2lRoute(314)),
	},
	'learningEnvironment.postOrgUnitIdGrades': {
		input: createD2lRouteInputSchema(getD2lRoute(315)),
		output: createD2lRouteOutputSchema(getD2lRoute(315)),
	},
	'learningEnvironment.deleteOrgUnitIdGradesGradeObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(316)),
		output: createD2lRouteOutputSchema(getD2lRoute(316)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(317)),
		output: createD2lRouteOutputSchema(getD2lRoute(317)),
	},
	'learningEnvironment.putOrgUnitIdGradesGradeObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(318)),
		output: createD2lRouteOutputSchema(getD2lRoute(318)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(319)),
		output: createD2lRouteOutputSchema(getD2lRoute(319)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdExemptions': {
		input: createD2lRouteInputSchema(getD2lRoute(320)),
		output: createD2lRouteOutputSchema(getD2lRoute(320)),
	},
	'learningEnvironment.deleteOrgUnitIdGradesGradeObjectIdExemptionsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(321)),
		output: createD2lRouteOutputSchema(getD2lRoute(321)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdExemptionsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(322)),
		output: createD2lRouteOutputSchema(getD2lRoute(322)),
	},
	'learningEnvironment.postOrgUnitIdGradesGradeObjectIdExemptionsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(323)),
		output: createD2lRouteOutputSchema(getD2lRoute(323)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdIpsis': {
		input: createD2lRouteInputSchema(getD2lRoute(324)),
		output: createD2lRouteOutputSchema(getD2lRoute(324)),
	},
	'learningEnvironment.putOrgUnitIdGradesGradeObjectIdIpsis': {
		input: createD2lRouteInputSchema(getD2lRoute(325)),
		output: createD2lRouteOutputSchema(getD2lRoute(325)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdStatistics': {
		input: createD2lRouteInputSchema(getD2lRoute(326)),
		output: createD2lRouteOutputSchema(getD2lRoute(326)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdValues': {
		input: createD2lRouteInputSchema(getD2lRoute(327)),
		output: createD2lRouteOutputSchema(getD2lRoute(327)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdValuesUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(328)),
		output: createD2lRouteOutputSchema(getD2lRoute(328)),
	},
	'learningEnvironment.putOrgUnitIdGradesGradeObjectIdValuesUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(329)),
		output: createD2lRouteOutputSchema(getD2lRoute(329)),
	},
	'learningEnvironment.postOrgUnitIdGradesGradeObjectIdValuesUserIdClear': {
		input: createD2lRouteInputSchema(getD2lRoute(330)),
		output: createD2lRouteOutputSchema(getD2lRoute(330)),
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdValuesMyGradeValue': {
		input: createD2lRouteInputSchema(getD2lRoute(331)),
		output: createD2lRouteOutputSchema(getD2lRoute(331)),
	},
	'learningEnvironment.getOrgUnitIdGradesCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(332)),
		output: createD2lRouteOutputSchema(getD2lRoute(332)),
	},
	'learningEnvironment.postOrgUnitIdGradesCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(333)),
		output: createD2lRouteOutputSchema(getD2lRoute(333)),
	},
	'learningEnvironment.deleteOrgUnitIdGradesCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(334)),
		output: createD2lRouteOutputSchema(getD2lRoute(334)),
	},
	'learningEnvironment.getOrgUnitIdGradesCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(335)),
		output: createD2lRouteOutputSchema(getD2lRoute(335)),
	},
	'learningEnvironment.putOrgUnitIdGradesCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(336)),
		output: createD2lRouteOutputSchema(getD2lRoute(336)),
	},
	'learningEnvironment.getOrgUnitIdGradesCategoriesCategoryIdIpsis': {
		input: createD2lRouteInputSchema(getD2lRoute(337)),
		output: createD2lRouteOutputSchema(getD2lRoute(337)),
	},
	'learningEnvironment.putOrgUnitIdGradesCategoriesCategoryIdIpsis': {
		input: createD2lRouteInputSchema(getD2lRoute(338)),
		output: createD2lRouteOutputSchema(getD2lRoute(338)),
	},
	'learningEnvironment.getOrgUnitIdGradesCourseCompletion': {
		input: createD2lRouteInputSchema(getD2lRoute(339)),
		output: createD2lRouteOutputSchema(getD2lRoute(339)),
	},
	'learningEnvironment.postOrgUnitIdGradesCourseCompletion': {
		input: createD2lRouteInputSchema(getD2lRoute(340)),
		output: createD2lRouteOutputSchema(getD2lRoute(340)),
	},
	'learningEnvironment.deleteOrgUnitIdGradesCourseCompletionCompletionId': {
		input: createD2lRouteInputSchema(getD2lRoute(341)),
		output: createD2lRouteOutputSchema(getD2lRoute(341)),
	},
	'learningEnvironment.putOrgUnitIdGradesCourseCompletionCompletionId': {
		input: createD2lRouteInputSchema(getD2lRoute(342)),
		output: createD2lRouteOutputSchema(getD2lRoute(342)),
	},
	'learningEnvironment.getOrgUnitIdGradesExemptionsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(343)),
		output: createD2lRouteOutputSchema(getD2lRoute(343)),
	},
	'learningEnvironment.postOrgUnitIdGradesExemptionsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(344)),
		output: createD2lRouteOutputSchema(getD2lRoute(344)),
	},
	'learningEnvironment.postOrgUnitIdGradesFinalCalculatedUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(345)),
		output: createD2lRouteOutputSchema(getD2lRoute(345)),
	},
	'learningEnvironment.postOrgUnitIdGradesFinalCalculatedAll': {
		input: createD2lRouteInputSchema(getD2lRoute(346)),
		output: createD2lRouteOutputSchema(getD2lRoute(346)),
	},
	'learningEnvironment.getOrgUnitIdGradesFinalValues': {
		input: createD2lRouteInputSchema(getD2lRoute(347)),
		output: createD2lRouteOutputSchema(getD2lRoute(347)),
	},
	'learningEnvironment.getOrgUnitIdGradesFinalValuesUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(348)),
		output: createD2lRouteOutputSchema(getD2lRoute(348)),
	},
	'learningEnvironment.putOrgUnitIdGradesFinalValuesUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(349)),
		output: createD2lRouteOutputSchema(getD2lRoute(349)),
	},
	'learningEnvironment.getOrgUnitIdGradesFinalValuesMyGradeValue': {
		input: createD2lRouteInputSchema(getD2lRoute(350)),
		output: createD2lRouteOutputSchema(getD2lRoute(350)),
	},
	'learningEnvironment.getOrgUnitIdGradesSchemes': {
		input: createD2lRouteInputSchema(getD2lRoute(351)),
		output: createD2lRouteOutputSchema(getD2lRoute(351)),
	},
	'learningEnvironment.postOrgUnitIdGradesSchemes': {
		input: createD2lRouteInputSchema(getD2lRoute(352)),
		output: createD2lRouteOutputSchema(getD2lRoute(352)),
	},
	'learningEnvironment.deleteOrgUnitIdGradesSchemesGradeSchemeId': {
		input: createD2lRouteInputSchema(getD2lRoute(353)),
		output: createD2lRouteOutputSchema(getD2lRoute(353)),
	},
	'learningEnvironment.getOrgUnitIdGradesSchemesGradeSchemeId': {
		input: createD2lRouteInputSchema(getD2lRoute(354)),
		output: createD2lRouteOutputSchema(getD2lRoute(354)),
	},
	'learningEnvironment.getOrgUnitIdGradesSchemesDefault': {
		input: createD2lRouteInputSchema(getD2lRoute(355)),
		output: createD2lRouteOutputSchema(getD2lRoute(355)),
	},
	'learningEnvironment.getOrgUnitIdGradesSetup': {
		input: createD2lRouteInputSchema(getD2lRoute(356)),
		output: createD2lRouteOutputSchema(getD2lRoute(356)),
	},
	'learningEnvironment.putOrgUnitIdGradesSetup': {
		input: createD2lRouteInputSchema(getD2lRoute(357)),
		output: createD2lRouteOutputSchema(getD2lRoute(357)),
	},
	'learningEnvironment.getOrgUnitIdGradesValues': {
		input: createD2lRouteInputSchema(getD2lRoute(358)),
		output: createD2lRouteOutputSchema(getD2lRoute(358)),
	},
	'learningEnvironment.getOrgUnitIdGradesValuesUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(359)),
		output: createD2lRouteOutputSchema(getD2lRoute(359)),
	},
	'learningEnvironment.getOrgUnitIdGradesValuesDescendants': {
		input: createD2lRouteInputSchema(getD2lRoute(360)),
		output: createD2lRouteOutputSchema(getD2lRoute(360)),
	},
	'learningEnvironment.getOrgUnitIdGradesValuesMyGradeValues': {
		input: createD2lRouteInputSchema(getD2lRoute(361)),
		output: createD2lRouteOutputSchema(getD2lRoute(361)),
	},
	'learningEnvironment.getOrgUnitIdLoAlignments': {
		input: createD2lRouteInputSchema(getD2lRoute(362)),
		output: createD2lRouteOutputSchema(getD2lRoute(362)),
	},
	'learningEnvironment.getOrgUnitIdLoAlignmentsActivityActivityTypeObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(363)),
		output: createD2lRouteOutputSchema(getD2lRoute(363)),
	},
	'learningEnvironment.postOrgUnitIdLoAlignmentsActivityActivityTypeObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(364)),
		output: createD2lRouteOutputSchema(getD2lRoute(364)),
	},
	'learningEnvironment.getOrgUnitIdLoAlignmentsOutcomeOutcomeId': {
		input: createD2lRouteInputSchema(getD2lRoute(365)),
		output: createD2lRouteOutputSchema(getD2lRoute(365)),
	},
	'learningEnvironment.getOrgUnitIdLoAlignmentsOutcomeSetOutcomeSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(366)),
		output: createD2lRouteOutputSchema(getD2lRoute(366)),
	},
	'learningEnvironment.postOrgUnitIdLoBulkExport': {
		input: createD2lRouteInputSchema(getD2lRoute(367)),
		output: createD2lRouteOutputSchema(getD2lRoute(367)),
	},
	'learningEnvironment.postOrgUnitIdLoBulkImport': {
		input: createD2lRouteInputSchema(getD2lRoute(368)),
		output: createD2lRouteOutputSchema(getD2lRoute(368)),
	},
	'learningEnvironment.getOrgUnitIdLoOutcomeSets': {
		input: createD2lRouteInputSchema(getD2lRoute(369)),
		output: createD2lRouteOutputSchema(getD2lRoute(369)),
	},
	'learningEnvironment.getOrgUnitIdLoOutcomeSetsOutcomeSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(370)),
		output: createD2lRouteOutputSchema(getD2lRoute(370)),
	},
	'learningEnvironment.putOrgUnitIdLoOutcomeSetsOutcomeSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(371)),
		output: createD2lRouteOutputSchema(getD2lRoute(371)),
	},
	'learningEnvironment.deleteOrgUnitIdLockerGroupGroupIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(372)),
		output: createD2lRouteOutputSchema(getD2lRoute(372)),
	},
	'learningEnvironment.getOrgUnitIdLockerGroupGroupIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(373)),
		output: createD2lRouteOutputSchema(getD2lRoute(373)),
	},
	'learningEnvironment.postOrgUnitIdLockerGroupGroupIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(374)),
		output: createD2lRouteOutputSchema(getD2lRoute(374)),
	},
	'learningEnvironment.putOrgUnitIdLockerGroupGroupIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(375)),
		output: createD2lRouteOutputSchema(getD2lRoute(375)),
	},
	'learningEnvironment.getOrgUnitIdNews': {
		input: createD2lRouteInputSchema(getD2lRoute(376)),
		output: createD2lRouteOutputSchema(getD2lRoute(376)),
	},
	'learningEnvironment.postOrgUnitIdNews': {
		input: createD2lRouteInputSchema(getD2lRoute(377)),
		output: createD2lRouteOutputSchema(getD2lRoute(377)),
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemId': {
		input: createD2lRouteInputSchema(getD2lRoute(378)),
		output: createD2lRouteOutputSchema(getD2lRoute(378)),
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemId': {
		input: createD2lRouteInputSchema(getD2lRoute(379)),
		output: createD2lRouteOutputSchema(getD2lRoute(379)),
	},
	'learningEnvironment.putOrgUnitIdNewsNewsItemId': {
		input: createD2lRouteInputSchema(getD2lRoute(380)),
		output: createD2lRouteOutputSchema(getD2lRoute(380)),
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(381)),
		output: createD2lRouteOutputSchema(getD2lRoute(381)),
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdAttachments': {
		input: createD2lRouteInputSchema(getD2lRoute(382)),
		output: createD2lRouteOutputSchema(getD2lRoute(382)),
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemIdAttachmentsFileId': {
		input: createD2lRouteInputSchema(getD2lRoute(383)),
		output: createD2lRouteOutputSchema(getD2lRoute(383)),
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemIdAttachmentsFileId': {
		input: createD2lRouteInputSchema(getD2lRoute(384)),
		output: createD2lRouteOutputSchema(getD2lRoute(384)),
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdDismiss': {
		input: createD2lRouteInputSchema(getD2lRoute(385)),
		output: createD2lRouteOutputSchema(getD2lRoute(385)),
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdPublish': {
		input: createD2lRouteInputSchema(getD2lRoute(386)),
		output: createD2lRouteOutputSchema(getD2lRoute(386)),
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdRestore': {
		input: createD2lRouteInputSchema(getD2lRoute(387)),
		output: createD2lRouteOutputSchema(getD2lRoute(387)),
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(388)),
		output: createD2lRouteOutputSchema(getD2lRoute(388)),
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(389)),
		output: createD2lRouteOutputSchema(getD2lRoute(389)),
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(390)),
		output: createD2lRouteOutputSchema(getD2lRoute(390)),
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemIdSharingSharingOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(391)),
		output: createD2lRouteOutputSchema(getD2lRoute(391)),
	},
	'learningEnvironment.putOrgUnitIdNewsNewsItemIdSharingSharingOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(392)),
		output: createD2lRouteOutputSchema(getD2lRoute(392)),
	},
	'learningEnvironment.getOrgUnitIdNewsDeleted': {
		input: createD2lRouteInputSchema(getD2lRoute(393)),
		output: createD2lRouteOutputSchema(getD2lRoute(393)),
	},
	'learningEnvironment.postOrgUnitIdNewsDeletedNewsItemIdRestore': {
		input: createD2lRouteInputSchema(getD2lRoute(394)),
		output: createD2lRouteOutputSchema(getD2lRoute(394)),
	},
	'learningEnvironment.getOrgUnitIdNewsUserUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(395)),
		output: createD2lRouteOutputSchema(getD2lRoute(395)),
	},
	'learningEnvironment.getOrgUnitIdOverview': {
		input: createD2lRouteInputSchema(getD2lRoute(396)),
		output: createD2lRouteOutputSchema(getD2lRoute(396)),
	},
	'learningEnvironment.getOrgUnitIdOverviewAttachment': {
		input: createD2lRouteInputSchema(getD2lRoute(397)),
		output: createD2lRouteOutputSchema(getD2lRoute(397)),
	},
	'learningEnvironment.getOrgUnitIdQuizzes': {
		input: createD2lRouteInputSchema(getD2lRoute(398)),
		output: createD2lRouteOutputSchema(getD2lRoute(398)),
	},
	'learningEnvironment.postOrgUnitIdQuizzes': {
		input: createD2lRouteInputSchema(getD2lRoute(399)),
		output: createD2lRouteOutputSchema(getD2lRoute(399)),
	},
	'learningEnvironment.deleteOrgUnitIdQuizzesQuizId': {
		input: createD2lRouteInputSchema(getD2lRoute(400)),
		output: createD2lRouteOutputSchema(getD2lRoute(400)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizId': {
		input: createD2lRouteInputSchema(getD2lRoute(401)),
		output: createD2lRouteOutputSchema(getD2lRoute(401)),
	},
	'learningEnvironment.putOrgUnitIdQuizzesQuizId': {
		input: createD2lRouteInputSchema(getD2lRoute(402)),
		output: createD2lRouteOutputSchema(getD2lRoute(402)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(403)),
		output: createD2lRouteOutputSchema(getD2lRoute(403)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdAttempts': {
		input: createD2lRouteInputSchema(getD2lRoute(404)),
		output: createD2lRouteOutputSchema(getD2lRoute(404)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdAttemptsAttemptId': {
		input: createD2lRouteInputSchema(getD2lRoute(405)),
		output: createD2lRouteOutputSchema(getD2lRoute(405)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdQuestions': {
		input: createD2lRouteInputSchema(getD2lRoute(406)),
		output: createD2lRouteOutputSchema(getD2lRoute(406)),
	},
	'learningEnvironment.postOrgUnitIdQuizzesQuizIdQuestions': {
		input: createD2lRouteInputSchema(getD2lRoute(407)),
		output: createD2lRouteOutputSchema(getD2lRoute(407)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdQuestionsQuestionId': {
		input: createD2lRouteInputSchema(getD2lRoute(408)),
		output: createD2lRouteOutputSchema(getD2lRoute(408)),
	},
	'learningEnvironment.putOrgUnitIdQuizzesQuizIdQuestionsQuestionId': {
		input: createD2lRouteInputSchema(getD2lRoute(409)),
		output: createD2lRouteOutputSchema(getD2lRoute(409)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdSpecialaccess': {
		input: createD2lRouteInputSchema(getD2lRoute(410)),
		output: createD2lRouteOutputSchema(getD2lRoute(410)),
	},
	'learningEnvironment.deleteOrgUnitIdQuizzesQuizIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(411)),
		output: createD2lRouteOutputSchema(getD2lRoute(411)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(412)),
		output: createD2lRouteOutputSchema(getD2lRoute(412)),
	},
	'learningEnvironment.putOrgUnitIdQuizzesQuizIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(413)),
		output: createD2lRouteOutputSchema(getD2lRoute(413)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(414)),
		output: createD2lRouteOutputSchema(getD2lRoute(414)),
	},
	'learningEnvironment.postOrgUnitIdQuizzesCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(415)),
		output: createD2lRouteOutputSchema(getD2lRoute(415)),
	},
	'learningEnvironment.deleteOrgUnitIdQuizzesCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(416)),
		output: createD2lRouteOutputSchema(getD2lRoute(416)),
	},
	'learningEnvironment.getOrgUnitIdQuizzesCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(417)),
		output: createD2lRouteOutputSchema(getD2lRoute(417)),
	},
	'learningEnvironment.putOrgUnitIdQuizzesCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(418)),
		output: createD2lRouteOutputSchema(getD2lRoute(418)),
	},
	'learningEnvironment.getOrgUnitIdRubrics': {
		input: createD2lRouteInputSchema(getD2lRoute(419)),
		output: createD2lRouteOutputSchema(getD2lRoute(419)),
	},
	'learningEnvironment.postOrgUnitIdRubrics': {
		input: createD2lRouteInputSchema(getD2lRoute(420)),
		output: createD2lRouteOutputSchema(getD2lRoute(420)),
	},
	'learningEnvironment.deleteOrgUnitIdRubricsRubricId': {
		input: createD2lRouteInputSchema(getD2lRoute(421)),
		output: createD2lRouteOutputSchema(getD2lRoute(421)),
	},
	'learningEnvironment.getOrgUnitIdRubricsRubricId': {
		input: createD2lRouteInputSchema(getD2lRoute(422)),
		output: createD2lRouteOutputSchema(getD2lRoute(422)),
	},
	'learningEnvironment.putOrgUnitIdRubricsRubricId': {
		input: createD2lRouteInputSchema(getD2lRoute(423)),
		output: createD2lRouteOutputSchema(getD2lRoute(423)),
	},
	'learningEnvironment.getOrgUnitIdRubricsAssociations': {
		input: createD2lRouteInputSchema(getD2lRoute(424)),
		output: createD2lRouteOutputSchema(getD2lRoute(424)),
	},
	'learningEnvironment.getOrgUnitIdRubricsAssociationsActivityActivityTypeObjectId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(425)),
			output: createD2lRouteOutputSchema(getD2lRoute(425)),
		},
	'learningEnvironment.postOrgUnitIdRubricsAssociationsActivityActivityTypeObjectId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(426)),
			output: createD2lRouteOutputSchema(getD2lRoute(426)),
		},
	'learningEnvironment.putOrgUnitIdRubricsInfoRubricId': {
		input: createD2lRouteInputSchema(getD2lRoute(427)),
		output: createD2lRouteOutputSchema(getD2lRoute(427)),
	},
	'learningEnvironment.getOrgUnitIdSurveys': {
		input: createD2lRouteInputSchema(getD2lRoute(428)),
		output: createD2lRouteOutputSchema(getD2lRoute(428)),
	},
	'learningEnvironment.postOrgUnitIdSurveys': {
		input: createD2lRouteInputSchema(getD2lRoute(429)),
		output: createD2lRouteOutputSchema(getD2lRoute(429)),
	},
	'learningEnvironment.deleteOrgUnitIdSurveysSurveyId': {
		input: createD2lRouteInputSchema(getD2lRoute(430)),
		output: createD2lRouteOutputSchema(getD2lRoute(430)),
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyId': {
		input: createD2lRouteInputSchema(getD2lRoute(431)),
		output: createD2lRouteOutputSchema(getD2lRoute(431)),
	},
	'learningEnvironment.putOrgUnitIdSurveysSurveyId': {
		input: createD2lRouteInputSchema(getD2lRoute(432)),
		output: createD2lRouteOutputSchema(getD2lRoute(432)),
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(433)),
		output: createD2lRouteOutputSchema(getD2lRoute(433)),
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdAttempts': {
		input: createD2lRouteInputSchema(getD2lRoute(434)),
		output: createD2lRouteOutputSchema(getD2lRoute(434)),
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdAttemptsAttemptId': {
		input: createD2lRouteInputSchema(getD2lRoute(435)),
		output: createD2lRouteOutputSchema(getD2lRoute(435)),
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdQuestions': {
		input: createD2lRouteInputSchema(getD2lRoute(436)),
		output: createD2lRouteOutputSchema(getD2lRoute(436)),
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdSpecialaccess': {
		input: createD2lRouteInputSchema(getD2lRoute(437)),
		output: createD2lRouteOutputSchema(getD2lRoute(437)),
	},
	'learningEnvironment.deleteOrgUnitIdSurveysSurveyIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(438)),
		output: createD2lRouteOutputSchema(getD2lRoute(438)),
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(439)),
		output: createD2lRouteOutputSchema(getD2lRoute(439)),
	},
	'learningEnvironment.putOrgUnitIdSurveysSurveyIdSpecialaccessUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(440)),
		output: createD2lRouteOutputSchema(getD2lRoute(440)),
	},
	'learningEnvironment.getOrgUnitIdSurveysCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(441)),
		output: createD2lRouteOutputSchema(getD2lRoute(441)),
	},
	'learningEnvironment.postOrgUnitIdSurveysCategories': {
		input: createD2lRouteInputSchema(getD2lRoute(442)),
		output: createD2lRouteOutputSchema(getD2lRoute(442)),
	},
	'learningEnvironment.deleteOrgUnitIdSurveysCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(443)),
		output: createD2lRouteOutputSchema(getD2lRoute(443)),
	},
	'learningEnvironment.getOrgUnitIdSurveysCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(444)),
		output: createD2lRouteOutputSchema(getD2lRoute(444)),
	},
	'learningEnvironment.putOrgUnitIdSurveysCategoriesCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(445)),
		output: createD2lRouteOutputSchema(getD2lRoute(445)),
	},
	'learningEnvironment.getOrgUnitIdUpdatesMyUpdates': {
		input: createD2lRouteInputSchema(getD2lRoute(446)),
		output: createD2lRouteOutputSchema(getD2lRoute(446)),
	},
	'learningEnvironment.putAccommodations': {
		input: createD2lRouteInputSchema(getD2lRoute(447)),
		output: createD2lRouteOutputSchema(getD2lRoute(447)),
	},
	'learningEnvironment.getAccommodationsOrgUnitIdMyaccommodations': {
		input: createD2lRouteInputSchema(getD2lRoute(448)),
		output: createD2lRouteOutputSchema(getD2lRoute(448)),
	},
	'learningEnvironment.getAccommodationsOrgUnitIdUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(449)),
		output: createD2lRouteOutputSchema(getD2lRoute(449)),
	},
	'learningEnvironment.getAuditingAuditeesAuditeeId': {
		input: createD2lRouteInputSchema(getD2lRoute(450)),
		output: createD2lRouteOutputSchema(getD2lRoute(450)),
	},
	'learningEnvironment.getAuditingAuditorsAuditorId': {
		input: createD2lRouteInputSchema(getD2lRoute(451)),
		output: createD2lRouteOutputSchema(getD2lRoute(451)),
	},
	'learningEnvironment.deleteAuditingAuditorsAuditorIdAuditees': {
		input: createD2lRouteInputSchema(getD2lRoute(452)),
		output: createD2lRouteOutputSchema(getD2lRoute(452)),
	},
	'learningEnvironment.getAuditingAuditorsAuditorIdAuditees': {
		input: createD2lRouteInputSchema(getD2lRoute(453)),
		output: createD2lRouteOutputSchema(getD2lRoute(453)),
	},
	'learningEnvironment.postAuditingAuditorsAuditorIdAuditees': {
		input: createD2lRouteInputSchema(getD2lRoute(454)),
		output: createD2lRouteOutputSchema(getD2lRoute(454)),
	},
	'learningEnvironment.getCalendarEventsUserIdItemCounts': {
		input: createD2lRouteInputSchema(getD2lRoute(455)),
		output: createD2lRouteOutputSchema(getD2lRoute(455)),
	},
	'learningEnvironment.getCalendarEventsMyEvents': {
		input: createD2lRouteInputSchema(getD2lRoute(456)),
		output: createD2lRouteOutputSchema(getD2lRoute(456)),
	},
	'learningEnvironment.getCalendarEventsMyEventsItemCounts': {
		input: createD2lRouteInputSchema(getD2lRoute(457)),
		output: createD2lRouteOutputSchema(getD2lRoute(457)),
	},
	'learningEnvironment.getCalendarEventsMyEventsWithOccurrences': {
		input: createD2lRouteInputSchema(getD2lRoute(458)),
		output: createD2lRouteOutputSchema(getD2lRoute(458)),
	},
	'learningEnvironment.getCcbLogs': {
		input: createD2lRouteInputSchema(getD2lRoute(459)),
		output: createD2lRouteOutputSchema(getD2lRoute(459)),
	},
	'learningEnvironment.getContentCompletionsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(460)),
		output: createD2lRouteOutputSchema(getD2lRoute(460)),
	},
	'learningEnvironment.getContentItemsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(461)),
		output: createD2lRouteOutputSchema(getD2lRoute(461)),
	},
	'learningEnvironment.getContentMyItems': {
		input: createD2lRouteInputSchema(getD2lRoute(462)),
		output: createD2lRouteOutputSchema(getD2lRoute(462)),
	},
	'learningEnvironment.getContentMyItemsCompletions': {
		input: createD2lRouteInputSchema(getD2lRoute(463)),
		output: createD2lRouteOutputSchema(getD2lRoute(463)),
	},
	'learningEnvironment.getContentMyItemsCompletionsDue': {
		input: createD2lRouteInputSchema(getD2lRoute(464)),
		output: createD2lRouteOutputSchema(getD2lRoute(464)),
	},
	'learningEnvironment.getContentMyItemsDue': {
		input: createD2lRouteInputSchema(getD2lRoute(465)),
		output: createD2lRouteOutputSchema(getD2lRoute(465)),
	},
	'learningEnvironment.getContentMyItemsDueItemCounts': {
		input: createD2lRouteInputSchema(getD2lRoute(466)),
		output: createD2lRouteOutputSchema(getD2lRoute(466)),
	},
	'learningEnvironment.getContentMyItemsItemCounts': {
		input: createD2lRouteInputSchema(getD2lRoute(467)),
		output: createD2lRouteOutputSchema(getD2lRoute(467)),
	},
	'learningEnvironment.getCpdCategoryCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(468)),
		output: createD2lRouteOutputSchema(getD2lRoute(468)),
	},
	'learningEnvironment.getCpdMethodMethodId': {
		input: createD2lRouteInputSchema(getD2lRoute(469)),
		output: createD2lRouteOutputSchema(getD2lRoute(469)),
	},
	'learningEnvironment.getCpdQuestionQuestionId': {
		input: createD2lRouteInputSchema(getD2lRoute(470)),
		output: createD2lRouteOutputSchema(getD2lRoute(470)),
	},
	'learningEnvironment.getCpdRecordRecordId': {
		input: createD2lRouteInputSchema(getD2lRoute(471)),
		output: createD2lRouteOutputSchema(getD2lRoute(471)),
	},
	'learningEnvironment.putCpdRecordRecordId': {
		input: createD2lRouteInputSchema(getD2lRoute(472)),
		output: createD2lRouteOutputSchema(getD2lRoute(472)),
	},
	'learningEnvironment.getCpdRecordRecordIdAttachmentAttachmentId': {
		input: createD2lRouteInputSchema(getD2lRoute(473)),
		output: createD2lRouteOutputSchema(getD2lRoute(473)),
	},
	'learningEnvironment.postCpdRecordRecordIdAttachmentUpload': {
		input: createD2lRouteInputSchema(getD2lRoute(474)),
		output: createD2lRouteOutputSchema(getD2lRoute(474)),
	},
	'learningEnvironment.deleteCpdRecordRecordIdAttachments': {
		input: createD2lRouteInputSchema(getD2lRoute(475)),
		output: createD2lRouteOutputSchema(getD2lRoute(475)),
	},
	'learningEnvironment.postCpdRecordRecordIdAttachments': {
		input: createD2lRouteInputSchema(getD2lRoute(476)),
		output: createD2lRouteOutputSchema(getD2lRoute(476)),
	},
	'learningEnvironment.getCpdRecordUserUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(477)),
		output: createD2lRouteOutputSchema(getD2lRoute(477)),
	},
	'learningEnvironment.getCpdTargetProgressUserUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(478)),
		output: createD2lRouteOutputSchema(getD2lRoute(478)),
	},
	'learningEnvironment.postCpdUserUserIdRecord': {
		input: createD2lRouteInputSchema(getD2lRoute(479)),
		output: createD2lRouteOutputSchema(getD2lRoute(479)),
	},
	'learningEnvironment.getDropboxOrgUnitsFeedback': {
		input: createD2lRouteInputSchema(getD2lRoute(480)),
		output: createD2lRouteOutputSchema(getD2lRoute(480)),
	},
	'learningEnvironment.getGradesCourseCompletionUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(481)),
		output: createD2lRouteOutputSchema(getD2lRoute(481)),
	},
	'learningEnvironment.getGradesFinalValuesMyGradeValues': {
		input: createD2lRouteInputSchema(getD2lRoute(482)),
		output: createD2lRouteOutputSchema(getD2lRoute(482)),
	},
	'learningEnvironment.getGradesValuesUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(483)),
		output: createD2lRouteOutputSchema(getD2lRoute(483)),
	},
	'learningEnvironment.postImportOrgUnitIdCopy': {
		input: createD2lRouteInputSchema(getD2lRoute(484)),
		output: createD2lRouteOutputSchema(getD2lRoute(484)),
	},
	'learningEnvironment.getImportOrgUnitIdCopyJobToken': {
		input: createD2lRouteInputSchema(getD2lRoute(485)),
		output: createD2lRouteOutputSchema(getD2lRoute(485)),
	},
	'learningEnvironment.postImportOrgUnitIdImports': {
		input: createD2lRouteInputSchema(getD2lRoute(486)),
		output: createD2lRouteOutputSchema(getD2lRoute(486)),
	},
	'learningEnvironment.getImportOrgUnitIdImportsJobToken': {
		input: createD2lRouteInputSchema(getD2lRoute(487)),
		output: createD2lRouteOutputSchema(getD2lRoute(487)),
	},
	'learningEnvironment.getImportOrgUnitidImportsJobTokenLogs': {
		input: createD2lRouteInputSchema(getD2lRoute(488)),
		output: createD2lRouteOutputSchema(getD2lRoute(488)),
	},
	'learningEnvironment.getLoAlignmentsOutcomeOutcomeId': {
		input: createD2lRouteInputSchema(getD2lRoute(489)),
		output: createD2lRouteOutputSchema(getD2lRoute(489)),
	},
	'learningEnvironment.getLoAlignmentsOutcomeSetOutcomeSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(490)),
		output: createD2lRouteOutputSchema(getD2lRoute(490)),
	},
	'learningEnvironment.postLoBulkExport': {
		input: createD2lRouteInputSchema(getD2lRoute(491)),
		output: createD2lRouteOutputSchema(getD2lRoute(491)),
	},
	'learningEnvironment.postLoBulkImport': {
		input: createD2lRouteInputSchema(getD2lRoute(492)),
		output: createD2lRouteOutputSchema(getD2lRoute(492)),
	},
	'learningEnvironment.getLoOutcomeScales': {
		input: createD2lRouteInputSchema(getD2lRoute(493)),
		output: createD2lRouteOutputSchema(getD2lRoute(493)),
	},
	'learningEnvironment.postLoOutcomeScales': {
		input: createD2lRouteInputSchema(getD2lRoute(494)),
		output: createD2lRouteOutputSchema(getD2lRoute(494)),
	},
	'learningEnvironment.deleteLoOutcomeScalesScaleId': {
		input: createD2lRouteInputSchema(getD2lRoute(495)),
		output: createD2lRouteOutputSchema(getD2lRoute(495)),
	},
	'learningEnvironment.getLoOutcomeScalesScaleId': {
		input: createD2lRouteInputSchema(getD2lRoute(496)),
		output: createD2lRouteOutputSchema(getD2lRoute(496)),
	},
	'learningEnvironment.putLoOutcomeScalesScaleId': {
		input: createD2lRouteInputSchema(getD2lRoute(497)),
		output: createD2lRouteOutputSchema(getD2lRoute(497)),
	},
	'learningEnvironment.putLoOutcomeScalesScaleIdLevelId': {
		input: createD2lRouteInputSchema(getD2lRoute(498)),
		output: createD2lRouteOutputSchema(getD2lRoute(498)),
	},
	'learningEnvironment.getLoOutcomeSets': {
		input: createD2lRouteInputSchema(getD2lRoute(499)),
		output: createD2lRouteOutputSchema(getD2lRoute(499)),
	},
	'learningEnvironment.postLoOutcomeSets': {
		input: createD2lRouteInputSchema(getD2lRoute(500)),
		output: createD2lRouteOutputSchema(getD2lRoute(500)),
	},
	'learningEnvironment.deleteLoOutcomeSetsOutcomeSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(501)),
		output: createD2lRouteOutputSchema(getD2lRoute(501)),
	},
	'learningEnvironment.getLoOutcomeSetsOutcomeSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(502)),
		output: createD2lRouteOutputSchema(getD2lRoute(502)),
	},
	'learningEnvironment.putLoOutcomeSetsOutcomeSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(503)),
		output: createD2lRouteOutputSchema(getD2lRoute(503)),
	},
	'learningEnvironment.deleteLockerMyLockerPath': {
		input: createD2lRouteInputSchema(getD2lRoute(504)),
		output: createD2lRouteOutputSchema(getD2lRoute(504)),
	},
	'learningEnvironment.getLockerMyLockerPath': {
		input: createD2lRouteInputSchema(getD2lRoute(505)),
		output: createD2lRouteOutputSchema(getD2lRoute(505)),
	},
	'learningEnvironment.postLockerMyLockerPath': {
		input: createD2lRouteInputSchema(getD2lRoute(506)),
		output: createD2lRouteOutputSchema(getD2lRoute(506)),
	},
	'learningEnvironment.putLockerMyLockerPath': {
		input: createD2lRouteInputSchema(getD2lRoute(507)),
		output: createD2lRouteOutputSchema(getD2lRoute(507)),
	},
	'learningEnvironment.deleteLockerUserUserIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(508)),
		output: createD2lRouteOutputSchema(getD2lRoute(508)),
	},
	'learningEnvironment.getLockerUserUserIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(509)),
		output: createD2lRouteOutputSchema(getD2lRoute(509)),
	},
	'learningEnvironment.postLockerUserUserIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(510)),
		output: createD2lRouteOutputSchema(getD2lRoute(510)),
	},
	'learningEnvironment.putLockerUserUserIdPath': {
		input: createD2lRouteInputSchema(getD2lRoute(511)),
		output: createD2lRouteOutputSchema(getD2lRoute(511)),
	},
	'learningEnvironment.deleteLtiLinkLtiLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(512)),
		output: createD2lRouteOutputSchema(getD2lRoute(512)),
	},
	'learningEnvironment.putLtiLinkLtiLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(513)),
		output: createD2lRouteOutputSchema(getD2lRoute(513)),
	},
	'learningEnvironment.postLtiLinkOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(514)),
		output: createD2lRouteOutputSchema(getD2lRoute(514)),
	},
	'learningEnvironment.getLtiLinkOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(515)),
		output: createD2lRouteOutputSchema(getD2lRoute(515)),
	},
	'learningEnvironment.deleteLtiLinkOrgUnitIdLinkIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(516)),
		output: createD2lRouteOutputSchema(getD2lRoute(516)),
	},
	'learningEnvironment.getLtiLinkOrgUnitIdLinkIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(517)),
		output: createD2lRouteOutputSchema(getD2lRoute(517)),
	},
	'learningEnvironment.postLtiLinkOrgUnitIdLinkIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(518)),
		output: createD2lRouteOutputSchema(getD2lRoute(518)),
	},
	'learningEnvironment.deleteLtiLinkOrgUnitIdLinkIdSharingSharingOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(519)),
		output: createD2lRouteOutputSchema(getD2lRoute(519)),
	},
	'learningEnvironment.putLtiLinkOrgUnitIdLinkIdSharingSharingOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(520)),
		output: createD2lRouteOutputSchema(getD2lRoute(520)),
	},
	'learningEnvironment.getLtiLinkOrgUnitIdLtiLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(521)),
		output: createD2lRouteOutputSchema(getD2lRoute(521)),
	},
	'learningEnvironment.postLtiQuicklinkOrgUnitIdLtiLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(522)),
		output: createD2lRouteOutputSchema(getD2lRoute(522)),
	},
	'learningEnvironment.postLtiTpOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(523)),
		output: createD2lRouteOutputSchema(getD2lRoute(523)),
	},
	'learningEnvironment.getLtiTpOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(524)),
		output: createD2lRouteOutputSchema(getD2lRoute(524)),
	},
	'learningEnvironment.getLtiTpOrgUnitIdTpId': {
		input: createD2lRouteInputSchema(getD2lRoute(525)),
		output: createD2lRouteOutputSchema(getD2lRoute(525)),
	},
	'learningEnvironment.deleteLtiTpOrgUnitIdTpIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(526)),
		output: createD2lRouteOutputSchema(getD2lRoute(526)),
	},
	'learningEnvironment.getLtiTpOrgUnitIdTpIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(527)),
		output: createD2lRouteOutputSchema(getD2lRoute(527)),
	},
	'learningEnvironment.postLtiTpOrgUnitIdTpIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(528)),
		output: createD2lRouteOutputSchema(getD2lRoute(528)),
	},
	'learningEnvironment.deleteLtiTpOrgUnitIdTpIdSharingSharingOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(529)),
		output: createD2lRouteOutputSchema(getD2lRoute(529)),
	},
	'learningEnvironment.putLtiTpOrgUnitIdTpIdSharingSharingOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(530)),
		output: createD2lRouteOutputSchema(getD2lRoute(530)),
	},
	'learningEnvironment.deleteLtiTpTpId': {
		input: createD2lRouteInputSchema(getD2lRoute(531)),
		output: createD2lRouteOutputSchema(getD2lRoute(531)),
	},
	'learningEnvironment.putLtiTpTpId': {
		input: createD2lRouteInputSchema(getD2lRoute(532)),
		output: createD2lRouteOutputSchema(getD2lRoute(532)),
	},
	'learningEnvironment.getLtiadvantageDeployment': {
		input: createD2lRouteInputSchema(getD2lRoute(533)),
		output: createD2lRouteOutputSchema(getD2lRoute(533)),
	},
	'learningEnvironment.postLtiadvantageDeployment': {
		input: createD2lRouteInputSchema(getD2lRoute(534)),
		output: createD2lRouteOutputSchema(getD2lRoute(534)),
	},
	'learningEnvironment.deleteLtiadvantageDeploymentDeploymentId': {
		input: createD2lRouteInputSchema(getD2lRoute(535)),
		output: createD2lRouteOutputSchema(getD2lRoute(535)),
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentId': {
		input: createD2lRouteInputSchema(getD2lRoute(536)),
		output: createD2lRouteOutputSchema(getD2lRoute(536)),
	},
	'learningEnvironment.putLtiadvantageDeploymentDeploymentId': {
		input: createD2lRouteInputSchema(getD2lRoute(537)),
		output: createD2lRouteOutputSchema(getD2lRoute(537)),
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentIdAssetprocessors': {
		input: createD2lRouteInputSchema(getD2lRoute(538)),
		output: createD2lRouteOutputSchema(getD2lRoute(538)),
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentIdLinksSummaries': {
		input: createD2lRouteInputSchema(getD2lRoute(539)),
		output: createD2lRouteOutputSchema(getD2lRoute(539)),
	},
	'learningEnvironment.deleteLtiadvantageDeploymentDeploymentIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(540)),
		output: createD2lRouteOutputSchema(getD2lRoute(540)),
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(541)),
		output: createD2lRouteOutputSchema(getD2lRoute(541)),
	},
	'learningEnvironment.postLtiadvantageDeploymentDeploymentIdSharing': {
		input: createD2lRouteInputSchema(getD2lRoute(542)),
		output: createD2lRouteOutputSchema(getD2lRoute(542)),
	},
	'learningEnvironment.deleteLtiadvantageDeploymentDeploymentIdSharingSharingOrgUnitId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(543)),
			output: createD2lRouteOutputSchema(getD2lRoute(543)),
		},
	'learningEnvironment.putLtiadvantageDeploymentDeploymentIdSharingSharingOrgUnitId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(544)),
			output: createD2lRouteOutputSchema(getD2lRoute(544)),
		},
	'learningEnvironment.getLtiadvantageLinksOrganization': {
		input: createD2lRouteInputSchema(getD2lRoute(545)),
		output: createD2lRouteOutputSchema(getD2lRoute(545)),
	},
	'learningEnvironment.postLtiadvantageLinksOrganization': {
		input: createD2lRouteInputSchema(getD2lRoute(546)),
		output: createD2lRouteOutputSchema(getD2lRoute(546)),
	},
	'learningEnvironment.deleteLtiadvantageLinksOrganizationLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(547)),
		output: createD2lRouteOutputSchema(getD2lRoute(547)),
	},
	'learningEnvironment.getLtiadvantageLinksOrganizationLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(548)),
		output: createD2lRouteOutputSchema(getD2lRoute(548)),
	},
	'learningEnvironment.putLtiadvantageLinksOrganizationLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(549)),
		output: createD2lRouteOutputSchema(getD2lRoute(549)),
	},
	'learningEnvironment.getLtiadvantageLinksOrgunitOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(550)),
		output: createD2lRouteOutputSchema(getD2lRoute(550)),
	},
	'learningEnvironment.postLtiadvantageLinksOrgunitOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(551)),
		output: createD2lRouteOutputSchema(getD2lRoute(551)),
	},
	'learningEnvironment.deleteLtiadvantageLinksOrgunitOrgUnitIdLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(552)),
		output: createD2lRouteOutputSchema(getD2lRoute(552)),
	},
	'learningEnvironment.getLtiadvantageLinksOrgunitOrgUnitIdLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(553)),
		output: createD2lRouteOutputSchema(getD2lRoute(553)),
	},
	'learningEnvironment.putLtiadvantageLinksOrgunitOrgUnitIdLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(554)),
		output: createD2lRouteOutputSchema(getD2lRoute(554)),
	},
	'learningEnvironment.getLtiadvantageMigrationJobs': {
		input: createD2lRouteInputSchema(getD2lRoute(555)),
		output: createD2lRouteOutputSchema(getD2lRoute(555)),
	},
	'learningEnvironment.postLtiadvantageMigrationJobs': {
		input: createD2lRouteInputSchema(getD2lRoute(556)),
		output: createD2lRouteOutputSchema(getD2lRoute(556)),
	},
	'learningEnvironment.getLtiadvantageMigrationJobsJobId': {
		input: createD2lRouteInputSchema(getD2lRoute(557)),
		output: createD2lRouteOutputSchema(getD2lRoute(557)),
	},
	'learningEnvironment.postLtiadvantageMigrationLinksLinkId': {
		input: createD2lRouteInputSchema(getD2lRoute(558)),
		output: createD2lRouteOutputSchema(getD2lRoute(558)),
	},
	'learningEnvironment.deleteLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(559)),
			output: createD2lRouteOutputSchema(getD2lRoute(559)),
		},
	'learningEnvironment.getLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(560)),
			output: createD2lRouteOutputSchema(getD2lRoute(560)),
		},
	'learningEnvironment.putLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorIdStatus':
		{
			input: createD2lRouteInputSchema(getD2lRoute(561)),
			output: createD2lRouteOutputSchema(getD2lRoute(561)),
		},
	'learningEnvironment.getLtiadvantageOrgunitOrgUnitIdAssetprocessors': {
		input: createD2lRouteInputSchema(getD2lRoute(562)),
		output: createD2lRouteOutputSchema(getD2lRoute(562)),
	},
	'learningEnvironment.getLtiadvantageRegistration': {
		input: createD2lRouteInputSchema(getD2lRoute(563)),
		output: createD2lRouteOutputSchema(getD2lRoute(563)),
	},
	'learningEnvironment.postLtiadvantageRegistration': {
		input: createD2lRouteInputSchema(getD2lRoute(564)),
		output: createD2lRouteOutputSchema(getD2lRoute(564)),
	},
	'learningEnvironment.deleteLtiadvantageRegistrationClientId': {
		input: createD2lRouteInputSchema(getD2lRoute(565)),
		output: createD2lRouteOutputSchema(getD2lRoute(565)),
	},
	'learningEnvironment.getLtiadvantageRegistrationClientId': {
		input: createD2lRouteInputSchema(getD2lRoute(566)),
		output: createD2lRouteOutputSchema(getD2lRoute(566)),
	},
	'learningEnvironment.putLtiadvantageRegistrationClientId': {
		input: createD2lRouteInputSchema(getD2lRoute(567)),
		output: createD2lRouteOutputSchema(getD2lRoute(567)),
	},
	'learningEnvironment.getLtiadvantageRegistrationClientIdLegacydomains': {
		input: createD2lRouteInputSchema(getD2lRoute(568)),
		output: createD2lRouteOutputSchema(getD2lRoute(568)),
	},
	'learningEnvironment.postLtiadvantageRegistrationClientIdLegacydomains': {
		input: createD2lRouteInputSchema(getD2lRoute(569)),
		output: createD2lRouteOutputSchema(getD2lRoute(569)),
	},
	'learningEnvironment.putLtiadvantageRegistrationClientIdLegacydomains': {
		input: createD2lRouteInputSchema(getD2lRoute(570)),
		output: createD2lRouteOutputSchema(getD2lRoute(570)),
	},
	'learningEnvironment.getNewsUserUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(571)),
		output: createD2lRouteOutputSchema(getD2lRoute(571)),
	},
	'learningEnvironment.getOverdueItems': {
		input: createD2lRouteInputSchema(getD2lRoute(572)),
		output: createD2lRouteOutputSchema(getD2lRoute(572)),
	},
	'learningEnvironment.getOverdueItemsMyItems': {
		input: createD2lRouteInputSchema(getD2lRoute(573)),
		output: createD2lRouteOutputSchema(getD2lRoute(573)),
	},
	'learningEnvironment.getUpdatesMyUpdates': {
		input: createD2lRouteInputSchema(getD2lRoute(574)),
		output: createD2lRouteOutputSchema(getD2lRoute(574)),
	},
	'learningEnvironment.getUserIdentifiersTypes': {
		input: createD2lRouteInputSchema(getD2lRoute(575)),
		output: createD2lRouteOutputSchema(getD2lRoute(575)),
	},
	'learningEnvironment.postUserIdentifiersTypes': {
		input: createD2lRouteInputSchema(getD2lRoute(576)),
		output: createD2lRouteOutputSchema(getD2lRoute(576)),
	},
	'learningEnvironment.deleteUserIdentifiersTypesType': {
		input: createD2lRouteInputSchema(getD2lRoute(577)),
		output: createD2lRouteOutputSchema(getD2lRoute(577)),
	},
	'learningEnvironment.putUserIdentifiersTypesType': {
		input: createD2lRouteInputSchema(getD2lRoute(578)),
		output: createD2lRouteOutputSchema(getD2lRoute(578)),
	},
	'learningEnvironment.putUserIdentifiersUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(579)),
		output: createD2lRouteOutputSchema(getD2lRoute(579)),
	},
	'learningEnvironment.getUserIdentifiersUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(580)),
		output: createD2lRouteOutputSchema(getD2lRoute(580)),
	},
	'learningEnvironment.postIpsisUploadSourceSystemIdSignedurl': {
		input: createD2lRouteInputSchema(getD2lRoute(581)),
		output: createD2lRouteOutputSchema(getD2lRoute(581)),
	},
	'learningObjectRepository.postRepositoryIdUpload': {
		input: createD2lRouteInputSchema(getD2lRoute(582)),
		output: createD2lRouteOutputSchema(getD2lRoute(582)),
	},
	'learningObjectRepository.postRepositoryIdUploadPublish': {
		input: createD2lRouteInputSchema(getD2lRoute(583)),
		output: createD2lRouteOutputSchema(getD2lRoute(583)),
	},
	'learningObjectRepository.putRepositoryIdUploadPublishObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(584)),
		output: createD2lRouteOutputSchema(getD2lRoute(584)),
	},
	'learningObjectRepository.putObjects': {
		input: createD2lRouteInputSchema(getD2lRoute(585)),
		output: createD2lRouteOutputSchema(getD2lRoute(585)),
	},
	'learningObjectRepository.postObjectsObjectId': {
		input: createD2lRouteInputSchema(getD2lRoute(586)),
		output: createD2lRouteOutputSchema(getD2lRoute(586)),
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionDownload': {
		input: createD2lRouteInputSchema(getD2lRoute(587)),
		output: createD2lRouteOutputSchema(getD2lRoute(587)),
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionDownloadfile': {
		input: createD2lRouteInputSchema(getD2lRoute(588)),
		output: createD2lRouteOutputSchema(getD2lRoute(588)),
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionLink': {
		input: createD2lRouteInputSchema(getD2lRoute(589)),
		output: createD2lRouteOutputSchema(getD2lRoute(589)),
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionMetadata': {
		input: createD2lRouteInputSchema(getD2lRoute(590)),
		output: createD2lRouteOutputSchema(getD2lRoute(590)),
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionProperties': {
		input: createD2lRouteInputSchema(getD2lRoute(591)),
		output: createD2lRouteOutputSchema(getD2lRoute(591)),
	},
	'learningObjectRepository.postObjectsObjectIdObjectVersionProperties': {
		input: createD2lRouteInputSchema(getD2lRoute(592)),
		output: createD2lRouteOutputSchema(getD2lRoute(592)),
	},
	'learningObjectRepository.postObjectsObjectIdDelete': {
		input: createD2lRouteInputSchema(getD2lRoute(593)),
		output: createD2lRouteOutputSchema(getD2lRoute(593)),
	},
	'learningObjectRepository.getObjectsObjectIdDownload': {
		input: createD2lRouteInputSchema(getD2lRoute(594)),
		output: createD2lRouteOutputSchema(getD2lRoute(594)),
	},
	'learningObjectRepository.getObjectsObjectIdDownloadfile': {
		input: createD2lRouteInputSchema(getD2lRoute(595)),
		output: createD2lRouteOutputSchema(getD2lRoute(595)),
	},
	'learningObjectRepository.getObjectsObjectIdLink': {
		input: createD2lRouteInputSchema(getD2lRoute(596)),
		output: createD2lRouteOutputSchema(getD2lRoute(596)),
	},
	'learningObjectRepository.getObjectsObjectIdProperties': {
		input: createD2lRouteInputSchema(getD2lRoute(597)),
		output: createD2lRouteOutputSchema(getD2lRoute(597)),
	},
	'learningObjectRepository.postObjectsObjectIdProperties': {
		input: createD2lRouteInputSchema(getD2lRoute(598)),
		output: createD2lRouteOutputSchema(getD2lRoute(598)),
	},
	'learningObjectRepository.getObjectsSearch': {
		input: createD2lRouteInputSchema(getD2lRoute(599)),
		output: createD2lRouteOutputSchema(getD2lRoute(599)),
	},
	'learningObjectRepository.getRepositoriesType': {
		input: createD2lRouteInputSchema(getD2lRoute(600)),
		output: createD2lRouteOutputSchema(getD2lRoute(600)),
	},
	'learningObjectRepository.getRepositoriesAll': {
		input: createD2lRouteInputSchema(getD2lRoute(601)),
		output: createD2lRouteOutputSchema(getD2lRoute(601)),
	},
	'learningObjectRepository.getRepositoryRepositoryIdListorgUnittrusts': {
		input: createD2lRouteInputSchema(getD2lRoute(602)),
		output: createD2lRouteOutputSchema(getD2lRoute(602)),
	},
	'learningPlatform.postGaeVersionLinkuser': {
		input: createD2lRouteInputSchema(getD2lRoute(603)),
		output: createD2lRouteOutputSchema(getD2lRoute(603)),
	},
	'learningPlatform.getOrgUnitIdConditionalReleaseConditionsTargetTypeTargetId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(604)),
			output: createD2lRouteOutputSchema(getD2lRoute(604)),
		},
	'learningPlatform.putOrgUnitIdConditionalReleaseConditionsTargetTypeTargetId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(605)),
			output: createD2lRouteOutputSchema(getD2lRoute(605)),
		},
	'learningPlatform.getOrgUnitIdGroupcategories': {
		input: createD2lRouteInputSchema(getD2lRoute(606)),
		output: createD2lRouteOutputSchema(getD2lRoute(606)),
	},
	'learningPlatform.postOrgUnitIdGroupcategories': {
		input: createD2lRouteInputSchema(getD2lRoute(607)),
		output: createD2lRouteOutputSchema(getD2lRoute(607)),
	},
	'learningPlatform.deleteOrgUnitIdGroupcategoriesGroupCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(608)),
		output: createD2lRouteOutputSchema(getD2lRoute(608)),
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(609)),
		output: createD2lRouteOutputSchema(getD2lRoute(609)),
	},
	'learningPlatform.putOrgUnitIdGroupcategoriesGroupCategoryId': {
		input: createD2lRouteInputSchema(getD2lRoute(610)),
		output: createD2lRouteOutputSchema(getD2lRoute(610)),
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroups': {
		input: createD2lRouteInputSchema(getD2lRoute(611)),
		output: createD2lRouteOutputSchema(getD2lRoute(611)),
	},
	'learningPlatform.postOrgUnitIdGroupcategoriesGroupCategoryIdGroups': {
		input: createD2lRouteInputSchema(getD2lRoute(612)),
		output: createD2lRouteOutputSchema(getD2lRoute(612)),
	},
	'learningPlatform.deleteOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(613)),
			output: createD2lRouteOutputSchema(getD2lRoute(613)),
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId': {
		input: createD2lRouteInputSchema(getD2lRoute(614)),
		output: createD2lRouteOutputSchema(getD2lRoute(614)),
	},
	'learningPlatform.putOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId': {
		input: createD2lRouteInputSchema(getD2lRoute(615)),
		output: createD2lRouteOutputSchema(getD2lRoute(615)),
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollments':
		{
			input: createD2lRouteInputSchema(getD2lRoute(616)),
			output: createD2lRouteOutputSchema(getD2lRoute(616)),
		},
	'learningPlatform.postOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollments':
		{
			input: createD2lRouteInputSchema(getD2lRoute(617)),
			output: createD2lRouteOutputSchema(getD2lRoute(617)),
		},
	'learningPlatform.deleteOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollmentsUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(618)),
			output: createD2lRouteOutputSchema(getD2lRoute(618)),
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdNoenrollments':
		{
			input: createD2lRouteInputSchema(getD2lRoute(619)),
			output: createD2lRouteOutputSchema(getD2lRoute(619)),
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsEnrollments':
		{
			input: createD2lRouteInputSchema(getD2lRoute(620)),
			output: createD2lRouteOutputSchema(getD2lRoute(620)),
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsPaged': {
		input: createD2lRouteInputSchema(getD2lRoute(621)),
		output: createD2lRouteOutputSchema(getD2lRoute(621)),
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdLocker': {
		input: createD2lRouteInputSchema(getD2lRoute(622)),
		output: createD2lRouteOutputSchema(getD2lRoute(622)),
	},
	'learningPlatform.postOrgUnitIdGroupcategoriesGroupCategoryIdLocker': {
		input: createD2lRouteInputSchema(getD2lRoute(623)),
		output: createD2lRouteOutputSchema(getD2lRoute(623)),
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdStatus': {
		input: createD2lRouteInputSchema(getD2lRoute(624)),
		output: createD2lRouteOutputSchema(getD2lRoute(624)),
	},
	'learningPlatform.getOrgUnitIdGroups': {
		input: createD2lRouteInputSchema(getD2lRoute(625)),
		output: createD2lRouteOutputSchema(getD2lRoute(625)),
	},
	'learningPlatform.getOrgUnitIdGroupsSelfEnrollmentAvailable': {
		input: createD2lRouteInputSchema(getD2lRoute(626)),
		output: createD2lRouteOutputSchema(getD2lRoute(626)),
	},
	'learningPlatform.getOrgUnitIdManagefiles': {
		input: createD2lRouteInputSchema(getD2lRoute(627)),
		output: createD2lRouteOutputSchema(getD2lRoute(627)),
	},
	'learningPlatform.deleteOrgUnitIdManagefilesFile': {
		input: createD2lRouteInputSchema(getD2lRoute(628)),
		output: createD2lRouteOutputSchema(getD2lRoute(628)),
	},
	'learningPlatform.getOrgUnitIdManagefilesFile': {
		input: createD2lRouteInputSchema(getD2lRoute(629)),
		output: createD2lRouteOutputSchema(getD2lRoute(629)),
	},
	'learningPlatform.postOrgUnitIdManagefilesFileSave': {
		input: createD2lRouteInputSchema(getD2lRoute(630)),
		output: createD2lRouteOutputSchema(getD2lRoute(630)),
	},
	'learningPlatform.postOrgUnitIdManagefilesFileUpload': {
		input: createD2lRouteInputSchema(getD2lRoute(631)),
		output: createD2lRouteOutputSchema(getD2lRoute(631)),
	},
	'learningPlatform.deleteOrgUnitIdManagefilesFolder': {
		input: createD2lRouteInputSchema(getD2lRoute(632)),
		output: createD2lRouteOutputSchema(getD2lRoute(632)),
	},
	'learningPlatform.postOrgUnitIdManagefilesFolder': {
		input: createD2lRouteInputSchema(getD2lRoute(633)),
		output: createD2lRouteOutputSchema(getD2lRoute(633)),
	},
	'learningPlatform.getOrgUnitIdRoles': {
		input: createD2lRouteInputSchema(getD2lRoute(634)),
		output: createD2lRouteOutputSchema(getD2lRoute(634)),
	},
	'learningPlatform.getOrgUnitIdSections': {
		input: createD2lRouteInputSchema(getD2lRoute(635)),
		output: createD2lRouteOutputSchema(getD2lRoute(635)),
	},
	'learningPlatform.postOrgUnitIdSections': {
		input: createD2lRouteInputSchema(getD2lRoute(636)),
		output: createD2lRouteOutputSchema(getD2lRoute(636)),
	},
	'learningPlatform.putOrgUnitIdSections': {
		input: createD2lRouteInputSchema(getD2lRoute(637)),
		output: createD2lRouteOutputSchema(getD2lRoute(637)),
	},
	'learningPlatform.deleteOrgUnitIdSectionsSectionId': {
		input: createD2lRouteInputSchema(getD2lRoute(638)),
		output: createD2lRouteOutputSchema(getD2lRoute(638)),
	},
	'learningPlatform.getOrgUnitIdSectionsSectionId': {
		input: createD2lRouteInputSchema(getD2lRoute(639)),
		output: createD2lRouteOutputSchema(getD2lRoute(639)),
	},
	'learningPlatform.putOrgUnitIdSectionsSectionId': {
		input: createD2lRouteInputSchema(getD2lRoute(640)),
		output: createD2lRouteOutputSchema(getD2lRoute(640)),
	},
	'learningPlatform.getOrgUnitIdSectionsSectionIdEnrollments': {
		input: createD2lRouteInputSchema(getD2lRoute(641)),
		output: createD2lRouteOutputSchema(getD2lRoute(641)),
	},
	'learningPlatform.postOrgUnitIdSectionsSectionIdEnrollments': {
		input: createD2lRouteInputSchema(getD2lRoute(642)),
		output: createD2lRouteOutputSchema(getD2lRoute(642)),
	},
	'learningPlatform.getOrgUnitIdSectionsSectionIdNoenrollments': {
		input: createD2lRouteInputSchema(getD2lRoute(643)),
		output: createD2lRouteOutputSchema(getD2lRoute(643)),
	},
	'learningPlatform.getOrgUnitIdSectionsEnrollments': {
		input: createD2lRouteInputSchema(getD2lRoute(644)),
		output: createD2lRouteOutputSchema(getD2lRoute(644)),
	},
	'learningPlatform.getOrgUnitIdSectionsMysections': {
		input: createD2lRouteInputSchema(getD2lRoute(645)),
		output: createD2lRouteOutputSchema(getD2lRoute(645)),
	},
	'learningPlatform.getOrgUnitIdSectionsPaged': {
		input: createD2lRouteInputSchema(getD2lRoute(646)),
		output: createD2lRouteOutputSchema(getD2lRoute(646)),
	},
	'learningPlatform.getOrgUnitIdSectionsSettings': {
		input: createD2lRouteInputSchema(getD2lRoute(647)),
		output: createD2lRouteOutputSchema(getD2lRoute(647)),
	},
	'learningPlatform.postOrgUnitIdSectionsSettings': {
		input: createD2lRouteInputSchema(getD2lRoute(648)),
		output: createD2lRouteOutputSchema(getD2lRoute(648)),
	},
	'learningPlatform.putOrgUnitIdSectionsSettings': {
		input: createD2lRouteInputSchema(getD2lRoute(649)),
		output: createD2lRouteOutputSchema(getD2lRoute(649)),
	},
	'learningPlatform.deleteOrgUnitIdWidgetdataCustomWidgetId': {
		input: createD2lRouteInputSchema(getD2lRoute(650)),
		output: createD2lRouteOutputSchema(getD2lRoute(650)),
	},
	'learningPlatform.getOrgUnitIdWidgetdataCustomWidgetId': {
		input: createD2lRouteInputSchema(getD2lRoute(651)),
		output: createD2lRouteOutputSchema(getD2lRoute(651)),
	},
	'learningPlatform.putOrgUnitIdWidgetdataCustomWidgetId': {
		input: createD2lRouteInputSchema(getD2lRoute(652)),
		output: createD2lRouteOutputSchema(getD2lRoute(652)),
	},
	'learningPlatform.deleteOrgUnitIdWidgetdataCustomWidgetIdUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(653)),
		output: createD2lRouteOutputSchema(getD2lRoute(653)),
	},
	'learningPlatform.getOrgUnitIdWidgetdataCustomWidgetIdUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(654)),
		output: createD2lRouteOutputSchema(getD2lRoute(654)),
	},
	'learningPlatform.putOrgUnitIdWidgetdataCustomWidgetIdUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(655)),
		output: createD2lRouteOutputSchema(getD2lRoute(655)),
	},
	'learningPlatform.deleteOrgUnitIdWidgetdataCustomWidgetIdMydata': {
		input: createD2lRouteInputSchema(getD2lRoute(656)),
		output: createD2lRouteOutputSchema(getD2lRoute(656)),
	},
	'learningPlatform.getOrgUnitIdWidgetdataCustomWidgetIdMydata': {
		input: createD2lRouteInputSchema(getD2lRoute(657)),
		output: createD2lRouteOutputSchema(getD2lRoute(657)),
	},
	'learningPlatform.putOrgUnitIdWidgetdataCustomWidgetIdMydata': {
		input: createD2lRouteInputSchema(getD2lRoute(658)),
		output: createD2lRouteOutputSchema(getD2lRoute(658)),
	},
	'learningPlatform.getAccountSettingsUserIdLocale': {
		input: createD2lRouteInputSchema(getD2lRoute(659)),
		output: createD2lRouteOutputSchema(getD2lRoute(659)),
	},
	'learningPlatform.putAccountSettingsUserIdLocale': {
		input: createD2lRouteInputSchema(getD2lRoute(660)),
		output: createD2lRouteOutputSchema(getD2lRoute(660)),
	},
	'learningPlatform.getAccountSettingsMySettingsLocale': {
		input: createD2lRouteInputSchema(getD2lRoute(661)),
		output: createD2lRouteOutputSchema(getD2lRoute(661)),
	},
	'learningPlatform.putAccountSettingsMySettingsLocale': {
		input: createD2lRouteInputSchema(getD2lRoute(662)),
		output: createD2lRouteOutputSchema(getD2lRoute(662)),
	},
	'learningPlatform.getAlertsUserUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(663)),
		output: createD2lRouteOutputSchema(getD2lRoute(663)),
	},
	'learningPlatform.getAttributesSchemas': {
		input: createD2lRouteInputSchema(getD2lRoute(664)),
		output: createD2lRouteOutputSchema(getD2lRoute(664)),
	},
	'learningPlatform.deleteAttributesUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(665)),
		output: createD2lRouteOutputSchema(getD2lRoute(665)),
	},
	'learningPlatform.getAttributesUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(666)),
		output: createD2lRouteOutputSchema(getD2lRoute(666)),
	},
	'learningPlatform.putAttributesUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(667)),
		output: createD2lRouteOutputSchema(getD2lRoute(667)),
	},
	'learningPlatform.getAuthSoaptoken': {
		input: createD2lRouteInputSchema(getD2lRoute(668)),
		output: createD2lRouteOutputSchema(getD2lRoute(668)),
	},
	'learningPlatform.getConfigVariablesVariableIdDefinition': {
		input: createD2lRouteInputSchema(getD2lRoute(669)),
		output: createD2lRouteOutputSchema(getD2lRoute(669)),
	},
	'learningPlatform.getConfigVariablesVariableIdEffectiveValuesOrgUnitsOrgUnitId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(670)),
			output: createD2lRouteOutputSchema(getD2lRoute(670)),
		},
	'learningPlatform.deleteConfigVariablesVariableIdResolver': {
		input: createD2lRouteInputSchema(getD2lRoute(671)),
		output: createD2lRouteOutputSchema(getD2lRoute(671)),
	},
	'learningPlatform.getConfigVariablesVariableIdResolver': {
		input: createD2lRouteInputSchema(getD2lRoute(672)),
		output: createD2lRouteOutputSchema(getD2lRoute(672)),
	},
	'learningPlatform.putConfigVariablesVariableIdResolver': {
		input: createD2lRouteInputSchema(getD2lRoute(673)),
		output: createD2lRouteOutputSchema(getD2lRoute(673)),
	},
	'learningPlatform.getConfigVariablesVariableIdValues': {
		input: createD2lRouteInputSchema(getD2lRoute(674)),
		output: createD2lRouteOutputSchema(getD2lRoute(674)),
	},
	'learningPlatform.getConfigVariablesVariableIdValuesOrg': {
		input: createD2lRouteInputSchema(getD2lRoute(675)),
		output: createD2lRouteOutputSchema(getD2lRoute(675)),
	},
	'learningPlatform.putConfigVariablesVariableIdValuesOrg': {
		input: createD2lRouteInputSchema(getD2lRoute(676)),
		output: createD2lRouteOutputSchema(getD2lRoute(676)),
	},
	'learningPlatform.getConfigVariablesVariableIdValuesOrgUnits': {
		input: createD2lRouteInputSchema(getD2lRoute(677)),
		output: createD2lRouteOutputSchema(getD2lRoute(677)),
	},
	'learningPlatform.getConfigVariablesVariableIdValuesOrgUnitsOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(678)),
		output: createD2lRouteOutputSchema(getD2lRoute(678)),
	},
	'learningPlatform.putConfigVariablesVariableIdValuesOrgUnitsOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(679)),
		output: createD2lRouteOutputSchema(getD2lRoute(679)),
	},
	'learningPlatform.getConfigVariablesVariableIdValuesRoles': {
		input: createD2lRouteInputSchema(getD2lRoute(680)),
		output: createD2lRouteOutputSchema(getD2lRoute(680)),
	},
	'learningPlatform.getConfigVariablesVariableIdValuesRolesRoleId': {
		input: createD2lRouteInputSchema(getD2lRoute(681)),
		output: createD2lRouteOutputSchema(getD2lRoute(681)),
	},
	'learningPlatform.putConfigVariablesVariableIdValuesRolesRoleId': {
		input: createD2lRouteInputSchema(getD2lRoute(682)),
		output: createD2lRouteOutputSchema(getD2lRoute(682)),
	},
	'learningPlatform.getConfigVariablesVariableIdValuesSystem': {
		input: createD2lRouteInputSchema(getD2lRoute(683)),
		output: createD2lRouteOutputSchema(getD2lRoute(683)),
	},
	'learningPlatform.putConfigVariablesVariableIdValuesSystem': {
		input: createD2lRouteInputSchema(getD2lRoute(684)),
		output: createD2lRouteOutputSchema(getD2lRoute(684)),
	},
	'learningPlatform.getConfigVariablesDefinitions': {
		input: createD2lRouteInputSchema(getD2lRoute(685)),
		output: createD2lRouteOutputSchema(getD2lRoute(685)),
	},
	'learningPlatform.postCourses': {
		input: createD2lRouteInputSchema(getD2lRoute(686)),
		output: createD2lRouteOutputSchema(getD2lRoute(686)),
	},
	'learningPlatform.deleteCoursesOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(687)),
		output: createD2lRouteOutputSchema(getD2lRoute(687)),
	},
	'learningPlatform.getCoursesOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(688)),
		output: createD2lRouteOutputSchema(getD2lRoute(688)),
	},
	'learningPlatform.putCoursesOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(689)),
		output: createD2lRouteOutputSchema(getD2lRoute(689)),
	},
	'learningPlatform.getCoursesOrgUnitIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(690)),
		output: createD2lRouteOutputSchema(getD2lRoute(690)),
	},
	'learningPlatform.putCoursesOrgUnitIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(691)),
		output: createD2lRouteOutputSchema(getD2lRoute(691)),
	},
	'learningPlatform.getCoursesBulkUpdateJobTokenId': {
		input: createD2lRouteInputSchema(getD2lRoute(692)),
		output: createD2lRouteOutputSchema(getD2lRoute(692)),
	},
	'learningPlatform.getCoursesParentorgunits': {
		input: createD2lRouteInputSchema(getD2lRoute(693)),
		output: createD2lRouteOutputSchema(getD2lRoute(693)),
	},
	'learningPlatform.getCoursesParents': {
		input: createD2lRouteInputSchema(getD2lRoute(694)),
		output: createD2lRouteOutputSchema(getD2lRoute(694)),
	},
	'learningPlatform.getCoursesQuery': {
		input: createD2lRouteInputSchema(getD2lRoute(695)),
		output: createD2lRouteOutputSchema(getD2lRoute(695)),
	},
	'learningPlatform.getCoursesSchema': {
		input: createD2lRouteInputSchema(getD2lRoute(696)),
		output: createD2lRouteOutputSchema(getD2lRoute(696)),
	},
	'learningPlatform.postCoursesUpdate': {
		input: createD2lRouteInputSchema(getD2lRoute(697)),
		output: createD2lRouteOutputSchema(getD2lRoute(697)),
	},
	'learningPlatform.postCoursetemplates': {
		input: createD2lRouteInputSchema(getD2lRoute(698)),
		output: createD2lRouteOutputSchema(getD2lRoute(698)),
	},
	'learningPlatform.deleteCoursetemplatesOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(699)),
		output: createD2lRouteOutputSchema(getD2lRoute(699)),
	},
	'learningPlatform.getCoursetemplatesOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(700)),
		output: createD2lRouteOutputSchema(getD2lRoute(700)),
	},
	'learningPlatform.putCoursetemplatesOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(701)),
		output: createD2lRouteOutputSchema(getD2lRoute(701)),
	},
	'learningPlatform.getCoursetemplatesSchema': {
		input: createD2lRouteInputSchema(getD2lRoute(702)),
		output: createD2lRouteOutputSchema(getD2lRoute(702)),
	},
	'learningPlatform.getDataExportBds': {
		input: createD2lRouteInputSchema(getD2lRoute(703)),
		output: createD2lRouteOutputSchema(getD2lRoute(703)),
	},
	'learningPlatform.getDataExportBdsPluginidIdentifier': {
		input: createD2lRouteInputSchema(getD2lRoute(704)),
		output: createD2lRouteOutputSchema(getD2lRoute(704)),
	},
	'learningPlatform.getDataExportBdsDownloadPluginid': {
		input: createD2lRouteInputSchema(getD2lRoute(705)),
		output: createD2lRouteOutputSchema(getD2lRoute(705)),
	},
	'learningPlatform.getDataExportBdsList': {
		input: createD2lRouteInputSchema(getD2lRoute(706)),
		output: createD2lRouteOutputSchema(getD2lRoute(706)),
	},
	'learningPlatform.postDataExportCreate': {
		input: createD2lRouteInputSchema(getD2lRoute(707)),
		output: createD2lRouteOutputSchema(getD2lRoute(707)),
	},
	'learningPlatform.getDataExportDownloadExportJobId': {
		input: createD2lRouteInputSchema(getD2lRoute(708)),
		output: createD2lRouteOutputSchema(getD2lRoute(708)),
	},
	'learningPlatform.getDataExportJobs': {
		input: createD2lRouteInputSchema(getD2lRoute(709)),
		output: createD2lRouteOutputSchema(getD2lRoute(709)),
	},
	'learningPlatform.getDataExportJobsExportJobId': {
		input: createD2lRouteInputSchema(getD2lRoute(710)),
		output: createD2lRouteOutputSchema(getD2lRoute(710)),
	},
	'learningPlatform.getDataExportList': {
		input: createD2lRouteInputSchema(getD2lRoute(711)),
		output: createD2lRouteOutputSchema(getD2lRoute(711)),
	},
	'learningPlatform.getDataExportListDataSetId': {
		input: createD2lRouteInputSchema(getD2lRoute(712)),
		output: createD2lRouteOutputSchema(getD2lRoute(712)),
	},
	'learningPlatform.getDataExportVersion': {
		input: createD2lRouteInputSchema(getD2lRoute(713)),
		output: createD2lRouteOutputSchema(getD2lRoute(713)),
	},
	'learningPlatform.getDatasetsBds': {
		input: createD2lRouteInputSchema(getD2lRoute(714)),
		output: createD2lRouteOutputSchema(getD2lRoute(714)),
	},
	'learningPlatform.getDatasetsBdsSchemaIdExtracts': {
		input: createD2lRouteInputSchema(getD2lRoute(715)),
		output: createD2lRouteOutputSchema(getD2lRoute(715)),
	},
	'learningPlatform.getDatasetsBdsSchemaIdPluginsPluginIdExtracts': {
		input: createD2lRouteInputSchema(getD2lRoute(716)),
		output: createD2lRouteOutputSchema(getD2lRoute(716)),
	},
	'learningPlatform.getDatasetsBdsSchemaIdPluginsPluginIdExtractsExtractId': {
		input: createD2lRouteInputSchema(getD2lRoute(717)),
		output: createD2lRouteOutputSchema(getD2lRoute(717)),
	},
	'learningPlatform.getDemographicsDataTypes': {
		input: createD2lRouteInputSchema(getD2lRoute(718)),
		output: createD2lRouteOutputSchema(getD2lRoute(718)),
	},
	'learningPlatform.getDemographicsDataTypesDataTypeId': {
		input: createD2lRouteInputSchema(getD2lRoute(719)),
		output: createD2lRouteOutputSchema(getD2lRoute(719)),
	},
	'learningPlatform.getDemographicsFields': {
		input: createD2lRouteInputSchema(getD2lRoute(720)),
		output: createD2lRouteOutputSchema(getD2lRoute(720)),
	},
	'learningPlatform.postDemographicsFields': {
		input: createD2lRouteInputSchema(getD2lRoute(721)),
		output: createD2lRouteOutputSchema(getD2lRoute(721)),
	},
	'learningPlatform.deleteDemographicsFieldsFieldId': {
		input: createD2lRouteInputSchema(getD2lRoute(722)),
		output: createD2lRouteOutputSchema(getD2lRoute(722)),
	},
	'learningPlatform.getDemographicsFieldsFieldId': {
		input: createD2lRouteInputSchema(getD2lRoute(723)),
		output: createD2lRouteOutputSchema(getD2lRoute(723)),
	},
	'learningPlatform.putDemographicsFieldsFieldId': {
		input: createD2lRouteInputSchema(getD2lRoute(724)),
		output: createD2lRouteOutputSchema(getD2lRoute(724)),
	},
	'learningPlatform.getDemographicsOrgUnitsOrgUnitIdUsers': {
		input: createD2lRouteInputSchema(getD2lRoute(725)),
		output: createD2lRouteOutputSchema(getD2lRoute(725)),
	},
	'learningPlatform.getDemographicsOrgUnitsOrgUnitIdUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(726)),
		output: createD2lRouteOutputSchema(getD2lRoute(726)),
	},
	'learningPlatform.getDemographicsUsers': {
		input: createD2lRouteInputSchema(getD2lRoute(727)),
		output: createD2lRouteOutputSchema(getD2lRoute(727)),
	},
	'learningPlatform.deleteDemographicsUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(728)),
		output: createD2lRouteOutputSchema(getD2lRoute(728)),
	},
	'learningPlatform.getDemographicsUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(729)),
		output: createD2lRouteOutputSchema(getD2lRoute(729)),
	},
	'learningPlatform.putDemographicsUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(730)),
		output: createD2lRouteOutputSchema(getD2lRoute(730)),
	},
	'learningPlatform.postEnrollments': {
		input: createD2lRouteInputSchema(getD2lRoute(731)),
		output: createD2lRouteOutputSchema(getD2lRoute(731)),
	},
	'learningPlatform.postEnrollmentsBatch': {
		input: createD2lRouteInputSchema(getD2lRoute(732)),
		output: createD2lRouteOutputSchema(getD2lRoute(732)),
	},
	'learningPlatform.getEnrollmentsMyenrollments': {
		input: createD2lRouteInputSchema(getD2lRoute(733)),
		output: createD2lRouteOutputSchema(getD2lRoute(733)),
	},
	'learningPlatform.getEnrollmentsMyenrollmentsOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(734)),
		output: createD2lRouteOutputSchema(getD2lRoute(734)),
	},
	'learningPlatform.getEnrollmentsMyenrollmentsOrgUnitIdAccess': {
		input: createD2lRouteInputSchema(getD2lRoute(735)),
		output: createD2lRouteOutputSchema(getD2lRoute(735)),
	},
	'learningPlatform.getEnrollmentsMyenrollmentsOrgUnitIdParentOrgUnits': {
		input: createD2lRouteInputSchema(getD2lRoute(736)),
		output: createD2lRouteOutputSchema(getD2lRoute(736)),
	},
	'learningPlatform.deleteEnrollmentsMyenrollmentsOrgUnitIdPin': {
		input: createD2lRouteInputSchema(getD2lRoute(737)),
		output: createD2lRouteOutputSchema(getD2lRoute(737)),
	},
	'learningPlatform.postEnrollmentsMyenrollmentsOrgUnitIdPin': {
		input: createD2lRouteInputSchema(getD2lRoute(738)),
		output: createD2lRouteOutputSchema(getD2lRoute(738)),
	},
	'learningPlatform.getEnrollmentsOrgUnitsOrgUnitIdUsers': {
		input: createD2lRouteInputSchema(getD2lRoute(739)),
		output: createD2lRouteOutputSchema(getD2lRoute(739)),
	},
	'learningPlatform.deleteEnrollmentsOrgUnitsOrgUnitIdUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(740)),
		output: createD2lRouteOutputSchema(getD2lRoute(740)),
	},
	'learningPlatform.getEnrollmentsOrgUnitsOrgUnitIdUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(741)),
		output: createD2lRouteOutputSchema(getD2lRoute(741)),
	},
	'learningPlatform.getEnrollmentsOrgUnitsOrgUnitIdUsersUserIdCompletion': {
		input: createD2lRouteInputSchema(getD2lRoute(742)),
		output: createD2lRouteOutputSchema(getD2lRoute(742)),
	},
	'learningPlatform.putEnrollmentsOrgUnitsOrgUnitIdUsersUserIdCompletion': {
		input: createD2lRouteInputSchema(getD2lRoute(743)),
		output: createD2lRouteOutputSchema(getD2lRoute(743)),
	},
	'learningPlatform.deleteEnrollmentsOrgUnitsOrgUnitIdUsersUserIdPin': {
		input: createD2lRouteInputSchema(getD2lRoute(744)),
		output: createD2lRouteOutputSchema(getD2lRoute(744)),
	},
	'learningPlatform.postEnrollmentsOrgUnitsOrgUnitIdUsersUserIdPin': {
		input: createD2lRouteInputSchema(getD2lRoute(745)),
		output: createD2lRouteOutputSchema(getD2lRoute(745)),
	},
	'learningPlatform.getEnrollmentsUsersUserIdOrgUnits': {
		input: createD2lRouteInputSchema(getD2lRoute(746)),
		output: createD2lRouteOutputSchema(getD2lRoute(746)),
	},
	'learningPlatform.deleteEnrollmentsUsersUserIdOrgUnitsOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(747)),
		output: createD2lRouteOutputSchema(getD2lRoute(747)),
	},
	'learningPlatform.getEnrollmentsUsersUserIdOrgUnitsOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(748)),
		output: createD2lRouteOutputSchema(getD2lRoute(748)),
	},
	'learningPlatform.getFeed': {
		input: createD2lRouteInputSchema(getD2lRoute(749)),
		output: createD2lRouteOutputSchema(getD2lRoute(749)),
	},
	'learningPlatform.putForceLogoutUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(750)),
		output: createD2lRouteOutputSchema(getD2lRoute(750)),
	},
	'learningPlatform.getGlobalusermappingIdentifiersIdentifier': {
		input: createD2lRouteInputSchema(getD2lRoute(751)),
		output: createD2lRouteOutputSchema(getD2lRoute(751)),
	},
	'learningPlatform.deleteGlobalusermappingUsersUserid': {
		input: createD2lRouteInputSchema(getD2lRoute(752)),
		output: createD2lRouteOutputSchema(getD2lRoute(752)),
	},
	'learningPlatform.getGlobalusermappingUsersUserid': {
		input: createD2lRouteInputSchema(getD2lRoute(753)),
		output: createD2lRouteOutputSchema(getD2lRoute(753)),
	},
	'learningPlatform.putGlobalusermappingUsersUserid': {
		input: createD2lRouteInputSchema(getD2lRoute(754)),
		output: createD2lRouteOutputSchema(getD2lRoute(754)),
	},
	'learningPlatform.getImsconfigMapRoles': {
		input: createD2lRouteInputSchema(getD2lRoute(755)),
		output: createD2lRouteOutputSchema(getD2lRoute(755)),
	},
	'learningPlatform.getImsconfigMapRolesRoleId': {
		input: createD2lRouteInputSchema(getD2lRoute(756)),
		output: createD2lRouteOutputSchema(getD2lRoute(756)),
	},
	'learningPlatform.putImsconfigMapRolesRoleId': {
		input: createD2lRouteInputSchema(getD2lRoute(757)),
		output: createD2lRouteOutputSchema(getD2lRoute(757)),
	},
	'learningPlatform.getImsconfigRoles': {
		input: createD2lRouteInputSchema(getD2lRoute(758)),
		output: createD2lRouteOutputSchema(getD2lRoute(758)),
	},
	'learningPlatform.getLanguage': {
		input: createD2lRouteInputSchema(getD2lRoute(759)),
		output: createD2lRouteOutputSchema(getD2lRoute(759)),
	},
	'learningPlatform.deleteLocalauthenticationsecurityOverrides': {
		input: createD2lRouteInputSchema(getD2lRoute(760)),
		output: createD2lRouteOutputSchema(getD2lRoute(760)),
	},
	'learningPlatform.getLocalauthenticationsecurityOverrides': {
		input: createD2lRouteInputSchema(getD2lRoute(761)),
		output: createD2lRouteOutputSchema(getD2lRoute(761)),
	},
	'learningPlatform.postLocalauthenticationsecurityOverrides': {
		input: createD2lRouteInputSchema(getD2lRoute(762)),
		output: createD2lRouteOutputSchema(getD2lRoute(762)),
	},
	'learningPlatform.getLocales': {
		input: createD2lRouteInputSchema(getD2lRoute(763)),
		output: createD2lRouteOutputSchema(getD2lRoute(763)),
	},
	'learningPlatform.getLocalesLocaleId': {
		input: createD2lRouteInputSchema(getD2lRoute(764)),
		output: createD2lRouteOutputSchema(getD2lRoute(764)),
	},
	'learningPlatform.getLogging': {
		input: createD2lRouteInputSchema(getD2lRoute(765)),
		output: createD2lRouteOutputSchema(getD2lRoute(765)),
	},
	'learningPlatform.getLoggingLogMessageId': {
		input: createD2lRouteInputSchema(getD2lRoute(766)),
		output: createD2lRouteOutputSchema(getD2lRoute(766)),
	},
	'learningPlatform.getLoggingGrouped': {
		input: createD2lRouteInputSchema(getD2lRoute(767)),
		output: createD2lRouteOutputSchema(getD2lRoute(767)),
	},
	'learningPlatform.getNotificationsInstantCarriers': {
		input: createD2lRouteInputSchema(getD2lRoute(768)),
		output: createD2lRouteOutputSchema(getD2lRoute(768)),
	},
	'learningPlatform.getNotificationsInstantCarriersCarrierIdSubscriptions': {
		input: createD2lRouteInputSchema(getD2lRoute(769)),
		output: createD2lRouteOutputSchema(getD2lRoute(769)),
	},
	'learningPlatform.deleteNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(770)),
			output: createD2lRouteOutputSchema(getD2lRoute(770)),
		},
	'learningPlatform.putNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(771)),
			output: createD2lRouteOutputSchema(getD2lRoute(771)),
		},
	'learningPlatform.deleteNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeIdUsersUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(772)),
			output: createD2lRouteOutputSchema(getD2lRoute(772)),
		},
	'learningPlatform.putNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeIdUsersUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(773)),
			output: createD2lRouteOutputSchema(getD2lRoute(773)),
		},
	'learningPlatform.getNotificationsInstantCarriersCarrierIdSubscriptionsUsersUserId':
		{
			input: createD2lRouteInputSchema(getD2lRoute(774)),
			output: createD2lRouteOutputSchema(getD2lRoute(774)),
		},
	'learningPlatform.getNotificationsInstantUsersUserIdSettings': {
		input: createD2lRouteInputSchema(getD2lRoute(775)),
		output: createD2lRouteOutputSchema(getD2lRoute(775)),
	},
	'learningPlatform.putNotificationsInstantUsersUserIdSettings': {
		input: createD2lRouteInputSchema(getD2lRoute(776)),
		output: createD2lRouteOutputSchema(getD2lRoute(776)),
	},
	'learningPlatform.getOrganizationInfo': {
		input: createD2lRouteInputSchema(getD2lRoute(777)),
		output: createD2lRouteOutputSchema(getD2lRoute(777)),
	},
	'learningPlatform.getOrganizationPrimaryUrl': {
		input: createD2lRouteInputSchema(getD2lRoute(778)),
		output: createD2lRouteOutputSchema(getD2lRoute(778)),
	},
	'learningPlatform.getOrgstructure': {
		input: createD2lRouteInputSchema(getD2lRoute(779)),
		output: createD2lRouteOutputSchema(getD2lRoute(779)),
	},
	'learningPlatform.postOrgstructure': {
		input: createD2lRouteInputSchema(getD2lRoute(780)),
		output: createD2lRouteOutputSchema(getD2lRoute(780)),
	},
	'learningPlatform.getOrgstructureOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(781)),
		output: createD2lRouteOutputSchema(getD2lRoute(781)),
	},
	'learningPlatform.putOrgstructureOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(782)),
		output: createD2lRouteOutputSchema(getD2lRoute(782)),
	},
	'learningPlatform.getOrgstructureOrgUnitIdAncestors': {
		input: createD2lRouteInputSchema(getD2lRoute(783)),
		output: createD2lRouteOutputSchema(getD2lRoute(783)),
	},
	'learningPlatform.getOrgstructureOrgUnitIdChildren': {
		input: createD2lRouteInputSchema(getD2lRoute(784)),
		output: createD2lRouteOutputSchema(getD2lRoute(784)),
	},
	'learningPlatform.postOrgstructureOrgUnitIdChildren': {
		input: createD2lRouteInputSchema(getD2lRoute(785)),
		output: createD2lRouteOutputSchema(getD2lRoute(785)),
	},
	'learningPlatform.deleteOrgstructureOrgUnitIdChildrenChildOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(786)),
		output: createD2lRouteOutputSchema(getD2lRoute(786)),
	},
	'learningPlatform.getOrgstructureOrgUnitIdChildrenPaged': {
		input: createD2lRouteInputSchema(getD2lRoute(787)),
		output: createD2lRouteOutputSchema(getD2lRoute(787)),
	},
	'learningPlatform.getOrgstructureOrgUnitIdColours': {
		input: createD2lRouteInputSchema(getD2lRoute(788)),
		output: createD2lRouteOutputSchema(getD2lRoute(788)),
	},
	'learningPlatform.putOrgstructureOrgUnitIdColours': {
		input: createD2lRouteInputSchema(getD2lRoute(789)),
		output: createD2lRouteOutputSchema(getD2lRoute(789)),
	},
	'learningPlatform.getOrgstructureOrgUnitIdDescendants': {
		input: createD2lRouteInputSchema(getD2lRoute(790)),
		output: createD2lRouteOutputSchema(getD2lRoute(790)),
	},
	'learningPlatform.getOrgstructureOrgUnitIdDescendantsPaged': {
		input: createD2lRouteInputSchema(getD2lRoute(791)),
		output: createD2lRouteOutputSchema(getD2lRoute(791)),
	},
	'learningPlatform.getOrgstructureOrgUnitIdParents': {
		input: createD2lRouteInputSchema(getD2lRoute(792)),
		output: createD2lRouteOutputSchema(getD2lRoute(792)),
	},
	'learningPlatform.postOrgstructureOrgUnitIdParents': {
		input: createD2lRouteInputSchema(getD2lRoute(793)),
		output: createD2lRouteOutputSchema(getD2lRoute(793)),
	},
	'learningPlatform.deleteOrgstructureOrgUnitIdParentsParentOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(794)),
		output: createD2lRouteOutputSchema(getD2lRoute(794)),
	},
	'learningPlatform.getOrgstructureChildless': {
		input: createD2lRouteInputSchema(getD2lRoute(795)),
		output: createD2lRouteOutputSchema(getD2lRoute(795)),
	},
	'learningPlatform.getOrgstructureOrphans': {
		input: createD2lRouteInputSchema(getD2lRoute(796)),
		output: createD2lRouteOutputSchema(getD2lRoute(796)),
	},
	'learningPlatform.getOrgstructureRecyclebin': {
		input: createD2lRouteInputSchema(getD2lRoute(797)),
		output: createD2lRouteOutputSchema(getD2lRoute(797)),
	},
	'learningPlatform.deleteOrgstructureRecyclebinOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(798)),
		output: createD2lRouteOutputSchema(getD2lRoute(798)),
	},
	'learningPlatform.postOrgstructureRecyclebinOrgUnitIdRecycle': {
		input: createD2lRouteInputSchema(getD2lRoute(799)),
		output: createD2lRouteOutputSchema(getD2lRoute(799)),
	},
	'learningPlatform.postOrgstructureRecyclebinOrgUnitIdRestore': {
		input: createD2lRouteInputSchema(getD2lRoute(800)),
		output: createD2lRouteOutputSchema(getD2lRoute(800)),
	},
	'learningPlatform.getOutypes': {
		input: createD2lRouteInputSchema(getD2lRoute(801)),
		output: createD2lRouteOutputSchema(getD2lRoute(801)),
	},
	'learningPlatform.postOutypes': {
		input: createD2lRouteInputSchema(getD2lRoute(802)),
		output: createD2lRouteOutputSchema(getD2lRoute(802)),
	},
	'learningPlatform.deleteOutypesOrgUnitTypeId': {
		input: createD2lRouteInputSchema(getD2lRoute(803)),
		output: createD2lRouteOutputSchema(getD2lRoute(803)),
	},
	'learningPlatform.getOutypesOrgUnitTypeId': {
		input: createD2lRouteInputSchema(getD2lRoute(804)),
		output: createD2lRouteOutputSchema(getD2lRoute(804)),
	},
	'learningPlatform.postOutypesOrgUnitTypeId': {
		input: createD2lRouteInputSchema(getD2lRoute(805)),
		output: createD2lRouteOutputSchema(getD2lRoute(805)),
	},
	'learningPlatform.getOutypesDepartment': {
		input: createD2lRouteInputSchema(getD2lRoute(806)),
		output: createD2lRouteOutputSchema(getD2lRoute(806)),
	},
	'learningPlatform.getOutypesSemester': {
		input: createD2lRouteInputSchema(getD2lRoute(807)),
		output: createD2lRouteOutputSchema(getD2lRoute(807)),
	},
	'learningPlatform.getPermissionsToolsToolIdCapabilities': {
		input: createD2lRouteInputSchema(getD2lRoute(808)),
		output: createD2lRouteOutputSchema(getD2lRoute(808)),
	},
	'learningPlatform.postPermissionsToolsToolIdCapabilities': {
		input: createD2lRouteInputSchema(getD2lRoute(809)),
		output: createD2lRouteOutputSchema(getD2lRoute(809)),
	},
	'learningPlatform.deletePermissionsToolsToolIdCapabilitiesCapabilityId': {
		input: createD2lRouteInputSchema(getD2lRoute(810)),
		output: createD2lRouteOutputSchema(getD2lRoute(810)),
	},
	'learningPlatform.getPermissionsToolsToolIdClaims': {
		input: createD2lRouteInputSchema(getD2lRoute(811)),
		output: createD2lRouteOutputSchema(getD2lRoute(811)),
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsAllowed': {
		input: createD2lRouteInputSchema(getD2lRoute(812)),
		output: createD2lRouteOutputSchema(getD2lRoute(812)),
	},
	'learningPlatform.deletePermissionsToolsToolIdClaimsAllowedGrantId': {
		input: createD2lRouteInputSchema(getD2lRoute(813)),
		output: createD2lRouteOutputSchema(getD2lRoute(813)),
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsAllowedGrantId': {
		input: createD2lRouteInputSchema(getD2lRoute(814)),
		output: createD2lRouteOutputSchema(getD2lRoute(814)),
	},
	'learningPlatform.putPermissionsToolsToolIdClaimsAllowedGrantId': {
		input: createD2lRouteInputSchema(getD2lRoute(815)),
		output: createD2lRouteOutputSchema(getD2lRoute(815)),
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsMetadata': {
		input: createD2lRouteInputSchema(getD2lRoute(816)),
		output: createD2lRouteOutputSchema(getD2lRoute(816)),
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsMetadataClaimId': {
		input: createD2lRouteInputSchema(getD2lRoute(817)),
		output: createD2lRouteOutputSchema(getD2lRoute(817)),
	},
	'learningPlatform.getProfileProfileId': {
		input: createD2lRouteInputSchema(getD2lRoute(818)),
		output: createD2lRouteOutputSchema(getD2lRoute(818)),
	},
	'learningPlatform.putProfileProfileId': {
		input: createD2lRouteInputSchema(getD2lRoute(819)),
		output: createD2lRouteOutputSchema(getD2lRoute(819)),
	},
	'learningPlatform.deleteProfileProfileIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(820)),
		output: createD2lRouteOutputSchema(getD2lRoute(820)),
	},
	'learningPlatform.getProfileProfileIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(821)),
		output: createD2lRouteOutputSchema(getD2lRoute(821)),
	},
	'learningPlatform.postProfileProfileIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(822)),
		output: createD2lRouteOutputSchema(getD2lRoute(822)),
	},
	'learningPlatform.getProfileMyProfile': {
		input: createD2lRouteInputSchema(getD2lRoute(823)),
		output: createD2lRouteOutputSchema(getD2lRoute(823)),
	},
	'learningPlatform.putProfileMyProfile': {
		input: createD2lRouteInputSchema(getD2lRoute(824)),
		output: createD2lRouteOutputSchema(getD2lRoute(824)),
	},
	'learningPlatform.deleteProfileMyProfileImage': {
		input: createD2lRouteInputSchema(getD2lRoute(825)),
		output: createD2lRouteOutputSchema(getD2lRoute(825)),
	},
	'learningPlatform.getProfileMyProfileImage': {
		input: createD2lRouteInputSchema(getD2lRoute(826)),
		output: createD2lRouteOutputSchema(getD2lRoute(826)),
	},
	'learningPlatform.postProfileMyProfileImage': {
		input: createD2lRouteInputSchema(getD2lRoute(827)),
		output: createD2lRouteOutputSchema(getD2lRoute(827)),
	},
	'learningPlatform.getProfileUserUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(828)),
		output: createD2lRouteOutputSchema(getD2lRoute(828)),
	},
	'learningPlatform.putProfileUserUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(829)),
		output: createD2lRouteOutputSchema(getD2lRoute(829)),
	},
	'learningPlatform.deleteProfileUserUserIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(830)),
		output: createD2lRouteOutputSchema(getD2lRoute(830)),
	},
	'learningPlatform.getProfileUserUserIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(831)),
		output: createD2lRouteOutputSchema(getD2lRoute(831)),
	},
	'learningPlatform.postProfileUserUserIdImage': {
		input: createD2lRouteInputSchema(getD2lRoute(832)),
		output: createD2lRouteOutputSchema(getD2lRoute(832)),
	},
	'learningPlatform.getRoles': {
		input: createD2lRouteInputSchema(getD2lRoute(833)),
		output: createD2lRouteOutputSchema(getD2lRoute(833)),
	},
	'learningPlatform.postRoles': {
		input: createD2lRouteInputSchema(getD2lRoute(834)),
		output: createD2lRouteOutputSchema(getD2lRoute(834)),
	},
	'learningPlatform.getRolesRoleId': {
		input: createD2lRouteInputSchema(getD2lRoute(835)),
		output: createD2lRouteOutputSchema(getD2lRoute(835)),
	},
	'learningPlatform.deleteSessionsUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(836)),
		output: createD2lRouteOutputSchema(getD2lRoute(836)),
	},
	'learningPlatform.postSourceCourses': {
		input: createD2lRouteInputSchema(getD2lRoute(837)),
		output: createD2lRouteOutputSchema(getD2lRoute(837)),
	},
	'learningPlatform.getSourceCoursesOrgUnitIdCurrentReofferedCourse': {
		input: createD2lRouteInputSchema(getD2lRoute(838)),
		output: createD2lRouteOutputSchema(getD2lRoute(838)),
	},
	'learningPlatform.postSourceCoursesOrgUnitIdDeploy': {
		input: createD2lRouteInputSchema(getD2lRoute(839)),
		output: createD2lRouteOutputSchema(getD2lRoute(839)),
	},
	'learningPlatform.postSourceCoursesOrgUnitIdReofferCourse': {
		input: createD2lRouteInputSchema(getD2lRoute(840)),
		output: createD2lRouteOutputSchema(getD2lRoute(840)),
	},
	'learningPlatform.getSourceCoursesOrgUnitIdReofferedCourses': {
		input: createD2lRouteInputSchema(getD2lRoute(841)),
		output: createD2lRouteOutputSchema(getD2lRoute(841)),
	},
	'learningPlatform.getSourceCoursesCourseOfferingsOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(842)),
		output: createD2lRouteOutputSchema(getD2lRoute(842)),
	},
	'learningPlatform.getTimezones': {
		input: createD2lRouteInputSchema(getD2lRoute(843)),
		output: createD2lRouteOutputSchema(getD2lRoute(843)),
	},
	'learningPlatform.getToolsOrg': {
		input: createD2lRouteInputSchema(getD2lRoute(844)),
		output: createD2lRouteOutputSchema(getD2lRoute(844)),
	},
	'learningPlatform.getToolsOrgToolId': {
		input: createD2lRouteInputSchema(getD2lRoute(845)),
		output: createD2lRouteOutputSchema(getD2lRoute(845)),
	},
	'learningPlatform.putToolsOrgToolId': {
		input: createD2lRouteInputSchema(getD2lRoute(846)),
		output: createD2lRouteOutputSchema(getD2lRoute(846)),
	},
	'learningPlatform.putToolsOrgToolIdOUDefault': {
		input: createD2lRouteInputSchema(getD2lRoute(847)),
		output: createD2lRouteOutputSchema(getD2lRoute(847)),
	},
	'learningPlatform.putToolsOrgToolIdOUDefaultOverride': {
		input: createD2lRouteInputSchema(getD2lRoute(848)),
		output: createD2lRouteOutputSchema(getD2lRoute(848)),
	},
	'learningPlatform.getToolsOrgUnitsOrgUnitId': {
		input: createD2lRouteInputSchema(getD2lRoute(849)),
		output: createD2lRouteOutputSchema(getD2lRoute(849)),
	},
	'learningPlatform.getToolsOrgUnitsOrgUnitIdToolId': {
		input: createD2lRouteInputSchema(getD2lRoute(850)),
		output: createD2lRouteOutputSchema(getD2lRoute(850)),
	},
	'learningPlatform.putToolsOrgUnitsOrgUnitIdToolId': {
		input: createD2lRouteInputSchema(getD2lRoute(851)),
		output: createD2lRouteOutputSchema(getD2lRoute(851)),
	},
	'learningPlatform.getToolsOrgUnitsOrgUnitIdToolNames': {
		input: createD2lRouteInputSchema(getD2lRoute(852)),
		output: createD2lRouteOutputSchema(getD2lRoute(852)),
	},
	'learningPlatform.getUsers': {
		input: createD2lRouteInputSchema(getD2lRoute(853)),
		output: createD2lRouteOutputSchema(getD2lRoute(853)),
	},
	'learningPlatform.postUsers': {
		input: createD2lRouteInputSchema(getD2lRoute(854)),
		output: createD2lRouteOutputSchema(getD2lRoute(854)),
	},
	'learningPlatform.deleteUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(855)),
		output: createD2lRouteOutputSchema(getD2lRoute(855)),
	},
	'learningPlatform.getUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(856)),
		output: createD2lRouteOutputSchema(getD2lRoute(856)),
	},
	'learningPlatform.putUsersUserId': {
		input: createD2lRouteInputSchema(getD2lRoute(857)),
		output: createD2lRouteOutputSchema(getD2lRoute(857)),
	},
	'learningPlatform.getUsersUserIdActivation': {
		input: createD2lRouteInputSchema(getD2lRoute(858)),
		output: createD2lRouteOutputSchema(getD2lRoute(858)),
	},
	'learningPlatform.putUsersUserIdActivation': {
		input: createD2lRouteInputSchema(getD2lRoute(859)),
		output: createD2lRouteOutputSchema(getD2lRoute(859)),
	},
	'learningPlatform.getUsersUserIdEnrollmentlogs': {
		input: createD2lRouteInputSchema(getD2lRoute(860)),
		output: createD2lRouteOutputSchema(getD2lRoute(860)),
	},
	'learningPlatform.getUsersUserIdNames': {
		input: createD2lRouteInputSchema(getD2lRoute(861)),
		output: createD2lRouteOutputSchema(getD2lRoute(861)),
	},
	'learningPlatform.putUsersUserIdNames': {
		input: createD2lRouteInputSchema(getD2lRoute(862)),
		output: createD2lRouteOutputSchema(getD2lRoute(862)),
	},
	'learningPlatform.deleteUsersUserIdPassword': {
		input: createD2lRouteInputSchema(getD2lRoute(863)),
		output: createD2lRouteOutputSchema(getD2lRoute(863)),
	},
	'learningPlatform.postUsersUserIdPassword': {
		input: createD2lRouteInputSchema(getD2lRoute(864)),
		output: createD2lRouteOutputSchema(getD2lRoute(864)),
	},
	'learningPlatform.putUsersUserIdPassword': {
		input: createD2lRouteInputSchema(getD2lRoute(865)),
		output: createD2lRouteOutputSchema(getD2lRoute(865)),
	},
	'learningPlatform.getUsersUserIdUsertrackinglogs': {
		input: createD2lRouteInputSchema(getD2lRoute(866)),
		output: createD2lRouteOutputSchema(getD2lRoute(866)),
	},
	'learningPlatform.postUsersBatch': {
		input: createD2lRouteInputSchema(getD2lRoute(867)),
		output: createD2lRouteOutputSchema(getD2lRoute(867)),
	},
	'learningPlatform.postUsersMerge': {
		input: createD2lRouteInputSchema(getD2lRoute(868)),
		output: createD2lRouteOutputSchema(getD2lRoute(868)),
	},
	'learningPlatform.getUsersMypronouns': {
		input: createD2lRouteInputSchema(getD2lRoute(869)),
		output: createD2lRouteOutputSchema(getD2lRoute(869)),
	},
	'learningPlatform.putUsersMypronouns': {
		input: createD2lRouteInputSchema(getD2lRoute(870)),
		output: createD2lRouteOutputSchema(getD2lRoute(870)),
	},
	'learningPlatform.getUsersMypronounsVisibility': {
		input: createD2lRouteInputSchema(getD2lRoute(871)),
		output: createD2lRouteOutputSchema(getD2lRoute(871)),
	},
	'learningPlatform.putUsersMypronounsVisibility': {
		input: createD2lRouteInputSchema(getD2lRoute(872)),
		output: createD2lRouteOutputSchema(getD2lRoute(872)),
	},
	'learningPlatform.getUsersRolesStatistics': {
		input: createD2lRouteInputSchema(getD2lRoute(873)),
		output: createD2lRouteOutputSchema(getD2lRoute(873)),
	},
	'learningPlatform.getUsersStatistics': {
		input: createD2lRouteInputSchema(getD2lRoute(874)),
		output: createD2lRouteOutputSchema(getD2lRoute(874)),
	},
	'learningPlatform.getUsersWhoami': {
		input: createD2lRouteInputSchema(getD2lRoute(875)),
		output: createD2lRouteOutputSchema(getD2lRoute(875)),
	},
};

export const d2lBrightspaceEndpointMeta: RequiredPluginEndpointMeta<
	typeof d2lBrightspaceEndpointsNested
> = {
	'apiProperties.getProductCodeVersions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/(productCode)/versions/: Retrieve the collection of versions supported by a specific product component. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#get--d2l-api-(productCode)-versions-',
	},
	'apiProperties.getProductCodeVersionsVersion': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/(productCode)/versions/(version): Determine if a specific product component supports a particular API version. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#get--d2l-api-(productCode)-versions-(version)',
	},
	'apiProperties.getVersions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/versions/: Retrieve all supported versions for all product components. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#get--d2l-api-versions-',
	},
	'apiProperties.postVersionsCheck': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/versions/check: Determine the versions supported by the back-endÃ¢Â€Â™s Brightspace API. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#post--d2l-api-versions-check',
	},
	'awardService.getAssociationsAvailableToEarn': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/associations/availableToEarn/: Retrieve associated awards that the calling user may earn and has already earned. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-associations-availableToEarn-',
	},
	'awardService.getAwards': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/awards/: Retrieve awards available across the organization. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-awards-',
	},
	'awardService.postAwards': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/bas/(version)/awards/: Create a new award. Official reference: https://docs.valence.desire2learn.com/res/awards.html#post--d2l-api-bas-(version)-awards-',
	},
	'awardService.deleteAwardsAwardId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/bas/(version)/awards/(awardId): Delete an award. Official reference: https://docs.valence.desire2learn.com/res/awards.html#delete--d2l-api-bas-(version)-awards-(awardId)',
	},
	'awardService.getAwardsAwardId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/awards/(awardId): Retrieve a particular award. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-awards-(awardId)',
	},
	'awardService.putAwardsAwardId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/bas/(version)/awards/(awardId): Update an award. Official reference: https://docs.valence.desire2learn.com/res/awards.html#put--d2l-api-bas-(version)-awards-(awardId)',
	},
	'awardService.getCreditSummary': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/creditSummary: Retrieve the credit summary for the calling userÃ¢Â€Â™s issued awards. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-creditSummary',
	},
	'awardService.deleteIssuedIssuedId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/bas/(version)/issued/(issuedId): Revoke an issued award. Official reference: https://docs.valence.desire2learn.com/res/awards.html#delete--d2l-api-bas-(version)-issued-(issuedId)',
	},
	'awardService.deleteIssuedIssuedIdSharingProfile': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/bas/(version)/issued/(issuedId)/sharing/profile: Remove an issued award from the calling userÃ¢Â€Â™s profile. Official reference: https://docs.valence.desire2learn.com/res/awards.html#delete--d2l-api-bas-(version)-issued-(issuedId)-sharing-profile',
	},
	'awardService.putIssuedIssuedIdSharingProfile': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/bas/(version)/issued/(issuedId)/sharing/profile: Share an issued award on the calling userÃ¢Â€Â™s profile. Official reference: https://docs.valence.desire2learn.com/res/awards.html#put--d2l-api-bas-(version)-issued-(issuedId)-sharing-profile',
	},
	'awardService.getIssuedCertificatesCertificateId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/issued/certificates/(certificateId): Retrieve an Issued Award of type Certificate based on the Certificate Id. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-issued-certificates-(certificateId)',
	},
	'awardService.getIssuedCertificatesIssuedIdPdf': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/issued/certificates/(issuedId)/pdf: Retrieve a certificate in PDF form. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-issued-certificates-(issuedId)-pdf',
	},
	'awardService.getIssuedUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/issued/users/(userId)/: Retrieve the awards issued to a user. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-issued-users-(userId)-',
	},
	'awardService.getLibraryIcons': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/library/icons/: Retrieve the icons contained in the library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-library-icons-',
	},
	'awardService.postLibraryIcons': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/bas/(version)/library/icons/: Add an icon to the library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#post--d2l-api-bas-(version)-library-icons-',
	},
	'awardService.deleteLibraryIconsFileName': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/bas/(version)/library/icons/(fileName): Delete named icon from library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#delete--d2l-api-bas-(version)-library-icons-(fileName)',
	},
	'awardService.getLibraryIconsFileName': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/library/icons/(fileName): Retrieve named icon from the library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-library-icons-(fileName)',
	},
	'awardService.getLibraryTemplates': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/library/templates/: Retrieve the certificate templates contained in the library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-library-templates-',
	},
	'awardService.postLibraryTemplates': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/bas/(version)/library/templates/: Add a certificate template to the library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#post--d2l-api-bas-(version)-library-templates-',
	},
	'awardService.deleteLibraryTemplatesFileName': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/bas/(version)/library/templates/(fileName): Delete named certificate template from library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#delete--d2l-api-bas-(version)-library-templates-(fileName)',
	},
	'awardService.getLibraryTemplatesFileName': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/library/templates/(fileName): Retrieve named certificate template from the library. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-library-templates-(fileName)',
	},
	'awardService.getOrgunitsOrgUnitIdAssociations': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/associations/: Retrieve an org unitÃ¢Â€Â™s associations. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-associations-',
	},
	'awardService.postOrgunitsOrgUnitIdAssociations': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/bas/(version)/orgunits/(orgUnitId)/associations/: Associate an award with an org unit. Official reference: https://docs.valence.desire2learn.com/res/awards.html#post--d2l-api-bas-(version)-orgunits-(orgUnitId)-associations-',
	},
	'awardService.deleteOrgunitsOrgUnitIdAssociationsAssociationId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/bas/(version)/orgunits/(orgUnitId)/associations/(associationId): Delete an awardÃ¢Â€Â™s association with an org unit. Official reference: https://docs.valence.desire2learn.com/res/awards.html#delete--d2l-api-bas-(version)-orgunits-(orgUnitId)-associations-(associationId)',
	},
	'awardService.getOrgunitsOrgUnitIdAssociationsAssociationId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/associations/(associationId): Retrieve an association. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-associations-(associationId)',
	},
	'awardService.putOrgunitsOrgUnitIdAssociationsAssociationId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/bas/(version)/orgunits/(orgUnitId)/associations/(associationId): Update an award association. Official reference: https://docs.valence.desire2learn.com/res/awards.html#put--d2l-api-bas-(version)-orgunits-(orgUnitId)-associations-(associationId)',
	},
	'awardService.getOrgunitsOrgUnitIdAssociationsAvailableToManage': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/associations/availableToManage/: Retrieve awards that have been, or could be, associated with an org unit. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-associations-availableToManage-',
	},
	'awardService.getOrgunitsOrgUnitIdClasslist': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/classlist/: Retrieve the users in the classlist who are able to earn awards along with\ntheir first ten awards. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-classlist-',
	},
	'awardService.getOrgunitsOrgUnitIdClasslistUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/classlist/users/(userId): Retrieve the ten oldest awards for a classlist user. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-classlist-users-(userId)',
	},
	'awardService.postOrgunitsOrgUnitIdIssued': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/bas/(version)/orgunits/(orgUnitId)/issued/: Issue an award to a user. Official reference: https://docs.valence.desire2learn.com/res/awards.html#post--d2l-api-bas-(version)-orgunits-(orgUnitId)-issued-',
	},
	'awardService.putOrgunitsOrgUnitIdIssuedIssuedId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/bas/(version)/orgunits/(orgUnitId)/issued/(issuedId): Update an issued award. Official reference: https://docs.valence.desire2learn.com/res/awards.html#put--d2l-api-bas-(version)-orgunits-(orgUnitId)-issued-(issuedId)',
	},
	'awardService.getOrgunitsOrgUnitIdMyConfiguration': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/myConfiguration: Retrieve the userÃ¢Â€Â™s current configuration. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-myConfiguration',
	},
	'awardService.getOrgunitsOrgUnitIdRevocableawards': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/revocableawards/: Retrieve the awards for a user that the calling user can revoke. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-revocableawards-',
	},
	'awardService.getOrgunitsOrgUnitIdRevocableawardsUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bas/(version)/orgunits/(orgUnitId)/revocableawards/(userId)/: Retrieve the issued awards for a specified user that can be revoked by the\ncalling user. Official reference: https://docs.valence.desire2learn.com/res/awards.html#get--d2l-api-bas-(version)-orgunits-(orgUnitId)-revocableawards-(userId)-',
	},
	'brightspaceForParents.deleteRelationships': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/bfp/(version)/relationships/: Delete parental relationships for given users. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-bfp-(version)-relationships-',
	},
	'brightspaceForParents.putRelationships': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/bfp/(version)/relationships/: Create relationships for given users. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-bfp-(version)-relationships-',
	},
	'brightspaceForParents.getRelationshipsUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/bfp/(version)/relationships/(userId): Retrieve parental relationships for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-bfp-(version)-relationships-(userId)',
	},
	'eportfolio.getActivity': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/activity/: Retrieve a combined list of all activity on EP objects owned by, or shared\nto, the current user. Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-activity-',
	},
	'eportfolio.getActivityFilters': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/activity/filters/: Retrieve a list of all available preset filters. Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-activity-filters-',
	},
	'eportfolio.getActivityMy': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/activity/my/: Retrieve a list of all activity on EP objects owned by the current user. Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-activity-my-',
	},
	'eportfolio.getActivityShared': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/activity/shared/: Retrieve a list of all activity on EP objects shared to the current user. Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-activity-shared-',
	},
	'eportfolio.deleteArtifactObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/artifact/(objectId): Delete a particular EP artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#delete--d2l-api-eP-(version)-artifact-(objectId)',
	},
	'eportfolio.getArtifactObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/artifact/(objectId): Retrieve a particular EP artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#get--d2l-api-eP-(version)-artifact-(objectId)',
	},
	'eportfolio.deleteArtifactFileObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/artifact/file/(objectId): Delete a particular EP file artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#delete--d2l-api-eP-(version)-artifact-file-(objectId)',
	},
	'eportfolio.getArtifactFileObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/artifact/file/(objectId): Retrieve a particular EP file artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#get--d2l-api-eP-(version)-artifact-file-(objectId)',
	},
	'eportfolio.postArtifactFileObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/artifact/file/(objectId): Update an existing file artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#post--d2l-api-eP-(version)-artifact-file-(objectId)',
	},
	'eportfolio.deleteArtifactLinkObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/artifact/link/(objectId): Delete a particular EP link artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#delete--d2l-api-eP-(version)-artifact-link-(objectId)',
	},
	'eportfolio.getArtifactLinkObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/artifact/link/(objectId): Retrieve a particular EP link artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#get--d2l-api-eP-(version)-artifact-link-(objectId)',
	},
	'eportfolio.postArtifactLinkObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/artifact/link/(objectId): Update an existing link artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#post--d2l-api-eP-(version)-artifact-link-(objectId)',
	},
	'eportfolio.postArtifactsFileNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/artifacts/file/new: Create a new file artifact by starting a new resumable upload or attaching an already uploaded file. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#post--d2l-api-eP-(version)-artifacts-file-new',
	},
	'eportfolio.postArtifactsFileUpload': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/artifacts/file/upload: Create a new file artifact from a simple file upload. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#post--d2l-api-eP-(version)-artifacts-file-upload',
	},
	'eportfolio.postArtifactsLinkNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/artifacts/link/new: Create a new link artifact. Official reference: https://docs.valence.desire2learn.com/res/artifact.html#post--d2l-api-eP-(version)-artifacts-link-new',
	},
	'eportfolio.postCollectionCollectionIdAddObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/collection/(collectionId)/add/(objectId): Add an existing EP object to an EP collection. Official reference: https://docs.valence.desire2learn.com/res/collection.html#post--d2l-api-eP-(version)-collection-(collectionId)-add-(objectId)',
	},
	'eportfolio.postCollectionCollectionIdRemoveObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/collection/(collectionId)/remove/(objectId): Remove a particular item from an EP collection. Official reference: https://docs.valence.desire2learn.com/res/collection.html#post--d2l-api-eP-(version)-collection-(collectionId)-remove-(objectId)',
	},
	'eportfolio.deleteCollectionObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/collection/(objectId): Delete a particular EP collection. Official reference: https://docs.valence.desire2learn.com/res/collection.html#delete--d2l-api-eP-(version)-collection-(objectId)',
	},
	'eportfolio.getCollectionObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/collection/(objectId): Retrieve a particular EP collection, without its contents. Official reference: https://docs.valence.desire2learn.com/res/collection.html#get--d2l-api-eP-(version)-collection-(objectId)',
	},
	'eportfolio.postCollectionObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/collection/(objectId): Update an EP collection. Official reference: https://docs.valence.desire2learn.com/res/collection.html#post--d2l-api-eP-(version)-collection-(objectId)',
	},
	'eportfolio.getCollectionObjectIdContents': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/collection/(objectId)/contents/: Retrieve a particular EP collection, with its contents. Official reference: https://docs.valence.desire2learn.com/res/collection.html#get--d2l-api-eP-(version)-collection-(objectId)-contents-',
	},
	'eportfolio.postCollectionsNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/collections/new: Create a new EP collection. Official reference: https://docs.valence.desire2learn.com/res/collection.html#post--d2l-api-eP-(version)-collections-new',
	},
	'eportfolio.getDashboard': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/dashboard/: Retrieve a set of current EP dashboard activity. Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-dashboard-',
	},
	'eportfolio.getDashboardFilters': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/dashboard/filters/: Retrieve a list of all preset filters available to the dashboard. Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-dashboard-filters-',
	},
	'eportfolio.getExportExportIdPackage': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/export/(exportId)/package: Retrieve the packaged results of a particular export task. Official reference: https://docs.valence.desire2learn.com/res/eport.html#get--d2l-api-eP-(version)-export-(exportId)-package',
	},
	'eportfolio.getExportExportIdStatus': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/export/(exportId)/status: Retrieve the status of a particular export task. Official reference: https://docs.valence.desire2learn.com/res/eport.html#get--d2l-api-eP-(version)-export-(exportId)-status',
	},
	'eportfolio.postExportNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/export/new: Prepare to export an identified list of EP objects. Official reference: https://docs.valence.desire2learn.com/res/eport.html#post--d2l-api-eP-(version)-export-new',
	},
	'eportfolio.postExportNewAll': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/export/new/all: Prepare to export all EP objects owned by the current user context. Official reference: https://docs.valence.desire2learn.com/res/eport.html#post--d2l-api-eP-(version)-export-new-all',
	},
	'eportfolio.getIgnoredusers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/ignoredusers/: Retrieve all the users on the calling userÃ¢Â€Â™s ignored-users list. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-ignoredusers-',
	},
	'eportfolio.postIgnoredusersAdd': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/ignoredusers/add: Add a user to the calling userÃ¢Â€Â™s ignored-user list. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#post--d2l-api-eP-(version)-ignoredusers-add',
	},
	'eportfolio.postIgnoredusersRemove': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/ignoredusers/remove: Remove a user from the calling userÃ¢Â€Â™s ignored-user list. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#post--d2l-api-eP-(version)-ignoredusers-remove',
	},
	'eportfolio.getImportImportIdStatus': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/import/(importId)/status: Retrieve the status of a particular import task. Official reference: https://docs.valence.desire2learn.com/res/eport.html#get--d2l-api-eP-(version)-import-(importId)-status',
	},
	'eportfolio.postImportNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/import/new: Prepare to import an export EP package into this service. Official reference: https://docs.valence.desire2learn.com/res/eport.html#post--d2l-api-eP-(version)-import-new',
	},
	'eportfolio.postImportNewwithdetails': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/import/newwithdetails: Prepare to import an export EP package into this service with immediate\nfeedback on the request. Official reference: https://docs.valence.desire2learn.com/res/eport.html#post--d2l-api-eP-(version)-import-newwithdetails',
	},
	'eportfolio.getInvites': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/invites/: Retrieve a list of all invites. Official reference: https://docs.valence.desire2learn.com/res/invite.html#get--d2l-api-eP-(version)-invites-',
	},
	'eportfolio.postInvitesDelete': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/invites/delete: Delete a particular list of invites. Official reference: https://docs.valence.desire2learn.com/res/invite.html#post--d2l-api-eP-(version)-invites-delete',
	},
	'eportfolio.postInvitesNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/invites/new: Send an invite for a particular EP object. Official reference: https://docs.valence.desire2learn.com/res/invite.html#post--d2l-api-eP-(version)-invites-new',
	},
	'eportfolio.postInvitesStatus': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/invites/status: Sets the read status for a set of invites. Official reference: https://docs.valence.desire2learn.com/res/invite.html#post--d2l-api-eP-(version)-invites-status',
	},
	'eportfolio.deleteLearningobjectiveObjectiveId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/learningobjective/(objectiveId): Delete a learning objective. Official reference: https://docs.valence.desire2learn.com/res/epobjective.html#delete--d2l-api-eP-(version)-learningobjective-(objectiveId)',
	},
	'eportfolio.getLearningobjectiveObjectiveId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/learningobjective/(objectiveId): Retrieve a learning objective. Official reference: https://docs.valence.desire2learn.com/res/epobjective.html#get--d2l-api-eP-(version)-learningobjective-(objectiveId)',
	},
	'eportfolio.postLearningobjectiveObjectiveId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/learningobjective/(objectiveId): Update an existing learning objective. Official reference: https://docs.valence.desire2learn.com/res/epobjective.html#post--d2l-api-eP-(version)-learningobjective-(objectiveId)',
	},
	'eportfolio.deleteLearningobjectiveObjectiveIdAssociationObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/learningobjective/(objectiveId)/association/(objectId): Remove association between a learning objective and an associated EP object. Official reference: https://docs.valence.desire2learn.com/res/epobjective.html#delete--d2l-api-eP-(version)-learningobjective-(objectiveId)-association-(objectId)',
	},
	'eportfolio.postLearningobjectiveObjectiveIdAssociationObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/learningobjective/(objectiveId)/association/(objectId): Create an association between a learning objective and another EP object. Official reference: https://docs.valence.desire2learn.com/res/epobjective.html#post--d2l-api-eP-(version)-learningobjective-(objectiveId)-association-(objectId)',
	},
	'eportfolio.getNewsfeed': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/newsfeed/:  Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-newsfeed-',
	},
	'eportfolio.getNewsfeedFilters': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/newsfeed/filters/:  Official reference: https://docs.valence.desire2learn.com/res/epactivity.html#get--d2l-api-eP-(version)-newsfeed-filters-',
	},
	'eportfolio.getObject': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object: Retrieve an EP object using a context chain of object IDs. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object',
	},
	'eportfolio.getObjectObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/(objectId): Retrieve an EP object by ID. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-(objectId)',
	},
	'eportfolio.getObjectObjectIdAssociations': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/(objectId)/associations/: Retrieve the list of EP objects associated with a particular EP object. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-(objectId)-associations-',
	},
	'eportfolio.deleteObjectObjectIdCommentCommentId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/object/(objectId)/comment/(commentId): Delete a comment from an EP object (identified by object ID). Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#delete--d2l-api-eP-(version)-object-(objectId)-comment-(commentId)',
	},
	'eportfolio.getObjectObjectIdComments': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/(objectId)/comments/: Retrieve all the comments for an EP object (identified by object ID). Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#get--d2l-api-eP-(version)-object-(objectId)-comments-',
	},
	'eportfolio.postObjectObjectIdCommentsNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/object/(objectId)/comments/new: Create a new comment on an EP object (identified by object ID). Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#post--d2l-api-eP-(version)-object-(objectId)-comments-new',
	},
	'eportfolio.getObjectObjectIdContent': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/(objectId)/content: Retrieves the associated resource for an EP object (identified by object ID). Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-(objectId)-content',
	},
	'eportfolio.postObjectObjectIdShareDelete': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/object/(objectId)/share/delete: Unshare a particular EP object from a sharing profile. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#post--d2l-api-eP-(version)-object-(objectId)-share-delete',
	},
	'eportfolio.postObjectObjectIdShareNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/object/(objectId)/share/new: Share a particular EP object to a sharing profile. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#post--d2l-api-eP-(version)-object-(objectId)-share-new',
	},
	'eportfolio.getObjectObjectIdShares': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/(objectId)/shares/: Retrieve all the shares for a particular EP object. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-(objectId)-shares-',
	},
	'eportfolio.getObjectObjectIdTags': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/(objectId)/tags/: Retrieve all the tags associated with an EP object (identified by EP object ID). Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#get--d2l-api-eP-(version)-object-(objectId)-tags-',
	},
	'eportfolio.postObjectObjectIdTagsAdd': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/object/(objectId)/tags/add: Add one or more tags to an EP object. Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#post--d2l-api-eP-(version)-object-(objectId)-tags-add',
	},
	'eportfolio.postObjectObjectIdTagsRemove': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/object/(objectId)/tags/remove: Remove one or more tags from an EP object. Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#post--d2l-api-eP-(version)-object-(objectId)-tags-remove',
	},
	'eportfolio.deleteObjectCommentCommentId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/object/comment/(commentId): Delete a comment from an EP object (identified by provided context chain of object IDs). Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#delete--d2l-api-eP-(version)-object-comment-(commentId)',
	},
	'eportfolio.getObjectComments': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/comments/: Retrieve all the comments for an EP object (identified by provided context chain of object IDs). Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#get--d2l-api-eP-(version)-object-comments-',
	},
	'eportfolio.postObjectCommentsNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/object/comments/new: Create a new comment on an EP object (identified by provided context chain of object IDs). Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#post--d2l-api-eP-(version)-object-comments-new',
	},
	'eportfolio.getObjectContent': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/content: Retrieves the associated resource for an EP object (identified by a provided\ncontext chain of object ID). Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-content',
	},
	'eportfolio.getObjectSharetargets': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/sharetargets: Retrieve a list of all targets an EP object is currently shared with. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-sharetargets',
	},
	'eportfolio.getObjectSharetargetsMy': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/sharetargets/my: Retrieve a list of all the sharing targets owned by the current user context. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-sharetargets-my',
	},
	'eportfolio.getObjectSharetargetsSharinggroups': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/sharetargets/sharinggroups: Retrieve a list of the available sharing groups that an EP object can be shared with. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-sharetargets-sharinggroups',
	},
	'eportfolio.getObjectSharetargetsUsers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/sharetargets/users: Retrieve a list of all available users that an EP object can be shared with. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-sharetargets-users',
	},
	'eportfolio.getObjectThumbnail': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/object/thumbnail: Retrieves a thumbnail of the associated resource for an EP object (identified\nby a provided context chain of object IDs). Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-object-thumbnail',
	},
	'eportfolio.getObjectsObjectsFilterCommentsCommentsFilter': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/objects/(objectsFilter)/comments/(commentsFilter): Retrieve a filtered list of comments for EP objects. Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#get--d2l-api-eP-(version)-objects-(objectsFilter)-comments-(commentsFilter)',
	},
	'eportfolio.getObjectsMy': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/objects/my/: Retrieve all the EP objects owned by the current user context. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-objects-my-',
	},
	'eportfolio.getObjectsMySharedModified': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/objects/my/shared/modified/: Retrieve all the EP objects shared by the current user context, and recently\nmodified by others. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-objects-my-shared-modified-',
	},
	'eportfolio.getObjectsShared': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/objects/shared/: Retrieve all EP objects that others have shared to the current user context. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-objects-shared-',
	},
	'eportfolio.getObjectsTags': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/objects/tags/: Retrieve all the tags associated with a set of EP objects. Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#get--d2l-api-eP-(version)-objects-tags-',
	},
	'eportfolio.postObjectsTagsAdd': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/objects/tags/add: Add one or more tags to a set of EP objects. Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#post--d2l-api-eP-(version)-objects-tags-add',
	},
	'eportfolio.postObjectsTagsRemove': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/objects/tags/remove: Remove one or more tags from a set of EP objects. Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#post--d2l-api-eP-(version)-objects-tags-remove',
	},
	'eportfolio.deletePresentationObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/presentation/(objectId): Delete a particular presentation. Official reference: https://docs.valence.desire2learn.com/res/presentation.html#delete--d2l-api-eP-(version)-presentation-(objectId)',
	},
	'eportfolio.getPresentationObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/presentation/(objectId): Retrieve a particular presentation. Official reference: https://docs.valence.desire2learn.com/res/presentation.html#get--d2l-api-eP-(version)-presentation-(objectId)',
	},
	'eportfolio.postPresentationObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/presentation/(objectId): Update an existing presentation. Official reference: https://docs.valence.desire2learn.com/res/presentation.html#post--d2l-api-eP-(version)-presentation-(objectId)',
	},
	'eportfolio.postPresentationsNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/presentations/new: Create a new presentation. Official reference: https://docs.valence.desire2learn.com/res/presentation.html#post--d2l-api-eP-(version)-presentations-new',
	},
	'eportfolio.deleteReflectionObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/reflection/(objectId): Delete a reflection. Official reference: https://docs.valence.desire2learn.com/res/reflection.html#delete--d2l-api-eP-(version)-reflection-(objectId)',
	},
	'eportfolio.getReflectionObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/reflection/(objectId): Retrieve a reflection. Official reference: https://docs.valence.desire2learn.com/res/reflection.html#get--d2l-api-eP-(version)-reflection-(objectId)',
	},
	'eportfolio.postReflectionObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/reflection/(objectId): Update an existing reflection. Official reference: https://docs.valence.desire2learn.com/res/reflection.html#post--d2l-api-eP-(version)-reflection-(objectId)',
	},
	'eportfolio.deleteReflectionReflectionIdOnObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/reflection/(reflectionId)/on/(objectId): Remove the association between a reflection and another EP object. Official reference: https://docs.valence.desire2learn.com/res/reflection.html#delete--d2l-api-eP-(version)-reflection-(reflectionId)-on-(objectId)',
	},
	'eportfolio.postReflectionReflectionIdOnObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/reflection/(reflectionId)/on/(objectId): Associate a reflection with another EP object. Official reference: https://docs.valence.desire2learn.com/res/reflection.html#post--d2l-api-eP-(version)-reflection-(reflectionId)-on-(objectId)',
	},
	'eportfolio.postReflectionsNew': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/reflections/new: Create a new reflection. Official reference: https://docs.valence.desire2learn.com/res/reflection.html#post--d2l-api-eP-(version)-reflections-new',
	},
	'eportfolio.getSubscriptionsObjects': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/subscriptions/objects/: Return a list of subscribed-to EP objects for the calling user context. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#get--d2l-api-eP-(version)-subscriptions-objects-',
	},
	'eportfolio.deleteSubscriptionsObjectsObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/subscriptions/objects/(objectId): Remove an object from the list of subscribed-to EP objects for the calling user context. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#delete--d2l-api-eP-(version)-subscriptions-objects-(objectId)',
	},
	'eportfolio.postSubscriptionsObjectsObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/subscriptions/objects/(objectId): Add an EP object to the list of subscribed-to objects for the calling user context. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#post--d2l-api-eP-(version)-subscriptions-objects-(objectId)',
	},
	'eportfolio.getSubscriptionsObjectsExists': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/subscriptions/objects/exists: Determine if the calling user context already subscribes to a provided EP object ID. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#get--d2l-api-eP-(version)-subscriptions-objects-exists',
	},
	'eportfolio.getSubscriptionsUsers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/subscriptions/users/: Return a list of subscribed-to users for the calling user context. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#get--d2l-api-eP-(version)-subscriptions-users-',
	},
	'eportfolio.deleteSubscriptionsUsersUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/eP/(version)/subscriptions/users/(userId): Remove a user from the list of subscribed-to users for the calling user context. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#delete--d2l-api-eP-(version)-subscriptions-users-(userId)',
	},
	'eportfolio.postSubscriptionsUsersUserId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/subscriptions/users/(userId): Add a user to the list of subscribed-to users for the calling user context. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#post--d2l-api-eP-(version)-subscriptions-users-(userId)',
	},
	'eportfolio.getSubscriptionsUsersExists': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/subscriptions/users/exists: Determine if the calling user context already subscribes to a provided User ID. Official reference: https://docs.valence.desire2learn.com/res/subscription.html#get--d2l-api-eP-(version)-subscriptions-users-exists',
	},
	'eportfolio.postTagsAutocomplete': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/eP/(version)/tags/autocomplete: Find a list of tags that match a tag template you provide. Official reference: https://docs.valence.desire2learn.com/res/epcomment.html#post--d2l-api-eP-(version)-tags-autocomplete',
	},
	'eportfolio.getUsersSharing': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/eP/(version)/users/sharing/: Retrieve all users sharing EP objects to the current user context. Official reference: https://docs.valence.desire2learn.com/res/epobject.html#get--d2l-api-eP-(version)-users-sharing-',
	},
	'learningEnvironment.postLtiadvantageQuicklinksOrgunitOrgUnitIdLinkLinkId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(apiVersion)/ltiadvantage/quicklinks/orgunit/(orgUnitId)/link/(linkId): Build a new quicklink around an existing LTI Advantage link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(apiVersion)-ltiadvantage-quicklinks-orgunit-(orgUnitId)-link-(linkId)',
	},
	'learningEnvironment.getOrgUnitIdAgents': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/agents: Retrieve all intelligent agents for an org unit. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#get--d2l-api-le-(version)-(orgUnitId)-agents',
	},
	'learningEnvironment.postOrgUnitIdAgents': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/agents: Create a new intelligent agent in the specified org unit. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#post--d2l-api-le-(version)-(orgUnitId)-agents',
	},
	'learningEnvironment.deleteOrgUnitIdAgentsAgentId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/agents/(agentId): Delete an intelligent agent (soft delete). Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#delete--d2l-api-le-(version)-(orgUnitId)-agents-(agentId)',
	},
	'learningEnvironment.getOrgUnitIdAgentsAgentId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/agents/(agentId): Retrieve a specific intelligent agent. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#get--d2l-api-le-(version)-(orgUnitId)-agents-(agentId)',
	},
	'learningEnvironment.postOrgUnitIdAgentsAgentId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/agents/(agentId): Restore a previously deleted intelligent agent. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#post--d2l-api-le-(version)-(orgUnitId)-agents-(agentId)',
	},
	'learningEnvironment.putOrgUnitIdAgentsAgentId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/agents/(agentId): Update an existing intelligent agent. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#put--d2l-api-le-(version)-(orgUnitId)-agents-(agentId)',
	},
	'learningEnvironment.getOrgUnitIdAgentsAgentIdRuns': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/agents/(agentId)/runs: Retrieve the run history for an intelligent agent. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#get--d2l-api-le-(version)-(orgUnitId)-agents-(agentId)-runs',
	},
	'learningEnvironment.postOrgUnitIdAgentsAgentIdRuns': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/agents/(agentId)/runs: Trigger a run for an intelligent agent. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#post--d2l-api-le-(version)-(orgUnitId)-agents-(agentId)-runs',
	},
	'learningEnvironment.getOrgUnitIdAgentsAgentIdRunsRunId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/agents/(agentId)/runs/(runId): Retrieve a specific run for an intelligent agent. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#get--d2l-api-le-(version)-(orgUnitId)-agents-(agentId)-runs-(runId)',
	},
	'learningEnvironment.getOrgUnitIdAgentsCategories': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/agents/categories/: Retrieve all agent categories for an org unit. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#get--d2l-api-le-(version)-(orgUnitId)-agents-categories-',
	},
	'learningEnvironment.postOrgUnitIdAgentsCategories': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/agents/categories/: Create a new agent category in the specified org unit. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#post--d2l-api-le-(version)-(orgUnitId)-agents-categories-',
	},
	'learningEnvironment.deleteOrgUnitIdAgentsCategoriesCategoryId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/agents/categories/(categoryId): Delete an agent category. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#delete--d2l-api-le-(version)-(orgUnitId)-agents-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdAgentsCategoriesCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/agents/categories/(categoryId): Retrieve a specific agent category. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#get--d2l-api-le-(version)-(orgUnitId)-agents-categories-(categoryId)',
	},
	'learningEnvironment.putOrgUnitIdAgentsCategoriesCategoryId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/agents/categories/(categoryId): Update an existing agent category. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#put--d2l-api-le-(version)-(orgUnitId)-agents-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdAgentsDeleted': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/agents/deleted: Retrieve all deleted intelligent agents for an org unit. Official reference: https://docs.valence.desire2learn.com/res/intelligentagents.html#get--d2l-api-le-(version)-(orgUnitId)-agents-deleted',
	},
	'learningEnvironment.getOrgUnitIdAssessment': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/assessment: Retrieve an assessment in an org unit. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#get--d2l-api-le-(version)-(orgUnitId)-assessment',
	},
	'learningEnvironment.putOrgUnitIdAssessment': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/assessment: Update an assessment in an org unit. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#put--d2l-api-le-(version)-(orgUnitId)-assessment',
	},
	'learningEnvironment.postOrgUnitIdCalendarEvent': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/calendar/event/: Create a new event. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#post--d2l-api-le-(version)-(orgUnitId)-calendar-event-',
	},
	'learningEnvironment.deleteOrgUnitIdCalendarEventEventId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/calendar/event/(eventId): Remove a calendar event from a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#delete--d2l-api-le-(version)-(orgUnitId)-calendar-event-(eventId)',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventEventId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/event/(eventId): Retrieve a calendar event from a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-event-(eventId)',
	},
	'learningEnvironment.putOrgUnitIdCalendarEventEventId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/calendar/event/(eventId): Update the properties for a calendar event from a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#put--d2l-api-le-(version)-(orgUnitId)-calendar-event-(eventId)',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventEventIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/event/(eventId)/access/: Retrieve a list of users with access to a specified calendar event. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-event-(eventId)-access-',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventEventIdOccurrences': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/event/(eventId)/occurrences: Retrieve a calendar eventÃ¢Â€Â™s occurrences from a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-event-(eventId)-occurrences',
	},
	'learningEnvironment.postOrgUnitIdCalendarEventEventIdPresenter': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/calendar/event/(eventId)/presenter: Adds a presenter to a specified calendar event. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#post--d2l-api-le-(version)-(orgUnitId)-calendar-event-(eventId)-presenter',
	},
	'learningEnvironment.deleteOrgUnitIdCalendarEventEventIdPresenterUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/calendar/event/(eventId)/presenter/(userId): Removes a presenter from a specified calendar event. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#delete--d2l-api-le-(version)-(orgUnitId)-calendar-event-(eventId)-presenter-(userId)',
	},
	'learningEnvironment.getOrgUnitIdCalendarEvents': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/events/: Retrieve all the calendar events for the calling user, within the provided\norg unit context. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-events-',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsUserIdItemCount': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/events/(userId)/itemCount: Retrieve a filtered count of a userÃ¢Â€Â™s calendar events within one org unit. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-events-(userId)-itemCount',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsMyEvents': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/events/myEvents/: Retrieve the calling userÃ¢Â€Â™s events for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-events-myEvents-',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsMyEventsItemCount': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/events/myEvents/itemCount: Retrieve a count of calling userÃ¢Â€Â™s calendar events, within the provided org unit context. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-events-myEvents-itemCount',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsOccurrences': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/events/occurrences/: Retrieve all the calendar event occurrences for the calling user, within the provided\norg unit context. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-events-occurrences-',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsOrgunits': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/events/orgunits/: Retrieve all the calendar events for the calling user, within a number of org units. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-events-orgunits-',
	},
	'learningEnvironment.getOrgUnitIdCalendarEventsUser': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/calendar/events/user/: Retrieve all the calendar events for a specified userÃ¢Â€Â™s explicit enrollments\nwithin the organization containing the specified org unit. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-(orgUnitId)-calendar-events-user-',
	},
	'learningEnvironment.getOrgUnitIdChecklists': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/checklists/: Retrieve all checklists belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#get--d2l-api-le-(version)-(orgUnitId)-checklists-',
	},
	'learningEnvironment.postOrgUnitIdChecklists': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/checklists/: Create a checklist in the specified org unit. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#post--d2l-api-le-(version)-(orgUnitId)-checklists-',
	},
	'learningEnvironment.deleteOrgUnitIdChecklistsChecklistId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId): Delete an existing checklist in the specified org unit. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#delete--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)',
	},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId): Retrieve a checklist belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#get--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)',
	},
	'learningEnvironment.putOrgUnitIdChecklistsChecklistId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId): Update an existing checklist in the specified org unit. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#put--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)',
	},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdCategories': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/categories/: Retrieve all categories belonging to a checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#get--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-categories-',
	},
	'learningEnvironment.postOrgUnitIdChecklistsChecklistIdCategories': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/categories/: Create a checklist category in the specified checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#post--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-categories-',
	},
	'learningEnvironment.deleteOrgUnitIdChecklistsChecklistIdCategoriesCategoryId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/categories/(categoryId): Delete an existing checklist category in an existing checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#delete--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-categories-(categoryId)',
		},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdCategoriesCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/categories/(categoryId): Retrieve a category belonging to a checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#get--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-categories-(categoryId)',
	},
	'learningEnvironment.putOrgUnitIdChecklistsChecklistIdCategoriesCategoryId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/categories/(categoryId): Update an existing checklist category in an existing checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#put--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdItems': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/items/: Retrieve all items belonging to a checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#get--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-items-',
	},
	'learningEnvironment.postOrgUnitIdChecklistsChecklistIdItems': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/items/: Create a checklist item in the specified checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#post--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-items-',
	},
	'learningEnvironment.deleteOrgUnitIdChecklistsChecklistIdItemsChecklistItemId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/items/(checklistItemId): Delete an existing checklist item in an existing checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#delete--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-items-(checklistItemId)',
		},
	'learningEnvironment.getOrgUnitIdChecklistsChecklistIdItemsChecklistItemId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/items/(checklistItemId): Retrieve an item belonging to a checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#get--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-items-(checklistItemId)',
	},
	'learningEnvironment.putOrgUnitIdChecklistsChecklistIdItemsChecklistItemId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/checklists/(checklistId)/items/(checklistItemId): Update an existing checklist item in an existing checklist. Official reference: https://docs.valence.desire2learn.com/res/checklist.html#put--d2l-api-le-(version)-(orgUnitId)-checklists-(checklistId)-items-(checklistItemId)',
	},
	'learningEnvironment.getOrgUnitIdClasslist': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/classlist/: Retrieve the enrolled users in the classlist for an org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-le-(version)-(orgUnitId)-classlist-',
	},
	'learningEnvironment.getOrgUnitIdClasslistPaged': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/classlist/paged/: Retrieve the enrolled users in the classlist for an org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-le-(version)-(orgUnitId)-classlist-paged-',
	},
	'learningEnvironment.getOrgUnitIdCompetenciesStructure': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/competencies/structure: Retrieve the structure of course competencies and objectives as visible to the calling user. Official reference: https://docs.valence.desire2learn.com/res/competency.html#get--d2l-api-le-(version)-(orgUnitId)-competencies-structure',
	},
	'learningEnvironment.getOrgUnitIdContentBookmarks': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/bookmarks: Retrieve a list of topics that have been bookmarked. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-bookmarks',
	},
	'learningEnvironment.getOrgUnitIdContentCompletions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/completions/: Retrieves the count of completed and required content topics in an org unit\nfor each of the users in the csv. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-completions-',
	},
	'learningEnvironment.getOrgUnitIdContentCompletionsMycount': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/completions/mycount/: Retrieves the aggregate count of completed and required content topics in an\norg unit for the calling user. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-completions-mycount-',
	},
	'learningEnvironment.postOrgUnitIdContentExemptionsUsersUserIdByFilter': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/content/exemptions/users/(userId)/byFilter/: Create exemptions for content topics matching a specific filter for a user. Official reference: https://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-exemptions-users-(userId)-byFilter-',
	},
	'learningEnvironment.postOrgUnitIdContentExemptionsUsersUserIdByList': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/content/exemptions/users/(userId)/byList/: Create exemptions for specific content topics for a user. Official reference: https://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-exemptions-users-(userId)-byList-',
	},
	'learningEnvironment.postOrgUnitIdContentExemptionsUsersUserIdByListDelete': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/content/exemptions/users/(userId)/byList/delete/: Delete exemptions for content topics for a user. Official reference: https://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-exemptions-users-(userId)-byList-delete-',
	},
	'learningEnvironment.deleteOrgUnitIdContentModulesModuleId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/content/modules/(moduleId): Delete a specific module from an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#delete--d2l-api-le-(version)-(orgUnitId)-content-modules-(moduleId)',
	},
	'learningEnvironment.getOrgUnitIdContentModulesModuleId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/modules/(moduleId): Retrieve a specific module for an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-modules-(moduleId)',
	},
	'learningEnvironment.putOrgUnitIdContentModulesModuleId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/content/modules/(moduleId): Update a particular module for an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#put--d2l-api-le-(version)-(orgUnitId)-content-modules-(moduleId)',
	},
	'learningEnvironment.getOrgUnitIdContentModulesModuleIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/modules/(moduleId)/access/: Retrieve a list of users with access to a specified module. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-modules-(moduleId)-access-',
	},
	'learningEnvironment.getOrgUnitIdContentModulesModuleIdStructure': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/modules/(moduleId)/structure/: Retrieve the structure for a specific module in an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-modules-(moduleId)-structure-',
	},
	'learningEnvironment.postOrgUnitIdContentModulesModuleIdStructure': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/content/modules/(moduleId)/structure/: Add a child module or topic to a specific moduleÃ¢Â€Â™s structure. Official reference: https://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-modules-(moduleId)-structure-',
	},
	'learningEnvironment.getOrgUnitIdContentMyItems': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/myItems/: Retrieve the calling userÃ¢Â€Â™s scheduled items for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-myItems-',
	},
	'learningEnvironment.getOrgUnitIdContentMyItemsDue': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/myItems/due/: Retrieve the calling userÃ¢Â€Â™s scheduled items still due for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-myItems-due-',
	},
	'learningEnvironment.getOrgUnitIdContentMyItemsDueItemCount': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/myItems/due/itemCount: Retrieve quantity of the calling userÃ¢Â€Â™s scheduled items still due for a\nparticular org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-myItems-due-itemCount',
	},
	'learningEnvironment.getOrgUnitIdContentMyItemsItemCount': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/myItems/itemCount: Retrieve the quantity of the calling userÃ¢Â€Â™s scheduled items for provided org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-myItems-itemCount',
	},
	'learningEnvironment.postOrgUnitIdContentOrderObjectIdObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/content/order/objectId/(objectId): Specify the position order of a content object with respect to its sibling objects. Official reference: https://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-order-objectId-(objectId)',
	},
	'learningEnvironment.getOrgUnitIdContentPacing': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/pacing: Retrieve pacing dates for content. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-pacing',
	},
	'learningEnvironment.putOrgUnitIdContentPacing': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/content/pacing: Set pacing dates for content. Official reference: https://docs.valence.desire2learn.com/res/content.html#put--d2l-api-le-(version)-(orgUnitId)-content-pacing',
	},
	'learningEnvironment.putOrgUnitIdContentPacingModulesModuleId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/content/pacing/modules/(moduleId): Set pacing dates for a specific module. Official reference: https://docs.valence.desire2learn.com/res/content.html#put--d2l-api-le-(version)-(orgUnitId)-content-pacing-modules-(moduleId)',
	},
	'learningEnvironment.getOrgUnitIdContentRecent': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/recent: Retrieve a list of the most recently visited topics. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-recent',
	},
	'learningEnvironment.getOrgUnitIdContentRoot': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/root/: Retrieve the root module(s) for an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-root-',
	},
	'learningEnvironment.postOrgUnitIdContentRoot': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/content/root/: Create a new root module for an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-root-',
	},
	'learningEnvironment.getOrgUnitIdContentToc': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/toc: Retrieve the table of course content for an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-toc',
	},
	'learningEnvironment.deleteOrgUnitIdContentTopicsTopicId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId): Delete a specific topic from an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#delete--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)',
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId): Retrieve a specific topic for an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)',
	},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId): Update a particular topic for an org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#put--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)',
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/access/: Retrieve a list of users with access to a specified content topic. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-access-',
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdCaptions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/captions: Retrieve metadata for all captions associated with an audio or video content\ntopic. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-captions',
	},
	'learningEnvironment.deleteOrgUnitIdContentTopicsTopicIdCaptionsLanguage': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/captions/(language): Delete the captions file associated with a content topic for a\nspecific language. Official reference: https://docs.valence.desire2learn.com/res/content.html#delete--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-captions-(language)',
	},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicIdCaptionsLanguage': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/captions/(language): Provide a language-specific captions file associated with a particular\ncontent topic. Official reference: https://docs.valence.desire2learn.com/res/content.html#put--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-captions-(language)',
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdCompletions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/completions/: Retrieve a list of content topic completions for a topic for users the caller\nhas access to. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-completions-',
	},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdCompletionsUsersUserId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/completions/users/(userId): Retrieve a content topic completion for a topic for a particular user. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-completions-users-(userId)',
		},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicIdCompletionsUsersUserId':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/completions/users/(userId): Update a content topic completion for a topic for a particular user. Official reference: https://docs.valence.desire2learn.com/res/content.html#put--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-completions-users-(userId)',
		},
	'learningEnvironment.getOrgUnitIdContentTopicsTopicIdFile': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/file: Retrieve the content topic file for a content topic. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-file',
	},
	'learningEnvironment.putOrgUnitIdContentTopicsTopicIdFile': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/content/topics/(topicId)/file: Replace the content topic file for a content topic. Official reference: https://docs.valence.desire2learn.com/res/content.html#put--d2l-api-le-(version)-(orgUnitId)-content-topics-(topicId)-file',
	},
	'learningEnvironment.getOrgUnitIdContentUserprogress': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/userprogress/: Retrieve the user progress items in an org unit, for specific users or\ncontent topics. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-userprogress-',
	},
	'learningEnvironment.postOrgUnitIdContentUserprogress': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/content/userprogress/: Update a user progress item. Official reference: https://docs.valence.desire2learn.com/res/content.html#post--d2l-api-le-(version)-(orgUnitId)-content-userprogress-',
	},
	'learningEnvironment.getOrgUnitIdContentUserprogressTopicId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/content/userprogress/(topicId): Retrieve one userÃ¢Â€Â™s progress within an org unit for a particular content topic. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-content-userprogress-(topicId)',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsDeleted': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/deleted: Retrieve deleted discussion forums and topics for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-deleted',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForums': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/: Retrieve a list of all discussion forums for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-',
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForums': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/: Create a new forum for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-',
	},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId): Delete a particular discussion forum from an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#delete--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId): Retrieve a particular discussion forum for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)',
	},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId): Update a forum for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/access/: Retrieve a list of users with access to a specified forum. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-access-',
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdCopy': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/copy: Copy a discussion forum within an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-copy',
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdOrder': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/order: Specify the position order of a discussion forum with respect to its sibling forums. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-order',
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdRestore': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/restore: Restore a deleted discussion forum in an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-restore',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdStatistics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/statistics: Retrieve discussion statistics for a specific forum within an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-statistics',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/: Retrieve topics from the provided discussion forum in an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-',
	},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopics': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/: Create a new topic for the provided discussion forum in an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-',
	},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId): Delete a particular topic from the provided discussion forum in an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#delete--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId): Retrieve a particular topic from the provided discussion forum in an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)',
	},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId): Update an existing topic for the provided discussion forum in an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdAccess':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/access/: Retrieve a list of users with access to a specified topic within a forum. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-access-',
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdCopy':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/copy: Copy a discussion topic within an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-copy',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdExemption':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/exemption: Retrieve the list of users currently exempted from a discussion topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-exemption',
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/groupRestrictions/: Delete a group restriction for a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#delete--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-groupRestrictions-',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/groupRestrictions/: Retrieve the group restrictions for a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-groupRestrictions-',
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdGroupRestrictions':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/groupRestrictions/: Add a group to the group restriction list for a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-groupRestrictions-',
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdOrder':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/order: Specify the position order of a discussion topic with respect to its sibling topics. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-order',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPosts':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/: Retrieve all posts in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-',
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPosts':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/: Create a new post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-',
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId): Delete a particular post from a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#delete--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId): Retrieve a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)',
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostId':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId): Update a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdApproval':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Approval: Retrieve the approval status for a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Approval',
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdApproval':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Approval: Update the approval status of a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Approval',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdFlag':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Flag: Retrieve the flagged status for a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Flag',
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdFlag':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Flag: Update the flagged status of a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Flag',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRating':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Rating: Retrieve the rating data for a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Rating',
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Rating/MyRating: Delete the current user contextÃ¢Â€Â™s rating for a particular post from a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#delete--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Rating-MyRating',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Rating/MyRating: Retrieve the current user contextÃ¢Â€Â™s rating data for a particular post in a\ndiscussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Rating-MyRating',
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdRatingMyRating':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Rating/MyRating: Update the current user contextÃ¢Â€Â™s rating for a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Rating-MyRating',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdReadStatus':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/ReadStatus: Retrieve the current read status for a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-ReadStatus',
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdReadStatus':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/ReadStatus: Update the read status of a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-ReadStatus',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotes':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Votes: Retrieve all the vote data for a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Votes',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotesMyVote':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Votes/MyVote: Retrieve the current userÃ¢Â€Â™s vote data for a particular post in a discussion\nforum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Votes-MyVote',
		},
	'learningEnvironment.putOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdVotesMyVote':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/Votes/MyVote: Update a discussion forum topic postÃ¢Â€Â™s vote data for the current user. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#put--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-Votes-MyVote',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdAttachmentsFileId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/attachments/(fileId): Retrieve a specific file attachment from a discussion forum post. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-attachments-(fileId)',
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdPin':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/pin: Pin a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-pin',
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdPostsPostIdUnpin':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/posts/(postId)/unpin: Unpin a particular post in a discussion forum topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-posts-(postId)-unpin',
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdRestore':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/restore: Restore a deleted discussion topic in a forum for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-restore',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdStatistics':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/statistics: Retrieve discussion statistics for a specific topic within a forum. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-statistics',
		},
	'learningEnvironment.deleteOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserUserIdExemption':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/user/(userId)/exemption: Remove an existing exemption for a specific user from a discussion topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#delete--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-user-(userId)-exemption',
		},
	'learningEnvironment.postOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserUserIdExemption':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/user/(userId)/exemption: Exempt a specific user from a discussion topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#post--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-user-(userId)-exemption',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumsForumIdTopicsTopicIdUserstatistics':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forums/(forumId)/topics/(topicId)/userstatistics: Retrieve per-user discussion statistics for a specific topic within a forum. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forums-(forumId)-topics-(topicId)-userstatistics',
		},
	'learningEnvironment.getOrgUnitIdDiscussionsForumtopicstatistics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/forumtopicstatistics: Retrieve discussion statistics for an org unit, broken down by forum and topic. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-forumtopicstatistics',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsStatistics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/statistics: Retrieve overall discussion statistics for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-statistics',
	},
	'learningEnvironment.getOrgUnitIdDiscussionsUserstatistics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/discussions/userstatistics: Retrieve per-user discussion statistics for an org unit. Official reference: https://docs.valence.desire2learn.com/res/discuss.html#get--d2l-api-le-(version)-(orgUnitId)-discussions-userstatistics',
	},
	'learningEnvironment.getOrgUnitIdDropboxCategories': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/categories/: Retrieve all dropbox folder categories for the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-categories-',
	},
	'learningEnvironment.postOrgUnitIdDropboxCategories': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/categories/: Create a new dropbox folder category for the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-categories-',
	},
	'learningEnvironment.deleteOrgUnitIdDropboxCategoriesCategoryId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/dropbox/categories/(categoryId): Delete a specific dropbox folder category from an org unit. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#delete--d2l-api-le-(version)-(orgUnitId)-dropbox-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdDropboxCategoriesCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/categories/(categoryId): Retrieve the information for a specific dropbox folder category. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-categories-(categoryId)',
	},
	'learningEnvironment.putOrgUnitIdDropboxCategoriesCategoryId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/dropbox/categories/(categoryId): Update the information for a specific dropbox folder category. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#put--d2l-api-le-(version)-(orgUnitId)-dropbox-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdDropboxFolders': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/: Retrieve all dropbox folders for an org unit. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-',
	},
	'learningEnvironment.postOrgUnitIdDropboxFolders': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/: Create a new dropbox folder in an org unit. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-',
	},
	'learningEnvironment.deleteOrgUnitIdDropboxFoldersFolderId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId): Delete a particular dropbox folder in an org unit. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#delete--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)',
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId): Retrieve a specific dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)',
	},
	'learningEnvironment.putOrgUnitIdDropboxFoldersFolderId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId): Update a particular dropbox folder in an org unit. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#put--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)',
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/access/: Retrieve a list of users with access to a specified dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-access-',
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdAttachmentsFileId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/attachments/(fileId): Retrieve a file attachment (identified by file ID) from a specific dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-attachments-(fileId)',
	},
	'learningEnvironment.putOrgUnitIdDropboxFoldersFolderIdEntitiesEntityIdCompletion':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/entities/(entityId)/completion: Manually set the completion date value for an entity within\na specified observational dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#put--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-entities-(entityId)-completion',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/feedback/(entityType)/(entityId): Retrieve the feedback entry from a dropbox folder for the provided entity. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-feedback-(entityType)-(entityId)',
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityId':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/feedback/(entityType)/(entityId): Post feedback (without attachment) for a particular submission in a specific\ndropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-feedback-(entityType)-(entityId)',
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttach':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/feedback/(entityType)/(entityId)/attach: Attach an uploaded file to a particular entityÃ¢Â€Â™s feedback entry in a specific dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-feedback-(entityType)-(entityId)-attach',
		},
	'learningEnvironment.deleteOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttachmentsFileId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/feedback/(entityType)/(entityId)/attachments/(fileId): Remove a particular file attachment from an entityÃ¢Â€Â™s feedback entry within a\nspecified dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#delete--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-feedback-(entityType)-(entityId)-attachments-(fileId)',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdAttachmentsFileId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/feedback/(entityType)/(entityId)/attachments/(fileId): Retrieve a feedback entryÃ¢Â€Â™s file attachment from a dropbox folder for the\nprovided entity. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-feedback-(entityType)-(entityId)-attachments-(fileId)',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdLinksLinkId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/feedback/(entityType)/(entityId)/links/(linkId): Retrieve a feedback entryÃ¢Â€Â™s linked media content attachment from a dropbox folder for the\nprovided entity. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-feedback-(entityType)-(entityId)-links-(linkId)',
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdFeedbackEntityTypeEntityIdUpload':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/feedback/(entityType)/(entityId)/upload: Initiate a resumable file upload request for a particular entityÃ¢Â€Â™s feedback\nfor a specific dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-feedback-(entityType)-(entityId)-upload',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdGroupSubmissionsGroupIdDownload':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/group-submissions/(groupId)/download: Download all the files submitted by users in a group for a particular dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-group-submissions-(groupId)-download',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSpecialaccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/specialaccess/: Retrieve special access rules for users in a specified dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-specialaccess-',
	},
	'learningEnvironment.deleteOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/specialaccess/(userId): Delete the special access rule for a user in a specified dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#delete--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-specialaccess-(userId)',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/specialaccess/(userId): Retrieve the special access rule for a user in a specified dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-specialaccess-(userId)',
	},
	'learningEnvironment.putOrgUnitIdDropboxFoldersFolderIdSpecialaccessUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/specialaccess/(userId): Create or update a special access rule for a user in a dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#put--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-specialaccess-(userId)',
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/: Retrieve all the submissions for a specific dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-',
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsSubmissionIdFilesFileId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/(submissionId)/files/(fileId): Retrieve one of the files included in a submission for a particular dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-(submissionId)-files-(fileId)',
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdSubmissionsSubmissionIdFilesFileIdMarkAsRead':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/(submissionId)/files/(fileId)/markAsRead: Mark a submitted file as read. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-(submissionId)-files-(fileId)-markAsRead',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsUserIdDownload':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/(userId)/download: Download all the files submitted by a user for a particular dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-(userId)-download',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsGroupGroupId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/group/(groupId): Retrieve all the submissions for a specific group in a dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-group-(groupId)',
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdSubmissionsGroupGroupId':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/group/(groupId)/: Post a new group submission to a particular dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-group-(groupId)-',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsMysubmissions':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/mysubmissions/: Retrieve all the submissions made by the current user to a particular dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-mysubmissions-',
		},
	'learningEnvironment.postOrgUnitIdDropboxFoldersFolderIdSubmissionsMysubmissions':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/mysubmissions/: Post a new submission for the current user context to a particular dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#post--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-mysubmissions-',
		},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsPaged': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/paged/: Retrieve a page of submissions for a specific dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-paged-',
	},
	'learningEnvironment.getOrgUnitIdDropboxFoldersFolderIdSubmissionsUserUserId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/dropbox/folders/(folderId)/submissions/user/(userId): Retrieve all the submissions for a specific user in a dropbox folder. Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-(orgUnitId)-dropbox-folders-(folderId)-submissions-user-(userId)',
		},
	'learningEnvironment.getOrgUnitIdGrades': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/: Retrieve all the current grade objects for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-',
	},
	'learningEnvironment.postOrgUnitIdGrades': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/: Create a new grade object for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-',
	},
	'learningEnvironment.deleteOrgUnitIdGradesGradeObjectId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId): Delete a specific grade object for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#delete--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId): Retrieve a specific grade object for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)',
	},
	'learningEnvironment.putOrgUnitIdGradesGradeObjectId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId): Update a specific grade object. Official reference: https://docs.valence.desire2learn.com/res/grade.html#put--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/access/: Retrieve a list of users with access to a specified grade. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-access-',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdExemptions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/exemptions/: Retrieve all the exempt users for a provided grade. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-exemptions-',
	},
	'learningEnvironment.deleteOrgUnitIdGradesGradeObjectIdExemptionsUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/exemptions/(userId): Remove a userÃ¢Â€Â™s exemption from a grade. Official reference: https://docs.valence.desire2learn.com/res/grade.html#delete--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-exemptions-(userId)',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdExemptionsUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/exemptions/(userId): Determine if a user is exempt from a grade. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-exemptions-(userId)',
	},
	'learningEnvironment.postOrgUnitIdGradesGradeObjectIdExemptionsUserId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/exemptions/(userId): Exempt a user from a grade. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-exemptions-(userId)',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdIpsis': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/ipsis: Retrieve the IPSIS details for a grade object. Official reference: https://docs.valence.desire2learn.com/res/ipsis.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-ipsis',
	},
	'learningEnvironment.putOrgUnitIdGradesGradeObjectIdIpsis': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/ipsis: Update IPSIS details for a grade object. Official reference: https://docs.valence.desire2learn.com/res/ipsis.html#put--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-ipsis',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdStatistics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/statistics: Get statistics for a specified grade item. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-statistics',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdValues': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/values/: Retrieve each userÃ¢Â€Â™s grade value for a particular grade object. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-values-',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdValuesUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/values/(userId): Retrieve a specific grade value for a particular user assigned in an org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-values-(userId)',
	},
	'learningEnvironment.putOrgUnitIdGradesGradeObjectIdValuesUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/values/(userId): Provide a specific grade value for a particular user. Official reference: https://docs.valence.desire2learn.com/res/grade.html#put--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-values-(userId)',
	},
	'learningEnvironment.postOrgUnitIdGradesGradeObjectIdValuesUserIdClear': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/values/(userId)/clear: Clear a current grade value for a user while preserving feedback comments. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-values-(userId)-clear',
	},
	'learningEnvironment.getOrgUnitIdGradesGradeObjectIdValuesMyGradeValue': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/(gradeObjectId)/values/myGradeValue: Retrieve a specific grade value for the current user context assigned in a\nparticular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-(gradeObjectId)-values-myGradeValue',
	},
	'learningEnvironment.getOrgUnitIdGradesCategories': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/categories/: Retrieve a list of all grade categories for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-categories-',
	},
	'learningEnvironment.postOrgUnitIdGradesCategories': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/categories/: Create a new grade category for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-categories-',
	},
	'learningEnvironment.deleteOrgUnitIdGradesCategoriesCategoryId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/grades/categories/(categoryId): Delete a specific grade category for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#delete--d2l-api-le-(version)-(orgUnitId)-grades-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdGradesCategoriesCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/categories/(categoryId): Retrieve a specific grade category for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-categories-(categoryId)',
	},
	'learningEnvironment.putOrgUnitIdGradesCategoriesCategoryId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/categories/(categoryId): Update a specific grade category for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#put--d2l-api-le-(version)-(orgUnitId)-grades-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdGradesCategoriesCategoryIdIpsis': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/categories/(categoryId)/ipsis: Retrieve the IPSIS details for a grade category. Official reference: https://docs.valence.desire2learn.com/res/ipsis.html#get--d2l-api-le-(version)-(orgUnitId)-grades-categories-(categoryId)-ipsis',
	},
	'learningEnvironment.putOrgUnitIdGradesCategoriesCategoryIdIpsis': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/categories/(categoryId)/ipsis: Update the IPSIS details for a grade category. Official reference: https://docs.valence.desire2learn.com/res/ipsis.html#put--d2l-api-le-(version)-(orgUnitId)-grades-categories-(categoryId)-ipsis',
	},
	'learningEnvironment.getOrgUnitIdGradesCourseCompletion': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/courseCompletion/: Retrieve all the course completion records for an org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-courseCompletion-',
	},
	'learningEnvironment.postOrgUnitIdGradesCourseCompletion': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/courseCompletion/: Create a new course completion for an org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-courseCompletion-',
	},
	'learningEnvironment.deleteOrgUnitIdGradesCourseCompletionCompletionId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/grades/courseCompletion/(completionId): Delete a course completion. Official reference: https://docs.valence.desire2learn.com/res/grade.html#delete--d2l-api-le-(version)-(orgUnitId)-grades-courseCompletion-(completionId)',
	},
	'learningEnvironment.putOrgUnitIdGradesCourseCompletionCompletionId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/courseCompletion/(completionId): Update an existing course completion. Official reference: https://docs.valence.desire2learn.com/res/grade.html#put--d2l-api-le-(version)-(orgUnitId)-grades-courseCompletion-(completionId)',
	},
	'learningEnvironment.getOrgUnitIdGradesExemptionsUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/exemptions/(userId): Retrieve all the grade objects for a provided user in a provided org unit with\nexemption status included. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-exemptions-(userId)',
	},
	'learningEnvironment.postOrgUnitIdGradesExemptionsUserId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/exemptions/(userId): Attempt to exempt or unexempt a set of grades for a user. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-exemptions-(userId)',
	},
	'learningEnvironment.postOrgUnitIdGradesFinalCalculatedUserId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/final/calculated/(userId): Recalculate final grade value for provided user in org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-final-calculated-(userId)',
	},
	'learningEnvironment.postOrgUnitIdGradesFinalCalculatedAll': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/final/calculated/all: Recalculate all final grade values for provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-final-calculated-all',
	},
	'learningEnvironment.getOrgUnitIdGradesFinalValues': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/final/values/: Retrieve each userÃ¢Â€Â™s final grade value for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-final-values-',
	},
	'learningEnvironment.getOrgUnitIdGradesFinalValuesUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/final/values/(userId): Retrieve the final grade value for a particular user. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-final-values-(userId)',
	},
	'learningEnvironment.putOrgUnitIdGradesFinalValuesUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/final/values/(userId): Set the adjusted final grade value for provided user in org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#put--d2l-api-le-(version)-(orgUnitId)-grades-final-values-(userId)',
	},
	'learningEnvironment.getOrgUnitIdGradesFinalValuesMyGradeValue': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/final/values/myGradeValue: Retrieve the final grade value for the current user context. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-final-values-myGradeValue',
	},
	'learningEnvironment.getOrgUnitIdGradesSchemes': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/schemes/: Retrieve all the grade schemes for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-schemes-',
	},
	'learningEnvironment.postOrgUnitIdGradesSchemes': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/grades/schemes/: Create a new grade scheme for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#post--d2l-api-le-(version)-(orgUnitId)-grades-schemes-',
	},
	'learningEnvironment.deleteOrgUnitIdGradesSchemesGradeSchemeId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/grades/schemes/(gradeSchemeId): Delete a particular grade scheme. Official reference: https://docs.valence.desire2learn.com/res/grade.html#delete--d2l-api-le-(version)-(orgUnitId)-grades-schemes-(gradeSchemeId)',
	},
	'learningEnvironment.getOrgUnitIdGradesSchemesGradeSchemeId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/schemes/(gradeSchemeId): Retrieve a particular grade scheme. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-schemes-(gradeSchemeId)',
	},
	'learningEnvironment.getOrgUnitIdGradesSchemesDefault': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/schemes/default: Retrieve the default grade scheme for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-schemes-default',
	},
	'learningEnvironment.getOrgUnitIdGradesSetup': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/setup/: Retrieve the grades configuration for the org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-setup-',
	},
	'learningEnvironment.putOrgUnitIdGradesSetup': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/grades/setup/: Update the grades configuration for the org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#put--d2l-api-le-(version)-(orgUnitId)-grades-setup-',
	},
	'learningEnvironment.getOrgUnitIdGradesValues': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/values/: Retrieve all grade values in bulk for every user in a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-values-',
	},
	'learningEnvironment.getOrgUnitIdGradesValuesUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/values/(userId)/: Retrieve all the grade values for a particular user assigned in an org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-values-(userId)-',
	},
	'learningEnvironment.getOrgUnitIdGradesValuesDescendants': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/values/descendants/: Retrieve all grade values in bulk for every user in a group of org units. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-values-descendants-',
	},
	'learningEnvironment.getOrgUnitIdGradesValuesMyGradeValues': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/grades/values/myGradeValues/: Retrieve all the grade values for the current user context assigned in a\nparticular org unit. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-(orgUnitId)-grades-values-myGradeValues-',
	},
	'learningEnvironment.getOrgUnitIdLoAlignments': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/lo/alignments/: Retrieve all the alignments in an org unit. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-(orgUnitId)-lo-alignments-',
	},
	'learningEnvironment.getOrgUnitIdLoAlignmentsActivityActivityTypeObjectId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/lo/alignments/activity/(activityType)/(objectId): Retrieve all the alignments to a given activity. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-(orgUnitId)-lo-alignments-activity-(activityType)-(objectId)',
	},
	'learningEnvironment.postOrgUnitIdLoAlignmentsActivityActivityTypeObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/lo/alignments/activity/(activityType)/(objectId): Modify the alignments to a given activity. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#post--d2l-api-le-(version)-(orgUnitId)-lo-alignments-activity-(activityType)-(objectId)',
	},
	'learningEnvironment.getOrgUnitIdLoAlignmentsOutcomeOutcomeId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/lo/alignments/outcome/(outcomeId): Retrieve all the alignments to a given outcome in an org unit. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-(orgUnitId)-lo-alignments-outcome-(outcomeId)',
	},
	'learningEnvironment.getOrgUnitIdLoAlignmentsOutcomeSetOutcomeSetId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/lo/alignments/outcomeSet/(outcomeSetId): Retrieve all the alignments to outcomes in an outcome set in an org unit. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-(orgUnitId)-lo-alignments-outcomeSet-(outcomeSetId)',
	},
	'learningEnvironment.postOrgUnitIdLoBulkExport': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/lo/bulkExport: Retrieve org unit level outcome sets in export format. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#post--d2l-api-le-(version)-(orgUnitId)-lo-bulkExport',
	},
	'learningEnvironment.postOrgUnitIdLoBulkImport': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/lo/bulkImport: Imports outcome sets into the org unit. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#post--d2l-api-le-(version)-(orgUnitId)-lo-bulkImport',
	},
	'learningEnvironment.getOrgUnitIdLoOutcomeSets': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/lo/outcomeSets/: Retrieve all outcome sets in an org unit. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-(orgUnitId)-lo-outcomeSets-',
	},
	'learningEnvironment.getOrgUnitIdLoOutcomeSetsOutcomeSetId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/lo/outcomeSets/(outcomeSetId): Retrieve a specific outcome set from an org unit. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-(orgUnitId)-lo-outcomeSets-(outcomeSetId)',
	},
	'learningEnvironment.putOrgUnitIdLoOutcomeSetsOutcomeSetId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/lo/outcomeSets/(outcomeSetId): Update a specific outcome set from an org unit. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#put--d2l-api-le-(version)-(orgUnitId)-lo-outcomeSets-(outcomeSetId)',
	},
	'learningEnvironment.deleteOrgUnitIdLockerGroupGroupIdPath': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/locker/group/(groupId)/(path): Delete a file or folder from the locker of a group in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/locker.html#delete--d2l-api-le-(version)-(orgUnitId)-locker-group-(groupId)-(path)',
	},
	'learningEnvironment.getOrgUnitIdLockerGroupGroupIdPath': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/locker/group/(groupId)/(path): Retrieve a specific object from a provided groupÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#get--d2l-api-le-(version)-(orgUnitId)-locker-group-(groupId)-(path)',
	},
	'learningEnvironment.postOrgUnitIdLockerGroupGroupIdPath': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/locker/group/(groupId)/(path): Add a new file or folder to the locker for a group in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/locker.html#post--d2l-api-le-(version)-(orgUnitId)-locker-group-(groupId)-(path)',
	},
	'learningEnvironment.putOrgUnitIdLockerGroupGroupIdPath': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/locker/group/(groupId)/(path): Rename a folder in the locker for a group in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/locker.html#put--d2l-api-le-(version)-(orgUnitId)-locker-group-(groupId)-(path)',
	},
	'learningEnvironment.getOrgUnitIdNews': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/news/: Retrieve a list of news items for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-(orgUnitId)-news-',
	},
	'learningEnvironment.postOrgUnitIdNews': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/news/: Create a news item for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#post--d2l-api-le-(version)-(orgUnitId)-news-',
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId): Delete a particular news item from an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#delete--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)',
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId): Retrieve a particular news item for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)',
	},
	'learningEnvironment.putOrgUnitIdNewsNewsItemId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId): Update a news item for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#put--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)',
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/access/: Retrieve a list of users with access to a specified news item. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-access-',
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdAttachments': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/attachments/: Add an attachment to a news item for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#post--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-attachments-',
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemIdAttachmentsFileId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/attachments/(fileId): Delete an attachment from an org unitÃ¢Â€Â™s news item. Official reference: https://docs.valence.desire2learn.com/res/news.html#delete--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-attachments-(fileId)',
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemIdAttachmentsFileId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/attachments/(fileId): Retrieve an attachment for an org unitÃ¢Â€Â™s news item. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-attachments-(fileId)',
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdDismiss': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/dismiss: Dismiss (hide) a news item for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#post--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-dismiss',
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdPublish': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/publish: Publish a draft news item for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#post--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-publish',
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdRestore': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/restore: Restore (unhide) a news item for an org unit. Official reference: https://docs.valence.desire2learn.com/res/news.html#post--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-restore',
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemIdSharing': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/sharing/: Delete all sharing rules the news item specified. Official reference: https://docs.valence.desire2learn.com/res/news.html#delete--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-sharing-',
	},
	'learningEnvironment.getOrgUnitIdNewsNewsItemIdSharing': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/sharing/: Retrieve the sharing rules for a particular news item. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-sharing-',
	},
	'learningEnvironment.postOrgUnitIdNewsNewsItemIdSharing': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/sharing/: Add a sharing rule for a particular news item. Official reference: https://docs.valence.desire2learn.com/res/news.html#post--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-sharing-',
	},
	'learningEnvironment.deleteOrgUnitIdNewsNewsItemIdSharingSharingOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/sharing/(sharingOrgUnitId): Delete a sharing rule for a particular sharing org unit for the news item specified. Official reference: https://docs.valence.desire2learn.com/res/news.html#delete--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-sharing-(sharingOrgUnitId)',
	},
	'learningEnvironment.putOrgUnitIdNewsNewsItemIdSharingSharingOrgUnitId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/news/(newsItemId)/sharing/(sharingOrgUnitId): Update a particular sharing rule for an sharing org unit for the news item specified. Official reference: https://docs.valence.desire2learn.com/res/news.html#put--d2l-api-le-(version)-(orgUnitId)-news-(newsItemId)-sharing-(sharingOrgUnitId)',
	},
	'learningEnvironment.getOrgUnitIdNewsDeleted': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/news/deleted/: news:newsitems:read Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-(orgUnitId)-news-deleted-',
	},
	'learningEnvironment.postOrgUnitIdNewsDeletedNewsItemIdRestore': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/news/deleted/(newsItemId)/restore: news:newsitems:manage Official reference: https://docs.valence.desire2learn.com/res/news.html#post--d2l-api-le-(version)-(orgUnitId)-news-deleted-(newsItemId)-restore',
	},
	'learningEnvironment.getOrgUnitIdNewsUserUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/news/user/(userId)/: Retrieve a list of news items from an org unit for specific user. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-(orgUnitId)-news-user-(userId)-',
	},
	'learningEnvironment.getOrgUnitIdOverview': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/overview: Retrieve the content overview for a course offering. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-overview',
	},
	'learningEnvironment.getOrgUnitIdOverviewAttachment': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/overview/attachment: Retrieve the content overviewÃ¢Â€Â™s file attachment for a course offering. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-(orgUnitId)-overview-attachment',
	},
	'learningEnvironment.getOrgUnitIdQuizzes': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/: Retrieve the quizzes belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-',
	},
	'learningEnvironment.postOrgUnitIdQuizzes': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/quizzes/: Create a new quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#post--d2l-api-le-(version)-(orgUnitId)-quizzes-',
	},
	'learningEnvironment.deleteOrgUnitIdQuizzesQuizId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId): Delete a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#delete--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId): Retrieve a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)',
	},
	'learningEnvironment.putOrgUnitIdQuizzesQuizId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId): Update a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#put--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/access/: Retrieve a list of users with access to a specified quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-access-',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdAttempts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/attempts/: Retrieve a list of attempts for a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-attempts-',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdAttemptsAttemptId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/attempts/(attemptId): Retrieve a quiz attempt. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-attempts-(attemptId)',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdQuestions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/questions/: Retrieve all the questions in a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-questions-',
	},
	'learningEnvironment.postOrgUnitIdQuizzesQuizIdQuestions': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/questions/: Create a new question in a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#post--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-questions-',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdQuestionsQuestionId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/questions/(questionId): Retrieve a specific question in a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-questions-(questionId)',
	},
	'learningEnvironment.putOrgUnitIdQuizzesQuizIdQuestionsQuestionId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/questions/(questionId): Update an existing question in a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#put--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-questions-(questionId)',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdSpecialaccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/specialaccess/: Retrieve special access rules for users in a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-specialaccess-',
	},
	'learningEnvironment.deleteOrgUnitIdQuizzesQuizIdSpecialaccessUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/specialaccess/(userId): Delete a userÃ¢Â€Â™s special access rule for a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#delete--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-specialaccess-(userId)',
	},
	'learningEnvironment.getOrgUnitIdQuizzesQuizIdSpecialaccessUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/specialaccess/(userId): Retrieve a userÃ¢Â€Â™s special access rule for a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-specialaccess-(userId)',
	},
	'learningEnvironment.putOrgUnitIdQuizzesQuizIdSpecialaccessUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/quizzes/(quizId)/specialaccess/(userId): Create or update a userÃ¢Â€Â™s special access rule for a quiz. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#put--d2l-api-le-(version)-(orgUnitId)-quizzes-(quizId)-specialaccess-(userId)',
	},
	'learningEnvironment.getOrgUnitIdQuizzesCategories': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/categories/: Retrieve the quiz categories belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-categories-',
	},
	'learningEnvironment.postOrgUnitIdQuizzesCategories': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/quizzes/categories/: Create a new quiz category. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#post--d2l-api-le-(version)-(orgUnitId)-quizzes-categories-',
	},
	'learningEnvironment.deleteOrgUnitIdQuizzesCategoriesCategoryId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/quizzes/categories/(categoryId): Delete a quiz category. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#delete--d2l-api-le-(version)-(orgUnitId)-quizzes-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdQuizzesCategoriesCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/quizzes/categories/(categoryId): Retrieve a quiz category. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#get--d2l-api-le-(version)-(orgUnitId)-quizzes-categories-(categoryId)',
	},
	'learningEnvironment.putOrgUnitIdQuizzesCategoriesCategoryId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/quizzes/categories/(categoryId): Update a quiz category. Official reference: https://docs.valence.desire2learn.com/res/quiz.html#put--d2l-api-le-(version)-(orgUnitId)-quizzes-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdRubrics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/rubrics/: Retrieve rubrics for an object in an org unit. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#get--d2l-api-le-(version)-(orgUnitId)-rubrics-',
	},
	'learningEnvironment.postOrgUnitIdRubrics': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/rubrics/: Create a new rubric in an org unit. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#post--d2l-api-le-(version)-(orgUnitId)-rubrics-',
	},
	'learningEnvironment.deleteOrgUnitIdRubricsRubricId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/rubrics/(rubricId): Delete a rubric. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#delete--d2l-api-le-(version)-(orgUnitId)-rubrics-(rubricId)',
	},
	'learningEnvironment.getOrgUnitIdRubricsRubricId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/rubrics/(rubricId): Retrieve a single rubric. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#get--d2l-api-le-(version)-(orgUnitId)-rubrics-(rubricId)',
	},
	'learningEnvironment.putOrgUnitIdRubricsRubricId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/rubrics/(rubricId): Update an existing rubric, including its criteria groups, criteria, levels,\nand overall levels. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#put--d2l-api-le-(version)-(orgUnitId)-rubrics-(rubricId)',
	},
	'learningEnvironment.getOrgUnitIdRubricsAssociations': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/rubrics/associations/: Retrieve all rubrics and their associations for a specific org unit. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#get--d2l-api-le-(version)-(orgUnitId)-rubrics-associations-',
	},
	'learningEnvironment.getOrgUnitIdRubricsAssociationsActivityActivityTypeObjectId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/(orgUnitId)/rubrics/associations/activity/(activityType)/(objectId): Retrieve all rubric associations for a specific activity type and object ID. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#get--d2l-api-le-(version)-(orgUnitId)-rubrics-associations-activity-(activityType)-(objectId)',
		},
	'learningEnvironment.postOrgUnitIdRubricsAssociationsActivityActivityTypeObjectId':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/le/(version)/(orgUnitId)/rubrics/associations/activity/(activityType)/(objectId): Update rubric associations for a specific activity type and object ID. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#post--d2l-api-le-(version)-(orgUnitId)-rubrics-associations-activity-(activityType)-(objectId)',
		},
	'learningEnvironment.putOrgUnitIdRubricsInfoRubricId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/rubrics/info/(rubricId): Update a small set of basic properties on an existing rubric. Official reference: https://docs.valence.desire2learn.com/res/assessment.html#put--d2l-api-le-(version)-(orgUnitId)-rubrics-info-(rubricId)',
	},
	'learningEnvironment.getOrgUnitIdSurveys': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/: Retrieve the surveys belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-',
	},
	'learningEnvironment.postOrgUnitIdSurveys': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/surveys/: Create a new survey belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/survey.html#post--d2l-api-le-(version)-(orgUnitId)-surveys-',
	},
	'learningEnvironment.deleteOrgUnitIdSurveysSurveyId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId): Delete a survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#delete--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)',
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId): Retrieve a survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)',
	},
	'learningEnvironment.putOrgUnitIdSurveysSurveyId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId): Update a survey belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/survey.html#put--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)',
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/access/: Retrieve a list of users with access to a specified survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-access-',
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdAttempts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/attempts/: Retrieve a list of attempts for a survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-attempts-',
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdAttemptsAttemptId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/attempts/(attemptId): Retrieve a survey attempt. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-attempts-(attemptId)',
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdQuestions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/questions/: Retrieve all the questions in a survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-questions-',
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdSpecialaccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/specialaccess/: Retrieve special access rules in a survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-specialaccess-',
	},
	'learningEnvironment.deleteOrgUnitIdSurveysSurveyIdSpecialaccessUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/specialaccess/(userId): Remove survey special access for a user. Official reference: https://docs.valence.desire2learn.com/res/survey.html#delete--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-specialaccess-(userId)',
	},
	'learningEnvironment.getOrgUnitIdSurveysSurveyIdSpecialaccessUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/specialaccess/(userId): Retrieve a userÃ¢Â€Â™s special access rule for a survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-specialaccess-(userId)',
	},
	'learningEnvironment.putOrgUnitIdSurveysSurveyIdSpecialaccessUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/surveys/(surveyId)/specialaccess/(userId): Create or update a special access rule for a user and survey. Official reference: https://docs.valence.desire2learn.com/res/survey.html#put--d2l-api-le-(version)-(orgUnitId)-surveys-(surveyId)-specialaccess-(userId)',
	},
	'learningEnvironment.getOrgUnitIdSurveysCategories': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/categories/: Retrieve the survey categories belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-categories-',
	},
	'learningEnvironment.postOrgUnitIdSurveysCategories': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/(orgUnitId)/surveys/categories/: Create a new survey category. Official reference: https://docs.valence.desire2learn.com/res/survey.html#post--d2l-api-le-(version)-(orgUnitId)-surveys-categories-',
	},
	'learningEnvironment.deleteOrgUnitIdSurveysCategoriesCategoryId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/(orgUnitId)/surveys/categories/(categoryId): Delete the survey category belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/survey.html#delete--d2l-api-le-(version)-(orgUnitId)-surveys-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdSurveysCategoriesCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/surveys/categories/(categoryId): Retrieve the survey category belonging to an org unit. Official reference: https://docs.valence.desire2learn.com/res/survey.html#get--d2l-api-le-(version)-(orgUnitId)-surveys-categories-(categoryId)',
	},
	'learningEnvironment.putOrgUnitIdSurveysCategoriesCategoryId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/(orgUnitId)/surveys/categories/(categoryId): Update a survey category. Official reference: https://docs.valence.desire2learn.com/res/survey.html#put--d2l-api-le-(version)-(orgUnitId)-surveys-categories-(categoryId)',
	},
	'learningEnvironment.getOrgUnitIdUpdatesMyUpdates': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/(orgUnitId)/updates/myUpdates: Retrieve numbers of updates for the current user in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/updates.html#get--d2l-api-le-(version)-(orgUnitId)-updates-myUpdates',
	},
	'learningEnvironment.putAccommodations': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/accommodations/: Update a userÃ¢Â€Â™s accommodations in an org unit. Official reference: https://docs.valence.desire2learn.com/res/accommodations.html#put--d2l-api-le-(version)-accommodations-',
	},
	'learningEnvironment.getAccommodationsOrgUnitIdMyaccommodations': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/accommodations/(orgUnitId)/myaccommodations: Retrieve the userÃ¢Â€Â™s accommodations in an org unit. Official reference: https://docs.valence.desire2learn.com/res/accommodations.html#get--d2l-api-le-(version)-accommodations-(orgUnitId)-myaccommodations',
	},
	'learningEnvironment.getAccommodationsOrgUnitIdUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/accommodations/(orgUnitId)/users/(userId): Retrieve a userÃ¢Â€Â™s accommodations in an org unit. Official reference: https://docs.valence.desire2learn.com/res/accommodations.html#get--d2l-api-le-(version)-accommodations-(orgUnitId)-users-(userId)',
	},
	'learningEnvironment.getAuditingAuditeesAuditeeId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/auditing/auditees/(auditeeId): Retrieve information for an auditee. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-le-(version)-auditing-auditees-(auditeeId)',
	},
	'learningEnvironment.getAuditingAuditorsAuditorId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/auditing/auditors/(auditorId): Retrieve information for an auditor. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-le-(version)-auditing-auditors-(auditorId)',
	},
	'learningEnvironment.deleteAuditingAuditorsAuditorIdAuditees': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/auditing/auditors/(auditorId)/auditees/: Remove an auditee from the list of users that an auditor is auditing. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#delete--d2l-api-le-(version)-auditing-auditors-(auditorId)-auditees-',
	},
	'learningEnvironment.getAuditingAuditorsAuditorIdAuditees': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/auditing/auditors/(auditorId)/auditees/: Retrieve the list of users an auditor is auditing. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-le-(version)-auditing-auditors-(auditorId)-auditees-',
	},
	'learningEnvironment.postAuditingAuditorsAuditorIdAuditees': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/auditing/auditors/(auditorId)/auditees/: Add a user to the list of those an auditor is auditing. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#post--d2l-api-le-(version)-auditing-auditors-(auditorId)-auditees-',
	},
	'learningEnvironment.getCalendarEventsUserIdItemCounts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/calendar/events/(userId)/itemCounts: Retrieve a count of a userÃ¢Â€Â™s calendar events from across their active enrolments. Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-calendar-events-(userId)-itemCounts',
	},
	'learningEnvironment.getCalendarEventsMyEvents': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/calendar/events/myEvents/: Retrieve the calling userÃ¢Â€Â™s calendar events, within a number of org units (see query parameter) Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-calendar-events-myEvents-',
	},
	'learningEnvironment.getCalendarEventsMyEventsItemCounts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/calendar/events/myEvents/itemCounts/: Retrieve a count of calling userÃ¢Â€Â™s calendar events, within a number of org units (see query parameter). Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-calendar-events-myEvents-itemCounts-',
	},
	'learningEnvironment.getCalendarEventsMyEventsWithOccurrences': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/calendar/events/myEventsWithOccurrences/: Retrieve the calling userÃ¢Â€Â™s calendar events along with their occurrences,\nwithin a number of org units (see query parameter) Official reference: https://docs.valence.desire2learn.com/res/calendar.html#get--d2l-api-le-(version)-calendar-events-myEventsWithOccurrences-',
	},
	'learningEnvironment.getCcbLogs': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ccb/logs: Retrieve the list of logs for course copy jobs. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-le-(version)-ccb-logs',
	},
	'learningEnvironment.getContentCompletionsUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/completions/(userId)/: Retrieves the count of completed and required content topics for a user\nin each org unit in the csv. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-completions-(userId)-',
	},
	'learningEnvironment.getContentItemsUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/items/(userId): Retrieve the scheduled items for a particular user, within a number of org units. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-items-(userId)',
	},
	'learningEnvironment.getContentMyItems': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/myItems/: Retrieve the calling userÃ¢Â€Â™s scheduled items. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-myItems-',
	},
	'learningEnvironment.getContentMyItemsCompletions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/myItems/completions/: Retrieve the calling userÃ¢Â€Â™s completed scheduled items. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-myItems-completions-',
	},
	'learningEnvironment.getContentMyItemsCompletionsDue': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/myItems/completions/due/: Retrieve the calling userÃ¢Â€Â™s completed scheduled items that have a due date. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-myItems-completions-due-',
	},
	'learningEnvironment.getContentMyItemsDue': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/myItems/due/: Retrieve the calling userÃ¢Â€Â™s scheduled items still due. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-myItems-due-',
	},
	'learningEnvironment.getContentMyItemsDueItemCounts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/myItems/due/itemCounts/: Retrieve the quantities of the calling userÃ¢Â€Â™s scheduled items still due. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-myItems-due-itemCounts-',
	},
	'learningEnvironment.getContentMyItemsItemCounts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/content/myItems/itemCounts/: Retrieve the quantities of the calling userÃ¢Â€Â™s scheduled items, organized by org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-content-myItems-itemCounts-',
	},
	'learningEnvironment.getCpdCategoryCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/cpd/category/(categoryId): Retrieve a category. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#get--d2l-api-le-(version)-cpd-category-(categoryId)',
	},
	'learningEnvironment.getCpdMethodMethodId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/cpd/method/(methodId): Retrieve a method. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#get--d2l-api-le-(version)-cpd-method-(methodId)',
	},
	'learningEnvironment.getCpdQuestionQuestionId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/cpd/question/(questionId): Retrieve a question. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#get--d2l-api-le-(version)-cpd-question-(questionId)',
	},
	'learningEnvironment.getCpdRecordRecordId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/cpd/record/(recordId): Retrieve a CPD record. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#get--d2l-api-le-(version)-cpd-record-(recordId)',
	},
	'learningEnvironment.putCpdRecordRecordId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/cpd/record/(recordId): Update a CPD record. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#put--d2l-api-le-(version)-cpd-record-(recordId)',
	},
	'learningEnvironment.getCpdRecordRecordIdAttachmentAttachmentId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/cpd/record/(recordId)/attachment/(attachmentId): Retrieve an attachment from a CPD record. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#get--d2l-api-le-(version)-cpd-record-(recordId)-attachment-(attachmentId)',
	},
	'learningEnvironment.postCpdRecordRecordIdAttachmentUpload': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/cpd/record/(recordId)/attachment/upload: Initiate a resumable file upload request to upload attachments for a particular record. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#post--d2l-api-le-(version)-cpd-record-(recordId)-attachment-upload',
	},
	'learningEnvironment.deleteCpdRecordRecordIdAttachments': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/cpd/record/(recordId)/attachments: Delete attachments from a CPD record. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#delete--d2l-api-le-(version)-cpd-record-(recordId)-attachments',
	},
	'learningEnvironment.postCpdRecordRecordIdAttachments': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/cpd/record/(recordId)/attachments: Add attachments to a CPD record. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#post--d2l-api-le-(version)-cpd-record-(recordId)-attachments',
	},
	'learningEnvironment.getCpdRecordUserUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/cpd/record/user/(userId): Retrieve a paged list of CPD records for a user. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#get--d2l-api-le-(version)-cpd-record-user-(userId)',
	},
	'learningEnvironment.getCpdTargetProgressUserUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/cpd/target/progress/user/(userId): Retrieve a userÃ¢Â€Â™s overall progress and their current progress for each category. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#get--d2l-api-le-(version)-cpd-target-progress-user-(userId)',
	},
	'learningEnvironment.postCpdUserUserIdRecord': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/cpd/user/(userId)/record: Create a CPD record for a user. Official reference: https://docs.valence.desire2learn.com/res/cpd.html#post--d2l-api-le-(version)-cpd-user-(userId)-record',
	},
	'learningEnvironment.getDropboxOrgUnitsFeedback': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/dropbox/orgUnits/feedback/: Retrieve a list of org units for which the current user context has an\nassessment role on their dropbox folders (can see submissions and provide\nfeedback). Official reference: https://docs.valence.desire2learn.com/res/dropbox.html#get--d2l-api-le-(version)-dropbox-orgUnits-feedback-',
	},
	'learningEnvironment.getGradesCourseCompletionUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/grades/courseCompletion/(userId)/: Retrieve all the course completion records for a user. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-grades-courseCompletion-(userId)-',
	},
	'learningEnvironment.getGradesFinalValuesMyGradeValues': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/grades/final/values/myGradeValues/: Retrieve a list of final grade values for the current user context across a\nnumber of org units. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-grades-final-values-myGradeValues-',
	},
	'learningEnvironment.getGradesValuesUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/grades/values/(userId): Retrieve all the grade values in bulk for a particular user. Official reference: https://docs.valence.desire2learn.com/res/grade.html#get--d2l-api-le-(version)-grades-values-(userId)',
	},
	'learningEnvironment.postImportOrgUnitIdCopy': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/import/(orgUnitId)/copy/: Queue up a new course copy job request. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-le-(version)-import-(orgUnitId)-copy-',
	},
	'learningEnvironment.getImportOrgUnitIdCopyJobToken': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/import/(orgUnitId)/copy/(jobToken): Retrieve the status of a queued course copy job request. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-le-(version)-import-(orgUnitId)-copy-(jobToken)',
	},
	'learningEnvironment.postImportOrgUnitIdImports': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/import/(orgUnitId)/imports/: Create a new course import job request. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-le-(version)-import-(orgUnitId)-imports-',
	},
	'learningEnvironment.getImportOrgUnitIdImportsJobToken': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/import/(orgUnitId)/imports/(jobToken): Retrieve the status of a queued course import job request. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-le-(version)-import-(orgUnitId)-imports-(jobToken)',
	},
	'learningEnvironment.getImportOrgUnitidImportsJobTokenLogs': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/import/(orgUnitid)/imports/(jobToken)/logs/: Retrieve the logs for a course import job. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-le-(version)-import-(orgUnitid)-imports-(jobToken)-logs-',
	},
	'learningEnvironment.getLoAlignmentsOutcomeOutcomeId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lo/alignments/outcome/(outcomeId): Retrieve the org units that contain alignments to a given outcome. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-lo-alignments-outcome-(outcomeId)',
	},
	'learningEnvironment.getLoAlignmentsOutcomeSetOutcomeSetId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lo/alignments/outcomeSet/(outcomeSetId): Retrieve the org units that contain alignments to a given outcome set. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-lo-alignments-outcomeSet-(outcomeSetId)',
	},
	'learningEnvironment.postLoBulkExport': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lo/bulkExport: Retrieve organization level outcome sets in export format. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#post--d2l-api-le-(version)-lo-bulkExport',
	},
	'learningEnvironment.postLoBulkImport': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lo/bulkImport: Imports organization level outcome sets. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#post--d2l-api-le-(version)-lo-bulkImport',
	},
	'learningEnvironment.getLoOutcomeScales': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lo/outcomeScales/: Retrieve all achievement scales defined for the organization. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-lo-outcomeScales-',
	},
	'learningEnvironment.postLoOutcomeScales': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lo/outcomeScales/: Create a new achievement scale. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#post--d2l-api-le-(version)-lo-outcomeScales-',
	},
	'learningEnvironment.deleteLoOutcomeScalesScaleId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lo/outcomeScales/(scaleId): Delete a particular achievement scale. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#delete--d2l-api-le-(version)-lo-outcomeScales-(scaleId)',
	},
	'learningEnvironment.getLoOutcomeScalesScaleId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lo/outcomeScales/(scaleId): Retrieve a specific achievement scale. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-lo-outcomeScales-(scaleId)',
	},
	'learningEnvironment.putLoOutcomeScalesScaleId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/lo/outcomeScales/(scaleId): Update the name or achievement threshold of a particular achievement scale. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#put--d2l-api-le-(version)-lo-outcomeScales-(scaleId)',
	},
	'learningEnvironment.putLoOutcomeScalesScaleIdLevelId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/lo/outcomeScales/(scaleId)/(levelId): Update the name or colour of a particular level of an achievement scale. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#put--d2l-api-le-(version)-lo-outcomeScales-(scaleId)-(levelId)',
	},
	'learningEnvironment.getLoOutcomeSets': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lo/outcomeSets/: Retrieve all organization level outcome sets. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-lo-outcomeSets-',
	},
	'learningEnvironment.postLoOutcomeSets': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lo/outcomeSets/: Create a new organization level outcome set. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#post--d2l-api-le-(version)-lo-outcomeSets-',
	},
	'learningEnvironment.deleteLoOutcomeSetsOutcomeSetId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lo/outcomeSets/(outcomeSetId): Delete a particular organization level outcome set. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#delete--d2l-api-le-(version)-lo-outcomeSets-(outcomeSetId)',
	},
	'learningEnvironment.getLoOutcomeSetsOutcomeSetId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lo/outcomeSets/(outcomeSetId): Retrieve a specific organization level outcome set. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#get--d2l-api-le-(version)-lo-outcomeSets-(outcomeSetId)',
	},
	'learningEnvironment.putLoOutcomeSetsOutcomeSetId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/lo/outcomeSets/(outcomeSetId): Update a particular organization level outcome set. Official reference: https://docs.valence.desire2learn.com/res/outcomes.html#put--d2l-api-le-(version)-lo-outcomeSets-(outcomeSetId)',
	},
	'learningEnvironment.deleteLockerMyLockerPath': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/locker/myLocker/(path): Delete a file or folder from the current userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#delete--d2l-api-le-(version)-locker-myLocker-(path)',
	},
	'learningEnvironment.getLockerMyLockerPath': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/locker/myLocker/(path): Retrieve a specific object from the current userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#get--d2l-api-le-(version)-locker-myLocker-(path)',
	},
	'learningEnvironment.postLockerMyLockerPath': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/locker/myLocker/(path): Add a new file or folder to the current userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#post--d2l-api-le-(version)-locker-myLocker-(path)',
	},
	'learningEnvironment.putLockerMyLockerPath': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/locker/myLocker/(path): Rename a folder in the current userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#put--d2l-api-le-(version)-locker-myLocker-(path)',
	},
	'learningEnvironment.deleteLockerUserUserIdPath': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/locker/user/(userId)/(path): Delete a file or folder from the provided userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#delete--d2l-api-le-(version)-locker-user-(userId)-(path)',
	},
	'learningEnvironment.getLockerUserUserIdPath': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/locker/user/(userId)/(path): Retrieve a specific object from a provided userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#get--d2l-api-le-(version)-locker-user-(userId)-(path)',
	},
	'learningEnvironment.postLockerUserUserIdPath': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/locker/user/(userId)/(path): Add a new file or folder to the provided userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#post--d2l-api-le-(version)-locker-user-(userId)-(path)',
	},
	'learningEnvironment.putLockerUserUserIdPath': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/locker/user/(userId)/(path): Rename a folder in the provided userÃ¢Â€Â™s locker. Official reference: https://docs.valence.desire2learn.com/res/locker.html#put--d2l-api-le-(version)-locker-user-(userId)-(path)',
	},
	'learningEnvironment.deleteLtiLinkLtiLinkId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lti/link/(ltiLinkId): Remove an LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#delete--d2l-api-le-(version)-lti-link-(ltiLinkId)',
	},
	'learningEnvironment.putLtiLinkLtiLinkId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/lti/link/(ltiLinkId): Update the information associated with a registered LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#put--d2l-api-le-(version)-lti-link-(ltiLinkId)',
	},
	'learningEnvironment.postLtiLinkOrgUnitId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lti/link/(orgUnitId): Register a new LTI link for an org unit. Official reference: https://docs.valence.desire2learn.com/res/lti.html#post--d2l-api-le-(version)-lti-link-(orgUnitId)',
	},
	'learningEnvironment.getLtiLinkOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lti/link/(orgUnitId)/: Retrieve the information for all LTI links registered for an org unit. Official reference: https://docs.valence.desire2learn.com/res/lti.html#get--d2l-api-le-(version)-lti-link-(orgUnitId)-',
	},
	'learningEnvironment.deleteLtiLinkOrgUnitIdLinkIdSharing': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lti/link/(orgUnitId)/(linkId)/sharing/: Delete all sharing rules for a particular LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#delete--d2l-api-le-(version)-lti-link-(orgUnitId)-(linkId)-sharing-',
	},
	'learningEnvironment.getLtiLinkOrgUnitIdLinkIdSharing': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lti/link/(orgUnitId)/(linkId)/sharing/: Retrieve the sharing rules for a particular LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#get--d2l-api-le-(version)-lti-link-(orgUnitId)-(linkId)-sharing-',
	},
	'learningEnvironment.postLtiLinkOrgUnitIdLinkIdSharing': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lti/link/(orgUnitId)/(linkId)/sharing/: Add a sharing rule for a particular LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#post--d2l-api-le-(version)-lti-link-(orgUnitId)-(linkId)-sharing-',
	},
	'learningEnvironment.deleteLtiLinkOrgUnitIdLinkIdSharingSharingOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lti/link/(orgUnitId)/(linkId)/sharing/(sharingOrgUnitId): Delete the sharing rule for a particular org unit and LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#delete--d2l-api-le-(version)-lti-link-(orgUnitId)-(linkId)-sharing-(sharingOrgUnitId)',
	},
	'learningEnvironment.putLtiLinkOrgUnitIdLinkIdSharingSharingOrgUnitId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/lti/link/(orgUnitId)/(linkId)/sharing/(sharingOrgUnitId): Update the sharing rule for a particular org unit and LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#put--d2l-api-le-(version)-lti-link-(orgUnitId)-(linkId)-sharing-(sharingOrgUnitId)',
	},
	'learningEnvironment.getLtiLinkOrgUnitIdLtiLinkId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lti/link/(orgUnitId)/(ltiLinkId): Retrieve the information for a particular LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#get--d2l-api-le-(version)-lti-link-(orgUnitId)-(ltiLinkId)',
	},
	'learningEnvironment.postLtiQuicklinkOrgUnitIdLtiLinkId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lti/quicklink/(orgUnitId)/(ltiLinkId): Build a new quicklink around an existing LTI link. Official reference: https://docs.valence.desire2learn.com/res/lti.html#post--d2l-api-le-(version)-lti-quicklink-(orgUnitId)-(ltiLinkId)',
	},
	'learningEnvironment.postLtiTpOrgUnitId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lti/tp/(orgUnitId): Register a new LTI tool provider for an org unit. Official reference: https://docs.valence.desire2learn.com/res/lti.html#post--d2l-api-le-(version)-lti-tp-(orgUnitId)',
	},
	'learningEnvironment.getLtiTpOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lti/tp/(orgUnitId)/: Retrieve the information for all LTI tool providers registered for an org unit. Official reference: https://docs.valence.desire2learn.com/res/lti.html#get--d2l-api-le-(version)-lti-tp-(orgUnitId)-',
	},
	'learningEnvironment.getLtiTpOrgUnitIdTpId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lti/tp/(orgUnitId)/(tpId): Retrieve the information for a particular LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#get--d2l-api-le-(version)-lti-tp-(orgUnitId)-(tpId)',
	},
	'learningEnvironment.deleteLtiTpOrgUnitIdTpIdSharing': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lti/tp/(orgUnitId)/(tpId)/sharing/: Delete all sharing rules for a particular LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#delete--d2l-api-le-(version)-lti-tp-(orgUnitId)-(tpId)-sharing-',
	},
	'learningEnvironment.getLtiTpOrgUnitIdTpIdSharing': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/lti/tp/(orgUnitId)/(tpId)/sharing/: Retrieve the sharing rules for a particular LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#get--d2l-api-le-(version)-lti-tp-(orgUnitId)-(tpId)-sharing-',
	},
	'learningEnvironment.postLtiTpOrgUnitIdTpIdSharing': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/lti/tp/(orgUnitId)/(tpId)/sharing/: Add a sharing rule for a particular LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#post--d2l-api-le-(version)-lti-tp-(orgUnitId)-(tpId)-sharing-',
	},
	'learningEnvironment.deleteLtiTpOrgUnitIdTpIdSharingSharingOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lti/tp/(orgUnitId)/(tpId)/sharing/(sharingOrgUnitId): Delete the sharing rule for a particular org unit and LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#delete--d2l-api-le-(version)-lti-tp-(orgUnitId)-(tpId)-sharing-(sharingOrgUnitId)',
	},
	'learningEnvironment.putLtiTpOrgUnitIdTpIdSharingSharingOrgUnitId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/lti/tp/(orgUnitId)/(tpId)/sharing/(sharingOrgUnitId): Update the sharing rule for a particular org unit and LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#put--d2l-api-le-(version)-lti-tp-(orgUnitId)-(tpId)-sharing-(sharingOrgUnitId)',
	},
	'learningEnvironment.deleteLtiTpTpId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/lti/tp/(tpId): Remove the registration for an LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#delete--d2l-api-le-(version)-lti-tp-(tpId)',
	},
	'learningEnvironment.putLtiTpTpId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/lti/tp/(tpId): Update the information associated with a registered LTI tool provider. Official reference: https://docs.valence.desire2learn.com/res/lti.html#put--d2l-api-le-(version)-lti-tp-(tpId)',
	},
	'learningEnvironment.getLtiadvantageDeployment': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/deployment/: Retrieve the information for all LTI deployments for the organization. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-deployment-',
	},
	'learningEnvironment.postLtiadvantageDeployment': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/deployment/: Create a new LTI tool deployment for the organization. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-deployment-',
	},
	'learningEnvironment.deleteLtiadvantageDeploymentDeploymentId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId): Remove an LTI Advantage deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#delete--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)',
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId): Retrieve the information for a particular LTI tool deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)',
	},
	'learningEnvironment.putLtiadvantageDeploymentDeploymentId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId): Update the information associated with an LTI tool deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#put--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)',
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentIdAssetprocessors': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId)/assetprocessors/: Retrieve all asset processors for a given deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)-assetprocessors-',
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentIdLinksSummaries': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId)/links/summaries/: Retrieve the summaries for all LTI Advantage links for the deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)-links-summaries-',
	},
	'learningEnvironment.deleteLtiadvantageDeploymentDeploymentIdSharing': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId)/sharing/: Delete all sharing rules for a particular LTI deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#delete--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)-sharing-',
	},
	'learningEnvironment.getLtiadvantageDeploymentDeploymentIdSharing': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId)/sharing/: Retrieve the sharing rules for a particular LTI deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)-sharing-',
	},
	'learningEnvironment.postLtiadvantageDeploymentDeploymentIdSharing': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId)/sharing/: Add a sharing rule for a particular LTI deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)-sharing-',
	},
	'learningEnvironment.deleteLtiadvantageDeploymentDeploymentIdSharingSharingOrgUnitId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId)/sharing/(sharingOrgUnitId): Delete the sharing rule for a particular org unit and LTI deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#delete--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)-sharing-(sharingOrgUnitId)',
		},
	'learningEnvironment.putLtiadvantageDeploymentDeploymentIdSharingSharingOrgUnitId':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/ltiadvantage/deployment/(deploymentId)/sharing/(sharingOrgUnitId): Update the sharing rule for a particular org unit and LTI tool deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#put--d2l-api-le-(version)-ltiadvantage-deployment-(deploymentId)-sharing-(sharingOrgUnitId)',
		},
	'learningEnvironment.getLtiadvantageLinksOrganization': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/links/organization/: Retrieve the information for all LTI Advantage links for the organization. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-links-organization-',
	},
	'learningEnvironment.postLtiadvantageLinksOrganization': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/links/organization/: Create a new LTI Advantage link for the organization. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-links-organization-',
	},
	'learningEnvironment.deleteLtiadvantageLinksOrganizationLinkId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/ltiadvantage/links/organization/(linkId): Remove an LTI Advantage organization link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#delete--d2l-api-le-(version)-ltiadvantage-links-organization-(linkId)',
	},
	'learningEnvironment.getLtiadvantageLinksOrganizationLinkId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/links/organization/(linkId): Retrieve the information for a particular LTI Advantage organization link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-links-organization-(linkId)',
	},
	'learningEnvironment.putLtiadvantageLinksOrganizationLinkId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/ltiadvantage/links/organization/(linkId): Update the information associated with an LTI Advantage link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#put--d2l-api-le-(version)-ltiadvantage-links-organization-(linkId)',
	},
	'learningEnvironment.getLtiadvantageLinksOrgunitOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/links/orgunit/(orgUnitId)/: Retrieve the information for all LTI Advantage links within the scope of an org unit. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-links-orgunit-(orgUnitId)-',
	},
	'learningEnvironment.postLtiadvantageLinksOrgunitOrgUnitId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/links/orgunit/(orgUnitId)/: Create a new LTI Advantage link for an org unit. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-links-orgunit-(orgUnitId)-',
	},
	'learningEnvironment.deleteLtiadvantageLinksOrgunitOrgUnitIdLinkId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/ltiadvantage/links/orgunit/(orgUnitId)/(linkId): Remove an LTI Advantage link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#delete--d2l-api-le-(version)-ltiadvantage-links-orgunit-(orgUnitId)-(linkId)',
	},
	'learningEnvironment.getLtiadvantageLinksOrgunitOrgUnitIdLinkId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/links/orgunit/(orgUnitId)/(linkId): Retrieve the information for a particular LTI Advantage link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-links-orgunit-(orgUnitId)-(linkId)',
	},
	'learningEnvironment.putLtiadvantageLinksOrgunitOrgUnitIdLinkId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/ltiadvantage/links/orgunit/(orgUnitId)/(linkId): Update the information associated with an LTI Advantage link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#put--d2l-api-le-(version)-ltiadvantage-links-orgunit-(orgUnitId)-(linkId)',
	},
	'learningEnvironment.getLtiadvantageMigrationJobs': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/migration/jobs/: Retrieve the status of all LTI migration jobs. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-migration-jobs-',
	},
	'learningEnvironment.postLtiadvantageMigrationJobs': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/migration/jobs/: Create a migration job to attempt migration of all legacy LTI links to LTI Advantage links\nfor an org unit. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-migration-jobs-',
	},
	'learningEnvironment.getLtiadvantageMigrationJobsJobId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/migration/jobs/(jobId): Retrieve the status of an LTI migration job. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-migration-jobs-(jobId)',
	},
	'learningEnvironment.postLtiadvantageMigrationLinksLinkId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/migration/links/(linkId): Migrate a legacy LTI link to an LTI Advantage link. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-migration-links-(linkId)',
	},
	'learningEnvironment.deleteLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/le/(version)/ltiadvantage/orgunit/(orgUnitId)/assetprocessor/(assetProcessorId): Delete a particular asset processor. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#delete--d2l-api-le-(version)-ltiadvantage-orgunit-(orgUnitId)-assetprocessor-(assetProcessorId)',
		},
	'learningEnvironment.getLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/le/(version)/ltiadvantage/orgunit/(orgUnitId)/assetprocessor/(assetProcessorId): Retrieve the information for a particular asset processor. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-orgunit-(orgUnitId)-assetprocessor-(assetProcessorId)',
		},
	'learningEnvironment.putLtiadvantageOrgunitOrgUnitIdAssetprocessorAssetProcessorIdStatus':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/le/(version)/ltiadvantage/orgunit/(orgUnitId)/assetprocessor/(assetProcessorId)/status: Update the status of a particular asset processor. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#put--d2l-api-le-(version)-ltiadvantage-orgunit-(orgUnitId)-assetprocessor-(assetProcessorId)-status',
		},
	'learningEnvironment.getLtiadvantageOrgunitOrgUnitIdAssetprocessors': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/orgunit/(orgUnitId)/assetprocessors/: Retrieve all asset processors for a given deployment. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-orgunit-(orgUnitId)-assetprocessors-',
	},
	'learningEnvironment.getLtiadvantageRegistration': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/registration/: Retrieve the information for all LTI registrations for the organization. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-registration-',
	},
	'learningEnvironment.postLtiadvantageRegistration': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/registration/: Register a new LTI tool for the organization. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-registration-',
	},
	'learningEnvironment.deleteLtiadvantageRegistrationClientId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/ltiadvantage/registration/(clientId): Remove an LTI Advantage registration. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#delete--d2l-api-le-(version)-ltiadvantage-registration-(clientId)',
	},
	'learningEnvironment.getLtiadvantageRegistrationClientId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/registration/(clientId): Retrieve the information for a particular LTI registration. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-registration-(clientId)',
	},
	'learningEnvironment.putLtiadvantageRegistrationClientId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/ltiadvantage/registration/(clientId): Update the information associated with an LTI tool registration. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#put--d2l-api-le-(version)-ltiadvantage-registration-(clientId)',
	},
	'learningEnvironment.getLtiadvantageRegistrationClientIdLegacydomains': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/ltiadvantage/registration/(clientId)/legacydomains/: Retrieve the domain names for migration-routing in provided LTI tool registration. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#get--d2l-api-le-(version)-ltiadvantage-registration-(clientId)-legacydomains-',
	},
	'learningEnvironment.postLtiadvantageRegistrationClientIdLegacydomains': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/ltiadvantage/registration/(clientId)/legacydomains/: Add a domain name to be used for migration-routing for a provided LTI tool. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#post--d2l-api-le-(version)-ltiadvantage-registration-(clientId)-legacydomains-',
	},
	'learningEnvironment.putLtiadvantageRegistrationClientIdLegacydomains': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/ltiadvantage/registration/(clientId)/legacydomains/: Update the domain names to be used for migration routing for a provided LTI tool. Official reference: https://docs.valence.desire2learn.com/res/ltiadvantage.html#put--d2l-api-le-(version)-ltiadvantage-registration-(clientId)-legacydomains-',
	},
	'learningEnvironment.getNewsUserUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/news/user/(userId)/: Retrieve a list of news items for specific user. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-le-(version)-news-user-(userId)-',
	},
	'learningEnvironment.getOverdueItems': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/overdueItems/: Retrieve the overdue items for a particular user in a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-overdueItems-',
	},
	'learningEnvironment.getOverdueItemsMyItems': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/overdueItems/myItems: Retrieves the calling userÃ¢Â€Â™s overdue items, within a number of org units. Official reference: https://docs.valence.desire2learn.com/res/content.html#get--d2l-api-le-(version)-overdueItems-myItems',
	},
	'learningEnvironment.getUpdatesMyUpdates': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/updates/myUpdates/: Retrieve numbers of updates for the current user across several org units. Official reference: https://docs.valence.desire2learn.com/res/updates.html#get--d2l-api-le-(version)-updates-myUpdates-',
	},
	'learningEnvironment.getUserIdentifiersTypes': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/user_identifiers/types/: Retrieve the list of external identifier type names. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-le-(version)-user_identifiers-types-',
	},
	'learningEnvironment.postUserIdentifiersTypes': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/(version)/user_identifiers/types/: Create an external identifier type. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-le-(version)-user_identifiers-types-',
	},
	'learningEnvironment.deleteUserIdentifiersTypesType': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/le/(version)/user_identifiers/types/(type): Delete an external identifier type. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-le-(version)-user_identifiers-types-(type)',
	},
	'learningEnvironment.putUserIdentifiersTypesType': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/user_identifiers/types/(type): Rename an external identifier type without changing its associated values. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-le-(version)-user_identifiers-types-(type)',
	},
	'learningEnvironment.putUserIdentifiersUsersUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/le/(version)/user_identifiers/users/(userId): Set an external identifier value for a user and type. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-le-(version)-user_identifiers-users-(userId)',
	},
	'learningEnvironment.getUserIdentifiersUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/le/(version)/user_identifiers/users/(userId)/: Retrieve the list of external identifiers for the specified user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-le-(version)-user_identifiers-users-(userId)-',
	},
	'learningEnvironment.postIpsisUploadSourceSystemIdSignedurl': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/le/{version}/ipsis/upload/{sourceSystemId}/signedurl: Generate a signed URL for uploading a batch data file to IPSIS. Official reference: https://docs.valence.desire2learn.com/res/ipsis.html#post--d2l-api-le-version-ipsis-upload-sourceSystemId-signedurl',
	},
	'learningObjectRepository.postRepositoryIdUpload': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lr/(version)/(repositoryId)/upload: Initiate a resumable file upload request to publish a SCORM zip package. Official reference: https://docs.valence.desire2learn.com/res/lor.html#post--d2l-api-lr-(version)-(repositoryId)-upload',
	},
	'learningObjectRepository.postRepositoryIdUploadPublish': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lr/(version)/(repositoryId)/upload/publish: Publish a SCORM package uploaded using the resumable upload process as a new\nlearning object, using the default publishing options. Official reference: https://docs.valence.desire2learn.com/res/lor.html#post--d2l-api-lr-(version)-(repositoryId)-upload-publish',
	},
	'learningObjectRepository.putRepositoryIdUploadPublishObjectId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lr/(version)/(repositoryId)/upload/publish/(objectId): Publish a SCORM package uploaded using the resumable upload process to\noverwrite an existing learning object, using the default publishing options. Official reference: https://docs.valence.desire2learn.com/res/lor.html#put--d2l-api-lr-(version)-(repositoryId)-upload-publish-(objectId)',
	},
	'learningObjectRepository.putObjects': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lr/(version)/objects/: Publish a SCORM package as a new learning object, using the default\npublishing options. Official reference: https://docs.valence.desire2learn.com/res/lor.html#put--d2l-api-lr-(version)-objects-',
	},
	'learningObjectRepository.postObjectsObjectId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lr/(version)/objects/(objectId)/: Publish a SCORM package to overwrite an existing learning object, using the\ndefault publishing options. Official reference: https://docs.valence.desire2learn.com/res/lor.html#post--d2l-api-lr-(version)-objects-(objectId)-',
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionDownload': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/(objectVersion)/download/: Download a package containing a particular version of a learning object from\na local repository. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-(objectVersion)-download-',
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionDownloadfile': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/(objectVersion)/downloadfile/: Download the content file contained in a particular version of a file\nlearning object from a local repository. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-(objectVersion)-downloadfile-',
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionLink': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/(objectVersion)/link/: Retrieve a URL that a client can use to view a particular version of a\nlearning object. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-(objectVersion)-link-',
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionMetadata': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/(objectVersion)/metadata/: Retrieve the metadata for a particular version of a learning object. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-(objectVersion)-metadata-',
	},
	'learningObjectRepository.getObjectsObjectIdObjectVersionProperties': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/(objectVersion)/properties/: Retrieve the properties for a particular version of a learning object. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-(objectVersion)-properties-',
	},
	'learningObjectRepository.postObjectsObjectIdObjectVersionProperties': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lr/(version)/objects/(objectId)/(objectVersion)/properties/: Update the properties for a particular version of a learning object in a\nlocal repository. Official reference: https://docs.valence.desire2learn.com/res/lor.html#post--d2l-api-lr-(version)-objects-(objectId)-(objectVersion)-properties-',
	},
	'learningObjectRepository.postObjectsObjectIdDelete': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lr/(version)/objects/(objectId)/delete/: Delete all versions of a learning object. Official reference: https://docs.valence.desire2learn.com/res/lor.html#post--d2l-api-lr-(version)-objects-(objectId)-delete-',
	},
	'learningObjectRepository.getObjectsObjectIdDownload': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/download/: Download a package containing the most recent version of a learning object\nfrom a local repository. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-download-',
	},
	'learningObjectRepository.getObjectsObjectIdDownloadfile': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/downloadfile/: Download the file for the most recent version of an Asset-type learning\nobject from a local repository. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-downloadfile-',
	},
	'learningObjectRepository.getObjectsObjectIdLink': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/link/: Retrieve a URL that a client can use to view the most recent version of a\nlearning object. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-link-',
	},
	'learningObjectRepository.getObjectsObjectIdProperties': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/(objectId)/properties/: Retrieve the basic properties for the latest version of a learning object. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-(objectId)-properties-',
	},
	'learningObjectRepository.postObjectsObjectIdProperties': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lr/(version)/objects/(objectId)/properties/: Update the properties for the most recent version of a learning object in a\nlocal repository. Official reference: https://docs.valence.desire2learn.com/res/lor.html#post--d2l-api-lr-(version)-objects-(objectId)-properties-',
	},
	'learningObjectRepository.getObjectsSearch': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/objects/search/: Retrieve the results for a query-based search across one or more repositories. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-objects-search-',
	},
	'learningObjectRepository.getRepositoriesType': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/repositories/(type)/: Retrieve a list of all repositories of a provided type, that have the\nprovided trust permissions. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-repositories-(type)-',
	},
	'learningObjectRepository.getRepositoriesAll': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/repositories/all/: Retrieve all repositories with the Search trust permission. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-repositories-all-',
	},
	'learningObjectRepository.getRepositoryRepositoryIdListorgUnittrusts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lr/(version)/repository/(repositoryId)/listorgUnittrusts/: Retrieve a list of all the trust permissions tied to provided roles within provided org units. Official reference: https://docs.valence.desire2learn.com/res/lor.html#get--d2l-api-lr-(version)-repository-(repositoryId)-listorgUnittrusts-',
	},
	'learningPlatform.postGaeVersionLinkuser': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/gae/(version)/linkuser: Link a user to a Google Apps user account. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-gae-(version)-linkuser',
	},
	'learningPlatform.getOrgUnitIdConditionalReleaseConditionsTargetTypeTargetId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/lp/(version)/(orgUnitId)/conditionalRelease/conditions/(targetType)/(targetId): Retrieve the conditions on a target in the org unit. Official reference: https://docs.valence.desire2learn.com/res/releaseconditions.html#get--d2l-api-lp-(version)-(orgUnitId)-conditionalRelease-conditions-(targetType)-(targetId)',
		},
	'learningPlatform.putOrgUnitIdConditionalReleaseConditionsTargetTypeTargetId':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/lp/(version)/(orgUnitId)/conditionalRelease/conditions/(targetType)/(targetId): Replace the conditions on a target in the org unit. Official reference: https://docs.valence.desire2learn.com/res/releaseconditions.html#put--d2l-api-lp-(version)-(orgUnitId)-conditionalRelease-conditions-(targetType)-(targetId)',
		},
	'learningPlatform.getOrgUnitIdGroupcategories': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/: Retrieve a list of all the group categories for the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-',
	},
	'learningPlatform.postOrgUnitIdGroupcategories': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/groupcategories/: Create a new group category for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#post--d2l-api-lp-(version)-(orgUnitId)-groupcategories-',
	},
	'learningPlatform.deleteOrgUnitIdGroupcategoriesGroupCategoryId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId): Delete a particular group category from an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#delete--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)',
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId): Retrieve a particular group category for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)',
	},
	'learningPlatform.putOrgUnitIdGroupcategoriesGroupCategoryId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId): Update a particular group category for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#put--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)',
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroups': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/: Retrieve a list of all the groups in a particular group category for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-',
	},
	'learningPlatform.postOrgUnitIdGroupcategoriesGroupCategoryIdGroups': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/: Create a new group for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#post--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-',
	},
	'learningPlatform.deleteOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/(groupId): Delete a particular group from an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#delete--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-(groupId)',
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/(groupId): Retrieve a particular group in an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-(groupId)',
	},
	'learningPlatform.putOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/(groupId): Update a particular group for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#put--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-(groupId)',
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollments':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/(groupId)/enrollments: Retrieve a list of all the users enrolled in a particular group in an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-(groupId)-enrollments',
		},
	'learningPlatform.postOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollments':
		{
			riskLevel: 'write',
			description:
				'POST /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/(groupId)/enrollments/: Enroll a user in a group. Official reference: https://docs.valence.desire2learn.com/res/groups.html#post--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-(groupId)-enrollments-',
		},
	'learningPlatform.deleteOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdEnrollmentsUserId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/(groupId)/enrollments/(userId): Remove a particular user from a group. Official reference: https://docs.valence.desire2learn.com/res/groups.html#delete--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-(groupId)-enrollments-(userId)',
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsGroupIdNoenrollments':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/(groupId)/noenrollments: Retrieve a group for a particular group in an org unit without enrollment data. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-(groupId)-noenrollments',
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsEnrollments':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/enrollments: Retrieve a list of all the users enrolled in a particular group category for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-enrollments',
		},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdGroupsPaged': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/groups/paged: Retrieve a list of all the groups within a particular group category for an org unit with none of the enrollment data. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-groups-paged',
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdLocker': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/locker: Determine if a locker has been set up for a group category within an org unit. Official reference: https://docs.valence.desire2learn.com/res/locker.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-locker',
	},
	'learningPlatform.postOrgUnitIdGroupcategoriesGroupCategoryIdLocker': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/locker: Set up the locker for a group category within an org unit. Official reference: https://docs.valence.desire2learn.com/res/locker.html#post--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-locker',
	},
	'learningPlatform.getOrgUnitIdGroupcategoriesGroupCategoryIdStatus': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groupcategories/(groupCategoryId)/status: Retrieve the creation job status of a particular group category for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groupcategories-(groupCategoryId)-status',
	},
	'learningPlatform.getOrgUnitIdGroups': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groups/: Retrieve a page of groups in which the calling user is enrolled for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groups-',
	},
	'learningPlatform.getOrgUnitIdGroupsSelfEnrollmentAvailable': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/groups/selfEnrollmentAvailable: Retrieve a list of all the groups within a course offering that a user would be able to self-enroll themselves into. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-groups-selfEnrollmentAvailable',
	},
	'learningPlatform.getOrgUnitIdManagefiles': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/managefiles/: Retrieve the direct child contents (folders and files) of an org unit path. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-(orgUnitId)-managefiles-',
	},
	'learningPlatform.deleteOrgUnitIdManagefilesFile': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/(orgUnitId)/managefiles/file: Delete a course file. Official reference: https://docs.valence.desire2learn.com/res/course.html#delete--d2l-api-lp-(version)-(orgUnitId)-managefiles-file',
	},
	'learningPlatform.getOrgUnitIdManagefilesFile': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/managefiles/file: Retrieve a course file specified by the path. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-(orgUnitId)-managefiles-file',
	},
	'learningPlatform.postOrgUnitIdManagefilesFileSave': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/managefiles/file/save: Saves an uploaded course file to specified path. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-(orgUnitId)-managefiles-file-save',
	},
	'learningPlatform.postOrgUnitIdManagefilesFileUpload': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/managefiles/file/upload: Initiate a resumable file upload request for a course file. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-(orgUnitId)-managefiles-file-upload',
	},
	'learningPlatform.deleteOrgUnitIdManagefilesFolder': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/(orgUnitId)/managefiles/folder: Delete a course folder. Official reference: https://docs.valence.desire2learn.com/res/course.html#delete--d2l-api-lp-(version)-(orgUnitId)-managefiles-folder',
	},
	'learningPlatform.postOrgUnitIdManagefilesFolder': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/managefiles/folder: Create a folder in course. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-(orgUnitId)-managefiles-folder',
	},
	'learningPlatform.getOrgUnitIdRoles': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/roles/: Retrieve a list of all the enrolled user roles the calling user can view in an org unit. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-(orgUnitId)-roles-',
	},
	'learningPlatform.getOrgUnitIdSections': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/: Retrieve all the sections for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-',
	},
	'learningPlatform.postOrgUnitIdSections': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/sections/: Create a new section in a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#post--d2l-api-lp-(version)-(orgUnitId)-sections-',
	},
	'learningPlatform.putOrgUnitIdSections': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/sections/: Initialize the settings for all sections in a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#put--d2l-api-lp-(version)-(orgUnitId)-sections-',
	},
	'learningPlatform.deleteOrgUnitIdSectionsSectionId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/(orgUnitId)/sections/(sectionId): Delete a section from a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#delete--d2l-api-lp-(version)-(orgUnitId)-sections-(sectionId)',
	},
	'learningPlatform.getOrgUnitIdSectionsSectionId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/(sectionId): Retrieve a section from a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-(sectionId)',
	},
	'learningPlatform.putOrgUnitIdSectionsSectionId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/sections/(sectionId): Update information for a section in a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#put--d2l-api-lp-(version)-(orgUnitId)-sections-(sectionId)',
	},
	'learningPlatform.getOrgUnitIdSectionsSectionIdEnrollments': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/(sectionId)/enrollments/: Retrieve a page of enrollments for the provided section. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-(sectionId)-enrollments-',
	},
	'learningPlatform.postOrgUnitIdSectionsSectionIdEnrollments': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/sections/(sectionId)/enrollments/: Enroll a user in a section for a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#post--d2l-api-lp-(version)-(orgUnitId)-sections-(sectionId)-enrollments-',
	},
	'learningPlatform.getOrgUnitIdSectionsSectionIdNoenrollments': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/(sectionId)/noenrollments: Retrieve a section from a particular org unit without enrollment data. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-(sectionId)-noenrollments',
	},
	'learningPlatform.getOrgUnitIdSectionsEnrollments': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/enrollments/: Retrieve a page of enrollments across all sections for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-enrollments-',
	},
	'learningPlatform.getOrgUnitIdSectionsMysections': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/mysections/: Retrieve all the sections for a provided org unit in which the calling user\nis enrolled. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-mysections-',
	},
	'learningPlatform.getOrgUnitIdSectionsPaged': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/paged: Retrieve a page of sections for a provided org unit in which the calling\nuser is enrolled. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-paged',
	},
	'learningPlatform.getOrgUnitIdSectionsSettings': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/sections/settings: Retrieve the settings for all sections in an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#get--d2l-api-lp-(version)-(orgUnitId)-sections-settings',
	},
	'learningPlatform.postOrgUnitIdSectionsSettings': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/(orgUnitId)/sections/settings: Initialize the settings for all sections in a particular org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#post--d2l-api-lp-(version)-(orgUnitId)-sections-settings',
	},
	'learningPlatform.putOrgUnitIdSectionsSettings': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/sections/settings: Update the section settings for an org unit. Official reference: https://docs.valence.desire2learn.com/res/groups.html#put--d2l-api-lp-(version)-(orgUnitId)-sections-settings',
	},
	'learningPlatform.deleteOrgUnitIdWidgetdataCustomWidgetId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId): Delete custom widget data for an org unit. Official reference: https://docs.valence.desire2learn.com/res/settings.html#delete--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)',
	},
	'learningPlatform.getOrgUnitIdWidgetdataCustomWidgetId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId): Retrieve custom widget data for an org unit. Official reference: https://docs.valence.desire2learn.com/res/settings.html#get--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)',
	},
	'learningPlatform.putOrgUnitIdWidgetdataCustomWidgetId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId): Update custom data for a widget in an org unit. Official reference: https://docs.valence.desire2learn.com/res/settings.html#put--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)',
	},
	'learningPlatform.deleteOrgUnitIdWidgetdataCustomWidgetIdUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId)/(userId): Delete custom widget data for an org unit tied to a particular user. Official reference: https://docs.valence.desire2learn.com/res/settings.html#delete--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)-(userId)',
	},
	'learningPlatform.getOrgUnitIdWidgetdataCustomWidgetIdUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId)/(userId): Retrieve custom widget data for an org unit tied to a particular user. Official reference: https://docs.valence.desire2learn.com/res/settings.html#get--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)-(userId)',
	},
	'learningPlatform.putOrgUnitIdWidgetdataCustomWidgetIdUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId)/(userId): Update custom data for a widget for an org unit tied to a particular user. Official reference: https://docs.valence.desire2learn.com/res/settings.html#put--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)-(userId)',
	},
	'learningPlatform.deleteOrgUnitIdWidgetdataCustomWidgetIdMydata': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId)/mydata: Delete custom widget data for an org unit tied to the current user. Official reference: https://docs.valence.desire2learn.com/res/settings.html#delete--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)-mydata',
	},
	'learningPlatform.getOrgUnitIdWidgetdataCustomWidgetIdMydata': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId)/mydata: Retrieve custom widget data for an org unit tied to the current user. Official reference: https://docs.valence.desire2learn.com/res/settings.html#get--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)-mydata',
	},
	'learningPlatform.putOrgUnitIdWidgetdataCustomWidgetIdMydata': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/(orgUnitId)/widgetdata/(customWidgetId)/mydata: Update user-specific custom data for a widget in an org unit. Official reference: https://docs.valence.desire2learn.com/res/settings.html#put--d2l-api-lp-(version)-(orgUnitId)-widgetdata-(customWidgetId)-mydata',
	},
	'learningPlatform.getAccountSettingsUserIdLocale': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/accountSettings/(userId)/locale/: Retrieve the locale account settings for a particular user. Official reference: https://docs.valence.desire2learn.com/res/settings.html#get--d2l-api-lp-(version)-accountSettings-(userId)-locale-',
	},
	'learningPlatform.putAccountSettingsUserIdLocale': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/accountSettings/(userId)/locale/: Update the locale account settings for a particular user. Official reference: https://docs.valence.desire2learn.com/res/settings.html#put--d2l-api-lp-(version)-accountSettings-(userId)-locale-',
	},
	'learningPlatform.getAccountSettingsMySettingsLocale': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/accountSettings/mySettings/locale/: Retrieve the current userÃ¢Â€Â™s locale account settings. Official reference: https://docs.valence.desire2learn.com/res/settings.html#get--d2l-api-lp-(version)-accountSettings-mySettings-locale-',
	},
	'learningPlatform.putAccountSettingsMySettingsLocale': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/accountSettings/mySettings/locale/: Update the current userÃ¢Â€Â™s locale account settings. Official reference: https://docs.valence.desire2learn.com/res/settings.html#put--d2l-api-lp-(version)-accountSettings-mySettings-locale-',
	},
	'learningPlatform.getAlertsUserUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/alerts/user/(userId): Retrieve a list of alerts for the given user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-alerts-user-(userId)',
	},
	'learningPlatform.getAttributesSchemas': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/attributes/schemas/: Retrieve user attributes schema definitions. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-attributes-schemas-',
	},
	'learningPlatform.deleteAttributesUsersUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/attributes/users/(userId): Unset all attribute values for a user. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-attributes-users-(userId)',
	},
	'learningPlatform.getAttributesUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/attributes/users/(userId): Retrieve the attributes for a single user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-attributes-users-(userId)',
	},
	'learningPlatform.putAttributesUsersUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/attributes/users/(userId): Update one or more attributes for a single user. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-attributes-users-(userId)',
	},
	'learningPlatform.getAuthSoaptoken': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/auth/soaptoken: Retrieve a SOAP services authentication token given an existing calling user context. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#get--d2l-api-lp-(version)-auth-soaptoken',
	},
	'learningPlatform.getConfigVariablesVariableIdDefinition': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/definition: Retrieve the definitions for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-definition',
	},
	'learningPlatform.getConfigVariablesVariableIdEffectiveValuesOrgUnitsOrgUnitId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/lp/(version)/configVariables/(variableId)/effectiveValues/orgUnits/(orgUnitId): Retrieve the effective value for a configuration variable within an org unit. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-effectiveValues-orgUnits-(orgUnitId)',
		},
	'learningPlatform.deleteConfigVariablesVariableIdResolver': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/configVariables/(variableId)/resolver:  Official reference: https://docs.valence.desire2learn.com/res/config.html#delete--d2l-api-lp-(version)-configVariables-(variableId)-resolver',
	},
	'learningPlatform.getConfigVariablesVariableIdResolver': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/resolver: Retrieve the resolution strategy for an org unit configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-resolver',
	},
	'learningPlatform.putConfigVariablesVariableIdResolver': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/configVariables/(variableId)/resolver: Update the resolution strategy for an org unit configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#put--d2l-api-lp-(version)-configVariables-(variableId)-resolver',
	},
	'learningPlatform.getConfigVariablesVariableIdValues': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/values: Retrieve the value summary for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-values',
	},
	'learningPlatform.getConfigVariablesVariableIdValuesOrg': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/values/org: Retrieve the current org value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-values-org',
	},
	'learningPlatform.putConfigVariablesVariableIdValuesOrg': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/configVariables/(variableId)/values/org: Set a new org value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#put--d2l-api-lp-(version)-configVariables-(variableId)-values-org',
	},
	'learningPlatform.getConfigVariablesVariableIdValuesOrgUnits': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/values/orgUnits/: Retrieve all the org unit override values for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-values-orgUnits-',
	},
	'learningPlatform.getConfigVariablesVariableIdValuesOrgUnitsOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/values/orgUnits/(orgUnitId): Retrieve an org unit override value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-values-orgUnits-(orgUnitId)',
	},
	'learningPlatform.putConfigVariablesVariableIdValuesOrgUnitsOrgUnitId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/configVariables/(variableId)/values/orgUnits/(orgUnitId): Set a new org unit override value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#put--d2l-api-lp-(version)-configVariables-(variableId)-values-orgUnits-(orgUnitId)',
	},
	'learningPlatform.getConfigVariablesVariableIdValuesRoles': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/values/roles/: Retrieve all the role override values for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-values-roles-',
	},
	'learningPlatform.getConfigVariablesVariableIdValuesRolesRoleId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/values/roles/(roleId): Retrieve a role override value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-values-roles-(roleId)',
	},
	'learningPlatform.putConfigVariablesVariableIdValuesRolesRoleId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/configVariables/(variableId)/values/roles/(roleId): Set a new role override value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#put--d2l-api-lp-(version)-configVariables-(variableId)-values-roles-(roleId)',
	},
	'learningPlatform.getConfigVariablesVariableIdValuesSystem': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/(variableId)/values/system: Retrieve the current system value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-(variableId)-values-system',
	},
	'learningPlatform.putConfigVariablesVariableIdValuesSystem': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/configVariables/(variableId)/values/system: Set a new system value for a configuration variable. Official reference: https://docs.valence.desire2learn.com/res/config.html#put--d2l-api-lp-(version)-configVariables-(variableId)-values-system',
	},
	'learningPlatform.getConfigVariablesDefinitions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/configVariables/definitions/: Retrieve the definitions for all the configuration variables the user has\naccess to view. Official reference: https://docs.valence.desire2learn.com/res/config.html#get--d2l-api-lp-(version)-configVariables-definitions-',
	},
	'learningPlatform.postCourses': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/courses/: Create a new course offering. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-courses-',
	},
	'learningPlatform.deleteCoursesOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/courses/(orgUnitId): Delete a course offering. Official reference: https://docs.valence.desire2learn.com/res/course.html#delete--d2l-api-lp-(version)-courses-(orgUnitId)',
	},
	'learningPlatform.getCoursesOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/courses/(orgUnitId): Retrieve a course offering. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-courses-(orgUnitId)',
	},
	'learningPlatform.putCoursesOrgUnitId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/courses/(orgUnitId): Update a current course offering. Official reference: https://docs.valence.desire2learn.com/res/course.html#put--d2l-api-lp-(version)-courses-(orgUnitId)',
	},
	'learningPlatform.getCoursesOrgUnitIdImage': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/courses/(orgUnitId)/image: Retrieve the course image for a course offering. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-courses-(orgUnitId)-image',
	},
	'learningPlatform.putCoursesOrgUnitIdImage': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/courses/(orgUnitId)/image: Update the course image for a course offering. Official reference: https://docs.valence.desire2learn.com/res/course.html#put--d2l-api-lp-(version)-courses-(orgUnitId)-image',
	},
	'learningPlatform.getCoursesBulkUpdateJobTokenId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/courses/bulkUpdate/(jobTokenId): Retrieve the status of a queued bulk course update job. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-courses-bulkUpdate-(jobTokenId)',
	},
	'learningPlatform.getCoursesParentorgunits': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/courses/parentorgunits: Retrieve parent department and semester for the provided courses. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-courses-parentorgunits',
	},
	'learningPlatform.getCoursesParents': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/courses/parents: Retrieve parent departments and semesters for the provided courses. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-courses-parents',
	},
	'learningPlatform.getCoursesQuery': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/courses/query: Query course offerings available for bulk course update jobs. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-courses-query',
	},
	'learningPlatform.getCoursesSchema': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/courses/schema: Retrieve the list of parent org unit type constraints for course offerings. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-courses-schema',
	},
	'learningPlatform.postCoursesUpdate': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/courses/update: Initiate a bulk update job for matching course offerings. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-courses-update',
	},
	'learningPlatform.postCoursetemplates': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/coursetemplates/: Create a new course template. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-coursetemplates-',
	},
	'learningPlatform.deleteCoursetemplatesOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/coursetemplates/(orgUnitId): Delete a course template. Official reference: https://docs.valence.desire2learn.com/res/course.html#delete--d2l-api-lp-(version)-coursetemplates-(orgUnitId)',
	},
	'learningPlatform.getCoursetemplatesOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/coursetemplates/(orgUnitId): Retrieve a course template. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-coursetemplates-(orgUnitId)',
	},
	'learningPlatform.putCoursetemplatesOrgUnitId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/coursetemplates/(orgUnitId): Update the information for a course template. Official reference: https://docs.valence.desire2learn.com/res/course.html#put--d2l-api-lp-(version)-coursetemplates-(orgUnitId)',
	},
	'learningPlatform.getCoursetemplatesSchema': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/coursetemplates/schema: Retrieve the list of parent org unit type constraints for course offerings\nbuilt on this template. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-coursetemplates-schema',
	},
	'learningPlatform.getDataExportBds': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/bds: Retrieves a list of Brightspace Data Sets plugins that you have permission to see. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-bds',
	},
	'learningPlatform.getDataExportBdsPluginidIdentifier': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/bds/(pluginid)/(identifier): Retrieves a file stream for the requested Brightspace Data Sets plugin. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-bds-(pluginid)-(identifier)',
	},
	'learningPlatform.getDataExportBdsDownloadPluginid': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/bds/download/(pluginid): Retrieves a file stream for the requested Brightspace Data Sets plugin. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-bds-download-(pluginid)',
	},
	'learningPlatform.getDataExportBdsList': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/bds/list: Retrieves a list of Brightspace Data Sets plugins that you have permission to see. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-bds-list',
	},
	'learningPlatform.postDataExportCreate': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/dataExport/create: Create an export job for the requested data set. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#post--d2l-api-lp-(version)-dataExport-create',
	},
	'learningPlatform.getDataExportDownloadExportJobId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/download/(exportJobId): Retrieves a ZIP file containing a CSV file with the data of the requested\nexport job that you previously submitted. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-download-(exportJobId)',
	},
	'learningPlatform.getDataExportJobs': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/jobs: Lists all available export jobs that you have previously submitted. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-jobs',
	},
	'learningPlatform.getDataExportJobsExportJobId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/jobs/(exportJobId): Retrieves information about a data export job that you have previously submitted. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-jobs-(exportJobId)',
	},
	'learningPlatform.getDataExportList': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/list: Lists all available data sets. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-list',
	},
	'learningPlatform.getDataExportListDataSetId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/list/(dataSetId): Retrieve a data set. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-list-(dataSetId)',
	},
	'learningPlatform.getDataExportVersion': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/dataExport/version: Retrieves information about the Data Sets versions. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-dataExport-version',
	},
	'learningPlatform.getDatasetsBds': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/datasets/bds: Retrieve a list of Brightspace Data Sets schemas and plugins. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-datasets-bds',
	},
	'learningPlatform.getDatasetsBdsSchemaIdExtracts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/datasets/bds/(schemaId)/extracts: Retrieve a list of Brightspace Data Sets extracts that are associated with the provided schema. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-datasets-bds-(schemaId)-extracts',
	},
	'learningPlatform.getDatasetsBdsSchemaIdPluginsPluginIdExtracts': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/datasets/bds/(schemaId)/plugins/(pluginId)/extracts: Retrieve a list of Brightspace Data Sets extracts that are associated with the provided plugin\nand schema. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-datasets-bds-(schemaId)-plugins-(pluginId)-extracts',
	},
	'learningPlatform.getDatasetsBdsSchemaIdPluginsPluginIdExtractsExtractId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/datasets/bds/(schemaId)/plugins/(pluginId)/extracts/(extractId): Retrieve a file stream or a redirect response to a file stream for the requested extract of\nthe requested schema and plugin. Official reference: https://docs.valence.desire2learn.com/res/dataExport.html#get--d2l-api-lp-(version)-datasets-bds-(schemaId)-plugins-(pluginId)-extracts-(extractId)',
	},
	'learningPlatform.getDemographicsDataTypes': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/dataTypes/: Retrieve the list of all demographics data types. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-dataTypes-',
	},
	'learningPlatform.getDemographicsDataTypesDataTypeId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/dataTypes/(dataTypeId): Retrieve a single demographic data type. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-dataTypes-(dataTypeId)',
	},
	'learningPlatform.getDemographicsFields': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/fields/: Retrieve the list of all demographics fields. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-fields-',
	},
	'learningPlatform.postDemographicsFields': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/demographics/fields/: Create a new demographic field. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#post--d2l-api-lp-(version)-demographics-fields-',
	},
	'learningPlatform.deleteDemographicsFieldsFieldId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/demographics/fields/(fieldId): Delete a single demographic field, provided it has no associated entries. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#delete--d2l-api-lp-(version)-demographics-fields-(fieldId)',
	},
	'learningPlatform.getDemographicsFieldsFieldId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/fields/(fieldId): Retrieve a single demographic field. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-fields-(fieldId)',
	},
	'learningPlatform.putDemographicsFieldsFieldId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/demographics/fields/(fieldId): Update a single demographic field. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#put--d2l-api-lp-(version)-demographics-fields-(fieldId)',
	},
	'learningPlatform.getDemographicsOrgUnitsOrgUnitIdUsers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/orgUnits/(orgUnitId)/users/: Retrieve all the demographics entries for all users enrolled in a particular\norg unit. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-orgUnits-(orgUnitId)-users-',
	},
	'learningPlatform.getDemographicsOrgUnitsOrgUnitIdUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/orgUnits/(orgUnitId)/users/(userId): Retrieve all the demographics entries for a specific user within a particular\norg unit. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-orgUnits-(orgUnitId)-users-(userId)',
	},
	'learningPlatform.getDemographicsUsers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/users/: Retrieve all the demographics entries for all users, and optionally filter\nthe results. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-users-',
	},
	'learningPlatform.deleteDemographicsUsersUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/demographics/users/(userId): Delete one or more of a particular userÃ¢Â€Â™s associated demographics entries. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#delete--d2l-api-lp-(version)-demographics-users-(userId)',
	},
	'learningPlatform.getDemographicsUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/demographics/users/(userId): Retrieve all the demographics entries for a single user. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#get--d2l-api-lp-(version)-demographics-users-(userId)',
	},
	'learningPlatform.putDemographicsUsersUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/demographics/users/(userId): Update the demographics entries for a single user. Official reference: https://docs.valence.desire2learn.com/res/demographics.html#put--d2l-api-lp-(version)-demographics-users-(userId)',
	},
	'learningPlatform.postEnrollments': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/enrollments/: Create or update a new enrollment for a user. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#post--d2l-api-lp-(version)-enrollments-',
	},
	'learningPlatform.postEnrollmentsBatch': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/enrollments/batch/: Create a batch of new enrollments for users. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#post--d2l-api-lp-(version)-enrollments-batch-',
	},
	'learningPlatform.getEnrollmentsMyenrollments': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/myenrollments/: Retrieve the list of all enrollments for the current user. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-myenrollments-',
	},
	'learningPlatform.getEnrollmentsMyenrollmentsOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/myenrollments/(orgUnitId): Retrieve the enrollment details for the current user in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-myenrollments-(orgUnitId)',
	},
	'learningPlatform.getEnrollmentsMyenrollmentsOrgUnitIdAccess': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/myenrollments/(orgUnitId)/access: Retrieve abbreviated enrollment details for the current user in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-myenrollments-(orgUnitId)-access',
	},
	'learningPlatform.getEnrollmentsMyenrollmentsOrgUnitIdParentOrgUnits': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/myenrollments/(orgUnitId)/parentOrgUnits: Retrieve enrollment details of all parent org units of the provided org unit in which the current user is enrolled. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-myenrollments-(orgUnitId)-parentOrgUnits',
	},
	'learningPlatform.deleteEnrollmentsMyenrollmentsOrgUnitIdPin': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/enrollments/myenrollments/(orgUnitId)/pin: Remove the pin from the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#delete--d2l-api-lp-(version)-enrollments-myenrollments-(orgUnitId)-pin',
	},
	'learningPlatform.postEnrollmentsMyenrollmentsOrgUnitIdPin': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/enrollments/myenrollments/(orgUnitId)/pin: Pin an org unit to the top of the list of a userÃ¢Â€Â™s enrollments. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#post--d2l-api-lp-(version)-enrollments-myenrollments-(orgUnitId)-pin',
	},
	'learningPlatform.getEnrollmentsOrgUnitsOrgUnitIdUsers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/orgUnits/(orgUnitId)/users/: Retrieve the collection of users enrolled in the identified org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-orgUnits-(orgUnitId)-users-',
	},
	'learningPlatform.deleteEnrollmentsOrgUnitsOrgUnitIdUsersUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/enrollments/orgUnits/(orgUnitId)/users/(userId): Delete a userÃ¢Â€Â™s enrollment in a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#delete--d2l-api-lp-(version)-enrollments-orgUnits-(orgUnitId)-users-(userId)',
	},
	'learningPlatform.getEnrollmentsOrgUnitsOrgUnitIdUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/orgUnits/(orgUnitId)/users/(userId): Retrieve enrollment details for a user in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-orgUnits-(orgUnitId)-users-(userId)',
	},
	'learningPlatform.getEnrollmentsOrgUnitsOrgUnitIdUsersUserIdCompletion': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/orgUnits/(orgUnitId)/users/(userId)/completion: Retrieve completion tracking status for a user in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-orgUnits-(orgUnitId)-users-(userId)-completion',
	},
	'learningPlatform.putEnrollmentsOrgUnitsOrgUnitIdUsersUserIdCompletion': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/enrollments/orgUnits/(orgUnitId)/users/(userId)/completion: Assign completion tracking status for a user in the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#put--d2l-api-lp-(version)-enrollments-orgUnits-(orgUnitId)-users-(userId)-completion',
	},
	'learningPlatform.deleteEnrollmentsOrgUnitsOrgUnitIdUsersUserIdPin': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/enrollments/orgUnits/(orgUnitId)/users/(userId)/pin: Remove the pin from the provided org unit for specific user. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#delete--d2l-api-lp-(version)-enrollments-orgUnits-(orgUnitId)-users-(userId)-pin',
	},
	'learningPlatform.postEnrollmentsOrgUnitsOrgUnitIdUsersUserIdPin': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/enrollments/orgUnits/(orgUnitId)/users/(userId)/pin: Pin an org unit to the top of the list for a userÃ¢Â€Â™s enrollments. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#post--d2l-api-lp-(version)-enrollments-orgUnits-(orgUnitId)-users-(userId)-pin',
	},
	'learningPlatform.getEnrollmentsUsersUserIdOrgUnits': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/users/(userId)/orgUnits/: Retrieve a list of all enrollments for the provided user. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-users-(userId)-orgUnits-',
	},
	'learningPlatform.deleteEnrollmentsUsersUserIdOrgUnitsOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/enrollments/users/(userId)/orgUnits/(orgUnitId): Delete a userÃ¢Â€Â™s enrollment in a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#delete--d2l-api-lp-(version)-enrollments-users-(userId)-orgUnits-(orgUnitId)',
	},
	'learningPlatform.getEnrollmentsUsersUserIdOrgUnitsOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/enrollments/users/(userId)/orgUnits/(orgUnitId): Retrieve enrollment details in an org unit for the provided user. Official reference: https://docs.valence.desire2learn.com/res/enroll.html#get--d2l-api-lp-(version)-enrollments-users-(userId)-orgUnits-(orgUnitId)',
	},
	'learningPlatform.getFeed': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/feed/: Fetch the feed for the current user context. Official reference: https://docs.valence.desire2learn.com/res/news.html#get--d2l-api-lp-(version)-feed-',
	},
	'learningPlatform.putForceLogoutUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/forceLogout/(userId): Terminate all active web sessions and revoke API access for a user. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-forceLogout-(userId)',
	},
	'learningPlatform.getGlobalusermappingIdentifiersIdentifier': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/globalusermapping/identifiers/(identifier): Retrieve the D2L user map identifier for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-globalusermapping-identifiers-(identifier)',
	},
	'learningPlatform.deleteGlobalusermappingUsersUserid': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/globalusermapping/users/(userid): Unassign the global map identifier for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-globalusermapping-users-(userid)',
	},
	'learningPlatform.getGlobalusermappingUsersUserid': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/globalusermapping/users/(userid): Retrieves the global map identifier for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-globalusermapping-users-(userid)',
	},
	'learningPlatform.putGlobalusermappingUsersUserid': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/globalusermapping/users/(userid): Assign the global map identifier for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-globalusermapping-users-(userid)',
	},
	'learningPlatform.getImsconfigMapRoles': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/imsconfig/map/roles/: Retrieve mappings between user roles and LIS roles. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-imsconfig-map-roles-',
	},
	'learningPlatform.getImsconfigMapRolesRoleId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/imsconfig/map/roles/(roleId): Retrieve mapping between a user roles and LIS roles. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-imsconfig-map-roles-(roleId)',
	},
	'learningPlatform.putImsconfigMapRolesRoleId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/imsconfig/map/roles/(roleId): Map a user role to a set of LIS Roles. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-imsconfig-map-roles-(roleId)',
	},
	'learningPlatform.getImsconfigRoles': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/imsconfig/roles/: Retrieve a list of known LIS Roles. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-imsconfig-roles-',
	},
	'learningPlatform.getLanguage': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/language: Retrieve the collection of all D2L languages. Official reference: https://docs.valence.desire2learn.com/res/locale.html#get--d2l-api-lp-(version)-language',
	},
	'learningPlatform.deleteLocalauthenticationsecurityOverrides': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/localauthenticationsecurity/overrides/: Delete local authentication security overrides for a list of users. Official reference: https://docs.valence.desire2learn.com/res/settings.html#delete--d2l-api-lp-(version)-localauthenticationsecurity-overrides-',
	},
	'learningPlatform.getLocalauthenticationsecurityOverrides': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/localauthenticationsecurity/overrides/: Retrieve local authentication security overrides for a list of users. Official reference: https://docs.valence.desire2learn.com/res/settings.html#get--d2l-api-lp-(version)-localauthenticationsecurity-overrides-',
	},
	'learningPlatform.postLocalauthenticationsecurityOverrides': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/localauthenticationsecurity/overrides/: Add or update local authentication security overrides for a list of users. Official reference: https://docs.valence.desire2learn.com/res/settings.html#post--d2l-api-lp-(version)-localauthenticationsecurity-overrides-',
	},
	'learningPlatform.getLocales': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/locales/: Retrieve the collection of all known locales. Official reference: https://docs.valence.desire2learn.com/res/locale.html#get--d2l-api-lp-(version)-locales-',
	},
	'learningPlatform.getLocalesLocaleId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/locales/(localeId): Retrieve the properties for a particular locale. Official reference: https://docs.valence.desire2learn.com/res/locale.html#get--d2l-api-lp-(version)-locales-(localeId)',
	},
	'learningPlatform.getLogging': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/logging/: Retrieve all current log messages. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#get--d2l-api-lp-(version)-logging-',
	},
	'learningPlatform.getLoggingLogMessageId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/logging/(logMessageId)/: Retrieve identified log message. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#get--d2l-api-lp-(version)-logging-(logMessageId)-',
	},
	'learningPlatform.getLoggingGrouped': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/logging/grouped/: Retrieve all current log arranged in message groups. Official reference: https://docs.valence.desire2learn.com/res/apiprop.html#get--d2l-api-lp-(version)-logging-grouped-',
	},
	'learningPlatform.getNotificationsInstantCarriers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/notifications/instant/carriers/: Retrieve all the carrier channels for delivering notification messages. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-notifications-instant-carriers-',
	},
	'learningPlatform.getNotificationsInstantCarriersCarrierIdSubscriptions': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/notifications/instant/carriers/(carrierId)/subscriptions/: Retrieve all the current subscriptions for notification messages. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-notifications-instant-carriers-(carrierId)-subscriptions-',
	},
	'learningPlatform.deleteNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/lp/(version)/notifications/instant/carriers/(carrierId)/subscriptions/(messageTypeId): Delete the subscription for messages of a particular type, delivered by a\nparticular carrier. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-notifications-instant-carriers-(carrierId)-subscriptions-(messageTypeId)',
		},
	'learningPlatform.putNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeId':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/lp/(version)/notifications/instant/carriers/(carrierId)/subscriptions/(messageTypeId): Subscribe to notification messages of a particular type, delivered by a\nparticular carrier. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-notifications-instant-carriers-(carrierId)-subscriptions-(messageTypeId)',
		},
	'learningPlatform.deleteNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeIdUsersUserId':
		{
			riskLevel: 'destructive',
			description:
				'DELETE /d2l/api/lp/(version)/notifications/instant/carriers/(carrierId)/subscriptions/(messageTypeId)/users/(userId): Unsubscribe to notification messages of a particular type, delivered by a\nparticular carrier, for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-notifications-instant-carriers-(carrierId)-subscriptions-(messageTypeId)-users-(userId)',
		},
	'learningPlatform.putNotificationsInstantCarriersCarrierIdSubscriptionsMessageTypeIdUsersUserId':
		{
			riskLevel: 'write',
			description:
				'PUT /d2l/api/lp/(version)/notifications/instant/carriers/(carrierId)/subscriptions/(messageTypeId)/users/(userId): Subscribe to notification messages of a particular type, delivered by a\nparticular carrier, for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-notifications-instant-carriers-(carrierId)-subscriptions-(messageTypeId)-users-(userId)',
		},
	'learningPlatform.getNotificationsInstantCarriersCarrierIdSubscriptionsUsersUserId':
		{
			riskLevel: 'read',
			description:
				'GET /d2l/api/lp/(version)/notifications/instant/carriers/(carrierId)/subscriptions/users/(userId)/: Retrieve all the subscriptions for notification messages for the provided user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-notifications-instant-carriers-(carrierId)-subscriptions-users-(userId)-',
		},
	'learningPlatform.getNotificationsInstantUsersUserIdSettings': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/notifications/instant/users/(userId)/settings: Retrieve the notification settings for the provided user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-notifications-instant-users-(userId)-settings',
	},
	'learningPlatform.putNotificationsInstantUsersUserIdSettings': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/notifications/instant/users/(userId)/settings: Update the notification settings for the provided user. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-notifications-instant-users-(userId)-settings',
	},
	'learningPlatform.getOrganizationInfo': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/organization/info: Retrieve the organization properties information. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-organization-info',
	},
	'learningPlatform.getOrganizationPrimaryUrl': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/organization/primary-url: Retrieve the organizationÃ¢Â€Â™s primary (root) URL. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-organization-primary-url',
	},
	'learningPlatform.getOrgstructure': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/: Retrieve properties for all org units. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-',
	},
	'learningPlatform.postOrgstructure': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/orgstructure/: Create a new custom org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#post--d2l-api-lp-(version)-orgstructure-',
	},
	'learningPlatform.getOrgstructureOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId): Retrieve the properties for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)',
	},
	'learningPlatform.putOrgstructureOrgUnitId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/orgstructure/(orgUnitId): Update a custom org unitÃ¢Â€Â™s properties Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#put--d2l-api-lp-(version)-orgstructure-(orgUnitId)',
	},
	'learningPlatform.getOrgstructureOrgUnitIdAncestors': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId)/ancestors/: Retrieve a list of ancestor-units for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)-ancestors-',
	},
	'learningPlatform.getOrgstructureOrgUnitIdChildren': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId)/children/: Retrieve a list of child-units for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)-children-',
	},
	'learningPlatform.postOrgstructureOrgUnitIdChildren': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/orgstructure/(orgUnitId)/children/: Give the provided org unit a new child org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#post--d2l-api-lp-(version)-orgstructure-(orgUnitId)-children-',
	},
	'learningPlatform.deleteOrgstructureOrgUnitIdChildrenChildOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/orgstructure/(orgUnitId)/children/(childOrgUnitId): Delete the relationship between a provided org unit and one of its children. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#delete--d2l-api-lp-(version)-orgstructure-(orgUnitId)-children-(childOrgUnitId)',
	},
	'learningPlatform.getOrgstructureOrgUnitIdChildrenPaged': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId)/children/paged/: Retrieve a list of child-units for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)-children-paged-',
	},
	'learningPlatform.getOrgstructureOrgUnitIdColours': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId)/colours: Retrieve the color scheme for an org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)-colours',
	},
	'learningPlatform.putOrgstructureOrgUnitIdColours': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/orgstructure/(orgUnitId)/colours: Set a new color scheme for an org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#put--d2l-api-lp-(version)-orgstructure-(orgUnitId)-colours',
	},
	'learningPlatform.getOrgstructureOrgUnitIdDescendants': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId)/descendants/: Retrieve a list of descendent-units for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)-descendants-',
	},
	'learningPlatform.getOrgstructureOrgUnitIdDescendantsPaged': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId)/descendants/paged/: Retrieve a list of descendent-units for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)-descendants-paged-',
	},
	'learningPlatform.getOrgstructureOrgUnitIdParents': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/(orgUnitId)/parents/: Retrieve a list of parent-units for a provided org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-(orgUnitId)-parents-',
	},
	'learningPlatform.postOrgstructureOrgUnitIdParents': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/orgstructure/(orgUnitId)/parents/: Give the provided org unit a new parent org unit. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#post--d2l-api-lp-(version)-orgstructure-(orgUnitId)-parents-',
	},
	'learningPlatform.deleteOrgstructureOrgUnitIdParentsParentOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/orgstructure/(orgUnitId)/parents/(parentOrgUnitId): Delete the relationship between a provided org unit and one of its parents. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#delete--d2l-api-lp-(version)-orgstructure-(orgUnitId)-parents-(parentOrgUnitId)',
	},
	'learningPlatform.getOrgstructureChildless': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/childless/: Retrieve all org units that have no children. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-childless-',
	},
	'learningPlatform.getOrgstructureOrphans': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/orphans/: Retrieve all org units that are orphans (have no parents). Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-orphans-',
	},
	'learningPlatform.getOrgstructureRecyclebin': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/orgstructure/recyclebin/: Retrieve all the org units currently in the archive. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-orgstructure-recyclebin-',
	},
	'learningPlatform.deleteOrgstructureRecyclebinOrgUnitId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/orgstructure/recyclebin/(orgUnitId): Permanently delete an org unit from the archive. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#delete--d2l-api-lp-(version)-orgstructure-recyclebin-(orgUnitId)',
	},
	'learningPlatform.postOrgstructureRecyclebinOrgUnitIdRecycle': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/orgstructure/recyclebin/(orgUnitId)/recycle: Send an org unit to the archive. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#post--d2l-api-lp-(version)-orgstructure-recyclebin-(orgUnitId)-recycle',
	},
	'learningPlatform.postOrgstructureRecyclebinOrgUnitIdRestore': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/orgstructure/recyclebin/(orgUnitId)/restore: Restore an org unit from the archive. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#post--d2l-api-lp-(version)-orgstructure-recyclebin-(orgUnitId)-restore',
	},
	'learningPlatform.getOutypes': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/outypes/: Retrieve all the known and visible org unit types. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-outypes-',
	},
	'learningPlatform.postOutypes': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/outypes/: Create a new custom org unit type. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#post--d2l-api-lp-(version)-outypes-',
	},
	'learningPlatform.deleteOutypesOrgUnitTypeId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/outypes/(orgUnitTypeId): Delete a particular org unit type. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#delete--d2l-api-lp-(version)-outypes-(orgUnitTypeId)',
	},
	'learningPlatform.getOutypesOrgUnitTypeId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/outypes/(orgUnitTypeId): Retrieve information about a particular org unit type. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-outypes-(orgUnitTypeId)',
	},
	'learningPlatform.postOutypesOrgUnitTypeId': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/outypes/(orgUnitTypeId): Update a particular org unit type. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#post--d2l-api-lp-(version)-outypes-(orgUnitTypeId)',
	},
	'learningPlatform.getOutypesDepartment': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/outypes/department: Retrieve the org unit type information for department org units. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-outypes-department',
	},
	'learningPlatform.getOutypesSemester': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/outypes/semester: Retrieve the org unit type information for semester org units. Official reference: https://docs.valence.desire2learn.com/res/orgunit.html#get--d2l-api-lp-(version)-outypes-semester',
	},
	'learningPlatform.getPermissionsToolsToolIdCapabilities': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/permissions/tools/(toolId)/capabilities/: Retrieve all the capability grants for a tool. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#get--d2l-api-lp-(version)-permissions-tools-(toolId)-capabilities-',
	},
	'learningPlatform.postPermissionsToolsToolIdCapabilities': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/permissions/tools/(toolId)/capabilities/: Grant a tool capability. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#post--d2l-api-lp-(version)-permissions-tools-(toolId)-capabilities-',
	},
	'learningPlatform.deletePermissionsToolsToolIdCapabilitiesCapabilityId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/permissions/tools/(toolId)/capabilities/(capabilityId): Remove the specified capability. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#delete--d2l-api-lp-(version)-permissions-tools-(toolId)-capabilities-(capabilityId)',
	},
	'learningPlatform.getPermissionsToolsToolIdClaims': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/permissions/tools/(toolId)/claims/: Retrieve all the permission grants for a toolÃ¢Â€Â™s permissions claims. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#get--d2l-api-lp-(version)-permissions-tools-(toolId)-claims-',
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsAllowed': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/permissions/tools/(toolId)/claims/allowed/: Retrieve all the allowed permission grants for a tool for a toolÃ¢Â€Â™s\npermissions claims. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#get--d2l-api-lp-(version)-permissions-tools-(toolId)-claims-allowed-',
	},
	'learningPlatform.deletePermissionsToolsToolIdClaimsAllowedGrantId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/permissions/tools/(toolId)/claims/allowed/(grantId): Reset a permission grant to Ã¢Â€Âœnot allowedÃ¢Â€Â. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#delete--d2l-api-lp-(version)-permissions-tools-(toolId)-claims-allowed-(grantId)',
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsAllowedGrantId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/permissions/tools/(toolId)/claims/allowed/(grantId): Determine the allowance state of a permission grant. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#get--d2l-api-lp-(version)-permissions-tools-(toolId)-claims-allowed-(grantId)',
	},
	'learningPlatform.putPermissionsToolsToolIdClaimsAllowedGrantId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/permissions/tools/(toolId)/claims/allowed/(grantId): Set a permission grant to Ã¢Â€ÂœallowedÃ¢Â€Â. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#put--d2l-api-lp-(version)-permissions-tools-(toolId)-claims-allowed-(grantId)',
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsMetadata': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/permissions/tools/(toolId)/claims/metadata/: Retrieve the meta-data for all of a toolÃ¢Â€Â™s permission claims. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#get--d2l-api-lp-(version)-permissions-tools-(toolId)-claims-metadata-',
	},
	'learningPlatform.getPermissionsToolsToolIdClaimsMetadataClaimId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/permissions/tools/(toolId)/claims/metadata/(claimId): Retrieve the meta-data for one of a toolÃ¢Â€Â™s permission claims. Official reference: https://docs.valence.desire2learn.com/res/permissions.html#get--d2l-api-lp-(version)-permissions-tools-(toolId)-claims-metadata-(claimId)',
	},
	'learningPlatform.getProfileProfileId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/profile/(profileId): Retrieve a particular personal profile, by Profile ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-profile-(profileId)',
	},
	'learningPlatform.putProfileProfileId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/profile/(profileId): Update a particular personal profile, by Profile ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-profile-(profileId)',
	},
	'learningPlatform.deleteProfileProfileIdImage': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/profile/(profileId)/image: Remove the profile image from a particular personal profile, by Profile ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-profile-(profileId)-image',
	},
	'learningPlatform.getProfileProfileIdImage': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/profile/(profileId)/image: Retrieve a particular profile image, by Profile ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-profile-(profileId)-image',
	},
	'learningPlatform.postProfileProfileIdImage': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/profile/(profileId)/image: Update the profile image for the identified personal profile, by Profile ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-profile-(profileId)-image',
	},
	'learningPlatform.getProfileMyProfile': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/profile/myProfile: Retrieve personal profile information for the current user context. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-profile-myProfile',
	},
	'learningPlatform.putProfileMyProfile': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/profile/myProfile: Update the personal profile data for the current user context. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-profile-myProfile',
	},
	'learningPlatform.deleteProfileMyProfileImage': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/profile/myProfile/image: Remove the current userÃ¢Â€Â™s profile image. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-profile-myProfile-image',
	},
	'learningPlatform.getProfileMyProfileImage': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/profile/myProfile/image: Retrieve the current userÃ¢Â€Â™s profile image. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-profile-myProfile-image',
	},
	'learningPlatform.postProfileMyProfileImage': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/profile/myProfile/image: Update the personal profile image for the current user context. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-profile-myProfile-image',
	},
	'learningPlatform.getProfileUserUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/profile/user/(userId): Retrieve a particular personal profile, by User ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-profile-user-(userId)',
	},
	'learningPlatform.putProfileUserUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/profile/user/(userId): Update a particular personal profile, by User ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-profile-user-(userId)',
	},
	'learningPlatform.deleteProfileUserUserIdImage': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/profile/user/(userId)/image: Remove the profile image from a particular personal profile, by User ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-profile-user-(userId)-image',
	},
	'learningPlatform.getProfileUserUserIdImage': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/profile/user/(userId)/image: Retrieve a particular profile image, by User ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-profile-user-(userId)-image',
	},
	'learningPlatform.postProfileUserUserIdImage': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/profile/user/(userId)/image: Update the profile image for the identified personal profile, by User ID. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-profile-user-(userId)-image',
	},
	'learningPlatform.getRoles': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/roles/: Retrieve a list of all known user roles. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-roles-',
	},
	'learningPlatform.postRoles': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/roles/: Create a new role copied from an existing role. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-roles-',
	},
	'learningPlatform.getRolesRoleId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/roles/(roleId): Retrieve a particular user role. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-roles-(roleId)',
	},
	'learningPlatform.deleteSessionsUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/sessions/(userId): Terminate all active web sessions for a user. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-sessions-(userId)',
	},
	'learningPlatform.postSourceCourses': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/sourceCourses/: Create a new source course. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-sourceCourses-',
	},
	'learningPlatform.getSourceCoursesOrgUnitIdCurrentReofferedCourse': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/sourceCourses/(orgUnitId)/currentReofferedCourse: Retrieve the current course offering for a given source course. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-sourceCourses-(orgUnitId)-currentReofferedCourse',
	},
	'learningPlatform.postSourceCoursesOrgUnitIdDeploy': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/sourceCourses/(orgUnitId)/deploy: Deploy a source course to one or more target course offerings. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-sourceCourses-(orgUnitId)-deploy',
	},
	'learningPlatform.postSourceCoursesOrgUnitIdReofferCourse': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/sourceCourses/(orgUnitId)/reofferCourse: Create a new course re-offering for a given source course. Official reference: https://docs.valence.desire2learn.com/res/course.html#post--d2l-api-lp-(version)-sourceCourses-(orgUnitId)-reofferCourse',
	},
	'learningPlatform.getSourceCoursesOrgUnitIdReofferedCourses': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/sourceCourses/(orgUnitId)/reofferedCourses: Retrieve the re-offered courses for a given source course. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-sourceCourses-(orgUnitId)-reofferedCourses',
	},
	'learningPlatform.getSourceCoursesCourseOfferingsOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/sourceCourses/courseOfferings/(orgUnitId): Retrieve the source course for a given course offering. Official reference: https://docs.valence.desire2learn.com/res/course.html#get--d2l-api-lp-(version)-sourceCourses-courseOfferings-(orgUnitId)',
	},
	'learningPlatform.getTimezones': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/timezones/: Retrieves a list of available time zones. Official reference: https://docs.valence.desire2learn.com/res/locale.html#get--d2l-api-lp-(version)-timezones-',
	},
	'learningPlatform.getToolsOrg': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/tools/org/: Retrieve the current organization-level information for all tools. Official reference: https://docs.valence.desire2learn.com/res/tools.html#get--d2l-api-lp-(version)-tools-org-',
	},
	'learningPlatform.getToolsOrgToolId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/tools/org/(toolId): Retrieve the current organization-level information for a tool. Official reference: https://docs.valence.desire2learn.com/res/tools.html#get--d2l-api-lp-(version)-tools-org-(toolId)',
	},
	'learningPlatform.putToolsOrgToolId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/tools/org/(toolId): Update the organization-level status for a tool. Official reference: https://docs.valence.desire2learn.com/res/tools.html#put--d2l-api-lp-(version)-tools-org-(toolId)',
	},
	'learningPlatform.putToolsOrgToolIdOUDefault': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/tools/org/(toolId)/OUDefault: Update a toolÃ¢Â€Â™s default status for new org units. Official reference: https://docs.valence.desire2learn.com/res/tools.html#put--d2l-api-lp-(version)-tools-org-(toolId)-OUDefault',
	},
	'learningPlatform.putToolsOrgToolIdOUDefaultOverride': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/tools/org/(toolId)/OUDefault/override: Update a toolÃ¢Â€Â™s current status for all org units. Official reference: https://docs.valence.desire2learn.com/res/tools.html#put--d2l-api-lp-(version)-tools-org-(toolId)-OUDefault-override',
	},
	'learningPlatform.getToolsOrgUnitsOrgUnitId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/tools/orgUnits/(orgUnitId): Retrieve the current information for all tools enabled for the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/tools.html#get--d2l-api-lp-(version)-tools-orgUnits-(orgUnitId)',
	},
	'learningPlatform.getToolsOrgUnitsOrgUnitIdToolId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/tools/orgUnits/(orgUnitId)/(toolId): Retrieve the current information for a tool enabled for the provided org unit. Official reference: https://docs.valence.desire2learn.com/res/tools.html#get--d2l-api-lp-(version)-tools-orgUnits-(orgUnitId)-(toolId)',
	},
	'learningPlatform.putToolsOrgUnitsOrgUnitIdToolId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/tools/orgUnits/(orgUnitId)/(toolId): Update the org unit-level information for a tool. Official reference: https://docs.valence.desire2learn.com/res/tools.html#put--d2l-api-lp-(version)-tools-orgUnits-(orgUnitId)-(toolId)',
	},
	'learningPlatform.getToolsOrgUnitsOrgUnitIdToolNames': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/tools/orgUnits/(orgUnitId)/toolNames: Retrieve the current id and localized name information for all tools enabled for\nthe provided org unit, including restricted tools. Official reference: https://docs.valence.desire2learn.com/res/tools.html#get--d2l-api-lp-(version)-tools-orgUnits-(orgUnitId)-toolNames',
	},
	'learningPlatform.getUsers': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/: Retrieve data for one or more users. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-',
	},
	'learningPlatform.postUsers': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/users/: Create a new user entity. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-users-',
	},
	'learningPlatform.deleteUsersUserId': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/users/(userId): Delete a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-users-(userId)',
	},
	'learningPlatform.getUsersUserId': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/(userId): Retrieve data for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-(userId)',
	},
	'learningPlatform.putUsersUserId': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/users/(userId): Update data for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-users-(userId)',
	},
	'learningPlatform.getUsersUserIdActivation': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/(userId)/activation: Retrieve a particular userÃ¢Â€Â™s activation settings. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-(userId)-activation',
	},
	'learningPlatform.putUsersUserIdActivation': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/users/(userId)/activation: Update a particular userÃ¢Â€Â™s activation settings. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-users-(userId)-activation',
	},
	'learningPlatform.getUsersUserIdEnrollmentlogs': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/(userId)/enrollmentlogs/: Retrieve a paged list of enrollment logs for a particular user,\noptionally filtered by time window, org unit, and org unit type. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-(userId)-enrollmentlogs-',
	},
	'learningPlatform.getUsersUserIdNames': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/(userId)/names: Retrieve legal, preferred, and sort names for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-(userId)-names',
	},
	'learningPlatform.putUsersUserIdNames': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/users/(userId)/names: Update legal, preferred, and sort name data for a particular user. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-users-(userId)-names',
	},
	'learningPlatform.deleteUsersUserIdPassword': {
		riskLevel: 'destructive',
		description:
			'DELETE /d2l/api/lp/(version)/users/(userId)/password: Clear a particular userÃ¢Â€Â™s password. Official reference: https://docs.valence.desire2learn.com/res/user.html#delete--d2l-api-lp-(version)-users-(userId)-password',
	},
	'learningPlatform.postUsersUserIdPassword': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/users/(userId)/password: Send a particular user a password reset email. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-users-(userId)-password',
	},
	'learningPlatform.putUsersUserIdPassword': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/users/(userId)/password: Update a particular userÃ¢Â€Â™s password. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-users-(userId)-password',
	},
	'learningPlatform.getUsersUserIdUsertrackinglogs': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/(userId)/usertrackinglogs/: Retrieve the successful login history for a particular user, within a\nspecified time window. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-(userId)-usertrackinglogs-',
	},
	'learningPlatform.postUsersBatch': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/users/batch/: Create a batch of new user entities. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-users-batch-',
	},
	'learningPlatform.postUsersMerge': {
		riskLevel: 'write',
		description:
			'POST /d2l/api/lp/(version)/users/merge: Submit a request to merge two users. Official reference: https://docs.valence.desire2learn.com/res/user.html#post--d2l-api-lp-(version)-users-merge',
	},
	'learningPlatform.getUsersMypronouns': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/mypronouns: Retrieve the current userÃ¢Â€Â™s pronoun choices. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-mypronouns',
	},
	'learningPlatform.putUsersMypronouns': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/users/mypronouns: Update the current userÃ¢Â€Â™s pronoun choices. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-users-mypronouns',
	},
	'learningPlatform.getUsersMypronounsVisibility': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/mypronouns/visibility: Retrieve the current userÃ¢Â€Â™s pronoun visilbity preference. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-mypronouns-visibility',
	},
	'learningPlatform.putUsersMypronounsVisibility': {
		riskLevel: 'write',
		description:
			'PUT /d2l/api/lp/(version)/users/mypronouns/visibility: Update the current userÃ¢Â€Â™s pronoun visilbity preference. Official reference: https://docs.valence.desire2learn.com/res/user.html#put--d2l-api-lp-(version)-users-mypronouns-visibility',
	},
	'learningPlatform.getUsersRolesStatistics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/roles/statistics: Retrieve per-role user enrollment statistics at the organization level. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-roles-statistics',
	},
	'learningPlatform.getUsersStatistics': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/statistics: Retrieve aggregate user statistics for the organization. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-statistics',
	},
	'learningPlatform.getUsersWhoami': {
		riskLevel: 'read',
		description:
			'GET /d2l/api/lp/(version)/users/whoami: Retrieve the current user contextÃ¢Â€Â™s user information. Official reference: https://docs.valence.desire2learn.com/res/user.html#get--d2l-api-lp-(version)-users-whoami',
	},
};

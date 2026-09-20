import { defineOp } from './factory';

export const listCampaigns = defineOp('listEmailCampaigns');
export const getSenderDetails = defineOp('getSenderDetails');
export const deleteSenderDetails = defineOp('deleteSenderDetails');
export const deleteSenderEmail = defineOp('deleteSenderEmail');
export const updateReferralProgram = defineOp('updateReferralProgram');
export const getCurrentMemberCoupons = defineOp('getCurrentMemberCoupons');
export const deleteLoyaltyCoupon = defineOp('deleteLoyaltyCoupon');
export const enablePointsExpiration = defineOp('enablePointsExpiration');
export const queryLoyaltyCheckoutDiscounts = defineOp(
	'queryLoyaltyCheckoutDiscounts',
);

export const MarketingEndpoints = {
	listCampaigns,
	getSenderDetails,
	deleteSenderDetails,
	deleteSenderEmail,
	updateReferralProgram,
	getCurrentMemberCoupons,
	deleteLoyaltyCoupon,
	enablePointsExpiration,
	queryLoyaltyCheckoutDiscounts,
} as const;

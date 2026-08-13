import { getBusinessProfile, getPhoneNumber } from './account';
import { markRead, send } from './messages';

export const Messages = { send, markRead };
export const PhoneNumbers = { get: getPhoneNumber };
export const BusinessProfiles = { get: getBusinessProfile };

export * from './types';

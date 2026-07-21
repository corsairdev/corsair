import type { PickAuth } from '../constants';

// 'managed' must be assignable wherever 'oauth_2' is offered.
const managed: PickAuth<'oauth_2'> = 'managed';
const oauth: PickAuth<'oauth_2'> = 'oauth_2';
// A non-oauth plugin's auth set must NOT gain 'managed'.
// @ts-expect-error bot_token plugins are not managed-capable
const bad: PickAuth<'bot_token'> = 'managed';

// ponytail: pure compile-time check; no runtime needed
void [managed, oauth, bad];

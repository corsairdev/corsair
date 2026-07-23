# @corsair-dev/linkedin

LinkedIn plugin for Corsair. Covers member profile, posts and shares,
comments, reactions, media (images and videos), organization pages, and
the Ads targeting/audience APIs.

## Authentication

The plugin uses **OAuth 2.0** (`oauth_2`) against LinkedIn.

1. Create an app at the
   [LinkedIn Developer Portal](https://developer.linkedin.com/) and add
   your Corsair callback URL as an authorized redirect URL.
2. Request the products your use case needs (e.g. _Sign In with
   LinkedIn_, _Share on LinkedIn_, _Community Management API_,
   _Advertising API_). Scopes are only grantable once the matching
   product is approved for the app.
3. Supply the client ID and secret to Corsair. The OAuth flow requests
   these scopes: `openid`, `profile`, `email`, `r_basicprofile`,
   `r_member_social`, `w_member_social`, `r_organization_social`,
   `w_organization_social`, `rw_organization_admin`,
   `r_organization_admin`, `r_organization_relationships`, `r_ads`,
   `rw_ads`, `r_1st_connections_size`.

Access tokens are refreshed proactively before expiry, rotated refresh
tokens are persisted, and requests are retried once on a 401 with a
force-refreshed token.

## Endpoints

22 operations across these domains:

| Domain          | Operations                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `profile`       | `getMyInfo`, `getPerson`                                                                               |
| `posts`         | `createPost`, `createArticleShare`, `getPostContent`, `deletePost`, `deleteSharePost`, `deleteUgcPost` |
| `comments`      | `createComment`                                                                                        |
| `reactions`     | `listReactions`                                                                                        |
| `images`        | `initializeImageUpload`, `registerImageUpload`, `getImage`, `getImages`                                |
| `videos`        | `getVideos`                                                                                            |
| `organizations` | `getCompanyInfo`, `getNetworkSize`, `getOrgPageStats`, `getShareStats`                                 |
| `ads`           | `getAdTargetingFacets`, `getAudienceCounts`, `searchAdTargetingEntities`                               |

## Webhooks

LinkedIn does not offer self-serve webhooks for these surfaces; this
plugin does not register any webhook handlers.

## Provider quirks

- LinkedIn has two API surfaces: the legacy `/v2` endpoints and the
  versioned `/rest` endpoints. The client sends
  `X-Restli-Protocol-Version: 2.0.0` everywhere and a
  `LinkedIn-Version` header on versioned REST calls.
- Entities are addressed by URNs (`urn:li:person:...`,
  `urn:li:share:...`, `urn:li:organization:...`); URNs inside request
  paths must be URL-encoded, which the endpoints handle internally.
- Comment creation requires an `actor` URN and a `message` object (not
  a plain string) per the Social Actions API.
- Media uploads are two-step: initialize/register the upload to get an
  upload URL, then upload the binary to that URL.
- Most organization and ads endpoints additionally require the app to be
  granted the corresponding LinkedIn products; without them LinkedIn
  returns 403 regardless of the OAuth scopes requested.

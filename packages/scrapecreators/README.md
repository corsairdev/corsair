# @corsair-dev/scrapecreators

ScrapeCreators plugin for Corsair: public social media data from TikTok, Instagram, YouTube, X, Reddit, LinkedIn, Facebook and 20 more platforms.

## Install

```bash
pnpm add @corsair-dev/scrapecreators
```

## How it is built

The 198 operations come from ScrapeCreators' published OpenAPI spec
(https://docs.scrapecreators.com/openapi.json, fetched 2026-11-27), one per
route, `v1`, `v2` and `v3` included:

- `scrapecreators-manifest.json` holds each route's path, query parameters and
  the top-level fields of its documented response.
- `endpoints/operation-types.ts` and `endpoints/catalog.ts` are generated from
  the same spec: input and output types, the endpoint tree and descriptions.
- Zod schemas are built from the manifest on first use, one operation at a
  time (`endpoints/schemas.ts`), so loading the plugin stays cheap.

Inputs follow the spec's query parameters exactly (required fields, enums, no
unknown keys). Every route is a `GET`. Meta Ad Library search, Meta company ads
and Reddit comments also take a JSON `POST` body; the plugin switches to it
only when a pagination cursor makes the query string longer than 2,000
characters. The spec documents responses by example only, so each response
checks the kind of the top-level fields the example shows (object, list,
scalar), every field may be missing or `null`, and unknown fields pass through.

Every data response reports `credits_charged` (0 for cache hits and errors;
some routes also charge nothing for an empty page). With
`authType: 'managed_pricing'` the call runs on Corsair's ScrapeCreators account:
responses and errors leave out `credits_remaining`, and the `account.*`
operations, which read the account behind the key, are refused. Managed pricing
works once Hub offers ScrapeCreators; until then, use your own key
(`authType: 'api_key'`).

Left out: routes the docs still list but the API refuses (Reddit Ad Library,
TikTok popular songs and videos, Instagram reels by song).

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.apiUsage` | `scrapecreators.api.account.apiUsage` | `read` | Returns a paginated list of your API requests, including the endpoint called, status code, credits used, and timestamp |
| `account.creditBalance` | `scrapecreators.api.account.creditBalance` | `read` | Returns your remaining credits in creditCount |
| `account.dailyUsageCount` | `scrapecreators.api.account.dailyUsageCount` | `read` | Returns aggregated daily usage statistics for the last 30 days, including total credits consumed and number of requests per day |
| `account.mostUsedRoutes` | `scrapecreators.api.account.mostUsedRoutes` | `read` | Returns your top 20 most called API endpoints ranked by call count, along with total credits consumed per endpoint |
| `amazon.shop` | `scrapecreators.api.amazon.shop` | `read` | Scrapes a creator's Amazon Shop page by URL, returning their storefront profile and product collections |
| `appleMusic.album` | `scrapecreators.api.appleMusic.album` | `read` | Retrieves public Apple Music album details, including title, artist, artwork, release info, tracks, and more by the artist |
| `appleMusic.artist` | `scrapecreators.api.appleMusic.artist` | `read` | Retrieves public Apple Music artist details, including artwork, editorial notes, top songs, albums, music videos, playlists, and related sections |
| `appleMusic.search` | `scrapecreators.api.appleMusic.search` | `read` | Searches Apple Music and returns public result sections for artists, albums, songs, playlists, stations, and music videos |
| `appleMusic.track` | `scrapecreators.api.appleMusic.track` | `read` | Retrieves public Apple Music song details by id or URL |
| `bluesky.post` | `scrapecreators.api.bluesky.post` | `read` | Fetches a single Bluesky post by URL, returning the post's record text, author info, embed content, replyCount, repostCount, likeCount, and quoteCount |
| `bluesky.profile` | `scrapecreators.api.bluesky.profile` | `read` | Retrieves a Bluesky user's public profile including handle, displayName, avatar, description, followersCount, followsCount, postsCount, createdAt, and... |
| `bluesky.userPosts` | `scrapecreators.api.bluesky.userPosts` | `read` | Fetches a paginated feed of posts from a Bluesky user, returning each post's uri, record text, author info, embed content, replyCount, repostCount... |
| `cosmos.cluster` | `scrapecreators.api.cosmos.cluster` | `read` | Get a public Cosmos collection with its owner, description, cover, counts, and public subcollections |
| `cosmos.clusterPosts` | `scrapecreators.api.cosmos.clusterPosts` | `read` | Get public posts saved to a Cosmos collection |
| `cosmos.post` | `scrapecreators.api.cosmos.post` | `read` | Get a public Cosmos post with media URLs, captions, source links, and save count |
| `cosmos.profile` | `scrapecreators.api.cosmos.profile` | `read` | Get a public Cosmos profile with bio, links, and follower counts |
| `cosmos.search` | `scrapecreators.api.cosmos.search` | `read` | Search public Cosmos posts by keyword |
| `cosmos.userClusters` | `scrapecreators.api.cosmos.userClusters` | `read` | Get the public collections owned by a Cosmos user |
| `cosmos.userPosts` | `scrapecreators.api.cosmos.userPosts` | `read` | Get the public posts saved to a Cosmos user profile |
| `creators.detectAgeGender` | `scrapecreators.api.creators.detectAgeGender` | `read` | Uses AI to analyze a creator's profile photo and estimate their age and gender |
| `creators.findEmails` | `scrapecreators.api.creators.findEmails` | `read` | Accepts a supported platform and creator handle, using the same verified social-profile discovery flow as Find Social Profiles |
| `creators.findSocialProfiles` | `scrapecreators.api.creators.findSocialProfiles` | `read` | Accepts a supported platform and creator handle, validates both using platform-specific rules, and constructs the canonical source profile URL internally |
| `facebook.adLibraryAd` | `scrapecreators.api.facebook.adLibraryAd` | `read` | Retrieves detailed information about a specific Facebook ad by its ID or URL |
| `facebook.adLibraryAdTranscript` | `scrapecreators.api.facebook.adLibraryAdTranscript` | `read` | Retrieves a transcript for a Facebook Ad Library video ad by ID or URL |
| `facebook.adLibraryCompanyAds` | `scrapecreators.api.facebook.adLibraryCompanyAds` | `read` | Fetches all ads currently running for a specific company from the Meta Ad Library |
| `facebook.adLibrarySearchAds` | `scrapecreators.api.facebook.adLibrarySearchAds` | `read` | Searches the Meta Ad Library by keyword and returns matching ads |
| `facebook.adLibrarySearchCompanies` | `scrapecreators.api.facebook.adLibrarySearchCompanies` | `read` | Searches for companies by name in the Meta Ad Library and returns their page IDs for use with other ad library endpoints |
| `facebook.eventDetails` | `scrapecreators.api.facebook.eventDetails` | `read` | Get a specific event by its URL or id |
| `facebook.events` | `scrapecreators.api.facebook.events` | `read` | Get the events of a city |
| `facebook.eventsSearch` | `scrapecreators.api.facebook.eventsSearch` | `read` | Search for events by name |
| `facebook.group` | `scrapecreators.api.facebook.group` | `read` | Fetches the public information shown on a Facebook group's About page, including its description, privacy and visibility, member and activity counts... |
| `facebook.groupPosts` | `scrapecreators.api.facebook.groupPosts` | `read` | Fetches posts from a public Facebook group, limited to 3 posts per page due to API limitations |
| `facebook.marketplaceItem` | `scrapecreators.api.facebook.marketplaceItem` | `read` | Fetches details for a Facebook Marketplace item by item id or Marketplace item URL, including title, description, price, location, condition, photos... |
| `facebook.marketplaceLocationSearch` | `scrapecreators.api.facebook.marketplaceLocationSearch` | `read` | Searches Facebook Marketplace locations/cities and returns coordinates you can use with the Marketplace Search endpoint |
| `facebook.marketplaceSearch` | `scrapecreators.api.facebook.marketplaceSearch` | `read` | Search Facebook Marketplace by keyword or browse a supported category without query |
| `facebook.post` | `scrapecreators.api.facebook.post` | `read` | Retrieves a single public Facebook post or reel by URL |
| `facebook.postCommentReplies` | `scrapecreators.api.facebook.postCommentReplies` | `read` | Get the replies to a comment with cursor-based pagination |
| `facebook.postComments` | `scrapecreators.api.facebook.postComments` | `read` | Fetches comments from a Facebook post or reel with cursor-based pagination |
| `facebook.postTranscript` | `scrapecreators.api.facebook.postTranscript` | `read` | Returns the transcript text for a Facebook video post or reel |
| `facebook.profile` | `scrapecreators.api.facebook.profile` | `read` | Retrieves public Facebook page details including category, address, email, phone, website, services, priceRange, rating, likeCount, talkingAboutCount, and... |
| `facebook.profileEvents` | `scrapecreators.api.facebook.profileEvents` | `read` | Get the events of a public Facebook page |
| `facebook.profilePhotos` | `scrapecreators.api.facebook.profilePhotos` | `read` | Fetches photos from a public Facebook page with pagination support |
| `facebook.profilePosts` | `scrapecreators.api.facebook.profilePosts` | `read` | Returns publicly visible Facebook profile posts, limited to 3 posts per page due to API limitations |
| `facebook.profileReels` | `scrapecreators.api.facebook.profileReels` | `read` | Fetches up to 10 reels per request from a public Facebook page |
| `facebook.searchVideos` | `scrapecreators.api.facebook.searchVideos` | `read` | Searches Facebook's native public video search without a logged-in account and returns matching videos and Reels |
| `github.repository` | `scrapecreators.api.github.repository` | `read` | Retrieves public metadata for one GitHub repository, including owner, description, language, stars, forks, topics, license, visibility, default branch, open... |
| `github.trendingDevelopers` | `scrapecreators.api.github.trendingDevelopers` | `read` | Scrapes GitHub's public Trending developers page |
| `github.trendingRepositories` | `scrapecreators.api.github.trendingRepositories` | `read` | Scrapes GitHub's public Trending repositories page |
| `github.user` | `scrapecreators.api.github.user` | `read` | Retrieves public GitHub user details including name, bio, avatar, company, location, blog, follower counts, public repo counts, and account timestamps |
| `github.userActivity` | `scrapecreators.api.github.userActivity` | `read` | Retrieves GitHub profile contribution activity for a user from the public profile activity timeline |
| `github.userContributions` | `scrapecreators.api.github.userContributions` | `read` | Retrieves the public GitHub contribution graph for a user and year, including total contributions and daily contribution counts/intensity |
| `github.userFollowers` | `scrapecreators.api.github.userFollowers` | `read` | Retrieves public GitHub followers for a user |
| `github.userFollowing` | `scrapecreators.api.github.userFollowing` | `read` | Retrieves public accounts followed by a GitHub user |
| `github.userPullRequests` | `scrapecreators.api.github.userPullRequests` | `read` | Searches public GitHub pull requests authored by a user using GitHub's public search index |
| `github.userRepositories` | `scrapecreators.api.github.userRepositories` | `read` | Retrieves a user's public repositories with repo metadata like description, language, stars, forks, topics, license, visibility, default branch, and timestamps |
| `google.ad` | `scrapecreators.api.google.ad` | `read` | Retrieves detailed information about a specific Google ad including advertiserId, creativeId, format, firstShown, lastShown, and overallImpressions |
| `google.adLibrarySearchAdvertisers` | `scrapecreators.api.google.adLibrarySearchAdvertisers` | `read` | Searches the Google Ad Transparency Library for advertisers by name |
| `google.companyAds` | `scrapecreators.api.google.companyAds` | `read` | Fetches public company ads by domain or advertiser_id |
| `google.search` | `scrapecreators.api.google.search` | `read` | Performs a Google search and returns organic results with url, title, and description for each result |
| `instagram.audioReels` | `scrapecreators.api.instagram.audioReels` | `read` | Fetches the reels Instagram exposes for an audio page like instagram.com/reels/audio/{audio_id}/ |
| `instagram.basicProfile` | `scrapecreators.api.instagram.basicProfile` | `read` | Fetches a lightweight Instagram profile summary by user ID, returning username, full name, biography, profile picture URL, verification status, follower... |
| `instagram.mediaTranscript` | `scrapecreators.api.instagram.mediaTranscript` | `read` | Generates AI speech-to-text for an Instagram video post or reel |
| `instagram.post` | `scrapecreators.api.instagram.post` | `read` | Fetches detailed metadata for a single Instagram post or reel by shortcode or URL |
| `instagram.postCommentReplies` | `scrapecreators.api.instagram.postCommentReplies` | `read` | Retrieves the public replies to a specific Instagram comment |
| `instagram.postComments` | `scrapecreators.api.instagram.postComments` | `read` | Retrieves comments on a public Instagram post or reel |
| `instagram.profile` | `scrapecreators.api.instagram.profile` | `read` | After recent Instagram changes, fetching creator metadata and posts requires several requests to Instagram, so this endpoint can be slower |
| `instagram.profilePostCount` | `scrapecreators.api.instagram.profilePostCount` | `read` | Returns the post count shown on a public Instagram profile |
| `instagram.reelsSearch` | `scrapecreators.api.instagram.reelsSearch` | `read` | Use this when you only want Google-indexed Instagram reels matching a keyword or phrase, with optional date filters and pagination |
| `instagram.reelsTrending` | `scrapecreators.api.instagram.reelsTrending` | `read` | Discovers reels through Instagram's public Popular pages and current featured topics, with pagination handled internally |
| `instagram.search` | `scrapecreators.api.instagram.search` | `read` | This route first tries Instagram's anonymous native search |
| `instagram.searchHashtag` | `scrapecreators.api.instagram.searchHashtag` | `read` | Use this when you know the exact hashtag and want Google-indexed public Instagram posts or reels, optional date filters, and pagination |
| `instagram.searchPopular` | `scrapecreators.api.instagram.searchPopular` | `read` | Use this to explore an Instagram topic and the posts Instagram curates for it |
| `instagram.searchProfiles` | `scrapecreators.api.instagram.searchProfiles` | `read` | Use this for Instagram-native profile lookup |
| `instagram.userEmbed` | `scrapecreators.api.instagram.userEmbed` | `read` | Returns the raw HTML embed snippet for an Instagram user's profile widget |
| `instagram.userHighlightDetail` | `scrapecreators.api.instagram.userHighlightDetail` | `read` | Returns a highlight's title, cover URL, user info and available stories from Instagram's public web source |
| `instagram.userHighlights` | `scrapecreators.api.instagram.userHighlights` | `read` | Returns up to 10 story highlight albums visible on Instagram without signing in |
| `instagram.userPosts` | `scrapecreators.api.instagram.userPosts` | `read` | Returns a paginated feed of a user's public Instagram posts, including reels, photos, videos, and carousels |
| `instagram.userReels` | `scrapecreators.api.instagram.userReels` | `read` | Returns a paginated list of a user's public Instagram reels (short-form videos) |
| `instagram.userTaggedPosts` | `scrapecreators.api.instagram.userTaggedPosts` | `read` | Returns up to 10 public posts per page from an Instagram user's Tagged tab |
| `kick.clip` | `scrapecreators.api.kick.clip` | `read` | Fetches detailed data for a Kick clip by URL, including video, metadata, and channel info |
| `kick.clipTranscript` | `scrapecreators.api.kick.clipTranscript` | `read` | Gets a transcript from a public Kick clip |
| `kwai.post` | `scrapecreators.api.kwai.post` | `read` | Fetches public Kwai post details including caption, media URLs, cover images, counts, author info, and music metadata |
| `kwai.profile` | `scrapecreators.api.kwai.profile` | `read` | Fetches public Kwai profile data including username, bio, avatar, verification status, gender, and public counts |
| `kwai.userPosts` | `scrapecreators.api.kwai.userPosts` | `read` | Fetches a paginated list of public Kwai posts for a user, including captions, media URLs, covers, counts, author info, and the next cursor when more results... |
| `linkedin.ad` | `scrapecreators.api.linkedin.ad` | `read` | Retrieves detailed information about a specific LinkedIn ad by URL |
| `linkedin.adsSearch` | `scrapecreators.api.linkedin.adsSearch` | `read` | Searches the LinkedIn Ad Library by company name, keyword, or companyId with optional country and date filters |
| `linkedin.company` | `scrapecreators.api.linkedin.company` | `read` | Fetches a LinkedIn company page with details including name, description, logo, cover image, slogan, location, headquarters, employee count (headcount/staff... |
| `linkedin.companyPosts` | `scrapecreators.api.linkedin.companyPosts` | `read` | Retrieves paginated posts from a LinkedIn company or school page, including each post's URL, ID, publication date, and full text content |
| `linkedin.job` | `scrapecreators.api.linkedin.job` | `read` | Fetches one job from LinkedIn's public guest listings |
| `linkedin.post` | `scrapecreators.api.linkedin.post` | `read` | Fetches a single LinkedIn post or article, returning the title, headline, full description text, author info with follower count, publication date, like... |
| `linkedin.postTranscript` | `scrapecreators.api.linkedin.postTranscript` | `read` | Fetches the transcript from a LinkedIn post video when LinkedIn exposes one publicly |
| `linkedin.profile` | `scrapecreators.api.linkedin.profile` | `read` | Retrieves a person's public LinkedIn profile data, including their name, photo, location, follower count (followers), about/bio summary, recent posts, work... |
| `linkedin.searchJobs` | `scrapecreators.api.linkedin.searchJobs` | `read` | Searches LinkedIn's native public guest jobs listings without login |
| `linkedin.searchPosts` | `scrapecreators.api.linkedin.searchPosts` | `read` | Finds public LinkedIn posts, feed updates, and Pulse articles by keyword using Google Search, then returns post details such as description, author, media... |
| `linkInBio.komi` | `scrapecreators.api.linkInBio.komi` | `read` | Scrapes a Komi page by URL, extracting the creator's profile, social links, and featured content |
| `linkInBio.linkbio` | `scrapecreators.api.linkInBio.linkbio` | `read` | Scrapes a Linkbio (lnk.bio) page by URL, extracting the creator's profile and all their links |
| `linkInBio.linkme` | `scrapecreators.api.linkInBio.linkme` | `read` | Retrieves a Linkme profile by URL, including identity, social links, and contact details |
| `linkInBio.linktree` | `scrapecreators.api.linkInBio.linktree` | `read` | Scrapes a Linktree page by URL, extracting the creator's profile and all their links |
| `linkInBio.pillar` | `scrapecreators.api.linkInBio.pillar` | `read` | Scrapes a Pillar page by URL, extracting the creator's profile, social links, and products |
| `pinterest.board` | `scrapecreators.api.pinterest.board` | `read` | Fetches a paginated list of pins from a Pinterest board by URL, returning each pin's id, description, title, images, board info, pin_join annotations, and... |
| `pinterest.pin` | `scrapecreators.api.pinterest.pin` | `read` | Fetches detailed information about a single Pinterest pin by URL, returning title, description, link, dominantColor, originPinner, pinner, images at... |
| `pinterest.search` | `scrapecreators.api.pinterest.search` | `read` | Searches Pinterest for pins matching a query, returning results with id, url, title, description, images, link, domain, board info, and pinner details |
| `pinterest.topic` | `scrapecreators.api.pinterest.topic` | `read` | Retrieves a public Pinterest topic by its ideas URL, returning id, name, url, search_count, updated_at, and refinements in the normal success envelope |
| `pinterest.userBoards` | `scrapecreators.api.pinterest.userBoards` | `read` | Fetches a paginated list of boards for a Pinterest user, returning each board's name, url, description, pin_count, follower_count, owner info, cover_images... |
| `reddit.post` | `scrapecreators.api.reddit.post` | `read` | Retrieves public Reddit post details by URL without fetching or returning comments |
| `reddit.postComments` | `scrapecreators.api.reddit.postComments` | `read` | Retrieves comments and post details from a Reddit post by URL |
| `reddit.postTranscript` | `scrapecreators.api.reddit.postTranscript` | `read` | Gets the transcript from a Reddit video post or direct v.redd.it URL when Reddit exposes a VTT caption file |
| `reddit.search` | `scrapecreators.api.reddit.search` | `read` | Searches across all of Reddit for posts or comments matching a query |
| `reddit.subreddit` | `scrapecreators.api.reddit.subreddit` | `read` | Fetches posts from a subreddit with sorting and filtering options |
| `reddit.subredditDetails` | `scrapecreators.api.reddit.subredditDetails` | `read` | Retrieves metadata about a subreddit by name or URL |
| `reddit.subredditSearch` | `scrapecreators.api.reddit.subredditSearch` | `read` | Searches within a specific subreddit for posts, comments, and media matching a query |
| `rumble.channelVideos` | `scrapecreators.api.rumble.channelVideos` | `read` | Gets videos from a Rumble channel by handle or URL |
| `rumble.search` | `scrapecreators.api.rumble.search` | `read` | Searches Rumble videos by keyword |
| `rumble.video` | `scrapecreators.api.rumble.video` | `read` | Gets Rumble video details by URL |
| `rumble.videoComments` | `scrapecreators.api.rumble.videoComments` | `read` | Gets all top level comments for a Rumble video by URL |
| `rumble.videoTranscript` | `scrapecreators.api.rumble.videoTranscript` | `read` | Gets a Rumble video's transcript when captions are available |
| `snapchat.profile` | `scrapecreators.api.snapchat.profile` | `read` | Retrieves a Snapchat user's public profile, available story snaps, curated highlights, and Spotlight content by handle |
| `snapchat.spotlight` | `scrapecreators.api.snapchat.spotlight` | `read` | Fetches public data for a Snapchat Spotlight video by URL |
| `snapchat.spotlightComments` | `scrapecreators.api.snapchat.spotlightComments` | `read` | Fetches public comments from Snapchat's Spotlight comments API by URL |
| `soundcloud.artist` | `scrapecreators.api.soundcloud.artist` | `read` | Fetches detailed information about a SoundCloud artist by its handle or URL |
| `soundcloud.artistTracks` | `scrapecreators.api.soundcloud.artistTracks` | `read` | Fetches tracks/songs for a SoundCloud artist by handle or URL |
| `soundcloud.track` | `scrapecreators.api.soundcloud.track` | `read` | Fetches detailed information about a SoundCloud track/song by URL |
| `spotify.album` | `scrapecreators.api.spotify.album` | `read` | Retrieves detailed information about a Spotify album by its id or URL, including album metadata, artists, release date, cover art, copyright info, tracks... |
| `spotify.artist` | `scrapecreators.api.spotify.artist` | `read` | Retrieves detailed information about a Spotify artist by their handle, including name, followers count, genres, and related artists |
| `spotify.playlist` | `scrapecreators.api.spotify.playlist` | `read` | Retrieves public Spotify playlist metadata and up to 50 tracks by playlist id or URL |
| `spotify.podcast` | `scrapecreators.api.spotify.podcast` | `read` | Retrieves detailed information about a Spotify podcast by its id or URL |
| `spotify.podcastEpisodes` | `scrapecreators.api.spotify.podcastEpisodes` | `read` | Returns episodes for a Spotify podcast |
| `spotify.search` | `scrapecreators.api.spotify.search` | `read` | Search Spotify for tracks, artists, albums, episodes, podcasts, and audiobooks |
| `spotify.track` | `scrapecreators.api.spotify.track` | `read` | Retrieves detailed information about a Spotify track by its id or URL, including track metadata, artists, album info, duration, playability, and sharing details |
| `telegram.channel` | `scrapecreators.api.telegram.channel` | `read` | Retrieves public Telegram channel or group metadata including its name, description, avatar, verification status, subscriber or member count, and public... |
| `telegram.channelPosts` | `scrapecreators.api.telegram.channelPosts` | `read` | Retrieves one public web-preview page of Telegram posts with text, publish date, views, reactions when exposed, forwards, media previews, and link previews |
| `telegram.post` | `scrapecreators.api.telegram.post` | `read` | Retrieves one public Telegram post with its text, publish date, views, reactions when exposed, forward source, media previews, and link preview |
| `threads.post` | `scrapecreators.api.threads.post` | `read` | Fetches a single Threads post by URL, returning the post's caption, like_count, view_counts, reshare_count, direct_reply_count, image_versions2... |
| `threads.profile` | `scrapecreators.api.threads.profile` | `read` | Retrieves a Threads user's public profile including username, full_name, biography, profile_pic_url, follower_count, is_verified, bio_links, and... |
| `threads.search` | `scrapecreators.api.threads.search` | `read` | Searches Threads for posts matching a keyword, returning up to 10 results with caption text, like_count, reshare_count, direct_reply_count, user info, and... |
| `threads.searchUsers` | `scrapecreators.api.threads.searchUsers` | `read` | Searches for Threads users by username, returning matching profiles with username, full_name, profile_pic_url, is_verified, and pk |
| `threads.userPosts` | `scrapecreators.api.threads.userPosts` | `read` | Fetches the most recent posts from a Threads user, returning id, caption text, code, like_count, reshare_count, direct_reply_count, repost_count... |
| `tiktok.adLibraryAd` | `scrapecreators.api.tiktok.adLibraryAd` | `read` | Fetches one TikTok ad by ID or URL |
| `tiktok.adLibrarySearch` | `scrapecreators.api.tiktok.adLibrarySearch` | `read` | Searches TikTok's public Ads Library using either query for a general search or advertiser_name for advertiser-specific results |
| `tiktok.collectionVideos` | `scrapecreators.api.tiktok.collectionVideos` | `read` | Fetches the videos saved in a public TikTok collection, which TikTok also calls a playlist |
| `tiktok.live` | `scrapecreators.api.tiktok.live` | `read` | Gets curated room-level info for a TikTok live from TikTok's public live-room source |
| `tiktok.product` | `scrapecreators.api.tiktok.product` | `read` | Fetches full details for a specific US TikTok Shop product by its URL, including stock levels and affiliate videos |
| `tiktok.profile` | `scrapecreators.api.tiktok.profile` | `read` | Fetches public profile data for a TikTok user by their handle or user_id |
| `tiktok.profileRegion` | `scrapecreators.api.tiktok.profileRegion` | `read` | Returns the TikTok region code for a public profile, like `US` for United States or `MX` for Mexico |
| `tiktok.profileVideos` | `scrapecreators.api.tiktok.profileVideos` | `read` | Fetches videos posted by a TikTok user, sortable by latest or most popular |
| `tiktok.searchHashtag` | `scrapecreators.api.tiktok.searchHashtag` | `read` | Searches for TikTok videos under a specific hashtag |
| `tiktok.searchKeyword` | `scrapecreators.api.tiktok.searchKeyword` | `read` | Searches for TikTok videos by keyword or phrase |
| `tiktok.searchSuggestions` | `scrapecreators.api.tiktok.searchSuggestions` | `read` | Gets the autocomplete suggestions TikTok shows while someone is typing in search |
| `tiktok.searchTop` | `scrapecreators.api.tiktok.searchTop` | `read` | Searches TikTok's 'Top' results by query |
| `tiktok.searchUsers` | `scrapecreators.api.tiktok.searchUsers` | `read` | Searches for TikTok users by keyword or name |
| `tiktok.shopProductReviews` | `scrapecreators.api.tiktok.shopProductReviews` | `read` | Fetches customer reviews for a TikTok Shop product by URL or product_id |
| `tiktok.shopProducts` | `scrapecreators.api.tiktok.shopProducts` | `read` | Lists all products from a specific TikTok Shop store by its URL |
| `tiktok.shopSearch` | `scrapecreators.api.tiktok.shopSearch` | `read` | Searches TikTok Shop for products matching a keyword query |
| `tiktok.song` | `scrapecreators.api.tiktok.song` | `read` | Fetches detailed metadata for a specific TikTok sound or song by its clipId |
| `tiktok.songVideos` | `scrapecreators.api.tiktok.songVideos` | `read` | Fetches TikTok videos that use a specific sound or song, identified by its clipId |
| `tiktok.trendingFeed` | `scrapecreators.api.tiktok.trendingFeed` | `read` | Fetches TikTok's trending/For You feed for a given region |
| `tiktok.userAudience` | `scrapecreators.api.tiktok.userAudience` | `read` | Retrieves audience demographic data for a TikTok user, showing where their followers are located by country |
| `tiktok.userFollowers` | `scrapecreators.api.tiktok.userFollowers` | `read` | Retrieves the follower list of a TikTok account by handle or user_id |
| `tiktok.userFollowing` | `scrapecreators.api.tiktok.userFollowing` | `read` | Retrieves the following list |
| `tiktok.userLive` | `scrapecreators.api.tiktok.userLive` | `read` | Checks a TikTok user's live status and retrieves available live room details |
| `tiktok.userShowcase` | `scrapecreators.api.tiktok.userShowcase` | `read` | Fetches products featured in a TikTok user's public showcase |
| `tiktok.video` | `scrapecreators.api.tiktok.video` | `read` | Fetches detailed data for a single TikTok video by URL, including its metadata, engagement stats, and optionally its transcript/captions |
| `tiktok.videoCommentReplies` | `scrapecreators.api.tiktok.videoCommentReplies` | `read` | Fetches replies to a specific TikTok comment by its ID |
| `tiktok.videoComments` | `scrapecreators.api.tiktok.videoComments` | `read` | Fetches comments on a TikTok video by URL |
| `tiktok.videoTranscript` | `scrapecreators.api.tiktok.videoTranscript` | `read` | Extracts existing transcripts, captions, or subtitles from a TikTok video by URL |
| `truthSocial.post` | `scrapecreators.api.truthSocial.post` | `read` | Fetches a single Truth Social post by URL, returning text, id, created_at, url, content, account details, media_attachments, card link previews... |
| `truthSocial.profile` | `scrapecreators.api.truthSocial.profile` | `read` | Retrieves a Truth Social user's public profile including display_name, username, avatar, header, followers_count, following_count, statuses_count, verified... |
| `truthSocial.userPosts` | `scrapecreators.api.truthSocial.userPosts` | `read` | Fetches a paginated list of posts from a Truth Social user, returning text, id, created_at, url, content, account info, media_attachments, card link... |
| `twitch.clip` | `scrapecreators.api.twitch.clip` | `read` | Fetches detailed data for a Twitch clip by URL, including metadata and direct video URLs |
| `twitch.clipTranscript` | `scrapecreators.api.twitch.clipTranscript` | `read` | Gets a transcript from a public Twitch clip |
| `twitch.profile` | `scrapecreators.api.twitch.profile` | `read` | Retrieves a Twitch user's public profile by handle, including identity, social links, and content |
| `twitch.userSchedule` | `scrapecreators.api.twitch.userSchedule` | `read` | Fetches a user's schedule by handle, returning a list of scheduled events with start time, end time, title, description, and thumbnail URL |
| `twitch.userVideos` | `scrapecreators.api.twitch.userVideos` | `read` | Fetches a list of videos (100 max) for a Twitch user, returning each video's id, slug, url, embedURL, title, viewCount, language, durationSeconds, game... |
| `twitter.community` | `scrapecreators.api.twitter.community` | `read` | Retrieves details about a Twitter/X Community by URL |
| `twitter.communityTweets` | `scrapecreators.api.twitter.communityTweets` | `read` | Fetches tweets posted within a Twitter/X Community by URL |
| `twitter.profile` | `scrapecreators.api.twitter.profile` | `read` | Retrieves a Twitter user's profile by handle, including account metadata and statistics |
| `twitter.searchPosts` | `scrapecreators.api.twitter.searchPosts` | `read` | Finds public X/Twitter post URLs through Google Search, then returns their details using the same public post scraper as /v1/twitter/tweet |
| `twitter.tweet` | `scrapecreators.api.twitter.tweet` | `read` | Retrieves detailed information about a specific tweet by URL, including the author's profile and engagement metrics |
| `twitter.tweetTranscript` | `scrapecreators.api.twitter.tweetTranscript` | `read` | Extracts an AI transcript from a Twitter video tweet |
| `twitter.userTweets` | `scrapecreators.api.twitter.userTweets` | `read` | Fetches tweets from a Twitter user's profile by handle |
| `youtube.channel` | `scrapecreators.api.youtube.channel` | `read` | Retrieves comprehensive YouTube channel profile data including name, avatar images, subscriber count (subscribers), total video and view counts, join date... |
| `youtube.channelCommunityPosts` | `scrapecreators.api.youtube.channelCommunityPosts` | `read` | Fetches community posts from a YouTube channel's Posts tab, including post ID, URL, content, images, attached video, like count, publish time, channel info... |
| `youtube.channelLives` | `scrapecreators.api.youtube.channelLives` | `read` | Fetches live streams and past streams from a YouTube channel's Live tab, including title, URL, thumbnail, view count, publish time, duration, and a... |
| `youtube.channelPlaylists` | `scrapecreators.api.youtube.channelPlaylists` | `read` | Fetches playlists from a YouTube channel's Playlists tab, including playlist ID, title, thumbnail, video count, channel info, playlist URL, and a... |
| `youtube.channelSearch` | `scrapecreators.api.youtube.channelSearch` | `read` | Search within one YouTube channel using YouTube's native channel search, not global search or local filtering of the channel's latest videos |
| `youtube.channelShorts` | `scrapecreators.api.youtube.channelShorts` | `read` | Retrieves a paginated list of short-form videos (Shorts) from a YouTube channel, including each short's title, URL, view count (views), likes, comments... |
| `youtube.channelVideos` | `scrapecreators.api.youtube.channelVideos` | `read` | Fetches a paginated list of videos uploaded by a YouTube channel, including each video's title, URL, thumbnail, view count (views), publish date, duration... |
| `youtube.communityPost` | `scrapecreators.api.youtube.communityPost` | `read` | Retrieves the full details of a YouTube community post, including its text content, attached images, like count, publish date, and associated channel info |
| `youtube.playlist` | `scrapecreators.api.youtube.playlist` | `read` | Retrieves a page of videos in a YouTube playlist, including each video's title, URL, thumbnail, duration, and channel |
| `youtube.search` | `scrapecreators.api.youtube.search` | `read` | Searches YouTube by keyword query and returns matching videos, channels, playlists, shorts, shelves, and live streams |
| `youtube.searchHashtag` | `scrapecreators.api.youtube.searchHashtag` | `read` | Searches YouTube for content matching a specific hashtag and returns matching videos with title, URL, thumbnail, view count (views), publish date, duration... |
| `youtube.searchTypeahead` | `scrapecreators.api.youtube.searchTypeahead` | `read` | Returns the live search suggestions YouTube displays while a user types |
| `youtube.shortsTrending` | `scrapecreators.api.youtube.shortsTrending` | `read` | Fetches approximately 48 currently trending YouTube Shorts (viral/popular short-form videos) per call, returning each short's title, URL, thumbnail, view... |
| `youtube.video` | `scrapecreators.api.youtube.video` | `read` | Fetches full details for a YouTube video or short, including title, description, thumbnail, view count (views), like count (likes), comment count, publish... |
| `youtube.videoCommentReplies` | `scrapecreators.api.youtube.videoCommentReplies` | `read` | Fetches replies to a specific comment on a YouTube video, including each reply's text content, author details (name, channel ID, avatar, verified/creator... |
| `youtube.videoComments` | `scrapecreators.api.youtube.videoComments` | `read` | Fetches comments and replies from a YouTube video, including each comment's text content, author details, like count, reply count, and publish date |
| `youtube.videoSponsors` | `scrapecreators.api.youtube.videoSponsors` | `read` | Experimental endpoint |
| `youtube.videoTranscript` | `scrapecreators.api.youtube.videoTranscript` | `read` | Retrieves publicly available captions, subtitles, or transcripts from a YouTube video or Short |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/scrapecreators

## License

Apache-2.0

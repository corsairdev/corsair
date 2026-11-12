# DocsBot AI contract and scope

This plugin implements 34 of the 38 actions in the DocsBot AI catalogue. The
four webhook delivery tests (`deliver-lead`, `deliver-research`,
`deliver-escalated`, and `deliver-rated`) are not implemented: DocsBot's
[webhook documentation](https://docsbot.ai/documentation/developer/webhooks-api)
lists their POST paths but does not define request bodies or response shapes.
The catalogue's team and bot inputs do not establish those wire contracts. Do
not assume an empty request or fabricate a response; obtain provider guidance
or verified examples before adding them.

Admin operations use bearer API-key authentication at `https://docsbot.ai/api`.
Search, lead capture, answer rating, and ticket generation use
`https://api.docsbot.ai`; authentication depends on bot privacy and operation.
The upload operation currently takes a `Uint8Array`, so it is intended for the
TypeScript/JavaScript API rather than JSON-only transports.
The signed storage URL returned by the admin API is a separate credential: file
bytes are PUT to it without the DocsBot API key or redirects.

The provider also documents endpoints outside the catalogue, including team
invitations, source tagging and downloads, research details, lead exports,
document fetch, and conversation escalation. They are outside this integration's
requested catalogue scope. Webhook subscriptions manage outbound deliveries;
inbound receiving and signature verification are intentionally not implemented.

Provider references: [teams](https://docsbot.ai/documentation/developer/team-api),
[team members](https://docsbot.ai/documentation/developer/team-members-api),
[bots](https://docsbot.ai/documentation/developer/bot-api),
[sources and uploads](https://docsbot.ai/documentation/developer/source-api),
[questions](https://docsbot.ai/documentation/developer/questions-api),
[conversations](https://docsbot.ai/documentation/developer/conversations-api),
[leads](https://docsbot.ai/documentation/developer/leads-api),
[research](https://docsbot.ai/documentation/developer/bot-research-api),
[statistics](https://docsbot.ai/documentation/developer/stats-api),
[search](https://docsbot.ai/documentation/developer/semantic-search-api),
[lead capture](https://docsbot.ai/documentation/developer/conversation-lead),
[tickets](https://docsbot.ai/documentation/developer/conversation-ticket), and
[ratings](https://docsbot.ai/documentation/developer/answer-rating).

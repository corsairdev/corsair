# @corsair-dev/referralrock

Referral program management with Referral Rock - read programs, advocates, referrals and rewards, and create an advocate, a referral or a reward through the Referral Rock API.

## Install

```bash
pnpm add @corsair-dev/referralrock
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `members.create` | `referralrock.api.members.create` | `write` | Add an advocate to a program with their name, email and an optional referral code |
| `members.list` | `referralrock.api.members.list` | `read` | List advocates with program, search, disabled and date filters, plus offset paging |
| `programs.list` | `referralrock.api.programs.list` | `read` | List the referral programs on the account, optionally narrowed to one program id |
| `referrals.create` | `referralrock.api.referrals.create` | `write` | Record a referral against the code of the member who introduced it, with the order amount that reward rules key on |
| `referrals.list` | `referralrock.api.referrals.list` | `read` | List referrals with program, member, status and date filters, plus offset paging |
| `rewards.create` | `referralrock.api.rewards.create` | `write` | Create a pending reward for a member or for a referred person, with its amount and payout |
| `rewards.list` | `referralrock.api.rewards.list` | `read` | List rewards with program, member, status and date filters, plus offset paging |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/referralrock

## License

Apache-2.0

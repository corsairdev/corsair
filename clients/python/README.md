# corsair-cloud

Call a hosted [Corsair Cloud](https://docs.corsair.dev/cloud/overview) project
from Python. No dependencies, Python 3.10+. Corsair runs the integration layer
(OAuth, tokens, the plugins), and you call any operation over HTTP.

## Install

The package is not on PyPI yet. Install it from this repo:

```bash
pip install "corsair-cloud @ git+https://github.com/corsairdev/corsair.git#subdirectory=clients/python"
```

## Use

Grab your API key (`ck_cloud_…`) from your project's Overview page in the
dashboard. The client derives its URL from the key, so it's the only value you
pass. A project has one or more instances, each with its own plugins, tenants
and connected accounts: name the instance, then make a call as one of your
users.

```python
import os
from corsair_cloud import CorsairCloud, CorsairError

corsair = CorsairCloud(api_key=os.environ["CORSAIR_CLOUD_KEY"])
billing = corsair.with_instance("billing")

# Call any operation on any plugin the instance has, as user "acme":
pages = billing.with_tenant("acme").call("notion", "pages.searchPage", {"query": "roadmap"})

# A tenant with two Slack accounts: pick one per plugin.
work = billing.with_tenant("acme", accounts={"slack": "work"})
work.call("slack", "messages.post", {"channel": "#general", "text": "hi"})

# Connect a user's account (send them to the link, then check status):
link = billing.create_connect_link("notion", "acme")   # link["connectUrl"]
status = billing.connection_status("acme")             # {"notion": "connected"}

# Tenants, permissions and disconnects are per instance too:
billing.create_tenant("acme")
billing.tenants()
billing.get_permission("perm_123")
billing.disconnect("notion", "acme")
```

There is no default instance, so adding a second one never reroutes existing
code. The client fetches the project's instance list once and reuses it; a key
it doesn't know triggers one fresh fetch before `UnknownInstanceError`, which
lists the instances that do exist.

Non-2xx responses raise `CorsairError`. Branch on `.code` (`not_connected`,
`provider_error`, and so on); `.status` is the HTTP status, `.retryable` says
whether the same request is safe to repeat, and `.request_id` is worth quoting
when you report a problem.

```python
try:
    billing.with_tenant("acme").call("notion", "pages.searchPage", {})
except CorsairError as e:
    if e.code == "not_connected":
        ...  # send the user through create_connect_link first
```

Full guide: [docs.corsair.dev/clients/python](https://docs.corsair.dev/clients/python).

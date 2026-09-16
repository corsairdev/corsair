# corsair-cloud

Call a hosted [Corsair Cloud](https://docs.corsair.dev/cloud/overview) project
from Python. No dependencies, Python 3.9+. Corsair runs the integration layer
(OAuth, tokens, the plugins), and you call any operation over HTTP.

## Install

```bash
pip install corsair-cloud
```

## Use

Grab two values from your project's Overview page in the dashboard: an API key
(`ck_cloud_…`) and a URL. Then make a call as one of your users.

```python
import os
from corsair_cloud import CorsairCloud, CorsairError

corsair = CorsairCloud(
    api_key=os.environ["CORSAIR_CLOUD_KEY"],
    url=os.environ["CORSAIR_CLOUD_URL"],
)

# Call any operation on any plugin your runtime has, as user "acme":
pages = corsair.with_tenant("acme").call("notion", "pages.searchPage", {"query": "roadmap"})

# Connect a user's account (send them to the link, then check status):
link = corsair.manage.create_connect_link("notion", "acme")
status = corsair.manage.connection_status("acme")   # {"notion": "connected"}
```

Non-2xx responses raise `CorsairError`. Branch on `.code` (`not_connected`,
`provider_error`, and so on); `.status` is the HTTP status.

```python
try:
    corsair.with_tenant("acme").call("notion", "pages.searchPage", {})
except CorsairError as e:
    if e.code == "not_connected":
        ...  # send the user through create_connect_link first
```

Full guide: [docs.corsair.dev/clients/python](https://docs.corsair.dev/clients/python).

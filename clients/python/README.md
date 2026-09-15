# corsair-cloud (Python)

A thin client for a hosted Corsair Cloud project. Mirrors the TS
`createCorsairCloud`: dynamic calls over HTTP — the plugin set lives on the VM.

## Use

Two values from your project's Overview — the key and the URL:

```python
from corsair_cloud import CorsairCloud

corsair = CorsairCloud(
    api_key="ck_cloud_…",
    url="https://<vm>.corsair.cloud/<env>/api/corsair",
)

result = corsair.with_tenant("acme").call("notion", "pages.searchPage", {"query": "hi"})

status = corsair.manage.connection_status("acme")               # {"notion": "connected"}
link = corsair.manage.create_connect_link("notion", "acme")
corsair.manage.disconnect("notion", "acme")
```

Errors raise `CorsairError` (`.code` is the machine code — `not_connected`,
`provider_error`, …; `.status` is the HTTP status).

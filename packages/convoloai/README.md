# @corsair-dev/convoloai

Brightcall External API (formerly Convolo.ai). Base URL `https://app.brightcall.ai`.

## Authentication

Account operations use the `api-key` HTTP header.

`call.trigger`, `widget.updateSettings`, and `getCustomWidgetParams` also take a per-widget `widget_key` and `api_key`. Those are not the same as the account header.

`call.trigger` POSTs `/rest/v1/ext/add_call_api/` with JSON `widget_key`, `api_key`, and `lc_number` (the lead phone). Extra `lc_param_*` fields go in `body`.

## Endpoints

Agents, calls, leads, widgets, custom widget params, and the OpenAPI document. Deletes are destructive. `widget.toggle` `new_state` is `0` or `1`.

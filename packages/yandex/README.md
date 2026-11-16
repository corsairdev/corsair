# @corsair-dev/yandex

Yandex Translate plugin for Corsair - translate passages between languages, detect the language of text, and list the supported languages.

## Install

```bash
pnpm add @corsair-dev/yandex
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `detectLanguages.run` | `yandex.api.detectLanguages.run` | `read` | Detect the language of each passage, one result per entry and in order |
| `listLanguages.run` | `yandex.api.listLanguages.run` | `read` | List the supported languages, with their codes and display names |
| `translate.text` | `yandex.api.translate.text` | `read` | Translate up to 1,000 passages into a target language, detecting the source per passage when it is not given |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/yandex

## License

Apache-2.0

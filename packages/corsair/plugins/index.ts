import { sendMessage } from './slack/operations/send-message'
import type { BaseConfig } from '../config'

export const createPlugins = <T extends BaseConfig>(config: T) => ({
  slack: {
    sendMessage: (params: Parameters<typeof sendMessage<T>>[0]) =>
      sendMessage<T>({ config, ...params }),
  },
  discord: {
    test: () => {},
  },
  resend: {
    test: () => {},
  },
})

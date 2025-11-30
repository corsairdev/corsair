import { sendMessage } from './slack/operations/send-message'
import { replyToThread } from './slack/operations/reply-to-thread'
import { getMessages } from './slack/operations/get-messages'
import { updateMessage } from './slack/operations/update-message'
import { addReaction } from './slack/operations/add-reaction'
import { getChannels } from './slack/operations/get-channels'
import type { BaseConfig } from '../config'

export const createPlugins = <T extends BaseConfig>(config: T) => ({
  slack: {
    sendMessage: (params: Omit<Parameters<typeof sendMessage<T>>[0], 'config'>) =>
      sendMessage<T>({ config, ...params }),

    replyToThread: (params: Omit<Parameters<typeof replyToThread<T>>[0], 'config'>) =>
      replyToThread<T>({ config, ...params }),

    getMessages: (params: Omit<Parameters<typeof getMessages<T>>[0], 'config'>) =>
      getMessages<T>({ config, ...params }),

    updateMessage: (params: Omit<Parameters<typeof updateMessage<T>>[0], 'config'>) =>
      updateMessage<T>({ config, ...params }),

    addReaction: (params: Omit<Parameters<typeof addReaction<T>>[0], 'config'>) =>
      addReaction<T>({ config, ...params }),

    getChannels: (params: Omit<Parameters<typeof getChannels<T>>[0], 'config'>) =>
      getChannels<T>({ config, ...params }),
  },
  discord: {
    test: () => {},
  },
  resend: {
    test: () => {},
  },
})

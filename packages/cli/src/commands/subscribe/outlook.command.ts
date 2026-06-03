import BaseCommand from '../base.command'
import type { CommandActionData } from '../../index.types'
import { runOutlookSubscribe } from '../../lib/microsoft/subscribe-microsoft'

export default class OutlookCommand extends BaseCommand {
  getName(): string {
    return 'outlook';
  }

  getDescription(): string {
    return 'Subscribe Outlook webhooks';
  }

  async action({}: CommandActionData) {
    await runOutlookSubscribe({ cwd: process.cwd() });
  }
}

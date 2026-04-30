export interface CommandOption {
  short: string
  long: string
  description: string
  defaultValue?: string | boolean
  choices?: string[]
}

export interface CommandArgument {
  name: string
  description: string
}

export interface CommandActionData {
  options: Record<string, any> // Any parameters that might be passed to the command
  args: string[] // The arguments passed to the command
}

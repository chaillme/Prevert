export type Busy = boolean

declare module 'claude-code' {
  interface PluginState {
    'improve-prompt': { isBusy: boolean }
  }
}

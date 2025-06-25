interface ViewTransition {
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  finished: Promise<void>
  skipTransition(): void
}

interface Document {
  startViewTransition?: (updateCallback?: () => void | Promise<void>) => ViewTransition
}

interface CSSStyleDeclaration {
  viewTransitionName?: string
}

// Vite environment types
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_APP_URL?: string
  readonly VITE_DEMO_MODE?: string
  readonly VITE_DEMO_EMAIL?: string
  readonly VITE_DEMO_PASSWORD?: string
  readonly VITE_ENABLE_DEBUG?: string
  readonly NODE_ENV: string
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

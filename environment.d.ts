// src/types/environment.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NOTION_TS_CLIENT_NOTION_SECRET: string;
      PORT?: string; // Port is optional, will default to 3000 if not set
      ALLOWED_ORIGINS?: string; // Comma-separated list of origins
    }
  }
}

export {}; // This is needed to make it a module
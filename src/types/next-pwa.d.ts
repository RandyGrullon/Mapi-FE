declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    clientsClaim?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        networkTimeoutSeconds?: number;
        backgroundSync?: {
          name: string;
          options?: {
            maxRetentionTime?: number;
          };
        };
        broadcastUpdate?: {
          channelName?: string;
          options?: {
            headersToCheck?: string[];
          };
        };
        cacheableResponse?: {
          statuses?: number[];
          headers?: {
            [key: string]: string;
          };
        };
        rangeRequests?: boolean;
        plugins?: any[];
      };
    }>;
    buildExcludes?: Array<string | RegExp>;
    subdomainPrefix?: string;
    fallbacks?: {
      [key: string]: string;
    };
  }

  export default function withPWA(
    options?: PWAConfig
  ): (nextConfig: NextConfig) => NextConfig;
}

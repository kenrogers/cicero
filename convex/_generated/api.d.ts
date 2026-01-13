/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as emailer from "../emailer.js";
import type * as http from "../http.js";
import type * as lib_securityLogger from "../lib/securityLogger.js";
import type * as meetings from "../meetings.js";
import type * as paymentAttemptTypes from "../paymentAttemptTypes.js";
import type * as paymentAttempts from "../paymentAttempts.js";
import type * as pipeline from "../pipeline.js";
import type * as scraper from "../scraper.js";
import type * as security from "../security.js";
import type * as seedSecurityEvents from "../seedSecurityEvents.js";
import type * as subscribers from "../subscribers.js";
import type * as summaries from "../summaries.js";
import type * as summarizer from "../summarizer.js";
import type * as transcriber from "../transcriber.js";
import type * as transcriberHelpers from "../transcriberHelpers.js";
import type * as users from "../users.js";
import type * as videoExtractor from "../videoExtractor.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  emailer: typeof emailer;
  http: typeof http;
  "lib/securityLogger": typeof lib_securityLogger;
  meetings: typeof meetings;
  paymentAttemptTypes: typeof paymentAttemptTypes;
  paymentAttempts: typeof paymentAttempts;
  pipeline: typeof pipeline;
  scraper: typeof scraper;
  security: typeof security;
  seedSecurityEvents: typeof seedSecurityEvents;
  subscribers: typeof subscribers;
  summaries: typeof summaries;
  summarizer: typeof summarizer;
  transcriber: typeof transcriber;
  transcriberHelpers: typeof transcriberHelpers;
  users: typeof users;
  videoExtractor: typeof videoExtractor;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

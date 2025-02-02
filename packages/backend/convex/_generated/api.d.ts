/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as credits from "../credits.js";
import type * as email_index from "../email/index.js";
import type * as email_templates_subscriptionEmail from "../email/templates/subscriptionEmail.js";
import type * as env from "../env.js";
import type * as guidedStory from "../guidedStory.js";
import type * as http from "../http.js";
import type * as init from "../init.js";
import type * as replicate from "../replicate.js";
import type * as script from "../script.js";
import type * as segments from "../segments.js";
import type * as story from "../story.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as utils_validators from "../utils/validators.js";
import type * as web from "../web.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  credits: typeof credits;
  "email/index": typeof email_index;
  "email/templates/subscriptionEmail": typeof email_templates_subscriptionEmail;
  env: typeof env;
  guidedStory: typeof guidedStory;
  http: typeof http;
  init: typeof init;
  replicate: typeof replicate;
  script: typeof script;
  segments: typeof segments;
  story: typeof story;
  subscriptions: typeof subscriptions;
  users: typeof users;
  "utils/validators": typeof utils_validators;
  web: typeof web;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

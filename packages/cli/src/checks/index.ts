import type { SecurityCheck } from "../types.js";
import { apiKeyTransportCheck } from "./auth/api-key-transport.js";
import { bearerTokenValidationCheck } from "./auth/bearer-token-validation.js";
import { noAuthCheck } from "./auth/no-auth.js";
import { sessionTokenReuseCheck } from "./auth/session-token-reuse.js";
import { defaultCredentialsCheck } from "./config/default-credentials.js";
import { corsCheck } from "./config/cors.js";
import { debugModeCheck } from "./config/debug-mode.js";
import { argumentShapeCheck } from "./input/argument-shape.js";
import { commandInjectionCheck } from "./input/command-injection.js";
import { pathTraversalCheck } from "./input/path-traversal.js";
import { sqlInjectionCheck } from "./input/sql-injection.js";
import { ssrfCheck } from "./input/ssrf.js";
import { errorDisclosureCheck } from "./output/error-disclosure.js";
import { excessiveDataExposureCheck } from "./output/excessive-data.js";
import { sensitiveDataCheck } from "./output/sensitive-data.js";
import { tlsConfigCheck } from "./transport/tls-config.js";
import { originValidationCheck } from "./transport/origin-validation.js";
import { stdioIsolationCheck } from "./transport/stdio-isolation.js";
import { excessivePermissionsCheck } from "./tooling/excessive-permissions.js";
import { toolNameCollisionCheck } from "./tooling/name-collision.js";
import { shadowToolsCheck } from "./tooling/shadow-tools.js";
import { toolPoisoningCheck } from "./tooling/tool-poisoning.js";

export const checks: SecurityCheck[] = [
  noAuthCheck,
  bearerTokenValidationCheck,
  apiKeyTransportCheck,
  sessionTokenReuseCheck,
  commandInjectionCheck,
  sqlInjectionCheck,
  pathTraversalCheck,
  ssrfCheck,
  argumentShapeCheck,
  sensitiveDataCheck,
  excessiveDataExposureCheck,
  errorDisclosureCheck,
  tlsConfigCheck,
  stdioIsolationCheck,
  originValidationCheck,
  toolPoisoningCheck,
  excessivePermissionsCheck,
  shadowToolsCheck,
  toolNameCollisionCheck,
  corsCheck,
  debugModeCheck,
  defaultCredentialsCheck
];

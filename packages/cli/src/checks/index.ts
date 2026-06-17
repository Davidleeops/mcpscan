import type { SecurityCheck } from "../types.js";
import { noAuthCheck } from "./auth/no-auth.js";
import { defaultCredentialsCheck } from "./config/default-credentials.js";
import { corsCheck } from "./config/cors.js";
import { argumentShapeCheck } from "./input/argument-shape.js";
import { commandInjectionCheck } from "./input/command-injection.js";
import { pathTraversalCheck } from "./input/path-traversal.js";
import { sqlInjectionCheck } from "./input/sql-injection.js";
import { ssrfCheck } from "./input/ssrf.js";
import { errorDisclosureCheck } from "./output/error-disclosure.js";
import { excessiveDataExposureCheck } from "./output/excessive-data.js";
import { sensitiveDataCheck } from "./output/sensitive-data.js";
import { tlsConfigCheck } from "./transport/tls-config.js";
import { excessivePermissionsCheck } from "./tooling/excessive-permissions.js";
import { toolNameCollisionCheck } from "./tooling/name-collision.js";
import { shadowToolsCheck } from "./tooling/shadow-tools.js";
import { toolPoisoningCheck } from "./tooling/tool-poisoning.js";

export const checks: SecurityCheck[] = [
  noAuthCheck,
  commandInjectionCheck,
  sqlInjectionCheck,
  pathTraversalCheck,
  ssrfCheck,
  argumentShapeCheck,
  sensitiveDataCheck,
  excessiveDataExposureCheck,
  errorDisclosureCheck,
  tlsConfigCheck,
  toolPoisoningCheck,
  excessivePermissionsCheck,
  shadowToolsCheck,
  toolNameCollisionCheck,
  corsCheck,
  defaultCredentialsCheck
];

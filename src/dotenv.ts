import dotenv from 'dotenv'; 
import parentLogger from "./logger";
import { JAIPuroxyError } from "./errors";

const logger = parentLogger.child({ name: "EnvironmentResolver" });
const AUTHORIZATION_PREFIX = "Bearer ";

export function initDotEnv() {
    dotenv.config(); 
    logger.info("Environment variables loaded");
}

/**
 * 
 * @returns "Bearer" auth header for ORO_API_KEY environment variable if set; undefined if not set
 */
export function getEnvOroApiAuthorization(): string | undefined {
    const ORO_API_KEY = process.env.ORO_API_KEY;
    if (!ORO_API_KEY) {
        logger.warn(JAIPuroxyError.MISSING_API_KEY);
        return undefined;
    } 
    return AUTHORIZATION_PREFIX + ORO_API_KEY;
}

/**
 * 
 * @returns "Bearer" auth header for ZAI_API_KEY environment variable if set; undefined if not set
 */
export function getEnvZaiApiAuthorization(): string | undefined {
    const ZAI_API_KEY = process.env.ZAI_API_KEY;
    if (!ZAI_API_KEY) {
        logger.warn(JAIPuroxyError.MISSING_API_KEY);
        return undefined;
    } 
    return AUTHORIZATION_PREFIX + ZAI_API_KEY;
}

/**
 * 
 * @returns "Bearer" auth header for GAI_API_KEY_FREE environment variable if set; undefined if not set
 */
export function getEnvGaiApiAuthorizationFree(): string | undefined {
    const GAI_API_KEY_FREE = process.env.GAI_API_KEY_FREE;
    if (!GAI_API_KEY_FREE) {
        logger.warn(JAIPuroxyError.MISSING_API_KEY);
        return undefined;
    }
    return AUTHORIZATION_PREFIX + GAI_API_KEY_FREE;
}

/**
 * 
 * @returns "Bearer" auth header for GAI_API_KEY_PAID environment variable if set; undefined if not set
 */
export function getEnvGaiApiAuthorizationPaid(): string | undefined {
    const GAI_API_KEY_PAID = process.env.GAI_API_KEY_PAID;
    if (!GAI_API_KEY_PAID) {
        logger.warn(JAIPuroxyError.MISSING_API_KEY);
        return undefined;
    }
    return AUTHORIZATION_PREFIX + GAI_API_KEY_PAID;
}

export type ZodErrorType = {
    errors: string[]
    properties: {
        [key: string]: {
            errors: string[]
        }
    }
}

/**
 * Creates an array of error translation keys that can be used by the "GenericError" component.
 * @param error error to be formatted
 * @returns array of error translations keys
 */
export const formatError = (error: string | ZodErrorType): string[] => {
    if (typeof error === "string") {
        if (error.trim() === "") {
            return [];
        }
        return [error];
    }
    return [...error.errors, ...Object.values(error.properties).flatMap(p => p.errors)];
};
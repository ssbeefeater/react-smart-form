export declare const email: (message?: string | boolean) => (value: string) => string | boolean;
export declare const number: (message?: string | boolean) => (value: string) => string | boolean;
export declare const required: (message?: string | boolean) => (value: string) => string | boolean;
export declare const length: (message?: string | boolean, options?: {
    min: number;
    max: number;
}) => (value: string) => string | boolean;
declare const _default: {
    email: (message?: string | boolean) => (value: string) => string | boolean;
    number: (message?: string | boolean) => (value: string) => string | boolean;
    required: (message?: string | boolean) => (value: string) => string | boolean;
    length: (message?: string | boolean, options?: {
        min: number;
        max: number;
    }) => (value: string) => string | boolean;
};
export default _default;

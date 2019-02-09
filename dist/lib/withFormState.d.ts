import * as React from 'react';
import { FormState } from './FormProvider';
export declare type FormInputProps = {
    component?: React.ComponentType<any>;
    name?: string;
    onChange?: Function;
    shouldUpdate?: (val: any) => boolean;
};
export interface InputFormState {
    index: number;
    setError: (error: string | boolean) => void;
    error: string | boolean;
}
export declare const withFormState: <PROPS = any, V = any>(Component: React.ComponentType<PROPS & {
    name: string;
    formState: FormState<V>;
}>) => (props: PROPS & {
    name: string;
}) => React.ReactElement<PROPS>;
export declare const FormInput: React.ComponentType<FormInputProps>;
export declare const transformInput: <PROPS = any>(Component: React.ComponentType<PROPS & {
    formState: InputFormState;
}>) => (props: PROPS & {
    name: string;
}) => React.ReactElement<PROPS>;

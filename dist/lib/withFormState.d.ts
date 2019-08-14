import * as React from 'react';
import { FormState } from './FormProvider';
export interface FormInputProps extends React.AllHTMLAttributes<HTMLInputElement> {
    component?: React.ComponentType<any>;
    name?: string;
    shouldUpdate?: (val: any) => boolean;
}
export interface InputFormState {
    index: number;
    setError: (error: string | boolean) => void;
    error: string | boolean;
    reset?: FormState['reset'];
    clean?: FormState['clean'];
    setCallbacks?: FormState['setCallbacks'];
    removeCallbacks?: FormState['removeCallbacks'];
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

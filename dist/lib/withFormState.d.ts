import * as React from 'react';
import { FormState } from './FormProvider';
export declare type FormInputProps = {
    component?: React.ComponentType<any>;
    name?: string;
    onChange?: Function;
};
export declare const withFormState: <PROPS = any, V = any>(Component: React.ComponentType<PROPS & {
    name: string;
    formState: FormState<V>;
}>) => (props: PROPS & {
    name: string;
}) => React.ReactElement<PROPS>;
export declare const FormInput: React.ComponentType<FormInputProps>;
export declare const transformInput: (Component: React.ComponentType<{}>) => (props: any) => JSX.Element;

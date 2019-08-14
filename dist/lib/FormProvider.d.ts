import * as React from 'react';
export declare const FormContext: React.Context<{}>;
declare type AnyObject = {
    [i: string]: any;
};
export interface FormCallbacks {
    onClean?: () => void;
    onReset?: () => void;
}
export interface Callbacks {
    id: string;
    callbacks: FormCallbacks;
}
export declare type FormState<V = AnyObject, P = AnyObject> = {
    hasChange: () => boolean;
    reset: (inputNames?: string | string[]) => void;
    clean: (inputNames?: string | string[]) => void;
    getErrors: (name?: string | number) => Errors<V>;
    getValues: (name?: string | number) => V | any;
    setErrors: (errors: Errors<V>) => void;
    setValues: (values: V) => void;
    submit: () => void;
    setCallbacks: (id: string, callbacks: FormCallbacks) => void;
    removeCallbacks: (id: string) => void;
    props: P & FormProps<V>;
} & State<V>;
export declare type WithFormState = {
    formState: FormState;
};
declare type Errors<V = AnyObject> = {
    [T in keyof V]?: string | boolean;
};
declare type Validator<V = AnyObject> = (value: any, values: V) => string | boolean;
declare type Validators<V = AnyObject> = {
    [T in keyof V]?: Validator | Validator[];
};
interface State<V = AnyObject> {
    values: Partial<V>;
    errors: AnyObject;
    loading: boolean;
    disabled: boolean;
}
export interface FormProps<V> {
    onChange?: (values: Partial<V>, hasChange: () => boolean) => void;
    onSubmit?: (values: V, formState: FormState) => any | Promise<any>;
    onChangeErrorState?: (errorInfo: {
        errors: Errors<V>;
        hasError: boolean;
    }) => void;
    values?: V;
    validators?: Validators<V>;
    loading?: boolean;
    disabled?: boolean;
    singleValue?: boolean;
    component?: any;
    defaultValues?: Partial<V>;
    onValidate?: (errorInfo: {
        errors: Errors<V>;
        hasError: boolean;
        hasChange: FormState['hasChange'];
    }) => void;
    formRef?: (formState: FormState<V>) => void;
    onReset?: FormCallbacks['onReset'];
    onClean?: FormCallbacks['onClean'];
}
export declare class Form<V = AnyObject> extends React.PureComponent<FormProps<V>, State<V>> {
    constructor(props: FormProps<V>);
    validators: Validators<V>;
    callbacks: Callbacks[];
    static parseValidators: (validators: any) => any;
    defaultValues: any;
    temp: any;
    inputs: {
        [i: string]: any;
    };
    registerInput: (name: string, type: string) => number;
    hasChange: () => boolean;
    hasError: (errors?: Errors<V>) => boolean;
    private validate;
    private static errorChecker;
    setErrors: (errors: Errors<V>) => void;
    setValues: (newValues?: {}, defaults?: boolean) => void;
    componentWillUpdate(nextProps: FormProps<V>): void;
    setInitialNullValues: () => any;
    componentDidMount(): void;
    getValues: (fieldName?: string) => any;
    getErrors: (fieldName?: string) => any;
    onSubmit: (e?: React.SyntheticEvent<Element, Event>) => void;
    handleRequestError: (error: string | Error) => void;
    private cleanOrReset;
    private applyCallback;
    reset: (inputName: string | string[]) => void;
    clean: (inputName: string | string[]) => void;
    setCallbacks: (id: string, callbacks: FormCallbacks) => void;
    removeCallbacks: (id: string) => void;
    getFormState: () => {
        hasChange: () => boolean;
        reset: (inputNames?: string | string[]) => void;
        clean: (inputNames?: string | string[]) => void;
        getErrors: (name?: React.ReactText) => Errors<V>;
        getValues: (name?: React.ReactText) => any;
        setErrors: (errors: Errors<V>) => void;
        setValues: (values: V) => void;
        submit: () => void;
        setCallbacks: (id: string, callbacks: FormCallbacks) => void;
        removeCallbacks: (id: string) => void;
        props: AnyObject & FormProps<V>;
    } & State<V> & {
        registerInput: (name: string, type: string) => void;
    };
    render(): JSX.Element;
}
export default Form;

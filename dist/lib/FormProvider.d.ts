import * as React from 'react';
export declare const FormContext: React.Context<{}>;
declare type AnyObject = {
    [i: string]: any;
};
export declare type FormState<V = AnyObject, P = AnyObject> = {
    hasChange: () => boolean;
    reset: (inputNames?: string | string[]) => void;
    getErrors: (name?: string) => Errors<V>;
    getValues: (name?: string) => V | any;
    setErrors: (errors: Errors<V>) => void;
    setValues: (values: V) => void;
    submit: () => void;
    props: P & Props<V>;
} & State<V>;
export declare type WithFormState = {
    formState: FormState;
};
declare type Errors<V = AnyObject> = {
    [T in keyof V]?: string | boolean;
};
declare type Validator = (value: any) => string | boolean;
declare type Validators<V = AnyObject> = {
    [T in keyof V]?: Validator | Validator[];
};
interface State<V = AnyObject> {
    values: Partial<V>;
    errors: AnyObject;
    loading: boolean;
    disabled: boolean;
}
interface Props<V> {
    onChange?: (values: Partial<V>, hasChange: () => boolean) => void;
    onSubmit?: (values: V, formState: FormState) => any | Promise<any>;
    values?: V;
    validators?: Validators<V>;
    loading?: boolean;
    disabled?: boolean;
    defaultValues?: Partial<V>;
    onValidate?: (errorInfo: {
        errors: Errors<V>;
        hasError: boolean;
        hasChange: FormState['hasChange'];
    }) => void;
    formRef?: (formState: FormState<V>) => void;
}
export declare class Form<V = AnyObject> extends React.PureComponent<Props<V>, State<V>> {
    constructor(props: Props<V>);
    validators: Validators<V>;
    static parseValidators: (validators: any) => any;
    defaultValues: Partial<V>;
    temp: any;
    hasChange: () => boolean;
    hasError: (errors?: Errors<V>) => boolean;
    private validate;
    private static errorChecker;
    setErrors: (errors: Errors<V>) => void;
    setValues: (newValues?: {}, defaults?: boolean) => void;
    componentWillUpdate(nextProps: Props<V>): void;
    componentDidMount(): void;
    getValues: (fieldName?: string) => any;
    getErrors: (fieldName?: string) => any;
    onSubmit: (e?: React.SyntheticEvent<Element, Event>) => void;
    handleRequestError: (error: string | Error) => void;
    reset: (inputName: string | string[]) => void;
    getFormState: () => FormState<V, AnyObject>;
    render(): JSX.Element;
}
export default Form;

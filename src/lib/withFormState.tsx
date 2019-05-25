import * as React from 'react';
import { FormContext, FormState, WithFormState } from './FormProvider';
export interface FormInputProps extends React.AllHTMLAttributes<HTMLInputElement> {
    component?: React.ComponentType<any>;
    name?: string;
    shouldUpdate?: (val: any) => boolean;
}

const typeToConstructor: any = {
    number: Number,
};
interface State { value: any; index: number; error: any; }
export interface InputFormState {
    index: number;
    setError: (error: string | boolean) => void;
    error: string | boolean;
}
class FormInputComponent extends React.Component<FormInputProps & WithFormState & { type?: HTMLInputElement['type'] }, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: null,
            error: null,
            // @ts-ignore
            index: props.formState.registerInput(this.props.name, this.props.type),
        };
    }
    shouldComponentUpdate(_: any, nextState: any) {
        return this.state.value !== nextState.value ||
            this.state.error !== nextState.error ||
            !!(this.props.shouldUpdate && this.props.shouldUpdate(nextState.value));
    }

    static getDerivedStateFromProps(props: FormInputProps & WithFormState, state: State) {
        const value = props.formState.getValues(props.name || state.index) || '';
        const error = props.formState.getErrors(props.name || state.index);
        return {
            value,
            error,
        };
    }

    setError = (error: string | boolean) => {
        const {
            formState,
            name
        } = this.props;
        formState.setErrors({
            [name || this.state.index]: error
        });
    }
    private onChange = (val: React.ChangeEvent | any) => {
        const {
            formState,
            name,
            onChange,
            type,
        } = this.props;
        if (onChange) {
            const changeValue = onChange(val);
            if (typeof changeValue !== 'undefined') {
                val = changeValue;
            }
        }
        let value = val && typeof val === 'object' && val.target ? val.target.value : val;
        if (type && typeof value === 'string' && typeToConstructor[type]) {
            value = typeToConstructor[type](value);
        }
        formState.setValues({ [name || this.state.index]: value });
    }
    index: number;
    render() {
        const {
            component,
            name,
            formState,
            ...restProps
        } = this.props;

        const props: any = {
            name,
            ...restProps
        };
        let Component = component;
        if (Component) {
            props.formState = { error: this.state.error, index: this.state.index, setError: this.setError };
        } else {
            // @ts-ignore
            Component = 'input';
        }
        return (
            <Component  {...props} value={this.state.value} onChange={this.onChange} />
        );
    }
}



export const withFormState: <PROPS = any, V = any>(Component: React.ComponentType<PROPS & { name: string, formState: FormState<V> }>) =>
    (props: PROPS & { name: string }) => React.ReactElement<PROPS> = (Component) => (props) => (
        <FormContext.Consumer>
            {
                (ctx: any) => <Component {...props} formState={ctx} />
            }
        </FormContext.Consumer>
    );

export const FormInput = withFormState(FormInputComponent) as React.ComponentType<FormInputProps>;

export const transformInput: <PROPS = any>(Component: React.ComponentType<PROPS & { formState: InputFormState }>) =>
    (props: PROPS & { name: string }) => React.ReactElement<PROPS> = (Component: React.ComponentType<{ formState: InputFormState }>) => (props: any) => <FormInput {...props} component={Component} />;

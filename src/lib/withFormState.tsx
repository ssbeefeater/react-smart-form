import * as React from 'react';
import { FormContext, FormState, WithFormState } from './FormProvider';
export type FormInputProps = { component?: React.ComponentType<any>, name: string, onChange?: Function };

class FormInputComponent extends React.Component<FormInputProps & WithFormState, { value: any, error: any }> {
    state: { value: any, error: any } = {
        value: null,
        error: null
    };

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return this.state.value !== nextState.value || this.state.error !== nextState.error;
    }

    static getDerivedStateFromProps(props: FormInputProps & WithFormState) {
        const value = props.formState.getValues(props.name) || '';
        const error = props.formState.getErrors(props.name);
        return {
            value,
            error,
        };
    }
    private onChange = (val: React.ChangeEvent | any) => {
        const {
            formState,
            name,
            onChange,
        } = this.props;

        const value = typeof val === 'object' && val.target ? val.target.value : val;

        formState.setValues({ [name]: value });
        if (onChange) {
            onChange(val);
        }
    }
    render() {

        const {
            component: Component = 'input',
            name,
            formState,
            ...restProps
        } = this.props;

        const props = {
            name,
            formState: { error: this.state.error },
            ...restProps
        };
        return (
            <Component  {...props} value={this.state.value} onChange={this.onChange} />
        );
    }
}



export const withFormState: <PROPS= any, V= any>(Component: React.ComponentType<PROPS & { name: string, formState: FormState<V> }>) =>
    (props: PROPS & { name: string }) => React.ReactElement<PROPS> = (Component) => (props) => (
        <FormContext.Consumer>
            {
                (ctx: any) => <Component {...props} formState={ctx} />
            }
        </FormContext.Consumer>
    );

export const FormInput = withFormState(FormInputComponent) as React.ComponentType<FormInputProps>;

export const transformInput = (Component: React.ComponentType) => (props: any) => <FormInput {...props} component={Component} />;

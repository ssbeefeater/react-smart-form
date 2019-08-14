import * as React from 'react';
import Form, { FormProps, FormState } from './FormProvider';
import { transformInput, InputFormState } from './withFormState';

interface Props extends React.HTMLAttributes<HTMLFormElement> {
    [i: string]: any;
    name?: string;
    validators?: FormProps<any>['validators'];
    onChange?: (val: { [i: string]: any }) => void;

}
class ObjectType extends React.PureComponent<Props & { formState: InputFormState }> {
    onVal = ({ hasError }: any) => {
        if (hasError) {
            this.props.formState.setError(true);
        } else {
            this.props.formState.setError(false);
        }
    }
    set: boolean;
    form: FormState;
    componentDidUpdate() {
        if (this.form && !this.set) {
            this.set = true;
            this.props.formState.setCallbacks(this.props.name, {
                onClean: this.form.clean,
                onReset: this.form.reset,
            });
        }
    }
    componentWillUnmount() {
        this.props.formState.removeCallbacks(this.props.name);
    }
    render() {
        const { value, children, validators, onChange } = this.props;
        return (
            <Form
                formRef={(formRef) => this.form = formRef}
                onValidate={this.onVal}
                onChangeErrorState={this.onVal}
                component={React.Fragment}
                onChange={(val) => onChange(Object.assign({}, val))}
                values={value}
                validators={validators}>
                {children}
            </Form>
        );
    }
}

const ObjectFormType = transformInput<Props>(ObjectType);

export default ((props: any) => <ObjectFormType {...props} type='object' />) as React.SFC<Props>;
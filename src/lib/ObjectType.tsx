import * as React from 'react';
import Form, { FormProps } from './FormProvider';
import { transformInput, InputFormState } from './withFormState';

interface Props extends React.HTMLAttributes<HTMLFormElement> {
    [i: string]: any;
    name?: string;
    validators?: FormProps<any>['validators'];
    onChange?: (val: { [i: string]: any }) => void;

}

const ObjectType: React.SFC<Props & { formState: InputFormState }> = ({ value, name, children, validators, onChange, formState }) => {
    const onVal = ({ hasError }: any) => {
        if (hasError) {
            formState.setError(true);
        } else {
            formState.setError(false);
        }
    };
    return (
        <Form onValidate={onVal} onChangeErrorState={onVal} component={React.Fragment} onChange={(val) => onChange(Object.assign({}, val))} values={value} validators={validators}>
            {children}
        </Form>
    );
};

const ObjectFormType = transformInput<Props>(ObjectType);

export default ((props: any) => <ObjectFormType {...props} type='object' />) as React.SFC<Props>;
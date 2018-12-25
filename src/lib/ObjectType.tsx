import * as React from 'react';
import Form, { FormState, FormProps } from './FormProvider';
import { transformInput } from './withFormState';

interface Props {
    name: string;
    validators: FormProps<any>['validators'];
}

const ObjectType: React.SFC<Props
    & HTMLFormElement> = ({ value, children, validators, onChange}) => {

    return (
        <Form component={React.Fragment} onChange={(val) => onChange(Object.assign({}, val))} values={value}  validators={validators}>
            {children}
        </Form>
    );

};

export default transformInput(ObjectType);
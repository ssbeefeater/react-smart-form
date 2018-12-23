import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Form, FormInput, withFormState, WithFormState } from '../src';
import * as validators from '../src/lib/validators';

const Button = (props: WithFormState) => {
  const {
    disabled,
    loading,
    hasChange,
  } = props.formState;
  return (
    <div>
      <button disabled={disabled}>
        {loading ? 'loading' : 'submit'}
      </button>
      {hasChange() ? 'changed' : 'same'}
    </div>
  );
};

const PromiseSubmit = () => new Promise((res) => { setTimeout(res, 2000); });
const PromiseSubmitReject = () => new Promise((res, rej) => { setTimeout(() => rej('err'), 2000); });

const Submit = withFormState<any>(Button);
storiesOf('React-smart-form', module)
  .add('Basic', () => (
    <Form onChange={action('onChange')} onSubmit={action('onSubmit')}
      validators={{
        username: validators.required('is required'),
        password: validators.required('is required'),
        test3: validators.required('is required'),
      }}>
      <FormInput name='username' />
      <FormInput name='password' />
      <FormInput name='test3' />
      <Submit />
    </Form>
  )).add('default values', () => (
    <Form values={{ test1: 'sdas', test2: 'asas' }} onChange={action('onChange')} onSubmit={action('onSubmit')} validators={{ test1: validators.required('is required') }}>
      <FormInput name='test1' />
      <FormInput name='test2' />
      <Submit />
    </Form>
  )).add('handle Promises', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={PromiseSubmit}
      validators={{ test1: validators.required('is required') }}>
      <FormInput name='test1' />
      <FormInput name='test2' />
      <Submit />
    </Form>
  ))
  .add('handle Promises rejection', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={PromiseSubmitReject}
      validators={{ test1: validators.required('is required') }}>
      <FormInput name='test1' />
      <FormInput name='test2' />
      <Submit />
    </Form>
  ));
  // .add('Object input', () => (
  //   <Form
  //     onChange={action('onChange')}
  //     onSubmit={PromiseSubmitReject}
  //     validators={{ mike: validators.required('is required') }}>
  //     <ObjectInput name='object'>
  //       <FormInput name='test1' />
  //       <FormInput name='test2' />
  //     </ObjectInput>
  //     <Submit />
  //   </Form>
  // ));



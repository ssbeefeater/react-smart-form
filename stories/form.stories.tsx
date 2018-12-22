import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Form, FormInput, withFormState, WithFormState } from '../src';
import * as validators from '../src/lib/validators';
import { Object } from 'es6-shim';

const Button = (props: WithFormState) => {
  const {
    disabled,
    loading,
    hasChange,
  } = props.formState;
  const a = () => { console.log(1); };
  const tst = {
    // @ts-ignore
    [a]: 'aa'
  };
  const a2 = Object.keys(tst)[0];
  console.log('​a -> a2', a2);

  // @ts-ignore
  console.log('​a -> Object.keys(tst)');
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
        test1: validators.required('is required'),
        test2: validators.required('is required'),
        test3: validators.required('is required'),

      }}>
      <FormInput name='test1' />
      <FormInput name='test2' />
      <FormInput name='test3' />
      <Submit />
    </Form>
  )).add('default values', () => (
    <Form values={{ mike: 'sdas', ant: 'asas' }} onChange={action('onChange')} onSubmit={action('onSubmit')} validators={{ mike: validators.required('is required') }}>
      <FormInput name='test1' />
      <FormInput name='test2' />
      <Submit />
    </Form>
  )).add('handle Promises', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={PromiseSubmit}
      validators={{ mike: validators.required('is required') }}>
      <FormInput name='test1' />
      <FormInput name='test2' />
      <Submit />
    </Form>
  ))
  .add('handle Promises rejection', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={PromiseSubmitReject}
      validators={{ mike: validators.required('is required') }}>
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



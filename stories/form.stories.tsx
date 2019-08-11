import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Form, FormInput, withFormState, WithFormState, ObjectType, ArrayInput, AddButton, RemoveButton, ArrayType, transformInput } from '../src';
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

const ResetButton = (props: WithFormState) => {
  const {
    disabled,
    hasChange,
    reset,
  } = props.formState;
  return (
    <button disabled={!hasChange()} onClick={(e) => { e.preventDefault(); reset(); }}>
      reset
    </button>
  );
};

const CleanButton = (props: WithFormState) => {
  const {
    hasChange,
    clean,
  } = props.formState;
  return (
    <button onClick={(e) => { e.preventDefault(); clean(); }}>
      clean
    </button>
  );
};
const Input = transformInput<{}>((props) => {
  const {
    formState,
    ...restProps
  } = props;
  const {
    error,
  } = formState;
  return (
    <div>
      <input {...restProps} />
      <div> {error}</div>
    </div>
  );
});

const PromiseSubmit = () => new Promise((res) => { setTimeout(res, 2000); });
const PromiseSubmitReject = () => new Promise((res, rej) => { setTimeout(() => rej('err'), 2000); });

const Submit = withFormState<any>(Button);
const Reset = withFormState<any>(ResetButton);
const Clean = withFormState<any>(CleanButton);
storiesOf('React-smart-form', module)
  .add('Basic', () => (
    <Form onChange={action('onChange')} onSubmit={action('onSubmit')}
      onValidate={action('onValidate')}
      validators={{
        username: validators.required('is required'),
      }}>
      <FormInput name='username' />
      <FormInput name='password' />
      <FormInput name='test3' />
      <Submit />
      <Reset />
    </Form>
  )).add('default values', () => (
    <Form values={{ test1: 'sdas', test2: 'asas' }} onChange={action('onChange')} onSubmit={action('onSubmit')} validators={{ test1: validators.required('is required') }}>
      <FormInput name='test1' />
      <FormInput name='test2' />
      <Submit />
      <Reset />
      <Clean />
    </Form>
  )).add('custom input with error message', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={action('onSubmit')}
    // validators={{ test1: validators.required('is required') }}
    >
      <Input name='test1' />
      <Input name='test2' />
      <Submit />
    </Form>
  )).add('handle Promises', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={PromiseSubmit}
      validators={{ test1: validators.required('is required'), test2: validators.required('is required') }}>
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
  ))
  .add('Object input', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={action('onSubmit')}
    >
      <ObjectType name='objectTest'>
        <FormInput name='test1' />
        <FormInput name='test2' />
      </ObjectType>
      <Submit />
    </Form>
  ))
  .add('Object input default values', () => (
    <Form
      values={{ test0: '0', objectTest: { test2: '2', test1: '1' } }}
      onChange={action('onChange')}
      onSubmit={action('onSubmit')}
      validators={{ test0: validators.required('is required') }}>
      <FormInput name='test0' />
      <ObjectType name='objectTest'>
        <FormInput name='test1' />
        <FormInput name='test2' />
      </ObjectType>
      <Submit />
    </Form>
  ))
  .add('Object input with validation', () => (
    <Form
      onChange={action('onChange')}
      onSubmit={action('onSubmit')}
      validators={{ test0: validators.required('is required') }}
    >
      <Input name='test0' />
      <ObjectType
        name='objectTest'
        validators={{ test1: validators.required('is required'), test2: validators.required('is required') }}
      >
        <Input name='test1' />
        <Input name='test2' />
      </ObjectType>
      <Submit />
    </Form>
  ))
  .add('Array type single', () => (
    <Form
      onSubmit={action('onSubmit')}
      onChange={action('onChange')}
    >
      <ArrayType name='arrayTest'>
        <ArrayInput>
          <FormInput />
          <RemoveButton>-</RemoveButton>
        </ArrayInput>
        <AddButton>+</AddButton>
      </ArrayType>
      <Submit />
    </Form>
  ))
  .add('Array type default value', () => (
    <div>
      <Form
        onSubmit={action('onSubmit')}
        values={{ arrayTest: [1, 2, 3] }}
        onChange={action('onChange')}>
        <ArrayType name='arrayTest'>
          <ArrayInput>
            <FormInput type='number' />
            <RemoveButton>-</RemoveButton>
          </ArrayInput>
          <AddButton>+</AddButton>
        </ArrayType>
        <Submit />
      </Form>
      <br />
      <br />
      <Form
        onSubmit={action('onSubmit')}
        values={{ arrayTest: [{ test1: 1, test2: 2 }] }}
        onChange={action('onChange')}>
        <ArrayType name='arrayTest'>
          <ArrayInput>
            <ObjectType>
              <FormInput name='test1' />
              <FormInput name='test2' />
            </ObjectType>
            <RemoveButton>-</RemoveButton>
          </ArrayInput>
          <AddButton>+</AddButton>
        </ArrayType>
        <Submit />
      </Form>
    </div>
  ))
  .add('Array object', () => (
    <Form
      onSubmit={action('onSubmit')}
      values={{
        arrayTest: [
          { test1: 1, test2: 2, objectTest: { test1: 3, test2: 4 } }
        ]
      }}
      onChange={action('onChange')}>
      <ArrayType name='arrayTest'>
        <ArrayInput>
          <ObjectType>
            <FormInput type='number' name='test1' />
            <FormInput type='number' name='test2' />
            <ObjectType name='objectTest'>
              <FormInput type='number' name='test1' />
              <FormInput type='number' name='test2' />
            </ObjectType>
          </ObjectType>
          <RemoveButton>-</RemoveButton>
        </ArrayInput>
        <AddButton>+</AddButton>
      </ArrayType>
      <Submit />
    </Form>
  ))
  .add('Array object validation', () => (
    <Form
      onSubmit={action('onSubmit')}
      onChange={action('onChange')}
    >
      <ArrayType name='arrayTest'>
        <ArrayInput>
          <ObjectType >
            <Input name='test1' />
            <ObjectType name='objectTest' validators={{ test2: validators.required('is required') }}>
              <Input name='test2' />
            </ObjectType>
          </ObjectType>
          <RemoveButton>-</RemoveButton>
        </ArrayInput>
        <AddButton>+</AddButton>
      </ArrayType>
      <Submit />
    </Form>
  ));






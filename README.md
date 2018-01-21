# react-smart-form

### A form component that containes all the functionality you will need.

---


[Installation](#installation)

[Examples](http://ssbeefeater.github.io/react-smart-form)

[Documentation](#documentation)

---

#### Installation

Install with [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com/)

```sh
yarn add react-smart-form
        #or
npm install react-smart-form --save
```
---
#### Examples


Basic
```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import {Form, Input, Submit} from 'react-smart-form';

class MyComponent extends Component {
    onSubmit=(values)=>{
           console.log(`Username: ${values.username}`);
           console.log(`Password: ${values.password}`);
    }
    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Input name="username" label="Username" />
                <Input name="password" label="Password" type="password" />
                <Submit>
                    Login
                </Submit>
            </Form>
        );
    }
}

render(
    <MyComponent/>,
    document.getElementById('app'),
);

```

Validation

```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import {Form, Input, Submit} from 'react-smart-form';
import {required, length, email} from 'react-smart-form/validators';


/* 
* the react-smart-form asks if the field has error 
* so you must return false if it doesn't 
* or true (or a string message) if it does
*/
const numberCustomValidator = message=>(value)=>{
    if(typeof value !== 'number'){
        return message || true;
    }
    return false;
}

class MyComponent extends Component {
    onSubmit=(values)=>{
           console.log(`Username: ${values.username}`);
           console.log(`Password: ${values.password}`);
    }
    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Input 
                    name="username" 
                    label="Username" 
                    validator={[required('Email is required'),email('This is not correct email.')]}
                />
                <Input 
                    name="password" 
                    label="Password" 
                    type="password" 
                    // silent validation
                    validator={[required(),numberCustomValidator('This must be a number')]}

                    />
                <Submit>
                    Login
                </Submit>
            </Form>
        );
    }
}

render(
    <MyComponent/>,
    document.getElementById('app'),
);

```

Handle custom errors and loading state
```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import {Form, Input, Submit} from 'react-smart-form';

const fakeRequest = ()=>{
  return new Promise((resolve)=>{
      setTimeout(resolve,1000);
  })  
};

class MyComponent extends Component {
    onSubmit=(values)=>{
           console.log(`Username: ${values.username}`);
           console.log(`Password: ${values.password}`);
           // Returning a promise react-smart-form can handle loading state of the form.
           return fakeRequest().then((resp)=>{
               if(!resp.data.success){
                   throw {
                       username:'This username doesn\'t exist.'
                   }    
               }
               
           });
    }
    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Input name="username" label="Username" />
                <Input name="password" label="Password" type="password" />
                <Submit>
                    Login
                </Submit>
            </Form>
        );
    }
}

render(
    <MyComponent/>,
    document.getElementById('app'),
);

```



Custom input custom errors and loading state
```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import {Form, Input, Submit} from 'react-smart-form';

const CustomField = (props)=>(
    <div>
         <label>Custom field: </label>
         <input {...props} />
    </div>
  );

class MyComponent extends Component {
    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <Input name="custom">
                    <CustomField />
                </Input>
            </Form>
        );
    }
}

render(
    <MyComponent/>,
    document.getElementById('app'),
);

```

Reset form
```javascript
import React,{ Component } from 'react';
import { render } from 'react-dom';
import {Form, Input, Submit} from 'react-smart-form';

class MyComponent extends Component {
    render() {
        return (
            <div>
                <Form formRef={(form)=>{ this.form=form; }}>
                    <Input name="username"/>
                </Form>
                <button onClick={()=>{this.form.reset('username')}}></button>
            </div>
        );
    }
}

render(
    <MyComponent/>,
    document.getElementById('app'),
);

```

#### Documentation


#####Form


| propType  | required | default  | description |
| ------------- | ------------- | ------------- | ------------- |
| onValidate(func(hasError)) | no | - | A function that runs every time the overall validation status change |
| onSubmit(func(FieldValues)) | no | - | the function that handles the form submission |
| onChange(func(FieldValues)) | no | - | A function that runs every time a field changes |
| disabled(bool) | no | - | set the form in a disabled state |
| loading(bool) | no | - | set the form in a loading state |
| formRef(func) | no | - | returns the Form instance |



#####Input


| propType  | required | default  | description |
| ------------- | ------------- | ------------- | ------------- |
| type(input type or 'textarea') | no | - | The type of the Input. Takes all the valid Input type except file and submit. |
| name(string)) | yes | - | The name of the input |
| label(string) | no | - | The value of the label |
| focusedLabel(string) | no | - | the value of the label when it is focused |
| icon(react Component) | no | - | sets and icon in the right side of the input |
| validators([func(value)]) | no | - | An array of functions that validates the inputs value. Should return false if the validation pass and string or true if it dont|
| onChange(func(value)) | no | - | A function that runs every time the field changes |
| focused(bool) | no | - | initialize the input in focus state |
| showPassword(bool) | true | - | if the type of the field is password appends a icon button that toggles the input display state |
| defaultValue(string) | no | - | sets a default value for the field |
| inputRef(func) | no | - | returns the input reference |
| debounce(number) | no | 300 | set the input's debounce for validation|
| disabled:readOnly (bool) | no | - | set the input in a readOnly state |


#####Submit


| propType  | required | default  | description |
| ------------- | ------------- | ------------- | ------------- |
| size(number) | no | 18 | - |sets size of the button|
| color(string) | no | '#44A8FF' | set the button color|
| loading(bool) | no | - | set the button in a loading state|
| disabled(bool) | no | - | set the form in a disabled state |
| children(string) | no | - | The button label |

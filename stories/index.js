import React from 'react';

import { storiesOf } from '@storybook/react';
import '@storybook/addon-knobs/register';
import {Form,Input,Submit,Wrapper} from '../src/';
import { email, required,length } from '../src/lib/validators';
import { withInfo } from '@storybook/addon-info';

const descriptions = {
    loadingState:`
        If you return a promise in onSubmit function rect-smart-form can handle the loading state of the form
        
        
        
    `,
    errorHandling:`
            If you return a promise in onSubmit function and throw an error, the react-smart-form will catch it and display it in the error area
            of each field. Also you can throw an object and specify the desired field that you want the message to be displayed
            
            
            &lt;Form onSubmit={()=&gt;{
                    return fakeRequest().catch(()=&gt;{
                        throw {
                            username:&#039;This email does not exist&#039;
                        }
                    });
             }}&gt;
            ...
            &lt;/Form&gt;
    
    `

};

const defaults = {
    emailError:'This is not correct email',
    emailRequiredError:'Email is required',
    passwordRequiredError:'Please add a password',
    passwordLengthError:'Password length must be between 5 and 8 characters',
};
let formInstance;
storiesOf('react-smart-form', module)
    .add('Basic Example', withInfo()(() =>
        <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
            <div style={{width:400}}>
                <Form>
                    <Input name="username" label="email" type="email"
                           validators={[required(defaults.emailRequiredError), email(defaults.emailError)]} />
                    <Input name="password" label="Password" type="password" validators={[required(),length(defaults.passwordLengthError,{min:5,max:8})]} />
                    <Input onChange={()=>{console.log('das')}} name="notes" label="Notes" type="textarea"/>
                    <Submit>Login</Submit>
                </Form>
            </div>
        </div>
    )).add('handle loading state', withInfo(descriptions.loadingState)(() =>{
    const fakeRequest =()=> new Promise((res)=>{
        setTimeout(()=>{
            res();
        },1000)
    });
    return <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div style={{width:400}}>
            <Form onSubmit={()=>{
                return fakeRequest()
            }}>
                <Input  name="username" label="email" type="email"
                       validators={[required(defaults.emailRequiredError), email(defaults.emailError)]} />
                <Input name="password" label="Password" type="password" validators={[required(),length(defaults.passwordLengthError,{min:5,max:8})]} />
                <Submit>Login</Submit>
            </Form>
        </div>
    </div>}
)).add('custom error', withInfo(descriptions.errorHandling)(() =>{
    const fakeRequest = ()=>new Promise((res,rej)=>{
        setTimeout(()=>{
            rej();
        },1000)
    });
    return <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div style={{width:400}}>
            <Form onSubmit={()=>{
                return fakeRequest().catch(()=>{
                    throw {
                        username:'This email does not exist'
                    }
                });
            }}>
                <Input name="username" label="email" type="email"
                       validators={[required(defaults.emailRequiredError), email(defaults.emailError)]} />
                <Input name="password" label="Password" type="password" validators={[required(),length(defaults.passwordLengthError,{min:5,max:8})]} />
                <Submit>Login</Submit>
            </Form>
        </div>
    </div>}
)).add('custom field', withInfo(descriptions.errorHandling)(() =>{
    const fakeRequest = ()=>new Promise((res,rej)=>{
        setTimeout(()=>{
            rej();
        },1000)
    });


    // className: hasError, hasValue, focusedElement
    const CustomField = (props)=>(
        <div>
            <label>Custom field: </label>
            <input {...props} />
        </div>
    );
    return <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div style={{width:400}}>
            <Form>
                <Input name="username" validators={[required('Required field')]} >
                    <CustomField/>
                </Input>
            </Form>
        </div>
    </div>}
)).add('Reset fields', withInfo(descriptions.errorHandling)(() =>{
    return <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div style={{width:400}}>
            <Form formRef={(form)=>{
                formInstance=form;
                console.log(formInstance)

            }}>
                <Input name="username" label="email" type="email" />
                <Input name="password" label="Password" type="password"  />
            </Form>
            <button onClick={()=>{
                formInstance.reset('username');
            }}>
                Reset
            </button>
        </div>
    </div>}
));

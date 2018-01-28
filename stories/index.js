import React from 'react';

import { storiesOf } from '@storybook/react';
import '@storybook/addon-knobs/register';
import {Form,Input,Submit,Wrapper} from '../src/';
import makeMeSmart from '../src/lib/smartInput'
import smartForm from '../src/lib/smartForm'
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
                    <Input name="username" label="Email" type="email"
                           validators={[required(defaults.emailRequiredError), email(defaults.emailError)]} />
                    <Input name="password" label="Password" type="password" validators={[required(),length(defaults.passwordLengthError,{min:5,max:8})]} />
                    <Input name="notes" label="Notes" type="textarea"/>
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
                <Input  name="username" label="Email" type="email"
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
                <Input name="username" label="Email" type="email"
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
    class Field extends React.Component{
        render(){
            const {
                smartForm,
                ...restProps
            } = this.props;
            console.log(smartForm);
            return         <div>
                <label>Custom field: </label>
                <input {...restProps}/>
                <div>{smartForm.error}</div>
            </div>
        }
    }
        class Forma extends React.Component{
            render(){
                const {
                    ...restProps
                } = this.props;
                return         <div>
                    <form {...restProps} />
                </div>
            }
        }
    const CustomForm = smartForm(Forma);
    const CustomField = makeMeSmart(Field);
    return <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div style={{width:400}}>
            <CustomForm>
                    <CustomField type="text" name="test" validators={[required('required'),email('not email')]}/>
            </CustomForm>
        </div>
    </div>}
)).add('Reset fields', withInfo(descriptions.errorHandling)(() =>{
    return <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div style={{width:400}}>
            <Form formRef={(form)=>{
                formInstance=form;

            }}>
                <Input name="username" label="Email" type="email" />
                <Input name="password" label="Password" type="password"  />
            </Form>
            <button onClick={()=>{
                formInstance.reset();
            }}>
                Reset All
            </button><br/>
            <button onClick={()=>{
                formInstance.reset('username');
            }}>
                Reset Email
            </button>
        </div>
    </div>}
)).add('Match Password', withInfo(descriptions.errorHandling)(() =>{

    const samePasswordValidator = (message)=>(value)=>{
        if(value!==formInstance.getValues('password')){
            return message||true;
        }
        return false
    };
    return <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <div style={{width:400}}>
            <Form formRef={(form)=>{
                formInstance=form;
            }}>
                <Input showPassword={false} name="password" label="Enter Password" type="password"  validators={required()}/>
                <Input showPassword={false} name="rePassword" label="Enter Password again" type="password"  validators={[required(),samePasswordValidator('Passwords does not match')]}/>
                <Submit>Register</Submit>
            </Form>
        </div>
    </div>}
));

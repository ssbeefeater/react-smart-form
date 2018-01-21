import 'raf/polyfill';
import React from 'react';
import {Form, Input, Submit} from '../src';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

const {mount} = Enzyme;

describe('<Typed />',
    () => {
        it('Renders correct',
            () => {
                const component = mount(
                    <Form>
                        <Input name="test"/>
                        <Submit>Submit</Submit>
                    </Form>
                    );
                expect(component).toHaveLength(1);
            }
        );
    }
);
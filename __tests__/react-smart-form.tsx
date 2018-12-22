import 'raf/polyfill';
import React from 'react';
import { Form, FormInput } from '../src';

describe('<Typed />',
    () => {
        it('Renders correct',
            () => {
                const component = mount(
                    <Form>
                        <FormInput name='test1' />
                        <FormInput name='test2' />
                        <FormInput name='test3' />
                    </Form>
                );
                expect(component).toHaveLength(1);
            }
        );
    }
);
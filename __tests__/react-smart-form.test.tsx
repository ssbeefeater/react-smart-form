import 'raf/polyfill';
import * as React from 'react';
import { Form, FormInput } from '../src';
declare var mount: Function;
describe('<ReactSmartForm />',
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

describe('parseValidators',
    () => {
        it('Should return the correct value if no function as key', () => {
            const testFN = (val: any) => { console.log(val); };
                const parsedValidators = Form.parseValidators({key1: testFN});
            expect(parsedValidators).toEqual({
                key1: expect.any(Function)
                });
            });

            it('Should return the correct value if function as key', () => {
                const testFN = (val: any) => { console.log(val); };
                // @ts-ignore
                const parsedValidators = Form.parseValidators({[testFN]: 'key1'});
                expect(parsedValidators).toEqual({
                    key1: expect.any(Function)
                });
            });

            it('Should return the correct value if mixed with same name', () => {
                const testFN = (val: any) => { console.log(val); };
                const testFN2 = (val: any) => { console.log(val); };
                // @ts-ignore
                const parsedValidators = Form.parseValidators({[testFN]: 'key1', key1: testFN2});

                expect(parsedValidators.key1).toHaveLength(2);
                expect(parsedValidators.key1[0]).toEqual(expect.any(Function));
                expect(parsedValidators.key1[1]).toEqual(expect.any(Function));
            });
            it('Should return the correct value if function key with array of values', () => {
                const testFN = (val: any) => { console.log(val); };
                const testFN2 = (val: any) => { console.log(val); };
                // @ts-ignore
                const parsedValidators = Form.parseValidators({[testFN]: ['key1', 'key2', 'key3']});
                console.log(parsedValidators);
                expect(parsedValidators.key1).toEqual(expect.any(Function));
                expect(parsedValidators.key2).toEqual(expect.any(Function));
                expect(parsedValidators.key3).toEqual(expect.any(Function));
            });
    }
);
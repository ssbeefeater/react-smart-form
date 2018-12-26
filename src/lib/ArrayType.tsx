import * as React from 'react';
import { Form } from './FormProvider';
import { transformInput, FormInput } from './withFormState';

interface Props {
}


interface State {
    inputs: any[];
}


export class ArrayType extends React.PureComponent<Props & HTMLFormElement, State> {
    constructor(props: Props & HTMLFormElement) {
        super(props);
        this.state =  this.setDefaultState();
    }
     values: any = {};
     setDefaultState = () => {
         const values = this.props.value || [null];
        const inputs = values.map((val: any) => {
            const input = { id: this.uid };
            this.values[this.uid] = val;
            this.uid += 1;
            return input;
        });
        return {
            inputs,
        };
    }

    uid = 0;
    onAdd = () => {
        const {
            inputs,
        } = this.state;

        this.setState({
            inputs: [...inputs, { id: this.uid }],
        });
        this.uid += 1;
    }
    onRemove = (index: number, id: any) => {
        const {
            inputs,
        } = this.state;

        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        delete this.values[id];
        const {
            onChange,
        } = this.props;

        if (onChange) {
            onChange(Object.values(this.values));
        }
        this.setState({
            inputs: newInputs,
        });
    }

    onChange = (id: number) => (newValue: any) => {
        const {
            onChange,
            children,
        } = this.props;
        this.values[id] = children ? newValue : Object.values(newValue)[0];
        if (onChange) {
            const formattedValues = Object.values(this.values);
            onChange(formattedValues);
        }
    }
    render() {
        const {
            children,
            name,
            type,
            value,
        } = this.props;

        return (
            <React.Fragment>
            {    this.state.inputs.map((input, index) => {
                    const isFirst = index === 0;
                    return (
                        <Form values={{[input.id]: value[index]}}
                        component={React.Fragment}
                        key={input.id}
                        onChange={this.onChange(input.id)}>
                                {
                                    children ?
                                        React.Children
                                    // @ts-ignore
                                        .map(children, (child) => React.cloneElement(child, {}))
                                        :
                                    // @ts-ignore
                                    <FormInput name={`${input.id}`} type={type}/>
                                }
                                {
                                    !isFirst && <button onClick={(e) => {
                                            e.preventDefault();
                                            this.onRemove(index, input.id);
                                    }} >-</button>
                                }
                        </Form>
                    );
                })
                }
                <button onClick={(e) => {
                                    e.preventDefault();
                                    this.onAdd();
                                }} >+
                </button>
                </React.Fragment>
        );
    }
}

export default transformInput(ArrayType);

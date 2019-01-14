import * as React from 'react';
import { Form } from './FormProvider';
import { transformInput } from './withFormState';

const { Provider, Consumer } = React.createContext({});
const { Provider: ArrayTypeProvider, Consumer: ArrayTypeConsumer } = React.createContext({});
interface Props {
}


interface State {
    inputs: any[];
}


class ArrayTypeBase extends React.PureComponent<any, State> {
    constructor(props: Props & HTMLFormElement) {
        super(props);
        this.state = this.setDefaultState();
    }

    uid = 0;

    values: any = {};
    setDefaultState = () => {
        const values = Array.isArray(this.props.value) && this.props.value || [null];
        const inputs = values.map((val: any) => {
            const input = { id: this.uid };
            this.values[this.uid] = { 0: val };
            this.uid += 1;
            return input;
        });
        return {
            inputs,
        };
    }

    onAdd = () => {
        const {
            inputs,
        } = this.state;

        this.setState({
            inputs: [...inputs, { id: this.uid }],
        });
        this.uid += 1;
    }
    static formatValues = (values: any) => {
        return Object.values(values).map((objectValue) => {
            return objectValue && typeof objectValue === 'object' ?
                Object.values(objectValue).filter(val => !!val)[0]
                : objectValue;
        });
    }

    onRemove = (index: number, id: any) => () => {
        const {
            inputs,
        } = this.state;

        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        const {
            onChange,
        } = this.props;

        delete this.values[id];
        if (onChange) {
            onChange(ArrayTypeBase.formatValues(this.values));
        }
        this.setState({
            inputs: newInputs,
        });
    }
    onValidate = ({ hasError }: any) => {
        console.log('​ArrayTypeBase -> onValidate -> hasError', hasError);
        const {
            formState
        } = this.props;
        if (hasError) {
            formState.setError(true);
        } else {
            formState.setError(false);
        }

    }
    render() {
        return (
            <ArrayTypeProvider value={{ onValidate: this.onValidate, values: this.values, onChange: this.props.onChange, remove: this.onRemove, add: this.onAdd, inputs: this.state.inputs }}>
                {this.props.children}
            </ArrayTypeProvider>
        );
    }
}
export const ArrayType = transformInput(ArrayTypeBase);
class ArrayInputBase extends React.PureComponent<Props & HTMLFormElement, State> {

    addButtonRef: React.RefObject<HTMLDivElement> = React.createRef();
    refInit = false;
    render() {
        const {
            children,
        } = this.props;

        return (
            <ArrayTypeConsumer>
                {
                    (ctx: { [i: string]: any }) => {
                        return ctx.inputs.map((input: any, index: number) => {
                            const isFirst = index === 0;
                            const onChange = (newValue: any) => {
                                ctx.values[input.id] = newValue;
                                if (ctx.onChange) {
                                    ctx.onChange(ArrayTypeBase.formatValues(ctx.values));
                                }
                            };
                            return (
                                <Provider key={index} value={{ remove: ctx.remove(index, input.id), isFirst, index, id: input.id }}>
                                    <Form onValidate={ctx.onValidate} onChangeErrorState={ctx.onValidate} values={ctx.values[input.id]}
                                        component={React.Fragment}
                                        key={input.id}
                                        onChange={onChange}>
                                        {
                                            React.Children
                                                .map(children, (child: any) => React.cloneElement(child, {}))
                                        }
                                    </Form>
                                </Provider>
                            );
                        });
                    }
                }
            </ArrayTypeConsumer>
        );
    }
}

export const ArrayInput = ArrayInputBase as React.ComponentType;


interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    component?: React.ComponentType<any>;
}

export const AddButton: React.SFC<ButtonProps> = ({ component: Component = 'button', onClick, ...restProps }) => {
    return (
        <ArrayTypeConsumer>
            {
                (ctx: { add: Function }) => (
                    <Component onClick={(e?: any) => {
                        if (e && e.preventDefault) {
                            e.preventDefault();
                        }
                        if (onClick) {
                            onClick(e);
                        }
                        ctx.add();
                    }}  {...restProps} />
                )
            }
        </ArrayTypeConsumer>

    );
};


export const RemoveButton: React.SFC<ButtonProps> = ({ component: Component = 'button', onClick, ...restProps }) => {
    return (
        <Consumer>
            {
                (ctx: { remove: Function; isFirst: boolean; index: number; id: number }) => ctx.isFirst ? null : (
                    <Component onClick={(e?: any) => {
                        if (e && e.preventDefault) {
                            e.preventDefault();
                        }
                        if (onClick) {
                            onClick(e);
                        }
                        ctx.remove();
                    }}  {...restProps} />)
            }
        </Consumer>
    );
};
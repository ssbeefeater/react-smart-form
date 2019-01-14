import * as React from 'react';
export declare const ArrayType: (props: any) => JSX.Element;
export declare const ArrayInput: React.ComponentType<{}>;
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    component?: React.ComponentType<any>;
}
export declare const AddButton: React.SFC<ButtonProps>;
export declare const RemoveButton: React.SFC<ButtonProps>;
export {};

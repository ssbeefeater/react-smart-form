import * as React from 'react';
import { FormProps } from './FormProvider';
interface Props extends React.HTMLAttributes<HTMLFormElement> {
    [i: string]: any;
    name?: string;
    validators?: FormProps<any>['validators'];
    onChange?: (val: {
        [i: string]: any;
    }) => void;
}
declare const _default: React.FunctionComponent<Props>;
export default _default;

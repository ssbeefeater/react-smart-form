/// <reference types="react" />
import { FormProps } from './FormProvider';
interface Props {
    [i: string]: any;
    name?: string;
    validators?: FormProps<any>['validators'];
}
declare const _default: (props: Props) => JSX.Element;
export default _default;

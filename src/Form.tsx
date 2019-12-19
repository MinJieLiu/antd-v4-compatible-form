import * as React from 'react';
import omit from 'omit.js';
import classNames from 'classnames';
import FieldForm, { List } from 'rc-field-form';
import { FormProps as RcFormProps } from 'rc-field-form/lib/Form';
import { ColProps } from 'antd/lib/col';
import { FormContext } from './context';
import { FormLabelAlign } from './interface';
import { useForm, FormInstance } from './util';
import getPrefixCls from './getPrefixCls';

export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export interface FormProps extends Omit<RcFormProps, 'form'> {
  prefixCls?: string;
  hideRequiredMark?: boolean;
  colon?: boolean;
  name?: string;
  layout?: FormLayout;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  form?: FormInstance;
}

const InternalForm: React.FC<FormProps> = (props, ref) => {
  const {
    form,
    colon,
    name,
    labelAlign,
    labelCol,
    wrapperCol,
    prefixCls: customizePrefixCls,
    hideRequiredMark,
    className = '',
    layout = 'horizontal',
  } = props;
  const prefixCls = getPrefixCls('form', customizePrefixCls);

  const formClassName = classNames(
    prefixCls,
    {
      [`${prefixCls}-${layout}`]: true,
      [`${prefixCls}-hide-required-mark`]: hideRequiredMark,
    },
    className,
  );

  const formProps = omit(props, [
    'prefixCls',
    'className',
    'layout',
    'hideRequiredMark',
    'wrapperCol',
    'labelAlign',
    'labelCol',
    'colon',
  ]);

  const [wrapForm] = useForm(form);
  wrapForm.__INTERNAL__.name = name;

  React.useImperativeHandle(ref, () => wrapForm);

  return (
    <FormContext.Provider
      value={{
        name,
        labelAlign,
        labelCol,
        wrapperCol,
        vertical: layout === 'vertical',
        colon,
      }}
    >
      <FieldForm
        id={name}
        {...formProps}
        form={wrapForm}
        className={formClassName}
      />
    </FormContext.Provider>
  );
};

const Form = React.forwardRef<FormInstance, FormProps>(InternalForm);

export { useForm, List, FormInstance };

export default Form;

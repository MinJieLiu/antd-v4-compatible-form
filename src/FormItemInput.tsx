import * as React from 'react';
import classNames from 'classnames';
import {
  LoadingOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import CSSMotion from 'rc-animate/lib/CSSMotion';

import Col, { ColProps } from 'antd/lib/col';
import { ValidateStatus } from './FormItem';
import { FormContext } from './context';
import { useCacheErrors } from './util';

interface FormItemInputMiscProps {
  prefixCls: string;
  children: React.ReactNode;
  errors: React.ReactNode[];
  touched: boolean;
  validating: boolean;
  hasFeedback?: boolean;
  validateStatus?: ValidateStatus;
  onDomErrorVisibleChange: (visible: boolean) => void;
}

export interface FormItemInputProps {
  wrapperCol?: ColProps;
  help?: React.ReactNode;
  extra?: React.ReactNode;
}

const iconMap: { [key: string]: any } = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined,
};

const FormItemInput: React.FC<FormItemInputProps & FormItemInputMiscProps> = ({
  prefixCls,
  wrapperCol,
  children,
  errors,
  onDomErrorVisibleChange,
  hasFeedback,
  validateStatus,
  extra,
}) => {
  const baseClassName = `${prefixCls}-item`;

  const formContext = React.useContext(FormContext);

  const mergedWrapperCol: ColProps = wrapperCol || formContext.wrapperCol || {};

  const className = classNames(`${baseClassName}-control`, mergedWrapperCol.className);

  const [visible, cacheErrors] = useCacheErrors(errors, changedVisible => {
    if (changedVisible) {
      onDomErrorVisibleChange(true);
    }
  });

  // Should provides additional icon if `hasFeedback`
  const IconNode = validateStatus && iconMap[validateStatus];
  const icon =
    hasFeedback && IconNode ? (
      <span className={`${baseClassName}-children-icon`}>
        <IconNode />
      </span>
    ) : null;

  // Pass to sub FormItem should not with col info
  const subFormContext = { ...formContext };
  delete subFormContext.labelCol;
  delete subFormContext.wrapperCol;

  return (
    <FormContext.Provider value={subFormContext}>
      <Col {...mergedWrapperCol} className={className}>
        <div className={`${baseClassName}-control-input`}>
          {children}
          {icon}
        </div>
        <CSSMotion
          visible={visible}
          motionName="show-help"
          onLeaveEnd={() => {
            onDomErrorVisibleChange(false);
          }}
          motionAppear
          removeOnLeave
        >
          {({ className: motionClassName }: { className: string }) => {
            return (
              <div className={classNames(`${baseClassName}-explain`, motionClassName)} key="help">
                {cacheErrors}
              </div>
            );
          }}
        </CSSMotion>
        {extra && <div className={`${baseClassName}-extra`}>{extra}</div>}
      </Col>
    </FormContext.Provider>
  );
};

export default FormItemInput;

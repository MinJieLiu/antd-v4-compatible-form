export default (suffixCls: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;

  return `ant-${suffixCls}`;
};

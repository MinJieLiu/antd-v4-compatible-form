import * as React from 'react';
import {
  useForm as useRcForm,
  FormInstance as RcFormInstance,
} from 'rc-field-form';
import scrollIntoView from 'dom-scroll-into-view';

type InternalNamePath = (string | number)[];

/**
 * We will remove light way shake like:
 * errors -> none -> errors (in 100 ms)
 * to
 * errors (in 100 ms)
 */
function useDebounce<T>(content: T[], delay: number = 10): T[] {
  const [cache, setCache] = React.useState(content);

  // React hooks still have bug with unmount setState
  // https://github.com/facebook/react/issues/15057
  React.useEffect(() => {
    if (content.length) {
      setCache(content);
      return () => void 0;
    } else {
      const timeout = setTimeout(() => {
        setCache(content);
      }, delay);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [content]);

  return cache;
}

/**
 * Cache latest errors and trigger change event if visible change
 */
export function useCacheErrors(
  errors: React.ReactNode[],
  changeTrigger: (visible: boolean) => void,
) {
  const debounceErrors = useDebounce(errors);
  const [cacheErrors, setCacheErrors] = React.useState(debounceErrors);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const newVisible = !!debounceErrors.length;
    if (debounceErrors.length) {
      setCacheErrors(debounceErrors);
    }
    if (newVisible !== visible) {
      changeTrigger(newVisible);
    }
    setVisible(newVisible);
  }, [debounceErrors]);

  return [visible, cacheErrors];
}

export function toArray<T>(candidate?: T | T[] | false): T[] {
  if (candidate === undefined || candidate === false) return [];

  return Array.isArray(candidate) ? candidate : [candidate];
}

export function getFieldId(
  namePath: InternalNamePath,
  formName?: string,
): string | undefined {
  if (!namePath.length) return undefined;

  const mergedId = namePath.join('_');
  return formName ? `${formName}_${mergedId}` : mergedId;
}

// Source: https://github.com/react-component/form/blob/master/src/createDOMForm.js
function getScrollableContainer(current: HTMLElement) {
  let node: HTMLElement | null = current;
  let nodeName;
  /* eslint no-cond-assign:0 */
  while (node && (nodeName = node.nodeName.toLowerCase()) !== 'body') {
    const { overflowY } = getComputedStyle(node);
    // https://stackoverflow.com/a/36900407/3040605
    if (
      node !== current &&
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return nodeName === 'body' ? node!.ownerDocument : node;
}

export interface FormInstance extends RcFormInstance {
  scrollToField: (name: string | number | InternalNamePath) => void;
  __INTERNAL__: {
    name?: string;
  };
}

export function useForm(form?: FormInstance): [FormInstance] {
  const wrapForm: FormInstance = form || {
    ...useRcForm()[0],
    __INTERNAL__: {},
    scrollToField: name => {
      const namePath = toArray(name);
      const fieldId = getFieldId(namePath, wrapForm.__INTERNAL__.name);
      const node: HTMLElement | null = fieldId
        ? document.getElementById(fieldId)
        : null;

      if (node) {
        scrollIntoView(node, getScrollableContainer(node), {
          onlyScrollIfNeeded: true,
        });
      }
    },
  };

  return [wrapForm];
}

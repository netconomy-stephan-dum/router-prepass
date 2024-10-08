import { PnPNode } from '../types';
import createFormData from './createFormData';

interface FormSubmitEvent extends SubmitEvent {
  target: HTMLFormElement;
}
const addFormListener = (root: PnPNode) => {
  document.addEventListener('submit', (event: Event) => {
    const { submitter, target } = event as FormSubmitEvent;
    const action = submitter.getAttribute('form-action') || target.action || './';
    const method = submitter.getAttribute('formMethod') || target.method || 'GET';

    const state = {
      method,
      data: createFormData(target),
    };

    event.preventDefault();

    const { pathname, hash, search } = new URL(action);
    root.navigate?.({ pathname, hash, search, fullPathname: pathname }, state, false).then(() => {
      history.pushState(state, document.title, pathname + search + search);
    });
  });
};

export default addFormListener;

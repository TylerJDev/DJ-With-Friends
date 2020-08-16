/*
* A function which handles focus
*
* @param {{array|nodelist}} elem - An array of HTML elements
* @param {string|HTMLElement} focusTrap - A string of HTML element to trap focus in
*
* @example
*
*   focusEle([document.querySelector('body')]);
*   focusEle([document.querySelector('button.close')], '#modalContainer')
*
*/

export const focusEle = (elem, focusTrap = false) => {
  let focusElement = '';

  if (typeof elem === 'string') {
    elem = document.querySelectorAll(elem);
  }

  if (focusTrap !== false) {
    const container = typeof focusTrap === 'string' ? document.querySelector(focusTrap) : focusTrap;

    if (container !== null && container.querySelectorAll !== undefined) {
      const focus_elems = container.querySelectorAll('button, a, input, select, [tabindex="0"]');
      focus_elems.forEach((curr) => {
        curr.addEventListener('keydown', (event) => {
          if (event.key === 'Tab') {
            const index_elem = Array.from(focus_elems).indexOf(event.target);

            // If last
            if (index_elem + 1 === focus_elems.length) {
              setTimeout(() => {
                focus_elems[0].focus();
              }, 10);
            } else if (index_elem === 0 && event.shiftKey == true) {
              setTimeout(() => {
                focus_elems[focus_elems.length - 1].focus();
              }, 10);
            }
          }
        });
      });
    }
  }

  elem.forEach((current) => {
    let currentElem = '';

    // If array of strings
    if (typeof current === 'string') {
      currentElem = document.querySelector(current) !== null ? document.querySelector(current) : '';
    }

    // If element
    if (typeof current === 'object' && current !== null) {
      currentElem = current.parentNode !== null ? current : '';
    }

    if (focusElement === '' && currentElem !== '') {
      focusElement = currentElem;
    }
  });

  if (focusElement !== '') {
    focusElement.focus();
  }
};

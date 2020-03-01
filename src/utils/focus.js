/*
* A function which handles focus
*
* @param {{array|nodelist}} elem - An array of HTML elements
*
* @example 
*   
*   focusEle([document.querySelector('body')]);
*
*/

export const focusEle = (elem) => {
  let focusElement = '';

  if (typeof elem === 'string') {
    console.log(elem);
    elem = document.querySelectorAll(elem);
    console.log(elem);
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
} 
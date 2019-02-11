import React from 'react';

const stopPropagation = (e) => e.stopPropagation();
export const InputWrapper = ({children}) =>
  <div onClick={stopPropagation} style={{display: 'inline-flex'}}>
    {children}
  </div>;

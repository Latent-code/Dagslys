import React from 'react';

import MailWidget from './MailWidget';

const MailWidgetWrapper = ({ children }) => (
  <>
    {children}
    <MailWidget />
  </>
);

export default MailWidgetWrapper;
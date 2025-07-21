import React from 'react';
import { FormLabel } from './form';

const RequiredLabel = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
  <FormLabel htmlFor={htmlFor}>
    {children} <span className='text-red-500'>*</span>
  </FormLabel>
)

export default RequiredLabel

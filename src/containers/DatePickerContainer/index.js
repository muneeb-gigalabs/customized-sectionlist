import React, { useState } from 'react';
import CustomDatePicker from '../../components/CustomDatePicker';

const DatePickerContainer = () => {
  const [ dateValue, setDateValue ] = useState('')

  return (
    <CustomDatePicker label="Select date" value={dateValue} onChange={ (date) => setDateValue(date) } />
   );
}
 
export default DatePickerContainer;
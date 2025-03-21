import React, {ChangeEvent} from 'react';

interface propTypes {
  className?: string;
  placeholder: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function DpInput({className, placeholder, value, handleChange}: propTypes) {
  return (
    <input placeholder={placeholder} className={className} value={value} onChange={handleChange} />
  );
};

export default React.memo(DpInput);

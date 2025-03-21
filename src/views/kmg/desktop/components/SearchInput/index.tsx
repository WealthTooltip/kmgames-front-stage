import React, {ChangeEvent} from 'react';
import styles from './style.scss';
import {IconSearch} from '../Icon';

interface propTypes {
  className?: string;
  placeholder: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearchChange: () => void
};

function DpSearchInput({className, placeholder, value, handleChange, handleSearchChange}: propTypes) {
  return (
    <div className={styles.dp_search_input}>
      <input placeholder={placeholder} className={className} value={value} onChange={handleChange} />
      <button type='button' onClick={handleSearchChange}><IconSearch /></button>
    </div>
  );
};

export default React.memo(DpSearchInput);

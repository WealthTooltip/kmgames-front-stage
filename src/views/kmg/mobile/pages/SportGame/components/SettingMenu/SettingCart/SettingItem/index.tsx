import SwitchButton from '@core/templates/mobile/components/SwitchButton';
import {SettingItemType} from '..';
import style from './style.scss';

export default ({setting}: {setting: SettingItemType}) => {
  const {text, options, value, set} = setting;
  return (
    <div className={style.wrapper}>
      <span>{text}</span>
      {options && value && set ? (
          <SwitchButton
            className='switch-btn'
            options={options}
            checked={value || options[0].value}
            onChange={set}
          />
      ) : (
          <div className='link-ietm'>
            <img src={require('../../i/icon-earth.png')} alt="" />
            <span className='link-text'>前往网页版</span>
          </div>
      )}
    </div>
  );
};

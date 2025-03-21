import TStore from '@core/reducers/_reduxStore';
import Overlay from '@template/components/Overlay';
import {useSelector} from 'react-redux';
import SettingCart from './SettingCart';
import useSettings from '@core/hooks/sports/useSettings';
import {useEffect, useState} from 'react';
import style from './style.scss';


export default () => {
  const isOpen = useSelector((state: TStore) => state.sport.settingMenu.isOpen);
  const {handleSettingMenu} = useSettings();
  const [open, setOpen] = useState(isOpen);

  useEffect(()=>{
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    if (isOpen) {
      setTimeout(()=>{
        handleSettingMenu();
      }, 400);
    }
  };
  return (
    <>
      {isOpen ?
      <Overlay display zIndex={10} close={() => handleClose()} >
        <div className={`${style.wrapper} ${open ?' active' : 'hidden'}`}>
          <SettingCart onClose = {handleClose} />
        </div>
      </Overlay> :
      null}

    </>
  );
};

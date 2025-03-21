/*
 * @Description: 整体框架，包含全局组件等
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2024-01-15 16:38:10
 * @LastEditors: Galen.GE
 */
// import Modal from '@core/templates/desktop/components/Modal';
import Loading from '@core/templates/mobile/components/Loading';
import Toast from '@core/templates/mobile/components/Toast';
import 'react-toastify/dist/ReactToastify.css';
import useBootstrap from '@hooks/useBootstrap';
import css from './style.scss';
import PopupModal from '@core/templates/mobile/components/PopupModal';
import BettingModeModalPopup from '@core/templates/mobile/components/PopupModal/bettingModeModalPopup';
import {ALL_GAME_BETTING_TYPE} from '@core/constants/enum/sport';
import useSettings from '@core/hooks/sports/useSettings';
import storage from '@helpers/storage';

function Framework({children}: any) {
  useBootstrap();
  const [openModal, setOpenModal] = React.useState(!storage.get('CUR_GAME_BETTING_TYPE'));
  const {gameBettingType, switchGameBettingByType} = useSettings();

  return (
    <div className={css.wrapper}>
      <Toast />
      <Loading />
      <PopupModal />
      <BettingModeModalPopup
        open={openModal}
        // open={openModal? true: true}
        mode={ALL_GAME_BETTING_TYPE[1].code === gameBettingType ? 1 : 0}
        onCancel={() => setOpenModal(false)}
        onSelect={(mode) => {
          switchGameBettingByType(ALL_GAME_BETTING_TYPE[mode].code);
          setOpenModal(false);
        }}
      />
      {children}
    </div>
  );
}

export default Framework;

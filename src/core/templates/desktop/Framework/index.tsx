/*
 * @Description: 整体框架，包含全局组件等
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-14 11:01:07
 * @LastEditors: Passion.KMG
 */
// import Modal from '@core/templates/desktop/components/Modal';
import Loading from '@core/templates/desktop/components/Loading';
import Toast from '@core/templates/desktop/components/Toast';
import 'react-toastify/dist/ReactToastify.css';
import useBootstrap from '@hooks/useBootstrap';
import css from './style.scss';
import PopupModal from '@core/templates/desktop/components/PopupModal';

function Framework({children}: any) {
  useBootstrap();

  return (
    <div className={css.wrapper}>
      <Toast />
      <Loading />
      {/* <Modal /> */}
      <PopupModal />
      {children}
    </div>
  );
}

export default Framework;

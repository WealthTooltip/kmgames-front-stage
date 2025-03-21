/*
 * @Author: Passion.KMG
 * @Date: 2023-12-14 11:00:08
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/templates/desktop/components/Toast/index.tsx
 * @Description:
 */
import {ToastContainer, toast} from 'react-toastify';
import usePublicState from '@core/hooks/usePublicState';
import classnames from 'classnames';
import styles from './style.scss';
import success from './success.svg';
import error from './error.svg';
import info from './info.svg';

const getImageByType = (img: string) => {
  switch (img) {
    case 'success':
      return success;
    case 'error':
      return error;
    default:
      return info;
  }
};

const CustomToast = ({text, img}: {text: string, img: string} ) => {
  return <div className='custom-toast-content'>
    <img src={getImageByType(img)} alt={img}/>
    <span>{text}</span>
  </div>;
};
export default function() {
  const {base, dispatch, ACTIONS} = usePublicState();

  React.useEffect(() => {
    if (!base.toast.text) {
      return;
    }

    toast(<CustomToast text={base.toast.text} img={base.toast.types as string}/>, {
      closeButton: false,
      position: 'top-center',
      style: {
        width: 'fit-content',
        maxWidth: '300px',
        minHeight: '34px', // Set the height
        padding: '11px 30px 9px 30px',
      },
    });
    dispatch(ACTIONS.BASE.openToast({text: null}));
  }, [base.toast.text]);

  return <ToastContainer className={classnames(styles.toast, base.toast.types)} />;
}

// 17:55:31 GMT+8

import {Modal, Button} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
import {PopupProps} from '..';
const TipModalNotice3 = ({open, title, content, actions, onCancel}: PopupProps) => {
  return (
    <>
      <Modal
        centered
        open={open}
        onCancel={onCancel}
        className={classnames(styles.modal, styles.modal4)}
        // width={275}
        footer={null}>
        <div className='body-content'>
          <div className='img-container'></div>
          <h4>Hi, 真不走运, 页面不见了</h4>
          <p>别紧张, 点“刷新”马上找回～</p>
          <Button
            key='ok'
            onClick={() => {
              actions[0].cb;
              onCancel();
            }}>
            {/* {actions[0].text ? actions[0].text : '投注记录'} */}
            {'刷新'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TipModalNotice3;

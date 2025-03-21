import {Modal, Button} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
import {PopupProps} from '..';
const TipModalNotice3 = ({open, title, content, actions, onCancel}: PopupProps) => {
  return (
    <>
      <Modal
        title='友情提示'
        centered
        open={open}
        onOk={actions[0].cb}
        onCancel={onCancel}
        className={classnames(styles.modal, styles.modal3)}
        footer={[
          <Button
            key='ok'
            onClick={() => {
              if (typeof actions[0]?.cb === 'function') actions[0]?.cb();
              onCancel();
            }}>
            {actions[0].text ? actions[0].text : '刷新'}
          </Button>,
        ]}>
        <h4 className='notice2-body-title'>{title ? title : '网络连接中断'}</h4>
        <p>{content ? (content as string) : '网络连接已断开，请检查您的网络'}</p>
      </Modal>
    </>
  );
};

export default TipModalNotice3;

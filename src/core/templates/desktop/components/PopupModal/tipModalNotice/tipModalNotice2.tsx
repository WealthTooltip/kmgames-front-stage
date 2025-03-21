import {Modal, Button} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
import {PopupProps} from '..';
const TipModalNotice2 = ({open, title, content, actions, onCancel}: PopupProps) => {
  return (
    <>
      <Modal
        title='友情提示'
        centered
        open={open}
        onOk={actions[0].cb}
        onCancel={onCancel}
        className={classnames(styles.modal, styles.modal2)}
        footer={[
          <Button
            key='ok'
            onClick={() => {
              actions[0].cb;
              onCancel();
            }}>
            {actions[0].text ? actions[0].text : '刷新'}
          </Button>,
        ]}>
        <h4 className='notice2-body-title'>{title ? title : 'Hi，真不巧，页面走丢了'}</h4>
        <p>{content ? content as string : '别紧张，点“刷新”马上找回~'}</p>
      </Modal>
    </>
  );
};

export default TipModalNotice2;

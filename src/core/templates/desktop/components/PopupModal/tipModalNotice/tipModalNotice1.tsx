import {Modal, Button} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
import {PopupProps} from '..';
const TipModalNotice1 = ({open, content, title, actions, onCancel}: PopupProps) => {
  return (
    <>
      <Modal
        title='友情提示'
        centered
        open={open}
        onOk={actions[0].cb}
        onCancel={onCancel}
        className={classnames(styles.modal, styles.modal1)}
        footer={[
          <Button
            key='ok'
            onClick={() => {
              actions[0].cb && actions[0].cb;
              onCancel();
            }}>
            {actions[0].text ? actions[0].text : '知道了'}
          </Button>,
        ]}>
        <h4 className='notice1-body-title'>{title ? title : '亲爱的用户'}</h4>
        {!content && <ul>
          <li>您的登录信息已失效，请关闭本页面</li>
          <li>再次重新进入本场馆</li>
          <li>祝您游戏愉快</li>
        </ul>}
        <ul>
          {content ? (
            (content as Array<string>).map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <>
              <li>您的登录信息已失效，请关闭本页面</li>
              <li>再次重新进入本场馆</li>
              <li>祝您游戏愉快</li>
            </>
          )}
        </ul>
      </Modal>
    </>
  );
};

export default TipModalNotice1;

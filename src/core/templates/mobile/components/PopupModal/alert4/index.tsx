import {Modal} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
import {PopupProps} from '..';
const TipModalNotice3 = ({open, title, content, actions, onCancel}: PopupProps) => {
  return (
    <>
      <Modal
        centered
        open={open}
        // onOk={actions[0].cb}
        onCancel={onCancel}
        className={classnames(styles.modal, styles.modal4)}
        // width={275}
        footer={null}>
        <div className='body-content'>
          <p>您暂无结算数据</p>
          <p>
            如需查询历史记录，请访问
            <span
              key='ok'
              onClick={() => {
                actions[0].cb;
                onCancel();
              }}>
              {actions[0].text ? actions[0].text : '投注记录'}
            </span>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default TipModalNotice3;

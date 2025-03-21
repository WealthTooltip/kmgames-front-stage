import {Modal, Button} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
import {PopupProps} from '..';

const TipModalLeave = ({open, title, content, actions, onCancel}: PopupProps) => {
  return (
    <>
      <Modal
        // title={title ? title : '温馨提示'}
        centered
        open={open}
        onOk={actions[0].cb}
        onCancel={onCancel}
        className={classnames(styles.modal)}
        width={285}
        footer={null}>
        <div className='body-title'>{title ? title : '温馨提示'}</div>
        <div className='body-content'>{content ? (content as string) : '确定取消本场比赛预约'}</div>
        <div className="body-footer">
          <div className="btn-cancel">
            <Button key='cancel' onClick={onCancel}>
              {actions[0].text ? actions[0].text : '取消'}
            </Button>
          </div>
          <div className="btn-ok">
            <Button key='ok' onClick={()=>{
              actions[1].cb;
              onCancel();
            }}>
              {actions[1].text ? actions[1].text : '确定'}
            </Button>
          </div>


        </div>
      </Modal>
    </>
  );
};

export default TipModalLeave;

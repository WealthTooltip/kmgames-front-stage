import {Modal, Button} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';
import {PopupProps} from '..';

const TipModalLeave = ({open, title, content, actions, onCancel}: PopupProps) => {
  const BtnColor = (item: any) => (item.className === 'cancel' ? 'default' : 'primary');
  return (
    <>
      <Modal
        title={title ? title : '温馨提示'}
        centered
        open={open}
        onOk={actions[0].cb}
        onCancel={onCancel}
        className={classnames(styles.modal)}
        footer={actions.map((item: any, index: number) => (
          <Button
            key={index}
            onClick={() => {
              !item.keepOpen && close && close();
              item.cb && item.cb();
            }}
            className={`${item.type || 'yes'}`}
            type={BtnColor(item)}
          >
            {item.text}
          </Button>
        ))}>
        <p>{content ? content as string : '您当前操作将会离开游戏，是否继续？'}</p>
      </Modal>
    </>
  );
};

export default TipModalLeave;

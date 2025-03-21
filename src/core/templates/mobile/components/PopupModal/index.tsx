import ConfirmModal from './confirmModal';
import AlertModal4 from './alert4';
import AlertModal3 from './alert3';
import {useDispatch, useSelector} from 'react-redux';
import ACTIONS from '@actions/index';
import {PopupTypeEnum} from '@core/constants/enum/common';

export interface PopupProps {
  loading?: boolean;
  onOk?: () => void;
  onCancel: () => void;
  title?: string;
  content?: string | object | Array<string>;
  actions: any[];
  open: boolean;
}
interface PopupModals {
  [key: number]: React.FunctionComponent<PopupProps>;
}

const popupModals: PopupModals = {
  [PopupTypeEnum.CONFIRM]: ConfirmModal,
  [PopupTypeEnum.ALERT4]: AlertModal4,
  [PopupTypeEnum.ALERT3]: AlertModal3,
};

const PopupModal = () => {
  const {display, title, content, actions, type} = useSelector((state: any) => state.base.modal);
  const dispatch = useDispatch();
  const close = () => dispatch(ACTIONS.BASE.closeModal());
  const actionsClone = _.chain(actions).cloneDeep().value();
  const Component = popupModals[type];
  const [open, setOpen] = React.useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (!open) {
      close();
    }
  }, [open]);
  React.useEffect(() => {
    if (display) {
      setOpen(true);
    }
  }, [display]);
  return display ? (
    <Component onCancel={handleCancel} actions={actionsClone} title={title} content={content} open={open} />
  ) : (
    <></>
  );
};

export default PopupModal;

import TipModalLeave from './tipModalLeave';
import TipModalNotice1 from './tipModalNotice/tipModalNotice1';
import TipModalNotice2 from './tipModalNotice/tipModalNotice2';
import TipModalNotice3 from './tipModalNotice/tipModalNotice3';
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
  [PopupTypeEnum.CONFIRM]: TipModalLeave,
  [PopupTypeEnum.ALERT1]: TipModalNotice1,
  [PopupTypeEnum.ALERT2]: TipModalNotice2,
  [PopupTypeEnum.ALERT3]: TipModalNotice3,
  // 4: BettingModeModalPopup,
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
    setTimeout(() => close(), 1000);
  };
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

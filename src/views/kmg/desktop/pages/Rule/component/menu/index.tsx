import classNames from 'classnames';
import styles from './style.scss';
import {IData} from '../detail/data';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import {useMemo} from 'react';
import usePublicState from '@core/hooks/usePublicState';
import {useMount} from 'react-use';
import {menuList} from './data';

export interface IProps {
  title: string;
  onClick?: () => void;
  tdata?: IData;
}

interface IDpMenuItemProps extends IProps {
  isSelected: boolean;
}

interface IDpMenuProps{
  selectedItem: number;
  selectItem: (index: number) => void;
}

const DpMenuItem = ({title, isSelected, onClick}: IDpMenuItemProps) => {
  return (
    <div
      className={classNames(styles.DpMenu, 'menu-item', {'selected': isSelected})}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

const DpMenu = ({selectedItem, selectItem}:IDpMenuProps) => {
  const sportList = useSelector((state: TStore) => state.sport.display.matchStatistics);
  const list = useMemo(() => sportList, [sportList]);
  const {dispatch, ACTIONS} = usePublicState();
  useMount(()=> {
    dispatch(ACTIONS.SPORT.getMatchStatistics({
      params: {querys: undefined},
    }));
  });

  return (
    <div className={classNames(styles.menuWrapper)}>
      {menuList.map((item, idx) => (
        (list.filter((list) => list.count > 0).find((list)=> list.sportName === item.title) || ['一般体育说明', '投注教程', '连串过关/复式过关/组合过关', '冠军', '电子竞技'].includes(item.title)) && item .tdata && (
          <DpMenuItem
            {...item}
            key={idx}
            isSelected={selectedItem === idx}
            onClick={() => selectItem(idx)}
          />
        )
      ))}
    </div>
  );
};

export default DpMenu;


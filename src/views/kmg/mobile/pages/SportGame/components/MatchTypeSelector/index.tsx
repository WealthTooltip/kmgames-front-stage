/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 12:40:58
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/TypeSelector/index.tsx
 * @Description:
 */

// import DpIcon from '@views/kmg/mobile/components/Icon';
import css from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import useSettings from '@core/hooks/sports/useSettings';
import {EMatchTypes} from '@core/constants/enum/sport';
import classnames from 'classnames';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import dayjs from 'dayjs';
import {formatCurrency} from '@core/helpers/unit';

export default React.memo(() => {
  const {user} = usePublicState();
  const {switchMatchType} = useSettings();
  const [selectIndex, setSelectIndex] = useState(0);
  const onChangeType = (index: number, type: EMatchTypes) => {
    switchMatchType(type);
    setSelectIndex(index);
  };
  return (
    <>
      <div className={css.wrapper}>
        <div className='div'>
          {/* <DpIcon type="arrow" /> */}
          <div className='navbar'>
            <div className={classnames('text-wrapper', {active: selectIndex === 0})} onClick={() => onChangeType(0, EMatchTypes.IN_PLAY)}>今日</div>
            <div className={classnames('text-wrapper', {active: selectIndex === 1})} onClick={() => onChangeType(1, EMatchTypes.IN_PLAY)}>滚球</div>
            <div className={classnames('text-wrapper', {active: selectIndex === 2})} onClick={() => onChangeType(2, EMatchTypes.EARLY)}>早盘</div>
            {/* <div className='text-wrapper'>串关</div> */}
            {/* <div className='text-wrapper'>冠军</div> */}
          </div>
        </div>
        <div className='div-2'>
          <div className='group'>
            <img className='union' alt='Union' src={require('./i/union.svg')} />
          </div>
          <div className='text-wrapper-3'>{formatCurrency(user.info.totalBalance)}</div>
        </div>
      </div>
      {
        selectIndex === 2 &&
        <DatePicker />
      }
    </>
  );
});

export const DatePicker = React.memo(() => {
  const earlyGroup = useSelector((state: TStore) => state.sport.display.earlyGroup);
  const {switchQueryDate} = useSettings();
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const [index, setIndex] = useState(0);
  if (!earlyGroup) {
    return <></>;
  }
  const week = _.times(7).map((i) => ({
    name: dayjs()
        .add(i + 1, 'day')
        .format('MM/DD'),
    count: earlyGroup[i + 1],
  }));
  const dates = [{name: '所有', count: earlyGroup[0]}, ...week, {name: '其他', count: _.last(earlyGroup)}];
  const handleClick = (idx: number) => {
    switchQueryDate(idx);
    setIndex(idx);
  };
  useEffect(() => {
    handleClick(0);
  }, [sportId]);
  return (
    <div className="date-list">
      {
        dates.map((item, idx) => (
          <div className={classnames('option-item', {active: idx === index})} onClick={() => handleClick(idx)} key={item.name}>{item.name}</div>
        ))
      }
    </div>
  );
});

/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 12:19:40
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/SingleCart/Header/index.tsx
 * @Description:
 */
import {useSelector} from 'react-redux';
import useProfile from '@core/hooks/users/useProfile';
import TStore from '@core/reducers/_reduxStore';
import {formatCurrency} from '@helpers/unit';
import style from './style.scss';

export default () => {
  const {loadingProfile, getProfile} = useProfile();
  const info = useSelector((state: TStore) => state.user.info);

  return (
    <div className={style.wrapper}>
      <span className="type">单</span>
      <span className="brand">DP体育</span>
      <span className="balance">
        <em>{loadingProfile ? formatCurrency(info.totalBalance) : formatCurrency(info.totalBalance || 0)}</em>
        <img src={require('./i/icon-refresh.png')} className={loadingProfile?'rotate':''} onClick={() => getProfile()} />
      </span>
    </div>
  );
};

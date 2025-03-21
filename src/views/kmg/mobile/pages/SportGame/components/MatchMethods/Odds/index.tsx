/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 18:34:51
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Odds/index.tsx
 * @Description:
 */
import {ESportsCategory} from '@constants/enum/sport/sportsCategory';
import FootBall from './FootBall';
import {PlayType} from '@core/services/Table';
import style from './style.scss';
import {getMobilePlayListBySid, mobileTransforMarkets} from '@core/utils';
import {useMemo} from 'react';
import {EmptyOddItem, OddItem} from './OddsItem';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import classnames from 'classnames';

interface IMatchTitlesProps {
  sportId: number;
  mks: PlayType[];
}
export default ({sportId, mks}: IMatchTitlesProps) => {
  return (
    <div className={classnames(style.oddsWrapper, '123', {other: ![1, 12].includes(sportId)})}>
      <Odds sportId={sportId} mks={mks} />
    </div>
  );
};

const EmptyItem = () => {
  return (
    <div className={style.oddsWrapper}>
      <EmptyOddItem />
      <EmptyOddItem />
    </div>
  );
};

const Odds = ({sportId, mks}: IMatchTitlesProps) => {
  const gameList = useMemo(() => getMobilePlayListBySid(sportId), [sportId]);
  const markets: PlayType[] = useMemo(() => {
    return mobileTransforMarkets(sportId, mks, gameList);
  }, [gameList, sportId, mks]);
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  switch (sportId) {
    case ESportsCategory.FOOTBALL:
      return <FootBall data={mks} />;
    default:
      return <div className={style.oddsWrapper}>
        <div className="swiper-slide default-wrapper">
          {
            markets.map((item, idx) => (
              item ?
              <div key={`${item.code}_${item.name}`}>
                {
                  item.mks[0]?.ops?.map((op) => <OddItem isInList={true} key={op.id} op={op} oddType={currentOddType} methodCode={item.code} />)
                }
              </div> : <EmptyItem key={idx} />
            ))
          }
        </div>
      </div>;
  }
};

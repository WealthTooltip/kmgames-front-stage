import {PlayType, TMatch} from '@core/services/Table';
import {getNewbiePlayListBySid, transforMarkets} from '@core/utils';
import {EmptyOddItem, OddItem} from '../../MatchMethods/Odds/OddsItem';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
interface IMatchTitlesProps {
  match: TMatch;
}

const Odds = ({match}: IMatchTitlesProps) => {
  const gameList = getNewbiePlayListBySid(match.sportId, match.round);
  const markets: (undefined | PlayType)[] = transforMarkets(match, gameList);
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  return (
    <>
      {
        markets[0]?.mks[0]?.ops?.map((op) => <OddItem key={op.id} op={op} oddType={currentOddType} methodCode={markets[0].code} />)
      }
      {
        !markets[0]?.mks[0]?.ops &&
        new Array(match.sportId === 1 ? 3 : 2).fill(0).map((_, idx) => <EmptyOddItem key={idx} />)
      }
    </>
  );
};

export default Odds;

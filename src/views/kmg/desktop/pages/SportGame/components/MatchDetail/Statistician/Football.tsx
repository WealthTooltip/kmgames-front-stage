import {EStaticsType, EStaticsTypeName} from '@core/constants/enum/sport';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import useTheme from '@core/hooks/useTheme';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import {useMemo} from 'react';
import classnames from 'classnames';
import {Progress} from 'antd';

const FootBall = () => {
  const {jsTheme} = useTheme();
  const {matchDetail} = useMatchDetail();
  const {getScoreByTypeId, matchDetailStatistics} = useMatchStatistics();
  const circleList = useMemo(() => {
    const attak = getScoreByTypeId(EStaticsType.attak);
    const danger = getScoreByTypeId(EStaticsType.dangerAttack);
    const kql = getScoreByTypeId(EStaticsType.BallPossession);
    return [
      {title: EStaticsTypeName[EStaticsType.attak], hScore: attak[0], aScore: attak[1]},
      {title: EStaticsTypeName[EStaticsType.dangerAttack], hScore: danger[0], aScore: danger[1]},
      {title: EStaticsTypeName[EStaticsType.BallPossession], hScore: kql[0], aScore: kql[1]},
    ];
  }, [matchDetailStatistics, matchDetail?.matchId]);

  const lineList = useMemo(() => {
    const sz = getScoreByTypeId(EStaticsType.shotsOnGoal);
    const sp = getScoreByTypeId(EStaticsType.shotsOffGoal);
    return [
      {title: EStaticsTypeName[EStaticsType.shotsOnGoal], hScore: sz[0], aScore: sz[1]},
      {title: EStaticsTypeName[EStaticsType.shotsOffGoal], hScore: sp[0], aScore: sp[1]},
    ];
  }, [matchDetailStatistics, matchDetail?.matchId]);
  return (
    !!matchDetail &&
    <div className='statistician_content'>
      <div className='circle_wrapper'>
        {circleList.slice(0, 10).map((item, index) => {
          const disabled = (item.hScore === item.aScore) && item.hScore === 0;
          return (
            <div key={index} className='circle_item'>
              <div className='circle_item_top'>
                <span>{item.hScore}</span>
                <Progress
                  percent={100}
                  success={{percent: item.hScore === item.aScore ? 50 : Math.ceil(item.aScore * 100 / (item.hScore + item.aScore)), strokeColor: disabled ? jsTheme.dpAncillary : '#EA3B3B'}}
                  type='circle'
                  showInfo={false}
                  size={45}
                  strokeWidth={8}
                  strokeColor={disabled ? jsTheme.dpAncillary : '#3586FF'}
                />
                <span>{item.aScore}</span>
              </div>
              <div className='circle_item_bottom'>{item.title}</div>
            </div>
          );
        })}
      </div>
      <div className='line_wrapper'>
        {lineList.map((item, index) => {
          const disabled = (item.hScore === item.aScore) && item.hScore === 0;
          return (
            <div key={index} className={classnames('line_item', {disabled})}>
              <div className='line_item_title'>{item.title}</div>
              <div className='line_item_botttom'>
                <span>{item.hScore}</span>
                <div className='baseLine'>
                  <div className='line_inner' style={{width: Math.ceil(item.hScore * 100 / (item.hScore + item.aScore)) + '%'}}></div>
                </div>
                <span>{item.aScore}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FootBall;

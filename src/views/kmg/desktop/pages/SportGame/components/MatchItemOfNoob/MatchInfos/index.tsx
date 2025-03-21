/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/index.tsx
 * @Description:
 */
import dayjs from 'dayjs';
import {PlayType, TOrder} from '@core/services/Table';
import classnames from 'classnames';
import usePublicState from '@core/hooks/usePublicState';
import {TMatch} from '@core/services/Table';
import Timer from '@views/kmg/desktop/components/Timer';
import styles from './style.scss';
import {getMatchStatusByPeriod} from '@core/utils';
import {LockOutlined} from '@ant-design/icons';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import DpImage from '@this/components/Image';
import useZoomMatch from '@core/hooks/sports/useZoomMatch';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import {Tooltip} from 'antd';

interface IProps{
  match: TMatch,
  market?: (undefined | PlayType)
  getViewOdd?:Function
  addAndRemoveOrder?:Function,
  orderTags?:String[]
  locked?: boolean;
}
export default React.memo(({match, market}: IProps) => {
  const {dispatch, ACTIONS} = usePublicState();
  const {getViewOdd} = useOddTransfer();
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const getOps = (market:PlayType, type:String = 'Home')=>{
    const ops:TOrder[] = _.get(market, 'mks[0].ops');
    return ops.find(((item)=>item.type.toString().toUpperCase() === type.toUpperCase() || (type === 'Home' ? item.type === item.teams.home.name : item.type === item.teams.away.name)));
  };
  const onBet = (teamInfo: TOrder, event: React.MouseEvent) => {
    event.stopPropagation();
    addAndRemoveOrder(teamInfo);
  };
  const {openZoom} = useZoomMatch();
  const onOpen = () => {
    openZoom(match.matchId);
  };
  const HomeRender = ()=>{
    const teamInfo = getOps(market, 'Home');
    if (!teamInfo) {
      return (
        <div className='team left team-odds-item disabled'>
          <span>-</span>
          <Tooltip title={match.teams.home.name} placement='top'>
            <div className="team-name">{match.teams.home.name}</div>
          </Tooltip>
          <DpImage size={30} width={30} src={match.teams.home.icon} type="team"/>
        </div>
      );
    }
    const className = ['team left team-odds-item', teamInfo?.available ? 'between' : 'disabled', _.includes(orderTags, teamInfo.tag) ? 'active' : '', teamInfo.available && !teamInfo.locked && teamInfo.change];
    return teamInfo && (
      <div className={className.join(' ')} onClick={(e) => onBet(teamInfo, e)}>
        {
          teamInfo.locked ? <LockOutlined /> : <span className={classnames('odd')}>{getViewOdd(teamInfo.od, teamInfo.oddBetType)}</span>
        }
        <Tooltip title={match.teams.home.name} placement='top'>
          <div className="team-name">{match.teams.home.name}</div>
        </Tooltip>
        <DpImage active={_.includes(orderTags, teamInfo.tag)} size={30} width={30} src={match.teams.home.icon} type="team"/>
      </div>
    );
  };
  const DrawRender = ()=> {
    if (match.sportId !== 1) {
      return <span className="text-normal">{match.matchClock.isRunning ? '-' : getMatchStatusByPeriod(match.matchClock.period)}</span>;
    };
    const teamInfo = getOps(market, 'Draw');
    if (!teamInfo) {
      return (
        <div className='team left team-odds-item disabled'>
          <div>平局</div>
          <div className="team-score">
            <span>-</span>
          </div>
        </div>
      );
    }
    const className = ['team-min team-odds-item', teamInfo?.available ? 'between' : 'disabled', _.includes(orderTags, teamInfo.tag) ? 'active' : '', teamInfo.available && !teamInfo.locked && teamInfo.change];
    return teamInfo && <>
      <div className={className.join(' ')} onClick={(e) => onBet(teamInfo, e)}>
        <div>平局</div>
        <div className="team-score">
          {
            teamInfo.locked ? <LockOutlined /> :<span className={classnames('odd')}>{getViewOdd(teamInfo.od, teamInfo.oddBetType)}</span>
          }
        </div>
      </div>
    </>;
  };
  const AwayRender = ()=>{
    const teamInfo = getOps(market, 'Away');
    if (!teamInfo) {
      return (
        <div className='team left team-odds-item disabled'>
          <DpImage size={30} width={30} src={match.teams.away.icon} type="team"/>
          <Tooltip title={match.teams.away.name} placement='top'>
            <div className="team-name">{match.teams.away.name}</div>
          </Tooltip>
          <span>-</span>
        </div>
      );
    }
    const className = ['team right team-odds-item', teamInfo?.available ? 'between' : 'disabled', _.includes(orderTags, teamInfo.tag) ? 'active' : '', teamInfo.available && !teamInfo.locked && teamInfo.change];
    return teamInfo && (
      <div className={className.join(' ')} onClick={(e) => onBet(teamInfo, e)}>
        <DpImage size={30} width={30} src={match.teams.away.icon} active={_.includes(orderTags, teamInfo.tag)} type="team"/>
        <Tooltip title={match.teams.away.name} placement='top'>
          <div className="team-name">{match.teams.away.name}</div>
        </Tooltip>
        {
          teamInfo.locked ? <LockOutlined /> : <span className={classnames('odd')}> {getViewOdd(teamInfo.od, teamInfo.oddBetType)}</span>
        }
      </div>
    );
  };
  const RenderScore = (isHome?:boolean)=>{
    const {matchClock, score} = match;
    if (matchClock.period) {
      return <div className='home-score'>{isHome? score.home : score.away}</div>;
    }
    return <div className='home-score'></div>;
  };

  const LockedOdd = React.memo(({match, locked}:IProps)=>{
    return (
      <div className={classnames(styles.team_info, 'pointer locked-odd')}>
        <div className='datas'>{match.sportId > 33 ? match.round?.toUpperCase() : '数据'}</div>
        <div className='team left'>
          <span className={classnames('odd')}>
            {
              locked ? <LockOutlined /> : '-'
            }
          </span>
          <div className='team-name'>{match.teams.home.name}</div>
          <DpImage size={30} width={30} src={match.teams.home.icon} type="team"/>
        </div>
        {RenderScore(true)}
        {
          match.sportId !== 1 ? <span className="text-normal">{match.matchClock.isRunning ? '-' : getMatchStatusByPeriod(match.matchClock.period)}</span> : (
            <div className='team-min align'>
              <div>平局</div>
              <div className='team-score'>
                <span className={classnames('odd')}>
                  {
                    locked ? <LockOutlined /> : '-'
                  }
                </span>
              </div>
            </div>
          )
        }
        {RenderScore()}
        <div className='team right'>
          <DpImage size={30} width={30} src={match.teams.away.icon} type="team"/>
          <div className='team-name'>{match.teams.away.name}</div>
          <span className={classnames('odd')}>
            {
              locked ? <LockOutlined /> : '-'
            }
          </span>
        </div>
        <div className='more' onClick={onOpen}>更多</div>
      </div>
    );
  });
  const matchListUpdateTime = useSelector((state: TStore) => state.sport.display.matchListUpdateTime);
  return <>
    <div className={classnames(styles.match_status, 'pointer')} onClick={() => dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}))}>
      {
        match.matchClock.isRunning ?
          (
            <>
              <p>{getMatchStatusByPeriod(match.matchClock.period)}</p>
              {
                (match.matchClock.period !== 'HT' && match.matchClock.period !== 'FT' && match.matchClock.second > 0) &&
              (
                <p className="mt-8">
                  {
                    match.sportId === 1 ? <Timer seconds={match.matchClock.second} key={`${match.matchId}_${match.matchClock.second}_${matchListUpdateTime}`} /> : <span>{match.matchClock.playTime}</span>
                  }
                </p>
              )
              }
            </>
          ) :
          (
            <>
              <p>{dayjs(match.matchClock.startTime).format('MM月DD日')}</p>
              <p className="mt-8">{dayjs(match.matchClock.startTime).format('HH:mm')}</p>
            </>
          )
      }
    </div>
    {
      (market && !market.mks[0].ops.some((op) => !op.available)) ? (
        <div className={classnames(styles.team_info, 'pointer')} onClick={() => dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}))}>
          <div className='datas'>{match.sportId > 33 ? match.round?.toUpperCase() : '数据'}</div>
          {HomeRender()}
          {RenderScore(true)}
          {DrawRender()}
          {RenderScore()}
          {AwayRender()}
          <div className='more' onClick={()=> onOpen()}>更多</div>
        </div>
      ):<LockedOdd match={match} locked={market?.mks[0].ops.some((op) => op.locked)}/>
    }
  </>;
});

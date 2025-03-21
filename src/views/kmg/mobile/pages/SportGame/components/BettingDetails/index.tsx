
import {useState} from 'react';
import styles from './style.scss';
import BettingContent from './Betting';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import Overlay from '@template/components/Overlay';
import useMathMedia from '@core/hooks/sports/useMathMedia';
import Live from '@views/kmg/mobile/components/Live';
import DpIcon from '@views/kmg/mobile/components/Icon';
import DpImage from '@views/kmg/mobile/components/Image';
import classnames from 'classnames';
import {getMatchStatusByPeriod} from '@core/utils';
import CountdownLite from '@this/pages/SportGame/components/CountdownLite';
import dayjs from 'dayjs';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {EStaticsScoreType, EStaticsType} from '@core/constants/enum/sport';
import LeagueLists from './LeagueLists';
import ESportsCategory from '@constants/enum/sport/sportsCategory';
import BettingExpect from './BettingExpect';
import BettingStarter from './BettingStarter';
import BetResult from './BetResult';


export function BettingDetails() {
  const [isActive, setIsActive] = useState(0);
  const {matchDetail, isVisiableDetail, detailUpdateTime} = useMatchDetail();
  const {mediaData, mediaAvailableStatus} = useMathMedia({matchId: matchDetail?.mid1, videoId: matchDetail?.pdId});
  const hasList = [...mediaAvailableStatus];
  const [selected, setSelected] = useState<'video' | 'animation'>(null);
  const categories = [
    {
      id: 0,
      label: '投注',
    },
    {
      id: 1,
      label: '首发',
    },
    {
      id: 2,
      label: '前瞻',
    },
    {
      id: 3,
      label: '赛况',
    },
  ];
  const onMediaBack = () => {
    setSelected(null);
  };
  const {getScoreByTypeId, getScoreByScores} = useMatchStatistics();
  const yellow = getScoreByTypeId(EStaticsType.yellow);
  const corner = getScoreByTypeId(EStaticsType.cornerKicks);
  const p1 = getScoreByScores(EStaticsScoreType.q1); // 半场比分
  if (!isVisiableDetail) return null;
  const getClassName = () => {
    let className = 'hero ';
    if (matchDetail?.sportId > 33) {
      className += 'esports';
    } else {
      const item = ESportsCategory.find((sport) => sport.sportId === matchDetail?.sportId);
      className += 'sport-' + item?.sportId;
    }
    return className;
  };
  return (
    <Overlay display={isVisiableDetail} zIndex={10} close={close}>
      <div className={styles.wrapper}>
        <div className={getClassName()}>
          <LeagueLists />
          <div className='match-status'>
            <div className='match-team'>
              <div className='icon'>
                <DpImage size={38} type='team' src={matchDetail?.teams.home.icon} alt="team-logo1" />
              </div>
              <div className='name'>
                {matchDetail?.teams.home.name}
              </div>
            </div>
            <div className='match-score'>
              <p className='time'>
                {
                  matchDetail?.isLive ? <>
                    <span>
                      {getMatchStatusByPeriod(matchDetail?.matchClock.period)}
                    </span>
                    {
                      (matchDetail?.matchClock.period !== 'HT' && matchDetail?.matchClock.period !== 'FT' && matchDetail?.matchClock.second > 0) && matchDetail?.sportId === 1 ?
                      <CountdownLite seconds={matchDetail?.matchClock.second} key={`${matchDetail?.matchId}_${matchDetail?.matchClock.second}_${detailUpdateTime}`} /> :
                      <span>{matchDetail?.matchClock.playTime}</span>
                    }
                  </> : <span>{dayjs(matchDetail?.matchClock.startTime).format('MM月DD日 HH:mm')}</span>
                }
              </p>
              {
                !!matchDetail?.matchClock?.period &&
                <p className='score'>{`${matchDetail?.score?.home}-${matchDetail?.score?.away}`}</p>
              }
            </div>
            <div className='match-team'>
              <div className='icon'>
                <DpImage size={38} type='team' src={matchDetail?.teams.away.icon} alt="team-logo1" />
              </div>
              <div className='name'>
                {matchDetail?.teams.away.name}
              </div>
            </div>
          </div>
          <div className="media-box">
            {
              hasList.map((item) => <span key={item} onClick={() => setSelected(item)}>
                <img src={require(`./i/${item}.webp`)} />
                {item === 'video' ? '视频直播' : '动画直播'}
              </span>)
            }
          </div>
          {
            selected && <div className="media-back" onClick={onMediaBack}>
              <DpIcon fill="#fff" type="arrow" />
            </div>
          }
          {
            selected === 'video' && mediaData?.videos?.length > 0 && <Live videos={mediaData?.videos} />
          }
          {
            selected === 'animation' && mediaData?.animation?.length > 0 && <iframe src={mediaData?.animation} />
          }
          {
            matchDetail?.sportId === 1 &&
            <div className='status-details'>
              <p className='firt-half'>上半场 {p1[0]}-{p1[1]}</p>
              <div className='item'>
                <div className='logo'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.1437 14.7229H1.90771V14.3029L7.47972 8.8149C7.47972 8.8149 13.1357 8.5643 14.1437 14.7229Z" fill="#50BF88"/>
                    <path d="M12.4997 14.2663H2.87891L7.39671 9.67432L7.89651 10.1643L4.55051 13.5663H12.4997V14.2663Z" fill="#FCFCFC"/>
                    <path d="M8.15198 14.086L7.54018 13.7472C7.74598 13.372 7.75018 13.022 7.55138 12.7112C7.26438 12.2576 6.57558 11.9692 5.97778 11.9902L5.93018 11.293C6.81218 11.237 7.71518 11.6626 8.14218 12.3332C8.47818 12.8652 8.48378 13.4868 8.15198 14.086Z" fill="#FCFCFC"/>
                    <path d="M2.606 14.7227H1.7002V1.41992L2.606 2.36492V14.7227Z" fill="#BFBFC0"/>
                    <path d="M10.0512 4.91292C10.0512 4.91292 8.02539 6.78892 6.60299 6.83092C5.3738 6.87012 4.93 6.41092 3.8534 6.22192C2.7754 6.03292 1.7002 6.90512 1.7002 6.90512V1.41992C1.7002 1.41992 4.91179 2.35092 6.2306 3.90772C7.54939 5.46452 10.0512 4.91152 10.0512 4.91152" fill="#DE4E52"/>
                  </svg>
                </div>
                <p className='details'>{`角球 ${corner[0]} - ${corner[1]}`}</p>
              </div>
              <div className='item'>
                <div className='logo'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="1" width="12" height="14" rx="2" fill="#F6B73D"/>
                  </svg>
                </div>
                <p className='details'>{`黄牌 ${yellow[0]} - ${yellow[1]}`}</p>
              </div>
              <div className='item'>
                <div className='logo'>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="1" width="12" height="14" rx="2" fill="#ED4949"/>
                  </svg>
                </div>
                <p className='details'>{`红牌 ${matchDetail?.score.homeRedCard} - ${matchDetail?.score.awayRedCard}`}</p>
              </div>
            </div>
          }
          {
            matchDetail?.sportId !== 1 && matchDetail?.sportId <= 33 &&
            <div className='status-details col-yelleow'>
              {matchDetail.score.periodScore.map((item) => (
                <p key={item.period}>{`${item.home} - ${item.away}`}</p>
              ))}
            </div>
          }
        </div>
        {
          matchDetail?.sportId <= 33 &&
          <ul className='noname-tab'>
            {categories.map((item) => (
              <li
                key={item.id}
                className={classnames({active: isActive === item.id})}
                onClick={() => setIsActive(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        }
        {isActive === 0 ?
          <BettingContent matchDetail={matchDetail} />:(
            isActive === 1 ?
              <BettingStarter /> : (
                isActive === 2 ?
                  <BettingExpect /> : (
                    isActive === 3 ?
                      <BetResult/>:<></>)
              )
          )
        }
      </div>
    </Overlay>
  );
}

export default BettingDetails;

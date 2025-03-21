import DpImage from '@this/components/Image';
import Timer from '@views/kmg/desktop/components/Timer';
import {Tooltip} from 'antd';
import {TMatch} from '@core/services/Table';
import classnames from 'classnames';
import './style.scss';

import {
  getMatchStatusByPeriod,
} from '@core/utils';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';

export default ({match}: { match: TMatch }) => {
  const {detailUpdateTime} = useMatchDetail();
  return (
    <div className="game-info">
      <div className="game-header flex-between items-center">
        <div className="team home items-center">
          <DpImage size={64} width={64} className="team-logo" type="team" src={match.teams.home.icon} />
          {match?.isLive ? (<div className={classnames('team-detail items-center', {'no-events': match.sportId !== 1})}>
            <div className="team-name items-center">
              <Tooltip title={match.teams.home.name}>
                {match.teams.home.name}
              </Tooltip>
            </div>
            <div className="events flex">
              <div className="event items-center">
                <img src={require('./i/concor.png')} alt="" />
                <span>{match.score.awayCorner}</span>
              </div>
              <div className="event items-center">
                <div className="red-card" style={{width: '16px', height: '16px'}} />
                <span>{match.score.awayRedCard}</span>
              </div>
              <div className="event items-center">
                <div className="yellow-card" style={{width: '16px', height: '16px'}} />
                <span>{match.score.awayYellowCard}</span>
              </div>
            </div>
          </div>) : (<div className="team-name-only">
            <div className="team-name items-center">
              <Tooltip title={match.teams.home.name}>
                {match.teams.home.name}
              </Tooltip>
            </div>
          </div>
          )}

        </div>
        <div className="score items-center">
          {
            match?.isLive ? (
              !match.matchClock.period ?
                <span>未开赛 </span> :
                (
                  <div>
                    <span className="match-time">
                      {getMatchStatusByPeriod(match.matchClock.period)}
                      {
                        ['1H', '2H'].includes(match.matchClock.period) && match.matchClock.second > 0 &&
                        <Timer seconds={match.matchClock.second} key={`${match?.matchId}_${match.matchClock.second}_${detailUpdateTime}`} />
                      }
                    </span>
                    <div className="match-part">{`${match.score.home} : ${match.score.away}`}</div>
                  </div>
                )
            ) : (<span className="vs-text">VS</span>)
          }
        </div>
        <div className="team away items-center">
          <DpImage size={64} className="team-logo" type="team" src={match.teams.away.icon} />
          {
            match?.isLive ? (
              <div className={(classnames('team-detail items-center', {'no-events': match.sportId !== 1}))}>
                <div className="team-name itmes-center">
                  <Tooltip title={match.teams.away.name}>
                    {match.teams.away.name}
                  </Tooltip>
                </div>
                <div className="events flex-reverse">
                  <div className="event items-center">
                    <img src={require('./i/concor.png')} alt="" style={{marginRight: '5px'}} />
                    <span>{match.score.awayCorner}</span>
                  </div>
                  <div className="event items-center">
                    <div className="red-card" style={{width: '16px', height: '16px', marginRight: '5px'}} />
                    <span>{match.score.awayRedCard}</span>
                  </div>
                  <div className="event items-center">
                    <div className="yellow-card" style={{width: '16px', height: '16px', marginRight: '5px'}} />
                    <span>{match.score.awayYellowCard}</span>
                  </div>
                </div>
              </div>
            ) : (<div className="team-name itmes-center">
              <Tooltip title={match.teams.away.name}>
                {match.teams.away.name}
              </Tooltip>
            </div>)
          }

        </div>
      </div>
      <div className="component flex items-center justify-center">
        <img src={require('../../../../assets/images/svg/component.svg')} alt="" />
        <span className='game-data-text'>本场数据</span>
      </div>
    </div>
  );
};



import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, type}: {match: TMatch, type: String}) => {
  return (
    <div className={type == 'home' ? ' events-item flex' : 'flex-row-reverse' + ' events-item flex'}>
      <div className="event flex flex-col">
        <img src={require('../../i/concor.png')} alt="" className = "flag-card"width={14} height={14}/>
        <span className="event-count">{type == 'home' ? match.score.homeCorner : match.score.awayCorner}</span>
      </div>
      <div className="event flex flex-col">
        <div className="red-card" />
        <span className="event-count">{type == 'home' ? match.score.homeRedCard : match.score.awayRedCard}</span>
      </div>
      <div className="event flex flex-col">
        <div className="yellow-card" />
        <span className="event-count">{type == 'home' ? match.score.homeYellowCard : match.score.awayYellowCard}</span>
      </div>
      <div className="event flex flex-col">
        <img src={require('../../i/ball.svg')} alt="" className = "flag-card"width={14} height={14}/>
        <span className="event-count">{type == 'home' ? match.score.homeCorner : match.score.awayCorner}</span>
      </div>
    </div>
  );
};


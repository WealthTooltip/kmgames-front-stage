import classNames from 'classnames';
import styles from './style.scss';
import {EStaticsType} from '@core/constants/enum/sport';
import useTheme from '@core/hooks/useTheme';
import {ETHEME} from '@views/kmg/desktop/configs';
import {useEffect, useState} from 'react';

interface IProps {
  eventTime: number;
  cnText: string;
  enText: string;
  eventId: EStaticsType;
  period?: number;
  score: string;
  team: '0' | '1' | '2';
}

export const matcheventList:IProps[] = [
  {
    eventTime: 50,
    cnText: '第1个角球',
    enText: 'First Corner kick',
    eventId: EStaticsType.cornerKicks,
    score: '1-0',
    team: '1',
  },
  {
    eventTime: 60,
    cnText: '全场第2张',
    enText: 'First Corner kick',
    eventId: EStaticsType.yellow,
    score: '0-1',
    team: '2',
  },
  {
    eventTime: 24,
    cnText: '阿德里安-维拉洛...',
    enText: 'First Corner kick',
    eventId: EStaticsType.cornerKicks,
    score: '0-1',
    team: '2',
  },
  {
    eventTime: 33,
    cnText: '阿德里安-维拉洛...',
    enText: 'First Corner kick',
    eventId: EStaticsType.yellowRed,
    score: '0-1',
    team: '2',
  },
  {
    eventTime: 19,
    cnText: '第1个角球',
    enText: 'First Corner kick',
    eventId: EStaticsType.penalties,
    score: '1-0',
    team: '1',
  },
];

const MatchEventItem = ({eventTime, cnText, enText, eventId, score, period, team}: IProps) => {
  const {theme} = useTheme();
  return (
    <div className='event-item'>
      <div className='event-time' style={{top: `${eventTime / 0.9}%`}}><span>{eventTime}</span></div>
      {team === '1' &&
        <div className='left-side'style={{top: `calc(${eventTime / 0.9}% - 18px)`}}>
          <div className='content'>
            <div className='text'>{cnText}</div>
            <div className='score'>{score}</div>
          </div>
          <div className='event-img'>
            <img src={require(`../../i/${eventId}${(theme === ETHEME.DARK)? '_dark' : ''}.webp`)} alt={eventId} />
          </div>
        </div>
      }
      {team === '2' &&
        <div className='right-side' style={{top: `calc(${eventTime / 0.9}% - 18px)`}}>
          <div className='event-img'>
            <img src={require(`../../i/${eventId}${(theme === ETHEME.DARK)? '_dark' : ''}.webp`)} alt={eventId} />
          </div>
          <div className='content'>
            <div className='text'>{cnText}</div>
            <div className='score'>{score}</div>
          </div>
        </div>
      }
    </div>
  );
};

function DpMatchEvent({eventList}: { eventList: IProps[] }) {
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    const interval = 100;
    let stepsCompleted = 0;

    const timer = setInterval(() => {
      setLoadTime((prevTime) => prevTime + 1);

      stepsCompleted += 1;
      if (stepsCompleted >= 90) {
        clearInterval(timer);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const displayList = eventList.filter((event) => event.eventTime < loadTime);
  return (
    <div className={classNames(styles.dpMatchEvent)}>
      <div className='body'>
        <div className='time-bar'>
          <div className='timer-img'>
            <img src={require(`../../i/timer.webp`)} alt="" />
          </div>
          <div className='axis'>
            <div className='start-point'></div>
            <div className={classNames('end-point', {'ended': loadTime >= 90})}></div>
            <div className='axis-fill' style={{height: `${loadTime / 0.9}%`}}></div>
            {loadTime < 90 &&
              <div className='load-time' style={{top: `${loadTime / 0.9}%`}}><span>{loadTime}</span></div>
            }
          </div>
          {loadTime >= 45 &&
            <div className='rest-bar' style={{top: `${50}%`}}>半场休息</div>
          }
        </div>
        <div className='event-board'>
          {displayList.map((item, idx) => (
            <MatchEventItem key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DpMatchEvent;

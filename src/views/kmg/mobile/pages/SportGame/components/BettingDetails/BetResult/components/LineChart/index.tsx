import classNames from 'classnames';
import styles from './style.scss';
import {useEffect, useState} from 'react';

interface IProps {
  title: string;
  hScore: number;
  aScore: number;
  hPercent: number;
  aPercent: number;
  enabled: boolean;
}

function DpLineChart({
  title,
  hScore: latestHScore,
  aScore: latestAScore,
  hPercent,
  aPercent,
  enabled,
}: IProps) {
  const [hScore, setHScore] = useState(0);
  const [aScore, setAScore] = useState(0);

  useEffect(() => {
    const animationDuration = 1000;
    const interval = 15;

    const totalSteps = animationDuration / interval;
    const hScoreStep = (latestHScore - hScore) / totalSteps;
    const aScoreStep = (latestAScore - aScore) / totalSteps;

    const timer = setInterval(() => {
      setHScore((prevHScore) => {
        const newHScore = prevHScore + hScoreStep;
        return newHScore >= latestHScore ? latestHScore : newHScore;
      });

      setAScore((prevAScore) => {
        const newAScore = prevAScore + aScoreStep;
        return newAScore >= latestAScore ? latestAScore : newAScore;
      });
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [latestHScore, latestAScore]);

  const hScorePercent = (hScore / (latestHScore/(hPercent/100))) * 100;
  const aScorePercent = (aScore / (latestAScore/(aPercent/100))) * 100;

  return (
    <div className={classNames(styles.dpLine, 'circle-body')}>
      <div className={classNames('line_item', {enabled})}>
        <div className='line_item_title'>{title}</div>
        <div className='line_item_bottom'>
          <div className='baseLine h-line'>
            {enabled ? <div className='line_inner' style={{width: hScorePercent + '%'}}></div> : <></> }
          </div>
          <div className='baseLine a-line'>
            {enabled ? <div className='line_inner' style={{width: aScorePercent + '%'}}></div> : <></> }
          </div>
        </div>
        <div className='line_item_score'>
          <div>{latestHScore}</div>
          <div>{latestAScore}</div>
        </div>
      </div>
    </div>
  );
}

export default DpLineChart;

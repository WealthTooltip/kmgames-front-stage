import Detail from './components/Detail';
import {strategyData} from './data';
import {useEffect, useRef, useState} from 'react';
import css from './style.scss';


interface IDetail {
  icon: string;
  score: number;
  status: string;
}

interface ITeamDetail {
  home: IDetail;
  away: IDetail;
}

export interface ITems {
  subtitle: string;
  teamDetail: ITeamDetail;
}

export interface IStrategyData {
  id: number;
  content: string;
  title: string;
  describe?: string;
  items?: ITems[];
}

export default ({setBallStatus, itemRefs}: {setBallStatus: (v: number) => void; itemRefs: any }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [spaceHeight, setSpaceHeight] = useState<number>(0);
  const handleScroll = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      const inViewItems = strategyData
          .filter((item) => {
            const itemRect = itemRefs[item.id]?.current?.getBoundingClientRect();
            return itemRect && itemRect.top + 10 >= containerRect.top;
          })
          .map((item) => {
            const itemRect = itemRefs[item.id]?.current?.getBoundingClientRect();
            const diff = itemRect.top - containerRect.top;
            return {id: item.id, distance: Math.abs(diff)};
          });

      if (inViewItems.length > 0) {
        inViewItems.sort((a, b) => a.distance - b.distance);
        const closestItem = inViewItems[0];
        const viewIndex = closestItem.id;
        setBallStatus(viewIndex);
      }
    }
  };

  useEffect(() => {
    containerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(()=> {
    const containerHeight = containerRef.current.offsetHeight;
    const itemHeight = itemRefs[7].current.offsetHeight;
    const heighDiff = containerHeight - itemHeight;
    heighDiff && heighDiff > 0 ? setSpaceHeight(heighDiff) : 0;
  });

  return (
    <div className={css.wrapper} ref={containerRef}>
      {strategyData.map((strategy, idx) => (
        <div key={idx}>
          <div className="strategy" ref={itemRefs[strategy.id]}>
            <div className="title">{strategy.title}</div>
            {strategy.items?.map((items, itemIdx) => (
              <Detail strategy={strategy} items={items} key={itemIdx} />
            ))}
          </div>
          {idx !== 7 && <div className='strategySpacer'></div>}
        </div>
      ))}
      <div className='spacer' style={{height: `${spaceHeight}px`}}></div>
    </div>
  );
};



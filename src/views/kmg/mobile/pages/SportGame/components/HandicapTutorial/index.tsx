import OptionBar from './components/optionbar';
import BallBar from './components/BallBar';
import Strategy from './components/Strategy';
import Guide from './components/Guide';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import Overlay from '@core/templates/mobile/components/Overlay';
import {strategyData} from './components/Strategy/data';
import {guideData} from './components/Guide/data';
import 'swiper/css';
import css from './style.scss';

export default (() => {
  const isClicked = useSelector((state: TStore) => state.sport.handicaptutorial.isClicked);
  const [optionStatus, setOptionStatus] = useState(0);
  const [ballStatus, setBallStatus] = useState(0);
  const strategyItemRefs = strategyData.map(() => React.useRef<HTMLDivElement | null>(null));
  const guideItemRefs = guideData.map(() => React.useRef<HTMLDivElement | null>(null));
  const strategyScrollToItem = (id: number) => {
    if (strategyItemRefs[id]?.current) {
      strategyItemRefs[id].current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };
  const guideScrollToItem = (id: number) => {
    if (guideItemRefs[id]?.current) {
      guideItemRefs[id].current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  useEffect(()=> {
    setOptionStatus(0);
  }, [isClicked]);

  return (
    <Overlay display={isClicked} zIndex={100} >
      <div className={css.wrapper}>
        <OptionBar onOption={setOptionStatus} />
        <BallBar ballStatus={ballStatus} strategyScrollToItem={strategyScrollToItem} guideScrollToItem={guideScrollToItem} optionStatus={optionStatus} />
        <div className='container'>
          {!optionStatus? <Strategy setBallStatus= {setBallStatus} itemRefs={strategyItemRefs} /> : <Guide setBallStatus= {setBallStatus} itemRefs={guideItemRefs} />}
        </div>
      </div>
    </Overlay>
  );
});


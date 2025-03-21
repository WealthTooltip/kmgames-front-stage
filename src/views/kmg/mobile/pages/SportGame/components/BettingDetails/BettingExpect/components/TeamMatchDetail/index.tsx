import Overlay from '@core/templates/mobile/components/Overlay';
import 'swiper/css';
import css from './style.scss';
import DetailHeader from '../DetailHeader';
import {TabProps} from '../..';
import {useState} from 'react';
import StatusButton from '../StatusButton';

interface IProps {
  back: (e : TabProps)=> void;
}

export default ((props: IProps) => {
  const [active, setActive] = useState(0);
  return (
    <Overlay display={true} zIndex={100} >
      <div className={css.wrapper}>
        <div className='container'>
          <DetailHeader tabs={['近期战绩', '积分榜', '交锋战绩']} back={props.back} active={active} setActive={(e : number)=>setActive(e)}/>
          {active === 2 ?
            <div className='detail-panel'>
              <div className='panel-header'>
                <div className='team home'>
                  <div className='team-img'></div>
                  <p className='team-name'>里泽体育</p>
                </div>
                <p className='vs'>VS</p>
                <div className='team away'>
                  <div className='team-img'></div>
                  <p className='team-name'>里泽体育</p>
                </div>
              </div>
              <div className='panel-content'>
                <div className='content-header'>
                  <div className='dateevent'>日期赛事</div>
                  <div className='home'>主</div>
                  <div className='score'></div>
                  <div className='away'>客</div>
                  <div className='handicap'>让球</div>
                  <div className='bigsmall'>大小</div>
                </div>
                <div className='content'>
                  <div className='dateevent'>
                    <div className='date'>24-01-06</div>
                    <div className='event'>土超</div>
                  </div>
                  <div className='home'>里泽体育</div>
                  <div className='score'>2 - 0</div>
                  <div className='away'>哈塔斯堡</div>
                  <div className='handicap'>
                    <StatusButton value={'-0.5'} status={'赢'}/>
                  </div>
                  <div className='bigsmall'>
                    <StatusButton value={'2.5'} status={'小'}/>
                  </div>
                </div>
                <div className='content'>
                  <div className='dateevent'>
                    <div className='date'>23-12-25</div>
                    <div className='event'>土超</div>
                  </div>
                  <div className='home'>卡斯帕萨</div>
                  <div className='score'>2 - 0</div>
                  <div className='away'>里泽体育</div>
                  <div className='handicap'>
                    <StatusButton value={'-1/1.5'} status={'输'}/>
                  </div>
                  <div className='bigsmall'>
                    <StatusButton value={'3'} status={'走水'}/>
                  </div>
                </div>
                <div className='content'>
                  <div className='dateevent'>
                    <div className='date'>23-12-25</div>
                    <div className='event'>土超</div>
                  </div>
                  <div className='home'>里泽体育</div>
                  <div className='score'>5 - 1</div>
                  <div className='away'>佩迪克斯堡</div>
                  <div className='handicap'>
                    <StatusButton value={'1'} status={'走水'}/>
                  </div>
                  <div className='bigsmall'>
                    <StatusButton value={'2.5/3'} status={'大'}/>
                  </div>
                </div>
                <div className='content'>
                  <div className='dateevent'>
                    <div className='date'>24-01-06</div>
                    <div className='event'>土超</div>
                  </div>
                  <div className='home'>里泽体育</div>
                  <div className='score'>2 - 0</div>
                  <div className='away'>哈塔斯堡</div>
                  <div className='handicap'>
                    <StatusButton value={'-0.5'} status={'赢'}/>
                  </div>
                  <div className='bigsmall'>
                    <StatusButton value={'2.5'} status={'小'}/>
                  </div>
                </div>
              </div>
            </div> : ''
          }
        </div>
      </div>
    </Overlay>
  );
});


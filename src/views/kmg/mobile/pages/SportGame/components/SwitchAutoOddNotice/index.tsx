/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 11:59:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/SingleCart/index.tsx
 * @Description:
 */
import Overlay from '@template/components/Overlay';
import style from './style.scss';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';

export default () => {
  const [visiable, setVisiable] = React.useState(false);
  useEventEmitter<TMitt['switchAutoOdd']>({mittName: 'switchAutoOdd', on: ({display}) =>display && switchAutoOdd(display)});
  const switchAutoOdd = (flag: boolean)=>{
    setVisiable(flag);
  };
  if (!visiable) return null;
  return (
    <Overlay display={visiable} zIndex={10} close={close}>
      <div className={style.maskLayer}></div>
      <div className={style.cancelOddNoticeWrapper}>
        <em className='e1'>选中你将“自动接受任何赔率”</em>
        <em className='e2'>即无论下注时的赔率如何变化，系统都将默认你可以接受，页面会出现赔率变化提示但不会打断你的下注行为</em>
        <p>
          <em className='e3' onClick={()=>(switchAutoOdd(false))}>我知道了</em>
        </p>
      </div>
    </Overlay>
  );
};

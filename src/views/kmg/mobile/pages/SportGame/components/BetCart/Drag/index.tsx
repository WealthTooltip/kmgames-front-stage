import {useDrag} from '@use-gesture/react';
import {animated, useSpring} from '@react-spring/web';
import style from './style.scss';
import {TOrder} from '@core/services/Table';
import usePublicState from '@core/hooks/usePublicState';
interface IBetItemInfoProps {
  submit: Function,
  order: TOrder;
  submitLoading: boolean
}
let flag = false;
export default ({order, submit, submitLoading}: IBetItemInfoProps) => {
  const myRef = React.useRef(null);
  const {dispatch, ACTIONS} = usePublicState();
  const [{x}, api] = useSpring(() => ({x: 0}));
  // const [isPause, setIsPause] = React.useState(false)
  const onPause = (cancel: Function)=>{
    if (Number(order.money) < order.minBetAmount) {
      cancel();
      flag = false;
      dispatch(ACTIONS.BASE.openToast({text: '请输入投注金额', types: 'error'}));
      return;
    } else {
      submit();
      api.pause();
    }
  };
  React.useEffect(()=>{
    flag = false;
    myRef.current && myRef.current();
  }, [submitLoading]);
  const bind = useDrag(({active, movement: [mx], cancel}) => {
    myRef.current = cancel;
    if (active) {
      if (mx < 0) cancel();
      if (mx > 230) {
        if (!flag) {
          flag = true;
          onPause(cancel);
        }
      }
    }
    api.start({
      x: active ? mx > 235 ? 235 : mx: 0,
      immediate: active,
    });
  },
  {
    axis: 'x',
  },
  );
  return (
    <div className={style.DragWrapper}>
      <div className='drag-bg'>
        <animated.div {...bind()} style={{x}}>
          <div className='drag-ball'>
            <div className='drag-ball-in'>
            </div>
          </div>
        </animated.div>
        <span>投注</span>&nbsp;
        <span>合计&nbsp;{Number(order.maxWin).toFixed(2)}</span>
      </div>
      {/* <div className='drag-bg'>投注</div> */}
    </div>
  );
};

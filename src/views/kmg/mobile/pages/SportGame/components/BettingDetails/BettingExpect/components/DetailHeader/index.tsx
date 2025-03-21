import {TabProps} from '../..';
import css from './style.scss';

interface IProps {
  tabs : Array<string>;
  back : (e: TabProps) => void;
  active : number;
  setActive : (e: number) => void;
}

export default ((props : IProps) => {
  return (
    <div className={css.wrapper}>
      <div className='back' onClick={()=>props.back('BLANK')}>关闭</div>
      <div className='tabs'>
        {props.tabs.map((value, index)=><div className={index === props.active ? 'active tab' : 'tab'} key={`team-match-tab-${index}`} onClick={()=>props.setActive(index)}>{value}</div>)}
      </div>
    </div>
  );
});

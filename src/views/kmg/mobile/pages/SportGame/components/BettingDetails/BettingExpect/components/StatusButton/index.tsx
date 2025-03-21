import css from './style.scss';
import classnames from 'classnames';

interface IProps {
  value : string,
  status : string,
}

export default ((props : IProps) => {
  const style = (props.status === '赢' || props.status === '大') ? 'red' :((props.status === '输' || props.status === '小') ? 'green' : 'yellow');
  return (
    <div className={css.wrapper}>
      <div className={classnames('value', style)}>{props.value}</div>
      <div className={classnames('button', style)}>{props.status}</div>
    </div>
  );
});

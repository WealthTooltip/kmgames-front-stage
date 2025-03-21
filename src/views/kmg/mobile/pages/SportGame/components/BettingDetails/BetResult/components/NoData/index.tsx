import classNames from 'classnames';
import styles from './style.scss';

interface IProps{
  title: string;
}

function DpNoData({title}: IProps) {
  return (
    <div className={classNames(styles.dpNodata)}>
      <div className='title'>{title}</div>
      <div className='content'>暂无{title}</div>
    </div>
  );
}

export default DpNoData;

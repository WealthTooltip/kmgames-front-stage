import classnames from 'classnames';
import styles from './style.scss';

interface IProps {
  text: string;
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  onClick?: () => void;
  className?: string;
}

function DpButton({
  text, type, onClick, className,
}: IProps) {
  return <div className={classnames(styles.dpButton, type, className)} onClick={onClick}>{ text }</div>;
}

export default React.memo(DpButton);

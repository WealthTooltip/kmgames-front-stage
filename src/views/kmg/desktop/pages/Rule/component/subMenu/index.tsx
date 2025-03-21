import classNames from 'classnames';
import styles from './style.scss';

export interface IBaseProps{
  title: string;
  imgUrl: string;
}

export interface ISubMenuProps {
  subTitle: string;
  imgUrl: string;
  child?: IBaseProps[];
}

interface IDpSubMenuProps{
  width: number;
  subMenu: ISubMenuProps[];
  subId: number;
  setSelectedSubItem: (index: number) => void;
}
const DpSubMenu = ({subMenu, subId, setSelectedSubItem, width}: IDpSubMenuProps) => {
  const len = subMenu.length;
  return (
    <div className={classNames(styles.subMenuWrapper)}>
      <ul className='sub-menu-body' style={{width: `${width}px`}}>
        {subMenu.map((item, idx) => (
          <li
            key={idx}
            className={classNames(styles.DpMenu, 'sub-menu-item', {'selected': idx === subId})}
          >
            {idx === 0 &&
                  <svg xmlns="http://www.w3.org/2000/svg" width="141" height="40" viewBox="0 0 141 40" fill="none">
                    <path className='s-path' fillRule="evenodd" clipRule="evenodd" d="M120.991 39.9941H8C3.58172 39.9941 0 36.4124 0 31.9941V8.00195C0 3.58368 3.58172 0.00195371 8 0.00195371H120.995L120.997 0L120.999 0.00195371H121V0.00292912L141.001 20L120.997 40L120.991 39.9941Z"/>
                  </svg>
            }
            {idx > 0 && idx < len - 1 &&
                  <svg width="166" height="40" viewBox="0 0 166 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className='s-path' d="M19.5 20L0 0H146.5L166 20L146.5 40H0L19.5 20Z" />
                  </svg>
            }
            {idx === len - 1 &&
                  <svg xmlns="http://www.w3.org/2000/svg" width="174" height="40" viewBox="0 0 174 40" fill="none">
                    <path className='s-path' fillRule="evenodd" clipRule="evenodd" d="M166 0C170.418 0 174 3.58172 174 8V32C174 36.4183 170.418 40 166 40H0.00292969H0V39.9971L0.00292969 40L20.0068 20L0.00292969 0L0 0.00292912V0H0.00292969H166Z"/>
                  </svg>
            }
            <span
              onClick={() => setSelectedSubItem(idx)}
              className='sub-title'
            >{idx + 1}、{item.subTitle}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DpSubMenu;

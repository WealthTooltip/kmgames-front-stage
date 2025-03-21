import usePublicState from '@core/hooks/usePublicState';
import {ETHEME} from '@this/configs';
import useHandicapTutorial from '@core/hooks/sports/useHandicapTutorial';
import css from './style.scss';

export default ({onOption}: { onOption: (v: number) => void}) => {
  const {user} = usePublicState();
  const {handleHandicapTutorial} = useHandicapTutorial();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const items: IItem[] = [
    {content: '让球攻略'},
    {content: '大小球攻略'},
  ];

  interface IItem {
    content: string
  }

  const renderItems = (
      items: IItem[],
      onClick: (idx: number) => void,
  ) => items.map(renderItem(onClick));

  const renderItem = (
      onClick: (idx: number) => void,
  ) => ({content}: IItem, idx: number) =>
    (
      <div key={idx} className='item'>
        <div
          className={`${selectedIndex === idx ? 'active' : ''}`}
          onClick={() => {
            onClick(idx);
          }}>
          {content}
        </div>
      </div>
    );

  const handleItem = (idx: number) => {
    setSelectedIndex(idx);
    onOption(idx);
  };
  return (
    <div className={css.wrapper}>
      <div className='container'>
        <span className='prev' onClick={handleHandicapTutorial}>
          <img src={require(`${ user.theme === ETHEME.LIGHT ? './i/prev-light.webp' : './i/prev-dark.webp'}`)} alt="prev-icon" />
        </span>
        <div className='content'>
          {renderItems(
              items,
              handleItem,
          )}
        </div>
      </div>
      <hr className={`${selectedIndex === 1 && 'selected'}`} />
    </div>
  );
};

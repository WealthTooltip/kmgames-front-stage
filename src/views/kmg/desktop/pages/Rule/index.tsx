import pageWrapper from '../../components/PageWrapper';
import DpMenu from './component/menu';
import styles from './style.scss';
import {Detail} from './component/detail';
import BetRule from './Bet';
import {menuList} from './component/menu/data';


export const Rule = React.memo(() => {
  const [currentItem, setCurrentItem] = React.useState<number>(0);

  const handleSelectItem = (selectedData: number ) => {
    setCurrentItem(selectedData);
  };

  return (
    <div className={styles.ruleWrapper}>
      <div>
        <DpMenu selectedItem={currentItem} selectItem={handleSelectItem} />
      </div>
      {
        currentItem === 1 ? <BetRule />:
        <Detail data={menuList[currentItem].tdata} currentItem={currentItem} />
      }
    </div>
  );
});

export default pageWrapper(Rule, {title: 'DP体育', withFooter: false, withHeader: true});

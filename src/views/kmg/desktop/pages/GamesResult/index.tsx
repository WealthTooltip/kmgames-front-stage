/**
 * @Author: Weima.KMG
 * @Date: 2024-01-09
 * @LastEditors: Weima.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/GamesResult/index.tsx
 * @Description:
 */
import pageWrapper from '../../components/PageWrapper';
import styles from './style.scss';
// 构成组件
import OptionBar from './components/OptionBar';
import ResultTable from './components/ResultTable';


export const GamesResult = React.memo(() => {
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <OptionBar />
        <ResultTable />
      </div>
    </div>
  );
});

export default pageWrapper(GamesResult, {title: 'DP体育', withHeader: true, withFooter: false});

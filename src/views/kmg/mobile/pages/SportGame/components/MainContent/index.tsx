/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 17:35:10
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MainContent/index.tsx
 * @Description:
 */
import LeagueList from '@this/pages/SportGame/components/LeagueList';
import css from './style.scss';

export default () => {
  return (
    <div className={css.wrapper}>
      <LeagueList />
    </div>
  );
};

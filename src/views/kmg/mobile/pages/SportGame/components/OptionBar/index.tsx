/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 14:09:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/OptionBar/index.tsx
 * @Description:
 */
import useSettings from '@core/hooks/sports/useSettings';
import useTheme from '@core/hooks/useTheme';
import SwitchButton from '@core/templates/mobile/components/SwitchButton';
import {ALL_SORTBY, EGameBettingType} from '@constants/enum/sport';
import {ETHEME} from '@this/configs';
import css from './style.scss';
import {useLocation} from 'react-router';

export default () => {
  const {switchSortByType, switchGameBettingByType, sortBy, gameBettingType} = useSettings();
  const {switchTheme, theme} = useTheme();
  const location = useLocation();

  return (
    location.pathname !== '/esports' &&
    <div className={css.wrapper}>
      <SwitchButton
        className='switch-btn'
        options={[
          {
            label: '新手版',
            value: EGameBettingType.BEGINNER,
          },
          {
            label: '专业版',
            value: EGameBettingType.ADVANCED,
          },
        ]}
        checked={gameBettingType}
        width={55}
        onChange={(value: any) => switchGameBettingByType(value)}
      />
      <SwitchButton
        className='switch-btn'
        options={ALL_SORTBY.map((i) => ({label: i.name, value: i.code}))}
        checked={sortBy}
        width={55}
        onChange={(value: any) => switchSortByType(value)}
      />
      <SwitchButton
        className='switch-btn'
        options={[
          {label: '日间', value: ETHEME.LIGHT},
          {label: '夜间', value: ETHEME.DARK},
        ]}
        checked={theme}
        width={55}
        onChange={(value: any) => switchTheme(value)}
      />
    </div>
  );
};

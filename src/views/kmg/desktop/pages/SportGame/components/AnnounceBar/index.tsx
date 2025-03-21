/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG jspassion@itcom888.com
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/index.tsx
 * @Description:
 */
import Marquee from 'react-fast-marquee';
import DpSwitchButton from '@views/kmg/desktop/components/SwitchButton';
import usePublicState from '@core/hooks/usePublicState';
import useTheme from '@core/hooks/useTheme';
import styles from './style.scss';
import LanguageDropdown from './components/LanguageDropdown';
// import SettingsDropdown from './components/SettingsDropdown';

export default React.memo(() => {
  const {user, ACTIONS, dispatch} = usePublicState();

  const {switchTheme} = useTheme();

  return (
    <div className={styles.wrapper}>
      <div className="btn">
        公告
      </div>
      <div className="marquee_wrap">
        <Marquee pauseOnHover speed={60} loop={0}>
          <span className={styles.marquee_text}>体育: 羽毛球 联赛: Guwahati Masters Women Doubles 赛事：普莱勒 / 乔利 对 吴佩琪 / 罗取原因: 赛事未进行</span>
        </Marquee>
      </div>
      <div className="r-actions">
        <DpSwitchButton
          value={user.currentOddType}
          type="button"
          items={[{label: '欧盘', value: 1}, {label: '亚盘', value: 2}]}
          onChange={(val) => dispatch(ACTIONS.USER.setOddType({data: val}))}
        />
        <DpSwitchButton
          value={user.theme}
          type="button"
          onChange={(value: any) => switchTheme(value)}
          items={[{label: '日间', value: 'light'}, {label: '夜间', value: 'dark'}]}
        />
        <LanguageDropdown />
        {/* <SettingsDropdown /> */}
      </div>
    </div>
  );
});

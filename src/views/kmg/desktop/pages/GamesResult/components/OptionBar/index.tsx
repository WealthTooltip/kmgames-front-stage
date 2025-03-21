/**
 * @Author: Weima.KMG
 * @Date: 2024-01-09
 * @LastEditors: Weima.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/GamesResult/components/OptionBar/index.tsx
 * @Description:
 */
import {ReactNode} from 'react';
import {DpDateRangePicker, DpSearchInput, DpInput, DpSelect} from '@this/components';
import styles from './style.scss';
import {Button, Checkbox, CheckboxProps} from 'antd';
import useSettings from '@core/hooks/sports/useSettings';
import dayjs, {Dayjs} from 'dayjs';
import {dateFormat} from '@views/kmg/desktop/components/DateRangePicker';
import useGamesResultInit from '@core/hooks/sports/useGamesResultInit';

export const ActionTag = ({title, children}: {title: string, children: ReactNode}) => {
  return (
    <div className="action-tag">
      <span>{title}</span>
      {children}
    </div>
  );
};

export default React.memo(() => {
  const {switchGameResultPageInfo} = useSettings();
  const {pageInfo, setPageInfo, gameResultOpts}= useGamesResultInit();

  const handleSearch = () => switchGameResultPageInfo({...pageInfo, pageNum: 1});
  const handleRolling: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      switchGameResultPageInfo({...pageInfo, ip: 1, pageNum: 1});
    } else {
      switchGameResultPageInfo({...pageInfo, ip: 0, pageNum: 1});
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="action-bar">
        {/* 体育类型选择 */}
        <ActionTag title='体育'>
          <DpSelect
            className='game-select'
            value={pageInfo.sportId || gameResultOpts[0].value}
            options={gameResultOpts}
            onChange={(value: number) => setPageInfo({...pageInfo, sportId: value})}
          />
        </ActionTag>

        {/* 日期选择 */}
        <ActionTag title='日期'>
          <DpDateRangePicker
            value={[dayjs(pageInfo.beginTime), dayjs(pageInfo.endTime)]}
            handleChange={(dates: Array<Dayjs>) => {
              const [beginTime, endTime] = dates;
              setPageInfo({
                ...pageInfo,
                beginTime: beginTime.format(dateFormat),
                endTime: endTime.format(dateFormat),
              });
            }}
          />
        </ActionTag>

        {/* 联赛搜索 */}
        <ActionTag title='联赛'>
          <DpSearchInput
            placeholder='请输入关键字搜索'
            value={pageInfo.leagueName || ''}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setPageInfo({...pageInfo, leagueName: e.target.value})}
            handleSearchChange={() => console.log('changed')}
          />
        </ActionTag>

        {/* 赛事 */}
        <ActionTag title='赛事'>
          <DpInput
            className='game-event'
            placeholder='请输入'
            value={pageInfo.matchName || ''}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setPageInfo({...pageInfo, matchName: e.target.value})}
          />
        </ActionTag>

        {/* 滚球 */}
        <Checkbox checked={!!pageInfo.ip} onChange={handleRolling}>滚球</Checkbox>

        {/* 精彩回放 */}
        {/* <Checkbox onChange={() => console.log('精彩回放')}>精彩回放</Checkbox> */}
      </div>
      <div className="helper-bar">
        {/* <button type='button' className='helper-btn' onClick={handleHelp}><IconHelper /></button> */}
        <Button className='search-btn' onClick={handleSearch}>搜索</Button>
      </div>
    </div>
  );
});

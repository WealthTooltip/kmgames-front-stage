import {useState} from 'react';
import style from './style.scss';
import SearchInput from '../SettingMenu/SettingCart/SearchInput';
import ChampionIcon from '@views/kmg/mobile/pages/SportGame/components/SearchMenu/i/champion-icon.png';
import PremierIcon from '@views/kmg/mobile/pages/SportGame/components/SearchMenu/i/premier-icon.png';
import SerieIcon from '@views/kmg/mobile/pages/SportGame/components/SearchMenu/i/serie-icon.png';
import LagigaIcon from '@views/kmg/mobile/pages/SportGame/components/SearchMenu/i/laliga-icon.png';
import {SearchOutlined} from '@ant-design/icons';
import {Dropdown} from 'antd';

export enum PopularSearchMenuEnum {
    ALL = 'all',
    CHAMPION = 'champion',
    PREMIERR = 'premier',
    SERIE = 'serie',
    LALIGA = 'laliga',
}

export interface PopularSearchType {
    label: string;
    value: string;
    icon?: any;
}
export const PopularSearchList = [
  {
    label: '全部',
    value: PopularSearchMenuEnum.ALL,
  },
  {
    label: '欧冠',
    value: PopularSearchMenuEnum.CHAMPION,
    icon: ChampionIcon,
  },
  {
    label: '英超',
    value: PopularSearchMenuEnum.PREMIERR,
    icon: PremierIcon,
  },
  {
    label: '意甲',
    value: PopularSearchMenuEnum.SERIE,
    icon: SerieIcon,
  },
  {
    label: '西甲',
    value: PopularSearchMenuEnum.LALIGA,
    icon: LagigaIcon,
  },
];
export default () => {
  const [search, setSearch] = useState<PopularSearchMenuEnum.ALL | PopularSearchMenuEnum[]>(PopularSearchMenuEnum.ALL);
  const [leagueSearch, setLeaguSearch] = useState(false);
  const handleClick = (val: PopularSearchMenuEnum) => {
    if (val !== PopularSearchMenuEnum.ALL) {
      if (search === PopularSearchMenuEnum.ALL) {
        setSearch([val]);
        return;
      }
      if (search.includes(val)) {
        setSearch(search.filter((item)=>item!==val));
        return;
      }
      setSearch([...search, val]);
      return;
    }
    setSearch(val);
  };

  return (
    <div className={style.wrapper}>
      <div className='search-group'>
        {PopularSearchList.map((item, index) => (
          <div key={index} className='search-list'>
            <div onClick={() => handleClick(item.value)} className={`${search.includes(item.value) && 'active'}`}>
              {item.icon && <img alt='' src={item.icon} />}
              <span className='search-name'>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className='search-btn'>
        <Dropdown menu={{items: [{
          key: 1,
          label: (<SearchInput />),
        }]}} overlayStyle={{width: 300}} placement="bottomLeft" open={leagueSearch} arrow={{pointAtCenter: true}}>
          <div className='league-search' onClick = {() => setLeaguSearch(true)}><SearchOutlined /></div>
        </Dropdown>

      </div>
    </div>
  );
};

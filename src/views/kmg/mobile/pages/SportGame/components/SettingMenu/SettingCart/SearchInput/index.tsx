import TStore from '@core/reducers/_reduxStore';
import {Dropdown, Input} from 'antd';
import {useSelector} from 'react-redux';
import style from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
const {Search} = Input;

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const leagueStatistics = useSelector((state: TStore) => state.sport.display.leagueStatistics);
  const [leagueSearch, setLeagueSearch] = useState(false);
  const currentLeagueId = useSelector((state: TStore) => state.sport.display.currentLeagueId);
  const [searchText, setSearchText] = useState<string>();
  const [searchLeagueList, setSearchLeagueList] = useState<{key: number, label: ReactNode}[]>();

  useEffect(() => {
    if (currentLeagueId && currentLeagueId.length > 0) {
      const currentLeague = leagueStatistics.find((league) => league.leagueId === currentLeagueId[0].id);
      if (currentLeague) {
        setSearchText(currentLeague.leagueName);
      }
    }
  }, [currentLeagueId]);

  const handleSelectLeague = (value: number) => {
    if (!value) {
      return;
    }
    const currentLeague = leagueStatistics.find((league) => league.leagueId === value);
    if (currentLeague) {
      dispatch(ACTIONS.SPORT.toggleSelectLeague({id: value, matchType: currentLeague.state}));
      setSearchText(currentLeague.leagueName);
    }
    setLeagueSearch(false);
  };

  const onSearch = (value: string) => {
    dispatch(ACTIONS.SPORT.removeAllSelectLeague());

    if (!value) {
      setLeagueSearch(false);
      return;
    }

    setSearchText(value);
    const newSearchList = _.uniqBy(leagueStatistics, 'leagueId').filter((league) => league.leagueName.includes(value));

    if (newSearchList.length === 0) {
      return;
    }

    setSearchLeagueList(newSearchList.map((league) => (
      {
        key: league.leagueId,
        label: (
          <div className='search-list' onClick={() => handleSelectLeague(league.leagueId)}>{league.leagueName}</div>
        ),
      }
    )));
    setLeagueSearch(true);
  };


  return (
    <div className={style.wrapper}>
      <Dropdown menu={{items: searchLeagueList}} overlayClassName={style.dropdownwrapper} overlayStyle={{width: 200, marginBottom: 5}} placement="bottom" open={leagueSearch} arrow={{pointAtCenter: true}}>
        <Search placeholder="请输入联赛名" allowClear value={searchText} onSearch={onSearch} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)} style={{width: 200}} />
      </Dropdown>
    </div>
  );
};

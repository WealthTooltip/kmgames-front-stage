import {useEffect, useRef} from 'react';
import {useGameResultListData} from './sports/useRenderData';

const useScrollToTop = () => {
  const {gamesResult} = useGameResultListData();
  const tableRef= useRef(null);

  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollTop = 0;
  }, [gamesResult]);

  return tableRef;
};

const strSpliter = (str: string, spliter: string = '-'): any[] => {
  return _.split(str, spliter);
};

export {
  strSpliter,
  useScrollToTop,
};

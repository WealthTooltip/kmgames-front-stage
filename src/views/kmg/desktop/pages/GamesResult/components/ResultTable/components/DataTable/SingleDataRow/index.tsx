import {IconGameBriefView, IconGameDetailView} from '@views/kmg/desktop/components/Icon';
import DpCollapse from '@views/kmg/desktop/components/Collapse';
import DetailData from '../../DetailData';
import {TGameResultStatistic} from '@core/reducers/_reduxStore';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';
import {IconProps} from '@core/constants/enum/sport/sportsCategory';

interface propTypes {
  dataId?: number,
  data: TGameResultStatistic,
  viewDetail: React.Key | null,
  toggleIcon: (key: React.Key) => void,
  tags: Record<EGameResult, IconProps>,
};

export default React.memo(({data, viewDetail, toggleIcon, tags}: propTypes) => {
  const filteredResultArr: number[][] = [];

  const filterFunc = (tags: Record<EGameResult, IconProps>, data: TGameResultStatistic, arr: number[][]) => {
    Object.entries(tags).map((tag) => {
      Object.entries(data.details).map(([key, val]) => {
        key === tag[0] && arr.push(val);
      });
    });
    return arr;
  };
  filterFunc(tags, data, filteredResultArr);

  const Header = ({resData}: {resData: number[][]}) => {
    return (
      <div className={`body-row ${viewDetail === data.mid ? 'opened' : ''}`} onClick={() => toggleIcon(data.mid)}>
        <span className="wide-element contain-view-icon">
          <span>
            {viewDetail === data.mid ? <IconGameDetailView /> : <IconGameBriefView />}
          </span>
          <span>{data.bt}</span>
        </span>
        <span className="wide-element">{data.ln}</span>
        <span className="wide-element render-array">
          {data.mn.map((team, idx) => (
            <p key={idx}>{team}</p>
          ))}
        </span>
        {resData.length ? resData.map((res, idx) => (
          <span key={data.mid + '_' + idx} className='render-array'>
            {res.map((score: number, idx: number) => (<p key={idx}>{score}</p>))}
          </span>
        )) : <span>loading...</span>}
      </div>
    );
  };

  return (
    <DpCollapse
      className={viewDetail === data.mid ? 'collapse-opened' : ''}
      key={data.mid}
      allOpen={viewDetail === data.mid}
      header={<Header resData={filteredResultArr} />}
    >
      {viewDetail === data.mid && <DetailData mTeam={data.mn} />}
    </DpCollapse>
  );
});

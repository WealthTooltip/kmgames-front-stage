import {useMatchListData} from '@core/hooks/sports/useRenderData';
import styles from './style.scss';
import {Carousel} from 'antd';
import {getMatchStatusByPeriod, getNameByhoa, transferBoDan} from '@core/utils';
import Timer from '@views/kmg/desktop/components/Timer';
import classnames from 'classnames';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import {LockOutlined} from '@ant-design/icons';
import {TOrder} from '@core/services/Table';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import React, {useCallback, useMemo} from 'react';
import DpIcon from '@views/kmg/desktop/components/Icon';
import DpImage from '@views/kmg/desktop/components/Image';
import type {CarouselRef} from 'antd/es/carousel';
import FootBall from './Football';
import Basketball from './Basketball';
import Tennis from './Tennis';

export default React.memo(() => {
  const {matchList} = useMatchListData();
  const {matchDetail, detailUpdateTime} = useMatchDetail();
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  const carRef = React.createRef<CarouselRef>();

  const getBoDanList = useCallback(transferBoDan, []);

  const sliderClick = (direction:'pre' | 'next')=> {
     direction === 'pre' ? carRef.current?.prev() :carRef.current?.next();
  };

  const contentElement = useMemo(() => {
    switch (matchDetail?.sportId) {
      case 1:
        return <FootBall />;
      case 2:
        return <Basketball />;
      case 3:
        return <Tennis />;
      default:
        return null;
    }
  }, [matchDetail?.sportId]);

  return (
    <div className={classnames(styles.wrapper, {'is-esports': matchDetail?.sportId > 33})}>
      <div className='statistician-wrapper'>
        {
          matchDetail?.sportId <= 33 &&
          <React.Fragment>
            <div className='statistician_title border-bottom'>统计</div>
            {
              contentElement
            }
          </React.Fragment>
        }
      </div>
      <div className='statistician-wrapper'>
        <div className='statistician_title border-bottom'>热门推荐</div>
        <div className='hot_container'>
          <Carousel dots={{className: 'dots_arrow'}} ref={carRef}>
            {matchList.slice(0, 10).filter((match) => match.playTypes.length > 0).map((item) => {
              return (
                <div className='hot_content_main' key={item.matchId}>
                  <div className='team_info'>
                    <div className='match_info'>
                      <div className='img_wrapper'>
                        <DpImage size={34} width={34} type="team" src={item.teams.home.icon} />
                      </div>
                      <span>{item.teams.home.name}</span>
                    </div>
                    <div className='middle'>
                      <div className='league_name'>{item.leagueName}</div>
                      {!item.matchClock.period ? (
                        <span>未开赛</span>
                      ) : (
                        <div className='start_time'>
                          {getMatchStatusByPeriod(item.matchClock.period)}
                          {
                            matchDetail?.playTypes.length > 0 && !['FT', 'HT'].includes(matchDetail.matchClock.period) && matchDetail.matchClock.second > 0 && matchDetail.sportId === 1 && (
                              <Timer
                                seconds={item.matchClock.second}
                                key={`${item?.matchId}_${item.matchClock.second}_${detailUpdateTime}`}
                              />
                            )}
                        </div>
                      )}
                      <div className='vs'>VS</div>
                    </div>
                    <div className='match_info'>
                      <div className='img_wrapper'>
                        <DpImage size={34} width={34} type="team" src={item.teams.away.icon} />
                      </div>
                      <span>{item.teams.away.name}</span>
                    </div>
                  </div>
                  <div className='play_list'>
                    {((kc) => {
                      switch (kc) {
                        case 'FT_OU':
                        case 'HT_OU':
                          return (
                            <div className='play-content'>
                              <div className='play-ou'>
                                <div className='item-head'>
                                  <div />
                                  <div>大</div>
                                  <div>小</div>
                                </div>
                                {item.playTypes[0].mks.map(
                                    (market) =>
                                      market.ops.length && (
                                        <div className='market-item' key={market.mkId}>
                                          <div className='label'>{market.ops[0].name}</div>
                                          {market.ops.map((bil) => (
                                            <div
                                              className={classnames(
                                                  'odd-item',
                                                  {active: _.includes(orderTags, bil.tag)},
                                                  bil.change,
                                                  {disabled: !bil.available},
                                              )}
                                              key={bil.id}
                                              onClick={() => addAndRemoveOrder(bil)}>
                                              {bil.locked ? (
                                                <LockOutlined />
                                              ) : bil.available ? (
                                                <span className='odd'>{getViewOdd(bil.od, bil.oddBetType)}</span>
                                              ) : (
                                                <span>-</span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      ),
                                )}
                              </div>
                            </div>
                          );
                        case 'HT_CS':
                        case 'FT_CS':
                          return (
                            <div className='play-content'>
                              <div className='play-bd play-default'>
                                <div className='item-head'>
                                  <div>{item.teams.home.name}</div>
                                  <div>平局</div>
                                  <div>{item.teams.away.name}</div>
                                </div>
                                <div className='bd-list'>
                                  {getBoDanList(item.playTypes[0].mks[0].ops).map((bil: any, bidx: number) =>
                                    bil ? (
                                      <OddItem bil={bil} kc={item.playTypes[0].code} key={bil?.id || bidx} />
                                    ) : (
                                      <div className='odd-item empty' key={bidx} />
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        default:
                          return (
                            <div className='paly-content'>
                              <div className='play-default'>
                                {item.playTypes[0].mks.slice(0, 1).map((market) => (
                                  <div className='market-item' key={market.mkId}>
                                    {market.ops.map((bil, idx) => (
                                      <OddItem bil={bil} kc={item.playTypes[0].code} key={bil?.id || idx} showTeam />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                      }
                    })(item.playTypes[0]?.code)}
                  </div>
                </div>
              );
            })}
          </Carousel>
          <div className='arrow_dotted'>
            <DpIcon type='preArrow' onClick={() => sliderClick('pre')} />
            <DpIcon type='nextArrow' onClick={() => sliderClick('next')} />
          </div>
        </div>
      </div>
    </div>
  );
});

export function OddItem({bil, kc, showTeam}: {bil: TOrder; kc: string; showTeam?: boolean}) {
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  return (
    <div
      className={classnames('odd-item', {active: _.includes(orderTags, bil.tag), disabled: !bil.available}, bil.change)}
      key={bil.id}
      onClick={() => addAndRemoveOrder(bil)}>
      {bil.locked ? (
        <LockOutlined />
      ) : bil.available ? (
        <>
          {showTeam === true && bil.betTeam && bil.name !== bil.betTeam && <span>{getNameByhoa(bil.betTeam)}</span>}
          {bil.name && <span>{getNameByhoa(bil.name)}</span>}
          <span className={classnames('odd', {locked: bil.available})}>{getViewOdd(bil.od, bil.oddBetType)}</span>
        </>
      ) : (
        <span>-</span>
      )}
    </div>
  );
}

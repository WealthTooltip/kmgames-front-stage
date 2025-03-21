import React from 'react';
import styles from './style.scss';

const players =[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default React.memo(() => {
  return (
    <div className={styles.wrapper}>
      <div className='match-video'>
      </div>
      <div className='panel-wrapper'>
        <div className='panel-header'>
          <span>首发名单</span>
        </div>
        <div className='panel-content'>
          <div className='panel-teams'>
            <div className='panel-team home'>
              <div className='team-img'></div>
              <span>阿斯顿维拉</span>
            </div>
            <div className='panel-team away'>
              <div className='team-img'></div>
              <span>切尔西</span>
            </div>
          </div>
          <div className='panel-players'>
            <div className='panel-team home'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
            <div className='panel-team away'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='panel-wrapper'>
        <div className='panel-header'>
          <span>替补名单</span>
        </div>
        <div className='panel-content'>
          <div className='panel-teams'>
            <div className='panel-team home'>
              <div className='team-img'></div>
              <span>阿斯顿维拉</span>
            </div>
            <div className='panel-team away'>
              <div className='team-img'></div>
              <span>切尔西</span>
            </div>
          </div>
          <div className='panel-players'>
            <div className='panel-team home'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
            <div className='panel-team away'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='panel-wrapper'>
        <div className='panel-header'>
          <span>伤停名单</span>
        </div>
        <div className='panel-content'>
          <div className='panel-teams'>
            <div className='panel-team home'>
              <div className='team-img'></div>
              <span>阿斯顿维拉</span>
            </div>
            <div className='panel-team away'>
              <div className='team-img'></div>
              <span>切尔西</span>
            </div>
          </div>
          <div className='panel-players'>
            <div className='panel-team home'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
            <div className='panel-team away'>
              {players.map((element, index)=>{
                return (<div className='panel-player' key={'home-player-'+index}>
                  <div className='player-img'></div>
                  <div className='player-detail'>
                    <p className='name'>埃姆雷比尔金</p>
                    <p className='role'>门将</p>
                  </div>
                  <div className='player-number'>
                    <span>23</span>
                  </div>
                </div>);
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

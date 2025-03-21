/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchDetail/Medias/Live/index.tsx
 * @Description:
 */
import DpSelect from '@this/components/Select';
import style from './style.scss';
import classnames from 'classnames';
import {useEffect} from 'react';
import flvjs from 'flv.js';

type TVideo = {
  sourceName: string;
  srouceUrl: string;
  screenshot: string;
  m3u8: string;
}

interface IProps{
  videos: Array<TVideo>
}
export default React.memo(({videos}: IProps) => {
  const [currentVideo, setCurrentVideo] = React.useState<TVideo | null>(null);
  const [menuShow, setMenuShow] = React.useState(false);

  React.useEffect(() => {
    if (!videos || videos?.length === 0) {
      return;
    }
    setCurrentVideo(videos[0]);
  }, [videos]);
  const [isFlv, setIsFlv] = React.useState(true);
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsFlv(flvjs.isSupported() && !isSafari);
  }, []);

  return (
    <div className={classnames(style.wrapper, 'my-live')} style={{backgroundImage: `url(${currentVideo && currentVideo.screenshot})`}} onMouseEnter={() => setMenuShow(true)} onMouseLeave={() => setMenuShow(false)}>
      {/* { !currentVideo && <div className="empty">当前比赛没有视频源</div> } */}
      { currentVideo && <iframe src={`https://video.dmjsopw.com/?liveUrl=${isFlv ? currentVideo.srouceUrl : currentVideo.m3u8}`} allowFullScreen={true} allow="autoplay" frameBorder={0} marginHeight={0} scrolling='no' /> }
      {
        currentVideo && menuShow == true ?
        (
          <DpSelect
            className="selector"
            label="线路"
            value={currentVideo.srouceUrl}
            onChange={(value: string) => setCurrentVideo(_.find(videos, {[isFlv ? 'srouceUrl' : 'm3u8']: value}))}
            options={videos.map((i) => ({label: i.sourceName, value: isFlv ? i.srouceUrl : i.m3u8}))}
          />
        ) : <></>
      }
    </div>
  );
});

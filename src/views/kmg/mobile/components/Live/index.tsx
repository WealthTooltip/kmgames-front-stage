import style from './style.scss';
import classnames from 'classnames';
import React, {useEffect} from 'react';
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
  React.useEffect(() => {
    if (!videos || videos?.length === 0) {
      return;
    }
    setCurrentVideo(videos[0]);
  }, [videos]);
  const [isFlv, setIsFlv] = React.useState(true);
  useEffect(() => {
    setIsFlv(flvjs.isSupported());
  }, []);
  return (
    <div className={classnames(style.wrapper)}>
      {/* { !currentVideo && <div className="empty">当前比赛没有视频源</div> } */}
      { currentVideo && <iframe src={`https://video.dmjsopw.com/?liveUrl=${isFlv ? currentVideo.srouceUrl : currentVideo.m3u8}`} allowFullScreen={true} allow="autoplay" frameBorder={0} marginHeight={0} scrolling='no' /> }
    </div>
  );
});

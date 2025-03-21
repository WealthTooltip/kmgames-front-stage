/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchDetail/Live/index.tsx
 * @Description:
 */
import DpSelect from '@this/components/Select';
import style from './style.scss';

type TVideo = {
  sourceName: string;
  srouceUrl: string;
  screenshot: string;
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

  return (
    <div className={style.wrapper} style={{backgroundImage: `url(${currentVideo && currentVideo.screenshot})`}}>
      { !currentVideo && <div className="empty">当前比赛没有视频源</div> }
      { currentVideo && <iframe src={`https://video.dmjsopw.com/?liveUrl=${currentVideo.srouceUrl}`} allowFullScreen={true} allow="autoplay" frameBorder={0} marginHeight={0} scrolling='no' /> }
      {
        currentVideo &&
        (
          <DpSelect
            className="selector"
            label="线路"
            value={currentVideo.srouceUrl}
            onChange={(value: string) => setCurrentVideo(_.find(videos, {srouceUrl: value}))}
            options={videos.map((i) => ({label: i.sourceName, value: i.srouceUrl}))}
          />
        )
      }
    </div>
  );
});

import React, {useEffect} from 'react';
import DPlayer from 'dplayer';
import flvjs from 'flv.js';
import Hls from 'hls.js';

interface DPlayerProps {
  liveUrl: string;
}

const DPlayerComponent: React.FC<DPlayerProps> = ({liveUrl}) => {
  useEffect(() => {
    let dp: DPlayer | null = null;

    if (liveUrl.includes('.flv') && flvjs.isSupported()) {
      dp = new DPlayer({
        container: document.getElementById('root'),
        live: true,
        autoplay: true,
        video: {
          url: liveUrl,
          type: 'flv',
        },
        volume: 1,
      });
    } else if (liveUrl.includes('.m3u8') && Hls.isSupported()) {
      dp = new DPlayer({
        container: document.getElementById('root'),
        live: true,
        autoplay: true,
        video: {
          url: liveUrl,
          type: 'hls',
        },
        volume: 1,
      });
    } else {
      console.error('Unsupported video format or missing liveUrl parameter.');
    }

    return () => {
      dp?.destroy();
    };
  }, [liveUrl]);

  return (
    <></>
  );
};

export default DPlayerComponent;

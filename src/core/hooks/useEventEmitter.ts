/*
 * @Author: Passion.KMG
 * @Date: 2023-12-30 21:12:45
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/hooks/useEventEmitter.ts
 * @Description:
 */
import mitt from 'mitt';
import {useUnmount, usePrevious} from 'react-use';
import {TMittEvent} from '@constants/enum/mitt';

export default <T, K = undefined>({mittName, on}: {
  mittName: TMittEvent;
  on?: (data: T, others: K) => void;
}) => {
  const emitter = Mitt.getInstance().getEmitter();
  const prevOn = usePrevious(on);

  React.useEffect(() => {
    // 如果有订阅
    if (on) {
      emitter.on(mittName, on);
    }
  }, [on]);

  React.useEffect(() => {
    if (prevOn) {
      emitter.off(mittName, prevOn);
    }
  }, [prevOn]);

  useUnmount(() => {
    // 如果有取消订阅
    if (on) {
      emitter.off(mittName, on);
    }
  });

  return {
    emit: (data: T, others?: K) => {
      emitter.emit(mittName, data, others);
    },
  };
};


// 单例模式获取事件总线
class Mitt {
  private static instance: Mitt;
  private emitter: any;

  constructor() {
    this.emitter = mitt();
  }

  public static getInstance() {
    if (!Mitt.instance) {
      Mitt.instance = new Mitt();
    }
    return Mitt.instance;
  }

  public getEmitter() {
    return this.emitter;
  }
}

/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/components/PageWrapper/index.tsx
 * @Description: 包裹页面的通用 HOC
 */

import ErrorScreen from '@this/components/Error';
import css from './style.scss';

/**
 * @description: 包裹页面的通用 HOC
 * @param {React.FC} Page 页面组件
 * @param {boolean} options 是否包含头部等
 *
 */
interface IOptions{
  title? : string;
}
export default (Page: React.FC, {title}: IOptions) => function() {
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    document.title = title ? `${title}` : 'KMG体育';
    const recalc = () => {
      if (!document.documentElement.clientWidth) {
        return;
      }
    };
    window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', recalc, false);
    recalc();
    return () => {
      window.removeEventListener('orientationchange' in window ? 'orientationchange' : 'resize', recalc, false);
    };
  }, []);

  return (
    <div className={css.wrapper} ref={rootRef}>
      <ErrorHandler>
        <div id="page-wrapper">
          <Page />
        </div>
      </ErrorHandler>
    </div>
  );
};

// 异常捕获器
class ErrorHandler extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error: any) {
    this.setState({hasError: error});
  }

  render() {
    if ((this.state as any).hasError) {
      return <ErrorScreen log={(this.state as any).hasError} />;
    }
    // eslint-disable-next-line react/prop-types
    return (this.props as any).children;
  }
}

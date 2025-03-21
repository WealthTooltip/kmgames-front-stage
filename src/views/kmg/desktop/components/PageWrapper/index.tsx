/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/components/PageWrapper/index.tsx
 * @Description: 包裹页面的通用 HOC
 */

import ErrorScreen from '@this/components/Error';
// import Header from '@this/components/Header';
import Footer from '@this/components/Footer';
import css from './style.scss';

/**
 * @description: 包裹页面的通用 HOC
 * @param {React.FC} Page 页面组件
 * @param {boolean} options 是否包含头部等
 *
 */
interface IOptions{
  withHeader ?: boolean;
  withFooter ?: boolean;
  title? : string;
}
export default (Page: React.FC, {withHeader = true, withFooter = true, title}: IOptions) => function() {
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    document.title = title ? `${title}` : 'KMG体育';
    const recalc = () => {
      if (!document.documentElement.clientWidth) {
        return;
      }
      rootRef.current.style.height = `${document.documentElement.clientHeight - 50}px`;
    };
    window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', recalc, false);
    recalc();
    return () => {
      window.removeEventListener('orientationchange' in window ? 'orientationchange' : 'resize', recalc, false);
    };
  }, []);

  const minHeight = `calc(100% - ${(withFooter ? 50 : 0)}px)`;

  return (
    <div className={css.wrapper} ref={rootRef}>
      <ErrorHandler>
        {/* { withHeader && <Header /> } */}
        <div style={{height: minHeight}} id="page-wrapper">
          <Page />
        </div>
        { withFooter && <Footer />}
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

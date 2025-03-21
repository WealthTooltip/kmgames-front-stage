/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 18:16:22
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/templates/mobile/components/Empty/index.tsx
 * @Description:
 */
import {Empty} from 'antd';
import classnames from 'classnames';
import style from './style.scss';
import {useMemo} from 'react';
import useTheme from '@core/hooks/useTheme';
import {ETHEME} from '@this/configs';

interface IProps {
  type?: 'empty' | 'locked' | 'record'; // 不同位置显示标识
  description?: string;
  className?: string;
}

// todo 后期根据设计的样式来修改逻辑
function DpEmpty({description = '暂无数据', className, type = 'empty'}: IProps) {
  const {theme} = useTheme();
  const img = useMemo(() => {
    switch (type) {
      case 'locked':
        return theme === ETHEME.LIGHT ? <img src={require('./i/locked_light.png')} /> : <img src={require('./i/locked_dark.png')} />;
      case 'record':
        return theme === ETHEME.LIGHT ? <img src={require('./i/record_light.png')} /> : <img src={require('./i/record_dark.png')} />;
      default:
        return theme === ETHEME.LIGHT ? <img src={require('./i/empty_light.png')} /> : <img src={require('./i/empty_dark.png')} />;
    }
  }, [type, theme]);
  return <Empty className={classnames(style.wrapper, className)} description={description} image={img}/>;
}

export default React.memo(DpEmpty);

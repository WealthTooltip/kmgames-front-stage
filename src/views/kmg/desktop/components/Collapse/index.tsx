/*
 * @Author: Passion.KMG jspassion@itcom888.com
 * @Date: 2023-12-18 17:14:54
 * @LastEditors: Passion.KMG jspassion@itcom888.com
 * @LastEditTime: 2023-12-18 19:03:50
 * @FilePath: \KMG-pc\src\views\kmg\desktop\components\Collapse\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, {useState, useEffect} from 'react';
import classnames from 'classnames';
import {useSpring, animated} from 'react-spring';
import useMeasure from 'react-use-measure';
import classNames from 'classnames';
import styles from './style.scss';

interface IProps {
  open?: boolean;
  header: React.ReactNode;
  children: React.ReactNode;
  onChange?: (openVal: boolean) => void;
  className?: string;
  allOpen?: boolean;
}

function DpCollapse({
  open, header, children, onChange, className, allOpen,
}: IProps) {
  const [isCollapsed, setIsCollapsed] = useState(open !== undefined ? open : false);
  const togglePanel = () => {
    setIsCollapsed((prevState) => {
      if (onChange) onChange(!prevState);
      return !prevState;
    });
  };
  const [ref, bounds] = useMeasure();
  const panelContentAnimatedStyle = useSpring({
    height: isCollapsed ? 0 : bounds.height,
    config: {duration: 150},
    reset: true,
  });

  useEffect(() => {
    if (allOpen !== undefined) setIsCollapsed(!allOpen);
  }, [allOpen]);

  return (
    <div className={classnames(styles.dp_collapse, className)}>
      <div className={classNames('collapse-header', {'border-bottom': !isCollapsed})} onClick={togglePanel}>
        {
          header
        }
      </div>
      <animated.div
        style={panelContentAnimatedStyle}
        className="content"
      >
        <div className="content-wrapper" ref={ref}>
          {
            children
          }
        </div>
      </animated.div>
    </div>
  );
}

export default React.memo(DpCollapse);

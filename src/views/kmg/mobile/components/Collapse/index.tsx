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

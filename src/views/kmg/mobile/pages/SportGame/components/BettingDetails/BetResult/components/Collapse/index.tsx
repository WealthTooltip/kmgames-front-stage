import React, {useState, useEffect} from 'react';
import {useSpring, animated} from 'react-spring';
import {useMeasure} from 'react-use';
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
  open,
  header,
  children,
  onChange,
  className,
  allOpen,
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
    <div className={classNames(styles.dp_collapse, className)}>
      <div className={classNames('collapse-header', {'border-bottom': !isCollapsed}, {'open': open === false})} onClick={togglePanel}>
        <div>{header}</div>
        <animated.div className='arrow' style={{transform: panelContentAnimatedStyle.height.to((height) => (height === 0 ? 'rotate(180deg)' : 'rotate(0deg)'))}}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 8L6 4L10 8" stroke="#B7BBC6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg></animated.div>
      </div>
      <animated.div style={panelContentAnimatedStyle} className="content">
        <div className="content-wrapper" ref={ref}>
          {children}
        </div>
      </animated.div>
    </div>
  );
}

export default DpCollapse;

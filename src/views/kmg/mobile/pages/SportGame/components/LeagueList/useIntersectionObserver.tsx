import {useRef, useEffect} from 'react';
export default (callback: Function, leagueName: string, leagueId: number) => {
  const targetRef:any = useRef();
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(true, leagueName, leagueId);
          setVisible(true);
        } else {
          callback(false, leagueName);
          setVisible(false);
        }
      });
    });
    observer.observe(targetRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);
  return {
    targetRef,
    visible,
  };
};

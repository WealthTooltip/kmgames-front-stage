import usePublicState from '../usePublicState';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const openZoom = (matchId: number) => {
    if (!matchId) return;
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId}));
    setTimeout(() => {
      dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(true));
    }, 100);
  };
  return {
    openZoom,
  };
};

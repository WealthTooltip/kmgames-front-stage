import usePublicState from '../usePublicState';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const handleHandicapTutorial = () => {
    dispatch(ACTIONS.SPORT.handleHandicapTutorial());
  };

  return {
    handleHandicapTutorial,
  };
};

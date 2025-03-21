import usePublicState from '../usePublicState';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();

  const toggleMobileOrderHistory = (navigation: number, orderHistoryStatus: number) => {
    dispatch(ACTIONS.BASE.toggleMobileOrderHistory(navigation, orderHistoryStatus));
  };

  return {
    toggleMobileOrderHistory,
  };
};

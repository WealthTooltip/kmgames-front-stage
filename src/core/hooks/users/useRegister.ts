/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:01:31
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/users/useRegister.ts
 * @Description: 用户注册
 */
// import AES from 'crypto-js/aes';
// import MD5 from 'crypto-js/md5';
// import usePublicState from "../usePublicState";
import CONFIG from '@this/configs';

export default () => {
  // const { dispatch, ACTIONS } = usePublicState();

  const [payload, setPaylaod] = React.useState({
    nickName: '',
    tenantCode: CONFIG.TENANT_CODE,
    userName: 'fontend1',
  });

  // 去注册
  const submit = () => {
    // AES 加密
    // const data = AES.encrypt(JSON.stringify(payload), CONFIG.SERCET_KEY).toString();
    // const timestamp = _.now();
    // const tenantCode = payload.tenantCode;
    // // 签名
    // const sign =  MD5(`${timestamp}|${tenantCode}|${data}|${CONFIG.SERCET_KEY}`).toString();
    // dispatch(ACTIONS.USER.register({
    //   data: {
    //     data,
    //     sign,
    //     tenantCode,
    //     timestamp
    //   },
    //   cb: (res: any) => {
    //     console.log(res);
    //   }
    // }))
  };

  return {
    payload,
    setPaylaod,
    submit,
  };
};

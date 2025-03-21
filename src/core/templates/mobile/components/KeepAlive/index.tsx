/*
 * @Author: Passion.KMG
 * @Date: 2024-01-06 17:26:29
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/templates/desktop/components/KeepAlive/index.tsx
 * @Description:
 */
import KeepAlive from 'react-activation';

interface IKeepLiveProps {
  children: React.ReactNode;
  cacheKey: string;
}
export default ({cacheKey, children}: IKeepLiveProps) => {
  return (
    <KeepAlive cacheKey={cacheKey}>
      {children}
    </KeepAlive>
  );
};

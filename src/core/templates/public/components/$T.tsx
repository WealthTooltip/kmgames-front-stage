/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: jspassion@itcom888.com
 * @FilePath: /kmg/src/core/templates/public/components/$T.tsx
 * @Description: 翻译组件
*/
import $t from '@core/helpers/i18n';

interface IProps{
  children:React.ReactNode,
  kw?: string,
  params?: {
    [key: string]: any
  }
}
export default ({children, params = {}, kw = ''}: IProps) => (
  $t(<>{children}</>, params, {kw})
);

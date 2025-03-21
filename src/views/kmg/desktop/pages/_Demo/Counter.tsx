/*
 * @Author: Passion.KMG
 * @Date: 2024-01-06 17:17:21
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/_Demo/Counter.tsx
 * @Description:
 */
import {useState} from 'react';

export default () => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    return () => {
      console.log('unmount');
    };
  }, []);

  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>Add</button>
      <h3>count: {count}</h3>
    </div>
  );
};

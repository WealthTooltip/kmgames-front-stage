import styles from './style.scss';
import DataTable from './components/DataTable';
import Paginator from './components/Paginator';

export default React.memo(() => {
  return (
    <div className={styles.wrapper}>
      <DataTable />
      <Paginator />
    </div>
  );
});

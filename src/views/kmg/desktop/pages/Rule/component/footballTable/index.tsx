import {IDataTable} from '../detail';

export default ({dataTable, className}: {dataTable: IDataTable[], className: string}) => {
  const handleGoItem = (id:string) => {
    document.getElementById(id).scrollIntoView();
  };
  return (
    <table className={className}>
      <thead>
        <tr>
          {Object.keys(dataTable[0]).map((header) => <th key={header}><span onClick={()=> handleGoItem(header)}>{header}</span></th>)}
        </tr>
      </thead>
      <tbody>
        {dataTable.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((value, index) => (
              <td key={index}><span onClick={()=> handleGoItem(value)}>{value}</span></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};



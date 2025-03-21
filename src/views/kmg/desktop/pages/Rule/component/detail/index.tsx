import classnames from 'classnames';
import usePublicState from '@core/hooks/usePublicState';
import {ETHEME} from '@this/configs';
import {IData, dataTable} from './data';
import FootballTable from '../footballTable';
import {Table} from 'antd';
import {useEffect, useRef} from 'react';
import styles from './style.scss';

export interface IDataTable {
  一般规则: string;
  主要市场: string,
  进球集锦: string,
}

export const Detail = ({data, currentItem}: {data: IData, currentItem: number}) => {
  const detailRef = useRef<HTMLDivElement | null>(null);
  const {user} =usePublicState();

  useEffect(()=> {
    detailRef.current.scroll(0, 0);
  }, [currentItem]);

  const handleReturn = () => {
    detailRef.current.scroll(0, 0);
  };

  return (
    <div className={styles.wrapper} ref={detailRef}>
      {data.title === '足球' &&
      <div className='return' onClick={handleReturn}>
        <img src={require(`${ user.theme === ETHEME.LIGHT ? './i/return-light.webp' : './i/return-dark.webp'}`)} width={20} alt="prev-icon" />
      </div>
      }
      <div className='title'>{data.title}</div>
      {data.title === '足球' &&
          <FootballTable dataTable={dataTable} className='main-table' />
      }
      {data.detail.map((detail, idx) => (
        <div className='item-detail' key={idx}>
          <div className={classnames('subtitle', {'no-item': detail.items.length === 0, 'is-item': detail.items.length !== 0, 'is-describe': detail.describe})} id={`${data.title === '足球' && detail.subtitle}`}>{detail.subtitle}</div>
          {detail.describe && (
            <div className={`describe ${detail.items.length > 0 && 'mb-16'}`}>
              {detail.describe.map((describe, dIdx)=> (
                <div key={dIdx}>
                  <p>{describe.list}</p>
                  {describe.listTable &&
                  <Table className='describe-table' dataSource={describe.listTable.tableData} columns={describe.listTable.columns} pagination={false} />}
                  {describe.listItem && describe.listItem.map((listItem, idx)=> (
                    <ul key={idx}>
                      <li>{listItem.text}</li>
                    </ul>
                  ))}
                  {describe.listOtherItem && describe.listOtherItem.map((listOtherItem, idx)=> (
                    <div className='list-other' key={idx}>
                      <p>{listOtherItem.statement}</p>
                      <span>{listOtherItem.text}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className='contents'>
            {detail.items && detail.items.map((item, itemIdx) => (
              item.content && (
                <div key={itemIdx}>
                  <div className='content'>{item.content}</div>
                  {item.contentItems && item.contentItems.map((contentItem, CIdx)=> (
                    <div className='subcontent' key={CIdx}>
                      <p>{`${item.contentItems.length > 1 ? `${CIdx + 1}.` : ''}`} {contentItem.subcontent}</p>
                      {contentItem.subtable &&
                            <Table className='content-table' dataSource={contentItem.subtable.tableData} columns={contentItem.subtable.columns} pagination={false} />
                      }
                      {contentItem.subcontent && contentItem.subcontent.length > 0 && (
                        <ul>
                          {contentItem.subcontentItems && contentItem.subcontentItems.map((subcontentItem, subIdx) => (
                            <li key={subIdx}>{subcontentItem.list}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )
            ))
            }
          </div>
        </div>))}
    </div>
  );
};

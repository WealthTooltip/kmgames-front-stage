import React, {useEffect, useState} from 'react';
import styles from './style.scss';
import classNames from 'classnames';
import {Button, Image} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import usePublicState from '@core/hooks/usePublicState';
import {ETHEME} from '@views/kmg/desktop/configs';
import DpSubMenu, {ISubMenuProps} from '../component/subMenu';

interface IBetRuleMenuProps {
  menuId: number;
  title: '盘口教程' | '单关投注' | '串关投注' | '批量单关投注';
  imgUrl?: string;
  subMenu: ISubMenuProps[];
  width: number;
}

const menuList: IBetRuleMenuProps[] = [
  {
    menuId: 1,
    title: '盘口教程',
    subMenu: [
      {
        subTitle: '让球攻略',
        imgUrl: 'hadiCup/h1',
        child: [
          {
            title: '0球',
            imgUrl: 'hadiCup/h1-1',
          },
          {
            title: '0/0.5球',
            imgUrl: 'hadiCup/h1-2',
          },
          {
            title: '0.5球',
            imgUrl: 'hadiCup/h1-3',
          },
          {
            title: '0.5/1球',
            imgUrl: 'hadiCup/h1-4',
          },
          {
            title: '1球',
            imgUrl: 'hadiCup/h1-5',
          },
          {
            title: '1/1.5球',
            imgUrl: 'hadiCup/h1-6',
          },
          {
            title: '1.5球',
            imgUrl: 'hadiCup/h1-7',
          },
          {
            title: '1.5/2球',
            imgUrl: 'hadiCup/h1-8',
          },
        ],
      },
      {
        subTitle: '大小球攻略',
        imgUrl: 'hadiCup/h2',
        child: [
          {
            title: '2.5球',
            imgUrl: 'hadiCup/h2-1',
          },
          {
            title: '2.5/3球',
            imgUrl: 'hadiCup/h2-2',
          },
          {
            title: '3球',
            imgUrl: 'hadiCup/h2-3',
          },
          {
            title: '3/3.5球',
            imgUrl: 'hadiCup/h2-4',
          },
        ],
      },
      {
        subTitle: '大小球模拟训练',
        imgUrl: 'hadiCup/h3',
        child: [
          {
            title: '',
            imgUrl: 'hadiCup/h3-0',
          },
          {
            title: '',
            imgUrl: 'hadiCup/h3-1',
          },
          {
            title: '',
            imgUrl: 'hadiCup/h3-2',
          },
          {
            title: '',
            imgUrl: 'hadiCup/h3-0',
          },
        ],
      },
    ],
    width: 438,
  },
  {
    menuId: 2,
    title: '单关投注',
    subMenu: [
      {
        subTitle: '单关投注',
        imgUrl: 'single/s1',
      },
      {
        subTitle: '进入投注单',
        imgUrl: 'single/s2',
      },
      {
        subTitle: '确认投注',
        imgUrl: 'single/s3',
      },
      {
        subTitle: '投注完成',
        imgUrl: 'single/s4',
      },
    ],
    width: 583,
  },
  {
    menuId: 3,
    title: '串关投注',
    subMenu: [],
    imgUrl: 'acc',
    width: 0,
  },
  {
    menuId: 4,
    title: '批量单关投注',
    subMenu: [],
    imgUrl: 'blk',
    width: 0,
  },
];

const BetRuleMenu: React.FC = () => {
  const {user} = usePublicState();
  const [selectedItem, setSelectedItem] = useState({
    menuId: 1,
    len: 3,
    subId: 0,
  });
  const [childId, setChildId] = useState(0);

  const {menuId, len, subId} = selectedItem;

  const handleMenu = (newMenuId: number) => {
    setSelectedItem({
      menuId: newMenuId,
      len: menuList.find((menu) => menu.menuId === newMenuId).subMenu.length,
      subId: 0,
    });
  };

  const handleSubMenu = (newSubMenuId : number) => {
    setChildId(0);
    setSelectedItem((prevSelectedItem) => ({
      ...prevSelectedItem,
      subId: newSubMenuId,
    }));
  };

  const handleNext = () => {
    const nextIndex = subId + 1;
    if (nextIndex < len) {
      handleSubMenu(nextIndex);
    }
  };

  const handlePrevious = () => {
    const previousIndex = subId - 1;
    if (previousIndex >= 0) {
      handleSubMenu(previousIndex);
    }
  };

  useEffect( () => {
    const newLen = menuList.find((menu) => menu.menuId === menuId).subMenu.length;
    setSelectedItem((prevSelectedItem) => ({
      ...prevSelectedItem,
      len: newLen,
    }));
  }, [menuId]);

  return (
    <div className='main'>
      <div className='menu'>
        <ul className='menu-body'>
          {menuList.map((menu, idx) => (
            <li
              className={classNames(styles.DpMenu, 'menu-item', {'selected': menu.menuId === menuId})}
              key={idx}
              onClick={() => handleMenu(menu.menuId)}
            >
              {menu.title}
            </li>
          ))}
        </ul>
      </div>
      <div className='sub-menu'>
        {len > 0 &&
          <DpSubMenu
            subMenu={menuList.find((menu) => menu.menuId === menuId).subMenu}
            subId={subId}
            setSelectedSubItem={handleSubMenu}
            width={menuList.find((menu) => menu.menuId === menuId).width}
          />
        }
      </div>
      <div className='board'>
        <div className='back'>
          <Image
            preview={false}
            src={require(`../i/com${user.theme === ETHEME.DARK ? '_dark' : ''}.png`)}
            alt="Outer Image"
            className='outer-img'
          />
        </div>
        <div className='btn-group'>
          {len > 0 && (
            <>
              {subId > 0 && (
                <Button
                  type="primary"
                  icon={<LeftOutlined />}
                  className='arrow-button previous'
                  onClick={handlePrevious}
                />
              )}
              {subId < len - 1 && (
                <Button
                  type="primary"
                  icon={<RightOutlined />}
                  className='arrow-button next'
                  onClick={handleNext}
                />
              )}
            </>
          )}
        </div>
        <div className='slide'>
          <div className='inner' style={{
            transform: `translateX(-${subId * 100 / (len===0?1:len)}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}>
            {len === 0 ?
              <Image
                key={0}
                preview={false}
                src={require(`../i/${menuList.find((menu) => menu.menuId === menuId).imgUrl}${user.theme === ETHEME.DARK ? '_dark' : ''}.webp`)}
                alt="Inner Image"
                className='active'
              /> :
              menuList.find((menu) => menu.menuId === menuId).subMenu.map((subMenuItem, idx) => (
                <div key={idx} className={classNames('inner-body', {'active': subId === idx})}>
                  {(subMenuItem.child) ?
                    <div className='child'>
                      <div className='child-inner'>
                        {subMenuItem.child.map((item, idx) => {
                          return (
                            <Image
                              preview={false}
                              src={require(`../i/${subMenuItem.child[idx].imgUrl}${user.theme === ETHEME.DARK ? '_dark' : ''}.webp`)}
                              alt="Inner Image"
                              key={idx}
                              className = {classNames('child-img', {'active': idx === childId})}
                            />
                          );
                        })
                        }
                      </div>
                      <div className={`child-menu sub${subId}`}>
                        {subMenuItem.child.map((childItem, cIdx) => {
                          return (
                            <div className={classNames('child-title', {'selected': childId === cIdx}, `cId${cIdx}`)} key={cIdx} onClick={()=>{
                              setChildId(cIdx);
                            }}>{childItem.title}</div>
                          );
                        })}
                      </div>
                    </div> :
                  <Image
                    preview={false}
                    src={require(`../i/${subMenuItem.imgUrl}${user.theme === ETHEME.DARK ? '_dark' : ''}.webp`)}
                    alt="Inner Image"
                  />
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const BetRule: React.FC = () => {
  return (
    <div className={styles.betRuleWrapper}>
      <BetRuleMenu />
    </div>
  );
};

export default BetRule;

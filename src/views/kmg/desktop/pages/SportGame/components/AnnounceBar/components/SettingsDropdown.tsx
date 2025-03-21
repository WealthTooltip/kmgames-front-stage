/*
 * @Author: Spextre.KMG
 * @Date: 2024-01-02 15:23
 * @LastEditors: Spextre.KMG jsspextre@itcom888.com
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/AnnounceBar/components/SettingsDropdown.tsx
 * @Description:
 */
import {useState} from 'react';
import {Collapse, Dropdown, Space, Switch, Typography} from 'antd';
import type {CollapseProps} from 'antd';
import DpIcon from '@this/components/Icon';
import styles from '../style.scss';

const {Text, Link} = Typography;

const SettingDropDown = () => {
  const [recentSlct, setRecentSlct] = useState<string>('全部');
  const [recentSlctActive, setRecentSlctActive] = useState<string>('0');
  const [playStyle, setPlayStyle] = useState<boolean>(false);
  const [additionalSlct, setAdditionalSlct] = useState<string>('全部行');
  const [additionalSlctActive, setAdditionalSlctActive] = useState<string>('0');
  const [additional, setAdditional] = useState<boolean>(true);

  const handleSetValue = (
      setValue: React.Dispatch<React.SetStateAction<any>>,
      value: any,
      setActive: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setValue(value);
    setActive('0');
  };

  const recentOpt = ['全部', '3小时以内', '6小时以内', '9小时以内', '12小时以内'];
  const recentCollaspe: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space align='center' className="collaspe-menu-item">
          <DpIcon type="clock" width={14} height={14} />
          <Space align='center' className="item-container">
            <Text>近期开赛</Text>
          </Space>
        </Space>
      ),
      children: (
        <ul className='selection-list overlay-selection'>
          {recentOpt.map((key: string) => (
            <li
              key={key}
              onClick={() => handleSetValue(setRecentSlct, key, setRecentSlctActive)}
              className={recentSlct === key ? 'selected-item' : ''}
            >
              {key}
            </li>
          ))}
        </ul>
      ),
      extra: (
        <Link
          href='#'
          onClick={(e) => e.preventDefault()}
        >
          {recentSlct}
        </Link>
      ),
    },
  ];

  const additionalOpt = [
    {key: '3行', text: '3行展示'},
    {key: '全部行', text: '全部行展示'},
  ];
  const additionalCollaspe: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Space align='center' className="collaspe-menu-item">
          <DpIcon type="listAdd" width={14} height={14} />
          <Space align='center' className="item-container">
            <Text>列表附加玩法配置</Text>
          </Space>
        </Space>
      ),
      children: (
        <ul className='selection-list'>
          {additionalOpt.map(({key, text}, i) => (
            <li
              key={key}
              onClick={() => handleSetValue(setAdditionalSlct, key, setAdditionalSlctActive)}
              className={additionalSlct === key ? 'selected-item' : ''}
            >
              <div>{text}</div>
              {additionalOpt.length - 1 <= i && <DpIcon type="right" width={12} height={12} />}
            </li>
          ))}
        </ul>
      ),
      extra: (
        <Link
          href='#'
          onClick={(e) => e.preventDefault()}
        >
          {additionalSlct}
        </Link>
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: (
        <div
          className="collaspe-container"
          onClick={(e) => e.stopPropagation()}
        >
          <Collapse
            expandIconPosition="end"
            ghost
            items={recentCollaspe}
            activeKey={recentSlctActive}
            onChange={(key: string) => {
              setRecentSlctActive(key);
            }}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <Space align='center' className="menu-item">
          <DpIcon type="linkAdd" width={14} height={14} />
          <Space align='center' className="item-container">
            <Text>列表附加玩法默认展示</Text>
            <Switch
              checked={playStyle}
              className="item-switch"
              onChange={(isOn, e) => {
                setPlayStyle(isOn);
                e.stopPropagation();
              }}
            />
          </Space>
        </Space>
      ),
    },
    {
      key: '3',
      label: (
        <div
          className="collaspe-container"
          onClick={(e) => e.stopPropagation()}
        >
          <Collapse
            expandIconPosition="end"
            ghost
            items={additionalCollaspe}
            activeKey={additionalSlctActive}
            onChange={(key: string) => {
              setAdditionalSlctActive(key);
            }}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: (
        <Space align='center' className="menu-item">
          <DpIcon type="paperClip" width={14} height={14} />
          <Space align='center' className="item-container">
            <Text>附加盘</Text>
            <Switch
              checked={additional}
              className="item-switch"
              onChange={(isOn, e) => {
                setAdditional(isOn);
                e.stopPropagation();
              }}
            />
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <Dropdown menu={{items}} placement="bottom" overlayClassName={styles.menu}>
      <div className="flex items-center">
        设置
        <DpIcon type="arrow" className={styles.dropIcon} />
      </div>
    </Dropdown>
  );
};

export default SettingDropDown;

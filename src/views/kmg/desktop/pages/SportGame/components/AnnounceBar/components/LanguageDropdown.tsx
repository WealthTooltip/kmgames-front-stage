/*
 * @Author: Spextre.KMG
 * @Date: 2024-01-02 15:23
 * @LastEditors: Spextre.KMG jsspextre@itcom888.com
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/AnnounceBar/components/SettingsDropdown.tsx
 * @Description:
 */
import {useState} from 'react';
import {Dropdown, Flex} from 'antd';
import {find} from 'lodash';
import DpIcon from '@this/components/Icon';
import styles from '../style.scss';

const SettingDropDown = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['zh-cn']);

  const items = [
    {
      key: 'zh-cn',
      name: '简体中文',
      label: <div className="langue-item">
        <img src={require('../i/zh-cn.png')} />
        <span>
          简体中文
        </span>
      </div>,
    },
    // {
    //   key: 'zh-hk',
    //   name: '繁體中文',
    //   label: <div className="langue-item">
    //     <img src={require('../i/zh-hk.png')} />
    //     <span>
    //       繁體中文
    //     </span>
    //   </div>,
    // },
    // {
    //   key: 'en',
    //   name: 'English',
    //   label: <div className="langue-item">
    //     <img src={require('../i/en.png')} />
    //     <span>
    //       English
    //     </span>
    //   </div>,
    // },
    // {
    //   key: 'vi',
    //   name: 'Tiếng Việt',
    //   label: <div className="langue-item">
    //     <img src={require('../i/vi.png')} />
    //     <span>
    //       Tiếng Việt
    //     </span>
    //   </div>,
    // },
    // {
    //   key: 'th',
    //   name: 'ภาษาไทย',
    //   label: <div className="langue-item">
    //     <img src={require('../i/th.png')} />
    //     <span>
    //       ภาษาไทย
    //     </span>
    //   </div>,
    // },
    // {
    //   key: 'my',
    //   name: 'Melayu',
    //   label: <div className="langue-item">
    //     <img src={require('../i/my.png')} />
    //     <span>
    //       Melayu
    //     </span>
    //   </div>,
    // },
    // {
    //   key: 'id',
    //   name: 'Indonesia',
    //   label: <div className="langue-item">
    //     <img src={require('../i/id.png')} />
    //     <span>
    //       Indonesia
    //     </span>
    //   </div>,
    // },
    // {
    //   key: 'kr',
    //   name: '한국어',
    //   label: <div className="langue-item">
    //     <img src={require('../i/kr.png')} />
    //     <span>
    //       한국어
    //     </span>
    //   </div>,
    // },
  ];

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys,
        onSelect: ({key}) => setSelectedKeys([key]),
      }}
      placement="bottom"
      overlayClassName={styles.language}
    >
      <Flex align="items-center">
        <div className="langue-item">
          <img src={require(`../i/${selectedKeys[0]}.png`)} />
          {find(items, {'key': selectedKeys[0]}).name}
        </div>
        <DpIcon type="arrow" />
      </Flex>
    </Dropdown>
  );
};

export default SettingDropDown;

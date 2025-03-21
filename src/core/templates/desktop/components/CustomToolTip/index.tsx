import {Tooltip} from 'antd';
// import classnames from 'classnames';
import './style.scss';

const CustomToolTip = ({title, children, placement='bottomLeft', className}: {title: React.ReactNode, children: React.ReactElement, placement?: any, className?: string}) => {
  return <Tooltip title={title} placement={placement} overlayClassName={`custom-tooltip ${className}`}>{children}</Tooltip>;
};

export default CustomToolTip;

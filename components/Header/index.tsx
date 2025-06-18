import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import { MobileHeader } from '../atoms/MobileHeader';
import DesktopHeader from './DesktopHeader';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <MobileHeader title={title} />
  ) : (
    <DesktopHeader title={title} />
  );
};

export default Header;
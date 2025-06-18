import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

type ScreenSize = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export const useScreenSize = (): ScreenSize => {
  const [screenData, setScreenData] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  });

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number; height: number } }) => {
      setScreenData({
        width: window.width,
        height: window.height,
        isMobile: window.width < 768,
        isTablet: window.width >= 768 && window.width < 1024,
        isDesktop: window.width >= 1024,
      });
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove?.();
  }, []);

  return screenData;
}; 
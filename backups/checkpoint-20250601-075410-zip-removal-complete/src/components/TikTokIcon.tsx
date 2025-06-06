import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const TikTokIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.04 2.1-.63 3.27-2.2 3.51.83-1.13 1.02-2.39.62-4.03-2.26.09-3.33 1.39-3.33 3.1v.88c-3.31-.06-6.13-.17-9.08.02C.94 1.29 3.17 3.13 3.92 6.32c-1.22-1.5-1.8-3.57-1.12-5.12.17 2.07 1.66 2.41 2.62 1.94.66-.36.9-1.14.91-2.25-2.59 1.34-2.64 1.31-3.16 3.6.7 2.1 2.17 3.07 4.32 3.09.38 2.54 2.44 2.56 2.44 2.56v4.2c0 .32.25.57.57.57 1.53-.05 2.95-.6 3.98-1.57.56-.53.9-1.25 1.01-2.04 1.71-.15 3.17.39 4.07 1.45.54.65.84 1.47.84 2.34 0 1.52-.9 2.83-2.2 3.48.5 1.14.57 2.17.2 3.28-.76 2.24-2.8 3.15-5.04 3.1-.5-.01-1.04-.14-1.62-.35-.35-.13-.7-.3-1.06-.49-1.52-.8-2.63-2.02-3.28-3.55-.65-1.53-.8-3.15-.46-4.77.64-3.03 3.11-5.3 6.19-5.65.22-.02.44-.04.66-.04v2.86c-.48 0-.95.05-1.42.18-1.18.31-2.19.96-2.99 1.89.01-1.31.5-2.56 1.48-3.5.98-.94 2.25-1.46 3.56-1.48.09 0 .18 0 .27.01V0h.01z" />
    </SvgIcon>
  );
};

export default TikTokIcon;

import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

// icons definition
const Warning = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
  </svg>
);
export const WarningIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={Warning} {...props} />;

const Speed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44z" />
    <path d="M10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z" />
  </svg>
);
export const SpeedIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={Speed} {...props} />;

const JamLevel = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z" />
  </svg>
);
export const JamLevelIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={JamLevel} {...props} />;

const JamDelay = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);
export const JamDelayIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={JamDelay} {...props} />;

const Car = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
    <circle cx="7.5" cy="14.5" r="1.5" />
    <circle cx="16.5" cy="14.5" r="1.5" />
  </svg>
);

export const CarIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={Car} {...props} />;

const Cancel = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);
export const CancelIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={Cancel} {...props} />;

const Route = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="M360-130.001q-62.154 0-106.076-43.923Q210.001-217.846 210.001-280v-333.924q-35-13-57.5-41.576-22.5-28.577-22.5-64.369 0-45.888 32.07-78.009t77.884-32.121q45.814 0 77.929 32.121t32.115 78.009q0 35.792-22.5 64.369-22.5 28.576-57.5 41.576V-280q0 37.125 26.46 63.563 26.46 26.438 63.616 26.438t63.541-26.438q26.385-26.438 26.385-63.563v-400q0-62.154 43.923-106.076Q537.846-829.999 600-829.999q62.154 0 106.076 43.923Q749.999-742.154 749.999-680v333.924q35 13 57.5 41.576 22.5 28.577 22.5 64.369 0 45.888-32.07 78.009t-77.884 32.121q-45.814 0-77.929-32.121t-32.115-78.009q0-35.792 22.5-64.869 22.5-29.076 57.5-41.076V-680q0-37.125-26.46-63.563-26.46-26.438-63.616-26.438t-63.541 26.438Q509.999-717.125 509.999-680v400q0 62.154-43.923 106.076Q422.154-130.001 360-130.001Z" />
  </svg>
);
export const RouteIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={Route} {...props} />;

const Pin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" color="red">
    <path d="M480.059-486.667q30.274 0 51.774-21.559t21.5-51.833q0-30.274-21.559-51.774t-51.833-21.5q-30.274 0-51.774 21.559t-21.5 51.833q0 30.274 21.559 51.774t51.833 21.5ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z" />
  </svg>
);
export const PinIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={Pin} {...props} />;

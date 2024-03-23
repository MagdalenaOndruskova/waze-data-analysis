import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

// icons definition
const Warning = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
  </svg>
);
export const WarningIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={Warning} {...props} />;

const WarningSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
  </svg>
);
export const WarningSmallIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={WarningSmall} {...props} />
);

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

const CarSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
    <circle cx="7.5" cy="14.5" r="1.5" />
    <circle cx="16.5" cy="14.5" r="1.5" />
  </svg>
);

export const CarSmallIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={CarSmall} {...props} />;

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

const CarCrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
    <path d="M621.339-294.769q18.123 0 30.7-12.686 12.576-12.685 12.576-30.807 0-18.123-12.685-30.7-12.686-12.577-30.808-12.577t-30.699 12.686q-12.577 12.686-12.577 30.808t12.686 30.699q12.685 12.577 30.807 12.577Zm-362.461 0q18.122 0 30.699-12.686 12.577-12.685 12.577-30.807 0-18.123-12.686-30.7-12.685-12.577-30.807-12.577-18.123 0-30.699 12.686-12.577 12.686-12.577 30.808t12.685 30.699q12.686 12.577 30.808 12.577Zm404.05-227.692q-65.159 0-110.255-45.497-45.096-45.497-45.096-111.1.115-64.481 45.324-109.635 45.209-45.153 110.684-45.153 64.8 0 110.088 45.288 45.289 45.289 45.289 110.404 0 65.116-45.64 110.404-45.64 45.289-110.394 45.289ZM648.5-654.769h29.539v-116.308H648.5v116.308Zm14.769 72q7.616 0 12.346-5.116 4.731-5.115 5.5-12.153 0-7.5-5.115-12.962-5.115-5.461-12.981-5.461-7.865.615-12.73 5.48-4.866 4.866-4.866 12.423 0 7.558 4.846 12.673 4.846 5.116 13 5.116ZM145.112-126.154q-8.224 0-13.591-5.079-5.367-5.08-5.367-13.075v-289.626l78.769-222.989q2.923-8.423 10.606-13.289 7.683-4.865 16.779-4.865h183.154q-.577 8.884.384 18.462.962 9.576 2.423 18.461H238L178.462-470.77h353.461q28.115 24.347 62.187 37.097t70.661 12.75q23.577 0 45.961-5.288 22.384-5.289 43.114-15.866v297.769q0 7.995-5.396 13.075-5.396 5.079-13.373 5.079h-6.58q-8.224 0-13.591-5.079-5.368-5.08-5.368-13.075v-60.615H170.462v60.615q0 7.995-5.396 13.075-5.397 5.079-13.374 5.079h-6.58Z" />
  </svg>
);
export const CarCrashIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={CarCrash} {...props} />;

const RoadClosed = () => (
  <svg fill="#000000" height="24px" width="24px" viewBox="0 0 43.667 43.667">
    <path
      d="M42.167,8.166h-4.5v-4.75c0-0.829-0.671-1.5-1.5-1.5c-0.829,0-1.5,0.671-1.5,1.5v4.75H9v-4.75c0-0.829-0.671-1.5-1.5-1.5
	S6,2.588,6,3.416v4.75H1.5c-0.829,0-1.5,0.671-1.5,1.5v12.667c0,0.829,0.671,1.5,1.5,1.5H6V38.75H3.083c-0.829,0-1.5,0.671-1.5,1.5
	c0,0.829,0.671,1.5,1.5,1.5h9.25c0.829,0,1.5-0.671,1.5-1.5c0-0.829-0.671-1.5-1.5-1.5H9v-1.878l12.833-5.729l12.833,5.729v1.878
	h-3.333c-0.829,0-1.5,0.671-1.5,1.5c0,0.829,0.671,1.5,1.5,1.5h9.25c0.829,0,1.5-0.671,1.5-1.5c0-0.829-0.671-1.5-1.5-1.5h-2.917
	V23.833h4.5c0.829,0,1.5-0.671,1.5-1.5V9.666C43.667,8.838,42.995,8.166,42.167,8.166z M3,13.027l3.509,3.296L3,19.62V13.027z
	 M11.999,11.166l-3.3,3.099L5.4,11.166H11.999z M38.266,11.166l-3.3,3.099l-3.3-3.099H38.266z M15.267,12.213l4.376,4.111
	l-4.376,4.111l-4.376-4.111L15.267,12.213z M21.833,18.382l2.61,2.451h-5.219L21.833,18.382z M24.024,16.324l4.376-4.111
	l4.376,4.111L28.4,20.434L24.024,16.324z M21.833,14.266l-3.299-3.099h6.599L21.833,14.266z M8.7,18.382l2.61,2.451H6.09L8.7,18.382
	z M30.848,23.833l-9.015,4.024l-9.015-4.024H30.848z M32.357,20.833l2.61-2.451l2.61,2.451H32.357z M37.157,16.324l3.509-3.296
	v6.592L37.157,16.324z M9,33.587v-8.173l9.154,4.087L9,33.587z M25.513,29.5l9.154-4.087v8.173L25.513,29.5z"
    />
  </svg>
);
export const RoadClosedIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={RoadClosed} {...props} />;

const TrafficJam = () => (
  <svg
    fill="#000000"
    width="24px"
    height="24px"
    viewBox="0 0 32 32"
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs></defs>
    <rect x="11" y="21" width="6" height="2" />
    <path
      d="M24.2456,8,25.96,14H30V12H27.4688l-1.3-4.5488A2.0077,2.0077,0,0,0,24.2456,6H22.8972l-.7287-2.5488A2.0077,2.0077,0,0,0,20.2456,2H7.7544A2.0078,2.0078,0,0,0,5.8315,3.4507L4.5312,8H2v2H6.04L7.7544,4H20.2456l.5715,2H11.7544A2.008,2.008,0,0,0,9.8315,7.45L8.8171,11H7.7144a1.9981,1.9981,0,0,0-1.8916,1.3516L4.5715,16H2v2H4v7a2.0025,2.0025,0,0,0,2,2v3H8V27H20v3h2V27a2.0025,2.0025,0,0,0,2-2V18h2V16H23.4287l-1.251-3.6475A1.9988,1.9988,0,0,0,20.2856,11H10.897l.8574-3ZM22,19v2H20v2h2v2H6V23H8V21H6V19Zm-.3429-2H6.3428l1.3716-4H20.2856Z"
      transform="translate(0 0)"
    />
  </svg>
);
export const TrafficJamIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={TrafficJam} {...props} />;

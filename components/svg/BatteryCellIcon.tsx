const BatteryCellIcon = ({
  width = 5,
  height = 13,
  fill = "#2F58E0",
}: SvgIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 5 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.05188 6.21484H0V8.30532H2.05188V6.21484Z" fill="white" />
      <path d="M2.05188 8.27734H0V10.3678H2.05188V8.27734Z" fill="white" />
      <path
        d="M4.10364 6.21484H2.05176V8.30532H4.10364V6.21484Z"
        fill="white"
      />
      <path
        d="M4.10364 8.27734H2.05176V10.3678H4.10364V8.27734Z"
        fill="white"
      />
      <path
        d="M4.10364 10.3398H2.05176V12.4303H4.10364V10.3398Z"
        fill="white"
      />
      <path d="M2.05188 0H0V2.09048H2.05188V0Z" fill="white" />
      <path d="M2.05188 2.0625H0V4.15298H2.05188V2.0625Z" fill="white" />
      <path d="M2.05188 4.125H0V6.21548H2.05188V4.125Z" fill="white" />
      <path d="M4.10364 2.0625H2.05176V4.15298H4.10364V2.0625Z" fill="white" />
      <path d="M4.10364 4.125H2.05176V6.21548H4.10364V4.125Z" fill="white" />
    </svg>
  );
};

export default BatteryCellIcon;

const JointIcon = ({
  width = 8,
  height = 8,
  fill = "#2F58E0",
}: SvgIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.51574 1.97059H4.65339V0H3.43201V1.97059H2.56489V3.14515H0V4.45021H2.56489V5.62476H3.43201V8H4.65339V5.65357H5.5031V4.45021H8V3.14515H5.51574V1.97059Z"
        fill="white"
      />
    </svg>
  );
};

export default JointIcon;

import { CSSProperties } from "react";

export const TYPOGRAPHY: {
  h1: {
    [key: string]: CSSProperties;
  };
  h2: {
    [key: string]: CSSProperties;
  };
  h3: {
    [key: string]: CSSProperties;
  };
  h4: {
    [key: string]: CSSProperties;
  };
  body1: {
    [key: string]: CSSProperties;
  };
  body2: {
    [key: string]: CSSProperties;
  };
  caption: {
    [key: string]: CSSProperties;
  };
} = {
  h1: {
    medium: {
      fontWeight: 500,
      fontSize: "42px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    regular: {
      fontWeight: 400,
      fontSize: "42px",
      lineHeight: "130%",
      letterSpacing: "-0.5%",
    },
  },
  h2: {
    bold: {
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
  },
  h3: {
    bold: {
      fontWeight: 700,
      fontSize: "22px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    semiBold: {
      fontWeight: 600,
      fontSize: "22px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    regular: {
      fontWeight: 400,
      fontSize: "22px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
  },
  h4: {
    bold: {
      fontWeight: 700,
      fontSize: "18px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    regular: {
      fontWeight: 400,
      fontSize: "18px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
  },
  body1: {
    bold: {
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    semiBold: {
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    medium: {
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    regular: {
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
  },
  body2: {
    bold: {
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    semiBold: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    medium: {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    regular: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
  },
  caption: {
    medium: {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
    regular: {
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "140%",
      letterSpacing: "-0.5%",
    },
  },
};

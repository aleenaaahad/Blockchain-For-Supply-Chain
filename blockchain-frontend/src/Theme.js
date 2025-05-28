import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#0f1117",
        color: "#f0f2f5",
        fontFamily: "'Fira Code', monospace",
      },
    },
  },
  colors: {
    brand: {
      50: "#e3f9ff",
      100: "#c5e4f3",
      200: "#a2d4ec",
      300: "#7ac1e4",
      400: "#47a9da",
      500: "#0088cc", // electric blue
      600: "#007ab8",
      700: "#006ba1",
      800: "#005885",
      900: "#003f5e",
    },
    background: "#0f1117",
    accent: "#6c63ff", // techy purple
  },
  fonts: {
    heading: "'Orbitron', sans-serif",
    body: "'Fira Code', monospace",
  },
});

export default theme;

import { createAnimations } from "@tamagui/animations-react-native";
import { createInterFont } from "@tamagui/font-inter";
import { shorthands } from "@tamagui/shorthands";
import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";

export const animations = createAnimations({
  "100ms": {
    type: "timing",
    duration: 100,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  slow: {
    damping: 15,
    stiffness: 40,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
});

const headingFont = createInterFont({
  size: {
    6: 15,
  },
  transform: {
    6: "uppercase",
    7: "none",
  },
  weight: {
    6: "400",
    7: "700",
  },
  color: {
    6: "$colorFocus",
    7: "$color",
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    700: { normal: "InterBold" },
  },
});

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: "InterBold" },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
);

const tamaguiConfig = createTamagui({
  themes,
  defaultTheme: "dark",
  defaultFont: "body",
  animations,
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },

  tokens,
});

type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;

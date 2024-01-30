process.env.TAMAGUI_TARGET = "native"; // Don't forget to specify your TAMAGUI_TARGET here

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"]
  };
};

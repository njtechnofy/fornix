process.env.TAMAGUI_TARGET = "native"; // Don't forget to specify your TAMAGUI_TARGET here

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["react-native-worklets-core/plugin"],
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      ['@babel/plugin-transform-flow-strip-types'],
      ['@babel/plugin-proposal-class-properties', {loose: true}],
      [
        "transform-inline-environment-variables",
        // NOTE: include is optional, you can leave this part out
        {
          include: ["TAMAGUI_TARGET", "EXPO_ROUTER_APP_ROOT"]
        }
      ],
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          logTimings: true
        }
      ],
      require.resolve("expo-router/babel"),
      ["react-native-reanimated/plugin"],
    ]
  };
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily disabled until we need animations
      // 'react-native-reanimated/plugin',
    ],
  };
};

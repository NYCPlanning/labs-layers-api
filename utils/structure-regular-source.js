module.exports = async (sourceConfig) => {
  const { id } = sourceConfig;

  const source = {};
  source[id] = {
    ...sourceConfig,
  };

  return source;
};

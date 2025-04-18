module.exports = async (sourceConfig) => {
  const { id } = sourceConfig;
  // console.debug('source id', id);
  // console.debug('type', sourceConfig.type);
  // console.debug('source-layers', sourceConfig['source-layers']);
  // console.debug('tile', sourceConfig.tiles);

  const source = {};
  source[id] = {
    ...sourceConfig,
  };

  return source;
};

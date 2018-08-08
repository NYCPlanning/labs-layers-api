const merge = require('deepmerge');

const overwriteMerge = (destinationArray, sourceArray) => {
  const merged = merge({ ...destinationArray }, { ...sourceArray }, { arrayMerge: overwriteMerge });

  return Object.keys(merged)
    .map(k => parseInt(k, 10))
    .reduce((acc, curr) => {
      acc[curr] = merged[curr];

      return acc;
    }, []);
};

module.exports = (a, b, c = {}) => merge(a, b, merge({ arrayMerge: overwriteMerge }, c));

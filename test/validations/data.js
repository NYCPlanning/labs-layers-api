const chai = require('chai');
const path = require('path');
const fs = require('fs');

const layerGroupSchema = require('../../schemas/layer-group');
const sourceSchema = require('../../schemas/source');
const { find } = require('../../utils/local-resources-utilities');

const getFilenames = resourceName => fs.readdirSync(path.resolve(__dirname, `../../data/${resourceName}`));

const should = chai.should();

function testLayerGroup(filename) {
  it(`validates layer-groups/${filename}`, async () => {
    const layerGroup = await find('layer-groups', filename.split('.')[0]);
    const { error } = layerGroupSchema.validate(layerGroup);
    should.not.exist(error);
  });
}

function testSource(filename) {
  it(`validates sources/${filename}`, async () => {
    const source = await find('sources', filename.split('.')[0]);
    const { error } = sourceSchema.validate(source);
    should.not.exist(error);
  });
}

describe('Data validations', async () => {
  const layerGroupFilenames = getFilenames('layer-groups');
  const sourceFilenames = getFilenames('sources');

  layerGroupFilenames.forEach(filename => testLayerGroup(filename));
  sourceFilenames.forEach(filename => testSource(filename));
});

const chai = require('chai');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');

const { find } = require('../../utils/local-resources-utilities');


const getFilenames = resourceName => fs.readdirSync(path.resolve(__dirname, `../../data/${resourceName}`));

const should = chai.should();

const layerGroupSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string(),
  visible: Joi.boolean(),
  layerVisibilityType: Joi.string(),
  titleTooltip: Joi.string(),
  meta: Joi.object(),
  layers: Joi.array().items(
    Joi.object({
      style: Joi.object().required(),
      displayName: Joi.string(),
      before: Joi.string(),
      clickable: Joi.boolean(),
      highlightable: Joi.boolean(),
      tooltipable: Joi.boolean(),
      tooltipTemplate: Joi.string(),
    }),
  ),
  legendConfig: Joi.object(),
  legendIcon: Joi.string(),
  legendColor: Joi.string(),
});

const sourceSchema = Joi.object().keys({
  id: Joi.string().required(),
  type: Joi.valid(
    'vector',
    'raster',
    'geojson',
    'cartovector',
  ),
  minzoom: Joi.number(),
  maxzoom: Joi.number(),
  'source-layers': Joi.array().items(Joi.object())
    .when('type', {
      is: 'cartovector',
      then: Joi.required(),
    }),
  tiles: Joi.array().items(Joi.string()).when('type', {
    is: 'raster',
    then: Joi.required(),
  }),
  tileSize: Joi.number().when('type', {
    is: 'raster',
    then: Joi.required(),
  }),
});

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

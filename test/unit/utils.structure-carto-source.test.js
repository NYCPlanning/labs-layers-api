const chai = require('chai');
const nock = require('nock');
const { find } = require('../../utils/local-resources-utilities');

const getSource = require('../../utils/structure-carto-source');

const should = chai.should();

const cartoResponse = require('./carto-response.json');


describe('structure-carto-source util', () => {
  it('should return a source with the correct id', async () => {
    const scope = nock('https://planninglabs.carto.com')
      .post('/api/v1/map')
      .reply(200, cartoResponse);

    try {
      const source = await find('sources', 'pluto');
      const cartoSource = await getSource([source]);

      should.exist(cartoSource[0].id);
      should.exist(cartoSource[0].type);
      should.exist(cartoSource[0].tiles);
      cartoSource[0].type.should.equal('vector');
    } catch (e) {
      throw new Error(e);
    }
    scope.isDone();
  });
});

const chai = require('chai');
const nock = require('nock');

const getSource = require('../../utils/get-source');

const should = chai.should();

const cartoResponse = require('./carto-response.json');

nock('https://planninglabs.carto.com')
  .post('/api/v1/map')
  .reply(200, cartoResponse);


describe('get-source util', () => {
  it('should return a source with the correct id', async () => {
    try {
      const source = await getSource('pluto');

      should.exist(source.pluto);
      should.exist(source.pluto.type);
      should.exist(source.pluto.tiles);
      source.pluto.type.should.equal('vector');
    } catch (e) {
      throw new Error(e);
    }
  });
});

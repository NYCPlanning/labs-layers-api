const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(require('chai-things'));

const should = chai.should();

chai.use(chaiHttp);

const server = require('../../app');

describe('POST /layer-groups', () => {
  it('returns a 200 response with json', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          'tax-lots',
          'zoning-districts',
        ],
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');

        done();
      });
  });

  it('adds the layers for a requested layergroup to the style', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          'tax-lots',
          'zoning-districts',
        ],
      })
      .end((err, res) => {
        const { data } = res.body;

        const taxLots = data.find(d => d.id === 'tax-lots');
        const zoningDistricts = data.find(d => d.id === 'zoning-districts');

        should.exist(taxLots);
        should.exist(zoningDistricts);

        done();
      });
  });
});

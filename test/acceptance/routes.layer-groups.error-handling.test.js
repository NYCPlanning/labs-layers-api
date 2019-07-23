const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const nock = require('nock');
const server = require('../../app');

chai.use(chaiThings);
chai.use(chaiHttp);

describe('POST /layer-groups', () => {
  after(() => {
    nock.cleanAll();
  });

  it('handles an error response from Carto', (done) => {
    const tempNock = nock('https://planninglabs.carto.com')
      .post('/api/v1/map')
      .reply(500, { error: ['timeout'] });

    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          { id: 'zoning-districts', visible: false },
        ],
      })
      .end((err, res) => {
        res.status.should.equal(500);
        done();
      });

    tempNock.isDone();
  });
});

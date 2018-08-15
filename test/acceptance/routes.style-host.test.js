const chai = require('chai');

const should = chai.should();

const server = require('../../app');

const validStyle = {
  version: 8,
  name: 'Positron',
  metadata: {},
  sources: {},
  layers: [],
};

const invalidStyle = {
  version: 8,
  name: 'Positron',
  metadata: {},
  soources: {},
  laayers: [],
};

describe('POST /style-host', () => {
  it('returns a shortid on valid style', (done) => {
    chai.request(server)
      .post('/v1/style-host')
      .set('content-type', 'application/json')
      .send(validStyle)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');

        const { styleid } = res.body;
        should.exist(styleid);

        done();
      });
  });

  it('returns an error array on invalid style', (done) => {
    chai.request(server)
      .post('/v1/style-host')
      .set('content-type', 'application/json')
      .send(invalidStyle)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(400);
        res.type.should.equal('application/json');

        const { errors } = res.body;
        should.exist(errors);
        errors.length.should.equal(2);

        done();
      });
  });
});

describe('GET /style-host', () => {
  it('retrieves a style by id', (done) => {
    chai.request(server)
      .post('/v1/style-host')
      .set('content-type', 'application/json')
      .send(validStyle)
      .end((err, res) => {
        const { styleid } = res.body;

        chai.request(server)
          .get(`/v1/style-host/${styleid}`)
          .end((error, response) => {
            JSON.stringify(response.body)
              .should.equal(JSON.stringify(validStyle));

            done();
          });
      });
  });
});

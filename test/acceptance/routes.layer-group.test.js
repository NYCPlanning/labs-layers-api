const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(require('chai-things'));

const should = chai.should();
const { expect } = chai;

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

  it('finds matching resources with array of objects', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          { id: 'tax-lots' },
          { id: 'zoning-districts' },
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

  it('finds array of objects & replaces defaults', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          {
            id: 'zoning-districts',
            title: 'peanut butter',
          },
          {
            id: 'tax-lots',
            title: 'bananas',
          },
        ],
      })
      .end((err, res) => {
        const { data, errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        const { title: taxLotsTitle } = data.find(d => d.id === 'tax-lots');
        const { title: zdTitle } = data.find(d => d.id === 'zoning-districts');

        taxLotsTitle.should.equal('bananas');
        zdTitle.should.equal('peanut butter');

        done();
      });
  });

  it('deep nested arrays are found and replaced', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          {
            id: 'tax-lots',
            title: 'bananas',
            layers: [
              {
                layer:
                {
                  minzoom: 14,
                  paint:
                  {
                    'fill-outline-color': '#cdcdcd',
                    'fill-color':
                    {
                      property: 'landuse',
                      type: 'categorical',
                      stops:
                      [
                        [
                          '01',
                          '#FFFFFF',
                        ],
                      ],
                    },
                  },
                },
              },
            ],
          },
        ],
      })
      .end((err, res) => {
        const { data, errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        const {
          layers: [{
            layer: {
              minzoom,
              source,
              paint: {
                'fill-color': {
                  stops: [
                    [, firstStopAltered],
                    [, firstStopUnaltered],
                  ],
                },
              },
            },
          }],
        } = data.find(d => d.id === 'tax-lots');

        minzoom.should.equal(14);
        source.should.equal('pluto');

        firstStopAltered.should.equal('#FFFFFF');
        firstStopUnaltered.should.equal('#FCB842');

        done();
      });
  });
});

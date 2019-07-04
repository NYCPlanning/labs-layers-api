const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiThings = require('chai-things');
const nock = require('nock');
const server = require('../../app');
const cartoResponse = require('../unit/carto-response.json');

chai.use(chaiThings);
chai.use(chaiHttp);

const should = chai.should();
const { expect } = chai;

describe('POST /layer-groups', () => {
  beforeEach(function setupNock() {
    this.scope = nock('https://planninglabs.carto.com')
      .persist()
      .post('/api/v1/map')
      .reply(200, cartoResponse);
  });

  afterEach(function teardownNock() {
    this.scope.isDone();
  });

  it('returns a 200 response with json', (done) => {
    try {
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
    } catch (e) {
      throw e;
    }
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
            legend: {
              label: 'peanut butter',
            },
          },
          {
            id: 'tax-lots',
            legend: {
              label: 'bananas',
            },
          },
        ],
      })
      .end((err, res) => {
        const { data, errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        const { attributes: { legend: { label: taxLotsTitle } } } = data.find(d => d.id === 'tax-lots');
        const { attributes: { legend: { label: zdTitle } } } = data.find(d => d.id === 'zoning-districts');

        taxLotsTitle.should.equal('bananas');
        zdTitle.should.equal('peanut butter');

        done();
      });
  });

  it('deep nested arrays skippable', (done) => {
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
                style:
                {
                  minzoom: 15,
                  paint:
                  {
                    'fill-outline-color': '#cdcdcd',
                    'fill-color':
                    {
                      property: 'landuse',
                      type: 'categorical',
                      stops:
                      [
                        [],
                        [
                          '02',
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
        const { included, errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        const {
          attributes: {
            style: {
              minzoom,
              source,
              paint: {
                'fill-color': {
                  stops: [
                    [firstId, firstStopUnaltered],
                    [secondId, secondStopAltered],
                    [thirdId, thirdStopUnaltered],
                  ],
                },
              },
            },
          },
        } = included.find(d => d.id === 'pluto-fill');

        minzoom.should.equal(15);
        source.should.equal('pluto');

        firstStopUnaltered.should.equal('#FEFFA8');
        firstId.should.equal('01');

        secondStopAltered.should.equal('#FFFFFF');
        secondId.should.equal('02');

        thirdStopUnaltered.should.equal('#B16E00');
        thirdId.should.equal('03');

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
                style:
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
        const { included, errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        const {
          attributes: {
            style: {
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
          },
        } = included.find(d => d.id === 'pluto-fill');

        minzoom.should.equal(14);
        source.should.equal('pluto');

        firstStopAltered.should.equal('#FFFFFF');
        firstStopUnaltered.should.equal('#FCB842');

        done();
      });
  });

  it('blank objects denote array position', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          {
            id: 'tax-lots',
            title: 'bananas',
            layers: [
              {},
              {
                style:
                {
                  minzoom: 14,
                },
              },
            ],
          },
        ],
      })
      .end((err, res) => {
        const { included, errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        const {
          attributes: {
            style: {
              id,
              minzoom,
              source,
            },
          },
        } = included.find(d => d.id === 'pluto-fill');

        const {
          attributes: {
            style: {
              id: secondId,
              minzoom: secondMinZoom,
              source: secondSource,
            },
          },
        } = included.find(d => d.id === 'pluto-line');

        id.should.equal('pluto-fill');
        minzoom.should.equal(15);
        source.should.equal('pluto');

        secondId.should.equal('pluto-line');
        secondMinZoom.should.equal(14);
        secondSource.should.equal('pluto');

        done();
      });
  });

  it('deep nested arrays skippable', (done) => {
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
                style:
                {
                  minzoom: 15,
                  paint:
                  {
                    'fill-outline-color': '#cdcdcd',
                    'fill-color':
                    {
                      property: 'landuse',
                      type: 'categorical',
                      stops:
                      [
                        [],
                        [
                          '02',
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
        const { included, errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        const {
          attributes: {
            style: {
              minzoom,
              source,
              paint: {
                'fill-color': {
                  stops: [
                    [firstId, firstStopUnaltered],
                    [secondId, secondStopAltered],
                    [thirdId, thirdStopUnaltered],
                  ],
                },
              },
            },
          },
        } = included.find(d => d.id === 'pluto-fill');

        minzoom.should.equal(15);
        source.should.equal('pluto');

        firstStopUnaltered.should.equal('#FEFFA8');
        firstId.should.equal('01');

        secondStopAltered.should.equal('#FFFFFF');
        secondId.should.equal('02');

        thirdStopUnaltered.should.equal('#B16E00');
        thirdId.should.equal('03');

        done();
      });
  });

  it('non-carto sources are skipped during the carto tiles step', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          'aerials',
        ],
      })
      .end((err, res) => {
        const { errors } = res.body;

        expect(errors).to.equal(undefined);

        if (errors) {
          console.log(errors[0]); // eslint-disable-line
        }

        done();
      });
  });

  it('appends layergroup metadata to layers', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': ['zoning-districts'],
      })
      .end((err, res) => {
        const { included, errors } = res.body;

        expect(errors).to.equal(undefined);

        const zdLayers = included
          .filter(({ type }) => type === 'layers')
          .filter(({ attributes: { style } }) => (style.metadata && style.metadata['nycplanninglabs:layergroupid'] === 'zoning-districts'));

        expect(zdLayers.length).to.equal(3);

        done();
      });
  });

  it('sets visibility of child layers to match layerGroup visible property', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          {
            id: 'zoning-districts',
            visible: 'false',
          },
        ],
      })
      .end((err, res) => {
        const { included, errors } = res.body;
        const zdLayers = included
          .filter(({ type }) => type === 'layers');

        expect(errors).to.equal(undefined);
        expect(zdLayers[0].attributes.style.layout.visibility).to.equal('none');
        expect(zdLayers[1].attributes.style.layout.visibility).to.equal('none');
        expect(zdLayers[2].attributes.style.layout.visibility).to.equal('none');

        done();
      });
  });

  it('returns a 200 response with json; returns all by default', (done) => {
    chai.request(server)
      .get('/v1/layer-groups')
      .set('content-type', 'application/json')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');

        done();
      });
  });

  it('accepts query params for specific layer groups', (done) => {
    chai.request(server)
      .get('/v1/layer-groups?ids[]=tax-lots&ids[]=zoning-districts')
      .set('content-type', 'application/json')
      .end((err, res) => {
        const { data } = res.body;
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');

        data.length.should.equal(2);

        done();
      });
  });

  it('delegate explicitly-set "visible" state to related layers', (done) => {
    chai.request(server)
      .post('/v1/layer-groups')
      .set('content-type', 'application/json')
      .send({
        'layer-groups': [
          { id: 'zoning-districts', visible: false },
        ],
      })
      .end((err, res) => {
        const { data, included } = res.body;

        const zoningDistricts = data.find(d => d.id === 'zoning-districts');

        should.exist(zoningDistricts);
        should.exist(included[0].attributes.style.layout);

        done();
      });
  });
});

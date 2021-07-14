const fetch = require('node-fetch');

const ENV = process.env;

// 'dcpadmin' is the staging carto account
// 'planninglabs' is the production carto account
const cartoUsername = ENV.CARTO_USERNAME || 'planninglabs';
const cartoDomain = `${cartoUsername}.carto.com`;


const carto = {
  cartoDomain,

  getVectorTileTemplate(sourceConfig) {
    const layers = sourceConfig['source-layers'].map((sourceLayer) => {
      const { id, sql, dataPipeline } = sourceLayer;

      return {
        id,
        type: 'mapnik',
        dataPipeline,
        options: {
          sql,
        },
      };
    });

    // const layersNotInPipeline = layers.filter(layer => !layer.dataPipeline);
    const layersInPipeline = layers.filter(layer => layer.dataPipeline);
    // these layers are also in staging (dcpadmin)

    const params = {
      version: '1.3.0',
      layers: cartoUsername === 'planninglabs' ? layers : layersInPipeline,
    };

    // if buffersize is defined in the source json, add it to the carto params
    if (sourceConfig.buffersize) params.buffersize = sourceConfig.buffersize;

    return fetch(`https://${cartoDomain}/api/v1/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .catch(response => response.json().then((resolved) => {
        throw new Error(resolved.errors);
      }));
  },
};

module.exports = carto;

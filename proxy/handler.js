'use strict';

const request = require('request');

module.exports.corsProxy = (event, context, callback) => {
  const params = event.queryStringParameters;
  if (!params.url) {
    return callback(null, {
      statusCode: 400,
      body: 'Unable get url from "url" query parameter',
    });
  }

  return new Promise((resolve, reject) => {
    const originalRequestBody = event.body;
    request(
      {
        timeout: 10000,
        method: event.httpMethod,
        json:
          event.httpMethod == 'POST' ? JSON.parse(originalRequestBody) : null,
        url: params.url,
      },
      (err, originalResponse, body) => {
        if (err) {
          callback(err);
          return reject(err);
        }

        const proxyBody = originalRequestBody
          ? JSON.stringify(body)
          : originalResponse.body;
        const proxyResponse = {
          statusCode: originalResponse.statusCode,
          headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'content-type': originalResponse.headers['content-type'],
          },
          body: proxyBody,
        };

        callback(null, proxyResponse);
        resolve(proxyResponse);
      },
    );
  });
};

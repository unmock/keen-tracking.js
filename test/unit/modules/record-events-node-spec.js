// import nock from 'nock';
import unmock from 'unmock-node';

import KeenTracking from '../../..';
import config from '../helpers/client-config';

// Keen.debug = true;
// https://api.keen.io/3.0/projects/bad91832483312092/events",
describe('.recordEvent(s) methods (server)', () => {
  let client;
  const requestKey = config.writeKey;
  const dummyResponse = { result: 123 };
  const dummyErrorResponse = { error: true };
  const dummyQueryData = config.properties;
  const dummyInvalidQueryData = { a: 1234 };
  const dummyCollection = config.collection;

  const batchData = {
        'pageview': [
          { page: 'this one' },
          { page: 'same!' }
        ],
        'click': [
          { page: 'tada!' },
          { page: 'same again' }
        ]
  };
  const batchResponse = {
        click: [
          { 'success': true }
        ],
        pageview: [
          { 'success': true },
          { 'success': true }
        ]
  };

  beforeAll(() => {
    unmock.on();
    // /*
    // {
    //   "method": "POST",
    //   "url": "https://api.keen.io/3.0/projects/bad91832483312092/events/mocha",
    //   "headers": {
    //     "authorization": "bad71ffe8407322ab70559afef29508799ed64b3f75a1ba9e26",
    //     "content-type": "application/json",
    //     "content-length": 36,
    //     "keen-sdk": "javascript-4.4.1"
    //   },
    //   "body": "{\"username\":\"keenio\",\"color\":\"blue\"}"
    // }
    // */
    // nock(/https:/, {
    //     reqheaders: {
    //       'authorization': requestKey,
    //       'content-type': 'application/json',
    //     }
    //   })
    //   .persist()
    //   .post(/./, JSON.stringify(dummyQueryData))
    //   .reply(200, dummyResponse);

    // nock(/http:/, {
    //     reqheaders: {
    //       'authorization': requestKey,
    //       'content-type': 'application/json',
    //   }
    //   })
    //   .persist()
    //   .post(url => { process.stdout.write("MIKE LOOK: "+url); return true; }, JSON.stringify(dummyQueryData))
    //   .reply(200, dummyResponse);

    // nock(/http:/, {
    //     reqheaders: {
    //       'authorization': requestKey,
    //       'content-type': 'application/json',
    //   }
    //   })
    //   .persist()
    //   .post(url => { process.stdout.write("MIKE LOOK: "+url); return true; }, JSON.stringify(dummyInvalidQueryData))
    //   .reply(200, dummyErrorResponse);

    //   /*
    //   {
    //   "method": "POST",
    //   "url": "https://api.keen.io/3.0/projects/bad91832483312092/events",
    //   "headers": {
    //     "authorization": "bad71ffe8407322ab70559afef29508799ed64b3f75a1ba9e26",
    //     "content-type": "application/json",
    //     "content-length": 100,
    //     "keen-sdk": "javascript-4.4.1"
    //   },
    //   "body": "{\"pageview\":[{\"page\":\"this one\"},{\"page\":\"same!\"}],\"click\":[{\"page\":\"tada!\"},{\"page\":\"same again\"}]}"
    // }
    //   */
    // // batch events
    // nock(/https:/, {
    //     reqheaders: {
    //       'authorization': requestKey,
    //       'content-type': 'application/json'
    //     }
    //   })
    //   .persist()
    //   .post(/./, JSON.stringify(batchData))
    //   .reply(200, batchResponse);
  });

  beforeEach(() => {
    client = new KeenTracking({
      projectId: config.projectId,
      writeKey: requestKey,
      retry: { limit: 0 }
    });
  });

  describe('.recordEvent()', () => {

    it('should make an HTTP request',  async () => {
      await client.recordEvent(dummyCollection, dummyQueryData, (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(dummyResponse);
      });
    });

    it('should return a Promise', async () => {
      await client.recordEvent(dummyCollection, dummyQueryData)
        .then(res => {
          expect(res).toEqual(dummyResponse);
        });
    });

    it('should catch error of a Promise', async () => {
      await client
        .recordEvent(dummyCollection, dummyInvalidQueryData)
        .then((res)=>{})
        .catch(err => {
          expect(err).not.toBe(null);
        });
    });

    it('should default to HTTPS', () => {
      expect(client.config.protocol).toBe('https');
    });

    it('should respect client HTTP protocol', async () => {
      client.config.protocol = 'http';
      await client.recordEvent(dummyCollection, dummyQueryData, (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(dummyResponse);
        expect(client.config.protocol).toBe('http');
      });
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', async () => {
      KeenTracking.enabled = false;

      await client.recordEvent(dummyCollection, dummyQueryData, (err, res) => {
        expect(err).not.toBe(null);
        expect(res).toEqual(null);
        KeenTracking.enabled = true;
      });
    });

    it('should return an error message if event collection is omitted', async () => {
      await client.recordEvent(null, dummyQueryData, (err, res) => {
        expect(err).not.toBe(null);
        expect(res).toEqual(null);
      });
    });
  });

  describe('.recordEvents()', () => {

    it('should make an HTTP request', async () => {
      await client.recordEvents(batchData, (err, res) => {
        expect(err).toBe(null);
        expect(res).toEqual(batchResponse);
      });
    });

    it('should return a Promise', async () => {
      await client.recordEvents(batchData).then(res => {
        expect(res).toEqual(batchResponse);
      });
    });

    it('should not make an HTTP request if Keen.enabled is set to \'false\'', async () => {
      KeenTracking.enabled = false;
      await client.recordEvents(batchData, (err, res) => {
        expect(err).not.toBe(null);
        expect(res).toEqual(null);
        KeenTracking.enabled = true;
      });
    });

  });

});

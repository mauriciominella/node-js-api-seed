import countriesService from '../../../src/services/countries';

setTimeout(() => {
  describe('Countries Service', () => {
    const service = countriesService(container.cradle);

    describe.only('Add new country', async () => {
      beforeEach((done) => {
        clearMongo();
        restoreFiles();
        nock('http://download.geonames.org')
          .get('/export/dump/NL.zip')
          .replyWithFile(200, data.files.NL.tmp);
        done();
      });

      it('should add new country from code', async (done) => {
        try {
          const result = await service.add('NL');
          expect(result).to.have.property('errors');
          expect(result).to.have.property('totalLines');
          expect(result).to.have.property('nInserted');
          expect(result.errors).to.have.lengthOf(0);
          done();
        } catch (e) {
          done(e);
        }
      }).timeout(15000);

      it('should add new country from file', async (done) => {
        try {
          // const result = await service.addFromFile(`${__dirname}/../data/NL.zip`);
          const result = await service.addFromFile(data.files.NL.tmp);
          expect(result).to.have.property('errors');
          expect(result).to.have.property('totalLines');
          expect(result).to.have.property('nInserted');
          expect(result.errors).to.have.lengthOf(0);
          done();
        } catch (e) {
          done(e);
        }
      }).timeout(15000);
    });
  });

  run();
}, 1000);

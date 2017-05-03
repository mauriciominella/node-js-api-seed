import addNewCountryJob from '../../../../src/worker/jobs/addCountryFromCodeJob';

setTimeout(() => {
  describe.only('Worker', () => {
    const job = addNewCountryJob(container.cradle);

    describe('addCountryFromCode', () => {
      beforeEach((done) => {
        clearMongo();
        restoreFiles();
        nock('http://download.geonames.org')
          .get('/export/dump/NL.zip')
          // .replyWithFile(200, `${__dirname}/../../data/NL.zip`);
          .replyWithFile(200, data.files.NL.tmp);
        done();
      });

      it('should add new country from code with no errors', async (done) => {
        const inputMessage = { source: 'code', data: 'NL' };
        try {
          const actual = await job.addCountryFromCode(inputMessage);
          expect(actual.result).to.have.property('errors');
          expect(actual.result).to.have.property('totalLines');
          expect(actual.result).to.have.property('nInserted');
          expect(actual.result.errors).to.have.lengthOf(0);
          expect(actual).to.have.property('status', 'executed');
          done();
        } catch (err) {
          done(new Error(err.message));
        }
      }).timeout(6000);
    });
  });

  run();
}, 1000);

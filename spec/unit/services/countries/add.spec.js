import { BadRequestError } from 'meaning-error';
import { add } from '../../../../src/services/countries';

describe('Countries Service', () => {
  describe('add', () => {
    it('should throw an error when country code is not passed', () => {
      return assert.isRejected(add({}, undefined), BadRequestError, /input data/);
    });
    it('should return the result from file processing', async () => {
      const getFileAndProcess = td.function();
      td.when(getFileAndProcess(), { ignoreExtraArgs: true }).thenResolve({ parsedLines: [] });

      const processRawLine = td.function();
      const addBatch = td.function();
      td.when(addBatch(), { ignoreExtraArgs: true }).thenResolve({ nInserted: 1, getWriteErrors: () => [] });
      const fakeCitiesService = () => {
        return { processRawLine, addBatch };
      };

      const fakeCountriesRepository = () => {
        return { getFileAndProcess };
      };

      const dependencies = {
        countriesRepository: fakeCountriesRepository(),
        citiesService: fakeCitiesService(),
        logger: fakeLogger(),
      };

      const expected = { nInserted: 1, errors: [], totalLines: 0 };
      const actual = await add(dependencies, 'NL');
      assert.deepEqual(actual, expected);
    });
    it('should throw an error when getFileAndProcess fails', (done) => {
      const getFileAndProcess = td.function();
      td.when(getFileAndProcess(), { ignoreExtraArgs: true }).thenThrow(new Error(''));

      const processRawLine = td.function();
      const fakeCitiesService = () => {
        return { processRawLine };
      };

      const fakeCountriesRepository = () => {
        return { getFileAndProcess };
      };

      const dependencies = {
        countriesRepository: fakeCountriesRepository(),
        citiesService: fakeCitiesService(),
      };

      add(dependencies, 'NL').then(() => {
        done();
      }).catch((err) => {
        expect(err).to.be.an.instanceof(BadRequestError);
        expect(err.message).to.have.string('error when processing country');
        done();
      });
    });
  });
});

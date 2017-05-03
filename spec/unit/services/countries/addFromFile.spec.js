import { BadRequestError } from 'meaning-error';
import { addFromFile } from '../../../../src/services/countries';

describe('Countries Service', () => {
  describe('addFromFile', () => {
    it('should throw an error when file path is not passed', () => {
      return assert.isRejected(addFromFile({}, undefined), BadRequestError, /input data/);
    });
    it('should return the result from file processing', async () => {
      const unzipAndProcessFile = td.function();
      td.when(unzipAndProcessFile(), { ignoreExtraArgs: true }).thenResolve({ parsedLines: [] });

      const processRawLine = td.function();
      const addBatch = td.function();
      td.when(addBatch(), { ignoreExtraArgs: true }).thenResolve({ nInserted: 1, getWriteErrors: () => [] });
      const fakeCitiesService = () => {
        return { processRawLine, addBatch };
      };

      const fakeCountriesRepository = () => {
        return { unzipAndProcessFile };
      };

      const dependencies = {
        countriesRepository: fakeCountriesRepository(),
        citiesService: fakeCitiesService(),
      };

      const expected = { nInserted: 1, errors: [], totalLines: 0 };
      const actual = await addFromFile(dependencies, './data/NL.zip');
      assert.deepEqual(actual, expected);
    });
    it('should throw an error when unzipAndProcessFile fails', (done) => {
      const unzipAndProcessFile = td.function();
      td.when(unzipAndProcessFile(), { ignoreExtraArgs: true }).thenThrow(new Error(''));

      const processRawLine = td.function();
      const fakeCitiesService = () => {
        return { processRawLine };
      };

      const fakeCountriesRepository = () => {
        return { unzipAndProcessFile };
      };

      const dependencies = {
        countriesRepository: fakeCountriesRepository(),
        citiesService: fakeCitiesService(),
      };

      addFromFile(dependencies, './data/NL.zip').then(() => {
        done();
      }).catch((err) => {
        expect(err).to.be.an.instanceof(BadRequestError);
        expect(err.message).to.have.string('error when processing country');
        done();
      });
    });
  });
});

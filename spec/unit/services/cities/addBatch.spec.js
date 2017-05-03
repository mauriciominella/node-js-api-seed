import { InternalServerError } from 'meaning-error';
import { addBatch } from '../../../../src/services/cities';

describe('Cities Service', () => {
  describe('addBatch', () => {
    it('should return batch execution result', async () => {
      const expected = { linesWithError: [], insertedIds: [123456] };

      const batchExecute = td.function();
      td.when(batchExecute(), { ignoreExtraArgs: true }).thenResolve(expected);

      const fakeBatch = () => {
        return {
          add: td.function(),
          execute: batchExecute,
        };
      };

      const fakeCitiesRepository = () => {
        return {
          buildAddBatch: fakeBatch,
        };
      };

      const dependencies = { logger: {}, citiesRepository: fakeCitiesRepository() };

      const actual = await addBatch(dependencies, data.parsedFile);
      assert.deepEqual(actual, expected);
    });
    it('should throw an InternalServerError when batch execution fails', async (done) => {
      const batchExecute = td.function();
      td.when(batchExecute(), { ignoreExtraArgs: true }).thenThrow(new InternalServerError());

      const fakeBatch = () => {
        return {
          add: td.function(),
          execute: batchExecute,
        };
      };

      const fakeCitiesRepository = () => {
        return {
          buildAddBatch: fakeBatch,
        };
      };

      const dependencies = { logger: fakeLogger(), citiesRepository: fakeCitiesRepository() };

      try {
        await addBatch(dependencies, data.parsedFile);
        done('expected to return an InternalServerError');
      } catch (err) {
        expect(err).to.be.an.instanceof(InternalServerError);
        done();
      }
    });
  });
});

import { InternalServerError } from 'meaning-error';
import { addCountryFromCode } from '../../../../src/worker/jobs/addCountryFromCodeJob';

describe('Worker', () => {
  describe('addCountryFromCode', () => {
    it('should not execute when message source is file', async () => {
      const inputMessage = { source: 'file' };

      const expected = { status: 'not_executed' };
      const actual = await addCountryFromCode({}, inputMessage);

      assert.deepEqual(actual, expected);
    });
    it('should execute when message source is code', async () => {
      const add = td.function();
      td.when(add(), { ignoreExtraArgs: true }).thenResolve('');
      const fakeCountriesService = () => {
        return { add };
      };

      const inputMessage = { source: 'code' };

      const expected = { status: 'executed', result: '' };
      const actual = await addCountryFromCode({ countriesService: fakeCountriesService() }, inputMessage);

      assert.deepEqual(actual, expected);
    });
    it('should throw an error when add fails', async () => {
      const add = td.function();
      td.when(add(), { ignoreExtraArgs: true }).thenThrow(new InternalServerError('error'));
      const fakeCountriesService = () => {
        return { add };
      };

      const inputMessage = { source: 'code' };
      return assert.isRejected(addCountryFromCode({ countriesService: fakeCountriesService() }, inputMessage), InternalServerError, 'error');
    });
  });
});

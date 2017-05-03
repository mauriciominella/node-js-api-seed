import { BadRequestError } from 'meaning-error';
import { addAsync } from '../../../../src/services/countries';

describe('Countries Service', () => {
  describe('addSync', () => {
    it('should return the messageKey', async () => {
      const send = td.function();
      td.when(send(), { ignoreExtraArgs: true }).thenResolve('abcdfg123');

      const fakeQueueRepository = () => {
        return { send };
      };

      const expected = { messageKey: 'abcdfg123' };
      const actual = await addAsync({ queueRepository: fakeQueueRepository() }, 'NL');
      assert.deepEqual(actual, expected);
    });
    it('should throw an error when country code is not passed', (done) => {
      addAsync({}, undefined).then(() => {
        done(new Error());
      }).catch((err) => {
        expect(err).to.be.an.instanceof(BadRequestError);
        expect(err.message).to.have.string('Invalid value');
        done();
      });
    });
    it('should throw an error when send to queue fails', async (done) => {
      const send = td.function();
      td.when(send(), { ignoreExtraArgs: true }).thenThrow(new Error());

      const fakeQueueRepository = () => {
        return { send };
      };

      addAsync({ queueRepository: fakeQueueRepository() }, 'NL').then(() => {
        done(new Error());
      }).catch((err) => {
        expect(err).to.be.an.instanceof(BadRequestError);
        expect(err.message).to.have.string('error when adding async country');
        done();
      });
    });
  });
});

import { convertRawLineToJson } from '../../../../src/services/cities';

describe('Cities Service', () => {
  describe('convertRawLine', () => {
    const rawLine = '878519	Guruve	Guruve	Guruve,Guruwe	-16.65753	30.70301	P	PPL	ZW		03				0		1163	Africa/Harare	2012-01-17';
    const expected = { _id: 878519, alternate_names: ['guruve', 'guruwe'], coordinates: [-16.65753, 30.70301], name: 'Guruve', population: 0 };
    it('should convert raw line to Json', () => {
      const dependencies = { logger: fakeLogger() };
      const actual = convertRawLineToJson(dependencies, rawLine);
      assert.deepEqual(actual, expected);
    });
    it('should throw an exception when input line is empty', () => {
      const testedFunction = convertRawLineToJson.bind('');
      expect(testedFunction).to.throw(Error);
    });
  });
});

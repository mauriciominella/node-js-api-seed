import chai from 'chai';
import td from 'testdouble';
import chaiAsPromised from 'chai-as-promised';
import data from './data';

chai.use(chaiAsPromised);

const fakeLogger = () => {
  return {
    error: () => {},
    info: () => {},
    debug: () => {},
    trace: () => {},
    warn: () => {},
    log: () => {},
  };
};

global.expect = chai.expect;
global.assert = chai.assert;
global.td = td;
global.data = data;
global.fakeLogger = fakeLogger;

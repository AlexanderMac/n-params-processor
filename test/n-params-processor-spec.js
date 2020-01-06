const sinon = require('sinon');
const nassert = require('n-assert');
const paramsProc = require('../');
const BaseParser = require('../src/parsers/base-parser');

describe('registerCustomErrorType', () => {
  beforeEach(() => {
    sinon.stub(BaseParser, 'registerCustomErrorType');
  });

  afterEach(() => {
    BaseParser.registerCustomErrorType.restore();
  });

  it('should call BaseParser.registerCustomErrorType method and pass ErrorType', () => {
    let customErrorType = 'CustomErrorType';
    paramsProc.registerCustomErrorType(customErrorType);

    nassert.assertFn({ inst: BaseParser, fnName: 'registerCustomErrorType', expectedArgs: customErrorType });
  });
});

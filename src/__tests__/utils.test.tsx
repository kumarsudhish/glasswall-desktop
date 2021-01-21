import { shallow } from 'enzyme';
import React from 'react';
const { ipcRenderer } = require('electron');
import * as Utils from '../ui/utils/utils'
import "@testing-library/jest-dom/extend-expect";

jest.mock(
  'electron',
  () => {
    const mElectron = { ipcRenderer: { on: jest.fn(), send: jest.fn() } };
    return mElectron;
  },
  { virtual: true },
);



describe('to get rebuild engine url', () => {
  it('should render', () => {
    let url = expect(Utils.getRebuildEngineUrl()).
      toBe("https://8oiyjy8w63.execute-api.us-west-2.amazonaws.com/Prod/api/rebuild/base64");
  });

});

describe('logs data should not be empty', () => {
  it('should render', () => {
    let data = expect(Utils.getRawLogs()).not.toBe('0');
  });
});

describe('to get rebuild analysis url', () => {
  it('should render', () => {
    let url = expect(Utils.getRebuildAnalysisUrl()).
      toBe("https://o7ymnow6vf.execute-api.us-west-2.amazonaws.com/Prod/api/Analyse/base64");
  });

});

describe('to get rebuild api key', () => {
  it('should render', () => {
    let key = expect(Utils.getRebuildApiKey()).not.
      toBe('null');
  });

});

describe('to get rebuild image', () => {
  it('should render', () => {
    let key = expect(Utils.getRebuildImage()).
      toBe("glasswallsolutions/evaluationsdk");
  });

});

describe('to get rebuild image tag', () => {
  it('should render', () => {
    let key = expect(Utils.getRebuildImageTag()).
      toBe("rebuild");
  });

});

describe('to get logs', () => {
  it('should render', () => {
    let logs = expect(Utils.getLogs()).not.toBe('null') ;
  });

});

describe('to get log time', () => {
  it('should render', () => {
    let logTime = expect(Utils.getLogTime()).not.toBe('null') ;
  });

});

describe('to get log path', () => {
  it('should render', () => {
    let logPath = expect(Utils.getLogsPath()).not.
      toBe('null') ;
  });

});

describe('to get guid', () => {
  it('should render', () => {
    let id = expect(Utils.guid()).not.toBe('null') ;
  });

});

describe('to get word wrap', () => {
  it('should render', () => {
    let wrap = expect(Utils.wordwrap("test is running", 4, "is", true)).
      toBe("tesist isis runisning") ;
  });

});

describe('to get file hash', () => {
  it('should render', () => {
    let hash = expect(Utils.getFileHash("test is running")).not.toBe("null") ;
  });

});

describe('to get path seperation', () => {
  it('should render', () => {
    let path = expect(Utils.getPathSep()).toBe("/") ;
  });

});

describe('to get report path', () => {
  it('should render', () => {
    let path = expect(Utils.getReportPath()).not.
      toBe('null') ;
  });

});

describe('to get clean path', () => {
  it('should render', () => {
    let path = expect(Utils.getCleanPath()).not.
      toBe('null') ;
  });

});

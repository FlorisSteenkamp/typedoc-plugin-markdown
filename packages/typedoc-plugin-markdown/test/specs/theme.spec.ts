import * as fs from 'fs';
import { TestApp } from '../test-app';

describe(`Theme:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['theme.ts']);
  });

  describe(`(getUrls)`, () => {
    test(`should getUrls'`, () => {
      testApp.bootstrap();
      const urlMappings = testApp.theme.getUrls(testApp.project);
      expect(TestApp.getExpectedUrls(urlMappings)).toMatchSnapshot();
    });

    test(`should getUrls with 'allReflectionsHaveOwnDocument' set`, () => {
      testApp.bootstrap({ allReflectionsHaveOwnDocument: true });
      const urlMappings = testApp.theme.getUrls(testApp.project);
      expect(TestApp.getExpectedUrls(urlMappings)).toMatchSnapshot();
    });

    test(`should getUrls with readme 'none'`, () => {
      testApp.bootstrap({ readme: 'none' });
      const urlMappings = testApp.theme.getUrls(testApp.project);
      expect(TestApp.getExpectedUrls(urlMappings)).toMatchSnapshot();
    });
  });

  describe(`(isOutputDirectory)`, () => {
    let directoryListingSpy: jest.SpyInstance;

    beforeAll(() => {
      testApp.bootstrap();
      directoryListingSpy = jest.spyOn(fs, 'readdirSync');
    });

    afterAll(() => {
      directoryListingSpy.mockRestore();
    });

    test(`should test output directory true with all allowed files and directories`, () => {
      directoryListingSpy.mockReturnValue([
        '.DS_Store',
        'README.md',
        'globals.md',
        'classes',
        'enums',
        'interfaces',
        'media',
        'modules',
      ]);
      expect(testApp.theme.isOutputDirectory('/path')).toBeTruthy();
    });

    test(`should test output directory true with some files directories`, () => {
      directoryListingSpy.mockReturnValue([
        'README.md',
        'classes',
        'media',
        'modules',
      ]);
      expect(testApp.theme.isOutputDirectory('/path')).toBeTruthy();
    });

    test(`should test output directory true with just index`, () => {
      directoryListingSpy.mockReturnValue(['README.md']);
      expect(testApp.theme.isOutputDirectory('/path')).toBeTruthy();
    });

    test(`should test output directory false with unkown index`, () => {
      directoryListingSpy.mockReturnValue([
        'Unrecognised.md',
        'classes',
        'enums',
        'interfaces',
        'media',
        'modules',
      ]);
      expect(testApp.theme.isOutputDirectory('/path')).toBeFalsy();
    });

    test(`should test output directory false with hidden files`, () => {
      directoryListingSpy.mockReturnValue([
        '.git',
        'classes',
        'enums',
        'interfaces',
        'media',
        'modules',
      ]);
      expect(testApp.theme.isOutputDirectory('/path')).toBeFalsy();
    });

    test(`should test output directory false with unknown folder`, () => {
      directoryListingSpy.mockReturnValue(['README.md', 'folder']);
      expect(testApp.theme.isOutputDirectory('/path')).toBeFalsy();
    });
  });

  describe(`(directory mappings)`, () => {
    test(`should set default mappings'`, () => {
      testApp.bootstrap();
      expect(
        testApp.theme.mappings.map((mapping) => mapping.directory),
      ).toEqual(['classes', 'interfaces', 'enums', 'modules']);
    });

    test(`should set mappings with 'allReflectionsHaveOwnDocument'`, () => {
      testApp.bootstrap({ allReflectionsHaveOwnDocument: true });
      expect(
        testApp.theme.mappings.map((mapping) => mapping.directory),
      ).toEqual([
        'classes',
        'interfaces',
        'enums',
        'modules',
        'variables',
        'types',
        'functions',
        'literals',
      ]);
    });
  });
});

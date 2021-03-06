import * as Handlebars from 'handlebars';
import { TestApp } from '../test-app';

describe(`Index:`, () => {
  let testApp: TestApp;
  let indexTemplate: Handlebars.TemplateDelegate;

  beforeAll(() => {
    testApp = new TestApp(['reflections.ts']);
    testApp.bootstrap();
    indexTemplate = TestApp.getTemplate('index');
    TestApp.stubHelpers(['breadcrumbs']);
  });

  test(`should compile readme`, () => {
    expect(
      TestApp.compileTemplate(indexTemplate, {
        model: testApp.project,
        project: testApp.project,
      }),
    ).toMatchSnapshot();
  });
});

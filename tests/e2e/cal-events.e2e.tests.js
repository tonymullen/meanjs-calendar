'use strict';

// this test will be called with
// gulp test:e2e

describe('Calendar E2E Tests:', function () {
  describe('Test calendar page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/calendar');
      expect(element.all(by.repeater('event in events')).count()).toEqual(0);
    });
  });
});

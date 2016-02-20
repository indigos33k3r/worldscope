var rfr = require('rfr');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Code = require('code');
var expect = Code.expect;
var Promise = require('bluebird');

var Utility = rfr('app/util/Utility');
var logger = Utility.createLogger(__filename);

var Storage = rfr('app/models/Storage.js');
var TestUtils = rfr('test/TestUtils');

lab.experiment('View Model Tests', function() {

  var user1 = {
    username: 'Noob Nie',
    alias: 'the noobie',
    email: 'noob@gmail.com',
    password: 'secretpass',
    accessToken: 'atoken',
    platformType: 'facebook',
    platformId: 'asdfadf-asdfasdf-asdfasdfaf-dfddf',
    description: 'noob has a noobie description'
  };

  var user2 = {
    username: 'Miss Pro',
    alias: 'Pro in the wonderland',
    email: 'pro@prototype.com',
    password: 'generated',
    accessToken: 'anaccesstoken',
    platformType: 'facebook',
    platformId: '45454545454',
    description: 'pro is too cool for description'
  };

  var stream1 = {
    title: 'stream from view test',
    description: 'hello',
    appInstance: '123-123'
  };

  var stream2 = {
    title: 'second stream from view test',
    description: 'hello hello',
    appInstance: '34234-3434'
  };

  lab.beforeEach({timeout: 10000}, function(done) {
    TestUtils.resetDatabase(done);
  });

  lab.test('Create Subscription valid', function(done) {
    var user1Promise = Storage.createUser(user1);
    var user2Promise = Storage.createUser(user2);

    Promise.join(user1Promise, user2Promise,
      function(user1, user2) {
        Storage.createSubscription(user1.userId, user2.userId)
          .then(function(res) {
            console.log(res);
            expect(res.subscriber).to.equal(user1.userId);
            expect(res.subscribeTo).to.equal(user2.userId);
            done();
        });
      });
  });

  lab.test('Create Subscription invalid repeated', function(done) {
    var user1Promise = Storage.createUser(user1);
    var user2Promise = Storage.createUser(user2);

    Promise.join(user1Promise, user2Promise,
      function(user1, user2) {
        Storage.createSubscription(user1.userId, user2.userId)
          .then((subscription) =>
            Storage.createSubscription(subscription.subscriber,
                                       subscription.subscribeTo))
          .then(function(res) {
            expect(res).to.be.null();
            done();
        });
      });
  });


});

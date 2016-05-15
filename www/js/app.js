var db = null;
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services','monospaced.qrcode','ionMDRipple', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite, $rootScope,dbFactory,$location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB({name:"my.db",location:'default'});
    //$cordovaSQLite.execute(db, "DROP TABLE IF EXISTS phlink");

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS phlink(id integer primary key asc, phlinkId text unique, email text, balance real)");


    getUser();

    function getUser(){
      dbFactory.getUser().then(function(user){
        $rootScope.phlink_user = user;

        console.log($rootScope.phlink_user);
        if(!$rootScope.phlink_user){
          $location.path('app/login');
        }else{
          $location.path('app/home');
        }
      },function(err){
        console.log(err);
      }); 
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }

  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }

  })


  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('app.generatedQr', {
      url: '/generatedQr',
      views: {
        'menuContent': {
          templateUrl: 'templates/qrcode.html',
          controller: 'getQrCtrl'
        }
      }
    })

  .state('app.reload', {
    url: '/reload',
    views: {
      'menuContent': {
        templateUrl: 'templates/reload.html',
          controller: 'reloadCtrl'
      }
    }
  })

  .state('app.destination', {
    url: '/destination',
    views: {
      'menuContent': {
        templateUrl: 'templates/destination.html',
          controller: 'destinationCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/login');
}).service('apiService', function($rootScope, $http) {

  var m = 'apiService';
  var api_base_url = '/'
  this.signupUser  = function(email,password,cb){
    this.apiReq(false,'post', 'http://172.30.0.42:3000/user',{email:email,password:password}, cb);
  };

  this.reload  = function(id,amount,cb){
    var http = 'http://172.30.0.42:3000/users/'+id + '/transactions/' + this.generateUUID() + '?type=topup&key=ign0q-RD2N9-g7TUc-LR6pI';
    console.log(http);
    this.apiReq(false,'put', http,{amount:amount}, cb);
  };


  this.login  = function(username,password,cb){
    var http = 'http://172.30.0.42:3000/user/auth';
    console.log(http);
    this.apiReq(false,'post', http,{email:username,password:password}, cb);
  };

  this.getUser  = function(token,cb){
    var http = 'http://172.30.0.42:3000/user?token=' + token;
    console.log(http);
    this.apiReq(false,'get', http, cb);
  };

  this.generateUUID = function(){
    var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
  };

  this.apiReq = function(local,method, path, data, cb){
    if(typeof data === 'function'){cb = data; data = {}};
    if(local){var req_url = api_base_url + path;}
    else {var req_url = path;}

    var req;
    if(method.toLowerCase() == 'get') req = $http.get(req_url, data);
    if(method.toLowerCase() == 'post') req = $http.post(req_url, data);
    if(method.toLowerCase() == 'put') req = $http.put(req_url, data);
    if(method.toLowerCase() == 'delete') req = $http.delete(req_url, data);
    if(method.toLowerCase() == 'patch') req = $http.patch(req_url, data);

    req.success(function(data){
      cb(null, data);
    }).error(function(err){
      console.log(err, 'this is an error');
      console.log(err);
      if(!err){
        err = "This is an error"
      };
      cb(err,null);
    });
  };
});





angular.module('starter.services', []).factory('dbFactory', function($cordovaSQLite) {

  // factory returns an object
  // you can run some code before
   var user;
  return {
    sayHello : function(name) {
      return "Hi " + name + "!";
    },
    getUser : function() {
      return $cordovaSQLite.execute(db, "SELECT * FROM phlink")
        .then(function(res){ 
          user = res.rows.item(0);
          return Promise.resolve(user);
      })

    },
    deleteUser : function(phlinkId) {
      return $cordovaSQLite.execute(db, "DELETE FROM phlink WHERE phlinkId=?",[phlinkId])
        .then(function(res){ 
          return Promise.resolve(res);
      })

    },
    updateBalance : function(balance,phlinkId) {
      return $cordovaSQLite.execute(db, "UPDATE phlink set balance=? where phlinkId=?",[balance,phlinkId])
        .then(function(res){ 
          return Promise.resolve(res);
      })

    },
    saveUser : function(phlinkId,email,balance) {
      return $cordovaSQLite.execute(db, "INSERT INTO phlink (phlinkId, email, balance) VALUES (?,?,?)",[phlinkId,email,balance])
        .then(function(res){
          return Promise.resolve(res);
        }); 
    }
  }
});
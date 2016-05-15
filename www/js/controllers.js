angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope,$window, $ionicModal, $location,$ionicPlatform,$rootScope,dbFactory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $rootScope.token = null;  
  
  $rootScope.doSignout = function() {
    dbFactory.deleteUser($rootScope.phlink_user.phlinkId).then(function(res){
      console.log('Deleted');
      getUser();
    },function(err){
      console.log(err);
    });
  }

  function getUser(){
    $ionicPlatform.ready(function() { 
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
    })  
  }

  $scope.back = function(){
    $window.history.back();
  }
})


.controller('reloadCtrl', function($scope,$rootScope,dbFactory,$ionicPlatform,$location,$window,apiService) {
  $scope.doReload = function(amount){
    apiService.reload($rootScope.phlink_user.phlinkId,amount,function(err, data){
      if(err){
        console.log(err);
      }else {
        console.log(data);
        //  console.log('Doing signup', $scope.signupData);
        dbFactory.updateBalance(data.balance,$rootScope.phlink_user.phlinkId).then(function(res){
          getUser();
        },function(err){
          console.log(err);
        });

      };
    });
  
  }

  function getUser(){
    $ionicPlatform.ready(function() { 
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
    })  
  }

  $scope.back = function(){
    $window.history.back();
  }
})

.controller('homeCtrl', function($scope,$window, $ionicModal, $location,$ionicPlatform,$rootScope,dbFactory,apiService) {
  $scope.screenSize = screen.width;
  
  $rootScope.doSignout = function() {
    dbFactory.deleteUser($rootScope.phlink_user.phlinkId).then(function(res){
      console.log('Deleted');
      getUser();
    },function(err){
      console.log(err);
    });
  }

  function getUser(){
    $ionicPlatform.ready(function() { 
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
    })  
  }


  $scope.generateQr = function(){
    $location.path('/app/destination');
  }

  $scope.$on('$ionicView.enter', function(e) {
    apiService.getUser($rootScope.token,function(err, data){
          if(err){
            console.log(JSON.stringify(err));
          }else {
            console.log(JSON.stringify(data));

            dbFactory.updateBalance(data.balance,$rootScope.phlink_user.phlinkId).then(function(res){
              getUser();
            },function(err){
              console.log(err);
            });
          }; 
    });
  });
})

.controller('signupCtrl', function($scope,$http, $ionicModal,$rootScope,$ionicPlatform, $location,$rootScope,dbFactory,apiService) {
  $scope.signupData = {};

  // Perform the login action when the user submits the login form
  $scope.doSignUp = function() {

    apiService.signupUser($scope.signupData.username,$scope.signupData.password,function(err, data){
      if(err){
        console.log(err);
      }else {
        console.log(data);
        //  console.log('Doing signup', $scope.signupData);
        dbFactory.saveUser(data,$scope.signupData.username,0).then(function(res){
          getUser();
        },function(err){
          console.log(err);
        });

      };
    });
  
  
  };

  $scope.login = function(){
    $location.path('app/login');
  }

  function getUser(){
    $ionicPlatform.ready(function() { 
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
    })  
  }
})

.controller('loginCtrl', function($scope, $timeout,$ionicPlatform,$rootScope,$location,dbFactory,apiService) {
  // Form data for the login modal
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    apiService.login($scope.loginData.username,$scope.loginData.password,function(err, data){
      if(err){
        console.log(JSON.stringify(err));

      }else {
        console.log(data);
        //  console.log('Doing signup', $scope.signupData);
        $rootScope.token = data.token;
        apiService.getUser(data.token,function(err, data){
          if(err){
            console.log(err);
          }else {
            console.log(JSON.stringify(data));

            dbFactory.saveUser(data.id,data.email,data.balance).then(function(res){
              getUser();
            },function(err){
              console.log(err);
            });
          }; 
        });      
      };
    });
  
  };

  $scope.signup = function(){
    $location.path('app/signup');
  }

  function getUser(){
    $ionicPlatform.ready(function() { 
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
    })  
  }

})

.controller('destinationCtrl', function($scope,$rootScope,$window, $timeout,$location,dbFactory) {
  // Form data for the login modal
  $rootScope.destination = "";

  $scope.back = function(){
    $window.history.back();
  }
  $scope.setDestination = function(data){
    $rootScope.destination = data;
    $location.path('app/generatedQr');
  }
})

.controller('getQrCtrl', function($scope,$rootScope,$window) {
  $scope.screenSize = screen.width;

  $scope.back = function(){
    $window.history.back();
  }


  $scope.$on('$ionicView.enter', function(e) {
    function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    };
    $scope.qrData =  $rootScope.phlink_user.phlinkId + ':' + generateUUID() + ':' + $rootScope.destination;
    console.log($scope.qrData);

  });
});

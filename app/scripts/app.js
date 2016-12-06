'use strict';

/**
 * @ngdoc overview
 * @name vendorInquiryCustomFormApp
 * @description
 * # vendorInquiryCustomFormApp
 *
 * Main module of the application.
 */
angular
  .module('vendorInquiryCustomFormApp', [
    'ngRoute',
    'ngSanitize',
    'datatables',
    'ngLoadingOverlay'

  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

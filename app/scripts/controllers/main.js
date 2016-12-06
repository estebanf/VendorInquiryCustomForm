'use strict';

/**
 * @ngdoc function
 * @name vendorInquiryCustomFormApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vendorInquiryCustomFormApp
 */
angular.module('vendorInquiryCustomFormApp')
  .controller('MainCtrl',['$scope','everteam','$loadingOverlay','$window','DTOptionsBuilder',function ($scope,everteam,$loadingOverlay,$window,DTOptionsBuilder) {
    $loadingOverlay.show('Loading task ...');
    $scope.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('bFilter', false)
      .withDOM('tr');
    $scope.data = {};
    $scope.newVendor = {};
    // $scope.vendors = [];
    $scope.vendors = [];
    $scope.editing = false;
    $scope.editIndex = 0;
    everteam.getTask()
      .then(function(data){
        // console.log(data);
        $scope.object = data['tms:getTaskResponse']['tms:task']['tms:input'];
        delete $scope.object.ExternalVendorInquiry.Vendors;
        console.log($scope.object);
        $scope.RequestId = $scope.object.ExternalVendorInquiry.Request.RequestId.$;
        $scope.CustomerId = $scope.object.ExternalVendorInquiry.Request.Information.CustomerId.$;
        $scope.EventDateTime = $scope.object.ExternalVendorInquiry.Request.Information.EventDateTime.$;
        $scope.EventDuration = $scope.object.ExternalVendorInquiry.Request.Information.EventDuration.$;
        $scope.EventType = $scope.object.ExternalVendorInquiry.Request.Information.EventType.$;
        $scope.Location = $scope.object.ExternalVendorInquiry.Request.Information.Location.$;
        $scope.RequestType = $scope.object.ExternalVendorInquiry.Request.Information.RequestType.$;
        $scope.Urgency = $scope.object.ExternalVendorInquiry.Request.Urgency.$;
        // console.log($scope.object);
        $loadingOverlay.hide();

      });
    $scope.addVendor = function() {
      if(!angular.equals($scope.newVendor,{}) &&
        $scope.newVendor.resource &&
        $scope.newVendor.vendor &&
        $scope.newVendor.cost &&
        isFinite($scope.newVendor.cost))
      {
        if($scope.editing){
            $scope.vendors[$scope.editIndex] = $scope.newVendor;
            $scope.editing = false;
            $scope.editIndex = 0;
        }else{
            $scope.vendors.push($scope.newVendor);
        }
        $scope.newVendor = {};
      }
    };
    $scope.editVendor = function(index){
      $scope.newVendor = angular.copy($scope.vendors[index]);
      $scope.editing = true;
      $scope.editIndex = index;
    };
    $scope.removeVendor = function(index){
      $scope.vendors.splice(index,1);
    };
    $scope.cancel = function(){
      $scope.editing = false;
      $scope.editIndex = 0;
      $scope.newVendor = {};
    };
    $scope.complete = function(){
      $loadingOverlay.show('Completing task ...');
      var vendors = $scope.vendors.map(function(item){
        return {
          Cost: {
            $: item.cost + '',
            '@xmlns':{
              $:'http://www.example.org/BTS'
            }
          },
          Resource: {
            $:item.resource,
            '@xmlns':{
              $:'http://www.example.org/BTS'
            }
          },
          Vendor: {
            $: item.vendor,
            '@xmlns':{
              $:'http://www.example.org/BTS'
            }
          }
        };
      });
      $scope.object.ExternalVendorInquiry['BTS1:Vendors'] = vendors;
      console.log($scope.object);
      everteam.completeTask($scope.object)
        .then(function(data){
          console.log(data);
          $loadingOverlay.hide();
          $window.location.assign('/everteam/workflow/script/empty.jsp');
        });
    };
  }]);

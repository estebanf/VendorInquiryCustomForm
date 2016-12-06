'use strict';

/**
 * @ngdoc service
 * @name approveCustomFormApp.everteam
 * @description
 * # everteam
 * Factory in the approveCustomFormApp.
 */
angular.module('vendorInquiryCustomFormApp')
  .factory('everteam', ['$http','$q','$window',function ($http,$q,$window) {
    var _tmsUrl = '/everteam/ode/processes/TaskManagementServices.TaskManagementServicesSOAP/';
    var _completeurl = '/everteam/ode/processes/completeTask';
    var search = $window.location.search.substring(1);
    var queries = search.split('&');
    var _params = {};
    angular.forEach(queries,function(value){
      var itemKey = value.split('=')[0];
      var itemValue = value.replace(itemKey + '=','');
      _params[itemKey] = decodeURIComponent(itemValue);
    });
    var basePayload = function(url) {
      return {
        method:'POST',
        headers: {
          'Content-Type':'application/json/badgerfish'
        },
        url: url,
        data:{ }
      };
    };
    var buildCompleteTask = function(data){
      var payload = basePayload(_completeurl);
      payload.data = {
        'ib4p:completeTaskRequest':{
          '@xmlns':{
            'ib4p':'http://www.intalio.com/bpms/workflow/ib4p_20051115'
          },
          'ib4p:taskMetaData':{
            'ib4p:taskId':{
              '$':_params.id
            }
          },
          'ib4p:participantToken':{
            '$':_params.token
          },
          'ib4p:user':{
            '$':_params.user
          },
          'ib4p:taskOutput':data
        }
      };
      return payload;
    };
    var buildGetTaskDetail = function(){
      var payload = basePayload(_tmsUrl);
      payload.data = {
        'tas:getTaskRequest':{
          '@xmlns':{
            'tas':'http://www.intalio.com/BPMS/Workflow/TaskManagementServices-20051109/'
          },
          'tas:taskId':{
            '$':_params.id
          },
          'tas:participantToken':{
            '$':_params.token
          }
        }
      };
      return payload;
    };
    var buildApi = function(api,data){
      var deferred = $q.defer();
      $http(api(data))
        .success(function(data){
          deferred.resolve(data);
        }).error(function(data){
          deferred.reject(data);
        });
      return deferred.promise;
    };
    return {
      getTask: function(){
        return buildApi(buildGetTaskDetail);
      },
      completeTask: function(data){
        return buildApi(buildCompleteTask,data);
      }
    };
  }]);

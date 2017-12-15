define([
  'angular',
  'coreUtil',
  'lodash',
  'taf-plugin-ui-feature-rdum-cctv'
], function (angular, coreUtil, _,tafRdumCctv) {
  'use strict';

  var basePath = coreUtil.getBasePath('taf-plugin-ui-feature-rdum-cctv');

  angular.module(tafRdumCctv)
    .component('cctvTimerShaft', {
      bindings: {
        startTime: '<',
        request: '<',

      },
      controller: cctvTimerShaftCtrl,
      transclude: true,
      replace: false,
      require: {
        CctvHistoricalRecordCtrl: '^cctvHistoricalRecord'
      },
      templateUrl: basePath + '/cctv-historical-record/cctv-timer-shaft.component.html'
    });

  /* @ngInject */
  function cctvTimerShaftCtrl($rootScope, $scope, $window) {
    var ctrl = this;
    ctrl.getStartTime = '';
    ctrl.allTimefiles = [];
    ctrl.allTimePeriods = [];
    ctrl.spanProp = [];
    /*-----------------*/
    var dragging = false;
    var offSetX;
    var origin;
    var viewWidth;
    var left;

    //父组件日期，获取历史文件改变子组件日期，历史文件也要同步
    ctrl.$onChanges = function(changes){
      if (changes.startTime) {
        ctrl.getStartTime = $window.angular.copy(ctrl.startTime) + ' ' + '00:00:00';
      }

      if (changes.request) {
        ctrl.allTimefiles = $window.angular.copy(ctrl.request);
        viewWidth = document.getElementsByClassName('cctv-video-container')[0].clientWidth;
        dataGroup(ctrl.allTimefiles, viewWidth);
      }
    }

    //时间段拼接
    function dataGroup(dateFile, viewWidth) {
      var originPoint = new Date(ctrl.getStartTime);
      _.forEach(dateFile, function (item) {
        var timePeriods = [];
        timePeriods.push(item.startTime);
        timePeriods.push(item.endTime);
        ctrl.allTimePeriods.push(timePeriods);
        var startPoint = new Date(item.startTime);
        var endPoint = new Date(item.endTime);
        var width = (endPoint.getTime() - startPoint.getTime()) / (24*60*60*1000*3);
        var left = (startPoint.getTime() - (originPoint.getTime() - 24*60*60*1000)) / (24*60*60*1000*3);
        var parentNode = document.querySelector('.cctv-time-shaft');
        var spanEle = document.createElement('span');
        spanEle.className = 'cctv-time-range';
        spanEle.style.width = width * viewWidth*3 + 'px';
        spanEle.style.left = left * viewWidth*3 + 'px';
        parentNode.appendChild(spanEle);
      })
    }

    //hover获取当前时间
    function getCurrentTime() {

    }

    //事件监听
    document.onmousemove = move;
    document.onmouseup = up;

    //鼠标按下
    ctrl.down = function(eve) {
      var event = eve || window.event;
      if (window.event) {
        event.cancelBubble = true;
      } else {
        event.stopPropagation();
      }
      dragging = true;
      offSetX = event.target.offsetLeft;
      console.log(offSetX);
      console.log(event)
      origin = event.pageX;
      console.log(origin)
    }

    function move(eve) {
      var event = eve || window.event;
      var dragElement = document.querySelector('.cctv-time-shaft');
      if (dragging) {
        if (origin > event.pageX) {console.log(event.pageX)
          left = offSetX + event.pageX - origin;
          if (left <= -2*viewWidth) {
            left = -2*viewWidth;
          }
        } else {
           left = offSetX + event.pageX - origin;
           if (left >= 0) {
            left = 0;
           }
        }
      }
      console.log(left)
      dragElement.style.left = left + 'px';
    }

    ctrl.leave = function (event) {
      up(event)
    }

    function up() {
      dragging = false;
    }
  }
});

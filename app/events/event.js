"use strict";

const average = (arr = []) => {
  const avg =
    arr.reduce((sum, a) => {
      sum += a.rating;
      return sum;
    }, 0) / arr.length;

  return Number(avg.toFixed(1));
};

angular
  .module("myApp.events", ["ngRoute"])

  .config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider.when("/EventRatings", {
        templateUrl: "events/event.list.html",
        controller: "EventListController",
      });
      $routeProvider.when("/EventRatings/new", {
        url: "/EventRatings/new",
        templateUrl: "events/event.create.html",
        controller: "EventCreateController",
      });

      $routeProvider.when("/EventRatings/:id", {
        templateUrl: "events/event.details.html",
        controller: "EventDetailsController",
      });
    },
  ])

  .controller("EventListController", [
    "$scope",
    "$location",
    "$http",
    function ($scope, $location, $http) {
      $scope.loading = true;

      $http.get("http://localhost:3030/events").then(({ data }) => {
        $scope.events = data.map((d) => {
          const averageRating = average(d.ratings);

          return {
            name: d.name,
            averageRating,
            _id: d.id,
          };
        });
      });

      $scope.selectEvent = function (id) {
        $location.path(`/EventRatings/${id}`);
      };

      $scope.createNew = function () {
        $location.path("/EventRatings/new");
      };

      $scope.calculateRatingQuality = function (rating) {
        if (rating < 2) {
          return "bad";
        } else if (rating <= 3.5) {
          return "ok";
        } else {
          return "good";
        }
      };
    },
  ])
  .controller("EventDetailsController", [
    "$scope",
    "$routeParams",
    "$http",
    function ($scope, $routeParams, $http) {
      $scope.getEvent = function (id) {
        $http.get(`http://localhost:3030/events/${id}`).then(({ data }) => {
          $scope.eventDetails = data;
          $scope.eventDetails.averageRating = average(data.ratings);
        });
      };

      $scope.getEvent($routeParams.id);
    },
  ])
  .controller("EventCreateController", [
    "$scope",
    "$http",
    "$location",
    function ($scope, $http, $location) {
      $scope.submit = function () {
        const data = $scope.event || $scope.item;
        $http.post("http://localhost:3030/events", data).then(({ data }) => {
          $location.path(`/EventRatings/${data.id}`);
        });
      };
    },
  ]);

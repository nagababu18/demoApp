var app = angular.module('demoApp', [])
app.controller('loginCtrl', function ($scope, $http) {
  $scope.showForm = true
  $scope.showList = false
  $scope.logInUser = ''
  $scope.regForm = {
    fName: '',
    lName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  $scope.logForm = {
    email: '',
    password: ''
  }

  // init function
  $scope.init = function () {
    if (localStorage.getItem('userName')) {
      $scope.getUsers()
      $scope.showForm = false
    }
  }

  $scope.logout = function () {
    localStorage.removeItem('userName')
    $scope.showForm = true
    $scope.showList = false
  }
  // user registration
  $scope.register = function () {
    if (this.regForm.email && this.regForm.email.indexOf('@' && '.') > -1) {
    }else {
      alert('Please Enter valid email')
      return
    }
    if (this.regForm.password === this.regForm.confirmPassword) {
      localStorage.setItem('userName', this.regForm.fName)
      $http({
        method: 'POST',
        url: '/register',
        data: this.regForm
      }).then(function (response) {
        console.log(response)
        if (response.status === 200) {
          $scope.showForm = false
          $scope.getUsers()
        }
      })
        .catch(function (response) {
          console.log(response)
        })
    }else {
      alert("Password doesn't match")
    }
  }

  // get Login
  $scope.login = function () {
    if (this.logForm.email && this.logForm.password) {
      $http({
        method: 'POST',
        url: '/login',
        data: this.logForm
      }).then(function (response) {
        console.log(response)
        if (response.data.length > 0) {
          $scope.showForm = false
          localStorage.setItem('userName', response.data[0].fName)
          $scope.getUsers()
        }else {
          alert('Please Enter valid Credentials')
        }
      })
        .catch(function (response) {
          alert('Please Enter valid Credentials')
          console.log(response)
        })
    }else {
      alert('Please Enter valid Credentials')
      return
    }
  }

  // get Users
  $scope.getUsers = function () {
    $http({
      method: 'GET',
      url: '/listUsers'
    }).then(function (response) {
      console.log(response)
      $scope.showList = true
      $scope.logInUser = localStorage.getItem('userName')
      $scope.users = response.data
    })
      .catch(function (response) {
        alert('Please Enter valid Credentials')
        console.log(response)
      })
  }
})

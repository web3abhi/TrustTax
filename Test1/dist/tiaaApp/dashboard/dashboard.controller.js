(function () {
    'use strict';

    angular.module('myApp').controller('DashboardController', ['$scope', '$http', '$timeout', '$q', '$rootScope', function ($scope, $http, $timeout, $q, $rootScope) {

        $scope.accounts = [];
        $scope.coinbase = {};
        $scope.expectMainAcc = [];
        $rootScope.title = "TAX Blockchain";

        $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $scope.data = [
          [65, -59, 80, 81, -56, 55, -40],
          [28, 48, -40, 19, 86, 27, 90]
        ];
        $scope.datasetOverride = [
            {
                label: "Balance",
                borderWidth: 1,
                type: 'bar'
            },
            {
                label: "Deduction",
                borderWidth: 1,
                type: 'bar'
            }
        ];

        function _getAccountBalance(accountAddr) {
            var deferred = $q.defer();

            setTimeout(function () {
                MetaCoin.getBalance(Number(accountAddr))
                    .then(function (value) {
                        deferred.resolve(value.valueOf());
                    }).catch(function (e) {
                        console.log(e);
                        deferred.reject('Address ' + accountAddr + ' is not allowed.');
                    })

            }, 0);

            return deferred.promise;
        }


        function _getAccountBalances() {
            web3.eth.getAccounts(function (err, accs) {
                if (err != null) {
                    alert('There was an error fetching your accounts.')
                    console.error(err);
                    return
                }

                if (accs.length === 0) {
                    alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    return;
                }

                console.log(":::::::::Accounts :::::::::::");
                console.log(accs);

                for (var i = 0; i < accs.length; i++) {
                    var accountsAndBalances = accs.map((account) => {
                        var accountName = "User" + i++;
                        return _getAccountBalance(account).then(function (balance) {
                            return {
                                account, balance, accountName
                            }
                        }, function (reason) {
                            alert('Failed: ' + reason);
                        }, function (update) {
                            alert('Got notification: ' + update);
                        });
                    });
                }

                var accountsclone = [];
                $q.all(accountsAndBalances).then((accountsAndBalances) => {
                    console.log("::::: accountsAndBalances ::::::");
                    console.log(accountsAndBalances);
                                        accountsAndBalances[0].accountName = "Initial Account";
accountsAndBalances[1].accountName = "Manufacturer";
accountsAndBalances[2].accountName = "Manufacturer";
accountsAndBalances[3].accountName = "Distributer";
accountsAndBalances[4].accountName = "Distributer";
accountsAndBalances[5].accountName = "Wholesaler";
accountsAndBalances[6].accountName = "Wholesaler";
accountsAndBalances[7].accountName = "Retailer";
accountsAndBalances[8].accountName = "Retailer";
accountsAndBalances[9].accountName = "TAX Account";
                    accountsclone = accountsAndBalances.slice();
                    accountsclone.shift();
                    //
                    $scope.accounts = accountsAndBalances;
                    $scope.coinbase = accountsAndBalances[0];
                    $scope.expectMainAcc = accountsclone;
                });
            });

            var titles = [];
            var balances = [];
            $scope.accounts.forEach(function (arrayItem) {
                console.log(arrayItem.balance);
                titles.push(arrayItem.accountName);
                balances.push(arrayItem.balance);
            });


            $scope.labels = titles;
            $scope.data = [balances, [-220, -100, -40, -19, -86, -27, -90, -9, -23, -77]];


            //            MetaCoin.Transfer({
            //                fromBlock: "latest"
            //            }).watch(function (error, result) {
            //                // This will catch all Transfer events, regardless of how they originated.
            //                console.log(result);
            //                if (error == null) {
            //                    console.log(result.args);
            //                }
            //            });

            console.log(MetaCoin.Transfer({
                fromBlock: "latest"
            }));
        }

        const refreshBalances = () => {
            _getAccountBalances()
        }

        refreshBalances()

        setInterval(() => {
            refreshBalances();
            return refreshBalances
        }, 10000);

                }]);
})();

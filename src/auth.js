import feathers from 'feathers';

export default function feathersAuth(app, provider, authStorage, $rootScope) {
    app.configure(feathers.authentication({
        storage: authStorage
    }));

    app.tokenAuth = function () {
        return provider.app.authenticate({
            type: 'token',
            'token': window.localStorage['feathers-jwt']
        }).then(function (result) {
            console.info('jwt authenticated at ', Date.now());
            $rootScope.user = result.data;
            return true;
        }).catch(function (error) {
            console.error('Error authenticating!', error);
            provider.app.logout();
            return false;
        });
    }

    app.localAuth = function (user, pass) {
        return provider.app.authenticate({
            type: 'local',
            'username': user,
            'password': pass
        }).then(function (result) {
            console.log('Authenticated!', result);
            $rootScope.user = result.data;
            $rootScope.authenticated = true;
            $rootScope.token = result['token'];
            return result;
        }).catch(function (error) {
            console.error('Error authenticating!', error);
            that.app.tokenLogout();
            return error;
        });
    };

    app.tokenLogout = function () {
        provider.app.logout();
        window.localStorage.removeItem('feathers-jwt');
        $rootScope.authenticated = false;
        $rootScope.user = null;
        $rootScope.token = null;
        console.log('Logged out.');
    };

    return app;
}
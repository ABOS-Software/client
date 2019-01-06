import {AUTH_CHECK, AUTH_ERROR, AUTH_GET_PERMISSIONS, AUTH_LOGIN, AUTH_LOGOUT,} from 'react-admin';
import decodeJwt from 'jwt-decode';

export const authClientConfig = {
    storageKey: 'token', // The key in localStorage used to store the authentication token
    authenticate: { // Options included in calls to Feathers client.authenticate
        strategy: 'local', // The authentication strategy Feathers should use
    },
    permissionsKey: 'permissions', // The key in localStorage used to store permissions from decoded JWT
    permissionsField: 'role', // The key in the decoded JWT containing the user's role
    passwordField: 'password', // The key used to provide the password to Feathers client.authenticate
    usernameField: 'username', // The key used to provide the username to Feathers client.authenticate
    redirectTo: '/login', // Redirect to this path if an AUTH_CHECK fails. Uses the react-admin default of '/login' if omitted.
};
export default (client, options = {}) => (type, params) => {
    const {
        storageKey,
        authenticate,
        permissionsKey,
        permissionsField,
        passwordField,
        usernameField,
        redirectTo,
    } = Object.assign({}, {
        storageKey: 'token',
        authenticate: {type: 'local'},
        permissionsKey: 'permissions',
        permissionsField: 'role',
        passwordField: 'password',
        usernameField: 'email',
    }, options);

    switch (type) {
        case AUTH_LOGIN:
            const {username, password} = params;
            return client.authenticate({
                ...authenticate,
                [usernameField]: username,
                [passwordField]: password,
            }).then(async response => {
                console.log('Authenticated!', response);
                const payload = await client.passport.verifyJWT(response.accessToken);
                console.log('Authenticated!', payload);

                let user = await client.service('user').get(payload.userId);
                client.set('user', user);
                localStorage.setItem('userName', user.username);
                localStorage.setItem('fullName', user.fullName);
                localStorage.setItem('enabledYear', user.enabledYear);

                console.log('User', client.get('user'));


                return response;
            });
        case AUTH_LOGOUT:
            localStorage.removeItem(permissionsKey);
            return client.logout();
        case AUTH_CHECK:
            return localStorage.getItem(storageKey) ? Promise.resolve() : Promise.reject({redirectTo});
        case AUTH_ERROR:
            const {code} = params;
            if (code === 401 || code === 403) {
                localStorage.removeItem(storageKey);
                localStorage.removeItem(permissionsKey);
                return Promise.reject();
            }
            return Promise.resolve();
        case AUTH_GET_PERMISSIONS:
            /*
            JWT token may be providen by oauth,
            so that's why the permissions are decoded here and not in AUTH_LOGIN.
            */
            // Get the permissions from localstorage if any.
            const localStoragePermissions = JSON.parse(localStorage.getItem(permissionsKey));
            // If any, provide them.
            if (localStoragePermissions && localStoragePermissions.length !== 0) {
                return Promise.resolve(localStoragePermissions);
            }
            // Or find them from the token, save them and provide them.
            try {
                const jwtToken = localStorage.getItem(storageKey);
                const decodedToken = decodeJwt(jwtToken);
                const jwtPermissions = decodedToken[permissionsField] ? decodedToken[permissionsField] : [];
                localStorage.setItem(permissionsKey, JSON.stringify(jwtPermissions));
                return Promise.resolve(jwtPermissions);
            } catch (e) {
                return Promise.reject();
            }

        default:
            return Promise.reject(`Unsupported FeathersJS authClient action type ${type}`);
    }
};
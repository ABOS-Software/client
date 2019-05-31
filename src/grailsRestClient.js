import {restClient} from 'ra-data-feathers';
import feathersClient from './feathersClient';
import {GET_ONE, UPDATE} from 'react-admin';
import {convertFileToBase64} from './Reports/Utils';

// A function decorating a dataProvider for handling user profiles
const handleUserProfile = dataProvider => (verb, resource, params) => {
  // I know I only GET or UPDATE the profile as there is only one for the current user
  // To showcase how I can do something completely different here, I'll store it in local storage
  // You can replace this with a customized fetch call to your own API route, too
  if (resource === 'profile') {
    if (verb === GET_ONE) {
      const storedProfile = localStorage.getItem('profile');

      if (storedProfile) {
        let data = JSON.parse(storedProfile);
        /* if (data.LogoLocation && data.LogoLocation.base64) {
          let fs = require("fs");
          let image = data.LogoLocation.base64;
          let bitmap = Buffer.from(image, 'base64');
          fs.writeFileSync(data.LogoLocation.src, bitmap);
        } */
        return Promise.resolve({
          data: data
        });
      }

      // No profile yet, return a default one
      // It's important that I send the same id as requested in params.
      // Indeed, react-admin will verify it and may throw an error if they are different
      // I don't have to do it when the profile exists as it will be included in the data stored in the local storage
      return Promise.resolve({
        data: {id: params.id,
          nickname: '',
          Scout_name: '',
          Scout_Phone: '',
          Scout_Rank: '',
          LogoLocation: {src: ''},
          streetAddress: '',
          zipCode: '',
          city: '',
          state: ''}
      });
    }

    if (verb === UPDATE) {
      if (params.data.LogoLocation) {
        convertFileToBase64(params.data.LogoLocation).then(b64 => {
          params.data.LogoLocation.base64 = b64;
          localStorage.setItem('profile', JSON.stringify(params.data));
          return Promise.resolve({data: params.data});
        }
        );
      } else {
        localStorage.setItem('profile', JSON.stringify(params.data));
        return Promise.resolve({data: params.data});
      }
    }
  }

  // Fallback to the dataProvider default handling for all other resources
  return dataProvider(verb, resource, params);
};
export default handleUserProfile(restClient(feathersClient, {}));

export const RECEIVED_MARKERS = 'RECEIVED_MARKERS';
export const UPDATE_POSITION = 'UPDATE_POSITION';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_REGION = 'UPDATE_REGION';
import axios from 'axios';
import Qs from 'qs';
import config from '../config.json';


export function getMarkers(position=false) {
  let url = `${config.base}/hb`;
  if (position) url = `${url}/${position.coords.latitude}/${position.coords.longitude}`;
  return dispatch => {
    axios.get(url)
    .then(json => {
      console.log('OK HEARTBEAT');
      const { hb } = json.data;
      let seen = [];
      let markers = [];
      //console.log(hb);
      hb.cells.filter(c => { return c.NearbyPokemon.length || c.MapPokemon.length || c.WildPokemon.length }).forEach(c => {
        const mPkmn = c.MapPokemon;
        if (mPkmn.length) {
          mPkmn.forEach(p => {
            if (!~seen.indexOf(p.SpawnpointId)) {
              //Not already in list
              markers.push(p);
              seen.push(p.SpawnpointId);
              console.log('Map Push',p.SpawnpointId,seen);
            }
          });
        }
        const wPkmn = c.WildPokemon;
        if (wPkmn.length) {
          wPkmn.forEach(p => {
            if (!~seen.indexOf(p.SpawnPointId)) {
              //Not already in list
              p.PokedexTypeId = p.pokemon.PokemonId; //To keep same format.
              markers.push(p);
              seen.push(p.SpawnPointId);
              console.log('Wild Push',p.SpawnPointId,seen);
            } else {
              // Wild Pokemon has accurate TimeTillHiddenMs
              // we need to check if we had MapPokemon at this SpawnPointId without TimeTillHiddenMs
              // and add it from Wild one.
              //debugger;
              const existingPkmnInArray = markers.filter(m => { return m.SpawnpointId == p.SpawnPointId});
              if (existingPkmnInArray && existingPkmnInArray.length && !existingPkmnInArray[0].TimeTillHiddenMs) {
                const index = markers.indexOf(existingPkmnInArray[0]);
                markers[index].TimeTillHiddenMs = p.TimeTillHiddenMs;
                markers[index].dissapearTime = Date.now() + p.TimeTillHiddenMs;
                console.log('Updated from Wild !',existingPkmnInArray);
              }
            }
          });
        }
      });

      dispatch({
        type:RECEIVED_MARKERS,
        markers,
      })
    })
    .catch(ex => {
      console.warn(ex);
      console.log(ex,url);
    });
  };
}

export function updatePosition(position) {
  console.log('GPS Update:',position);
  const {latitude, longitude} = position.coords;

  return dispatch => {

      dispatch({
        type: UPDATE_POSITION,
        position,
      });

      dispatch(getMarkers(position));
    };
}

export function updateRegion(position) {
  console.log('Maps ViewPort Update:',position);
  const {latitude, longitude} = position.coords;

  return dispatch => {

      dispatch({
        type: UPDATE_REGION,
        position,
      });

      dispatch(getMarkers(position));
    };
}


export function init(position) {
  console.log(position);
  const {latitude, longitude} = position.coords;

  return dispatch => {
    axios.get(`${config.base}/init/${latitude}/${longitude}`)
    .then(json => {
      console.log('OK BOOT:',json);
      dispatch({
        type: UPDATE_POSITION,
        position,
      });

      dispatch({
        type: UPDATE_REGION,
        position,
      });

      dispatch({
        type: UPDATE_PROFILE,
        profile:json.data.profile,
      });

      dispatch(getMarkers());
    })
    .catch(ex => {
      console.log(ex);
      console.warn(ex);
    });
  };
}

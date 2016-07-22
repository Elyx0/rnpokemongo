import Immutable from 'immutable';
import * as mapActions from '../actions/mapActions';

const initialState = new Immutable.fromJS({
  username:false,
  markers:[],
  position:false,
  region: false,
  profile: {},
});

export default function maps(state = initialState, action) {
  switch(action.type) {
    case mapActions.UPDATE_REGION:
    return state.set('region',action.position);
    case mapActions.UPDATE_POSITION:
    return state.set('position',action.position);
    return false;
    case mapActions.UPDATE_PROFILE:
    return state.set('profile',action.profile);
    case mapActions.RECEIVED_MARKERS:
    return state.set('markers',action.markers);
    default:
    return initialState;
  }
}

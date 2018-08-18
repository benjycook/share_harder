import * as actionTypes from '../constants/experimentEditorConstants';
import { addIds, updateThing, findThingBySubthing } from '../../Shared/lib';

function experimentEditorReducer(state, action){
  var newState = JSON.parse(JSON.stringify(state))

  console.log("ACTION: ", action)

  newState = beforeStateUpdate(newState)
  newState.unsavedChanges = !action.type.match(/INIT/) // Assume all actions change state in a way that needs to be persisted

  switch(action.type){
    case actionTypes.REFRESH_STATE:
      newState.unsavedChanges = false
      newState.experiment = JSON.parse(JSON.stringify(action.data.experiment))
      break
    case actionTypes.UPDATE_VARIANT:
      newState.experiment.variants = updateThing(newState.experiment.variants, action.variant)
      break
    case actionTypes.UPDATE_EXPERIMENT:
      newState.experiment = { ...newState.experiment, ...action.data }
      break
    case actionTypes.ADD_VARIANT:
      newState.experiment.variants.push({title: 'New variant', description: 'Description here', template_image: {url: 'http://via.placeholder.com/540x540', overlays: []}})
      break
    case actionTypes.ADD_OVERLAY:
      var variant = newState.experiment.variants.find(v => v._id === action.variant_id)
      variant.template_image.overlays = JSON.parse(JSON.stringify(variant.template_image.overlays))
      variant.template_image.overlays.push({text: 'NEW TEXT', top: 10, left: 10, font: 'Open Sans', size: 20, color: '#ffffff'})
      break
    case actionTypes.UPDATE_OVERLAY:
      var variant = findThingBySubthing(newState.experiment.variants, ['template_image', 'overlays'], action.overlay._id)
      variant.template_image.overlays = JSON.parse(JSON.stringify(updateThing(variant.template_image.overlays, action.overlay)))
      break
    case actionTypes.DELETE_OVERLAY:
      var variant = findThingBySubthing(newState.experiment.variants, ['template_image', 'overlays'], action.overlay_id)
      variant.template_image.overlays = JSON.parse(JSON.stringify(variant.overlays.filter(o => o._id !== action.overlay_id)))
      break
  }

  newState = afterStateUpdate(newState);
  console.log("Old state: ", state)
  console.log("New state: ", newState)
  return newState;
}

function beforeStateUpdate(state){
  return state
}

function afterStateUpdate(state){
  var newState = JSON.parse(JSON.stringify(state))
  return addIds(newState)
}

export default experimentEditorReducer

import {
  SET_TOKEN,
} from "../constants/action-types"

const token = (state = null, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return action.token
    default:
      return state
  }
}

export default token
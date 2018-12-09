import {
  SET_TOKEN,
  DO_SOMETHING,
  DO_SOMETHING_OVER,
  DO_NOTHING
} from "../constants/action-types";

export const setToken = token => ({
  type: SET_TOKEN,
  token: token
})

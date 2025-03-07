import Value from "../../interfaces/Value";
import lang from "../../language.json";
import Logger from "../Logger";
import ValuePaths from "../../interfaces/ValuePaths";
import { handleRequest, isSuccess, notify } from "../functions";
import { Dispatch } from "react";
import {
  GET_ETHNICITIES,
  GET_GENDERS,
  GET_LEGAL_STATUSES,
  GET_VEHICLES,
  GET_WEAPONS,
  DELETE_VALUE,
  ADD_VALUE,
  GET_VALUE_BY_ID,
  UPDATE_VALUE_BY_ID,
  VALUES_SET_LOADING,
} from "../types";

interface IDispatch {
  type: string;
  genders?: Value[];
  ethnicities?: Value[];
  legalStatuses?: Value[];
  weapons?: Value[];
  vehicles?: Value[];
  values?: Value[];
  path?: string;
  error?: string;
  value?: Value;
  loading?: boolean;
}

export const deleteValue = (id: string, path: ValuePaths) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/values/${path}/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_VALUE,
        path: path,
        values: res.data.values,
      });

      notify(lang.admin.values[path].deleted).success();
    }
  } catch (e) {
    Logger.error(DELETE_VALUE, e);
  }
};

export const addValue = (path: string, data: { name: string }) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/values/${path}`, "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: ADD_VALUE,
      });

      notify(`Successfully added ${data.name} to ${path}`).success();
      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(ADD_VALUE, e);
    return false;
  }
};

export const getValueById = (path: string, id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/values/${path}/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_VALUE_BY_ID,
        value: res.data.value,
      });
    }
  } catch (e) {
    Logger.error(GET_VALUE_BY_ID, e);
  }
};

export const updateValueById = (path: string, id: string, data: { name: string }) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/values/${path}/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_VALUE_BY_ID,
      });

      notify("Successfully updated value").success();

      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(UPDATE_VALUE_BY_ID, e);
    return false;
  }
};

/* genders */
export const getGenders = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: VALUES_SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/values/genders", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_GENDERS,
        genders: res.data.values,
      });
    }
  } catch (e) {
    Logger.error(GET_GENDERS, e);
    dispatch({ type: VALUES_SET_LOADING, loading: false });
  }
};

/* ethnicities */
export const getEthnicities = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: VALUES_SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/values/ethnicities", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ETHNICITIES,
        ethnicities: res.data.values,
      });
    }
  } catch (e) {
    Logger.error(GET_ETHNICITIES, e);
    dispatch({ type: VALUES_SET_LOADING, loading: false });
  }
};

/* Legal Statuses */
export const getLegalStatuses = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: VALUES_SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/values/legal-statuses", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_LEGAL_STATUSES,
        legalStatuses: res.data.values,
      });
    }
  } catch (e) {
    Logger.error(GET_LEGAL_STATUSES, e);
    dispatch({ type: VALUES_SET_LOADING, loading: false });
  }
};

/* weapons */
export const getWeapons = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: VALUES_SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/values/weapons", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_WEAPONS,
        weapons: res.data.values,
      });
    }
  } catch (e) {
    Logger.error(GET_LEGAL_STATUSES, e);
    dispatch({ type: VALUES_SET_LOADING, loading: false });
  }
};

/* vehicles */
export const getVehicles = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: VALUES_SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/values/vehicles", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_VEHICLES,
        vehicles: res.data.values,
      });
    }
  } catch (e) {
    Logger.error(GET_VEHICLES, e);
    dispatch({ type: VALUES_SET_LOADING, loading: false });
  }
};

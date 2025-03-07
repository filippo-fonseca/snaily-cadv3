import Deputy from "../../interfaces/Deputy";
import MedicalRecord from "../../interfaces/MedicalRecord";
import Logger from "../Logger";
import socket from "../socket";
import lang from "../../language.json";
import { Dispatch } from "react";
import { handleRequest, isSuccess, notify } from "../functions";
import {
  GET_CURRENT_EMS_STATUS,
  GET_MY_EMS_FD,
  SET_EMS_STATUS,
  DELETE_EMS_DEPUTY,
  CREATE_EMS_FD_DEPUTY,
  SEARCH_MEDICAL_RECORD,
} from "../types";

interface IDispatch {
  type: string;
  error?: string;
  deputies?: Deputy[];
  medicalRecords?: MedicalRecord[];
  status?: string;
  status2?: string;
  activeDeputy?: Deputy;
}

export const createEmsFdDeputy = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/ems-fd/my-deputies", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_EMS_FD_DEPUTY,
      });

      notify("Successfully created EMS/FD member").success();
      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_EMS_FD_DEPUTY, e);
  }
};

export const getMyDeputies = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/ems-fd/my-deputies", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MY_EMS_FD,
        deputies: res.data.deputies,
      });
    }
  } catch (e) {
    Logger.error(GET_MY_EMS_FD, e);
  }
};

export const getCurrentEmsStatus = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const id = localStorage.getItem("on-duty-ems-fd");
    const res = await handleRequest(`/ems-fd/status/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CURRENT_EMS_STATUS,
        status: res.data.deputy?.status || "off-duty",
        status2: res.data.deputy?.status2 || "-",
        activeDeputy: res.data.deputy?.status !== "off-duty" ? res.data.deputy : null,
      });
    }
  } catch (e) {
    Logger.error(GET_CURRENT_EMS_STATUS, e);
  }
};

export const setEmsStatus = (
  id: string,
  status: "on-duty" | "off-duty" | string,
  status2: string,
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    localStorage.setItem("on-duty-ems-fd", id);
    const data = { id: id, status: status, status2: status2 };
    const res = await handleRequest(`/ems-fd/status/${id}`, "PUT", data);

    if (isSuccess(res)) {
      socket.emit("UPDATE_ACTIVE_UNITS");

      dispatch({
        type: SET_EMS_STATUS,
        status: res.data.deputy.status,
        status2: res.data.deputy.status2,
      });

      notify(`Successfully updated status to ${status2}`).success({
        autoClose: 2000,
      });
    }
  } catch (e) {
    Logger.error(SET_EMS_STATUS, e);
  }
};

export const deleteEmsFdDeputy = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/ems-fd/my-deputies/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_EMS_DEPUTY,
        deputies: res.data.deputies,
      });

      notify(lang.ems_fd.deleted_dept).success();
    }
  } catch (e) {
    Logger.error(DELETE_EMS_DEPUTY, e);
  }
};

export const searchMedicalRecord = (name: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/ems-fd/medical-records/${name}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: SEARCH_MEDICAL_RECORD,
        medicalRecords: res.data.medicalRecords?.map((record: MedicalRecord) => {
          record.citizen = res.data.citizen;

          return record;
        }),
      });
    } else {
      notify(res.data.error).warn();
    }
  } catch (e) {
    Logger.error(SEARCH_MEDICAL_RECORD, e);
  }
};

export const declareDeadOrAlive = (citizenId: string, type: "alive" | "dead") => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/ems-fd/declare/${citizenId}/?declare=${type}`, "PUT");

    if (isSuccess(res)) {
      notify(`Successfully declared ${type}`).success();

      dispatch({
        type: "DECLARE_DEAD_OR_ALIVE",
      });
    } else {
      notify(res.data.error).warn();
    }
  } catch (e) {
    Logger.error(SEARCH_MEDICAL_RECORD, e);
  }
};

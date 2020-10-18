import Bleet from "./Bleet";
import Call from "./Call";
import User from "./User";
import Bolo from "./Bolo";
import Officer from "./Officer";
import Department from "./Department";
import Deputy from "./Deputy";

interface State {
  auth: {
    isAuth: boolean;
    loading: boolean;
    user: User;
    error: string;
  };
  bleets: {
    bleets: Bleet[];
    bleet: Bleet;
    loading: boolean;
    error: string;
  };
  global: {
    cadInfo: object;
    aop: string;
  };
  calls: {
    calls: Call[];
  };
  officers: {
    status: string;
    status2: string;
    officers: Officer[];
    departments: Department[];
    error: string;
  };
  bolos: {
    bolos: Bolo[];
  };
  dispatch: {
    officers: Officer[];
    ems_fd: Deputy[];
  };
}

export default State;

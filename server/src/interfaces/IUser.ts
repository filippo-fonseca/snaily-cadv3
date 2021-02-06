import { RanksType } from "../lib/constants";
export type Perm = "1" | "0";

interface IUser {
  id: string;
  username: string;
  password: string;
  rank: RanksType;
  leo: Perm;
  ems_fd: Perm;
  dispatch: Perm;
  tow: Perm;
  banned: Perm;
  ban_reason: string;
  whitelist_status: "pending" | "accepted";
}

export default IUser;

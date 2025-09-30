import {Dcc} from "./Dcc.model";

export interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
  isActive: boolean;
  dccList: Dcc[];
}


import {Contribution} from "./contribution.model";
import {Observable} from "rxjs";
import {AppDataState} from "../state/participant.state";

export interface Report{
  pidReport: string;
  smartStandardEvaluationMethod: string;
  contributions$?: Observable<AppDataState<Contribution[]>>;
  pilotParticipantName:string;

}


import { IProfile } from "../interfaces/profile.interface";

export class Profile implements IProfile {
  constructor(
    public profilePhone: string,
    public profileName?: string,
    public profileAdress?: string,
  ) { }
}
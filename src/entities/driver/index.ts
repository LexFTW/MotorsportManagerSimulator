export { DRIVERS } from './drivers.data';

export interface Driver {
  id: string;
  identity: DriverIdentity;
  team: string;
  skills: DriverSkills;
}

export interface DriverIdentity {
  firstName: string;
  lastName: string;
  code: string;
  dorsal: number;
  photo: string;
  country: string;
}

export interface DriverSkills{
  pace: number;
  consistency: number;
  tyreManagement: number;
  aggressiveness: number;
  wetSkills: number;
  starts: number;
  experience: number;
}
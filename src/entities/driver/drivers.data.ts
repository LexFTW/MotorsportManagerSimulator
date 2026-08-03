import type { Driver } from './index';
import oscarPiastriPhoto from '@shared/assets/images/drivers/oscar-piastri.avif';
import landoNorrisPhoto from '@shared/assets/images/drivers/lando-norris.avif';
import fernandoAlonsoPhoto from '@shared/assets/images/drivers/fernando-alonso.avif';
import lanceStrollPhoto from '@shared/assets/images/drivers/lance-stroll.avif';
import hamiltonPhoto from '@shared/assets/images/drivers/lewis-hamilton.avif';
import charlesLeclercPhoto from '@shared/assets/images/drivers/charles-leclerc.avif';
import maxVerstappenPhoto from '@shared/assets/images/drivers/max-verstappen.avif';
import isackHadjarPhoto from '@shared/assets/images/drivers/isack-hadjar.avif';
import carlosSainzPhoto from '@shared/assets/images/drivers/carlos-sainz.avif';
import kimiAntonelliPhoto from '@shared/assets/images/drivers/kimi-antonelli.avif';
import georgeRussellPhoto from '@shared/assets/images/drivers/george-russell.avif';
import alexanderAlbonPhoto from '@shared/assets/images/drivers/alexander-albon.avif';
import pierreGaslyPhoto from '@shared/assets/images/drivers/pierre-gasly.avif';
import francoColapintoPhoto from '@shared/assets/images/drivers/franco-colapinto.avif';
import estebanOconPhoto from '@shared/assets/images/drivers/esteban-ocon.avif';
import arvidLindbladPhoto from '@shared/assets/images/drivers/arvid-lindblad.avif';
import oliverBearmanPhoto from '@shared/assets/images/drivers/oliver-bearman.avif';
import liamLawsonPhoto from '@shared/assets/images/drivers/liam-lawson.avif';
import gabrielBortoletoPhoto from '@shared/assets/images/drivers/gabriel-bortoleto.avif';
import nicoHulkenbergPhoto from '@shared/assets/images/drivers/nico-hulkenberg.avif';
import sergioPerezPhoto from '@shared/assets/images/drivers/sergio-perez.avif';
import valtteriBottasPhoto from '@shared/assets/images/drivers/valtteri-bottas.avif';

export const DRIVERS: Driver[] = [
    {
        id: 'PIA',
        team: 'mclaren',
        identity: { firstName: 'Oscar', lastName: 'Piastri', code: 'PIA', dorsal: 81, photo: oscarPiastriPhoto, country: 'AU' },
        skills: { pace: 88, consistency: 90, tyreManagement: 88, aggressiveness: 75, wetSkills: 85, starts: 82, experience: 72 },
    },
    {
        id: 'NOR',
        team: 'mclaren',
        identity: { firstName: 'Lando', lastName: 'Norris', code: 'NOR', dorsal: 4, photo: landoNorrisPhoto, country: 'GB' },
        skills: { pace: 91, consistency: 88, tyreManagement: 84, aggressiveness: 88, wetSkills: 90, starts: 86, experience: 78 },
    },
    {
        id: 'VER',
        team: 'red-bull',
        identity: { firstName: 'Max', lastName: 'Verstappen', code: 'VER', dorsal: 1, photo: maxVerstappenPhoto, country: 'NL' },
        skills: { pace: 99, consistency: 96, tyreManagement: 90, aggressiveness: 94, wetSkills: 98, starts: 95, experience: 92 },
    },
    {
        id: 'LEC',
        team: 'ferrari',
        identity: { firstName: 'Charles', lastName: 'Leclerc', code: 'LEC', dorsal: 16, photo: charlesLeclercPhoto, country: 'MC' },
        skills: { pace: 93, consistency: 88, tyreManagement: 82, aggressiveness: 85, wetSkills: 88, starts: 84, experience: 80 },
    },
    {
        id: 'RUS',
        team: 'mercedes',
        identity: { firstName: 'George', lastName: 'Russell', code: 'RUS', dorsal: 63, photo: georgeRussellPhoto, country: 'GB' },
        skills: { pace: 91, consistency: 90, tyreManagement: 86, aggressiveness: 80, wetSkills: 85, starts: 88, experience: 78 },
    },
    {
        id: 'ANT',
        team: 'mercedes',
        identity: { firstName: 'Kimi', lastName: 'Antonelli', code: 'ANT', dorsal: 12, photo: kimiAntonelliPhoto, country: 'IT' },
        skills: { pace: 88, consistency: 80, tyreManagement: 78, aggressiveness: 82, wetSkills: 80, starts: 78, experience: 58 },
    },
    {
        id: 'HAM',
        team: 'ferrari',
        identity: { firstName: 'Lewis', lastName: 'Hamilton', code: 'HAM', dorsal: 44, photo: hamiltonPhoto, country: 'GB' },
        skills: { pace: 92, consistency: 94, tyreManagement: 95, aggressiveness: 88, wetSkills: 96, starts: 90, experience: 98 },
    },
    {
        id: 'HAD',
        team: 'red-bull',
        identity: { firstName: 'Isack', lastName: 'Hadjar', code: 'HAD', dorsal: 6, photo: isackHadjarPhoto, country: 'FR' },
        skills: { pace: 88, consistency: 86, tyreManagement: 90, aggressiveness: 78, wetSkills: 82, starts: 84, experience: 90 },
    },
    {
        id: 'ALO',
        team: 'aston-martin',
        identity: { firstName: 'Fernando', lastName: 'Alonso', code: 'ALO', dorsal: 14, photo: fernandoAlonsoPhoto, country: 'ES' },
        skills: { pace: 93, consistency: 93, tyreManagement: 96, aggressiveness: 90, wetSkills: 92, starts: 93, experience: 99 },
    },
    {
        id: 'STR',
        team: 'aston-martin',
        identity: { firstName: 'Lance', lastName: 'Stroll', code: 'STR', dorsal: 18, photo: lanceStrollPhoto, country: 'CA' },
        skills: { pace: 82, consistency: 78, tyreManagement: 80, aggressiveness: 75, wetSkills: 76, starts: 78, experience: 76 },
    },
    {
        id: 'GAS',
        team: 'alpine',
        identity: { firstName: 'Pierre', lastName: 'Gasly', code: 'GAS', dorsal: 10, photo: pierreGaslyPhoto, country: 'FR' },
        skills: { pace: 87, consistency: 84, tyreManagement: 82, aggressiveness: 83, wetSkills: 82, starts: 82, experience: 84 },
    },
    {
        id: 'COL',
        team: 'alpine',
        identity: { firstName: 'Franco', lastName: 'Colapinto', code: 'COL', dorsal: 43, photo: francoColapintoPhoto, country: 'AR' },
        skills: { pace: 83, consistency: 80, tyreManagement: 78, aggressiveness: 86, wetSkills: 80, starts: 76, experience: 61 },
    },
    {
        id: 'ALB',
        team: 'williams',
        identity: { firstName: 'Alexander', lastName: 'Albon', code: 'ALB', dorsal: 23, photo: alexanderAlbonPhoto, country: 'TH' },
        skills: { pace: 86, consistency: 84, tyreManagement: 86, aggressiveness: 80, wetSkills: 80, starts: 82, experience: 80 },
    },
    {
        id: 'SAI',
        team: 'williams',
        identity: { firstName: 'Carlos', lastName: 'Sainz', code: 'SAI', dorsal: 55, photo: carlosSainzPhoto, country: 'ES' },
        skills: { pace: 88, consistency: 85, tyreManagement: 84, aggressiveness: 82, wetSkills: 83, starts: 78, experience: 88 },
    },
    {
        id: 'ARV',
        team: 'rb',
        identity: { firstName: 'Arvid', lastName: 'Lindblad', code: 'ARV', dorsal: 41, photo: arvidLindbladPhoto, country: 'SE' },
        skills: { pace: 85, consistency: 80, tyreManagement: 78, aggressiveness: 86, wetSkills: 80, starts: 82, experience: 76 },
    },
    {
        id: 'LAW',
        team: 'rb',
        identity: { firstName: 'Liam', lastName: 'Lawson', code: 'LAW', dorsal: 30, photo: liamLawsonPhoto, country: 'NZ' },
        skills: { pace: 84, consistency: 80, tyreManagement: 80, aggressiveness: 80, wetSkills: 78, starts: 80, experience: 62 },
    },
    {
        id: 'BOR',
        team: 'audi',
        identity: { firstName: 'Gabriel', lastName: 'Bortoleto', code: 'BOR', dorsal: 5, photo: gabrielBortoletoPhoto, country: 'BR' },
        skills: { pace: 86, consistency: 80, tyreManagement: 80, aggressiveness: 84, wetSkills: 77, starts: 76, experience: 61 },
    },
    {
        id: 'HUL',
        team: 'audi',
        identity: { firstName: 'Nico', lastName: 'Hülkenberg', code: 'HUL', dorsal: 27, photo: nicoHulkenbergPhoto, country: 'DE' },
        skills: { pace: 82, consistency: 88, tyreManagement: 85, aggressiveness: 80, wetSkills: 74, starts: 74, experience: 95 },
    },
    {
        id: 'OCO',
        team: 'haas',
        identity: { firstName: 'Esteban', lastName: 'Ocon', code: 'OCO', dorsal: 31, photo: estebanOconPhoto, country: 'FR' },
        skills: { pace: 84, consistency: 82, tyreManagement: 80, aggressiveness: 82, wetSkills: 80, starts: 80, experience: 80 },
    },
    {
        id: 'BEA',
        team: 'haas',
        identity: { firstName: 'Oliver', lastName: 'Bearman', code: 'BEA', dorsal: 87, photo: oliverBearmanPhoto, country: 'GB' },
        skills: { pace: 82, consistency: 78, tyreManagement: 78, aggressiveness: 80, wetSkills: 76, starts: 78, experience: 60 },
    },
    {
        id: 'BOT',
        team: 'cadillac',
        identity: { firstName: 'Valtteri', lastName: 'Bottas', code: 'BOT', dorsal: 77, photo: valtteriBottasPhoto, country: 'FI' },
        skills: { pace: 86, consistency: 87, tyreManagement: 88, aggressiveness: 74, wetSkills: 82, starts: 80, experience: 92 },
    },
    {
        id: 'PER',
        team: 'cadillac',
        identity: { firstName: 'Sergio', lastName: 'Pérez', code: 'PER', dorsal: 11, photo: sergioPerezPhoto, country: 'MX' },
        skills: { pace: 92, consistency: 90, tyreManagement: 88, aggressiveness: 86, wetSkills: 88, starts: 84, experience: 90 },
    }
];

import type { Driver } from './index';
import oscarPiastriPhoto from '@shared/assets/images/drivers/oscar-piastri.avif';
import landoNorrisPhoto from '@shared/assets/images/drivers/lando-norris.avif';
import fernandoAlonsoPhoto from '@shared/assets/images/drivers/fernando-alonso.png';
import lanceStrollPhoto from '@shared/assets/images/drivers/lance-stroll.png';

export const DRIVERS: Driver[] = [
    {
        id: 'PIA',
        team: 'mclaren',
        identity: { firstName: 'Oscar', lastName: 'Piastri', code: 'PIA', dorsal: 81, photo: oscarPiastriPhoto, country: 'AU' },
        skills: { pace: 93, consistency: 90, tyreManagement: 88, aggressiveness: 75, wetSkills: 85, starts: 82, experience: 72 },
    },
    {
        id: 'NOR',
        team: 'mclaren',
        identity: { firstName: 'Lando', lastName: 'Norris', code: 'NOR', dorsal: 4, photo: landoNorrisPhoto, country: 'GB' },
        skills: { pace: 95, consistency: 88, tyreManagement: 84, aggressiveness: 88, wetSkills: 90, starts: 86, experience: 78 },
    },
    {
        id: 'VER',
        team: 'red-bull',
        identity: { firstName: 'Max', lastName: 'Verstappen', code: 'VER', dorsal: 1, photo: '', country: 'NL' },
        skills: { pace: 99, consistency: 96, tyreManagement: 90, aggressiveness: 94, wetSkills: 98, starts: 95, experience: 92 },
    },
    {
        id: 'LEC',
        team: 'ferrari',
        identity: { firstName: 'Charles', lastName: 'Leclerc', code: 'LEC', dorsal: 16, photo: '', country: 'MC' },
        skills: { pace: 95, consistency: 88, tyreManagement: 82, aggressiveness: 85, wetSkills: 88, starts: 84, experience: 80 },
    },
    {
        id: 'RUS',
        team: 'mercedes',
        identity: { firstName: 'George', lastName: 'Russell', code: 'RUS', dorsal: 63, photo: '', country: 'GB' },
        skills: { pace: 91, consistency: 90, tyreManagement: 86, aggressiveness: 80, wetSkills: 85, starts: 88, experience: 78 },
    },
    {
        id: 'ANT',
        team: 'mercedes',
        identity: { firstName: 'Kimi', lastName: 'Antonelli', code: 'ANT', dorsal: 12, photo: '', country: 'IT' },
        skills: { pace: 88, consistency: 80, tyreManagement: 78, aggressiveness: 82, wetSkills: 80, starts: 78, experience: 58 },
    },
    {
        id: 'HAM',
        team: 'ferrari',
        identity: { firstName: 'Lewis', lastName: 'Hamilton', code: 'HAM', dorsal: 44, photo: '', country: 'GB' },
        skills: { pace: 96, consistency: 94, tyreManagement: 95, aggressiveness: 88, wetSkills: 96, starts: 90, experience: 98 },
    },
    {
        id: 'PER',
        team: 'red-bull',
        identity: { firstName: 'Sergio', lastName: 'Pérez', code: 'PER', dorsal: 11, photo: '', country: 'MX' },
        skills: { pace: 88, consistency: 86, tyreManagement: 90, aggressiveness: 78, wetSkills: 82, starts: 84, experience: 90 },
    },
    {
        id: 'ALO',
        team: 'aston-martin',
        identity: { firstName: 'Fernando', lastName: 'Alonso', code: 'ALO', dorsal: 14, photo: fernandoAlonsoPhoto, country: 'ES' },
        skills: { pace: 93, consistency: 93, tyreManagement: 94, aggressiveness: 90, wetSkills: 92, starts: 93, experience: 99 },
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
        identity: { firstName: 'Pierre', lastName: 'Gasly', code: 'GAS', dorsal: 10, photo: '', country: 'FR' },
        skills: { pace: 87, consistency: 84, tyreManagement: 82, aggressiveness: 83, wetSkills: 82, starts: 82, experience: 84 },
    },
    {
        id: 'DOO',
        team: 'alpine',
        identity: { firstName: 'Jack', lastName: 'Doohan', code: 'DOO', dorsal: 61, photo: '', country: 'AU' },
        skills: { pace: 82, consistency: 78, tyreManagement: 78, aggressiveness: 78, wetSkills: 76, starts: 76, experience: 58 },
    },
    {
        id: 'ALB',
        team: 'williams',
        identity: { firstName: 'Alexander', lastName: 'Albon', code: 'ALB', dorsal: 23, photo: '', country: 'TH' },
        skills: { pace: 86, consistency: 84, tyreManagement: 86, aggressiveness: 80, wetSkills: 80, starts: 82, experience: 80 },
    },
    {
        id: 'COL',
        team: 'williams',
        identity: { firstName: 'Franco', lastName: 'Colapinto', code: 'COL', dorsal: 43, photo: '', country: 'AR' },
        skills: { pace: 83, consistency: 78, tyreManagement: 78, aggressiveness: 82, wetSkills: 76, starts: 78, experience: 60 },
    },
    {
        id: 'TSU',
        team: 'rb',
        identity: { firstName: 'Yuki', lastName: 'Tsunoda', code: 'TSU', dorsal: 22, photo: '', country: 'JP' },
        skills: { pace: 85, consistency: 80, tyreManagement: 78, aggressiveness: 86, wetSkills: 80, starts: 82, experience: 76 },
    },
    {
        id: 'LAW',
        team: 'rb',
        identity: { firstName: 'Liam', lastName: 'Lawson', code: 'LAW', dorsal: 30, photo: '', country: 'NZ' },
        skills: { pace: 84, consistency: 80, tyreManagement: 80, aggressiveness: 80, wetSkills: 78, starts: 80, experience: 62 },
    },
    {
        id: 'BOT',
        team: 'audi',
        identity: { firstName: 'Valtteri', lastName: 'Bottas', code: 'BOT', dorsal: 77, photo: '', country: 'FI' },
        skills: { pace: 86, consistency: 87, tyreManagement: 88, aggressiveness: 74, wetSkills: 82, starts: 80, experience: 92 },
    },
    {
        id: 'ZHO',
        team: 'audi',
        identity: { firstName: 'Zhou', lastName: 'Guanyu', code: 'ZHO', dorsal: 24, photo: '', country: 'CN' },
        skills: { pace: 78, consistency: 76, tyreManagement: 76, aggressiveness: 72, wetSkills: 74, starts: 74, experience: 68 },
    },
    {
        id: 'OCO',
        team: 'haas',
        identity: { firstName: 'Esteban', lastName: 'Ocon', code: 'OCO', dorsal: 31, photo: '', country: 'FR' },
        skills: { pace: 84, consistency: 82, tyreManagement: 80, aggressiveness: 82, wetSkills: 80, starts: 80, experience: 80 },
    },
    {
        id: 'BEA',
        team: 'haas',
        identity: { firstName: 'Oliver', lastName: 'Bearman', code: 'BEA', dorsal: 87, photo: '', country: 'GB' },
        skills: { pace: 82, consistency: 78, tyreManagement: 78, aggressiveness: 80, wetSkills: 76, starts: 78, experience: 60 },
    },
];

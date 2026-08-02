import { useAppSelector } from '@/app/store/hooks';
import { DRIVERS } from '@/entities/driver/drivers.data';
import { TEAMS } from '@/entities/teams/teams.data';
import type { Driver } from '@/entities/driver';
import type { Team } from '@/entities/teams';
import type { RaceDriverState } from '@/entities/race';
import { hexToRgba } from '@/shared/lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import styles from './RaceDriver.module.css';

const TEAM_ID = 'mclaren';

const TYRE_COLORS: Record<string, string> = {
    Soft: '#e8002d',
    Medium: '#ffd700',
    Hard: '#e8e8e8',
    Wet: '#0096ff',
};

const TyreGauge = ({ wear, compound }: { wear: number; compound: string }) => {
    const r = 34;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - wear / 100);
    const color = TYRE_COLORS[compound] ?? '#ffffff';

    return (
        <svg width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
            <circle
                cx="42" cy="42" r={r}
                fill="none"
                stroke={color}
                strokeWidth="7"
                strokeDasharray={String(circ)}
                strokeDashoffset={String(offset)}
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
            />
            <text x="42" y="48" textAnchor="middle" fill="white" fontSize="17" fontWeight="900" fontFamily="sans-serif">
                {compound[0]}
            </text>
        </svg>
    );
};

const FuelGauge = ({ fuel }: { fuel: number }) => {
    const r = 34;
    const arcLength = Math.PI * r;
    const fillLength = (fuel / 100) * arcLength;

    return (
        <div className={styles.fuelGaugeWrapper}>
            <svg width="88" height="52" viewBox="0 0 88 52">
                <path d="M 10 46 A 34 34 0 0 0 78 46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" strokeLinecap="round" />
                <path
                    d="M 10 46 A 34 34 0 0 0 78 46"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${fillLength} ${arcLength}`}
                />
            </svg>
            <FontAwesomeIcon icon={faGasPump} className={styles.fuelIcon} />
        </div>
    );
};

interface DriverCardProps {
    driver: Driver;
    raceState: RaceDriverState;
    team: Team;
    totalLaps: number;
}

const DriverCard = ({ driver, raceState, team, totalLaps }: DriverCardProps) => {
    const { tyreWear, fuel, progress, tyre } = raceState;
    const tyreHealth = 100 - tyreWear;
    const reliability = team.stats.reliability;
    const fuelLaps = ((fuel / 100) * totalLaps).toFixed(2);

    return (
        <div className={styles.driverCard}>
            <div className={styles.header}>
                <span className={styles.dorsal} style={{ color: team.color }}>
                    {driver.identity.dorsal}
                </span>
                <div className={styles.driverInfo}>
                    <p className={styles.firstName}>{driver.identity.firstName}</p>
                    <p className={styles.lastName}>{driver.identity.lastName}</p>
                </div>
                <img src={driver.identity.photo} alt={driver.identity.lastName} className={styles.photo} />
                <img src={team.logo} alt={team.name} className={styles.teamLogo} />
            </div>

            <div className={styles.stats}>
                <div className={styles.statBox} style={{ background: hexToRgba(team.color, 0.08) }}>
                    <TyreGauge wear={tyreHealth} compound={tyre} />
                    <span className={styles.gaugeValue}>{tyreHealth}%</span>
                    <span className={styles.gaugeLabel}>TYRE WEAR</span>
                </div>
                <div className={styles.statBox} style={{ background: hexToRgba(team.color, 0.08) }}>
                    <FuelGauge fuel={fuel} />
                    <span className={styles.gaugeDelta}>+0.00</span>
                    <span className={styles.gaugeValue}>{fuelLaps} LAPS</span>
                    <span className={styles.gaugeLabel}>FUEL BALANCE</span>
                </div>
            </div>

            <div className={styles.barSection}>
                <div className={styles.barHeader}>
                    <span className={styles.barTitle}>RELIABILITY</span>
                    <span className={styles.barValue}>{reliability}%</span>
                </div>
                <div className={styles.bar}>
                    <div className={styles.barFillRed} style={{ width: `${100 - reliability}%` }} />
                    <div className={styles.barFillGreen} style={{ width: `${reliability}%` }} />
                </div>
            </div>

            <div className={styles.barSection}>
                <div className={styles.barHeader}>
                    <span className={styles.barTitle}>LAP</span>
                </div>
                <div className={styles.bar}>
                    <div className={styles.barFillOrange} style={{ width: `${progress * 100}%` }} />
                </div>
            </div>

            <button className={styles.pitButton} style={{ background: team.color }}>
                <span>PIT</span>
                <FontAwesomeIcon icon={faAnglesRight} className={styles.pitIcon} />
            </button>
        </div>
    );
};

export const RaceDrivers = () => {
    const raceDriversState = useAppSelector(state => state.drivers);
    const totalLaps = useAppSelector(state => state.session.totalLaps);

    const team = TEAMS.find(t => t.id === TEAM_ID);
    const drivers = DRIVERS.filter(d => d.team === TEAM_ID);

    if (!team) return null;

    return (
        <div className={styles.container}>
            {drivers.map((driver: Driver) => {
                const raceState = raceDriversState.find(s => s.driverId === driver.id);
                if (!raceState) return null;
                return (
                    <DriverCard
                        key={driver.id}
                        driver={driver}
                        raceState={raceState}
                        team={team}
                        totalLaps={totalLaps}
                    />
                );
            })}
        </div>
    );
}
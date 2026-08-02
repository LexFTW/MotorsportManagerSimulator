import { Card, CardBody } from '@/shared/ui/components';
import { drivers } from '@/widgets/race-drivers/models/driveres.mock';

import styles from './RaceDriver.module.css';
import { mclarenLogo } from '@/shared/assets/images/teams';

export const RaceDrivers = () => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {drivers.map((driver) => (
            <>
                <Card>
                    <div className="d-flex gap-2">
                        <img src={mclarenLogo} alt="McLaren Logo" className={styles['team-logo']} />
                        <h4>| {driver.name}</h4>
                    </div>
                    <CardBody>
                        <div key={driver.id} className={styles['driver-container']}>
                            <img
                                src={driver.image}
                                alt={driver.name}
                                className={styles.driver}
                            /> 
                        </div>
                    </CardBody>
                </Card>
            </>
            ))}
        </div>
    );
}
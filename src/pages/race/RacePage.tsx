import { useState } from "react";
import { RaceLayout } from "@shared/ui/layouts/RaceLayout";
import { RaceControl, RaceEvents, RaceHeader, RaceMap, RaceTiming, RaceDrivers } from "@widgets";
import styles from "./RacePage.module.css";
export const RacePage = () => {
    const [showTiming, setShowTiming] = useState(true);
    const [showDrivers, setShowDrivers] = useState(true);

    return (
        <RaceLayout>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
                <div className="container-fluid my-3" style={{ position: 'relative', zIndex: 1999 }}>
                    <div className="row">
                        <div className="col-4">
                            {showTiming && <RaceTiming />}
                            {showTiming && <RaceEvents />}
                        </div>
                        <div className="col-4" style={{ position: 'relative'}}>
                            <RaceHeader />
                            <div className={styles.controlWrapper}>
                                <RaceControl
                                    onToggleTiming={() => setShowTiming(v => !v)}
                                    onToggleDrivers={() => setShowDrivers(v => !v)}
                                />
                            </div>
                        </div>
                        <div className={`col-4 ${styles.driversCol}`}>
                            {showDrivers && <RaceDrivers />}
                        </div>
                    </div>
                </div>
                <RaceMap />
            </div>
        </RaceLayout>
    );
};
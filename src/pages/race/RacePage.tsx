import { useRef, useState } from "react";
import { RaceLayout } from "@shared/ui/layouts/RaceLayout";
import { RaceControl, RaceEvents, RaceHeader, RaceMap, RaceTiming, RaceDrivers } from "@widgets";
import styles from "./RacePage.module.css";
import { useIsMobile } from "@/shared/lib/hooks/isUseMobile";
export const RacePage = () => {
    const isMobile = useIsMobile();
    const [showOverlay, setShowOverlay] = useState(!isMobile);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const [showTiming, setShowTiming] = useState(false);
    const [showDrivers, setShowDrivers] = useState(false);

    const onScreenTap = () => {
        setShowOverlay(true);

        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            setShowOverlay(false);
        }, 4000);
    };

    return (
        <RaceLayout>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
                <div className="container-fluid my-3" style={{ position: 'relative', zIndex: 1999 }}>
                    <div className="row">
                        <div className="col-4">
                            {showTiming && <RaceTiming />}
                            {showTiming && <RaceEvents />}
                        </div>
                        <div className="col-md-4 col-sm-12 d-flex flex-column justify-content-between" style={{ position: 'relative', height: '100vh' }}>
                            {(!isMobile || showOverlay) && (
                                <div className={styles.overlay}>
                                    <RaceHeader />
                                    <div style={{ marginBottom: '1.7rem'}}>
                                        <RaceControl
                                            onToggleTiming={() => setShowTiming(v => !v)}
                                            onToggleDrivers={() => setShowDrivers(v => !v)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`col-4 ${styles.driversCol}`}>
                            {showDrivers && <RaceDrivers />}
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => {
                        if (isMobile) {
                            setShowOverlay(v => !v);
                        }
                    }}
                >
                    <RaceMap />
                </div>
            </div>
        </RaceLayout>
    );
};
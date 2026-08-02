import { RaceLayout } from "@shared/ui/layouts/RaceLayout";
import { RaceControl, RaceHeader, RaceMap, RaceTiming, RaceDrivers } from "@widgets";
export const RacePage = () => {
    return (
        <RaceLayout>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
                <div className="container-fluid my-3" style={{ position: 'relative', zIndex: 1001 }}>
                    <div className="row">
                        <div className="col-4">
                            <RaceTiming />
                        </div>
                        <div className="col-4" style={{ position: 'relative'}}>
                            <RaceHeader />
                            <div style={{ position: 'absolute', top: '840px', width: '100%' }}>
                                <RaceControl />
                            </div>
                        </div>
                        <div className="col-4">
                            <RaceDrivers />
                        </div>
                    </div>
                </div>
                <RaceMap />
            </div>
        </RaceLayout>
    );
};
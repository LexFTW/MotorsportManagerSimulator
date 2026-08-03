import ReactCountryFlag from "react-country-flag";
import { Card } from "@/shared/ui/components";
import { useAppSelector } from "@/app/store/hooks";
import { CIRCUITS } from "@/entities/circuits/circuits.data";

export const RaceHeader = () => {
    const circuitId = useAppSelector(state => state.session.circuitId);
    const circuit = CIRCUITS[circuitId];
    const raceSession = useAppSelector(state => state.session);

    console.log(JSON.stringify(circuit));

    return (
        <Card>
                <div className="row align-items-center">
                    <div className="col">
                        <div style={{ display: "flex", flexDirection: "column", marginLeft: '0.5rem', verticalAlign: 'middle', justifyContent: 'center'}}>
                            <div>
                                <ReactCountryFlag countryCode={circuit.countryCode} width={60} svg/>  
                                <span style={{marginLeft: '1rem', fontWeight: 'bold'}}>GP {circuit.country}</span>
                            </div>
                            <span>{circuit.name}</span>
                        </div>
                    </div>
                    <div className="col-2" style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'right', marginRight: '0.5rem'}}>
                        <span>{raceSession.currentLap} / {raceSession.totalLaps}</span>
                    </div>
                </div>
        </Card>
    );
};
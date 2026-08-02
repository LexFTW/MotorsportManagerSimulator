import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardFast, faForwardFast, faPlay, faRankingStar } from '@fortawesome/free-solid-svg-icons';
import { Card, CardBody } from '@/shared/ui/components';
import { Icon } from '@mdi/react';
import { mdiRacingHelmet } from '@mdi/js';

interface RaceControlProps {
    onToggleTiming?: () => void;
    onToggleDrivers?: () => void;
}

export const RaceControl = ({ onToggleTiming, onToggleDrivers }: RaceControlProps) => {
    return (
        <Card>
            <CardBody>
                <div className="row justify-content-center align-items-center">
                    <div className="col d-flex justify-content-center">
                        <button className="btn border-0 bg-transparent text-white" onClick={onToggleTiming}>
                            <FontAwesomeIcon icon={faRankingStar} />    
                        </button>
                    </div>
                    <div className="col d-flex justify-content-center">
                        <button className="btn border-0 bg-transparent text-white">
                            <FontAwesomeIcon icon={faBackwardFast} />
                        </button>
                        <button className="btn border-0 bg-transparent text-white">
                            <FontAwesomeIcon icon={faPlay} />
                        </button>
                        <button className="btn border-0 bg-transparent text-white">
                            <FontAwesomeIcon icon={faForwardFast} />
                        </button>
                    </div>
                    <div className="col d-flex justify-content-center">
                        <button className="btn border-0 bg-transparent text-white" onClick={onToggleDrivers}>
                            <Icon path={mdiRacingHelmet} size={1} />
                        </button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
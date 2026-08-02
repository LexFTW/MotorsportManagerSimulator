// import ReactCountryFlag from "react-country-flag";
import ReactCountryFlag from "react-country-flag";
import styles from "./RaceHeader.module.css";
import { Card, CardBody } from "@/shared/ui/components";

export const RaceHeader = () => {
    return (
        <Card>
            <CardBody>
                <div className={styles.container}>
                    <div className={styles.left}>
                        
                        <div style={{ display: "flex", flexDirection: "column", marginLeft: '0.5rem', verticalAlign: 'middle', justifyContent: 'center'}}>
                            <div>
                                <ReactCountryFlag countryCode="ES" width={60} svg/>  
                                <span style={{marginLeft: '1rem', fontWeight: 'bold'}}>GP Spain</span>
                            </div>
                            <span>Circuit de Barcelona-Catalunya</span>
                        </div>
                    </div>

                    <div className={styles.right}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ margin: '0.4rem', textAlign: "right"}}>Tiempo</span>
                            <span style={{ textAlign: "right" }}>Pista</span>
                            <span style={{ marginTop: '1rem', textAlign: "right"}}>Lluvia</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ margin: '0.4rem'}}>☀️</span>
                            <span>32ºC</span>
                            <span style={{ marginTop: '1rem'}}>0%</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
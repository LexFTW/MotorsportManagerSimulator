import ReactCountryFlag from "react-country-flag";
import styles from "./RaceHeader.module.css";

export const RaceHeader = () => {
    return (
        <header className={styles.container}>
            <div className={styles.left}>
                <span className={styles.flag}>
                    <ReactCountryFlag
                        countryCode="ES"
                        svg
                    />
                </span>

                <div>
                    <h1 className={styles.title}>GP España</h1>

                    <span className={styles.subtitle}>
                        Circuit de Barcelona-Catalunya
                    </span>
                </div>
            </div>

            <div className={styles.center}>
                <div className={styles.info}>
                    <span className={styles.label}>☀ Weather</span>
                    <span className={styles.value}>28°C</span>
                </div>

                <div className={styles.info}>
                    <span className={styles.label}>Track</span>
                    <span className={styles.value}>36°C</span>
                </div>

                <div className={styles.info}>
                    <span className={styles.label}>Lap</span>
                    <span className={styles.value}>24 / 66</span>
                </div>

                <div className={styles.info}>
                    <span className={styles.label}>Safety Car</span>
                    <span className={styles.value}>OFF</span>
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.timer}>
                    01:23.152
                </div>

                <button className={styles.speed}>
                    ▶▶ x8
                </button>
            </div>
        </header>
    );
};
import styles from "./RacePage.module.css";

import { RaceLayout } from "@shared/ui/layouts/RaceLayout";
import { RaceHeader, RaceTiming } from "@widgets";
export const RacePage = () => {
    return (
        <RaceLayout>

            <main className={styles.content}>
                <aside className={styles.left}>
                    <RaceHeader />
                    <RaceTiming />
                </aside>

                <section className={styles.center}>
                    {/* <RaceMap /> */}
                </section>

                <aside className={styles.right}>
                    {/* <RaceEvents /> */}
                </aside>
            </main>

            <footer className={styles.footer}>
                {/* <RaceStrategy /> */}
            </footer>
        </RaceLayout>
    );
};
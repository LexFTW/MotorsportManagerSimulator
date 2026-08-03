import {
    type EngineDriver,
    type TeamStrategyProfile,
    type TyreCompound,
    DEFAULT_STRATEGY,
} from './types';

export interface PitDecision {
    compound: TyreCompound;
}

export interface RaceContext {
    totalLaps:   number;
    leaderLap:   number;
    /** All drivers, used to detect undercut opportunities. */
    allDrivers:  EngineDriver[];
}

export class AIStrategyManager {
    private profile: TeamStrategyProfile;

    constructor(profile: TeamStrategyProfile = DEFAULT_STRATEGY) {
        this.profile = profile;
    }

    updateProfile(profile: TeamStrategyProfile): void {
        this.profile = profile;
    }

    /**
     * Called once per lap completion for a driver managed by the AI.
     * Returns a pit decision or null if the AI decides to stay out.
     */
    evaluatePitStop(driver: EngineDriver, ctx: RaceContext): PitDecision | null {
        const { wearThreshold, lapWindowStart, lapWindowEnd, reactToUndercut, tyreStrategy } = this.profile;
        const lap = driver.lapsCompleted;
        if (driver.tyreWear >= wearThreshold) {
            return { compound: this.nextCompound(driver, tyreStrategy) };
        }

        // Planned pit window
        if (lap >= lapWindowStart && lap <= lapWindowEnd) {
            if (this.isGoodLapToPit(driver)) {
                return { compound: this.nextCompound(driver, tyreStrategy) };
            }
        }

        // Undercut reaction: if a car behind just pitted and is now on fresh rubber
        if (reactToUndercut && this.isUndercutThreat(driver, ctx)) {
            return { compound: this.nextCompound(driver, tyreStrategy) };
        }

        return null;
    }

    private isGoodLapToPit(driver: EngineDriver): boolean {
        // Pit if accumulated wear is at least 60% of the compound's natural wear at this age
        const expectedWear = driver.tyreDegradationRate * driver.tyreAge;
        return driver.tyreWear >= expectedWear * 0.6;
    }

    private isUndercutThreat(driver: EngineDriver, ctx: RaceContext): boolean {
        // Find the car immediately behind; if it pitted last lap and is now on low wear, react
        const behind = ctx.allDrivers.find(d => d.position === driver.position + 1);
        if (!behind) return false;

        // Heuristic: if the car behind has significantly less tyre wear it may undercut
        const wearDelta = driver.tyreWear - behind.tyreWear;
        return wearDelta > 25;
    }

    private nextCompound(driver: EngineDriver, strategy: TyreCompound[]): TyreCompound {
        // Find the next compound in the planned strategy after the one currently on
        const currentIdx = strategy.indexOf(driver.tyre as TyreCompound);
        return strategy[currentIdx + 1] ?? strategy.at(-1)!;
    }
}

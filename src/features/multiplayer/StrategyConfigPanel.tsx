import { useState } from 'react';
import { TyreCompound, DEFAULT_STRATEGY, type TeamStrategyProfile } from './index';

interface StrategyConfigPanelProps {
    initialStrategy?: TeamStrategyProfile;
    onSave: (strategy: TeamStrategyProfile) => void;
    /** If true, this config acts as the AI fallback when the player disconnects. */
    isFallback?: boolean;
}

export function StrategyConfigPanel({
    initialStrategy = DEFAULT_STRATEGY,
    onSave,
    isFallback = false,
}: StrategyConfigPanelProps) {
    const [strategy, setStrategy] = useState<TeamStrategyProfile>(initialStrategy);

    function setField<K extends keyof TeamStrategyProfile>(
        key: K,
        value: TeamStrategyProfile[K],
    ): void {
        setStrategy(prev => ({ ...prev, [key]: value }));
    }

    function toggleCompound(compound: TyreCompound): void {
        setStrategy(prev => {
            const has = prev.tyreStrategy.includes(compound);
            const next = has
                ? prev.tyreStrategy.filter(c => c !== compound)
                : [...prev.tyreStrategy, compound];
            return { ...prev, tyreStrategy: next.length > 0 ? next : prev.tyreStrategy };
        });
    }

    return (
        <div className="strategy-panel">
            {isFallback && (
                <p className="strategy-panel__notice">
                    Esta configuración será usada por la IA si te desconectas de la carrera.
                </p>
            )}

            <section>
                <h3>Neumáticos</h3>
                <div className="strategy-panel__compounds">
                    {Object.values(TyreCompound).map(c => (
                        <label key={c} className={`compound-tag compound-tag--${c.toLowerCase()}`}>
                            <input
                                type="checkbox"
                                checked={strategy.tyreStrategy.includes(c)}
                                onChange={() => toggleCompound(c)}
                            />
                            {c}
                        </label>
                    ))}
                </div>
                <p className="strategy-panel__hint">
                    Orden de uso: {strategy.tyreStrategy.join(' → ')}
                </p>
            </section>

            <section>
                <h3>Ventana de pit stop</h3>
                <label>
                    Vuelta mínima
                    <input
                        type="number"
                        min={1}
                        max={strategy.lapWindowEnd - 1}
                        value={strategy.lapWindowStart}
                        onChange={e => setField('lapWindowStart', Number(e.target.value))}
                    />
                </label>
                <label>
                    Vuelta máxima
                    <input
                        type="number"
                        min={strategy.lapWindowStart + 1}
                        value={strategy.lapWindowEnd}
                        onChange={e => setField('lapWindowEnd', Number(e.target.value))}
                    />
                </label>
                <label>
                    Desgaste máximo antes de pit ({strategy.wearThreshold}%)
                    <input
                        type="range"
                        min={40}
                        max={95}
                        value={strategy.wearThreshold}
                        onChange={e => setField('wearThreshold', Number(e.target.value))}
                    />
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={strategy.reactToUndercut}
                        onChange={e => setField('reactToUndercut', e.target.checked)}
                    />
                    Reaccionar a undercuts
                </label>
            </section>

            <section>
                <h3>Estilo de carrera</h3>
                <div className="strategy-panel__radio-group">
                    {(['aggressive', 'balanced', 'conservative'] as const).map(style => (
                        <label key={style}>
                            <input
                                type="radio"
                                name="raceStyle"
                                value={style}
                                checked={strategy.raceStyle === style}
                                onChange={() => setField('raceStyle', style)}
                            />
                            {style}
                        </label>
                    ))}
                </div>
            </section>

            <section>
                <h3>Modo ERS</h3>
                <div className="strategy-panel__radio-group">
                    {(['attack', 'balanced', 'harvest'] as const).map(mode => (
                        <label key={mode}>
                            <input
                                type="radio"
                                name="ersMode"
                                value={mode}
                                checked={strategy.ersMode === mode}
                                onChange={() => setField('ersMode', mode)}
                            />
                            {mode}
                        </label>
                    ))}
                </div>
            </section>

            <button
                className="strategy-panel__save"
                onClick={() => onSave(strategy)}
            >
                {isFallback ? 'Guardar configuración IA' : 'Confirmar estrategia'}
            </button>
        </div>
    );
}

import softTyreIcon from "@shared/assets/images/tyres/soft.svg";
import mediumTyreIcon from "@shared/assets/images/tyres/medium.svg";
import hardTyreIcon from "@shared/assets/images/tyres/hard.svg";

const SIZE = 40;
const CENTER = SIZE / 2;
const RADIUS = 18;
const CIRC = 2 * Math.PI * RADIUS;

const wearColor = (wear: number): string => {
    if (wear < 40) return '#4caf50';
    if (wear < 70) return '#ff9800';
    return '#f44336';
};

interface TyresProps {
    tyreType: "Soft" | "Medium" | "Hard";
    tyreWear?: number;
}

export const Tyres = ({ tyreType, tyreWear }: TyresProps) => {
    const getTyreIcon = (type: "Soft" | "Medium" | "Hard") => {
        switch (type) {
            case "Soft":   return softTyreIcon;
            case "Medium": return mediumTyreIcon;
            case "Hard":   return hardTyreIcon;
            default:       return softTyreIcon;
        }
    };

    if (tyreWear === undefined) {
        return <img src={getTyreIcon(tyreType)} alt={`${tyreType} Tyre`} width="32" />;
    }

    // Ring shows remaining grip: full at 0% wear, empty at 100%
    const offset = CIRC * (tyreWear / 100);
    const color  = wearColor(tyreWear);

    return (
        <svg width={SIZE} height={SIZE} style={{ display: 'block' }}>
            <circle
                cx={CENTER} cy={CENTER} r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={3}
            />
            <circle
                cx={CENTER} cy={CENTER} r={RADIUS}
                fill="none"
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
            <image
                href={getTyreIcon(tyreType)}
                x={(SIZE - 30) / 2}
                y={(SIZE - 30) / 2}
                width="30"
                height="30"
            />
        </svg>
    );
};
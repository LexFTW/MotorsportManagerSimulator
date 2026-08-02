import softTyreIcon from "@shared/assets/images/tyres/soft.svg";
import mediumTyreIcon from "@shared/assets/images/tyres/medium.svg";
import hardTyreIcon from "@shared/assets/images/tyres/hard.svg";

export const Tyres = ({ tyreType }: { tyreType: "Soft" | "Medium" | "Hard" }) => {
    const getTyreIcon = (type: "Soft" | "Medium" | "Hard") => {
        switch (type) {
            case "Soft":
                return softTyreIcon;
            case "Medium":
                return mediumTyreIcon;
            case "Hard":
                return hardTyreIcon;
            default:
                return softTyreIcon; // Default to soft tyre icon if type is unknown
        }
    };

    return (
        <img src={getTyreIcon(tyreType)} alt={`${tyreType} Tyre`} width="32" />
    );
};
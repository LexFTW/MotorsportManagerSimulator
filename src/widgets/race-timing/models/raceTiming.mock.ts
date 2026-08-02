import {
    audiLogo,
  ferrariLogo,
  haasLogo,
  mclarenLogo,
  mercedesLogo,
  redbullracingLogo,
  racingbullsLogo,
  williamsLogo,
  alpineLogo,
  astonMartinLogo,
} from "@/shared/assets/images/teams";

import type { RaceTimingRow } from "../types/RaceTimingRow";

export const raceTimingMock: RaceTimingRow[] = [
  // ==== 1. McLaren (ya existente) ====
  {
    position: 1,
    number: 81,
    code: "PIA",
    name: "Oscar Piastri",
    country: "AU",
    team: {
      name: "McLaren",
      color: "#FF8700",
      logo: mclarenLogo,
    },
    tyre: "Medium",
    laps: 23,
    interval: "Leader",
    lastLap: "1:20.512",
    bestLap: "1:20.101",
    ers: 81,
    fuel: 76,
    pitStops: 1,
  },
  {
    position: 2,
    number: 4,
    code: "NOR",
    name: "Lando Norris",
    country: "GB",
    team: {
      name: "McLaren",
      color: "#FF8700",
      logo: mclarenLogo,
    },
    tyre: "Medium",
    laps: 23,
    interval: "+1.247",
    lastLap: "1:20.623",
    bestLap: "1:20.222",
    ers: 74,
    fuel: 75,
    pitStops: 1,
  },

  // ==== 3. Red Bull Racing (ya existente) ====
  {
    position: 3,
    number: 1,
    code: "VER",
    name: "Max Verstappen",
    country: "NL",
    team: {
      name: "Red Bull Racing",
      color: "#1E41FF",
      logo: redbullracingLogo,
    },
    tyre: "Hard",
    laps: 23,
    interval: "+2.823",
    lastLap: "1:20.844",
    bestLap: "1:20.335",
    ers: 62,
    fuel: 71,
    pitStops: 1,
  },

  // ==== 4. Ferrari (ya existente) ====
  {
    position: 4,
    number: 16,
    code: "LEC",
    name: "Charles Leclerc",
    country: "MC",
    team: {
      name: "Ferrari",
      color: "#DC0000",
      logo: ferrariLogo,
    },
    tyre: "Hard",
    laps: 23,
    interval: "+4.195",
    lastLap: "1:20.992",
    bestLap: "1:20.611",
    ers: 69,
    fuel: 73,
    pitStops: 1,
  },

  // ==== 5. Mercedes (ya existente) ====
  {
    position: 5,
    number: 63,
    code: "RUS",
    name: "George Russell",
    country: "GB",
    team: {
      name: "Mercedes",
      color: "#00D2BE",
      logo: mercedesLogo,
    },
    tyre: "Soft",
    laps: 23,
    interval: "+5.743",
    lastLap: "1:21.102",
    bestLap: "1:20.734",
    ers: 51,
    fuel: 70,
    pitStops: 2,
  },

  // ==== 6. Mercedes #2 (Kimi Antonelli) ====
  {
    position: 6,
    number: 12,
    code: "ANT",
    name: "Kimi Antonelli",
    country: "IT",
    team: {
      name: "Mercedes",
      color: "#00D2BE",
      logo: mercedesLogo,
    },
    tyre: "Soft",
    laps: 23,
    interval: "+7.201",
    lastLap: "1:21.456",
    bestLap: "1:20.987",
    ers: 44,
    fuel: 67,
    pitStops: 2,
  },

  // ==== 7. Ferrari #2 (Lewis Hamilton) ====
  {
    position: 7,
    number: 44,
    code: "HAM",
    name: "Lewis Hamilton",
    country: "GB",
    team: {
      name: "Ferrari",
      color: "#DC0000",
      logo: ferrariLogo,
    },
    tyre: "Medium",
    laps: 23,
    interval: "+8.945",
    lastLap: "1:21.567",
    bestLap: "1:21.012",
    ers: 58,
    fuel: 69,
    pitStops: 1,
  },

  // ==== 8. Red Bull #2 (Sergio Pérez) ====
  {
    position: 8,
    number: 11,
    code: "PER",
    name: "Sergio Pérez",
    country: "MX",
    team: {
      name: "Red Bull Racing",
      color: "#1E41FF",
      logo: redbullracingLogo,
    },
    tyre: "Hard",
    laps: 23,
    interval: "+10.332",
    lastLap: "1:21.789",
    bestLap: "1:21.145",
    ers: 55,
    fuel: 68,
    pitStops: 1,
  },

  // ==== 9. Aston Martin (Fernando Alonso) ====
  {
    position: 9,
    number: 14,
    code: "ALO",
    name: "Fernando Alonso",
    country: "ES",
    team: {
      name: "Aston Martin",
      color: "#006F62",
      logo: astonMartinLogo, // Reemplaza con tu importación, ej: astonMartinLogo
    },
    tyre: "Medium",
    laps: 23,
    interval: "+12.104",
    lastLap: "1:21.902",
    bestLap: "1:21.321",
    ers: 49,
    fuel: 66,
    pitStops: 1,
  },

  // ==== 10. Aston Martin #2 (Lance Stroll) ====
  {
    position: 10,
    number: 18,
    code: "STR",
    name: "Lance Stroll",
    country: "CA",
    team: {
      name: "Aston Martin",
      color: "#006F62",
      logo: astonMartinLogo, // Reemplaza con tu importación, ej: astonMartinLogo
    },
    tyre: "Hard",
    laps: 23,
    interval: "+14.678",
    lastLap: "1:22.211",
    bestLap: "1:21.678",
    ers: 41,
    fuel: 64,
    pitStops: 2,
  },

  // ==== 11. Alpine (Pierre Gasly) ====
  {
    position: 11,
    number: 10,
    code: "GAS",
    name: "Pierre Gasly",
    country: "FR",
    team: {
      name: "Alpine",
      color: "#0090FF",
      logo: alpineLogo, // Reemplaza con alpineLogo
    },
    tyre: "Soft",
    laps: 23,
    interval: "+16.455",
    lastLap: "1:22.445",
    bestLap: "1:21.901",
    ers: 37,
    fuel: 62,
    pitStops: 2,
  },

  // ==== 12. Alpine #2 (Jack Doohan) ====
  {
    position: 12,
    number: 61,
    code: "DOO",
    name: "Jack Doohan",
    country: "AU",
    team: {
      name: "Alpine",
      color: "#0090FF",
      logo: alpineLogo, // Reemplaza con alpineLogo
    },
    tyre: "Soft",
    laps: 23,
    interval: "+18.982",
    lastLap: "1:22.789",
    bestLap: "1:22.123",
    ers: 33,
    fuel: 60,
    pitStops: 2,
  },

  // ==== 13. Williams (Alexander Albon) ====
  {
    position: 13,
    number: 23,
    code: "ALB",
    name: "Alexander Albon",
    country: "TH",
    team: {
      name: "Williams",
      color: "#00A3E0",
      logo: williamsLogo, // Reemplaza con williamsLogo
    },
    tyre: "Medium",
    laps: 23,
    interval: "+21.203",
    lastLap: "1:23.012",
    bestLap: "1:22.345",
    ers: 28,
    fuel: 58,
    pitStops: 1,
  },

  // ==== 14. Williams #2 (Franco Colapinto) ====
  {
    position: 14,
    number: 43,
    code: "COL",
    name: "Franco Colapinto",
    country: "AR",
    team: {
      name: "Williams",
      color: "#00A3E0",
      logo: williamsLogo,
    },
    tyre: "Hard",
    laps: 23,
    interval: "+23.876",
    lastLap: "1:23.345",
    bestLap: "1:22.567",
    ers: 24,
    fuel: 55,
    pitStops: 2,
  },

  // ==== 15. RB (Yuki Tsunoda) ====
  {
    position: 15,
    number: 22,
    code: "TSU",
    name: "Yuki Tsunoda",
    country: "JP",
    team: {
      name: "RB",
      color: "#6692FF",
      logo: racingbullsLogo, // Reemplaza con rbLogo
    },
    tyre: "Soft",
    laps: 23,
    interval: "+26.112",
    lastLap: "1:23.678",
    bestLap: "1:22.789",
    ers: 20,
    fuel: 52,
    pitStops: 2,
  },

  // ==== 16. RB #2 (Liam Lawson) ====
  {
    position: 16,
    number: 30,
    code: "LAW",
    name: "Liam Lawson",
    country: "NZ",
    team: {
      name: "RB",
      color: "#6692FF",
      logo: racingbullsLogo, // Reemplaza con rbLogo
    },
    tyre: "Soft",
    laps: 23,
    interval: "+28.554",
    lastLap: "1:23.901",
    bestLap: "1:23.011",
    ers: 17,
    fuel: 50,
    pitStops: 2,
  },

  // ==== 17. Sauber (Valtteri Bottas) ====
  {
    position: 17,
    number: 77,
    code: "BOT",
    name: "Valtteri Bottas",
    country: "FI",
    team: {
      name: "Audi",
      color: "#52E07C",
      logo: audiLogo,
    },
    tyre: "Hard",
    laps: 23,
    interval: "+30.987",
    lastLap: "1:24.234",
    bestLap: "1:23.456",
    ers: 14,
    fuel: 47,
    pitStops: 1,
  },

  // ==== 18. Sauber #2 (Zhou Guanyu) ====
  {
    position: 18,
    number: 24,
    code: "ZHO",
    name: "Zhou Guanyu",
    country: "CN",
    team: {
      name: "Audi",
      color: "#52E07C",
      logo: audiLogo,
    },
    tyre: "Hard",
    laps: 23,
    interval: "+33.421",
    lastLap: "1:24.567",
    bestLap: "1:23.789",
    ers: 10,
    fuel: 44,
    pitStops: 2,
  },

  // ==== 19. Haas (Esteban Ocon) ====
  {
    position: 19,
    number: 31,
    code: "OCO",
    name: "Esteban Ocon",
    country: "FR",
    team: {
      name: "Haas",
      color: "#B6B6B6",
      logo: haasLogo,
    },
    tyre: "Soft",
    laps: 22,
    interval: "+35.876",
    lastLap: "1:24.901",
    bestLap: "1:24.012",
    ers: 7,
    fuel: 41,
    pitStops: 2,
  },

  // ==== 20. Haas #2 (Oliver Bearman) ====
  {
    position: 20,
    number: 87,
    code: "BEA",
    name: "Oliver Bearman",
    country: "GB",
    team: {
      name: "Haas",
      color: "#B6B6B6",
      logo: haasLogo,
    },
    tyre: "Soft",
    laps: 22,
    interval: "+38.203",
    lastLap: "1:25.234",
    bestLap: "1:24.345",
    ers: 4,
    fuel: 38,
    pitStops: 2,
  },
];
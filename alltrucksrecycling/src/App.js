import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import CarPartCard from './CarPartCard';
import Slider from './slider.js'; 

function App() {
  const [items, setParts] = useState([]);
  const [makesArray, setMakes] = useState([]);
  const [modelsArray, setModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';
  const carData = [
    {
      make: "AMC",
      models: [
        "Ambassador", "American", "AMX", "Classic", "Concord", "Eagle", "Gremlin", "Hornet", "Javelin", "Marlin",
        "Matador", "Pacer", "Rambler", "Rebel", "Spirit", "Other"
      ]
    },
    {
      make: "Acura",
      models: [
        "CL", "CSX", "EL", "ILX", "Integra", "Legend", "MDX", "NSX", "RDX", "RL", "RLX", "RSX", "SLX", "TL", "TLX", 
        "TSX", "Vigor", "ZDX"
      ]
    },
    {
      make: "Alfa",
      models: [
        "147", "164 Sedan", "1750", "4C", "Alfetta", "GTV6", "Giulia", "Giulia 1600", "Giulietta", "Milano", "Mito",
        "Spider-1600", "Spider-1600 Duetto", "Spider-2000", "Stelvio", "Tonale"
      ]
    },
    {
      make: "Aston Martin",
      models: []
    },
    {
      make: "Asuna",
      models: []
    },
    {
      make: "Audi",
      models: [
        "100", "200", "4000 2 & 4 Door Sedan", "4000 Quattro", "5000 & 5000 Quattro", "80 Series", "90 Series", "A3",
        "A4", "A5", "A6", "A7", "A8", "AllRoad", "AllRoad A4", "AllRoad A6", "Cabriolet", "Coupe GT", "Coupe Quattro",
        "E-tron", "E-tron GT", "E-tron S", "Fox", "Q3", "Q4 E-tron", "Q5", "Q7", "Q8", "R8", "RS3", "RS4", "RS5",
        "RS6", "RS7", "RS E-tron GT", "RS Q8", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "SQ8", "Sport Coupe",
        "Super 90", "TT", "V8 Quattro"
      ]
    },
    {
      make: "Austin",
      models: ["Mini"]
    },
    {
      make: "Autocar",
      models: []
    },
    {
      make: "Avanti",
      models: []
    },
    {
      make: "BMW",
    models: [
      "1M", "128i", "135i", "1602", "1800", "228i", "230i", "2002",
      "2500", "2800", "3.0", "318i", "320i", "323i", "325e", "325i",
      "328i", "328i GT", "330e", "330i", "330i GT", "335i", "335i GT",
      "340i", "340i GT", "428i", "430i", "435i", "440i", "524TD", "525i",
      "528e", "528i", "530e", "530i", "533i", "535i", "535i GT", "540i",
      "545i", "550i", "550i GT", "630CSi", "633CSi", "635CSi", "640i",
      "640i GT", "645Ci", "650i", "728", "732", "733i", "735i", "740e",
      "740i", "745e", "745i", "750i", "760i", "840ci", "840i", "850i",
      "ActiveE", "ActiveHybrid 3", "ActiveHybrid 5", "ActiveHybrid 7", "Alpina B6",
      "Alpina B7", "Alpina B8", "Alpina XB7", "I3", "I4", "I7", "I8", "IX",
      "L6", "Mini Cooper", "Mini Cooper Clubman", "Mini Cooper Countryman", "Mini Cooper Paceman",
      "M1", "M2", "M3", "M4", "M5", "M6", "M8", "M235i", "M240i",
      "M340i", "M440i", "M550i", "M760i", "M850i", "X1", "X2", "X3", "X3M",
      "X4", "X4M", "X5", "X5M", "X6", "X6M", "X7", "XM", "Z3", "Z4",
      "Z8", "Other"
    ]
  },
  {
    make: "Bentley",
    models: [
      "Arnage", "Azure", "Bentayga", "Brooklands", "Continental", "Corniche",
      "Eight", "Flying Spur", "Mulsanne", "Turbo R"
    ]
  },
  {
    make: "Bricklin",
    models: []
  },
  {
    make: "Brockway",
    models: []
  },
  {
    make: "Buick",
    models: [
      "Allure", "Apollo", "Cascada", "Century", "Electra (1979 Down)", "Electra (1980 Up)",
      "Enclave", "Encore", "Encore GX", "Envision", "Envista", "Lacrosse", "LeSabre (1979 Down)",
      "LeSabre (1980 Up)", "Limited", "Lucerne", "Park Ave (1979 Down)", "Park Ave (1980 Up)",
      "Rainier", "Reatta", "Regal", "Regal Somerset (1984 Down)", "Rendezvous", "Riviera",
      "Roadmaster (1979 Down)", "Roadmaster (1980 Up)", "Skyhawk", "Skylark", "Somerset (1985 Up)",
      "Special", "Terraza", "Verano", "Other"
    ]
  },
  {
    make: "Cadillac",
    models: [
      "Allante",
      "ATS",
      "Brougham",
      "CT4",
      "CT5",
      "CT6",
      "CTS",
      "Catera",
      "Cimarron",
      "Concours",
      "DeVille (1979 Down)",
      "DeVille (1980 Up)",
      "DHS",
      "DTS (2005 Down)",
      "DTS (2006 Up)",
      "ELR",
      "Eldorado (1966 Down)",
      "Eldorado (1967 Up)",
      "Escalade",
      "Escalade-ESV",
      "Escalade-EXT",
      "Fleetwood (1979 Down)",
      "Fleetwood (1980 Up)",
      "LYRIQ",
      "Seville (incl STS)",
      "SRX",
      "STS",
      "XLR",
      "XT4",
      "XT5",
      "XT6",
      "XTS",
      "Other"
    ]
  },
  {
    make: "Checker",
    models: [
      "Checker",
      "Checker Cab"
    ]
  },
  {
    make: "Chevy",
    models: [
      "Astra",
      "Astro",
      "Aveo",
      "Beretta",
      "Blazer, Full Size (1994 Down)",
      "Blazer (2019 Up)",
      "Blazer, S10/S15",
      "Bolt",
      "Bolt EUV",
      "C2",
      "Camaro",
      "Caprice (1979 Down)",
      "Caprice (1980 Up)",
      "Captiva Sport",
      "Cavalier",
      "Celebrity",
      "Chevelle",
      "Chevette",
      "Chevy Pickup FWD (Non US Mkt)",
      "Chevy Small Car (Non US Mkt)",
      "Citation",
      "City Express",
      "Cobalt",
      "Corsa",
      "Corsica",
      "Corvair",
      "Corvette",
      "Cruze",
      "El Camino (1963 Down)",
      "El Camino (1964-1977)",
      "El Camino (1978 Up)",
      "Epica",
      "Equinox",
      "HHR",
      "Impala (1979 Down)",
      "Impala (1980 Up)",
      "Lumina Car",
      "Lumina Van",
      "Luv (See Also Isuzu Mini P-Up)",
      "Malibu",
      "Meriva",
      "Metro",
      "Monte Carlo",
      "Monza",
      "Nova & Chevy II (1967 Down)",
      "Nova (1968 Up)",
      "Optra",
      "Orlando",
      "Prizm",
      "S10/S15/Sonoma",
      "Sonic",
      "Spark",
      "Spectrum",
      "Sprint",
      "SS",
      "SSR",
      "Suburban-10 (1988 Down)",
      "Suburban-20 (1988 Down)",
      "Suburban-30 (1966 Down)",
      "Suburban-1000 (1963-1966)",
      "Suburban-1500",
      "Suburban-2500 (1967 Up)",
      "Suburban-3500",
      "Tahoe",
      "Tigra",
      "Tornado",
      "Tracker",
      "TrailBlazer",
      "TrailBlazer-EXT",
      "Traverse",
      "Trax",
      "Truck-10 Series (1987 Down)",
      "Truck-20 Series (1988 Down)",
      "Truck-30 Series (1988 Down)",
      "Truck-1500 Series (1988-1999)",
      "Truck-2500 Series (1988-2000)",
      "Truck-3500 Series (1988-2001)",
      "Truck-Avalanche 1500",
      "Truck-Avalanche 2500",
      "Truck-C3100",
      "Truck-C3600",
      "Truck-C3800",
      "Truck-Colorado",
      "Truck-Forward Control",
      "Truck-Kodiak",
      "Truck-Luv Mini Pup",
      "Truck-S10/S15/Sonoma",
      "Truck-Silverado 1500 (1999 Up)",
      "Truck-Silverado 2500 (1999 Up)",
      "Truck-Silverado 3500 (2001 Up)",
      "Truck-Tilt Cab",
      "Uplander",
      "Van 10",
      "Van 20",
      "Van 30",
      "Van Express 1500",
      "Van Express 2500",
      "Van Express 3500",
      "Vectra",
      "Vega",
      "Venture",
      "Volt",
      "Zafira",
      "Other"
    ]
  },
  {
    make: "Chrysler",
    models: [
      "200",
      "300",
      "300M",
      "Aspen",
      "Atos",
      "Attitude",
      "Cirrus",
      "Concorde",
      "Conquest",
      "Cordoba",
      "Crossfire",
      "E Class",
      "Fifth Avenue - FWD",
      "Fifth Avenue - RWD (1979 Up)",
      "Imperial",
      "LHS",
      "Laser",
      "Lebaron",
      "New Yorker - FWD",
      "New Yorker - RWD",
      "Newport",
      "Pacifica",
      "Prowler",
      "PT Cruiser",
      "Sebring",
      "TC",
      "Town and Country",
      "Voyager",
      "Other"
    ]
  },
  {
    make: "Citroen",
    models: [
      "Citroen"
    ]
  },
  {
    make: "Daewoo",
    models: [
      "Lanos",
      "Leganza",
      "Nubira"
    ]
  },
  {
    make: "Daihatsu",
    models: [
      "Charade",
      "Hijet",
      "Rocky"
    ]
  },
  {
    make: "Delorean",
    models: [
      "Delorean"
    ]
  },
  {
    make: "Desoto",
    models: [
      "Desoto"
    ]
  },
  {
    make: "Diamond Reo",
    models: [
      "Diamond Reo"
    ]
  },
  {
    make: "Dodge",
    models: [
      "400",
      "600",
      "Aries",
      "Aspen",
      "Avenger",
      "Caliber",
      "Caravan",
      "Challenger (Chrysler)",
      "Challenger (Mitsubishi)",
      "Charger",
      "Colt-not Vista",
      "Colt Vista",
      "Cricket",
      "D50/Ram 50 (See also Plymouth Arrow Truck)",
      "Dakota",
      "Dart",
      "Daytona",
      "Diplomat",
      "Durango",
      "Dynasty",
      "Intrepid",
      "Journey",
      "Lancer",
      "Magnum",
      "Mirada",
      "Monaco (1978 Down)",
      "Monaco (1990 Up)",
      "Neon",
      "Nitro",
      "Omni",
      "Raider",
      "Ramcharger",
      "Rampage",
      "Shadow",
      "Spirit",
      "St Regis",
      "Stealth",
      "Stratus",
      "Truck-100 Series (1989 Down)",
      "Truck-200 Series (1980 Down)",
      "Truck-300 Series (1980 Down)",
      "Truck-400 Series",
      "Truck-150 (1978-1993)",
      "Truck-250 Series (1981-1993)",
      "Truck-350 Series (1981-1993)",
      "Truck-450 Series",
      "Truck-1500 (1994 Up)",
      "Truck-2500 Series (1994 Up)",
      "Truck-3500 (1994 Up)",
      "Truck-4500 Series",
      "Truck-5500 Series",
      "Truck-D50/Ram 50",
      "Truck-Dakota",
      "Truck-Forward Control",
      "Truck-Rampage",
      "Van 100",
      "Van 150",
      "Van 200",
      "Van 250",
      "Van 300",
      "Van 350",
      "Van 1500",
      "Van 2500",
      "Van 3500",
      "Van (Sprinter 2500)",
      "Van (Sprinter 3500)",
      "Verna",
      "Viper",
      "Other"
    ]
  },
  {
    make: "Eagle",
    models: [
      "2000 GTX",
      "Premier",
      "Summit",
      "Talon",
      "Vision"
    ]
  },
  {
    make: "Edsel",
    models: [
      "Edsel"
    ]
  },
  {
    make: "FWD Trucks",
    models: [
      "FWD Trucks"
    ]
  },
  {
    make: "Ferrari",
    models: [
      "Ferrari"
    ]
  },
  {
    make: "Fiat",
    models: [
      "1100R",
      "124 (1983 Down, includes Spider)",
      "124 Spider (2016 Up)",
      "128",
      "131/Brava",
      "500",
      "600",
      "850",
      "Spider (includes 2000)",
      "Strada",
      "X 1/9"
    ]
  },{
    make: "Ford",
    models: [
      "500",
      "Aerostar",
      "Aspire",
      "Bronco (Full Size)",
      "Bronco II",
      "Bronco Raptor",
      "Bronco Sport",
      "C-Max",
      "Contour",
      "Cortina",
      "Courier",
      "Crown Vic (1982 Down)",
      "Crown Vic (1983 Up)",
      "E Transit",
      "Ecosport",
      "Edge",
      "Escape",
      "Escort",
      "Excursion",
      "EXP",
      "Expedition",
      "Explorer",
      "Fairlane",
      "Fairmont",
      "Falcon",
      "Festiva",
      "Fiesta",
      "Five Hundred",
      "Flex",
      "Focus",
      "Focus RS",
      "Freestar",
      "Freestyle",
      "Fusion",
      "Galaxie",
      "Granada",
      "GT",
      "Ikon",
      "KA",
      "LTD (1978 Down)",
      "LTD (1979 Up)",
      "LTD II",
      "Maverick",
      "Maverick Pickup",
      "Mondeo",
      "Mustang",
      "Mustang Mach E",
      "Pinto",
      "Probe",
      "Ranchero (1967-1970)",
      "Ranchero (1971-1976)",
      "Ranchero (1977 up)",
      "Ranchero (1957-1959)",
      "Ranchero (1960-1966)",
      "Ranger",
      "Taurus",
      "Taurus X",
      "Tempo",
      "ThinkCity-Electric",
      "Thunderbird",
      "Torino",
      "Transit 150",
      "Transit 250",
      "Transit 350",
      "Transit Connect",
      "Truck-Courier",
      "Truck-F100",
      "Truck-F150",
      "Truck F150 Lightning (Electric)",
      "Truck-F150 Lightning (SVT Gas)",
      "Truck-F150 Raptor",
      "Truck-F250 not Super Duty (1999 Down)",
      "Truck-F250 Super Duty (1999 Up)",
      "Truck-F350 not Super Duty (1997 Down)",
      "Truck-F350 Super Duty (1999 Up)",
      "Truck-F450 not Super Duty (1997 Down)",
      "Truck-F450 Super Duty (1999 Up)",
      "Truck-F550 Super Duty (1999 Up)",
      "Truck-Forward Control",
      "Truck-Ranger",
      "Van E100",
      "Van E150",
      "Van E200",
      "Van E250",
      "Van E300",
      "Van E350",
      "Van E450 Super Duty",
      "Van E550 Super Duty",
      "Windstar",
      "Other"
    ]
  },
  {
    make: "Fisker",
    models: [
      "Karma"
    ]
  },{
    make: "Freightliner",
    models: [
      "Freightliner"
    ]
  },
  {
    make: "Freuhauf",
    models: [
      "Freuhauf"
    ]
  },
  {
    make: "GMC",
    models: [
      "Acadia",
      "Hummer EV",
      "Jimmy, Full Size",
      "Jimmy, S10/S15",
      "Safari Van",
      "Sprint",
      "Suburban-10 (1988 Down)",
      "Suburban-20 (1988 Down)",
      "Suburban-30 (1965-1966)",
      "Suburban-1000 (1965-1966)",
      "Suburban-1500 (2001 Down)",
      "Suburban-2500 (1967 Up)",
      "Syclone",
      "Terrain",
      "Truck-1000 Series (1966 Down)",
      "Truck-1500 Series (1999 Down)",
      "Truck-2500 Series (2000 Down)",
      "Truck-3500 Series (2001 Down)",
      "Truck-Canyon",
      "Truck-Envoy",
      "Truck-Envoy XL",
      "Truck-Envoy XUV",
      "Truck-Forward Control",
      "Truck-S10/S15/Sonoma",
      "Truck-Sierra 1500 (1999 Up)",
      "Truck-Sierra 2500 (1999 Up)",
      "Truck-Sierra 3500 (2001 Up)",
      "Truck-Sierra Denali",
      "Truck-Sierra Denali 1500 (2011 Up)",
      "Truck-Sierra Denali 2500 (2011 Up)",
      "Truck-Sierra Denali 3500 (2011 Up)",
      "Truck-Topkick",
      "Truck-Yukon (except XL)",
      "Truck-Yukon XL1500",
      "Truck-Yukon XL2500",
      "Typhoon",
      "Van 1000",
      "Van 1500",
      "Van 2500",
      "Van 3500",
      "Van Savana 1500",
      "Van Savana 2500",
      "Van Savana 3500"
    ]
  },
  {
    make: "Genesis",
    models: [
      "G70",
      "G80",
      "G90",
      "GV60",
      "GV70",
      "GV80"
    ]
  },
  {
    make: "Geo",
    models: [
      "Metro",
      "Prizm",
      "Spectrum",
      "Storm",
      "Tracker"
    ]
  },
  {
    make: "Hino",
    models: [
      "Truck"
    ]
  },
  {
    make: "Honda",
    models: [
      "600",
      "Accord",
      "Acty",
      "Civic",
      "Clarity",
      "Clarity Electric",
      "Clarity Fuel Cell",
      "Crosstour",
      "CRV",
      "CRX",
      "CRZ",
      "DelSol",
      "Element",
      "FCX",
      "Fit",
      "HRV",
      "Insight",
      "Odyssey",
      "Passport",
      "Pilot",
      "Prelude",
      "Ridgeline",
      "S2000"
    ]
  },
  {
    make: "Hudson",
    models: [
      "Hudson"
    ]
  },
  {
    make: "Hummer",
    models: [
      "Hummer",
      "H1",
      "H2",
      "H3"
    ]
  },{
    make: "Hyundai",
    models: [
      "Accent",
      "Azera",
      "Elantra",
      "Entourage",
      "Equus",
      "Excel",
      "Genesis",
      "Ioniq",
      "Ioniq 5",
      "Ioniq 6",
      "Kona",
      "Kona Electric",
      "Nexo",
      "Palisade",
      "Pony",
      "Santa Cruz",
      "Santa Fe",
      "Scoupe",
      "Sonata",
      "Stellar",
      "Tiburon",
      "Tucson",
      "Veloster",
      "Venue",
      "Veracruz",
      "XG Series"
    ]
  },
  {
    make: "IH",
    models: [
      "Pickup & Travelall",
      "Scout & Scout II",
      "Truck (Big)"
    ]
  },
  {
    make: "Infiniti",
    models: [
      "EX35",
      "EX37",
      "FX",
      "G20",
      "G25",
      "G35",
      "G37",
      "I30",
      "I35",
      "J30",
      "JX35",
      "M30",
      "M35",
      "M37",
      "M45",
      "M56",
      "Q40",
      "Q45",
      "Q50",
      "Q60",
      "Q70",
      "QX4",
      "QX30",
      "QX50",
      "QX55",
      "QX56",
      "QX60",
      "QX70",
      "QX80"
    ]
  },
  {
    make: "Isuzu",
    models: [
      "Amigo",
      "Ascender",
      "Axiom",
      "Gemini",
      "IMark",
      "Impulse",
      "Oasis",
      "Optima",
      "Reach",
      "Rodeo",
      "Stylus",
      "Trooper/Trooper II",
      "Truck (Big)",
      "Truck-(Mini Pickup)",
      "Truck-(Mini Pickup) Hombre",
      "Truck i280 (Pickup)",
      "Truck i290 (Pickup)",
      "Truck i350 (Pickup)",
      "Truck i370 (Pickup)",
      "Vehicross"
    ]
  },
  {
    make: "Jaguar",
    models: [
      "120",
      "140",
      "150",
      "E Pace",
      "F Pace",
      "F Type",
      "I Pace",
      "Mark 10",
      "S Type",
      "Sedan",
      "Vanden Plas (1997 Down)",
      "Vanden Plas (1998 to 2007)",
      "Vanden Plas (2008 Up)",
      "X Type",
      "XE",
      "XF",
      "XF Sportbrake",
      "XJ Series (2008 Up)",
      "XJR (1993)",
      "XJR (1995 to 1997)",
      "XJR (1998 to 2007)",
      "XJR (2008 Up)",
      "XJS",
      "XJ6",
      "XJ8 (2008 Up)",
      "XJ8 (2007 Down)",
      "XJ12",
      "XK Series (2007 Up)",
      "XKE",
      "XKR (2006 Down)",
      "XKR (2007 Up)",
      "XK8"
    ]
  },
  {
    make: "Jeep",
    models: [
      "Cherokee (except Grand Cherokee)",
      "CJSeries",
      "Comanche",
      "Commander",
      "Compass",
      "DJ Series",
      "FC Series",
      "Gladiator",
      "Grand Cherokee",
      "Grand Wagoneer",
      "J-Series",
      "Jeepster",
      "Liberty",
      "Patriot",
      "Renegade",
      "Station Wagon",
      "Truck",
      "Wagoneer (except Grand Wagoneer)",
      "Wrangler"
    ]
  },
  {
    make: "Kaiser",
    models: [
      "Kaiser"
    ]
  },
  {
    make: "Kenworth",
    models: [
      "Kenworth"
    ]
  },
  {
    make: "Kia",
    models: [
      "Amanti",
      "Besta",
      "Borrego",
      "Cadenza",
      "Carnival",
      "EV6",
      "Forte",
      "K5",
      "K900",
      "Magentis",
      "Niro",
      "Niro EV",
      "Optima",
      "Rio",
      "Rondo",
      "Sedona",
      "Seltos",
      "Sephia",
      "Sorento",
      "Soul",
      "Spectra",
      "Sportage",
      "Stinger",
      "Telluride"
    ]
  },
  {
    make: "Lada",
    models: [
      "Lada"
    ]
  },
  {
    make: "Lamborghini",
    models: [
      "Lamborghini"
    ]
  },
  {
    make: "Lancia",
    models: [
      "Lancia"
    ]
  },
  {
    make: "LandRover",
    models: [
      "Defender (1997 Down)",
      "Defender (2020 Up)",
      "Discovery (2004 Down)",
      "Discovery (2017 Up)",
      "Discovery Sport",
      "Freelander",
      "LR2",
      "LR3",
      "LR4",
      "Range Rover",
      "Range Rover Evoque",
      "Range Rover Sport",
      "Range Rover Velar",
      "Other"
    ]
  },
  {
    make: "Lexus",
    models: [
      "CT 200H",
      "ES250",
      "ES300",
      "ES300H",
      "ES330",
      "ES350",
      "GS200t",
      "GS300",
      "GS350",
      "GS400",
      "GS430",
      "GS450",
      "GS460",
      "GS F",
      "GX460",
      "GX470",
      "HS250H",
      "IS200t",
      "IS250",
      "IS300",
      "IS350",
      "IS500",
      "IS F",
      "LC500",
      "LC500h",
      "LFA",
      "LS400",
      "LS430",
      "LS460",
      "LS500",
      "LS500h",
      "LS600HL",
      "LX450",
      "LX470",
      "LX570",
      "LX600",
      "NX200t",
      "NX250",
      "NX300",
      "NX300h",
      "NX350",
      "NX350H",
      "NX450h+",
      "RC 200t",
      "RC 300",
      "RC 350",
      "RC F",
      "RX300",
      "RX330",
      "RX350",
      "RX350h",
      "RX350L",
      "RX400h",
      "RX450 Hybrid",
      "RX450 Hybrid L",
      "RX500h",
      "RZ450e",
      "SC (excl 430)",
      "SC430",
      "UX 200",
      "UX 250h"
    ]
  },
  {
    make: "Lincoln",
    models: [
      "Aviator",
      "Blackwood",
      "Continental",
      "Corsair",
      "LS",
      "Mark LT",
      "Mark Series",
      "MKC",
      "MKS",
      "MKT",
      "MKX",
      "MKZ",
      "Nautilus",
      "Navigator",
      "Versailles",
      "Zephyr",
      "Other (includes Town Car)"
    ]
  },
  {
    make: "Lotus",
    models: [
      "Lotus"
    ]
  },
  {
    make: "MG",
    models: [
      "MGB",
      "Midget",
      "Other"
    ]
  },
  {
    make: "Mac",
    models: [
      "Mac"
    ]
  },
  {
    make: "Marmon",
    models: [
      "Truck"
    ]
  },
  {
    make: "Maserati",
    models: [
      "Maserati",
      "BiTurbo",
      "Ghibli",
      "GranTurismo",
      "Grecale",
      "Grecale GT",
      "Levante",
      "Quattroporte"
    ]
  },
  {
    make: "Maybach",
    models: [
      "Maybach"
    ]
  },
  {
    make: "Mazda",
    models: [
      "2",
      "3",
      "5",
      "6",
      "323",
      "626",
      "808",
      "929",
      "1200",
      "1800",
      "Cosmo",
      "CX3",
      "CX5",
      "CX7",
      "CX9",
      "CX30",
      "CX50",
      "CX90",
      "GLC",
      "MPV Van",
      "MX3",
      "MX6",
      "MX30",
      "Miata MX5",
      "Millenia",
      "Navajo",
      "Pickup-B1600",
      "Pickup-B1800",
      "Pickup-B2000",
      "Pickup-B2200",
      "Pickup-B2300",
      "Pickup-B2500",
      "Pickup-B2600",
      "Pickup-B3000",
      "Pickup-B4000",
      "Pickup-Rotary",
      "Protege",
      "RX2",
      "RX3",
      "RX4",
      "RX7",
      "RX8",
      "Tribute"
    ]
  },
  {
    make: "McLaren",
    models: [
      "570GT",
      "570S",
      "600LT",
      "620R",
      "650S",
      "675LT",
      "720S",
      "765LT",
      "Artura",
      "GT",
      "MP4 12C",
      "P1",
      "Senna"
    ]
  },
  {
    make: "Mercedes",
    models: [
      "170",
      "190",
      "200",
      "218",
      "219",
      "220",
      "230-4 Cyl",
      "230-6 Cyl",
      "240D",
      "250",
      "260E",
      "280",
      "300D (includes CD/D/SD/TD)",
      "300E",
      "300SL",
      "320",
      "350",
      "380",
      "400",
      "420",
      "450",
      "500",
      "560",
      "600",
      "AMG GT",
      "A Class",
      "B Class",
      "C Class",
      "CL Class",
      "CLA Class",
      "CLK",
      "CLS",
      "E Class",
      "EQB Class",
      "EQE Class",
      "EQE Class SUV",
      "EQS Class",
      "EQS Class SUV",
      "G Class",
      "GL Class",
      "GLA Class",
      "GLB Class",
      "GLC Class",
      "GLE Class",
      "GLK Class",
      "GLS Class",
      "ML Series",
      "Metris",
      "R Class",
      "S Class",
      "SL Class",
      "SLC Class",
      "SLK",
      "SLR",
      "SLS",
      "Sprinter 1500",
      "Sprinter 2500",
      "Sprinter 3500",
      "Sprinter 4500",
      "Truck"
    ]
  },
  {
    make: "Mercury",
    models: [
      "Bobcat",
      "Capri",
      "Comet",
      "Cougar",
      "Grand Marquis (1979 Down)",
      "Grand Marquis (1980 Up)",
      "LN7",
      "Lynx (except LN7)",
      "Marauder",
      "Mariner",
      "Marquis (not Grand)",
      "Merkur (includes XR4TI and Scorpio)",
      "Milan",
      "Monarch",
      "Montego",
      "Monterey",
      "Mountaineer",
      "Mystique",
      "Sable",
      "Topaz",
      "Tracer",
      "Villager",
      "Zephyr",
      "Other"
    ]
  },
  {
    make: "Mini",
    models: [
      "(Austin)",
      "Cooper",
      "Cooper Clubman",
      "Cooper Countryman",
      "Cooper Paceman"
    ]
  },
  {
    make: "Mitsubishi",
    models: [
      "3000",
      "Cordia",
      "Diamante",
      "Eclipse",
      "Eclipse Cross",
      "Endeavor",
      "Expo",
      "Fuso",
      "Galant",
      "i MiEV",
      "Lancer",
      "Minicab",
      "Mirage",
      "Montero",
      "Montero-Sport",
      "Outlander",
      "Outlander Sport",
      "Pickup (See also Dodge D50)",
      "Precis",
      "Raider",
      "RVR",
      "Sigma",
      "Space Wagon",
      "Starion",
      "Tredia",
      "Van"
    ]
  },
  {
    make: "Morris",
    models: [
      "Morris"
    ]
  },
  {
    make: "Nash",
    models: [
      "Nash"
    ]
  },
  {
    make: "Nissan",
    models: [
      "200SX",
      "240SX",
      "300ZX",
      "350Z",
      "370Z",
      "Altima",
      "Armada",
      "Axxess",
      "Cube",
      "Frontier",
      "GT-R",
      "Juke",
      "Kicks",
      "Leaf",
      "Maxima",
      "Murano",
      "NV",
      "NV Cargo",
      "NV Passenger",
      "NV200",
      "NX",
      "Pathfinder",
      "Pickup",
      "Pulsar",
      "Quest",
      "Rogue",
      "Rogue Sport",
      "Sentra",
      "Stanza",
      "Titan",
      "Titan XD",
      "Van",
      "Versa",
      "Versa Note",
      "Xterra",
      "X-Trail"
    ]
  },
  {
    make: "Oldsmobile",
    models: [
      "88 (1979 Down)",
      "88 (1980 Up)",
      "98 (1979 Down)",
      "98 (1980 Up)",
      "Achieva",
      "Alero",
      "Aurora",
      "Bravada",
      "Calais (1984 Down)",
      "Calais (1985 Up)",
      "Ciera",
      "Custom Cruiser (1979 Down)",
      "Custom Cruiser (1980 Up)",
      "Cutlass (1972 Down)",
      "Cutlass (1973 Up)",
      "F85",
      "Firenza",
      "Intrigue",
      "Omega",
      "Silhouette",
      "Starfire",
      "Supreme-Calais (1988 Up)",
      "Supreme-Cutlass (1988 Up)",
      "Supreme (1972 Down)",
      "Supreme (1973-1987)",
      "Toronado",
      "Other"
    ]
  },
  {
    make: "Opel",
    models: [
      "Opel"
    ]
  },
  {
    make: "Oshkosh",
    models: [
      "Oshkosh"
    ]
  },
  {
    make: "Pace Arrow",
    models: [
      "Pace Arrow"
    ]
  },
  {
    make: "Packard",
    models: [
      "Packard"
    ]
  },
  {
    make: "Pantera",
    models: [
      "Pantera"
    ]
  },
  {
    make: "Peterbilt",
    models: [
      "Peterbilt"
    ]
  },
  {
    make: "Peugeot",
    models: [
      "304",
      "403",
      "404",
      "405",
      "504",
      "505",
      "604"
    ]
  },
  {
    make: "Plymouth",
    models: [
      "Acclaim",
      "Arrow-Car",
      "Arrow-Truck (See also Dodge D50)",
      "Barracuda",
      "Breeze",
      "Caravelle",
      "Champ",
      "Cricket",
      "Duster (1970-1976)",
      "Duster (1979-1980)",
      "Duster (1985-1987)",
      "Duster (1992-1994)",
      "Grand Fury (1979 Down)",
      "Grand Fury (1980 Up)",
      "Horizon",
      "Laser",
      "Neon",
      "Prowler",
      "Reliant",
      "Sapporo",
      "Scamp (1983 only)",
      "Scamp (except 1983)",
      "Sundance",
      "Trailduster",
      "Valiant",
      "Van 100",
      "Van 150",
      "Van 200",
      "Van 250",
      "Van 300",
      "Van 350",
      "Volare",
      "Voyager",
      "Other"
    ]
  },
  {
    make: "Citroen",
    models: [
      "Citroen"
    ]
  },
  {
    make: "Daewoo",
    models: [
      "Lanos",
      "Leganza",
      "Nubira"
    ]
  },
  {
    make: "Polestar",
    models: [
      "Polestar 1",
      "Polestar 2"
    ]
  },
  {
    make: "Pontiac",
    models: [
      "Pontiac 1000",
      "Pontiac 2000-P/J/Sunbird",
      "Pontiac 6000",
      "Pontiac Acadian",
      "Pontiac Astre",
      "Pontiac Aztek",
      "Pontiac Bonneville (1979 Down)",
      "Pontiac Bonneville (1980 Up)",
      "Pontiac Catalina (1979 Down)",
      "Pontiac Catalina (1980 Up)",
      "Pontiac Fiero",
      "Pontiac Firebird",
      "Pontiac Firefly",
      "Pontiac G3",
      "Pontiac G4",
      "Pontiac G5",
      "Pontiac G6",
      "Pontiac G8",
      "Pontiac Grand AM",
      "Pontiac Grand Prix",
      "Pontiac GTO (New Style)",
      "Pontiac GTO (Old Style)",
      "Pontiac Lemans",
      "Pontiac Matiz",
      "Pontiac Montana",
      "Pontiac Parisienne (1979 Down)",
      "Pontiac Parisienne (1980 Up)",
      "Pontiac Phoenix",
      "Pontiac Pursuit",
      "Pontiac Solstice",
      "Pontiac Sunbird",
      "Pontiac Sunburst",
      "Pontiac Sunfire",
      "Pontiac Sunrunner",
      "Pontiac Tempest",
      "Pontiac Torrent",
      "Pontiac Trans Sport",
      "Pontiac Van-Montana",
      "Pontiac Ventura",
      "Pontiac Vibe",
      "Pontiac Wave",
      "Pontiac Other"
    ]
  },
  {
    make: "Porsche",
    models: [
      "Porsche 356",
      "Porsche 911/930",
      "Porsche 912/e",
      "Porsche 914",
      "Porsche 918",
      "Porsche 924",
      "Porsche 928",
      "Porsche 944",
      "Porsche 968",
      "Porsche Boxster",
      "Porsche Carrera-GT",
      "Porsche Cayenne",
      "Porsche Cayman S",
      "Porsche Macan",
      "Porsche Panamera",
      "Porsche Taycan"
    ]
  },
  {
    make: "Renault",
    models: [
      "Renault 18I",
      "Renault Alliance",
      "Renault Clio",
      "Renault Dauphine",
      "Renault Encore",
      "Renault Fuego",
      "Renault Gordini",
      "Renault Lecar/R5",
      "Renault Medallion",
      "Renault Megane",
      "Renault R8",
      "Renault R10",
      "Renault R12",
      "Renault R15",
      "Renault R16",
      "Renault R17",
      "Renault R30",
      "Renault Other"
    ]
  },
  {
    make: "Ram",
    models: [
      "Ram Promaster 1500",
      "Ram Promaster 2500",
      "Ram Promaster 3500",
      "Ram Promaster City",
      "Ram Truck 1500 Series",
      "Ram Truck 2500 Series",
      "Ram Truck 3500 Series",
      "Ram Truck 4500 Series",
      "Ram Truck 5500 Series"
    ]
  },
  {
    make: "REO",
    models: [
      "REO"
    ]
  },
  {
    make: "Rivian",
    models: [
      "Rivian R1S",
      "Rivian R1T"
    ]
  },
  {
    make: "RollsRoyce",
    models: [
      "RollsRoyce"
    ]
  },
  {
    make: "Rover",
    models: [
      "Rover 3 Litre",
      "Rover 100",
      "Rover 2000",
      "Rover 3500",
      "Rover 3500S"
    ]
  },{
    make: "Saab",
    models: [
      "Saab 9-3 (1999 Up)",
      "Saab 9-5 (1999 Up)",
      "Saab 92x",
      "Saab 93 (1960 Down)",
      "Saab 94x",
      "Saab 95 (1972 Down)",
      "Saab 96",
      "Saab 97x",
      "Saab 99",
      "Saab 900 (incl Turbo)",
      "Saab 9000 (incl Turbo)",
      "Saab Monte Carlo",
      "Saab Sonett",
      "Saab Sonett III"
    ]
  },
  {
    make: "Saturn",
    models: [
      "Saturn Astra",
      "Saturn Aura",
      "Saturn EV1",
      "Saturn Ion",
      "Saturn L Series",
      "Saturn S Series",
      "Saturn Outlook",
      "Saturn Relay",
      "Saturn Sky",
      "Saturn Vue"
    ]
  },
  {
    make: "Scion",
    models: [
      "Scion FRS",
      "Scion iA",
      "Scion iM",
      "Scion iQ",
      "Scion tC",
      "Scion xA",
      "Scion xB",
      "Scion xD"
    ]
  },
  {
    make: "Seat",
    models: [
      "Seat Cordova",
      "Seat Ibiza",
      "Seat Leon",
      "Seat Toledo"
    ]
  },
  {
    make: "Simca",
    models: [
      "Simca"
    ]
  },
  {
    make: "Smart",
    models: [
      "Smart Fortwo"
    ]
  },
  {
    make: "SterlingRover",
    models: [
      "SterlingRover"
    ]
  },
  {
    make: "Studebaker",
    models: [
      "Studebaker"
    ]
  },
  {
    make: "Subaru",
    models: [
      "Subaru Ascent",
      "Subaru Baja",
      "Subaru Brat",
      "Subaru BRZ",
      "Subaru Chaser",
      "Subaru Crosstrek",
      "Subaru Forester",
      "Subaru Impreza",
      "Subaru Justy",
      "Subaru Legacy",
      "Subaru Loyale",
      "Subaru Outback (Impreza)",
      "Subaru Outback (Legacy)",
      "Subaru Sambar",
      "Subaru Solterra",
      "Subaru Streega",
      "Subaru SVX",
      "Subaru Tribeca",
      "Subaru WRX (2014 Down)",
      "Subaru WRX (2015 Up)",
      "Subaru XT",
      "Subaru XV Crosstrek",
      "Subaru Other"
    ]
  },
  {
    make: "Sunbeam",
    models: [
      "Sunbeam"
    ]
  },
  {
    make: "Suzuki",
    models: [
      "Suzuki Aerio",
      "Suzuki Carry",
      "Suzuki Esteem",
      "Suzuki Equator",
      "Suzuki Forenza",
      "Suzuki Forsa",
      "Suzuki Kizashi",
      "Suzuki Reno",
      "Suzuki Samurai",
      "Suzuki Sidekick",
      "Suzuki SJ410",
      "Suzuki Swift",
      "Suzuki SX4",
      "Suzuki Verona",
      "Suzuki Vitara",
      "Suzuki X90",
      "Suzuki XL7"
    ]
  },
  {
    make: "Tesla",
    models: [
      "Tesla Model 3",
      "Tesla Model S",
      "Tesla Model X",
      "Tesla Model Y",
      "Tesla Roadster"
    ]
  },
  {
    make: "Thomas",
    models: [
      "Thomas Truck"
    ]
  },
  {
    make: "Toyota",
    models: [
      "Toyota 86",
      "Toyota 4Runner",
      "Toyota Aristo",
      "Toyota Avalon",
      "Toyota BZ4X",
      "Toyota CHR",
      "Toyota Camry",
      "Toyota Carina",
      "Toyota Celica",
      "Toyota Corolla",
      "Toyota Corolla Cross",
      "Toyota Corolla FX/FX16",
      "Toyota Corolla iM",
      "Toyota Corona MKII",
      "Toyota Corona not MKII",
      "Toyota Cressida",
      "Toyota Crown",
      "Toyota Echo",
      "Toyota FJ Cruiser",
      "Toyota FX/FX16",
      "Toyota GR86",
      "Toyota GR Corolla",
      "Toyota GR Supra",
      "Toyota HiAce",
      "Toyota Highlander",
      "Toyota Land Cruiser",
      "Toyota Matrix",
      "Toyota Mirai",
      "Toyota MR2",
      "Toyota Paseo",
      "Toyota Previa",
      "Toyota Prius",
      "Toyota RAV4",
      "Toyota Sequoia",
      "Toyota Sienna",
      "Toyota Solara",
      "Toyota Starlet",
      "Toyota Stout",
      "Toyota Supra",
      "Toyota T100",
      "Toyota Tacoma",
      "Toyota Tercel",
      "Toyota Truck (except T100 & Tundra)",
      "Toyota Tundra",
      "Toyota Van (See also Previa)",
      "Toyota Venza",
      "Toyota Yaris",
      "Toyota Yaris iA"
    ]
  },
  {
    make: "Triumph",
    models: [
      "Triumph GT6",
      "Triumph Spitfire",
      "Triumph Stag",
      "Triumph TR2",
      "Triumph TR3",
      "Triumph TR4",
      "Triumph TR4A",
      "Triumph TR6",
      "Triumph TR7",
      "Triumph TR8",
      "Triumph TR250"
    ]
  },
  {
    make: "Utilimaster",
    models: [
      "Utilimaster Step Van"
    ]
  },
  {
    make: "Volkswagen",
    models: [
      "Volkswagen 412/411",
      "Volkswagen Arteon",
      "Volkswagen Atlas",
      "Volkswagen Atlas Cross Sport",
      "Volkswagen Beetle/Bug",
      "Volkswagen Cabrio",
      "Volkswagen Cabriolet",
      "Volkswagen CC",
      "Volkswagen Corrado",
      "Volkswagen Dasher",
      "Volkswagen Derby",
      "Volkswagen Eos",
      "Volkswagen Fox",
      "Volkswagen Golf",
      "Volkswagen Golf GTI",
      "Volkswagen ID.4",
      "Volkswagen Jetta",
      "Volkswagen Jetta GLI",
      "Volkswagen Karmann Ghia",
      "Volkswagen Passat",
      "Volkswagen Phaeton",
      "Volkswagen Pointer",
      "Volkswagen Pointer Truck",
      "Volkswagen Quantum",
      "Volkswagen Rabbit",
      "Volkswagen Routan",
      "Volkswagen Scirocco",
      "Volkswagen Sedan",
      "Volkswagen Sharan",
      "Volkswagen Taos",
      "Volkswagen Thing",
      "Volkswagen Tiguan",
      "Volkswagen Touareg",
      "Volkswagen Type 3",
      "Volkswagen Van-EuroVan",
      "Volkswagen Van-Transporter",
      "Volkswagen Van-Vanagon",
      "Volkswagen Other"
    ]
  },
  {
    make: "Volvo",
    models: [
      "Volvo 30 Series",
      "Volvo 40 Series",
      "Volvo 50 Series",
      "Volvo 60 Series",
      "Volvo 70 Series",
      "Volvo 80 Series",
      "Volvo 90 Series",
      "Volvo 120 Series",
      "Volvo 140 Series",
      "Volvo 160 Series",
      "Volvo 240",
      "Volvo 260",
      "Volvo 444/445",
      "Volvo 544",
      "Volvo 740",
      "Volvo 760",
      "Volvo 780",
      "Volvo 850",
      "Volvo 940",
      "Volvo 960",
      "Volvo 1800",
      "Volvo C40",
      "Volvo F7",
      "Volvo FE6",
      "Volvo S60 (2013 Down)",
      "Volvo S60 (2014 Up)",
      "Volvo S90",
      "Volvo Truck",
      "Volvo V60",
      "Volvo V70",
      "Volvo V90",
      "Volvo XC40",
      "Volvo XC60 (2013 Down)",
      "Volvo XC60 (2014 Up)",
      "Volvo XC70",
      "Volvo XC90"
    ]
  },
  {
    make: "VPG",
    models: [
      "VPG MV1"
    ]
  },
  {
    make: "Western Star",
    models: [
      "Western Star"
    ]
  },
  {
    make: "White",
    models: [
      "White"
    ]
  },
  {
    make: "Willys",
    models: [
      "Willys"
    ]
  },
  {
    make: "Winnebago",
    models: [
      "Winnebago"
    ]
  },
  {
    make: "Yugo",
    models: [
      "Yugo"
    ]
  }
]

  

  if (isSuccess) {
    navigate('/success');
  }

  if (isCanceled) {
    navigate('/cancel');
  }
  useEffect(() => {
    axios.get("https://alltruckrecycle.onrender.com/api/items")
      .then(response => {
        setParts(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedMake) {
      const selectedMakeObj = makesArray.find(makeObj => makeObj.make === selectedMake);
      if (selectedMakeObj) {
        setModels(selectedMakeObj.models);
      }
    } else {
      setModels([]);
    }
  }, [selectedMake, makesArray]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
    } else {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleSearchPart = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
    } else {
      navigate(`/search/PartNumber${searchQuery}`);
    }
  };

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSearchDrop = () => {
    if (!selectedMake || !selectedYear) {
      alert("Please select Year and Make");
      return;
    }
  
    let searchUrl = `/search/${selectedYear} ${selectedMake}`;
    if (selectedModel) {
      searchUrl += ` ${selectedModel}`;
    }
    navigate(searchUrl);
  };
  

  const years = Array.from({ length: 25 }, (_, index) => 2024 - index);
  const newestParts = items.slice(-8);

  // Functions for Login
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const openDialog = (dialogId) => {
    document.getElementById(dialogId).showModal();
  };

  const closeDialog = (dialogId) => {
    document.getElementById(dialogId).close();
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://alltruckrecycle.onrender.com/api/users/login", { email, password });
      console.log("Response from server:", response); // Log the entire response object
  
      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem('email', email);

        
        if (email === 'admin@gmail.com') {
          const token = response.data.user; // Correctly access the token
          localStorage.setItem('token', token);
          console.log("Token:", token); // Log the token after it's defined
          navigate('/admin');
        } else {
          openDialog('profileDialog');
          closeDialog('profileDialog');
        }
      } else {
        console.log("Login failed");
        openDialog('errorDialogLogin');
      }
    } catch (error) {
      console.error("Error during login:", error);
      openDialog('errorDialogLogin');
    }
  };
  
  
  

  const handleCreateAccount = () => {
    closeDialog('profileDialog'); // Close login dialog
    openDialog('createAccountDialog'); // Open account creation dialog
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://alltruckrecycle.onrender.com/api/users", { email, password });
      if (response.status === 201) {
        openDialog('successDialog'); // Open success dialog
        closeDialog('createAccountDialog'); // Close create account dialog
      } else {
        openDialog('errorDialog'); // Open error dialog
      }
    } catch (error) {
      console.error(error);
      openDialog('errorDialog'); // Open error dialog
    }
  };
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      axios.post('https://alltruckrecycle.onrender.com/api/authenticate', { token: storedToken })
        .then(response => {
          if (response.data.success) {
            setIsAdmin(true);
          }
        })
        .catch(error => {
          console.error('Authentication failed:', error);
        });
    }
  }, []);


  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    closeDialog('profileDialog');
    localStorage.removeItem('token');
    setIsAdmin(false);
  };
  

  return (
    <div className="App">
      <div className="Header">
      <Link to="/About" className="nav-bar-link">
          <p className="logo">
            <img className="logo" src="img/Logo.png" alt="Logo" />
          </p>
        </Link>
        <div className="search-container">
          <button type="search" onClick={handleSearch}>Search</button>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="Icons">
        {isAdmin && (
        <div>
          <div className='Admin'>
          <Link to="/Admin">
              <p>
                Admin
              </p>
            </Link>
          </div>
          <div className='Admin'>
          <Link to="/shippingPage">
            <p>
              Shipping
            </p>
          </Link>
        </div>
        </div>
        )}
          <div className='Profile'>
            <p onClick={() => openDialog('profileDialog')}>
              <img className="logo" src="img/profile.png" alt="Profile" />
            </p>
          </div>
          <div className='Cart'>
            <Link to="/Cart">
              <p>
                <img className="logo" src="/img/cart.png" alt="Cart" />
              </p>
            </Link>
          </div>
        </div>
      </div>
      
      <dialog id="profileDialog">
        <h2>Profile</h2>
        {isLoggedIn ? (
          <div className="alreadyLoggedin">
            <p>{email}</p>
            <button type="button" onClick={handleLogout}>Sign Out</button>
            <button type="button" onClick={() => closeDialog('profileDialog')}>Close</button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <button type="button" onClick={handleCreateAccount}>Create Account</button>
            <button type="button" onClick={() => closeDialog('profileDialog')}>Close</button>
          </form>
        )}
        {message && <p>{message}</p>}
      </dialog>
      {/* Account Creation Dialog */}
      <dialog id="createAccountDialog">
        <h2>Create Account</h2>
        <form className="profile-form" onSubmit={handleAccountCreation}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Create Account</button>
          <button type="button" onClick={() => closeDialog('createAccountDialog')}>Close</button>
        </form>
      </dialog>

      {/* Error Dialog */}
      <dialog id="errorDialog">
        <h2>Error</h2>
        <p>Account creation failed.</p>
        <button onClick={() => closeDialog('errorDialog')}>Close</button>
      </dialog>

      {/* Error Dialog for Login */}
      <dialog id="errorDialogLogin">
        <h2>Error</h2>
        <p>Login failed.</p>
        <button onClick={() => closeDialog('errorDialogLogin')}>Close</button>
      </dialog>

      {/* Success Dialog */}
      <dialog id="successDialog">
        <h2>Success</h2>
        <p>Account created successfully.</p>
        <button onClick={() => closeDialog('successDialog')}>Close</button>
      </dialog>
      <Slider></Slider>
      <div className="secondsearch">
        <h1>Enter Car Information</h1>
        <div className="Info">
          <div className="search-container">
            <div className="search-item">
            <select value={selectedMake} onChange={handleMakeChange}>
              <option value="">Select Make</option>
              {carData.map((car, index) => (
                <option key={index} value={car.make}>{car.make}</option>
              ))}
            </select>

            <select value={selectedModel} onChange={handleModelChange} disabled={!selectedMake}>
              <option value="">Select Model</option>
              {selectedMake &&
                carData
                  .find(car => car.make === selectedMake)
                  ?.models.map((model, index) => (
                    <option key={index} value={model}>{model}</option>
                  ))}
            </select>



            <select name="year" value={selectedYear} onChange={handleYearChange}>
              <option value="">Select Year</option>
              {years.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            </div>
            <div className="search-item">
              <button type="search" onClick={handleSearchDrop}>Search</button>
            </div>
          </div>
        </div>
      </div>
      <div className="partnumber">
        <h1>Search by Part Number</h1>
        <div className="search-container">
          <button type="search" onClick={handleSearchPart}>Search</button>
          <input
            type="text"
            placeholder="Seach by Part Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="new">
        <h1>NEW INVENTORY</h1>
      </div>
      <div className="items">
        {newestParts.map((part) => (
          <CarPartCard key={part._id} part={part} />
        ))}
      </div>

      <footer>
        <div className="container">
          <p>
          11407 Elks Cir, Rancho Cordova, CA 95742
            <br />
            +1(916) 638-3500
            <br />
          </p>
          <div className="footer-right">
          <a className="nav-bar-link" href="https://www.yelp.com/biz/all-trucks-recycling-rancho-cordova">
              <p>
                <img src="Icons\iconsYelp.png" alt="Yelp" />
              </p>
            </a>
            <a className="nav-bar-link" href="https://www.facebook.com/alltrucksrecycling/">
              <p>
                <img src="Icons\iconsFacebook.png" alt="Facebook" />
              </p>
            </a>
            <a className="nav-bar-link" href="https://www.google.com/maps/place/All+Trucks+Recycling/@38.5671157,-121.2559699,16z/data=!3m1!4b1!4m6!3m5!1s0x809ae81a3a571c01:0x9506e53facea0ca4!8m2!3d38.5671157!4d-121.253395!16s%2Fg%2F1tcv6krz?entry=ttu">
              <p>
                <img src="Icons\IconsGoogle.png" alt="Google" />
              </p>
            </a>
          </div>
        </div>
        <footer className="map-footer">
          <div className="container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12478.211261145601!2d-121.26369468261721!3d38.567115699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ae81a3a571c01%3A0x9506e53facea0ca4!2sAll%20Trucks%20Recycling!5e0!3m2!1sen!2sus!4v1716947188439!5m2!1sen!2sus"
              width="900"
              height="200"
              style={{ border: '1px solid #ccc', borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="footer-right">
              <p>
                Monday 8:00 am - 5:00 pm
                <br />
                Tuesday 8:00 am - 5:00 pm
                <br />
                Wednesday 8:00 am - 5:00 pm
                <br />
                Thursday 8:00 am - 5:00 pm
                <br />
                Friday 8:00 am - 5:00 pm
                <br />
                Saturday 9:00 am - 4:00 pm
                <br />
                Sunday Closed
              </p>
            </div>
          </div>
        </footer>
      </footer>
    </div>
  );
}

export default App;

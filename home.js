const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let coins = 100;
let day = 1;
let weather = "Sunny";
let weatherActive = false;
let weatherEventId = 0;
let weatherTimerStarted = false;
let selectedTool = "plant";
let selectedSeed = "carrot";
let selectedGear = "wateringCan";
let notificationTimeout;

const redeemedCodes = new Set();

const seeds = {
    carrot: 5,
    corn: 0,
    strawberry: 0,
    watermelon: 0,
    apple: 0,
    bamboo: 0,
    pumpkin: 0,
    cactus: 0,
    mango: 0,
    mushroom: 0,
    pepper: 0,
    beanstalk: 0,
    sugarApple: 0,
    elderStrawberry: 0,
    romanesco: 0
};

const gearInventory = {
    wateringCan: 1
};

let harvestBag = [];
let selectedHarvestItems = new Set();

const eggInventory = {
    basic: 0,
    bug: 0,
    night: 0
};

const cropTypes = {
    carrot: { name: "Carrot", emoji: "🥕", seedPrice: 10, sellPrice: 20, growTime: 15000, minWeight: 0.5, category: "leafy" },
    corn: { name: "Corn", emoji: "🌽", seedPrice: 150, sellPrice: 300, growTime: 25000, minWeight: 1 },
    strawberry: { name: "Strawberry", emoji: "🍓", seedPrice: 300, sellPrice: 600, growTime: 40000, minWeight: 0.2 },
    watermelon: { name: "Watermelon", emoji: "🍉", seedPrice: 700, sellPrice: 1400, growTime: 60000, minWeight: 3 },
    apple: { name: "Apple", emoji: "🍎", seedPrice: 1200, sellPrice: 2400, growTime: 90000, minWeight: 2 },
    bamboo: { name: "Bamboo", emoji: "🎋", seedPrice: 2000, sellPrice: 4000, growTime: 120000, minWeight: 4 },
    pumpkin: { name: "Pumpkin", emoji: "🎃", seedPrice: 3000, sellPrice: 6000, growTime: 150000, minWeight: 5 },
    cactus: { name: "Cactus", emoji: "🌵", seedPrice: 5000, sellPrice: 10000, growTime: 180000, minWeight: 3, category: "prickly" },
    mango: { name: "Mango", emoji: "🥭", seedPrice: 8000, sellPrice: 16000, growTime: 210000, minWeight: 4 },
    mushroom: { name: "Mushroom", emoji: "🍄", seedPrice: 15000, sellPrice: 30000, growTime: 240000, minWeight: 0.5 },
    pepper: { name: "Pepper", emoji: "🌶️", seedPrice: 25000, sellPrice: 50000, growTime: 270000, minWeight: 0.3 },
    beanstalk: { name: "Beanstalk", emoji: "🌱", seedPrice: 50000, sellPrice: 100000, growTime: 300000, minWeight: 8 },
    sugarApple: { name: "Sugar Apple", emoji: "🍈", seedPrice: 100000, sellPrice: 200000, growTime: 360000, minWeight: 5 },
    elderStrawberry: { name: "Elder Strawberry", emoji: "🍓", seedPrice: 250000, sellPrice: 500000, growTime: 420000, minWeight: 1 },
    romanesco: { name: "Romanesco", emoji: "🥦", seedPrice: 1250000, sellPrice: 2500000, growTime: 480000, minWeight: 3 }
};

const gearData = {
    wateringCan: {
        name: "Watering Can",
        emoji: "💧",
        description: "Menyiram tanaman dan membuat pertumbuhan 1.4× lebih cepat.",
        price: 500,
        type: "tool"
    },
    basicSprinkler: {
        name: "Basic Sprinkler",
        emoji: "💦",
        description: "Area kecil · Buah tumbuh hingga 1.15× lebih besar · 5 menit.",
        price: 1000,
        type: "sprinkler",
        radius: 55,
        sizeMultiplier: 1.15,
        duration: 300000
    },
    advancedSprinkler: {
        name: "Advance Sprinkler",
        emoji: "💦",
        description: "Area sedang · Buah tumbuh hingga 1.25× lebih besar · 5 menit.",
        price: 5000,
        type: "sprinkler",
        radius: 85,
        sizeMultiplier: 1.25,
        duration: 300000
    },
    godlySprinkler: {
        name: "Godly Sprinkler",
        emoji: "✨",
        description: "Area luas · Buah tumbuh hingga 1.4× lebih besar · 5 menit.",
        price: 25000,
        type: "sprinkler",
        radius: 120,
        sizeMultiplier: 1.4,
        duration: 300000
    },
    masterSprinkler: {
        name: "Master Sprinkler",
        emoji: "🌟",
        description: "Area sangat luas · Buah tumbuh hingga 1.6× lebih besar · 5 menit.",
        price: 100000,
        type: "sprinkler",
        radius: 165,
        sizeMultiplier: 1.6,
        duration: 300000
    },
    grandmasterSprinkler: {
        name: "Grandmaster Sprinkler",
        emoji: "👑",
        description: "Area terbesar · Buah tumbuh hingga 2× lebih besar · 5 menit.",
        price: 500000,
        type: "sprinkler",
        radius: 220,
        sizeMultiplier: 2,
        duration: 300000
    }
};

const petData = {
    bunny: {
        name: "Bunny",
        emoji: "🐰",
        egg: "basic",
        skill: "Every 30 seconds, Bunny eats 1 Carrot from the garden and immediately gives 1.5× its sell price in coins.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    goldenLab: {
        name: "Golden Lab",
        emoji: "🐕",
        egg: "basic",
        skill: "Every 60 seconds, has a 10% chance to dig up a random Seed.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    dog: {
        name: "Dog",
        emoji: "🐶",
        egg: "basic",
        skill: "Every 60 seconds, has a 5% chance to dig up a random Seed.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    caterpillar: {
        name: "Caterpillar",
        emoji: "🐛",
        egg: "bug",
        skill: "Passive: Leafy plants grow 2× faster.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    prayingMantis: {
        name: "Praying Mantis",
        emoji: "🦗",
        egg: "bug",
        skill: "Every 80 seconds, prays for 10 seconds and creates a small area that multiplies main mutation chance by 1.5×.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    giantAnt: {
        name: "Giant Ant",
        emoji: "🐜",
        egg: "bug",
        skill: "Harvesting has a 10% chance to duplicate a crop, including its mutation.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    snail: {
        name: "Snail",
        emoji: "🐌",
        egg: "bug",
        skill: "Passive: 5% chance when harvesting a fruit to receive 1 Seed of that fruit.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    dragonfly: {
        name: "Dragonfly",
        emoji: "🐉",
        egg: "bug",
        skill: "Every 2 minutes 30 seconds, turns 1 random plant into Gold if it has no Silver or Rainbow.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    hedgehog: {
        name: "Hedgehog",
        emoji: "🦔",
        egg: "night",
        skill: "Passive: Prickly fruits receive 1.5× size.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    mole: {
        name: "Mole",
        emoji: "🕳️",
        egg: "night",
        skill: "Every 80 seconds, digs for 100–500 coins or a random Gear. More expensive Gear is rarer.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    frog: {
        name: "Frog",
        emoji: "🐸",
        egg: "night",
        skill: "Every 5 minutes, skips 30 minutes of growth on 1 plant.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    echoFrog: {
        name: "Echo Frog",
        emoji: "🐸",
        egg: "night",
        skill: "Every 2 minutes 30 seconds, skips 30 minutes of growth on 1 plant.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    nightOwl: {
        name: "Night Owl",
        emoji: "🦉",
        egg: "night",
        skill: "Passive: gives 30 XP/second to every other active pet, not itself.",
        count: 0,
        equipped: 0,
        xp: 0
    },

    raccoon: {
        name: "Raccoon",
        emoji: "🦝",
        egg: "night",
        skill: "Every 10 minutes, duplicates 1 random garden fruit into Harvest Bag without removing the original.",
        count: 0,
        equipped: 0,
        xp: 0
    }
};

const eggs = {
    basic: {
        name: "Basic Egg",
        emoji: "🥚",
        price: 100,
        rolls: [
            ["bunny", 33.333333],
            ["goldenLab", 33.333333],
            ["dog", 33.333334]
        ]
    },

    bug: {
        name: "Bug Egg",
        emoji: "🪲",
        price: 500,
        rolls: [
            ["caterpillar", 25],
            ["prayingMantis", 20],
            ["giantAnt", 25],
            ["snail", 25],
            ["dragonfly", 5]
        ]
    },

    night: {
        name: "Night Egg",
        emoji: "🌙",
        price: 1000,
        rolls: [
            ["hedgehog", 49],
            ["mole", 22],
            ["frog", 14],
            ["echoFrog", 10],
            ["nightOwl", 4],
            ["raccoon", 1]
        ]
    }
};

const plots = [];
const placedSprinklers = [];

// Satu area garden besar dengan invisible planting slots.
// Slot tidak disusun dalam baris yang terlihat. Setiap slot mendapat
// posisi pseudo-random yang tetap konsisten setelah reload agar tanaman
// tidak berpindah-pindah secara acak setiap kali game dibuka.
const gardenArea = {
    x: 105,
    y: 95,
    width: 690,
    height: 405
};

const totalPlantSlots = 45;
const minPlantDistance = 48;

function seededRandom(seed) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
}

function createRandomGardenPositions(count) {
    const positions = [];
    const minX = gardenArea.x + 28;
    const maxX = gardenArea.x + gardenArea.width - 28;
    const minY = gardenArea.y + 28;
    const maxY = gardenArea.y + gardenArea.height - 28;

    for (let index = 0; index < count; index++) {
        let position = null;

        // Cari posisi yang tidak terlalu dekat dengan tanaman lain.
        for (let attempt = 0; attempt < 200; attempt++) {
            const seed = (index + 1) * 1000 + attempt + 17;
            const x = minX + seededRandom(seed) * (maxX - minX);
            const y = minY + seededRandom(seed + 73) * (maxY - minY);

            let valid = true;

            for (const other of positions) {
                if (
                    Math.hypot(
                        x - other.x,
                        y - other.y
                    ) < minPlantDistance
                ) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                position = { x, y };
                break;
            }
        }

        // Fallback yang tetap berada di dalam garden jika percobaan penuh.
        if (!position) {
            const angle = index * 2.399963;
            const radius = 35 + (index % 7) * 25;

            position = {
                x: Math.max(
                    minX,
                    Math.min(
                        maxX,
                        gardenArea.x + gardenArea.width / 2 + Math.cos(angle) * radius
                    )
                ),
                y: Math.max(
                    minY,
                    Math.min(
                        maxY,
                        gardenArea.y + gardenArea.height / 2 + Math.sin(angle) * radius
                    )
                )
            };
        }

        positions.push(position);
    }

    return positions;
}

const randomGardenPositions =
    createRandomGardenPositions(totalPlantSlots);

for (let i = 0; i < totalPlantSlots; i++) {
    const position = randomGardenPositions[i];

    plots.push({
        x: position.x - 10,
        y: position.y - 10,
        width: 20,
        height: 20,
        crop: null,
        plantedAt: null,
        watered: false,
        mutation: [],
        mutations: [],
        weatherMutationEvent: -1,
        bunnyBonus: 1,
        cellRow: Math.floor(i / 9),
        cellColumn: i % 9
    });
}

const petRuntime = {};

Object.keys(petData).forEach(id => {
    petRuntime[id] = {
        lastSkill: Date.now(),
        x: 650,
        y: 180,
        targetX: 650,
        targetY: 180
    };
});

function notify(message) {
    const element = document.getElementById("notification");

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {
        element.classList.remove("show");
    }, 2200);
}

function randomWeight(min) {
    // Weight uses rarity tiers instead of a hard maximum.
    // Very large fruits are possible, but become increasingly rare.
    const roll = Math.random();
    let multiplier;

    if (roll < 0.70) {
        multiplier = 1 + Math.random() * 1.5;
    } else if (roll < 0.90) {
        multiplier = 2.5 + Math.random() * 3;
    } else if (roll < 0.98) {
        multiplier = 5.5 + Math.random() * 8.5;
    } else if (roll < 0.998) {
        multiplier = 14 + Math.random() * 36;
    } else {
        // Ultra-rare tail: no maximum. Can reach hundreds of kg.
        multiplier = 50 * Math.exp(Math.random() * 2.3);
    }

    return Math.max(0.1, Math.round(min * multiplier * 10) / 10);
}

function getWeightTier(weight, minWeight) {
    const multiplier = weight / minWeight;

    if (multiplier < 2.5) {
        return { name: "Normal", emoji: "🌱", scale: 1 };
    }

    if (multiplier < 5.5) {
        return { name: "Big", emoji: "🌿", scale: 1.12 };
    }

    if (multiplier < 14) {
        return { name: "Giant", emoji: "🌳", scale: 1.28 };
    }

    if (multiplier < 50) {
        return { name: "Titan", emoji: "🗿", scale: 1.5 };
    }

    return { name: "Ultra Titan", emoji: "🗿✨", scale: 1.8 };
}

function isCropReady(plot) {
    return getGrowth(plot) >= 1;
}

function getGrowth(plot) {
    if (!plot.crop || !plot.plantedAt) {
        return 0;
    }

    const crop = cropTypes[plot.crop];

    let growth =
        (Date.now() - plot.plantedAt) /
        crop.growTime;

    if (plot.watered) {
        growth *= 1.4;
    }

    growth *= getGrowthSpeedMultiplier(plot);

    return Math.min(growth, 1);
}

function equippedCount() {
    return Object.values(petData)
        .reduce((total, pet) => total + pet.equipped, 0);
}

function equipPet(id) {
    const pet = petData[id];

    if (pet.equipped >= pet.count) {
        notify("❌ Semua pet jenis ini sudah dipasang!");
        return;
    }

    if (equippedCount() >= 3) {
        notify("❌ Semua 3 pet slot sudah terisi!");
        return;
    }

    pet.equipped++;

    renderPets();
    saveGame();

    notify(
        pet.emoji +
        " " +
        pet.name +
        " equipped!"
    );
}

function unequipPet(id) {
    const pet = petData[id];

    if (pet.equipped <= 0) {
        return;
    }

    pet.equipped--;

    renderPets();
    saveGame();

    notify(
        pet.emoji +
        " " +
        pet.name +
        " unequipped!"
    );
}

function weightedRoll(rolls) {
    const random = Math.random() * 100;

    let total = 0;

    for (const [id, chance] of rolls) {
        total += chance;

        if (random <= total) {
            return id;
        }
    }

    return rolls[rolls.length - 1][0];
}

function buyEgg(type) {
    const egg = eggs[type];

    if (coins < egg.price) {
        notify("❌ Coins tidak cukup!");
        return;
    }

    coins -= egg.price;

    eggInventory[type]++;

    updateUI();
    renderEggs();
    saveGame();

    notify(
        egg.emoji +
        " " +
        egg.name +
        " masuk Egg Inventory!"
    );
}

function hatchEgg(type) {
    if (eggInventory[type] <= 0) {
        notify("❌ Egg tidak tersedia!");
        return;
    }

    eggInventory[type]--;

    const petId = weightedRoll(
        eggs[type].rolls
    );

    const pet = petData[petId];

    pet.count++;

    renderEggs();
    renderPets();
    saveGame();

    showHatchResult(type, petId);
}

function showHatchResult(type, petId) {
    const modal =
        document.getElementById("hatchModal");

    const pet = petData[petId];

    document.getElementById(
        "hatchEggIcon"
    ).textContent = eggs[type].emoji;

    document.getElementById(
        "hatchTitle"
    ).textContent = "🎉 Egg Hatched!";

    document.getElementById(
        "hatchResult"
    ).innerHTML = `
        <div class="big">${pet.emoji}</div>
        <b>${pet.name}</b>
        <small>${pet.skill}</small>
    `;

    document
        .getElementById("hatchClose")
        .classList.remove("hidden");

    modal.classList.remove("hidden");
}

function renderPets() {
    const list =
        document.getElementById("petList");

    list.innerHTML = "";

    Object.entries(petData).forEach(
        ([id, pet]) => {

            if (pet.count <= 0) {
                return;
            }

            const card =
                document.createElement("div");

            card.className =
                "pet-card" +
                (pet.equipped > 0 ? " equipped" : "");

            let buttonText;

            if (pet.equipped >= pet.count) {
                buttonText = "All Equipped";
            } else {
                buttonText = "Equip";
            }

            card.innerHTML = `
                <div class="icon">
                    ${pet.emoji}
                </div>

                <div class="info">
                    <b>${pet.name}</b>

                    <small>
                        Owned: ${pet.count}
                        · Equipped: ${pet.equipped}
                    </small>
                </div>

                <button
                    ${pet.equipped >= pet.count ||
                    equippedCount() >= 3
                    ? "disabled"
                    : ""}>
                    ${buttonText}
                </button>

                <div class="skill">
                    Skill: ${pet.skill}
                </div>
            `;

            const button =
                card.querySelector("button");

            if (
                pet.equipped < pet.count &&
                equippedCount() < 3
            ) {

                button.onclick = () => {
                    equipPet(id);
                };

            }

            list.appendChild(card);
        }
    );

    if (!list.children.length) {

        list.innerHTML = `
            <div class="empty">
                Belum punya pet.
                Beli Egg lalu hatch!
            </div>
        `;

    }

    renderActiveSlots();
}

function renderActiveSlots() {
    const box =
        document.getElementById("activeSlots");

    box.innerHTML = "";

    const active = [];

    Object.entries(petData).forEach(
        ([id, pet]) => {

            for (
                let i = 0;
                i < pet.equipped;
                i++
            ) {
                active.push([id, pet]);
            }

        }
    );

    for (let i = 0; i < 3; i++) {

        const slot =
            document.createElement("div");

        slot.className =
            "active-slot" +
            (active[i] ? " filled" : "");

        if (active[i]) {

            const id = active[i][0];
            const pet = active[i][1];

            slot.innerHTML = `
                <span>
                    ${pet.emoji}
                </span>

                ${pet.name}

                <button
                    class="remove-pet"
                    onclick="unequipPet('${id}')">
                    ✕
                </button>
            `;

        } else {

            slot.textContent =
                "Empty Slot";

        }

        box.appendChild(slot);
    }
}

function renderEggs() {
    const box =
        document.getElementById("eggInventory");

    box.innerHTML = "";

    Object.entries(eggs).forEach(
        ([id, egg]) => {

            const card =
                document.createElement("div");

            card.className = "egg-card";

            card.innerHTML = `
                <div class="egg-icon">
                    ${egg.emoji}
                </div>

                <b>
                    ${egg.name}
                </b>

                <small>
                    Owned: ${eggInventory[id]}
                </small>

                <button
                    ${eggInventory[id] <= 0 ? "disabled" : ""}
                >
                    Hatch
                </button>
            `;

            card
                .querySelector("button")
                .onclick = () => hatchEgg(id);

            box.appendChild(card);
        }
    );
}

function weightedSeedType() {
    const entries = Object.entries(cropTypes);
    const weighted = entries.map(([id, crop]) => ({
        id,
        weight: 1 / Math.max(1, crop.seedPrice)
    }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of weighted) {
        roll -= item.weight;
        if (roll <= 0) return item.id;
    }
    return weighted[weighted.length - 1].id;
}

function weightedGearType() {
    const entries = Object.entries(gearData);
    const weighted = entries.map(([id, gear]) => ({
        id,
        weight: 1 / Math.max(1, gear.price)
    }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of weighted) {
        roll -= item.weight;
        if (roll <= 0) return item.id;
    }
    return weighted[weighted.length - 1].id;
}

function bunnySkill() {
    if (petData.bunny.equipped <= 0) return;
    const runtime = petRuntime.bunny;
    if (Date.now() - runtime.lastSkill < 30000) return;

    const carrots = plots.filter(plot => plot.crop === "carrot");
    if (!carrots.length) return;

    const plot = carrots[Math.floor(Math.random() * carrots.length)];
    if (!isCropReady(plot)) return;

    const baseValue = getPlotSellValue(plot);
    const gain = Math.round(baseValue * 1.5);

    coins += gain;
    plot.crop = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.mutations = [];
    plot.mutation = [];
    plot.weatherMutationEvent = -1;
    plot.bunnyBonus = 1;
    plot.baseWeight = null;
    plot.sprinklerMultiplier = 1;
    plot.weight = null;

    runtime.lastSkill = Date.now();
    updateUI();
    saveGame();
    notify("🐰 Bunny ate a Carrot → +" + gain + " coins (1.5×)! ");
}

function digSeedSkill(petId, chance, label) {
    if (petData[petId].equipped <= 0) return;
    const runtime = petRuntime[petId];
    if (Date.now() - runtime.lastSkill < 60000) return;

    if (Math.random() < chance) {
        const type = weightedSeedType();
        seeds[type]++;
        notify(petData[petId].emoji + " " + label + " found 1 " + cropTypes[type].name + " Seed!");
        updateUI();
    }

    runtime.lastSkill = Date.now();
    saveGame();
}

function goldenLabSkill() {
    digSeedSkill("goldenLab", 0.10, "Golden Lab");
}

function dogSkill() {
    digSeedSkill("dog", 0.05, "Dog");
}

function prayingMantisSkill() {
    if (petData.prayingMantis.equipped <= 0) return;
    const runtime = petRuntime.prayingMantis;
    if (Date.now() - runtime.lastSkill < 80000) return;

    const targets = plots.filter(plot => plot.crop && !isCropReady(plot));
    if (!targets.length) return;

    const target = targets[Math.floor(Math.random() * targets.length)];
    target.mantisActiveUntil = Date.now() + 10000;
    target.mantisBoost = true;
    target.mantisX = target.x + target.width / 2;
    target.mantisY = target.y + target.height / 2;

    runtime.lastSkill = Date.now();
    notify("🦗 Praying Mantis is praying for 10 seconds!");
    saveGame();
}

function dragonflySkill() {
    if (petData.dragonfly.equipped <= 0) return;
    const runtime = petRuntime.dragonfly;
    if (Date.now() - runtime.lastSkill < 150000) return;

    const targets = plots.filter(plot => {
        if (!plot.crop) return false;
        const mutations = getMutations(plot);
        return !mutations.includes("silver") && !mutations.includes("rainbow");
    });
    if (!targets.length) return;

    const plot = targets[Math.floor(Math.random() * targets.length)];
    if (addMutation(plot, "gold")) {
        runtime.lastSkill = Date.now();
        notify("🐉 Dragonfly turned " + cropTypes[plot.crop].name + " Gold!");
        saveGame();
    }
}

function hedgehogMultiplier(plot) {
    if (petData.hedgehog.equipped <= 0) return 1;
    const crop = cropTypes[plot.crop];
    if (!crop) return 1;
    return crop.category === "prickly" ? 1.5 : 1;
}

function moleSkill() {
    if (petData.mole.equipped <= 0) return;
    const runtime = petRuntime.mole;
    if (Date.now() - runtime.lastSkill < 80000) return;

    runtime.lastSkill = Date.now();
    if (Math.random() < 0.7) {
        const gain = 100 + Math.floor(Math.random() * 401);
        coins += gain;
        notify("🐹 Mole dug up " + gain + " coins!");
    } else {
        const gearId = weightedGearType();
        gearInventory[gearId] = (gearInventory[gearId] || 0) + 1;
        notify("🐹 Mole found " + gearData[gearId].emoji + " " + gearData[gearId].name + "!");
    }
    updateUI();
    saveGame();
}

function skipGrowthByMinutes(petId, minutes, label, cooldown) {
    if (petData[petId].equipped <= 0) return;
    const runtime = petRuntime[petId];
    if (Date.now() - runtime.lastSkill < cooldown) return;

    const targets = plots.filter(plot => plot.crop && !isCropReady(plot));
    if (!targets.length) return;

    const plot = targets[Math.floor(Math.random() * targets.length)];
    const speed = getGrowthSpeedMultiplier(plot);
    plot.plantedAt -= (minutes * 60 * 1000) / speed;
    runtime.lastSkill = Date.now();
    notify(petData[petId].emoji + " " + label + " skipped " + minutes + " minutes of growth!");
    saveGame();
}

function frogSkill() {
    skipGrowthByMinutes("frog", 30, "Frog", 300000);
}

function echoFrogSkill() {
    skipGrowthByMinutes("echoFrog", 30, "Echo Frog", 150000);
}

function raccoonSkill() {
    if (petData.raccoon.equipped <= 0) return;
    const runtime = petRuntime.raccoon;
    if (Date.now() - runtime.lastSkill < 600000) return;

    const targets = plots.filter(plot => plot.crop && isCropReady(plot));
    if (!targets.length) return;

    const plot = targets[Math.floor(Math.random() * targets.length)];
    const mutations = [...getMutations(plot)];
    const item = {
        id: Date.now() + Math.random(),
        type: plot.crop,
        weight: plot.weight || randomWeight(cropTypes[plot.crop].minWeight),
        mutations,
        mutation: mutations,
        bunnyBonus: plot.bunnyBonus || 1
    };
    harvestBag.push(item);
    runtime.lastSkill = Date.now();
    renderHarvestBag();
    updateUI();
    saveGame();
    notify("🦝 Raccoon duplicated " + cropTypes[plot.crop].name + " → Harvest Bag!");
}

function getPlotSellValue(plot) {
    if (!plot || !plot.crop) return 0;
    const mutations = getMutations(plot);
    let price = cropTypes[plot.crop].sellPrice;
    price *= mutationMultiplier(mutations);
    price *= plot.weight || 1;
    price *= plot.bunnyBonus || 1;
    return Math.round(price);
}

function giantAntDuplicate(item) {
    if (petData.giantAnt.equipped <= 0) return false;
    return Math.random() < 0.10;
}

function snailSeed() {
    if (petData.snail.equipped <= 0) return false;
    return Math.random() < 0.05;
}

function getGrowthSpeedMultiplier(plot) {
    let multiplier = 1;
    if (petData.caterpillar.equipped > 0 && plot.crop && cropTypes[plot.crop]?.category === "leafy") {
        multiplier *= 2;
    }
    return multiplier;
}

const mutationData = {
    silver: { name: "Silver", emoji: "🩶", multiplier: 2 },
    gold: { name: "Gold", emoji: "✨", multiplier: 5 },
    rainbow: { name: "Rainbow", emoji: "🌈", multiplier: 10 },
    wet: { name: "Wet", emoji: "💧", multiplier: 3 },
    frozen: { name: "Frozen", emoji: "❄️", multiplier: 5 },
    bloodlit: { name: "Bloodlit", emoji: "🌑", multiplier: 3 },
    moonlit: { name: "Moonlit", emoji: "🌙", multiplier: 3 }
};

function getMutations(plot) {
    if (!plot) return [];
    if (Array.isArray(plot.mutations)) return plot.mutations;
    if (Array.isArray(plot.mutation)) return plot.mutation;
    if (typeof plot.mutation === "string" && plot.mutation) return [plot.mutation];
    return [];
}

function normalizeMutations(plot) {
    const current = [...new Set(getMutations(plot))];
    const main = ["silver", "gold", "rainbow"].find(m => current.includes(m));
    const weatherMutations = current.filter(m => !["silver", "gold", "rainbow"].includes(m));
    plot.mutations = [...(main ? [main] : []), ...weatherMutations];
    plot.mutation = plot.mutations;
    return plot.mutations;
}

function rollPlantMutation(plot) {
    let multiplier = 1;
    if (plot && plot.mantisActiveUntil && Date.now() < plot.mantisActiveUntil) multiplier = 1.5;
    const roll = Math.random() * 100;
    if (roll < 1 * multiplier) return ["rainbow"];
    if (roll < 6 * multiplier) return ["gold"];
    if (roll < 16 * multiplier) return ["silver"];
    return [];
}

function addMutation(plot, mutation) {
    if (!plot || !plot.crop || !mutation) return false;
    const mutations = normalizeMutations(plot);
    if (mutations.includes(mutation)) return false;

    const mainMutations = ["silver", "gold", "rainbow"];
    if (mainMutations.includes(mutation)) {
        if (mainMutations.some(m => mutations.includes(m))) return false;
        mutations.unshift(mutation);
    } else {
        mutations.push(mutation);
    }

    plot.mutations = mutations;
    plot.mutation = mutations;
    return true;
}

function mutationMultiplier(mutations) {
    return mutations.reduce((total, mutation) => {
        return total * (mutationData[mutation]?.multiplier || 1);
    }, 1);
}

function mutationLabel(mutations) {
    return mutations.length
        ? mutations.map(m => mutationData[m]?.name || m).join(" + ")
        : "Normal";
}

function mutationEmojis(mutations) {
    return mutations
        .map(m => mutationData[m]?.emoji || "")
        .join("");
}

function applyGrowingMutation(plot) {
    if (!plot.crop || isCropReady(plot)) return;
    if (getMutations(plot).some(m => ["silver", "gold", "rainbow"].includes(m))) return;

    const now = Date.now();
    if (!plot.lastMutationRoll) plot.lastMutationRoll = now;
    if (now - plot.lastMutationRoll < 5000) return;
    plot.lastMutationRoll = now;

    const chanceMultiplier = (plot.mantisActiveUntil && now < plot.mantisActiveUntil) ? 1.5 : 1;
    const roll = Math.random() * 100;
    if (roll < 1 * chanceMultiplier) addMutation(plot, "rainbow");
    else if (roll < 6 * chanceMultiplier) addMutation(plot, "gold");
    else if (roll < 16 * chanceMultiplier) addMutation(plot, "silver");
}

function applyWeatherMutation(plot) {
    if (!weatherActive || !plot.crop || !isCropReady(plot)) return;
    if (plot.weatherMutationEvent === weatherEventId) return;
    plot.weatherMutationEvent = weatherEventId;

    let mutation = null;
    if (weather === "Rainy") mutation = "wet";
    if (weather === "Moonlight") mutation = "moonlit";
    if (weather === "Bloodmoon") mutation = "bloodlit";
    if (weather === "Frost") {
        const mutations = normalizeMutations(plot);
        if (mutations.includes("wet")) {
            if (Math.random() < 0.05) {
                plot.mutations = mutations.filter(m => m !== "wet");
                plot.mutation = plot.mutations;
                addMutation(plot, "frozen");
                notify("❄️ " + cropTypes[plot.crop].name + " menjadi Frozen!");
            }
        }
        return;
    }

    if (mutation && Math.random() < 0.05) {
        if (addMutation(plot, mutation)) {
            notify(mutationData[mutation].emoji + " " + cropTypes[plot.crop].name + " mendapat " + mutationData[mutation].name + "!");
        }
    }
}

function applyWeatherMutations() {
    if (!weatherActive) return;
    plots.forEach(plot => applyWeatherMutation(plot));
}

function interactWithPlot(plot) {

    if (selectedTool === "plant") {

        if (plot.crop) {
            if (isCropReady(plot)) {
                harvestPlot(plot);
            } else {
                notify(
                    "🌱 Tanaman belum matang!"
                );
            }
            return;
        }

        if (seeds[selectedSeed] <= 0) {
            notify(
                "❌ Seed tidak tersedia!"
            );
            return;
        }

        seeds[selectedSeed]--;

        plot.crop = selectedSeed;
        plot.plantedAt = Date.now();
        plot.watered = false;
        plot.mutations = [];
        plot.mutation = [];
        plot.weatherMutationEvent = -1;
        plot.bunnyBonus = 1;
        plot.baseWeight = randomWeight(cropTypes[selectedSeed].minWeight);
        plot.sprinklerMultiplier = 1;
        plot.weight = plot.baseWeight;

        updateUI();
        saveGame();

        notify(
            cropTypes[selectedSeed].emoji +
            " " +
            cropTypes[selectedSeed].name +
            " ditanam!"
        );

        return;
    }

    if (selectedTool === "gear") {
        useSelectedGear(plot);
        return;
    }

    if (selectedTool === "harvest") {
        harvestPlot(plot);
        return;
    }


}

function harvestPlot(plot) {

    if (!plot.crop) {
        notify("Tidak ada tanaman!");
        return;
    }

    if (!isCropReady(plot)) {
        notify("🌱 Tanaman belum matang!");
        return;
    }

    const item = {
        id: Date.now() + Math.random(),
        type: plot.crop,
        weight: plot.weight || randomWeight(cropTypes[plot.crop].minWeight),
        mutations: [...getMutations(plot)],
        mutation: [...getMutations(plot)],
        bunnyBonus: plot.bunnyBonus || 1
    };

    harvestBag.push(item);

    const antKeepsCrop = giantAntDuplicate(item);

    if (snailSeed()) {
        seeds[item.type]++;
        notify("🐌 Snail dropped 1 " + cropTypes[item.type].name + " Seed!");
    }

    if (antKeepsCrop) {
        plot.plantedAt = Date.now();
        plot.crop = item.type;
        plot.mutations = [...item.mutations];
        plot.mutation = [...item.mutations];
        plot.baseWeight = item.weight;
        plot.weight = item.weight;
        plot.bunnyBonus = item.bunnyBonus || 1;
        plot.watered = false;
        plot.weatherMutationEvent = -1;
        notify("🐜 Giant Ant kept the " + cropTypes[item.type].name + " in the garden!");
        updateUI();
        renderHarvestBag();
        saveGame();
        return;
    }

    notify(
        cropTypes[item.type].emoji + " " +
        cropTypes[item.type].name + " " +
        item.weight.toFixed(1) + " kg dipanen!"
    );

    plot.crop = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.mutations = [];
    plot.mutation = [];
    plot.weatherMutationEvent = -1;
    plot.bunnyBonus = 1;
    plot.baseWeight = null;
    plot.sprinklerMultiplier = 1;
    plot.weight = null;

    updateUI();
    renderHarvestBag();
    saveGame();
}

function useSelectedGear(plot) {

    if (!selectedGear || !gearInventory[selectedGear]) {
        notify("❌ Gear tidak tersedia!");
        return;
    }

    const gear = gearData[selectedGear];

    if (gear.type === "sprinkler") {
        notify("💦 Untuk memasang sprinkler, klik area kosong di garden.");
        return;
    }

    if (selectedGear === "wateringCan") {

        if (!plot.crop) {
            notify("Tidak ada tanaman!");
            return;
        }

        if (isCropReady(plot)) {
            notify("🌾 Buah sudah siap dipanen dan ukurannya tidak bisa berubah lagi!");
            return;
        }

        if (plot.watered) {
            notify("💧 Tanaman ini sudah disiram!");
            return;
        }

        plot.watered = true;
        gearInventory.wateringCan--;

        if (gearInventory.wateringCan <= 0) {
            delete gearInventory.wateringCan;
            if (selectedGear === "wateringCan") {
                selectedGear = null;
            }
        }

        updateUI();
        saveGame();

        notify("💧 Watering Can digunakan dan berkurang 1!");
    }
}

function isInsideGarden(x, y) {
    return (
        x >= gardenArea.x &&
        x <= gardenArea.x + gardenArea.width &&
        y >= gardenArea.y &&
        y <= gardenArea.y + gardenArea.height
    );
}

function cleanupExpiredSprinklers() {
    const now = Date.now();
    for (let i = placedSprinklers.length - 1; i >= 0; i--) {
        if (placedSprinklers[i].expiresAt <= now) {
            placedSprinklers.splice(i, 1);
        }
    }
}

function placeSprinkler(x, y) {
    cleanupExpiredSprinklers();

    const gear = gearData[selectedGear];
    if (!gear || gear.type !== "sprinkler") return;

    if (!isInsideGarden(x, y)) {
        notify("💦 Sprinkler harus diletakkan di dalam garden!");
        return;
    }

    if (!gearInventory[selectedGear]) {
        notify("❌ Sprinkler tidak tersedia!");
        return;
    }

    const sprinkler = {
        id: Date.now() + Math.random(),
        type: selectedGear,
        x,
        y,
        placedAt: Date.now(),
        expiresAt: Date.now() + gear.duration
    };

    placedSprinklers.push(sprinkler);
    gearInventory[selectedGear]--;

    if (gearInventory[selectedGear] <= 0) {
        delete gearInventory[selectedGear];
        selectedGear = null;
    }

    updateUI();
    saveGame();
    notify(gear.emoji + " " + gear.name + " dipasang selama 5 menit!");
}

function getSprinklerMultiplier(plot) {
    cleanupExpiredSprinklers();

    if (!plot.crop || isCropReady(plot)) {
        return 1;
    }

    const px = plot.x + plot.width / 2;
    const py = plot.y + plot.height / 2;
    let bestMultiplier = 1;

    for (const sprinkler of placedSprinklers) {
        const gear = gearData[sprinkler.type];
        if (!gear) continue;

        const distance = Math.hypot(px - sprinkler.x, py - sprinkler.y);
        if (distance <= gear.radius) {
            bestMultiplier = Math.max(bestMultiplier, gear.sizeMultiplier);
        }
    }

    return bestMultiplier;
}

function updateSprinklerEffects() {
    cleanupExpiredSprinklers();

    for (const plot of plots) {
        if (!plot.crop || !plot.plantedAt || isCropReady(plot)) continue;

        const multiplier = getSprinklerMultiplier(plot);
        plot.sprinklerMultiplier = multiplier;

        if (plot.baseWeight) {
            plot.weight = Math.round(plot.baseWeight * multiplier * 10) / 10;
        }
    }
}

function renderSeedSelector() {

    const button = document.getElementById("selectedSeedButton");
    const popup = document.getElementById("seedSelectorPopup");

    if (!button || !popup || !cropTypes[selectedSeed]) return;

    button.innerHTML = `
        <span class="selected-seed-icon">${cropTypes[selectedSeed].emoji}</span>
        <span class="selected-seed-info">
            <b>${cropTypes[selectedSeed].name}</b>
            <small>×${seeds[selectedSeed] || 0}</small>
        </span>
        <span class="selector-arrow">▼</span>
    `;

    popup.innerHTML = "";

    Object.entries(cropTypes).forEach(([id, crop]) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "seed-selector-item" + (id === selectedSeed ? " selected" : "");
        item.innerHTML = `
            <span class="selector-icon">${crop.emoji}</span>
            <span class="selector-info">
                <b>${crop.name}</b>
                <small>×${seeds[id] || 0}</small>
            </span>
        `;

        item.onclick = () => {
            if ((seeds[id] || 0) <= 0) {
                notify("❌ Seed tidak tersedia!");
                return;
            }

            selectedSeed = id;
            selectedTool = "plant";
            popup.classList.add("hidden");
            updateToolButtons();
            renderSeedSelector();
            notify(crop.emoji + " " + crop.name + " dipilih!");
        };

        popup.appendChild(item);
    });
}

function renderGearSelector() {

    const button = document.getElementById("selectedGearButton");
    const popup = document.getElementById("gearSelectorPopup");

    if (!button || !popup) return;

    const owned = Object.entries(gearData).filter(([id]) => (gearInventory[id] || 0) > 0);

    if (!owned.length) {
        button.innerHTML = `
            <span class="selected-gear-icon">⚙️</span>
            <span class="selected-gear-info"><b>No Gear</b><small>Belum punya gear</small></span>
            <span class="selector-arrow">▼</span>
        `;
        popup.innerHTML = `<div class="empty">Belum punya Gear.</div>`;
        return;
    }

    if (!gearInventory[selectedGear]) {
        selectedGear = owned[0][0];
    }

    const current = gearData[selectedGear];

    button.innerHTML = `
        <span class="selected-gear-icon">${current.emoji}</span>
        <span class="selected-gear-info">
            <b>${current.name}</b>
            <small>×${gearInventory[selectedGear]}</small>
        </span>
        <span class="selector-arrow">▼</span>
    `;

    popup.innerHTML = "";

    owned.forEach(([id, gear]) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "gear-selector-item" + (id === selectedGear ? " selected" : "");
        item.innerHTML = `
            <span class="selector-icon">${gear.emoji}</span>
            <span class="selector-info">
                <b>${gear.name}</b>
                <small>×${gearInventory[id]} · ${gear.description}</small>
            </span>
        `;

        item.onclick = () => {
            selectedGear = id;
            selectedTool = "gear";
            popup.classList.add("hidden");
            updateToolButtons();
            renderGearSelector();
            notify(gear.emoji + " " + gear.name + " dipilih!");
        };

        popup.appendChild(item);
    });
}

function updateToolButtons() {
    document.querySelectorAll(".tool").forEach(button => {
        button.classList.toggle("active", button.dataset.tool === selectedTool);
    });
}

function getHarvestPrice(item) {
    let price = cropTypes[item.type].sellPrice * item.weight;
    const mutations = Array.isArray(item.mutations)
        ? item.mutations
        : (Array.isArray(item.mutation) ? item.mutation : (item.mutation ? [item.mutation] : []));
    price *= mutationMultiplier(mutations);
    price *= item.bunnyBonus || 1;
    return price;
}

function sellSelectedCrops() {
    if (!selectedHarvestItems.size) {
        notify("❌ Pilih hasil panen yang mau dijual!");
        return;
    }

    let total = 0;
    const soldIds = new Set();

    harvestBag.forEach(item => {
        if (selectedHarvestItems.has(item.id)) {
            total += getHarvestPrice(item);
            soldIds.add(item.id);
        }
    });

    harvestBag = harvestBag.filter(item => !soldIds.has(item.id));
    selectedHarvestItems.clear();
    coins += Math.floor(total);
    updateUI();
    renderHarvestBag();
    saveGame();
    notify("💰 " + Math.floor(total) + " coins didapat dari penjualan!");
}

function sellAllCrops() {
    if (!harvestBag.length) {
        notify("🎒 Harvest Bag kosong!");
        return;
    }

    let total = 0;
    harvestBag.forEach(item => total += getHarvestPrice(item));
    const count = harvestBag.length;

    harvestBag = [];
    selectedHarvestItems.clear();
    coins += Math.floor(total);
    updateUI();
    renderHarvestBag();
    saveGame();
    notify("💰 " + count + " item terjual! +" + Math.floor(total) + " coins!");
}

function renderSeedShop() {
    const box = document.getElementById("seedShop");
    if (!box) return;

    box.innerHTML = "";

    Object.entries(cropTypes).forEach(([id, crop]) => {
        const item = document.createElement("div");
        item.className = "shop-item";
        item.innerHTML = `
            <span>${crop.emoji}</span>
            <div>
                <b>${crop.name} Seed</b>
                <small>${crop.seedPrice.toLocaleString()} 💰</small>
                <small>Sell: ${crop.sellPrice.toLocaleString()} 💰 / kg</small>
            </div>
            <button type="button">Buy</button>
        `;
        item.querySelector("button").onclick = () => buySeed(id);
        box.appendChild(item);
    });
}

function buySeed(type) {

    const crop =
        cropTypes[type];

    if (coins < crop.seedPrice) {
        notify(
            "❌ Coins tidak cukup!"
        );
        return;
    }

    coins -= crop.seedPrice;

    seeds[type]++;

    updateUI();
    saveGame();

    notify(
        crop.emoji +
        " " +
        crop.name +
        " Seed dibeli!"
    );
}

function renderGearShop() {

    const box = document.getElementById("gearShop");
    if (!box) return;

    box.innerHTML = "";

    Object.entries(gearData).forEach(([id, gear]) => {
        const item = document.createElement("div");
        item.className = "shop-item";
        item.innerHTML = `
            <span>${gear.emoji}</span>
            <div>
                <b>${gear.name}</b>
                <small>${gear.price.toLocaleString()} 💰 / 1 ${gear.type === "sprinkler" ? "sprinkler" : "use"}</small>
                <small>${gear.description}</small>
            </div>
            <button type="button">Buy</button>
        `;

        item.querySelector("button").onclick = () => buyGear(id);
        box.appendChild(item);
    });
}

function buyGear(id) {

    const gear = gearData[id];

    if (!gear) return;

    if (coins < gear.price) {
        notify("❌ Coins tidak cukup!");
        return;
    }

    coins -= gear.price;
    gearInventory[id] = (gearInventory[id] || 0) + 1;

    if (!selectedGear) {
        selectedGear = id;
    }

    updateUI();
    saveGame();

    notify(gear.emoji + " " + gear.name + " dibeli! 1 use.");
}

function updateUI() {

    document.getElementById(
        "coins"
    ).textContent = coins;

    document.getElementById(
        "day"
    ).textContent = day;

    document.getElementById(
        "weather"
    ).textContent = weather;

    document.getElementById(
        "shopCoins"
    ).textContent = coins;

    renderSeedSelector();
    renderGearSelector();
    renderGearShop();

    document.getElementById(
        "harvestCount"
    ).textContent =
        harvestBag.length;
}

function renderHarvestBag() {

    const box = document.getElementById("harvestItems");
    const selectedCount = document.getElementById("selectedHarvestCount");

    box.innerHTML = "";

    if (!harvestBag.length) {

        box.innerHTML = '<div class="empty">🎒 Harvest Bag kosong.</div>';

        if (selectedCount) {
            selectedCount.textContent = "0";
        }

        return;
    }

    harvestBag.forEach(item => {

        const element = document.createElement("div");

        element.className = "harvest-item";

        if (selectedHarvestItems.has(item.id)) {
            element.classList.add("selected");
        }

        const tier = getWeightTier(
            item.weight,
            cropTypes[item.type].minWeight
        );

        const mutations = Array.isArray(item.mutations)
            ? item.mutations
            : (Array.isArray(item.mutation) ? item.mutation : (item.mutation ? [item.mutation] : []));

        const price = Math.floor(
            getHarvestPrice(item)
        );

        element.innerHTML = `
            <div class="harvest-icon">
                ${cropTypes[item.type].emoji}
            </div>

            <div class="harvest-name">
                ${mutationEmojis(mutations)} ${cropTypes[item.type].name}
            </div>

            <div class="harvest-mutation">
                ${mutationLabel(mutations)}
            </div>

            <div class="harvest-weight">
                ${item.weight.toFixed(1)} kg
            </div>

            <div class="harvest-tier">
                ${tier.emoji} ${tier.name}
            </div>

            <div class="harvest-price">
                💰 ${price.toLocaleString()}
            </div>
        `;

        element.addEventListener("click", () => {

            if (selectedHarvestItems.has(item.id)) {
                selectedHarvestItems.delete(item.id);
            } else {
                selectedHarvestItems.add(item.id);
            }

            renderHarvestBag();
        });

        box.appendChild(element);
    });

    if (selectedCount) {
        selectedCount.textContent =
            selectedHarvestItems.size;
    }
}


function openRedeemModal() {
    const modal = document.getElementById("redeemModal");
    if (modal) {
        modal.classList.remove("hidden");
        const input = document.getElementById("redeemCodeInput");
        if (input) {
            input.focus();
        }
    }
}

function closeRedeemModal() {
    const modal = document.getElementById("redeemModal");
    if (modal) {
        modal.classList.add("hidden");
    }
}

function redeemCode() {
    const input = document.getElementById("redeemCodeInput");
    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (!code) {
        notify("❌ Masukkan redeem code!");
        return;
    }

    // TINYADMIN adalah developer code dan dapat digunakan berkali-kali.
    if (code === "TINYADMIN") {
        input.value = "";
        closeRedeemModal();
        openCheatPanel();
        notify("🔧 Cheat Panel terbuka!");
        return;
    }

    // Semua redeem code selain TINYADMIN hanya dapat digunakan sekali.
    if (redeemedCodes.has(code)) {
        input.value = "";
        notify("⚠️ Code sudah ditukarkan sebelumnya!");
        return;
    }

    if (code === "WELCOME") {
        redeemedCodes.add(code);
        coins += 5000;
        input.value = "";
        updateUI();
        saveGame();
        notify("🎁 WELCOME redeemed! +5,000 coins!");
        return;
    }

    if (code === "CARROT100") {
        redeemedCodes.add(code);
        seeds.carrot += 100;
        input.value = "";
        updateUI();
        saveGame();
        notify("🥕 CARROT100 redeemed! +100 Carrot Seeds!");
        return;
    }

    if (code === "FREEEGG") {
        redeemedCodes.add(code);
        eggInventory.basic += 10;
        input.value = "";
        updateUI();
        renderEggs();
        saveGame();
        notify("🥚 FREEEGG redeemed! +10 Basic Eggs!");
        return;
    }

    notify("❌ Redeem code tidak valid!");
}

function openCheatPanel() {
    const modal = document.getElementById("cheatModal");
    if (modal) {
        renderCheatSeedButtons();
        modal.classList.remove("hidden");
    }
}

function closeCheatPanel() {
    const modal = document.getElementById("cheatModal");
    if (modal) {
        modal.classList.add("hidden");
    }
}

function cheatAddCoins(amount) {
    coins += amount;

    if (coins < 0) {
        coins = 0;
    }

    updateUI();
    saveGame();

    const prefix = amount >= 0 ? "+" : "";
    notify("💰 Coins " + prefix + amount.toLocaleString() + "!");
}

function cheatAddEgg(type, amount) {
    if (!eggInventory[type]) {
        eggInventory[type] = 0;
    }

    eggInventory[type] += amount;

    updateUI();
    renderEggs();
    saveGame();

    notify("🥚 +" + amount + " " + eggs[type].name + "!");
}

function renderCheatSeedButtons() {
    const box = document.getElementById("cheatSeedButtons");
    if (!box) return;

    box.innerHTML = "";

    Object.entries(cropTypes).forEach(([id, crop]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "cheat-seed-button";
        button.innerHTML = `
            <span>${crop.emoji} ${crop.name}</span>
            <b>+1</b>
        `;

        button.onclick = () => {
            seeds[id] = (seeds[id] || 0) + 1;
            updateUI();
            saveGame();
            notify(crop.emoji + " +1 " + crop.name + " Seed!");
        };

        box.appendChild(button);
    });
}

function saveGame() {

    const saveData = {
        coins,
        redeemedCodes: Array.from(redeemedCodes),
        day,
        weather,
        seeds,
        harvestBag,
        eggInventory,
        gearInventory,
        selectedSeed,
        selectedGear,
        placedSprinklers,

        petCounts:
            Object.fromEntries(
                Object.entries(
                    petData
                ).map(
                    ([id, pet]) =>
                        [id, pet.count]
                )
            ),

        petEquipped:
            Object.fromEntries(
                Object.entries(
                    petData
                ).map(
                    ([id, pet]) =>
                        [id, pet.equipped]
                )
            ),

        plots
    };

    localStorage.setItem(
        "tinyGardenSave",
        JSON.stringify(saveData)
    );
}

function loadGame() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "tinyGardenSave"
                )
            );

        if (!saved) {
            return;
        }

        coins =
            saved.coins ?? coins;

        redeemedCodes.clear();
        if (Array.isArray(saved.redeemedCodes)) {
            saved.redeemedCodes.forEach(code => redeemedCodes.add(code));
        }

        day =
            saved.day ?? day;

        weather =
            saved.weather ?? weather;

        Object.assign(
            seeds,
            saved.seeds || {}
        );

        harvestBag =
            (saved.harvestBag || []).map(item => ({
                ...item,
                id: item.id || (Date.now() + Math.random()),
                mutations: Array.isArray(item.mutations)
                    ? item.mutations
                    : (Array.isArray(item.mutation) ? item.mutation : (item.mutation ? [item.mutation] : []))
            }));
        selectedHarvestItems.clear();

        Object.assign(
            gearInventory,
            saved.gearInventory || {}
        );

        selectedSeed =
            saved.selectedSeed || selectedSeed;

        selectedGear =
            saved.selectedGear || selectedGear;

        placedSprinklers.length = 0;
        if (Array.isArray(saved.placedSprinklers)) {
            placedSprinklers.push(...saved.placedSprinklers);
        }

        Object.assign(
            eggInventory,
            saved.eggInventory || {}
        );

        Object.entries(
            saved.petCounts || {}
        ).forEach(
            ([id, count]) => {

                if (petData[id]) {
                    petData[id].count =
                        count;
                }

            }
        );

        Object.entries(
            saved.petEquipped || {}
        ).forEach(
            ([id, equipped]) => {

                if (petData[id]) {

                    petData[id].equipped =
                        Math.min(
                            equipped,
                            petData[id].count
                        );

                }

            }
        );

        if (
            Array.isArray(saved.plots)
        ) {

            saved.plots.forEach(
                (savedPlot, index) => {

                    if (plots[index]) {

                        Object.assign(
                            plots[index],
                            savedPlot
                        );

                        if (plots[index].crop && !plots[index].baseWeight) {
                            plots[index].baseWeight = plots[index].weight || randomWeight(cropTypes[plots[index].crop].minWeight);
                        }

                        if (!plots[index].sprinklerMultiplier) {
                            plots[index].sprinklerMultiplier = 1;
                        }

                    }

                }
            );

        }

    } catch (error) {

        console.log(
            "Save tidak dapat dimuat."
        );

    }
}

const selectedSeedButton = document.getElementById("selectedSeedButton");
const seedSelectorPopup = document.getElementById("seedSelectorPopup");

const redeemButton = document.getElementById("redeemButton");
const closeRedeem = document.getElementById("closeRedeem");
const redeemCodeButton = document.getElementById("redeemCodeButton");
const redeemCodeInput = document.getElementById("redeemCodeInput");
const closeCheat = document.getElementById("closeCheat");

if (redeemButton) {
    redeemButton.addEventListener("click", openRedeemModal);
}

if (closeRedeem) {
    closeRedeem.addEventListener("click", closeRedeemModal);
}

if (redeemCodeButton) {
    redeemCodeButton.addEventListener("click", redeemCode);
}

if (redeemCodeInput) {
    redeemCodeInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            redeemCode();
        }
    });
}

if (closeCheat) {
    closeCheat.addEventListener("click", closeCheatPanel);
}

const selectedGearButton = document.getElementById("selectedGearButton");
const gearSelectorPopup = document.getElementById("gearSelectorPopup");

if (selectedSeedButton) {
    selectedSeedButton.addEventListener("click", () => {
        seedSelectorPopup.classList.toggle("hidden");
        if (gearSelectorPopup) gearSelectorPopup.classList.add("hidden");
    });
}

if (selectedGearButton) {
    selectedGearButton.addEventListener("click", () => {
        gearSelectorPopup.classList.toggle("hidden");
        if (seedSelectorPopup) seedSelectorPopup.classList.add("hidden");
    });
}

document.addEventListener("click", event => {
    if (selectedSeedButton && seedSelectorPopup &&
        !selectedSeedButton.contains(event.target) &&
        !seedSelectorPopup.contains(event.target)) {
        seedSelectorPopup.classList.add("hidden");
    }

    if (selectedGearButton && gearSelectorPopup &&
        !selectedGearButton.contains(event.target) &&
        !gearSelectorPopup.contains(event.target)) {
        gearSelectorPopup.classList.add("hidden");
    }
});

document
    .querySelectorAll(".tool")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const tool =
                    button.dataset.tool;

                if (tool === "shop") {

                    document
                        .getElementById(
                            "shopModal"
                        )
                        .classList.remove(
                            "hidden"
                        );

                    updateUI();

                    return;
                }

                selectedTool = tool;
                updateToolButtons();

                notify(
                    "Tool: " +
                    tool
                );
            }
        );

    });

document
    .querySelectorAll(
        ".tabs .tab"
    )
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".tabs .tab"
                    )
                    .forEach(
                        element =>
                            element.classList.remove(
                                "active"
                            )
                    );

                tab.classList.add(
                    "active"
                );

                const type =
                    tab.dataset.tab;

                document
                    .getElementById(
                        "seedShop"
                    )
                    .classList.toggle(
                        "hidden",
                        type !== "seeds"
                    );

                document
                    .getElementById(
                        "eggShop"
                    )
                    .classList.toggle(
                        "hidden",
                        type !== "eggs"
                    );

                document
                    .getElementById(
                        "gearShop"
                    )
                    .classList.toggle(
                        "hidden",
                        type !== "gears"
                    );
            }
        );

    });

document
    .querySelectorAll(
        ".pet-tabs .tab"
    )
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".pet-tabs .tab"
                    )
                    .forEach(
                        element =>
                            element.classList.remove(
                                "active"
                            )
                    );

                tab.classList.add(
                    "active"
                );

                const type =
                    tab.dataset.petTab;

                document
                    .getElementById(
                        "petList"
                    )
                    .classList.toggle(
                        "hidden",
                        type !== "pets"
                    );

                document
                    .getElementById(
                        "eggInventory"
                    )
                    .classList.toggle(
                        "hidden",
                        type !== "eggs"
                    );
            }
        );

    });

document.getElementById("sellSelectedButton").onclick = sellSelectedCrops;
document.getElementById("sellAllButton").onclick = sellAllCrops;

document
    .getElementById(
        "harvestBagButton"
    )
    .onclick = () => {

        renderHarvestBag();

        document
            .getElementById(
                "harvestModal"
            )
            .classList.remove(
                "hidden"
            );
    };

document
    .getElementById(
        "closeHarvestBag"
    )
    .onclick = () => {

        document
            .getElementById(
                "harvestModal"
            )
            .classList.add(
                "hidden"
            );
    };

document
    .getElementById(
        "closeShop"
    )
    .onclick = () => {

        document
            .getElementById(
                "shopModal"
            )
            .classList.add(
                "hidden"
            );
    };

document
    .getElementById(
        "petButton"
    )
    .onclick = () => {

        renderPets();
        renderEggs();

        document
            .getElementById(
                "petModal"
            )
            .classList.remove(
                "hidden"
            );
    };

document
    .getElementById(
        "closePetModal"
    )
    .onclick = () => {

        document
            .getElementById(
                "petModal"
            )
            .classList.add(
                "hidden"
            );
    };

document
    .getElementById(
        "hatchClose"
    )
    .onclick = () => {

        document
            .getElementById(
                "hatchModal"
            )
            .classList.add(
                "hidden"
            );
    };

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.add(
                        "hidden"
                    );

                }

            }
        );

    });

canvas.addEventListener(
    "click",
    event => {

        const rect =
            canvas.getBoundingClientRect();

        const clickX =
            (event.clientX - rect.left) *
            canvas.width /
            rect.width;

        const clickY =
            (event.clientY - rect.top) *
            canvas.height /
            rect.height;

        const x = clickX;
        const y = clickY;

        // Buah yang sudah matang langsung dipanen saat diklik.
        // Ini berlaku terlepas dari tool yang sedang dipilih.
        let clickedCrop = null;
        let clickedCropDistance = Infinity;

        for (const plot of plots) {
            if (!plot.crop) continue;

            const px = plot.x + plot.width / 2;
            const py = plot.y + plot.height / 2;
            const distance = Math.hypot(x - px, y - py);

            if (distance < clickedCropDistance) {
                clickedCropDistance = distance;
                clickedCrop = plot;
            }
        }

        if (clickedCrop && clickedCropDistance <= 55 && isCropReady(clickedCrop)) {
            harvestPlot(clickedCrop);
            return;
        }

        // Sprinkler dipasang langsung pada posisi klik di garden.
        if (selectedTool === "gear" && selectedGear && gearData[selectedGear]?.type === "sprinkler") {
            placeSprinkler(x, y);
            return;
        }

        // Untuk watering/gear lainnya, cari tanaman terdekat dari klik.
        if (selectedTool !== "plant") {
            let closestCrop = null;
            let closestDistance = Infinity;

            for (const plot of plots) {
                if (!plot.crop) continue;

                const px = plot.x + plot.width / 2;
                const py = plot.y + plot.height / 2;
                const distance = Math.hypot(x - px, y - py);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCrop = plot;
                }
            }

            if (closestCrop && closestDistance <= 55) {
                interactWithPlot(closestCrop);
            } else if (selectedTool === "gear") {
                notify("💧 Klik lebih dekat ke tanaman!");
            }

            return;
        }

        // Untuk planting, gunakan cell tak terlihat yang paling dekat.
        let closestEmpty = null;
        let closestDistance = Infinity;

        for (const plot of plots) {
            if (plot.crop) continue;

            const px = plot.x + plot.width / 2;
            const py = plot.y + plot.height / 2;
            const distance = Math.hypot(x - px, y - py);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEmpty = plot;
            }
        }

        if (
            closestEmpty &&
            x >= gardenArea.x &&
            x <= gardenArea.x + gardenArea.width &&
            y >= gardenArea.y &&
            y <= gardenArea.y + gardenArea.height
        ) {
            interactWithPlot(closestEmpty);
        }
    }
);

function drawBackground() {

    ctx.fillStyle = "#70b85a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (
        let x = 0;
        x < canvas.width;
        x += 30
    ) {

        for (
            let y = 70;
            y < canvas.height;
            y += 30
        ) {

            if (
                (x + y) % 60 === 0
            ) {

                ctx.fillStyle =
                    "rgba(255,255,255,.05)";

                ctx.fillRect(
                    x,
                    y,
                    10,
                    3
                );
            }
        }
    }

    ctx.fillStyle = "#55a9d6";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        70
    );

    ctx.fillStyle =
        "rgba(255,255,255,.25)";

    for (
        let x = 0;
        x < canvas.width;
        x += 80
    ) {

        ctx.fillRect(
            x,
            25,
            35,
            4
        );
    }
}

function roundRect(
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        radius
    );

    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        radius
    );

    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        radius
    );

    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        radius
    );

    ctx.closePath();
}

function drawPlots() {

    updateSprinklerEffects();

    // Satu petak tanah besar, tanpa kotak-kotak plot yang terlihat.
    ctx.fillStyle = "#8b5a35";

    roundRect(
        gardenArea.x,
        gardenArea.y,
        gardenArea.width,
        gardenArea.height,
        22
    );

    ctx.fill();

    // Tekstur tanah sederhana.
    ctx.fillStyle = "rgba(70,40,20,.12)";

    for (let i = 0; i < 90; i++) {
        const x =
            gardenArea.x +
            ((i * 83) % Math.floor(gardenArea.width));
        const y =
            gardenArea.y +
            ((i * 47) % Math.floor(gardenArea.height));

        ctx.fillRect(x, y, 3, 2);
    }

    cleanupExpiredSprinklers();

    placedSprinklers.forEach(sprinkler => {
        const gear = gearData[sprinkler.type];
        if (!gear) return;

        ctx.save();
        ctx.globalAlpha = 0.13;
        ctx.fillStyle = "#64b5f6";
        ctx.beginPath();
        ctx.arc(sprinkler.x, sprinkler.y, gear.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = "#4da3df";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(sprinkler.x, sprinkler.y, gear.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.globalAlpha = 1;
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(gear.emoji, sprinkler.x, sprinkler.y);
        ctx.restore();
    });

    plots.forEach(plot => {
        if (plot.crop) {
            drawCrop(plot);
        }
    });
}

function drawCrop(plot) {

    const crop =
        cropTypes[plot.crop];

    const growth =
        getGrowth(plot);

    const tier = plot.weight
        ? getWeightTier(
            plot.weight,
            crop.minWeight
        )
        : { name: "Normal", emoji: "🌱", scale: 1 };

    let size =
        growth < 0.25
            ? 15
            : growth < 0.6
                ? 23
                : growth < 1
                    ? 30
                    : 38;

    size *= tier.scale;

    const x =
        plot.x +
        plot.width / 2;

    const y =
        plot.y +
        plot.height / 2;

    ctx.strokeStyle =
        "#286a2b";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + 18
    );

    ctx.lineTo(
        x,
        y - 5
    );

    ctx.stroke();

    ctx.fillStyle =
        "#3c9b3c";

    ctx.beginPath();

    ctx.ellipse(
        x - 9,
        y - 5,
        12,
        7,
        -0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.ellipse(
        x + 9,
        y - 5,
        12,
        7,
        0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    if (growth >= 0.25) {

        ctx.font =
            size +
            "px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        const mutations = normalizeMutations(plot);

        if (mutations.includes("rainbow")) {
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 18;
            ctx.fillText("🌈" + crop.emoji, x, y + 5);
            ctx.shadowBlur = 0;
        } else if (mutations.includes("gold")) {

            ctx.shadowColor =
                "#ffd700";

            ctx.shadowBlur = 15;

            ctx.fillText(
                "✨" +
                crop.emoji,
                x,
                y + 5
            );

            ctx.shadowBlur = 0;

        } else {

            ctx.fillText(
                crop.emoji,
                x,
                y + 5
            );
        }
    }

    if (growth >= 1) {

        ctx.fillStyle =
            "#ffe44c";

        ctx.beginPath();

        ctx.arc(
            plot.x +
            plot.width -
            12,
            plot.y + 12,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    if (plot.watered) {

        ctx.font =
            "15px Arial";

        ctx.fillText(
            "💧",
            plot.x + 12,
            plot.y + 15
        );
    }
}

function drawMantisAreas() {
    const now = Date.now();
    plots.forEach(plot => {
        if (!plot.crop || !plot.mantisActiveUntil || now >= plot.mantisActiveUntil) return;
        const x = plot.x + plot.width / 2;
        const y = plot.y + plot.height / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 48, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(170, 235, 120, 0.9)";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🙏", x, y - 32);
        ctx.restore();
    });
}

function drawPets() {

    const activePets = [];

    Object.entries(petData).forEach(
        ([id, pet]) => {

            for (
                let i = 0;
                i < pet.equipped;
                i++
            ) {
                activePets.push({
                    id: id,
                    pet: pet,
                    index: i
                });
            }

        }
    );

    activePets.forEach(
        (active, index) => {

            const id = active.id;
            const pet = active.pet;
            const uniqueKey =
                id + "_" + active.index;

            if (!petRuntime[uniqueKey]) {

                petRuntime[uniqueKey] = {
                    x: 100 +
                        Math.random() * 700,

                    y: 100 +
                        Math.random() * 350,

                    targetX: 100 +
                        Math.random() * 700,

                    targetY: 100 +
                        Math.random() * 350
                };
            }

            const runtime =
                petRuntime[uniqueKey];

            if (
                Math.hypot(
                    runtime.targetX -
                    runtime.x,

                    runtime.targetY -
                    runtime.y
                ) < 8
            ) {

                runtime.targetX =
                    100 +
                    Math.random() * 700;

                runtime.targetY =
                    90 +
                    Math.random() * 400;
            }

            const dx =
                runtime.targetX -
                runtime.x;

            const dy =
                runtime.targetY -
                runtime.y;

            const distance =
                Math.hypot(dx, dy) || 1;

            runtime.x +=
                dx / distance * 0.8;

            runtime.y +=
                dy / distance * 0.8;

            ctx.font = "35px Arial";

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                pet.emoji,
                runtime.x,
                runtime.y
            );
        }
    );
}

const WEATHER_TYPES = ["Rainy", "Moonlight", "Bloodmoon", "Frost"];
const WEATHER_INTERVAL = 300000;
const WEATHER_DURATION = 30000;

function startWeatherEvent() {
    weather = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
    weatherActive = true;
    weatherEventId++;
    plots.forEach(plot => { plot.weatherMutationEvent = -1; });
    applyWeatherMutations();
    updateUI();
    notify("🌦️ Weather: " + weather + " selama 30 detik!");

    setTimeout(() => {
        weatherActive = false;
        weather = "Sunny";
        updateUI();
        saveGame();
        notify("☀️ Weather selesai.");
    }, WEATHER_DURATION);
}

function startWeatherCycle() {
    if (weatherTimerStarted) return;
    weatherTimerStarted = true;
    setInterval(() => {
        startWeatherEvent();
    }, WEATHER_INTERVAL);
}

function updatePets() {
    bunnySkill(); goldenLabSkill(); dogSkill(); prayingMantisSkill(); dragonflySkill(); moleSkill(); frogSkill(); echoFrogSkill(); raccoonSkill();
    plots.forEach(plot => { if (plot.mantisActiveUntil && Date.now() >= plot.mantisActiveUntil) { plot.mantisActiveUntil=0; plot.mantisBoost=false; } applyGrowingMutation(plot); });
}

function gameLoop() {

    applyWeatherMutations();
    drawBackground();

    drawPlots();

    drawMantisAreas();

    drawPets();

    updatePets();

    requestAnimationFrame(
        gameLoop
    );
}

loadGame();

renderSeedShop();
updateUI();
updateToolButtons();
renderPets();
renderCheatSeedButtons();

renderEggs();
startWeatherCycle();

gameLoop();
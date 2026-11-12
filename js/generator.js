
let generatedValues = [];

function generateNumbers() {
    try {
        const params = getParameters();

        let seed = parseInteger(
            document.getElementById("seed").value
        );

        const count = Number(
            document.getElementById("count").value
        );

        const format = document.getElementById("outputFormat").value;
        const javaMode = document.getElementById("javaMode").checked;

        if (
            !Number.isInteger(count) ||
            count < 1 ||
            count > 10000
        ) {
            throw new Error("生成数は1～10000で指定してください。");
        }

        if (javaMode) {
            if (params.stateBits !== 48) {
                throw new Error("Java Randomモードでは内部状態を48ビットにしてください。");
            }

            if (params.multiplier !== 25214903917n || params.addend !== 11n) {
                throw new Error("Java Randomの乗数と加算値を設定してください。");
            }

            seed = (seed ^ params.multiplier) & params.mask;
        }

        const rng = new LCG(seed, params);

        generatedValues = [];

        for (let i = 0; i < count; i++) {
            const value = rng.next();

            generatedValues.push({
                index: i + 1,
                value: value.toString(),
                formatted: formatOutput(
                    value,
                    params.outputBits,
                    format
                ),
                state: rng.getState().toString()
            });
        }

        renderGeneratedResults();
        updateAnalysisLimit();

    } catch (error) {
        showError("generatorOutput", error.message);
    }
}

function renderGeneratedResults() {
    const container = document.getElementById("generatorOutput");

    container.innerHTML = "";

    const list = document.createElement("ul");
    list.className = "output-list";

    generatedValues.forEach(item => {
        const li = document.createElement("li");

        const index = document.createElement("span");
        index.className = "output-index";
        index.textContent = item.index;

        const value = document.createElement("span");
        value.className = "output-value";
        value.textContent = item.formatted;

        li.append(index, value);
        list.appendChild(li);
    });

    container.appendChild(list);

    document.getElementById("generatedCount").textContent =
        `${generatedValues.length}`;
}

function clearGenerator() {
    generatedValues = [];

    const container = document.getElementById("generatorOutput");

    container.innerHTML = "";

    const placeholder = document.createElement("p");
    placeholder.className = "placeholder";
    placeholder.textContent = translations[currentLanguage].noResults;

    container.appendChild(placeholder);

    document.getElementById("generatedCount").textContent = "0";

    updateAnalysisLimit();
}

function generateRandomSeed() {
    const bits = Number(
        document.getElementById("stateBits").value
    );

    if (!Number.isInteger(bits) || bits < 2 || bits > 64) {
        showError("generatorOutput", "内部状態ビット数を確認してください。");
        return;
    }

    const value = randomBigInt(bits);

    document.getElementById("seed").value = value.toString();
}

function exportCSV() {
    if (generatedValues.length === 0) {
        showError("generatorOutput", "出力するデータがありません。");
        return;
    }

    const rows = [
        ["Index", "Value", "Internal State"],
        ...generatedValues.map(item => [
            item.index,
            item.formatted,
            item.state
        ])
    ];

    const csv = rows
        .map(row => row.map(value => `"${value}"`).join(","))
        .join("\n");

    downloadFile(
        "lcg-results.csv",
        "\uFEFF" + csv,
        "text/csv;charset=utf-8"
    );
}

function exportJSON() {
    if (generatedValues.length === 0) {
        showError("generatorOutput", "出力するデータがありません。");
        return;
    }

    const data = {
        parameters: {
            stateBits: Number(document.getElementById("stateBits").value),
            outputBits: Number(document.getElementById("outputBits").value),
            multiplier: document.getElementById("multiplier").value,
            addend: document.getElementById("addend").value
        },
        results: generatedValues
    };

    downloadFile(
        "lcg-results.json",
        JSON.stringify(data, null, 2),
        "application/json"
    );
}

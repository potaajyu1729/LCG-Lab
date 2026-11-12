
function analyzeSequence() {
    const container = document.getElementById("analyzerOutput");

    try {
        const params = getParameters();

        if (params.multiplier % 2n === 0n) {
            throw new Error(
                "現在の解析方式では乗数を奇数にしてください。"
            );
        }

        const observations = parseObservations(
            document.getElementById("observations").value,
            params.outputBits
        );

        const analysisCount = Number(
            document.getElementById("analysisCount").value
        );

        const predictionCount = Number(
            document.getElementById("predictionCount").value
        );

        if (
            !Number.isInteger(analysisCount) ||
            analysisCount < 2 ||
            analysisCount > observations.length
        ) {
            throw new Error("解析に使用する個数を確認してください。");
        }

        if (
            !Number.isInteger(predictionCount) ||
            predictionCount < 1 ||
            predictionCount > 1000
        ) {
            throw new Error("予測数は1～1000で指定してください。");
        }

        const usedObservations = observations.slice(0, analysisCount);

        const unknownBits = params.stateBits - params.outputBits;

        if (unknownBits > 24) {
            throw new Error(
                `未知ビット数が${unknownBits}ビットあります。現在の解析上限は24ビットです。`
            );
        }

        const searchCount = 1n << BigInt(unknownBits);
        const outputShift = BigInt(unknownBits);

        let recoveredState = null;
        let candidates = 0;

        for (let low = 0n; low < searchCount; low++) {
            const firstState =
                (usedObservations[0] << outputShift) | low;

            let state = firstState;
            let matched = true;

            for (let i = 1; i < usedObservations.length; i++) {
                state = (
                    state * params.multiplier + params.addend
                ) & params.mask;

                const output = state >> outputShift;

                if (output !== usedObservations[i]) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                candidates++;
                recoveredState = firstState;

                if (candidates > 1) {
                    break;
                }
            }
        }

        container.innerHTML = "";

        if (candidates === 0) {
            throw new Error(
                "一致する内部状態が見つかりませんでした。設定や入力値を確認してください。"
            );
        }

        if (candidates > 1) {
            throw new Error(
                "複数の候補が見つかりました。観測値を増やしてください。"
            );
        }

        // recoveredStateは最初の観測値に対応する内部状態。
        // 最後の観測値の状態まで進めるため、N-1回だけ進める。
        let state = recoveredState;

        for (let i = 1; i < usedObservations.length; i++) {
            state = (
                state * params.multiplier + params.addend
            ) & params.mask;
        }

        const rng = new LCG(state, params);

        const predictions = [];

        for (let i = 0; i < predictionCount; i++) {
            const value = rng.next();

            predictions.push({
                index: i + 1,
                value: value.toString()
            });
        }

        renderAnalysisResults({
            recoveredState,
            usedObservations,
            predictions,
            params
        });

    } catch (error) {
        showError("analyzerOutput", error.message);
    }
}

function renderAnalysisResults(result) {
    const container = document.getElementById("analyzerOutput");

    container.innerHTML = "";

    const info = document.createElement("div");
    info.className = "analysis-info";

    const title = document.createElement("p");
    title.className = "analysis-success";
    title.textContent = translations[currentLanguage].analysisSuccess;

    const state = document.createElement("p");
    state.textContent =
        `${translations[currentLanguage].recoveredState}: ${result.recoveredState}`;

    const used = document.createElement("p");
    used.textContent =
        `${translations[currentLanguage].usedCount}: ${result.usedObservations.length}`;

    info.append(title, state, used);

    const heading = document.createElement("h3");
    heading.textContent = translations[currentLanguage].predictions;

    const list = document.createElement("ul");
    list.className = "output-list";

    const format = document.getElementById("outputFormat").value;

    result.predictions.forEach(item => {
        const li = document.createElement("li");

        const index = document.createElement("span");
        index.className = "output-index";
        index.textContent = item.index;

        const value = document.createElement("span");
        value.className = "output-value";
        value.textContent = formatOutput(
            BigInt(item.value),
            result.params.outputBits,
            format
        );

        li.append(index, value);
        list.appendChild(li);
    });

    container.append(info, heading, list);
}

function fillGeneratedValues() {
    if (generatedValues.length === 0) {
        showError(
            "analyzerOutput",
            translations[currentLanguage].noGeneratedData
        );
        return;
    }

    const count = Math.min(
        generatedValues.length,
        Number(document.getElementById("analysisCount").value)
    );

    document.getElementById("observations").value =
        generatedValues
            .slice(0, count)
            .map(item => item.formatted)
            .join("\n");

    document.getElementById("analysisCount").value = count;
}

function clearAnalyzer() {
    document.getElementById("observations").value = "";

    const container = document.getElementById("analyzerOutput");

    container.innerHTML = "";

    const placeholder = document.createElement("p");
    placeholder.className = "placeholder";
    placeholder.textContent = translations[currentLanguage].noAnalysis;

    container.appendChild(placeholder);
}

function updateAnalysisLimit() {
    const input = document.getElementById("analysisCount");

    const count = generatedValues.length > 0
        ? generatedValues.length
        : Math.max(
            2,
            Number(document.getElementById("count").value) || 2
        );

    input.max = count;

    let current = Number(input.value);

    if (!Number.isFinite(current)) {
        current = Math.min(20, count);
    }

    input.value = Math.max(2, Math.min(current, count));
}

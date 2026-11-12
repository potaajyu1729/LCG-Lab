
let currentLanguage = localStorage.getItem("lcg-language") || "ja";

const translations = {
    ja: {
        description: "LCGの乱数生成・解析・予測ツール。",
        settings: "共通設定",
        stateBits: "内部状態ビット数",
        outputBits: "出力ビット数",
        multiplier: "乗数 (Multiplier)",
        addend: "加算値 (Addend)",
        settingsHint: "設定は生成と解析の両方に適用されます。",
        generator: "乱数生成",
        seed: "シード値",
        randomSeed: "ランダム",
        count: "生成数",
        format: "出力形式",
        javaMode: "Java Randomモード",
        generate: "生成する",
        generatedResults: "生成結果",
        exportCsv: "CSV出力",
        exportJson: "JSON出力",
        clear: "クリア",
        noResults: "まだ生成結果がありません。",
        analyzer: "状態解析・予測",
        analysisCount: "解析に使用する個数",
        fillGenerated: "生成結果を入力",
        observations: "観測された乱数",
        predictionCount: "予測する個数",
        analyze: "解析する",
        analysisResults: "解析結果",
        noAnalysis: "まだ解析されていません。",
        about: "LCGについて",
        aboutText: "LCG（線形合同法）は、前の内部状態を利用して次の状態を計算する疑似乱数生成方式です。",
        aboutDetail: "aは乗数、cは加算値、mは内部状態の範囲を表します。",
        analysisSuccess: "内部状態の解析に成功しました。",
        recoveredState: "復元された内部状態",
        usedCount: "使用した観測値",
        predictions: "次の乱数の予測",
        noGeneratedData: "先に乱数を生成してください。"
    },

    en: {
        description: "LCG Random Number Generator, Analyzer & Predictor.",
        settings: "General Settings",
        stateBits: "State Bits",
        outputBits: "Output Bits",
        multiplier: "Multiplier",
        addend: "Addend",
        settingsHint: "Settings apply to both generation and analysis.",
        generator: "Generator",
        seed: "Seed",
        randomSeed: "Random",
        count: "Number of Outputs",
        format: "Output Format",
        javaMode: "Java Random Mode",
        generate: "Generate",
        generatedResults: "Generated Results",
        exportCsv: "Export CSV",
        exportJson: "Export JSON",
        clear: "Clear",
        noResults: "No results generated yet.",
        analyzer: "Analyzer & Predictor",
        analysisCount: "Number of Observations",
        fillGenerated: "Use Generated Results",
        observations: "Observed Numbers",
        predictionCount: "Number of Predictions",
        analyze: "Analyze",
        analysisResults: "Analysis Results",
        noAnalysis: "No analysis performed yet.",
        about: "About LCG",
        aboutText: "A Linear Congruential Generator (LCG) is a pseudorandom number generator that calculates the next state from the previous one.",
        aboutDetail: "a is the multiplier, c is the addend, and m is the modulus.",
        analysisSuccess: "Internal state recovered successfully.",
        recoveredState: "Recovered Internal State",
        usedCount: "Observations Used",
        predictions: "Predicted Numbers",
        noGeneratedData: "Generate numbers first."
    }
};

function applyLanguage() {
    const dictionary = translations[currentLanguage];

    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (dictionary[key]) {
            element.textContent = dictionary[key];
        }
    });

    document.getElementById("languageButton").textContent =
        currentLanguage === "ja" ? "English" : "日本語";

    document.getElementById("observations").placeholder =
        currentLanguage === "ja"
            ? "例: 3 12 10 13 12 3 8 13"
            : "Example: 3 12 10 13 12 3 8 13";
}

function toggleLanguage() {
    currentLanguage = currentLanguage === "ja" ? "en" : "ja";

    localStorage.setItem("lcg-language", currentLanguage);

    applyLanguage();
}

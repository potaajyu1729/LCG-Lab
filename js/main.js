
document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();

    // Language
    document.getElementById("languageButton")
        .addEventListener("click", toggleLanguage);

    // Generator
    document.getElementById("generateButton")
        .addEventListener("click", generateNumbers);

    document.getElementById("randomSeedButton")
        .addEventListener("click", generateRandomSeed);

    document.getElementById("clearGeneratorButton")
        .addEventListener("click", clearGenerator);

    document.getElementById("csvButton")
        .addEventListener("click", exportCSV);

    document.getElementById("jsonButton")
        .addEventListener("click", exportJSON);

    // Analyzer
    document.getElementById("analyzeButton")
        .addEventListener("click", analyzeSequence);

    document.getElementById("fillFirstButton")
        .addEventListener("click", fillGeneratedValues);

    document.getElementById("clearAnalyzerButton")
        .addEventListener("click", clearAnalyzer);

    // Update analysis limit
    document.getElementById("count")
        .addEventListener("input", updateAnalysisLimit);

    document.getElementById("analysisCount")
        .addEventListener("input", () => {
            const input = document.getElementById("analysisCount");
            const max = Number(input.max);

            if (Number(input.value) > max) {
                input.value = max;
            }
        });

    document.getElementById("stateBits")
        .addEventListener("change", updateAnalysisLimit);

    // Initial state
    updateAnalysisLimit();
});

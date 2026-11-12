
function getParameters() {
    const stateBits = Number(
        document.getElementById("stateBits").value
    );

    const outputBits = Number(
        document.getElementById("outputBits").value
    );

    if (
        !Number.isInteger(stateBits) ||
        stateBits < 2 ||
        stateBits > 64
    ) {
        throw new Error("内部状態ビット数は2～64で指定してください。");
    }

    if (
        !Number.isInteger(outputBits) ||
        outputBits < 1 ||
        outputBits > stateBits
    ) {
        throw new Error("出力ビット数が不正です。");
    }

    const multiplierInput = document.getElementById("multiplier").value.trim();
    const addendInput = document.getElementById("addend").value.trim();

    if (!multiplierInput || !addendInput) {
        throw new Error("乗数と加算値を入力してください。");
    }

    let multiplier;
    let addend;

    try {
        multiplier = BigInt(multiplierInput);
        addend = BigInt(addendInput);
    } catch {
        throw new Error("乗数と加算値は整数で入力してください。");
    }

    const modulus = 1n << BigInt(stateBits);
    const mask = modulus - 1n;

    return {
        stateBits,
        outputBits,
        multiplier: multiplier & mask,
        addend: addend & mask,
        modulus,
        mask
    };
}

function parseInteger(value) {
    const text = String(value).trim();

    if (!text) {
        throw new Error("数値が空です。");
    }

    try {
        return BigInt(text);
    } catch {
        throw new Error(`不正な数値です: ${text}`);
    }
}

function formatOutput(value, outputBits, format) {
    const bits = BigInt(outputBits);
    const modulus = 1n << bits;
    const mask = modulus - 1n;

    const unsignedValue = BigInt(value) & mask;

    if (format === "hex") {
        return "0x" + unsignedValue.toString(16).toUpperCase();
    }

    if (format === "signed") {
        const signBit = 1n << (bits - 1n);

        if (unsignedValue >= signBit) {
            return (unsignedValue - modulus).toString();
        }
    }

    return unsignedValue.toString();
}

function parseObservations(text, outputBits) {
    const tokens = text
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean);

    if (tokens.length === 0) {
        throw new Error("解析する数値を入力してください。");
    }

    const mask = (1n << BigInt(outputBits)) - 1n;

    return tokens.map(token => {
        const value = parseInteger(token);
        return value & mask;
    });
}

function randomBigInt(bits) {
    const bytes = Math.ceil(bits / 8);
    const array = new Uint8Array(bytes);

    crypto.getRandomValues(array);

    let value = 0n;

    for (const byte of array) {
        value = (value << 8n) | BigInt(byte);
    }

    return value & ((1n << BigInt(bits)) - 1n);
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);

    element.innerHTML = "";

    const paragraph = document.createElement("p");
    paragraph.className = "analysis-error";
    paragraph.textContent = message;

    element.appendChild(paragraph);
}

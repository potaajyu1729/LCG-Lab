# LCG-Lab

**LCG Random Number Generator, Analyzer & Predictor.**

LCGの乱数生成・解析・予測ツール。 / LCG Random Number Generator, Analyzer &amp; Predictor.

# 日本語

## 概要

LCG Labは、線形合同法（LCG）を使用して乱数の生成・解析・予測を行う学習用ツールです。

疑似乱数生成器の仕組みや、出力された乱数から内部状態を復元する仕組みを学ぶことを目的としています。

## 主な機能

- LCGによる乱数生成
- 内部状態の解析・復元
- 次の乱数の予測
- Java Randomモード
- ランダムシード生成
- Unsigned / Signed / 16進数形式への対応
- CSV / JSON出力
- 日本語 / 英語の切り替え

## 動作環境

- Webブラウザ
- JavaScript（BigInt API対応）
- HTML / CSS

サーバーや外部ライブラリは必要ありません。

## 使い方

1. 内部状態のビット数と出力ビット数を設定します。
2. 乗数・加算値・シード値を設定します。
3. 生成数を指定して乱数を生成します。
4. 生成した数値を解析欄に入力します。
5. 解析を実行すると、内部状態の候補を探索し、次の乱数を予測します。

## 解析方式について

観測された乱数の上位ビットとLCGの計算式を利用し、未知の下位ビットを総当たりで探索します。

現在の実装では、未知ビット数が24ビット以下の場合に解析できます。

---

# English

## Features

- Pseudorandom number generation using LCG
- Internal state analysis and recovery
- Prediction of subsequent random numbers
- Java Random mode
- Random seed generation
- Support for Unsigned / Signed / Hexadecimal formats
- Export to CSV / JSON
- Japanese / English language support
- Runs directly in a web browser

## Project Structure

```text
LCG-Lab/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    ├── main.js
    ├── lcg.js
    ├── generator.js
    ├── analyzer.js
    ├── language.js
    └── utils.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/potaajyu1729/LCG-Lab.git
```

### 2. Open the project

```bash
cd LCG-Lab
```

### 3. Run

Open `index.html` in your browser.

You can also use VS Code with Live Server.

## How It Works

LCG generates pseudorandom numbers using the following formula:

\[
X_{n+1} = (aX_n + c) \bmod m
\]

- `X`: Internal state
- `a`: Multiplier
- `c`: Addend
- `m`: Modulus

The analyzer searches for possible internal states based on observed outputs and uses the recovered state to predict subsequent values.

## Limitations

- State recovery currently supports up to 24 unknown bits.
- The analyzer assumes consecutive outputs from the configured LCG.
- Java Random mode uses Java's 48-bit internal state.
- Non-power-of-two `Random.nextInt(bound)` calls with rejection sampling are not directly supported by the analyzer.

## Technologies

- HTML
- CSS
- JavaScript
- BigInt API
- Web Crypto API

No external libraries or frameworks are required.

---

## Acknowledgements

This project was developed with assistance from **ChatGPT by OpenAI**.

README documentation, code organization, implementation, and debugging were supported by AI assistance.

## License

[MIT License](https://github.com/potaajyu1729/LCG-Lab#MIT-1-ov-file)
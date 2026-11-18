#!/usr/bin/env node

const url = process.argv[2];

if (!url) {
  console.error('Использование: node speed.js <URL>');
  process.exit(1);
}

const REQUESTS = 10;
const TIMEOUT_MS = 30_000;

async function main() {
  let totalBytes = 0;
  let totalTime = 0;

  for (let i = 1; i <= REQUESTS; i += 1) {
    const started = performance.now();

    const response = await fetch(url, {
      headers: { 'accept-encoding': 'identity' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = await response.arrayBuffer();
    const elapsed = (performance.now() - started) / 1000;

    totalBytes += body.byteLength;
    totalTime += elapsed;

    console.log(`#${i}: ${elapsed.toFixed(3)} с, ${(body.byteLength / 1e6).toFixed(2)} МБ`);
  }

  console.log();
  console.log(`Среднее время: ${(totalTime / REQUESTS).toFixed(3)} с`);
  console.log(`Всего скачано: ${(totalBytes / 1e6).toFixed(2)} МБ (${totalBytes} байт)`);
  console.log(`Скорость: ${(totalBytes / totalTime / 1e6).toFixed(2)} МБ/с`);
}

main().catch((error) => {
  console.error(`Ошибка: ${error.message}`);
  process.exit(1);
});

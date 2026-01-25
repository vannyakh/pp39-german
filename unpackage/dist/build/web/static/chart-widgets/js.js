let chart;
let currentInterval = "D";
let currentTheme = "light";
let currentLanguage = "en";
let currentStockId = "";
let currentApi = "https://api.bvbkwil.com";
let initialized = false;


// Parse URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        interval: params.get("interval") || "D",
        theme: params.get("theme") || "light",
        api: params.get("api") || currentApi,
        language: params.get("language") || params.get("lang") || "en",
        stock_id: params.get("stock_id") || params.get("id") || "",
    };
}

function getThemeStyles(theme) {
    if (theme === "light") {
        return {
            grid: {
                show: false,
                horizontal: { color: "#e0e0e0" },
                vertical: { color: "#e0e0e0" },
            },
            candle: {
                type: "candle_solid",
                bar: {
                    upColor: "#26a69a",
                    downColor: "#ef5350",
                    noChangeColor: "#888888",
                },
                tooltip: { showRule: "none", text: { size: 12, color: "#333" } },
            },
            xAxis: { axisLine: { color: "#d0d0d0" }, tickText: { color: "#666" } },
            yAxis: { axisLine: { color: "#d0d0d0" }, tickText: { color: "#666" } },
            crosshair: {
                horizontal: {
                    line: { color: "#999" },
                    text: { backgroundColor: "#666", color: "#fff" },
                },
                vertical: {
                    line: { color: "#999" },
                    text: { backgroundColor: "#666", color: "#fff" },
                },
            },
        };
    } else {
        return {
            grid: {
                show: false,
                horizontal: { color: "#2a2a2a" },
                vertical: { color: "#2a2a2a" },
            },
            candle: {
                type: "candle_solid",
                bar: {
                    upColor: "#26a69a",
                    downColor: "#ef5350",
                    noChangeColor: "#888888",
                },
                tooltip: { showRule: "none", text: { size: 12, color: "#fff" } },
            },
            xAxis: { axisLine: { color: "#404040" }, tickText: { color: "#999" } },
            yAxis: { axisLine: { color: "#404040" }, tickText: { color: "#999" } },
            crosshair: {
                horizontal: {
                    line: { color: "#666" },
                    text: { backgroundColor: "#404040", color: "#fff" },
                },
                vertical: {
                    line: { color: "#666" },
                    text: { backgroundColor: "#404040", color: "#fff" },
                },
            },
        };
    }
}

function initChart() {
    const params = getUrlParams();
    currentInterval = params.interval;
    currentTheme = params.theme;
    currentLanguage = params.language;
    currentApi = params.api || currentApi;
    currentStockId = params.stock_id;
    document.body.className = currentTheme;

    // Register custom theme with styles
    klinecharts.registerStyles('customTheme', getThemeStyles(currentTheme));

    // ensure customTheme is available then use it with custom layout
    const customLayout = [
        {
            type: 'candle',
            content: ['MA', { name: 'EMA', calcParams: [10, 30] }],
            options: { order: Number.MIN_SAFE_INTEGER }
        },
        { type: 'indicator', content: ['VOL'], options: { order: 10 } },
        { type: 'xAxis', options: { order: 9 } }
    ];
    try {
        chart = klinecharts.init('chart', { styles: 'customTheme', layout: customLayout });
    } catch (e) {
        chart = klinecharts.init('chart', { styles: 'customTheme' });
    }

    loadData(currentInterval);
    setInterval(() => refreshData(), 30000);
}

function transformApiData(list) {
    if (!Array.isArray(list)) return [];
    return list
        .map((it) => ({
            timestamp:
                (Number(it.time) || Date.parse(it.period)) * 1000
                    ? Number(it.time) * 1000
                    : Date.parse(it.period),
            open: Number(it.open),
            high: Number(it.high),
            low: Number(it.low),
            close: Number(it.close),
            volume: Number(it.volume),
        }))
        .filter((d) => !Number.isNaN(d.timestamp));
}

async function fetchKline(interval) {
    const base = currentApi + "/api/index/kline";
    const params = new URLSearchParams();
    if (currentStockId) params.set("stock_id", currentStockId);
    params.set("interval", interval || currentInterval || "D");
    const url = `${base}?${params.toString()}`;
    try {
        const res = await fetch(url, { method: "GET" });
        const json = await res.json();
        if (json && json.code === 1) return transformApiData(json.data);
    } catch (e) {
        console.error("fetchKline error:", e);
    }
    return [];
}

async function loadData(interval) {
    showLoading(true);
    const data = await fetchKline(interval);
    const list = Array.isArray(data) ? data : [];
    chart.applyNewData(list);
    initialized = true;
    showLoading(false);
}

async function refreshData() {
    showLoading(true);
    const data = await fetchKline(currentInterval);
    const list = Array.isArray(data) ? data : [];
    if (!initialized || !chart) {
        chart.applyNewData(list);
        initialized = true;
        showLoading(false);
        return;
    }
    if (!list.length) return;
    const existing = chart.getDataList() || [];
    if (!existing.length) {
        chart.applyNewData(list);
        showLoading(false);
        return;
    }
    const lastTs = existing[existing.length - 1].timestamp;
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.timestamp >= lastTs) {
            // same timestamp updates the current candle; greater appends as new candle
            chart.updateData(item);
        }
    }
    showLoading(false);
}

window.addEventListener("load", initChart);
window.addEventListener("resize", () => {
    if (chart) chart.resize();
});

window.chartWidget = {
    updateData(data) {
        if (chart && Array.isArray(data)) chart.applyNewData(data);
    },
    setInterval(interval) { currentInterval = interval; refreshData(); },
    setTheme(theme) {
        currentTheme = theme;
        document.body.className = theme;
        // Re-register custom theme with new theme styles
        klinecharts.registerStyles('customTheme', getThemeStyles(theme));
        if (chart && chart.setStyles) chart.setStyles('customTheme');
    },
    setLanguage(lang) {
        currentLanguage = lang;
    },
    getChart() {
        return chart;
    },
    getConfig() {
        return {
            interval: currentInterval,
            theme: currentTheme,
            language: currentLanguage,
        };
    },
};

function showLoading(show) {
    const el = document.getElementById('loading');
    if (!el) return;
    el.style.display = show ? 'flex' : 'none';
}

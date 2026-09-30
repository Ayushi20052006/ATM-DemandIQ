import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  CreditCard,
  Download,
  Filter,
  Flame,
  Info,
  Layers,
  Lightbulb,
  MapPin,
  Maximize2,
  Navigation,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Truck,
  User,
  Zap,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const API_BASE_URL = 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'fleet', 'forecast', 'replenishment', 'analytics'
  const [atms, setAtms] = useState([]);
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedAtmId, setSelectedAtmId] = useState('atm-1087');
  const [forecastData, setForecastData] = useState([]);
  const [atmTransactions, setAtmTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [forecastHorizon, setForecastHorizon] = useState(14); // 7, 14, 30

  // Auto-Refresh 1 Minute Timer (Showcase Mode)
  const [refreshCountdown, setRefreshCountdown] = useState(60);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'CRITICAL', 'WARNING', 'NORMAL'

  // Modal State
  const [replenishModalAtm, setReplenishModalAtm] = useState(null);

  // Initial Fetch & 1-Minute Auto-Refresh Timer
  useEffect(() => {
    fetchDashboardData();

    // 1-minute (60s) auto refresh loop for showcase
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          fetchDashboardData();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedAtmId) {
      fetchAtmForecast(selectedAtmId, forecastHorizon);
      fetchAtmTransactions(selectedAtmId);
    }
  }, [selectedAtmId, forecastHorizon]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [atmsRes, summaryRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/atms`),
        fetch(`${API_BASE_URL}/api/analytics/summary`),
        fetch(`${API_BASE_URL}/api/replenishment-alerts`)
      ]);

      if (atmsRes.ok && summaryRes.ok && alertsRes.ok) {
        const atmsData = await atmsRes.json();
        const summaryData = await summaryRes.json();
        const alertsData = await alertsRes.json();

        setAtms(atmsData.atms || []);
        setSummary(summaryData);
        setAlerts(alertsData.alerts || []);
        setApiOnline(true);
      } else {
        throw new Error('API error');
      }
    } catch (err) {
      console.warn('API Offline, using Institutional Ledger simulation data:', err);
      setApiOnline(false);
      loadFallbackInstitutionalData();
    } finally {
      setLoading(false);
    }
  };

  const fetchAtmForecast = async (atmId, horizon) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/forecasts/${atmId}?days=${horizon}`);
      if (res.ok) {
        const data = await res.json();
        setForecastData(data.forecasts || []);
      } else {
        throw new Error('Forecast fetch error');
      }
    } catch (err) {
      const dates = ['Sep 29', 'Sep 30', 'Oct 01', 'Oct 02', 'Oct 03', 'Oct 04', 'Oct 05', 'Oct 06', 'Oct 07', 'Oct 08', 'Oct 09', 'Oct 10', 'Oct 11', 'Oct 12'];
      const mockForecasts = dates.slice(0, horizon).map((dt, idx) => {
        const base = 12500 + Math.sin(idx) * 4500 + (idx === 3 ? 6300 : 0);
        return {
          weekday: dt,
          predicted_amount_usd: Math.round(base),
          lower_bound_usd: Math.round(base * 0.88),
          upper_bound_usd: Math.round(base * 1.12),
          projected_cash_level_usd: Math.max(0, 50000 - base * (idx + 1) * 0.3)
        };
      });
      setForecastData(mockForecasts);
    }
  };

  const fetchAtmTransactions = async (atmId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/atms/${atmId}/transactions?limit=15`);
      if (res.ok) {
        const data = await res.json();
        setAtmTransactions(data.transactions || []);
      }
    } catch (err) {
      setAtmTransactions([]);
    }
  };

  const loadFallbackInstitutionalData = () => {
    const fallbackAtms = [
      { atm_id: 'atm-1087', name: 'ATM-1087 (Ghaziabad Hub)', location_type: 'Transit & Retail', capacity_usd: 50000, current_cash_usd: 8500, min_threshold_usd: 12000, status: 'CRITICAL', cash_percentage: 17.0, cash_out_risk: 'CRITICAL', time_to_empty: '4.2h', cassettes: [ { denomination: '₹2000', level: '8%' }, { denomination: '₹500', level: '14%' }, { denomination: '₹200', level: '22%' }, { denomination: '₹100', level: '35%' } ] },
      { atm_id: 'atm-2041', name: 'ATM-2041 (Connaught Place)', location_type: 'High-Density Commercial', capacity_usd: 80000, current_cash_usd: 14200, min_threshold_usd: 15000, status: 'WARNING', cash_percentage: 17.75, cash_out_risk: 'HIGH', time_to_empty: '8.5h', cassettes: [ { denomination: '₹2000', level: '12%' }, { denomination: '₹500', level: '19%' }, { denomination: '₹200', level: '28%' }, { denomination: '₹100', level: '40%' } ] },
      { atm_id: 'atm-3092', name: 'ATM-3092 (Noida Sec 62)', location_type: 'IT Corridor', capacity_usd: 60000, current_cash_usd: 42000, min_threshold_usd: 8000, status: 'ACTIVE', cash_percentage: 70.0, cash_out_risk: 'LOW', time_to_empty: '34h', cassettes: [ { denomination: '₹2000', level: '65%' }, { denomination: '₹500', level: '72%' }, { denomination: '₹200', level: '78%' }, { denomination: '₹100', level: '80%' } ] },
      { atm_id: 'atm-4105', name: 'ATM-4105 (Cyber City GGN)', location_type: 'Corporate Hub', capacity_usd: 90000, current_cash_usd: 68000, min_threshold_usd: 12000, status: 'ACTIVE', cash_percentage: 75.5, cash_out_risk: 'LOW', time_to_empty: '48h', cassettes: [ { denomination: '₹2000', level: '70%' }, { denomination: '₹500', level: '78%' }, { denomination: '₹200', level: '82%' }, { denomination: '₹100', level: '85%' } ] },
      { atm_id: 'atm-5210', name: 'ATM-5210 (Nehru Place)', location_type: 'Commercial Electronics', capacity_usd: 50000, current_cash_usd: 31000, min_threshold_usd: 6000, status: 'ACTIVE', cash_percentage: 62.0, cash_out_risk: 'LOW', time_to_empty: '26h', cassettes: [ { denomination: '₹2000', level: '58%' }, { denomination: '₹500', level: '64%' }, { denomination: '₹200', level: '70%' }, { denomination: '₹100', level: '75%' } ] }
    ];

    setAtms(fallbackAtms);
    setSummary({
      total_atms: 1248,
      active_atms: 1098,
      warning_atms: 27,
      total_cash_dispensed_usd: 186200000,
      forecast_accuracy_pct: 96.4,
      cashouts_prevented: 142,
      cost_savings_usd: 38450,
      champion_model: 'RandomForest v3.2'
    });
    setAlerts([
      { alert_id: 'ALT-1087', atm_id: 'atm-1087', atm_name: 'ATM-1087 (Ghaziabad Hub)', location_type: 'Transit & Retail', current_cash_usd: 8500, capacity_usd: 50000, recommended_refill_usd: 41500, urgency_level: 'CRITICAL', route_priority: 1, cost_estimate_usd: 175.0, time_to_empty: '4.2h' },
      { alert_id: 'ALT-2041', atm_id: 'atm-2041', atm_name: 'ATM-2041 (Connaught Place)', location_type: 'High-Density Commercial', current_cash_usd: 14200, capacity_usd: 80000, recommended_refill_usd: 65800, urgency_level: 'HIGH', route_priority: 2, cost_estimate_usd: 200.0, time_to_empty: '8.5h' }
    ]);
  };

  const executeReplenishment = async (atmId) => {
    try {
      await fetch(`${API_BASE_URL}/api/replenish/${atmId}`, { method: 'POST' });
    } catch (err) {}

    setAtms(prev => prev.map(a => a.atm_id === atmId ? { ...a, current_cash_usd: a.capacity_usd, status: 'ACTIVE', cash_percentage: 100, cash_out_risk: 'LOW', time_to_empty: '72h' } : a));
    setAlerts(prev => prev.filter(alt => alt.atm_id !== atmId));
    setReplenishModalAtm(null);
  };

  const selectedAtm = atms.find(a => a.atm_id === selectedAtmId) || atms[0] || {
    atm_id: 'atm-1087',
    name: 'ATM-1087 (Ghaziabad Hub)',
    location_type: 'Transit & Retail',
    capacity_usd: 50000,
    current_cash_usd: 8500,
    status: 'CRITICAL',
    time_to_empty: '4.2h',
    cassettes: [ { denomination: '₹2000', level: '8%' }, { denomination: '₹500', level: '14%' }, { denomination: '₹200', level: '22%' }, { denomination: '₹100', level: '35%' } ]
  };

  const filteredAtms = atms.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.atm_id.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'CRITICAL') return matchesSearch && (a.status === 'CRITICAL' || a.cash_out_risk === 'CRITICAL');
    if (filterStatus === 'WARNING') return matchesSearch && (a.status === 'WARNING' || a.cash_out_risk === 'HIGH');
    if (filterStatus === 'NORMAL') return matchesSearch && a.status === 'ACTIVE';
    return matchesSearch;
  });

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col antialiased">
      {/* 1. FIXED TOP HEADER NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-xs border-b border-surface-container-high">
        <div className="h-24 px-4 md:px-8 flex flex-col justify-between py-2">
          {/* Top Row: Logo, Title, Notifications & Admin */}
          <div className="flex items-center justify-between gap-3 h-12">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-extrabold text-sm shadow-xs">
                IQ
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-on-surface tracking-tight leading-tight">ATM DemandIQ</span>
                <span className="text-[0.6875rem] text-on-surface-variant font-medium">
                  {activeTab === 'dashboard' && 'Executive Dashboard'}
                  {activeTab === 'fleet' && 'Fleet Telemetry'}
                  {activeTab === 'forecast' && 'Demand Forecast'}
                  {activeTab === 'replenishment' && 'Replenishment Planner'}
                  {activeTab === 'analytics' && `Live Telemetry: ${selectedAtm.name}`}
                </span>
              </div>
            </div>

            {/* Notifications & Admin Profile */}
            <div className="flex items-center gap-2">
              <button
                aria-label="Notifications"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container transition text-on-surface-variant"
              >
                <Zap className="w-5 h-5 text-on-surface-variant" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error text-[0.625rem] rounded-full flex items-center justify-center font-bold">
                  {alerts.length}
                </span>
              </button>

              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center shadow-xs">
                  AD
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-on-surface leading-none">Admin</span>
                  <span className="text-[0.625rem] text-on-surface-variant leading-none mt-0.5">Cash Mgmt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Filter Pill Status Bar + 1-Minute Showcase Auto Refresh */}
          <div className="flex items-center justify-between gap-2 pb-1 text-xs">
            <button
              onClick={() => {
                fetchDashboardData();
                setRefreshCountdown(60);
              }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-medium transition"
            >
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="truncate font-semibold">Delhi-NCR • Auto-Refresh 1m ({refreshCountdown}s)</span>
              <RefreshCw className={`w-3 h-3 text-on-surface-variant ${loading ? 'animate-spin' : ''}`} />
            </button>

            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[0.625rem] uppercase tracking-wider font-bold">
              {apiOnline ? 'Live API' : 'Simulation'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 w-full pt-28 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto">
        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-4">
            {/* 1. Urgent Critical Alert Banner */}
            {alerts.length > 0 && (
              <section className="w-full rounded-xl bg-error-container text-on-error-container p-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0 animate-pulse mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs uppercase tracking-wider text-error font-extrabold">Critical Cash-Out Alert</span>
                      <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-[0.625rem] font-bold">
                        T-minus {alerts[0]?.time_to_empty || '4.2h'}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-on-surface leading-snug">
                      {alerts[0]?.atm_name || 'ATM-1087 (Ghaziabad Hub)'}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Available: <span className="font-bold text-error">${alerts[0]?.current_cash_usd?.toLocaleString() || '8,500'}</span> · Refill Recommended: <span className="font-bold text-emerald-700">${alerts[0]?.recommended_refill_usd?.toLocaleString() || '41,500'}</span>
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => executeReplenishment(alerts[0]?.atm_id)}
                        className="h-9 px-4 bg-error text-on-error rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-error/90 active:scale-95 transition"
                      >
                        <Truck className="w-4 h-4" /> Instant Replenish
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAtmId(alerts[0]?.atm_id || 'atm-1087');
                          setActiveTab('analytics');
                        }}
                        className="h-9 px-3 bg-surface-container-highest text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition"
                      >
                        Telemetry & Analytics
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 2. Executive KPI Cards (Bento Style Grid) */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* KPI 1: Total Fleet */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] text-on-surface-variant uppercase tracking-wider font-bold">Total Fleet</span>
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-extrabold text-on-surface font-mono">
                    {summary?.total_atms || 1248}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-on-surface-variant text-xs">
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[0.625rem] font-bold">98.2%</span>
                    <span>uptime</span>
                  </div>
                </div>
              </div>

              {/* KPI 2: At Risk */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] text-on-surface-variant uppercase tracking-wider font-bold">At Risk</span>
                  <AlertTriangle className="w-4 h-4 text-error" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-extrabold text-error font-mono">
                    {summary?.warning_atms || 27}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span className="text-error font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>9 Crit
                    </span>
                    <span className="text-outline-variant">·</span>
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>18 High
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI 3: 24h Forecasted Demand */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] text-on-surface-variant uppercase tracking-wider font-bold">24h Demand</span>
                  <TrendingUp className="w-4 h-4 text-secondary" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-extrabold text-on-surface font-mono">₹18.6 Cr</div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-on-surface-variant">
                    <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[0.625rem] font-bold">+8.4%</span>
                    <span>vs last week</span>
                  </div>
                </div>
                <div className="mt-2 pt-1">
                  <svg className="w-full h-4 stroke-secondary fill-none stroke-2" viewBox="0 0 100 18">
                    <path d="M 0,14 Q 20,4 35,9 T 70,6 T 100,2" />
                    <circle className="fill-secondary stroke-surface-container-lowest stroke-2" cx="100" cy="2" r="2.5" />
                  </svg>
                </div>
              </div>

              {/* KPI 4: Forecast Accuracy */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] text-on-surface-variant uppercase tracking-wider font-bold">Forecast Acc.</span>
                  <BrainCircuit className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                    {summary?.forecast_accuracy_pct || 87.6}%
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-on-surface-variant">
                    <span className="text-emerald-700 font-bold">100% - MAPE (12.4%)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Real-Time Fleet Risk Triage List */}
            <section className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-on-surface">Fleet Risk Telemetry Triage</h3>
                  <p className="text-xs text-on-surface-variant">Top terminals requiring cash logistics intervention</p>
                </div>
                <button
                  onClick={() => setActiveTab('fleet')}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View All {atms.length} <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {atms.slice(0, 3).map((atm) => (
                  <div key={atm.atm_id} className="p-3 rounded-lg bg-surface-container-low flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAtmId(atm.atm_id);
                            setActiveTab('analytics');
                          }}
                          className="font-bold text-sm text-on-surface hover:text-primary transition text-left"
                        >
                          {atm.name}
                        </button>
                        <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold ${
                          atm.status === 'CRITICAL' ? 'bg-error-container text-on-error-container' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {atm.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Vault: ${atm.current_cash_usd.toLocaleString()} · Empty in: <strong>{atm.time_to_empty || '4.2h'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAtmId(atm.atm_id);
                          setActiveTab('analytics');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-xs font-medium hover:bg-surface-container-high"
                      >
                        Telemetry
                      </button>
                      <button
                        onClick={() => executeReplenishment(atm.atm_id)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition shadow-xs"
                      >
                        Refill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Predictive Fleet Intelligence Insights */}
            <section className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-on-surface">Predictive Fleet Intelligence</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-surface-container-low rounded-xl p-3.5 shadow-xs flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Weekend Demand Surge Detected</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Sector 62 & CP commercial clusters projected to experience <strong className="text-primary font-bold">+18.4%</strong> higher cash withdrawal velocity over Saturday-Sunday.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-3.5 shadow-xs flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Month-End Corporate Payroll Pattern</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      14 high-traffic ATMs in IT corridors trigger two-stage replenishment cycles starting tomorrow morning at 06:00 IST.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Armored Van Logistics In-Transit Card */}
            <section className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-on-surface">Cash Logistics In-Transit</h3>
                  <p className="text-xs text-on-surface-variant">Active Armored Van Fleet: Delhi-NCR Corridor</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                  6 Active Vans
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Armored Van DL-4C-9921 · En Route Ghaziabad
                  </div>
                  <div className="text-[0.6875rem] text-slate-300 mt-1">
                    ETA ATM-1087: 28 mins · Carrying ₹2.5 Cr Cash Refill
                  </div>
                </div>
                <button className="px-3 py-1 bg-white text-primary rounded text-xs font-bold shadow-xs hover:bg-slate-100 transition">
                  Track
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ATM FLEET MONITORING & TELEMETRY */}
        {/* ========================================================================= */}
        {activeTab === 'fleet' && (
          <div className="flex flex-col gap-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col gap-2">
              <div className="relative w-full">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Search by ATM ID (e.g. ATM-1087) or Location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 bg-surface-container-lowest text-on-surface text-sm rounded-xl shadow-xs border border-surface-container-high focus:outline-none focus:bg-surface-container-low transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <button
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    filterStatus === 'ALL' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  All Terminals ({atms.length})
                </button>

                <button
                  onClick={() => setFilterStatus('CRITICAL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                    filterStatus === 'CRITICAL' ? 'bg-error text-on-error shadow-xs' : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                  Critical Cash-Out
                </button>

                <button
                  onClick={() => setFilterStatus('WARNING')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    filterStatus === 'WARNING' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  Low Cash Warning
                </button>

                <button
                  onClick={() => setFilterStatus('NORMAL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    filterStatus === 'NORMAL' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  Optimal Float
                </button>
              </div>
            </div>

            {/* Fleet Health Telemetry Bar */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-primary" /> Fleet Health Telemetry
                </span>
                <span className="text-on-surface-variant font-mono">{atms.length} Terminals Tracked</span>
              </div>

              <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden flex">
                <div className="h-full bg-emerald-600" style={{ width: '80%' }}></div>
                <div className="h-full bg-amber-500" style={{ width: '15%' }}></div>
                <div className="h-full bg-error" style={{ width: '5%' }}></div>
              </div>
            </div>

            {/* ATM Fleet Cards Stack */}
            <div className="space-y-3">
              {filteredAtms.map((atm) => (
                <div key={atm.atm_id} className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container-high p-4 flex flex-col gap-3 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAtmId(atm.atm_id);
                            setActiveTab('analytics');
                          }}
                          className="font-bold text-base text-on-surface hover:text-primary transition text-left"
                        >
                          {atm.name}
                        </button>
                        <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold uppercase ${
                          atm.status === 'CRITICAL' ? 'bg-error-container text-on-error-container' : atm.status === 'WARNING' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {atm.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {atm.location_type}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-on-surface-variant">Estimated Empty</span>
                      <p className="text-sm font-extrabold font-mono text-error">{atm.time_to_empty || '4.2h'}</p>
                    </div>
                  </div>

                  {/* Cash Progress Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-on-surface-variant">Vault Cash: ${atm.current_cash_usd.toLocaleString()}</span>
                      <span className="font-bold text-on-surface">{atm.cash_percentage}% Capacity</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          atm.cash_percentage < 20 ? 'bg-error' : atm.cash_percentage < 40 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(5, atm.cash_percentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Cassette Breakdown Pill Bar */}
                  {atm.cassettes && (
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {atm.cassettes.map((c, i) => (
                        <div key={i} className="p-1.5 rounded-lg bg-surface-container-low text-center font-mono text-[0.6875rem]">
                          <span className="text-on-surface-variant block">{c.denomination}</span>
                          <span className="font-bold text-on-surface">{c.level}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-2 border-t border-surface-container-high text-xs">
                    <button
                      onClick={() => {
                        setSelectedAtmId(atm.atm_id);
                        setActiveTab('analytics');
                      }}
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      Telemetry Analytics <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => executeReplenishment(atm.atm_id)}
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-bold shadow-xs hover:bg-primary-container transition"
                    >
                      Instant Refill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DEMAND FORECAST & TRENDS */}
        {/* ========================================================================= */}
        {activeTab === 'forecast' && (
          <div className="flex flex-col gap-4">
            {/* Forecast Control Console */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container-high flex flex-col gap-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h2 className="font-bold text-base text-on-surface flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" /> Predictive Engine Workspace
                  </h2>
                  <p className="text-xs text-on-surface-variant">Multi-zone telemetry & ML ensemble cash disbursement outlook</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                    RandomForest v3.2
                  </span>
                </div>
              </div>

              {/* Horizon Selector */}
              <div className="flex items-center justify-between bg-surface-container-low p-1 rounded-lg">
                <span className="text-xs text-on-surface-variant font-semibold pl-2">Forecasting Horizon:</span>
                <div className="flex gap-1">
                  {[7, 14, 30].map((h) => (
                    <button
                      key={h}
                      onClick={() => setForecastHorizon(h)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                        forecastHorizon === h ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {h} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Total Demand Card */}
            <div className="bg-primary text-on-primary p-5 rounded-xl shadow-md relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-primary-container font-bold">Total Projected Cluster Demand</span>
                  <div className="text-3xl font-extrabold font-mono mt-1">₹18.62 Cr</div>
                  <p className="text-xs text-primary-container mt-1">Horizon: {forecastHorizon} Days • 148 Managed Terminals</p>
                </div>
                <div className="p-3 rounded-xl bg-white/10 text-white">
                  <Coins className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Main Interactive Forecast Recharts */}
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high space-y-4">
              <h3 className="font-bold text-sm text-on-surface">Time-Series Forecast & 95% Confidence Envelope</h3>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="primaryGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0037b0" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0037b0" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaedff" />
                    <XAxis dataKey="weekday" stroke="#747686" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#747686" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#131b2e', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val) => [`₹${Number(val).toLocaleString()}`, '']}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="upper_bound_usd" name="Upper Confidence Bound" stroke="#8b5cf6" fill="none" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="predicted_amount_usd" name="Predicted Demand (₹)" stroke="#0037b0" strokeWidth={3} fill="url(#primaryGlow)" />
                    <Area type="monotone" dataKey="lower_bound_usd" name="Lower Confidence Bound" stroke="#00628d" fill="none" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REPLENISHMENT PLANNER */}
        {/* ========================================================================= */}
        {activeTab === 'replenishment' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-on-surface flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Armored Logistics Route Schedule
                </h2>
                <p className="text-xs text-on-surface-variant">AI-optimized cash refill priorities & truck dispatch</p>
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-xs text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                <h3 className="font-bold text-base text-on-surface">All Terminals Optimal</h3>
                <p className="text-xs text-on-surface-variant">No urgent replenishment dispatches required.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.alert_id} className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container-high flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-error/10 text-error font-extrabold text-sm flex items-center justify-center font-mono">
                        #{alert.route_priority}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-on-surface">{alert.atm_name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[0.625rem] font-bold">
                            {alert.urgency_level}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Empty in: <strong className="text-error">{alert.time_to_empty || '4.2h'}</strong> · Current: ${alert.current_cash_usd.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-surface-container-high">
                      <div className="text-left md:text-right">
                        <span className="text-xs text-on-surface-variant">Recommended Refill</span>
                        <p className="text-sm font-extrabold text-emerald-700 font-mono">
                          ${alert.recommended_refill_usd.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => executeReplenishment(alert.atm_id)}
                        className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" /> Dispatch Truck
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DYNAMIC DEEP TELEMETRY & TRANSACTION LOGS */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container-high flex flex-col gap-4">
              {/* ATM Header & Dynamic Selector */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-lg text-on-surface">{selectedAtm.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      selectedAtm.status === 'CRITICAL' ? 'bg-error-container text-on-error-container' : selectedAtm.status === 'WARNING' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {selectedAtm.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{selectedAtm.location_type} • ID: {selectedAtm.atm_id}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedAtmId}
                    onChange={(e) => setSelectedAtmId(e.target.value)}
                    className="bg-surface-container-low border border-surface-container-high text-on-surface text-xs rounded-lg px-3 py-2 font-bold focus:outline-none"
                  >
                    {atms.map((a) => (
                      <option key={a.atm_id} value={a.atm_id}>
                        {a.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => executeReplenishment(selectedAtm.atm_id)}
                    className="px-3.5 py-2 bg-error text-on-error rounded-lg text-xs font-bold shadow-xs hover:bg-error/90 transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Truck className="w-4 h-4" /> Refill
                  </button>
                </div>
              </div>

              {/* Cash Countdown & Vault Meter */}
              <div className={`p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
                selectedAtm.status === 'CRITICAL' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-low text-on-surface'
              }`}>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-error">Cash-Out Countdown</span>
                  <div className="text-3xl font-extrabold font-mono text-error mt-0.5">
                    {selectedAtm.time_to_empty || '24h'} Remaining
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-xs font-bold text-on-surface-variant">Available Vault Cash</span>
                  <p className="text-xl font-extrabold font-mono text-on-surface">
                    ${selectedAtm.current_cash_usd.toLocaleString()} / ${selectedAtm.capacity_usd.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Cassette Health Breakdown Grid */}
              <div className="space-y-2">
                <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider">4-Cassette Dispenser Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
                  {selectedAtm.cassettes ? (
                    selectedAtm.cassettes.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-surface-container-low border border-surface-container-high text-center">
                        <span className="text-on-surface-variant block text-[0.6875rem]">Cassette {i + 1} ({c.denomination})</span>
                        <span className={`text-base font-bold ${
                          parseInt(c.level) < 20 ? 'text-error' : parseInt(c.level) < 40 ? 'text-amber-700' : 'text-emerald-700'
                        }`}>{c.level} Full</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 p-3 rounded-lg bg-surface-container-low text-center text-xs text-on-surface-variant">
                      Cassette telemetry synced
                    </div>
                  )}
                </div>
              </div>

              {/* Live Database Historical Transaction Stream */}
              <div className="space-y-2 pt-2 border-t border-surface-container-high">
                <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-primary" /> Database Historical Transaction Log ({atmTransactions.length} Logged)
                </h3>

                {atmTransactions.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-surface-container-high">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[0.625rem]">
                        <tr>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Weekday</th>
                          <th className="p-2.5">Withdrawals</th>
                          <th className="p-2.5 text-right">Total Disbursed ($)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-high">
                        {atmTransactions.map((tx, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low/50">
                            <td className="p-2.5 font-bold text-on-surface">{tx.transaction_date || tx.date}</td>
                            <td className="p-2.5 text-on-surface-variant">{tx.weekday}</td>
                            <td className="p-2.5 text-on-surface-variant">{tx.num_withdrawals} txns</td>
                            <td className="p-2.5 text-right font-bold text-primary">${tx.total_amount_usd.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-surface-container-low text-center text-xs text-on-surface-variant">
                    Loading historical transactions from SQLite database...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. FIXED BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-t border-surface-container-high shadow-xs">
        <div className="flex justify-around items-center h-16 max-w-[1440px] mx-auto px-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition ${
              activeTab === 'dashboard' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[0.6875rem]">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition ${
              activeTab === 'fleet' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[0.6875rem]">ATMs</span>
          </button>

          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition ${
              activeTab === 'forecast' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[0.6875rem]">Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('replenishment')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition ${
              activeTab === 'replenishment' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-[0.6875rem]">Replenish</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition ${
              activeTab === 'analytics' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[0.6875rem]">Telemetry</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

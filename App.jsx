import React, { useState, useEffect } from 'react';
import { 
  Calculator, ShieldCheck, Zap, FileText, CheckCircle2, AlertCircle, 
  UserCheck, CreditCard, Building2, Smartphone, DollarSign, Clock, 
  ArrowRight, RefreshCw, Eye, Lock, ChevronRight, Sliders, Activity, 
  FileCheck, ThumbsUp, XCircle, LayoutDashboard, User, BarChart3, Settings
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'dashboard', 'admin'
  const [currentStep, setCurrentStep] = useState(1);
  
  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(50000000); // Default 50M
  const [loanTerm, setLoanTerm] = useState(12); // Months
  const [interestRate, setInterestRate] = useState(1.1); // Monthly flat rate %
  const [calcType, setCalcType] = useState('declining'); // 'declining' or 'flat'

  // Application Form State
  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    phone: '',
    dob: '',
    email: '',
    jobType: 'employee',
    monthlyIncome: '15000000',
    companyName: '',
    address: '',
    bankAccount: '',
    bankName: 'MBBank',
    cccdFront: null,
    cccdBack: null,
    selfie: null,
    salarySlip: null
  });

  // Simulated Processing & Approval State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [creditScore, setCreditScore] = useState(null);
  const [approvalResult, setApprovalResult] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Applications List (for Admin & User Dashboard simulation)
  const [applications, setApplications] = useState([
    {
      id: 'CR-88921',
      fullName: 'Trần Văn Nam',
      phone: '0981***456',
      amount: 60000000,
      term: 12,
      score: 742,
      status: 'approved',
      date: '2026-10-24',
      disbursed: true
    },
    {
      id: 'CR-88922',
      fullName: 'Lê Thị Thu',
      phone: '0912***888',
      amount: 40000000,
      term: 6,
      score: 610,
      status: 'pending_review',
      date: '2026-10-25',
      disbursed: false
    }
  ]);

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Loan Calculation Helpers
  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const calculateRepayment = () => {
    const P = Number(loanAmount);
    const N = Number(loanTerm);
    const monthlyRate = (interestRate / 100);

    if (calcType === 'flat') {
      const monthlyPrincipal = P / N;
      const monthlyInterest = P * monthlyRate;
      const totalMonthly = monthlyPrincipal + monthlyInterest;
      const totalPayment = totalMonthly * N;
      return {
        firstMonth: totalMonthly,
        totalInterest: monthlyInterest * N,
        totalPayment,
        monthlyPrincipal,
        monthlyInterest
      };
    } else {
      // Reducing balance calculation for month 1
      const monthlyPrincipal = P / N;
      const firstMonthInterest = P * monthlyRate;
      const firstMonthTotal = monthlyPrincipal + firstMonthInterest;
      
      let totalInterest = 0;
      let remaining = P;
      for (let i = 0; i < N; i++) {
        totalInterest += remaining * monthlyRate;
        remaining -= monthlyPrincipal;
      }

      return {
        firstMonth: firstMonthTotal,
        totalInterest,
        totalPayment: P + totalInterest,
        monthlyPrincipal,
        monthlyInterest: firstMonthInterest
      };
    }
  };

  const calcDetails = calculateRepayment();

  // Run AI Scoring Engine Simulation
  const triggerAutoApproval = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);

          // Simulated Scoring logic based on input income
          const income = Number(formData.monthlyIncome);
          let baseScore = 650;
          if (income >= 20000000) baseScore += 120;
          else if (income >= 12000000) baseScore += 70;
          else baseScore += 20;

          if (formData.idCard.length === 12) baseScore += 30;

          const finalScore = Math.min(850, baseScore);
          setCreditScore(finalScore);

          const approved = finalScore >= 620;
          const resultObj = {
            id: `CR-${Math.floor(10000 + Math.random() * 90000)}`,
            fullName: formData.fullName || 'Khách hàng',
            amount: Number(loanAmount),
            approvedAmount: approved ? Number(loanAmount) : 0,
            term: Number(loanTerm),
            score: finalScore,
            status: approved ? 'approved' : 'rejected',
            date: new Date().toISOString().split('T')[0],
            monthlyPayment: calcDetails.firstMonth,
            disbursed: false
          };

          setApprovalResult(resultObj);
          if (approved) {
            setApplications(prev => [resultObj, ...prev]);
          }
          setCurrentStep(4); // Move to Result Step
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              FC
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                FinCredit VN
              </h1>
              <p className="text-xs text-slate-400">Hệ thống Duyệt Tín Dụng Tự Động</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'apply' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Nộp Hồ Sơ
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Khoản Vay
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Quản Lý
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6">

        {/* TAB 1: APPLICATION & CALCULATOR FLOW */}
        {activeTab === 'apply' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Loan Calculator & Info Summary */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Feature Highlights */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-slate-800/60 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Zap className="w-4 h-4" /> AI Credit Engine
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Duyệt Tự Động Từ 30 - 100 Triệu
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Giải ngân siêu tốc trong 15 phút. Không thế chấp tài sản, thẩm định bằng AI tự động 24/7.
                </p>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/60 border border-slate-700/50 p-2.5 rounded-xl">
                    <Clock className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400">Thời gian duyệt</p>
                    <p className="text-xs font-bold text-white">3 Mức xử lý</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-700/50 p-2.5 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400">Bảo mật</p>
                    <p className="text-xs font-bold text-white">Mã hóa 256-bit</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-700/50 p-2.5 rounded-xl">
                    <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-400">Lãi suất chỉ từ</p>
                    <p className="text-xs font-bold text-emerald-400">1.1%/tháng</p>
                  </div>
                </div>
              </div>

              {/* Calculator Box */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    Công Cụ Tính Khoản Vay
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Minh bạch 100%
                  </span>
                </div>

                {/* Amount Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Số tiền cần vay</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {formatVND(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30000000"
                    max="100000000"
                    step="5000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>30,000,000đ</span>
                    <span>60,000,000đ</span>
                    <span>100,000,000đ</span>
                  </div>
                </div>

                {/* Term Select */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 block">Thời hạn vay (tháng)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 18, 24].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          loanTerm === term
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {term} Tháng
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Scheme Switch */}
                <div className="flex items-center justify-between bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50 text-xs">
                  <span className="text-slate-400">Phương thức tính lãi</span>
                  <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setCalcType('declining')}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                        calcType === 'declining' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Dư nợ giảm dần
                    </button>
                    <button
                      onClick={() => setCalcType('flat')}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                        calcType === 'flat' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      Lãi cố định
                    </button>
                  </div>
                </div>

                {/* Calculation Breakdown Result */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/70 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Gốc + Lãi ước tính tháng đầu:</span>
                    <span className="font-bold text-white text-sm">
                      {formatVND(calcDetails.firstMonth)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Tổng tiền lãi phải trả:</span>
                    <span className="text-slate-300 font-medium">
                      {formatVND(calcDetails.totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Tổng chi phí khoản vay:</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {formatVND(calcDetails.totalPayment)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Step Application Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl relative">
                
                {/* Progress Tracker */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3 text-xs">
                    <span className="font-semibold text-emerald-400 uppercase tracking-wider">
                      Bước {currentStep} / 4: {
                        currentStep === 1 ? 'Thẻ CCCD & Thông tin cá nhân' :
                        currentStep === 2 ? 'Thu nhập & Việc làm' :
                        currentStep === 3 ? 'Tải ảnh xác thực AI' : 'Phê duyệt & Giải ngân'
                      }
                    </span>
                    <span className="text-slate-400 font-medium">{currentStep * 25}% Hoàn thành</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                      style={{ width: `${currentStep * 25}%` }}
                    ></div>
                  </div>
                </div>

                {/* STEP 1: Personal Data */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-400" /> Thông Tin Người Vay
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Họ và Tên (Trên CCCD)</label>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="NGUYEN VAN A"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Số CCCD (12 Số)</label>
                        <input
                          type="text"
                          name="idCard"
                          placeholder="038090001234"
                          maxLength={12}
                          value={formData.idCard}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Số Điện Thoại Chính Chủ</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="0987654321"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Email Liên Hệ</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="nguyenvana@gmail.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 mb-1 block font-medium">Địa chỉ cư trú hiện tại</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setCurrentStep(2)}
                        disabled={!formData.fullName || !formData.idCard || !formData.phone}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/20"
                      >
                        Tiếp Theo <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Income & Employment */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" /> Nghề Nghiệp & Thu Nhập Hàng Tháng
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Hình thức làm việc</label>
                        <select
                          name="jobType"
                          value={formData.jobType}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="employee">Đi làm hưởng lương Công ty</option>
                          <option value="business">Kinh doanh tự do / Cửa hàng</option>
                          <option value="freelance">Freelance / Hợp đồng ngắn hạn</option>
                          <option value="driver">Tài xế công nghệ / Giao hàng</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Thu nhập thực nhận (VND/tháng)</label>
                        <select
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="8000000">Dưới 10,000,000 đ</option>
                          <option value="15000000">10,000,000 - 20,000,000 đ</option>
                          <option value="25000000">20,000,000 - 35,000,000 đ</option>
                          <option value="40000000">Trên 35,000,000 đ</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Tên công ty / Cơ sở làm việc</label>
                        <input
                          type="text"
                          name="companyName"
                          placeholder="Cty TNHH / Cửa hàng..."
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 mb-1 block font-medium">Ngân hàng nhận giải ngân</label>
                        <select
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="MBBank">MBBank - Ngân hàng Quân Đội</option>
                          <option value="VPBank">VPBank - Ngân hàng Thịnh Vượng</option>
                          <option value="Techcombank">Techcombank</option>
                          <option value="Vietcombank">Vietcombank</option>
                          <option value="ACB">ACB - Ngân hàng Á Châu</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 mb-1 block font-medium">Số tài khoản ngân hàng chính chủ</label>
                      <input
                        type="text"
                        name="bankAccount"
                        placeholder="0987654321..."
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        disabled={!formData.bankAccount}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/20"
                      >
                        Tiếp Theo <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Document Upload Simulator */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" /> Xác Thực Hồ Sơ AI (eKYC)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tải lên hình chụp CCCD và chân dung chính chủ để hệ thống tự động trích xuất thông tin & định danh.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* CCCD Front */}
                      <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center bg-slate-900/50 transition-all">
                        <FileCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-200">CCCD Mặt Trước</p>
                        <p className="text-[10px] text-slate-400 mt-1 mb-3">Chụp rõ nét, không mất góc</p>
                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-600 transition-all">
                          Chọn ảnh từ máy
                        </button>
                      </div>

                      {/* CCCD Back */}
                      <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center bg-slate-900/50 transition-all">
                        <FileCheck className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-200">CCCD Mặt Sau</p>
                        <p className="text-[10px] text-slate-400 mt-1 mb-3">Chụp rõ dải mã vạch QR</p>
                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 px-3 py-1.5 rounded-lg border border-slate-600 transition-all">
                          Chọn ảnh từ máy
                        </button>
                      </div>
                    </div>

                    {/* AI Scoring Trigger Box */}
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-300 leading-relaxed">
                          Bằng việc nhấn "Gửi & Thẩm Định Tự Động", bạn đồng ý cho hệ thống tra cứu điểm tín dụng CIC tự động để đưa ra kết quả hạn mức khoản vay từ <strong>30.000.000đ đến 100.000.000đ</strong>.
                        </div>
                      </div>
                    </div>

                    {isAnalyzing ? (
                      <div className="py-6 text-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                        <p className="text-sm font-semibold text-emerald-400">
                          Hệ thống AI đang chấm điểm tín dụng... {analysisProgress}%
                        </p>
                        <p className="text-xs text-slate-400">Vui lòng không tắt trình duyệt trong lúc kiểm tra CIC.</p>
                      </div>
                    ) : (
                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
                        >
                          Quay lại
                        </button>
                        <button
                          onClick={triggerAutoApproval}
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-7 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/25"
                        >
                          <Zap className="w-4 h-4 fill-slate-950" /> Thẩm Định AI Ngay
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: Automated Approval Result & Contract */}
                {currentStep === 4 && approvalResult && (
                  <div className="space-y-5">
                    {approvalResult.status === 'approved' ? (
                      <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-extrabold text-emerald-400">
                          Chúc Mừng! Khoản Vay Được Phê Duyệt Tự Động
                        </h3>
                        <p className="text-xs text-slate-300">
                          Mã hồ sơ: <span className="font-mono font-bold text-white">{approvalResult.id}</span> | Điểm uy tín CIC: <span className="text-emerald-400 font-bold">{approvalResult.score}/850</span>
                        </p>

                        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 my-4 text-left grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block">Số tiền phê duyệt:</span>
                            <span className="text-emerald-400 font-bold text-base">{formatVND(approvalResult.amount)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Thời hạn vay:</span>
                            <span className="text-white font-bold text-sm">{approvalResult.term} Tháng</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Trả hàng tháng từ:</span>
                            <span className="text-slate-200 font-semibold">{formatVND(approvalResult.monthlyPayment)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Tài khoản nhận tiền:</span>
                            <span className="text-slate-200 font-semibold">{formData.bankName} - {formData.bankAccount}</span>
                          </div>
                        </div>

                        {/* Digital Contract Preview */}
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-left space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                            <FileText className="w-4 h-4 text-emerald-400" /> Điều Khoản Hợp Đồng Điện Tử (Draft)
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed h-20 overflow-y-auto pr-1 border-t border-slate-800 pt-2">
                            Bên vay cam kết thanh toán đúng hạn số tiền {formatVND(approvalResult.monthlyPayment)} định kỳ hàng tháng. Hợp đồng có hiệu lực ngay khi tiền được chuyển khoản thành công vào STK {formData.bankAccount} thuộc sở hữu của {formData.fullName}.
                          </p>
                          <label className="flex items-center gap-2 pt-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={agreedToTerms}
                              onChange={(e) => setAgreedToTerms(e.target.checked)}
                              className="accent-emerald-500 rounded"
                            />
                            <span className="text-xs text-slate-300">Tôi đã đọc và ký xác nhận hợp đồng vay tín dụng điện tử.</span>
                          </label>
                        </div>

                        <button
                          disabled={!agreedToTerms}
                          onClick={() => {
                            alert(`Yêu cầu giải ngân ${formatVND(approvalResult.amount)} đã gửi thành công tới ngân hàng ${formData.bankName}!`);
                            setActiveTab('dashboard');
                          }}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 text-slate-950 font-bold py-3 rounded-xl transition-all text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                          <Zap className="w-4 h-4 fill-slate-950" /> XÁC NHẬN NHẬN TIỀN GIẢI NGÂN
                        </button>
                      </div>
                    ) : (
                      <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-5 text-center space-y-3">
                        <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
                        <h3 className="text-lg font-bold text-rose-400">Hồ Sơ Cần Thẩm Định Bổ Sung</h3>
                        <p className="text-xs text-slate-300">
                          Điểm uy tín CIC chưa đạt ngưỡng phê duyệt tự động ngay lập tức. Chuyên viên sẽ liên hệ lại qua SĐT {formData.phone} trong 30 phút.
                        </p>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="bg-slate-700 text-slate-200 px-5 py-2 rounded-xl text-xs font-semibold"
                        >
                          Tạo lại hồ sơ
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BORROWER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-emerald-400" /> Quản Lý Khoản Vay Cá Nhân
                </h2>
                <p className="text-xs text-slate-400">Theo dõi tiến độ thanh toán và thông tin giải ngân</p>
              </div>
              <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl font-medium">
                Khách hàng: {formData.fullName || 'Trần Văn Nam'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {applications.map((app) => (
                <div key={app.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-slate-400">{app.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {app.status === 'approved' ? 'Đã Giải Ngân' : 'Đang Thẩm Định'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400">Số tiền vay:</span>
                    <p className="text-xl font-extrabold text-emerald-400">{formatVND(app.amount)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-700/60 py-2.5">
                    <div>
                      <span className="text-slate-400 block">Thời hạn:</span>
                      <span className="font-semibold text-slate-200">{app.term} Tháng</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Điểm CIC:</span>
                      <span className="font-semibold text-emerald-400">{app.score}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button 
                      onClick={() => alert(`Đang mở cổng thanh toán VietQR cho khoản vay ${app.id}`)}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Thanh Toán Kỳ Này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN & UNDERWRITER PANEL */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Bảng Điều Hành Thẩm Định & Rủi Ro
                </h2>
                <p className="text-xs text-slate-400">Quản lý cấu hình tự động duyệt và danh sách hồ sơ vay</p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> AI Engine Active
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400">Tổng hồ sơ hôm nay</p>
                <p className="text-2xl font-bold text-white mt-1">128</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400">Tỷ lệ duyệt tự động</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">78.5%</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400">Tổng tiền giải ngân</p>
                <p className="text-2xl font-bold text-teal-300 mt-1">4.2 Tỷ</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400">Nợ xấu dự báo (NPL)</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">1.2%</p>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-700 font-bold text-sm text-slate-200">
                Danh Sách Hồ Sơ Đăng Ký Vay Mới Nhất
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Mã Hồ Sơ</th>
                      <th className="p-3.5">Khách Hàng</th>
                      <th className="p-3.5">Số Tiền Vay</th>
                      <th className="p-3.5">Điểm CIC</th>
                      <th className="p-3.5">Trạng Thái</th>
                      <th className="p-3.5">Ngày Tạo</th>
                      <th className="p-3.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-700/30 transition-all">
                        <td className="p-3.5 font-mono font-bold text-slate-200">{app.id}</td>
                        <td className="p-3.5">
                          <p className="font-semibold text-white">{app.fullName}</p>
                          <p className="text-[10px] text-slate-400">{app.phone}</p>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-400">{formatVND(app.amount)}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-bold text-teal-300">
                            {app.score}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {app.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{app.date}</td>
                        <td className="p-3.5 text-right">
                          <button 
                            onClick={() => alert(`Đang xem chi tiết hồ sơ ${app.id}`)}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded-lg text-[11px]"
                          >
                            Xem hồ sơ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}


import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { ConfirmationSheet } from './ConfirmationSheet';

interface AuthModalProps {
  isFadingOut?: boolean;
  onSuccessTransition?: () => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isFadingOut = false, onSuccessTransition, onClose }) => {
  const {
    otpStep,
    pendingOtpPhone,
    pendingUserName,
    devOtp,
    otpResendTimer,
    requestOtp,
    verifyOtp,
    resendOtp,
    changePhoneNumber
  } = useApp();

  // Step 1: Customer Details State
  const [name, setName] = useState(pendingUserName || '');
  const [phone, setPhone] = useState(pendingOtpPhone || '');
  const [validationErrors, setValidationErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Step 2: 6-Digit OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [otpError, setOtpError] = useState<string>('');
  const [isIncorrectOtp, setIsIncorrectOtp] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [verificationState, setVerificationState] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [isChangePhoneConfirmOpen, setIsChangePhoneConfirmOpen] = useState(false);

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const autoClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelAutoClearTimer = () => {
    if (autoClearTimerRef.current) {
      clearTimeout(autoClearTimerRef.current);
      autoClearTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cancelAutoClearTimer();
    };
  }, []);

  // Sync state if context updates (e.g. from localStorage restoration)
  useEffect(() => {
    if (pendingUserName) setName(pendingUserName);
    if (pendingOtpPhone) setPhone(pendingOtpPhone);
  }, [pendingUserName, pendingOtpPhone]);

  // When moving to OTP step, reset digits and auto-focus the first box after smooth slide completes
  useEffect(() => {
    if (otpStep === 'otp') {
      cancelAutoClearTimer();
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setIsIncorrectOtp(false);
      setResendFeedback('');
      setVerificationState('idle');
      setIsShaking(false);
      const timer = setTimeout(() => {
        digitInputRefs.current[0]?.focus();
        setFocusedIndex(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [otpStep]);

  // Masked format for phone: e.g. "+91 98••• ••210"
  const getMaskedPhone = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `+91 ${digits.slice(0, 2)}••• ••${digits.slice(-3)}`;
    }
    return `+91 ${digits || '9876543210'}`;
  };

  // STEP 1 Validation & Submit
  const validateStep1 = () => {
    const errors: { name?: string; phone?: string } = {};
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanName) {
      errors.name = 'Please enter your name';
    } else if (cleanName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!cleanPhone) {
      errors.phone = 'Please enter your mobile number';
    } else if (cleanPhone.length !== 10) {
      errors.phone = 'Mobile number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || isSendingCode) {
      return;
    }
    setIsSendingCode(true);
    const cleanPhone = phone.replace(/\D/g, '');
    setTimeout(() => {
      requestOtp(name.trim(), cleanPhone);
      setIsSendingCode(false);
    }, 320);
  };

  // Incorrect OTP Handler (Turns 6 boxes red, shakes, displays error, and clears after exactly 2s)
  const handleIncorrectOtp = (message = 'Incorrect OTP. Please try again.') => {
    setVerificationState('idle');
    setIsIncorrectOtp(true);
    setOtpError(message);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Keep all six OTP digits visible in red for exactly 2 seconds
    cancelAutoClearTimer();
    autoClearTimerRef.current = setTimeout(() => {
      // After 2 seconds, automatically clear all six OTP input boxes
      setOtpDigits(['', '', '', '', '', '']);
      // Remove the red error styling smoothly
      setIsIncorrectOtp(false);
      setOtpError('');
      // Automatically focus the first OTP input box & open numeric keyboard
      digitInputRefs.current[0]?.focus();
      setFocusedIndex(0);
      autoClearTimerRef.current = null;
    }, 2000);
  };

  // STEP 2: 6-Digit OTP Box Handlers
  const handleOtpDigitChange = (index: number, value: string) => {
    if (verificationState !== 'idle') return;

    // Reset error state and cancel timer when customer starts entering / editing
    cancelAutoClearTimer();
    if (isIncorrectOtp || otpError) {
      setIsIncorrectOtp(false);
      setOtpError('');
    }
    setIsShaking(false);

    // Filter only numeric digits
    const cleaned = value.replace(/\D/g, '');
    const char = cleaned.slice(-1);

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto-advance to next box if digit is entered
    if (char && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }

    // Auto-trigger verification when all 6 digits are filled
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      setTimeout(() => {
        executeVerification(fullCode);
      }, 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (verificationState !== 'idle') return;

    if (e.key === 'Backspace') {
      cancelAutoClearTimer();
      if (isIncorrectOtp || otpError) {
        setIsIncorrectOtp(false);
        setOtpError('');
      }

      // If current box is empty, move to previous box and clear it
      if (!otpDigits[index] && index > 0) {
        e.preventDefault();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        digitInputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      } else if (otpDigits[index]) {
        // Clear current box
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (verificationState !== 'idle') return;

    e.preventDefault();
    cancelAutoClearTimer();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setOtpDigits(newDigits);
    setIsIncorrectOtp(false);
    setOtpError('');
    setIsShaking(false);

    const lastFilledIndex = Math.min(pasteData.length, 5);
    digitInputRefs.current[lastFilledIndex]?.focus();
    setFocusedIndex(lastFilledIndex);

    if (pasteData.length === 6) {
      setTimeout(() => {
        executeVerification(pasteData);
      }, 120);
    }
  };

  // Verification Execution with IN-BOX Animations & Smooth Exit Transition
  const executeVerification = async (codeToVerify: string) => {
    if (verificationState !== 'idle') return;
    cancelAutoClearTimer();
    setOtpError('');
    setIsIncorrectOtp(false);
    setIsShaking(false);

    if (codeToVerify.length < 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // 1. Enter IN-BOX loading state (miniature spinners inside the 6 boxes)
    setVerificationState('verifying');

    try {
      await new Promise((r) => setTimeout(r, 600));

      // Validate code against dev/backend OTP
      if (codeToVerify !== devOtp) {
        handleIncorrectOtp('Incorrect OTP. Please try again.');
        return;
      }

      const res = await verifyOtp(codeToVerify);
      if (!res.success) {
        handleIncorrectOtp(res.message || 'Incorrect OTP. Please try again.');
        return;
      }

      // 2. Enter IN-BOX success state (green wave across 6 boxes with digits visible)
      setVerificationState('success');

      // Hold until the staggered green wave finishes across all 6 boxes (approx 550ms)
      await new Promise((r) => setTimeout(r, 550));

      // 3. Trigger smooth visual exit transition into restaurant home page
      setIsExiting(true);
      if (onSuccessTransition) {
        onSuccessTransition();
      }

      // Hold exit transition for 650ms so user experiences smooth expansion to home
      await new Promise((r) => setTimeout(r, 650));
    } catch {
      // For network errors or server errors, show an appropriate error message without automatically clearing the entered OTP
      setIsExiting(false);
      setVerificationState('idle');
      setOtpError('Network connection error. Please check your internet and tap Verify to retry.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    executeVerification(fullCode);
  };

  const handleAutoFillDevOtp = () => {
    if (!devOtp || devOtp.length !== 6 || verificationState !== 'idle') return;
    const digits = devOtp.split('');
    setOtpDigits(digits);
    setOtpError('');
    setIsShaking(false);
    digitInputRefs.current[5]?.focus();
    setFocusedIndex(5);
    setTimeout(() => {
      executeVerification(devOtp);
    }, 120);
  };

  const handleResendOtp = async () => {
    if (otpResendTimer > 0 || isResending || verificationState !== 'idle') return;
    setIsResending(true);
    try {
      resendOtp();
      setResendFeedback('A new verification code has been sent!');
      setOtpError('');
      setTimeout(() => setResendFeedback(''), 4000);
    } catch {
      setOtpError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const shouldExit = isFadingOut || isExiting;

  return (
    <div
      className={`min-h-screen w-full bg-[#111216] flex items-center justify-center p-0 md:p-6 lg:p-8 font-sans antialiased text-[#1C1E21] transition-opacity duration-700 ${
        shouldExit ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* =========================================================================
         SHARED RESPONSIVE SHELL
         Mobile: Full-screen with Top Hero & Rounded-t Bottom Sheet
         Tablet & Desktop: Unified 2-Column Split Card (Hero Left, Form Right)
         ========================================================================= */}
      <div
        className={`w-full max-w-md md:max-w-4xl bg-[#111216] md:bg-[#18191E] min-h-screen md:min-h-[640px] md:rounded-[40px] md:shadow-2xl md:border md:border-stone-800 flex flex-col md:grid md:grid-cols-2 overflow-hidden relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          shouldExit
            ? 'scale-95 opacity-0 translate-y-3 pointer-events-none'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* =========================================================================
           1. SHARED HERO SECTION (Food-Themed Visual with Golden Warmth & Brand Identity)
           ========================================================================= */}
        <div className="relative bg-[#111216] flex flex-col items-center justify-center pt-10 pb-8 px-6 text-center overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-full">
          {/* Ultra-Clear Food Background with Ambient Lighting */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=100"
              alt="Gourmet Dining Experience"
              className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.12]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-[#111216]/50 to-black/60" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/75" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
          </div>

          {/* Restaurant Brand Pill */}
          <div className="relative z-10 mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{RESTAURANT_INFO.name}</span>
          </div>

          {/* Welcoming Headline & Subtitle */}
          <div className="relative z-10 space-y-2 max-w-xs drop-shadow-md transition-all duration-300">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md font-sans">
              {otpStep === 'phone' ? 'Welcome to Selarasa!' : 'Verify Mobile Number'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed drop-shadow">
              {otpStep === 'phone'
                ? 'Your delicious experience starts here.'
                : 'Just one quick step to secure your ordering session.'}
            </p>
          </div>
        </div>

        {/* =========================================================================
           2. SHARED FORM PANEL (Consistent Soft Off-White Panel with Smooth Sliding Track)
           ========================================================================= */}
        <div className="flex-1 bg-[#F5F6F9] rounded-t-[36px] sm:rounded-t-[40px] md:rounded-none md:rounded-r-[40px] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div>
            {/* Unified Step Header & Breadcrumb */}
            <div className="mb-5 flex items-center justify-between pb-3 border-b border-stone-200/70 select-none">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 ${
                    otpStep === 'phone'
                      ? 'bg-[#F59E0B] text-stone-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-500/25 scale-105'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {otpStep === 'otp' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                </span>

                {/* Connected Progress Line */}
                <div className="w-12 sm:w-16 h-1.5 rounded-full bg-stone-200/80 overflow-hidden relative">
                  <div
                    className={`h-full bg-[#F59E0B] rounded-full transition-all duration-500 ease-out ${
                      otpStep === 'otp' ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>

                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 ${
                    otpStep === 'otp'
                      ? 'bg-[#F59E0B] text-stone-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-500/25 scale-105'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  2
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-stone-400 transition-colors">
                  {otpStep === 'phone' ? 'Step 1: Details' : 'Step 2: Verification'}
                </span>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Close and explore menu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* =====================================================================
               SMOOTH HORIZONTAL SLIDER (Connects Step 1 and Step 2 Flawlessly)
               ===================================================================== */}
            <div className="relative overflow-hidden w-full">
              <div
                className={`w-[200%] flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  otpStep === 'otp' ? '-translate-x-1/2' : 'translate-x-0'
                }`}
              >
                {/* -----------------------------------------------------------------
                   STEP 1: CUSTOMER DETAILS (Name + Phone)
                   ----------------------------------------------------------------- */}
                <div
                  className={`w-1/2 flex-shrink-0 pr-3 sm:pr-4 flex flex-col justify-between transition-all duration-300 ${
                    otpStep === 'phone'
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-[0.98] pointer-events-none'
                  }`}
                >
                  <div>
                    <div className="mb-5">
                      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                        Let's Get Started
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1">
                        Enter your details to view menu and order dishes.
                      </p>
                    </div>

                    <form onSubmit={handleContinue} className="space-y-4" noValidate>
                      {/* Input 1: Your Name */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Your Name
                        </label>
                        <div
                          className={`relative rounded-2xl bg-[#EEF2F6] border transition-all flex items-center px-4 py-3.5 ${
                            validationErrors.name
                              ? 'border-red-400 ring-2 ring-red-400/20'
                              : 'border-transparent focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20'
                          }`}
                        >
                          <User className="w-4 h-4 text-stone-400 flex-shrink-0 mr-3" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (validationErrors.name) {
                                setValidationErrors((prev) => ({ ...prev, name: undefined }));
                              }
                            }}
                            placeholder="Enter your full name"
                            className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none font-medium"
                          />
                        </div>
                        {validationErrors.name && (
                          <p className="text-xs text-red-600 font-medium mt-1.5 pl-1 flex items-center gap-1">
                            <span>•</span> {validationErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Input 2: Mobile Number (+91) */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                          Mobile Number
                        </label>
                        <div
                          className={`relative rounded-2xl bg-[#EEF2F6] border transition-all flex items-center px-4 py-3.5 ${
                            validationErrors.phone
                              ? 'border-red-400 ring-2 ring-red-400/20'
                              : 'border-transparent focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20'
                          }`}
                        >
                          <Phone className="w-4 h-4 text-stone-400 flex-shrink-0 mr-2.5" />
                          <span className="text-xs font-bold text-stone-700 mr-2 border-r border-stone-300 pr-2.5 select-none flex items-center gap-1">
                            <span>🇮🇳</span> +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setPhone(val);
                              if (validationErrors.phone) {
                                setValidationErrors((prev) => ({ ...prev, phone: undefined }));
                              }
                            }}
                            placeholder="98765 43210"
                            className="w-full bg-transparent text-sm font-mono font-bold text-stone-900 placeholder-stone-400 tracking-wide focus:outline-none"
                          />
                        </div>
                        {validationErrors.phone && (
                          <p className="text-xs text-red-600 font-medium mt-1.5 pl-1 flex items-center gap-1">
                            <span>•</span> {validationErrors.phone}
                          </p>
                        )}
                      </div>

                      {/* Primary Golden Button */}
                      <div className="pt-2 space-y-2">
                        <button
                          type="submit"
                          disabled={isSendingCode}
                          className="w-full py-4 px-6 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-stone-950 font-bold text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer relative overflow-hidden group"
                        >
                          {isSendingCode ? (
                            <div className="flex items-center gap-2 animate-fade-in">
                              <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                              <span>Generating Secure OTP...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>Continue</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                        </button>

                        {onClose && (
                          <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-2.5 text-center text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                          >
                            Explore Menu as Guest →
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* -----------------------------------------------------------------
                   STEP 2: OTP VERIFICATION (Visually Unified with Step 1)
                   ----------------------------------------------------------------- */}
                <div
                  className={`w-1/2 flex-shrink-0 pl-3 sm:pl-4 flex flex-col justify-between transition-all duration-300 ${
                    otpStep === 'otp'
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-[0.98] pointer-events-none'
                  }`}
                >
                  <div>
                    {/* Change Number Option */}
                    <button
                      type="button"
                      onClick={() => setIsChangePhoneConfirmOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-3 group cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-stone-700 group-hover:-translate-x-1 transition-transform text-amber-600" />
                      <span>Change Number</span>
                    </button>

                    {/* Step 2 Heading & Masked Phone Badge */}
                    <div className="mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                        Verify Your Number
                      </h2>
                      <div className="inline-flex items-center gap-2 mt-1.5 px-3 py-1 bg-[#EEF2F6] border border-stone-200/80 rounded-xl text-xs text-stone-800 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-stone-500">Sent to:</span>
                        <strong className="font-mono text-stone-900 font-bold tracking-wide">
                          {getMaskedPhone(pendingOtpPhone)}
                        </strong>
                      </div>
                    </div>

                    {/* Development Mode Notice Banner */}
                    <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-3 text-xs text-amber-900 space-y-1 mb-4 select-none">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Demo OTP:
                        </span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-extrabold text-xs text-stone-900 tracking-wider">
                          {devOtp}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFillDevOtp}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline pt-0.5 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Autofill code ({devOtp})</span>
                      </button>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                      {/* Six-Digit OTP Input Grid with In-Box Animations */}
                      <div>
                        <div
                          className={`grid grid-cols-6 gap-2 sm:gap-2.5 w-full transition-transform ${
                            isShaking ? 'animate-shake' : ''
                          }`}
                        >
                          {otpDigits.map((digit, idx) => {
                            const isFocused = focusedIndex === idx && verificationState === 'idle' && !isIncorrectOtp;
                            const isFilled = digit.length > 0;
                            const isVerifying = verificationState === 'verifying';
                            const isSuccess = verificationState === 'success';

                            return (
                              <div
                                key={idx}
                                className={`relative w-full aspect-[4/5] sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 select-none ${
                                  isSuccess
                                    ? 'border-2 border-emerald-500 bg-emerald-50/90 text-emerald-950 shadow-[0_0_0_3px_rgba(16,185,129,0.22)] animate-box-success'
                                    : isIncorrectOtp
                                    ? 'border-2 border-red-400 bg-red-50/60 text-red-600 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
                                    : isVerifying
                                    ? 'border-2 border-amber-400 bg-amber-50/30'
                                    : isFocused
                                    ? 'border-2 border-[#F59E0B] bg-white shadow-[0_0_0_3.5px_rgba(245,158,11,0.22)] ring-1 ring-[#F59E0B]'
                                    : isFilled
                                    ? 'border-2 border-stone-300 bg-stone-50/80 text-stone-900 shadow-2xs font-bold'
                                    : 'border border-stone-200 bg-[#EEF2F6] text-stone-900 shadow-2xs'
                                }`}
                                style={{
                                  animationDelay: `${idx * 65}ms`
                                }}
                              >
                                {/* Native Input Overlay */}
                                <input
                                  ref={(el) => (digitInputRefs.current[idx] = el)}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  disabled={verificationState !== 'idle'}
                                  value={digit}
                                  onFocus={() => {
                                    cancelAutoClearTimer();
                                    if (isIncorrectOtp) {
                                      setIsIncorrectOtp(false);
                                      setOtpError('');
                                    }
                                    setFocusedIndex(idx);
                                  }}
                                  onBlur={() => setFocusedIndex(null)}
                                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                  onPaste={handleOtpPaste}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10 text-center"
                                />

                                {/* In-Box Content: Loading Spinner or Clearly Visible Digit */}
                                {isVerifying ? (
                                  <div
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-amber-500/25 border-t-amber-500 animate-spin"
                                    style={{
                                      animationDelay: `${idx * 80}ms`
                                    }}
                                  />
                                ) : digit ? (
                                  <span
                                    className={`text-lg sm:text-xl font-mono font-bold transition-colors ${
                                      isSuccess ? 'text-emerald-950 font-extrabold' : isIncorrectOtp ? 'text-red-600' : 'text-stone-900'
                                    }`}
                                  >
                                    {digit}
                                  </span>
                                ) : isFocused ? (
                                  <span className="w-0.5 h-5 bg-[#F59E0B] rounded-full animate-pulse" />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>

                        {/* Error Message Feedback */}
                        {otpError && (
                          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50/80 border border-red-200/80 px-3.5 py-2 rounded-xl mt-3 animate-fade-in text-center">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{otpError}</span>
                          </div>
                        )}

                        {/* Resend Confirmation Feedback */}
                        {resendFeedback && (
                          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl mt-2 animate-fade-in text-center">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span>{resendFeedback}</span>
                          </div>
                        )}
                      </div>

                      {/* Primary Golden Button for Step 2 */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={verificationState !== 'idle'}
                          className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            verificationState === 'success'
                              ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                              : verificationState === 'verifying'
                              ? 'bg-amber-500 text-stone-950 opacity-90 shadow-amber-500/20'
                              : 'bg-[#F59E0B] hover:bg-[#D97706] text-stone-950 active:scale-[0.99] shadow-amber-500/25'
                          }`}
                        >
                          {verificationState === 'verifying' ? (
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                              <span>Verifying OTP...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verify OTP</span>
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Resend Controls */}
                      <div className="flex items-center justify-between text-xs text-stone-500 pt-1 select-none">
                        <button
                          type="button"
                          onClick={() => setIsChangePhoneConfirmOpen(true)}
                          className="hover:underline text-stone-600 cursor-pointer"
                        >
                          Change number
                        </button>

                        {otpResendTimer > 0 ? (
                          <span className="font-mono text-stone-500">
                            Resend in <strong>{otpResendTimer}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                            <span>Resend OTP</span>
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Privacy Guarantee Footer */}
          <div className="pt-4 text-center">
            <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Used strictly for your live order & digital receipt</span>
            </p>
          </div>
        </div>
      </div>

      {/* iOS-Style Confirmation Dialog: Change Mobile Number */}
      <ConfirmationSheet
        isOpen={isChangePhoneConfirmOpen}
        onClose={() => setIsChangePhoneConfirmOpen(false)}
        onConfirm={() => {
          changePhoneNumber();
          setIsChangePhoneConfirmOpen(false);
        }}
        title="Change mobile number?"
        description={`This will discard the verification code sent to ${getMaskedPhone(pendingOtpPhone)} and return to phone entry.`}
        confirmLabel="Change Number"
        cancelLabel="Keep Number"
        variant="warning"
        isCenterDialog={true}
        icon={<Phone className="w-5 h-5 text-amber-600" />}
      />
    </div>
  );
};

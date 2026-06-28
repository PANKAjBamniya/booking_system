import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp, setOtpExpired, clearAuthError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { MobileFrame } from '../components/mobile/MobileFrame';
import { TopBar } from '../components/mobile/TopBar';
import { PrimaryButton } from '../components/mobile/ui';

const OTP_DURATION = 30;
const TOAST_DURATION = OTP_DURATION * 500;

const Otp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(OTP_DURATION);
  const inputs = useRef([]);

  const {
    phone: savedPhone,
    name: savedName,
    loading,
    error,
    isAuthenticated,
    devOtp,
    otpExpired,
  } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Show backend errors as toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  // 10-second countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      dispatch(setOtpExpired());
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, dispatch]);

  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleVerify = async () => {
    if (otpExpired) {
      toast.error('OTP has expired. Please request a new one.');
      return;
    }

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }

    const action = await dispatch(verifyOtp({ phone: savedPhone, code: fullCode }));
    if (verifyOtp.fulfilled.match(action)) {
      toast.success('Logged in successfully!');
      navigate('/home');
    }
  };

  const handleResend = async () => {
  if (!savedPhone) {
    toast.error("No phone number found. Please go back and try again.");
    return;
  }

  const action = await dispatch(sendOtp({ name: savedName, phone: savedPhone }));

  if (sendOtp.fulfilled.match(action)) {
    setCode(["", "", "", "", "", ""]);
    setCountdown(OTP_DURATION);

    // Show latest OTP from response if available
    const otp = action.payload?.otp || action.payload?.devOtp;

    toast.success(
      otp ? `New OTP: ${otp}` : "OTP resent successfully!",
      {
        duration: TOAST_DURATION,
      }
    );
  }
};

 useEffect(() => {
  if (devOtp && !otpExpired) {
    toast.success(`OTP: ${devOtp}`, {
      duration: TOAST_DURATION,
    });
  }
}, [devOtp, otpExpired]);

  const isExpired = otpExpired || countdown <= 0;
  const canResend = isExpired && !loading;

  return (
    <MobileFrame>
      <TopBar title="Verification" to="/login" />
      <div className="px-6 pt-2 pb-10 flex flex-col gap-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Verify OTP</h1>
          <p className="text-muted-foreground text-sm leading-6">
            Enter the 6-digit verification code for
          </p>
          <p className="font-semibold text-lg text-accent">
            {savedPhone ? `+91 ${savedPhone}` : '+91 XXXXXXXXXX'}
          </p>
        </div>

        {/* OTP Expired Banner */}
        {isExpired && (
          <div className="mx-auto w-full max-w-xs rounded-2xl bg-red-500/10 border border-red-500/30 px-5 py-4 text-center space-y-1">
            <p className="text-sm font-semibold text-red-500">⏱ OTP Expired</p>
            <p className="text-xs text-muted-foreground">
              The OTP is no longer valid. Please resend to get a new one.
            </p>
          </div>
        )}

        {/* OTP Input Grid */}
        <div className="flex justify-center gap-2 mt-2">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              value={d}
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              disabled={isExpired}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) {
                  inputs.current[i - 1]?.focus();
                }
              }}
              className={`w-12 h-14 rounded-2xl border-2 text-center text-xl font-bold bg-card shadow-sm transition-all duration-200 outline-none ${
                isExpired
                  ? 'border-border text-muted-foreground opacity-50 cursor-not-allowed'
                  : d
                  ? 'border-accent text-foreground'
                  : 'border-border text-foreground'
              } focus:border-accent focus:ring-4 focus:ring-accent/20`}
            />
          ))}
        </div>

        {/* Resend / Countdown */}
        <div className="flex justify-center items-center gap-2 text-sm">
          <span className="text-muted-foreground">Didn't receive the code?</span>
          <button
            disabled={!canResend}
            onClick={handleResend}
            className="font-semibold text-accent disabled:text-muted-foreground"
          >
            {!isExpired
              ? `Resend in 00:${countdown.toString().padStart(2, "0")}`
              : 'Resend OTP'}
          </button>
        </div>

        {/* Verify Button */}
        <div>
          <PrimaryButton
            onClick={handleVerify}
            disabled={loading || isExpired || code.join('').length !== 6}
            className="h-14 rounded-2xl text-base font-semibold w-full"
          >
            {loading ? 'Verifying...' : isExpired ? 'OTP Expired' : 'Verify OTP'}
          </PrimaryButton>
        </div>

      </div>
    </MobileFrame>
  );
};

export default Otp;
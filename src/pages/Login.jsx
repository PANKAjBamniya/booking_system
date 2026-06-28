import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendOtp, clearAuthError } from '../redux/slices/authSlice';
import { ChevronDown, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { MobileFrame } from '../components/mobile/MobileFrame';
import { InputField, PrimaryButton } from '../components/mobile/ui';
import { TopBar } from '../components/mobile/TopBar';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, otpSent, isAuthenticated } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/home';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  // Advance to OTP screen after successful send
  useEffect(() => {
    if (otpSent) {
      navigate('/otp');
    }
  }, [otpSent, navigate]);

  // Validate phone number inline
  const validatePhone = (value) => {
    if (!value) {
      setPhoneError('Phone number is required.');
      return false;
    }
    if (!/^\d+$/.test(value)) {
      setPhoneError('Phone number must contain only digits.');
      return false;
    }
    if (value.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // strip non-digits automatically
    setPhone(val);
    if (phoneError) validatePhone(val);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!validatePhone(phone)) {
      return;
    }

    await dispatch(sendOtp({ name: name.trim(), phone }));
  };

  return (
    <MobileFrame>
      <TopBar back={false} title="" />
      <div className="px-6 pt-2 pb-10 flex flex-col gap-8">
        <div className="space-y-2 text-left">
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your phone number to continue booking your beauty rituals.
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="space-y-4 text-left">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground px-1">
                Full Name
              </label>
              <InputField
                icon={<User className="h-4 w-4" />}
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground px-1">
                Phone Number
              </label>
              <div className="flex gap-3">
                <button type="button" className="flex items-center gap-2 h-14 px-4 rounded-2xl bg-input border border-border">
                  <span className="text-xl">🇮🇳</span>
                  <span className="text-sm font-medium">+91</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="flex-1">
                  <InputField
                    icon={<Phone className="h-4 w-4" />}
                    placeholder="10-digit mobile number"
                    inputMode="tel"
                    maxLength={10}
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
              </div>
              {phoneError && (
                <p className="text-xs text-red-500 px-1 mt-1">{phoneError}</p>
              )}
              <p className="text-xs text-muted-foreground px-1">
                Enter your 10-digit mobile number without country code.
              </p>
            </div>
          </div>

          <PrimaryButton
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </PrimaryButton>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <span className="text-accent font-medium cursor-pointer">Terms</span> &{" "}
          <span className="text-accent font-medium cursor-pointer">Privacy</span>.
        </p>
      </div>
    </MobileFrame>
  );
};

export default Login;

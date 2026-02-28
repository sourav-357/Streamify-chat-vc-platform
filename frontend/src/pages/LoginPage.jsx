import { useState } from "react";
import { ShipWheelIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-base-100 to-base-200" data-theme="forest">
      <div className="w-full max-w-md space-y-6">
        {/* LOGO & BRANDING */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <ShipWheelIcon className="size-8 text-base-100" />
            </div>
            <span className="text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>
          <p className="text-lg font-semibold">Welcome Back</p>
          <p className="text-sm text-base-content/60">Sign in to continue your learning journey</p>
        </div>

        {/* FORM CARD */}
        <div className="card bg-base-100 border border-base-300 shadow-xl">
          <div className="card-body">
            {/* ERROR ALERT */}
            {error && (
              <div className="alert alert-error shadow-md mb-4">
                <div>
                  <span className="font-semibold">Error logging in</span>
                  <span className="text-sm block mt-1">{error.response?.data?.message || "Invalid credentials"}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* EMAIL FIELD */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered focus:input-primary transition-colors"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              {/* PASSWORD FIELD */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                  <a href="#" className="label-text-alt hover:text-primary transition-colors text-xs">
                    Forgot?
                  </a>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered flex-1 focus:input-primary transition-colors"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="btn btn-primary w-full font-semibold text-base mt-6"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* SIGNUP LINK */}
            <div className="divider my-4">OR</div>
            <Link to="/signup" className="btn btn-outline w-full normal-case">
              Create New Account
            </Link>

            {/* FOOTER TEXT */}
            <p className="text-center text-xs text-base-content/60 mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* FEATURES LIST */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-base-content/70">
          <div>💬 Real-time Chat</div>
          <div>📞 Video Calls</div>
          <div>🌍 Global Network</div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

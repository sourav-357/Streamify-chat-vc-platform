import { useState } from "react";
import { ShipWheelIcon, RefreshCwIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";
import { generateRandomAvatar } from "../lib/utils";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!accepted) {
      alert("Please accept the terms and conditions");
      return;
    }
    signupMutation(signupData);
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
          <p className="text-lg font-semibold">Join Our Community</p>
          <p className="text-sm text-base-content/60">Start your language learning journey today</p>
        </div>

        {/* FORM CARD */}
        <div className="card bg-base-100 border border-base-300 shadow-xl">
          <div className="card-body">
            {/* ERROR ALERT */}
            {error && (
              <div className="alert alert-error shadow-md mb-4">
                <div>
                  <span className="font-semibold">Error creating account</span>
                  <span className="text-sm block mt-1">{error.response?.data?.message || "Something went wrong"}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              {/* AVATAR SECTION */}
              <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-lg">
                <div className="avatar size-16 ring ring-primary ring-offset-2">
                  <img src={signupData.profilePic} alt="Profile" />
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary gap-2 flex-1 normal-case"
                  onClick={() =>
                    setSignupData((s) => ({ ...s, profilePic: generateRandomAvatar() }))
                  }
                >
                  <RefreshCwIcon className="size-4" />
                  Random Avatar
                </button>
              </div>

              {/* FULL NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered focus:input-primary transition-colors"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered focus:input-primary transition-colors"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                  <span className="label-text-alt text-xs">Min 6 characters</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered flex-1 focus:input-primary transition-colors"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    minLength={6}
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

              {/* TERMS & CONDITIONS */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <span className="label-text text-xs">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms
                    </a>
                    {" "}and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="btn btn-primary w-full font-semibold text-base mt-6"
                disabled={isPending || !accepted}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* LOGIN LINK */}
            <div className="divider my-4">ALREADY A MEMBER?</div>
            <Link to="/login" className="btn btn-outline w-full normal-case">
              Sign In Instead
            </Link>

            {/* FOOTER */}
            <p className="text-center text-xs text-base-content/60 mt-4">
              Join thousands of learners improving their language skills
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  RefreshCwIcon,
  UserIcon,
  BookIcon,
  LanguagesIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile complete! Welcome aboard 🎉");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Onboarding failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formState.nativeLanguage || !formState.learningLanguage) {
      toast.error("Please select both languages");
      return;
    }

    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Avatar changed!");
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <ShipWheelIcon className="size-8 text-base-100" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Complete Your Profile</h1>
              <p className="text-base-content/60 mt-1">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <progress
            className="progress progress-primary w-full"
            value={currentStep}
            max={totalSteps}
          ></progress>
          <p className="text-xs text-center text-base-content/60 mt-2">
            {Math.round((currentStep / totalSteps) * 100)}%
          </p>
        </div>

        {/* FORM CARD */}
        <div className="card bg-base-100 border border-base-300 shadow-2xl">
          <form onSubmit={handleSubmit} className="card-body p-6 sm:p-8">
            {/* STEP 1: PROFILE PICTURE */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="card-title text-2xl mb-2">Profile Picture</h2>
                  <p className="text-base-content/60">
                    Choose a profile picture to represent you
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* AVATAR PREVIEW */}
                  <div className="size-40 rounded-full border-4 border-primary shadow-lg overflow-hidden bg-base-200">
                    {formState.profilePic ? (
                      <img
                        src={formState.profilePic}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <UserIcon className="size-20 text-base-content/30" />
                      </div>
                    )}
                  </div>

                  {/* GENERATE BUTTON */}
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-secondary gap-2 normal-case"
                  >
                    <RefreshCwIcon className="size-5" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PERSONAL INFO */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="card-title text-2xl mb-2">Personal Information</h2>
                  <p className="text-base-content/60">Help others know who you are</p>
                </div>

                {/* FULL NAME */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={(e) =>
                      setFormState({ ...formState, fullName: e.target.value })
                    }
                    className="input input-bordered focus:input-primary"
                    placeholder="Your name"
                    disabled
                  />
                  <label className="label">
                    <span className="label-text-alt text-xs">
                      (Set during signup)
                    </span>
                  </label>
                </div>

                {/* BIO */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="textarea textarea-bordered focus:textarea-primary h-24"
                    placeholder="Share a bit about yourself and your language goals..."
                    maxLength={200}
                  />
                  <label className="label">
                    <span className="label-text-alt text-xs">
                      {formState.bio.length}/200 characters
                    </span>
                  </label>
                </div>

                {/* LOCATION */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="input input-bordered focus:input-primary pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: NATIVE LANGUAGE */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="card-title text-2xl mb-2">Native Language</h2>
                  <p className="text-base-content/60">
                    What language do you speak natively?
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Select Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({ ...formState, nativeLanguage: e.target.value })
                    }
                    className="select select-bordered focus:select-primary"
                  >
                    <option value="">Choose a language...</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {formState.nativeLanguage && (
                  <div className="alert alert-success">
                    <span>✓ {formState.nativeLanguage} selected</span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: LEARNING LANGUAGE */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="card-title text-2xl mb-2">Learning Language</h2>
                  <p className="text-base-content/60">
                    Which language would you like to learn?
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Select Language to Learn
                    </span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered focus:select-primary"
                  >
                    <option value="">Choose a language...</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {formState.learningLanguage && (
                  <div className="alert alert-success">
                    <span>✓ {formState.learningLanguage} selected</span>
                  </div>
                )}

                {/* SUMMARY */}
                <div className="divider">Summary</div>
                <div className="space-y-2 p-4 bg-base-200/50 rounded-lg">
                  <p>
                    <span className="font-semibold">Profile:</span>{" "}
                    {formState.fullName}
                  </p>
                  <p>
                    <span className="font-semibold">Native:</span>{" "}
                    {formState.nativeLanguage || "Not selected"}
                  </p>
                  <p>
                    <span className="font-semibold">Learning:</span>{" "}
                    {formState.learningLanguage || "Not selected"}
                  </p>
                  {formState.location && (
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {formState.location}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-base-300">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline flex-1 normal-case"
                  disabled={isPending}
                >
                  Previous
                </button>
              )}

              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary flex-1 normal-case"
                  disabled={
                    (currentStep === 3 && !formState.nativeLanguage) ||
                    isPending
                  }
                >
                  Next
                </button>
              )}

              {currentStep === totalSteps && (
                <button
                  type="submit"
                  className="btn btn-primary btn-success flex-1 normal-case gap-2"
                  disabled={
                    isPending ||
                    !formState.nativeLanguage ||
                    !formState.learningLanguage
                  }
                >
                  {isPending ? (
                    <>
                      <LoaderIcon className="animate-spin size-5" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <ShipWheelIcon className="size-5" />
                      Complete Onboarding
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-xs text-base-content/60 mt-6">
          You can update your profile information anytime
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
export default OnboardingPage;

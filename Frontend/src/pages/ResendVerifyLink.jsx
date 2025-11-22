import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resendVerifyLink } from "../features/userSlicer";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [timer, setTimer] = useState(sessionStorage.getItem("time") ? parseInt(sessionStorage.getItem("time")) : 15*60);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);   
  const {verifying} = useSelector(state=> state.user);
  const session_verifying = localStorage.getItem("verifying");
  const dispatch = useDispatch();
  

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      sessionStorage.setItem("time", `${timer-1}`);
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    setLoading(true);
    setMessage("");

    try {
      let res = await dispatch(resendVerifyLink({email}));
      res = res.payload
      console.log(res);
      if(res.success === false) {
          setError(true);
          setMessage(res.message);
          return;
        }
        setMessage(res.message);
        sessionStorage.setItem("time", 15*60);
        setTimer(15*60); 
    } catch (err) {
    console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    }finally{
      setLoading(false);
    }

  };

  const formatTime = sec => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-800 via-cyan-900 to-slate-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950/50 border border-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">

        <h1 className="text-3xl font-bold text-white text-center">
          Verify Your Email
        </h1>

        <p className="text-gray-300 text-center text-sm">
          A verification link has been sent to:
          <span className="block text-white font-medium mt-1">{email}</span>
        </p>

        <div className="text-center text-sm text-gray-400">
          Link expires in{" "}
          <span className="text-white font-semibold">{formatTime(timer)}</span>
        </div>

        <button
          onClick={handleResend}
          disabled={session_verifying===undefined||session_verifying===null ? (loading || !verifying ) : (loading)}
          className="w-full mt-4 px-6 py-3 cursor-pointer bg-white text-black font-semibold rounded-lg hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </div>
          ) : (
            "Resend Verification Email"
          )}
        </button>

        {message && error && (
          <div className="text-center text-sm text-red-400 font-medium">
            {message}
          </div>
        )}
        {message && !error && (
          <div className="text-center text-sm text-emerald-400 font-medium">
            {message}
          </div>
        )}

        <p className="text-gray-400 text-center text-xs mt-3">
          Didn't receive the email? Check your spam folder.
        </p>
        <div className="mt-6 p-4 rounded-lg bg-slate-900/40 border border-slate-700/40 text-center text-xs text-gray-300 space-y-2">
  <p className="leading-relaxed">
    <span className="text-gray-200 font-semibold">Note: </span>  
    Unverified accounts are automatically deleted after 
    <span className="text-white font-semibold"> 48 hours</span>.
  </p>

  <p className="leading-relaxed">
    If you try to sign in without verification,  
    we'll send you a fresh 
    <span className="text-white font-semibold"> verification link</span> instantly.
  </p>

  <p className="leading-relaxed">
    Make sure you verify your email to keep your account active.
  </p>
</div>

      </div>
      
    </div>
    
  );
}

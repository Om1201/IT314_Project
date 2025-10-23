import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isLoggedin = useSelector((state) => state.user.isLoggedin);

  return isLoggedin===true ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;


// Suggestions / notes for this ProtectedRoute component:
//
// 1) Handle "unknown" auth state:
//    If your auth state can be "null" or "loading" while validating a token, show a loader
//    instead of immediately redirecting. Example:
//      const isLoggedin = useSelector(state => state.user.isLoggedin);
//      if (isLoggedin === null) return <Spinner />; // or null
//
// 2) Preserve the original location so users return after signin:
//    Use useLocation and pass state to Navigate so the sign-in page can redirect back:
//      const location = useLocation();
//      return isLoggedin ? children : <Navigate to="/signin" replace state={{ from: location }} />;
 
// 3) Consider extracting auth logic to a hook:
//    A small useAuth() hook can encapsulate selectors and derived checks (token expiry, roles).
//      const { isLoggedin, isLoading, user } = useAuth();
//
// 4) Avoid storing sensitive tokens in Redux or localStorage when possible:
//    Use httpOnly cookies for access/refresh tokens and keep only non-sensitive user flags in Redux.
//
// 5) Add support for role-based routes (optional):
//    Accept allowedRoles prop and check user.role before rendering children.
//      const ProtectedRoute = ({ children, allowedRoles }) => { /* check user.role */ }
//
// 6) Handle token refresh and expired sessions gracefully:
//    If you detect an expired token, trigger a refresh flow before forcing a redirect.
//
// 7) Type-checking and tests:
//    Add PropTypes or convert to TypeScript for clearer props and safer refactors.
//    Add unit tests for the three states: authorized, unauthenticated, and loading.
//
// 8) Performance / render concerns:
//    Keep selector minimal (e.g. use shallowEqual or a selector function) to avoid extra renders.
//    Consider React.memo if the component gets re-rendered frequently without need.
//
// 9) Accessibility / UX:
//    If showing a loader, include accessible markup/aria attributes so assistive tech is informed.
//
// 10) Example final shape:
//    - useAuth hook returning { isLoggedin, isLoading, user }
//    - ProtectedRoute uses isLoading -> show loader; isLoggedin -> children; else Navigate with state
//
// Implement any combination of the above depending on your app complexity and security needs.
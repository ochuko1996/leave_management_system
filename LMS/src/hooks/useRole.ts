import { useAuth } from "../context/AuthContext";

export function useRole() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isHOD = user?.role === "hod";
  const isDean = user?.role === "dean";
  const isStaff = user?.role === "staff";

  const canManageRequests = isAdmin || isHOD || isDean;
  const canViewAllRequests = isAdmin || isHOD || isDean;
  const canApproveReject = isAdmin || isHOD || isDean;

  return {
    isAdmin,
    isHOD,
    isDean,
    isStaff,
    canManageRequests,
    canViewAllRequests,
    canApproveReject,
  };
}

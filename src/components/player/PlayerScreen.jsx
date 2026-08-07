import { useAuth } from "../../hooks/useAuth";
import { useSessionGuard } from "../../hooks/useSessionGuard";
import { usePresence } from "../../hooks/usePresence";
import AuthScreen from "./AuthScreen";
import ContestList from "./ContestList";

export default function PlayerScreen() {
  const { user, loading } = useAuth();

  useSessionGuard(user?.uid);
  const presence = usePresence(user?.uid);

  if (loading) {
    return (
      <div className="screen loading-screen">
        <div className="spinner" />
        <h2>Yükleniyor...</h2>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return <ContestList presence={presence} />;
}

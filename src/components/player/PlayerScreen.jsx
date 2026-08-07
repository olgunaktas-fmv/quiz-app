import { useAuth } from "../../hooks/useAuth";
import AuthScreen from "./AuthScreen";
import ContestList from "./ContestList";

export default function PlayerScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="screen loading-screen">
        <div className="spinner" />
        <h2>Yükleniyor...</h2>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return <ContestList />;
}

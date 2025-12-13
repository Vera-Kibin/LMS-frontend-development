import { useAuth } from "../../context/AuthContext.jsx";

const { uzytkownik } = useAuth();

const canEdit = uzytkownik.role === "instructor" || uzytkownik.role === "admin";

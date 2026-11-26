
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Autenticacion() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [registro, setRegistro] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
  }, []);

  async function enviar(e) {
    e.preventDefault();
    setProcesando(true);
    setMensaje("");

    try {
      if (registro) {
        await createUserWithEmailAndPassword(
          auth, email, password
        );
      } else {
        await signInWithEmailAndPassword(
          auth, email, password
        );
      }
      setPassword("");
    } catch (error) {
      const mensajes = {
        "auth/email-already-in-use":
          "Este correo ya tiene una cuenta.",
        "auth/weak-password":
          "La contraseña no cumple los requisitos de seguridad.",
        "auth/invalid-email":
          "El correo electrónico no es válido.",
        "auth/invalid-credential":
          "Correo o contraseña incorrectos.",
        "auth/too-many-requests":
          "Demasiados intentos. Intenta más tarde.",
        "auth/operation-not-allowed":
          "El método de acceso no está habilitado.",
      };

      setMensaje(
        mensajes[error.code] ||
        "No se pudo completar la operación."
      );
    } finally {
      setProcesando(false);
    }
  }

  const campo =
    "w-full rounded-xl border border-slate-700 " +
    "bg-[#070D19] px-4 py-3 text-white " +
    "outline-none focus:border-blue-500";

  return (
    <section
      id="acceso"
      className="border-t border-slate-800 px-4 py-20"
    >
      <div className="mx-auto max-w-md rounded-2xl
                      border border-slate-700 bg-[#0B132B]
                      p-8 text-white">
        <h2 className="mb-3 text-center text-2xl font-bold">
          Acceso ITS Chía
        </h2>

        {cargando ? (
          <p className="text-center text-slate-400">
            Verificando sesión...
          </p>
        ) : usuario ? (
          <div className="space-y-5 text-center">
            <p className="text-emerald-400">
              Sesión iniciada correctamente
            </p>
            <p className="break-all text-sm">
              {usuario.email}
            </p>
            <button
              onClick={() => signOut(auth)}
              className="w-full rounded-xl bg-red-600 py-3
                         font-semibold hover:bg-red-500"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-5">
            <p className="text-center text-slate-400">
              {registro
                ? "Crea una cuenta de prueba"
                : "Ingresa con tu cuenta"}
            </p>

            <input
              type="email"
              placeholder="Correo electrónico"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={campo}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              autoComplete={
                registro ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={campo}
              minLength={6}
              required
            />

            {mensaje && (
              <p role="alert" className="text-sm text-red-400">
                {mensaje}
              </p>
            )}

            <button
              type="submit"
              disabled={procesando}
              className="w-full rounded-xl bg-blue-600 py-3
                         font-semibold hover:bg-blue-500
                         disabled:opacity-50"
            >
              {procesando
                ? "Procesando..."
                : registro
                  ? "Registrarme"
                  : "Iniciar sesión"}
            </button>

            <button
              type="button"
              onClick={() => {
                setRegistro(!registro);
                setMensaje("");
              }}
              className="w-full text-sm text-blue-400
                         hover:text-blue-300"
            >
              {registro
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

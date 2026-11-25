
import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function FormularioContacto() {
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState("");
  const [mensajeEstado, setMensajeEstado] = useState("");

  const enviarFormulario = async (e) => {
    e.preventDefault();

    const formulario = e.currentTarget;
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      setEstado("error");
      setMensajeEstado("Falta configurar el servicio de correo.");
      return;
    }

    setEnviando(true);
    setEstado("");
    setMensajeEstado("");

    const datos = Object.fromEntries(new FormData(formulario));
    datos.access_key = accessKey;
    datos.subject = `ITS Chía - ${datos.asunto}`;
    datos.from_name = "Formulario ITS Chía";
    delete datos.asunto;

    try {
      const respuesta = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok || !resultado.success) {
        throw new Error(resultado.message || "Error de envío");
      }

      setEstado("exito");
      setMensajeEstado("¡Tu mensaje fue enviado correctamente!");
      formulario.reset();
    } catch {
      setEstado("error");
      setMensajeEstado(
        "No fue posible enviar el mensaje. Intenta nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  const campo =
    "w-full rounded-xl border border-slate-700 bg-[#070D19] " +
    "px-4 py-3 text-white outline-none " +
    "focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <section
      id="contacto"
      className="border-t border-slate-800 px-4 py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <Mail className="mx-auto mb-4 h-10 w-10 text-blue-400" />

          <h2 className="text-3xl font-extrabold text-white">
            Contacto ITS Chía
          </h2>

          <p className="mt-3 text-slate-400">
            ¿Tienes preguntas sobre nuestro proyecto académico?
            Envíanos un mensaje.
          </p>
        </div>

        <form
          onSubmit={enviarFormulario}
          className="mx-auto max-w-2xl space-y-5 rounded-2xl
                     border border-slate-700 bg-[#0B132B] p-6
                     shadow-xl md:p-10"
        >
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm text-slate-300">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="name"
              required
              maxLength={100}
              className={campo}
              placeholder="Escribe tu nombre"
            />
          </div>

          <div>
            <label htmlFor="correo" className="mb-2 block text-sm text-slate-300">
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              name="email"
              required
              className={campo}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="asunto" className="mb-2 block text-sm text-slate-300">
              Asunto
            </label>
            <select
              id="asunto"
              name="asunto"
              className={campo}
            >
              <option>Consulta general</option>
              <option>Información sobre ITS Chía</option>
              <option>Soporte técnico</option>
              <option>Simulador de red</option>
            </select>
          </div>

          <div>
            <label htmlFor="mensaje" className="mb-2 block text-sm text-slate-300">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="message"
              rows={5}
              required
              maxLength={3000}
              className={campo}
              placeholder="Escribe tu consulta..."
            />
          </div>

          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full items-center justify-center
                       gap-2 rounded-xl bg-blue-600 px-6 py-3
                       font-semibold text-white transition
                       hover:bg-blue-500 disabled:opacity-50"
          >
            <Send size={18} />
            {enviando ? "Enviando..." : "Enviar mensaje"}
          </button>

          {estado && (
            <div
              role="status"
              className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
                estado === "exito"
                  ? "bg-emerald-900/30 text-emerald-300"
                  : "bg-red-900/30 text-red-300"
              }`}
            >
              {estado === "exito" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              {mensajeEstado}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

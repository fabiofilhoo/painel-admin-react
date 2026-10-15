import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";
import { Leaf, LockKeyhole, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const schema = Yup.object({
  username: Yup.string().trim().required("Informe seu usuário."),
  password: Yup.string().required("Informe sua senha."),
});

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(values, { setSubmitting }) {
    setErrorMessage("");
    try {
      await login(values.username.trim(), values.password);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "Não foi possível entrar. Confira as credenciais e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b09] px-4 py-10 text-white">
      <div className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full bg-[#1d6b40]/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#1d6b40]/10 blur-3xl" />

      <section className="relative w-full max-w-[430px] rounded-3xl border border-white/10 bg-[#101612]/95 p-7 shadow-2xl shadow-black/40 sm:p-10">
        <div className="mb-9 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173d2a] text-[#72d69a]">
            <Leaf size={25} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-[.12em]">VERDE<span className="text-[#72d69a]">.</span></p>
            <p className="text-[10px] uppercase tracking-[.22em] text-gray-500">Admin workspace</p>
          </div>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[.24em] text-[#72d69a]">Acesso à plataforma</p>
        <h1 className="text-3xl font-semibold tracking-tight">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm leading-6 text-gray-400">Entre com suas credenciais para acessar seu painel.</p>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-200">Usuário</label>
                <div className="relative">
                  <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                  <Field id="username" name="username" autoComplete="username" placeholder="Digite seu usuário" className="input pl-11" />
                </div>
                <ErrorMessage name="username" component="p" className="mt-2 text-xs text-red-400" />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-200">Senha</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                  <Field id="password" name="password" type="password" autoComplete="current-password" placeholder="Digite sua senha" className="input pl-11" />
                </div>
                <ErrorMessage name="password" component="p" className="mt-2 text-xs text-red-400" />
              </div>

              {errorMessage && (
                <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5">
                {isSubmitting ? "Autenticando..." : "Entrar no painel"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-7 rounded-xl border border-white/[.07] bg-black/20 p-4">
          <p className="text-xs font-semibold text-gray-300">Acesso para demonstração</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">Usuário: <span className="text-gray-300">emilys</span> · Senha: <span className="text-gray-300">emilyspass</span></p>
        </div>
        <p className="mt-6 text-center text-[11px] text-gray-600">Projeto educacional • React + DummyJSON</p>
      </section>
    </main>
  );
}

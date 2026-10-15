import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Boxes, CircleDollarSign, Package, Plus, TrendingUp } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const money = (value) => new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "USD"
}).format(value ?? 0);

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data } = await api.get("/products?limit=100");
        if (active) setProducts(data.products || []);
      } catch {
        if (active) setError("Não foi possível carregar os produtos. Tente novamente.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const averagePrice = products.length
    ? products.reduce((sum, item) => sum + item.price, 0) / products.length
    : 0;

  const stats = [
    { label: "Produtos carregados", value: loading ? "…" : products.length, detail: "Itens retornados pela API", icon: Package },
    { label: "Preço médio", value: loading ? "…" : money(averagePrice), detail: "Média dos itens carregados", icon: CircleDollarSign },
    { label: "Categorias", value: loading ? "…" : new Set(products.map((p) => p.category)).size, detail: "Categorias distintas", icon: Boxes },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.22em] text-[#72d69a]">Quarta-feira · Workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Visão geral<span className="text-[#72d69a]">.</span></h1>
          <p className="mt-2 text-sm text-gray-400">Olá, {user?.firstName || user?.username || "usuário"}. Aqui está o resumo do seu painel.</p>
        </div>
        <Link to="/produtos" className="btn-primary"><Plus size={17} /> Gerenciar produtos</Link>
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="card p-5 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
              </div>
              <div className="rounded-xl border border-[#286b45]/30 bg-[#173d2a]/60 p-3 text-[#72d69a]"><Icon size={21} /></div>
            </div>
            <p className="mt-4 text-xs text-gray-500">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[.07] p-5 md:p-6">
            <div>
              <h2 className="font-semibold">Produtos recentes</h2>
              <p className="mt-1 text-xs text-gray-500">Amostra dos dados do DummyJSON</p>
            </div>
            <Link to="/produtos" className="flex items-center gap-1 text-sm text-[#72d69a] hover:text-white">Ver todos <ArrowUpRight size={15} /></Link>
          </div>
          {loading ? <p className="p-6 text-sm text-gray-400">Carregando produtos…</p> : (
            <div className="divide-y divide-white/[.06]">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-4 md:px-6">
                  <img src={product.thumbnail} alt="" className="h-11 w-11 rounded-lg bg-white object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.title}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium text-[#8be2ad]">{money(product.price)}</p>
                </div>
              ))}
              {!products.length && <p className="p-6 text-sm text-gray-400">Nenhum produto disponível.</p>}
            </div>
          )}
        </div>

        <div className="card flex flex-col justify-between overflow-hidden p-6">
          <div>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#173d2a] text-[#72d69a]"><TrendingUp size={22} /></div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#72d69a]">Próximo passo</p>
            <h2 className="mt-3 text-2xl font-semibold">Organize seu catálogo</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">Pesquise, cadastre e edite produtos em uma tela dedicada. As alterações feitas pela API de demonstração são simuladas.</p>
          </div>
          <Link to="/produtos" className="btn-secondary mt-8 w-full">Abrir catálogo <ArrowUpRight size={16} /></Link>
        </div>
      </section>
      <p className="text-xs text-gray-600">Os indicadores são calculados a partir dos dados recebidos da API de demonstração, não representam dados comerciais reais.</p>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AlertTriangle, Check, Edit3, LoaderCircle, Plus, Search, Trash2, X } from "lucide-react";
import api from "../services/api";

const money = (value) => new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "USD"
}).format(Number(value || 0));

const productSchema = Yup.object({
  title: Yup.string().trim().min(3, "Use pelo menos 3 caracteres.").required("Informe o nome."),
  price: Yup.number().typeError("Informe um preço válido.").min(0, "O preço não pode ser negativo.").required("Informe o preço."),
  category: Yup.string().trim().required("Informe a categoria."),
  description: Yup.string().trim().max(300, "Máximo de 300 caracteres."),
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        const { data } = await api.get("/products?limit=100");
        if (active) setProducts(data.products || []);
      } catch {
        if (active) setPageError("Falha ao buscar produtos. Verifique sua conexão e tente novamente.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return products.filter((product) =>
      `${product.title} ${product.category} ${product.id}`.toLowerCase().includes(normalized)
    );
  }, [products, query]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setModalOpen(true);
  }

  async function saveProduct(values, { setSubmitting }) {
    setNotice("");
    try {
      if (editing) {
        const { data } = await api.put(`/products/${editing.id}`, {
          title: values.title.trim(),
          price: Number(values.price),
          category: values.category.trim(),
          description: values.description.trim(),
        });
        // DummyJSON simula a edição; atualizamos o estado local para refletir a ação.
        setProducts((current) => current.map((item) =>
          item.id === editing.id ? { ...item, ...data, title: values.title.trim(), price: Number(values.price), category: values.category.trim(), description: values.description.trim() } : item
        ));
        setNotice("Produto atualizado na interface. A API de demonstração não persiste a alteração.");
      } else {
        const payload = {
          title: values.title.trim(),
          price: Number(values.price),
          category: values.category.trim(),
          description: values.description.trim(),
        };
        const { data } = await api.post("/products/add", payload);
        // Mantemos o produto criado no estado local, pois a API não salva de forma permanente.
        setProducts((current) => [{ ...payload, ...data, id: data.id || `local-${Date.now()}` }, ...current]);
        setNotice("Produto adicionado à interface. A API de demonstração não persiste a alteração.");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      setPageError(error.response?.data?.message || "Não foi possível salvar o produto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct() {
    if (!deleteTarget) return;
    setPageError("");
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      setProducts((current) => current.filter((item) => item.id !== deleteTarget.id));
      setNotice("Produto removido da interface. A API de demonstração não persiste a alteração.");
      setDeleteTarget(null);
    } catch (error) {
      setPageError(error.response?.data?.message || "Não foi possível excluir o produto.");
    }
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.22em] text-[#72d69a]">Catálogo</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Produtos<span className="text-[#72d69a]">.</span></h1>
          <p className="mt-2 text-sm text-gray-400">Gerencie os itens exibidos no catálogo de demonstração.</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={17} /> Novo produto</button>
      </section>

      {notice && (
        <div className="flex items-start gap-3 rounded-xl border border-[#286b45]/40 bg-[#173d2a]/40 p-4 text-sm text-[#a4edbd]">
          <Check size={18} className="mt-0.5 shrink-0" /> <p>{notice}</p>
          <button aria-label="Fechar aviso" className="ml-auto" onClick={() => setNotice("")}><X size={16} /></button>
        </div>
      )}
      {pageError && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" /> <p>{pageError}</p>
          <button aria-label="Fechar erro" className="ml-auto" onClick={() => setPageError("")}><X size={16} /></button>
        </div>
      )}

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/[.07] p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
          <div>
            <p className="font-medium">Todos os produtos</p>
            <p className="mt-1 text-xs text-gray-500">{filteredProducts.length} resultado(s)</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou categoria..." className="input pl-10" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-400"><LoaderCircle className="animate-spin" size={18} /> Carregando catálogo…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-white/[.025] text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Produto</th>
                  <th className="px-5 py-4 font-medium">Categoria</th>
                  <th className="px-5 py-4 font-medium">Preço</th>
                  <th className="px-5 py-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[.06]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-white/[.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.thumbnail || "https://placehold.co/80x80/101612/72d69a?text=Item"} alt="" className="h-11 w-11 rounded-lg bg-white object-contain" />
                        <div className="max-w-xs">
                          <p className="truncate font-medium">{product.title}</p>
                          <p className="mt-1 text-xs text-gray-600">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="rounded-lg border border-white/10 bg-white/[.03] px-2.5 py-1 text-xs text-gray-300">{product.category || "Sem categoria"}</span></td>
                    <td className="px-5 py-4 font-medium text-[#8be2ad]">{money(product.price)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button aria-label={`Editar ${product.title}`} title="Editar" onClick={() => openEdit(product)} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:border-[#286b45]/60 hover:text-[#8be2ad]"><Edit3 size={16} /></button>
                        <button aria-label={`Excluir ${product.title}`} title="Excluir" onClick={() => setDeleteTarget(product)} className="rounded-lg border border-white/10 p-2 text-gray-400 hover:border-red-500/30 hover:text-red-300"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredProducts.length && (
                  <tr><td colSpan="4" className="px-5 py-14 text-center text-sm text-gray-500">Nenhum produto encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-gray-600">Observação: DummyJSON é uma API de testes. As operações de adicionar, editar e excluir são simuladas no servidor; as alterações ficam no estado local desta sessão e podem desaparecer ao recarregar a página.</p>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#101612] p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#72d69a]">{editing ? "Editar cadastro" : "Novo cadastro"}</p>
                <h2 id="product-modal-title" className="mt-2 text-2xl font-semibold">{editing ? "Editar produto" : "Adicionar produto"}</h2>
                <p className="mt-1 text-sm text-gray-500">Preencha os dados do produto.</p>
              </div>
              <button aria-label="Fechar modal" onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"><X size={19} /></button>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                title: editing?.title || "",
                price: editing?.price ?? "",
                category: editing?.category || "",
                description: editing?.description || "",
              }}
              validationSchema={productSchema}
              onSubmit={saveProduct}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="title" className="mb-2 block text-sm text-gray-300">Nome do produto</label>
                    <Field id="title" name="title" placeholder="Ex.: Teclado mecânico" className="input" />
                    <ErrorMessage name="title" component="p" className="mt-1.5 text-xs text-red-400" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="price" className="mb-2 block text-sm text-gray-300">Preço (USD)</label>
                      <Field id="price" name="price" type="number" min="0" step="0.01" placeholder="0.00" className="input" />
                      <ErrorMessage name="price" component="p" className="mt-1.5 text-xs text-red-400" />
                    </div>
                    <div>
                      <label htmlFor="category" className="mb-2 block text-sm text-gray-300">Categoria</label>
                      <Field id="category" name="category" placeholder="Ex.: laptops" className="input" />
                      <ErrorMessage name="category" component="p" className="mt-1.5 text-xs text-red-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="mb-2 block text-sm text-gray-300">Descrição</label>
                    <Field as="textarea" id="description" name="description" rows="3" placeholder="Descrição opcional..." className="input resize-y" />
                    <ErrorMessage name="description" component="p" className="mt-1.5 text-xs text-red-400" />
                  </div>
                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? "Salvando..." : editing ? "Salvar alterações" : "Criar produto"}</button>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <section role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101612] p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300"><Trash2 size={20} /></div>
            <h2 id="delete-title" className="text-xl font-semibold">Excluir produto?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">Você está removendo <span className="font-medium text-gray-200">{deleteTarget.title}</span> da lista local. Essa ação não pode ser desfeita nesta tela.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancelar</button>
              <button onClick={deleteProduct} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"><Trash2 size={16} /> Excluir</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

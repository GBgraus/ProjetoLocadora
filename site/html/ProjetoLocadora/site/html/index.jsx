import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Wrench, Laptop, Phone, Monitor, Cpu, X, Search, Calendar, Clock, Star, Plus, Minus, CheckCircle2 } from "lucide-react";

// ------------------------------------------------------------------------------------
// TechStore – Single-file React app (frontend demo)
// - Catálogo de produtos (eletrônicos & informática)
// - Carrinho com resumo e checkout (simulado)
// - Agendamento de assistência técnica com escolha de data/horário
// - Busca, filtros, avaliações, favoritos e persistência via localStorage
// ------------------------------------------------------------------------------------

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "laptops", label: "Notebooks", icon: Laptop },
  { id: "phones", label: "Smartphones", icon: Phone },
  { id: "monitors", label: "Monitores", icon: Monitor },
  { id: "components", label: "Componentes", icon: Cpu },
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Notebook Pro 14" ,
    description: "Intel i7, 16GB RAM, 512GB SSD, Tela 14”",
    price: 6499.9,
    category: "laptops",
    rating: 4.7,
    stock: 12,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    specs: ["Intel i7 12ª Geração", "16GB DDR5", "512GB NVMe", "Tela IPS 14\" 2K"],
  },
  {
    id: "p2",
    name: "Smartphone X Max",
    description: "128GB, Câmera 48MP, Bateria 5000mAh",
    price: 2899.0,
    category: "phones",
    rating: 4.5,
    stock: 24,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    specs: ["128GB UFS", "48MP + 12MP", "Bateria 5000mAh", "Tela 6.5\" 120Hz"],
  },
  {
    id: "p3",
    name: "Monitor 27\" QHD",
    description: "Painel IPS, 165Hz, HDR10",
    price: 1799.9,
    category: "monitors",
    rating: 4.6,
    stock: 9,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    specs: ["QHD 2560x1440", "165Hz", "IPS", "HDR10"],
  },
  {
    id: "p4",
    name: "SSD NVMe 1TB",
    description: "Leitura 7000MB/s, Escrita 6500MB/s",
    price: 499.9,
    category: "components",
    rating: 4.8,
    stock: 30,
    img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    specs: ["PCIe 4.0", "1TB", "7000/6500MB/s", "5 anos garantia"],
  },
  {
    id: "p5",
    name: "Headset Gamer 7.1",
    description: "Surround, Microfone com Cancelamento de Ruído",
    price: 349.0,
    category: "components",
    rating: 4.3,
    stock: 50,
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    specs: ["7.1 Virtual", "Drivers 50mm", "USB", "RGB"],
  },
  {
    id: "p6",
    name: "Notebook Slim 15",
    description: "Ryzen 7, 8GB RAM, 256GB SSD, 15.6”",
    price: 3599.0,
    category: "laptops",
    rating: 4.2,
    stock: 15,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    specs: ["Ryzen 7 5700U", "8GB DDR4", "256GB NVMe", "Tela 15.6\" FHD"],
  },
];

const SERVICE_ISSUES = {
  notebook: ["Tela quebrada", "Troca de SSD/RAM", "Formatação e Backup", "Bateria fraca", "Lentidão"],
  smartphone: ["Troca de tela", "Bateria", "Conector de carga", "Câmera", "Água/oxidação"],
  pc: ["Montagem", "Upgrade GPU/CPU", "Reinstalação Windows", "Limpeza", "Diagnóstico"]
};

// Helpers
const currency = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const ratingStars = (r) => Array.from({ length: 5 }).map((_, i) => (
  <Star key={i} className={"w-4 h-4 " + (i < Math.round(r) ? "fill-current" : "")}/>
));

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

function Header({ onOpenCart, cartCount }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="inline-flex w-9 h-9 rounded-2xl bg-black text-white items-center justify-center"><Wrench className="w-5 h-5"/></span>
          TechStore
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2">
          <Search className="w-4 h-4 opacity-60"/>
          <input placeholder="Buscar produtos..." className="outline-none bg-transparent px-2 py-1" id="global-search"/>
        </div>
        <button onClick={onOpenCart} className="ml-2 relative inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-black text-white shadow">
          <ShoppingCart className="w-5 h-5"/>
          <span className="text-sm">Carrinho</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

function CategoryBar({ active, setActive }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const Icon = c.icon ?? CheckCircle2;
          return (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`px-4 py-2 rounded-2xl border shadow-sm flex items-center gap-2 ${active === c.id ? "bg-black text-white" : "bg-white"}`}>
              <Icon className="w-4 h-4"/>
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductCard({ p, onAdd }) {
  return (
    <motion.div layout className="rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform"/>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{p.name}</h3>
          <div className="text-sm inline-flex items-center gap-1 opacity-80">{ratingStars(p.rating)}</div>
        </div>
        <p className="text-sm opacity-75 line-clamp-2">{p.description}</p>
        <ul className="text-xs opacity-70 list-disc pl-4">
          {p.specs.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-semibold">{currency(p.price)}</span>
          <button onClick={() => onAdd(p)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black text-white shadow">
            <Plus className="w-4 h-4"/> Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CartDrawer({ open, onClose, items, setItems, onCheckout }) {
  const total = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const updateQty = (id, d) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <AnimatePresence>
      {open && (
        <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l shadow-2xl z-40 flex flex-col">
          <div className="p-4 flex items-center justify-between border-b">
            <div className="text-lg font-semibold flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Seu Carrinho</div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100"><X/></button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {items.length === 0 && <p className="opacity-70">Seu carrinho está vazio.</p>}
            {items.map((it) => (
              <div key={it.id} className="p-3 border rounded-xl flex gap-3">
                <img src={it.img} alt={it.name} className="w-16 h-16 object-cover rounded-lg"/>
                <div className="flex-1">
                  <div className="font-medium leading-tight">{it.name}</div>
                  <div className="text-sm opacity-70">{currency(it.price)} • {it.qty} un.</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(it.id, -1)} className="p-2 border rounded-lg"><Minus className="w-4 h-4"/></button>
                    <span className="text-sm w-6 text-center">{it.qty}</span>
                    <button onClick={() => updateQty(it.id, +1)} className="p-2 border rounded-lg"><Plus className="w-4 h-4"/></button>
                    <button onClick={() => remove(it.id)} className="ml-auto text-sm opacity-70 hover:opacity-100">Remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t space-y-3">
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
            <button disabled={!items.length} onClick={onCheckout} className="w-full px-4 py-3 rounded-2xl bg-black text-white disabled:opacity-50">
              Finalizar compra
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Checkout({ open, onClose, total, onSuccess }) {
  const [form, setForm] = useState({ nome: "", email: "", endereco: "", pagamento: "cartao" });
  const canSubmit = form.nome && form.email && form.endereco && total > 0;
  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Checkout</div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl"><X/></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Input label="Nome completo" value={form.nome} onChange={(v) => handle("nome", v)} />
                <Input label="E-mail" type="email" value={form.email} onChange={(v) => handle("email", v)} />
                <Input label="Endereço de entrega" value={form.endereco} onChange={(v) => handle("endereco", v)} />
                <div>
                  <label className="text-sm font-medium">Pagamento</label>
                  <div className="mt-2 flex gap-2">
                    {[
                      { id: "cartao", label: "Cartão" },
                      { id: "pix", label: "PIX" },
                      { id: "boleto", label: "Boleto" },
                    ].map((opt) => (
                      <button key={opt.id} onClick={() => handle("pagamento", opt.id)}
                        className={`px-3 py-2 rounded-xl border ${form.pagamento === opt.id ? "bg-black text-white" : "bg-white"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border rounded-xl p-3">
                <span>Total</span>
                <span className="font-semibold">{currency(total)}</span>
              </div>
              <button disabled={!canSubmit} onClick={() => onSuccess(form)} className="w-full px-4 py-3 rounded-2xl bg-emerald-600 text-white disabled:opacity-50">
                Confirmar pagamento
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-3 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-black/20"/>
    </div>
  );
}

function ScheduleForm({ onCreate }) {
  const [form, setForm] = useLocalStorage("ts_schedule_draft", {
    tipo: "notebook",
    problema: "Tela quebrada",
    nome: "",
    email: "",
    telefone: "",
    data: "",
    hora: "",
    detalhes: "",
  });
  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const issues = SERVICE_ISSUES[form.tipo];

  // Gera slots simples de horário (09:00–18:00 a cada 30 min)
  const slots = useMemo(() => {
    const arr = [];
    for (let h = 9; h <= 18; h++) {
      for (let m of [0, 30]) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        arr.push(`${hh}:${mm}`);
      }
    }
    return arr;
  }, []);

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const canSubmit = form.nome && form.email && form.telefone && form.data && form.hora;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Tipo de equipamento</label>
            <select value={form.tipo} onChange={(e)=>handle("tipo", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border bg-white">
              <option value="notebook">Notebook</option>
              <option value="smartphone">Smartphone</option>
              <option value="pc">PC/Computador</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Problema</label>
            <select value={form.problema} onChange={(e)=>handle("problema", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border bg-white">
              {issues.map((i)=> <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <Input label="Seu nome" value={form.nome} onChange={(v)=>handle("nome", v)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input label="E-mail" type="email" value={form.email} onChange={(v)=>handle("email", v)} />
          <Input label="Telefone" value={form.telefone} onChange={(v)=>handle("telefone", v)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4"/>Data</label>
            <input type="date" min={minDate} value={form.data} onChange={(e)=>handle("data", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border bg-white"/>
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4"/>Horário</label>
            <select value={form.hora} onChange={(e)=>handle("hora", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border bg-white">
              <option value="">Selecione</option>
              {slots.map((s)=>(<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Detalhes (opcional)</label>
          <textarea value={form.detalhes} onChange={(e)=>handle("detalhes", e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 rounded-xl border bg-white" placeholder="Modelo, sintomas, histórico, etc."/>
        </div>
        <button disabled={!canSubmit} onClick={()=>onCreate(form)} className="px-4 py-3 rounded-2xl bg-black text-white w-full md:w-auto disabled:opacity-50">
          Agendar atendimento
        </button>
      </div>
      <div className="p-4 border rounded-2xl bg-neutral-50">
        <h4 className="font-semibold mb-2">Como funciona</h4>
        <ol className="list-decimal ml-5 text-sm space-y-1 opacity-80">
          <li>Escolha o tipo de equipamento e descreva o problema.</li>
          <li>Selecione a data e o horário desejados.</li>
          <li>Receba a confirmação por e-mail (simulação nesta demo).</li>
          <li>Traga o aparelho na hora marcada ou solicite retirada (opcional).</li>
        </ol>
        <div className="mt-4 text-sm opacity-70">
          <p>Horário de atendimento: seg–sex, 09:00–18:30.</p>
          <p>Servimos toda a cidade. Diagnóstico inicial gratuito.</p>
        </div>
      </div>
    </div>
  );
}

function AppointmentsList({ items, onCancel }) {
  if (!items.length) return <p className="opacity-70">Nenhum agendamento ainda.</p>;
  return (
    <div className="grid gap-3">
      {items.map((a) => (
        <div key={a.id} className="p-3 border rounded-xl flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex-1">
            <div className="font-medium">{a.nome} • {a.tipo.toUpperCase()}</div>
            <div className="text-sm opacity-75">{a.problema} • {a.data} às {a.hora} • {a.email} • {a.telefone}</div>
            {a.detalhes && <div className="text-sm opacity-70 mt-1">{a.detalhes}</div>}
          </div>
          <button onClick={() => onCancel(a.id)} className="px-3 py-2 rounded-xl border">Cancelar</button>
        </div>
      ))}
    </div>
  );
}

export default function TechStoreApp() {
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useLocalStorage("ts_cart", []);
  const [orders, setOrders] = useLocalStorage("ts_orders", []);
  const [appointments, setAppointments] = useLocalStorage("ts_appts", []);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const i = document.getElementById("global-search");
    if (i) i.oninput = (e) => setQuery(e.target.value);
  }, []);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => (activeCat === "all" || p.category === activeCat) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())));
  }, [activeCat, query]);

  const addToCart = (p) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };

  const startCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePaid = (payload) => {
    const order = {
      id: "ord-" + Math.random().toString(36).slice(2, 9),
      items: cart,
      total: cart.reduce((acc, it) => acc + it.price * it.qty, 0),
      when: new Date().toISOString(),
      buyer: payload,
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    setCheckoutOpen(false);
    setToast({ type: "success", title: "Pedido confirmado!", desc: `Número do pedido ${order.id}` });
  };

  const createAppointment = (data) => {
    const appt = { id: "apt-" + Math.random().toString(36).slice(2, 9), ...data };
    setAppointments((a) => [appt, ...a]);
    setToast({ type: "success", title: "Agendamento criado!", desc: `${data.data} às ${data.hora}` });
  };

  const cancelAppointment = (id) => {
    setAppointments((a) => a.filter((x) => x.id !== id));
  };

  const cartCount = cart.reduce((acc, it) => acc + it.qty, 0);
  const total = cart.reduce((acc, it) => acc + it.price * it.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <Header onOpenCart={() => setCartOpen(true)} cartCount={cartCount}/>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-8">
          <div className="rounded-3xl bg-black text-white p-6 md:p-8 shadow flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight">Loja de Eletrônicos & Assistência Técnica</h1>
              <p className="mt-2 opacity-80">Compre notebooks, smartphones, monitores e componentes. E ainda agende manutenção com horário marcado.</p>
              <div className="mt-4 flex items-center gap-2">
                <a href="#catalogo" className="px-4 py-2 rounded-2xl bg-white text-black">Ver catálogo</a>
                <a href="#assistencia" className="px-4 py-2 rounded-2xl border border-white/30">Agendar assistência</a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              {[Laptop, Phone, Monitor].map((I, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/10 flex items-center justify-center aspect-square"><I/></div>
              ))}
            </div>
          </div>
        </section>

        <section id="catalogo" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Catálogo</h2>
            <div className="text-sm opacity-70">{filtered.length} resultados</div>
          </div>
          <CategoryBar active={activeCat} setActive={setActiveCat} />
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onAdd={addToCart}/>
            ))}
          </motion.div>
        </section>

        <section id="assistencia" className="mt-12 space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5"/>
            <h2 className="text-xl font-semibold">Assistência Técnica – Agende seu horário</h2>
          </div>
          <ScheduleForm onCreate={createAppointment} />
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Meus agendamentos</h3>
            <AppointmentsList items={appointments} onCancel={cancelAppointment} />
          </div>
        </section>

        <section id="pedidos" className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold">Pedidos recentes</h2>
          {!orders.length ? (
            <p className="opacity-70">Nenhum pedido ainda.</p>
          ) : (
            <div className="grid gap-3">
              {orders.map((o) => (
                <div key={o.id} className="p-3 border rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{o.id}</div>
                    <div className="text-sm opacity-70">{new Date(o.when).toLocaleString("pt-BR")}</div>
                  </div>
                  <div className="text-sm opacity-80 mt-1">{o.items.length} itens • {currency(o.total)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm flex flex-col md:flex-row items-center gap-2 opacity-70">
          <div>© {new Date().getFullYear()} TechStore. Todos os direitos reservados.</div>
          <div className="md:ml-auto">Suporte: suporte@techstore.com • (11) 99999-9999</div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} items={cart} setItems={setCart} onCheckout={startCheckout} />
      <Checkout open={checkoutOpen} onClose={()=>setCheckoutOpen(false)} total={total} onSuccess={handlePaid} />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white border shadow-xl rounded-2xl p-4 z-50 w-[90%] max-w-md">
            <div className="font-medium">{toast.title}</div>
            <div className="text-sm opacity-80">{toast.desc}</div>
            <button onClick={()=>setToast(null)} className="absolute top-2 right-2 p-2 rounded-xl hover:bg-neutral-100"><X/></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

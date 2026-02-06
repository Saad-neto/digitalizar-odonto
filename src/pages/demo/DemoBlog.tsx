import React, { useState } from 'react';
import { Plus, Eye, Calendar, Tag, Search, X } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  category: string;
  status: 'publicado' | 'rascunho';
  date: string;
  views: number;
  excerpt: string;
}

const posts: Post[] = [
  { id: 1, title: 'Como Manter Dentes Brancos por Mais Tempo', category: 'Saúde Bucal', status: 'publicado', date: '28/01/2026', views: 342, excerpt: 'Dicas práticas para manter seu sorriso radiante durante todo o dia.' },
  { id: 2, title: 'Tratamento Estético: O Que Esperar?', category: 'Estética', status: 'publicado', date: '25/01/2026', views: 218, excerpt: 'Conheça os procedimentos mais populares e como eles podem transformar seu sorriso.' },
  { id: 3, title: 'Cuidado com os Dentes das Crianças', category: 'Infantil', status: 'publicado', date: '20/01/2026', views: 156, excerpt: 'Orientações para pais sobre a saúde bucal dos pequenos desde a infância.' },
  { id: 4, title: '5 Alimentos que Destroem Seus Dentes', category: 'Saúde Bucal', status: 'publicado', date: '15/01/2026', views: 487, excerpt: 'Saiba quais alimentos são os maiores vilões da saúde bucal e como minimizar os danos.' },
  { id: 5, title: 'Limpeza dos Dentes: Myths vs Facts', category: 'Dicas', status: 'rascunho', date: '02/02/2026', views: 0, excerpt: 'Quebrando os mitos mais comuns sobre higiene bucal que circulam na internet.' },
  { id: 6, title: 'Tudo sobre Implantes Dentários', category: 'Estética', status: 'rascunho', date: '03/02/2026', views: 0, excerpt: 'Um guia completo sobre o procedimento, custos e resultados esperados.' },
];

const categories = ['Todas', 'Saúde Bucal', 'Estética', 'Infantil', 'Dicas'];

const categoryColors: Record<string, string> = {
  'Saúde Bucal': 'bg-medical-100 text-medical-700',
  'Estética': 'bg-purple-100 text-purple-700',
  'Infantil': 'bg-pink-100 text-pink-700',
  'Dicas': 'bg-amber-100 text-amber-700',
};

const DemoBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'publicado' | 'rascunho'>('todos');

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const matchStatus = statusFilter === 'todos' || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Blog / CMS</h1>
          <p className="text-neutral-500 text-sm">{posts.filter(p => p.status === 'publicado').length} posts publicados · {posts.filter(p => p.status === 'rascunho').length} rascunhos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-medical-500 text-white text-sm font-semibold rounded-lg hover:bg-medical-600 transition-colors">
          <Plus size={16} />
          Novo Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-300"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                selectedCategory === cat
                  ? 'bg-medical-500 text-white border-medical-500'
                  : 'border-neutral-200 text-neutral-600 hover:border-medical-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-neutral-50 rounded-lg p-0.5 border border-neutral-200">
          {(['todos', 'publicado', 'rascunho'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
                statusFilter === s ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Color bar by category */}
            <div className={`h-1.5 ${post.category === 'Saúde Bucal' ? 'bg-medical-400' : post.category === 'Estética' ? 'bg-purple-400' : post.category === 'Infantil' ? 'bg-pink-400' : 'bg-amber-400'}`} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  post.status === 'publicado' ? 'bg-mint-100 text-mint-700' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {post.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                </span>
              </div>

              <h3 className="font-bold text-neutral-900 text-base mb-2 leading-snug">{post.title}</h3>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">{post.excerpt}</p>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {post.views > 0 ? `${post.views} views` : 'Sem views'}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 text-xs font-semibold text-medical-600 hover:text-medical-700 border border-medical-200 hover:border-medical-400 rounded-lg px-3 py-1.5 transition-colors">
                  {post.status === 'rascunho' ? 'Publicar' : 'Editar'}
                </button>
                <button className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 border border-neutral-200 hover:border-neutral-300 rounded-lg px-3 py-1.5 transition-colors">
                  Duplicar
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-neutral-500">
            Nenhum post encontrado com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 flex gap-6">
        <div className="text-center">
          <p className="text-xl font-bold text-neutral-900">{posts.length}</p>
          <p className="text-xs text-neutral-500">Total de posts</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-mint-600">{posts.filter(p => p.status === 'publicado').length}</p>
          <p className="text-xs text-neutral-500">Publicados</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-neutral-500">{posts.filter(p => p.status === 'rascunho').length}</p>
          <p className="text-xs text-neutral-500">Rascunhos</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-medical-600">{posts.reduce((s, p) => s + p.views, 0)}</p>
          <p className="text-xs text-neutral-500">Views totais</p>
        </div>
      </div>
    </div>
  );
};

export default DemoBlog;


import React, { useState } from 'react';
import { Search, Plus, Folder, FileImage, FileVideo, MoreVertical, Download, Share2, Trash2 } from 'lucide-react';
import { CloudFile } from '../types';

const MOCK_FILES: CloudFile[] = [
  { id: '1', name: 'Concepto_Cyberpunk.png', size: '2.4 MB', type: 'image', updatedAt: 'hace 2 horas', url: 'https://picsum.photos/seed/1/200' },
  { id: '2', name: 'Borrador_Publicidad.mp4', size: '45.1 MB', type: 'video', updatedAt: 'Ayer', url: 'https://picsum.photos/seed/2/200' },
  { id: '3', name: 'Logo_Marca_V2.svg', size: '120 KB', type: 'design', updatedAt: 'hace 3 días', url: 'https://picsum.photos/seed/3/200' },
  { id: '4', name: 'Sistema_Diseño_UI.fig', size: '12.8 MB', type: 'design', updatedAt: 'hace 1 semana', url: 'https://picsum.photos/seed/4/200' },
];

const CloudDrive: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files] = useState<CloudFile[]>(MOCK_FILES);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nube de Archivos</h1>
          <p className="text-gray-400">Almacena y comparte tus activos creativos de forma segura.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 self-start">
          <Plus className="w-5 h-5" /> Subir Nuevo Archivo
        </button>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar archivos, carpetas, diseños..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="px-5 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            <Folder className="w-4 h-4" /> Carpetas
          </button>
          <button className="px-5 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            Tipo: Todos
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="px-8 py-6">Nombre</th>
              <th className="px-8 py-6">Tamaño</th>
              <th className="px-8 py-6">Modificado</th>
              <th className="px-8 py-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredFiles.map((file) => (
              <tr key={file.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shadow-inner">
                      {file.type === 'image' ? <FileImage className="w-6 h-6 text-indigo-400" /> : file.type === 'video' ? <FileVideo className="w-6 h-6 text-blue-400" /> : <Folder className="w-6 h-6 text-amber-400" />}
                    </div>
                    <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{file.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-400">{file.size}</td>
                <td className="px-8 py-5 text-sm text-gray-400">{file.updatedAt}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Descargar" className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
                      <Download className="w-5 h-5" />
                    </button>
                    <button title="Compartir" className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button title="Eliminar" className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all text-gray-400 hover:text-red-400">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredFiles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-500 font-medium">
                  No se encontraron archivos. Comienza subiendo un activo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CloudDrive;

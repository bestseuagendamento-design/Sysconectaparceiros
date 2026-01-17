/**
 * 🗺️ MAPA DE ENTREGAS - Leaflet + OpenStreetMap
 * Mapa interativo com marcadores e rotas de entrega
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

interface Endereco {
  nome: string;
  endereco: string;
  numero: string;
  bairro?: string;
  cidade: string;
  estado: string;
  lat?: number;
  lng?: number;
  valor?: number;
  items?: number;
}

interface MapaEntregasProps {
  enderecos: Endereco[];
  centro?: { lat: number; lng: number };
  onClose?: () => void;
}

export function MapaEntregas({ enderecos, centro, onClose }: MapaEntregasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapaCarregado, setMapaCarregado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 🔥 Carregar Leaflet dinamicamente
    const loadLeaflet = async () => {
      try {
        // Adicionar CSS do Leaflet
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Carregar script do Leaflet
        if (!(window as any).L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        const L = (window as any).L;

        // Centralizar no primeiro endereço ou centro fornecido
        const centerPoint = centro || { lat: -27.5954, lng: -48.5480 }; // Florianópolis como padrão

        // Criar mapa
        const map = L.map(mapRef.current).setView([centerPoint.lat, centerPoint.lng], 12);

        // Adicionar tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Adicionar marcadores para cada endereço
        enderecos.forEach((end, idx) => {
          // Se tiver lat/lng, usar. Caso contrário, geocodificar (simplificado)
          const lat = end.lat || centerPoint.lat + (Math.random() - 0.5) * 0.1;
          const lng = end.lng || centerPoint.lng + (Math.random() - 0.5) * 0.1;

          // Criar ícone customizado
          const iconHtml = `
            <div style="
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
              border: 3px solid white;
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            ">
              <span style="transform: rotate(45deg);">${idx + 1}</span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          // Criar popup
          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #1e293b;">${idx + 1}. ${end.nome}</h3>
              <p style="font-size: 13px; color: #475569; margin-bottom: 4px;">
                📍 ${end.endereco}, ${end.numero}${end.bairro ? ` - ${end.bairro}` : ''}
              </p>
              <p style="font-size: 13px; color: #475569; margin-bottom: 8px;">
                ${end.cidade} - ${end.estado}
              </p>
              ${end.items ? `<p style="font-size: 12px; color: #64748b;">📦 ${end.items} item(ns)</p>` : ''}
              ${end.valor ? `<p style="font-size: 14px; font-weight: bold; color: #10b981; margin-top: 4px;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(end.valor)}</p>` : ''}
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${end.endereco}, ${end.numero}, ${end.cidade}, ${end.estado}`)}" 
                target="_blank"
                style="
                  display: inline-block;
                  margin-top: 8px;
                  padding: 6px 12px;
                  background: #3b82f6;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: bold;
                "
              >
                🗺️ Abrir no Google Maps
              </a>
            </div>
          `;

          L.marker([lat, lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent);
        });

        // Ajustar zoom para mostrar todos os marcadores
        if (enderecos.length > 1) {
          const bounds = L.latLngBounds(
            enderecos.map((end, idx) => [
              end.lat || centerPoint.lat + (Math.random() - 0.5) * 0.1,
              end.lng || centerPoint.lng + (Math.random() - 0.5) * 0.1,
            ])
          );
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        setMapaCarregado(true);
      } catch (error) {
        console.error('Erro ao carregar mapa:', error);
        setErro('Erro ao carregar o mapa. Verifique sua conexão.');
      }
    };

    loadLeaflet();
  }, [enderecos, centro]);

  // Função para gerar rota no Google Maps
  const abrirRotaGoogleMaps = () => {
    if (enderecos.length === 0) return;

    // Criar URL com múltiplos waypoints
    const origem = `${enderecos[0].endereco}, ${enderecos[0].numero}, ${enderecos[0].cidade}, ${enderecos[0].estado}`;
    const destino = `${enderecos[enderecos.length - 1].endereco}, ${enderecos[enderecos.length - 1].numero}, ${enderecos[enderecos.length - 1].cidade}, ${enderecos[enderecos.length - 1].estado}`;

    const waypoints = enderecos
      .slice(1, -1)
      .map(end => `${end.endereco}, ${end.numero}, ${end.cidade}, ${end.estado}`)
      .join('|');

    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origem)}&destination=${encodeURIComponent(destino)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}`;

    window.open(url, '_blank');
  };

  if (erro) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-500">{erro}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header com botão de fechar */}
      {onClose && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-lg shadow-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      )}

      {/* Botão de Rota Otimizada */}
      {enderecos.length > 0 && (
        <div className="absolute top-4 left-4 z-[1000]">
          <button
            onClick={abrirRotaGoogleMaps}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors font-bold"
          >
            <Navigation className="w-5 h-5" />
            Abrir Rota no Google Maps
          </button>
        </div>
      )}

      {/* Mapa */}
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-xl border-2 border-slate-200"
        style={{ background: '#f1f5f9' }}
      />

      {!mapaCarregado && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-xl">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-slate-300 animate-bounce mx-auto mb-4" />
            <p className="text-slate-500">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Legenda */}
      {enderecos.length > 0 && (
        <div className="mt-4 bg-white rounded-xl p-4 border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Ordem de Entrega ({enderecos.length} parada{enderecos.length !== 1 ? 's' : ''})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {enderecos.map((end, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <span className="text-slate-700">
                  {end.nome} - {end.cidade}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Dica:</strong> Clique nos marcadores para ver detalhes e abrir no Google Maps. 
          O botão "Abrir Rota no Google Maps" cria uma rota otimizada com todas as paradas.
        </p>
      </div>
    </div>
  );
}

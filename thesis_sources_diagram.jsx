import React, { useState, useRef, useCallback, useEffect } from 'react';

const ThesisSourcesDiagram = () => {
  const canvasRef = useRef(null);
  const [offset, setOffset] = useState({ x: 80, y: 50 });
  const [scale, setScale] = useState(0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showMinimap, setShowMinimap] = useState(true);

  const [nodes, setNodes] = useState([
    // Sources Articles (Orange) - Colonne 1
    { id: 'ijcci', x: 50, y: 140, type: 'article', label: 'IJCCI-D-25-00049.pdf', subtitle: 'Étude 1 — Interactivité & Intérêt', width: 220, height: 75, description: 'Article soumis IJCCI 2025. Contient 3 expérimentations (4ème, 6ème, Terminale) sur l\'effet de l\'interactivité et de l\'alignement personnage.' },
    { id: 'illusion', x: 50, y: 340, type: 'article', label: 'illusion_ai_agent_draft.pdf', subtitle: 'Étude 2 — Design & Illusion', width: 220, height: 75, description: 'Article en préparation. Examine l\'effet du design visuel (humanoïde vs abstrait) sur l\'illusion de compréhension chez 119 élèves de 5ème.' },
    { id: 'memoria', x: 50, y: 540, type: 'article', label: 'MemorIA_CAVW_2025.pdf', subtitle: 'Architecture technique plateforme', width: 220, height: 75, description: 'Article publié CAVW 2025. Décrit l\'architecture complète de la plateforme MemorIA : pipeline ASR→LLM→TTS→Animation.' },
    
    // Rapports Project Knowledge (Bleu) - Colonne 2
    { id: 'rapport_histoire', x: 420, y: 60, type: 'rapport', label: 'État de l\'Art Histoire', subtitle: 'Didactique, perception élèves, STIM', width: 210, height: 70, description: 'Rapport synthétisant la littérature sur l\'enseignement de l\'histoire : comparaison avec STIM, perception des élèves, méthodes interactives.' },
    { id: 'rapport_tech', x: 420, y: 170, type: 'rapport', label: 'Technologies Éducatives', subtitle: 'Agents, IA générative, embodiment', width: 210, height: 70, description: 'Rapport couvrant les agents pédagogiques, le paradigme CASA, la théorie de l\'agence sociale, et les spécificités des LLM en éducation.' },
    { id: 'rapport_mapper', x: 420, y: 280, type: 'rapport', label: 'Research Paper Mapper', subtitle: 'Cartographie & convergences', width: 210, height: 70, description: 'Analyse cartographique des sources bibliographiques. Identifie les convergences théoriques et les lacunes de la littérature.' },
    
    // Ressources (Vert) - Colonne 2 bas
    { id: 'vault', x: 420, y: 440, type: 'resource', label: 'Vault.xlsx', subtitle: 'Corpus bibliographique complet', width: 190, height: 65, description: 'Base de données des références bibliographiques. Contient métadonnées, résumés et tags thématiques pour chaque source.' },
    { id: 'protocole_e3', x: 420, y: 560, type: 'resource', label: 'Protocole CER E3', subtitle: 'Design 2×2, ~140 lycéens', width: 190, height: 65, description: 'Protocole de l\'Étude 3 approuvé par le CER. Design 2×2 (Incarnation × Prosodie), population lycéenne, illusion cartographique Mercator.' },
    
    // Extractions intermédiaires (Violet) - Colonne 3
    { id: 'extraction_ijcci', x: 720, y: 140, type: 'extraction', label: 'IJCCI_extraction.txt', subtitle: 'Related Work + Méthode + Résultats', width: 200, height: 65, description: 'Extraction brute des sections Related Work, Method et Results de l\'article IJCCI. Base pour intégration Type A dans Ch2 et Ch4.' },
    { id: 'extraction_illusion', x: 720, y: 340, type: 'extraction', label: 'illusion_extraction.txt', subtitle: 'Related Work + Méthode + Résultats', width: 200, height: 65, description: 'Extraction brute des sections Related Work, Method et Results de l\'article illusion. Base pour intégration Type A dans Ch2 et Ch5.' },
    
    // Chapitres (Rouge) - Colonne 4
    { id: 'ch1', x: 1020, y: 40, type: 'chapter', label: 'Ch. 1 — Introduction', subtitle: 'Type C · ~6 000 mots', width: 185, height: 58, description: 'Introduction générale : contexte, problématique, questions de recherche (QR1-QR3), contributions, structure du manuscrit.' },
    { id: 'ch2', x: 1020, y: 130, type: 'chapter', label: 'Ch. 2 — État de l\'Art', subtitle: 'Type C · ~15 500 mots', width: 185, height: 58, description: 'Revue de littérature : fondements (SDT, CTML), agents pédagogiques (CASA), IA générative, illusion de compréhension (IOED).' },
    { id: 'ch3', x: 1020, y: 220, type: 'chapter', label: 'Ch. 3 — MemorIA', subtitle: 'Type A · ~8 500 mots', width: 185, height: 58, description: 'Plateforme expérimentale : architecture technique, modules (Whisper, GPT-4, ElevenLabs, FOMM), validation pilote.' },
    { id: 'ch4', x: 1020, y: 310, type: 'chapter', label: 'Ch. 4 — Étude 1', subtitle: 'Type A/B · ~22 200 mots', width: 185, height: 58, description: 'Trois expérimentations sur l\'interactivité : design 2×2, mesures IMI, ANCOVA. Effet robuste de l\'interactivité sur l\'intérêt.' },
    { id: 'ch5', x: 1020, y: 400, type: 'chapter', label: 'Ch. 5 — Étude 2', subtitle: 'Type A/B · ~10 800 mots', width: 185, height: 58, description: 'Design visuel et illusion : protocole IOED, mesures MDMT/Godspeed. Pas d\'effet du design, mais augmentation illusion globale.' },
    { id: 'ch6', x: 1020, y: 490, type: 'chapter', label: 'Ch. 6 — Discussion', subtitle: 'Type C · ~6 000 mots', width: 185, height: 58, description: 'Synthèse des contributions, implications théoriques (CASA à l\'ère LLM), implications pratiques, limites méthodologiques.' },
    { id: 'ch7', x: 1020, y: 580, type: 'chapter', label: 'Ch. 7 — Conclusion', subtitle: 'Type C · ~5 500 mots', width: 185, height: 58, description: 'Bilan, réponses aux QR, perspectives (E3, études longitudinales, questions éthiques sur la personnification historique).' },
    
    // Annexes (Gris) - Colonne 5
    { id: 'annexes', x: 1280, y: 310, type: 'annexe', label: 'Annexes A–D', subtitle: 'Questionnaires, prompts, éthique', width: 160, height: 58, description: 'A: Questionnaires (IMI, IOED, Godspeed, MDMT). B: Prompts systèmes. C: Matériel pédagogique. D: Documents éthiques.' },
  ]);

  const connections = [
    // Articles vers Extractions
    { from: 'ijcci', to: 'extraction_ijcci', label: 'extraction', type: 'transform' },
    { from: 'illusion', to: 'extraction_illusion', label: 'extraction', type: 'transform' },
    
    // ★ Extractions "Related Work" vers État de l'Art
    { from: 'extraction_ijcci', to: 'ch2', label: 'Related Work', type: 'feed' },
    { from: 'extraction_illusion', to: 'ch2', label: 'Related Work', type: 'feed' },
    
    // Articles directs vers Chapitres
    { from: 'memoria', to: 'ch3', label: 'Type A (90%)', type: 'direct' },
    { from: 'ijcci', to: 'ch4', label: 'Type B (intro)', type: 'adapt' },
    { from: 'illusion', to: 'ch5', label: 'Type B (intro)', type: 'adapt' },
    
    // Extractions vers Chapitres expérimentaux
    { from: 'extraction_ijcci', to: 'ch4', label: 'Type A', type: 'direct' },
    { from: 'extraction_illusion', to: 'ch5', label: 'Type A', type: 'direct' },
    
    // Rapports vers État de l'Art
    { from: 'rapport_histoire', to: 'ch2', label: '§2.1 Fondements', type: 'feed' },
    { from: 'rapport_tech', to: 'ch2', label: '§2.2–2.4', type: 'feed' },
    { from: 'rapport_mapper', to: 'ch2', label: 'structure', type: 'feed' },
    
    // Vault vers chapitres
    { from: 'vault', to: 'ch2', label: 'références', type: 'feed' },
    { from: 'vault', to: 'ch1', label: 'références', type: 'feed' },
    
    // Protocole E3 vers Conclusion
    { from: 'protocole_e3', to: 'ch7', label: '§7.2 perspectives', type: 'feed' },
    
    // Flux inter-chapitres
    { from: 'ch4', to: 'ch5', label: 'transition', type: 'flow' },
    { from: 'ch4', to: 'ch6', label: '', type: 'flow' },
    { from: 'ch5', to: 'ch6', label: '', type: 'flow' },
    
    // Chapitres vers Annexes
    { from: 'ch3', to: 'annexes', label: 'B: prompts', type: 'ref' },
    { from: 'ch4', to: 'annexes', label: 'A, D', type: 'ref' },
    { from: 'ch5', to: 'annexes', label: 'A, C', type: 'ref' },
  ];

  const typeConfig = {
    article: { 
      bg: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)', 
      border: '#f57c00', 
      text: '#e65100',
      label: 'Article source',
      icon: '📄'
    },
    rapport: { 
      bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', 
      border: '#1976d2', 
      text: '#0d47a1',
      label: 'Rapport (Project Knowledge)',
      icon: '📊'
    },
    resource: { 
      bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', 
      border: '#388e3c', 
      text: '#1b5e20',
      label: 'Ressource',
      icon: '📁'
    },
    extraction: { 
      bg: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', 
      border: '#8e24aa', 
      text: '#6a1b9a',
      label: 'Extraction intermédiaire',
      icon: '⚙️'
    },
    chapter: { 
      bg: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', 
      border: '#d32f2f', 
      text: '#b71c1c',
      label: 'Chapitre manuscrit',
      icon: '📖'
    },
    annexe: { 
      bg: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)', 
      border: '#546e7a', 
      text: '#37474f',
      label: 'Annexe',
      icon: '📎'
    },
  };

  const connectionConfig = {
    direct: { color: '#d32f2f', label: 'Type A (recopie 90%)', dash: false },
    transform: { color: '#8e24aa', label: 'Extraction', dash: false },
    adapt: { color: '#f57c00', label: 'Type B (adaptation)', dash: false },
    feed: { color: '#1976d2', label: 'Alimentation', dash: false },
    flow: { color: '#90a4ae', label: 'Flux narratif', dash: true },
    ref: { color: '#78909c', label: 'Référence annexe', dash: true },
  };

  const getNodeCenter = (node) => ({
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  });

  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    if (nodeId) {
      setDraggedNode(nodeId);
      setSelectedNode(nodeId);
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;
      
      setNodes(prev => prev.map(node => 
        node.id === draggedNode 
          ? { ...node, x: x - node.width / 2, y: y - node.height / 2 }
          : node
      ));
    } else if (isPanning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [draggedNode, isPanning, offset, scale, panStart]);

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.3), 2.5);
    
    const scaleRatio = newScale / scale;
    setOffset({
      x: mouseX - (mouseX - offset.x) * scaleRatio,
      y: mouseY - (mouseY - offset.y) * scaleRatio,
    });
    setScale(newScale);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  const renderConnection = (conn, index) => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return null;

    const from = getNodeCenter(fromNode);
    const to = getNodeCenter(toNode);
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    
    const startX = from.x + Math.cos(angle) * (fromNode.width / 2 + 4);
    const startY = from.y + Math.sin(angle) * (fromNode.height / 2 + 4);
    const endX = to.x - Math.cos(angle) * (toNode.width / 2 + 12);
    const endY = to.y - Math.sin(angle) * (toNode.height / 2 + 12);

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const perpX = -(endY - startY) * 0.1;
    const perpY = (endX - startX) * 0.1;
    const ctrlX = midX + perpX;
    const ctrlY = midY + perpY;

    const config = connectionConfig[conn.type] || connectionConfig.flow;
    const isHighlighted = selectedNode === conn.from || selectedNode === conn.to;

    return (
      <g key={index} style={{ opacity: isHighlighted ? 1 : 0.7 }}>
        <defs>
          <marker
            id={`arrow-${index}`}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={config.color} />
          </marker>
        </defs>
        <path
          d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
          fill="none"
          stroke={config.color}
          strokeWidth={isHighlighted ? 3 : 2}
          strokeDasharray={config.dash ? '8,4' : 'none'}
          markerEnd={`url(#arrow-${index})`}
          style={{ transition: 'stroke-width 0.2s' }}
        />
        {conn.label && (
          <g>
            <rect
              x={midX + perpX/2 - conn.label.length * 3.5}
              y={midY + perpY/2 - 9}
              width={conn.label.length * 7}
              height={16}
              fill="white"
              rx="4"
              stroke={config.color}
              strokeWidth="1"
              opacity={0.95}
            />
            <text
              x={midX + perpX/2}
              y={midY + perpY/2 + 3}
              fill={config.color}
              fontSize="10"
              textAnchor="middle"
              fontWeight="600"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {conn.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  const renderNode = (node) => {
    const config = typeConfig[node.type];
    const isSelected = selectedNode === node.id;
    const isHovered = hoveredNode === node.id;
    const isConnected = selectedNode && connections.some(
      c => (c.from === selectedNode && c.to === node.id) || (c.to === selectedNode && c.from === node.id)
    );

    return (
      <g
        key={node.id}
        transform={`translate(${node.x}, ${node.y})`}
        onMouseDown={(e) => handleMouseDown(e, node.id)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        style={{ cursor: draggedNode === node.id ? 'grabbing' : 'grab' }}
      >
        <rect
          x="3"
          y="3"
          width={node.width}
          height={node.height}
          rx="12"
          ry="12"
          fill="rgba(0,0,0,0.1)"
        />
        <rect
          width={node.width}
          height={node.height}
          rx="12"
          ry="12"
          fill={config.border}
          opacity={0.1}
        />
        <rect
          width={node.width}
          height={node.height}
          rx="12"
          ry="12"
          fill="white"
        />
        <rect
          width={node.width}
          height={node.height}
          rx="12"
          ry="12"
          fill="none"
          stroke={isSelected ? '#1a1a1a' : config.border}
          strokeWidth={isSelected ? 3 : isHovered || isConnected ? 2.5 : 2}
        />
        <rect
          x="1"
          y="1"
          width={node.width - 2}
          height="6"
          rx="12"
          ry="12"
          fill={config.border}
        />
        <rect
          x="1"
          y="4"
          width={node.width - 2}
          height="8"
          fill={config.border}
        />
        <text x="14" y={node.height / 2 + 2} fontSize="16">{config.icon}</text>
        <text
          x="36"
          y={node.height / 2 - 6}
          fill={config.text}
          fontSize="11"
          fontWeight="700"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {node.label}
        </text>
        <text
          x="36"
          y={node.height / 2 + 10}
          fill="#666"
          fontSize="9"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {node.subtitle}
        </text>
      </g>
    );
  };

  const resetView = () => {
    setOffset({ x: 80, y: 50 });
    setScale(0.85);
    setSelectedNode(null);
  };

  const fitToScreen = () => {
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x + n.width));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxY = Math.max(...nodes.map(n => n.y + n.height));
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const contentWidth = maxX - minX + 100;
    const contentHeight = maxY - minY + 100;
    const scaleX = rect.width / contentWidth;
    const scaleY = rect.height / contentHeight;
    const newScale = Math.min(scaleX, scaleY, 1.2) * 0.9;
    
    setScale(newScale);
    setOffset({
      x: (rect.width - contentWidth * newScale) / 2 - minX * newScale + 50,
      y: (rect.height - contentHeight * newScale) / 2 - minY * newScale + 50,
    });
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);
  const outgoingConnections = connections.filter(c => c.from === selectedNode);
  const incomingConnections = connections.filter(c => c.to === selectedNode);

  const minimapScale = 0.08;
  const minimapWidth = 180;
  const minimapHeight = 120;

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">🗺️</div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Cartographie des Sources</h1>
            <p className="text-xs text-slate-500">Thèse IHM — Flux d'alimentation et interconnexions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 gap-2">
            <button onClick={() => setScale(s => Math.max(s * 0.8, 0.3))} className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold">−</button>
            <span className="font-mono text-sm text-slate-600 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(s * 1.2, 2.5))} className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 text-slate-600 font-bold">+</button>
          </div>
          <button onClick={fitToScreen} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">Ajuster</button>
          <button onClick={resetView} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors">Réinitialiser</button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200 px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Types</span>
            {Object.entries(typeConfig).map(([type, config]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <span>{config.icon}</span>
                <span className="text-slate-600">{config.label}</span>
              </div>
            ))}
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Flux</span>
            {Object.entries(connectionConfig).slice(0, 4).map(([type, config]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: config.color }} />
                <span className="text-slate-600">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="flex-1 overflow-hidden relative"
        onMouseDown={(e) => handleMouseDown(e, null)}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        <svg
          width="100%"
          height="100%"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="-5000" y="-5000" width="10000" height="10000" fill="#f8fafc" />
          <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid)" />
          {connections.map((conn, i) => renderConnection(conn, i))}
          {nodes.map(renderNode)}
        </svg>

        {showMinimap && (
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="px-2 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Aperçu</span>
              <button onClick={() => setShowMinimap(false)} className="text-slate-400 hover:text-slate-600 text-sm leading-none">×</button>
            </div>
            <svg width={minimapWidth} height={minimapHeight} className="bg-slate-50">
              {nodes.map(node => {
                const config = typeConfig[node.type];
                return (
                  <rect
                    key={node.id}
                    x={node.x * minimapScale + 10}
                    y={node.y * minimapScale + 5}
                    width={node.width * minimapScale}
                    height={node.height * minimapScale}
                    fill={config.border}
                    opacity={selectedNode === node.id ? 1 : 0.5}
                    rx="2"
                  />
                );
              })}
              <rect
                x={(-offset.x / scale) * minimapScale + 10}
                y={(-offset.y / scale) * minimapScale + 5}
                width={(canvasRef.current?.clientWidth || 800) / scale * minimapScale}
                height={(canvasRef.current?.clientHeight || 600) / scale * minimapScale}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                rx="2"
              />
            </svg>
          </div>
        )}

        {!showMinimap && (
          <button onClick={() => setShowMinimap(true)} className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">🗺️ Minimap</button>
        )}

        {selectedNodeData && (
          <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-xl border border-slate-200 w-80 overflow-hidden">
            <div className="px-4 py-3 flex items-start gap-3" style={{ backgroundColor: typeConfig[selectedNodeData.type].border + '15' }}>
              <span className="text-2xl">{typeConfig[selectedNodeData.type].icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate">{selectedNodeData.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedNodeData.subtitle}</p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none mt-0.5">×</button>
            </div>
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed">{selectedNodeData.description}</p>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: typeConfig[selectedNodeData.type].border }}>{outgoingConnections.length}</span>
                <span className="text-slate-600">connexion(s) sortante(s)</span>
              </div>
              {outgoingConnections.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {outgoingConnections.map((c, i) => {
                    const targetNode = nodes.find(n => n.id === c.to);
                    return (
                      <button key={i} onClick={() => setSelectedNode(c.to)} className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-xs text-slate-700 transition-colors flex items-center gap-1">
                        <span>{typeConfig[targetNode?.type]?.icon}</span>
                        <span>{targetNode?.label.split('—')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-100">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-slate-400">{incomingConnections.length}</span>
                <span className="text-slate-600">connexion(s) entrante(s)</span>
              </div>
              {incomingConnections.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {incomingConnections.map((c, i) => {
                    const sourceNode = nodes.find(n => n.id === c.from);
                    return (
                      <button key={i} onClick={() => setSelectedNode(c.from)} className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md text-xs text-slate-700 transition-colors flex items-center gap-1">
                        <span>{typeConfig[sourceNode?.type]?.icon}</span>
                        <span>{sourceNode?.label.split('—')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 text-xs text-slate-500 border border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-xs">Clic</kbd><span>Sélectionner</span></div>
            <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-xs">Glisser</kbd><span>Déplacer nœud</span></div>
            <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-xs">Fond</kbd><span>Naviguer</span></div>
            <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-xs">Molette</kbd><span>Zoomer</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSourcesDiagram;

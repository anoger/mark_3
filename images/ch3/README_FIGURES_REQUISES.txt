% ============================================================================
% FIGURES REQUISES POUR LE CHAPITRE 3 - MEMORIA
% ============================================================================
% 
% Les fichiers LaTeX du Chapitre 3 font référence aux figures suivantes.
% Ces images doivent être extraites du PDF source et placées dans ce dossier.
%
% ============================================================================

% ----------------------------------------------------------------------------
% FIGURE 1 : Pipeline architecture de MemorIA
% ----------------------------------------------------------------------------
% Nom de fichier : memoria_pipeline_architecture.png
% Référence LaTeX : \ref{fig:memoria_pipeline}
% Localisation dans LaTeX : 3_2_architecture_technique.tex, ligne ~30
% 
% Description complète :
%   Diagramme montrant l'architecture complète du pipeline MemorIA :
%   - Module Whisper : Speech to Text (entrée audio utilisateur)
%   - Module GPT-4 : Textual Response (génération de réponse)
%   - Module ElevenLabs : Voice synthesis (synthèse vocale)
%   - Module Audio2Face : Animation faciale 3D
%   - A2F omni kit extension : Capture du viewport
%   - Emotion transfer module : Application FOMM (Siarohin et al., 2019)
%
% Source originale : 
%   Computer Animation & Virtual Worlds - 2025 - Oger - MemorIA, Figure 1
%
% Spécifications techniques :
%   - Format : PNG haute résolution
%   - Résolution min : 300 DPI
%   - Largeur : pleine page dans le document
%   - Doit être lisible en projection (usage classe)

% ----------------------------------------------------------------------------
% FIGURE 2 : Interface Audio2Face avec paramètres en temps réel
% ----------------------------------------------------------------------------
% Nom de fichier : audio2face_interface.png
% Référence LaTeX : \ref{fig:audio2face_interface}
% Localisation dans LaTeX : 3_2_architecture_technique.tex, ligne ~90
%
% Description complète :
%   Capture d'écran composite montrant :
%   - Panneau gauche : Interface Audio2Face avec paramètres émotionnels
%     temps réel (emotion strength, smoothing, max emotions, etc.)
%   - Panneau droit : Portrait animé final rendu avec le modèle de 
%     mouvement du premier ordre (FOMM)
%
% Source originale :
%   Computer Animation & Virtual Worlds - 2025 - Oger - MemorIA, Figure 2
%
% Spécifications techniques :
%   - Format : PNG haute résolution
%   - Résolution min : 300 DPI
%   - Largeur : pleine page dans le document
%   - Les deux panneaux doivent être clairement visibles

% ----------------------------------------------------------------------------
% FIGURE 3 : Implémentation en classe de MemorIA (NOUVELLE)
% ----------------------------------------------------------------------------
% Nom de fichier : classroom_implementation_caesar.png
% Référence LaTeX : \ref{fig:classroom_implementation}
% Localisation dans LaTeX : Ch3_Methodologie.tex, section 3.3
%
% Description complète :
%   Photo de l'implémentation en classe montrant :
%   - Élèves debout devant l'écran de projection
%   - Agent virtuel Jules César projeté sur l'écran
%   - Enseignant supervisant depuis un poste de contrôle
%   - Configuration typique d'une classe de collège française
%
% Source originale :
%   Computer Animation & Virtual Worlds - 2025 - Oger - MemorIA, Figure 3
%
% Spécifications techniques :
%   - Format : PNG haute résolution
%   - Résolution min : 300 DPI
%   - Largeur : 90% de la page dans le document
%   - Doit montrer clairement le setup pédagogique

% ============================================================================
% TABLEAU (Déjà intégré dans le LaTeX)
% ============================================================================
% 
% TABLE 1 : Breakdown of MemorIA's global response time by module
% 
% Ce tableau est déjà codé directement dans le fichier LaTeX
% (3_2_architecture_technique.tex, ligne ~110), pas besoin d'image externe.
%
% Contenu :
%   - Speech recognition (Whisper) : 300 ms
%   - Language generation (GPT-4) : 2500 ms  
%   - Voice synthesis (ElevenLabs) : 500 ms
%   - Facial animation (Audio2Face + FOMM) : 700 ms
%   - Latence totale approximative : 4000 ms (4 s)

% ============================================================================
% CHECKLIST D'INTÉGRATION
% ============================================================================
%
% [ ] Extraire Figure 1 du PDF source (page 3)
% [ ] Sauvegarder comme : memoria_pipeline_architecture.png
% [ ] Vérifier résolution >= 300 DPI
% [ ] Vérifier lisibilité des labels et flèches
%
% [ ] Extraire Figure 2 du PDF source (page 4)  
% [ ] Sauvegarder comme : audio2face_interface.png
% [ ] Vérifier résolution >= 300 DPI
% [ ] Vérifier que les deux panneaux sont bien visibles
%
% [ ] Extraire Figure 3 du PDF source (page 5)
% [ ] Sauvegarder comme : classroom_implementation_caesar.png
% [ ] Vérifier résolution >= 300 DPI
% [ ] Vérifier que le setup pédagogique est clairement visible
%
% [ ] Compiler Main.tex pour vérifier l'intégration
% [ ] Vérifier que toutes les références \ref fonctionnent
%
% ============================================================================

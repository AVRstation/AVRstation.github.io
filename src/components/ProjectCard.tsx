import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Globe, Play } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  idx: number;
  contributionsLabel: string;
  onWatchVideo?: () => void;
  key?: string | number;
}

export function ProjectCard({ project, idx, contributionsLabel, onWatchVideo }: ProjectCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!isPlaying && project.youtubeId) {
      setIsPlaying(true);
      if (onWatchVideo) onWatchVideo();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className="project-card sleek-glass rounded-2xl overflow-hidden sleek-card-hover group flex flex-col will-change-transform"
    >
      <div 
        className="aspect-video relative overflow-hidden bg-zinc-900 border-b border-[var(--glass-border)] cursor-pointer"
        onClick={handlePlay}
      >
        {project.youtubeId ? (
          isPlaying ? (
            <iframe 
              src={`https://www.youtube.com/embed/${project.youtubeId}?modestbranding=1&rel=0&iv_load_policy=3&color=white&autoplay=1`}
              className="absolute inset-0 w-full h-full grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={project.title}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full group/player">
              <img 
                src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/90 flex items-center justify-center text-black shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-8 h-8 fill-black ml-1" />
                </div>
              </div>
            </div>
          )
        ) : project.image ? (
          <img 
            src={project.image} 
            alt={`Screenshot of ${project.title}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
             <Globe className="w-12 h-12 text-zinc-700" />
          </div>
        )}
        {!isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        )}
      </div>
      
      <div 
        className="p-5 md:p-6 flex flex-col flex-1"
      >
        <div className="flex flex-wrap gap-2 mb-3">
          {project.stack.map((s: string) => (
            <span key={s} className="text-[11px] font-mono font-bold uppercase text-[var(--accent)] opacity-80">
              • {s}
            </span>
          ))}
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{project.title}</h3>
        <p className="text-[var(--text-dim)] text-sm md:text-base leading-relaxed mb-4">
          {project.description}
        </p>
        
        {project.whatDone && (
          <div className="mb-6">
            <div className="text-xs font-black tracking-widest text-[var(--accent)] mb-2 opacity-60 uppercase">{contributionsLabel}</div>
            <p className="text-[var(--text-dim)] text-sm leading-relaxed italic opacity-90 border-l border-[var(--accent)]/30 pl-3">
              {project.whatDone}
            </p>
          </div>
        )}

        <div className="mt-auto flex gap-4 items-center">
          {project.links.map((link: any) => (
            <a 
              key={link.url} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
            >
              {link.name} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';

export type Language = 'ru' | 'en' | 'cn' | 'hi' | 'es' | 'ar' | 'fr';

export interface Translation {
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  experience_title: string;
  experience: { highlight: string; text: string }[];
  projects_title: string;
  contact_cta_title: string;
  contact_cta_text: string;
  skills: {
    producer: string;
    gamedev: string;
    po: string;
  };
  snake_rules: string;
  pong_rules: string;
  space_rules: string;
  snake_best: string;
  game_snake: string;
  game_pong: string;
  game_space: string;
  contributions_label: string;
  chest_title_locked: string;
  chest_title_open: string;
  chest_desc_locked: string;
  chest_desc_open: string;
  chest_button: string;
  settings_title: string;
  settings_panel_title: string;
  settings_games: string;
  settings_sounds: string;
  settings_play_mode: string;
  stats_change_game: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
  icon: React.ReactNode;
}

export interface Project {
  title: string;
  description: string;
  whatDone: string;
  stack: string[];
  youtubeId?: string;
  image?: string;
  isPress?: boolean;
  links: { name: string; url: string }[];
}

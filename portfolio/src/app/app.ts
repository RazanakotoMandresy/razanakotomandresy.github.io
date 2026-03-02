import { Component, OnInit, HostListener, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import portfolioData from './data/portfolio.json';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // ── UI state ──────────────────────────────────────────────────────────────
  isDark        = signal(true);
  lang          = signal<'en' | 'fr'>('en');
  isMenuOpen    = signal(false);
  scrolled      = signal(false);
  activeSection = signal('hero');
  typedText     = signal('');

  // ── Static data (language-agnostic) ──────────────────────────────────────
  personal        = portfolioData.personal;
  skillCategories = portfolioData.skillCategories;

  // ── Computed translations ─────────────────────────────────────────────────
  t = computed(() => portfolioData.ui[this.lang()]);

  navLinks = computed(() => this.t().navLinks);

  spokenLanguages = computed(() => {
    const l = this.lang();
    return portfolioData.spokenLanguages.map(sl => ({
      name:    l === 'fr' ? sl.name_fr    : sl.name_en,
      level:   l === 'fr' ? sl.level_fr   : sl.level_en,
      percent: sl.percent,
      flag:    sl.flag,
    }));
  });

  stats = computed(() => {
    const l = this.lang();
    return portfolioData.personal.stats.map(s => ({
      value: s.value,
      label: l === 'fr' ? s.label_fr : s.label_en,
    }));
  });

  experiences = computed(() => {
    const l = this.lang();
    return portfolioData.experiences.map(exp => ({
      role:        l === 'fr' ? exp.role_fr        : exp.role_en,
      company:     exp.company,
      period:      l === 'fr' ? exp.period_fr      : exp.period_en,
      type:        l === 'fr' ? exp.type_fr        : exp.type_en,
      current:     exp.current,
      description: l === 'fr' ? exp.description_fr : exp.description_en,
      tags:        exp.tags,
    }));
  });

  education = computed(() => {
    const l = this.lang();
    return {
      degree:      l === 'fr' ? portfolioData.education.degree_fr      : portfolioData.education.degree_en,
      school:      portfolioData.education.school,
      period:      portfolioData.education.period,
      description: l === 'fr' ? portfolioData.education.description_fr : portfolioData.education.description_en,
    };
  });

  // ── Typing animation internals ────────────────────────────────────────────
  private titleIndex    = 0;
  private charIndex     = 0;
  private isDeleting    = false;
  private typingVersion = 0; // cancellation token

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.isDark.set(savedTheme !== 'light');
      this.applyTheme();

      const savedLang = localStorage.getItem('lang') as 'en' | 'fr' | null;
      this.lang.set(savedLang ?? 'en');

      this.startTyping();
    }
  }

  // ── Theme ─────────────────────────────────────────────────────────────────
  toggleTheme() {
    this.isDark.update(v => !v);
    this.applyTheme();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', this.isDark());
    }
  }

  // ── Language ──────────────────────────────────────────────────────────────
  setLang(l: 'en' | 'fr') {
    if (this.lang() === l) return;
    this.lang.set(l);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', l);
    }
    this.restartTyping();
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  toggleMenu() { this.isMenuOpen.update(v => !v); }

  scrollTo(id: string) {
    this.isMenuOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrolled.set(window.scrollY > 50);
    const sections = ['hero', 'about', 'skills', 'experiences', 'contact'];
    for (const sec of [...sections].reverse()) {
      const el = document.getElementById(sec);
      if (el && window.scrollY >= el.offsetTop - 100) {
        this.activeSection.set(sec);
        break;
      }
    }
  }

  // ── Typing animation ──────────────────────────────────────────────────────
  private startTyping() {
    const version = ++this.typingVersion;
    const tick = () => {
      if (version !== this.typingVersion) return; // stale — cancel
      const taglines = this.t().taglines;
      const current  = taglines[this.titleIndex];
      if (!this.isDeleting) {
        this.typedText.set(current.substring(0, ++this.charIndex));
        if (this.charIndex === current.length) {
          this.isDeleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        this.typedText.set(current.substring(0, --this.charIndex));
        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.titleIndex = (this.titleIndex + 1) % taglines.length;
        }
      }
      setTimeout(tick, this.isDeleting ? 60 : 100);
    };
    tick();
  }

  private restartTyping() {
    this.titleIndex = 0;
    this.charIndex  = 0;
    this.isDeleting = false;
    this.typedText.set('');
    this.startTyping();
  }

  // ── Color helpers (driven by JSON "color" field) ──────────────────────────
  getColorClasses(color: string): string {
    const map: Record<string, string> = {
      cyan:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
      violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30 hover:border-violet-400',
      green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-400',
      orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:border-orange-400',
      pink:   'bg-pink-500/10 text-pink-400 border-pink-500/30 hover:border-pink-400',
      yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:border-yellow-400',
    };
    return map[color] ?? map['cyan'];
  }

  getCategoryBg(color: string): string {
    const map: Record<string, string> = {
      cyan:   'from-cyan-500/5 to-transparent border-cyan-500/20',
      violet: 'from-violet-500/5 to-transparent border-violet-500/20',
      green:  'from-emerald-500/5 to-transparent border-emerald-500/20',
      orange: 'from-orange-500/5 to-transparent border-orange-500/20',
      pink:   'from-pink-500/5 to-transparent border-pink-500/20',
      yellow: 'from-yellow-500/5 to-transparent border-yellow-500/20',
    };
    return map[color] ?? map['cyan'];
  }
}

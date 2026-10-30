import type { ReactNode } from "react";
import styles from "./ui.module.css";

export function Section({ n, title, children }: { n?: number; title: string; children: ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={`model-${n ?? title}`}>
      <header className={styles.sectionHead}>
        {n !== undefined && <p className={styles.eyebrow}>Model {n}</p>}
        <h2 id={`model-${n ?? title}`} className={styles.sectionTitle}>{title}</h2>
      </header>
      {children}
    </section>
  );
}

export const Prose = ({ children }: { children: ReactNode }) => <div className={styles.prose}>{children}</div>;

/** An instrument pinned to the page: wider than the prose, its own sheet of paper. */
export const Wide = ({ children, label }: { children: ReactNode; label?: string }) => (
  <figure className={styles.wide} aria-label={label}>{children}</figure>
);

export const Rule = ({ children }: { children: ReactNode }) => (
  <div className={styles.rule}><p className={styles.ruleLabel}>The rule</p><p className={styles.ruleText}>{children}</p></div>
);

export const Aside = ({ children }: { children: ReactNode }) => <aside className={styles.aside}>{children}</aside>;

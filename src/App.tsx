import styles from "./App.module.css";

export default function App() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>A notebook on <em>Secrets of Sand Hill Road</em></p>
        <h1 className={styles.title}>Return the Fund</h1>
        <p className={styles.dek}>Venture capital from the bare basics, one variable at a time.</p>
      </header>
    </main>
  );
}

import { Hero } from "./models/Hero";
import { M1OneCheque } from "./models/M1OneCheque";
import { M2TenCheques } from "./models/M2TenCheques";
import styles from "./App.module.css";

export default function App() {
  return (
    <main className={styles.page}>
      <Hero />
      <M1OneCheque />
      <M2TenCheques />
    </main>
  );
}

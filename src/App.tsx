import { Hero } from "./models/Hero";
import { M1OneCheque } from "./models/M1OneCheque";
import { M2TenCheques } from "./models/M2TenCheques";
import { M3Napkin } from "./models/M3Napkin";
import { M4Rounds } from "./models/M4Rounds";
import { M5FollowOn } from "./models/M5FollowOn";
import { M6Preferences } from "./models/M6Preferences";
import { M7Price } from "./models/M7Price";
import { Finale } from "./models/Finale";
import { PartTwo } from "./part2/PartTwo";
import { usePart } from "./ui/usePart";
import styles from "./App.module.css";

export default function App() {
  const part = usePart();
  if (part === "two") {
    return (
      <main className={styles.page}>
        <PartTwo />
      </main>
    );
  }
  return (
    <main className={styles.page}>
      <Hero />
      <M1OneCheque />
      <M2TenCheques />
      <M3Napkin />
      <M4Rounds />
      <M5FollowOn />
      <M6Preferences />
      <M7Price />
      <Finale />
    </main>
  );
}

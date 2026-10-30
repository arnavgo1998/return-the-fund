import { useId } from "react";
import styles from "./ui.module.css";

interface Common { label: string; value: number; onChange: (v: number) => void; format: (v: number) => string }
type Range = Common & { min: number; max: number; step: number; stops?: undefined };
type Stops = Common & { stops: number[]; min?: undefined; max?: undefined; step?: undefined };

const nearest = (stops: number[], v: number) =>
  stops.reduce((best, s, i) => (Math.abs(s - v) < Math.abs(stops[best] - v) ? i : best), 0);

/** A labelled range. With `stops`, it moves between named values so round numbers are a keypress away. */
export function Slider(props: Range | Stops) {
  const id = useId();
  const { label, value, onChange, format } = props;
  const stops = props.stops;
  const pos = stops ? nearest(stops, value) : value;
  const max = stops ? stops.length - 1 : props.max;
  return (
    <div className={styles.slider}>
      <div className={styles.sliderHead}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className={styles.sliderValue}>{format(value)}</output>
      </div>
      <input id={id} type="range" className={styles.range}
        min={stops ? 0 : props.min} max={max} step={stops ? 1 : props.step} value={pos}
        aria-valuetext={format(value)}
        onChange={(e) => {
          const p = Number(e.target.value);
          onChange(stops ? stops[p] : p);
        }} />
    </div>
  );
}

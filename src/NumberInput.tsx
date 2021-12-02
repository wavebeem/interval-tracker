interface NumberInputProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function NumberInput({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: NumberInputProps): JSX.Element {
  return (
    <div className="flex">
      <div className="flex-auto">
        {label}: <span className="tabular-nums">{value}</span> {unit}
      </div>
      <button
        className="ml1 bn ph3 pv2 br2 bg-dark-red white b"
        aria-label={`Decrease ${label}`}
        type="button"
        onClick={() => {
          onChange(Math.max(value - 1, min));
        }}
      >
        &minus;
      </button>
      <button
        className="ml1 bn ph3 pv2 br2 bg-dark-green white b"
        aria-label={`Increase ${label}`}
        type="button"
        onClick={() => {
          onChange(Math.min(value + 1, max));
        }}
      >
        +
      </button>
    </div>
  );
}

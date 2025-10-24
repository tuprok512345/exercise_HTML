function NavBar({ onPrev, onNext, onSubmit, isLast, part }) {
  return (
    <div className="navbar">
      <button onClick={onPrev} disabled={!onPrev}>⬅ Prev</button>
      {!isLast ? (
        <button onClick={onNext} disabled={!onNext}>Next ➡</button>
      ) : (
        <button onClick={onSubmit}>
          {part === "Reading" ? "Submit Reading" : "Submit Test"}
        </button>
      )}
    </div>
  );
}

function H1Text({ h2Text, pText }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold text-3xl">{h2Text}</h2>
      <p className="font-medium">
        {pText}
      </p>
    </div>
  );
}

export default H1Text
function H1Text({ h2Text, pText }) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h2 className="font-semibold text-2xl lgss:text-3xl">{h2Text}</h2>
      <p className="font-medium">{pText}</p>
    </div>
  );
}

export default H1Text;
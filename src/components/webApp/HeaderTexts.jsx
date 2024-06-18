function HeaderTexts({ h2, p}) {
  return (
    <div className="flex flex-col gap-2 justify-left items-left">
      <h2 className="text-2xl font-semibold">{h2}</h2>
      <p>{p}</p>
    </div>
  );
}

export default HeaderTexts
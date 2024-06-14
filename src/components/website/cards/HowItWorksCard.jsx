function HowItWorksCard({ step, p, h3 }) {
  return (
    <div className="flex flex-col items-start px-10 py-5">
      <div className="text-blue-600 font-semibold mb-8">{step}</div>
      <h3 className="text-xl font-semibold mb-2">{h3}</h3>
      <p className="text-gray-700">{p}</p>
    </div>
  );
}

export default HowItWorksCard;

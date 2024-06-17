function CustomBtn({ title, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary lgss:px-5 w-full text-white flex justify-center lgss:gap-4 gap-1 items-center py-3 rounded-[4px] font-semibold text-[18px]"
    >
      {Icon && <Icon />}
      <p className="text-[.9rem]">{title}</p>
    </button>
  );
}

export default CustomBtn;

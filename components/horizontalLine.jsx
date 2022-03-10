const HL = ({ widths, height = 1, color = "bg-gray-800" }) => {
  return (
    <div className="flex flex-row gap-1 my-2">
      <span className={`${color} w-4 h-${height} rounded-tl-md`} />
      {widths.map((item, id) => (
        <span key={id} className={`${color} w-${item} h-${height}`} />
      ))}
      <span className={`${color} w-4 h-${height} rounded-br-md`} />
    </div>
  );
};

export default HL;

import { CiCircleInfo } from "react-icons/ci";

function HomeCard({title, value, img }) {
  return (
    <div className="bg-white shadow-sm border-[1px] rounded-[8px] h-[150px] w-full lgss:w-[32%] flex justify-between items-center px-6">
      <div className="flex flex-col gap-6">
        <h3 className="flex gap-3 justify-center items-center text-secondary">
          {title}
          <CiCircleInfo />
        </h3>
        <h1 className="text-left text-[26px] font-bold">{value}</h1>
      </div>
      <div className="bg-[#F6F6F6] h-14 w-14 rounded-full flex justify-center items-center">
        {img && <img src={img} alt="Card image" className="h-8 w-8" />}
      </div>
    </div>
  );
}

export default HomeCard
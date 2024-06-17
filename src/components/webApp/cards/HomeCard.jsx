import { CiCircleInfo } from "react-icons/ci";
import { HiMiniQueueList } from "react-icons/hi2";

function HomeCard({ title, value, className }) {
  return (
    <div className="bg-white shadow-custom-xl rounded-[12px] h-[150px] w-full lgss:w-[22%] flex gap-5 items-center px-6 text-dark">
      <div className="">
        <HiMiniQueueList className={`text-5xl ${className}`} />
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-xl">
          {title}
        </h3>
        <h1 className="text-left text-lg font-bold">{value}</h1>
      </div>
    </div>
  );
}

export default HomeCard
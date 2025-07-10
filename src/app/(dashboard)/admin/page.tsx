import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  // استفاده از async server components
  const [adminCard, teacherCard, studentCard, parentCard] = await Promise.all([
    UserCard({ type: "admin" }),
    UserCard({ type: "teacher" }),
    UserCard({ type: "student" }),
    UserCard({ type: "parent" }),
  ]);

  const [countChart, attendanceChart] = await Promise.all([
    CountChartContainer(),
    AttendanceChartContainer(),
  ]);

  const eventCalendar = await EventCalendarContainer({ searchParams });
  const announcements = await Announcements();

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          {adminCard}
          {teacherCard}
          {studentCard}
          {parentCard}
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">{countChart}</div>

          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">{attendanceChart}</div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart /> {/* Client Component */}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {eventCalendar}
        {announcements}
      </div>
    </div>
  );
};

export default AdminPage;

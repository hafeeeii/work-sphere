import React from "react";
import TotalNumbersCard from "./TotalNumbersCard";
import CountChart from "./CountChart";
import { LeaveChart } from "./LeaveChart";
import FinanceChart from "./FinanceChart";
import { RightSideCalender } from "./RightSideCalender";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const topSectionData = [
  { date: "2024-12-01", total: 15, title: "Managers" },
  { date: "2024-12-10", total: 120, title: "Employees" },
  { date: "2024-12-15", total: 8, title: "Teams" },
  { date: "2024-12-17", total: 200, title: "Tasks" },
];

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex gap-8">
      <div className="min-w-[70%] h-full space-y-10">
        {/* left side */}
        <div className="flex  gap-4 h-[20%] w-full">
          {/* left-top */}
          {topSectionData.map((val) => (
            <React.Fragment key={val.title}>
              <TotalNumbersCard
                date={val.date}
                title={val.title}
                total={val.total}
              />
            </React.Fragment>
          ))}
        </div>

        {/* left-middle */}
        <div className="w-full h-[50%] flex gap-4 items-end">
          <div className="w-[35%] h-full">
            <CountChart />
          </div>
          <div className="w-[65%] h-full flex items-end">
            <LeaveChart />
          </div>
        </div>

        {/* left-bottom */}
        <div className="w-full h-[30%]">
          <FinanceChart />
        </div>
      </div>
      {/* right side */}
      <div className="space-y-4 w-full flex flex-col">
        {/* right-top */}
          <RightSideCalender />
        {/* right-middle */}
        <div className="space-y-2">
          <h4 className="font-semibold">Events</h4>
         {[1,2,3].map((val,idx) => (
           <Card key={idx}>
           <CardHeader>
             <h5 className="font-medium">Lorem, ipsum dolor.</h5>
             <p className="text-xs text-primary/80">12:00 PM - 2:00 PM</p>
           </CardHeader>
           <CardContent>
             <p className="text-xs">
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae,
               distinctio!
             </p>
           </CardContent>
         </Card>
         ))}
        </div>
        {/* right-bottom */}
        <div className="space-y-2">
          <h4 className="font-semibold">Announcements</h4>
         {[1,2,3].map((val,idx) => (
           <Card key={idx}>
           <CardHeader>
             <h5 className="font-medium">Lorem, ipsum dolor.</h5>
             <p className="text-xs text-primary/80">12:00 PM - 2:00 PM</p>
           </CardHeader>
           <CardContent>
             <p className="text-xs">
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae,
               distinctio!
             </p>
           </CardContent>
         </Card>
         ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const leaveTypes = [
  {
    name: "Casual Leave",
    available: 5,
    booked: 2,
    icon: "\u2600\uFE0F",
    color: "bg-blue-100 text-blue-500",
  },
  {
    name: "Earned Leave",
    available: 7,
    booked: 0,
    icon: "\u23F1",
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Leave Without Pay",
    available: null,
    booked: 2,
    icon: "\uD83C\uDF3E",
    color: "bg-red-100 text-red-500",
  },
  {
    name: "Sabbatical Leave",
    available: 0,
    booked: 0,
    icon: "\u21BA",
    color: "bg-yellow-100 text-yellow-500",
  },
  {
    name: "Sick Leave",
    available: 7,
    booked: 0,
    icon: "\uD83D\uDC8A",
    color: "bg-purple-100 text-purple-500",
  },
  {
    name: "Trip leave",
    available: 0,
    booked: 0,
    icon: "\u2600\uFE0F",
    color: "bg-sky-100 text-sky-400",
  },
];

export default function LeaveBalanceTab() {
  return (
    <div className="p-6 space-y-4">
      {leaveTypes.map((type) => (
        <Card key={type.name} className="shadow-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", type.color)}>
                <span className="text-xl">{type.icon}</span>
              </div>
              <div>
                <div className="font-medium text-sm text-gray-700">{type.name}</div>
              </div>
            </div>
            <div className="text-sm text-right space-y-1">
              {type.available !== null && (
                <div>
                  <span className="text-muted-foreground">Available </span>
                  <span className="text-green-600 font-semibold">{type.available} {type.available === 1 ? 'day' : 'days'}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Booked </span>
                <span className="text-red-600 font-semibold">{type.booked} {type.booked === 1 ? 'day' : 'days'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

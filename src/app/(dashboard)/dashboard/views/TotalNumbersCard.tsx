import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type Props = {
  date: string;
  total: number;
  title: string;
};

const TotalNumbersCard = (props: Props) => {
  const { date, total, title } = props;
  return (
    <Card className="w-full h-full flex items-center">
      <CardContent className="space-y-4 pl-4 py-2">
        <div>
          <Badge>{date}</Badge>
        </div>
        <div className="font-bold text-4xl">
          <p>{total}</p>
        </div>
        <div className="text-primary/70">{title}</div>
      </CardContent>
    </Card>
  );
};

export default TotalNumbersCard;

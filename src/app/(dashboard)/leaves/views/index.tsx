import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import MyDataTab from "./tabs/my-data"
import OrganizationTab from "./tabs/organization"



 const Leaves = async ({searchParams}:{searchParams:{[key:string]:string}}) => {




const tabs = [
  {tab:'My Data', content: <MyDataTab searchParams={searchParams}/>},
  {tab:'Organization', content: <OrganizationTab/>},
  {tab:'Holidays', content: ''},
]

  return (
    <div className="flex flex-col gap-4">
        <Tabs defaultValue={tabs[0].tab} >
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.tab} value={tab.tab}>
            {tab.tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.tab} value={tab.tab}>
          <Card>
            <CardContent className="py-2 ">
          {tab.content}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
    </div>
  )
}

export default Leaves
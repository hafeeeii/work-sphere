import {
  Home,
  Users,
  Briefcase,
  Building2,
  GraduationCap,
  Star,
  ListChecks,
  Timer,
  CalendarDays,
  Newspaper,
  Settings,
  LogOut,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home, 
  },
  {
    title: "Managers",
    url: "/managers",
    icon: Users, 
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Briefcase,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Building2, 
  },
  {
    title: "Training Programs",
    url: "/training-programs",
    icon: GraduationCap, 
  },
  {
    title: "Performance Reviews",
    url: "/performance-reviews",
    icon: Star, 
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ListChecks, 
  },
  {
    title: "Time Tracking",
    url: "/time-tracking",
    icon: Timer,
  },
  {
    title: "Meetings/Company Events",
    url: "/meetings-events",
    icon: CalendarDays, 
  },
  {
    title: "News/Updates",
    url: "/news-updates",
    icon: Newspaper, 
  },

];

const others = [
  {
    title: "Profile",
    url: "/profile",
    icon: User2, 
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings, 
  },
  {
    title: "Logout",
    url: "/logut",
    icon: LogOut, 
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-3 pl-2">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>OTHERS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {others.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-3 pl-2">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

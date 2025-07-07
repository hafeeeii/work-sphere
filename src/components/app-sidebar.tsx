'use client'
import {
  Home,
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import { getDefaultSortById } from "@/lib/sort-utils";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home, 
  },
  {
    title: "Employees",
    url: `/employee?${getDefaultSortById('name')}`,
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
    url: "/login",
    icon: LogOut, 
  },
]

export function AppSidebar() {
  const path = usePathname()

  const handleLogout = () => {
    logout()
  }
  return (
    <Sidebar>
      <SidebarContent className="bg-background" >
        <SidebarGroup>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}  className="mt-3 pl-2 bg">
                  <SidebarMenuButton asChild isActive={path === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                  <SidebarMenuButton asChild isActive={path === item.url} {...(item.url === '/login' ? {onClick: handleLogout} : {})}>
                    <Link  href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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

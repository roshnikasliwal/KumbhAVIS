'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShieldCheck,
  Map,
  Users,
  Video,
  MessageCircle,
  Settings,
  Bot,
  FileSearch,
  Send,
  HeartPulse,
  ClipboardPen
} from 'lucide-react';

const KumbhMelaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-primary"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);


export function MainNav() {
  const pathname = usePathname();
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <KumbhMelaIcon />
          <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
            KumbhAVIS Agent
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'}>
              <Link href="/">
                <LayoutDashboard />
                <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/safety-hub'}>
              <Link href="/safety-hub">
                <ShieldCheck />
                <span className="group-data-[collapsible=icon]:hidden">Safety Hub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/crowd-analytics'}>
              <Link href="/crowd-analytics">
                <Users />
                <span className="group-data-[collapsible=icon]:hidden">Crowd Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/live-map'}>
              <Link href="/live-map">
                <Map />
                <span className="group-data-[collapsible=icon]:hidden">Live Map</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="mt-4">
           <SidebarMenuItem>
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">AI Tools</p>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/video-insights'}>
              <Link href="/video-insights">
                <Video />
                <span className="group-data-[collapsible=icon]:hidden">Video Insights</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/social-sentiment'}>
              <Link href="/social-sentiment">
                <MessageCircle />
                <span className="group-data-[collapsible=icon]:hidden">Social Sentiment</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/lost-and-found'}>
              <Link href="/lost-and-found">
                <FileSearch />
                <span className="group-data-[collapsible=icon]:hidden">Lost &amp; Found</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/drone-dispatch'}>
              <Link href="/drone-dispatch">
                <Send />
                <span className="group-data-[collapsible=icon]:hidden">Drone Dispatch</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/responder-dispatch'}>
              <Link href="/responder-dispatch">
                <HeartPulse />
                <span className="group-data-[collapsible=icon]:hidden">Responder Dispatch</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/situational-summary'}>
              <Link href="/situational-summary">
                <ClipboardPen />
                <span className="group-data-[collapsible=icon]:hidden">Situational Summary</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/settings'}>
              <Link href="/settings">
                <Settings />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

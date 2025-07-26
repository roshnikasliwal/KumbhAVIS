import * as React from 'react';
import type { Role } from '@/lib/types';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { RoleSwitcher } from './role-switcher';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppHeaderProps {
  role: Role;
  setRole: (role: Role) => void;
}

export function AppHeader({ role, setRole }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-0">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1">
        <h1 className="font-headline text-xl font-semibold sm:text-2xl">
          KumbhAVIS Agent
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time Crowd Monitoring & Safety Analysis
        </p>
      </div>
      <div className="flex items-center gap-4">
        <RoleSwitcher role={role} setRole={setRole} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <Avatar>
                <AvatarImage src="https://placehold.co/32x32.png" alt="User avatar" data-ai-hint="user avatar" />
                <AvatarFallback>KV</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

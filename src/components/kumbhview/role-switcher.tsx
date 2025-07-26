'use client';
import * as React from 'react';
import type { Role } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RoleSwitcherProps {
  role: Role;
  setRole: (role: Role) => void;
}

export function RoleSwitcher({ role, setRole }: RoleSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="role-switcher" className="text-sm font-medium hidden sm:block">
        Role:
      </Label>
      <Select value={role} onValueChange={(value) => setRole(value as Role)}>
        <SelectTrigger
          id="role-switcher"
          className="w-[150px] bg-background"
        >
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Administrator">Administrator</SelectItem>
          <SelectItem value="Responder">Responder</SelectItem>
          <SelectItem value="Viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

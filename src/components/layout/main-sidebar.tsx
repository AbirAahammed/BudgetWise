'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRightLeft,
  LayoutDashboard,
  PiggyBank,
  Wallet,
} from 'lucide-react';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/transactions',
    label: 'Transactions',
    icon: ArrowRightLeft,
  },
  {
    href: '/budgets',
    label: 'Budgets',
    icon: PiggyBank,
  },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Wallet className="size-8 text-primary" />
          <h1 className="text-xl font-semibold">BudgetWise</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BudgetWise
        </p>
      </SidebarFooter>
    </>
  );
}
